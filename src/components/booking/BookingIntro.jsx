import { Flourish } from '@/components/Ornaments'
import { getCoupleName } from '@/components/weddingDetail/weddingDetailUtils'

export default function BookingIntro({ wedding }) {
  const coupleName = getCoupleName(wedding)

  return (
    <div className="shell relative mt-4">
      <p className="pointer-events-none absolute right-0 top-0 hidden max-w-[10rem] text-right font-display text-lg italic leading-6 text-wine-300 lg:block">
        Together<br />is a beautiful<br />beginning
      </p>

      <h1 className="max-w-2xl font-display text-3xl font-bold text-wine-700 sm:text-4xl">Join {coupleName}&apos;s Wedding</h1>
      <p className="mt-2 max-w-xl text-sm leading-6 text-ink-soft">We&apos;re so happy you&apos;ll be joining us for our special celebration!</p>

      <div className="mt-5 flex items-center gap-3">
        <Flourish mirrored />
        <Flourish />
      </div>
    </div>
  )
}
