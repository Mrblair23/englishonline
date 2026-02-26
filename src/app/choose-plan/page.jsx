import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { apiFetch } from "@/utils/apiClient";
import { useLanguage } from "@/utils/useLanguage";
import useUser from "@/utils/useUser";
import {
  Check,
  Sparkles,
  Users,
  User,
  Calendar,
  ArrowLeft,
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
} from "lucide-react";

/* ─── Marketing helpers ─── */

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

export default function ChoosePlanPage() {
  const navigate = useNavigate();
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const { data: user, loading: userLoading } = useUser();

  const t = (tr) => tr[language] || tr.en;

  useEffect(() => {
    if (!userLoading && !user) navigate("/account/signin");
  }, [user, userLoading, navigate]);

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

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bm-page-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3FA9A6]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bm-page-bg">
      <Header />

      {/* ── Hero ── */}
      <section className="relative py-12 sm:py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#3FA9A6]/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#F2B705]/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center text-gray-500 hover:text-[#3FA9A6] mb-8 transition-colors group"
          >
            <ArrowLeft size={18} className="mr-1 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">
              {t({ en: "Back to Dashboard", es: "Volver al Panel" })}
            </span>
          </button>

          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#F2B705]/20 to-[#3FA9A6]/20 rounded-full px-5 py-2 mb-6">
            <Rocket size={16} className="text-[#F2B705]" />
            <span className="text-sm font-semibold text-[#1F2A44]">
              {t({ en: "Start speaking English with confidence", es: "Empieza a hablar inglés con confianza" })}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#1F2A44] mb-5 leading-tight">
            {t({
              en: <>Find the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3FA9A6] to-[#2d8a87]">perfect plan</span> for you</>,
              es: <>Encuentra el <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3FA9A6] to-[#2d8a87]">plan perfecto</span> para ti</>,
            })}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            {t({
              en: "Live classes with expert teachers. Flexible schedules. Real results you'll feel in weeks, not years.",
              es: "Clases en vivo con profesores expertos. Horarios flexibles. Resultados reales que sentirás en semanas, no años.",
            })}
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <Shield size={16} className="text-[#3FA9A6]" />
              {t({ en: "Cancel anytime", es: "Cancela cuando quieras" })}
            </span>
            <span className="flex items-center gap-1.5">
              <Award size={16} className="text-[#F2B705]" />
              {t({ en: "Expert teachers", es: "Profesores expertos" })}
            </span>
            <span className="flex items-center gap-1.5">
              <Target size={16} className="text-[#6366F1]" />
              {t({ en: "Proven results", es: "Resultados comprobados" })}
            </span>
          </div>
        </div>
      </section>

      {/* ── Bundle Cards ── */}
      <section className="pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3FA9A6]" />
            </div>
          ) : bundles.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg">{t({ en: "No plans available right now. Check back soon!", es: "No hay planes disponibles ahora. ¡Vuelve pronto!" })}</p>
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
                    {/* accent bar */}
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
                      {/* icon + name */}
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

                      {/* price */}
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

                      {/* quick stats */}
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

                      {/* CTA */}
                      <button
                        onClick={() => navigate(`/payment?plan=${bundle.slug || bundle.id}&name=${encodeURIComponent(bundle.name)}&price=$${priceUsd}`)}
                        className={`w-full py-3.5 rounded-xl font-semibold text-base transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 ${
                          isPopular
                            ? `bg-gradient-to-r ${accentGradient} text-white shadow-lg hover:shadow-xl hover:scale-[1.02]`
                            : "bg-[#1F2A44] text-white hover:bg-[#2B3A54] hover:shadow-lg"
                        }`}
                      >
                        <Zap size={18} />
                        {t({ en: "Choose this plan", es: "Elegir este plan" })}
                      </button>
                    </div>

                    {/* features */}
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

      {/* ── Social proof ── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#1F2A44] to-[#2B3A54] rounded-3xl p-8 sm:p-12 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#3FA9A6]/10 rounded-full -mr-20 -mt-20 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#F2B705]/10 rounded-full -ml-20 -mb-20 blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                {t({ en: "Why students love Be More English", es: "Por qué los estudiantes aman Be More English" })}
              </h2>
              <div className="grid sm:grid-cols-3 gap-8 mt-8">
                <div>
                  <div className="w-14 h-14 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <MessageCircle size={24} className="text-[#3FA9A6]" />
                  </div>
                  <h3 className="font-semibold mb-1">{t({ en: "Conversation first", es: "Conversación primero" })}</h3>
                  <p className="text-sm text-white/70">{t({ en: "You speak from day one. No boring grammar drills.", es: "Hablas desde el día uno. Sin ejercicios aburridos de gramática." })}</p>
                </div>
                <div>
                  <div className="w-14 h-14 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Headphones size={24} className="text-[#F2B705]" />
                  </div>
                  <h3 className="font-semibold mb-1">{t({ en: "Expert teachers", es: "Profesores expertos" })}</h3>
                  <p className="text-sm text-white/70">{t({ en: "Certified, experienced, and passionate about your progress.", es: "Certificados, experimentados y apasionados por tu progreso." })}</p>
                </div>
                <div>
                  <div className="w-14 h-14 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <TrendingUp size={24} className="text-[#EC4899]" />
                  </div>
                  <h3 className="font-semibold mb-1">{t({ en: "See real results", es: "Ve resultados reales" })}</h3>
                  <p className="text-sm text-white/70">{t({ en: "Students improve confidence in just 2–4 weeks.", es: "Los estudiantes mejoran su confianza en solo 2-4 semanas." })}</p>
                </div>
              </div>
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
