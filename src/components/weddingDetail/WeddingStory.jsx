import { HeartFilled, Quote } from '@/components/Icons';
import { Mandala } from '@/components/Ornaments';
import CoupleInformation from './CoupleInformation';
import { getCoupleName } from './weddingDetailUtils';

export default function WeddingStory({ wedding }) {
  const story = wedding?.description || wedding?.story;
  const coupleName = getCoupleName(wedding);

  return (
    <section className="relative overflow-hidden border-y border-gold-200 bg-white py-10 sm:py-14">
      <Mandala className="pointer-events-none absolute -left-12 top-4 h-48 w-48 text-gold-300/25" petals={12} />
      <div className="shell relative">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-wine-50 text-wine-600"><HeartFilled className="h-5 w-5" /></span>
          <h2 className="font-display text-3xl font-bold text-wine-700">About {coupleName}</h2>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(16rem,1fr)]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">Our Story</p>
            {story ? (
              <p className="mt-2 text-sm leading-7 text-ink-soft sm:text-[15px]">{story}</p>
            ) : (
              <p className="mt-2 text-sm leading-7 text-ink-soft">Their story will be shared soon.</p>
            )}
            <CoupleInformation wedding={wedding} />
          </div>

          <blockquote className="relative border border-rose-100 bg-rose-50 p-6 text-center">
            <Quote className="mx-auto h-7 w-7 text-wine-400" />
            <p className="mt-3 font-display text-lg italic leading-7 text-wine-700">Every love story is beautiful, but ours is our favourite.</p>
            <div className="mt-4 flex items-center justify-center gap-2 text-gold-500">
              <span className="h-px w-8 bg-gold-300" />
              <HeartFilled className="h-3.5 w-3.5" />
              <span className="h-px w-8 bg-gold-300" />
            </div>
          </blockquote>
        </div>
      </div>
    </section>
  );
}