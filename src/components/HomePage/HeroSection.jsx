import { ArrowRight, Calendar, Award, Sparkles } from "lucide-react";

export function HeroSection({ t }) {
  return (
    <section className="relative pt-8 pb-8 md:pt-12 md:pb-10 lg:h-[calc(100vh-80px)] lg:flex lg:items-center overflow-hidden">
      {/* Warm gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FAF9F7] via-[#F5F1E8] to-[#EAE4D5]"></div>

      {/* Subtle paper texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* Warm desk lamp glow - top right */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-[#F2B705]/20 via-[#F2B705]/5 to-transparent rounded-full blur-3xl"></div>

      {/* Soft ambient light - left side */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-gradient-radial from-[#3FA9A6]/15 via-[#3FA9A6]/5 to-transparent rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Content */}
          <div className="text-center lg:text-left">
            <h1 className="font-poppins text-5xl md:text-6xl lg:text-[3.5rem] xl:text-6xl font-semibold text-blue-900 leading-[1.1] mb-4 tracking-tight">
              {t({
                en: (
                  <>
                    Learn English with{" "}
                    <span className="text-blue-600">Confidence</span> — Not
                    Stress
                  </>
                ),
                es: (
                  <>
                    Aprende Inglés con{" "}
                    <span className="text-blue-600">Confianza</span> — Sin
                    Estrés
                  </>
                ),
              })}
            </h1>
            <p className="text-lg md:text-xl text-blue-900/70 mb-6 leading-relaxed max-w-xl mx-auto lg:mx-0">
              {t({
                en: "Personalized English classes with a native US teacher. Speak naturally, step by step.",
                es: "Clases personalizadas de inglés con un profesor nativo de EE.UU. Habla naturalmente, paso a paso.",
              })}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-6">
              <a
                href="/account/signup"
                className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#F2B705] to-[#f5c642] text-[#1F2A44] rounded-xl font-semibold text-base hover:shadow-xl hover:brightness-105 hover:scale-105 transition-all w-full sm:w-auto shadow-md"
              >
                {t({ en: "Start free", es: "Comenzar gratis" })}
                <ArrowRight
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                  size={20}
                />
              </a>
              <a
                href="/book"
                className="group inline-flex items-center justify-center px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-[#1F2A44] text-[#1F2A44] rounded-xl font-semibold text-base hover:bg-white hover:shadow-lg hover:scale-105 transition-all w-full sm:w-auto shadow-sm"
              >
                <Calendar
                  className="mr-2 group-hover:scale-110 transition-transform"
                  size={20}
                />
                {t({
                  en: "Book a trial class",
                  es: "Reserva una clase de prueba",
                })}
              </a>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto lg:mx-0">
              <div className="flex items-center justify-center lg:justify-start gap-3 bg-white/60 backdrop-blur-sm px-4 py-3 rounded-xl border border-gray-200/50 shadow-sm hover:shadow-md hover:scale-105 transition-all">
                <div className="w-10 h-10 bg-gradient-to-br from-[#3FA9A6] to-[#2d8784] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Award size={20} className="text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-[#1F2A44] leading-tight">
                    {t({ en: "Native US", es: "Nativo EE.UU." })}
                  </p>
                  <p className="text-xs text-gray-600 leading-tight">
                    {t({ en: "Teacher", es: "Profesor" })}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-3 bg-white/60 backdrop-blur-sm px-4 py-3 rounded-xl border border-gray-200/50 shadow-sm hover:shadow-md hover:scale-105 transition-all">
                <div className="w-10 h-10 bg-gradient-to-br from-[#F2B705] to-[#d9a004] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Sparkles size={20} className="text-[#1F2A44]" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-[#1F2A44] leading-tight">
                    {t({ en: "Personalized", es: "Personalizado" })}
                  </p>
                  <p className="text-xs text-gray-600 leading-tight">
                    {t({ en: "Method", es: "Método" })}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-3 bg-white/60 backdrop-blur-sm px-4 py-3 rounded-xl border border-gray-200/50 shadow-sm hover:shadow-md hover:scale-105 transition-all">
                <div className="w-10 h-10 bg-gradient-to-br from-[#1F2A44] to-[#2B3448] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Calendar size={20} className="text-[#F2B705]" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-[#1F2A44] leading-tight">
                    {t({ en: "Online &", es: "Online y" })}
                  </p>
                  <p className="text-xs text-gray-600 leading-tight">
                    {t({ en: "Flexible", es: "Flexible" })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Illustration */}
          <div className="relative hidden lg:flex items-center">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 max-h-[calc(100vh-140px)]">
              <img
                src="https://raw.createusercontent.com/5845d23a-94ad-4788-9852-81818a3ada6c/"
                alt="Person studying English in a cozy home library"
                className="w-full max-h-[calc(100vh-140px)] object-cover"
              />
            </div>

            {/* Floating decorative elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#F2B705]/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#3FA9A6]/10 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>

      {/* Curved bottom separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
            fill="white"
            fillOpacity="0.5"
          />
          <path
            d="M0 40L60 46.7C120 53 240 67 360 70C480 73 600 67 720 63.3C840 60 960 60 1080 63.3C1200 67 1320 73 1380 76.7L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V40Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
