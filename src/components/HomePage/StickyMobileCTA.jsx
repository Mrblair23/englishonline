import { ArrowRight } from "lucide-react";

export function StickyMobileCTA({ t }) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-3 safe-area-inset-bottom">
      <a
        href="/account/signup"
        className="flex items-center justify-center w-full py-3 bg-gradient-to-r from-[#F2B705] to-[#f5c642] text-[#1F2A44] rounded-xl font-bold text-sm shadow-lg"
      >
        {t({ en: "Create Free Account", es: "Crear Cuenta Gratis" })}
        <ArrowRight className="ml-2" size={18} />
      </a>
    </div>
  );
}
