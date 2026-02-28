export function HowItWorksSection({ t }) {
  const cards = [
    {
      emoji: "🏠",
      bg: "from-[#ffecd2] to-[#fcb69f]",
      border: "border-[#fcb69f]",
      title: t({ en: "Small & Cozy Groups", es: "Grupos Pequeños y Acogedores" }),
      desc: t({
        en: "Just 4–6 adults per class. Everyone gets to speak, laugh, and grow together. It feels like learning with friends!",
        es: "Solo 4–6 adultos por clase. Todos hablan, ríen y crecen juntos. ¡Se siente como aprender con amigos!",
      }),
    },
    {
      emoji: "🎯",
      bg: "from-[#a1c4fd] to-[#c2e9fb]",
      border: "border-[#a1c4fd]",
      title: t({ en: "Real Conversations", es: "Conversaciones Reales" }),
      desc: t({
        en: "No boring textbooks. We practice real scenarios — work meetings, travel, daily life. Stuff you actually need!",
        es: "Sin libros aburridos. Practicamos escenarios reales — reuniones, viajes, vida diaria. ¡Cosas que realmente necesitas!",
      }),
    },
    {
      emoji: "📈",
      bg: "from-[#d4fc79] to-[#96e6a1]",
      border: "border-[#96e6a1]",
      title: t({ en: "See Your Progress", es: "Ve Tu Progreso" }),
      desc: t({
        en: "Track your improvement with fun milestones. Watch yourself go from 'umm...' to 'let me explain!' 💪",
        es: "Sigue tu mejora con hitos divertidos. Mírate pasar de 'umm...' a '¡déjame explicar!' 💪",
      }),
    },
    {
      emoji: "🌍",
      bg: "from-[#fbc2eb] to-[#a6c1ee]",
      border: "border-[#fbc2eb]",
      title: t({ en: "Native Teachers", es: "Profesores Nativos" }),
      desc: t({
        en: "Our teachers aren't just qualified — they're friendly, patient, and genuinely excited to help you succeed.",
        es: "Nuestros profesores no solo están calificados — son amigables, pacientes y realmente emocionados de ayudarte.",
      }),
    },
  ];

  return (
    <section className="bg-white py-20 md:py-28 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-14">
          <span className="text-4xl mb-4 block">🤔</span>
          <h2 className="font-poppins text-3xl sm:text-4xl font-black text-[#2d1b69] mb-3">
            {t({
              en: "Why You'll Love Learning Here",
              es: "Por Qué Te Encantará Aprender Aquí",
            })}
          </h2>
          <p className="text-[#5a4a7a] text-lg max-w-xl mx-auto">
            {t({
              en: "We made English learning feel like hanging out — not homework.",
              es: "Hicimos que aprender inglés se sienta como pasarla bien — no como tarea.",
            })}
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {cards.map((c, i) => (
            <div
              key={i}
              className={`rounded-3xl bg-gradient-to-br ${c.bg} p-7 border-2 ${c.border} hover:scale-[1.02] hover:shadow-xl transition-all duration-300 cursor-default`}
            >
              <span className="text-4xl mb-4 block">{c.emoji}</span>
              <h3 className="font-poppins font-bold text-[#2d1b69] text-xl mb-2">{c.title}</h3>
              <p className="text-[#4a3a6a] leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
