import { Users, Calendar, MessageCircle, Zap } from "lucide-react";

export function HowItWorksSection({ t }) {
  const features = [
    {
      icon: <Users size={28} />,
      title: t({ en: "Small Exclusive Groups", es: "Grupos Pequeños Exclusivos" }),
      desc: t({
        en: "Adults only, in a friendly small group — no crowded classrooms. Maximum 6 students per class for real practice.",
        es: "Solo adultos, en un grupo pequeño y amigable — sin aulas saturadas. Máximo 6 estudiantes por clase para práctica real.",
      }),
      color: "bg-[#3FA9A6]/10 text-[#3FA9A6]",
    },
    {
      icon: <MessageCircle size={28} />,
      title: t({ en: "Focus on Speaking", es: "Enfoque en Conversación" }),
      desc: t({
        en: "Real conversation practice with native teachers. Build confidence speaking English from day one.",
        es: "Práctica de conversación real con profesores nativos. Desarrolla confianza hablando inglés desde el día uno.",
      }),
      color: "bg-[#F2B705]/10 text-[#F2B705]",
    },
    {
      icon: <Calendar size={28} />,
      title: t({ en: "Flexible Schedule", es: "Horario Flexible" }),
      desc: t({
        en: "Choose the schedule that works for you. Morning, afternoon, or evening — we adapt to your life.",
        es: "Elige el horario que mejor te funcione. Mañana, tarde o noche — nos adaptamos a tu vida.",
      }),
      color: "bg-[#6366f1]/10 text-[#6366f1]",
    },
    {
      icon: <Zap size={28} />,
      title: t({ en: "Fast Results", es: "Resultados Rápidos" }),
      desc: t({
        en: "See measurable progress in weeks, not months. Our method is designed for adult learners.",
        es: "Ve progreso medible en semanas, no meses. Nuestro método está diseñado para adultos.",
      }),
      color: "bg-[#ec4899]/10 text-[#ec4899]",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#FAF9F7]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12">
          <span className="inline-block bg-[#F2B705]/10 text-[#F2B705] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">
            {t({ en: "Why Choose Us", es: "¿Por Qué Elegirnos?" })}
          </span>
          <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-[#1F2A44] mb-3">
            {t({
              en: "Everything You Need to Succeed",
              es: "Todo lo que Necesitas para Tener Éxito",
            })}
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            {t({
              en: "Our method is built around what adult learners actually need",
              es: "Nuestro método está diseñado alrededor de lo que los adultos realmente necesitan",
            })}
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-2xl ${f.color} flex items-center justify-center mb-4`}>
                {f.icon}
              </div>
              <h3 className="font-poppins font-bold text-[#1F2A44] mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
