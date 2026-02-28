import { ArrowRight, Users, Globe, TrendingUp, ChevronDown } from "lucide-react";
import { useState } from "react";

export function HeroSection({ t }) {
  const [formData, setFormData] = useState({ name: "", email: "", goal: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      window.location.href = "/account/signup?email=" + encodeURIComponent(formData.email);
    }, 1200);
  };

  return (
    <section className="relative overflow-hidden">
      {/* Dreamy sky-blue gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#d4eef8] via-[#e8f4fa] to-[#f0f7fb]" />
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-gradient-radial from-[#F2B705]/15 via-transparent to-transparent rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-gradient-radial from-[#3FA9A6]/15 via-transparent to-transparent rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* LEFT: Headline + CTAs */}
          <div className="text-center lg:text-left">
            <h1 className="font-poppins text-4xl sm:text-5xl md:text-[3.4rem] lg:text-[3.6rem] font-bold text-[#1a3c6e] leading-[1.08] mb-4 tracking-tight">
              {t({
                en: (
                  <>
                    Evaluate Your English{" "}
                    <span className="text-[#3FA9A6]">Free</span> and Start
                    Speaking{" "}
                    <span className="text-[#F2B705]">Confidently</span>
                  </>
                ),
                es: (
                  <>
                    ¡Evalúa tu Inglés{" "}
                    <span className="text-[#3FA9A6]">Gratis</span> y Empieza a
                    Hablar con{" "}
                    <span className="text-[#F2B705]">Confianza!</span>
                  </>
                ),
              })}
            </h1>
            <p className="text-base sm:text-lg text-[#1a3c6e]/70 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
              {t({
                en: "Discover your level in 15 minutes and begin your professional growth.",
                es: "Descubre tu nivel en 15 minutos y comienza tu Carrera Profesional en EE. UU.",
              })}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-8">
              <a
                href="/account/signup"
                className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#F2B705] to-[#f5c642] text-[#1F2A44] rounded-2xl font-bold text-base hover:shadow-xl hover:brightness-105 hover:scale-105 transition-all w-full sm:w-auto shadow-lg"
              >
                {t({ en: "Create Free Account", es: "Crear Cuenta Gratis" })}
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </a>
              <a
                href="/account/signin"
                className="group inline-flex items-center justify-center px-8 py-4 bg-white border-2 border-[#1a3c6e]/20 text-[#1a3c6e] rounded-2xl font-bold text-base hover:bg-[#1a3c6e] hover:text-white hover:shadow-lg transition-all w-full sm:w-auto shadow-sm"
              >
                {t({ en: "Sign In", es: "Iniciar Sesión" })}
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              {[
                { icon: <Users size={16} />, label: t({ en: "Small Groups", es: "Grupos Pequeños" }) },
                { icon: <Globe size={16} />, label: t({ en: "Native Teachers", es: "Profesores Nativos" }) },
                { icon: <TrendingUp size={16} />, label: t({ en: "Fast Results", es: "Resultados Rápidos" }) },
              ].map((b, i) => (
                <span key={i} className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-semibold text-[#1a3c6e] border border-white/60 shadow-sm">
                  <span className="text-[#3FA9A6]">{b.icon}</span>
                  {b.label}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT: Video-call mockup + evaluation form */}
          <div className="relative">
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200/50">
              {/* Window bar */}
              <div className="bg-gradient-to-r from-[#1a3c6e] to-[#3FA9A6] px-5 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400" />
                  <span className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <span className="text-white/90 font-bold text-sm ml-3 tracking-wide">BE MORE</span>
                <div className="ml-auto flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center text-white text-xs">🎥</span>
                </div>
              </div>

              {/* Participant grid */}
              <div className="grid grid-cols-4 gap-1 p-1 bg-[#1a3c6e]/5">
                {[
                  { name: "Sarah (USA)", bg: "from-[#fce4b8] to-[#f0d4a0]", emoji: "👩‍💼" },
                  { name: "Juan (Spain)", bg: "from-[#b8dce8] to-[#98c4d4]", emoji: "👨‍💻" },
                  { name: "Amina (Nigeria)", bg: "from-[#d8c0e8] to-[#c0a8d4]", emoji: "👩‍🎓" },
                  { name: "Kanji (Japan)", bg: "from-[#c0e8d0] to-[#a8d4b8]", emoji: "👨‍🏫" },
                ].map((p, i) => (
                  <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${p.bg}`} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl sm:text-4xl">{p.emoji}</span>
                    </div>
                    <div className="absolute bottom-0 inset-x-0 bg-black/40 backdrop-blur-sm px-1.5 py-0.5">
                      <p className="text-white text-[9px] sm:text-[10px] font-semibold truncate text-center">{p.name}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Inline evaluation form */}
              <div className="p-5 sm:p-6">
                <h3 className="font-poppins text-lg font-bold text-[#1a3c6e] mb-1">
                  {t({ en: "Free Level Evaluation", es: "Evaluación de Nivel Gratuita" })}
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  {t({
                    en: "Sign up and take your free evaluation — no credit card required",
                    es: "Inscríbete y haz tu evaluación gratuita — sin tarjeta de crédito",
                  })}
                </p>

                {!submitted ? (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#1a3c6e] mb-1">{t({ en: "Name", es: "Nombre" })}</label>
                      <input type="text" required placeholder={t({ en: "Name", es: "Nombre" })} value={formData.name} onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[#3FA9A6] focus:ring-2 focus:ring-[#3FA9A6]/20 focus:outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#1a3c6e] mb-1">{t({ en: "Email", es: "Correo Electrónico" })}</label>
                      <input type="email" required placeholder={t({ en: "Email", es: "Correo Electrónico" })} value={formData.email} onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[#3FA9A6] focus:ring-2 focus:ring-[#3FA9A6]/20 focus:outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#1a3c6e] mb-1">{t({ en: "Select Your Goal", es: "Selecciona tu Meta" })}</label>
                      <div className="relative">
                        <select required value={formData.goal} onChange={(e) => setFormData((f) => ({ ...f, goal: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm appearance-none focus:border-[#3FA9A6] focus:ring-2 focus:ring-[#3FA9A6]/20 focus:outline-none bg-white transition-all">
                          <option value="">{t({ en: "Work, Study, Travel, Other", es: "Trabajo, Estudios, Viaje, Otro" })}</option>
                          <option value="work">{t({ en: "Work", es: "Trabajo" })}</option>
                          <option value="study">{t({ en: "Study", es: "Estudios" })}</option>
                          <option value="travel">{t({ en: "Travel", es: "Viaje" })}</option>
                          <option value="other">{t({ en: "Other", es: "Otro" })}</option>
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <button type="submit" className="w-full py-3 bg-gradient-to-r from-[#F2B705] to-[#f5c642] text-[#1F2A44] rounded-2xl font-bold text-sm hover:shadow-lg hover:brightness-105 hover:scale-[1.02] transition-all shadow-md">
                      {t({ en: "Start My Free Evaluation", es: "¡Haz mi evaluación gratuita ya!" })}
                    </button>
                    <p className="text-center text-[10px] text-gray-400">{t({ en: "No credit card required", es: "Sin tarjeta de crédito" })}</p>
                  </form>
                ) : (
                  <div className="text-center py-6">
                    <div className="text-4xl mb-2">🎉</div>
                    <p className="font-bold text-[#3FA9A6]">{t({ en: "Redirecting to sign up…", es: "Redirigiendo al registro…" })}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Curved bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 40L60 36C120 32 240 24 360 28C480 32 600 48 720 52C840 56 960 48 1080 40C1200 32 1320 24 1380 20L1440 16V80H0V40Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
