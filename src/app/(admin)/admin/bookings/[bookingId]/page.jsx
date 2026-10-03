import BookingDetail from "@/components/admin/booking/BookingDetail";

export default async function BookingDetailPage({ params }) {
  const { bookingId } = await params;

  return <BookingDetail bookingId={bookingId} />;
}
