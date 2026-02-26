import { useState, useEffect, useContext } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { apiFetch } from "@/utils/apiClient";
import { useLanguage } from "@/utils/useLanguage";
import { AuthContext } from "@/context/AuthContext";
import {
  Check,
  Sparkles,
  Users,
  User,
  Calendar,
  Clock,
  Zap,
  Star,
  Shield,
  BookOpen,
  Headphones,
  MessageCircle,
  Award,
  Target,
  Rocket,
  TrendingUp,
  ArrowRight,
  GraduationCap,
  Globe,
} from "lucide-react";

/* ─── Marketing helpers (shared logic) ─── */

const GRADIENT_ACCENTS = [
  "from-[#3FA9A6] to-[#2d8a87]",
  "from-[#F2B705] to-[#e0a800]",
  "from-[#6366F1] to-[#4F46E5]",
  "from-[#EC4899] to-[#DB2777]",
];

const MODE_ICONS = { group: Users, duo: Users, private: User };
const MODE_EMOJIS = { group: "👥", duo: "👫", private: "🎯" };

function getMarketingCopy(bundle, lang) {
  const mode = bundle.mode || "group";
  const freq = bundle.sessions_per_week || 1;
  const copy = {
    group: {
      1: {
        en: { tagline: "Start your journey", subtitle: "Perfect for busy learners who want consistent weekly practice", highlight: "Most Flexible" },
        es: { tagline: "Comienza tu camino", subtitle: "Perfecto para quienes buscan práctica semanal constante", highlight: "Más Flexible" },
      },
      2: {
        en: { tagline: "Build momentum", subtitle: "The sweet spot — enough practice to see real progress every week", highlight: "Best Value" },
        es: { tagline: "Toma impulso", subtitle: "El punto ideal — suficiente práctica para ver progreso real cada semana", highlight: "Mejor Valor" },
      },
      3: {
        en: { tagline: "Accelerate your fluency", subtitle: "Our most popular plan — immerse yourself and watch your English transform", highlight: "Most Popular" },
        es: { tagline: "Acelera tu fluidez", subtitle: "Nuestro plan más popular — sumérgete y mira cómo se transforma tu inglés", highlight: "Más Popular" },
      },
    },
    duo: {
      1: {
        en: { tagline: "Learn with a partner", subtitle: "Intimate duo sessions — practice with a partner for twice the speaking time", highlight: "Semi-Private" },
        es: { tagline: "Aprende en pareja", subtitle: "Sesiones íntimas en dúo — practica con un compañero para el doble de tiempo hablando", highlight: "Semi-Privada" },
      },
    },
    private: {
      1: {
        en: { tagline: "Your personal coach", subtitle: "100% personalized attention — the fastest path to fluency", highlight: "Premium" },
        es: { tagline: "Tu coach personal", subtitle: "Atención 100% personalizada — el camino más rápido a la fluidez", highlight: "Premium" },
      },
    },
  };
  const modeData = copy[mode] || copy.group;
  const freqData = modeData[freq] || modeData[Math.min(freq, Object.keys(modeData).length)] || modeData[1];
  return freqData?.[lang] || freqData?.en || { tagline: "Learn English", subtitle: "Start your English journey today", highlight: "Popular" };
}

function getFeatures(bundle, lang) {
  const mode = bundle.mode || "group";
  const freq = bundle.sessions_per_week || 1;
  const dur = bundle.duration_minutes || 60;
  const maxSt = bundle.max_students || 6;
  const en = [];
  const es = [];

  en.push(`${freq} live class${freq > 1 ? "es" : ""} per week`);
  es.push(`${freq} clase${freq > 1 ? "s" : ""} en vivo por semana`);
  en.push(`${dur}-minute sessions`);
  es.push(`Sesiones de ${dur} minutos`);

  if (mode === "group") {
    en.push(`Small groups (max ${maxSt} students)`);
    es.push(`Grupos pequeños (máx. ${maxSt} estudiantes)`);
    en.push("Learn from classmate interactions");
    es.push("Aprende de las interacciones con compañeros");
  } else if (mode === "duo") {
    en.push("2 students per class — maximum speaking time");
    es.push("2 estudiantes por clase — máximo tiempo hablando");
    en.push("Build confidence with a study partner");
    es.push("Gana confianza con un compañero de estudio");
  } else {
    en.push("100% one-on-one with your teacher");
    es.push("100% uno a uno con tu profesor");
    en.push("Customized lesson plan for your goals");
    es.push("Plan de lecciones personalizado para tus metas");
  }

  en.push("Real-time error correction");
  es.push("Corrección de errores en tiempo real");
  en.push("Google Meet video classes");
  es.push("Clases por video en Google Meet");

  if (freq >= 2) {
    en.push("Rapid progress guaranteed");
    es.push("Progreso rápido garantizado");
  }

  en.push("Flexible schedule — book classes that fit your life");
  es.push("Horario flexible — reserva clases que se ajusten a tu vida");

  return lang === "es" ? es : en;
}

