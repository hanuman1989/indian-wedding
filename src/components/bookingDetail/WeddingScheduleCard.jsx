import { Calendar, Clock, MapPin } from '@/components/Icons';
import SectionHeader from './SectionHeader';

function DayRow({ day, dayNumber }) {
  const events = day.booking_day_events || [];

  return (
    <div className="flex flex-col gap-4 border-t border-gold-200/60 px-5 py-4 first:border-t-0 sm:flex-row sm:items-center sm:px-6">
      <div className="flex shrink-0 items-center gap-4 sm:w-55 sm:flex-col sm:items-start sm:gap-1.5 sm:border-r sm:border-gold-300 sm:pr-4">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-wine-700">
          <Calendar className="h-4 w-4 text-wine-500" />
          {day.wedding_day_format}
        </span>
        <span className="flex items-center gap-1.5 text-sm text-ink-soft">
          <Clock className="h-3.5 w-3.5 text-wine-500" />
          {day.wedding_day_time_format}
        </span>
      </div>

      <div className="min-w-0 flex-1 pl-2">
        <ul className="grid gap-1.5">
          {events.map((event) => (
            <li key={event.id} className="flex gap-2 text-sm">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
              <span className="font-semibold text-wine-700">{event.title}</span>
            </li>
          ))}
        </ul>
        {day.location && (
          <p className="mt-2 flex items-start gap-1.5 text-xs text-ink-soft">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-wine-500" />
            <span>{day.location}</span>
          </p>
        )}
      </div>

      <span className="inline-flex shrink-0 items-center justify-center self-start rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-wine-700 sm:self-center">
        Day {dayNumber}
      </span>
    </div>
  );
}

export default function WeddingScheduleCard({ weddingDays = [] }) {
  if (!weddingDays.length) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-gold-200/80 bg-white shadow-sm">
      <SectionHeader icon={Calendar} title="Wedding Schedule" />
      <div>
        {weddingDays.map((day, index) => (
          <DayRow key={day.id ?? index} day={day} dayNumber={day.day_number ?? index + 1} />
        ))}
      </div>
    </div>
  );
}
