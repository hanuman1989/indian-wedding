import WeddingDetailPage from '@/components/weddingDetail/WeddingDetailPage';

export const metadata = {
  title: "Indian Wedding in India | Discover & Join the Celebration",

  description:
    "Discover this Indian wedding, explore its traditions, celebrations, food, music and cultural experiences, and join the wedding as a guest.",

  keywords: [
    "Indian wedding",
    "Indian wedding in India",
    "real Indian wedding",
    "Indian wedding experience",
    "Indian wedding guest",
    "join an Indian wedding",
    "attend an Indian wedding",
    "Indian wedding celebration",
    "Indian wedding traditions",
    "Indian wedding culture",
    "Indian wedding events",
    "Indian wedding experiences",
    "Indian wedding tourism",
    "wedding celebration in India",
    "experience an Indian wedding",
    "Indian wedding travel",
    "international guests Indian wedding",
    "discover Indian weddings",
  ],
};

export default async function WeddingDetailRoute({ params }) {
  const { weddingId } = await params;

  return <WeddingDetailPage weddingId={weddingId} />;
}

