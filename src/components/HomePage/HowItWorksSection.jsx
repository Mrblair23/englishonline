import { Users, Briefcase, Clock, TrendingUp } from "lucide-react";

export function HowItWorksSection({ t }) {
  const features = [
    {
      icon: <Users size={28} />,
      title: t({ en: "EXCLUSIVE GROUPS", es: "GRUPOS EXCLUSIVOS" }),
      sub: t({ en: "(Adults)", es: "(Adultos)" }),
      desc: t({
        en: "Share and grow with professional peers.",
        es: "Compartir y crecer con pares profesionales.",
      }),
    },
    {
      icon: <Briefcase size={28} />,
      title: t({ en: "BUSINESS CONVERSATION", es: "CONVERSACIÓN DE NEGOCIOS" }),
      sub: "",
      desc: t({
        en: "Real practice for meetings and presentations.",
        es: "Práctica real para reuniones y presentaciones.",
      }),
    },
    {
      icon: <Clock size={28} />,
      title: t({ en: "TOTAL FLEXIBILITY", es: "FLEXIBILIDAD TOTAL" }),
      sub: "",
      desc: t({
        en: "Schedules adapted to your work agenda.",
        es: "Horarios adaptados a tu agenda laboral.",
      }),
    },
    {
      icon: <TrendingUp size={28} />,
      title: t({ en: "FAST RESULTS", es: "RESULTADOS ACELERADOS" }),
      sub: "",
      desc: t({
        en: "Achieve professional fluency in record time.",
        es: "Logra fluidez profesional en tiempo récord.",
      }),
    },
  ];

  return (
    <section className="relative bg-gradient-to-b from-[#5a8a50] via-[#6a9a60] to-[#7aaa70] py-8 md:py-10">
      {/* Subtle top curve to blend from hero */}
      <div className="absolute -top-6 left-0 right-0">
        <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 48L1440 48L1440 0C1200 40 720 48 360 30C180 20 60 10 0 0V48Z" fill="#5a8a50" />
        </svg>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {features.map((f, i) => (
            <div key={i} className="text-center group">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-[#F2B705] group-hover:bg-white/25 transition-colors shadow-lg">
                {f.icon}
              </div>
              <h3 className="font-poppins font-extrabold text-white text-xs sm:text-sm uppercase tracking-wider leading-tight mb-0.5">
                {f.title}
              </h3>
              {f.sub && (
                <span className="text-white/60 text-[10px] font-bold">{f.sub}</span>
              )}
              <p className="text-white/70 text-xs mt-1 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
