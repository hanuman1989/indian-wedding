"use client";

import { use, useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Lock } from '@/components/Icons'
import { useUserAuth } from '@/hooks/useUserAuth'
import usersAPI from '@/lib/apis/users'

const initialForm = {
  password: '',
  confirmPassword: '',
}

function validateForm(form) {
  const errors = {}

  if (form.password.length < 8) {
    errors.password = 'Use at least 8 characters.'
  } else if (!/[a-z]/.test(form.password) || !/[A-Z]/.test(form.password) || !/\d/.test(form.password)) {
    errors.password = 'Include uppercase, lowercase, and a number.'
  }
  if (form.confirmPassword !== form.password) {
    errors.confirmPassword = 'Passwords do not match.'
  }

  return errors
}

function getErrorMessage(error, fallback) {
  if (Array.isArray(error)) return error[0]
  return typeof error === 'string' ? error : fallback
}

function getSearchParam(value) {
  if (Array.isArray(value)) return value[0] || ''
  return value || ''
}

function getInputClassName(error) {
  return `w-full rounded-lg border bg-white/70 py-3 pl-10 pr-10 text-sm outline-none transition focus:ring-2 ${
    error
      ? 'border-red-500 focus:border-red-600 focus:ring-red-100'
      : 'border-gold-200 focus:border-wine-400 focus:ring-wine-200'
  }`
}

function PasswordField({ error, id, label, onChange, showPassword, toggleVisibility, value }) {
  const errorId = `${id}-error`

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
          minLength="8"
          value={value}
          onChange={onChange}
          placeholder={label === 'Password' ? 'Create a password' : 'Re-enter password'}
          autoComplete="new-password"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={getInputClassName(error)}
        />
        <button
          type="button"
          onClick={toggleVisibility}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-wine-600"
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
      {error && <p id={errorId} className="mt-1.5 text-xs text-red-700">{error}</p>}
    </div>
  )
}

export default function ResetPasswordPage({ searchParams }) {
  const params = use(searchParams)
  const token = getSearchParam(params.token)
  const email = getSearchParam(params.email)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { initialized, isAuthenticated } = useUserAuth()

  const hasValidResetLink = Boolean(token && email)

  const updateField = (field) => (event) => {
    const nextForm = { ...form, [field]: event.target.value }
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

    if (Object.keys(validationErrors).length > 0 || !hasValidResetLink) {
      if (!hasValidResetLink) {
        setFormError('This password reset link is invalid or has expired. Request a new reset link.')
      }
      return
    }

    setIsSubmitting(true)

    try {
      await usersAPI.resetPassword({
        token,
        email,
        password: form.password,
        password_confirmation: form.confirmPassword,
      })

      setForm(initialForm)
      setSuccessMessage('Your password has been reset. You can now log in.')
    } catch (error) {
      const apiErrors = error?.errors || {}
      const fieldErrors = {
        password: getErrorMessage(apiErrors.password),
        confirmPassword: getErrorMessage(apiErrors.password_confirmation),
      }

      setErrors(Object.fromEntries(Object.entries(fieldErrors).filter(([, value]) => value)))
      setFormError(getErrorMessage(error?.message, 'Unable to reset your password. Please try again.'))
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
          <span className="text-4xl text-gold-500">*</span>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-tight text-wine-700">
            Secure Your
            <br />
            Account
          </h1>
          <div className="mx-auto mt-5 h-px w-36 bg-gold-400" />
          <p className="mx-auto mt-5 max-w-xs text-sm leading-6 text-ink-soft">
            Choose a strong password to keep your account secure.
          </p>
        </div>

        <div className="w-full max-w-[560px] justify-self-center rounded-[24px] border border-gold-300 bg-cream-50/95 p-6 shadow-[0_20px_55px_rgba(108,10,34,0.16)] backdrop-blur-sm sm:p-9 lg:p-10">
          <div className="text-center">
            <div className="mx-auto h-12 w-48 bg-[url('/images/logo/logo.png')] bg-contain bg-center bg-no-repeat" />
            <h2 className="mt-2 font-display text-3xl font-semibold text-wine-700">Create New Password</h2>
            <div className="mx-auto mt-3 h-px w-28 bg-gold-400" />
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4" noValidate>
            <div className="space-y-4">
              <PasswordField
                id="password"
                label="Password"
                value={form.password}
                error={errors.password}
                showPassword={showPassword}
                onChange={updateField('password')}
                toggleVisibility={() => setShowPassword((current) => !current)}
              />
              <PasswordField
                id="confirm-password"
                label="Confirm Password"
                value={form.confirmPassword}
                error={errors.confirmPassword}
                showPassword={showConfirmation}
                onChange={updateField('confirmPassword')}
                toggleVisibility={() => setShowConfirmation((current) => !current)}
              />
            </div>

            {formError && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-center text-sm text-red-700">{formError}</p>}
            {successMessage && <p role="status" className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-center text-sm text-green-800">{successMessage}</p>}

            <button type="submit" disabled={isSubmitting || !hasValidResetLink} className="w-full rounded-lg bg-wine-700 py-3 text-sm font-semibold text-cream-50 shadow-sm transition hover:bg-wine-600 focus:outline-none focus:ring-2 focus:ring-wine-300 disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting ? 'Resetting password...' : 'Reset Password'}
            </button>
          </form>

          {initialized && !isAuthenticated && (
            <p className="mt-6 text-center text-sm text-ink-soft">
              Remember your password?{' '}
              <Link href="/?login=true" className="font-semibold text-wine-600 hover:text-wine-500">Log in</Link>
            </p>
          )}
        </div>
      </div>
    </section>
  )
}