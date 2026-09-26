"use client";
import { useState } from 'react'
import Link from 'next/link'
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
    links: [
      { title: 'Browse Weddings', href: '/weddings' },
      { title: 'How It Works', href: '/#how-it-works' },
      { title: 'FAQs', href: '/faqs' },
    ],
  },
  {
    title: 'For Hosts',
    links: [
      { title: 'Host Your Wedding', href: '/host-wedding' },
      { title: 'Host Guide', href: '/host-wedding#host-how-it-works' },
    ],
  },
  {
    title: 'Company',
    links: [
      { title: 'About Us', href: '/about' },
      { title: 'Privacy Policy', href: '/privacy-policy' },
      { title: 'Terms & Conditions', href: '/terms-and-conditions' },
    ],
  },
  {
    title: 'Support',
    links: [
      { title: 'Contact Us', href: '/contact' },
    ],
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
    <footer id="contact" className="relative overflow-hidden bg-wine-700 z-1">

      <div className="shell relative pt-8 pb-5">
        <div className="grid gap-7 lg:grid-cols-[1.40fr_repeat(3,0.80fr)_1.3fr] lg:gap-6">
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
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className="text-[11.5px] text-cream-100/80 transition-colors hover:text-gold-300"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* newsletter */}
        </div>

        {/* bottom bar */}
        <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-gold-300/20 pt-4 text-[11px] text-cream-100/70 sm:flex-row">
          <p>@ {new Date().getFullYear()} IWI. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Made with
            <HeartFilled className="h-3.5 w-3.5 text-wine-300" />
            for Indian Wedding Invitation
          </p>
        </div>
      </div>
    </footer>
  )
}
