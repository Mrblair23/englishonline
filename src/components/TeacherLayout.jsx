import { useState } from "react";
import {
  Calendar,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  MessageSquare,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const navItems = [
  { name: "Dashboard", href: "/teacher/dashboard", icon: <LayoutDashboard size={18} /> },
  { name: "Classes", href: "/teacher/classes", icon: <Calendar size={18} /> },
  { name: "Assignments", href: "/teacher/assignments", icon: <ClipboardList size={18} /> },
  { name: "Messages", href: "/teacher/messages", icon: <MessageSquare size={18} /> },
];

export default function TeacherLayout({ children, currentPage = "dashboard" }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bm-page-bg">
      <Header />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 lg:flex-row">
        <aside className="w-full lg:w-64">
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="mb-4 flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 lg:hidden"
          >
            Teacher menu
            <span>{open ? "−" : "+"}</span>
          </button>
          <nav className={`${open ? "block" : "hidden"} lg:block`}> 
            <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
              {navItems.map((item) => {
                const active = currentPage === item.name.toLowerCase();
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors ${
                      active
                        ? "bg-gradient-to-r from-[#1F2A44] to-[#3FA9A6] text-white"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </a>
                );
              })}
              <div className="mt-4 border-t border-gray-100 pt-4">
                <a
                  href="/account/logout"
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                >
                  <LogOut size={18} />
                  Sign out
                </a>
              </div>
            </div>
          </nav>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
