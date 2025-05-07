import HeroSection from "../components/sections/HeroSection";
import WasteValueSection from "../components/sections/WasteValueSection";
import EndorsedSection from "../components/sections/EndorsedSection";
import MarketplaceSection from "../components/sections/MarketplaceSection";
import FeaturesSection from "../components/sections/FeaturesSection";
import AnalyticsSection from "../components/sections/AnalyticsSection";
import StatsSection from "../components/sections/StatsSection";
import ContactFormSection from "../components/sections/ContactFormSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <WasteValueSection />
      <EndorsedSection />
      <MarketplaceSection />
      <FeaturesSection />
      <AnalyticsSection />
      <StatsSection />
      <ContactFormSection />
    </>
  );
}