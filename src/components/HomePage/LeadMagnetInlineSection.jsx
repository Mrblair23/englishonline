import { Download, CheckCircle2 } from "lucide-react";
import LeadMagnetPopup from "@/components/LeadMagnetPopup";

export function LeadMagnetInlineSection() {
  return (
    <section className="py-24 bg-[#FAF9F7] relative">
      {/* Cozy desk ambiance */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-radial from-[#F2B705]/10 to-transparent rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#F2B705]/10 text-[#F2B705] px-4 py-2 rounded-xl text-xs font-semibold mb-6 border border-[#F2B705]/20 shadow-sm uppercase tracking-wide">
              <Download size={16} />
              <span>Free resource</span>
            </div>
            <h2 className="font-poppins text-4xl md:text-5xl font-semibold text-[#1F2A44] mb-6 leading-tight">
              Want to start speaking English in just 7 days?
            </h2>
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              Download our proven guide that's helped over{" "}
              <span className="font-semibold text-[#3FA9A6]">
                10,000 students
              </span>{" "}
              break through their language barriers.
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center gap-3 group">
                <CheckCircle2
                  className="text-[#3FA9A6] flex-shrink-0 group-hover:scale-110 transition-transform"
                  size={20}
                />
                <span className="leading-relaxed">
                  50 essential phrases you'll use every day
                </span>
              </li>
              <li className="flex items-center gap-3 group">
                <CheckCircle2
                  className="text-[#3FA9A6] flex-shrink-0 group-hover:scale-110 transition-transform"
                  size={20}
                />
                <span className="leading-relaxed">
                  Native pronunciation secrets
                </span>
              </li>
              <li className="flex items-center gap-3 group">
                <CheckCircle2
                  className="text-[#3FA9A6] flex-shrink-0 group-hover:scale-110 transition-transform"
                  size={20}
                />
                <span className="leading-relaxed">Audio examples included</span>
              </li>
            </ul>
          </div>
          <div className="hover:scale-105 transition-transform duration-300">
            <LeadMagnetPopup inline={true} />
          </div>
        </div>
      </div>
    </section>
  );
}
