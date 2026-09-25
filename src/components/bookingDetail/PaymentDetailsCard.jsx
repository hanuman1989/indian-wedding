import { CreditCard } from '@/components/Icons';
import SectionHeader from './SectionHeader';
import PaymentStatusBadge from './PaymentStatusBadge';

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3 sm:px-6">
      <span className="text-sm text-ink-soft">{label}</span>
      <span className="max-w-[60%] truncate text-right text-sm font-semibold text-ink">{value}</span>
    </div>
  );
}

export default function PaymentDetailsCard({ booking }) {
  const payment = booking.payment || {};

  return (
    <div className="overflow-hidden rounded-2xl border border-gold-200/80 bg-white shadow-sm">
      <SectionHeader icon={CreditCard} title="Payment Details" />
      <div className="divide-y divide-gold-200/60">
        <Row label="Payment Status" value={<PaymentStatusBadge status={payment.status} />} />
        <Row label="Payment ID" value={payment.payment_id ?? '—'} />
        <Row label="Payment Intent ID" value={payment.payment_intent_id || '—'} />
      </div>
    </div>
  );
}
