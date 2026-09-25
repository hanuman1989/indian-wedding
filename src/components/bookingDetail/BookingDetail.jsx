import BookingHeroCard from './BookingHeroCard';
import BookingGuestInfo from './BookingGuestInfo';
import PaymentInformationCard from './PaymentInformationCard';
import PaymentDetailsCard from './PaymentDetailsCard';
import AboutWeddingCard from './AboutWeddingCard';
import WeddingScheduleCard from './WeddingScheduleCard';
import InvitationCard from './InvitationCard';

export default function BookingDetail({ booking }) {
  if (!booking) return null;
  const wedding = booking.wedding;

  return (
    <div className="grid gap-6">
      <BookingHeroCard booking={booking} />
      <BookingGuestInfo booking={booking} />

      <div className="grid gap-6 lg:grid-cols-2">
        <PaymentInformationCard booking={booking} />
        <PaymentDetailsCard booking={booking} />
      </div>

      <AboutWeddingCard booking={booking} />
      <WeddingScheduleCard weddingDays={booking?.wedding_days} />
      <InvitationCard wedding={wedding} invoiceId={booking.booking_number} bookingId={booking?.id} />
    </div>
  );
}
