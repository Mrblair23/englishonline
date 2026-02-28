import { ArrowRight } from "lucide-react";

export function SocialProofSection({ t }) {
  return (
    <section className="relative bg-gradient-to-br from-[#f0ebff] via-[#e8e0ff] to-[#f5f0ff] py-20 md:py-28 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#fbc2eb]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#a1c4fd]/20 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Fun level-test visual */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-[#e8dff5]">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">🧪</span>
              <div>
                <h3 className="font-poppins font-bold text-[#2d1b69] text-lg">{t({ en: "Your English Check", es: "Tu Evaluación de Inglés" })}</h3>
                <p className="text-[#5a4a7a] text-xs">{t({ en: "5 minutes · Instant results · 100% free", es: "5 minutos · Resultados al instante · 100% gratis" })}</p>
              </div>
            </div>

            {/* Skill bars with fun labels */}
            {[
              { skill: t({ en: "Speaking", es: "Conversación" }), emoji: "🗣️", level: "B2", pct: "w-[75%]", color: "from-[#e84393] to-[#fd79a8]" },
              { skill: t({ en: "Listening", es: "Escucha" }), emoji: "👂", level: "B1", pct: "w-[60%]", color: "from-[#a78bfa] to-[#c084fc]" },
              { skill: t({ en: "Vocabulary", es: "Vocabulario" }), emoji: "📖", level: "B2", pct: "w-[70%]", color: "from-[#f59e0b] to-[#fbbf24]" },
              { skill: t({ en: "Grammar", es: "Gramática" }), emoji: "✏️", level: "A2", pct: "w-[45%]", color: "from-[#10b981] to-[#34d399]" },
            ].map((s, i) => (
              <div key={i} className="mb-4 last:mb-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-bold text-[#2d1b69] flex items-center gap-1.5">{s.emoji} {s.skill}</span>
                  <span className="text-xs font-black text-white bg-[#7c3aed] px-2 py-0.5 rounded-full">{s.level}</span>
                </div>
                <div className="h-4 bg-[#f0ebff] rounded-full overflow-hidden">
                  <div className={`h-full ${s.pct} bg-gradient-to-r ${s.color} rounded-full`} />
                </div>
              </div>
            ))}

            {/* Result */}
            <div className="mt-6 bg-gradient-to-r from-[#fef3e2] to-[#fce8d5] rounded-2xl p-4 text-center border border-[#fde68a]">
              <p className="text-xs text-[#5a4a7a] font-semibold mb-1">{t({ en: "Your Level", es: "Tu Nivel" })}</p>
              <p className="text-3xl font-black text-[#2d1b69] font-poppins">B1+ 🎉</p>
              <p className="text-xs text-[#5a4a7a]">{t({ en: "Upper Intermediate — Almost there!", es: "Intermedio Superior — ¡Casi lo logras!" })}</p>
            </div>
          </div>

          {/* Right: Copy */}
          <div className="text-center lg:text-left">
            <span className="text-5xl mb-4 block">✨</span>
            <h2 className="font-poppins text-3xl sm:text-4xl font-black text-[#2d1b69] mb-4">
              {t({
                en: "Find Your Level in 5 Fun Minutes",
                es: "Descubre Tu Nivel en 5 Minutos Divertidos",
              })}
            </h2>
            <p className="text-[#5a4a7a] text-lg leading-relaxed mb-6">
              {t({
                en: "Take our quick, friendly assessment and discover exactly where your English stands. It's like a personality quiz — but for your language skills!",
                es: "Haz nuestra evaluación rápida y amigable y descubre exactamente dónde está tu inglés. ¡Es como un quiz de personalidad — pero para tus habilidades!",
              })}
            </p>

            <div className="space-y-3 mb-8">
              {[
                { emoji: "⏱️", text: t({ en: "Less than 5 minutes", es: "Menos de 5 minutos" }) },
                { emoji: "🎁", text: t({ en: "Completely free, no catch", es: "Completamente gratis, sin trampa" }) },
                { emoji: "📊", text: t({ en: "Personalized results & tips", es: "Resultados y tips personalizados" }) },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/80 rounded-2xl px-4 py-3 shadow-sm border border-white">
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="text-[#2d1b69] font-semibold">{item.text}</span>
                </div>
              ))}
            </div>

            <a
              href="/account/signup"
              className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] text-white rounded-2xl font-bold text-base shadow-lg shadow-[#7c3aed]/25 hover:shadow-xl hover:scale-105 transition-all"
            >
              {t({ en: "Take the Quiz! 🧪", es: "¡Haz el Quiz! 🧪" })}
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
