"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import AccountSidebar from '@/components/common/AccountSidebar';
import Loader from '@/components/common/Loader';
import { Eye, EyeOff, Lock, Shield } from '@/components/Icons';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { useUserAuth } from '@/hooks/useUserAuth';
import usersAPI from '@/lib/apis/users';

const initialForm = {
  oldPassword: '',
  password: '',
  confirmPassword: '',
};

function validateForm(form) {
  const errors = {};

  if (!form.oldPassword) {
    errors.oldPassword = 'Enter your current password.';
  }
  if (form.password.length < 8) {
    errors.password = 'Use at least 8 characters.';
  } else if (!/[a-z]/.test(form.password) || !/[A-Z]/.test(form.password) || !/\d/.test(form.password)) {
    errors.password = 'Include uppercase, lowercase, and a number.';
  }
  if (form.confirmPassword !== form.password) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
}

function getErrorMessage(error, fallback) {
  if (Array.isArray(error)) return error[0];
  return typeof error === 'string' ? error : fallback;
}

function getInputClassName(error) {
  return `w-full rounded-lg border bg-white/80 py-3 pl-10 pr-10 text-sm text-ink outline-none transition focus:ring-2 ${
    error
      ? 'border-red-500 focus:border-red-600 focus:ring-red-100'
      : 'border-gold-200 focus:border-wine-400 focus:ring-wine-200'
  }`;
}

function PasswordField({ error, id, label, onChange, placeholder, showPassword, toggleVisibility, value, autoComplete }) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-ink">
        {label}
      </label>
      <div className="relative">
        <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-wine-500" />
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          required
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={getInputClassName(error)}
        />
        <button
          type="button"
          onClick={toggleVisibility}
          aria-label={showPassword ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft transition-colors hover:text-wine-600"
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
      {error && <p id={errorId} className="mt-1.5 text-xs text-red-700">{error}</p>}
    </div>
  );
}

export default function ChangePasswordPage() {
  const { isAuthorized } = useProtectedRoute('frontend');
  const router = useRouter();
  const { logout } = useUserAuth();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visibleFields, setVisibleFields] = useState({
    oldPassword: false,
    password: false,
    confirmPassword: false,
  });

  const updateField = (field) => (event) => {
    const nextForm = { ...form, [field]: event.target.value };
    const validationErrors = validateForm(nextForm);

    setForm(nextForm);
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: validationErrors[field],
      ...(field === 'password' || field === 'confirmPassword'
        ? { confirmPassword: validationErrors.confirmPassword }
        : {}),
    }));
    setFormError('');
    setSuccessMessage('');
  };

  const toggleVisibility = (field) => () => {
    setVisibleFields((currentFields) => ({
      ...currentFields,
      [field]: !currentFields[field],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm(form);

    setErrors(validationErrors);
    setFormError('');
    setSuccessMessage('');

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      await usersAPI.changePassword({
        old_password: form.oldPassword,
        password: form.password,
        password_confirmation: form.confirmPassword,
      });

      await logout();
      router.replace('/?login=true');
    } catch (error) {
      const apiErrors = error?.errors || {};
      const fieldErrors = {
        oldPassword: getErrorMessage(apiErrors.old_password || apiErrors.current_password),
        password: getErrorMessage(apiErrors.password),
        confirmPassword: getErrorMessage(apiErrors.password_confirmation),
      };

      setErrors(Object.fromEntries(Object.entries(fieldErrors).filter(([, value]) => value)));
      setFormError(getErrorMessage(error?.message, 'Unable to update your password. Please try again.'));
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
                  <h1 className="mt-2 font-display text-3xl font-semibold text-wine-700 sm:text-4xl">Change Your Password</h1>
                  <div className="mt-3 h-px w-28 bg-gold-400" />
                  <p className="mt-4 text-sm leading-6 text-ink-soft">Use a unique password to keep your wedding account secure.</p>
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
                <PasswordField
                  id="old-password"
                  label="Current Password"
                  value={form.oldPassword}
                  error={errors.oldPassword}
                  showPassword={visibleFields.oldPassword}
                  onChange={updateField('oldPassword')}
                  toggleVisibility={toggleVisibility('oldPassword')}
                  placeholder="Enter your current password"
                  autoComplete="current-password"
                />

                <PasswordField
                  id="password"
                  label="New Password"
                  value={form.password}
                  error={errors.password}
                  showPassword={visibleFields.password}
                  onChange={updateField('password')}
                  toggleVisibility={toggleVisibility('password')}
                  placeholder="Create a new password"
                  autoComplete="new-password"
                />

                <PasswordField
                  id="confirm-password"
                  label="Confirm New Password"
                  value={form.confirmPassword}
                  error={errors.confirmPassword}
                  showPassword={visibleFields.confirmPassword}
                  onChange={updateField('confirmPassword')}
                  toggleVisibility={toggleVisibility('confirmPassword')}
                  placeholder="Re-enter your new password"
                  autoComplete="new-password"
                />

                {formError && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-center text-sm text-red-700">{formError}</p>}
                {successMessage && <p role="status" className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-center text-sm text-green-800">{successMessage}</p>}

                <button type="submit" disabled={isSubmitting} className="w-full rounded-lg bg-wine-700 py-3 text-sm font-semibold text-cream-50 shadow-sm transition hover:bg-wine-600 focus:outline-none focus:ring-2 focus:ring-wine-300 disabled:cursor-not-allowed disabled:opacity-60">
                  {isSubmitting ? 'Updating Password...' : 'Update Password'}
                </button>

                <p className="flex items-center justify-center gap-2 text-center text-xs text-ink-soft">
                  <Shield className="h-4 w-4 text-wine-500" />
                  Your password is stored securely and never shared.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}