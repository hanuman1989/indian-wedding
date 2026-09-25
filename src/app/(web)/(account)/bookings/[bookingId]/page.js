"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import AccountSidebar from '@/components/common/AccountSidebar';
import ErrorMessage from '@/components/common/ErrorMessage';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import Loader from '@/components/common/Loader';
import BookingDetail from '@/components/bookingDetail/BookingDetail';
import APIs from '@/lib/apis';

function getBookingFromResponse(response) {
  const payload = response?.data ?? response;
  return payload?.data ?? payload;
}

export default function BookingsPage() {
  const { isAuthorized } = useProtectedRoute('frontend');
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!bookingId) return undefined;
    let isActive = true;

    const loadBooking = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const response = await APIs.account.myBookings.getBooking(bookingId);
        const nextBooking = getBookingFromResponse(response);
        if (isActive) setBooking(nextBooking?.id ? nextBooking : null);
      } catch (error) {
        if (isActive) setErrorMessage(error?.message || 'Unable to load this booking. Please try again.');
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    void loadBooking();

    return () => {
      isActive = false;
    };
  }, [bookingId]);

  if (!isAuthorized) {
      return <Loader />;
    }
 

  return (
    <section className="relative isolate overflow-hidden bg-cream-50 py-8 sm:py-10 lg:py-12">
      <Image
        src="/images/bg.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover object-center opacity-20"
      />

      <div className="shell">
        <div className="grid overflow-hidden border border-gold-200/90 bg-cream-50/95 shadow-[0_16px_48px_rgba(108,10,34,0.12)] lg:grid-cols-[230px_minmax(0,1fr)]">
          <AccountSidebar />

          <main className="min-w-0 p-5 sm:p-7 lg:p-9">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-gold-200/80 pb-7">
              <div>
                <h1 className="mt-2 font-display text-3xl font-bold text-wine-700 sm:text-4xl">Booking Detail</h1>
                <p className="mt-2 text-sm leading-6 text-ink-soft">View complete details of this wedding booking.</p>
              </div>
            </div>

            <section id="booking-detail-section" aria-label="booking detail section" className="mt-7">
              {isLoading ? (
                <div className="grid gap-6">
                  <div className="h-44 animate-pulse rounded-2xl bg-cream-200" />
                  <div className="h-20 animate-pulse rounded-2xl bg-cream-200" />
                  <div className="h-48 animate-pulse rounded-2xl bg-cream-200" />
                </div>
              ) : errorMessage ? (
                <ErrorMessage message={errorMessage} />
              ) : booking ? (
                <BookingDetail booking={booking} />
              ) : (
                <p className="text-sm text-ink-soft">Booking not found.</p>
              )}
            </section>
          </main>
        </div>
      </div>
    </section>
  );
}
