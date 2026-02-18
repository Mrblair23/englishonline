import { useState, useEffect } from "react";
import {
  useCountry,
  formatPrice,
  calculatePricePerClass,
} from "@/utils/useCountry";
import { useLanguage } from "@/utils/useLanguage";
import { apiFetch } from "@/utils/apiClient";
import { Check, ArrowRight, Sparkles } from "lucide-react";

export function PricingPreviewSection() {
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { country } = useCountry();
  const { language } = useLanguage();

  const t = (translations) => translations[language] || translations.en;

  useEffect(() => {
    async function fetchPricing() {
      try {
        const response = await apiFetch("/pricing");
        if (!response.ok) throw new Error("Failed to fetch pricing");
        const data = await response.json();
        setTiers(data.tiers || []);
      } catch (error) {
        console.error("Error fetching pricing:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPricing();
  }, []);

  if (loading) {
    return (
      <section className="py-20 px-4 bg-gradient-to-br from-white via-[#F0F9F9] to-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3FA9A6] mx-auto"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-white via-[#F0F9F9] to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-[#1F2A44] mb-4">
            {t({
              en: "Plans that fit your pace",
              es: "Planes que se ajustan a tu ritmo",
            })}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t({
              en: `From just ${country === "CO" ? "$100,000 COP" : "$25 USD"} per month — Classes from ${country === "CO" ? "$15,000 COP" : "$3.75 USD"}`,
              es: `Desde solo ${country === "CO" ? "$100.000 COP" : "$25 USD"} al mes — Clases desde ${country === "CO" ? "$15.000 COP" : "$3.75 USD"}`,
            })}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier, index) => {
            const priceInfo = formatPrice(
              tier.price_usd,
              tier.price_cop,
              country,
            );
            const pricePerClass = calculatePricePerClass(
              tier.price_usd,
              tier.price_cop,
              tier.classes_per_week,
              country,
            );

            return (
              <div
                key={tier.id}
                className={`relative bg-white rounded-3xl shadow-lg p-8 transition-all hover:shadow-2xl hover:scale-105 ${
                  tier.is_popular ? "ring-4 ring-[#3FA9A6] ring-opacity-50" : ""
                }`}
              >
                {tier.is_popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#F2B705] to-[#f5c642] text-[#1F2A44] px-6 py-2 rounded-full font-bold text-sm flex items-center space-x-1 shadow-md">
                    <Sparkles size={16} />
                    <span>{t({ en: "MOST POPULAR", es: "MÁS POPULAR" })}</span>
                  </div>
                )}

                <h3 className="text-2xl font-bold text-[#1F2A44] mb-2">
                  {tier.name}
                </h3>
                <p className="text-gray-600 text-sm mb-6">{tier.description}</p>

                <div className="mb-6">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-4xl font-bold text-[#1F2A44]">
                      {priceInfo.amount}
                    </span>
                    <span className="text-gray-500">
                      /{t({ en: "month", es: "mes" })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {priceInfo.subtitle}
                  </p>
                  <p className="text-xs text-[#3FA9A6] font-semibold mt-2">
                    {pricePerClass} {t({ en: "per class", es: "por clase" })}
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.slice(0, 4).map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <Check
                        className="text-[#3FA9A6] flex-shrink-0 mt-0.5"
                        size={18}
                      />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="/pricing"
                  className={`flex items-center justify-center space-x-2 w-full py-3 rounded-xl font-semibold transition-all ${
                    tier.is_popular
                      ? "bg-gradient-to-r from-[#3FA9A6] to-[#35918e] text-white shadow-md hover:shadow-xl"
                      : "bg-[#1F2A44] text-white hover:bg-[#2B3448]"
                  }`}
                >
                  <span>{t({ en: "View Details", es: "Ver Detalles" })}</span>
                  <ArrowRight size={18} />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
