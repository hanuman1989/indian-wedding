"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import AccountSidebar from '@/components/common/AccountSidebar';
import ErrorMessage from '@/components/common/ErrorMessage';
import Loader from '@/components/common/Loader';
import RegisteredWeddingList from '@/components/wedding/RegisteredWeddingList';
import SuccessMessage from '@/components/common/SuccessMessage';
import { Modal } from '@/components/ui/modal';
import { Plus } from '@/components/Icons';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import APIs from '@/lib/apis';

function getWeddingList(response) {
  const data = response?.weddings || response?.data?.weddings || response?.data || response;
  return Array.isArray(data) ? data : [];
}

function formatDate(value) {
  if (!value) return 'Recently';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
}

function getContactName(contact, fallback) {
  const firstName = contact?.firstName || contact?.first_name || '';
  const lastName = contact?.lastName || contact?.last_name || '';
  return `${firstName} ${lastName}`.trim() || fallback;
}

function normalizeWedding(wedding) {
  const events = wedding.events || wedding.wedding_events || [];
  const firstEvent = events[0] || {};
  const brideName = getContactName(wedding.bride, wedding.bride_name || 'Bride');
  const groomName = getContactName(wedding.groom, wedding.groom_name || 'Groom');
  const photo = (wedding.photos || wedding.wedding_photos || [])[0] || {};
  const days = Number(wedding.wedding_days || wedding.weddingDays || events.length || 1);
  const status = wedding.status === 'published' ? 'live' : wedding.status || 'draft';

  return {
    ...wedding,
    id: wedding.id || wedding.uuid,
    couple: `${brideName} & ${groomName}`,
    createdAt: formatDate(wedding.created_at || wedding.createdAt),
    dates: wedding.dates || wedding.wedding_dates || firstEvent.event_date || firstEvent.date || 'Dates to be confirmed',
    duration: `${days} ${days === 1 ? 'Day' : 'Days'}`,
    venue: wedding.venue_name || wedding.venueName || firstEvent.venue_name || firstEvent.venueName || 'Venue to be confirmed',
    location: wedding.locations || 'Location to be confirmed',
    photoCount: wedding.photo_count || wedding.photos_count || (wedding.photos || wedding.wedding_photos || []).length,
    cover_image: photo.cover_image || '',
    tagline: wedding.tagline || wedding.story || wedding.type || 'A beautiful wedding celebration',
    listStatus: ['live', 'draft', 'ended', 'published', 'submitted'].includes(status) ? status : 'draft',
    statusLabel: status ,
    currentStep: wedding.current_step || wedding.currentStep || 1,
  };
}

export default function MyWeddingsPage() {
  const { isAuthorized } = useProtectedRoute('frontend');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [weddings, setWeddings] = useState([]);
  const [isLoadingWeddings, setIsLoadingWeddings] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(searchParams.get('published') === 'true' ? 'Your wedding has been published successfully.' : '');
  const [weddingToDelete, setWeddingToDelete] = useState(null);
  const [deletingWeddingId, setDeletingWeddingId] = useState('');

  useEffect(() => {
    if (!isAuthorized) return;

    let isActive = true;

    const loadWeddings = async () => {
      setIsLoadingWeddings(true);
      setErrorMessage('');

      try {
        const response = await APIs.frontend.weddings.getMyWeddings();
        console.log(response, 'getMyWeddings response---')
        if (isActive) setWeddings(response.data || []);
      } catch (error) {
        if (isActive) setErrorMessage('Unable to load your weddings. Please try again.');
      } finally {
        if (isActive) setIsLoadingWeddings(false);
      }
    };

    void loadWeddings();

    return () => {
      isActive = false;
    };
  }, [isAuthorized]);

  const closeSuccessMessage = () => {
    setSuccessMessage('');
    if (searchParams.get('published') === 'true') router.replace('/my-weddings', { scroll: false });
  };

  const editWedding = (wedding) => {
    router.push(`/post-weddings/${wedding.id}/step/${Math.min(Math.max(Number(wedding.currentStep) || 1, 1), 5)}`);
  };

  const deleteWedding = async () => {
    if (!weddingToDelete) return;

    setDeletingWeddingId(weddingToDelete.id);
    setErrorMessage('');

    try {
      await APIs.frontend.weddings.deleteWedding(weddingToDelete.id);
      setWeddings((currentWeddings) => currentWeddings.filter((wedding) => wedding.id !== weddingToDelete.id));
      setWeddingToDelete(null);
      setSuccessMessage('Wedding deleted successfully.');
    } catch {
      setErrorMessage('Unable to delete this wedding. Please try again.');
    } finally {
      setDeletingWeddingId('');
    }
  };

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
                <p className="text-sm font-medium text-gold-600">Your wedding space</p>
                <h1 className="mt-2 font-display text-3xl font-bold text-wine-700 sm:text-4xl">My Weddings</h1>
                <p className="mt-2 text-sm leading-6 text-ink-soft">Manage your registered celebrations, details, and guest experience.</p>
              </div>
              <Link href="/post-weddings" className="inline-flex min-h-10 items-center gap-2 rounded-md bg-wine-700 px-4 text-sm font-semibold text-cream-50 shadow-sm transition-colors hover:bg-wine-600 focus:outline-none focus:ring-2 focus:ring-wine-300">
                <Plus className="h-4 w-4" />
                Post New Wedding
              </Link>
            </div>

            <section aria-label="Registered weddings" className="mt-7">
              {errorMessage && <ErrorMessage message={errorMessage} onClose={() => setErrorMessage('')} className="mb-5" />}
              {successMessage && <SuccessMessage message={successMessage} onClose={closeSuccessMessage} className="mb-5" />}
              {isLoadingWeddings ? (
                <div className="grid gap-4" aria-label="Loading weddings">
                  {[1, 2, 3].map((index) => <div key={index} className="h-52 animate-pulse border border-gold-200 bg-white/65" />)}
                </div>
              ) : (
                <RegisteredWeddingList weddings={weddings} deletingWeddingId={deletingWeddingId} onEdit={editWedding} onDelete={setWeddingToDelete} />
              )}
            </section>
          </main>
        </div>
      </div>

      <Modal
        isOpen={Boolean(weddingToDelete)}
        onClose={() => !deletingWeddingId && setWeddingToDelete(null)}
        title="Delete wedding?"
        description="This will permanently remove the wedding and its saved details."
        size="sm"
        footer={(
          <>
            <button type="button" onClick={() => setWeddingToDelete(null)} disabled={Boolean(deletingWeddingId)} className="min-h-10 rounded-md border border-gold-300 px-4 text-sm font-semibold text-ink-soft transition-colors hover:bg-cream-100 disabled:opacity-60">Cancel</button>
            <button type="button" onClick={deleteWedding} disabled={Boolean(deletingWeddingId)} className="min-h-10 rounded-md bg-wine-700 px-4 text-sm font-semibold text-cream-50 transition-colors hover:bg-wine-600 disabled:opacity-60">{deletingWeddingId ? 'Deleting...' : 'Delete'}</button>
          </>
        )}
      />
    </section>
  );
}