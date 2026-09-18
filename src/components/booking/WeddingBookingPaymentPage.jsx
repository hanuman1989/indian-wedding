"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ElephantScene } from '@/components/Artwork';
import ErrorMessage from '@/components/common/ErrorMessage';
import SuccessMessage from '@/components/common/SuccessMessage';
import { useUserAuth } from '@/hooks/useUserAuth';
import { useRouter } from 'next/navigation';
import BookingSkeleton from "@/components/booking/BookingSkeleton";

import APIs from '@/lib/apis';
import BookingBreadcrumb from './BookingBreadcrumb';
import BookingIntro from './BookingIntro';
import BookingSidebar from './BookingSidebar';
import StripePaymentPanel from './StripePaymentPanel';
import { getInitialBookingForm, validateBookingForm } from './bookingUtils';

export default function WeddingBookingPaymentPage({ weddingId, bookingId }) {
  const { user } = useUserAuth();
  const router = useRouter();

  const [wedding, setWedding] = useState(null);
  const [booking, setBooking] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);

  const [successMessage, setSuccessMessage] = useState('');


  useEffect(() => {
    let isActive = true;

    const loadWedding = async () => {
      setIsLoading(true);
      setErrorMessage('');
      setIsNotFound(false);
      try {
        const response = await APIs.frontend.frontWeddings.getWeddingBookingDetail(weddingId, bookingId);
        const booking = response.data;
        const nextWedding = response.data?.wedding;

        if (!nextWedding?.id) {
          router.replace(`/wedding-detail/${weddingId}`);
          return;
        }
        if (isActive) {
          setWedding(nextWedding);
          setBooking(booking);
        }
      } catch (error) {
        if (!isActive) return;

        if (error?.status === 404 || error?.status_code === 404) {
          setIsNotFound(true);
        } else {
          setErrorMessage(error?.message || 'Unable to load this wedding invitation. Please try again.');
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    void loadWedding();

    return () => {
      isActive = false;
    };
  }, [weddingId]);


  if (isLoading) return <BookingSkeleton />;

  if (isNotFound) {
    return (
      <section className="bg-cream-50 py-16 sm:py-24">
        <div className="shell max-w-xl text-center">
          <p className="text-sm font-semibold text-gold-600">Wedding invitation</p>
          <h1 className="mt-3 font-display text-3xl font-bold text-wine-700">This wedding invitation is unavailable.</h1>
          <p className="mt-3 text-sm leading-6 text-ink-soft">It may have been removed or the link may be incorrect.</p>
          <Link href="/weddings" className="mt-6 inline-flex min-h-10 items-center rounded-md bg-wine-700 px-5 text-sm font-semibold text-cream-50 transition-colors hover:bg-wine-600 focus:outline-none focus:ring-2 focus:ring-wine-300">
            Browse weddings
          </Link>
        </div>
      </section>
    );
  }
  return (
    <div className="relative overflow-hidden bg-cream-50 pb-16" style={{ backgroundImage: 'url("/images/sectionbg.png")', backgroundPosition: 'center center', backgroundSize: 'contain' }}>
      <BookingBreadcrumb items={[
        { title: 'Home', link: '/' },
        { title: 'Weddings', link: '/weddings' },
        { title: wedding.couple_name, link: `/wedding-detail/${wedding?.id}` },
        { title: 'Payment', className: 'font-semibold text-wine-700' },
      ]} />
      <BookingIntro wedding={wedding} />

      <div className="shell relative mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(18rem,1fr)]">
           {errorMessage && (<ErrorMessage message={errorMessage} onClose={() => setErrorMessage('')} />)}
          {successMessage && <SuccessMessage message={successMessage} onClose={() => setSuccessMessage('')} />}
           
          <StripePaymentPanel booking={booking} />
        <BookingSidebar wedding={wedding} />
      </div>

      <ElephantScene className="pointer-events-none absolute bottom-4 right-6 hidden h-36 w-36 opacity-80 lg:block" />
    </div>
  );
}
