import FeatureStrip from "@/components/FeatureStrip";
import Hero from "@/components/Hero";
import HostWedding from "@/components/HostWedding";
import HowItWorks from "@/components/HowItWorks";
import PopularWeddings from "@/components/PopularWeddings";
import SearchPanel from "@/components/SearchPanel";
import StatsBar from "@/components/StatsBar";

export default function Home() {
  return (
    <>
      <Hero />
      <SearchPanel />
      <StatsBar />
      <HowItWorks />
      <PopularWeddings />
      <HostWedding />
      <FeatureStrip />
    </>
  );
}
