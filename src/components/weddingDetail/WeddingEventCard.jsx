import { HeartFilled, Rings } from '@/components/Icons';
import { formatWeddingTime } from './weddingDetailUtils';

export default function WeddingEventCard({ event }) {
  const startTime = formatWeddingTime(event?.start_time || event?.event_start_time || event?.start);
  const endTime = formatWeddingTime(event?.end_time || event?.event_end_time || event?.end);
  const time = [startTime, endTime].filter(Boolean).join(' - ');

  return (
    <div className="relative">
      <span className="absolute -left-[3.375rem] top-0 grid h-9 w-9 place-items-center rounded-full border-4 border-cream-50 bg-gold-100 text-wine-600">
        <Rings className="h-4 w-4" />
      </span>
      {time && <p className="text-xs font-bold text-wine-700">{time}</p>}
      <h4 className={`font-display text-xl font-bold text-wine-700 ${time ? 'mt-1' : ''}`}>{event?.title || 'Wedding event'}</h4>
      {event?.description && <p className="mt-1.5 text-sm leading-6 text-ink-soft">{event.description}</p>}
      {(event?.dress_code || event?.is_music_or_dancing) && (
        <div className="mt-2.5 flex flex-wrap gap-2">
          {event?.dress_code && <span className="border border-gold-200 bg-cream-50 px-2.5 py-1 text-xs font-medium text-ink-soft">Dress code: {event.dress_code}</span>}
          {event?.is_music_or_dancing && <span className="inline-flex items-center gap-1 border border-wine-100 bg-wine-50 px-2.5 py-1 text-xs font-medium text-wine-600"><HeartFilled className="h-3.5 w-3.5" />Music and dancing</span>}
        </div>
      )}
    </div>
  );
}