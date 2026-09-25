import Image from 'next/image'
import { Calendar, HeartFilled, Leaf, MapPin, MessageCircle, WineGlass } from '@/components/Icons'
import {
  getAlcoholAvailability,
  getCoupleName,
  getEventCount,
  getGeneralLocation,
  getMainLanguage,
  getSortedWeddingImages,
  getWeddingDateRangeParts,
} from '@/components/weddingDetail/weddingDetailUtils'

function InfoRow({ Icon, primary, secondary, isWarning = false }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-wine-500" />
      <span>
        <span className={`block text-sm font-bold ${isWarning ? 'text-red-600' : 'text-wine-700'}`}>{primary}</span>
        <span className="block text-xs text-ink-soft">{secondary}</span>
      </span>
    </div>
  )
}

export default function BookingSidebar({ wedding }) {
  const weddingDays = wedding?.wedding_days || []
  const wedding_dates = wedding?.wedding_dates || ""
  const dayCount = weddingDays.length
  const eventCount = getEventCount(weddingDays)
  const alcohol = getAlcoholAvailability(wedding)
  const coverImage = getSortedWeddingImages(wedding?.images)[0]

  return (
    <aside className="space-y-5">
      <div className="border border-gold-200 bg-white p-5">
        {coverImage ? (
          <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-gold-200">
            <Image src={coverImage.url || coverImage.image_url} alt={`${wedding.couple_name} wedding photo`} fill unoptimized sizes="320px" className="object-cover" />
          </div>
        ) : null}

        <div className="mt-4 text-center">
          <h2 className="font-display text-2xl font-bold text-wine-700">
            {wedding.couple_name}
            </h2>
          <HeartFilled className="mx-auto mt-2 h-4 w-4 text-wine-400" />
        </div>

        <div className="mt-5 space-y-3.5 border-t border-gold-100 pt-4">
          <InfoRow Icon={Calendar} primary={wedding_dates} secondary={`${dayCount} ${dayCount === 1 ? 'Day' : 'Days'} \u2022 ${eventCount} ${eventCount === 1 ? 'Event' : 'Events'}`} />
          <InfoRow Icon={MapPin} primary={wedding.locations} secondary="India" />
          <InfoRow Icon={Leaf} primary={wedding.food_observance || 'Not specified'} secondary="Food" />
          <InfoRow Icon={WineGlass} primary={alcohol} secondary="Alcohol" isWarning={alcohol === 'Not available'} />
        </div>
      </div>

      <div className="border border-rose-100 bg-rose-50 p-5 text-center" style={{ backgroundImage: "url('/images/quote-bg.png')", backgroundSize: "cover",
              backgroundPosition: "center", }}>
        <HeartFilled className="mx-auto h-5 w-5 text-wine-400" />
        <p className="mt-2 text-xl leading-6 text-ink font-display">Your contribution will act as a gift to the couple and includes entry to all selected days and events.</p>
        <div className="mx-auto mt-3 flex items-center justify-center gap-2">
          <span aria-hidden="true" className="h-px w-8 bg-gold-300" />
          <HeartFilled className="h-3.5 w-3.5 text-wine-400" />
          <span aria-hidden="true" className="h-px w-8 bg-gold-300" />
        </div>
        <p className="mt-3 font-display text-lg italic leading-5 text-wine-500">Thank you for being a part<br />of our special day!</p>
      </div>
    </aside>
  )
}
