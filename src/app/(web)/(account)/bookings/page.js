"use client";

import { Suspense } from 'react';
import Image from 'next/image';
import AccountSidebar from '@/components/common/AccountSidebar';
import Loader from '@/components/common/Loader';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import MyBookingList from '@/components/myBooking/MyBookingList';
import { useUserAuth } from '@/hooks/useUserAuth';

function MyBookingsContent() {
  const { user } = useUserAuth();
  const { isAuthorized } = useProtectedRoute('frontend');

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
                <p className="text-sm font-medium text-gold-600">Manage your bookings</p>
                <h1 className="mt-2 font-display text-3xl font-bold text-wine-700 sm:text-4xl">My Bookings</h1>
                <p className="mt-2 text-sm leading-6 text-ink-soft">Manage your bookings, details, and guest experience.</p>
              </div>
            </div>

            <section aria-label="Registered weddings" className="mt-7">
             <MyBookingList isHost={user.is_host} hideHeading={true} />
            </section>
          </main>
        </div>
      </div>
    </section>
  );
}

export default function MyBookingsPage() {
  return (
    <Suspense fallback={<Loader />}>
      <MyBookingsContent />
    </Suspense>
  );
}