import { ArrowRight, Users, UserPlus, User } from "lucide-react";

export function PricingPreviewSection({ t }) {
  const programs = [
    {
      icon: <Users size={28} />,
      name: t({ en: "Small Group", es: "Grupo Pequeño" }),
      schedule: t({ en: "2x or 3x per week", es: "2 o 3 veces por semana" }),
      desc: t({
        en: "Practice in a focused group of 4–6 professionals. Build fluency through structured conversation and real scenarios.",
        es: "Practica en un grupo enfocado de 4–6 profesionales. Desarrolla fluidez a través de conversación estructurada y escenarios reales.",
      }),
      features: [
        t({ en: "4–6 students per class", es: "4–6 estudiantes por clase" }),
        t({ en: "50-minute sessions", es: "Sesiones de 50 minutos" }),
        t({ en: "Native instructor", es: "Instructor nativo" }),
      ],
      popular: true,
    },
    {
      icon: <UserPlus size={28} />,
      name: t({ en: "Duo", es: "Dúo" }),
      schedule: t({ en: "Flexible scheduling", es: "Horario flexible" }),
      desc: t({
        en: "Study with a partner. More personalized attention while keeping costs accessible. Ideal for colleagues or friends.",
        es: "Estudia con un compañero. Más atención personalizada manteniendo costos accesibles. Ideal para colegas o amigos.",
      }),
      features: [
        t({ en: "2 students per class", es: "2 estudiantes por clase" }),
        t({ en: "50-minute sessions", es: "Sesiones de 50 minutos" }),
        t({ en: "Custom curriculum", es: "Currículo personalizado" }),
      ],
      popular: false,
    },
    {
      icon: <User size={28} />,
      name: t({ en: "1-to-1", es: "1 a 1" }),
      schedule: t({ en: "Your schedule", es: "Tu horario" }),
      desc: t({
        en: "Maximum results, maximum flexibility. Every session is tailored to your specific goals, pace, and industry.",
        es: "Máximos resultados, máxima flexibilidad. Cada sesión está adaptada a tus metas específicas, ritmo e industria.",
      }),
      features: [
        t({ en: "Private sessions", es: "Sesiones privadas" }),
        t({ en: "Fully customized", es: "Totalmente personalizado" }),
        t({ en: "Priority scheduling", es: "Horario prioritario" }),
      ],
      popular: false,
    },
  ];

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="text-center mb-16">
          <p className="text-[#F5B942] font-semibold text-sm uppercase tracking-widest mb-3">
            {t({ en: "Programs", es: "Programas" })}
          </p>
          <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-[#0B1F3B] mb-4">
            {t({
              en: "Choose the Format That Fits Your Life",
              es: "Elige el Formato Que Se Adapta a Tu Vida",
            })}
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            {t({
              en: "Every program includes certified native instructors, progress tracking, and access to our resource library.",
              es: "Cada programa incluye instructores nativos certificados, seguimiento de progreso y acceso a nuestra biblioteca de recursos.",
            })}
          </p>
        </div>

        {/* Program cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {programs.map((p, i) => (
            <div
              key={i}
              className={`rounded-2xl p-8 border transition-shadow hover:shadow-lg ${
                p.popular
                  ? "border-[#F5B942] shadow-md bg-white ring-1 ring-[#F5B942]/20"
                  : "border-gray-100 bg-white shadow-sm"
              }`}
            >
              {p.popular && (
                <span className="inline-block bg-[#F5B942] text-[#0B1F3B] text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
                  {t({ en: "Most Popular", es: "Más Popular" })}
                </span>
              )}
              <div className="w-12 h-12 rounded-xl bg-[#0B1F3B]/5 flex items-center justify-center text-[#123A6F] mb-4">
                {p.icon}
              </div>
              <h3 className="font-poppins font-bold text-[#0B1F3B] text-xl mb-1">{p.name}</h3>
              <p className="text-[#F5B942] text-sm font-semibold mb-3">{p.schedule}</p>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">{p.desc}</p>

              <ul className="space-y-2 mb-8">
                {p.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#123A6F] shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="/pricing"
                className={`block text-center py-3 rounded-lg font-semibold text-sm transition-colors ${
                  p.popular
                    ? "bg-[#F5B942] text-[#0B1F3B] hover:bg-[#f7c95e]"
                    : "bg-[#0B1F3B] text-white hover:bg-[#123A6F]"
                }`}
              >
                {t({ en: "Learn More", es: "Más Información" })}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
