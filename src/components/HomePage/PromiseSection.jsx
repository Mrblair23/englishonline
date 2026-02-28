import { ArrowRight, Sparkles } from "lucide-react";

export function PromiseSection({ t }) {
  return (
    <section className="relative bg-gradient-to-br from-[#2d1b69] via-[#4c1d95] to-[#7c3aed] py-20 md:py-28 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-[#e84393]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#f59e0b]/10 rounded-full blur-3xl" />
      <div className="absolute top-20 right-[20%] text-5xl opacity-20 animate-bounce" style={{ animationDuration: '3s' }}>🚀</div>
      <div className="absolute bottom-20 left-[20%] text-5xl opacity-20 animate-bounce" style={{ animationDuration: '4s' }}>💜</div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-6xl mb-6 block">🎉</span>
        <h2 className="font-poppins text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-5 leading-tight">
          {t({
            en: "Ready to Start Your English Adventure?",
            es: "¿Listo para Tu Aventura con el Inglés?",
          })}
        </h2>
        <p className="text-white/60 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl mx-auto">
          {t({
            en: "Book a free 15-minute chat with one of our teachers. No pressure, no sales — just a friendly conversation to see if we're the right fit for you!",
            es: "Reserva un chat gratuito de 15 minutos con uno de nuestros profesores. Sin presión, sin ventas — ¡solo una conversación amigable para ver si somos lo que buscas!",
          })}
        </p>

        <a
          href="/account/signup"
          className="group inline-flex items-center px-10 py-5 bg-gradient-to-r from-[#e84393] to-[#fd79a8] text-white rounded-2xl font-bold text-lg shadow-xl shadow-[#e84393]/30 hover:shadow-2xl hover:scale-105 transition-all"
        >
          <Sparkles size={22} className="mr-2" />
          {t({
            en: "Book My Free Chat!",
            es: "¡Reservar Mi Chat Gratis!",
          })}
          <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={22} />
        </a>

        <p className="text-white/30 text-sm mt-6">
          {t({
            en: "💳 No credit card · 🤝 No commitment · 🌎 English & Spanish available",
            es: "💳 Sin tarjeta · 🤝 Sin compromiso · 🌎 Disponible en inglés y español",
          })}
        </p>
      </div>
    </section>
  );
}
