import useUser from "@/utils/useUser";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Menu } from "lucide-react";
import { useDashboardState } from "@/hooks/useDashboardState";
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
    hasUpcomingClass,
  } = useDashboardState();

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
  if (user.subscription_status === "inactive") {
    banner = (
      <div className="w-full bg-yellow-100 text-yellow-800 px-4 py-3 rounded mb-4 text-center font-medium">
        Choose a plan to get started.
      </div>
    );
  } else if (user.subscription_status === "pending_manual_activation") {
    banner = (
      <div className="w-full bg-blue-100 text-blue-800 px-4 py-3 rounded mb-4 text-center font-medium">
        Payment received. Awaiting confirmation.
      </div>
    );
  } else if (user.subscription_status === "suspended") {
    banner = (
      <div className="w-full bg-red-100 text-red-800 px-4 py-3 rounded mb-4 text-center font-medium">
        Your subscription is suspended. Please contact support.
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
              <span className="text-base">Menu</span>
            </button>

            {activeTab === "overview" && (
              <OverviewTab
                userName={user.name}
                hasUpcomingClass={hasUpcomingClass}
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
