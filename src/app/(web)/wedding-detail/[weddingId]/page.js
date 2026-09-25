import WeddingDetailPage from '@/components/weddingDetail/WeddingDetailPage';


export default async function WeddingDetailRoute({ params }) {
  const { weddingId } = await params;

  return <WeddingDetailPage weddingId={weddingId} />;
}

