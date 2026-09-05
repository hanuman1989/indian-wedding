"use client";

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import AccountSidebar from '@/components/common/AccountSidebar';
import ErrorMessage from '@/components/common/ErrorMessage';
import Loader from '@/components/common/Loader';
import SuccessMessage from '@/components/common/SuccessMessage';
import { Modal } from '@/components/ui/modal';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { useUserAuth } from '@/hooks/useUserAuth';
import weddingAPI from '@/lib/apis/wedding';
import CoupleStory from './CoupleStory';
import {
  ensureWeddingEvents,
  getInitialWeddingForm,
  getStepPayload,
  getWeddingFromResponse,
  normalizeWeddingForm,
  validateEntireWedding,
  validateWeddingStep,
} from './formUtils';
import PartnerDetails from './PartnerDetails';
import WeddingDetails from './WeddingDetails';
import WeddingPhotos from './WeddingPhotos';
import WeddingStepNavigation from './WeddingStepNavigation';
import WeddingStepper from './WeddingStepper';
import YourDetails from './YourDetails';

const firstStep = 1;
const finalStep = 5;

function getRouteStep(value) {
  const step = Number(value);
  return Number.isInteger(step) && step >= firstStep && step <= finalStep ? step : firstStep;
}

function getErrorMessage(error, fallback) {
  if (Array.isArray(error)) return error[0];
  return typeof error === 'string' ? error : fallback;
}

function getApiFieldErrors(error) {
  const apiErrors = error?.errors || {};
  const fields = {
    creatorType: apiErrors.creator_type,
    creatorTypeOther: apiErrors.creator_type_other,
    firstName: apiErrors.first_name,
    lastName: apiErrors.last_name,
    email: apiErrors.email,
    phone: apiErrors.phone,
    'bride.firstName': apiErrors['bride.first_name'],
    'bride.lastName': apiErrors['bride.last_name'],
    'bride.email': apiErrors['bride.email'],
    'bride.phone': apiErrors['bride.phone'],
    'groom.firstName': apiErrors['groom.first_name'],
    'groom.lastName': apiErrors['groom.last_name'],
    'groom.email': apiErrors['groom.email'],
    'groom.phone': apiErrors['groom.phone'],
    story: apiErrors.story,
    youtubeUrl: apiErrors.youtube_url,
    weddingDays: apiErrors.wedding_days,
    foodType: apiErrors.food_type,
    languages: apiErrors.languages,
    photos: apiErrors.photos,
  };

  return Object.fromEntries(
    Object.entries(fields)
      .map(([field, value]) => [field, getErrorMessage(value)])
      .filter(([, value]) => value)
  );
}

function getAvailableStep(form, savedStep = firstStep) {
  let availableStep = Math.max(firstStep, Math.min(finalStep, Number(savedStep) || firstStep));

  for (let step = firstStep; step < finalStep; step += 1) {
    if (Object.keys(validateWeddingStep(step, form)).length > 0) break;
    availableStep = Math.max(availableStep, step + 1);
  }

  return Math.min(availableStep, finalStep);
}

function getSavedStep(wedding) {
  return wedding?.current_step || wedding?.currentStep || wedding?.next_step || firstStep;
}

function getPhotoResponse(response, files, startingOrder) {
  const responsePhotos = response?.photos || response?.photo || response?.data?.photos || response?.data?.photo || [];

  if (Array.isArray(responsePhotos) && responsePhotos.length) {
    return responsePhotos.map((photo, index) => ({
      id: photo.id || photo.photo_id || photo.uuid || `uploaded-${Date.now()}-${index}`,
      url: photo.url || photo.image_url || photo.path || '',
      order: photo.order || photo.display_order || startingOrder + index,
    }));
  }

  return files.map((file, index) => ({
    id: `uploaded-${file.name}-${file.lastModified}-${index}`,
    preview: URL.createObjectURL(file),
    order: startingOrder + index,
  }));
}

function getStepComponent(step, props) {
  if (step === 1) return <YourDetails {...props} />;
  if (step === 2) return <PartnerDetails {...props} />;
  if (step === 3) return <CoupleStory {...props} />;
  if (step === 4) return <WeddingDetails {...props} />;
  return <WeddingPhotos {...props} />;
}

