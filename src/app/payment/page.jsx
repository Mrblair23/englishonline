import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import Header from "@/components/Header";
import { apiFetch } from "@/utils/apiClient";
import { useLanguage } from "@/utils/useLanguage";
import { ArrowLeft, CreditCard, CheckCircle, Copy } from "lucide-react";

export default function PaymentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planKey = searchParams.get("plan");
  const planName = searchParams.get("name") || planKey;
  const planPrice = searchParams.get("price") || "";
  const { language } = useLanguage();

  const t = (translations) => translations[language] || translations.en;

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const zelleEmail = "admin@englishonline.com";

  const copyEmail = () => {
    navigator.clipboard.writeText(zelleEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaid = async () => {
    setLoading(true);
    try {
      const response = await apiFetch("/subscription/request-activation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan_key: planKey }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to request activation");
      }

      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 2500);
    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bm-page-bg">
        <Header />
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="bg-white rounded-3xl shadow-lg p-8 sm:p-12 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-green-500" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-[#1F2A44] mb-3">
              {t({ en: "Payment Submitted!", es: "¡Pago Enviado!" })}
            </h2>
            <p className="text-gray-600">
              {t({
                en: "We're reviewing your payment. You'll be notified once your plan is activated.",
                es: "Estamos revisando tu pago. Te notificaremos cuando tu plan esté activado.",
              })}
            </p>
            <p className="text-sm text-gray-400 mt-4">
              {t({ en: "Redirecting to dashboard...", es: "Redirigiendo al panel..." })}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bm-page-bg">
      <Header />

      <div className="flex flex-col items-center py-12 sm:py-16 px-4">
        {/* Back button */}
        <div className="max-w-md w-full mb-6">
          <button
            onClick={() => navigate("/choose-plan")}
            className="inline-flex items-center text-gray-500 hover:text-[#3FA9A6] transition-colors"
          >
            <ArrowLeft size={18} className="mr-1" />
            <span className="text-sm font-medium">
              {t({ en: "Back to plans", es: "Volver a planes" })}
            </span>
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 max-w-md w-full">
          {/* Plan summary */}
          <div className="bg-[#3FA9A6]/5 border border-[#3FA9A6]/20 rounded-2xl p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">
              {t({ en: "Selected Plan", es: "Plan Seleccionado" })}
            </p>
            <h3 className="text-xl font-bold text-[#1F2A44]">{planName}</h3>
            {planPrice && (
              <p className="text-[#3FA9A6] font-semibold mt-1">
                {planPrice} / {t({ en: "month", es: "mes" })}
              </p>
            )}
          </div>

          <h2 className="text-xl font-bold text-[#1F2A44] mb-4 flex items-center gap-2">
            <CreditCard size={22} />
            {t({ en: "Payment Instructions", es: "Instrucciones de Pago" })}
          </h2>

          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
              <div>
                <p className="text-sm text-gray-500">
                  {t({ en: "Send payment via Zelle to:", es: "Envía el pago por Zelle a:" })}
                </p>
                <p className="font-bold text-[#1F2A44] mt-1">{zelleEmail}</p>
              </div>
              <button
                onClick={copyEmail}
                className="text-[#3FA9A6] hover:text-[#2d8a87] p-2 rounded-lg hover:bg-[#3FA9A6]/10 transition-all"
                title="Copy email"
              >
                {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
              </button>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-sm text-yellow-800">
                {t({
                  en: "💡 Include your email in the Zelle note so we can match your payment.",
                  es: "💡 Incluye tu correo en la nota de Zelle para que podamos identificar tu pago.",
                })}
              </p>
            </div>
          </div>

          <button
            onClick={handlePaid}
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#3FA9A6] to-[#2d8a87] hover:brightness-110 text-white py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-md disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
          >
            {loading
              ? t({ en: "Submitting...", es: "Enviando..." })
              : t({ en: "I've Paid ✓", es: "Ya Pagué ✓" })}
          </button>

          <p className="text-xs text-gray-400 text-center mt-4">
            {t({
              en: "Your plan will be activated once we confirm your payment.",
              es: "Tu plan será activado una vez confirmemos tu pago.",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
