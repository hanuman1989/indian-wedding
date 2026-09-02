import { HeroScene } from './Artwork'
import { ArrowRight, Heart, Search } from './Icons'

/**
 * Drop a photo at e.g. `public/images/hero.jpg` and set this to
 * '/images/hero.jpg' to replace the illustrated backdrop.
 */
const HERO_IMAGE = null

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* backdrop */}
      <div className="absolute inset-0 -z-10">
        {HERO_IMAGE ? (
          <img
            src={HERO_IMAGE}
            alt=""
            className="h-full w-full object-cover object-center"
          />
        ) : (
          <HeroScene className="h-full w-full" />
        )}
        {/* warm scrim so the headline stays readable over the art */}
        <div className="absolute inset-0 bg-gradient-to-r from-cream-100/95 via-cream-100/70 to-transparent" />
      </div>

      <div className="shell relative flex min-h-[380px] items-center py-12 sm:min-h-[420px] lg:min-h-[460px]">
        <div className="max-w-[560px]">
          <h1 className="font-display text-[30px] font-bold leading-[1.16] sm:text-[36px] lg:text-[38px]">
            <span className="block text-wine-700">Be Part of a Wedding.</span>
            <span className="mt-1 block text-gold-600">
              Experience the Celebration.
            </span>
          </h1>

          <p className="mt-4 max-w-md text-[13.5px] leading-relaxed text-ink">
            Discover beautiful Indian weddings, meet amazing people, experience
            rich traditions and create unforgettable memories.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <a
              href="#weddings"
              className="group inline-flex items-center gap-2.5 rounded-md bg-wine-700 px-5 py-3 text-[13.5px] font-medium text-cream-50 shadow-lg shadow-wine-900/20 transition-all hover:bg-wine-600 hover:shadow-xl"
            >
              <Search className="h-[17px] w-[17px]" />
              Find a Wedding
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>

            <a
              href="#host"
              className="group inline-flex items-center gap-2.5 rounded-md border border-wine-700/70 bg-white/70 px-5 py-3 text-[13.5px] font-medium text-wine-700 backdrop-blur-sm transition-all hover:bg-white"
            >
              <Heart className="h-[17px] w-[17px]" />
              Host Your Wedding
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
