import Header from "@/components/Header";
import Footer from "@/components/Footer";
import useUser from "@/utils/useUser";
import { CreditCard, Check, ShieldCheck, Zap, ArrowRight } from "lucide-react";

export default function MyPlanPage() {
  const { data: user, loading } = useUser();

  if (loading) return null;
  if (!user) {
    if (typeof window !== "undefined") window.location.href = "/account/signin";
    return null;
  }

  return (
    <div className="min-h-screen bm-page-bg">
      <Header />

      <main className="py-12 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-12">
            My Membership Plan
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="md:col-span-2 space-y-8">
              {/* Current Plan Details */}
              <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-xl">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <div className="text-xs font-bold text-[#1e3a8a] uppercase tracking-widest mb-1">
                      Current Active Plan
                    </div>
                    <h2 className="text-3xl font-black text-gray-900">
                      Professional
                    </h2>
                  </div>
                  <div className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-bold">
                    Active
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 py-8 border-y border-gray-50 mb-8">
                  <div>
                    <div className="text-sm font-bold text-gray-400 uppercase mb-1">
                      Billing Period
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      Monthly
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-400 uppercase mb-1">
                      Next Payment
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      Feb 28, 2026
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-400 uppercase mb-1">
                      Amount
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      $99.00
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-400 uppercase mb-1">
                      Payment Method
                    </div>
                    <div className="text-lg font-bold text-gray-900 flex items-center">
                      <CreditCard size={18} className="mr-2" />
                      •••• 4242
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <button className="flex-1 bg-gray-50 text-gray-700 py-3.5 rounded-2xl font-bold hover:bg-gray-100 transition-all">
                    Update Method
                  </button>
                  <button className="flex-1 border-2 border-gray-100 text-gray-400 py-3.5 rounded-2xl font-bold hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all">
                    Cancel Plan
                  </button>
                </div>
              </div>

              {/* Invoices */}
              <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Recent Invoices
                </h3>
                <div className="space-y-4">
                  {[
                    { date: "Jan 28, 2026", amount: "$99.00", status: "Paid" },
                    { date: "Dec 28, 2025", amount: "$99.00", status: "Paid" },
                  ].map((invoice, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                          <CreditCard size={18} />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">
                            {invoice.date}
                          </div>
                          <div className="text-xs text-gray-500 font-medium">
                            Professional Plan • {invoice.status}
                          </div>
                        </div>
                      </div>
                      <div className="font-bold text-gray-900">
                        {invoice.amount}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Upgrade Sidebar */}
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-4">Elite Upgrade</h3>
                  <p className="text-blue-100 text-sm mb-8 leading-relaxed">
                    Unlock private 1-on-1 coaching and specialized curriculum
                    for the fastest growth.
                  </p>
                  <ul className="space-y-3 mb-10">
                    {[
                      "Unlimited Classes",
                      "Personal Tutor",
                      "Exam Prep Bundle",
                    ].map((f) => (
                      <li
                        key={f}
                        className="flex items-center text-sm font-medium"
                      >
                        <Check size={16} className="mr-2 text-blue-300" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="/pricing"
                    className="block w-full py-4 bg-white text-[#1e3a8a] rounded-2xl font-bold text-center hover:bg-blue-50 transition-all flex items-center justify-center space-x-2"
                  >
                    <span>View Elite Plan</span>
                    <ArrowRight size={18} />
                  </a>
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
                <div className="flex items-center space-x-2 text-gray-400 mb-4">
                  <ShieldCheck size={18} />
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Secure Payments
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Your payment information is encrypted and processed securely
                  through our partners.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
