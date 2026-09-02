'use client';
import { useState } from 'react'
import {
  Calendar,
  ChevronDown,
  MapPin,
  Rings,
  Search,
  Shield,
  Sliders,
  Ticket,
  Wallet,
} from '@/components/Icons'
import { Mandala } from './Ornaments'

const weddingTypes = [
  'All Types',
  'Traditional Rajasthani',
  'Royal Rajputana',
  'Beachside Indian',
  'Marwari Traditional',
  'South Indian Temple',
  'Grand Punjabi',
]

const priceRanges = [
  '₹0 - ₹10,000+',
  '₹0 - ₹2,000',
  '₹2,000 - ₹4,000',
  '₹4,000 - ₹6,000',
  '₹6,000 - ₹10,000',
  '₹10,000+',
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
    type: weddingTypes[0],
    price: priceRanges[0],
  })

  const update = (key) => (e) =>
    setQuery((prev) => ({ ...prev, [key]: e.target.value }))

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

            <button
              type="button"
              className="flex items-center gap-2 text-[12.5px] font-medium text-ink-soft transition-colors hover:text-wine-700"
            >
              Advanced Search
              <Sliders className="h-[18px] w-[18px] text-gold-500" />
            </button>
          </div>

          <div className="grid gap-3.5 lg:grid-cols-[1.15fr_1fr_1fr_1fr_auto]">
            <Field label="Where">
              <span className={shellClasses}>
                <MapPin className="h-[17px] w-[17px] shrink-0 text-gold-500" />
                <input
                  type="text"
                  value={query.where}
                  onChange={update('where')}
                  placeholder="City, State or Country"
                  className="w-full bg-transparent placeholder:text-ink-soft/60 focus:outline-none"
                />
              </span>
            </Field>

            <Field label="Wedding Date">
              <span className={shellClasses}>
                <Calendar className="h-[17px] w-[17px] shrink-0 text-gold-500" />
                <input
                  type="date"
                  value={query.date}
                  onChange={update('date')}
                  aria-label="Wedding date"
                  className="w-full bg-transparent text-ink placeholder:text-ink-soft/60 focus:outline-none"
                />
              </span>
            </Field>

            <Field label="Wedding Type">
              <span className={`${shellClasses} relative`}>
                <select
                  value={query.type}
                  onChange={update('type')}
                  className="w-full appearance-none bg-transparent pr-6 focus:outline-none"
                >
                  {weddingTypes.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-ink-soft" />
              </span>
            </Field>

            <Field label="Price Range (Per Person)">
              <span className={`${shellClasses} relative`}>
                <select
                  value={query.price}
                  onChange={update('price')}
                  className="w-full appearance-none bg-transparent pr-6 focus:outline-none"
                >
                  {priceRanges.map((p) => (
                    <option key={p}>{p}</option>
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
