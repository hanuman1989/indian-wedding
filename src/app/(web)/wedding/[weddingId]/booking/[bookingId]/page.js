"use client"

import { useEffect, use } from 'react';
import WeddingBookingPaymentPage from '@/components/booking/WeddingBookingPaymentPage';
import { useUserAuth } from '@/hooks/useUserAuth';
import { useRouter } from 'next/navigation';
import BookingSkeleton from "@/components/booking/BookingSkeleton";

export default function WeddingBookingRoute({ params }) {
  const {
        isAuthenticated,
        initialized,
    } = useUserAuth();
  const router = useRouter();
  const { weddingId, bookingId } = use(params);

  console.log(weddingId, bookingId, 'params----')

   useEffect(() => {
    if (!initialized) {
        return;
      }
    if (!isAuthenticated) {
      router.replace(`/wedding-detail/${weddingId}?login=true`);
    }
  }, [initialized, isAuthenticated, weddingId, router]);

 // Auth is still being initialized
    if (!initialized) {
        return <BookingSkeleton />;
    }

    // Auth initialized but user is not authenticated
    if (!isAuthenticated) {
        return null;
    }

  return <WeddingBookingPaymentPage weddingId={weddingId} bookingId={bookingId} />;
}

