"use client";

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Lock, Mail, Phone, Users } from '@/components/Icons'
import usersAPI from '@/lib/apis/users'

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  acceptedTerms: false,
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const namePattern = /^[a-zA-Z]+(?:[ '\-][a-zA-Z]+)*$/
const internationalPhonePattern = /^\+\d{7,}$/

function validateForm(form) {
  const errors = {}

  if (!namePattern.test(form.firstName.trim())) {
    errors.firstName = 'Enter a valid first name.'
  }
  if (!namePattern.test(form.lastName.trim())) {
    errors.lastName = 'Enter a valid last name.'
  }
  if (!emailPattern.test(form.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }
  if (!internationalPhonePattern.test(form.phone)) {
    errors.phone = "Phone number must start with a '+' and be followed by at least 7 digits; spaces are not allowed."
  }
  if (form.password.length < 8) {
    errors.password = 'Use at least 8 characters.'
  } else if (!/[a-z]/.test(form.password) || !/[A-Z]/.test(form.password) || !/\d/.test(form.password)) {
    errors.password = 'Include uppercase, lowercase, and a number.'
  }
  if (form.confirmPassword !== form.password) {
    errors.confirmPassword = 'Passwords do not match.'
  }
  if (!form.acceptedTerms) {
    errors.acceptedTerms = 'You must accept the terms to continue.'
  }

  return errors
}

function getErrorMessage(error, fallback) {
  if (Array.isArray(error)) return error[0]
  return typeof error === 'string' ? error : fallback
}

function getInputClassName(error, padding = 'pl-10 pr-3') {
  return `w-full rounded-lg border bg-white/70 py-3 ${padding} text-sm outline-none transition focus:ring-2 ${
    error
      ? 'border-red-500 focus:border-red-600 focus:ring-red-100'
      : 'border-gold-200 focus:border-wine-400 focus:ring-wine-200'
  }`
}

function Field({ children, error, label, htmlFor }) {
  const errorId = `${htmlFor}-error`

  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {error && <p id={errorId} className="mt-1.5 text-xs text-red-700">{error}</p>}
    </div>
  )
}

function InputShell({ children }) {
  return <div className="relative">{children}</div>
}

export default function RegistrationPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = (field) => (event) => {
    const value = event.target.type === 'checkbox'
      ? event.target.checked
      : event.target.value
    const nextForm = { ...form, [field]: value }
    const validationErrors = validateForm(nextForm)

    setForm(nextForm)
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: validationErrors[field],
      ...(field === 'password' || field === 'confirmPassword'
        ? { confirmPassword: validationErrors.confirmPassword }
        : {}),
    }))
    setFormError('')
    setSuccessMessage('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const validationErrors = validateForm(form)

    setErrors(validationErrors)
    setFormError('')
    setSuccessMessage('')

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    setIsSubmitting(true)

    try {
      await usersAPI.register({
        name: `${form.firstName.trim()} ${form.lastName.trim()}`,
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone,
        password: form.password,
        password_confirmation: form.confirmPassword,
      })

      setForm(initialForm)
      setSuccessMessage('Your account has been created. You can now log in.')
    } catch (error) {
      const apiErrors = error?.errors || {}
      const fieldErrors = {
        firstName: getErrorMessage(apiErrors.first_name || apiErrors.name),
        lastName: getErrorMessage(apiErrors.last_name),
        email: getErrorMessage(apiErrors.email),
        phone: getErrorMessage(apiErrors.phone),
        password: getErrorMessage(apiErrors.password),
        confirmPassword: getErrorMessage(apiErrors.password_confirmation),
      }

      setErrors(Object.fromEntries(Object.entries(fieldErrors).filter(([, value]) => value)))
      setFormError(getErrorMessage(error?.message, 'Unable to create your account. Please try again.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      className="relative isolate overflow-hidden bg-cream-100 py-10 sm:py-14 lg:py-20"
      style={{ backgroundImage: "url('/images/bg.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 -z-10 bg-cream-50/70" />

      <div className="shell grid min-h-[650px] items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="hidden max-w-md justify-self-center text-center lg:block">
          <span className="text-4xl text-gold-500">✦</span>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-tight text-wine-700">
            Join Us in Celebrating
            <br />
            Beautiful Beginnings
          </h1>
          <div className="mx-auto mt-5 h-px w-36 bg-gold-400" />
          <p className="mx-auto mt-5 max-w-xs text-sm leading-6 text-ink-soft">
            Create your account and start your journey to memorable celebrations.
          </p>
        </div>

        <div className="w-full max-w-[560px] justify-self-center rounded-[24px] border border-gold-300 bg-cream-50/95 p-6 shadow-[0_20px_55px_rgba(108,10,34,0.16)] backdrop-blur-sm sm:p-9 lg:p-10">
          <div className="text-center">
            <div className="mx-auto h-12 w-48 bg-[url('/images/logo/logo.png')] bg-contain bg-center bg-no-repeat" />
            <h2 className="mt-2 font-display text-3xl font-semibold text-wine-700">Create Your Account</h2>
            <div className="mx-auto mt-3 h-px w-28 bg-gold-400" />
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="First name" htmlFor="first-name" error={errors.firstName}>
                <InputShell>
                  <Users className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-wine-500" />
                  <input id="first-name" required value={form.firstName} onChange={updateField('firstName')} placeholder="Your first name" autoComplete="given-name" aria-invalid={Boolean(errors.firstName)} aria-describedby={errors.firstName ? 'first-name-error' : undefined} className={getInputClassName(errors.firstName)} />
                </InputShell>
              </Field>
              <Field label="Last name" htmlFor="last-name" error={errors.lastName}>
                <InputShell>
                  <Users className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-wine-500" />
                  <input id="last-name" required value={form.lastName} onChange={updateField('lastName')} placeholder="Your last name" autoComplete="family-name" aria-invalid={Boolean(errors.lastName)} aria-describedby={errors.lastName ? 'last-name-error' : undefined} className={getInputClassName(errors.lastName)} />
                </InputShell>
              </Field>
            </div>

            <Field label="Email address" htmlFor="email" error={errors.email}>
              <InputShell>
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-wine-500" />
                <input id="email" type="email" required value={form.email} onChange={updateField('email')} placeholder="Your email address" autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} className={getInputClassName(errors.email)} />
              </InputShell>
            </Field>

            <Field label="Phone number including country code" htmlFor="phone" error={errors.phone}>
              <InputShell>
                <Phone className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-wine-500" />
                <input id="phone" type="tel" inputMode="tel" required value={form.phone} onChange={updateField('phone')} placeholder="e.g., +49123456789" autoComplete="tel" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'phone-error' : undefined} className={getInputClassName(errors.phone)} />
              </InputShell>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Password" htmlFor="password" error={errors.password}>
                <InputShell>
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-wine-500" />
                  <input id="password" type={showPassword ? 'text' : 'password'} required minLength="8" value={form.password} onChange={updateField('password')} placeholder="Create a password" autoComplete="new-password" aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? 'password-error' : undefined} className={getInputClassName(errors.password, 'pl-10 pr-10')} />
                  <button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-wine-600">
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </InputShell>
              </Field>
              <Field label="Confirm password" htmlFor="confirm-password" error={errors.confirmPassword}>
                <InputShell>
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-wine-500" />
                  <input id="confirm-password" type={showConfirmation ? 'text' : 'password'} required minLength="8" value={form.confirmPassword} onChange={updateField('confirmPassword')} placeholder="Re-enter password" autoComplete="new-password" aria-invalid={Boolean(errors.confirmPassword)} aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined} className={getInputClassName(errors.confirmPassword, 'pl-10 pr-10')} />
                  <button type="button" onClick={() => setShowConfirmation((current) => !current)} aria-label={showConfirmation ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-wine-600">
                    {showConfirmation ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </InputShell>
              </Field>
            </div>

            <label className="flex items-start gap-2 pt-1 text-xs leading-5 text-ink-soft">
              <input type="checkbox" required checked={form.acceptedTerms} onChange={updateField('acceptedTerms')} aria-invalid={Boolean(errors.acceptedTerms)} aria-describedby={errors.acceptedTerms ? 'terms-error' : undefined} className="mt-0.5 h-4 w-4 rounded border-gold-300 text-wine-600 focus:ring-wine-300" />
              I agree to the Terms &amp; Conditions and Privacy Policy.
            </label>
            {errors.acceptedTerms && <p id="terms-error" className="-mt-2 text-xs text-red-700">{errors.acceptedTerms}</p>}

            {formError && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-center text-sm text-red-700">{formError}</p>}
            {successMessage && <p role="status" className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-center text-sm text-green-800">{successMessage}</p>}

            <button type="submit" disabled={isSubmitting} className="w-full rounded-lg bg-wine-700 py-3 text-sm font-semibold text-cream-50 shadow-sm transition hover:bg-wine-600 focus:outline-none focus:ring-2 focus:ring-wine-300 disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-soft">
            Already registered?{' '}
            <Link href="/" className="font-semibold text-wine-600 hover:text-wine-500">Login</Link>
          </p>
        </div>
      </div>
    </section>
  )
}