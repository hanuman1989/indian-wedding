"use client";
import { useState } from 'react'
import {
  Facebook,
  HeartFilled,
  Instagram,
  Send,
  Whatsapp,
  Youtube,
} from '@/components/Icons'
import { Logo, Mandala } from './Ornaments'

const columns = [
  {
    title: 'For Guests',
    links: ['Browse Weddings', 'How It Works', 'Guest Guide', 'FAQs'],
  },
  {
    title: 'For Hosts',
    links: ['Host Your Wedding', 'Pricing Guide', 'Host Guide', 'Success Stories'],
  },
  {
    title: 'Company',
    links: ['About Us', 'Blog', 'Privacy Policy', 'Terms & Conditions'],
  },
  {
    title: 'Support',
    links: ['Contact Us', 'Help Center', 'Safety & Trust'],
  },
]

const socials = [
  { Icon: Facebook, label: 'Facebook' },
  { Icon: Instagram, label: 'Instagram' },
  { Icon: Youtube, label: 'YouTube' },
  { Icon: Whatsapp, label: 'WhatsApp' },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const onSubscribe = (e) => {
    e.preventDefault()
    // Read from the form rather than from state: browser autofill can set the
    // input value without firing React's onChange, and we still want it to send.
    const value = new FormData(e.currentTarget).get('email')?.toString().trim()
    if (!value) return
    // Wire this to your newsletter endpoint.
    setSent(true)
    setEmail('')
  }

  return (
    <footer id="contact" className="relative overflow-hidden bg-wine-700">
      <Mandala className="pointer-events-none absolute -left-16 top-6 h-56 w-56 text-gold-300/[0.07]" />
      <Mandala className="pointer-events-none absolute -right-16 bottom-0 h-56 w-56 text-gold-300/[0.07]" />

      <div className="shell relative pt-8 pb-5">
        <div className="grid gap-7 lg:grid-cols-[1.25fr_repeat(4,0.75fr)_1.3fr] lg:gap-6">
          {/* brand */}
          <div>
            <Logo />
            <p className="mt-3 text-[11.5px] leading-relaxed text-cream-100/75">
              Be part of a wedding.
              <br />
              Be part of a family.
            </p>

            <ul className="mt-4 flex items-center gap-2.5">
              {socials.map(({ Icon, label }) => (
                <li key={label}>
                  <a
                    href="#contact"
                    aria-label={label}
                    className="grid h-8 w-8 place-items-center rounded-full bg-gold-400 text-wine-800 transition-colors hover:bg-gold-300"
                  >
                    <Icon className="h-[17px] w-[17px]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* link columns */}
          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="mb-3 text-[12px] font-semibold text-gold-300">
                {column.title}
              </h3>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#contact"
                      className="text-[11.5px] text-cream-100/80 transition-colors hover:text-gold-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* newsletter */}
          <div>
            <h3 className="mb-3 text-[12px] font-semibold text-gold-300">
              Stay Updated
            </h3>
            <p className="mb-3 text-[11.5px] leading-relaxed text-cream-100/75">
              Get updates on new weddings and special celebrations.
            </p>

            <form onSubmit={onSubscribe} className="flex overflow-hidden rounded-md">
              <input
                type="email"
                name="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setSent(false)
                }}
                placeholder="Enter your email"
                aria-label="Email address"
                className="h-10 w-full bg-white px-3 text-[12px] text-ink placeholder:text-ink-soft/60 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="grid w-11 shrink-0 place-items-center bg-wine-500 text-cream-50 transition-colors hover:bg-wine-400"
              >
                <Send className="h-[17px] w-[17px]" />
              </button>
            </form>

            {sent && (
              <p className="mt-2 text-[11px] text-gold-300" role="status">
                Thank you — you&apos;re on the list!
              </p>
            )}
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-gold-300/20 pt-4 text-[11px] text-cream-100/70 sm:flex-row">
          <p>© 2024 Shaadi Invites. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Made with
            <HeartFilled className="h-3.5 w-3.5 text-wine-300" />
            for Indian Weddings
          </p>
        </div>
      </div>
    </footer>
  )
}
