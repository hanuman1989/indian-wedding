'use client';

import { useState } from 'react';
import { Facebook, Google } from '@/components/Icons'
import frontendAuthAPI from '@/lib/apis/frontendAuth'

export default function SocialLogin() {
    const [redirectingProvider, setRedirectingProvider] = useState('')
    const [error, setError] = useState('')

    const handleSocialLogin = (provider) => {
      setError('')
      setRedirectingProvider(provider)

      try {
        window.location.assign(frontendAuthAPI.getSocialLoginRedirectUrl(provider))
      } catch (requestError) {
        setRedirectingProvider('')
        setError(requestError?.message || 'Unable to start social login. Please try again.')
      }
    }

  return (
    <>
          {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <button
            type="button"
            disabled={Boolean(redirectingProvider)}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={() => handleSocialLogin('google')}
          >
            <Google className="h-5 w-5" />
            {redirectingProvider === 'google' ? 'Connecting to Google...' : 'Login with Google'}
          </button>

          <button
            type="button"
            disabled={Boolean(redirectingProvider)}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={() => handleSocialLogin('facebook')}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1877F2] text-white">
              <Facebook className="h-3 w-3" />
            </span>
            {redirectingProvider === 'facebook' ? 'Connecting to Facebook...' : 'Login with Facebook'}
          </button>
    </>
  )
}