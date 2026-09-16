import { Calendar, Check, MapPin, Ticket } from '@/components/Icons'
import { formatWeddingDate, formatWeddingTime, getSortedWeddingDays, getSortedWeddingEvents } from '@/components/weddingDetail/weddingDetailUtils'
import StepHeader from './StepHeader'

function DayOption({ day, index, isSelected, onToggle }) {
  const dayNumber = day?.day_number || index + 1
  const events = getSortedWeddingEvents(day?.wedding_day_events)
  const eventNames = events.map((event) => event?.title).filter(Boolean).join(', ')
  const time = formatWeddingTime(day?.wedding_day_time)

  return (
    <label className={`flex cursor-pointer gap-3 border p-4 transition-colors ${isSelected ? 'border-wine-400 bg-rose-50' : 'border-gold-200 bg-white hover:border-wine-200'}`}>
      <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded border ${isSelected ? 'border-wine-700 bg-wine-700 text-cream-50' : 'border-gold-300 bg-white'}`}>
        {isSelected && <Check className="h-3.5 w-3.5" />}
      </span>
      <input type="checkbox" checked={isSelected} onChange={() => onToggle(day?.id ?? index)} className="sr-only" />
      <span className="min-w-0">
        <span className="flex flex-wrap items-baseline gap-x-2">
          <span className="font-display text-base font-bold text-wine-700">Day {dayNumber}</span>
          <span className="text-xs text-ink-soft">
            {day.wedding_day_format}
          </span>
        </span>
        <span className="flex flex-wrap items-baseline gap-x-2">
          <MapPin className="h-3.5 w-3.5 text-gold-500" />
          <span className="text-xs text-ink-soft">
            {day.location ?? ''}
          </span>
        </span>
        {time && <span className="mt-1 flex items-center gap-1.5 text-xs text-ink-soft"><Calendar className="h-3.5 w-3.5 text-gold-500" />{time} (approx)</span>}
        {eventNames && <span className="mt-1 flex items-center gap-1.5 text-xs text-ink-soft"><Ticket className="h-3.5 w-3.5 text-gold-500" /> {eventNames}</span>}
        
      </span>
    </label>
  )
}

export default function WeddingDaysPicker({ error, selectedDayIds, onToggleDay, weddingDays = [] }) {
  const sortedDays = getSortedWeddingDays(weddingDays)

  return (
    <section className="space-y-5 border border-gold-200 bg-white p-5 sm:p-7">
      <StepHeader number={2} title="Select Wedding Days" description="Choose the day(s) you plan to attend." />

      <div className="grid gap-3 sm:grid-cols-1">
        {sortedDays.map((day, index) => (
          <DayOption
            key={day.id}
            day={day}
            index={index}
            isSelected={selectedDayIds.includes(day.id)}
            onToggle={onToggleDay}
          />
        ))}
      </div>
      {error && <p role="alert" className="text-xs text-red-700">{error}</p>}
    </section>
  )
}
