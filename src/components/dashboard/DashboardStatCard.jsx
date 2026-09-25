export default function DashboardStatCard({ icon: Icon, value, label, iconBgClass, iconColorClass }) {
  return (
    <div className="rounded-2xl border border-gold-200/80 bg-white p-5 shadow-sm">
      <span className={`flex h-12 w-12 items-center justify-center rounded-full ${iconBgClass}`}>
        <Icon className={`h-6 w-6 ${iconColorClass}`} />
      </span>
      <p className="mt-4 text-2xl font-bold text-wine-700">{value}</p>
      <p className="mt-1 text-sm text-ink-soft">{label}</p>
    </div>
  );
}
