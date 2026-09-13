'use client';
import { useCallback, useEffect, useRef, useState } from 'react'
import { CoupleScene } from './Artwork'
import { ArrowRight, Calendar, ChevronLeft, ChevronRight, MapPin, Plate } from '@/components/Icons'
import { SectionHeading } from './Ornaments'
import ErrorMessage from './common/ErrorMessage'
import APIs from '@/lib/apis'
import Link from 'next/link'

const Meta = ({ Icon, children }) => (
  <li className="flex items-center gap-2 text-[11px] leading-tight text-ink-soft">
    <Icon className="h-[13px] w-[13px] shrink-0 text-gold-500" />
    <span className="truncate">{children}</span>
  </li>
)

const WeddingCardSkeleton = () => (
  <div className="flex w-[262px] shrink-0 snap-start animate-pulse flex-col overflow-hidden rounded-xl border border-cream-300 bg-white lg:w-[calc((100%-60px)/4)]">
    <div className="aspect-[16/9] bg-cream-200" />
    <div className="space-y-3 p-3">
      <div className="h-4 w-3/5 rounded bg-cream-200" />
      <div className="space-y-2">
        <div className="h-3 w-4/5 rounded bg-cream-100" />
        <div className="h-3 w-3/4 rounded bg-cream-100" />
        <div className="h-3 w-2/3 rounded bg-cream-100" />
      </div>
      <div className="border-t border-cream-200 pt-2.5">
        <div className="h-8 w-24 rounded-md bg-cream-200" />
      </div>
    </div>
  </div>
)

export function WeddingCard({ wedding, className = '' }) {
  return (
    <article className={`group flex shrink-0 flex-col overflow-hidden rounded-xl border border-cream-300 bg-white shadow-sm transition-shadow hover:shadow-[0_16px_36px_-18px_rgba(108,10,34,0.4)] ${className}`}>
      <div className="relative aspect-[16/9] overflow-hidden">
        {wedding.cover_image ? (
          <img
            src={wedding.cover_image}
            alt={`${wedding.couple_name} wedding`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <CoupleScene
            palette={wedding.locations}
            className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04]"
          />
        )}

        <span className="absolute left-2.5 top-2.5 rounded-md bg-wine-700/95 px-2.5 py-1 text-[10.5px] font-medium text-cream-50">
          {wedding.wedding_dates}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-3">
        <h3 className="font-display text-[15px] font-bold leading-tight text-wine-700">
          {wedding.couple_name}
        </h3>

        <ul className="mt-2 space-y-1.5">
          <Meta Icon={Calendar}>{wedding.wedding_dates}</Meta>
          <Meta Icon={MapPin}>{wedding.locations}</Meta>
          <Meta Icon={Plate}>{wedding.food_observance}</Meta>
        </ul>

        <div className="mt-2.5 flex items-end justify-between gap-2 border-t border-cream-200 pt-2.5">

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
  const [weddings, setWeddings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isActive = true

    const loadPopularWeddings = async () => {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const response = await APIs.frontend.frontWeddings.getPopularWeddings()
        if (isActive) setWeddings(Array.isArray(response?.data) ? response.data : [])
      } catch (error) {
        if (isActive) setErrorMessage('Unable to load popular weddings. Please try again.')
      } finally {
        if (isActive) setIsLoading(false)
      }
    }

    void loadPopularWeddings()

    return () => {
      isActive = false
    }
  }, [])

  const scrollByCard = useCallback((direction) => {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector('article')
    const step = card ? card.offsetWidth + 20 : track.clientWidth * 0.8
    track.scrollBy({ left: direction * step, behavior: 'smooth' })
  }, [])

  if (!isLoading && !errorMessage && weddings.length === 0) return null

  return (
    <section id="weddings" className="bg-white py-10">
      <div className="shell">
        <div className="relative">
          <SectionHeading
            title="Popular Weddings"
            subtitle="Join these amazing celebrations"
          />
           <Link
                href="/weddings"
                className="group mt-3 flex items-center justify-center gap-1.5 text-[12px] font-medium text-wine-700 hover:text-wine-500 lg:absolute lg:bottom-1 lg:right-0 lg:mt-0"
              >
                View All Weddings
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
        </div>

        <div className="relative mt-8">
          <ArrowButton side="left" onClick={() => scrollByCard(-1)}>
            <ChevronLeft className="h-[18px] w-[18px]" />
          </ArrowButton>

          {isLoading ? (
            <div className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-hidden pb-2">
              {Array.from({ length: 4 }, (_, index) => (
                <WeddingCardSkeleton key={index} />
              ))}
            </div>
          ) : errorMessage ? (
            <ErrorMessage message={errorMessage} onClose={() => setErrorMessage('')} />
          ) : weddings.length === 0 ? (
            <p className="py-12 text-center text-sm text-ink-soft">No popular weddings found.</p>
          ) : (
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
          )}
        
          <ArrowButton side="right" onClick={() => scrollByCard(1)}>
            <ChevronRight className="h-[18px] w-[18px]" />
          </ArrowButton>
        </div>
      </div>
    </section>
  )
}
