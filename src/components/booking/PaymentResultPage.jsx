"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import Loader from '@/components/common/Loader';
import InvitationCard from '@/components/bookingDetail/InvitationCard';
import APIs from '@/lib/apis';

const STATUS = {
  LOADING: "loading",
  SUCCESS: "success",
  PROCESSING: "processing",
  CANCELLED: "cancelled",
  FAILED: "failed",
  VERIFY_ERROR: "verify_error",
};

const MAX_PROCESSING_CHECKS = 8;
const PROCESSING_INTERVAL_MS = 3000;

export default function PaymentResultPage({
  bookingId,
  paymentIntentId = "",
}) {
  const { isAuthorized } = useProtectedRoute('frontend');
  const router = useRouter();

  const [status, setStatus] = useState(STATUS.LOADING);
  const [booking, setBooking] = useState(null);
  const [payment, setPayment] = useState(null);
  const [message, setMessage] = useState("");
  const [isRetrying, setIsRetrying] = useState(false);

  const processingChecks = useRef(0);
  const pollingTimer = useRef(null);

  const clearPolling = useCallback(() => {
    if (pollingTimer.current) {
      window.clearTimeout(pollingTimer.current);
      pollingTimer.current = null;
    }
  }, []);

  const verifyPayment = useCallback(async () => {
    if (!bookingId) {
      setStatus(STATUS.VERIFY_ERROR);
      setMessage("We could not identify this booking.");
      return null;
    }

    try {
      const response = await APIs.frontend.weddingBooking.verifyWeddingBooking(bookingId, { payment_intent_id: paymentIntentId });
      const payload = response.data;

      setBooking(payload || null);
      setPayment(response.data.pricing || null);

      if (response.status === "succeeded") {
        clearPolling();
        setStatus(STATUS.SUCCESS);
        setMessage(payload.message || "Payment verified successfully.");
        return "succeeded";
      }

      if (response.status === "processing") {
        setStatus(STATUS.PROCESSING);
        setMessage(
          payload.message ||
            "Your payment is still being processed."
        );
        return "processing";
      }

      if (response.status === "cancelled") {
        clearPolling();
        setStatus(STATUS.CANCELLED);
        setMessage(payload.message || "The payment was cancelled.");
        return "cancelled";
      }

      // Any other status (e.g. requires_action, requires_payment_method) falls back here.
      clearPolling();
      setStatus(STATUS.FAILED);
      setMessage(
        payload.message ||
          "The payment was not completed."
      );
      return "failed";
    } catch (error) {
      /*
       * A 422 response from our verification endpoint can be a genuine
       * payment failure. A network/5xx error is different: do not tell the
       * customer that the payment failed when we simply could not verify it.
       */
      const responseData = error?.response?.data;

      if (
        responseData?.status === "failed" ||
        responseData?.success === false
      ) {
        setBooking(responseData?.data || null);
        setPayment(responseData?.data?.pricing || null);
        clearPolling();
        setStatus(STATUS.FAILED);
        setMessage(
          responseData?.message ||
            "The payment was not completed."
        );
        return "failed";
      }

      console.error("Payment verification error:", error);

      setStatus(STATUS.VERIFY_ERROR);
      setMessage(
        "We could not verify your payment right now. Your payment has not been marked as failed."
      );
      return "verify_error";
    }
  }, [bookingId, paymentIntentId, clearPolling]);

  const startVerification = useCallback(async () => {
    clearPolling();
    processingChecks.current = 0;
    setIsRetrying(true);
    setStatus(STATUS.LOADING);
    setMessage("");

    try {
      const result = await verifyPayment();
      /*
       * Processing payments can settle asynchronously. Re-check the same
       * server-side verification endpoint for a short, bounded period.
       */
      if (result === "processing") {
        const scheduleNextCheck = () => {
          if (processingChecks.current >= MAX_PROCESSING_CHECKS) {
            return;
          }

          processingChecks.current += 1;

          pollingTimer.current = window.setTimeout(async () => {
            const nextResult = await verifyPayment();

            if (nextResult === "processing") {
              scheduleNextCheck();
            }
          }, PROCESSING_INTERVAL_MS);
        };

        scheduleNextCheck();
      }
    } finally {
      setIsRetrying(false);
    }
  }, [clearPolling, verifyPayment]);

  useEffect(() => {
    startVerification();

    return () => {
      clearPolling();
    };
  }, [startVerification, clearPolling]);

  const goHome = () => router.push("/");

  const goToWedding = () => {
    if (booking?.wedding_id) {
      router.push(`/wedding-detail/${booking.wedding_id}`);
      return;
    }

    if (booking?.wedding?.id) {
      router.push(`/wedding-detail/${booking.wedding.id}`);
      return;
    }

    goHome();
  };

  const formatAmount = (amount, currency) => {
    if (amount === null || amount === undefined) {
      return "—";
    }

    try {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: String(currency || "USD").toUpperCase(),
        maximumFractionDigits: 2,
      }).format(Number(amount) / 100);
    } catch {
      return `${Number(amount) / 100} ${String(currency || "USD").toUpperCase()}`;
    }
  };

  if (!isAuthorized) {
    return <Loader />;
  }

  return (
    <section className="min-h-screen bg-[#FFF9F0] text-[#3B1F25]" style={{ backgroundImage: 'url("/images/sectionbg.png")', backgroundPosition: 'center center', backgroundSize: 'contain' }}>
      <div className="relative overflow-hidden border-b border-[#E7CFA9]">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full border border-[#D99A2B]/20" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-[#D99A2B]/20" />

        <div className="mx-auto max-w-5xl px-4 py-12 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#9C3150]">
            Shaadi Invites
          </p>

          <div className="my-4 flex items-center justify-center gap-3">
            <span className="h-px w-14 bg-[#D99A2B]" />
            <span className="text-[#D99A2B]">✦</span>
            <span className="h-px w-14 bg-[#D99A2B]" />
          </div>

          <h1 className="font-serif text-3xl font-bold text-[#761337] sm:text-4xl">
            {status === STATUS.SUCCESS && "Payment Successful!"}
            {status === STATUS.PROCESSING && "Payment Processing"}
            {status === STATUS.CANCELLED && "Payment Cancelled"}
            {status === STATUS.FAILED && "Payment Unsuccessful"}
            {status === STATUS.VERIFY_ERROR && "Payment Verification"}
            {status === STATUS.LOADING && "Verifying Your Payment"}
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#70575C] sm:text-base">
            {status === STATUS.SUCCESS &&
              "Your place at this beautiful celebration has been successfully reserved."}

            {status === STATUS.PROCESSING &&
              "Your payment has been received and is being processed. We will confirm your booking when Stripe reports the final result."}

            {status === STATUS.CANCELLED &&
              "The payment was cancelled before it completed. Your booking has not been confirmed."}

            {status === STATUS.FAILED &&
              "We could not complete this payment. Your booking has not been confirmed."}

            {status === STATUS.VERIFY_ERROR &&
              "We are temporarily unable to verify the payment status. Please do not make another payment until you know whether the first payment was successful."}

            {status === STATUS.LOADING &&
              "Please wait while we securely verify your payment with our server."}
          </p>
        </div>
      </div>

      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {status === STATUS.LOADING && (
          <LoadingCard />
        )}

        {status === STATUS.SUCCESS && (
          <SuccessCard
            booking={booking}
            payment={payment}
            formatAmount={formatAmount}
            onWedding={goToWedding}
            onHome={goHome}
          />
        )}

        {status === STATUS.PROCESSING && (
          <ProcessingCard
            booking={booking}
            payment={payment}
            formatAmount={formatAmount}
            onRefresh={startVerification}
            isRetrying={isRetrying}
            onHome={goHome}
          />
        )}

        {(status === STATUS.FAILED || status === STATUS.CANCELLED) && (
          <FailedCard
            booking={booking}
            payment={payment}
            formatAmount={formatAmount}
            message={message}
            onRetry={startVerification}
            isRetrying={isRetrying}
            onHome={goHome}
          />
        )}

        {status === STATUS.VERIFY_ERROR && (
          <VerificationErrorCard
            message={message}
            onRetry={startVerification}
            isRetrying={isRetrying}
            onHome={goHome}
          />
        )}
      </section>
    </section>
  );
}

