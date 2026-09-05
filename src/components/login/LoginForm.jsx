import SocialLogin from './SocialLogin'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, Mail } from '@/components/Icons'
import { useUserAuth } from '@/hooks/useUserAuth'
import { Modal } from '@/components/ui/modal'
import frontendAuthAPI from '@/lib/apis/frontendAuth'

const ACCENT = '#EF6461'
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function BrandPanel() {
  return (
    <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-b from-rose-50 to-orange-50 p-8 sm:flex">
      <div className="pointer-events-none absolute -left-10 top-8 h-40 w-40 rounded-full bg-rose-200/50 blur-2xl" />
      <div className="pointer-events-none absolute -right-6 top-1/3 h-32 w-32 rounded-full bg-orange-200/40 blur-2xl" />

      <div className="relative">
        <div className="flex items-center gap-2">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full text-white"
            style={{ backgroundColor: ACCENT }}
          >
            <Lock className="h-4 w-4" />
          </span>
          <span className="text-lg font-bold text-gray-900">our</span>
        </div>

        <h3 className="mt-8 text-2xl font-bold text-gray-900">Welcome back!</h3>
        <p className="mt-2 text-sm text-gray-500">
          Login to continue your journey with Our.
        </p>
      </div>

      {/* Decorative doorway illustration */}
      <div className="relative mx-auto mb-2 h-52 w-full max-w-[220px]">
        <div className="absolute inset-x-6 bottom-0 top-6 overflow-hidden rounded-t-full bg-gradient-to-b from-amber-100 to-amber-200">
          <div className="absolute inset-x-0 bottom-0">
            {[0, 1, 2, 3].map((step) => (
              <div
                key={step}
                className="mx-auto h-6 border-t border-amber-300/60"
                style={{ width: `${100 - step * 14}%` }}
              />
            ))}
          </div>
        </div>
        <div
          className="absolute inset-x-6 top-6 h-[calc(100%-1.5rem)] rounded-t-full opacity-90"
          style={{
            backgroundColor: ACCENT,
            transform: 'perspective(300px) rotateY(35deg)',
            transformOrigin: 'left center',
          }}
        />
        <div className="absolute -left-2 bottom-2 h-10 w-8 rounded-b-lg rounded-t-sm bg-rose-300" />
        <div
          className="absolute -left-3 bottom-0 h-8 w-8 rounded-full shadow-md"
          style={{ backgroundColor: ACCENT }}
        />
      </div>
    </div>
  )
}

function ForgotPasswordModal({ isOpen, onClose, initialEmail }) {
  const [resetEmail, setResetEmail] = useState(initialEmail)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const normalizedEmail = resetEmail.trim()

    if (!emailPattern.test(normalizedEmail)) {
      setError('Enter a valid email address.')
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      await frontendAuthAPI.requestPasswordReset(normalizedEmail)
      setIsSent(true)
    } catch (requestError) {
      setError(requestError?.message || 'Unable to send a password reset link. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reset your password"
      description="Enter your email address and we will send you a password reset link."
      size="md"
    >
      {isSent ? (
        <div className="space-y-5">
          <p role="status" className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
            Check your inbox for a password reset link.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-lg py-2.5 text-sm font-semibold text-white shadow-theme-xs transition hover:opacity-90"
            style={{ backgroundColor: ACCENT }}
          >
            Back to login
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="forgot-password-email" className="mb-1.5 block text-sm font-medium text-gray-700">
            Email address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              id="forgot-password-email"
              type="email"
              required
              autoComplete="email"
              value={resetEmail}
              onChange={(event) => {
                setResetEmail(event.target.value)
                setError('')
              }}
              placeholder="Enter your email"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'forgot-password-email-error' : undefined}
              className={`w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 ${error ? 'border-red-500 focus:border-red-600 focus:ring-red-100' : 'border-gray-200 focus:border-[#EF6461] focus:ring-[#EF6461]/40'}`}
            />
          </div>
          {error && <p id="forgot-password-email-error" role="alert" className="mt-1.5 text-xs text-red-700">{error}</p>}

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-lg py-2.5 text-sm font-semibold text-white shadow-theme-xs transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              style={{ backgroundColor: ACCENT }}
            >
              {isSubmitting ? 'Sending...' : 'Send reset link'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  )
}

export default function LoginForm({ onClose, socialLoginError = '' }) {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false)
  const [isSocialLoginErrorDismissed, setIsSocialLoginErrorDismissed] = useState(false)
  const { clearError, loading, login } = useUserAuth()
  const router = useRouter()
  const displayedFormError = formError || (isSocialLoginErrorDismissed ? '' : socialLoginError)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const validationErrors = {}

    if (!emailPattern.test(email.trim())) {
      validationErrors.email = 'Enter a valid email address.'
    }
    if (!password) {
      validationErrors.password = 'Password is required.'
    }

    setErrors(validationErrors)
    setFormError('')
    setIsSocialLoginErrorDismissed(true)
    clearError()

    if (Object.keys(validationErrors).length > 0) return

    const result = await login(email.trim(), password)

    if (result.meta.requestStatus === 'fulfilled') {
      onClose()
      router.replace('/dashboard')
      return
    }

    setFormError(result.payload || 'Unable to log in. Please try again.')
  }

  return (
    <div className="grid sm:grid-cols-2">
      <BrandPanel />

      <div className="flex flex-col justify-center p-6 sm:p-10">
        <h2 className="text-2xl font-bold text-gray-900">Login</h2>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Please login to your account.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
          {displayedFormError && (
            <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {displayedFormError}
            </p>
          )}

          <div>
            <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  setErrors((current) => ({ ...current, email: undefined }))
                  setFormError('')
                  setIsSocialLoginErrorDismissed(true)
                }}
                placeholder="Enter your email"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'login-email-error' : undefined}
                className={`w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 ${errors.email ? 'border-red-500 focus:border-red-600 focus:ring-red-100' : 'border-gray-200 focus:border-[#EF6461] focus:ring-[#EF6461]/40'}`}
              />
            </div>
            {errors.email && <p id="login-email-error" className="mt-1.5 text-xs text-red-700">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="login-password" className="mb-1.5 block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  setErrors((current) => ({ ...current, password: undefined }))
                  setFormError('')
                  setIsSocialLoginErrorDismissed(true)
                }}
                placeholder="Enter your password"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? 'login-password-error' : undefined}
                className={`w-full rounded-lg border py-2.5 pl-10 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 ${errors.password ? 'border-red-500 focus:border-red-600 focus:ring-red-100' : 'border-gray-200 focus:border-[#EF6461] focus:ring-[#EF6461]/40'}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p id="login-password-error" className="mt-1.5 text-xs text-red-700">{errors.password}</p>}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setIsForgotPasswordOpen(true)}
              className="text-sm font-medium hover:opacity-80"
              style={{ color: ACCENT }}
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg py-2.5 text-sm font-semibold text-white shadow-theme-xs transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            style={{ backgroundColor: ACCENT }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">or continue with</span>
            <span className="h-px flex-1 bg-gray-200" />
          </div>
        <SocialLogin />
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <Link href="/registration" onClick={onClose} className="font-medium hover:opacity-80" style={{ color: ACCENT }}>
            Sign up
          </Link>
        </p>

        <ForgotPasswordModal
          key={isForgotPasswordOpen ? `forgot-password-${email}` : 'forgot-password-closed'}
          isOpen={isForgotPasswordOpen}
          onClose={() => setIsForgotPasswordOpen(false)}
          initialEmail={email}
        />
      </div>
    </div>
  )
}
