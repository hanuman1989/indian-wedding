// Maps backend booking status enums to a label + color pair.
const STATUS_STYLES = {
  pending_payment: { label: 'Pending Payment', className: 'bg-amber-100 text-amber-700' },
  pending: { label: 'Pending', className: 'bg-amber-100 text-amber-700' },
  confirmed: { label: 'Confirmed', className: 'bg-green-100 text-green-700' },
  payment_failed: { label: 'Payment Failed', className: 'bg-red-100 text-red-700' },
  cancelled: { label: 'Cancelled', className: 'bg-gray-200 text-gray-700' },
  expired: { label: 'Expired', className: 'bg-red-500 text-white' },
  completed: { label: 'Completed', className: 'bg-blue-100 text-blue-700' },
};

export default function BookingStatusBadge({ status, className = '' }) {
  if (!status) return null;

  const { label, className: statusClassName } = STATUS_STYLES[status] || {
    label: status,
    className: 'bg-gray-100 text-gray-700',
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClassName} ${className}`}>
      {label}
    </span>
  );
}
