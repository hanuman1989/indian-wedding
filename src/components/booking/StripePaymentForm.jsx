"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Lock, Shield } from "@/components/Icons";

export default function StripePaymentForm({ booking, bookingId }) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting || !stripe || !elements || !bookingId) return;

    if (!acceptedTerms) {
      setError("Please agree to the Terms of Use and Privacy Notice.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setError(submitError.message || "Please check your payment details.");
      setIsSubmitting(false);
      return;
    }

    const paymentResultUrl =
        `${window.location.origin}/wedding-booking/${bookingId}/payment-result`;

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: paymentResultUrl,
      },
      redirect: "if_required",
    });

    if (confirmError) {
      setError(confirmError.message || "Payment could not be completed.");
      setIsSubmitting(false);
      return;
    }

    console.log(paymentIntent, 'paymentIntent--------')

    if (paymentIntent?.id) {
        const resultUrl = new URL(paymentResultUrl);

        resultUrl.searchParams.set(
          "payment_intent",
          paymentIntent.id
        );

        /*
         * This is only a navigation/UI hint.
         * It MUST NOT be trusted as proof of payment.
         */
        if (paymentIntent.status) {
          resultUrl.searchParams.set(
            "payment_status",
            paymentIntent.status
          );
        }
        router.replace(`${resultUrl.pathname}${resultUrl.search}`);
        return;
      }
      router.replace(paymentResultUrl);
    } catch (submitException) {
      console.error("Stripe payment submission error:", submitException);

      setError(
        submitException?.message ||
          "We could not start the payment. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <PaymentElement 
        options={{
          layout: {
            type: "accordion",
            radios: "never",
            defaultCollapsed: false,
          },
          wallets: {
            applePay: "never",
            googlePay: "never",
            link: "never",
          },
            defaultValues: {
              billingDetails: {
                name: `${booking.user.first_name} ${booking.user.last_name}`,
                email: booking.user.email,
                phone: booking.user.phone,
              },
            },
          }}
      />

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="secureAndAcceptSection">
        <div className="flex items-start gap-3 rounded-md bg-wine-50 px-4 py-3 text-sm text-wine-800">
          <Shield className="mt-0.5 h-5 w-5 shrink-0 text-wine-500" />
          <div>
            <p className="font-semibold">Your payment information is securely processed by Stripe.</p>
            <p className="mt-0.5 text-xs text-ink-soft">We do not store your card details on our servers.</p>
          </div>
        </div>

        <label className="mt-6 flex items-start gap-3 text-sm leading-5 text-ink-soft">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(event) => setAcceptedTerms(event.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 rounded border-gold-300 text-wine-700 focus:ring-wine-300"
          />
          <span>
            By checking this box, you confirm that you have read and agree to our{" "}
            <a href="/terms-of-use" className="font-medium text-wine-700 underline">Terms of Use</a>{" "}
            and{" "}
            <a href="/privacy-policy" className="font-medium text-wine-700 underline">Privacy Notice</a>{" "}
            before completing your payment.
          </span>
        </label>

        <div className="mt-6 flex flex-col gap-4 border-t border-gold-100 pt-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="sm:pt-1">
            <p className="text-sm font-semibold text-ink">Total Amount</p>
            <p className="mt-0 text-2xl font-bold text-wine-700">
              ${booking.pricing.total_amount} USD</p>
          </div>
          <div className="sm:text-right">
            <button
              type="submit"
              disabled={!stripe || !elements || !bookingId || !acceptedTerms || isSubmitting}
              className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-md bg-wine-700 px-6 text-md font-semibold text-cream-50 shadow-sm transition-colors hover:bg-wine-600 focus:outline-none focus:ring-2 focus:ring-wine-300 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-64"
            >
              <Lock className="h-4 w-4" />
              {isSubmitting ? "Processing payment..." : `Pay $${booking.pricing.total_amount} USD`}
            </button>
            <p className="mt-2 flex items-center justify-center gap-1 text-[11px] text-ink-soft sm:justify-end">
              <Lock className="h-3 w-3" />
              Your payment is secure and encrypted
            </p>
          </div>
        </div>
      </div>

    </form>
  );
}
