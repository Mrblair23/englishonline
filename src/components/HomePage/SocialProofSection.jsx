import { Star, Quote } from "lucide-react";

export function SocialProofSection({ t }) {
  const testimonials = [
    {
      name: "Maria R.",
      role: t({ en: "Marketing Manager", es: "Gerente de Marketing" }),
      text: t({
        en: "After a free evaluation, I knew exactly what level I was at. The personalized attention in small groups made all the difference. Now I lead meetings in English!",
        es: "Después de mi evaluación gratuita, supe exactamente mi nivel. La atención personalizada en grupos pequeños hizo toda la diferencia. ¡Ahora lidero reuniones en inglés!",
      }),
      stars: 5,
      avatar: "👩‍💼",
      gradient: "from-[#fce4b8] to-[#f0d4a0]",
    },
    {
      name: "Carlos M.",
      role: t({ en: "Software Engineer", es: "Ingeniero de Software" }),
      text: t({
        en: "I'm having real conversations in English at work now. The flexible schedule fits my busy life, and the teachers are amazing. Best investment in myself!",
        es: "Ahora tengo conversaciones reales en inglés en el trabajo. El horario flexible se adapta a mi vida ocupada, ¡y los profesores son increíbles!",
      }),
      stars: 5,
      avatar: "��‍💻",
      gradient: "from-[#b8dce8] to-[#98c4d4]",
    },
    {
      name: "Ana L.",
      role: t({ en: "University Student", es: "Estudiante Universitaria" }),
      text: t({
        en: "I went from barely understanding English to passing my TOEFL with confidence. The small group format helped me practice speaking every single class.",
        es: "Pasé de apenas entender inglés a aprobar mi TOEFL con confianza. El formato de grupos pequeños me ayudó a practicar conversación en cada clase.",
      }),
      stars: 5,
      avatar: "👩‍��",
      gradient: "from-[#d8c0e8] to-[#c0a8d4]",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12">
          <span className="inline-block bg-[#3FA9A6]/10 text-[#3FA9A6] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">
            {t({ en: "Testimonials", es: "Testimonios" })}
          </span>
          <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-[#1F2A44] mb-3">
            {t({
              en: "What Our Students Say",
              es: "Lo que Dicen Nuestros Estudiantes",
            })}
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            {t({
              en: "Join hundreds of students who improved their English with us",
              es: "Únete a cientos de estudiantes que mejoraron su inglés con nosotros",
            })}
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((tm, i) => (
            <div
              key={i}
              className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-md hover:shadow-xl transition-shadow"
            >
              <Quote size={28} className="text-[#3FA9A6]/20 mb-3" />
              <p className="text-gray-600 text-sm leading-relaxed mb-5 italic">
                "{tm.text}"
              </p>

              <div className="flex items-center gap-3 mt-auto">
                <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${tm.gradient} flex items-center justify-center text-xl`}>
                  {tm.avatar}
                </div>
                <div>
                  <p className="font-bold text-[#1F2A44] text-sm">{tm.name}</p>
                  <p className="text-gray-400 text-xs">{tm.role}</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {Array.from({ length: tm.stars }).map((_, j) => (
                    <Star key={j} size={14} className="fill-[#F2B705] text-[#F2B705]" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
