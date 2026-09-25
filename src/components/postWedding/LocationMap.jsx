"use client";

import { useEffect, useRef, useState } from 'react';
import { MapPin, RefreshCw } from '@/components/Icons';
import { loadGoogleGeocodingLibrary, loadGoogleMapsCoreLibrary, loadGoogleMarkerLibrary } from '@/lib/googleMaps';

// Center of India, used until an address is geocoded or a marker is placed.
const FALLBACK_CENTER = { lat: 20.5937, lng: 78.9629 };
const FALLBACK_ZOOM = 5;
const PIN_ZOOM = 15;
const GEOCODE_DEBOUNCE_MS = 700;
const MIN_ADDRESS_LENGTH = 6;

function getValidCoordinates(latitude, longitude) {
  const parseCoordinate = (value) => {
    if (typeof value === 'number') return Number.isFinite(value) ? value : null;
    if (typeof value !== 'string' || !value.trim()) return null;

    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : null;
  };

  const parsedLatitude = parseCoordinate(latitude);
  const parsedLongitude = parseCoordinate(longitude);

  if (parsedLatitude === null || parsedLongitude === null || parsedLatitude < -90 || parsedLatitude > 90 || parsedLongitude < -180 || parsedLongitude > 180) {
    return null;
  }

  return { lat: parsedLatitude, lng: parsedLongitude };
}

/**
 * Reusable, frontend-only map with a draggable marker. Not tied to any
 * particular wedding day - callers pass the address to geocode, any known
 * coordinates, and a callback to receive marker moves/geocode results.
 */
export default function LocationMap({ address = '', latitude = null, longitude = null, onLocationChange, className = '' }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const addressRef = useRef(address);
  const onLocationChangeRef = useRef(onLocationChange);
  // Tracks the address the marker's current position is based on, so an
  // unrelated re-render (or the user's own drag) never gets overwritten.
  const lastGeocodedAddressRef = useRef(null);

  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState('');
  const [retryToken, setRetryToken] = useState(0);

  useEffect(() => {
    addressRef.current = address;
  }, [address]);

  useEffect(() => {
    onLocationChangeRef.current = onLocationChange;
  }, [onLocationChange]);

  const geocodeAddress = async (addressToGeocode) => {
    lastGeocodedAddressRef.current = addressToGeocode;
    setIsGeocoding(true);
    setGeocodeError('');

    try {
      const geocodingLibrary = await loadGoogleGeocodingLibrary();
      const geocoder = new geocodingLibrary.Geocoder();
      const { results } = await geocoder.geocode({ address: addressToGeocode, region: 'in' });
      const location = results?.[0]?.geometry?.location;

      if (!location) throw new Error('No results found for this address.');

      const nextLatitude = location.lat();
      const nextLongitude = location.lng();

      if (markerRef.current && mapRef.current) {
        const position = { lat: nextLatitude, lng: nextLongitude };
        markerRef.current.setPosition(position);
        mapRef.current.setCenter(position);
        mapRef.current.setZoom(PIN_ZOOM);
      }

      onLocationChangeRef.current?.({ latitude: nextLatitude, longitude: nextLongitude });
    } catch (error) {
      console.error('Failed to geocode wedding day address:', error);
      setGeocodeError('Could not locate this address on the map. You can drag the pin manually.');
    } finally {
      setIsGeocoding(false);
    }
  };

  // Initializes the map and marker once per mount; never recreated on prop changes.
  useEffect(() => {
    let cancelled = false;
    setStatus('loading');

    const initializeMap = async () => {
      try {
        await Promise.all([loadGoogleMapsCoreLibrary(), loadGoogleMarkerLibrary()]);
        if (cancelled || !mapContainerRef.current) return;

        const google = window.google;
        const savedPosition = getValidCoordinates(latitude, longitude);
        const initialPosition = savedPosition || FALLBACK_CENTER;

        const map = new google.maps.Map(mapContainerRef.current, {
          center: initialPosition,
          zoom: savedPosition ? PIN_ZOOM : FALLBACK_ZOOM,
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true,
          clickableIcons: false,
        });

        const marker = new google.maps.Marker({
          position: initialPosition,
          map,
          draggable: true,
        });

        marker.addListener('dragend', () => {
          const position = marker.getPosition();
          if (!position) return;

          // The pin now defines the location; don't let a stale geocode overwrite it.
          lastGeocodedAddressRef.current = addressRef.current;
          setGeocodeError('');
          onLocationChangeRef.current?.({ latitude: position.lat(), longitude: position.lng() });
        });

        mapRef.current = map;
        markerRef.current = marker;
        setStatus('ready');

        if (savedPosition) {
          lastGeocodedAddressRef.current = addressRef.current;
        } else if (addressRef.current.trim().length >= MIN_ADDRESS_LENGTH) {
          void geocodeAddress(addressRef.current);
        }
      } catch (error) {
        console.error('Failed to load Google Maps:', error);
        if (!cancelled) setStatus('error');
      }
    };

    void initializeMap();

    return () => {
      cancelled = true;
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retryToken]);

  // Keeps the marker in sync with externally supplied coordinates (e.g. switching days).
  useEffect(() => {
    if (status !== 'ready' || !markerRef.current || !mapRef.current) return;
    const savedPosition = getValidCoordinates(latitude, longitude);
    if (!savedPosition) return;

    const current = markerRef.current.getPosition();
    const isAlreadyThere = current && Math.abs(current.lat() - savedPosition.lat) < 1e-9 && Math.abs(current.lng() - savedPosition.lng) < 1e-9;
    if (isAlreadyThere) return;

    markerRef.current.setPosition(savedPosition);
    mapRef.current.setCenter(savedPosition);
  }, [latitude, longitude, status]);

  // Debounced re-geocode whenever the combined address meaningfully changes.
  useEffect(() => {
    if (status !== 'ready') return;
    if (!address || address.trim().length < MIN_ADDRESS_LENGTH) return;
    if (address === lastGeocodedAddressRef.current) return;

    const timeoutId = setTimeout(() => void geocodeAddress(address), GEOCODE_DEBOUNCE_MS);
    return () => clearTimeout(timeoutId);
     
  }, [address, status]);

  const retry = () => setRetryToken((token) => token + 1);

  return (
    <div className={className}>
      <div className="relative h-64 w-full overflow-hidden rounded-lg border border-gold-200 bg-cream-50 shadow-sm sm:h-72">
        <div ref={mapContainerRef} className="h-full w-full" />

        {status !== 'ready' && (
          <div className="absolute inset-0 flex items-center justify-center bg-cream-50">
            {status === 'loading' ? (
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-wine-600" />
                <p className="mt-3 text-xs font-medium text-ink-soft">Loading map...</p>
              </div>
            ) : (
              <div className="px-4 text-center">
                <p className="text-xs font-medium text-red-700">Unable to load the map right now.</p>
                <button
                  type="button"
                  onClick={retry}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-wine-500 bg-white px-3 py-1.5 text-xs font-semibold text-wine-600 transition-colors hover:bg-cream-50"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Try again
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <p className="mt-1.5 flex items-center gap-1.5 text-xs text-ink-soft">
        <MapPin className="h-3.5 w-3.5 shrink-0 text-wine-500" />
        {geocodeError || (isGeocoding ? 'Locating the address on the map...' : 'Drag the pin to the exact venue location.')}
      </p>
    </div>
  );
}
