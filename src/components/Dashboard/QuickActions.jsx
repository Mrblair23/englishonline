import {
  Calendar,
  Clock,
  CreditCard,
  MessageCircle,
  ChevronRight,
} from "lucide-react";
import { useLanguage } from "@/utils/useLanguage";

export function QuickActions({
  onBookClass,
  onViewSchedule,
  onChangePayments,
}) {
  const { language } = useLanguage();
  const t = (translations) => translations[language] || translations.en;

  return (
    <div className="bg-gradient-to-br from-white to-[#FAF9F7] rounded-2xl p-6 sm:p-8 border border-gray-200/50 shadow-sm hover:shadow-lg transition-all duration-300">
      <h3 className="font-poppins text-lg sm:text-xl font-semibold text-[#1F2A44] mb-4 sm:mb-6 leading-tight">
        {t({ en: "Quick actions", es: "Acciones rápidas" })}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <button
          onClick={onBookClass}
          className="group/action flex items-center justify-between p-4 sm:p-5 min-h-[64px] bg-gradient-to-br from-[#F2B705] to-[#f5c642] text-[#1F2A44] rounded-xl font-semibold text-base hover:shadow-lg hover:brightness-105 hover:scale-105 transition-all"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#F2B705] to-[#f5c642] rounded-xl flex items-center justify-center group-hover/action:scale-110 group-hover/action:rotate-6 transition-all flex-shrink-0">
              <Calendar className="text-[#1F2A44]" size={20} />
            </div>
            <span className="font-medium text-[#1F2A44] text-sm sm:text-base">
              {t({ en: "Book a class", es: "Reservar clase" })}
            </span>
          </div>
          <ChevronRight
            className="text-[#1F2A44]/60 group-hover/action:text-[#1F2A44] group-hover/action:translate-x-1 transition-all flex-shrink-0"
            size={20}
          />
        </button>

        <button
          onClick={onViewSchedule}
          className="group/action flex items-center justify-between p-4 bg-gradient-to-br from-purple-100/50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl transition-all hover:scale-105 border border-purple-200/50"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center group-hover/action:scale-110 group-hover/action:rotate-6 transition-all">
              <Clock className="text-white" size={20} />
            </div>
            <span className="font-medium text-[#1F2A44]">{t({ en: "View schedule", es: "Ver horario" })}</span>
          </div>
          <ChevronRight
            className="text-gray-400 group-hover/action:text-purple-600 group-hover/action:translate-x-1 transition-all"
            size={20}
          />
        </button>

        <button
          onClick={onChangePayments}
          className="group/action flex items-center justify-between p-4 bg-gradient-to-br from-amber-100/50 to-amber-100 hover:from-amber-100 hover:to-amber-200 rounded-xl transition-all hover:scale-105 border border-amber-200/50"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center group-hover/action:scale-110 group-hover/action:rotate-6 transition-all">
              <CreditCard className="text-white" size={20} />
            </div>
            <span className="font-medium text-[#1F2A44]">{t({ en: "Change plan", es: "Cambiar plan" })}</span>
          </div>
          <ChevronRight
            className="text-gray-400 group-hover/action:text-amber-600 group-hover/action:translate-x-1 transition-all"
            size={20}
          />
        </button>

        <a
          href="/contact"
          className="group/action flex items-center justify-between p-4 bg-gradient-to-br from-[#3FA9A6]/10 to-[#3FA9A6]/20 hover:from-[#3FA9A6]/20 hover:to-[#3FA9A6]/30 rounded-xl transition-all hover:scale-105 border border-[#3FA9A6]/20"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#3FA9A6] rounded-xl flex items-center justify-center group-hover/action:scale-110 group-hover/action:rotate-6 transition-all">
              <MessageCircle className="text-white" size={20} />
            </div>
            <span className="font-medium text-[#1F2A44]">{t({ en: "Contact us", es: "Contáctanos" })}</span>
          </div>
          <ChevronRight
            className="text-gray-400 group-hover/action:text-[#3FA9A6] group-hover/action:translate-x-1 transition-all"
            size={20}
          />
        </a>
      </div>
    </div>
  );
}
