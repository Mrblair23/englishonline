import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/utils/useLanguage";
import { HeroSection } from "@/components/HomePage/HeroSection";
import { HowItWorksSection } from "@/components/HomePage/HowItWorksSection";
import { SocialProofSection } from "@/components/HomePage/SocialProofSection";
import { StickyMobileCTA } from "@/components/HomePage/StickyMobileCTA";

export default function HomePage() {
  const { language } = useLanguage();
  const t = (translations) => translations[language] || translations.en;

  return (
    <div className="min-h-screen bg-[#FAF9F7] font-inter selection:bg-[#3FA9A6] selection:text-white overflow-x-hidden">
      <Header />

      {/* Sticky Mobile CTA */}
      <StickyMobileCTA t={t} />

      {/* Main content */}
      <div className="w-full max-w-full overflow-x-hidden">
        {/* Hero: green gradient + form + video mockup */}
        <HeroSection t={t} />

        {/* Feature icons bar (green) */}
        <HowItWorksSection t={t} />

        {/* Testimonial strip + instant eval badge */}
        <SocialProofSection t={t} />
      </div>

      <Footer />
    </div>
  );
}
