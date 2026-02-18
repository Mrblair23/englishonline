import { useCountry } from "@/utils/useCountry";
import { useLanguage } from "@/utils/useLanguage";
import { Globe } from "lucide-react";

export default function CountrySelector({ variant = "default" }) {
  const { country, changeCountry } = useCountry();
  const { language } = useLanguage();

  const t = (translations) => translations[language] || translations.en;

  const countries = [
    { code: "CO", flag: "🇨🇴", name: "Colombia", currency: "COP" },
    { code: "US", flag: "🇺🇸", name: "USA", currency: "USD" },
  ];

  if (variant === "compact") {
    return (
      <div className="flex items-center space-x-2 bg-white rounded-xl border border-gray-200 p-1 shadow-sm">
        {countries.map((c) => (
          <button
            key={c.code}
            onClick={() => changeCountry(c.code)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              country === c.code
                ? "bg-[#3FA9A6] text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span className="text-base">{c.flag}</span>
            <span>{c.currency}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center space-x-3 mb-8">
      <Globe className="text-[#3FA9A6]" size={20} />
      <span className="text-gray-700 font-medium">
        {t({ en: "Select your country:", es: "Selecciona tu país:" })}
      </span>
      <div className="flex items-center space-x-2 bg-white rounded-xl border border-gray-200 p-1 shadow-sm">
        {countries.map((c) => (
          <button
            key={c.code}
            onClick={() => changeCountry(c.code)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
              country === c.code
                ? "bg-gradient-to-r from-[#3FA9A6] to-[#35918e] text-white shadow-md"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span className="text-xl">{c.flag}</span>
            <span>{c.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
