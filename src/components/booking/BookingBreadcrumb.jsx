import Link from 'next/link'
import { ChevronRight } from '@/components/Icons'

export default function BookingBreadcrumb({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="shell flex flex-wrap items-center gap-1.5 pt-6 text-xs text-black sm:pt-8">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => {
          const itemClassName = item.className || item.class || (item.link ? 'transition-colors hover:text-wine-700' : 'font-semibold text-wine-700')

          return (
            <li key={`${item.title}-${index}`} className="flex items-center gap-1.5">
              {item.link ? (
                <Link href={item.link} className={itemClassName}>{item.title}</Link>
              ) : (
                <span aria-current={index === items.length - 1 ? 'page' : undefined} className={itemClassName}>{item.title}</span>
              )}
              {index < items.length - 1 && <ChevronRight className="h-3.5 w-3.5" />}
            </li>
          )
        })}
      </ol>   
    </nav>
  )
}
