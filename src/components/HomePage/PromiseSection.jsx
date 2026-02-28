import { ArrowRight } from "lucide-react";

export function PromiseSection({ t }) {
  return (
    <section className="bg-gradient-to-br from-[#0B1F3B] to-[#123A6F] py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-poppins text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
          {t({
            en: "Ready to Transform Your English?",
            es: "¿Listo para Transformar Tu Inglés?",
          })}
        </h2>
        <p className="text-white/60 text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
          {t({
            en: "Book a free 15-minute speaking evaluation with one of our instructors. No sales pitch — just an honest assessment of where you are and how we can help.",
            es: "Reserva una evaluación de conversación gratuita de 15 minutos con uno de nuestros instructores. Sin presión de venta — solo una evaluación honesta de dónde estás y cómo podemos ayudarte.",
          })}
        </p>

        <a
          href="/account/signup"
          className="group inline-flex items-center px-10 py-5 bg-[#F5B942] text-[#0B1F3B] rounded-lg font-bold text-lg hover:bg-[#f7c95e] transition-colors shadow-lg shadow-[#F5B942]/20"
        >
          {t({
            en: "Book Your Free 15-Minute Evaluation",
            es: "Reserva Tu Evaluación Gratuita de 15 Minutos",
          })}
          <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" size={22} />
        </a>

        <p className="text-white/30 text-sm mt-6">
          {t({
            en: "No credit card required · No commitment · Available in English & Spanish",
            es: "Sin tarjeta de crédito · Sin compromiso · Disponible en inglés y español",
          })}
        </p>
      </div>
    </section>
  );
}
