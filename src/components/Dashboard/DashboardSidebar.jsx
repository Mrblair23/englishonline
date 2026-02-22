import {
  LayoutDashboard,
  Calendar,
  CreditCard,
  Settings,
  Clock,
} from "lucide-react";
import { useLanguage } from "@/utils/useLanguage";

const navigationItems = [
  { id: "overview", en: "Overview", es: "Resumen", icon: <LayoutDashboard size={20} /> },
  { id: "book", en: "Book a class", es: "Reservar clase", icon: <Calendar size={20} /> },
  { id: "schedule", en: "Schedule", es: "Horario", icon: <Clock size={20} /> },
  { id: "payments", en: "Payments", es: "Pagos", icon: <CreditCard size={20} /> },
  { id: "settings", en: "Settings", es: "Ajustes", icon: <Settings size={20} /> },
];

export function DashboardSidebar({ activeTab, setActiveTab }) {
  const { language, setLanguage } = useLanguage();
  const t = (translations) => translations[language] || translations.en;

  return (
    <aside className="hidden lg:block w-64 bg-white/60 backdrop-blur-sm border-r border-gray-200/50 min-h-[calc(100vh-5rem)] sticky top-20">
      <div className="p-6">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
          {t({ en: "Student portal", es: "Portal del estudiante" })}
        </h3>
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all group ${
                activeTab === item.id
                  ? "bg-gradient-to-r from-[#F2B705] to-[#f5c642] text-[#1F2A44] shadow-lg"
                  : "text-gray-600 hover:bg-white/80 hover:scale-105"
              }`}
            >
              <span
                className={
                  activeTab === item.id
                    ? ""
                    : "group-hover:scale-110 transition-transform"
                }
              >
                {item.icon}
              </span>
              <span>{language === "es" ? item.es : item.en}</span>
            </button>
          ))}
        </nav>

        <div className="mt-8">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            {t({ en: "Language", es: "Idioma" })}
          </h4>
          <div className="flex items-center space-x-2 bg-white rounded-xl border border-gray-200 p-1 shadow-sm">
            <button
              onClick={() => setLanguage("en")}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                language === "en"
                  ? "bg-[#3FA9A6] text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("es")}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                language === "es"
                  ? "bg-[#3FA9A6] text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              ES
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
