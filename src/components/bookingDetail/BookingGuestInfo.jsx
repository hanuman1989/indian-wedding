import { Mail, Phone, Globe, Users, UserPlus } from '@/components/Icons';

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex min-w-0 items-start gap-2.5 border-t border-gold-200/60 px-5 py-4 first:border-t-0 lg:border-l lg:border-t-0 lg:first:border-l-0">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-wine-500" />
      <span className="min-w-0">
        <span className="block text-xs text-ink-soft">{label}</span>
        <span className="block break-words text-sm font-semibold text-wine-700">{value}</span>
      </span>
    </div>
  );
}

export default function BookingGuestInfo({ booking }) {
  const user = booking.user || {};
  const guestName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || '—';

  const primaryItems = [
    { icon: UserPlus, label: 'Guest Name', value: guestName },
    { icon: Mail, label: 'Email', value: user.email || '—' },
  ];

  const secondaryItems = [
    { icon: Phone, label: 'Phone', value: user.phone || '—' },
    { icon: Globe, label: 'Visiting From', value: booking.visiting_from || '—' },
    { icon: Users, label: 'Travelers', value: `${booking.number_of_travelers ?? '—'} Guests` },
  ];

  return (
    <div className="overflow-hidden rounded-md border border-gold-200/80 bg-white shadow-sm">
      <div className="grid lg:grid-cols-2">
        {primaryItems.map((item) => (
          <InfoItem key={item.label} {...item} />
        ))}
      </div>
      <div className="grid border-t border-gold-200/60 lg:grid-cols-3">
        {secondaryItems.map((item) => (
          <InfoItem key={item.label} {...item} />
        ))}
      </div>
    </div>
  );
}
