import { ArrowRight } from "lucide-react";

export function StickyMobileCTA({ t }) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-3">
      <a
        href="/account/signup"
        className="flex items-center justify-center w-full py-3 bg-[#F5B942] text-[#0B1F3B] rounded-lg font-bold text-sm shadow-md"
      >
        {t({ en: "Free Evaluation", es: "Evaluación Gratuita" })}
        <ArrowRight className="ml-2" size={18} />
      </a>
    </div>
  );
}
