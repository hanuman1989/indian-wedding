import FeatureStrip from "@/components/FeatureStrip";
import Hero from "@/components/Hero";
import HostWedding from "@/components/HostWedding";
import HowItWorks from "@/components/HowItWorks";
import PopularWeddings from "@/components/PopularWeddings";
import SearchPanel from "@/components/SearchPanel";
import StatsBar from "@/components/StatsBar";
import DiscoverMagicWeddings from "@/components/DiscoverMagicWeddings";

export const metadata = {
  title: "Indian Wedding Invitation | Experience a Real Indian Wedding",
  description:
    "Experience India through a real Indian wedding. Discover authentic Indian wedding celebrations, meet Indian families, explore traditions, food, music and culture, and celebrate as a guest",
  keywords: [
    "Indian weddings",
    "Indian wedding invitations",
    "join Indian wedding",
    "wedding experiences",
    "Indian wedding guests",
    "wedding celebration",
    "Indian wedding platform",
    "real Indian wedding",
    "Indian wedding experience",
    "Indian wedding invitation",
    "attend an Indian wedding",
    "Indian wedding guest",
    "Indian wedding tourism",
    "Indian culture experience",
    "authentic Indian wedding",
    "Indian wedding traditions",
    "Indian wedding experiences",
    "weddings in India",
    "international wedding guests",
    "experience India",
    "Indian cultural experiences",
  ],
};

export default function Home() {
  return (
    <>
      <Hero />
      <SearchPanel />
      <StatsBar />
      <HowItWorks />
       <DiscoverMagicWeddings />
      <PopularWeddings />
      <HostWedding />
      <FeatureStrip />
    </>
  );
}