/* ─── Component ─── */

export default function PricingPage() {
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const auth = useContext(AuthContext);
  const authBusy = Boolean(auth?.loading || auth?.hydrating);
  const currentUser = authBusy ? null : auth?.user;

  const t = (tr) => tr[language] || tr.en;

  useEffect(() => {
    (async () => {
      try {
        const res = await apiFetch("/api/class-types");
        if (!res.ok) throw new Error("Failed to fetch bundles");
        const data = await res.json();
        setBundles((data.bundles || []).filter((b) => b.is_active));
      } catch (err) {
        console.error("Error fetching bundles:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* Find cheapest per-class price for the hero */
  const cheapestPerClass = bundles.reduce((min, b) => {
    const price = (b.price_per_student_cents || 0) / 100;
    const sessions = b.sessions_per_month || (b.sessions_per_week || 1) * 4;
    const perClass = (b.price_model || "monthly") === "monthly" && sessions > 0
      ? price / sessions : price;
    return perClass < min ? perClass : min;
  }, Infinity);

  return (
    <div className="min-h-screen bm-page-bg">
      <Header />

      {/* ── Hero ── */}
      <section className="relative py-16 sm:py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#3FA9A6]/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#F2B705]/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#6366F1]/3 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#F2B705]/20 to-[#3FA9A6]/20 rounded-full px-5 py-2 mb-6 animate-fade-in">
            <Sparkles size={16} className="text-[#F2B705]" />
            <span className="text-sm font-semibold text-[#1F2A44]">
              {t({ en: "Speak English confidently in weeks", es: "Habla inglés con confianza en semanas" })}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#1F2A44] mb-6 leading-tight">
            {t({
              en: <>Invest in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3FA9A6] to-[#6366F1]">your future</span></>,
              es: <>Invierte en <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3FA9A6] to-[#6366F1]">tu futuro</span></>,
            })}
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            {t({
              en: "Live online classes with expert teachers. Small groups, personalized attention, real results.",
              es: "Clases en vivo online con profesores expertos. Grupos pequeños, atención personalizada, resultados reales.",
            })}
          </p>

          {!isNaN(cheapestPerClass) && cheapestPerClass < Infinity && (
            <div className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg px-6 py-4 gap-3 border border-gray-100">
              <div className="text-left">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                  {t({ en: "Starting from", es: "Desde" })}
                </p>
                <p className="text-2xl font-bold text-[#1F2A44]">
                  ${cheapestPerClass.toFixed(2)} <span className="text-sm font-normal text-gray-400">USD/{t({ en: "class", es: "clase" })}</span>
                </p>
              </div>
            </div>
          )}

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500 mt-10">
            <span className="flex items-center gap-1.5">
              <Shield size={16} className="text-[#3FA9A6]" />
              {t({ en: "Cancel anytime", es: "Cancela cuando quieras" })}
            </span>
            <span className="flex items-center gap-1.5">
              <Award size={16} className="text-[#F2B705]" />
              {t({ en: "Expert teachers", es: "Profesores expertos" })}
            </span>
            <span className="flex items-center gap-1.5">
              <Globe size={16} className="text-[#6366F1]" />
              {t({ en: "100% online", es: "100% en línea" })}
            </span>
          </div>
        </div>
      </section>

      {/* ── Bundle Cards ── */}
      <section className="pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3FA9A6]" />
            </div>
          ) : bundles.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg">{t({ en: "Plans coming soon!", es: "¡Planes disponibles pronto!" })}</p>
            </div>
          ) : (
            <div className={`grid gap-6 lg:gap-8 ${
              bundles.length <= 2 ? "md:grid-cols-2 max-w-3xl mx-auto"
                : bundles.length === 3 ? "md:grid-cols-3 max-w-5xl mx-auto"
                : "md:grid-cols-2 lg:grid-cols-4"
            }`}>
              {bundles.map((bundle, index) => {
                const marketing = getMarketingCopy(bundle, language);
                const features = getFeatures(bundle, language);
                const ModeIcon = MODE_ICONS[bundle.mode] || Users;
                const modeEmoji = MODE_EMOJIS[bundle.mode] || "📚";
                const accentGradient = GRADIENT_ACCENTS[index % GRADIENT_ACCENTS.length];
                const priceUsd = (bundle.price_per_student_cents || 0) / 100;
                const isMonthly = (bundle.price_model || "monthly") === "monthly";
                const sessionsPerMonth = bundle.sessions_per_month || (bundle.sessions_per_week || 1) * 4;
                const pricePerSession = isMonthly && sessionsPerMonth > 0
                  ? (priceUsd / sessionsPerMonth).toFixed(2) : priceUsd.toFixed(2);
                const isPopular = bundles.length > 1 && index === Math.min(1, bundles.length - 1);

                return (
                  <div
                    key={bundle.id}
                    className={`relative bg-white rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
                      isPopular ? "ring-2 ring-[#3FA9A6] shadow-xl shadow-[#3FA9A6]/10 md:scale-[1.03]" : "shadow-lg"
                    }`}
                  >
                    <div className={`h-1.5 bg-gradient-to-r ${accentGradient}`} />

                    {isPopular && (
                      <div className="absolute top-4 right-4 z-10">
                        <div className="flex items-center gap-1 bg-gradient-to-r from-[#F2B705] to-[#f5c642] text-[#1F2A44] px-3 py-1 rounded-full text-xs font-bold shadow-md">
                          <Sparkles size={12} />
                          {marketing.highlight}
                        </div>
                      </div>
                    )}

                    <div className="p-6 sm:p-8">
                      <div className="flex items-start gap-3 mb-4">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${accentGradient} flex items-center justify-center text-white shadow-md shrink-0`}>
                          <ModeIcon size={22} />
                        </div>
                        <div>
                          <h3 className="font-poppins text-xl font-bold text-[#1F2A44] leading-tight">{bundle.name}</h3>
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mt-0.5">
                            {modeEmoji}{" "}
                            {bundle.mode === "private"
                              ? t({ en: "1-on-1", es: "1 a 1" })
                              : bundle.mode === "duo"
                                ? t({ en: "Duo class", es: "Clase dúo" })
                                : t({ en: "Group class", es: "Clase grupal" })}
                          </p>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm leading-relaxed mb-6">{marketing.subtitle}</p>

                      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 mb-6 border border-gray-100">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-4xl font-bold text-[#1F2A44]">
                            ${priceUsd % 1 === 0 ? priceUsd : priceUsd.toFixed(2)}
                          </span>
                          <span className="text-gray-400 font-medium">
                            USD / {isMonthly ? t({ en: "month", es: "mes" }) : t({ en: "session", es: "sesión" })}
                          </span>
                        </div>
                        {isMonthly && (
                          <p className="text-xs text-[#3FA9A6] font-semibold mt-1.5">
                            ≈ ${pricePerSession} USD {t({ en: "per class", es: "por clase" })}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-[#3FA9A6]/5 rounded-xl p-3 text-center">
                          <Calendar size={18} className="mx-auto text-[#3FA9A6] mb-1" />
                          <p className="text-sm font-bold text-[#1F2A44]">{bundle.sessions_per_week || 1}x</p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider">{t({ en: "per week", es: "por semana" })}</p>
                        </div>
                        <div className="bg-[#F2B705]/5 rounded-xl p-3 text-center">
                          <Clock size={18} className="mx-auto text-[#F2B705] mb-1" />
                          <p className="text-sm font-bold text-[#1F2A44]">{bundle.duration_minutes || 60}</p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider">{t({ en: "minutes", es: "minutos" })}</p>
                        </div>
                      </div>

                      <a
                        href={currentUser ? "/choose-plan" : "/account/signup"}
                        className={`w-full py-3.5 rounded-xl font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2 ${
                          isPopular
                            ? `bg-gradient-to-r ${accentGradient} text-white shadow-lg hover:shadow-xl hover:scale-[1.02]`
                            : "bg-[#1F2A44] text-white hover:bg-[#2B3A54] hover:shadow-lg"
                        }`}
                      >
                        <Zap size={18} />
                        {currentUser
                          ? t({ en: "Choose this plan", es: "Elegir este plan" })
                          : t({ en: "Get started", es: "Comenzar ahora" })}
                      </a>
                    </div>

                    <div className="px-6 sm:px-8 pb-8">
                      <div className="border-t border-gray-100 pt-5">
                        <h4 className="font-semibold text-[#1F2A44] mb-4 text-xs uppercase tracking-widest flex items-center gap-1.5">
                          <Star size={12} className="text-[#F2B705]" />
                          {t({ en: "Everything included", es: "Todo incluido" })}
                        </h4>
                        <ul className="space-y-2.5">
                          {features.map((feat, idx) => (
                            <li key={idx} className="flex items-start gap-2.5">
                              <div className="w-5 h-5 rounded-full bg-[#3FA9A6]/10 flex items-center justify-center shrink-0 mt-0.5">
                                <Check className="text-[#3FA9A6]" size={12} />
                              </div>
                              <span className="text-sm text-gray-600 leading-snug">{feat}</span>
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

      {/* ── Why Choose Us ── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1F2A44] text-center mb-4">
            {t({ en: "Why Choose Be More English Online?", es: "¿Por Qué Elegir Be More English Online?" })}
          </h2>
          <p className="text-gray-500 text-center mb-14 max-w-2xl mx-auto">
            {t({ en: "We're not just another language app. We're real people helping real people.", es: "No somos solo otra app de idiomas. Somos personas reales ayudando a personas reales." })}
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <MessageCircle size={28} className="text-[#3FA9A6]" />,
                bg: "bg-[#3FA9A6]/10",
                titleEn: "Conversation First", titleEs: "Conversación Primero",
                descEn: "You speak from day one. Real practice, real progress.", descEs: "Hablas desde el día uno. Práctica real, progreso real.",
              },
              {
                icon: <GraduationCap size={28} className="text-[#F2B705]" />,
                bg: "bg-[#F2B705]/10",
                titleEn: "Expert Teachers", titleEs: "Profesores Expertos",
                descEn: "Experienced native speakers who care about your goals.", descEs: "Hablantes nativos experimentados que se preocupan por tus metas.",
              },
              {
                icon: <TrendingUp size={28} className="text-[#6366F1]" />,
                bg: "bg-[#6366F1]/10",
                titleEn: "Real Results", titleEs: "Resultados Reales",
                descEn: "See confidence improve in just 2–4 weeks.", descEs: "Ve tu confianza mejorar en solo 2-4 semanas.",
              },
              {
                icon: <Shield size={28} className="text-[#EC4899]" />,
                bg: "bg-[#EC4899]/10",
                titleEn: "No Commitment", titleEs: "Sin Compromisos",
                descEn: "Cancel anytime. No long-term contracts.", descEs: "Cancela cuando quieras. Sin contratos.",
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 text-center">
                <div className={`w-16 h-16 ${item.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  {item.icon}
                </div>
                <h3 className="font-bold text-[#1F2A44] mb-2">{t({ en: item.titleEn, es: item.titleEs })}</h3>
                <p className="text-gray-500 text-sm">{t({ en: item.descEn, es: item.descEs })}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-br from-[#3FA9A6] to-[#2d8a87] rounded-3xl p-10 sm:p-14 text-white text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-16 -mb-16 blur-2xl" />
            <div className="relative z-10">
              <Rocket size={40} className="mx-auto mb-4 text-[#F2B705]" />
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                {t({ en: "Ready to transform your English?", es: "¿Listo para transformar tu inglés?" })}
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
                {t({
                  en: "Join hundreds of students who are already speaking with confidence. Your journey starts with one class.",
                  es: "Únete a cientos de estudiantes que ya hablan con confianza. Tu camino comienza con una clase.",
                })}
              </p>
              <a
                href={currentUser ? "/choose-plan" : "/account/signup"}
                className="inline-flex items-center gap-2 bg-white text-[#3FA9A6] px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all hover:scale-105"
              >
                {t({ en: "Start Now", es: "Empezar Ahora" })}
                <ArrowRight size={20} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Reassurance ── */}
      <section className="pb-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-gray-500 text-sm">
            {t({
              en: "💡 All plans can be changed or cancelled at any time. No long-term contracts. Start today and see the difference.",
              es: "💡 Todos los planes se pueden cambiar o cancelar en cualquier momento. Sin contratos largos. Empieza hoy y nota la diferencia.",
            })}
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
