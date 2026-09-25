import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Users, Ticket, FilePdf } from '@/components/Icons';
import BookingStatusBadge from '@/components/myBooking/BookingStatusBadge';
import DownloadInvitationButton from '@/components/common/DownloadInvitationButton';

export default function BookingCard({ booking }) {
    const wedding = booking.wedding;
  return (
    <article className="mt-4 grid overflow-hidden border border-gold-200/90 bg-white/80 shadow-sm md:grid-cols-[minmax(190px,0.9fr)_minmax(0,1.25fr)_148px]">
      <div className="relative min-h-48 md:min-h-full">
        <Image
          src={wedding.cover_image}
          alt={`Wedding decor for ${wedding.couple_name}`}
          fill
          unoptimized
          sizes="(min-width: 768px) 32vw, 100vw"
          className="object-cover object-[88%_62%]"
        />
        {booking.status && (
          <BookingStatusBadge
            status={booking.status}
            className="absolute left-3 top-3"
          />
        )}
      </div>

      <div className="p-5">
        <h3 className="font-display text-1xl font-bold text-wine-700">{wedding.couple_name}</h3>
        <dl className="mt-4 grid gap-2 text-sm text-ink-soft">
          <div className="flex items-center gap-2">
            <dt className="sr-only">Date</dt>
            <Calendar className="h-4 w-4 text-wine-500" />
            <dd>{booking.wedding_booking_date}</dd>
          </div>
          <div className="flex items-center gap-2">
            <dt className="sr-only">Time</dt>
            <Clock className="h-4 w-4 text-wine-500" />
            <dd>{booking.wedding_booking_time}</dd>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-wine-500" />
            <dd>{wedding.locations}</dd>
          </div>
          <div className="flex items-center gap-2">
            <dt className="sr-only">Food Observance</dt>
            <Ticket className="h-4 w-4 text-wine-500" />
            <dd>{wedding.food_observance}</dd>
          </div>
        </dl>
        <p className="mt-5 border-t border-gold-200/70 pt-3 text-xs font-medium text-ink-soft">
          Booking ID: {booking.booking_number}
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-gold-200/70 bg-gold-100/35 p-5 md:flex-col md:justify-center md:border-l md:border-t-0">
        <div className="text-center text-wine-700">
          <Users className="mx-auto h-6 w-6 text-gold-600" />
          <p className="mt-1 text-xs font-medium text-ink-soft">{booking.number_of_travelers} Guests</p>
        </div>
        <Link href={`/bookings/${booking.id}`} className="inline-flex min-h-10 items-center justify-center rounded-md bg-wine-700 px-4 text-xs font-semibold text-white transition-colors hover:bg-wine-600">
          View details
        </Link>
        {booking.status === "confirmed" && (
          <DownloadInvitationButton
            bookingId={booking.id}
            invoiceId={booking.booking_number}
            label="Download"
            showError={false}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-wine-700 transition-colors hover:text-wine-600"
            icon={FilePdf}
            iconClassName="h-6 w-6"
          />
        )}
      </div>
    </article>
  );
}
