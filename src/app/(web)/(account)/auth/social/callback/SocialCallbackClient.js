"use client";

import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { socialLoginFrontendUser } from '@/store/slices/userAuthSlice'
import { getSocialLoginPage, removeSocialLoginPage } from '@/lib/helpers';

export default function SocialCallbackClient({ code, errorMessage }) {
  const dispatch = useDispatch()
  const router = useRouter()
  const hasProcessedCallback = useRef(false)

    const getRedirectPath = (pathname) => {
      if (pathname.startsWith('/wedding-detail')) {
        return pathname;
      }
      if (pathname === '/host-wedding') {
        return '/post-weddings';
      }
      return '/dashboard';
    };

  useEffect(() => {
    if (hasProcessedCallback.current) return

    hasProcessedCallback.current = true

    if (!code || errorMessage) {
      router.replace('/?login=true&social_login=failed')
      return
    }

    const exchangeCode = async () => {
      try {
        await dispatch(socialLoginFrontendUser(code)).unwrap()
        const socialLoginPage = getSocialLoginPage()
        removeSocialLoginPage();
        router.replace(getRedirectPath(socialLoginPage))
      } catch {
        router.replace('/?login=true&social_login=failed')
      }
    }

    void exchangeCode()
  }, [code, dispatch, errorMessage, router])

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream-100">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gold-200 border-t-wine-700" />
        <p className="text-ink-soft">Signing you in...</p>
      </div>
    </main>
  )
}