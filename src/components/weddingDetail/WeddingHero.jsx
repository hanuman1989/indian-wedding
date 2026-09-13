import { Mandala } from '@/components/Ornaments';
import WeddingImageCarousel from './WeddingImageCarousel';
import WeddingSummary from './WeddingSummary';

export default function WeddingHero({ canJoinWedding, onJoinWedding, wedding }) {
  return (
    <section className="relative overflow-hidden bg-cream-50 py-7 sm:py-10">
      <Mandala className="pointer-events-none absolute -right-10 top-4 h-44 w-44 text-gold-300/30" petals={12} />
      <div className="shell relative grid items-center gap-6 lg:grid-cols-2 lg:gap-8">
        <WeddingImageCarousel wedding={wedding} />
        <WeddingSummary wedding={wedding} canJoinWedding={canJoinWedding} onJoinWedding={onJoinWedding} />
      </div>
    </section>
  );
}