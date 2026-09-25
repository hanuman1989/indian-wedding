import Image from 'next/image';
import Link from 'next/link';
import { Mandap, ArrowRight } from '@/components/Icons';
import SectionHeader from './SectionHeader';

function DetailRow({ label, value }) {
  if (!value) return null;
  return (
    <li className="flex gap-2 text-sm">
      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
      <span className="text-ink-soft">
        {label}: <span className="font-semibold text-wine-700">{value}</span>
      </span>
    </li>
  );
}

export default function AboutWeddingCard({ booking }) {
  if (!booking) return null;

  const wedding = booking.wedding;
  const number_of_days = booking.wedding_days.length;
  const weddingDates = number_of_days > 1
    ? `${booking.booking_days_dates} (${number_of_days} days)`
    : booking.booking_days_dates;
  const location = [wedding.locations, wedding.state].filter(Boolean).join(', ');

  return (
    <div className="overflow-hidden rounded-2xl border border-gold-200/80 bg-white shadow-sm">
      <SectionHeader
        icon={Mandap}
        title="About the Wedding"
        action={
          <Link
            href={`/wedding-detail/${wedding.id}`}
            className="inline-flex items-center gap-1.5 rounded-md border border-wine-200 px-3 py-1.5 text-xs font-semibold text-wine-700 transition-colors hover:bg-wine-50"
          >
            View Wedding
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        }
      />
      <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-center">
        <ul className="grid gap-2.5">
          <DetailRow label="Couple Name" value={wedding.couple_name} />
          <DetailRow label="Bride Name" value={wedding.bride_name} />
          <DetailRow label="Groom Name" value={wedding.groom_name} />
          <DetailRow label="Wedding Dates" value={weddingDates} />
          <DetailRow label="Food Observance" value={wedding.food_observance} />
          <DetailRow label="Location" value={booking.booking_locations} />
        </ul>
        {wedding.cover_image && (
          <div className="relative h-40 w-full overflow-hidden rounded-xl lg:h-32">
            <Image
              src={wedding.cover_image}
              alt={`Wedding decor for ${wedding.couple_name}`}
              fill
              unoptimized
              sizes="240px"
              className="object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}
