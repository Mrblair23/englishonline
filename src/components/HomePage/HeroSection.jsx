import { ArrowRight, ChevronDown, Video } from "lucide-react";
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
    <section className="relative overflow-hidden min-h-[90vh] lg:min-h-screen">
      {/* Green/teal gradient background like the reference */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2d8a6e] via-[#3a9e7e] to-[#4fb89a]" />
      {/* Warm overlay glow */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-radial from-[#F2B705]/20 via-transparent to-transparent rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-gradient-radial from-[#2d7a5e]/30 via-transparent to-transparent rounded-full blur-3xl" />
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-10 lg:pt-14 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

          {/* ═══════ LEFT COLUMN ═══════ */}
          <div className="text-center lg:text-left">
            {/* Logo text */}
            <div className="mb-4">
              <span className="text-white font-poppins font-black text-2xl sm:text-3xl tracking-tight leading-none">
                BE MORE
              </span>
              <br />
              <span className="text-[#F2B705] font-poppins font-black text-lg sm:text-xl tracking-wider">
                ENGLISH <span className="text-white/80 font-bold text-sm">ONLINE</span>
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-poppins text-4xl sm:text-5xl md:text-[3.5rem] font-black text-white leading-[1.05] mb-4 tracking-tight drop-shadow-lg">
              {t({
                en: (
                  <>
                    EVALUATE YOUR<br />ENGLISH{" "}
                    <span className="text-[#F2B705]">FREE</span> AND<br />START!
                  </>
                ),
                es: (
                  <>
                    ¡EVALÚA TU INGLÉS<br />
                    <span className="text-[#F2B705]">GRATIS</span> Y<br />EMPIEZA!
                  </>
                ),
              })}
            </h1>
            <p className="text-base sm:text-lg text-white/80 mb-6 leading-relaxed max-w-md mx-auto lg:mx-0 drop-shadow">
              {t({
                en: "Discover your level in 5 minutes and start your Professional Career in the U.S.",
                es: "Descubre tu nivel en 5 minutos y comienza tu Carrera Profesional en EE. UU.",
              })}
            </p>

            {/* ── Evaluation form card ── */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 sm:p-6 shadow-2xl border border-white/50 max-w-lg mx-auto lg:mx-0">
              <p className="text-xs sm:text-sm font-bold text-[#1F2A44] text-center mb-4 uppercase tracking-wide">
                {t({
                  en: "SIGN UP WITH ONE CLICK AND TAKE YOUR FREE LEVEL EVALUATION",
                  es: "INSCRÍBETE CON SÓLO UN CLICK Y HAZ TU EVALUACIÓN DE NIVEL GRATUITA",
                })}
              </p>

              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-3">
                  {/* Name + Email side by side */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#1F2A44] mb-1">
                        {t({ en: "Name", es: "Nombre" })}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={t({ en: "Name", es: "Nombre" })}
                        value={formData.name}
                        onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm focus:border-[#3FA9A6] focus:ring-2 focus:ring-[#3FA9A6]/20 focus:outline-none transition-all bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#1F2A44] mb-1">
                        {t({ en: "Email", es: "Correo Electrónico" })}
                      </label>
                      <input
                        type="email"
                        required
                        placeholder={t({ en: "Email", es: "Correo Electrónico" })}
                        value={formData.email}
                        onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm focus:border-[#3FA9A6] focus:ring-2 focus:ring-[#3FA9A6]/20 focus:outline-none transition-all bg-white"
                      />
                    </div>
                  </div>

                  {/* Goal selector */}
                  <div>
                    <label className="block text-xs font-bold text-[#1F2A44] mb-1">
                      {t({ en: "Select Your Goal", es: "Selecciona tu Meta" })}
                    </label>
                    <div className="relative">
                      <select
                        required
                        value={formData.goal}
                        onChange={(e) => setFormData((f) => ({ ...f, goal: e.target.value }))}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm appearance-none focus:border-[#3FA9A6] focus:ring-2 focus:ring-[#3FA9A6]/20 focus:outline-none bg-white transition-all"
                      >
                        <option value="">{t({ en: "Work, Study, Travel, Other", es: "Trabajo, Estudios, Viaje, Otro" })}</option>
                        <option value="work">{t({ en: "Work", es: "Trabajo" })}</option>
                        <option value="study">{t({ en: "Study", es: "Estudios" })}</option>
                        <option value="travel">{t({ en: "Travel", es: "Viaje" })}</option>
                        <option value="other">{t({ en: "Other", es: "Otro" })}</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-[#F2B705] to-[#f5c642] text-[#1F2A44] rounded-xl font-extrabold text-sm hover:shadow-lg hover:brightness-105 hover:scale-[1.02] transition-all shadow-md uppercase tracking-wide"
                  >
                    {t({ en: "Start My Free Evaluation", es: "¡Haz mi evaluación gratuita ya!" })}
                  </button>
                </form>
              ) : (
                <div className="text-center py-6">
                  <div className="text-4xl mb-2">🎉</div>
                  <p className="font-bold text-[#3FA9A6]">
                    {t({ en: "Redirecting to sign up…", es: "Redirigiendo al registro…" })}
                  </p>
                </div>
              )}
            </div>

            {/* ── Business people illustration (CSS art) ── */}
            <div className="hidden lg:flex items-end justify-center lg:justify-start gap-1 mt-6 max-w-lg">
              {[
                { emoji: "👨‍💼", bg: "from-[#6b8e7b] to-[#4a7060]" },
                { emoji: "👩‍💼", bg: "from-[#7a9a8b] to-[#5a8070]" },
                { emoji: "👨‍🏫", bg: "from-[#8aaa9b] to-[#6a9080]" },
                { emoji: "👩‍🎓", bg: "from-[#6b8e7b] to-[#4a7060]" },
                { emoji: "👨‍💻", bg: "from-[#7a9a8b] to-[#5a8070]" },
              ].map((p, i) => (
                <div
                  key={i}
                  className={`relative w-16 h-20 rounded-t-2xl bg-gradient-to-b ${p.bg} flex items-center justify-center shadow-lg`}
                  style={{ marginBottom: 0 }}
                >
                  <span className="text-3xl drop-shadow-md">{p.emoji}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ═══════ RIGHT COLUMN: Video-call window ═══════ */}
          <div className="relative mt-4 lg:mt-0">
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-white/30 max-w-md mx-auto lg:max-w-none">
              {/* Window title bar */}
              <div className="bg-gradient-to-r from-[#1F2A44] to-[#2a4060] px-4 py-2.5 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <span className="text-white font-black text-sm ml-2 tracking-widest font-poppins">BE MORE</span>
                <div className="ml-auto flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-green-500/80 flex items-center justify-center text-white">
                    <Video size={14} />
                  </span>
                </div>
              </div>

              {/* 4 participant tiles */}
              <div className="grid grid-cols-4 gap-[3px] p-[3px] bg-[#1F2A44]/10">
                {[
                  { name: "Sarah (USA)", bg: "from-[#f8d8a8] to-[#e8c898]", emoji: "👩‍💼", ring: "ring-yellow-400" },
                  { name: "Juan (Spain)", bg: "from-[#a8d0e0] to-[#88b8c8]", emoji: "👨‍💻", ring: "ring-blue-400" },
                  { name: "Amina (Nigeria)", bg: "from-[#d0b8e0] to-[#b8a0c8]", emoji: "👩‍🎓", ring: "ring-purple-400" },
                  { name: "Kanji (Japan)", bg: "from-[#b8e0c8] to-[#98c8b0]", emoji: "👨‍🏫", ring: "ring-green-400" },
                ].map((p, i) => (
                  <div key={i} className="relative aspect-[3/4] rounded-lg overflow-hidden group">
                    <div className={`absolute inset-0 bg-gradient-to-br ${p.bg}`} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-5xl sm:text-6xl drop-shadow-md group-hover:scale-110 transition-transform">{p.emoji}</span>
                    </div>
                    <div className="absolute bottom-0 inset-x-0 bg-black/50 backdrop-blur-sm px-1.5 py-1">
                      <p className="text-white text-[10px] sm:text-xs font-bold truncate text-center">{p.name}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Gold CTA button inside the window */}
              <div className="p-3">
                <a
                  href="/account/signup"
                  className="group flex items-center justify-center w-full py-3.5 bg-gradient-to-r from-[#F2B705] to-[#f5c642] text-[#1F2A44] rounded-xl font-extrabold text-xs sm:text-sm hover:shadow-xl hover:brightness-105 hover:scale-[1.02] transition-all shadow-lg uppercase tracking-wide"
                >
                  {t({
                    en: "SIGN UP AND TAKE MY FREE EVALUATION NOW!",
                    es: "¡INSCRÍBETE Y HAZ MI EVALUACIÓN GRATUITA YA!",
                  })}
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
