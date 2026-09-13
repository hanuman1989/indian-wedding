import Link from 'next/link'
import { Heart } from '@/components/Icons'

export default function HostCTA() {
  return (
    <section className="relative overflow-hidden bg-wine-700 py-12 sm:py-14">
      <div className="shell flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-left">
        <div>
          <h2 className="font-display text-[22px] font-bold text-cream-50 sm:text-[26px]">
            Your Wedding Deserves to Be Celebrated
          </h2>
          <p className="mt-2 max-w-lg text-[13px] leading-relaxed text-cream-100/85">
            Share your love, welcoming guests from around the world to be part of your special
            day.
          </p>
          <Link
            href="/post-weddings"
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-gold-400 px-5 py-3 text-[13px] font-semibold text-wine-900 transition-colors hover:bg-gold-300"
          >
            Become a Host
          </Link>
        </div>

        <p className="hidden items-center gap-2 font-display text-[15px] italic text-cream-100/70 lg:flex">
          More than a wedding, a shared joy
          <Heart className="h-4 w-4 text-gold-400" />
        </p>
      </div>
    </section>
  )
}
