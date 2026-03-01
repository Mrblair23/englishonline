import { ArrowRight, Sparkles, Star, Heart } from "lucide-react";

export function HeroSection({ t }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#fef3e2] via-[#fce8d5] to-[#f5d5e0] min-h-[92vh] flex items-center">
      {/* Floating decorative blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-[#a7d7f9]/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#f9c6d3]/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-[#c3f0ca]/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

      {/* Floating doodles */}
      <div className="absolute top-20 right-[15%] text-5xl animate-bounce" style={{ animationDuration: '3s' }}>💬</div>
      <div className="absolute top-[30%] left-[8%] text-4xl animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }}>✨</div>
      <div className="absolute bottom-[25%] right-[8%] text-4xl animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '1s' }}>📚</div>
      <div className="absolute bottom-[15%] left-[15%] text-3xl animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '1.5s' }}>🎯</div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">

          {/* Left: Copy */}
          <div className="text-center lg:text-left">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-5 py-2 shadow-md border border-white/60 mb-6">
              <Sparkles size={16} className="text-[#f59e0b]" />
              <span className="text-sm font-bold text-[#7c3aed] tracking-wide">
                {t({ en: "Learn English the Fun Way!", es: "¡Aprende Inglés de Forma Divertida!" })}
              </span>
              <Sparkles size={16} className="text-[#f59e0b]" />
            </div>

            <h1 className="font-poppins text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] mb-5">
              <span className="text-[#2d1b69]">
                {t({ en: "Speak", es: "Habla" })}
              </span>
              <br />
              <span className="text-[#e84393]">
                {t({ en: "English", es: "Inglés" })}
              </span>
              <br />
              <span className="text-[#2d1b69]">
                {t({ en: "Like a ", es: "Como un " })}
              </span>
              <span className="relative inline-block">
                <span className="text-[#f59e0b]">{t({ en: "Pro", es: "Pro" })}</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 12" fill="none">
                  <path d="M2 8 Q 25 2, 50 6 Q 75 10, 98 4" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" fill="none" />
                </svg>
              </span>
              {" 🎉"}
            </h1>

            <p className="text-lg sm:text-xl text-[#5a4a7a] leading-relaxed mb-8 max-w-md mx-auto lg:mx-0">
              {t({
                en: "Join our cozy online community of adult learners. Small groups, amazing teachers, and a whole lot of fun.",
                es: "Únete a nuestra acogedora comunidad online de adultos. Grupos pequeños, profesores increíbles y mucha diversión.",
              })}
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start mb-8">
              <a
                href="/account/signup"
                className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#e84393] to-[#fd79a8] text-white rounded-2xl font-bold text-base shadow-lg shadow-[#e84393]/25 hover:shadow-xl hover:scale-105 transition-all w-full sm:w-auto"
              >
                {t({ en: "Start Free — It's Fun! 🚀", es: "¡Empieza Gratis! 🚀" })}
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </a>
              <a
                href="/account/signin"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-[#e84393]/20 text-[#2d1b69] rounded-2xl font-bold text-base hover:bg-white hover:shadow-md transition-all w-full sm:w-auto"
              >
                {t({ en: "I Have an Account", es: "Ya Tengo Cuenta" })}
              </a>
            </div>

            {/* Social proof bubbles */}
            <div className="flex flex-wrap items-center gap-3 justify-center lg:justify-start">
              {[
                { emoji: "⭐", text: t({ en: "4.9 Rating", es: "4.9 Calificación" }) },
                { emoji: "👥", text: t({ en: "500+ Students", es: "500+ Estudiantes" }) },
                { emoji: "💜", text: t({ en: "Loved by Adults", es: "Amado por Adultos" }) },
              ].map((b, i) => (
                <span key={i} className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-bold text-[#5a4a7a] border border-white/50 shadow-sm">
                  <span>{b.emoji}</span> {b.text}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Cozy illustration — video call with cartoon characters */}
          <div className="relative flex items-center justify-center">
            {/* Main card */}
            <div className="relative bg-white rounded-[2rem] shadow-2xl border-4 border-[#b2dfdb] p-3 max-w-sm mx-auto lg:max-w-md w-full">
              {/* Window bar */}
              <div className="bg-gradient-to-r from-[#0d9488] to-[#14b8a6] rounded-t-2xl px-4 py-2.5 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#fca5a5]" />
                  <span className="w-3 h-3 rounded-full bg-[#fde68a]" />
                  <span className="w-3 h-3 rounded-full bg-[#86efac]" />
                </div>
                <span className="text-white font-bold text-sm ml-2 tracking-wider">BE MORE</span>
                <div className="ml-auto flex items-center gap-2">
                  <span className="bg-white/20 rounded-lg px-2 py-0.5 text-white text-xs font-bold">LIVE 🔴</span>
                  <svg className="w-5 h-5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                </div>
              </div>

              {/* 2x2 participant grid — cartoon avatars */}
              <div className="grid grid-cols-2 gap-2 p-2">
                {[
                  { name: "Sarah", country: "USA", role: t({ en: "Teacher", es: "Profesora" }), bg: "from-[#ffecd2] to-[#fcb69f]", seed: "Aneka" },
                  { name: "Carlos", country: "México", role: t({ en: "Student", es: "Estudiante" }), bg: "from-[#a1c4fd] to-[#c2e9fb]", seed: "Felix" },
                  { name: "Yuki", country: "Japan", role: t({ en: "Student", es: "Estudiante" }), bg: "from-[#d4fc79] to-[#96e6a1]", seed: "Brooklynn" },
                  { name: "Ahmed", country: "Egypt", role: t({ en: "Student", es: "Estudiante" }), bg: "from-[#fbc2eb] to-[#a6c1ee]", seed: "Leo" },
                ].map((p, i) => (
                  <div key={i} className={`relative rounded-2xl bg-gradient-to-br ${p.bg} p-2 flex flex-col items-center justify-center aspect-square overflow-hidden`}>
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.seed}&backgroundColor=transparent`}
                      alt={p.name}
                      className="w-[70%] h-auto mb-0.5 drop-shadow-lg"
                      loading="lazy"
                    />
                    <div className="bg-black/40 backdrop-blur-sm rounded-lg px-2 py-0.5 text-center">
                      <p className="text-[10px] font-bold text-white leading-tight">{p.name} ({p.country})</p>
                    </div>
                    {i === 0 && (
                      <span className="absolute top-1.5 left-1.5 bg-[#f59e0b] text-white text-[7px] font-black px-1.5 py-0.5 rounded-full shadow">HOST</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Chat bubble */}
              <div className="mx-2 mb-2 bg-[#e6fffa] rounded-2xl px-4 py-2.5 border border-[#b2dfdb]">
                <p className="text-xs text-[#2d6b63]">
                  <span className="font-bold">Sarah:</span>{" "}
                  {t({
                    en: "Great job everyone! Your pronunciation is getting so much better! 🎉",
                    es: "¡Excelente trabajo! ¡Su pronunciación está mejorando mucho! 🎉",
                  })}
                </p>
              </div>
            </div>

            {/* Floating stickers around the card */}
            <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg px-3 py-2 border-2 border-[#fde68a] rotate-6">
              <span className="text-sm font-black text-[#f59e0b]">A+ 🌟</span>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg px-3 py-2 border-2 border-[#86efac] -rotate-6">
              <span className="text-sm font-black text-[#10b981]">Level Up! 🚀</span>
            </div>
            <div className="absolute top-1/2 -right-6 bg-white rounded-full shadow-lg w-10 h-10 flex items-center justify-center border-2 border-[#fca5a5] animate-bounce" style={{ animationDuration: '2s' }}>
              <Heart size={18} className="text-[#e84393] fill-[#e84393]" />
            </div>
          </div>
        </div>
      </div>

      {/* Wavy bottom divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 60 C 200 20, 400 80, 600 50 C 800 20, 1000 80, 1200 50 C 1350 30, 1400 40, 1440 35 L1440 100 L0 100Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
