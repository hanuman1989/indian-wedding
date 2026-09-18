import Link from 'next/link'
import { ChevronRight } from '@/components/Icons'
import { getCoupleName } from '@/components/weddingDetail/weddingDetailUtils'

export default function BookingBreadcrumb({ wedding }) {
  const coupleName = getCoupleName(wedding)

  return (
    <nav aria-label="Breadcrumb" className="shell flex flex-wrap items-center gap-1.5 pt-6 text-xs text-black sm:pt-8">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li><Link href="/" className="transition-colors hover:text-wine-700">Home</Link></li>
        <li><ChevronRight className="h-3.5 w-3.5" /></li>
        <li><Link href="/weddings" className="transition-colors hover:text-wine-700">Weddings</Link></li>
        <li><ChevronRight className="h-3.5 w-3.5" /></li>
        <li><Link href={`/wedding-detail/${wedding?.id}`} className="transition-colors hover:text-wine-700">{coupleName}</Link></li>
        <li><ChevronRight className="h-3.5 w-3.5" /></li>
        <li aria-current="page" className="font-semibold text-wine-700">Join Wedding</li>
      </ol>   
    </nav>
  )
}
