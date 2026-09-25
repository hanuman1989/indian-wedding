import Link from 'next/link';
import { ArrowRight, Calendar, HeartFilled, Leaf, Search, Star } from '@/components/Icons';

export default function BookingBlankCard({ isHost }) {
  return (
    <article
      className="relative mt-4 overflow-hidden rounded-lg border border-gold-200/70 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/list-card-bg.png')" }}
    >
      <div className="relative flex flex-col items-center gap-4 px-6 py-12 text-center sm:py-16">
        <div className="relative flex items-center justify-center">
          <Leaf className="absolute -left-12 top-1/2 h-8 w-8 -translate-y-1/2 -scale-x-100 text-gold-500/60" />
          <Leaf className="absolute -right-12 top-1/2 h-8 w-8 -translate-y-1/2 text-gold-500/60" />
          <Star className="absolute -left-5 -top-4 h-3.5 w-3.5 text-gold-400" />
          <Star className="absolute -right-4 -top-2 h-3 w-3 text-gold-400" />

          <span className="relative grid h-20 w-20 place-items-center rounded-full bg-rose-100">
            <Calendar className="h-10 w-10 text-wine-700" />
            <HeartFilled className="absolute h-4 w-4 text-rose-600" />
          </span>
        </div>

        <div>
          <h3 className="font-display text-xl font-bold text-wine-700">No Bookings Yet</h3>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">
            {isHost ? "You haven't received any bookings for your weddings yet. Share your wedding details and start receiving guests!" : "You haven't booked any weddings yet. Start exploring and find the perfect wedding to be a part of!"}
           
          </p>
        </div>

        <Link
          href={isHost ? "/my-weddings" : "/weddings"}
          className="mt-1 inline-flex min-h-11 items-center gap-2 rounded-md bg-wine-700 px-5 text-sm font-semibold text-cream-50 shadow-sm transition-colors hover:bg-wine-600"
        >
          {!isHost && <Search className="h-4 w-4" />}
          {isHost ? "View My Weddings" : "Search Weddings"}
          {isHost && <ArrowRight className="h-4 w-4" />}
        </Link>

        {!isHost && (
          <Link
          href="/weddings"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-wine-700 transition-colors hover:text-wine-500"
        >
          Browse All Weddings
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        )}
      </div>
    </article>
  );
}
