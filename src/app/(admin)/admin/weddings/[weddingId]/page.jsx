import WeddingDetail from "@/components/admin/wedding/WeddingDetail";

export default async function WeddingDetailPage({ params }) {
  const { weddingId } = await params;

  return <WeddingDetail weddingId={weddingId} />;
}
