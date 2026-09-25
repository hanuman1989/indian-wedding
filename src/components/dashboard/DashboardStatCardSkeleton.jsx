export default function DashboardStatCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-gold-200/80 bg-white p-5 shadow-sm">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cream-200" />
      <div className="mt-4 h-7 w-16 rounded bg-cream-200" />
      <div className="mt-2 h-4 w-24 rounded bg-cream-100" />
    </div>
  );
}
