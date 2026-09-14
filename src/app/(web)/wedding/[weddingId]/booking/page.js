import WeddingBookingPage from '@/components/booking/WeddingBookingPage';

export default async function WeddingBookingRoute({ params }) {
  const { weddingId } = await params;

  return <WeddingBookingPage weddingId={weddingId} />;
}

