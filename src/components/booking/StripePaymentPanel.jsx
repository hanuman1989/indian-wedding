import StepHeader from './StepHeader'
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripe';
import StripePaymentForm from './StripePaymentForm'

export default function StripePaymentPanel({ booking }) {
  const clientSecret = booking.payment.client_secret

  return (
    <section className="space-y-5 border border-gold-200 bg-white p-5 sm:p-7">
      <StepHeader number={1} title="Payment Details" description="Review your detail and complete the payment to confirm booking." />
      <div className="space-y-4">
        {clientSecret ? (
          <Elements key={clientSecret} stripe={stripePromise} options={{ clientSecret }}>
            <StripePaymentForm bookingId={booking.id} />
          </Elements>
        ) : (
          <p className="text-sm leading-6 text-ink-soft" role="alert">
            Payment is not available for this booking yet. Please refresh the page or contact support.
          </p>
        )}
      </div>
    </section>
  )
}
