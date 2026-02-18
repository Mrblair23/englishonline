import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CreditCard, Lock, CheckCircle2, ArrowLeft, Zap } from "lucide-react";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [billingCycle, setBillingCycle] = useState("monthly"); // "monthly" or "quarterly"
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const prices = {
    monthly: 99,
    quarterly: 267, // 3 months: $297 - 10% = $267
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate Stripe payment processing
    setTimeout(() => {
      setLoading(false);
      alert("Payment processed successfully! Redirecting to dashboard...");
      window.location.href = "/dashboard";
    }, 2000);
  };

  const handleChange = (e) => {
    let value = e.target.value;
    const name = e.target.name;

    // Auto-format card number
    if (name === "cardNumber") {
      value = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim();
      if (value.length > 19) value = value.substring(0, 19);
    }

    // Auto-format expiry
    if (name === "expiry") {
      value = value.replace(/\D/g, "");
      if (value.length >= 2) {
        value = value.substring(0, 2) + "/" + value.substring(2, 4);
      }
      if (value.length > 5) value = value.substring(0, 5);
    }

    // CVV limit
    if (name === "cvv") {
      value = value.replace(/\D/g, "").substring(0, 3);
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const monthlySavings = billingCycle === "quarterly" ? 30 : 0;

  return (
    <div className="min-h-screen bm-page-bg">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <a
          href="/pricing"
          className="inline-flex items-center text-gray-600 hover:text-[#1e3a8a] mb-6 font-medium transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Pricing
        </a>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left side - Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
                <div className="flex items-center gap-2 text-green-600">
                  <Lock size={20} />
                  <span className="text-sm font-semibold">Secure</span>
                </div>
              </div>

              {/* Billing Cycle Selection */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Choose Your Plan
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setBillingCycle("monthly")}
                    className={`relative p-5 rounded-2xl border-2 transition-all ${
                      billingCycle === "monthly"
                        ? "border-[#1e3a8a] bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-bold text-gray-900 text-lg">
                        Monthly
                      </div>
                      <div className="text-2xl font-extrabold text-[#1e3a8a] mt-1">
                        $99<span className="text-sm text-gray-500">/mo</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        Billed monthly
                      </div>
                    </div>
                    {billingCycle === "monthly" && (
                      <CheckCircle2
                        className="absolute top-4 right-4 text-[#1e3a8a]"
                        size={24}
                      />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setBillingCycle("quarterly")}
                    className={`relative p-5 rounded-2xl border-2 transition-all ${
                      billingCycle === "quarterly"
                        ? "border-[#1e3a8a] bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <Zap size={12} />
                      Save 10%
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-gray-900 text-lg">
                        3 Months
                      </div>
                      <div className="text-2xl font-extrabold text-[#1e3a8a] mt-1">
                        $267<span className="text-sm text-gray-500">/3mo</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        $89/mo · Save $30
                      </div>
                    </div>
                    {billingCycle === "quarterly" && (
                      <CheckCircle2
                        className="absolute top-4 right-4 text-[#1e3a8a]"
                        size={24}
                      />
                    )}
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">
                      Card Information
                    </h3>
                    <div className="flex gap-2">
                      <img
                        src="https://js.stripe.com/v3/fingerprinted/img/visa-729c05c240c4bdb47b03ac81d9945bfe.svg"
                        alt="Visa"
                        className="h-6"
                      />
                      <img
                        src="https://js.stripe.com/v3/fingerprinted/img/mastercard-4d8844094130711885b5e41b28c9848f.svg"
                        alt="Mastercard"
                        className="h-6"
                      />
                      <img
                        src="https://js.stripe.com/v3/fingerprinted/img/amex-a49b82f46c5cd6a96a6e418a6ca1717c.svg"
                        alt="Amex"
                        className="h-6"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Card Number
                      </label>
                      <div className="relative">
                        <CreditCard
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                        <input
                          type="text"
                          name="cardNumber"
                          required
                          value={formData.cardNumber}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none transition-all"
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          name="expiry"
                          required
                          value={formData.expiry}
                          onChange={handleChange}
                          className="w-full px-4 py-3.5 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none transition-all"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          CVC
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          required
                          value={formData.cvv}
                          onChange={handleChange}
                          className="w-full px-4 py-3.5 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none transition-all"
                          placeholder="123"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start space-x-3">
                  <Lock
                    className="text-blue-600 flex-shrink-0 mt-0.5"
                    size={20}
                  />
                  <div className="text-sm text-blue-900">
                    <p className="font-semibold mb-1">Your payment is secure</p>
                    <p className="text-blue-700">
                      Powered by Stripe. All transactions are encrypted and
                      PCI-compliant.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1e3a8a] text-white py-4 rounded-2xl font-bold text-lg hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                >
                  {loading ? "Processing..." : `Pay $${prices[billingCycle]}`}
                </button>

                <p className="text-xs text-center text-gray-500">
                  By confirming your payment, you agree to our Terms of Service
                  and Privacy Policy.
                </p>
              </form>
            </div>
          </div>

          {/* Right side - Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Professional Tier</span>
                  <span className="font-semibold text-gray-900">
                    {billingCycle === "monthly" ? "Monthly" : "3 Months"}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    ${billingCycle === "monthly" ? 99 : 297}
                  </span>
                </div>
                {billingCycle === "quarterly" && (
                  <div className="flex justify-between text-green-600">
                    <span className="font-semibold">
                      Quarterly Discount (10%)
                    </span>
                    <span className="font-bold">-$30</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between text-xl font-black text-gray-900 mb-6">
                <span>Total</span>
                <span className="text-[#1e3a8a]">${prices[billingCycle]}</span>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                <h3 className="font-bold text-gray-900 text-sm">
                  What's Included:
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2
                      size={16}
                      className="text-green-600 mt-0.5 flex-shrink-0"
                    />
                    <span>Unlimited 1-on-1 lessons</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2
                      size={16}
                      className="text-green-600 mt-0.5 flex-shrink-0"
                    />
                    <span>Personalized curriculum</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2
                      size={16}
                      className="text-green-600 mt-0.5 flex-shrink-0"
                    />
                    <span>Priority booking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2
                      size={16}
                      className="text-green-600 mt-0.5 flex-shrink-0"
                    />
                    <span>Progress tracking & certificates</span>
                  </li>
                </ul>
              </div>

              {billingCycle === "quarterly" && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
                  <div className="text-green-700 font-bold text-lg">
                    🎉 You're saving $30!
                  </div>
                  <div className="text-green-600 text-sm mt-1">
                    That's like getting 10 days free
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
