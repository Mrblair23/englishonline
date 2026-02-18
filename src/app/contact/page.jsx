import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Send,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "@/utils/useLanguage";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { language } = useLanguage();

  const t = (translations) => translations[language] || translations.en;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bm-page-bg overflow-x-hidden">
      <Header />

      <main className="py-12 sm:py-16 md:py-20 lg:py-32 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-20">
            {/* Info Section - Mobile optimized */}
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 sm:mb-8 leading-tight">
                {t({
                  en: (
                    <>
                      Get in touch with{" "}
                      <span className="text-[#1e3a8a]">
                        Be More English Online
                      </span>
                    </>
                  ),
                  es: (
                    <>
                      Ponte en contacto con{" "}
                      <span className="text-[#1e3a8a]">
                        Be More English Online
                      </span>
                    </>
                  ),
                })}
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed mb-8 sm:mb-12">
                {t({
                  en: "Have questions about our programs or need a custom plan for your team? Our experts are here to help you find the best path.",
                  es: "¿Tienes preguntas sobre nuestros programas o necesitas un plan personalizado para tu equipo? Nuestros expertos están aquí para ayudarte a encontrar el mejor camino.",
                })}
              </p>

              {/* Contact Cards - Stack on mobile */}
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center space-x-4 sm:space-x-6 p-5 sm:p-6 bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg hover:scale-105 transition-all">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-50 text-[#1e3a8a] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm sm:text-base">
                      {t({ en: "Email Us", es: "Envíanos un email" })}
                    </h4>
                    <p className="text-gray-500 text-sm sm:text-base break-all">
                      hello@pauloacademy.com
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 sm:space-x-6 p-5 sm:p-6 bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg hover:scale-105 transition-all">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm sm:text-base">
                      {t({ en: "Call Us", es: "Llámanos" })}
                    </h4>
                    <p className="text-gray-500 text-sm sm:text-base">
                      +1 (555) 000-0000
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 sm:space-x-6 p-5 sm:p-6 bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg hover:scale-105 transition-all">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-50 text-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm sm:text-base">
                      {t({ en: "Visit Us", es: "Visítanos" })}
                    </h4>
                    <p className="text-gray-500 text-sm sm:text-base">
                      123 Education St, London, UK
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form - Mobile optimized with 16px font inputs */}
            <div className="bm-card bm-card-elevated p-6 sm:p-8 md:p-12 lg:p-16 relative overflow-hidden">
              <div className="absolute top-6 right-6 text-amber-400 animate-pulse">
                <Sparkles size={20} className="sm:hidden" />
                <Sparkles size={24} className="hidden sm:block" />
              </div>

              {submitted ? (
                <div className="text-center py-10 sm:py-16 lg:py-20">
                  <div className="relative inline-block mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 text-white rounded-full flex items-center justify-center mx-auto animate-bounce">
                      <CheckCircle2 size={40} strokeWidth={3} />
                    </div>
                    <div className="absolute -top-2 -right-2">
                      <Sparkles
                        size={24}
                        className="text-[#F2B705] animate-pulse"
                      />
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {t({
                      en: "Message sent successfully! 🎉",
                      es: "¡Mensaje enviado con éxito! 🎉",
                    })}
                  </h2>
                  <p className="text-gray-600 text-lg mb-3 leading-relaxed">
                    {t({
                      en: "Thanks for reaching out! We're excited to help you on your English learning journey.",
                      es: "¡Gracias por contactarnos! Estamos emocionados de ayudarte en tu viaje de aprendizaje del inglés.",
                    })}
                  </p>
                  <p className="text-[#3FA9A6] font-semibold mb-10 leading-relaxed">
                    {t({
                      en: "We'll get back to you within 24 hours ⏱️",
                      es: "Te responderemos en 24 horas ⏱️",
                    })}
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="group inline-flex items-center space-x-2 text-[#1e3a8a] font-bold hover:scale-105 transition-all"
                  >
                    <span>
                      {t({
                        en: "Send another message",
                        es: "Enviar otro mensaje",
                      })}
                    </span>
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5 sm:space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        {t({ en: "First Name", es: "Nombre" })}
                      </label>
                      <input
                        required
                        type="text"
                        className="w-full px-5 sm:px-6 py-3.5 sm:py-4 text-base bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-[#1e3a8a] outline-none transition-all"
                        placeholder={t({ en: "John", es: "Juan" })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        {t({ en: "Last Name", es: "Apellido" })}
                      </label>
                      <input
                        required
                        type="text"
                        className="w-full px-5 sm:px-6 py-3.5 sm:py-4 text-base bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-[#1e3a8a] outline-none transition-all"
                        placeholder={t({ en: "Doe", es: "Pérez" })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      {t({ en: "Email", es: "Correo electrónico" })}
                    </label>
                    <input
                      required
                      type="email"
                      className="w-full px-5 sm:px-6 py-3.5 sm:py-4 text-base bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-[#1e3a8a] outline-none transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      {t({ en: "Subject", es: "Asunto" })}
                    </label>
                    <select className="w-full px-5 sm:px-6 py-3.5 sm:py-4 text-base bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-[#1e3a8a] outline-none appearance-none transition-all">
                      <option>
                        {t({ en: "General Inquiry", es: "Consulta general" })}
                      </option>
                      <option>
                        {t({
                          en: "Course Information",
                          es: "Información del curso",
                        })}
                      </option>
                      <option>
                        {t({
                          en: "Corporate Training",
                          es: "Entrenamiento corporativo",
                        })}
                      </option>
                      <option>{t({ en: "Support", es: "Soporte" })}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      {t({ en: "Message", es: "Mensaje" })}
                    </label>
                    <textarea
                      required
                      rows="4"
                      className="w-full px-5 sm:px-6 py-3.5 sm:py-4 text-base bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-[#1e3a8a] outline-none resize-none transition-all"
                      placeholder={t({
                        en: "How can we help?",
                        es: "¿Cómo podemos ayudarte?",
                      })}
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group w-full bg-[#1e3a8a] text-white min-h-[52px] sm:min-h-[56px] py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:brightness-110 hover:scale-105 shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>
                      {isSubmitting
                        ? t({ en: "Sending...", es: "Enviando..." })
                        : t({ en: "Send Message", es: "Enviar mensaje" })}
                    </span>
                    {!isSubmitting && (
                      <Send
                        size={20}
                        className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                      />
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
