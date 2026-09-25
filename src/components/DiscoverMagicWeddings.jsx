import Link from 'next/link'

import { ArrowRight } from './Icons'

export default function DiscoverMagicWeddings() {
  return (
    <section className="relative isolate overflow-hidden py-10 sm:py-12">
      {/* full-width backdrop: photo fills the left half, mandala pattern fills the right half */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex flex-col lg:flex-row">
        <img
          src="/images/the-baraat.png"
          alt="Groom arriving on horseback during a traditional Indian wedding baraat procession"
          className="h-[220px] w-full object-cover sm:h-[260px] lg:h-full lg:w-1/2"
          style={{
            maskImage: 'linear-gradient(to right, black 40%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, black 40%, transparent 100%)',
          }}
        />
        <div
          className="flex-1 bg-cream-100 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/sectionbg.png')" }}
        />
      </div>

      <div className="shell relative">
        <div className="flex flex-col lg:flex-row">
          {/* spacer reserving space over the photo half of the backdrop */}
          <div
            aria-hidden="true"
            className="h-[220px] sm:h-[260px] lg:h-auto lg:w-1/2"
          />

          <div className="relative flex flex-1 flex-col justify-center px-6 py-10 sm:pl-25 lg:pl-30 sm:pr-10 lg:pr-10">
            <h2 className="font-display text-[26px] font-bold leading-snug text-wine-700 sm:text-[30px] lg:text-[32px]">
              Discover the Magic
              <br /> of Indian Weddings
            </h2>

            <p className="mt-3 max-w-md text-[13px] leading-relaxed text-ink-soft sm:text-[13.5px]">
              From the vibrant Baraat to the sacred rituals, from delicious
              cuisines to heartwarming family moments — Indian weddings offer
              an unforgettable cultural experience.
            </p>

            <Link
              href="/indian-wedding-experience"
              className="group mt-6 inline-flex w-fit items-center gap-2.5 rounded-md bg-wine-700 px-5 py-3 text-[13px] font-medium text-cream-50 shadow-md shadow-wine-900/15 transition-colors hover:bg-wine-600"
            >
              Explore the Experience
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}