"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PageBreadcrumb from "@/components/admin/common/PageBreadCrumb";
import BookingStatusBadge from "@/components/myBooking/BookingStatusBadge";
import PaymentStatusBadge from "@/components/bookingDetail/PaymentStatusBadge";
import SectionHeader from "@/components/bookingDetail/SectionHeader";
import InvitationCard from "@/components/admin/booking/InvitationCard";
import WeddingScheduleCard from "@/components/bookingDetail/WeddingScheduleCard";
import APIs from "@/lib/apis";
import {
  ArrowRight,
  BookHeart,
  Calendar,
  Clock,
  CreditCard,
  Globe,
  Mail,
  Mandap,
  MapPin,
  Phone,
  Ticket,
  Users,
  UserPlus,
} from "@/components/Icons";

function formatCurrency(value, currency = "USD") {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "—";
  }

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return "$" + amount.toFixed(2);
  }
}

function IconValue({ icon: Icon, label, value, className = "" }) {
  return (
    <div
      className={
        "flex min-w-0 items-start gap-2.5 border-t border-gold-200/60 px-4 py-4 first:border-t-0 sm:px-5 lg:border-l lg:border-t-0 lg:first:border-l-0 " +
        className
      }
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-wine-500" />
      <div className="min-w-0">
        <p className="text-xs text-ink-soft">{label}</p>
        <p className="mt-0.5 break-words text-sm font-semibold text-wine-700">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

function PaymentRow({ label, value, highlight = false }) {
  return (
    <div
      className={
        "flex items-center justify-between gap-4 border-t border-gold-200/60 px-4 py-3 first:border-t-0 sm:px-5 " +
        (highlight ? "bg-rose-50" : "")
      }
    >
      <span
        className={
          highlight
            ? "text-sm font-semibold text-wine-700"
            : "text-sm text-ink-soft"
        }
      >
        {label}
      </span>
      <span
        className={
          highlight
            ? "text-sm font-bold text-wine-700"
            : "text-right text-sm font-semibold text-ink"
        }
      >
        {value || "—"}
      </span>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="grid gap-1.5 sm:grid-cols-[132px_minmax(0,1fr)] sm:gap-3">
      <span className="text-sm text-ink-soft">{label}</span>
      <span className="break-words text-sm font-medium text-wine-700">
        {value || "—"}
      </span>
    </div>
  );
}

function BookingHero({ booking, wedding }) {
  return (
    <section className="overflow-hidden rounded-xl border border-gold-200/80 bg-white shadow-sm">
      <div className="grid lg:grid-cols-[212px_minmax(0,1fr)_242px]">
        <div className="relative min-h-48 bg-rose-50 lg:min-h-[174px]">
          {wedding.cover_image ? (
            <Image
              src={wedding.cover_image}
              alt={"Wedding portrait of " + (wedding.couple_name || "the couple")}
              fill
              unoptimized
              sizes="212px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full min-h-48 items-center justify-center bg-rose-50 font-display text-3xl font-bold text-wine-700">
              {wedding.couple_name || "Wedding"}
            </div>
          )}
        </div>

        <div className="min-w-0 px-5 py-4 sm:px-6 lg:py-5">
          <BookingStatusBadge status={booking.status} />
          <h1 className="mt-2 text-xl font-bold text-wine-700">
            {wedding.couple_name || "Wedding booking"}
          </h1>
          <div className="mt-3 space-y-2.5 text-sm text-ink-soft">
            <p className="flex items-start gap-2">
              <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-wine-500" />
              <span>
                {booking.booking_days_dates ||
                  "Dates to be confirmed"}
                {booking.booking_days_events_count && (
                  <span className="ml-1 text-xs text-gray-400">
                    ({booking.booking_days_events_count} )
                  </span>
                )}
              </span>
            </p>
            {booking.wedding_booking_time && (
              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0 text-wine-500" />
                {booking.wedding_booking_time}
              </p>
            )}
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-wine-500" />
              {booking.booking_locations}
            </p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {wedding.food_observance && (
                <p className="flex items-center gap-2">
                  <Ticket className="h-4 w-4 text-wine-500" />
                  {wedding.food_observance}
                </p>
              )}
              {booking.booking_days_events_count && (
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-wine-500" />
                  {booking.booking_days_events_count}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="m-3 grid content-center gap-3 rounded-xl border border-rose-100 bg-wine-50/60 p-4 sm:m-4 lg:m-3">
          <div>
            <p className="text-xs text-ink-soft">Booking Number</p>
            <p className="mt-0.5 break-all text-sm font-bold text-wine-700">
              {booking.booking_number || "—"}
            </p>
          </div>
          <div className="border-t border-gold-200/60 pt-3">
            <p className="text-xs text-ink-soft">Booked On</p>
            <p className="mt-0.5 text-sm font-semibold text-ink">
              {booking.created_at}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function GuestInformation({ booking }) {
  const user = booking.user || {};
  const guestName =
    [user.first_name, user.last_name].filter(Boolean).join(" ") || "—";

  const guestItems = [
    { icon: UserPlus, label: "Guest Name", value: guestName },
    { icon: Mail, label: "Email", value: user.email || "—" },
    { icon: Phone, label: "Phone", value: user.phone || "—" },
    // { icon: Globe, label: "Visiting From", value: booking.visiting_from || "—" },
    {
      icon: Users,
      label: "Number of Travelers",
      value: booking.number_of_travelers + " Guests",
    },
   
  ];

  return (
    <section className="overflow-hidden rounded-xl border border-gold-200/80 bg-white shadow-sm">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3">
        {guestItems.map((item, index) => (
          <IconValue
            key={item.label}
            {...item}
            className={index < 3 ? "lg:border-b lg:border-gold-200/60" : ""}
          />
        ))}
      </div>
    </section>
  );
}

function PaymentInformation({ booking, currency }) {
  const pricing = booking.pricing || {};
  const travelerCount = booking.number_of_travelers || 0;

  return (
    <section className="overflow-hidden rounded-xl border border-gold-200/80 bg-white shadow-sm">
      <SectionHeader
        icon={Ticket}
        title="Payment Information"
        action={<BookingStatusBadge status={booking.status} />}
      />
      <div>
        <PaymentRow
          label="Price per Person"
          value={formatCurrency(
            booking.price_per_person ?? pricing.price_per_person,
            currency,
          )}
        />
        <PaymentRow
          label={"Subtotal (" + travelerCount + " guests)"}
          value={formatCurrency(
            booking.subtotal ?? pricing.subtotal,
            currency,
          )}
        />
        <PaymentRow
          label="Platform Fee"
          value={`- ${formatCurrency(
            booking.platform_fee ?? pricing.platform_fee,
            currency,
          )}`}
        />
        <PaymentRow
          label="Total Amount"
          value={
            formatCurrency(
              booking.payout_amount,
              currency,
            ) +
            " " +
            currency
          }
          highlight
        />
      </div>
    </section>
  );
}

function PaymentDetails({ booking }) {
  const payment = booking.payment || {};
  const paymentMethod =
    payment.payment_method ||
    (payment.payment_intent_id ? "Credit Card (Stripe)" : "—");
  const paidAt = payment.paid_at || "—";

  return (
    <section className="overflow-hidden rounded-xl border border-gold-200/80 bg-white shadow-sm">
      <SectionHeader icon={CreditCard} title="Payment Details" />
      <div>
        <PaymentRow
          label="Payment Status"
          value={<PaymentStatusBadge status={payment.status} />}
        />
        <PaymentRow label="Payment ID" value={payment.payment_id} />
        <PaymentRow label="Payment Method" value={paymentMethod} />
        <PaymentRow
          label="Payment Intent ID"
          value={payment.payment_intent_id}
        />
        <PaymentRow label="Payment Date" value={paidAt} />
        {payment.client_secret && (
          <PaymentRow label="Client Secret" value="••••••••••••••••" />
        )}
      </div>
    </section>
  );
}

function AboutWedding({ booking, wedding }) {
  const weddingDates =
    booking.booking_days_dates ||
    "—";
  const description = wedding.description || "—";
  const detailItems = [
    ["Couple Name", wedding.couple_name],
    ["Bride Name", wedding.bride_name],
    ["Groom Name", wedding.groom_name],
    [
      "Wedding Dates",
      weddingDates + " (" + booking.booking_days_events_count + ")" ,
    ],
    ["Food Observance", wedding.food_observance],
    ["Location", booking.booking_locations],
    ["Description", description],
  ];

  return (
    <section className="overflow-hidden rounded-xl border border-gold-200/80 bg-white shadow-sm">
      <SectionHeader icon={Mandap} title="About the Wedding" />
      <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_226px] lg:items-center">
        <div className="space-y-2.5">
          {detailItems.map(([label, value]) => (
            <DetailRow key={label} label={label} value={value} />
          ))}
        </div>
        <div className="space-y-3">
          {wedding.cover_image ? (
            <div className="relative h-36 overflow-hidden rounded-lg bg-rose-50">
              <Image
                src={wedding.cover_image}
                alt={"Wedding portrait of " + (wedding.couple_name || "the couple")}
                fill
                unoptimized
                sizes="226px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex h-36 items-center justify-center rounded-lg bg-rose-50 text-sm font-semibold text-wine-700">
              Wedding image unavailable
            </div>
          )}
          <Link
            href={"/wedding-detail/" + wedding.id}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-wine-200 px-3 py-1.5 text-xs font-semibold text-wine-700 transition-colors hover:bg-wine-50"
          >
            View Wedding
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function LoadingState() {
  return (
    <div className="space-y-4">
      <div className="h-44 animate-pulse rounded-xl bg-rose-50" />
      <div className="h-28 animate-pulse rounded-xl bg-rose-50" />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-56 animate-pulse rounded-xl bg-rose-50" />
        <div className="h-56 animate-pulse rounded-xl bg-rose-50" />
      </div>
    </div>
  );
}

export default function BookingDetail({ bookingId }) {
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isCurrent = true;

    async function loadBooking() {
      setIsLoading(true);
      setErrorMessage("");
      setBooking(null);

      try {
        const response =
          await APIs.admin.weddingBooking.bookingDetail(bookingId);

        if (!isCurrent) {
          return;
        }

        if (response?.data) {
          setBooking(response.data);
        } else {
          setErrorMessage(
            "We couldn’t find a booking with that booking number.",
          );
        }
      } catch (error) {
        if (isCurrent) {
          setErrorMessage(
            error?.message || "Unable to load this booking. Please try again.",
          );
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    void loadBooking();

    return () => {
      isCurrent = false;
    };
  }, [bookingId]);

  const wedding = booking?.wedding || {};
  const currency = booking?.currency || "USD";

  return (
    <>
      {isLoading ? (
        <LoadingState />
      ) : errorMessage ? (
        <div className="rounded-xl border border-gold-200/80 bg-white px-6 py-14 text-center shadow-sm">
          <h2 className="text-lg font-bold text-wine-700">
            Booking unavailable
          </h2>
          <p className="mt-2 text-sm text-ink-soft">{errorMessage}</p>
          <Link
            href="/admin/bookings"
            className="mt-5 inline-flex items-center rounded-md bg-wine-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-wine-600"
          >
            Back to Bookings
          </Link>
        </div>
      ) : booking ? (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Link
              href="/admin/bookings"
              className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-wine-200 bg-white px-3 text-xs font-semibold text-wine-700 transition hover:bg-wine-50"
            >
              <svg
                aria-hidden="true"
                className="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path
                  d="m12.5 4.5-5.5 5.5 5.5 5.5M7.5 10h10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back to Bookings
            </Link>
          </div>

          <BookingHero
            booking={booking}
            wedding={wedding}
          />

          <GuestInformation booking={booking} />

          <div className="grid gap-3 lg:grid-cols-2">
            <PaymentInformation booking={booking} currency={currency} />
            <PaymentDetails booking={booking} />
          </div>

          <AboutWedding booking={booking} wedding={wedding} />

          <WeddingScheduleCard weddingDays={booking?.wedding_days} />

          <InvitationCard
            wedding={wedding}
            bookingId={booking.id}
            invoiceId={booking.booking_number}
          />
        </div>
      ) : null}
    </>
  );
}