export default function PostWeddingFlow({ initialStep = firstStep, weddingId: initialWeddingId = null }) {
  const router = useRouter();
  const { isAuthorized } = useProtectedRoute('frontend');
  const { user } = useUserAuth();
  const [form, setForm] = useState(() => getInitialWeddingForm());
  const [weddingId, setWeddingId] = useState(initialWeddingId);
  const [currentStep, setCurrentStep] = useState(() => getRouteStep(initialStep));
  const [highestAvailableStep, setHighestAvailableStep] = useState(firstStep);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoadingWedding, setIsLoadingWedding] = useState(Boolean(initialWeddingId));
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingPhotoId, setDeletingPhotoId] = useState('');
  const [photoToDelete, setPhotoToDelete] = useState(null);
  const initializedNewForm = useRef(false);
  const photosRef = useRef([]);

  useEffect(() => {
    const routeStep = getRouteStep(initialStep);
    setCurrentStep(routeStep);
  }, [initialStep]);

  useEffect(() => {
    if (initialWeddingId) {
      setWeddingId(initialWeddingId);
      return;
    }

    setWeddingId(null);
    setHighestAvailableStep(firstStep);
    setIsLoadingWedding(false);
  }, [initialWeddingId]);

  useEffect(() => {
    if (!isAuthorized || initialWeddingId || initializedNewForm.current) return;

    initializedNewForm.current = true;
    setForm(getInitialWeddingForm(user || {}));
  }, [initialWeddingId, isAuthorized, user]);

  useEffect(() => {
    if (!isAuthorized || !initialWeddingId) return;

    let isActive = true;
    setIsLoadingWedding(true);
    setFormError('');

    const loadWedding = async () => {
      try {
        const response = await weddingAPI.getWedding(initialWeddingId);
        if (!isActive) return;

        const wedding = getWeddingFromResponse(response);
        const nextForm = normalizeWeddingForm(response, user || {});
        const availableStep = getAvailableStep(nextForm, getSavedStep(wedding));
        const requestedStep = getRouteStep(initialStep);
        const resolvedStep = Math.min(requestedStep, availableStep);

        setForm(nextForm);
        setHighestAvailableStep(availableStep);
        setCurrentStep(resolvedStep);

        if (requestedStep !== resolvedStep) {
          router.replace(`/post-weddings/${initialWeddingId}/step/${resolvedStep}`);
        }
      } catch (error) {
        if (!isActive) return;

        if (error?.status === 403) {
          setFormError('You do not have permission to edit this wedding.');
        } else if (error?.status === 404) {
          setFormError('This wedding draft could not be found.');
        } else {
          setFormError('Unable to load this wedding draft. Please try again.');
        }
      } finally {
        if (isActive) setIsLoadingWedding(false);
      }
    };

    void loadWedding();

    return () => {
      isActive = false;
    };
  }, [initialWeddingId, isAuthorized, router, user]);

  useEffect(() => {
    photosRef.current = form.photos;
  }, [form.photos]);

  useEffect(() => () => {
    photosRef.current.forEach((photo) => {
      if (photo.preview) URL.revokeObjectURL(photo.preview);
    });
  }, []);

  const updateFormField = (field, value) => {
    setForm((currentForm) => {
      if (!field.includes('.')) return { ...currentForm, [field]: value };

      const [group, property] = field.split('.');
      return {
        ...currentForm,
        [group]: { ...currentForm[group], [property]: value },
      };
    });
    setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
    setFormError('');
    setSuccessMessage('');
  };

  const validateField = (field) => {
    const validationErrors = validateWeddingStep(currentStep, form);
    setErrors((currentErrors) => ({ ...currentErrors, [field]: validationErrors[field] }));
  };

  const updateEvent = (index, field, value) => {
    setForm((currentForm) => ({
      ...currentForm,
      events: currentForm.events.map((event, eventIndex) => eventIndex === index ? { ...event, [field]: value } : event),
    }));
    setErrors((currentErrors) => ({ ...currentErrors, [`events.${index}.${field}`]: undefined }));
    setFormError('');
  };

  const updateWeddingDays = (weddingDays) => {
    setForm((currentForm) => ({
      ...currentForm,
      weddingDays,
      events: ensureWeddingEvents(weddingDays, currentForm.events),
    }));
    setErrors((currentErrors) => ({ ...currentErrors, weddingDays: undefined }));
  };

  const goToStep = (step) => {
    if (step > highestAvailableStep || isSaving || isSubmitting) return;

    setErrors({});
    setFormError('');
    setSuccessMessage('');
    setCurrentStep(step);

    if (weddingId) {
      router.push(`/post-weddings/${weddingId}/step/${step}`);
    }
  };

  const saveCurrentStep = async () => {
    const validationErrors = validateWeddingStep(currentStep, form);
    setErrors(validationErrors);
    setFormError('');
    setSuccessMessage('');

    if (Object.keys(validationErrors).length > 0) return;

    setIsSaving(true);

    try {
      let nextWeddingId = weddingId;
      let response;

      if (currentStep === firstStep && !weddingId) {
        response = await weddingAPI.createWedding(getStepPayload(currentStep, form));
        nextWeddingId = getWeddingFromResponse(response)?.id;

        if (!nextWeddingId) {
          throw { message: 'The new wedding draft did not return an ID. Please try again.' };
        }

        setWeddingId(nextWeddingId);
      } else if (currentStep === firstStep) {
        response = await weddingAPI.updateWeddingStepOne(weddingId, getStepPayload(currentStep, form));
      } else if (currentStep === 2) {
        response = await weddingAPI.updatePartnerDetails(weddingId, getStepPayload(currentStep, form));
      } else if (currentStep === 3) {
        response = await weddingAPI.updateStory(weddingId, getStepPayload(currentStep, form));
      } else {
        response = await weddingAPI.updateWeddingDetails(weddingId, getStepPayload(currentStep, form));
      }

      const nextStep = Math.min(currentStep + 1, finalStep);
      setHighestAvailableStep((availableStep) => Math.max(availableStep, nextStep));
      setSuccessMessage('Saved');
      setCurrentStep(nextStep);
      router.push(`/post-weddings/${nextWeddingId}/step/${nextStep}`);
    } catch (error) {
      setErrors((currentErrors) => ({ ...currentErrors, ...getApiFieldErrors(error) }));
      setFormError(getErrorMessage(error?.message, 'Unable to save this step. Please try again.'));
    } finally {
      setIsSaving(false);
    }
  };

  const persistPhotoOrder = async (nextPhotos, previousPhotos) => {
    if (!weddingId) return;

    try {
      await weddingAPI.reorderWeddingPhotos(weddingId, nextPhotos.map((photo, index) => ({ id: photo.id, order: index + 1 })));
    } catch {
      setForm((currentForm) => ({ ...currentForm, photos: previousPhotos }));
      setFormError('Unable to save the photo order. Please try again.');
    }
  };

  const reorderPhotos = (sourceId, destinationId) => {
    setForm((currentForm) => {
      const previousPhotos = currentForm.photos;
      const sourceIndex = previousPhotos.findIndex((photo) => String(photo.id) === String(sourceId));
      const destinationIndex = previousPhotos.findIndex((photo) => String(photo.id) === String(destinationId));
      if (sourceIndex < 0 || destinationIndex < 0) return currentForm;

      const nextPhotos = [...previousPhotos];
      const [movedPhoto] = nextPhotos.splice(sourceIndex, 1);
      nextPhotos.splice(destinationIndex, 0, movedPhoto);
      const orderedPhotos = nextPhotos.map((photo, index) => ({ ...photo, order: index + 1 }));
      void persistPhotoOrder(orderedPhotos, previousPhotos);

      return { ...currentForm, photos: orderedPhotos };
    });
  };

  const movePhoto = (index, direction) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= form.photos.length) return;
    reorderPhotos(form.photos[index].id, form.photos[nextIndex].id);
  };

  const addPhotos = async (files) => {
    if (!weddingId || isUploading) return;

    setErrors((currentErrors) => ({ ...currentErrors, photos: undefined }));
    setFormError('');
    setIsUploading(true);

    try {
      const response = await weddingAPI.uploadWeddingPhotos(weddingId, files);
      const uploadedPhotos = getPhotoResponse(response, files, form.photos.length + 1);
      setForm((currentForm) => ({
        ...currentForm,
        photos: [...currentForm.photos, ...uploadedPhotos].map((photo, index) => ({ ...photo, order: index + 1 })),
      }));
    } catch (error) {
      setFormError(getErrorMessage(error?.message, 'Unable to upload your photos. Please try again.'));
    } finally {
      setIsUploading(false);
    }
  };

  const showRejectedFiles = (rejections) => {
    const hasFileTooLarge = rejections.some(({ errors: rejectedErrors }) => rejectedErrors.some((error) => error.code === 'file-too-large'));
    setFormError(hasFileTooLarge ? 'Each image must be 10 MB or smaller.' : 'Use JPG, JPEG, PNG, or WEBP image files only.');
  };

  const removePhoto = async () => {
    if (!photoToDelete || !weddingId) return;

    setDeletingPhotoId(photoToDelete.id);
    setFormError('');

    try {
      await weddingAPI.deleteWeddingPhoto(weddingId, photoToDelete.id);
      setForm((currentForm) => {
        const nextPhotos = currentForm.photos
          .filter((photo) => photo.id !== photoToDelete.id)
          .map((photo, index) => ({ ...photo, order: index + 1 }));
        if (photoToDelete.preview) URL.revokeObjectURL(photoToDelete.preview);
        return { ...currentForm, photos: nextPhotos };
      });
      setPhotoToDelete(null);
    } catch (error) {
      setFormError(getErrorMessage(error?.message, 'Unable to remove this photo. Please try again.'));
    } finally {
      setDeletingPhotoId('');
    }
  };

  const submitWedding = async () => {
    const validationErrors = validateEntireWedding(form);
    setErrors(validationErrors);
    setFormError('');

    if (Object.keys(validationErrors).length > 0 || !weddingId) {
      if (!weddingId) setFormError('Save your wedding details before publishing.');
      return;
    }

    setIsSubmitting(true);

    try {
      await weddingAPI.reorderWeddingPhotos(weddingId, form.photos.map((photo, index) => ({ id: photo.id, order: index + 1 })));
      await weddingAPI.submitWedding(weddingId);
      router.replace('/my-weddings?published=true');
    } catch (error) {
      setErrors((currentErrors) => ({ ...currentErrors, ...getApiFieldErrors(error) }));
      setFormError(getErrorMessage(error?.message, 'Unable to publish your wedding. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentProps = {
    errors,
    form,
    onBlur: validateField,
    onChange: updateFormField,
    ...(currentStep === 4 ? { onEventChange: updateEvent, onWeddingDaysChange: updateWeddingDays } : {}),
    ...(currentStep === 5 ? {
      deletingPhotoId,
      isUploading,
      onDelete: setPhotoToDelete,
      onFilesAccepted: addPhotos,
      onFilesRejected: showRejectedFiles,
      onMove: movePhoto,
      onReorder: reorderPhotos,
      photos: form.photos,
    } : {}),
  };

  if (!isAuthorized || isLoadingWedding) {
    return <Loader />;
  }

  return (
    <section className="relative isolate overflow-hidden bg-cream-50 py-8 sm:py-10 lg:py-12">
      <Image src="/images/bg.png" alt="" fill priority sizes="100vw" className="-z-10 object-cover object-center opacity-20" />
      <div className="shell">
        <div className="grid overflow-hidden border border-gold-200/90 bg-cream-50/95 shadow-[0_16px_48px_rgba(108,10,34,0.12)] lg:grid-cols-[230px_minmax(0,1fr)]">
          <AccountSidebar />
          <main className="min-w-0 p-5 sm:p-7 lg:p-9">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gold-200/80 pb-6">
              <div>
                <p className="text-sm font-medium text-gold-600">Your wedding space</p>
                <h1 className="mt-2 font-display text-3xl font-bold text-wine-700 sm:text-4xl">{weddingId ? 'Edit Your Wedding' : 'Post Your Wedding'}</h1>
                <p className="mt-2 text-sm leading-6 text-ink-soft">Share your story with the world. Fill in the details below to create a beautiful wedding page.</p>
              </div>
              <p className="max-w-48 pt-1 text-right font-display text-lg italic leading-6 text-wine-600">Every love story deserves to be celebrated</p>
            </div>

            <div className="no-scrollbar mt-7 overflow-x-auto pb-2">
              <WeddingStepper currentStep={currentStep} highestAvailableStep={highestAvailableStep} onStepChange={goToStep} />
            </div>

            <div className="mt-6 border border-gold-200 bg-cream-50/90 p-5 shadow-[0_8px_24px_rgba(108,10,34,0.05)] sm:p-7">
              {formError && <ErrorMessage message={formError} onClose={() => setFormError('')} className="mb-5" />}
              {successMessage && <SuccessMessage message={successMessage} onClose={() => setSuccessMessage('')} className="mb-5" />}

              {getStepComponent(currentStep, currentProps)}

              <div className="mt-7">
                <WeddingStepNavigation
                  step={currentStep}
                  isSaving={isSaving}
                  isSubmitting={isSubmitting}
                  onPrevious={() => currentStep === firstStep ? router.push('/my-weddings') : goToStep(currentStep - 1)}
                  onNext={saveCurrentStep}
                  onSubmit={submitWedding}
                />
              </div>
            </div>
          </main>
        </div>
      </div>

      <Modal
        isOpen={Boolean(photoToDelete)}
        onClose={() => !deletingPhotoId && setPhotoToDelete(null)}
        title="Remove photo?"
        description="This photo will be removed from your wedding gallery."
        size="sm"
        footer={(
          <>
            <button type="button" onClick={() => setPhotoToDelete(null)} disabled={Boolean(deletingPhotoId)} className="min-h-10 rounded-md border border-gold-300 px-4 text-sm font-semibold text-ink-soft transition-colors hover:bg-cream-100 disabled:opacity-60">Cancel</button>
            <button type="button" onClick={removePhoto} disabled={Boolean(deletingPhotoId)} className="min-h-10 rounded-md bg-wine-700 px-4 text-sm font-semibold text-cream-50 transition-colors hover:bg-wine-600 disabled:opacity-60">{deletingPhotoId ? 'Deleting...' : 'Delete'}</button>
          </>
        )}
      />
    </section>
  );
}