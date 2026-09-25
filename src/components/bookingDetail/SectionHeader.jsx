export default function SectionHeader({ icon: Icon, title, action }) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-gold-200/70 px-5 py-4 sm:px-6">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-wine-50 text-wine-600">
        <Icon className="h-4 w-4" />
      </span>
      <h2 className="font-display text-lg font-bold text-wine-700">{title}</h2>
      <span className="h-px flex-1 border-t border-dashed border-gold-300" aria-hidden="true" />
      {action}
    </div>
  );
}
