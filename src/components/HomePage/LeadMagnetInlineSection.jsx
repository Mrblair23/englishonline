import { ArrowRight, CheckCircle } from "lucide-react";

export function LeadMagnetInlineSection({ t }) {
  return (
    <section className="py-16 md:py-24 bg-[#FAF9F7]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#d4eef8] via-[#e8f4fa] to-[#f0f7fb] rounded-3xl p-8 md:p-12 text-center border border-white/60 shadow-lg">
          <h2 className="font-poppins text-2xl sm:text-3xl font-bold text-[#1a3c6e] mb-3">
            {t({
              en: "Ready to Start Speaking English?",
              es: "¿Listo para Empezar a Hablar Inglés?",
            })}
          </h2>
          <p className="text-[#1a3c6e]/70 mb-6 max-w-lg mx-auto">
            {t({
              en: "Take your free level evaluation and discover exactly where you are. No commitment, no credit card.",
              es: "Haz tu evaluación de nivel gratuita y descubre exactamente dónde estás. Sin compromiso, sin tarjeta de crédito.",
            })}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            {[
              t({ en: "15-minute evaluation", es: "Evaluación de 15 minutos" }),
              t({ en: "Personalized feedback", es: "Retroalimentación personalizada" }),
              t({ en: "No credit card", es: "Sin tarjeta de crédito" }),
            ].map((item, i) => (
              <span key={i} className="inline-flex items-center gap-2 text-sm text-[#1a3c6e]/80">
                <CheckCircle size={16} className="text-[#3FA9A6]" /> {item}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="/account/signup"
              className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#F2B705] to-[#f5c642] text-[#1F2A44] rounded-2xl font-bold text-base hover:shadow-xl hover:brightness-105 hover:scale-105 transition-all shadow-lg"
            >
              {t({ en: "Create Free Account", es: "Crear Cuenta Gratis" })}
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </a>
            <a
              href="/pricing"
              className="inline-flex items-center justify-center px-8 py-4 bg-white border-2 border-[#1a3c6e]/20 text-[#1a3c6e] rounded-2xl font-bold text-base hover:bg-[#1a3c6e] hover:text-white transition-all shadow-sm"
            >
              {t({ en: "Book Free Evaluation", es: "Reservar Evaluación Gratis" })}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
