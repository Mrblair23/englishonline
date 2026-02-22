import { Star, TrendingUp } from "lucide-react";
import { useLanguage } from "@/utils/useLanguage";
import useUser from "@/utils/useUser";

export function PaymentsTab() {
  const { language } = useLanguage();
  const t = (translations) => translations[language] || translations.en;
  const { data: user } = useUser();
  const planKey = user?.subscription_plan_key;

  return (
    <div className="bg-gradient-to-br from-white to-[#FAF9F7] rounded-2xl p-8 border border-gray-200/50 shadow-lg">
      <h2 className="font-poppins text-3xl font-semibold text-[#1F2A44] mb-6 leading-tight">
        {t({ en: "Payments & plan", es: "Pagos y plan" })}
      </h2>
      <div className="mb-8">
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-[#3FA9A6] to-[#2d8a87] rounded-xl text-white mb-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all">
          <div>
            <h3 className="font-poppins text-lg font-semibold mb-1 leading-tight">
              {planKey
                ? planKey.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
                : t({ en: "No active plan", es: "Sin plan activo" })}
            </h3>
            {user?.subscription_expires_at && (
              <p className="text-white/70 text-sm leading-relaxed">
                {t({ en: "Renews", es: "Renueva" })} {new Date(user.subscription_expires_at).toLocaleDateString()}
              </p>
            )}
          </div>
          <Star size={32} fill="currentColor" />
        </div>
        <a
          href="/choose-plan"
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#F2B705] to-[#f5c642] text-[#1F2A44] px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:brightness-105 hover:scale-105 transition-all"
        >
          <TrendingUp size={20} />
          <span>{t({ en: "Upgrade or change plan", es: "Mejorar o cambiar plan" })}</span>
        </a>
      </div>
    </div>
  );
}
