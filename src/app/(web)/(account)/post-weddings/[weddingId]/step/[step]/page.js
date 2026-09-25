import PostWeddingFlow from '@/components/postWedding/PostWeddingFlow';

export default async function PostWeddingStepPage({ params }) {
  const { step, weddingId } = await params;

  return <PostWeddingFlow weddingId={weddingId} initialStep={step} />;
}