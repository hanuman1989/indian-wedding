import { ElephantScene, VenueScene } from './Artwork'
import { ArrowRight, BookHeart, ClipboardUsers, Coins, Lock } from './Icons'
import { Mandala } from './Ornaments'

const perks = [
  {
    Icon: Coins,
    title: 'Set Your Own Join Cost',
    text: 'You decide the per-person contribution amount.',
  },
  {
    Icon: ClipboardUsers,
    title: 'Manage Guests Easily',
    text: 'View registrations, guest details and confirmations.',
  },
  {
    Icon: Lock,
    title: 'Secure Payments 100% Safe',
    text: 'Receive payments directly and securely.',
  },
  {
    Icon: BookHeart,
    title: 'Share Your Story',
    text: 'Create a beautiful wedding page and tell your story.',
  },
]

export default function HostWedding() {
  return (
    <section id="host" className="bg-white pb-11">
      <div className="shell">
        <div className="relative overflow-hidden rounded-2xl border border-gold-300/70 bg-cream-100">
          {/* faded venue photo on the right */}
          <VenueScene className="pointer-events-none absolute -right-6 bottom-0 hidden h-full w-[420px] opacity-40 lg:block" />
          <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-cream-100 via-cream-100/95 to-cream-100/40 lg:block" />

          {/* corner mandalas */}
          <Mandala className="pointer-events-none absolute -left-6 -top-6 h-28 w-28 text-gold-500/15" />
          <Mandala className="pointer-events-none absolute -bottom-8 -right-8 h-32 w-32 text-gold-500/15" />

          <div className="relative grid gap-7 p-5 sm:p-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.35fr)] lg:items-center lg:gap-8 lg:p-7">
            {/* left: pitch */}
            <div className="relative">
              <Mandala className="mb-3 h-7 w-7 text-gold-500" petals={8} />

              <p className="font-display text-[16px] font-semibold text-ink">
                Host Your Wedding
              </p>
              <h2 className="mt-1 font-display text-[21px] font-bold leading-snug text-wine-700 sm:text-[23px]">
                Open Your Celebration to
                <br className="hidden sm:block" /> New Friends &amp; Memories
              </h2>

              <p className="mt-2.5 max-w-sm text-[12px] leading-relaxed text-ink-soft">
                Set your per-person cost, share your story, and welcome guests
                from around the world.
              </p>

              <a
                href="#contact"
                className="group mt-5 inline-flex items-center gap-2.5 rounded-md bg-wine-700 px-4 py-2.5 text-[12.5px] font-medium text-cream-50 shadow-md shadow-wine-900/15 transition-colors hover:bg-wine-600"
              >
                Start Hosting Now
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>

              <ElephantScene className="pointer-events-none absolute -bottom-6 -left-2 hidden h-[118px] w-[150px] opacity-70 xl:block" />
            </div>

            {/* right: perks */}
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
              {perks.map(({ Icon, title, text }) => (
                <li key={title} className="text-center">
                  <span className="mx-auto mb-2.5 grid h-[46px] w-[46px] place-items-center rounded-full border border-gold-300/80 bg-cream-50 text-wine-700 shadow-sm">
                    <Icon className="h-[20px] w-[20px]" />
                  </span>
                  <h3 className="text-[12px] font-semibold leading-snug text-wine-700">
                    {title}
                  </h3>
                  <p className="mt-1 text-[10.5px] leading-relaxed text-ink-soft">
                    {text}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
