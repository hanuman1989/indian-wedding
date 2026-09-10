'use client';
import { useState } from 'react'
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
  'flex h-[42px] w-full items-center gap-2 rounded-md border border-cream-300 bg-cream-50/60 px-3 text-[12.5px] text-ink transition-colors focus-within:border-gold-400 focus-within:bg-white'

export default function SearchPanel() {
  const [query, setQuery] = useState({
    where: '',
    date: '',
    food_observance: foodObservanceOptions[0],
  })

  const update = (key) => (e) =>
    setQuery((prev) => ({ ...prev, [key]: e.target.value }))

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setQuery((prev) => ({ ...prev, where: 'Current location' }))
      return
    }

    navigator.geolocation.getCurrentPosition(
      () => setQuery((prev) => ({ ...prev, where: 'Current location' })),
      () => setQuery((prev) => ({ ...prev, where: 'Current location' })),
    )
  }

  const onSubmit = (e) => {
    e.preventDefault()
    // Wire this to your search endpoint / router.
    console.log('Search weddings:', query)
  }

  return (
    <section className="relative z-20 -mt-12">
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
            <Field label="Search location">
              <span className={`${shellClasses} gap-2.5 px-3.5`}>
                <Search className="h-[18px] w-[18px] shrink-0 text-wine-600" />
                <input
                  type="text"
                  value={query.where}
                  onChange={update('where')}
                  placeholder="Search by city, venue, couple name or anything..."
                  aria-label="Search by city, venue, couple name or anything"
                  className="w-full bg-transparent placeholder:text-ink-soft/60 focus:outline-none"
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

            <Field label="Starting date">
              <span className={`${shellClasses} relative gap-2.5 px-3.5`}>
                <Calendar className="h-[18px] w-[18px] shrink-0 text-wine-600" />
                <input
                  type="date"
                  value={query.date}
                  onChange={update('date')}
                  aria-label="Starting date"
                  className="w-full min-w-0 bg-transparent text-ink placeholder:text-ink-soft/60 focus:outline-none"
                />
                <Calendar className="pointer-events-none h-[15px] w-[15px] shrink-0 text-ink-soft/60" />
              </span>
            </Field>

            <Field label="Food observance">
              <span className={`${shellClasses} relative`}>
                <select
                  value={query.food_observance}
                  onChange={update('food_observance')}
                  aria-label="Food observance"
                  className="w-full appearance-none bg-transparent pr-6 focus:outline-none"
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
