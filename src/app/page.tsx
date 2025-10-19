import HeroSection from "../components/sections/HeroSection";
// import WasteValueSection from "../components/sections/WasteValueSection";
import MarketplaceSection from "../components/sections/MarketplaceSection";
import HomeRecentAuctionsSection from "../components/sections/HomeRecentAuctionsSection";
import FAQSection from "../components/sections/FAQSection";
import ContactFormSection from "../components/sections/ContactFormSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      {/* <WasteValueSection /> */}
      <MarketplaceSection />
  <HomeRecentAuctionsSection />
      {/* <FeaturesSection />
      <AnalyticsSection />
      <StatsSection /> */}
      <FAQSection />
      <ContactFormSection />
    </>
  );
}