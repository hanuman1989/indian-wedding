"use client";

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Phone, MapPin, Send, Info } from '@/components/Icons'
import { Flourish } from '@/components/Ornaments'
import { FormField, getInputClassName } from '@/components/postWedding/PostWeddingField'
import ErrorMessage from '@/components/common/ErrorMessage'
import SuccessMessage from '@/components/common/SuccessMessage'
import APIs from '@/lib/apis';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function getFieldError(fieldErrors) {
  return Array.isArray(fieldErrors) ? fieldErrors[0] : fieldErrors
}

function normalizeApiErrors(apiErrors) {
  return Object.fromEntries(
    Object.entries(apiErrors || {}).map(([field, fieldErrors]) => [field, getFieldError(fieldErrors)]),
  )
}

const contactChannels = [
  {
    Icon: Mail,
    title: 'Email Us',
    description: 'For general inquiries, support or partnership opportunities.',
    action: { label: 'support@shaadiinvites.com', href: 'mailto:support@shaadiinvites.com' },
  },
  {
    Icon: Phone,
    title: 'Call Us',
    description: 'Mon - Fri, 9:00 AM - 6:00 PM (IST)',
    action: { label: '+91 98765 43210', href: 'tel:+919876543210' },
  },
  {
    Icon: MapPin,
    title: 'Our Office',
    description: (
      <>
        123 Wedding Street, Mansarovar
        <br />
        Jaipur, Rajasthan 302020
        <br />
        India
      </>
    ),
  },
  
]

function ContactChannelCard({ Icon, title, description, action }) {
  return (
    <div className="flex items-start gap-4 border-b border-cream-200 pb-5 last:border-b-0 last:pb-0">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-cream-100 text-wine-700">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-sm font-bold text-wine-700">{title}</p>
        <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">{description}</p>
        {action && (
          <Link
            href={action.href}
            className="mt-1 inline-flex items-center gap-1.5 text-[13px] font-semibold text-wine-700 hover:text-wine-500"
          >
            {action.label}
            {action.Icon && <action.Icon className="h-3.5 w-3.5" />}
          </Link>
        )}
      </div>
    </div>
  )
}

export default function ContactPage() {
  const [form, setForm] = useState({ full_name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const validate = () => {
    const validationErrors = {}
    if (!form.full_name.trim()) validationErrors.full_name = 'Please enter your full name.'
    if (!form.email.trim()) validationErrors.email = 'Please enter your email address.'
    else if (!emailPattern.test(form.email.trim())) validationErrors.email = 'Enter a valid email address.'
    if (!form.message.trim()) validationErrors.message = 'Please enter a message.'
    return validationErrors
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSuccessMessage('')
    setErrorMessage('')

    const validationErrors = validate()
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)
    try {
      await APIs.frontend.contactInquiry.contactInquiry({
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      })
      setForm({ full_name: '', email: '', message: '' })
      setErrors({})
      setSuccessMessage('Thanks for reaching out! We\u2019ll get back to you within 24-48 hours.')
    } catch (error) {
      const apiFieldErrors = normalizeApiErrors(error?.errors)
      if (Object.keys(apiFieldErrors).length) {
        setErrors(apiFieldErrors)
      } else {
        setErrorMessage(error?.message || 'Unable to send your message. Please try again.')
      }
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
        <div className="shell">
            {/* This is the faqs section */}
            <div className="mx-auto max-w-2xl text-center">
              <div className="flex items-center justify-center gap-3">
                <Flourish mirrored />
                <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-gold-600">
                  GET IN TOUCH
                </p>
                <Flourish />
              </div>
              <h1 className="mt-3 font-display text-[28px] font-bold leading-tight text-wine-700 sm:text-[32px]">
                Contact Us
              </h1>
              <p className="mt-2 text-md font-bold">
                We'd love to hear from you.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                Whether you have a question, need help with a booking, want to host your wedding, or just want to learn more about IWI — our team is here to help.
              </p>
            </div>

            <div className="mx-auto mt-10 grid max-w-5xl gap-6 lg:grid-cols-2 lg:items-stretch">
              <div className="flex flex-col gap-6">
                <div className="h-full rounded-xl border border-cream-300 bg-white p-5 sm:p-7">
                  <h2 className="border-l-2 border-dotted border-gold-400 pl-3 font-display text-lg font-bold text-wine-700">
                    Contact Information
                  </h2>
                  <p className="mt-1 pl-3 text-[13px] text-ink-soft">
                    Reach out to us through any of the following channels.
                  </p>

                  <div className="mt-5 space-y-5">
                    {contactChannels.map((channel) => (
                      <ContactChannelCard key={channel.title} {...channel} />
                    ))}
                  </div>
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                className="flex h-full flex-col rounded-xl border border-cream-300 bg-white p-5 sm:p-7"
              >
                <h2 className="border-l-2 border-dotted border-gold-400 pl-3 font-display text-lg font-bold text-wine-700">
                  Send Us a Message
                </h2>
                <p className="mt-1 pl-3 text-[13px] text-ink-soft">
                  Fill out the form below and we&apos;ll get back to you as soon as possible.
                </p>

                <SuccessMessage message={successMessage} onClose={() => setSuccessMessage('')} className="mt-4" />
                <ErrorMessage message={errorMessage} onClose={() => setErrorMessage('')} className="mt-4" />

                <div className="mt-5 space-y-4">
                  <FormField htmlFor="contact-name" label="Full Name" error={errors.full_name} required>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      disabled={isSubmitting}
                      value={form.full_name}
                      onChange={updateField('full_name')}
                      placeholder="Enter your full name"
                      autoComplete="name"
                      className={getInputClassName(errors.full_name, false)}
                    />
                  </FormField>

                  <FormField htmlFor="contact-email" label="Email Address" error={errors.email} required>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      disabled={isSubmitting}
                      value={form.email}
                      onChange={updateField('email')}
                      placeholder="Enter your email address"
                      autoComplete="email"
                      className={getInputClassName(errors.email, false)}
                    />
                  </FormField>

                  <FormField htmlFor="contact-message" label="Message" error={errors.message} required>
                    <textarea
                      id="contact-message"
                      required
                      rows={5}
                      disabled={isSubmitting}
                      value={form.message}
                      onChange={updateField('message')}
                      placeholder="Type your message here..."
                      className={`${getInputClassName(errors.message, false)} resize-none`}
                    />
                  </FormField>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-wine-700 px-5 py-3 text-sm font-semibold text-cream-50 transition-colors hover:bg-wine-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send className="h-4 w-4" />
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>

                <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[12px] text-ink-soft">
                  <Info className="h-3.5 w-3.5" />
                  We usually respond within 24-48 hours.
                </p>
              </form>
            </div>
        </div>
    </section>
  )
}
