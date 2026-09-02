import { BadgeCheck, Diya, Mandap, Plate, Users } from './Icons'

const features = [
  { Icon: Mandap, lines: ['Authentic Indian', 'Wedding Experience'] },
  { Icon: Users, lines: ['Meet Wonderful', 'People'] },
  { Icon: Diya, lines: ['Rich Culture &', 'Traditions'] },
  { Icon: Plate, lines: ['Delicious Food &', 'Celebrations'] },
  { Icon: BadgeCheck, lines: ['Safe, Secure &', 'Verified'] },
]

export default function FeatureStrip() {
  return (
    <section id="about" className="border-y border-cream-300 bg-cream-100 py-5">
      <div className="shell">
        <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-6 lg:gap-x-4">
          {features.map(({ Icon, lines }, i) => (
            <li
              key={lines.join()}
              className="flex w-[168px] items-center gap-3 lg:w-auto lg:gap-4"
            >
              <Icon className="h-[26px] w-[26px] shrink-0 text-gold-600" />
              <span className="text-[11.5px] font-medium leading-tight text-ink">
                {lines[0]}
                <br />
                {lines[1]}
              </span>

              {/* separator diamond, only between items on wide screens */}
              {i < features.length - 1 && (
                <svg
                  viewBox="0 0 12 12"
                  aria-hidden="true"
                  className="hidden h-2.5 w-2.5 shrink-0 text-gold-400 lg:block"
                >
                  <path d="M6 0.5 11.5 6 6 11.5 0.5 6Z" fill="currentColor" />
                </svg>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
