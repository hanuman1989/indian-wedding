import WeddingEventCard from './WeddingEventCard';
import { getSortedWeddingEvents } from './weddingDetailUtils';

export default function WeddingEventList({ events = [] }) {
  const sortedEvents = getSortedWeddingEvents(events);

  if (!sortedEvents.length) {
    return <p className="border border-dashed border-gold-300 bg-cream-50 px-4 py-8 text-center text-sm text-ink-soft">No events have been added for this day yet.</p>;
  }

  return (
    <ol className="relative border-l-2 border-gold-200 pl-9">
      {sortedEvents.map((event, index) => (
        <li key={event?.id ?? index} className={index === sortedEvents.length - 1 ? '' : 'pb-7'}>
          <WeddingEventCard event={event} />
        </li>
      ))}
    </ol>
  );
}