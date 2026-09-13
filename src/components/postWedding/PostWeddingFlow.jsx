"use client";

import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import AccountSidebar from '@/components/common/AccountSidebar';
import ErrorMessage from '@/components/common/ErrorMessage';
import Loader from '@/components/common/Loader';
import SuccessMessage from '@/components/common/SuccessMessage';
import { Modal } from '@/components/ui/modal';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { useUserAuth } from '@/hooks/useUserAuth';
import { updateFrontendUser } from '@/store/slices/userAuthSlice';
import { setFrontendUser } from '@/lib/helpers';
import APIs from '@/lib/apis';
import CoupleStory from './CoupleStory';
import {
  createWeddingEvent,
  ensureWeddingEvents,
  getInitialWeddingForm,
  getStepPayload,
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
    images: apiErrors.images,
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
  if (Array.isArray(response) && response.length) {
    return response.map((photo, index) => ({
      id: photo.id || `uploaded-${Date.now()}-${index}`,
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
  if (step === 5) return <WeddingPhotos {...props} />;
  return <WeddingPhotos {...props} />;
}

export default function PostWeddingFlow({ initialStep = firstStep, weddingId: initialWeddingId = null }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthorized } = useProtectedRoute('frontend');
  const { user } = useUserAuth();
  const [form, setForm] = useState(() => getInitialWeddingForm());
  const [weddingId, setWeddingId] = useState(initialWeddingId);
  const [weddingStatus, setWeddingStatus] = useState('draft');
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
    setWeddingStatus('draft');
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
        const response = await APIs.frontend.weddings.getWedding(initialWeddingId);
        if (!isActive) return;

        const wedding = response.data;
        const nextForm = normalizeWeddingForm(response.data, user || {});
        const availableStep = getAvailableStep(nextForm, getSavedStep(wedding));
        const requestedStep = getRouteStep(initialStep);
        const resolvedStep = Math.min(requestedStep, availableStep);

        setForm(nextForm);
        setWeddingStatus(wedding.status || 'draft');
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
  }, [initialStep, initialWeddingId, isAuthorized, router, user]);

  useEffect(() => {
    photosRef.current = form.images;
  }, [form.images]);

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
      wedding_days: currentForm.wedding_days.map((day, dayIndex) => {
        if (dayIndex !== index) return day;

        const eventPath = field.match(/^wedding_day_events\.(\d+)\.(.+)$/);
        if (!eventPath) return { ...day, [field]: value };

        const [, eventIndex, eventField] = eventPath;
        const events = day.wedding_day_events?.length ? day.wedding_day_events : [createWeddingEvent()];
        return {
          ...day,
          wedding_day_events: events.map((event, currentEventIndex) => (
            currentEventIndex === Number(eventIndex) ? { ...event, [eventField]: value } : event
          )),
        };
      }),
    }));
    setErrors((currentErrors) => ({ ...currentErrors, [`wedding_days.${index}.${field}`]: undefined }));
    setFormError('');
  };

  const updateWeddingDays = (number_of_days) => {
    setForm((currentForm) => ({
      ...currentForm,
      weddingDays: number_of_days,
      wedding_days: ensureWeddingEvents(number_of_days, currentForm.wedding_days),
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
        response = await APIs.frontend.weddings.createWedding(getStepPayload(currentStep, form));
        nextWeddingId = response.data?.id;

        if(response.data && !user.is_host){
          const updatedUser = { ...user, is_host: true };
          setFrontendUser(updatedUser);
          dispatch(updateFrontendUser(updatedUser));
        }

        if (!nextWeddingId) {
          throw { message: 'The new wedding draft did not return an ID. Please try again.' };
        }
        setWeddingId(nextWeddingId);
      } else if (currentStep === firstStep) {
        const payload = getStepPayload(currentStep, form);
        if(weddingId){
           response = await APIs.frontend.weddings.updateWedding(weddingId, getStepPayload(currentStep, form));
        }else{
          response = await APIs.frontend.weddings.createWedding(payload);
        }
        if(response.data && !user.is_host){
          const updatedUser = { ...user, is_host: true };
          setFrontendUser(updatedUser);
          dispatch(updateFrontendUser(updatedUser));
        }
      } else if (currentStep === 2) {
        response = await APIs.frontend.weddings.updatePartnerDetails(weddingId, getStepPayload(currentStep, form));
      } else if (currentStep === 3) {
        response = await APIs.frontend.weddings.updateStory(weddingId, getStepPayload(currentStep, form));
      } else if (currentStep === 4) {
        response = await APIs.frontend.weddings.updateWeddingDays(weddingId, getStepPayload(currentStep, form));
      }else if (currentStep === 5) {
        response = await APIs.frontend.weddings.uploadWeddingPhotos(weddingId, getStepPayload(currentStep, form));
      } else {
        response = await APIs.frontend.weddings.updateWeddingDetails(weddingId, getStepPayload(currentStep, form));
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
      await APIs.frontend.weddings.updatePhotoOrder(weddingId, nextPhotos.map((photo) => photo.id));
    } catch {
      setForm((currentForm) => ({ ...currentForm, images: previousPhotos }));
      setFormError('Unable to save the photo order. Please try again.');
    }
  };

  const reorderPhotos = (sourceId, destinationId) => {
    setForm((currentForm) => {
      const previousPhotos = currentForm.images;
      const sourceIndex = previousPhotos.findIndex((photo) => String(photo.id) === String(sourceId));
      const destinationIndex = previousPhotos.findIndex((photo) => String(photo.id) === String(destinationId));
      if (sourceIndex < 0 || destinationIndex < 0) return currentForm;

      const nextPhotos = [...previousPhotos];
      const [movedPhoto] = nextPhotos.splice(sourceIndex, 1);
      nextPhotos.splice(destinationIndex, 0, movedPhoto);
      const orderedPhotos = nextPhotos.map((photo, index) => ({ ...photo, order: index + 1 }));
      void persistPhotoOrder(orderedPhotos, previousPhotos);

      return { ...currentForm, images: orderedPhotos };
    });
  };

  const movePhoto = (index, direction) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= form.images.length) return;
    reorderPhotos(form.images[index].id, form.images[nextIndex].id);
  };

  const addPhotos = async (files) => {
    if (!weddingId || isUploading) return;

    setErrors((currentErrors) => ({ ...currentErrors, images: undefined }));
    setFormError('');
    setIsUploading(true);

    try {
      const response = await APIs.frontend.weddings.uploadWeddingPhotos(weddingId, files);
      const uploadedPhotos = getPhotoResponse(response.data, files, form.images.length + 1);
      setForm((currentForm) => ({
        ...currentForm,
        images: [...currentForm.images, ...uploadedPhotos].map((photo, index) => ({ ...photo, order: index + 1 })),
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
      await APIs.frontend.weddings.deleteWeddingPhoto(weddingId, photoToDelete.id);
      setForm((currentForm) => {
        const nextImages = currentForm.images
          .filter((photo) => photo.id !== photoToDelete.id)
          .map((photo, index) => ({ ...photo, order: index + 1 }));
        if (photoToDelete.preview) URL.revokeObjectURL(photoToDelete.preview);
        return { ...currentForm, images: nextImages };
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
      if (weddingStatus === 'published') {
        router.replace('/my-weddings?updated=true');
      } else {
        await APIs.frontend.weddings.submitWedding(weddingId);
        router.replace('/my-weddings?published=true');
      }
    } catch (error) {
      console.log(error, 'submitWedding error---')
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
      images: form.images,
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
                  isPublished={weddingStatus === 'published'}
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