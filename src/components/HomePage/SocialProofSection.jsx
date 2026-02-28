import { Star, MessageCircle } from "lucide-react";

export function SocialProofSection({ t }) {
  const testimonials = [
    {
      name: "María",
      text: t({
        en: "I took the evaluation and was surprised by my level!",
        es: "¡Hice la evaluación y me sorprendí de mi nivel!",
      }),
      emoji: "👩‍💼",
    },
    {
      name: "Carlos",
      text: t({
        en: "I took the evaluation and was surprised by my level!",
        es: "¡Hice la evaluación y me sorprendí de mi nivel!",
      }),
      emoji: "👨‍💻",
    },
  ];

  return (
    <section className="relative bg-gradient-to-b from-[#7aaa70] to-[#8ab880] py-6 md:py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
          {/* Testimonial bubbles */}
          {testimonials.map((tm, i) => (
            <div key={i} className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-md border border-white/10 max-w-xs">
              <div className="shrink-0 w-10 h-10 rounded-full bg-white/30 flex items-center justify-center text-xl">
                {tm.emoji}
              </div>
              <div>
                <p className="text-white text-xs leading-snug font-medium italic">
                  "{tm.text}"
                </p>
                <p className="text-white/70 text-[10px] font-bold mt-0.5">— {tm.name}</p>
              </div>
            </div>
          ))}

          {/* Instant evaluation badge */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-[#F2B705] to-[#f5c642] rounded-2xl px-5 py-3 shadow-lg">
            <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center">
              <Star size={20} className="text-white fill-white" />
            </div>
            <div>
              <p className="font-extrabold text-[#1F2A44] text-xs uppercase tracking-wide leading-tight">
                {t({
                  en: "FREE EVALUATION INSTANTLY",
                  es: "EVALUACIÓN GRATUITA AL INSTANTE",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
