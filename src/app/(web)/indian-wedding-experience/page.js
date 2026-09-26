import Link from 'next/link'
import Image from 'next/image';

import {
  ArrowRight,
  Calendar,
  Couple,
  Dance,
  Diya,
  Gift,
  HeartFilled,
  Leaf,
  Lotus,
  Mandap,
  Music,
  Plate,
  Shirt,
  Teacup,
  Users,
} from '@/components/Icons'
import { Flourish, SectionHeading } from '@/components/Ornaments'
import Breadcrumb from '@/components/common/Breadcrumb'

/* Icon + label used by the "why experience" 10-item grid (no card chrome) */
function IconLabel({ Icon, label }) {
  return (
    <li className="flex flex-col items-center text-center">
      <span className="mb-2 grid h-16 w-16 place-items-center rounded-full border border-gold-300/80 bg-cream-50 text-wine-700">
        <Icon className="h-10 w-10" />
      </span>
      <span className="text-[15px] font-semibold text-ink">{label}</span>
    </li>
  )
}

/* Photo (or icon fallback) + caption card reused by the "not a tourist" and "what will you experience" grids */
function HighlightCard({ Icon, label, image }) {
  return (
    <div className="flex h-full flex-col items-center overflow-hidden rounded-xl border border-cream-300 bg-white text-center shadow-sm">
      {image ? (
        <Image
          src={image}
          alt={label}
          width={400}
          height={112}
          className="h-28 w-full object-cover"
        />
      ) : (
        <span className="mx-auto mt-6 grid h-14 w-14 place-items-center rounded-full bg-cream-100 text-wine-700">
          <Icon className="h-6 w-6" />
        </span>
      )}

      <span className="px-3 py-4 text-[14px] font-semibold leading-snug text-wine-700">
        {label}
      </span>
    </div>
  );
}

/* Small icon + label row used inside the "your invitation" cream box */
function StepRow({ Icon, label }) {
  return (
    <li className="flex items-center gap-3">
      <span className="grid h-15 w-15 shrink-0 place-items-center rounded-full bg-cream-100 text-wine-700">
        <Icon className="h-10 w-10" />
      </span>
      <span className="text-[13px] font-semibold text-ink">{label}</span>
    </li>
  )
}

/* Destination card used by the "every wedding is different" grid */
function RegionCard({ name, accentClass, description, image }) {
  return (
    <div className="overflow-hidden rounded-xl border border-cream-300 bg-white shadow-sm">
      <div className={`h-2 w-full ${accentClass}`} />
      {image && (
        <Image
          src={image}
          alt={name}
          width={600}
          height={400}
          className="w-full object-cover"
        />
      )}

      <div className="p-4">
        <p className="text-[13px] font-bold uppercase tracking-wide text-wine-700">
          {name}
        </p>

        <p className="mt-1.5 text-[11.5px] leading-relaxed text-ink-soft">
          {description}
        </p>
      </div>
    </div>
  );
}

const whyExperienceIcons = [
  { Icon: Music, label: 'Music' },
  { Icon: Plate, label: 'Food' },
  { Icon: Users, label: 'Family' },
  { Icon: Lotus, label: 'Faith' },
  { Icon: Mandap, label: 'Traditions' },
  { Icon: Shirt, label: 'Clothing' },
  { Icon: Dance, label: 'Dance' },
  { Icon: Teacup, label: 'Hospitality' },
  { Icon: Diya, label: 'Rituals' },
  { Icon: Gift, label: 'Celebration' },
]

const guestHighlights = [
  { Icon: Couple, label: 'Meet the couple', image: '/images/meet-the-couple.png' },
  { Icon: Users, label: 'Meet their family and friends', image: '/images/meet-their-family-and-friends.png' },
  { Icon: Mandap, label: 'Discover their traditions', image: '/images/discover-their-traditions.png' },
  { Icon: Plate, label: 'Taste their food', image: '/images/taste-their-food.png' },
  { Icon: Music, label: 'Enjoy their music', image: '/images/enjoy-their-music.png' },
  { Icon: HeartFilled, label: 'Celebrate alongside them', image: '/images/celebrate-alongside-them.png' },
]

const experienceHighlights = [
  { Icon: Music, label: 'Music & Celebration', image: '/images/enjoy-their-music.png' },
  { Icon: Leaf, label: 'Mehendi', image: '/images/mehendi.png' },
  { Icon: Diya, label: 'Haldi', image: '/images/haldi.png' },
  { Icon: Couple, label: 'The Baraat (Core Experience)', image: '/images/the-baraat.png' },
  { Icon: Mandap, label: 'The Wedding Ceremony', image: '/images/the-wedding-ceremony.png' },
  { Icon: Plate, label: 'Indian Food', image: '/images/indian-food.png' },
  { Icon: Shirt, label: 'Colour, Clothing & Tradition', image: '/images/colour-clothing-and-tradition.png' },
]

