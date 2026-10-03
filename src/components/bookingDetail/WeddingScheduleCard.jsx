import { Calendar, Clock, MapPin, Music, WineGlass } from '@/components/Icons';
import SectionHeader from './SectionHeader';

function isEnabled(value) {
  return value === true || value === 1 || value === '1' || value === 'true';
}

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
        <ul className="grid gap-2.5">
          {events.map((event, index) => {
            const musicEnabled = isEnabled(event.is_music_or_dancing);
            const alcoholEnabled = isEnabled(event.is_alcohol_offered);
            const alcoholSpecified = [true, false, 1, 0, '1', '0', 'true', 'false'].includes(event.is_alcohol_offered);

            return (
              <li key={event.id ?? index} className="flex items-start gap-3 rounded-xl border border-gold-200/60 bg-cream-50/50 p-3 sm:p-4">
                <span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-wine-50 text-xs font-semibold text-wine-700">{index + 1}</span>
                <div className="min-w-0 flex-1">
                  <h4 className="break-words text-sm font-semibold leading-5 text-wine-700">{event.title || 'Wedding event'}</h4>
                  {event.description && <p className="mt-1 break-words text-xs leading-5 text-ink-soft">{event.description}</p>}
                  {(musicEnabled || alcoholSpecified) && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {musicEnabled && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-100 bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700">
                          <Music className="h-3.5 w-3.5 shrink-0" />
                          Music & dancing
                        </span>
                      )}
                      {alcoholSpecified && (
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${alcoholEnabled ? 'border-amber-100 bg-amber-50 text-amber-800' : 'border-gray-200 bg-gray-50 text-gray-600'}`}>
                          <span className="relative inline-flex shrink-0">
                            <WineGlass className="h-3.5 w-3.5" />
                            {!alcoholEnabled && <span aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px -rotate-45 bg-current" />}
                          </span>
                          {alcoholEnabled ? 'Alcohol offered' : 'No alcohol'}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
        {day.location && (
          <div className="mt-3 flex items-start gap-3 bg-white p-3 sm:p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-wine-50 text-wine-600">
              <MapPin className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-md font-semibold text-wine-700">Venue & Location</p>
              <p className="mt-1 whitespace-pre-line break-words text-sm leading-5 text-ink-soft">{day.location}</p>
            </div>
          </div>
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
