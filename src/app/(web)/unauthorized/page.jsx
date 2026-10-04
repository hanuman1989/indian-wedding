import Link from 'next/link'
import { Mandala } from '@/components/Ornaments'

function InactiveIllustration() {
  return (
    <svg viewBox="0 0 400 190" className="mx-auto w-full max-w-[380px]" aria-hidden="true">
      <defs>
        <linearGradient id="inactive-lock" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#ffb0b2" />
          <stop offset="1" stopColor="#ff747e" />
        </linearGradient>
        <linearGradient id="inactive-shackle" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#ff9b9f" />
          <stop offset="1" stopColor="#ff6572" />
        </linearGradient>
      </defs>
      <circle cx="200" cy="115" r="112" fill="#fff0f2" />
      <path d="M25 175c-20 0-22-28-3-33 0-12 7-19 17-19-5-30 37-36 44-13 15-8 33 4 29 20h173c-4-24 17-36 33-24 13-12 35-2 35 19 20-2 26 15 20 25 24-4 35 25 14 25Z" fill="#fff3f4" />
      <g fill="#ffe3e5">
        <path d="M139 162c-4-21-7-39-20-53 2 23 11 41 20 53Zm-1-13c-22 0-29-9-29-17 14-1 24 5 29 17Zm-12-23c-19-1-24-10-23-17 12 0 19 5 23 17Zm-8-24c-9-9-10-20-4-24 8 7 9 17 4 24Zm18 47c0-17 6-27 14-29 4 14-2 24-14 29Zm-7-25c0-13 4-21 11-24 3 12-1 20-11 24Z" />
        <path d="M283 162c3-21 11-37 22-48-1 20-12 37-22 48Zm4-13c17-2 25-10 25-17-14 0-21 6-25 17Zm12-25c17-1 24-9 24-16-12-1-20 6-24 16Zm-15 33c17-6 27-3 30 4-11 7-22 4-30-4Z" />
      </g>
      <path d="M162 90V72a27 27 0 0 1 54 0v18" fill="none" stroke="url(#inactive-shackle)" strokeWidth="13" />
      <path d="M159 77v-5a30 30 0 0 1 53-19" fill="none" stroke="#ffc3c5" strokeWidth="3" strokeLinecap="round" />
      <rect x="141" y="85" width="104" height="77" rx="13" fill="url(#inactive-lock)" />
      <path d="M147 109V98c0-4 3-7 7-7h22" fill="none" stroke="#ffc5c7" strokeWidth="4" strokeLinecap="round" />
      <path d="M186 126a10 10 0 1 1 13 0l3 15h-19Z" fill="#bd092c" />
      <circle cx="249" cy="134" r="29" fill="#fa3047" stroke="white" strokeWidth="3" />
      <path d="M249 120v14" stroke="white" strokeWidth="6" strokeLinecap="round" />
      <circle cx="249" cy="146" r="3.5" fill="white" />
      <g fill="none" stroke="#ff4c60" strokeWidth="3" strokeLinecap="round">
        <path d="m270 93 9-16m1 24 16-6" />
      </g>
      <g fill="#ffa6ac">
        <circle cx="42" cy="78" r="3" /><circle cx="242" cy="37" r="3" />
      </g>
      <circle cx="85" cy="52" r="2.5" fill="#ffb773" />
      <path d="m326 74 6 6m0-6-6 6" stroke="#ff999e" strokeWidth="2" strokeLinecap="round" />
      <path d="M70 178h122m17 0h127" stroke="#ffe1dc" />
      <path d="m200 174 4 4-4 4-4-4Z" fill="#ffe1dc" />
    </svg>
  )
}

export default function UnauthorizedPage() {
  return (
    <main className="relative isolate flex min-h-[calc(100svh-74px)] items-center justify-center overflow-hidden bg-[#fffdfa] px-5 py-10 text-center sm:py-14">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_white_30%,_transparent_80%)]" />
      <Mandala className="pointer-events-none absolute -bottom-14 -left-14 h-40 w-40 text-[#f4d4a7]/25" />
      <Mandala className="pointer-events-none absolute -bottom-12 -right-10 h-36 w-36 text-[#f4d4a7]/25" />
      <div className="relative w-full max-w-[460px]">
        <InactiveIllustration />
        <h1 className="mt-2 font-display text-[32px] font-bold leading-tight text-[#8e0824] sm:text-[36px]">
          Account Inactive
        </h1>
        <h2 className="mt-2 text-base font-semibold text-[#3e536b] sm:text-[17px]">
          Your account has been deactivated
        </h2>
        <p className="mx-auto mt-2 max-w-[440px] text-[13px] leading-[1.55] text-[#718096] sm:text-sm">
          Your account is currently inactive. You cannot access the Indian Wedding Invitation platform at this time. If you believe this is a mistake, please contact our support team for assistance.
        </p>
        <div className="mx-auto mt-6 flex w-full max-w-[252px] flex-col gap-2">
          <Link href="/contact-us" className="flex min-h-10 items-center justify-center gap-2 rounded-md border border-[#b34459] bg-[#970626] px-4 py-2.5 text-[13px] font-medium text-white shadow-sm transition-colors hover:bg-wine-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-600 focus-visible:ring-offset-2">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 13v-2a8 8 0 0 1 16 0v2M4 12H3v6h4v-6Zm16 0h1v6h-4v-6Zm0 6v1a3 3 0 0 1-3 3h-4" />
            </svg>
            Contact Support
          </Link>
          <Link href="/" className="flex min-h-10 items-center justify-center gap-2 rounded-md border border-[#b34459] bg-white/70 px-4 py-2.5 text-[13px] font-semibold text-[#970626] transition-colors hover:bg-wine-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-600 focus-visible:ring-offset-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m12 5-7 7 7 7M5 12h14" />
            </svg>
            Return to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
