import { BadgeCheck, Lock, Phone, Sliders } from '@/components/Icons'
import { SectionHeading } from '@/components/Ornaments'

const trustItems = [
  { Icon: Lock, title: 'Secure Guest Payments', text: 'Your transactions are protected' },
  { Icon: Sliders, title: 'You Choose What to Share', text: 'Complete control over your content' },
  { Icon: BadgeCheck, title: 'Verified Wedding Details', text: 'Authentic and genuine listings' },
  { Icon: Phone, title: 'Support When You Need It', text: "We're here to help" },
]

export default function TrustPlatform() {
  return (
    <section className="bg-cream-100 py-12 sm:py-14">
      <div className="shell">
        <SectionHeading title="A Safe & Trusted Platform" />

        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map(({ Icon, title, text }) => (
            <li key={title} className="text-center">
              <span className="mx-auto mb-2.5 grid h-12 w-12 place-items-center rounded-full border border-gold-300/70 bg-white text-wine-700 shadow-sm">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="text-[12.5px] font-semibold text-wine-700">{title}</h3>
              <p className="mt-1 text-[11px] text-ink-soft">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
