"use client";
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { ChevronDown, Globe } from '@/components/Icons'
import { Logo, Mandala, PaisleyBand } from './Ornaments'
import LoginButtonSection from '@/components/login/LoginButtonSection'
import Link from 'next/link'
import { useUserAuth } from '@/hooks/useUserAuth'
const links = [
  { label: 'Home', href: '/' },
  { label: 'Browse Weddings', href: '/weddings' },
  { label: 'About Us', href: '#about' },
  { label: 'Blog', href: '#how-it-works' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Host Wedding', href: '/host-wedding' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const { isAuthenticated } = useUserAuth()
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header id="top" className="relative z-30">
      <img src="images/topbar.webp" alt="topbar" />

      <nav className="relative overflow-visible bg-wine-700">
        {/* faint mandala watermarks behind the bar */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <Mandala className="absolute -left-8 -top-6 h-28 w-28 text-gold-300/10" />
          <Mandala className="absolute -right-8 -top-6 h-28 w-28 text-gold-300/10" />
        </div>

        <div className="relative shell flex h-[74px] items-center justify-between gap-4">
          <Logo />

          <ul className="hidden items-center gap-7 lg:flex">
            {links.map((link, i) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={`relative block py-1 text-[13.5px] font-medium transition-colors ${
                    link.href === pathname
                      ? 'text-cream-50'
                      : 'text-cream-100/85 hover:text-gold-300'
                  }`}
                >
                  {link.label}
                  {link.href === pathname && (
                    <span className="absolute -bottom-0.5 left-0 h-[2px] w-full rounded-full bg-gold-400" />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">

            <LoginButtonSection />
            {!isAuthenticated && (
              <Link
                href="registration"
                className="rounded-md border border-gold-300/40 bg-wine-500 px-5 py-2 text-[13px] font-medium text-cream-50 shadow-sm transition-colors hover:bg-wine-400"
              >
                Sign Up
              </Link>
            )}

            {/* mobile menu toggle */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label="Toggle navigation"
              className="ml-1 flex items-center gap-1 text-cream-50 lg:hidden"
            >
              <span className="grid gap-[5px]">
                <span className="block h-[2px] w-5 bg-current" />
                <span className="block h-[2px] w-5 bg-current" />
                <span className="block h-[2px] w-5 bg-current" />
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
              />
            </button>
          </div>
        </div>

        {/* mobile dropdown */}
        {open && (
          <ul className="shell grid gap-1 border-t border-gold-300/20 pb-4 pt-2 lg:hidden">
            {links.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-2 py-2 text-sm text-cream-100/90 hover:bg-gold-400/10 hover:text-gold-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </header>
  )
}
