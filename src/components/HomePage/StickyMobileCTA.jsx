import { Sparkles } from "lucide-react";

export function StickyMobileCTA({ t }) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 lg:hidden bg-white/90 backdrop-blur-md border-t border-[#e8dff5] px-4 py-3">
      <a
        href="/account/signup"
        className="flex items-center justify-center w-full py-3.5 bg-gradient-to-r from-[#e84393] to-[#fd79a8] text-white rounded-2xl font-bold text-sm shadow-lg"
      >
        <Sparkles size={16} className="mr-2" />
        {t({ en: "Start Free — It's Fun!", es: "¡Empieza Gratis!" })}
      </a>
    </div>
  );
}
