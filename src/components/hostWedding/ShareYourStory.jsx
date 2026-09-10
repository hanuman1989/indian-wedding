import Link from 'next/link'
import { ArrowRight, Calendar, Globe, Gift, Heart, Photo, Plate } from '@/components/Icons'

const shareItems = [
  { Icon: Heart, title: 'Wedding Story', text: 'Your love journey' },
  { Icon: Calendar, title: 'Ceremonies & Events', text: 'Mehendi, Sangeet, Wedding & more' },
  { Icon: Photo, title: 'Photos & Video', text: 'Beautiful moments' },
  { Icon: Globe, title: 'Languages', text: 'Connect globally' },
  { Icon: Plate, title: 'Food & Traditions', text: 'Share your cuisine' },
  { Icon: Gift, title: 'Guest Contribution', text: 'Your choice, your control' },
]

export default function ShareYourStory() {
  return (
    <section className="bg-cream-50 py-12 sm:py-14">
      <div className="shell grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div className="relative">
          <div className="overflow-hidden rounded-2xl border border-gold-300/60 shadow-sm">
            <img
              src="/images/banner.webp"
              alt="Couple celebrating a wedding tradition"
              className="h-[280px] w-full object-cover sm:h-[340px]"
            />
          </div>
          <div className="absolute -bottom-4 left-4 rounded-lg border border-gold-300/70 bg-white px-3.5 py-2 text-[11px] font-medium text-wine-700 shadow-md">
            Traditions bring people together
          </div>
        </div>

        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-gold-600">
            What You Can Share
          </p>
          <h2 className="mt-1.5 font-display text-[24px] font-bold text-wine-700 sm:text-[28px]">
            Your Wedding, Your Story
          </h2>
          <p className="mt-2.5 max-w-lg text-[13px] leading-relaxed text-ink-soft">
            Show the world what makes your celebration unique. Share as much or as little as you
            like.
          </p>

          <div className="mt-6 grid gap-3.5 sm:grid-cols-2">
            {shareItems.map(({ Icon, title, text }) => (
              <div key={title} className="flex items-start gap-2.5">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-cream-100 text-wine-700">
                  <Icon className="h-[15px] w-[15px]" />
                </span>
                <span className="leading-tight">
                  <span className="block text-[12.5px] font-semibold text-wine-700">{title}</span>
                  <span className="block text-[11px] text-ink-soft">{text}</span>
                </span>
              </div>
            ))}
          </div>

          <Link
            href="/post-weddings"
            className="group mt-6 inline-flex items-center gap-2.5 rounded-md bg-wine-700 px-5 py-3 text-[13px] font-medium text-cream-50 transition-colors hover:bg-wine-600"
          >
            Start Your Wedding Listing
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
