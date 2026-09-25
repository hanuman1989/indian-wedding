import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, Users, ArrowRight, MoreVertical } from '@/components/Icons';
import BookingStatusBadge from '@/components/myBooking/BookingStatusBadge';

export default function BookingListCard({ booking, isHost }) {
  const wedding = booking.wedding;
  const guestName = `${booking.user.first_name || ''} ${booking.user.last_name || ''}`.trim();
  const amount = isHost ? booking.payout_amount : booking.total_amount;

  return (
    <article className="mt-4 flex flex-col gap-2 rounded-xl border border-gold-200/80 bg-white p-2 shadow-sm md:flex-row md:items-center md:gap-0 md:divide-x md:divide-gold-200/70">
      <div className="flex items-center gap-3 md:w-[45%] md:pr-4">
        <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md">
          <Image
            src={wedding.cover_image}
            alt={`Wedding decor for ${wedding.couple_name}`}
            fill
            unoptimized
            sizes="96px"
            className="object-cover object-[88%_62%]"
          />
        </div>
        <div className="min-w-0">
          <h3 className="truncate font-display text-base font-bold text-wine-700">{wedding.couple_name}</h3>
          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-ink-soft">
            <Calendar className="h-3.5 w-3.5 shrink-0 text-wine-500" />
            <span className="truncate">{booking.wedding_booking_date}</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-ink-soft">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-wine-500" />
            <span className="truncate">{wedding.locations}</span>
          </div>
        </div>
      </div>

      <div className="md:w-[25%] md:px-4">
        <p className="text-xs text-ink-soft">Guest Name</p>
        <p className="mt-1 truncate text-sm font-bold text-wine-700">{guestName}</p>
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-ink-soft">
          <Users className="h-3.5 w-3.5 text-wine-500" />
          <span>{booking.number_of_travelers} Guests</span>
        </div>
      </div>

      <div className="md:w-[35%] md:px-4">
        <p className="text-xs text-ink-soft">Amount</p>
        <p className="mt-1 text-sm font-bold text-wine-700">${Number(amount || 0).toLocaleString('en-IN')}</p>
        <div className="mt-1.5 flex items-start gap-1.5 text-xs leading-tight text-ink-soft">
          <Calendar className="mt-0.5 h-3.5 w-3.5 shrink-0 text-wine-500" />
          <span>
            Booked On
            <br />
            {booking.created_at}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 md:w-[25%] md:justify-start md:gap-6 md:px-4">
        <div className="flex flex-col items-start gap-2">
          <BookingStatusBadge status={booking.status} />
          <Link
            href={`/bookings/${booking.id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-wine-700 transition-colors hover:text-wine-500"
          >
            View Details
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
