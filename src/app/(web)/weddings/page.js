'use client';
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import SearchPanel from '@/components/SearchPanel'
import { WeddingCard } from '@/components/PopularWeddings'
import ErrorMessage from '@/components/common/ErrorMessage'
import Pagination from '@/components/common/Pagination'
import WeddingCardSkeleton from '@/components/common/WeddingCardSkeleton'
import APIs from '@/lib/apis'
import { Heart } from '@/components/Icons'
import { Flourish } from '@/components/Ornaments'

// export const metadata = {
//   title: "Find Indian Weddings | Discover & Join Real Weddings in India",

//   description:
//     "Discover real Indian weddings across India. Explore wedding celebrations, traditions, food, music and culture, and find your opportunity to join as a wedding guest.",

//   keywords: [
//     "Indian weddings",
//     "real Indian weddings",
//     "find Indian weddings",
//     "Indian wedding experience",
//     "Indian wedding guest",
//     "attend an Indian wedding",
//     "join an Indian wedding",
//     "Indian wedding celebrations",
//     "weddings in India",
//     "Indian wedding traditions",
//     "Indian wedding culture",
//     "Indian wedding experiences",
//     "Indian wedding tourism",
//     "international guests Indian weddings",
//     "Indian wedding travel",
//     "experience an Indian wedding",
//     "discover Indian weddings",
//     "Indian wedding destinations",
//   ],
// };

const PER_PAGE = 12;
const SKELETON_COUNT = 8;

export default function WeddingPage() {
  const searchParams = useSearchParams()
  const [currentPage, setCurrentPage] = useState(1)
  const [weddingsList, setWeddingsList] = useState([])
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: PER_PAGE,
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
        const response = await APIs.frontend.frontWeddings.getWeddings({
          ...Object.fromEntries(searchParams.entries()),
          page: currentPage,
          per_page: PER_PAGE,
        })
        if (isActive) {
          setWeddingsList(Array.isArray(response?.data) ? response.data : [])
          setPagination(response?.pagination || {
            current_page: 1,
            last_page: 1,
            per_page: PER_PAGE,
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
  }, [filters, currentPage])

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
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: SKELETON_COUNT }, (_, index) => (
                <WeddingCardSkeleton key={index} className="w-full" />
              ))}
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

