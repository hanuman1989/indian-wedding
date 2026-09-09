import { Couple, Lotus, Star, Users } from './Icons'
import { Mandala } from './Ornaments'

const stats = [
  { Icon: Couple, value: '2500+', label: 'Weddings Hosted' },
  { Icon: Users, value: '1,25,000+', label: 'Happy Guests' },
  { Icon: Lotus, value: '50+', label: 'Cities Covered' },
  { Icon: Star, value: '4.8/5', label: 'Guest Rating' },
]

export default function StatsBar() {
  return (
    <section className="barstats relative mt-10 overflow-hidden bg-wine-700">

      <div className="shell">
        <ul className="grid grid-cols-2 divide-gold-300/25 py-4 lg:grid-cols-4 lg:divide-x">
          {stats.map(({ Icon, value, label }) => (
            <li
              key={label}
              className="flex items-center justify-center gap-2.5 px-4 py-2"
            >
              <Icon className="h-6 w-6 shrink-0 text-gold-300" />
              <span className="leading-tight">
                <span className="block font-display text-[21px] font-bold text-cream-50 sm:text-[23px]">
                  {value}
                </span>
                <span className="block text-[11px] tracking-wide text-gold-200">
                  {label}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
