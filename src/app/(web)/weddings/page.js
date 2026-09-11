'use client';
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import SearchPanel from '@/components/SearchPanel'
import { WeddingCard } from '@/components/PopularWeddings'
import ErrorMessage from '@/components/common/ErrorMessage'
import APIs from '@/lib/apis'
import { ChevronLeft, ChevronRight, Heart } from '@/components/Icons'
import { Flourish } from '@/components/Ornaments'

// Placeholder until the weddings API returns a real page count.
const TOTAL_PAGES = 12

function getWeddingList(response) {
  const data = response?.weddings || response?.data?.weddings || response?.data || response
  return Array.isArray(data) ? data : []
}

function getContactName(contact, fallback) {
  const firstName = contact?.firstName || contact?.first_name || ''
  const lastName = contact?.lastName || contact?.last_name || ''
  return `${firstName} ${lastName}`.trim() || fallback
}

// Maps the raw API wedding record onto the fields WeddingCard expects.
function normalizeWeddingCard(wedding) {
  const events = wedding.events || wedding.wedding_events || []
  const firstEvent = events[0] || {}
  const brideName = getContactName(wedding.bride, wedding.bride_name || 'Bride')
  const groomName = getContactName(wedding.groom, wedding.groom_name || 'Groom')
  const photo = (wedding.photos || wedding.wedding_photos || [])[0] || {}
  const days = Number(wedding.wedding_days || wedding.weddingDays || events.length || 1)

  return {
    id: wedding.id || wedding.uuid,
    couple: wedding.couple || `${groomName} & ${brideName}`,
    dates:
      wedding.dates ||
      wedding.wedding_dates ||
      firstEvent.event_date ||
      firstEvent.date ||
      'Dates to be confirmed',
    location:
      wedding.locations ||
      wedding.location ||
      wedding.venue_name ||
      wedding.venueName ||
      firstEvent.venue_name ||
      'Location to be confirmed',
    type: wedding.type || wedding.tagline || wedding.story || 'Wedding Celebration',
    price: Number(wedding.price || wedding.per_person_price || 0),
    duration: `${days} ${days === 1 ? 'Day' : 'Days'} Wedding`,
    status: wedding.status === 'few-seats' ? 'few-seats' : 'available',
    palette: wedding.palette || 'jaipur',
    image: photo.cover_image || wedding.cover_image || null,
  }
}

function getPageNumbers(current, total) {
  if (total <= 6) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = [1, 2, 3, 4, 5]
  if (!pages.includes(current) && current < total) pages[pages.length - 1] = current
  return [...pages, '...', total]
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = getPageNumbers(currentPage, totalPages)

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="grid h-9 w-9 place-items-center rounded-full border border-cream-300 text-wine-700 transition-colors hover:bg-cream-100 disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((page, index) =>
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="px-1 text-[13px] text-ink-soft">
            …
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? 'page' : undefined}
            className={`grid h-9 w-9 place-items-center rounded-full text-[13px] font-medium transition-colors ${
              page === currentPage
                ? 'bg-wine-700 text-cream-50'
                : 'text-ink-soft hover:bg-cream-100'
            }`}
          >
            {page}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="grid h-9 w-9 place-items-center rounded-full border border-cream-300 text-wine-700 transition-colors hover:bg-cream-100 disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  )
}

export default function WeddingPage() {
  const searchParams = useSearchParams()
  const [currentPage, setCurrentPage] = useState(1)
  const [weddingsList, setWeddingsList] = useState([])
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 12,
    total: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  // Reruns on mount and whenever SearchPanel navigates here with new query params.
  const filters = searchParams.toString()

  useEffect(() => {
    let isActive = true

    const loadWeddings = async () => {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const response = await APIs.frontend.frontWeddings.getWeddings(
          Object.fromEntries(searchParams.entries()),
        )
        if (isActive) {
          setWeddingsList(Array.isArray(response?.data) ? response.data : [])
          setPagination(response?.pagination || {
            current_page: 1,
            last_page: 1,
            per_page: 12,
            total: 0,
          })
        }
      } catch (error) {
        if (isActive) setErrorMessage('Unable to load weddings. Please try again.')
      } finally {
        if (isActive) setIsLoading(false)
      }
    }

    void loadWeddings()

    return () => {
      isActive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  return (
    <>
      <section
        className="relative isolate overflow-hidden bg-cream-100 pb-10 pt-10 sm:pb-10 sm:pt-10 lg:pb-10 "
        style={{
          backgroundImage: "url('/images/search-background.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="shell relative text-center">
          <div className="flex items-center justify-center gap-3">
            <Flourish mirrored />
            <Flourish />
          </div>
          <p className="mt-3 text-[15px] font-semibold uppercase tracking-[0.2em] text-gold-600">
            Discover Love Stories
          </p>
          <h1 className="mx-auto mt-3 max-w-2xl font-display text-[28px] font-bold leading-tight text-wine-700 sm:text-[28px] lg:text-[30px]">
            Find Your Perfect Wedding Inspiration
          </h1>
          <div className="mt-4 flex items-center justify-center gap-3">
            <Flourish mirrored />
            <Heart className="h-4 w-4 text-gold-500" />
            <Flourish />
          </div>
        </div>

        <SearchPanel className="mt-10" />
      </section>

      <section className="bg-white py-10">
        <div className="shell">
          {isLoading ? (
            <div className="mt-8 flex items-center justify-center py-16">
              <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-wine-700" />
            </div>
          ) : errorMessage ? (
            <ErrorMessage message={errorMessage} onClose={() => setErrorMessage('')} className="mt-8" />
          ) : weddingsList.length === 0 ? (
            <p className="mt-8 text-center text-sm text-ink-soft">
              No weddings found. Try adjusting your search.
            </p>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {weddingsList.map((wedding) => (
                <WeddingCard key={wedding.id} wedding={wedding} className="w-full" />
              ))}
            </div>
          )}

          {(pagination.total ?? 0) > (pagination.per_page ?? 0) && (
            <Pagination
              currentPage={pagination.current_page || currentPage}
              totalPages={pagination.last_page || 1}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </section>
    </>
  )
}

