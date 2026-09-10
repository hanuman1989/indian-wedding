import { Gift, Lotus, Shield, Users } from '@/components/Icons'
import { SectionHeading } from '@/components/Ornaments'

const perks = [
  {
    Icon: Users,
    title: 'Welcome New Connections',
    text: 'Invite like-minded guests who appreciate Indian culture and celebrations.',
  },
  {
    Icon: Lotus,
    title: 'Share Your Traditions',
    text: 'Showcase your unique ceremonies, customs, food and heritage.',
  },
  {
    Icon: Gift,
    title: 'Set Your Guest Contribution',
    text: 'Choose contribution amounts to help manage your wedding costs.',
  },
  {
    Icon: Shield,
    title: 'Stay in Control',
    text: 'You decide what to share, which events to open and who can join.',
  },
]

export default function WhyHostSection() {
  return (
    <section className="bg-white py-12 sm:py-14">
      <div className="shell">
        <SectionHeading
          title="Why Host Your Wedding?"
          subtitle="Turn your special moments into shared memories with people who value your culture and traditions."
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map(({ Icon, title, text }) => (
            <div
              key={title}
              className="rounded-xl border border-cream-300 bg-cream-50 p-5 text-center shadow-sm"
            >
              <span className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-cream-100 text-wine-700">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="font-display text-[14px] font-bold text-wine-700">{title}</h3>
              <p className="mt-1.5 text-[11.5px] leading-relaxed text-ink-soft">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
