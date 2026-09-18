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
import PaymentPanel from './PaymentPanel';
import TravelersStepper from './TravelersStepper';
import WeddingDaysPicker from './WeddingDaysPicker';
import YourInformationForm from './YourInformationForm';
import BookingSummary from './BookingSummary'
import Loader from '@/components/common/Loader';
import { CONTRIBUTION_PER_PERSON, getInitialBookingForm, validateBookingForm } from './bookingUtils';

export default function WeddingBookingPage({ weddingId }) {
  const { user } = useUserAuth();
  const router = useRouter();

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
        const nextWedding = response.data;

        if(nextWedding.wid === user.id){
          router.replace(`/wedding-detail/${weddingId}`);
        }

        if (!nextWedding?.id) {
          if (isActive) setIsNotFound(true);
          return;
        }

        if (isActive) {
          setWedding(nextWedding);
          const sortedDays = nextWedding?.wedding_days;
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
      first_name: currentForm.first_name || initial.first_name,
      last_name: currentForm.last_name || initial.last_name,
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

  const totalAmount = CONTRIBUTION_PER_PERSON * form.number_of_travelers;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccessMessage('');

    const validationErrors = validateBookingForm(form, selectedDayIds);
    console.log(validationErrors)
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;

    setIsSubmitting(true);
    try {
      const payload = {...form, ...{selected_days: selectedDayIds }}
      const response = await APIs.frontend.weddingBooking.createWeddingBooking(weddingId, payload);
      if(response.data && response.data.booking){
        router.push(`/wedding/${weddingId}/booking/${response.data.booking.id}`);
      }
     
    } catch(error){
      console.log(error, 'error------------')
      setErrorMessage(error?.message || 'Unable to create booking. Please try again.');
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
  return (
    <div className="relative overflow-hidden bg-cream-50 pb-16" style={{ backgroundImage: 'url("/images/sectionbg.png")', backgroundPosition: 'center center', backgroundSize: 'contain' }}>
      <BookingBreadcrumb items={[
        { title: 'Home', link: '/' },
        { title: 'Weddings', link: '/weddings' },
        { title: wedding.couple_name, link: `/wedding-detail/${wedding?.id}` },
        { title: 'Join Wedding', className: 'font-semibold text-wine-700' },
      ]} />
      <BookingIntro wedding={wedding} />

      <div className="shell relative mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(18rem,1fr)]">
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
           {errorMessage && (<ErrorMessage message={errorMessage} onClose={() => setErrorMessage('')} />)}
          {successMessage && <SuccessMessage message={successMessage} onClose={() => setSuccessMessage('')} />}
           
          <YourInformationForm form={form} errors={errors} onChange={updateField} />
          <WeddingDaysPicker
            weddingDays={wedding?.wedding_days || []}
            selectedDayIds={selectedDayIds}
            onToggleDay={toggleDay}
            error={errors.weddingDays}
          />
          <TravelersStepper travelerCount={form.number_of_travelers} onChange={(count) => updateField('number_of_travelers', count)} error={errors.number_of_travelers} />

          <BookingSummary form={form} errors={errors} totalAmount={totalAmount} travelerCount={form.number_of_travelers} selectedDayCount={selectedDayIds.length} isSubmitting={isSubmitting}/>

          {/* <PaymentPanel form={form} errors={errors} onChange={updateField} totalAmount={totalAmount} travelerCount={form.number_of_travelers} isSubmitting={isSubmitting} /> */}
        </form>

        <BookingSidebar wedding={wedding} />
      </div>

      <ElephantScene className="pointer-events-none absolute bottom-4 right-6 hidden h-36 w-36 opacity-80 lg:block" />
    </div>
  );
}
