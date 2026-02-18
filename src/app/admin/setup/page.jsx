import { useState } from "react";
import { Shield, CheckCircle2 } from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function AdminSetupPage() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const createAdmin = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiFetch("/admin/create-admin", {
        method: "POST",
        body: {
          email: "admin@gmail.com",
          password: "Spiderdum99@!",
        },
      });

      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/account/signin";
      }, 3000);
    } catch (err) {
      console.error("Setup error:", err);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bm-page-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl mb-6 shadow-2xl">
            <Shield size={40} className="text-white" />
          </div>
          <h1 className="bm-page-title mb-2">Admin Setup</h1>
          <p className="bm-page-subtitle">One-time admin account creation</p>
        </div>

        <div className="bm-card bm-card-elevated p-8">
          {success ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-6">
                <CheckCircle2 size={48} className="text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Admin Account Created!
              </h2>
              <p className="text-gray-600 mb-4">Email: admin@gmail.com</p>
              <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-green-700 text-sm">
                Redirecting to sign in...
              </div>
            </div>
          ) : (
            <div className="text-center">
              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl text-sm mb-6">
                  {error}
                </div>
              )}

              <p className="text-gray-700 mb-6">
                Click the button below to create the admin account
              </p>

              <button
                onClick={createAdmin}
                disabled={loading}
                className="bm-btn-primary w-full min-h-[56px] text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Admin...</span>
                  </>
                ) : (
                  <>
                    <Shield size={20} />
                    <span>Create Admin Account</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
