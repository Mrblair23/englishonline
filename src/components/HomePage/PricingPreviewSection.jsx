export function PricingPreviewSection({ t }) {
  const programs = [
    {
      emoji: "👥",
      name: t({ en: "Small Group", es: "Grupo Pequeño" }),
      schedule: t({ en: "2x or 3x per week", es: "2 o 3 veces por semana" }),
      desc: t({
        en: "Learn with 4–6 new friends. Lots of speaking, lots of laughing, lots of progress!",
        es: "Aprende con 4–6 nuevos amigos. ¡Mucha conversación, muchas risas, mucho progreso!",
      }),
      tags: [
        t({ en: "4–6 students", es: "4–6 estudiantes" }),
        t({ en: "50 min", es: "50 min" }),
        t({ en: "Native teacher", es: "Profesor nativo" }),
      ],
      bg: "from-[#ffecd2] to-[#fcb69f]",
      border: "border-[#fcb69f]",
      badge: "�� " + t({ en: "Most Popular", es: "Más Popular" }),
    },
    {
      emoji: "👫",
      name: t({ en: "Duo", es: "Dúo" }),
      schedule: t({ en: "Flexible days", es: "Días flexibles" }),
      desc: t({
        en: "Grab a friend or colleague! Semi-private sessions with maximum attention and custom content.",
        es: "¡Trae a un amigo o colega! Sesiones semi-privadas con máxima atención y contenido personalizado.",
      }),
      tags: [
        t({ en: "2 students", es: "2 estudiantes" }),
        t({ en: "50 min", es: "50 min" }),
        t({ en: "Custom plan", es: "Plan personalizado" }),
      ],
      bg: "from-[#a1c4fd] to-[#c2e9fb]",
      border: "border-[#a1c4fd]",
      badge: null,
    },
    {
      emoji: "🌟",
      name: t({ en: "1-to-1", es: "1 a 1" }),
      schedule: t({ en: "Your schedule", es: "Tu horario" }),
      desc: t({
        en: "All eyes on you! 100% personalized sessions tailored to your goals, pace, and industry.",
        es: "¡Toda la atención para ti! Sesiones 100% personalizadas a tus metas, ritmo e industria.",
      }),
      tags: [
        t({ en: "Private", es: "Privado" }),
        t({ en: "Fully custom", es: "100% a tu medida" }),
        t({ en: "Priority booking", es: "Reserva prioritaria" }),
      ],
      bg: "from-[#fbc2eb] to-[#a6c1ee]",
      border: "border-[#fbc2eb]",
      badge: null,
    },
  ];

  return (
    <section className="bg-white py-20 md:py-28 relative overflow-hidden">
      {/* Floating decorations */}
      <div className="absolute top-10 right-10 text-4xl opacity-30 animate-bounce" style={{ animationDuration: '4s' }}>🎈</div>
      <div className="absolute bottom-10 left-10 text-4xl opacity-30 animate-bounce" style={{ animationDuration: '3.5s' }}>🌈</div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-4xl mb-4 block">🎓</span>
          <h2 className="font-poppins text-3xl sm:text-4xl font-black text-[#2d1b69] mb-3">
            {t({
              en: "Pick Your Perfect Program",
              es: "Elige Tu Programa Perfecto",
            })}
          </h2>
          <p className="text-[#5a4a7a] text-lg max-w-xl mx-auto">
            {t({
              en: "Whatever your style, we've got the right fit. All programs include native teachers & progress tracking.",
              es: "Sea cual sea tu estilo, tenemos la opción perfecta. Todos los programas incluyen profesores nativos y seguimiento.",
            })}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {programs.map((p, i) => (
            <div
              key={i}
              className={`rounded-3xl bg-gradient-to-br ${p.bg} p-6 border-2 ${p.border} hover:scale-[1.02] hover:shadow-xl transition-all duration-300 flex flex-col`}
            >
              {p.badge && (
                <span className="self-start bg-white/80 backdrop-blur-sm text-[#e84393] text-xs font-black px-3 py-1 rounded-full mb-3 shadow-sm">
                  {p.badge}
                </span>
              )}
              <span className="text-5xl mb-3">{p.emoji}</span>
              <h3 className="font-poppins font-black text-[#2d1b69] text-2xl mb-1">{p.name}</h3>
              <p className="text-[#7c3aed] text-sm font-bold mb-3">{p.schedule}</p>
              <p className="text-[#4a3a6a] text-sm leading-relaxed mb-5 flex-1">{p.desc}</p>

              <div className="flex flex-wrap gap-2 mb-5">
                {p.tags.map((tag, j) => (
                  <span key={j} className="bg-white/60 text-[#2d1b69] text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                    {tag}
                  </span>
                ))}
              </div>

              <a
                href="/pricing"
                className="block text-center py-3 bg-white/80 backdrop-blur-sm rounded-2xl font-bold text-sm text-[#2d1b69] hover:bg-white hover:shadow-md transition-all border border-white/60"
              >
                {t({ en: "See Details ✨", es: "Ver Detalles ✨" })}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
