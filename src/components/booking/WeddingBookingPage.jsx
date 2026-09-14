"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ElephantScene } from '@/components/Artwork';
import ErrorMessage from '@/components/common/ErrorMessage';
import SuccessMessage from '@/components/common/SuccessMessage';
import { useUserAuth } from '@/hooks/useUserAuth';
import APIs from '@/lib/apis';
import { getSortedWeddingDays } from '@/components/weddingDetail/weddingDetailUtils';
import BookingBreadcrumb from './BookingBreadcrumb';
import BookingIntro from './BookingIntro';
import BookingSidebar from './BookingSidebar';
import PaymentPanel from './PaymentPanel';
import StepHeader from './StepHeader';
import TravelersStepper from './TravelersStepper';
import WeddingDaysPicker from './WeddingDaysPicker';
import YourInformationForm from './YourInformationForm';
import { CONTRIBUTION_PER_PERSON, getInitialBookingForm, validateBookingForm } from './bookingUtils';

function getWeddingFromResponse(response) {
  const payload = response?.data ?? response;
  return payload?.data ?? payload;
}

function BookingSkeleton() {
  return (
    <section className="bg-cream-50 py-10 sm:py-14">
      <div className="shell animate-pulse">
        <div className="h-4 w-48 rounded bg-cream-200" />
        <div className="mt-6 h-10 w-2/3 rounded bg-cream-200" />
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(18rem,1fr)]">
          <div className="space-y-4">
            <div className="h-40 rounded bg-cream-200" />
            <div className="h-40 rounded bg-cream-200" />
            <div className="h-32 rounded bg-cream-200" />
          </div>
          <div className="h-96 rounded bg-cream-200" />
        </div>
      </div>
    </section>
  );
}

export default function WeddingBookingPage({ weddingId }) {
  const { user } = useUserAuth();
  const [wedding, setWedding] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);

  const [form, setForm] = useState(() => getInitialBookingForm(user));
  const [selectedDayIds, setSelectedDayIds] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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

        if (isActive) {
          setWedding(nextWedding);
          const sortedDays = getSortedWeddingDays(nextWedding?.wedding_days || []);
          const firstDay = sortedDays[0];
          if (firstDay) setSelectedDayIds([firstDay.id ?? 0]);
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

  useEffect(() => {
    if (!user) return;
    const initial = getInitialBookingForm(user);
    setForm((currentForm) => ({
      ...currentForm,
      firstName: currentForm.firstName || initial.firstName,
      lastName: currentForm.lastName || initial.lastName,
      email: currentForm.email || initial.email,
      phone: currentForm.phone || initial.phone,
    }));
  }, [user]);

  const updateField = (field, value) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
  };

  const toggleDay = (dayId) => {
    setSelectedDayIds((currentIds) => (
      currentIds.includes(dayId) ? currentIds.filter((id) => id !== dayId) : [...currentIds, dayId]
    ));
    setErrors((currentErrors) => ({ ...currentErrors, weddingDays: undefined }));
  };

  const totalAmount = CONTRIBUTION_PER_PERSON * form.travelerCount;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccessMessage('');

    const validationErrors = validateBookingForm(form, selectedDayIds);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;

    setIsSubmitting(true);
    try {
      // No booking/payment endpoint exists on the backend yet, so this only simulates the flow.
      await new Promise((resolve) => setTimeout(resolve, 900));
      setSuccessMessage('Thank you! Your spot has been reserved. A confirmation will be sent to your email shortly.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <div className="relative overflow-hidden bg-cream-50 pb-16">
      <BookingBreadcrumb wedding={wedding} />
      <BookingIntro wedding={wedding} />

      <div className="shell relative mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(18rem,1fr)]">
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {successMessage && <SuccessMessage message={successMessage} onClose={() => setSuccessMessage('')} />}

          <YourInformationForm form={form} errors={errors} onChange={updateField} />
          <WeddingDaysPicker
            weddingDays={wedding?.wedding_days || []}
            selectedDayIds={selectedDayIds}
            onToggleDay={toggleDay}
            error={errors.weddingDays}
          />
          <TravelersStepper travelerCount={form.travelerCount} onChange={(count) => updateField('travelerCount', count)} error={errors.travelerCount} />
          <PaymentPanel form={form} errors={errors} onChange={updateField} totalAmount={totalAmount} travelerCount={form.travelerCount} isSubmitting={isSubmitting} />
        </form>

        <BookingSidebar wedding={wedding} />
      </div>

      <ElephantScene className="pointer-events-none absolute bottom-4 right-6 hidden h-36 w-36 opacity-80 lg:block" />
    </div>
  );
}