const regions = [
  {
    name: 'Rajasthan',
    accentClass: 'bg-wine-700',
    description: 'Royal traditions • Colourful celebrations • Folk music • Grand venues',
    image: '/images/rajasthan.png',
  },
  {
    name: 'Delhi',
    accentClass: 'bg-gold-500',
    description: 'Contemporary celebrations • North Indian traditions • Diverse cultures',
    image: '/images/delhi.png',
  },
  {
    name: 'Agra',
    accentClass: 'bg-marigold-500',
    description: 'Heritage surroundings • Mughal-era atmosphere • Traditional celebrations',
    image: '/images/agra.png',
  },
  {
    name: 'Kerala',
    accentClass: 'bg-wine-500',
    description: 'Distinctive rituals • Traditional cuisine • Beautiful cultural heritage',
    image: '/images/kerala.png',
  },
  {
    name: 'Tamil Nadu',
    accentClass: 'bg-gold-600',
    description: 'Ancient traditions • Temple culture • Classical music • South Indian cuisine',
    image: '/images/tamil-nadu.png',
  },
]

const invitationSteps = [
  { Icon: Calendar, label: 'Choose a wedding' },
  { Icon: Users, label: 'Meet the family' },
  { Icon: Lotus, label: 'Experience the culture' },
]

