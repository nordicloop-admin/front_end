import HeroSection from "../components/sections/HeroSection";
import WasteValueSection from "../components/sections/WasteValueSection";
import MarketplaceSection from "../components/sections/MarketplaceSection";
import FeaturesSection from "../components/sections/FeaturesSection";
import AnalyticsSection from "../components/sections/AnalyticsSection";
import StatsSection from "../components/sections/StatsSection";
import NewsletterSection from "../components/sections/NewsletterSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <WasteValueSection />
      <MarketplaceSection />
      <FeaturesSection />
      <AnalyticsSection />
      <StatsSection />
      <NewsletterSection />
    </>
  );
}
