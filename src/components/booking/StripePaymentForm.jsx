"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

export default function StripePaymentForm({ bookingId }) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setIsSubmitting(true);
    setError("");

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setError(submitError.message || "Please check your payment details.");
      setIsSubmitting(false);
      return;
    }

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/wedding-bookings/${bookingId}/payment-result`,
      },
      redirect: "if_required",
    });

    if (confirmError) {
      setError(confirmError.message || "Payment could not be completed.");
      setIsSubmitting(false);
      return;
    }
    router.push(`/wedding-bookings/${bookingId}/payment-processing`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <PaymentElement />

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={!stripe || !elements || isSubmitting}
        className="w-full rounded-lg bg-wine-700 px-5 py-3 font-semibold text-white disabled:opacity-50"
      >
        {isSubmitting ? "Processing payment..." : "Pay Now"}
      </button>
    </form>
  );
}
