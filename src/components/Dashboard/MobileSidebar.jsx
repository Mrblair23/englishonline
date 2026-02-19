import {
  LayoutDashboard,
  Calendar,
  CreditCard,
  Settings,
  Clock,
  X,
} from "lucide-react";
import { useLanguage } from "@/utils/useLanguage";

const navigationItems = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard size={20} /> },
  { id: "book", label: "Book a class", icon: <Calendar size={20} /> },
  { id: "schedule", label: "Schedule", icon: <Clock size={20} /> },
  { id: "payments", label: "Payments", icon: <CreditCard size={20} /> },
  { id: "settings", label: "Settings", icon: <Settings size={20} /> },
];

export function MobileSidebar({ isOpen, onClose, activeTab, setActiveTab }) {
  const { language, setLanguage } = useLanguage();

  if (!isOpen) return null;

  return (
    <div
      className="lg:hidden fixed inset-0 z-50 bg-[#1F2A44]/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-64 bg-white h-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Student portal
          </h3>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                onClose();
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === item.id
                  ? "bg-gradient-to-r from-[#F2B705] to-[#f5c642] text-[#1F2A44]"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-8">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Language
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
    </div>
  );
}
