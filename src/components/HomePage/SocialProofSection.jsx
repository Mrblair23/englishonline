import { ArrowRight, Clock, CheckCircle, Zap } from "lucide-react";

export function SocialProofSection({ t }) {
  return (
    <section className="bg-[#f8f9fb] py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: info */}
          <div>
            <p className="text-[#F5B942] font-semibold text-sm uppercase tracking-widest mb-3">
              {t({ en: "Free Assessment", es: "Evaluación Gratuita" })}
            </p>
            <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-[#0B1F3B] mb-4">
              {t({
                en: "Know Your Level in 5 Minutes",
                es: "Conoce Tu Nivel en 5 Minutos",
              })}
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-8">
              {t({
                en: "Our quick automated assessment evaluates your speaking, listening, and comprehension skills. Get your personalized results instantly — no commitment required.",
                es: "Nuestra evaluación rápida automatizada evalúa tus habilidades de habla, escucha y comprensión. Obtén tus resultados personalizados al instante — sin compromiso.",
              })}
            </p>

            <ul className="space-y-4 mb-10">
              {[
                { icon: <Clock size={20} />, text: t({ en: "Takes less than 5 minutes", es: "Toma menos de 5 minutos" }) },
                { icon: <Zap size={20} />, text: t({ en: "Instant personalized results", es: "Resultados personalizados al instante" }) },
                { icon: <CheckCircle size={20} />, text: t({ en: "No credit card or commitment", es: "Sin tarjeta de crédito ni compromiso" }) },
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="w-10 h-10 shrink-0 rounded-lg bg-[#123A6F]/10 flex items-center justify-center text-[#123A6F]">
                    {item.icon}
                  </span>
                  <span className="text-[#0B1F3B] font-medium">{item.text}</span>
                </li>
              ))}
            </ul>

            <a
              href="/account/signup"
              className="group inline-flex items-center px-8 py-4 bg-[#F5B942] text-[#0B1F3B] rounded-lg font-bold text-base hover:bg-[#f7c95e] transition-colors shadow-lg shadow-[#F5B942]/20"
            >
              {t({ en: "Start Free Assessment", es: "Comenzar Evaluación Gratuita" })}
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </a>
          </div>

          {/* Right: visual indicator of the test */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="space-y-6">
              {/* Progress mockup */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-[#0B1F3B]">{t({ en: "Speaking", es: "Conversación" })}</span>
                  <span className="text-sm font-bold text-[#123A6F]">B2</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full w-[75%] bg-gradient-to-r from-[#123A6F] to-[#2563eb] rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-[#0B1F3B]">{t({ en: "Listening", es: "Comprensión Auditiva" })}</span>
                  <span className="text-sm font-bold text-[#123A6F]">B1</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full w-[60%] bg-gradient-to-r from-[#123A6F] to-[#2563eb] rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-[#0B1F3B]">{t({ en: "Vocabulary", es: "Vocabulario" })}</span>
                  <span className="text-sm font-bold text-[#123A6F]">B2</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full w-[70%] bg-gradient-to-r from-[#123A6F] to-[#2563eb] rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-[#0B1F3B]">{t({ en: "Grammar", es: "Gramática" })}</span>
                  <span className="text-sm font-bold text-[#123A6F]">A2</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full w-[45%] bg-gradient-to-r from-[#123A6F] to-[#2563eb] rounded-full" />
                </div>
              </div>

              {/* Result summary */}
              <div className="border-t border-gray-100 pt-6 text-center">
                <p className="text-sm text-gray-400 mb-1">{t({ en: "Your Estimated Level", es: "Tu Nivel Estimado" })}</p>
                <p className="text-4xl font-bold text-[#0B1F3B] font-poppins">B1+</p>
                <p className="text-sm text-gray-400 mt-1">{t({ en: "Upper Intermediate", es: "Intermedio Superior" })}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