export default function IndianWeddingExperience() {
  return (
    <div>
      {/* hero: full-bleed, sits flush under the header, photo as a right-side backdrop */}
      <section className="relative isolate min-h-[380px] overflow-hidden bg-cream-100 sm:min-h-[440px] lg:min-h-[520px]">
        <Image
        src="/images/phere.png"
        alt="Guests celebrating together at a real Indian wedding"
        fill
        priority
        className="absolute inset-0 -z-10 object-cover object-top"
      />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-cream-100 via-cream-100/95 to-cream-100/10" />

        <div className="shell relative flex min-h-[380px] items-center sm:min-h-[400px] lg:min-h-[420px] ">
          <div className="max-w-xl">
            <Breadcrumb
              items={[
                { title: 'Home', link: '/' },
                { title: 'The Indian Wedding Experience' },
              ]}
              shell={false}
              className="mb-5"
            />
            <h1 className="font-display text-[28px] font-bold leading-tight text-wine-700 sm:text-[34px] lg:text-[38px]">
              Experience India Through Real Weddings
            </h1>
            <p className="mt-4 text-[18px] font-bold text-ink">
              Not just a journey. A meaningful connection.
            </p>
            <p className="mt-4 text-[20px] leading-relaxed text-ink-soft">
              Step beyond sightseeing and into the heart of India — through its weddings.
              Discover the people, traditions, food, rituals and stories that make India
              truly extraordinary.
            </p>
          </div>
        </div>
      </section>

      <section
        className="relative isolate overflow-hidden bg-cream-100"
        style={{ backgroundImage: "url('/images/sectionbg.png')", backgroundPosition: 'center' }}
      >

        <div className="shell space-y-14 py-10 sm:space-y-16 sm:py-14 lg:space-y-20 lg:py-20">
        {/* why experience an indian wedding */}
        <section className="grid gap-8 lg:grid-cols-2 lg:gap-10">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-display text-[19px] font-bold uppercase tracking-wide text-wine-700 sm:text-[20px]">
                Why Experience an Indian Wedding?
              </h2>
            </div>

            <p className="mt-4 text-[16px] leading-relaxed text-ink-soft">
              A monument can show you India&apos;s history.
              <br />
              A museum can tell you about its culture.
              <br />
              A guide can explain its traditions.
              <br />
            </p>
            <p className="mt-2 font-semibold text-ink">
              But a wedding can let you live them.
            </p>

            <p className="mt-3 text-[16px] leading-relaxed text-ink-soft">
              An Indian wedding brings together almost everything that makes India
              extraordinary:
            </p>

            <ul className="mt-6 grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-5">
              {whyExperienceIcons.map(({ Icon, label }) => (
                <IconLabel key={label} Icon={Icon} label={label} />
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-gold-200 bg-cream-50 p-6 sm:p-8" style={{ backgroundImage: "url('/images/quote-bg.png')", backgroundSize: "cover",
              backgroundPosition: "center", }}>
            <p className="space-y-3 text-[18px] leading-relaxed text-ink-soft">
              <span className="block">
                You may watch a colourful Baraat make its way through the streets.
              </span>
              <span className="block">
                You may join guests during Mehendi or Sangeet.
              </span>
              <span className="block">
                You may discover the meaning behind the sacred wedding rituals.
              </span>
              <span className="block">
                You may share a meal with people you had never met before.
              </span>
            </p>

            <p className="mt-4 text-[18px] leading-relaxed text-ink-soft">
              And somewhere between the ceremonies, conversations and celebrations, you
              may realise that you are no longer simply visiting India.
            </p>

            <p className="mt-4 font-display text-[20px] font-bold text-wine-700 text-center">
              You are experiencing it from within.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 text-gold-500">
              <span className="h-px w-8 bg-gold-300" />
              <HeartFilled className="h-3.5 w-3.5" />
              <span className="h-px w-8 bg-gold-300" />
            </div>
          </div>
        </section>

        {/* not a tourist, a wedding guest */}
        <section>
          <SectionHeading
            title="Not a Tourist. A Wedding Guest."
            subtitle="There is a difference between seeing a culture and being welcomed into it."
          />

          <div className="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {guestHighlights.map(({ Icon, label, image }) => (
              <HighlightCard key={label} Icon={Icon} label={label} image={image} />
            ))}
          </div>

          <p className="mx-auto mt-8 max-w-4xl text-center text-[18px] leading-relaxed text-ink-soft">
            For a few unforgettable hours or days, experience India not as a{' '}
            <span className="font-semibold text-wine-700">tourist</span> — but as a
            guest.
          </p>
        </section>

        {/* your invitation to india */}
        <section className="grid gap-8 bg-cream-50 lg:grid-cols-[300px_1fr] lg:items-center">
          <img
            src="/images/mandap.png"
            alt="A decorated Indian wedding mandap and rituals"
            className="h-[200px] w-full max-w-[300px] rounded-xl object-cover sm:h-[300px] lg:h-[360px]"
          />

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,0.8fr)] lg:items-start">
            <div>
              <div className="flex items-center gap-3">
                <Flourish mirrored />
                <h2 className="font-display text-[17px] font-bold uppercase tracking-wide text-wine-700 sm:text-[19px]">
                  Your Invitation to India
                </h2>
                <Flourish />
              </div>

              <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
                Every wedding has a story. A couple. Two families. A place. A tradition.
                And a celebration that has been prepared with love.
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
                Through IWI, you can discover real weddings taking place across India and
                find a celebration that matches the kind of cultural experience you want
                to have.
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
                From the grandeur of a Rajasthani wedding in Jaipur to the traditions of
                South India, every region brings its own colours, customs, cuisine and
                way of celebrating.
              </p>
            </div>

            <div className="rounded-xl border border-gold-200 bg-white p-5">
              <ul className="space-y-3.5">
                {invitationSteps.map(({ Icon, label }) => (
                  <StepRow key={label} Icon={Icon} label={label} />
                ))}
              </ul>

              <Link
                href="/weddings"
                className="group mt-5 flex items-center justify-center gap-2 rounded-md bg-wine-700 px-5 py-3 text-[13px] font-semibold text-cream-50 transition-colors hover:bg-wine-600"
              >
                Discover Weddings
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* what will you experience */}
        <section>
          <SectionHeading title="What Will You Experience?" />

          <div className="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
            {experienceHighlights.map(({ Icon, label, image }) => (
              <HighlightCard key={label} Icon={Icon} label={label} image={image} />
            ))}
          </div>
        </section>

        {/* every wedding is different */}
        <section>
          <SectionHeading
            title="Every Wedding Is Different"
            subtitle="India does not have just one wedding culture. It has thousands."
          />

          <div className="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {regions.map((region) => (
              <RegionCard key={region.name} {...region} />
            ))}
          </div>
        </section>

        {/* final cta */}
        <section className="pb-4 text-center">
          <p className="font-display text-[19px] font-bold text-wine-700 sm:text-[22px]">
            Explore India through its weddings.
          </p>

          <Link
            href="/weddings"
            className="group mt-5 inline-flex items-center gap-2.5 rounded-md bg-wine-700 px-6 py-3 text-[13.5px] font-semibold text-cream-50 shadow-md shadow-wine-900/15 transition-colors hover:bg-wine-600"
          >
            Explore Destinations
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </section>
        </div>
      </section>
    </div>
  )
}