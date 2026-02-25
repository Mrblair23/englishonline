import useUser from "@/utils/useUser";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Menu } from "lucide-react";
import { useDashboardState } from "@/hooks/useDashboardState";
import { useLanguage } from "@/utils/useLanguage";
import { DashboardSidebar } from "@/components/Dashboard/DashboardSidebar";
import { MobileSidebar } from "@/components/Dashboard/MobileSidebar";
import { DashboardBackground } from "@/components/Dashboard/DashboardBackground";
import { OverviewTab } from "@/components/Dashboard/OverviewTab";
import { BookTab } from "@/components/Dashboard/BookTab";
import { ScheduleTab } from "@/components/Dashboard/ScheduleTab";
import { PaymentsTab } from "@/components/Dashboard/PaymentsTab";
import { SettingsTab } from "@/components/Dashboard/SettingsTab";

export default function DashboardPage() {
  const { data: user, loading } = useUser();
  const {
    activeTab,
    setActiveTab,
    sidebarOpen,
    setSidebarOpen,
    homework,
    toggleHomework,
    completedCount,
  } = useDashboardState();
  const { language } = useLanguage();
  const t = (translations) => translations[language] || translations.en;

  // Redirect admins to admin dashboard
  if (!loading && user?.role === "admin") {
    if (typeof window !== "undefined") {
      window.location.href = "/admin/dashboard";
    }
    return null;
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bm-page-bg">
        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-2 border-b-2 border-[#3FA9A6]"></div>
      </div>
    );

  if (!user) {
    if (typeof window !== "undefined") window.location.href = "/account/signin";
    return null;
  }

  // Banner logic for subscription status
  let banner = null;
  if (user.subscription_status === "inactive" || !user.subscription_status) {
    banner = (
      <a
        href="/choose-plan"
        className="block w-full bg-gradient-to-r from-[#F2B705]/20 to-[#f5c642]/20 border border-[#F2B705]/40 text-[#1F2A44] px-4 py-4 rounded-xl mb-4 text-center font-semibold hover:shadow-md transition-all group cursor-pointer"
      >
        <span className="flex items-center justify-center gap-2">
          <span>🎯</span>
          <span>{t({ en: "Choose a plan to get started", es: "Elige un plan para comenzar" })}</span>
          <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
        </span>
      </a>
    );
  } else if (user.subscription_status === "pending_manual_activation") {
    banner = (
      <div className="w-full bg-blue-100 text-blue-800 px-4 py-3 rounded-xl mb-4 text-center font-medium">
        ⏳ {t({ en: "Payment received. Awaiting confirmation.", es: "Pago recibido. Esperando confirmación." })}
      </div>
    );
  } else if (user.subscription_status === "suspended") {
    banner = (
      <div className="w-full bg-red-100 text-red-800 px-4 py-3 rounded-xl mb-4 text-center font-medium">
        ⚠️ {t({ en: "Your subscription is suspended. Please contact support.", es: "Tu suscripción está suspendida. Por favor contacta soporte." })}
      </div>
    );
  }

  return (
    <div className="min-h-screen bm-page-bg font-inter overflow-x-hidden">
      <Header />

      <div className="flex w-full max-w-full">
        <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <MobileSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-full mx-auto w-full relative overflow-x-hidden">
          <DashboardBackground />

          <div className="relative z-10 w-full max-w-full">
            {banner}
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden mb-6 flex items-center space-x-2 min-h-[44px] px-4 py-3 text-gray-600 font-medium hover:text-[#3FA9A6] hover:bg-white rounded-xl transition-all"
            >
              <Menu size={24} />
              <span className="text-base">{t({ en: "Menu", es: "Menú" })}</span>
            </button>

            {activeTab === "overview" && (
              <OverviewTab
                userName={user.displayName || user.name}
                homework={homework}
                onToggleHomework={toggleHomework}
                completedCount={completedCount}
                onBookClass={() => setActiveTab("book")}
                onViewSchedule={() => setActiveTab("schedule")}
                onChangePayments={() => setActiveTab("payments")}
              />
            )}

            {activeTab === "book" && <BookTab />}

            {activeTab === "schedule" && <ScheduleTab />}

            {activeTab === "payments" && <PaymentsTab />}

            {activeTab === "settings" && <SettingsTab />}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
