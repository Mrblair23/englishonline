import { ArrowRight } from "lucide-react";

export function StickyMobileCTA({ t }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-[#FAF9F7]/95 backdrop-blur-lg border-t border-gray-200/50 shadow-2xl px-4 py-3">
      <a
        href="/account/signup"
        className="flex items-center justify-center w-full py-3.5 bg-gradient-to-r from-[#F2B705] to-[#f5c642] text-[#1F2A44] rounded-xl font-semibold text-base hover:shadow-lg hover:brightness-105 transition-all"
      >
        {t({ en: "Start free", es: "Comenzar gratis" })}
        <ArrowRight className="ml-2" size={18} />
      </a>
    </div>
  );
}
