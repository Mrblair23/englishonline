import { ArrowRight, Users, Mic, CalendarDays } from "lucide-react";
import { Link } from "react-router";

export function HeroSection({ t }) {
  return (
    <section className="relative overflow-hidden bg-[#0c1a2e] min-h-[92vh]">

      {/* ── MOBILE: Image on top ── */}
      <div className="relative lg:hidden w-full h-[52vh] min-h-[320px]">
        <img
          src="/hero-club.webp"
          alt={t({ en: "English Speaking Club session", es: "Sesión del Club de Conversación" })}
          className="absolute inset-0 w-full h-full object-cover object-top"
          loading="eager"
          fetchPriority="high"
        />
        {/* Cinematic gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c1a2e] via-[#0c1a2e]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c1a2e]/30 to-transparent" />
      </div>

      {/* ── DESKTOP: Full split layout ── */}
      <div className="relative flex items-center min-h-[92vh]">

        {/* Desktop image — right half, absolutely positioned */}
        <div className="hidden lg:block absolute top-0 right-0 w-[55%] h-full">
          <img
            src="/hero-club.webp"
            alt={t({ en: "English Speaking Club session", es: "Sesión del Club de Conversación" })}
            className="absolute inset-0 w-full h-full object-cover object-center"
            loading="eager"
            fetchPriority="high"
          />
          {/* Cinematic gradient: left fade into dark bg — softened */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c1a2e]/80 via-[#0c1a2e]/35 to-transparent" />
          {/* Subtle bottom fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c1a2e]/30 to-transparent" />
          {/* Warm cinematic tone */}
          <div className="absolute inset-0 bg-[#f97316]/[0.04]" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 w-full py-10 lg:py-20">
          <div className="max-w-lg lg:max-w-[480px]">

            {/* Club badge */}
            <div className="inline-flex items-center gap-2 bg-white/[0.08] backdrop-blur-md rounded-full px-4 py-1.5 border border-white/[0.08] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f97316] animate-pulse" />
              <span className="text-[11px] font-semibold text-[#f97316] tracking-widest uppercase">
                {t({ en: "English Speaking Club", es: "Club de Conversación en Inglés" })}
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-poppins text-3xl sm:text-4xl lg:text-[2.75rem] xl:text-5xl font-extrabold leading-[1.1] mb-5 tracking-tight">
              <span className="text-white">
                {t({ en: "Stop Studying English.", es: "Deja de Estudiar Inglés." })}
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#f97316] via-[#fb923c] to-[#fbbf24] bg-clip-text text-transparent">
                {t({ en: "Start Speaking It.", es: "Empieza a Hablarlo." })}
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-slate-300/90 leading-relaxed mb-8 max-w-md">
              {t({
                en: "Small groups. Native teachers. Real conversations. A structured speaking club built for busy adults who want real progress.",
                es: "Grupos pequeños. Profesores nativos. Conversaciones reales. Un club estructurado para adultos que quieren progreso real.",
              })}
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-10">
              <Link
                to="/account/signup"
                className="group inline-flex items-center justify-center px-6 py-3.5 bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-600/25 hover:shadow-xl hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                {t({ en: "Take the 5-Minute Free Test", es: "Haz el Test Gratis de 5 Minutos" })}
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
              </Link>
              <Link
                to="#programs"
                className="inline-flex items-center justify-center px-6 py-3.5 bg-transparent border border-white/20 text-white rounded-xl font-semibold text-sm hover:bg-white/[0.06] transition-all"
              >
                {t({ en: "See Programs", es: "Ver Programas" })}
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              {[
                { icon: Users, value: "500+", label: t({ en: "Active Members", es: "Miembros Activos" }) },
                { icon: Mic, value: "100%", label: t({ en: "Native Teachers", es: "Profesores Nativos" }) },
                { icon: CalendarDays, value: "40+", label: t({ en: "Weekly Sessions", es: "Sesiones Semanales" }) },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#f97316]/10 flex items-center justify-center">
                    <stat.icon size={14} className="text-[#f97316]" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-xs leading-tight">{stat.value}</p>
                    <p className="text-slate-400 text-[10px] font-medium">{stat.label}</p>
                  </div>
                  {i < 2 && <div className="hidden sm:block w-px h-8 bg-white/10 ml-3" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade to white — seamless transition into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white via-white/80 to-transparent z-20" />
    </section>
  );
}
