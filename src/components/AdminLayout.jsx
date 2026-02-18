import { useState } from "react";
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  UserSquare,
  MessageSquare,
  Settings,
  Menu,
  X,
  LogOut,
  Shield,
  Users,
  CreditCard,
  Tag,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackendStatusIndicator from "@/components/BackendStatusIndicator";

export default function AdminLayout({ children, currentPage }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    { name: "Classes", href: "/admin/classes", icon: <Calendar size={20} /> },
    {
      name: "Homework",
      href: "/admin/homework",
      icon: <BookOpen size={20} />,
    },
    {
      name: "Teachers",
      href: "/admin/teachers",
      icon: <UserSquare size={20} />,
    },
    {
      name: "Students",
      href: "/admin/students",
      icon: <Users size={20} />,
    },
    {
      name: "Pricing",
      href: "/admin/pricing",
      icon: <Tag size={20} />,
    },
    {
      name: "Payments",
      href: "/admin/payments",
      icon: <CreditCard size={20} />,
    },
    {
      name: "Communications",
      href: "/admin/communications",
      icon: <MessageSquare size={20} />,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: <Settings size={20} />,
    },
  ];

  return (
    <div className="min-h-screen bm-page-bg overflow-x-hidden">
      <div className="relative">
        <Header />
        <div className="absolute right-4 top-4 lg:right-10">
          <BackendStatusIndicator />
        </div>
      </div>

      <div className="flex">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all"
          aria-label="Toggle menu"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-40 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 w-64`}
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Shield size={24} className="text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-lg">Admin Panel</h2>
                <p className="text-xs text-gray-500">Be More English Online</p>
              </div>
            </div>
          </div>

          <nav className="p-4 overflow-y-auto h-[calc(100vh-100px)]">
            {navItems.map((item) => {
              const isActive = currentPage === item.name.toLowerCase();
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                </a>
              );
            })}

            <div className="border-t border-gray-200 my-4"></div>

            <a
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-all"
            >
              <LogOut size={20} />
              <span className="font-medium">Back to Site</span>
            </a>
          </nav>
        </aside>

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen">{children}</main>
      </div>
    </div>
  );
}
