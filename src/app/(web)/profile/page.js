"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import AccountSidebar from '@/components/common/AccountSidebar';
import Loader from '@/components/common/Loader';
import { Mail, Phone, Shield, Users } from '@/components/Icons';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { useUserAuth } from '@/hooks/useUserAuth';
import { setFrontendUser } from '@/lib/helpers';
import usersAPI from '@/lib/apis/users';
import { updateFrontendUser } from '@/store/slices/userAuthSlice';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const namePattern = /^[a-zA-Z]+(?:[ '\-][a-zA-Z]+)*$/;
const internationalPhonePattern = /^\+\d{7,}$/;

function getProfileForm(user) {
  const fullName = (user?.name || user?.full_name || '').trim();
  const [firstName = '', ...remainingNames] = fullName.split(/\s+/).filter(Boolean);

  return {
    firstName: user?.first_name || user?.firstName || firstName,
    lastName: user?.last_name || user?.lastName || remainingNames.join(' '),
    email: user?.email || '',
    phone: user?.phone || '',
  };
}

function validateForm(form) {
  const errors = {};

  if (!namePattern.test(form.firstName.trim())) {
    errors.firstName = 'Enter a valid first name.';
  }
  if (!namePattern.test(form.lastName.trim())) {
    errors.lastName = 'Enter a valid last name.';
  }
  if (!emailPattern.test(form.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }
  if (!internationalPhonePattern.test(form.phone)) {
    errors.phone = "Phone number must start with a '+' and be followed by at least 7 digits; spaces are not allowed.";
  }

  return errors;
}

function getErrorMessage(error, fallback) {
  if (Array.isArray(error)) return error[0];
  return typeof error === 'string' ? error : fallback;
}

function getInputClassName(error, padding = 'pl-10 pr-3') {
  return `w-full rounded-lg border bg-white/80 py-3 ${padding} text-sm text-ink outline-none transition focus:ring-2 ${
    error
      ? 'border-red-500 focus:border-red-600 focus:ring-red-100'
      : 'border-gold-200 focus:border-wine-400 focus:ring-wine-200'
  }`;
}

function Field({ children, error, label, htmlFor }) {
  const errorId = `${htmlFor}-error`;

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
          {label}
        </label>
      </div>
      {children}
      {error && <p id={errorId} className="mt-1.5 text-xs text-red-700">{error}</p>}
    </div>
  );
}

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { isAuthorized } = useProtectedRoute('frontend');
  const { user } = useUserAuth();
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const profileForm = form || getProfileForm(user);

  const updateField = (field) => (event) => {
    const nextForm = { ...profileForm, [field]: event.target.value };
    const validationErrors = validateForm(nextForm);

    setForm(nextForm);
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: validationErrors[field],
    }));
    setFormError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm(profileForm);

    setErrors(validationErrors);
    setFormError('');
    setSuccessMessage('');

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const profileData = {
      ...user,
      name: `${profileForm.firstName.trim()} ${profileForm.lastName.trim()}`,
      first_name: profileForm.firstName.trim(),
      last_name: profileForm.lastName.trim(),
      email: profileForm.email.trim(),
      phone: profileForm.phone,
    };

    const updateData = {
      name: profileData.name,
      first_name: profileData.first_name,
      last_name: profileData.last_name,
      email: profileData.email,
      phone: profileData.phone,
    };

    setIsSubmitting(true);

    try {
      const response = await usersAPI.updateUser(updateData);
      const responseUser = response?.user || response?.data?.user || (response?.email ? response : null);
      const updatedUser = responseUser ? { ...profileData, ...responseUser } : profileData;

      setFrontendUser(updatedUser);
      dispatch(updateFrontendUser(updatedUser));
  setForm(getProfileForm(updatedUser));
      setSuccessMessage('Your profile details have been updated.');
    } catch (error) {
      const apiErrors = error?.errors || {};
      const fieldErrors = {
        firstName: getErrorMessage(apiErrors.first_name || apiErrors.name),
        lastName: getErrorMessage(apiErrors.last_name),
        email: getErrorMessage(apiErrors.email),
        phone: getErrorMessage(apiErrors.phone),
      };

      setErrors(Object.fromEntries(Object.entries(fieldErrors).filter(([, value]) => value)));
      setFormError(getErrorMessage(error?.message, 'Unable to update your profile. Please try again.'));
    } finally {
      setIsSubmitting(false);
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

          <div className="min-w-0 p-5 sm:p-7 lg:p-9">
            <div className="mx-auto max-w-3xl overflow-hidden rounded-lg border border-gold-200 bg-cream-50 shadow-[0_10px_30px_rgba(108,10,34,0.08)]">
              <header className="relative min-h-44 overflow-hidden border-b border-gold-200 bg-gradient-to-r from-white via-cream-50 to-gold-100/60 px-5 py-7 sm:min-h-48 sm:px-7 sm:py-9">
                <div className="relative z-10 max-w-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-600">Account settings</p>
                  <h1 className="mt-2 font-display text-3xl font-semibold text-wine-700 sm:text-4xl">Update Your Profile</h1>
                  <div className="mt-3 h-px w-28 bg-gold-400" />
                  <p className="mt-4 text-sm leading-6 text-ink-soft">Keep your information up to date for every celebration you host or attend.</p>
                </div>
                <Image
                  src="/images/rigstration-left.png"
                  alt=""
                  width={360}
                  height={480}
                  className="pointer-events-none absolute -bottom-28 -right-8 hidden w-60 max-w-none object-contain sm:block lg:-right-3 lg:w-72"
                />
              </header>

              <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-7" noValidate>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Your First Name" htmlFor="first-name" error={errors.firstName}>
                    <div className="relative">
                      <Users className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-wine-500" />
                      <input id="first-name" required value={profileForm.firstName} onChange={updateField('firstName')} autoComplete="given-name" aria-invalid={Boolean(errors.firstName)} aria-describedby={errors.firstName ? 'first-name-error' : undefined} className={getInputClassName(errors.firstName)} />
                    </div>
                  </Field>

                  <Field label="Your Last Name" htmlFor="last-name" error={errors.lastName}>
                    <div className="relative">
                      <Users className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-wine-500" />
                      <input id="last-name" required value={profileForm.lastName} onChange={updateField('lastName')} autoComplete="family-name" aria-invalid={Boolean(errors.lastName)} aria-describedby={errors.lastName ? 'last-name-error' : undefined} className={getInputClassName(errors.lastName)} />
                    </div>
                  </Field>
                </div>

                <Field label="Your Email Address" htmlFor="email" error={errors.email}>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-wine-500" />
                    <input id="email" type="email" readOnly value={profileForm.email} autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} className={`${getInputClassName(errors.email)} cursor-not-allowed !bg-cream-100/80 text-ink-soft`} />
                  </div>
                </Field>

                <Field label="Phone number including country code" htmlFor="phone" error={errors.phone}>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-wine-500" />
                    <input id="phone" type="tel" inputMode="tel" required value={profileForm.phone} onChange={updateField('phone')} placeholder="e.g., +49123456789" autoComplete="tel" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'phone-error' : undefined} className={getInputClassName(errors.phone)} />
                  </div>
                </Field>

                {formError && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-center text-sm text-red-700">{formError}</p>}
                {successMessage && <p role="status" className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-center text-sm text-green-800">{successMessage}</p>}

                <button type="submit" disabled={isSubmitting} className="w-full rounded-lg bg-wine-700 py-3 text-sm font-semibold text-cream-50 shadow-sm transition hover:bg-wine-600 focus:outline-none focus:ring-2 focus:ring-wine-300 disabled:cursor-not-allowed disabled:opacity-60">
                  {isSubmitting ? 'Updating Profile...' : 'Update Profile'}
                </button>

                <p className="flex items-center justify-center gap-2 text-center text-xs text-ink-soft">
                  <Shield className="h-4 w-4 text-wine-500" />
                  Your information is secure and will not be shared.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}