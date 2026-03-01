import { ArrowRight, Play, Users, Mic, CalendarDays } from "lucide-react";

export function HeroSection({ t }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0f1b2d] via-[#162544] to-[#1a3a5c] min-h-[92vh] flex items-center">
      {/* Ambient glow blobs — subtle, not childish */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#f97316]/8 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#0ea5e9]/8 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#14b8a6]/6 rounded-full blur-[100px]" />

      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left: Copy */}
          <div className="text-center lg:text-left">
            {/* Club badge */}
            <div className="inline-flex items-center gap-2.5 bg-white/[0.07] backdrop-blur-md rounded-full px-5 py-2.5 border border-white/10 mb-8">
              <span className="w-2 h-2 rounded-full bg-[#f97316] animate-pulse" />
              <span className="text-sm font-semibold text-[#f97316] tracking-wide uppercase">
                {t({ en: "English Speaking Club", es: "Club de Conversación en Inglés" })}
              </span>
            </div>

            <h1 className="font-poppins text-[2.75rem] sm:text-5xl lg:text-6xl xl:text-[4rem] font-extrabold leading-[1.1] mb-6">
              <span className="text-white">
                {t({ en: "Stop Studying English.", es: "Deja de Estudiar Inglés." })}
              </span>
              <br />
              <span className="relative inline-block mt-1">
                <span className="bg-gradient-to-r from-[#f97316] via-[#fb923c] to-[#fbbf24] bg-clip-text text-transparent">
                  {t({ en: "Start Speaking It.", es: "Empieza a Hablarlo." })}
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <path d="M2 5 Q 50 1, 100 4 Q 150 7, 198 3" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.5" />
                </svg>
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0">
              {t({
                en: "Small groups. Native teachers. Real conversations. A structured speaking club designed for busy adults who want real progress.",
                es: "Grupos pequeños. Profesores nativos. Conversaciones reales. Un club estructurado para adultos que quieren progreso real.",
              })}
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-10">
              <a
                href="/account/signup"
                className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white rounded-xl font-bold text-base shadow-lg shadow-[#f97316]/20 hover:shadow-xl hover:shadow-[#f97316]/30 hover:scale-[1.03] transition-all w-full sm:w-auto"
              >
                {t({ en: "Take the 5-Minute Free Test", es: "Haz el Test Gratis de 5 Minutos" })}
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
              </a>
              <a
                href="#programs"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/[0.07] backdrop-blur-sm border border-white/15 text-white rounded-xl font-semibold text-base hover:bg-white/[0.12] transition-all w-full sm:w-auto"
              >
                <Play size={16} className="mr-2 text-[#f97316]" />
                {t({ en: "See How It Works", es: "Mira Cómo Funciona" })}
              </a>
            </div>

            {/* Social proof — clean stat pills */}
            <div className="flex flex-wrap items-center gap-3 justify-center lg:justify-start">
              {[
                { icon: Users, text: t({ en: "500+ Active Members", es: "500+ Miembros Activos" }) },
                { icon: Mic, text: t({ en: "Native English Teachers", es: "Profesores Nativos" }) },
                { icon: CalendarDays, text: t({ en: "40+ Weekly Live Sessions", es: "40+ Sesiones Semanales" }) },
              ].map((item, i) => (
                <span key={i} className="inline-flex items-center gap-2 bg-white/[0.06] backdrop-blur-sm px-4 py-2 rounded-lg text-xs font-medium text-slate-300 border border-white/8">
                  <item.icon size={14} className="text-[#f97316] flex-shrink-0" />
                  {item.text}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Video call card — modern SaaS style */}
          <div className="relative flex items-center justify-center">
            {/* Glow behind card */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0ea5e9]/15 to-[#14b8a6]/15 rounded-3xl blur-2xl scale-105" />

            {/* Main card */}
            <div className="relative bg-[#1e293b] rounded-2xl shadow-2xl shadow-black/40 border border-white/10 overflow-hidden max-w-sm mx-auto lg:max-w-md w-full">
              {/* Window bar */}
              <div className="bg-gradient-to-r from-[#0d9488] to-[#14b8a6] px-4 py-3 flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-white/30" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/30" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/30" />
                </div>
                <span className="text-white font-bold text-sm tracking-wider ml-1">BE MORE ENGLISH</span>
                <div className="ml-auto flex items-center gap-3">
                  <span className="flex items-center gap-1.5 bg-white/15 rounded-md px-2.5 py-1 text-white text-[11px] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                    LIVE
                  </span>
                  <svg className="w-4 h-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                </div>
              </div>

              {/* 2x2 participant grid — cartoon avatars */}
              <div className="grid grid-cols-2 gap-1.5 p-2.5">
                {[
                  { name: "Sarah", country: "USA", role: t({ en: "Teacher", es: "Profesora" }), bg: "from-[#fef3c7] to-[#fde68a]", seed: "Aneka", isHost: true },
                  { name: "Carlos", country: "México", role: t({ en: "Member", es: "Miembro" }), bg: "from-[#bfdbfe] to-[#93c5fd]", seed: "Felix", isHost: false },
                  { name: "Amina", country: "Nigeria", role: t({ en: "Member", es: "Miembro" }), bg: "from-[#bbf7d0] to-[#86efac]", seed: "Brooklynn", isHost: false },
                  { name: "Kanji", country: "Japan", role: t({ en: "Member", es: "Miembro" }), bg: "from-[#e9d5ff] to-[#c4b5fd]", seed: "Leo", isHost: false },
                ].map((p, i) => (
                  <div key={i} className={`relative rounded-xl bg-gradient-to-br ${p.bg} flex flex-col items-center justify-center aspect-[4/3] overflow-hidden`}>
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.seed}&backgroundColor=transparent`}
                      alt={p.name}
                      className="w-[55%] h-auto drop-shadow-md"
                      loading="lazy"
                    />
                    <div className="absolute bottom-1.5 inset-x-1.5">
                      <div className="bg-black/50 backdrop-blur-sm rounded-md px-2 py-1 text-center">
                        <p className="text-[10px] font-semibold text-white leading-tight">{p.name} ({p.country})</p>
                      </div>
                    </div>
                    {p.isHost && (
                      <span className="absolute top-1.5 left-1.5 bg-[#0d9488] text-white text-[8px] font-bold px-2 py-0.5 rounded-md shadow-sm">HOST</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Session info bar */}
              <div className="mx-2.5 mb-2.5 bg-white/5 rounded-xl px-4 py-3 border border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {t({ en: "Session in progress", es: "Sesión en curso" })}
                  </p>
                  <p className="text-xs text-white font-semibold mt-0.5">
                    {t({ en: "Business English — B2 Level", es: "Inglés de Negocios — Nivel B2" })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-slate-400 font-medium">
                    {t({ en: "Duration", es: "Duración" })}
                  </p>
                  <p className="text-xs text-[#14b8a6] font-bold mt-0.5 tabular-nums">23:47</p>
                </div>
              </div>
            </div>

            {/* Subtle floating accent — next session card */}
            <div className="absolute -bottom-5 -right-3 sm:-right-6 bg-[#1e293b] rounded-xl shadow-xl shadow-black/30 border border-white/10 px-4 py-3 max-w-[180px]">
              <p className="text-[10px] text-slate-400 font-medium mb-1">
                {t({ en: "Next session", es: "Próxima sesión" })}
              </p>
              <p className="text-xs text-white font-semibold">
                {t({ en: "Everyday English", es: "Inglés Cotidiano" })}
              </p>
              <p className="text-[11px] text-[#f97316] font-bold mt-1">
                {t({ en: "In 45 min →", es: "En 45 min →" })}
              </p>
            </div>

            {/* Subtle floating accent — member count */}
            <div className="absolute -top-3 -left-2 sm:-left-5 bg-[#1e293b] rounded-xl shadow-xl shadow-black/30 border border-white/10 px-4 py-2.5 flex items-center gap-2.5">
              <div className="flex -space-x-1.5">
                {["Aneka","Felix","Brooklynn"].map((s, i) => (
                  <img
                    key={i}
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s}&backgroundColor=transparent&scale=80`}
                    className="w-6 h-6 rounded-full border-2 border-[#1e293b] bg-slate-600"
                    alt=""
                  />
                ))}
              </div>
              <div>
                <p className="text-[10px] text-white font-semibold leading-tight">12 {t({ en: "online now", es: "en línea" })}</p>
                <p className="text-[9px] text-slate-400">{t({ en: "3 sessions live", es: "3 sesiones en vivo" })}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade to white */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
