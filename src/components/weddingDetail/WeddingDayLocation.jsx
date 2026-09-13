import { MapPin } from '@/components/Icons';
import WeddingLocationMap from './WeddingLocationMap';
import { toCoordinate } from './weddingDetailUtils';

function getAddressLines(day) {
  return [
    day?.address_line_1,
    [day?.address_line_2, day?.landmark_near].filter(Boolean).join(', '),
    [day?.city, day?.state, day?.post_code].filter(Boolean).join(', '),
    day?.country || 'India',
  ].filter(Boolean);
}

export default function WeddingDayLocation({ weddingDay }) {
  const venueTitle = weddingDay?.venue_title || weddingDay?.venue_name || '';
  const addressLines = getAddressLines(weddingDay);
  const latitude = toCoordinate(weddingDay?.latitude);
  const longitude = toCoordinate(weddingDay?.longitude);
  const hasCoordinates = latitude !== null && longitude !== null;
  const directionsUrl = hasCoordinates ? `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}` : null;

  return (
    <section aria-labelledby="venue-location-heading" className="border border-gold-200 bg-white p-4 shadow-[0_10px_24px_-20px_rgba(108,10,34,0.45)] sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-wine-50 text-wine-600"><MapPin className="h-5 w-5" /></span>
          <div>
            <h3 id="venue-location-heading" className="font-display text-xl font-bold text-wine-700">Venue & Location</h3>
            {venueTitle && <p className="mt-1 text-sm font-semibold text-ink">{venueTitle}</p>}
            {addressLines.map((line, index) => (
              <p key={index} className={`text-sm ${index === 0 && !venueTitle ? 'mt-1 font-semibold text-ink' : 'text-ink-soft'}`}>{line}</p>
            ))}
          </div>
        </div>
        {directionsUrl && <a href={directionsUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-9 shrink-0 items-center rounded-md border border-wine-300 px-3 text-xs font-semibold text-wine-700 transition-colors hover:bg-wine-50 focus:outline-none focus:ring-2 focus:ring-wine-300">Get directions</a>}
      </div>
      <div className="mt-4"><WeddingLocationMap latitude={latitude} longitude={longitude} title={venueTitle || addressLines[0]} address={addressLines.join(', ')} /></div>
    </section>
  );
}