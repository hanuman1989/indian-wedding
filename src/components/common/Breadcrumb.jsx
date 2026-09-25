import Link from 'next/link'
import { ChevronRight } from '@/components/Icons'

/**
 * Shared breadcrumb trail.
 * items: [{ title, link?, className? }] — the last/current item is usually
 * passed without a `link` so it renders as plain (non-clickable) text.
 * actions: optional node rendered on the right (e.g. a share button).
 * shell: set false to skip the built-in page-gutter wrapper/top padding when
 * the breadcrumb is embedded inside a layout that already provides both.
 */
export default function Breadcrumb({
  items = [],
  actions = null,
  textClassName = 'text-ink-soft',
  shell = true,
  className = '',
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`${shell ? 'shell pt-6 sm:pt-8' : ''} flex flex-wrap items-center gap-3 ${actions ? 'justify-between' : ''} ${className}`}
    >
      <ol className={`flex flex-wrap items-center gap-1.5 text-xs ${textClassName}`}>
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
      {actions}
    </nav>
  )
}


