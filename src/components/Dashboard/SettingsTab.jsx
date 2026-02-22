import { Settings } from "lucide-react";
import { useLanguage } from "@/utils/useLanguage";

export function SettingsTab() {
  const { language } = useLanguage();
  const t = (translations) => translations[language] || translations.en;

  return (
    <div className="bg-gradient-to-br from-white to-[#FAF9F7] rounded-2xl p-8 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all">
      <h2 className="font-poppins text-3xl font-semibold text-[#1F2A44] mb-6 leading-tight">
        {t({ en: "Settings", es: "Ajustes" })}
      </h2>
      <a
        href="/settings"
        className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#3FA9A6] to-[#2d8a87] text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:brightness-105 hover:scale-105 transition-all"
      >
        <Settings size={20} />
        <span>{t({ en: "Go to settings page", es: "Ir a la página de ajustes" })}</span>
      </a>
    </div>
  );
}
