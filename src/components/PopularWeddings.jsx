'use client';
import { useCallback, useRef } from 'react'
import { inr, weddings } from './data/weddings'
import { CoupleScene } from './Artwork'
import { ArrowRight, Calendar, ChevronLeft, ChevronRight, MapPin, Rings } from '@/components/Icons'
import { SectionHeading } from './Ornaments'

const statusStyles = {
  available: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  'few-seats': 'bg-amber-50 text-amber-700 ring-amber-200',
}

const statusLabel = {
  available: 'Available',
  'few-seats': 'Few Seats Left',
}

const Meta = ({ Icon, children }) => (
  <li className="flex items-center gap-2 text-[11px] leading-tight text-ink-soft">
    <Icon className="h-[13px] w-[13px] shrink-0 text-gold-500" />
    <span className="truncate">{children}</span>
  </li>
)

export function WeddingCard({ wedding, className = '' }) {
  return (
    <article className={`group flex shrink-0 flex-col overflow-hidden rounded-xl border border-cream-300 bg-white shadow-sm transition-shadow hover:shadow-[0_16px_36px_-18px_rgba(108,10,34,0.4)] ${className}`}>
      <div className="relative aspect-[16/9] overflow-hidden">
        {wedding.image ? (
          <img
            src={wedding.image}
            alt={`${wedding.couple} wedding`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <CoupleScene
            palette={wedding.palette}
            className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04]"
          />
        )}

        <span className="absolute left-2.5 top-2.5 rounded-md bg-wine-700/95 px-2.5 py-1 text-[10.5px] font-medium text-cream-50">
          {wedding.duration}
        </span>
        <span
          className={`absolute right-2.5 top-2.5 rounded-md px-2.5 py-1 text-[10.5px] font-medium ring-1 ${statusStyles[wedding.status]}`}
        >
          {statusLabel[wedding.status]}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-3">
        <h3 className="font-display text-[16px] font-bold leading-tight text-wine-700">
          {wedding.couple}
        </h3>

        <ul className="mt-2 space-y-1.5">
          <Meta Icon={Calendar}>{wedding.dates}</Meta>
          <Meta Icon={MapPin}>{wedding.location}</Meta>
          <Meta Icon={Rings}>{wedding.type}</Meta>
        </ul>

        <div className="mt-2.5 flex items-end justify-between gap-2 border-t border-cream-200 pt-2.5">
          <p className="leading-tight">
            <span className="block font-display text-[17px] font-bold text-wine-700">
              {inr(wedding.price)}
            </span>
            <span className="block text-[10px] text-ink-soft">per person</span>
          </p>

          <button
            type="button"
            className="rounded-md bg-wine-700 px-3.5 py-2 text-[11.5px] font-medium text-cream-50 transition-colors hover:bg-wine-600"
          >
            View Details
          </button>
        </div>
      </div>
    </article>
  )
}

/* Declared at module scope so React keeps the same component type across renders */
const ArrowButton = ({ side, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={side === 'left' ? 'Previous weddings' : 'Next weddings'}
    className={`absolute top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-cream-300 bg-white text-wine-700 shadow-md transition-colors hover:bg-cream-100 lg:grid ${
      side === 'left' ? '-left-4' : '-right-4'
    }`}
  >
    {children}
  </button>
)

export default function PopularWeddings() {
  const trackRef = useRef(null)

  const scrollByCard = useCallback((direction) => {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector('article')
    const step = card ? card.offsetWidth + 20 : track.clientWidth * 0.8
    track.scrollBy({ left: direction * step, behavior: 'smooth' })
  }, [])

  return (
    <section id="weddings" className="bg-white py-10">
      <div className="shell">
        <div className="relative">
          <SectionHeading
            title="Popular Weddings"
            subtitle="Join these amazing celebrations"
          />
          <a
            href="#weddings"
            className="group mt-3 flex items-center justify-center gap-1.5 text-[12px] font-medium text-wine-700 hover:text-wine-500 lg:absolute lg:bottom-1 lg:right-0 lg:mt-0"
          >
            View All Weddings
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        <div className="relative mt-8">
          <ArrowButton side="left" onClick={() => scrollByCard(-1)}>
            <ChevronLeft className="h-[18px] w-[18px]" />
          </ArrowButton>

          <div
            ref={trackRef}
            className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2"
          >
            {weddings.map((wedding) => (
              <WeddingCard
                key={wedding.id}
                wedding={wedding}
                className="w-[262px] snap-start lg:w-[calc((100%-60px)/4)]"
              />
            ))}
          </div>

          <ArrowButton side="right" onClick={() => scrollByCard(1)}>
            <ChevronRight className="h-[18px] w-[18px]" />
          </ArrowButton>
        </div>
      </div>
    </section>
  )
}
