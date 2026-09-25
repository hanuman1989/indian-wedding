"use client";

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, Mail } from '@/components/Icons'
import { Flourish } from '@/components/Ornaments'

const faqs = [
  {
    question: 'Do I need to know the couple personally?',
    answer:
      'No. IWI is designed to connect participating Indian couples and families with international travellers who want to experience their wedding celebration.',
  },
  {
    question: 'Is my booking an actual invitation?',
    answer:
      'The exact nature of the guest arrangement will be clearly explained in each wedding listing. IWI does not want guests to misunderstand what they are booking.',
  },
  {
    question: 'Can I choose which ceremonies I attend?',
    answer:
      'This depends on the particular wedding and the arrangement offered to guests. Each listing will specify the ceremonies and events included.',
  },
  {
    question: 'Can I attend for more than one day?',
    answer:
      'Some Indian weddings take place over several days. Where a wedding offers a multi-day guest experience, the listing will clearly explain the duration and arrangements.',
  },
  {
    question: "What if I don't speak Hindi?",
    answer:
      'You do not need to speak Hindi to enjoy an Indian wedding. IWI will provide relevant information in English, and the wedding listing can indicate the languages spoken by the hosts where useful.',
  },
  {
    question: 'What if I have dietary restrictions?',
    answer:
      'Food information should be provided for each wedding where relevant. Guests should communicate important dietary requirements before attending.',
  },
  {
    question: 'Can I bring my partner or family?',
    answer:
      "This depends on the individual wedding's guest arrangements. The listing will specify who can attend and whether additional guests can be included.",
  },
  {
    question: 'What happens if the wedding schedule changes?',
    answer:
      'Indian weddings can involve complex schedules, and timings may sometimes change. IWI and/or the hosts will communicate important changes to guests as soon as reasonably possible.',
  },
  {
    question: 'Can I cancel my booking?',
    answer:
      'Cancellation rights depend on the specific booking terms associated with the wedding. These terms should be reviewed before completing your reservation.',
  },
]

function FaqItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className="overflow-hidden rounded-xl border border-cream-300 bg-white">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="font-display text-[15px] font-bold text-wine-700">{question}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-wine-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <p className="px-5 pb-4 text-[13px] leading-relaxed text-ink-soft">{answer}</p>
      )}
    </div>
  )
}

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState(0)

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
                  Questions?
                </p>
                <Flourish />
              </div>
              <h1 className="mt-3 font-display text-[28px] font-bold leading-tight text-wine-700 sm:text-[32px]">
                Frequently Asked Questions
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                Find answers to common questions about attending Indian weddings through IWI.
                We&apos;re here to make your experience smooth, safe and unforgettable.
              </p>
            </div>

            <div className="mx-auto mt-10 max-w-3xl space-y-4">
              {faqs.map((faq, index) => (
                <FaqItem
                  key={faq.question}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openIndex === index}
                  onToggle={() => setOpenIndex((current) => (current === index ? -1 : index))}
                />
              ))}
            </div>

            <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-between gap-4 rounded-xl border border-gold-200 bg-cream-50 px-6 py-5">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-wine-700">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-display text-[15px] font-bold text-wine-700">
                    Still have a question?
                  </p>
                  <p className="text-[12px] text-ink-soft">
                    Our team is here to help you with any additional questions.
                  </p>
                </div>
              </div>

              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 rounded-md bg-wine-700 px-5 py-2.5 text-[13px] font-semibold text-cream-50 transition-colors hover:bg-wine-600"
              >
                <Mail className="h-4 w-4" />
                Contact Us
              </Link>
            </div>
        </div>
    </section>
  )
}
