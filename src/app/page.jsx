import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/utils/useLanguage";
import { HeroSection } from "@/components/HomePage/HeroSection";
import { HowItWorksSection } from "@/components/HomePage/HowItWorksSection";
import { SocialProofSection } from "@/components/HomePage/SocialProofSection";
import { PricingPreviewSection } from "@/components/HomePage/PricingPreviewSection";
import { PromiseSection } from "@/components/HomePage/PromiseSection";
import { StickyMobileCTA } from "@/components/HomePage/StickyMobileCTA";

export default function HomePage() {
  const { language } = useLanguage();
  const t = (translations) => translations[language] || translations.en;

  return (
    <div className="min-h-screen bg-white font-inter selection:bg-[#123A6F] selection:text-white overflow-x-hidden">
      <Header />

      {/* Sticky Mobile CTA */}
      <StickyMobileCTA t={t} />

      {/* Main content */}
      <div className="w-full max-w-full overflow-x-hidden">
        {/* Hero: dark blue gradient + meeting mockup */}
        <HeroSection t={t} />

        {/* Why Choose Us: 3 columns */}
        <HowItWorksSection t={t} />

        {/* 5-Minute Assessment */}
        <SocialProofSection t={t} />

        {/* Programs: Small Group, Duo, 1-to-1 */}
        <PricingPreviewSection t={t} />

        {/* Final CTA: dark blue + strong call to action */}
        <PromiseSection t={t} />
      </div>

      <Footer />
    </div>
  );
}
