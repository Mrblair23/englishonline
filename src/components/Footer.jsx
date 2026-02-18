import { useLanguage } from "@/utils/useLanguage";

export default function Footer() {
  const { language } = useLanguage();
  const t = (translations) => translations[language] || translations.en;

  return (
    <footer className="bm-page-bg border-t border-gray-200/50 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#1F2A44] to-[#2B3448] rounded-xl flex items-center justify-center shadow-md">
                <span className="text-[#F2B705] font-bold text-xl">E</span>
              </div>
              <span className="text-[#1F2A44] font-semibold text-xl">
                Be More English Online
              </span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Premium English education for ambitious learners. Master the
              language with expert guidance and a modern approach.
            </p>
          </div>

          <div>
            <h4 className="font-poppins font-semibold text-[#1F2A44] mb-4 leading-tight">
              {t({ en: "Academy", es: "Academia" })}
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a
                  href="/about"
                  className="hover:text-[#3FA9A6] transition-colors hover:translate-x-1 inline-block leading-relaxed"
                >
                  {t({ en: "About us", es: "Acerca de" })}
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  className="hover:text-[#3FA9A6] transition-colors hover:translate-x-1 inline-block leading-relaxed"
                >
                  {t({ en: "English tips", es: "Consejos de inglés" })}
                </a>
              </li>
              <li>
                <a
                  href="/pricing"
                  className="hover:text-[#3FA9A6] transition-colors hover:translate-x-1 inline-block leading-relaxed"
                >
                  {t({ en: "Pricing", es: "Precios" })}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-poppins font-semibold text-[#1F2A44] mb-4 leading-tight">
              {t({ en: "Support", es: "Soporte" })}
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a
                  href="/contact"
                  className="hover:text-[#3FA9A6] transition-colors hover:translate-x-1 inline-block leading-relaxed"
                >
                  {t({ en: "Contact", es: "Contacto" })}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-[#3FA9A6] transition-colors hover:translate-x-1 inline-block leading-relaxed"
                >
                  {t({ en: "Help center", es: "Centro de ayuda" })}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-[#3FA9A6] transition-colors hover:translate-x-1 inline-block leading-relaxed"
                >
                  {t({ en: "Privacy policy", es: "Política de privacidad" })}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-poppins font-semibold text-[#1F2A44] mb-4 leading-tight">
              Connect
            </h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-8 h-8 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:text-[#3FA9A6] hover:border-[#3FA9A6] transition-all shadow-sm"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:text-[#3FA9A6] hover:border-[#3FA9A6] transition-all shadow-sm"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:text-[#3FA9A6] hover:border-[#3FA9A6] transition-all shadow-sm"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Mini FAQ Section */}
        <div className="mt-16 pt-12 border-t border-gray-200/50">
          <h3 className="font-poppins text-2xl md:text-3xl font-semibold text-[#1F2A44] text-center mb-8 leading-tight">
            {t({ en: "Quick questions", es: "Preguntas rápidas" })}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[
              {
                q: t({
                  en: "Do I need to pay to start?",
                  es: "¿Necesito pagar para empezar?",
                }),
                a: t({
                  en: "No! Create a free account and explore our content. Paid plans unlock live classes and 1-on-1 sessions.",
                  es: "¡No! Crea una cuenta gratuita y explora nuestro contenido. Los planes de pago desbloquean clases en vivo y sesiones 1-a-1.",
                }),
              },
              {
                q: t({
                  en: "Can I cancel anytime?",
                  es: "¿Puedo cancelar en cualquier momento?",
                }),
                a: t({
                  en: "Absolutely. No contracts, no hidden fees. Cancel with one click from your dashboard.",
                  es: "Absolutamente. Sin contratos, sin cargos ocultos. Cancela con un clic desde tu panel.",
                }),
              },
              {
                q: t({
                  en: "Are your teachers native speakers?",
                  es: "¿Son tus profesores hablantes nativos?",
                }),
                a: t({
                  en: "Yes! All of our instructors are certified native English speakers with years of professional teaching experience.",
                  es: "¡Sí! Todos nuestros instructores son hablantes nativos de inglés certificados con años de experiencia profesional.",
                }),
              },
              {
                q: t({
                  en: "What level do I need to start?",
                  es: "¿Qué nivel necesito para empezar?",
                }),
                a: t({
                  en: "Any level is welcome! We offer beginner-friendly sessions and advanced business English alike.",
                  es: "¡Cualquier nivel es bienvenido! Ofrecemos sesiones para principiantes y para inglés de negocios avanzado.",
                }),
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-md hover:scale-105 transition-all"
              >
                <h4 className="font-semibold text-[#1F2A44] mb-2 text-base leading-relaxed">
                  {item.q}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200/50 text-center text-sm text-gray-500 leading-relaxed">
          © {new Date().getFullYear()} Be More English Online.{" "}
          {t({
            en: "All rights reserved.",
            es: "Todos los derechos reservados.",
          })}
        </div>
      </div>
    </footer>
  );
}
