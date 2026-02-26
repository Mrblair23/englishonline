import { useState, useEffect } from "react";
import {
  Star,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  FileImage,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { useLanguage } from "@/utils/useLanguage";
import { apiFetch } from "@/utils/apiClient";
import useUser from "@/utils/useUser";

const STATUS_CONFIG = {
  pending: {
    icon: Clock,
    colorClass: "text-yellow-600 bg-yellow-50 border-yellow-200",
    badgeClass: "bg-yellow-100 text-yellow-700",
    labelEn: "Pending Review",
    labelEs: "En Revisión",
  },
  approved: {
    icon: CheckCircle,
    colorClass: "text-green-600 bg-green-50 border-green-200",
    badgeClass: "bg-green-100 text-green-700",
    labelEn: "Approved",
    labelEs: "Aprobado",
  },
  rejected: {
    icon: XCircle,
    colorClass: "text-red-600 bg-red-50 border-red-200",
    badgeClass: "bg-red-100 text-red-700",
    labelEn: "Rejected",
    labelEs: "Rechazado",
  },
};

export function PaymentsTab() {
  const { language } = useLanguage();
  const t = (tr) => tr[language] || tr.en;
  const { data: user } = useUser();
  const planKey = user?.subscription_plan_key;

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiFetch("/api/payment-requests/my");
        if (res.ok) {
          const data = await res.json();
          setRequests(data.paymentRequests || []);
        }
      } catch (err) {
        console.error("Failed to fetch payment requests:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const latestPending = requests.find((r) => r.status === "pending");
  const latestRejected = requests.find((r) => r.status === "rejected");

  return (
    <div className="space-y-6">
      {/* Current Plan Card */}
      <div className="bg-gradient-to-br from-white to-[#FAF9F7] rounded-2xl p-6 sm:p-8 border border-gray-200/50 shadow-lg">
        <h2 className="font-poppins text-2xl sm:text-3xl font-semibold text-[#1F2A44] mb-6 leading-tight">
          {t({ en: "Payments & Plan", es: "Pagos y Plan" })}
        </h2>

        <div className="flex items-center justify-between p-5 bg-gradient-to-r from-[#3FA9A6] to-[#2d8a87] rounded-xl text-white mb-6 shadow-lg">
          <div>
            <h3 className="font-poppins text-lg font-semibold mb-1 leading-tight">
              {planKey
                ? planKey.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
                : t({ en: "No active plan", es: "Sin plan activo" })}
            </h3>
            {user?.subscription_expires_at && (
              <p className="text-white/70 text-sm leading-relaxed">
                {t({ en: "Renews", es: "Renueva" })}{" "}
                {new Date(user.subscription_expires_at).toLocaleDateString()}
              </p>
            )}
            {user?.subscription_status && (
              <p className="text-white/80 text-xs mt-1 capitalize">
                {t({ en: "Status:", es: "Estado:" })}{" "}
                {user.subscription_status === "pending_manual_activation"
                  ? t({ en: "Pending Approval", es: "Pendiente de Aprobación" })
                  : user.subscription_status.replace(/_/g, " ")}
              </p>
            )}
          </div>
          <Star size={32} fill="currentColor" />
        </div>

        {/* Pending payment banner */}
        {latestPending && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4 flex items-start gap-3">
            <Clock size={20} className="text-yellow-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-yellow-800 text-sm">
                {t({ en: "Payment under review", es: "Pago en revisión" })}
              </p>
              <p className="text-yellow-700 text-xs mt-0.5">
                {t({
                  en: "Your payment proof has been received and is being reviewed. You'll receive an email once approved.",
                  es: "Tu comprobante de pago fue recibido y está siendo revisado. Recibirás un correo cuando sea aprobado.",
                })}
              </p>
            </div>
          </div>
        )}

        {/* Rejected payment — allow resubmission */}
        {!latestPending && latestRejected && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 flex items-start gap-3">
            <XCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-800 text-sm">
                {t({ en: "Last payment was not approved", es: "El último pago no fue aprobado" })}
              </p>
              {latestRejected.admin_note && (
                <p className="text-red-700 text-xs mt-0.5 italic">"{latestRejected.admin_note}"</p>
              )}
              <a
                href="/choose-plan"
                className="inline-flex items-center gap-1 text-red-700 font-medium text-xs mt-2 hover:underline"
              >
                <RefreshCw size={12} />
                {t({ en: "Try again", es: "Intentar de nuevo" })}
              </a>
            </div>
          </div>
        )}

        <a
          href="/choose-plan"
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#F2B705] to-[#f5c642] text-[#1F2A44] px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:brightness-105 hover:scale-105 transition-all"
        >
          <TrendingUp size={20} />
          <span>{t({ en: "Upgrade or change plan", es: "Mejorar o cambiar plan" })}</span>
        </a>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/50 shadow-lg">
        <h3 className="font-poppins text-lg font-semibold text-[#1F2A44] mb-4">
          {t({ en: "Payment History", es: "Historial de Pagos" })}
        </h3>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3FA9A6]" />
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <FileImage size={32} className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm">{t({ en: "No payment records yet", es: "Aún no hay registros de pago" })}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((req) => {
              const cfg = STATUS_CONFIG[req.status] || STATUS_CONFIG.pending;
              const StatusIcon = cfg.icon;
              return (
                <div
                  key={req.id}
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cfg.colorClass} border`}>
                    <StatusIcon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1F2A44] truncate">
                      {req.plan_name || req.plan_slug || t({ en: "Payment", es: "Pago" })}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(req.created_at).toLocaleDateString()} —{" "}
                      ${Number(req.amount).toFixed(2)} USD
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.badgeClass}`}>
                      {t({ en: cfg.labelEn, es: cfg.labelEs })}
                    </span>
                    {req.proof_url && (
                      <a
                        href={req.proof_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-[#3FA9A6] transition-colors"
                        title={t({ en: "View proof", es: "Ver comprobante" })}
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
