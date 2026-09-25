export default function BookingCardSkeleton() {
  return (
    <article className="mt-4 grid animate-pulse overflow-hidden border border-gold-200/90 bg-white/80 shadow-sm md:grid-cols-[minmax(190px,0.9fr)_minmax(0,1.25fr)_148px]">
      <div className="min-h-48 bg-cream-200 md:min-h-full" />

      <div className="p-5">
        <div className="h-6 w-2/3 rounded bg-cream-200" />
        <div className="mt-4 space-y-3">
          <div className="h-4 w-1/2 rounded bg-cream-100" />
          <div className="h-4 w-2/5 rounded bg-cream-100" />
          <div className="h-4 w-3/5 rounded bg-cream-100" />
        </div>
        <div className="mt-5 border-t border-gold-200/70 pt-3">
          <div className="h-3 w-1/3 rounded bg-cream-100" />
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-gold-200/70 bg-gold-100/35 p-5 md:flex-col md:justify-center md:border-l md:border-t-0">
        <div className="flex flex-col items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-cream-200" />
          <div className="h-3 w-14 rounded bg-cream-200" />
        </div>
        <div className="h-10 w-24 rounded-md bg-cream-200" />
      </div>
    </article>
  );
}
