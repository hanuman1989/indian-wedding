import { Calendar, Gift, Users, Lock, ArrowRight } from '@/components/Icons'
import StepHeader from './StepHeader'

export default function BookingSummary({ totalAmount, isSubmitting, travelerCount, selectedDayCount = 0 }) {
  const contributionPerPerson = travelerCount ? totalAmount / travelerCount : 0

  return (
    <section className="space-y-5 border border-gold-200 bg-white p-5 sm:p-7">
      <StepHeader number={4} title="Booking Summary" description="Review your selection before proceeding to payment." />

      <div className="bookingSummary divide-y divide-gold-200 border border-gold-200 px-4 sm:px-5">
        <div className="grid min-h-16 grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-3 py-3">
          <Calendar className="h-6 w-6 shrink-0 text-wine-500" />
          <span className="text-sm font-semibold text-ink">Selected Days</span>
          <span className="ml-auto text-sm text-ink">{selectedDayCount} {selectedDayCount === 1 ? 'day' : 'days'} selected</span>
        </div>

        <div className="grid min-h-16 grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-3 py-3">
          <Users className="h-6 w-6 shrink-0 text-wine-500" />
          <span className="text-sm font-semibold text-ink">Number of Travelers</span>
          <span className="ml-auto text-sm text-ink">{travelerCount} {travelerCount === 1 ? 'person' : 'people'}</span>
        </div>

        <div className="grid min-h-16 grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-3 py-3">
          <Gift className="h-6 w-6 shrink-0 text-wine-500" />
          <span className="text-sm font-semibold text-ink">Contribution Amount</span>
          <span className="ml-auto text-sm text-ink">${contributionPerPerson} &times; {travelerCount} person{travelerCount === 1 ? '' : 's'}</span>
          <strong className="ml-4 whitespace-nowrap text-base font-bold text-wine-700">${totalAmount} USD</strong>
        </div>
      </div>
      <div className="flex flex-col gap-3 border-t border-gold-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="mt-1.5 flex items-center justify-end gap-1 text-[11px] text-ink-soft"><Lock className="h-3 w-3" />Your payment is secure and encrypted</p>
            <div className="text-right">
            <button type="submit" disabled={isSubmitting} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-wine-700 px-6 text-sm font-semibold text-cream-50 shadow-sm transition-colors hover:bg-wine-600 focus:outline-none focus:ring-2 focus:ring-wine-300 disabled:cursor-not-allowed disabled:opacity-60">
                {isSubmitting ? 'Processing...' : 'Continue to Payment'}
                {!isSubmitting ? (
                    <ArrowRight className="h-6 w-6 shrink-0 text-white"/>
                ) : ''}
                
            </button>
            
            </div>
        </div>
    </section>
  )
}