function LoadingCard() {
  return (
    <div className="rounded-3xl border border-[#E9D3B2] bg-white p-10 text-center shadow-[0_12px_45px_rgba(115,20,55,0.08)] sm:p-14">
      <StatusIcon type="loading" />

      <h2 className="mt-6 font-serif text-2xl font-bold text-[#761337]">
        Verifying Your Payment
      </h2>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#70575C]">
        We are checking the payment directly with our secure server.
      </p>
    </div>
  );
}

function SuccessCard({
  booking,
  payment,
  formatAmount,
  onWedding,
  onHome,
}) {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-[#E9D3B2] bg-white p-8 text-center shadow-[0_12px_45px_rgba(115,20,55,0.08)] sm:p-12">
        <div className="absolute left-0 top-0 h-24 w-24 rounded-br-full bg-[#FFF2DD]" />
        <div className="absolute bottom-0 right-0 h-24 w-24 rounded-tl-full bg-[#FFF2DD]" />

        <div className="relative">
          <StatusIcon type="success" />

          <div className="mt-5 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-[#D99A2B]" />
            <span className="text-[#D99A2B]">✦</span>
            <span className="h-px w-10 bg-[#D99A2B]" />
          </div>

          <h2 className="mt-3 font-serif text-2xl font-bold text-[#761337] sm:text-3xl">
            You`re All Set!
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#70575C]">
            Your payment has been verified and your wedding booking is confirmed.
          </p>

          {booking?.booking_number && (
            <div className="mt-5 inline-flex rounded-full bg-[#FFF5E7] px-5 py-2 text-sm font-semibold text-[#761337]">
              Booking ID:&nbsp;
              <span className="text-[#9C3150]">
                {booking.booking_number}
              </span>
            </div>
          )}
        </div>
      </div>

      <BookingDetails
        booking={booking}
        payment={payment}
        formatAmount={formatAmount}
      />

      <SecurityNotice />

      <InvitationCard wedding={booking.wedding} invoiceId={booking.booking_number} bookingId={booking?.id} />

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={onHome}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D9B78E] bg-white px-7 py-3.5 text-sm font-semibold text-[#761337] transition hover:bg-[#FFF7EC]"
        >
          ← Back to Home
        </button>

        <button
          type="button"
          onClick={onWedding}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8B123D] px-7 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#761337]"
        >
          View Wedding Details
          <span>→</span>
        </button>
      </div>
    </div>
  );
}

function ProcessingCard({
  booking,
  payment,
  formatAmount,
  onRefresh,
  isRetrying,
  onHome,
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-[#E9D3B2] bg-white p-8 text-center shadow-[0_12px_45px_rgba(115,20,55,0.08)] sm:p-12">
        <StatusIcon type="processing" />

        <h2 className="mt-6 font-serif text-2xl font-bold text-[#761337]">
          Your Payment Is Processing
        </h2>

        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#70575C]">
          Some payment methods take a little longer to receive their final
          status. We are checking securely with Stripe.
        </p>

        <div className="mx-auto mt-7 max-w-md rounded-2xl bg-[#FFF8ED] p-5 text-left">
          <InfoRow
            label="Amount"
            value={formatAmount(
              payment?.amount,
              payment?.currency
            )}
          />

          <InfoRow
            label="Status"
            value="Processing"
            valueClass="text-[#B76E12]"
          />

          {booking?.booking_number && (
            <InfoRow
              label="Booking"
              value={booking.booking_number}
            />
          )}
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={isRetrying}
          className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-[#8B123D] px-7 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#761337] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isRetrying ? "Checking..." : "Check Payment Status"}
        </button>
      </div>

      <SecurityNotice />

      <div className="text-center">
        <button
          type="button"
          onClick={onHome}
          className="text-sm font-semibold text-[#761337] underline underline-offset-4"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

function FailedCard({
  booking,
  payment,
  formatAmount,
  message,
  onRetry,
  isRetrying,
  onHome,
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-[#E9D3B2] bg-white p-8 text-center shadow-[0_12px_45px_rgba(115,20,55,0.08)] sm:p-12">
        <StatusIcon type="failed" />

        <h2 className="mt-6 font-serif text-2xl font-bold text-[#761337]">
          Payment Could Not Be Completed
        </h2>

        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#70575C]">
          {message || "The payment was not completed."}
        </p>

        {payment?.amount !== undefined && (
          <div className="mx-auto mt-6 max-w-md rounded-2xl bg-[#FFF8ED] p-5 text-left">
            <InfoRow
              label="Amount"
              value={formatAmount(
                payment.amount,
                payment.currency
              )}
            />

            <InfoRow
              label="Payment status"
              value={payment.status || "Not completed"}
              valueClass="text-[#A92D43]"
            />

            {booking?.booking_number && (
              <InfoRow
                label="Booking"
                value={booking.booking_number}
              />
            )}
          </div>
        )}

        <button
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-[#8B123D] px-7 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#761337] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isRetrying ? "Checking..." : "Check Again"}
        </button>
      </div>

      <div className="rounded-2xl border border-[#E9D3B2] bg-[#FFF8ED] px-5 py-5">
        <p className="text-sm font-semibold text-[#761337]">
          If money was deducted
        </p>

        <p className="mt-1 text-xs leading-5 text-[#70575C]">
          Do not make another payment immediately. Contact support and provide
          your booking number so the payment can be checked against Stripe.
        </p>
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={onHome}
          className="text-sm font-semibold text-[#761337] underline underline-offset-4"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

function VerificationErrorCard({
  message,
  onRetry,
  isRetrying,
  onHome,
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-[#E9D3B2] bg-white p-8 text-center shadow-[0_12px_45px_rgba(115,20,55,0.08)] sm:p-12">
        <StatusIcon type="warning" />

        <h2 className="mt-6 font-serif text-2xl font-bold text-[#761337]">
          We Could Not Verify the Payment
        </h2>

        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#70575C]">
          {message}
        </p>

        <button
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          className="mt-7 inline-flex items-center justify-center rounded-xl bg-[#8B123D] px-7 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#761337] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isRetrying ? "Checking..." : "Retry Verification"}
        </button>
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={onHome}
          className="text-sm font-semibold text-[#761337] underline underline-offset-4"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

function BookingDetails({ booking, payment }) {
  const wedding = booking?.wedding || {};

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E9D3B2] bg-white shadow-[0_8px_30px_rgba(115,20,55,0.06)]">
      <div className="border-b border-[#F0DDC4] bg-[#FFF8ED] px-6 py-5">
        <h3 className="font-serif text-lg font-bold text-[#761337]">
          Booking Details
        </h3>
      </div>

      <div className="grid gap-0 sm:grid-cols-2">
        <DetailItem
          label="Booking ID"
          value={booking?.booking_number || booking?.id || "—"}
        />

        <DetailItem
          label="Wedding"
          value={
            wedding?.couple_name ||
            "Wedding Celebration"
          }
        />

        <DetailItem
          label="Wedding Date"
          value={
            wedding?.wedding_dates ||
            "—"
          }
        />

        <DetailItem
          label="Guests"
          value={
            booking?.number_of_travelers ||
            "—"
          }
        />
      </div>

      <div className="border-t border-[#F0DDC4] bg-[#FFFCF7] px-6 py-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-[#8A7074]">
              Amount Paid
            </p>

            <p className="mt-1 text-xl font-bold text-[#761337]">
              ${payment?.total_amount}
            </p>
          </div>

          <div>
            <p className="text-xs text-[#8A7074]">
              Payment ID
            </p>

            <p className="mt-1 break-all text-sm font-semibold text-[#4D3036]">
              {booking.payment?.payment_intent_id || "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="border-b border-[#F0DDC4] px-6 py-5">
      <p className="text-xs text-[#8A7074]">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-[#4D3036]">
        {value}
      </p>
    </div>
  );
}

function InfoRow({
  label,
  value,
  valueClass = "text-[#4D3036]",
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#E9D3B2] py-3 last:border-b-0">
      <span className="text-xs text-[#80676A]">
        {label}
      </span>

      <span className={`text-sm font-semibold ${valueClass}`}>
        {value}
      </span>
    </div>
  );
}

function SecurityNotice() {
  return (
    <div className="rounded-2xl border border-[#D8E9D5] bg-[#F5FBF2] px-5 py-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#2C7A42] shadow-sm">
          ✓
        </div>

        <div>
          <h3 className="text-sm font-bold text-[#285F36]">
            Your payment is secure
          </h3>

          <p className="mt-1 text-xs leading-5 text-[#55705A]">
            Payment details are securely processed by Stripe. Your card
            details are not stored on our application servers.
          </p>
        </div>
      </div>
    </div>
  );
}

function StatusIcon({ type }) {
  if (type === "loading") {
    return (
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-8 border-[#FFF0D8] bg-[#8B123D]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/30 border-t-white" />
      </div>
    );
  }

  const styles = {
    success: "bg-[#2F8A4A] text-white border-[#E4F4E8]",
    processing: "bg-[#D99A2B] text-white border-[#FFF0D8]",
    failed: "bg-[#A92D43] text-white border-[#FDECEC]",
    warning: "bg-[#8B123D] text-white border-[#F8E5D2]",
  };

  const symbols = {
    success: "✓",
    processing: "…",
    failed: "×",
    warning: "!",
  };

  return (
    <div
      className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full border-[8px] text-5xl font-bold ${styles[type]}`}
      aria-hidden="true"
    >
      {symbols[type]}
    </div>
  );
}
