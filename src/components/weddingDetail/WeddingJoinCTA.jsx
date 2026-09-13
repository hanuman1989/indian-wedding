import { ArrowRight, Users } from '@/components/Icons';
import { MarigoldGarland } from '@/components/Ornaments';

export default function WeddingJoinCTA({ canJoinWedding, onJoinWedding }) {
  if (!canJoinWedding) return null;

  return (
    <section className="relative overflow-hidden border-y border-gold-200 bg-cream-100 py-10 sm:py-12">
      <MarigoldGarland className="absolute inset-x-0 top-0 h-6 w-full opacity-70" count={30} />
      <div className="shell relative mt-4 flex flex-col items-center justify-between gap-5 text-center md:flex-row md:text-left">
        <div>
          <h2 className="font-display text-3xl font-bold text-wine-700">We Look Forward to Celebrating with You</h2>
          <p className="mt-2 text-sm leading-6 text-ink-soft">Your presence will make our wedding even more special. Join us and create beautiful memories together.</p>
        </div>
        <button type="button" onClick={onJoinWedding} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-wine-700 px-6 text-sm font-semibold text-cream-50 shadow-sm transition-colors hover:bg-wine-600 focus:outline-none focus:ring-2 focus:ring-wine-300">
          <Users className="h-4 w-4" />
          Join Our Wedding
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}