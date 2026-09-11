'use client';
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Calendar,
  ChevronDown,
  MapPin,
  RefreshCw,
  Rings,
  Search,
  Shield,
  Ticket,
  Wallet,
} from '@/components/Icons'
import { Mandala } from './Ornaments'
import ErrorMessage from '@/components/common/ErrorMessage'
import { loadGoogleGeocodingLibrary, loadGooglePlacesLibrary } from '@/lib/googleMaps'

const INDIA_REGION_CODE = 'in'
const LOCATION_PLACEHOLDER = 'Search by city, venue...'

// PlaceAutocompleteElement nests its real <input> inside one or more shadow
// roots; walk them (as long as they're open) to find it regardless of depth.
const findShadowInput = (root) => {
  if (!root) return null

  const direct = root.querySelector('input')
  if (direct) return direct

  for (const child of root.querySelectorAll('*')) {
    if (child.shadowRoot) {
      const nested = findShadowInput(child.shadowRoot)
      if (nested) return nested
    }
  }

  return null
}

// Reflects text into the widget's own visible input, not just React state.
const fillAutocompleteDisplay = (element, text) => {
  if (!element) return

  try {
    element.value = text
  } catch {
    // `value` isn't a writable property on this element; ignore.
  }

  const innerInput = findShadowInput(element.shadowRoot)
  if (innerInput) {
    innerInput.value = text
    innerInput.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
  }
}

const foodObservanceOptions = [
  'All Food Observances',
  'Vegetarian',
  'Non-Vegetarian',
  'Veg & Non-Veg',
  'Jain',
  'Other',
]

const badges = [
  { Icon: Rings, title: 'Real Weddings', sub: 'Verified Hosts' },
  { Icon: Shield, title: 'Safe & Secure', sub: '100% Secure Payments' },
  { Icon: Wallet, title: 'Transparent Pricing', sub: 'No Hidden Charges' },
  { Icon: Ticket, title: 'Instant Confirmation', sub: 'Get Invited Quickly' },
]

const Field = ({ label, children }) => (
  <label className="block">
    <span className="mb-1 block text-[12px] font-medium text-ink">{label}</span>
    {children}
  </label>
)

const shellClasses =
  'flex h-[42px] w-full items-center rounded-md border border-cream-300 bg-cream-50/60  text-[12.5px] text-ink transition-colors focus-within:border-gold-400 focus-within:bg-white'

