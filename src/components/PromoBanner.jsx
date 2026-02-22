import { useState, useEffect, useContext } from "react";
import { X, Zap, ArrowRight } from "lucide-react";
import { AuthContext } from "@/context/AuthContext";

export default function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const auth = useContext(AuthContext);
  const user = auth?.loading || auth?.hydrating ? null : auth?.user;

  useEffect(() => {
    const dismissed = sessionStorage.getItem("promoBannerDismissed");
    if (dismissed) {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem("promoBannerDismissed", "true");
  };

  // Hide for logged-in users (student, admin, teacher)
  if (user) return null;

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-[#F2B705] via-[#f5c642] to-[#F2B705] text-[#1F2A44] relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-3 relative z-10">
        <div className="flex items-center justify-between gap-4">
          {/* Left side - Message */}
          <div className="flex items-center gap-3 flex-1 justify-center md:justify-start">
            <div className="hidden sm:flex items-center justify-center w-8 h-8 bg-[#1F2A44]/10 backdrop-blur-sm rounded-xl">
              <Zap size={18} className="text-[#1F2A44] fill-[#1F2A44]" />
            </div>
            <p className="font-bold text-sm sm:text-base text-center md:text-left">
              <span className="inline-block animate-pulse mr-2">🔥</span>
              <span className="hidden sm:inline">Limited Time Offer: </span>
              <span className="font-extrabold">
                First Class 50% Off This Week!
              </span>
            </p>
            <a
              href="/book"
              className="hidden md:inline-flex items-center gap-1.5 bg-[#1F2A44] text-white px-4 py-1.5 rounded-xl font-bold text-sm hover:bg-[#2B3448] transition-all shadow-md"
            >
              Book Now
              <ArrowRight size={14} />
            </a>
          </div>

          {/* Mobile CTA */}
          <a
            href="/book"
            className="md:hidden bg-[#1F2A44] text-white px-4 py-1.5 rounded-xl font-bold text-xs hover:bg-[#2B3448] transition-all shadow-md whitespace-nowrap"
          >
            Book Now
          </a>

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="text-[#1F2A44]/70 hover:text-[#1F2A44] transition-colors p-1"
            aria-label="Dismiss banner"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  );
}
