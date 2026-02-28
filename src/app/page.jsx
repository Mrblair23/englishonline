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
    <div className="min-h-screen bg-white font-inter selection:bg-[#7c3aed] selection:text-white overflow-x-hidden">
      <Header />

      {/* Sticky Mobile CTA */}
      <StickyMobileCTA t={t} />

      {/* Main content */}
      <div className="w-full max-w-full overflow-x-hidden">
        {/* Hero: warm pastel gradient + cartoon video call */}
        <HeroSection t={t} />

        {/* Why You'll Love It: colorful gradient cards */}
        <HowItWorksSection t={t} />

        {/* 5-Minute Fun Assessment */}
        <SocialProofSection t={t} />

        {/* Programs: cozy gradient cards */}
        <PricingPreviewSection t={t} />

        {/* Final CTA: purple gradient, playful */}
        <PromiseSection t={t} />
      </div>

      <Footer />
    </div>
  );
}
