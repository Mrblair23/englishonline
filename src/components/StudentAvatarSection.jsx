import { useState, useRef } from "react";
import { useLanguage } from "@/utils/useLanguage";
import { apiFetch } from "@/utils/apiClient";
import {
  Camera,
  Upload,
  Sparkles,
  Lock,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ImagePlus,
  X,
} from "lucide-react";
import { Link } from "react-router";

/**
 * StudentAvatarSection
 *
 * Props:
 *  - user: the full user object from useUser
 *  - onAvatarChanged: () => void  — callback after successful upload (call refetch)
 */
export default function StudentAvatarSection({ user, onAvatarChanged }) {
  const { language } = useLanguage();
  const t = (tr) => tr[language] || tr.en;

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const [mode, setMode] = useState("photo"); // 'photo' | 'ai'
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // ── Eligibility ──────────────────────────────────────────────────
  const isActive =
    user.hasPaid === true || user.subscription_status === "active";

  // Check if already used this cycle
  const hasUsedThisCycle = (() => {
    if (!user.avatarLastGeneratedAt || !user.avatarUnlockUntil) return false;
    const lastChange = new Date(user.avatarLastGeneratedAt);
    const unlockUntil = new Date(user.avatarUnlockUntil);
    // Cycle start = unlockUntil - 30 days
    const cycleStart = new Date(unlockUntil.getTime() - 30 * 24 * 60 * 60 * 1000);
    return lastChange >= cycleStart;
  })();

  const isEligible = isActive && !hasUsedThisCycle;

  // Current avatar
  const avatarUrl = user.profileAvatarUrl || user.imageUrl;
  const avatarType = user.profileAvatarType || "photo";

  // ── File handling ────────────────────────────────────────────────
  function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setError(t({ en: "Please select a JPEG, PNG, or WebP image.", es: "Selecciona una imagen JPEG, PNG o WebP." }));
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError(t({ en: "Image must be under 10 MB.", es: "La imagen debe ser menor a 10 MB." }));
      return;
    }

    setError(null);
    setSuccess(null);
    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (ev) => setPreviewUrl(ev.target.result);
    reader.readAsDataURL(file);
  }

  function clearSelection() {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    setSuccess(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  }

  // ── Upload ───────────────────────────────────────────────────────
  async function handleUpload() {
    if (!selectedFile) return;
    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append("photo", selectedFile);

      const endpoint =
        mode === "ai" ? "/users/me/ai-avatar" : "/users/me/profile-photo";

      // apiFetch sets Content-Type to application/json by default;
      // for multipart we need to let the browser set it
      const token =
        typeof window !== "undefined"
          ? JSON.parse(localStorage.getItem("eo_auth") || "{}")?.token
          : null;

      const API_BASE = import.meta.env.PROD
        ? "/api"
        : "http://localhost:4000";

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setSuccess(
        mode === "ai"
          ? t({ en: "AI avatar generated! ✨", es: "¡Avatar IA generado! ✨" })
          : t({ en: "Photo updated! ✨", es: "¡Foto actualizada! ✨" })
      );
      clearSelection();
      onAvatarChanged?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  // ── Hidden file inputs ───────────────────────────────────────────
  const fileInputs = (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileSelect}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        capture="user"
        className="hidden"
        onChange={handleFileSelect}
      />
    </>
  );

  // ── LOCKED STATE (not eligible) ──────────────────────────────────
  if (!isEligible) {
    return (
      <div className="bm-card bm-card-elevated bm-card-pad-lg">
        {fileInputs}
        <div className="flex flex-col items-center text-center space-y-5">
          {/* Avatar display */}
          <div className="relative">
            <div className="w-[120px] h-[120px] rounded-full bg-gray-100 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-gray-300">
                  {(user.displayName || user.name)?.[0]?.toUpperCase() || "?"}
                </span>
              )}
            </div>
            {/* Lock overlay */}
            <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center">
              <Lock className="text-white" size={28} />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-gray-900">
              {t({ en: "Profile Image", es: "Imagen de perfil" })}
            </h3>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
              {hasUsedThisCycle
                ? t({
                    en: "You've already updated your profile image this cycle. It will unlock again next payment period.",
                    es: "Ya actualizaste tu imagen de perfil en este ciclo. Se desbloqueará en el próximo período de pago.",
                  })
                : t({
                    en: "Profile image (Photo or AI Avatar) is included with active membership and unlocks after payment.",
                    es: "La imagen de perfil (Foto o Avatar IA) está incluida con la membresía activa y se desbloquea después del pago.",
                  })}
            </p>
          </div>

          {!isActive && (
            <Link
              to="/choose-plan"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#F2B705] to-[#f5c642] text-[#1F2A44] px-6 py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg hover:brightness-105 transition-all"
            >
              <Sparkles size={16} />
              {t({ en: "View Plans", es: "Ver planes" })}
            </Link>
          )}
        </div>
      </div>
    );
  }

  // ── ELIGIBLE STATE ───────────────────────────────────────────────
  return (
    <div className="bm-card bm-card-elevated bm-card-pad-lg">
      {fileInputs}

      <div className="flex flex-col items-center text-center space-y-6">
        {/* Current avatar */}
        <div className="relative group">
          <div className="w-[120px] h-[120px] rounded-full bg-gray-100 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            ) : avatarUrl ? (
              <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl font-bold text-[#1e3a8a]">
                {(user.displayName || user.name)?.[0]?.toUpperCase() || "?"}
              </span>
            )}
          </div>

          {avatarType === "ai" && avatarUrl && !previewUrl && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
              AI
            </span>
          )}
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-bold text-gray-900">
            {t({ en: "Profile Image", es: "Imagen de perfil" })}
          </h3>
          <p className="text-xs text-gray-400">
            {t({ en: "512×512px · JPEG, PNG, or WebP", es: "512×512px · JPEG, PNG o WebP" })}
          </p>
        </div>

        {/* Mode toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1 w-full max-w-xs">
          <button
            type="button"
            onClick={() => { setMode("photo"); clearSelection(); }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              mode === "photo"
                ? "bg-white text-[#1e3a8a] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <ImagePlus size={15} />
            {t({ en: "Photo", es: "Foto" })}
          </button>
          <button
            type="button"
            onClick={() => { setMode("ai"); clearSelection(); }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              mode === "ai"
                ? "bg-white text-purple-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Sparkles size={15} />
            {t({ en: "AI Avatar", es: "Avatar IA" })}
          </button>
        </div>

        {/* Mode description */}
        <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
          {mode === "ai"
            ? t({
                en: "Upload a selfie and we'll generate a professional cartoon avatar using AI.",
                es: "Sube una selfie y generaremos un avatar de caricatura profesional usando IA.",
              })
            : t({
                en: "Upload a photo and it will be cropped to a 512×512 square.",
                es: "Sube una foto y se recortará a un cuadrado de 512×512.",
              })}
        </p>

        {/* Action buttons (when no file selected) */}
        {!selectedFile && !uploading && (
          <div className="flex gap-3 w-full max-w-xs">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold text-sm transition-all"
            >
              <Upload size={16} />
              {t({ en: "Upload", es: "Subir" })}
            </button>
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold text-sm transition-all"
            >
              <Camera size={16} />
              {t({ en: "Camera", es: "Cámara" })}
            </button>
          </div>
        )}

        {/* Preview + confirm */}
        {selectedFile && !uploading && (
          <div className="flex gap-3 w-full max-w-xs">
            <button
              type="button"
              onClick={clearSelection}
              className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all"
            >
              <X size={16} />
              {t({ en: "Cancel", es: "Cancelar" })}
            </button>
            <button
              type="button"
              onClick={handleUpload}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg hover:brightness-105 transition-all text-white ${
                mode === "ai"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500"
                  : "bg-gradient-to-r from-[#3FA9A6] to-[#2d8a87]"
              }`}
            >
              {mode === "ai" ? <Sparkles size={16} /> : <CheckCircle2 size={16} />}
              {mode === "ai"
                ? t({ en: "Generate AI", es: "Generar IA" })
                : t({ en: "Save Photo", es: "Guardar foto" })}
            </button>
          </div>
        )}

        {/* Loading state */}
        {uploading && (
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={28} className="animate-spin text-[#3FA9A6]" />
            <p className="text-sm font-medium text-gray-500">
              {mode === "ai"
                ? t({ en: "Generating your AI avatar...", es: "Generando tu avatar IA..." })
                : t({ en: "Uploading photo...", es: "Subiendo foto..." })}
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium w-full max-w-xs">
            <AlertTriangle size={16} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium w-full max-w-xs">
            <CheckCircle2 size={16} className="flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}
      </div>
    </div>
  );
}
