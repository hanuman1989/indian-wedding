import { Calendar, Check, HeartFilled, Leaf } from '@/components/Icons';
import WeddingDayLocation from './WeddingDayLocation';
import WeddingEventList from './WeddingEventList';
import { formatWeddingDate } from './weddingDetailUtils';

export default function WeddingDayDetails({ dayIndex, weddingDay }) {
  const dayNumber = weddingDay?.day_number || dayIndex + 1;

  return (
    <div className="mt-6 border border-gold-200 bg-cream-50/80 p-4 sm:p-6">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-gold-200 pb-4">
        <h3 className="font-display text-2xl font-bold text-wine-700">Day {dayNumber}</h3>
        <span className="flex items-center gap-1.5 text-sm text-ink-soft"><Calendar className="h-4 w-4 text-gold-500" />{formatWeddingDate(weddingDay?.wedding_day_date, { weekday: 'long' })} {weddingDay.wedding_day_time_format}</span>

        {weddingDay.is_day_expired && (
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
            <Check className="h-3.5 w-3.5 rounded-full bg-rose-700 p-0.5 text-white" />
            Completed
          </span>
        )}
      </div>
      {weddingDay.is_day_expired && (
        <div className="is_day_expired mt-4 flex flex-col gap-5 rounded-lg border border-rose-100 bg-rose-50/60 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-rose-100 text-wine-700">
              <Calendar className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-lg font-bold text-wine-700">This wedding day has been completed.</p>
              <p className="mt-1 text-sm text-ink-soft">The celebrations and events for this day have already taken place.</p>
              <p className="mt-1 text-sm italic text-rose-600">Thank you for being part of their special journey!</p>
            </div>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <div className="text-center">
              <p className="font-display text-md italic leading-tight text-wine-600">Cherished<br />Memories Always</p>
              <div className="mt-1.5 flex items-center justify-center gap-2 text-gold-500">
                <span className="h-px w-6 bg-gold-300" />
                <HeartFilled className="h-3 w-3" />
                <span className="h-px w-6 bg-gold-300" />
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.95fr)]">
        <section aria-labelledby="wedding-events-heading">
          <h3 id="wedding-events-heading" className="font-display text-xl font-bold text-wine-700">Events</h3>
          <div className="mt-3"><WeddingEventList events={weddingDay?.wedding_day_events} /></div>
        </section>
        <WeddingDayLocation weddingDay={weddingDay} />
      </div>
    </div>
  );
}