import { CreditCard, Lock, Wallet } from '@/components/Icons'
import { FormField, getInputClassName, InputWithIcon } from '@/components/postWedding/PostWeddingField'
import StepHeader from './StepHeader'
import { formatCardExpiry, formatCardNumber } from './bookingUtils'

const countryOptions = ['India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Other']

export default function PaymentPanel({ errors, form, isSubmitting, onChange, totalAmount, travelerCount }) {
  const isCard = form.paymentMethod === 'card'

  return (
    <section className="space-y-5 border border-gold-200 bg-white p-5 sm:p-7">
      <StepHeader number={4} title="Payment Details" description="Complete your payment to confirm your attendance." />

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onChange('paymentMethod', 'card')}
          className={`inline-flex min-h-11 items-center justify-center gap-2 border text-sm font-semibold transition-colors ${isCard ? 'border-wine-700 bg-wine-700 text-cream-50' : 'border-gold-200 bg-white text-ink-soft hover:border-wine-300'}`}
        >
          <CreditCard className="h-4 w-4" />
          Card Payment
        </button>
        <button
          type="button"
          onClick={() => onChange('paymentMethod', 'upi')}
          className={`inline-flex min-h-11 items-center justify-center gap-2 border text-sm font-semibold transition-colors ${!isCard ? 'border-wine-700 bg-wine-700 text-cream-50' : 'border-gold-200 bg-white text-ink-soft hover:border-wine-300'}`}
        >
          <Wallet className="h-4 w-4" />
          UPI / Other Methods
        </button>
      </div>

      {isCard ? (
        <>
          <FormField htmlFor="card-number" label="Card Number" error={errors.cardNumber} required>
            <InputWithIcon
              id="card-number"
              Icon={CreditCard}
              inputMode="numeric"
              autoComplete="cc-number"
              value={form.cardNumber}
              onChange={(event) => onChange('cardNumber', formatCardNumber(event.target.value))}
              placeholder="1234 1234 1234 1234"
              error={errors.cardNumber}
            />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField htmlFor="card-expiry" label="Expiration Date" error={errors.cardExpiry} required>
              <input
                id="card-expiry"
                inputMode="numeric"
                autoComplete="cc-exp"
                value={form.cardExpiry}
                onChange={(event) => onChange('cardExpiry', formatCardExpiry(event.target.value))}
                placeholder="MM/YY"
                aria-invalid={Boolean(errors.cardExpiry)}
                className={getInputClassName(errors.cardExpiry, false)}
              />
            </FormField>
            <FormField htmlFor="card-cvc" label="Security Code" error={errors.cardCvc} required>
              <input
                id="card-cvc"
                inputMode="numeric"
                autoComplete="cc-csc"
                value={form.cardCvc}
                onChange={(event) => onChange('cardCvc', event.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="CVC"
                aria-invalid={Boolean(errors.cardCvc)}
                className={getInputClassName(errors.cardCvc, false)}
              />
            </FormField>
          </div>

          <FormField htmlFor="card-country" label="Country">
            <select
              id="card-country"
              value={form.cardCountry}
              onChange={(event) => onChange('cardCountry', event.target.value)}
              className={`${getInputClassName(null, false)} appearance-none`}
            >
              {countryOptions.map((country) => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </FormField>
        </>
      ) : (
        <p className="border border-dashed border-gold-300 bg-cream-50 px-4 py-8 text-center text-sm text-ink-soft">UPI and other payment methods will be available soon. Please use card payment for now.</p>
      )}

      <label className="flex items-start gap-2.5 text-xs leading-5 text-ink-soft">
        <input type="checkbox" checked={form.acceptedTerms} onChange={(event) => onChange('acceptedTerms', event.target.checked)} className="mt-0.5 h-4 w-4 rounded border-gold-300 text-wine-600 focus:ring-wine-300" />
        By checking this box, you confirm that you have read and agree to our <span className="underline">Terms of Use</span> and <span className="underline">Privacy Notice</span> before signing up.
      </label>
      {errors.acceptedTerms && <p role="alert" className="-mt-3 text-xs text-red-700">{errors.acceptedTerms}</p>}

      <div className="flex flex-col gap-3 border-t border-gold-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-ink">Total Amount</p>
          <p className="text-xs text-ink-soft">${totalAmount / travelerCount} &times; {travelerCount} person{travelerCount === 1 ? '' : 's'}</p>
        </div>
        <div className="text-right">
          <button type="submit" disabled={isSubmitting} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-wine-700 px-6 text-sm font-semibold text-cream-50 shadow-sm transition-colors hover:bg-wine-600 focus:outline-none focus:ring-2 focus:ring-wine-300 disabled:cursor-not-allowed disabled:opacity-60">
            <Lock className="h-4 w-4" />
            {isSubmitting ? 'Processing...' : `Pay $${totalAmount} USD`}
          </button>
          <p className="mt-1.5 flex items-center justify-end gap-1 text-[11px] text-ink-soft"><Lock className="h-3 w-3" />Your payment is secure and encrypted</p>
        </div>
      </div>
    </section>
  )
}
