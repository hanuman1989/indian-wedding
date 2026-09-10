import { ListDetails, Pencil, Rings, Users } from '@/components/Icons'
import { SectionHeading } from '@/components/Ornaments'

const steps = [
  {
    Icon: ListDetails,
    title: 'Create Your Wedding',
    text: 'Add your wedding details, events, photos and preferences.',
  },
  {
    Icon: Pencil,
    title: 'Tell Your Story',
    text: 'Share what makes your love journey special.',
  },
  {
    Icon: Users,
    title: 'Welcome Guests',
    text: 'Let guests discover, connect and join your celebration.',
  },
  {
    Icon: Rings,
    title: 'Celebrate Together',
    text: 'Create memories that last a lifetime.',
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

export default function HostingProcess() {
  return (
    <section id="process" className="relative overflow-hidden bg-wine-50 py-12 sm:py-14">
      <div className="shell relative">
        <SectionHeading
          title="From Your Wedding to Their Memory"
          subtitle="A simple way to share your celebration with the world."
        />

        <ol className="mt-9 flex flex-col items-center gap-8 sm:grid sm:grid-cols-2 sm:place-items-center sm:gap-y-9 lg:flex lg:flex-row lg:justify-center lg:gap-0">
          {steps.map(({ Icon, title, text }, i) => (
            <li
              key={title}
              className="relative flex w-full max-w-[210px] flex-col items-center text-center"
            >
              <span className="relative mb-3.5">
                <span className="grid h-[60px] w-[60px] place-items-center rounded-full border border-gold-300 bg-white text-wine-700 shadow-sm">
                  <Icon className="h-[23px] w-[23px]" />
                </span>
                <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-wine-700 text-[10.5px] font-semibold text-cream-50 ring-2 ring-wine-50">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </span>

              <h3 className="text-[13px] font-semibold leading-snug text-wine-700">{title}</h3>
              <p className="mt-1 text-[11.5px] leading-relaxed text-ink-soft">{text}</p>

              {i < steps.length - 1 && <Connector />}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
