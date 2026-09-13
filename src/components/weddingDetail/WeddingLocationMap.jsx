"use client";

import { useEffect, useRef, useState } from 'react';
import { MapPin } from '@/components/Icons';
import { loadGoogleMapsCoreLibrary, loadGoogleMarkerLibrary } from '@/lib/googleMaps';
import { toCoordinate } from './weddingDetailUtils';

export default function WeddingLocationMap({ address = '', latitude, longitude, title }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const infoWindowRef = useRef(null);
  const [mapError, setMapError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const lat = toCoordinate(latitude);
  const lng = toCoordinate(longitude);
  const hasCoordinates = lat !== null && lng !== null;

  useEffect(() => {
    if (!hasCoordinates) return undefined;
    let isActive = true;
    const venueTitle = title || 'Wedding venue';
    const infoContent = `<div style="font:13px/1.4 inherit;max-width:220px;"><strong>${venueTitle}</strong>${address ? `<br/>${address}` : ''}</div>`;

    const showMap = async () => {
      try {
        await Promise.all([loadGoogleMapsCoreLibrary(), loadGoogleMarkerLibrary()]);
        if (!isActive || !mapContainerRef.current) return;

        const google = window.google;
        const position = { lat, lng };
        if (!mapRef.current) {
          mapRef.current = new google.maps.Map(mapContainerRef.current, {
            center: position,
            zoom: 15,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            clickableIcons: false,
          });
          markerRef.current = new google.maps.Marker({ map: mapRef.current, position, title: venueTitle });
          infoWindowRef.current = new google.maps.InfoWindow({ content: infoContent });
          infoWindowRef.current.open({ map: mapRef.current, anchor: markerRef.current });
          markerRef.current.addListener('click', () => infoWindowRef.current?.open({ map: mapRef.current, anchor: markerRef.current }));
        } else {
          markerRef.current?.setPosition(position);
          markerRef.current?.setTitle(venueTitle);
          infoWindowRef.current?.setContent(infoContent);
          infoWindowRef.current?.open({ map: mapRef.current, anchor: markerRef.current });
          mapRef.current.panTo(position);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load the public wedding location map:', error);
        if (isActive) {
          setMapError('Location map is currently unavailable.');
          setIsLoading(false);
        }
      }
    };

    void showMap();
    return () => {
      isActive = false;
    };
  }, [hasCoordinates, lat, lng, title, address]);

  useEffect(() => () => {
    markerRef.current?.setMap(null);
    markerRef.current = null;
    mapRef.current = null;
    infoWindowRef.current = null;
  }, []);

  if (!hasCoordinates) {
    return (
      <div className="flex h-64 items-center justify-center border border-dashed border-gold-300 bg-cream-50 px-5 text-center text-sm text-ink-soft">
        Location map is currently unavailable.
      </div>
    );
  }

  return (
    <div className="relative h-64 overflow-hidden border border-gold-200 bg-cream-50 sm:h-72">
      <div ref={mapContainerRef} className="h-full w-full" />
      {isLoading && !mapError && <div className="absolute inset-0 flex items-center justify-center bg-cream-50"><div className="text-center text-xs font-medium text-ink-soft"><div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-wine-600" /> <p className="mt-3">Loading map...</p></div></div>}
      {mapError && <div className="absolute inset-0 flex items-center justify-center bg-cream-50 px-5 text-center text-sm text-ink-soft"><MapPin className="mr-2 h-5 w-5 text-wine-500" />{mapError}</div>}
    </div>
  );
}