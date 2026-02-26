import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useRef } from "react";
import Header from "@/components/Header";
import { apiFetch } from "@/utils/apiClient";
import { useLanguage } from "@/utils/useLanguage";
import {
  ArrowLeft,
  CreditCard,
  CheckCircle,
  Copy,
  Upload,
  FileImage,
  X,
  Shield,
  Clock,
  Mail,
} from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];

export default function PaymentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planSlug = searchParams.get("plan");
  const planName = searchParams.get("name") || planSlug;
  const planPrice = searchParams.get("price") || "";
  const { language } = useLanguage();

  const t = (tr) => tr[language] || tr.en;

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const zelleEmail = "admin@englishonline.com";

  // Extract numeric price from string like "$80"
  const numericPrice = parseFloat((planPrice || "0").replace(/[^0-9.]/g, "")) || 0;

  const copyEmail = () => {
    navigator.clipboard.writeText(zelleEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileSelect = (selectedFile) => {
    setError("");
    if (!selectedFile) return;

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setError(t({ en: "Only JPG, PNG, or PDF files are allowed.", es: "Solo se permiten archivos JPG, PNG o PDF." }));
      return;
    }
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError(t({ en: "File must be under 5 MB.", es: "El archivo debe ser menor a 5 MB." }));
      return;
    }

    setFile(selectedFile);

    // Preview for images
    if (selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null); // PDF — no preview
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer?.files?.[0];
    if (droppedFile) handleFileSelect(droppedFile);
  };

  const handlePaid = async () => {
    if (!file) {
      setError(t({ en: "Please upload your payment proof.", es: "Por favor sube tu comprobante de pago." }));
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("proof", file);
      formData.append("plan_slug", planSlug || "");
      formData.append("plan_name", planName || "");
      formData.append("amount", numericPrice.toString());

      const stored = localStorage.getItem("eo_auth");
      const token = stored ? JSON.parse(stored)?.token : null;

      const baseUrl = import.meta.env.DEV ? "http://localhost:4000" : "";
      const response = await fetch(`${baseUrl}/api/payment-requests`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        if (err.error === "PENDING_EXISTS") {
          throw new Error(t({
            en: "You already have a pending payment. Please wait for review.",
            es: "Ya tienes un pago pendiente. Espera la revisión.",
          }));
        }
        throw new Error(err.error || err.message || "Failed to submit payment");
      }

      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 3000);
    } catch (err) {
      console.error(err);
      setError(err.message || t({ en: "Something went wrong.", es: "Algo salió mal." }));
    } finally {
      setLoading(false);
    }
  };

  /* ── Success screen ── */
  if (success) {
    return (
      <div className="min-h-screen bm-page-bg">
        <Header />
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle className="text-green-500" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-[#1F2A44] mb-3">
              {t({ en: "Payment Submitted!", es: "¡Pago Enviado!" })}
            </h2>
            <p className="text-gray-600 mb-2">
              {t({
                en: "We've received your payment proof and it's being reviewed.",
                es: "Hemos recibido tu comprobante de pago y está siendo revisado.",
              })}
            </p>
            <div className="bg-blue-50 rounded-xl p-4 mt-4 mb-4">
              <div className="flex items-center gap-2 text-blue-700 font-medium text-sm">
                <Mail size={16} />
                {t({
                  en: "Check your email for a confirmation.",
                  es: "Revisa tu correo para una confirmación.",
                })}
              </div>
            </div>
            <div className="flex items-center gap-2 justify-center text-sm text-gray-400">
              <Clock size={14} />
              {t({ en: "Usually approved within 24 hours", es: "Generalmente aprobado en menos de 24 horas" })}
            </div>
            <p className="text-sm text-gray-400 mt-4">
              {t({ en: "Redirecting to dashboard...", es: "Redirigiendo al panel..." })}
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ── Main payment page ── */
  return (
    <div className="min-h-screen bm-page-bg">
      <Header />

      <div className="flex flex-col items-center py-10 sm:py-16 px-4">
        {/* Back button */}
        <div className="max-w-lg w-full mb-6">
          <button
            onClick={() => navigate("/choose-plan")}
            className="inline-flex items-center text-gray-500 hover:text-[#3FA9A6] transition-colors group"
          >
            <ArrowLeft size={18} className="mr-1 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">
              {t({ en: "Back to plans", es: "Volver a planes" })}
            </span>
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 max-w-lg w-full">
          {/* Plan summary */}
          <div className="bg-gradient-to-r from-[#3FA9A6]/10 to-[#3FA9A6]/5 border border-[#3FA9A6]/20 rounded-2xl p-5 mb-6">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">
              {t({ en: "Selected Plan", es: "Plan Seleccionado" })}
            </p>
            <h3 className="text-xl font-bold text-[#1F2A44]">{planName}</h3>
            {planPrice && (
              <p className="text-2xl font-bold text-[#3FA9A6] mt-1">
                {planPrice} <span className="text-sm font-normal text-gray-400">USD / {t({ en: "month", es: "mes" })}</span>
              </p>
            )}
          </div>

          {/* Step 1: Payment instructions */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#1F2A44] mb-3 flex items-center gap-2">
              <div className="w-7 h-7 bg-[#3FA9A6] text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              {t({ en: "Send Payment", es: "Enviar Pago" })}
            </h2>

            <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div>
                <p className="text-sm text-gray-500">
                  {t({ en: "Send via Zelle to:", es: "Envía por Zelle a:" })}
                </p>
                <p className="font-bold text-[#1F2A44] mt-0.5">{zelleEmail}</p>
              </div>
              <button
                onClick={copyEmail}
                className="text-[#3FA9A6] hover:text-[#2d8a87] p-2.5 rounded-xl hover:bg-[#3FA9A6]/10 transition-all"
                title="Copy email"
              >
                {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
              </button>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mt-3">
              <p className="text-sm text-yellow-800">
                💡 {t({
                  en: "Include your email address in the Zelle note.",
                  es: "Incluye tu correo electrónico en la nota de Zelle.",
                })}
              </p>
            </div>
          </div>

          {/* Step 2: Upload proof */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#1F2A44] mb-3 flex items-center gap-2">
              <div className="w-7 h-7 bg-[#F2B705] text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              {t({ en: "Upload Payment Proof", es: "Subir Comprobante de Pago" })}
            </h2>

            {!file ? (
              <div
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  dragOver
                    ? "border-[#3FA9A6] bg-[#3FA9A6]/5"
                    : "border-gray-200 hover:border-[#3FA9A6]/50 hover:bg-gray-50"
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                <Upload size={32} className="mx-auto text-gray-300 mb-3" />
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {t({
                    en: "Click to upload or drag & drop",
                    es: "Haz clic para subir o arrastra y suelta",
                  })}
                </p>
                <p className="text-xs text-gray-400">
                  JPG, PNG {t({ en: "or", es: "o" })} PDF — {t({ en: "max 5 MB", es: "máx 5 MB" })}
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files?.[0])}
                />
              </div>
            ) : (
              <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50">
                <div className="flex items-center gap-3">
                  {preview ? (
                    <img src={preview} alt="proof" className="w-16 h-16 rounded-xl object-cover border border-gray-200" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-red-50 flex items-center justify-center border border-red-100">
                      <FileImage size={24} className="text-red-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1F2A44] truncate">{file.name}</p>
                    <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(0)} KB</p>
                  </div>
                  <button
                    onClick={removeFile}
                    className="p-2 hover:bg-red-50 rounded-xl transition-colors text-gray-400 hover:text-red-500"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 mb-4 text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handlePaid}
            disabled={loading || !file}
            className="w-full bg-gradient-to-r from-[#3FA9A6] to-[#2d8a87] hover:brightness-110 text-white py-4 rounded-xl font-semibold text-lg transition-all hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100 cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                {t({ en: "Submitting...", es: "Enviando..." })}
              </>
            ) : (
              <>
                <CheckCircle size={20} />
                {t({ en: "I've Paid — Submit Proof", es: "Ya Pagué — Enviar Comprobante" })}
              </>
            )}
          </button>

          {/* Trust footer */}
          <div className="flex items-center justify-center gap-4 mt-5 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Shield size={12} />
              {t({ en: "Secure upload", es: "Subida segura" })}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {t({ en: "Reviewed within 24h", es: "Revisado en 24h" })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
