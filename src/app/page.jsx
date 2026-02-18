import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LeadMagnetPopup from "@/components/LeadMagnetPopup";
import { useLanguage } from "@/utils/useLanguage";
import { HeroSection } from "@/components/HomePage/HeroSection";
import { SocialProofSection } from "@/components/HomePage/SocialProofSection";
import { HowItWorksSection } from "@/components/HomePage/HowItWorksSection";
import { PricingPreviewSection } from "@/components/HomePage/PricingPreviewSection";
import { PromiseSection } from "@/components/HomePage/PromiseSection";
import { LeadMagnetInlineSection } from "@/components/HomePage/LeadMagnetInlineSection";
import { EmailCaptureSection } from "@/components/HomePage/EmailCaptureSection";
import { StickyMobileCTA } from "@/components/HomePage/StickyMobileCTA";
import { useState } from "react";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { language } = useLanguage();

  const t = (translations) => translations[language] || translations.en;

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7] font-inter selection:bg-[#3FA9A6] selection:text-white overflow-x-hidden">
      <Header />

      {/* Lead Magnet Popup */}
      <LeadMagnetPopup />

      {/* Sticky Mobile CTA */}
      <StickyMobileCTA t={t} />

      {/* All sections properly contained */}
      <div className="w-full max-w-full overflow-x-hidden">
        {/* Hero Section */}
        <HeroSection t={t} />

        {/* Social Proof Strip */}
        <SocialProofSection />

        {/* How It Works */}
        <HowItWorksSection />

        {/* Tier Preview Cards */}
        <PricingPreviewSection />

        {/* Results & Promise */}
        <PromiseSection />

        {/* Lead Magnet Inline Section */}
        <LeadMagnetInlineSection />

        {/* Email Capture Box */}
        <EmailCaptureSection
          email={email}
          setEmail={setEmail}
          submitted={submitted}
          handleEmailSubmit={handleEmailSubmit}
        />
      </div>

      <Footer />
    </div>
  );
}
