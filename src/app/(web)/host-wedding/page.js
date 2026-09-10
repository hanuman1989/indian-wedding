import HostHero from '@/components/hostWedding/HostHero'
import WhyHostSection from '@/components/hostWedding/WhyHostSection'
import HostingProcess from '@/components/hostWedding/HostingProcess'
import ShareYourStory from '@/components/hostWedding/ShareYourStory'
import ListingPreview from '@/components/hostWedding/ListingPreview'
import TrustPlatform from '@/components/hostWedding/TrustPlatform'
import HostCTA from '@/components/hostWedding/HostCTA'

export default function HostWeddingPage() {
  return (
    <>
      <HostHero />
      <WhyHostSection />
      <HostingProcess />
      <ShareYourStory />
      <ListingPreview />
      <TrustPlatform />
      <HostCTA />
    </>
  )
}


