import { Minus, Plus } from '@/components/Icons'
import StepHeader from './StepHeader'

export default function TravelersStepper({ error, travelerCount, onChange }) {
  const decrease = () => onChange(Math.max(1, travelerCount - 1))
  const increase = () => onChange(Math.min(20, travelerCount + 1))

  return (
    <section className="space-y-5 border border-gold-200 bg-white p-5 sm:p-7">
      <StepHeader number={3} title="Number of Travelers" description="Let us know how many people will be attending from your side." />

      <div className="flex items-center gap-3">
        <button type="button" onClick={decrease} aria-label="Decrease travelers" className="grid h-11 w-11 place-items-center border border-gold-200 bg-cream-50 text-wine-700 transition-colors hover:bg-cream-100 focus:outline-none focus:ring-2 focus:ring-wine-300">
          <Minus className="h-4 w-4" />
        </button>
        <span className="grid h-11 w-16 place-items-center border border-gold-200 bg-wine-700 text-base font-bold text-cream-50">{travelerCount}</span>
        <button type="button" onClick={increase} aria-label="Increase travelers" className="grid h-11 w-11 place-items-center border border-gold-200 bg-cream-50 text-wine-700 transition-colors hover:bg-cream-100 focus:outline-none focus:ring-2 focus:ring-wine-300">
          <Plus className="h-4 w-4" />
        </button>
        <span className="text-sm font-medium text-ink-soft">person(s)</span>
      </div>
      {error && <p role="alert" className="text-xs text-red-700">{error}</p>}
    </section>
  )
}
