import { useEffect, useState } from "react";
import { Check, ArrowRight, Sparkles } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export function PricingPreviewSection({ t }) {
  const [tiers, setTiers] = useState([]);

  useEffect(() => {
    fetch(`${API}/pricing`)
      .then((r) => r.json())
      .then((d) => setTiers(d.tiers || []))
      .catch(() => {});
  }, []);

  if (!tiers.length) return null;

  const tierMeta = [
    { color: "border-gray-200", badge: null, highlight: false },
    { color: "border-[#3FA9A6]", badge: t({ en: "Most Popular", es: "Más Popular" }), highlight: true },
    { color: "border-gray-200", badge: null, highlight: false },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block bg-[#3FA9A6]/10 text-[#3FA9A6] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">
            {t({ en: "Pricing", es: "Precios" })}
          </span>
          <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-[#1F2A44] mb-3">
            {t({ en: "Simple, Transparent Pricing", es: "Precios Simples y Transparentes" })}
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            {t({
              en: "Start with a free evaluation — upgrade when you're ready",
              es: "Comienza con una evaluación gratis — mejora cuando estés listo",
            })}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier, i) => {
            const meta = tierMeta[i] || tierMeta[0];
            return (
              <div
                key={tier.id || i}
                className={`relative bg-white rounded-2xl p-6 border-2 ${meta.color} ${meta.highlight ? "shadow-xl scale-[1.03]" : "shadow-sm"} transition-all hover:shadow-lg`}
              >
                {meta.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#3FA9A6] text-white text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
                    <Sparkles size={12} /> {meta.badge}
                  </span>
                )}
                <h3 className="font-poppins font-bold text-lg text-[#1F2A44] mb-1">{tier.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-[#1F2A44]">${tier.price_per_month || tier.price}</span>
                  <span className="text-gray-400 text-sm">/{t({ en: "mo", es: "mes" })}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {(tier.features || []).map((feat, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                      <Check size={16} className="text-[#3FA9A6] mt-0.5 shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <a
                  href="/account/signup"
                  className={`block w-full text-center py-3 rounded-xl font-bold text-sm transition-all ${
                    meta.highlight
                      ? "bg-gradient-to-r from-[#F2B705] to-[#f5c642] text-[#1F2A44] hover:shadow-lg"
                      : "bg-[#1F2A44] text-white hover:bg-[#2a3a5c]"
                  }`}
                >
                  {t({ en: "Get Started", es: "Comenzar" })}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
