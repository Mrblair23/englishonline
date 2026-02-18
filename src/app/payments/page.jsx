import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import useUser from "@/utils/useUser";
import {
  CreditCard,
  Calendar,
  DollarSign,
  Download,
  AlertCircle,
  CheckCircle2,
  X,
  Trash2,
  Edit,
} from "lucide-react";

export default function PaymentsPage() {
  const { data: user, loading } = useUser();
  const [showUpdateCardModal, setShowUpdateCardModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelStep, setCancelStep] = useState(1); // 1 = confirmation, 2 = success

  // Mock data
  const currentPlan = {
    name: "Professional Tier",
    price: 99,
    billingCycle: "monthly",
    nextBillingDate: "March 15, 2026",
    status: "active",
  };

  const paymentMethod = {
    brand: "Visa",
    last4: "4242",
    expiry: "12/27",
  };

  const paymentHistory = [
    {
      id: 1,
      date: "Feb 15, 2026",
      amount: 99,
      status: "paid",
      invoice: "INV-2026-002",
    },
    {
      id: 2,
      date: "Jan 15, 2026",
      amount: 99,
      status: "paid",
      invoice: "INV-2026-001",
    },
    {
      id: 3,
      date: "Dec 15, 2025",
      amount: 99,
      status: "paid",
      invoice: "INV-2025-012",
    },
    {
      id: 4,
      date: "Nov 15, 2025",
      amount: 99,
      status: "paid",
      invoice: "INV-2025-011",
    },
  ];

  const handleUpdateCard = (e) => {
    e.preventDefault();
    // Mock card update
    setTimeout(() => {
      setShowUpdateCardModal(false);
      alert("Card updated successfully!");
    }, 1000);
  };

  const handleCancelSubscription = () => {
    // Mock cancellation
    setCancelStep(2);
  };

  if (loading) return null;
  if (!user) {
    if (typeof window !== "undefined") window.location.href = "/account/signin";
    return null;
  }

  return (
    <div className="min-h-screen bm-page-bg">
      <Header />

      <main className="py-12 px-4 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Billing & Payments
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your subscription and payment methods
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Current Plan */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Current Plan</h2>
              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                {currentPlan.status.toUpperCase()}
              </div>
            </div>

            <div className="mb-6">
              <div className="text-2xl font-extrabold text-gray-900 mb-1">
                {currentPlan.name}
              </div>
              <div className="text-3xl font-black text-[#1e3a8a]">
                ${currentPlan.price}
                <span className="text-lg text-gray-500 font-normal">
                  /month
                </span>
              </div>
            </div>

            <div className="space-y-3 mb-6 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar size={16} />
                <span>Next billing: {currentPlan.nextBillingDate}</span>
              </div>
            </div>

            <div className="space-y-3">
              <a
                href="/pricing"
                className="block w-full text-center bg-gray-100 text-gray-900 py-3 rounded-2xl font-bold hover:bg-gray-200 transition-all"
              >
                Change Plan
              </a>
              <button
                onClick={() => {
                  setShowCancelModal(true);
                  setCancelStep(1);
                }}
                className="w-full text-center text-red-600 py-3 rounded-2xl font-medium hover:bg-red-50 transition-all"
              >
                Cancel Subscription
              </button>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              Payment Method
            </h2>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 mb-6 text-white">
              <div className="flex justify-between items-start mb-8">
                <CreditCard size={32} />
                <span className="text-sm font-semibold">
                  {paymentMethod.brand}
                </span>
              </div>
              <div className="text-xl tracking-wider mb-4">
                •••• •••• •••• {paymentMethod.last4}
              </div>
              <div className="flex justify-between text-sm">
                <span className="opacity-70">Expires</span>
                <span className="font-semibold">{paymentMethod.expiry}</span>
              </div>
            </div>

            <button
              onClick={() => setShowUpdateCardModal(true)}
              className="w-full bg-[#1e3a8a] text-white py-3 rounded-2xl font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              <Edit size={18} />
              Update Card
            </button>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              Payment Stats
            </h2>

            <div className="space-y-6">
              <div>
                <div className="text-sm text-gray-600 mb-1">Total Spent</div>
                <div className="text-3xl font-black text-gray-900">$396</div>
              </div>

              <div>
                <div className="text-sm text-gray-600 mb-1">Payments Made</div>
                <div className="text-3xl font-black text-gray-900">4</div>
              </div>

              <div>
                <div className="text-sm text-gray-600 mb-1">Member Since</div>
                <div className="text-lg font-bold text-gray-900">Nov 2025</div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 size={18} />
                  <span className="text-sm font-semibold">
                    All payments up to date
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900">
              Payment History
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-8 py-4 text-sm font-bold text-gray-700">
                    Date
                  </th>
                  <th className="text-left px-8 py-4 text-sm font-bold text-gray-700">
                    Invoice
                  </th>
                  <th className="text-left px-8 py-4 text-sm font-bold text-gray-700">
                    Amount
                  </th>
                  <th className="text-left px-8 py-4 text-sm font-bold text-gray-700">
                    Status
                  </th>
                  <th className="text-right px-8 py-4 text-sm font-bold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-8 py-5 text-gray-900 font-medium">
                      {payment.date}
                    </td>
                    <td className="px-8 py-5 text-gray-600 font-mono text-sm">
                      {payment.invoice}
                    </td>
                    <td className="px-8 py-5 text-gray-900 font-bold">
                      ${payment.amount.toFixed(2)}
                    </td>
                    <td className="px-8 py-5">
                      <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold">
                        <CheckCircle2 size={14} />
                        {payment.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="inline-flex items-center gap-2 text-[#1e3a8a] hover:underline font-semibold text-sm">
                        <Download size={16} />
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 bg-gray-50 text-center">
            <p className="text-sm text-gray-600">
              Showing all payment history.{" "}
              <a
                href="/contact"
                className="text-[#1e3a8a] font-semibold hover:underline"
              >
                Need help?
              </a>
            </p>
          </div>
        </div>
      </main>

      <Footer />

      {/* Update Card Modal */}
      {showUpdateCardModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowUpdateCardModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Update Payment Method
            </h2>

            <form onSubmit={handleUpdateCard} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Expiry
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    CVC
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUpdateCardModal(false)}
                  className="flex-1 py-3 rounded-2xl border border-gray-300 font-bold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#1e3a8a] text-white py-3 rounded-2xl font-bold hover:brightness-110 transition-all"
                >
                  Update Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 relative">
            {cancelStep === 1 ? (
              <>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="text-red-600" size={32} />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                  Cancel Subscription?
                </h2>
                <p className="text-gray-600 text-center mb-8">
                  We're sorry to see you go! Your subscription will remain
                  active until <strong>{currentPlan.nextBillingDate}</strong>,
                  then you'll lose access to:
                </p>

                <div className="bg-red-50 border border-red-100 rounded-2xl p-5 mb-8">
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <X
                        size={16}
                        className="text-red-600 mt-0.5 flex-shrink-0"
                      />
                      <span>Unlimited 1-on-1 lessons</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X
                        size={16}
                        className="text-red-600 mt-0.5 flex-shrink-0"
                      />
                      <span>Personalized curriculum</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X
                        size={16}
                        className="text-red-600 mt-0.5 flex-shrink-0"
                      />
                      <span>Priority booking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X
                        size={16}
                        className="text-red-600 mt-0.5 flex-shrink-0"
                      />
                      <span>Progress tracking</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => setShowCancelModal(false)}
                    className="w-full bg-[#1e3a8a] text-white py-4 rounded-2xl font-bold hover:brightness-110 transition-all"
                  >
                    Keep My Subscription
                  </button>
                  <button
                    onClick={handleCancelSubscription}
                    className="w-full text-red-600 py-4 rounded-2xl font-medium hover:bg-red-50 transition-all"
                  >
                    Yes, Cancel Subscription
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="text-green-600" size={32} />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                  Subscription Cancelled
                </h2>
                <p className="text-gray-600 text-center mb-8">
                  Your subscription has been cancelled. You'll have access until{" "}
                  <strong>{currentPlan.nextBillingDate}</strong>.
                </p>

                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-8 text-sm text-gray-700">
                  <p className="font-semibold text-gray-900 mb-2">
                    Changed your mind?
                  </p>
                  <p>
                    You can reactivate your subscription anytime before{" "}
                    {currentPlan.nextBillingDate}.
                  </p>
                </div>

                <button
                  onClick={() => setShowCancelModal(false)}
                  className="w-full bg-[#1e3a8a] text-white py-4 rounded-2xl font-bold hover:brightness-110 transition-all"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
