import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { apiFetch } from "@/utils/apiClient";
import {
  useCountry,
  formatPrice,
  calculatePricePerClass,
} from "@/utils/useCountry";
import { useLanguage } from "@/utils/useLanguage";
import useUser from "@/utils/useUser";
import {
  Check,
  Sparkles,
  TrendingUp,
  Users,
  User,
  Calendar,
  ArrowLeft,
} from "lucide-react";

export default function ChoosePlanPage() {
  const navigate = useNavigate();
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { country } = useCountry();
  const { language } = useLanguage();
  const { data: user, loading: userLoading } = useUser();

  const t = (translations) => translations[language] || translations.en;

  // Redirect non-authenticated users to sign in
  useEffect(() => {
    if (!userLoading && !user) {
      navigate("/account/signin");
    }
  }, [user, userLoading, navigate]);

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

  const getClassTypeIcon = (classType) => {
    return classType === "private" ? <User size={18} /> : <Users size={18} />;
  };

  const getBadgeIcon = (index) => {
    if (index === 0) return <TrendingUp size={16} />;
    if (index === 1) return <Sparkles size={16} />;
    return <Users size={16} />;
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bm-page-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3FA9A6]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bm-page-bg">
      <Header />

      {/* Hero Section */}
      <section className="py-12 sm:py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Back to Dashboard */}
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center text-gray-500 hover:text-[#3FA9A6] mb-6 transition-colors"
          >
            <ArrowLeft size={18} className="mr-1" />
            <span className="text-sm font-medium">
              {t({ en: "Back to Dashboard", es: "Volver al Panel" })}
            </span>
          </button>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1F2A44] mb-4">
            {t({
              en: "Choose a plan to get started",
              es: "Elige un plan para comenzar",
            })}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6">
            {t({
              en: "Pick the plan that fits your goals. You can change anytime.",
              es: "Elige el plan que se adapte a tus metas. Puedes cambiar en cualquier momento.",
            })}
          </p>

          {/* Price Psychology Message */}
          <div className="inline-block bg-[#3FA9A6]/10 border border-[#3FA9A6]/30 rounded-2xl px-6 py-3">
            <p className="text-[#1F2A44] font-medium text-sm sm:text-base">
              {t({
                en: "From just $25 USD/month — Classes from $15,000 COP! 🎉",
                es: "Desde solo $25 USD/mes — ¡Clases desde $15.000 COP! 🎉",
              })}
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3FA9A6]"></div>
            </div>
          ) : tiers.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-lg">
                {t({
                  en: "No plans available at the moment. Please check back later.",
                  es: "No hay planes disponibles en este momento. Vuelve más tarde.",
                })}
              </p>
            </div>
          ) : (
            <div className={`grid gap-6 sm:gap-8 ${
              tiers.length === 1
                ? "max-w-md mx-auto"
                : tiers.length === 2
                  ? "md:grid-cols-2 max-w-3xl mx-auto"
                  : "md:grid-cols-3"
            }`}>
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
                    className={`relative bg-white rounded-3xl shadow-lg overflow-hidden transition-all hover:shadow-2xl hover:scale-105 ${
                      tier.is_popular
                        ? "ring-4 ring-[#3FA9A6] ring-opacity-50"
                        : ""
                    }`}
                  >
                    {/* Popular Badge */}
                    {tier.is_popular && (
                      <div className="absolute top-0 right-0 bg-gradient-to-r from-[#F2B705] to-[#f5c642] text-[#1F2A44] px-6 py-2 rounded-bl-2xl font-bold text-sm flex items-center space-x-1 shadow-md">
                        <Sparkles size={16} />
                        <span>
                          {t({ en: "MOST POPULAR", es: "MÁS POPULAR" })}
                        </span>
                      </div>
                    )}

                    {/* Card Header */}
                    <div className="p-6 sm:p-8 pb-6">
                      <div className="flex items-center space-x-2 mb-2">
                        {getBadgeIcon(index)}
                        <h3 className="text-xl sm:text-2xl font-bold text-[#1F2A44]">
                          {tier.name}
                        </h3>
                      </div>
                      <p className="text-gray-600 text-sm mb-6">
                        {tier.description}
                      </p>

                      {/* Price Display */}
                      <div className="mb-4">
                        <div className="flex items-baseline space-x-2">
                          <span className="text-3xl sm:text-4xl font-bold text-[#1F2A44]">
                            {priceInfo.amount}
                          </span>
                          <span className="text-gray-500">
                            / {t({ en: "month", es: "mes" })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {priceInfo.subtitle}
                        </p>
                      </div>

                      {/* Class Details */}
                      <div className="bg-gradient-to-r from-[#3FA9A6]/10 to-[#3FA9A6]/5 rounded-xl p-4 mb-6 border border-[#3FA9A6]/20">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {getClassTypeIcon(tier.class_type)}
                            <span className="text-sm font-medium text-[#1F2A44]">
                              {tier.class_type === "private"
                                ? t({
                                    en: "Private Classes",
                                    es: "Clases Privadas",
                                  })
                                : t({
                                    en: "Group Classes",
                                    es: "Clases Grupales",
                                  })}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-[#3FA9A6] font-semibold">
                          <Calendar size={16} />
                          <span className="text-sm">
                            {tier.classes_per_week}{" "}
                            {t({ en: "classes/week", es: "clases/semana" })}
                          </span>
                        </div>
                        <div className="mt-2 pt-2 border-t border-[#3FA9A6]/20">
                          <p className="text-xs text-gray-600">
                            {t({
                              en: "Price per class:",
                              es: "Precio por clase:",
                            })}{" "}
                            <span className="font-bold text-[#1F2A44]">
                              {pricePerClass}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <button
                        onClick={() =>
                          navigate(
                            `/payment?plan=${tier.slug}&name=${encodeURIComponent(tier.name)}&price=${priceInfo.amount}`
                          )
                        }
                        className={`block w-full text-center py-3 rounded-xl font-semibold transition-all cursor-pointer ${
                          tier.is_popular
                            ? "bg-gradient-to-r from-[#3FA9A6] to-[#35918e] text-white shadow-md hover:shadow-xl hover:scale-105"
                            : "bg-[#1F2A44] text-white hover:bg-[#2B3448]"
                        }`}
                      >
                        {t({ en: "Choose Plan", es: "Elegir Plan" })}
                      </button>
                    </div>

                    {/* Features List */}
                    <div className="px-6 sm:px-8 pb-8">
                      <div className="border-t border-gray-100 pt-6">
                        <h4 className="font-semibold text-[#1F2A44] mb-4 text-sm uppercase tracking-wide">
                          {t({ en: "Includes:", es: "Incluye:" })}
                        </h4>
                        <ul className="space-y-3">
                          {tier.features.map((feature, idx) => (
                            <li
                              key={idx}
                              className="flex items-start space-x-3"
                            >
                              <Check
                                className="text-[#3FA9A6] flex-shrink-0 mt-0.5"
                                size={18}
                              />
                              <span className="text-sm text-gray-700">
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