export default function SearchPanel({ className = 'relative z-20 -mt-12' }) {
  const router = useRouter()
  const [query, setQuery] = useState({
    where: '',
    date: '',
    food_observance: foodObservanceOptions[0],
    latitude: null,
    longitude: null,
  })
  const [locationError, setLocationError] = useState('')
  const [placesReady, setPlacesReady] = useState(false)

  const autocompleteContainerRef = useRef(null)
  const autocompleteElementRef = useRef(null)
  const dateInputRef = useRef(null)
  
  // Suppresses the "stale coordinates" clearing logic for the synthetic
  // input event that follows a valid gmp-select (or a programmatic fill).
  const justSelectedRef = useRef(false)

  const getTodayDate = () => {
  const today = new Date()

  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const todayDate = getTodayDate()

const openDatePicker = () => {
  const input = dateInputRef.current

  if (!input) return

  if (typeof input.showPicker === 'function') {
    input.showPicker()
  }
}

  useEffect(() => {
    let cancelled = false

    const handlePlaceSelect = async ({ placePrediction }) => {
      if (!placePrediction) return

      try {
        const place = placePrediction.toPlace()
        await place.fetchFields({
          fields: ['displayName', 'formattedAddress', 'location', 'addressComponents'],
        })

        const countryComponent = place.addressComponents?.find((component) =>
          component.types?.includes('country'),
        )

        if (countryComponent?.shortText !== 'IN') {
          setLocationError('Please select a location in India.')
          return
        }

        justSelectedRef.current = true
        setLocationError('')
        setQuery((prev) => ({
          ...prev,
          where: place.formattedAddress || place.displayName || prev.where,
          latitude: place.location?.lat() ?? null,
          longitude: place.location?.lng() ?? null,
        }))
      } catch (error) {
        console.error('Failed to resolve the selected place:', error)
        setLocationError('Unable to load details for the selected location. Please try again.')
      }
    }

    // Any further edit after a place was selected invalidates its lat/lng,
    // so stale coordinates never get attached to different location text.
    const handleAutocompleteInput = (event) => {
      if (justSelectedRef.current) {
        justSelectedRef.current = false
        return
      }

      const path = typeof event.composedPath === 'function' ? event.composedPath() : []
      const innerInput = path.find((node) => node instanceof HTMLInputElement)

      setLocationError('')
      setQuery((prev) => ({
        ...prev,
        ...(innerInput ? { where: innerInput.value } : null),
        latitude: null,
        longitude: null,
      }))
    }

    loadGooglePlacesLibrary()
      .then(({ PlaceAutocompleteElement }) => {
        if (cancelled || !autocompleteContainerRef.current) return

        const element = new PlaceAutocompleteElement({
          includedRegionCodes: [INDIA_REGION_CODE],
        })
        element.placeholder = LOCATION_PLACEHOLDER
        element.classList.add('w-full', 'bg-transparent', 'text-[12.5px]', 'text-ink')
        element.style.width = '100%'

        element.addEventListener('gmp-select', handlePlaceSelect)
        element.addEventListener('input', handleAutocompleteInput)

        autocompleteContainerRef.current.appendChild(element)
        autocompleteElementRef.current = element
        setPlacesReady(true)
      })
      .catch((error) => {
        // Falls back to the plain text input (see render below); location
        // search simply won't have Google-backed autocomplete/validation.
        console.error('Failed to load Google Places Autocomplete:', error)
      })

    return () => {
      cancelled = true
      const element = autocompleteElementRef.current
      if (element) {
        element.removeEventListener('gmp-select', handlePlaceSelect)
        element.removeEventListener('input', handleAutocompleteInput)
        element.remove()
        autocompleteElementRef.current = null
      }
    }
  }, [])

  const update = (key) => (e) =>
    setQuery((prev) => ({ ...prev, [key]: e.target.value }))

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.')
      return
    }

    setLocationError('')

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        try {
          const maps = await loadGoogleGeocodingLibrary()
          const geocoder = new maps.Geocoder()
          const { results } = await geocoder.geocode({ location: { lat: latitude, lng: longitude } })
          const result = results?.[0]
          const countryComponent = result?.address_components?.find((component) =>
            component.types?.includes('country'),
          )

          if (!result || countryComponent?.short_name !== 'IN') {
            setLocationError('Current location is outside India. Please select a location in India.')
            return
          }

          justSelectedRef.current = true
          setLocationError('')
          setQuery((prev) => ({
            ...prev,
            where: result.formatted_address,
            latitude,
            longitude,
          }))

          fillAutocompleteDisplay(autocompleteElementRef.current, result.formatted_address)
        } catch (error) {
          console.error('Reverse geocoding failed:', error)
          setLocationError('Unable to resolve your current location. Please try again.')
        }
      },
      () => {
        setLocationError('Unable to access your location. Please allow location access or search manually.')
      },
    )
  }

  const onSubmit = (e) => {
    e.preventDefault()

    const params = new URLSearchParams()
    if (query.where) params.set('where', query.where)
    if (query.date) params.set('date', query.date)
    if (query.food_observance && query.food_observance !== foodObservanceOptions[0]) {
      params.set('food_observance', query.food_observance)
    }
    if (query.latitude != null) params.set('latitude', query.latitude)
    if (query.longitude != null) params.set('longitude', query.longitude)

    const queryString = params.toString()
    router.push(queryString ? `/weddings?${queryString}` : '/weddings')
  }

  return (
    <section className={className}>
      <div className="shell">
        <form
          onSubmit={onSubmit}
          className="rounded-xl border border-cream-300 bg-white p-4 shadow-[0_18px_45px_-20px_rgba(108,10,34,0.35)] sm:p-5"
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2.5 font-display text-[17px] font-bold text-wine-700">
              <Mandala className="h-[22px] w-[22px] text-gold-500" petals={8} />
              Find Your Perfect Wedding
            </h2>

            <Link
              href="/weddings"
              className="flex items-center gap-2 text-[12.5px] font-medium text-ink-soft transition-colors hover:text-wine-700"
            >
              View All Weddings
              <RefreshCw className="h-[18px] w-[18px] text-gold-500" />
            </Link>
          </div>

          <div className="grid gap-3.5 lg:grid-cols-[1.45fr_0.8fr_1fr_auto]">
            <div>
              <Field label="Search location">
                <span className={`${shellClasses} gap-0 pr-3.5 ${placesReady ? 'pr-3.5' : 'px-3.5'}`}>
                  {/* <Search className="h-[18px] w-[18px] shrink-0 text-wine-600" /> */}
                  <input
                    type="text"
                    value={query.where}
                    onChange={update('where')}
                    placeholder={LOCATION_PLACEHOLDER}
                    aria-label="Search by city, venue..."
                    className={`h-[42px] w-full bg-transparent placeholder:text-ink-soft/60 focus:outline-none ${placesReady ? 'hidden' : ''}`}
                  />
                  {/* Google's PlaceAutocompleteElement is mounted into this node once loaded (see effect below). */}
                  <div
                    ref={autocompleteContainerRef}
                    className={`w-full [&>*]:w-full ${placesReady ? '' : 'hidden'}`}
                  />
                  <button
                    type="button"
                    onClick={useCurrentLocation}
                    title="Use current location"
                    aria-label="Use current location"
                    className="grid h-7 w-7 shrink-0 place-items-center border-l border-cream-200 pl-2 text-wine-600 transition-colors hover:text-wine-700"
                  >
                    <MapPin className="h-[18px] w-[18px]" />
                  </button>
                </span>
              </Field>
              {locationError && (
                <ErrorMessage
                  message={locationError}
                  onClose={() => setLocationError('')}
                  className="mt-2 text-[12px]"
                />
              )}
            </div>

            <Field label="Starting date">
              <span className={`${shellClasses} relative gap-2.5 px-3.5`} >
                <Calendar className="pointer-events-none h-[18px] w-[18px] shrink-0 text-wine-600" />
                <input
                  ref={dateInputRef}
                  type="date"
                  value={query.date}
                  onChange={update('date')}
                  min={todayDate}
                  aria-label="Starting date"
                  onClick={openDatePicker}
                  className="w-full min-w-0 cursor-pointer bg-transparent text-ink focus:outline-none"

                />
                <Calendar className="pointer-events-none h-[18px] w-[18px] shrink-0 text-wine-600" />
              </span>
            </Field>

            <Field label="Food observance">
              <span className={`${shellClasses} relative gap-2.5 px-3.5`}>
                <select
                  value={query.food_observance}
                  onChange={update('food_observance')}
                  aria-label="Food observance"
                  className="w-full appearance-none bg-transparent pr-6 focus:outline-none "
                >
                  {foodObservanceOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-ink-soft" />
              </span>
            </Field>

            <div className="flex items-end">
              <button
                type="submit"
                className="flex h-[42px] w-full items-center justify-center gap-2 rounded-md bg-wine-700 px-6 text-[13px] font-medium text-cream-50 transition-colors hover:bg-wine-600 lg:w-auto"
              >
                Search Weddings
                <Search className="h-[16px] w-[16px]" />
              </button>
            </div>
          </div>

          <ul className="mt-4 grid gap-3.5 border-t border-cream-200 pt-4 sm:grid-cols-2 lg:grid-cols-4">
            {badges.map(({ Icon, title, sub }) => (
              <li key={title} className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-cream-100 text-gold-600">
                  <Icon className="h-[17px] w-[17px]" />
                </span>
                <span className="leading-tight">
                  <span className="block text-[12px] font-semibold text-wine-700">
                    {title}
                  </span>
                  <span className="block text-[11px] text-ink-soft">{sub}</span>
                </span>
              </li>
            ))}
          </ul>
        </form>
      </div>
    </section>
  )
}
