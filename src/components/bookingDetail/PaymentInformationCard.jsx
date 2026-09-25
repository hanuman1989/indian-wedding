import { Ticket } from '@/components/Icons';
import SectionHeader from './SectionHeader';
import PaymentStatusBadge from './PaymentStatusBadge';
import { formatCurrencyAmount } from './bookingDetailUtils';
import { useUserAuth } from '@/hooks/useUserAuth';

function Row({ label, value, highlight }) {
  return (
    <div className={`flex items-center justify-between gap-4 px-5 py-3 sm:px-6 ${highlight ? 'bg-rose-50' : ''}`}>
      <span className={`text-sm ${highlight ? 'font-semibold text-wine-700' : 'text-ink-soft'}`}>{label}</span>
      <span className={`text-sm font-semibold ${highlight ? 'text-base text-wine-700' : 'text-ink'}`}>{value}</span>
    </div>
  );
}

export default function PaymentInformationCard({ booking }) {
  const pricing = booking.pricing || {};
  const currency = pricing.currency || booking.currency || 'USD';
  const { user } = useUserAuth();

  return (
    <div className="overflow-hidden rounded-2xl border border-gold-200/80 bg-white shadow-sm">
      <SectionHeader
        icon={Ticket}
        title="Payment Information"
        action={<PaymentStatusBadge status={booking.payment?.status} prefix="Payment " />}
      />
      <div className="divide-y divide-gold-200/60">
        <Row label="Price per Person" value={formatCurrencyAmount(pricing.price_per_person, currency)} />
        <Row label={`Subtotal (${booking.number_of_travelers ?? 0} guests)`} value={formatCurrencyAmount(pricing.subtotal, currency)} />
        {user?.is_host && (
          <Row label="Platform Fee" value={formatCurrencyAmount(pricing.platform_fee, currency)} />
        )}
        {/* <Row label="Platform Fee" value={formatCurrencyAmount(pricing.platform_fee, currency)} /> */}
        <Row label="Total Amount" value={`${formatCurrencyAmount(user?.is_host ? pricing.payout_amount : pricing.total_amount, currency)} ${currency}`} highlight />
      </div>
    </div>
  );
}
