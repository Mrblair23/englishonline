import { Users, Target, BarChart3 } from "lucide-react";

export function HowItWorksSection({ t }) {
  const reasons = [
    {
      icon: <Users size={32} />,
      title: t({ en: "Small Groups, Big Results", es: "Grupos Pequeños, Grandes Resultados" }),
      desc: t({
        en: "Maximum 6 adults per class. You speak more, learn faster, and build real confidence in every session.",
        es: "Máximo 6 adultos por clase. Hablas más, aprendes más rápido y construyes confianza real en cada sesión.",
      }),
    },
    {
      icon: <Target size={32} />,
      title: t({ en: "Business-Focused Method", es: "Método Enfocado en Negocios" }),
      desc: t({
        en: "Our curriculum targets meetings, presentations, interviews, and workplace conversations — not textbook grammar.",
        es: "Nuestro plan se enfoca en reuniones, presentaciones, entrevistas y conversaciones laborales — no gramática de libro.",
      }),
    },
    {
      icon: <BarChart3 size={32} />,
      title: t({ en: "Measurable Progress", es: "Progreso Medible" }),
      desc: t({
        en: "Track your fluency with monthly assessments. See exactly how much you've improved, with data to prove it.",
        es: "Mide tu fluidez con evaluaciones mensuales. Ve exactamente cuánto has mejorado, con datos que lo prueban.",
      }),
    },
  ];

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="text-center mb-16">
          <p className="text-[#F5B942] font-semibold text-sm uppercase tracking-widest mb-3">
            {t({ en: "Why Choose Us", es: "Por Qué Elegirnos" })}
          </p>
          <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-[#0B1F3B] mb-4">
            {t({
              en: "Built for Professionals Like You",
              es: "Diseñado para Profesionales Como Tú",
            })}
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            {t({
              en: "We understand the demands of a professional schedule. That's why every aspect of our program is designed for efficiency and results.",
              es: "Entendemos las demandas de una agenda profesional. Por eso cada aspecto de nuestro programa está diseñado para eficiencia y resultados.",
            })}
          </p>
        </div>

        {/* 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {reasons.map((r, i) => (
            <div key={i} className="text-center">
              <div className="w-16 h-16 mx-auto mb-5 rounded-xl bg-[#0B1F3B]/5 flex items-center justify-center text-[#123A6F]">
                {r.icon}
              </div>
              <h3 className="font-poppins font-bold text-[#0B1F3B] text-lg mb-3">{r.title}</h3>
              <p className="text-gray-500 leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
