import { ChevronLeft, ChevronRight } from '@/components/Icons'

function getPageNumbers(current, total) {
  if (total <= 6) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = [1, 2, 3, 4, 5]
  if (!pages.includes(current) && current < total) pages[pages.length - 1] = current
  return [...pages, '...', total]
}

export default function Pagination({ currentPage, totalPages, onPageChange }) {
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
