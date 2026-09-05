"use client";
import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronDown } from '@/components/Icons'
import { useModal } from '@/hooks/useModal'
import { Modal } from '@/components/ui/modal'
import { useUserAuth } from '@/hooks/useUserAuth'
import LoginForm from './LoginForm'


export default function LoginButtonSection() {
    const { isOpen, openModal, closeModal } = useModal()
  const { isAuthenticated, loading, logout, user } = useUserAuth()
    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()
    const shouldOpenLogin = searchParams.get('login') === 'true'
    const socialLoginError = searchParams.get('social_login') === 'failed'
      ? 'Unable to complete social login. Please try again.'
      : ''
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const accountMenuRef = useRef(null)

    useEffect(() => {
      if (shouldOpenLogin && !isAuthenticated) {
        openModal()
      }
    }, [isAuthenticated, openModal, shouldOpenLogin])

    useEffect(() => {
      const closeAccountMenu = (event) => {
        if (event.key === 'Escape') {
          setIsAccountMenuOpen(false)
        }

        if (event.type === 'mousedown' && !accountMenuRef.current?.contains(event.target)) {
          setIsAccountMenuOpen(false)
        }
      }

      document.addEventListener('keydown', closeAccountMenu)
      document.addEventListener('mousedown', closeAccountMenu)

      return () => {
        document.removeEventListener('keydown', closeAccountMenu)
        document.removeEventListener('mousedown', closeAccountMenu)
      }
    }, [])

    const handleLogout = async () => {
      await logout()
      setIsAccountMenuOpen(false)
    }

    const handleCloseModal = () => {
      closeModal()

      if (!shouldOpenLogin) return

      const nextSearchParams = new URLSearchParams(searchParams.toString())
      nextSearchParams.delete('login')
      nextSearchParams.delete('social_login')
      const query = nextSearchParams.toString()
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
    }

  return (
    <>
      {isAuthenticated ? (
        <div ref={accountMenuRef} className="relative hidden sm:block">
          <button
            type="button"
            onClick={() => setIsAccountMenuOpen((current) => !current)}
            aria-expanded={isAccountMenuOpen}
            aria-haspopup="menu"
            aria-controls="account-menu"
            className="flex max-w-44 items-center gap-2 rounded-md border border-gold-300/70 px-5 py-2 text-[13px] font-medium text-cream-50 transition-colors hover:bg-gold-400/15"
          >
            <span className="truncate capitalize">{user?.name || 'Account'}</span>
            <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${isAccountMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {isAccountMenuOpen && (
            <div id="account-menu" role="menu" className="absolute right-0 z-99999 mt-2 w-44 overflow-hidden rounded-md border border-gold-300/70 bg-cream-50 py-1 shadow-lg">
              <Link href="/profile" role="menuitem" onClick={() => setIsAccountMenuOpen(false)} className="block px-4 py-2 text-sm text-ink transition-colors hover:bg-gold-100 hover:text-wine-700">
                Profile
              </Link>
              <Link href="/my-weddings" role="menuitem" onClick={() => setIsAccountMenuOpen(false)} className="block px-4 py-2 text-sm text-ink transition-colors hover:bg-gold-100 hover:text-wine-700">
                My Weddings
              </Link>
              <div className="my-1 border-t border-gold-200" />
              <button type="button" role="menuitem" onClick={handleLogout} disabled={loading} className="block w-full px-4 py-2 text-left text-sm text-wine-700 transition-colors hover:bg-gold-100 disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          <button onClick={openModal} type="button" className="hidden rounded-md border border-gold-300/70 px-5 py-2 text-[13px] font-medium text-cream-50 transition-colors hover:bg-gold-400/15 sm:block">
            Login
          </button>
          <Modal isOpen={isOpen} onClose={handleCloseModal} size="3xl" noPadding>
            <LoginForm onClose={handleCloseModal} socialLoginError={socialLoginError} />
          </Modal>
        </>
      )}
  </> )
}