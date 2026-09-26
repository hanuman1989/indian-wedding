'use client'
import Image from 'next/image';
import { ArrowRight, Couple, Heart, Play, Users } from '@/components/Icons'
import AuthGatedLink from '@/components/common/AuthGatedLink'

const stats = [
  { Icon: Couple, value: '500+', label: 'Happy Couples' },
  { Icon: Users, value: '10,000+', label: 'Guests Joined' },
  { Icon: Heart, value: 'Memorable', label: 'Celebrations' },
]

export default function HostHero() {
  return (
    <>
      <section
        className="relative isolate overflow-hidden py-5 sm:py-5 lg:py-10"
        style={{
          backgroundImage: "url('/images/host-wedding-bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* fades the busy venue photo on the left so the text stays readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-cream-50 via-cream-50/85 to-cream-50/10" />

        <div className="shell relative grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-center">
          <div>
            <p className="text-[14px] font-bold uppercase tracking-[0.2em] text-gold-600">
              Become a Host
            </p>
            <h1 className="mt-3 font-display text-[30px] font-bold leading-[1.15] text-wine-700 sm:text-[34px] lg:text-[40px]">
              Share Your Wedding.
              <br />
              Create Beautiful Connections.
            </h1>
            <p className="mt-4 max-w-md text-[14px] leading-relaxed text-ink-soft">
              Open your special day to invited guests, share your culture, traditions and joyful
              moments with people who truly appreciate the beauty of Indian weddings.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3.5">
              <AuthGatedLink
                href="/post-weddings"
                className="group inline-flex items-center gap-2.5 rounded-md bg-wine-700 px-5 py-3 text-[13.5px] font-medium text-cream-50 shadow-lg shadow-wine-900/20 transition-colors hover:bg-wine-600"
              >
                Become a Host
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </AuthGatedLink>

              <a
                href="#process"
                className="inline-flex items-center gap-2.5 rounded-md border border-wine-700/70 bg-white px-5 py-3 text-[13.5px] font-medium text-wine-700 transition-colors hover:bg-cream-100"
              >
                <Play className="h-4 w-4" />
                How It Works
              </a>
            </div>

            <ul className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3">
              {stats.map(({ Icon, value, label }) => (
                <li key={label} className="flex items-center gap-2">
                  <Icon className="h-[18px] w-[18px] text-wine-600" />
                  <span className="leading-tight">
                    <span className="block text-[13.5px] font-bold text-wine-700">{value}</span>
                    <span className="block text-[10.5px] text-ink-soft">{label}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-0 right-65 hidden w-[25%] max-w-[560px] sm:block">
          <Image
            src="/images/couple.png"
            alt="Couple celebrating their wedding"
            width={800}
            height={600}
            className="h-auto w-full object-contain object-bottom"
          />
        </div>
      </section>
    </>
  )
}
