"use client"
import { useEffect, use } from 'react';
import WeddingBookingPage from '@/components/booking/WeddingBookingPage';
import { useUserAuth } from '@/hooks/useUserAuth';
import { useRouter } from 'next/navigation';
import BookingSkeleton from "@/components/booking/BookingSkeleton";
import Loader from '@/components/common/Loader';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

export default function WeddingBookingRoute({ params }) {
  const { isAuthorized } = useProtectedRoute('frontend');
  const {
        isAuthenticated,
        initialized,
        user,
    } = useUserAuth();
  const router = useRouter();
  const { weddingId } = use(params);

   useEffect(() => {
    if (!initialized) {
        return;
      }
    if (!isAuthenticated) {
      router.replace(`/wedding-detail/${weddingId}?login=true`);
      return;
    }
    if (user.is_host) {
      router.replace(`/wedding-detail/${weddingId}`);
    }
  }, [initialized, isAuthenticated, user, weddingId, router]);

   if (!isAuthorized) {
      return <Loader />;
    }

 // Auth is still being initialized
    if (!initialized) {
        return <BookingSkeleton />;
    }

    if(user.is_host){
        return null;
    }


  return <WeddingBookingPage weddingId={weddingId} />;
}

