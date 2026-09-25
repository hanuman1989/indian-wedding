import { HeartFilled, Quote } from '@/components/Icons';
import { Mandala } from '@/components/Ornaments';
import CoupleInformation from './CoupleInformation';
import { getCoupleName } from './weddingDetailUtils';

export default function WeddingStory({ wedding }) {
  const story = wedding?.description;
  const coupleName = getCoupleName(wedding);

  return (
    <section className="relative overflow-hidden ">
      <div className="shell relative bg-white rounded-lg p-6 sm:p-8 lg:p-10">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-wine-50 text-wine-600"><HeartFilled className="h-5 w-5" /></span>
          <h2 className="font-display text-[20px] font-bold text-wine-700">About {wedding.couple_name}</h2>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(16rem,1fr)]">
          <div>
            <p className="text-md font-semibold uppercase tracking-wide text-gold-600">Our Story</p>
            {story ? (
              <p className="mt-2 text-sm leading-7 text-ink-soft sm:text-[15px]">
                {story.split(/\r?\n/).map((line, index) => (
                  <span key={`${line}-${index}`}>
                    {line}
                    {index < story.split(/\r?\n/).length - 1 && <br />}
                  </span>
                ))}
              </p>
            ) : (
              <p className="mt-2 text-sm leading-7 text-ink-soft">Their story will be shared soon.</p>
            )}
            <CoupleInformation wedding={wedding} />
          </div>

          <blockquote
            className="relative flex h-full flex-col items-center justify-center border border-rose-100 bg-cover bg-center p-6 text-center"
            style={{ backgroundImage: "url('/images/quote-bg.png')", backgroundSize: "cover",
              backgroundPosition: "center", }}
          >
            <Quote className="mx-auto h-7 w-7 text-wine-400" />
            <p className="mt-3 font-display text-2xl italic leading-7 text-wine-700">Every love story is beautiful, but ours is our favourite.</p>
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