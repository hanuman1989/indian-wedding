import { MandapWalkScene, MusiciansScene } from './Artwork'
import { CreditCard, Gift, ListDetails, Search, UserPlus } from './Icons'
import { SectionHeading } from './Ornaments'

const steps = [
  {
    Icon: Search,
    title: 'Browse Weddings',
    text: 'Explore real weddings happening near you.',
  },
  {
    Icon: ListDetails,
    title: 'View Details',
    text: 'Check wedding details, itinerary, and per-person join cost.',
  },
  {
    Icon: UserPlus,
    title: 'Join & Register',
    text: 'Enter your details and select number of members.',
  },
  {
    Icon: CreditCard,
    title: 'Make Payment',
    text: 'Pay securely and get your invitation confirmed.',
  },
  {
    Icon: Gift,
    title: 'Be Part of the Celebration',
    text: 'Enjoy the wedding and create beautiful memories!',
  },
]

/* Dotted arrow that sits in the gap between two step circles (wide screens) */
const Connector = () => (
  <svg
    viewBox="0 0 56 12"
    aria-hidden="true"
    className="absolute left-full top-[26px] hidden h-3 w-14 -translate-x-1/2 text-gold-400 lg:block"
  >
    <path
      d="M2 6h44"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeDasharray="2 5"
    />
    <path d="M46 1.5 53.5 6 46 10.5Z" fill="currentColor" />
  </svg>
)

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-cream-100 py-10"
    >
      {/* side illustrations, decorative only */}
      <MusiciansScene className="pointer-events-none absolute -left-4 bottom-0 hidden h-[240px] w-[280px] opacity-90 xl:block" />
      <MandapWalkScene className="pointer-events-none absolute -right-2 bottom-0 hidden h-[240px] w-[280px] opacity-90 xl:block" />

      <div className="shell relative">
        <SectionHeading
          title="How It Works"
          subtitle="Simple steps to join or host a wedding"
        />

        <ol className="mt-8 flex flex-col items-center gap-8 sm:grid sm:grid-cols-3 sm:place-items-start sm:gap-y-9 lg:flex lg:flex-row lg:justify-center lg:gap-0">
          {steps.map(({ Icon, title, text }, i) => (
            <li
              key={title}
              className="relative flex w-full max-w-[186px] flex-col items-center justify-self-center text-center"
            >
              <span className="relative mb-3.5">
                <span className="grid h-[60px] w-[60px] place-items-center rounded-full border border-gold-300 bg-cream-50 text-wine-700 shadow-sm">
                  <Icon className="h-[23px] w-[23px]" />
                </span>
                <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-wine-700 text-[10.5px] font-semibold text-cream-50 ring-2 ring-cream-100">
                  {i + 1}
                </span>
              </span>

              <h3 className="text-[13px] font-semibold leading-snug text-wine-700">
                {title}
              </h3>
              <p className="mt-1 text-[11.5px] leading-relaxed text-ink-soft">
                {text}
              </p>

              {i < steps.length - 1 && <Connector />}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
