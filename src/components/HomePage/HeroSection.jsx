import { ArrowRight } from "lucide-react";

export function HeroSection({ t }) {
  return (
    <section className="bg-gradient-to-br from-[#0B1F3B] to-[#123A6F] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Copy */}
          <div className="text-center lg:text-left">
            <p className="text-[#F5B942] font-semibold text-sm uppercase tracking-widest mb-4">
              {t({ en: "Professional English Programs", es: "Programas Profesionales de Inglés" })}
            </p>

            <h1 className="font-poppins text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6">
              {t({
                en: "Speak English with Confidence.",
                es: "Habla Inglés con Confianza.",
              })}
            </h1>

            <p className="text-white/70 text-lg sm:text-xl leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0">
              {t({
                en: "Professional online English programs designed exclusively for adults. Small groups, native instructors, real results.",
                es: "Programas de inglés online profesionales diseñados exclusivamente para adultos. Grupos pequeños, instructores nativos, resultados reales.",
              })}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <a
                href="/account/signup"
                className="group inline-flex items-center justify-center px-8 py-4 bg-[#F5B942] text-[#0B1F3B] rounded-lg font-bold text-base hover:bg-[#f7c95e] transition-colors shadow-lg shadow-[#F5B942]/20 w-full sm:w-auto"
              >
                {t({
                  en: "Take Your Free 5-Minute English Check",
                  es: "Haz Tu Evaluación Gratuita de 5 Minutos",
                })}
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </a>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-6 mt-10 justify-center lg:justify-start">
              {[
                t({ en: "500+ Graduates", es: "500+ Graduados" }),
                t({ en: "4.9 ★ Rating", es: "4.9 ★ Calificación" }),
                t({ en: "Certified Instructors", es: "Instructores Certificados" }),
              ].map((item, i) => (
                <span key={i} className="text-white/50 text-sm font-medium">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Professional meeting photo placeholder */}
          <div className="relative hidden lg:block">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/30 border border-white/10">
              {/* Meeting window chrome */}
              <div className="bg-[#1a1a2e] px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <span className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <span className="text-white/40 text-xs ml-2 font-mono">Be More English Online — Group Session</span>
              </div>

              {/* Video grid placeholder — professional look */}
              <div className="grid grid-cols-2 gap-[2px] bg-[#1a1a2e]">
                {[
                  { initials: "SM", name: "Sarah M.", role: "Instructor", bg: "from-[#1e3a5f] to-[#2c5282]", accent: "#F5B942" },
                  { initials: "JR", name: "Juan R.", role: "Marketing Dir.", bg: "from-[#2d3748] to-[#4a5568]", accent: "#63b3ed" },
                  { initials: "AK", name: "Amina K.", role: "Finance Lead", bg: "from-[#2d3748] to-[#4a5568]", accent: "#68d391" },
                  { initials: "TN", name: "Tomás N.", role: "Engineer", bg: "from-[#2d3748] to-[#4a5568]", accent: "#fc8181" },
                ].map((p, i) => (
                  <div key={i} className={`relative aspect-video bg-gradient-to-br ${p.bg} flex flex-col items-center justify-center p-4`}>
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mb-2"
                      style={{ backgroundColor: p.accent + "22", color: p.accent }}
                    >
                      {p.initials}
                    </div>
                    <p className="text-white text-sm font-semibold">{p.name}</p>
                    <p className="text-white/40 text-xs">{p.role}</p>
                    {i === 0 && (
                      <span className="absolute top-3 left-3 bg-[#F5B942]/20 text-[#F5B942] text-[10px] font-bold px-2 py-0.5 rounded">
                        HOST
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Meeting controls bar */}
              <div className="bg-[#1a1a2e] px-4 py-3 flex items-center justify-center gap-4">
                {["🎤", "📹", "💬", "👥"].map((icon, i) => (
                  <span key={i} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm hover:bg-white/20 cursor-pointer transition-colors">
                    {icon}
                  </span>
                ))}
                <span className="w-10 h-10 rounded-full bg-red-500/80 flex items-center justify-center text-sm cursor-pointer">📞</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
