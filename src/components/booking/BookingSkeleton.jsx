export default function BookingSkeleton() {
    return (
    <section className="bg-cream-50 py-10 sm:py-14">
      <div className="shell animate-pulse">
        <div className="h-4 w-48 rounded bg-cream-200" />
        <div className="mt-6 h-10 w-2/3 rounded bg-cream-200" />
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(18rem,1fr)]">
          <div className="space-y-4">
            <div className="h-40 rounded bg-cream-200" />
            <div className="h-40 rounded bg-cream-200" />
            <div className="h-32 rounded bg-cream-200" />
            <div className="h-60 rounded bg-cream-200" />
          </div>
          <div className="h-96 rounded bg-cream-200" />
        </div>
      </div>
    </section>
  );
}