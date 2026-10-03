"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import APIs from "@/lib/apis";
import {
  Calendar,
  MapPin,
  Users,
  Globe,
  Plate,
  BookHeart,
  Music,
  WineGlass,
} from "@/components/Icons";
import {
  formatWeddingDate,
  formatWeddingDateRange,
  formatWeddingTime,
  getPersonName,
  getWeddingParty,
  getSortedWeddingDays,
  getSortedWeddingEvents,
} from "@/components/weddingDetail/weddingDetailUtils";

const card = "rounded-xl border border-gold-200/70 bg-white shadow-sm";
const button =
  "inline-flex min-h-9 items-center justify-center rounded-md border border-gray-200 bg-white px-3 text-xs font-medium text-ink-soft hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-wine-500";

function Status({ value = "Unknown" }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize ${String(value).toLowerCase() === "published" ? "bg-green-100 text-green-700" : "bg-amber-50 text-amber-700"}`}
    >
      {value}
    </span>
  );
}

function Heading({ icon: Icon, children }) {
  return (
    <h2 className="flex items-center gap-3 border-b border-gold-200/60 px-5 py-3 text-sm font-bold text-wine-700">
      <Icon className="h-5 w-5 text-wine-500" />
      {children}
    </h2>
  );
}

function Photo({ src, alt, sizes }) {
  const [failed, setFailed] = useState(false);
  return src && !failed ? (
    <Image
      src={src}
      alt={alt}
      fill
      unoptimized
      sizes={sizes}
      className="object-cover"
      onError={() => setFailed(true)}
    />
  ) : (
    <div className="flex h-full items-center justify-center bg-rose-50 p-3 text-center text-xs text-ink-soft">
      Wedding image unavailable
    </div>
  );
}

function Gallery({ wedding, name }) {
  const photos = wedding.images || [];
  const urls = [
    ...new Set(
      [
        wedding.cover_image,
        ...photos.map((photo) =>
          typeof photo === "string"
            ? photo
            : photo.url || photo.image_url || photo.path || photo.photo,
        ),
      ].filter(Boolean),
    ),
  ];
  const [selected, setSelected] = useState(0);
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
        <Photo
          key={urls[selected] || "empty"}
          src={urls[selected]}
          alt={`Wedding portrait of ${name}`}
          sizes="(max-width: 1280px) 100vw, 340px"
        />
      </div>
      <div className="mt-2 grid grid-cols-5 gap-1.5">
        {(expanded ? urls : urls.slice(0, 5)).map((url, index) => (
          <button
            key={url}
            type="button"
            aria-label={
              index === 4 && !expanded && urls.length > 5
                ? "Show all wedding photos"
                : `View wedding photo ${index + 1}`
            }
            aria-pressed={selected === index}
            onClick={() => {
              setSelected(index);
              if (index === 4) setExpanded(true);
            }}
            className="relative aspect-[5/4] overflow-hidden rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine-500"
          >
            <Photo src={url} alt={`Wedding photo ${index + 1}`} sizes="70px" />
            {index === 4 && !expanded && urls.length > 5 && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-bold text-white">
                +{urls.length - 4}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function ScheduleDay({ day, index }) {
  const events = getSortedWeddingEvents(
    day.wedding_day_events || day.booking_day_events || [],
  );
  const venue = day.venue_title || day.venue_name;
  const address =
    [
      day.address_line_1,
      day.address_line_2,
      day.landmark_near,
      day.city,
      day.state,
      day.post_code,
    ]
      .filter(Boolean)
      .join(", ") ||
    day.location ||
    "";
  const hasCoordinates = [day.latitude, day.longitude].every(
    (value) =>
      value !== null &&
      value !== undefined &&
      value !== "" &&
      Number.isFinite(Number(value)),
  );
  const query = hasCoordinates
    ? `${day.latitude},${day.longitude}`
    : [venue, address].filter(Boolean).join(", ");
  return (
    <article className="grid overflow-hidden rounded-lg border border-gold-200/70 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <div className="grid gap-3 p-3 sm:grid-cols-[minmax(0,1fr)_128px] lg:border-r lg:border-gold-200/60">
        <div className="space-y-3">
          <div className="flex gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-wine-500">
              <Calendar className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-bold text-wine-700">
                Day {day.day_number || index + 1}
              </h3>
              <p className="text-sm font-semibold text-ink">
                {day.wedding_day_format ||
                  formatWeddingDate(day.wedding_day_date, { weekday: "long" })}
              </p>
              <p className="text-sm text-ink-soft">
                {day.wedding_day_time_format ||
                  formatWeddingTime(day.wedding_day_time) ||
                  "Time to be announced"}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <MapPin className="mx-2 mt-0.5 h-5 w-5 shrink-0 text-wine-500" />
            <div className="text-xs">
              <p className="font-semibold text-ink">
                {venue || "Venue to be announced"}
              </p>
              <p className="mt-0.5 leading-4 text-ink-soft">
                {address || "Address to be announced"}
              </p>
            </div>
          </div>
        </div>
        <div className="relative min-h-32 overflow-hidden rounded-lg border border-gray-200 bg-rose-50">
          {query ? (
            <>
              <iframe
                title={`Venue map for day ${index + 1}`}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`}
                loading="lazy"
                className="h-full min-h-32 w-full border-0"
              />
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`}
                target="_blank"
                rel="noreferrer"
                className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-wine-400 bg-white px-3 py-1.5 text-xs font-semibold text-wine-700"
              >
                View on Map
              </a>
            </>
          ) : (
            <p className="p-4 text-center text-xs text-ink-soft">
              Map unavailable
            </p>
          )}
        </div>
      </div>
      <div className="px-5 py-3">
        <h4 className="mb-2 text-sm font-bold text-wine-700">
          Events ({events.length})
        </h4>
        {events.length ? (
          <ol className="divide-y divide-gold-200/50">
            {events.map((event, eventIndex) => (
              <li
                key={event.id ?? eventIndex}
                className="flex items-start gap-3 py-2 first:pt-0"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-50 text-sm font-bold text-wine-700">
                  {eventIndex + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h5 className="text-sm font-semibold text-wine-700">
                    {event.title || "Wedding event"}
                  </h5>
                  <p className="mt-0.5 text-xs leading-4 text-ink-soft">
                    {event.description || "No description provided."}
                  </p>
                </div>
                <div className="flex shrink-0 gap-3 pt-1">
                  {Boolean(event.is_music_or_dancing) && (
                    <span
                      aria-label="Music and dancing"
                      title="Music and dancing"
                    >
                      <Music className="h-5 w-5 text-sky-500" />
                    </span>
                  )}
                  <span
                    className="relative"
                    aria-label={
                      event.is_alcohol_offered
                        ? "Alcohol offered"
                        : "No alcohol offered"
                    }
                    title={
                      event.is_alcohol_offered
                        ? "Alcohol offered"
                        : "No alcohol offered"
                    }
                  >
                    <WineGlass
                      className={`h-5 w-5 ${event.is_alcohol_offered ? "text-amber-500" : "text-red-500"}`}
                    />
                    {!event.is_alcohol_offered && (
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-2 h-0.5 w-5 rotate-45 bg-red-500"
                      />
                    )}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-ink-soft">
            No events have been added for this day.
          </p>
        )}
      </div>
    </article>
  );
}

export default function WeddingDetail({ weddingId }) {
  const [wedding, setWedding] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    let isCurrent = true;
    async function loadWedding() {
      setIsLoading(true);
      setErrorMessage("");
      setWedding(null);
      try {
        const response =
          await APIs.admin.weddingBooking.getWeddingDetail(weddingId);
        if (!isCurrent) return;
        if (response?.data) setWedding(response.data);
        else
          setErrorMessage(
            "We couldn't find a wedding with that wedding number.",
          );
      } catch (error) {
        if (isCurrent)
          setErrorMessage(
            error?.message || "Unable to load this wedding. Please try again.",
          );
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }
    void loadWedding();
    return () => {
      isCurrent = false;
    };
  }, [weddingId]);

  if (isLoading)
    return (
      <div
        role="status"
        aria-label="Loading wedding details"
        className="space-y-3"
      >
        <div className="h-72 animate-pulse rounded-xl bg-rose-50" />
        <div className="grid gap-3 md:grid-cols-2">
          <div className="h-52 animate-pulse rounded-xl bg-rose-50" />
          <div className="h-52 animate-pulse rounded-xl bg-rose-50" />
        </div>
        <div className="h-72 animate-pulse rounded-xl bg-rose-50" />
      </div>
    );

  if (errorMessage || !wedding)
    return (
      <div role="alert" className={`${card} p-10 text-center`}>
        <h2 className="text-lg font-bold text-wine-700">Wedding unavailable</h2>
        <p className="mt-2 text-sm text-ink-soft">
          {errorMessage || "Wedding details are unavailable."}
        </p>
        <Link href="/admin/weddings" className={`${button} mt-5`}>
          Back to Weddings
        </Link>
      </div>
    );

  const days = getSortedWeddingDays(
    Array.isArray(wedding.wedding_days) ? wedding.wedding_days : [],
  );

  const bride = wedding.bride_name;
  const groom = wedding.groom_name;
  const name =  wedding.couple_name || [bride, groom].filter(Boolean).join(" & ") ||
    "Wedding celebration";

  const dayCount = days.length || 0;
  const eventCount = days.reduce(
    (count, day) =>
      count + (day.wedding_day_events || day.booking_day_events || []).length,
    0,
  );
  const languages = Array.isArray(wedding.languages)
    ? wedding.languages.join(", ")
    : wedding.languages;

  const location =  wedding.locations;
  const rows = [
    [Users, "Couple Name", name],
    [Users, "Bride Name", bride],
    [Users, "Groom Name", groom],
    [Calendar, "Number of Days",wedding.wedding_day_events_count],
    [Plate, "Food Observance", wedding.food_observance],
    [
      WineGlass,
      "Alcohol Offered",
      wedding.alcohol_offered ??
        (days.some((day) =>
          day.wedding_day_events?.some((event) => event.is_alcohol_offered),
        )
          ? "Yes"
          : "-"),
    ],
  ];
  const info = [
    [
      Calendar,
      `${wedding.wedding_dates || formatWeddingDateRange(days)} (${dayCount} days)`,
    ],
    [MapPin, location || "Location to be announced"],
    [Plate, `Food Type: ${wedding.food_observance || "-"}`],
    [Users, wedding.wedding_day_events_count],
    [
      Users,
      `Created By: ${wedding.creator_type || "-"}`,
    ],
  ];

  return (
    <div className="space-y-3">
      <section className={`${card} p-4`}>
        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1.35fr)_minmax(230px,1fr)]">
          <Gallery key={weddingId} wedding={wedding} name={name} />
          <div className="py-2">
            <Status value={wedding.status} />
            <h1 className="mt-3 text-xl font-bold text-wine-700 sm:text-2xl">
              {name}
            </h1>
            <div className="mt-5 space-y-3">
              {info.map(([Icon, value], index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 text-sm text-ink-soft"
                >
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-wine-500" />
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-3 flex flex-wrap justify-end gap-2">
              <Link href="/admin/weddings" className={button}>
                ← Back to Weddings
              </Link>
              <button
                type="button"
                disabled
                title="Admin editing is not connected yet"
                className={`${button} disabled:cursor-not-allowed disabled:opacity-50`}
              >
                Edit
              </button>
              <button
                type="button"
                disabled
                title="Admin deletion is not connected yet"
                className="min-h-9 rounded-md bg-wine-700 px-4 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Delete
              </button>
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-5 rounded-xl bg-rose-50/70 p-5 xl:min-h-56">
              <div className="border-r border-rose-200 pr-3">
                <dt className="text-xs text-wine-700">Wedding ID</dt>
                <dd className="mt-1 text-lg font-bold text-wine-700">
                  #{wedding.id || weddingId}
                </dd>
              </div>
              <div>
                <dt className="mb-1 text-xs text-ink-soft">Status</dt>
                <dd>
                  <Status value={wedding.status} />
                </dd>
              </div>
              <div className="col-span-2 border-t border-gold-200/60 pt-4">
                <dt className="text-xs text-ink-soft">Created On</dt>
                <dd className="mt-1 text-sm font-semibold text-wine-700">
                  {wedding.created_at}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
      <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr]">
        <section className={card}>
          <Heading icon={BookHeart}>Description</Heading>
          <p className="whitespace-pre-line px-5 py-4 text-sm leading-6 text-ink-soft">
            {wedding.description || "No description provided."}
          </p>
        </section>
        <section className={card}>
          <Heading icon={Users}>Couple Information</Heading>
          <dl className="px-5 py-2">
            {rows.map(([Icon, label, value]) => (
              <div
                key={label}
                className="grid grid-cols-[20px_minmax(0,1fr)_minmax(0,1.4fr)] items-start gap-3 border-b border-gold-200/40 py-1.5 last:border-0"
              >
                <Icon className="h-4 w-4 text-wine-500" />
                <dt className="text-xs text-ink-soft">{label}</dt>
                <dd className="break-words text-xs font-medium text-wine-700">
                  {typeof value === "boolean"
                    ? value
                      ? "Yes"
                      : "No"
                    : value || "-"}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
      <section className={card}>
        <Heading icon={Calendar}>
          Wedding Schedule{" "}
          <span className="font-medium">
            ({dayCount} Days {eventCount} Events)
          </span>
        </Heading>
        <div className="space-y-2.5 p-3">
          {days.length ? (
            days.map((day, index) => (
              <ScheduleDay key={day.id ?? index} day={day} index={index} />
            ))
          ) : (
            <p className="p-5 text-center text-sm text-ink-soft">
              No wedding schedule has been added yet.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
