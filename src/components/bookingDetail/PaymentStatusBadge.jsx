import { Check } from '@/components/Icons';

// Maps Stripe payment-intent statuses to a label + color pair.
const STATUS_STYLES = {
  succeeded: { label: 'Succeeded', className: 'bg-green-100 text-green-700' },
  processing: { label: 'Processing', className: 'bg-amber-100 text-amber-700' },
  pending: { label: 'Pending', className: 'bg-amber-100 text-amber-700' },
  requires_action: { label: 'Requires Action', className: 'bg-amber-100 text-amber-700' },
  requires_payment_method: { label: 'Requires Payment', className: 'bg-red-100 text-red-700' },
  failed: { label: 'Failed', className: 'bg-red-100 text-red-700' },
  canceled: { label: 'Cancelled', className: 'bg-gray-200 text-gray-700' },
};

export default function PaymentStatusBadge({ status, prefix = '', className = '' }) {
  if (!status) return null;

  const style = STATUS_STYLES[status] || { label: status, className: 'bg-gray-100 text-gray-700' };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${style.className} ${className}`}>
      <Check className="h-3 w-3" />
      {prefix}{style.label}
    </span>
  );
}
