import { Calendar } from '@/components/Icons';
import WeddingDayLocation from './WeddingDayLocation';
import WeddingEventList from './WeddingEventList';
import { formatWeddingDate } from './weddingDetailUtils';

export default function WeddingDayDetails({ dayIndex, weddingDay }) {
  const dayNumber = weddingDay?.day_number || dayIndex + 1;

  return (
    <div className="mt-6 border border-gold-200 bg-cream-50/80 p-4 sm:p-6">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-gold-200 pb-4">
        <h3 className="font-display text-2xl font-bold text-wine-700">Day {dayNumber}</h3>
        <span className="flex items-center gap-1.5 text-sm text-ink-soft"><Calendar className="h-4 w-4 text-gold-500" />{formatWeddingDate(weddingDay?.wedding_day_date, { weekday: 'long' })}</span>
      </div>
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