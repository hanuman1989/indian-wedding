import PaymentResultPage from "@/components/booking/PaymentResultPage";

export default async function PaymentResultRoute({ params,
  searchParams }) {
  
  const { bookingId } = await params;
  const query = await searchParams;

  return (
    <PaymentResultPage
      bookingId={bookingId}
      paymentIntentId={query?.payment_intent || ""}
    />
  );
}

