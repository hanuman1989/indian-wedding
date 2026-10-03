"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Image from "next/image";
import TableSkeleton from "@/components/common/TableSkeleton";
import Badge from "../ui/badge/Badge";
import ActionDropdown from "@/components/common/ActionDropdown";

const PAYMENT_STATUS = {
  pending: { label: "Pending", color: "warning" },
  processing: { label: "Processing", color: "info" },
  succeeded: { label: "Succeeded", color: "success" },
  failed: { label: "Failed", color: "error" },
  cancelled: { label: "Cancelled", color: "error" },
};

const BOOKING_STATUS = {
  pending_payment: { label: "Pending Payment", color: "warning" },
  confirmed: { label: "Confirmed", color: "success" },
  payment_failed: { label: "Payment Failed", color: "error" },
  cancelled: { label: "Cancelled", color: "error" },
  expired: { label: "Expired", color: "light" },
  completed: { label: "Completed", color: "success" },
};

function getStatus(status, statusMap) {
  const normalizedStatus = String(status || "").toLowerCase();
  return statusMap[normalizedStatus] || {
    label: normalizedStatus
      ? normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1)
      : "Unknown",
    color: "light",
  };
}

function formatCurrency(amount, currency) {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    return "—";
  }

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    }).format(numericAmount);
  } catch {
    return (currency || "USD") + " " + numericAmount;
  }
}

function formatBookedAt(value) {
  if (!value) {
    return { date: "—", time: "" };
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return { date: value, time: "" };
  }

  const date = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);

  const hasTime = typeof value === "string" && /[T ]\d{2}:\d{2}/.test(value);
  const time = hasTime
    ? new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(parsedDate)
    : "";

  return { date, time };
}

function getGuestName(user) {
  const fullName = [user?.first_name, user?.last_name]
    .filter(Boolean)
    .join(" ");

  return fullName || "Guest";
}

function getGuestInitials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export default function BookingTable({
  bookings = [],
  isLoading = false,
  handleDelete,
}) {
  return (
    <div
      className="min-w-0 w-full max-w-full overflow-x-auto rounded-2xl"
      role="region"
      aria-label="Bookings table"
      tabIndex={0}
    >
        {isLoading ? (
          <TableSkeleton columns={10} rows={5} />
        ) : (
          <Table className="w-full border-collapse text-left">
            <TableHeader className="border-y border-gray-100 bg-gray-50/70 dark:border-gray-800 dark:bg-white/[0.02]">
              <TableRow>
                {[
                  "Booking ID",
                  "Couple Name",
                  "Guest Name",
                  "Wedding Dates",
                  "Booking Status",
                  "Actions",
                ].map((heading) => (
                  <TableCell
                    key={heading}
                    isHeader
                    className="whitespace-nowrap px-4 py-3 text-start text-xs font-semibold text-gray-500 dark:text-gray-400"
                  >
                    {heading}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {bookings.length > 0 ? (
                bookings.map((booking, index) => {
                  const wedding = booking.wedding || {};
                  const user = booking.user || {};
                  const guestName = getGuestName(user);
                  const guestImage =
                    user.avatar_url ||
                    user.profile_image ||
                    user.profile_photo ||
                    wedding.cover_image;
                  const weddingName =
                    wedding.couple_name ||
                    [wedding.groom_name, wedding.bride_name]
                      .filter(Boolean)
                      .join(" & ") ||
                    "—";
                  const weddingDates =
                    booking.booking_days_dates ||
                    wedding.wedding_dates ||
                    booking.wedding_booking_date ||
                    "—";
                  const travelerCount = Number(booking.number_of_travelers);
                  const paymentStatus = getStatus(
                    booking.payment?.status || booking.payment_status,
                    PAYMENT_STATUS,
                  );
                  const bookingStatus = getStatus(
                    booking.status,
                    BOOKING_STATUS,
                  );
                  const bookedAt = formatBookedAt(
                    booking.created_at || booking.booked_at,
                  );

                  return (
                    <TableRow
                      key={booking.id || booking.booking_number || index}
                      className="transition-colors hover:bg-gray-50/70 dark:hover:bg-white/[0.02]"
                    >
                      <TableCell className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-800 dark:text-white/90">
                        {booking.booking_number || "—"}
                      </TableCell>

                      <TableCell className="px-4 py-4">
                        <div className="flex min-w-[190px] items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-50 text-xs font-semibold text-brand-500 dark:bg-brand-500/15 dark:text-brand-400">
                            {wedding.cover_image ? (
                              <Image
                                src={wedding.cover_image || '/images/bg.png'}
                              alt={`Wedding decor for ${wedding.couple_name}`}
                                width={40}
                                height={40}
                                unoptimized
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              wedding.couple_name
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-gray-800 dark:text-white/90">
                              {wedding.couple_name}
                            </p>
                            <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                              {booking.booking_days_events_count || "—"}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="px-4 py-4">
                        <div className="min-w-[150px]">
                          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                            {guestName}
                          </p>
                          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                            Total Guest: {booking.number_of_travelers || "—"}
                          </p>
                          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                            {booking.booking_locations || '—'}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell className="whitespace-nowrap px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {booking.wedding_booking_date || wedding.wedding_dates || "—"}
                      </TableCell>

                      <TableCell className="whitespace-nowrap px-4 py-4">
                        <Badge size="sm" color={bookingStatus.color}>
                          {bookingStatus.label}
                        </Badge>
                      </TableCell>

                      <TableCell className="px-4 py-4 text-right">
                        <ActionDropdown
                          viewHref={booking.id ? "/admin/bookings/" + encodeURIComponent(booking.id) : undefined}
                          onDelete={
                            handleDelete
                              ? () => handleDelete(booking.id)
                              : undefined
                          }
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell className="px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                    No bookings found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
    </div>
  );
}


