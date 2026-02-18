import { useState, useEffect } from "react";
import { X, Download, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

export default function LeadMagnetPopup({ inline = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (inline) return;

    // Show popup after 5 seconds on first visit
    const hasSeenPopup = localStorage.getItem("hasSeenLeadMagnet");

    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 5000); // 5 seconds

      return () => clearTimeout(timer);
    }
  }, [inline]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mock submission
    setSubmitted(true);

    if (!inline) {
      localStorage.setItem("hasSeenLeadMagnet", "true");
    }

    // Redirect to thank you page after 1.5 seconds
    setTimeout(() => {
      window.location.href = "/thank-you";
    }, 1500);
  };

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("hasSeenLeadMagnet", "true");
  };

  if (!inline && !isOpen) return null;

  const content = (
    <div
      className={`bg-white ${inline ? "rounded-2xl border border-gray-200/50 shadow-xl" : "rounded-2xl"} overflow-hidden max-w-lg w-full`}
    >
      {!inline && (
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-[#1F2A44] z-10 transition-colors"
        >
          <X size={24} />
        </button>
      )}

      {/* Header with gradient */}
      <div className="bg-gradient-to-br from-[#1F2A44] to-[#2B3448] p-8 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#3FA9A6]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#F2B705]/20 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#F2B705]/20 backdrop-blur-sm px-4 py-2 rounded-xl mb-4">
            <Sparkles size={16} className="text-[#F2B705]" />
            <span className="text-sm font-bold text-[#F2B705]">
              FREE DOWNLOAD
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold mb-3 leading-tight">
            Speak English in 7 Days
          </h2>
          <p className="text-gray-300 text-lg">
            Proven method used by 10,000+ students
          </p>
        </div>
      </div>

      {/* Form section */}
      <div className="p-8 bm-page-bg">
        {!submitted ? (
          <>
            <div className="mb-6">
              <h3 className="font-bold text-[#1F2A44] mb-3 text-lg">
                🎁 Inside this free guide:
              </h3>
              <ul className="space-y-2.5">
                <li className="flex items-start gap-2 text-gray-700">
                  <CheckCircle2
                    size={20}
                    className="text-[#3FA9A6] mt-0.5 flex-shrink-0"
                  />
                  <span>The 50 most essential English phrases</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <CheckCircle2
                    size={20}
                    className="text-[#3FA9A6] mt-0.5 flex-shrink-0"
                  />
                  <span>Pronunciation secrets from a native speaker</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <CheckCircle2
                    size={20}
                    className="text-[#3FA9A6] mt-0.5 flex-shrink-0"
                  />
                  <span>7-day practice schedule you can follow</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <CheckCircle2
                    size={20}
                    className="text-[#3FA9A6] mt-0.5 flex-shrink-0"
                  />
                  <span>Audio examples for every phrase</span>
                </li>
              </ul>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-[#3FA9A6] focus:outline-none text-[#1F2A44] font-medium bg-white shadow-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#F2B705] to-[#f5c642] text-[#1F2A44] py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:brightness-105 transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Download size={20} />
                Get My Free Guide Now
              </button>

              <p className="text-xs text-center text-gray-500">
                ✓ No spam, ever • ✓ Unsubscribe anytime • ✓ 100% Free
              </p>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200/50 text-center">
              <div className="flex items-center justify-center gap-2 text-[#F2B705] mb-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-gray-600">
                <strong>10,000+ students</strong> downloaded this guide
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-[#3FA9A6]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="text-[#3FA9A6]" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-[#1F2A44] mb-2">
              Success! Check Your Email
            </h3>
            <p className="text-gray-600">Redirecting you to your guide...</p>
          </div>
        )}
      </div>
    </div>
  );

  if (inline) {
    return content;
  }

  return (
    <div className="fixed inset-0 bg-[#1F2A44]/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60] animate-fadeIn">
      <div className="animate-slideUp">{content}</div>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
