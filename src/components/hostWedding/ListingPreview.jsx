import { Calendar, Check, Globe, MapPin, Plate } from '@/components/Icons'
import { CoupleScene } from '@/components/Artwork'
import { weddings } from '@/components/data/weddings'

const highlights = [
  'Beautiful photo gallery',
  'Detailed event schedule',
  'Location with map',
  'Food and accommodation info',
  'Your story and special notes',
  'Easy guest contribution setup',
]

const eventTags = ['Mehendi', 'Sangeet', 'Wedding Ceremony', 'Reception']

export default function ListingPreview() {
  const wedding = weddings[0]

  return (
    <section className="bg-wine-50 py-12 sm:py-14">
      <div className="shell text-center">
        <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-gold-600">
          A Glimpse of Your Wedding Listing
        </p>
        <h2 className="mt-1.5 font-display text-[24px] font-bold text-wine-700 sm:text-[28px]">
          Built Around Your Celebration
        </h2>
        <p className="mx-auto mt-2 max-w-md text-[13px] text-ink-soft">
          Present your wedding beautifully with all the important details.
        </p>

        <div className="mt-8 grid gap-6 rounded-2xl border border-gold-300/60 bg-white p-4 text-left shadow-sm sm:p-5 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-8 lg:p-6">
          <div className="grid gap-4 sm:grid-cols-[220px_1fr] sm:items-center">
            <div className="overflow-hidden rounded-xl">
              <CoupleScene palette={wedding.palette} className="h-[160px] w-full" />
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-display text-[17px] font-bold text-wine-700">
                  {wedding.couple}
                </h3>
                <span className="rounded-full bg-gold-100 px-2.5 py-1 text-[10px] font-semibold text-gold-600">
                  Destination Wedding
                </span>
              </div>

              <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-[11.5px] text-ink-soft">
                <li className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-gold-500" />
                  {wedding.dates}
                </li>
                <li className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-gold-500" />
                  {wedding.location}
                </li>
                <li className="flex items-center gap-1.5">
                  <Plate className="h-3.5 w-3.5 text-gold-500" />
                  Veg &amp; Non-Veg
                </li>
                <li className="flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-gold-500" />
                  Hindi, English
                </li>
              </ul>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {eventTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-cream-100 px-2.5 py-1 text-[10.5px] text-ink"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <button
                type="button"
                className="mt-3.5 rounded-md bg-wine-700 px-4 py-2 text-[12px] font-medium text-cream-50 transition-colors hover:bg-wine-600"
              >
                Preview Wedding →
              </button>
            </div>
          </div>

          <ul className="grid gap-2.5 border-t border-cream-200 pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            {highlights.map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-[12.5px] text-ink">
                <Check className="h-4 w-4 shrink-0 text-wine-600" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
