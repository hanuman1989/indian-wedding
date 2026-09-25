import Image from 'next/image';
import { Calendar, Clock, MapPin, Ticket } from '@/components/Icons';
import BookingStatusBadge from '@/components/myBooking/BookingStatusBadge';
import { formatDateTime } from './bookingDetailUtils';

export default function BookingHeroCard({ booking }) {
  const wedding = booking.wedding || {};
  const location = wedding.locations;

  return (
    <div className="overflow-hidden rounded-md border border-gold-200/80 bg-white shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-stretch">
        <div className="relative h-32 w-full shrink-0 overflow-hidden sm:h-32 sm:w-44 lg:h-auto lg:w-50">
          <Image
            src={wedding.cover_image}
            alt={`Wedding decor for ${wedding.couple_name}`}
            fill
            unoptimized
            sizes="192px"
            className="object-cover"
          />
        </div>

        <div className="min-w-0 flex-1 pt-2 pb-2">
          <BookingStatusBadge status={booking.status} />
          <h1 className="mt-2 truncate font-display text-lg font-bold text-wine-700 sm:text-lg">{wedding.couple_name}</h1>
          <div className="mt-3 space-y-2 text-sm text-ink-soft">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-wine-500" />
                {booking.booking_days_dates}
              </span>
              {booking.wedding_booking_time && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-wine-500" />
                  {booking.wedding_booking_time}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-wine-500" />
                  {location}
                </span>
              )}
              {wedding.food_observance && (
                <span className="flex items-center gap-1.5">
                  <Ticket className="h-4 w-4 text-wine-500" />
                  {wedding.food_observance}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid shrink-0 gap-3 rounded-xl bg-wine-50/60 p-4 sm:w-64">
          <div>
            <p className="text-xs text-ink-soft">Booking Number</p>
            <p className="mt-0.5 text-sm font-bold text-wine-700">{booking.booking_number}</p>
          </div>
          <div className="border-t border-gold-200/60 pt-3">
            <p className="text-xs text-ink-soft">Booked On</p>
            <p className="mt-0.5 text-sm font-semibold text-ink">{booking.created_at}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
