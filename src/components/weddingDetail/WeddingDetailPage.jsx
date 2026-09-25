"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ErrorMessage from '@/components/common/ErrorMessage';
import APIs from '@/lib/apis';
import WeddingBreadcrumb from './WeddingBreadcrumb';
import WeddingHero from './WeddingHero';
import WeddingJoinCTA from './WeddingJoinCTA';
import WeddingSchedule from './WeddingSchedule';
import WeddingStory from './WeddingStory';

function getWeddingFromResponse(response) {
  const payload = response?.data ?? response;
  return payload?.data ?? payload;
}

function WeddingDetailSkeleton() {
  return (
    <section className="bg-cream-50 py-10 sm:py-14">
      <div className="shell animate-pulse">
        <div className="h-4 w-48 rounded bg-cream-200" />
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="aspect-[5/4] rounded-lg bg-cream-200" />
          <div className="space-y-5 rounded-lg border border-gold-200 bg-white p-6 sm:p-8">
            <div className="h-4 w-28 rounded bg-cream-200" />
            <div className="h-10 w-3/4 rounded bg-cream-200" />
            <div className="h-20 w-full rounded bg-cream-100" />
            <div className="h-24 w-full rounded bg-cream-100" />
            <div className="h-11 w-full rounded-md bg-wine-100" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function WeddingDetailPage({ weddingId }) {
  const router = useRouter();
  const [wedding, setWedding] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    let isActive = true;

    const loadWedding = async () => {
      setIsLoading(true);
      setErrorMessage('');
      setIsNotFound(false);

      try {
        const response = await APIs.frontend.frontWeddings.getWeddingDetails(weddingId);
        const nextWedding = getWeddingFromResponse(response);

        if (!nextWedding?.id) {
          if (isActive) setIsNotFound(true);
          return;
        }

        if (isActive) setWedding(nextWedding);
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

  if (isLoading) return <WeddingDetailSkeleton />;

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

  if (errorMessage) {
    return (
      <section className="bg-cream-50 py-16 sm:py-24">
        <div className="shell max-w-2xl">
          <ErrorMessage message={errorMessage} onClose={() => setErrorMessage('')} />
          <Link href="/weddings" className="mt-6 inline-flex min-h-10 items-center rounded-md bg-wine-700 px-5 text-sm font-semibold text-cream-50 transition-colors hover:bg-wine-600 focus:outline-none focus:ring-2 focus:ring-wine-300">
            Browse weddings
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="bg-cream-50">
      <WeddingBreadcrumb wedding={wedding} />
      <WeddingHero wedding={wedding} />
      <div style={{ backgroundImage: 'url("/images/sectionbg.png")' }} className="py-10 sm:py-14">
        <WeddingStory wedding={wedding} />
        <WeddingSchedule weddingDays={wedding?.wedding_days || []} />
      </div>
      <WeddingJoinCTA wedding={wedding} />
    </div>
  );
}