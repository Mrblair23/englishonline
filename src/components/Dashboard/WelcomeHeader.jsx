import { Lightbulb } from "lucide-react";
import { useLanguage } from "@/utils/useLanguage";

export function WelcomeHeader({ userName }) {
  const { language } = useLanguage();
  const t = (translations) => translations[language] || translations.en;

  return (
    <div className="mb-6 sm:mb-8 bg-gradient-to-br from-[#1F2A44] to-[#2B3448] rounded-2xl p-6 sm:p-8 md:p-12 text-white relative overflow-hidden shadow-xl">
      {/* Warm glows */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#F2B705]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#3FA9A6]/20 rounded-full blur-3xl"></div>

      {/* Subtle texture */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h60v60H0z' fill='none'/%3E%3Cpath d='M30 0v60M0 30h60' stroke='%23fff' stroke-width='0.5' opacity='0.1'/%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb size={28} className="text-[#F2B705] sm:hidden" />
          <Lightbulb size={32} className="text-[#F2B705] hidden sm:block" />
        </div>
        <h1 className="font-poppins text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-2 sm:mb-3 leading-tight">
          {t({ en: "Hi", es: "Hola" })}, {userName?.split(" ")[0]}! 👋
        </h1>
        <p className="text-gray-300 font-medium text-base sm:text-lg leading-relaxed">
          {t({ en: "Welcome back to your learning journey", es: "Bienvenido de vuelta a tu camino de aprendizaje" })}
        </p>
      </div>
    </div>
  );
}
