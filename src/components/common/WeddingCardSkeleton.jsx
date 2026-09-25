export default function WeddingCardSkeleton({ className = '' }) {
  return (
    <div className={`flex animate-pulse flex-col overflow-hidden rounded-xl border border-cream-300 bg-white ${className}`}>
      <div className="aspect-[16/9] bg-cream-200" />
      <div className="space-y-3 p-3">
        <div className="h-4 w-3/5 rounded bg-cream-200" />
        <div className="space-y-2">
          <div className="h-3 w-4/5 rounded bg-cream-100" />
          <div className="h-3 w-3/4 rounded bg-cream-100" />
          <div className="h-3 w-2/3 rounded bg-cream-100" />
        </div>
        <div className="border-t border-cream-200 pt-2.5">
          <div className="h-8 w-24 rounded-md bg-cream-200" />
        </div>
      </div>
    </div>
  )
}
