"use client";
import { useState } from "react";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";
import useUser from "@/utils/useUser";
import { apiFetch } from "@/lib/api"; // use alias if available

export default function ResendVerificationPage() {
  const { data: user } = useUser();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");

  const handleResend = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    setMessage("");

    const emailToUse = email || user?.email;

    if (!emailToUse) {
      setStatus("error");
      setMessage("Please enter your email address");
      setLoading(false);
      return;
    }

    try {
      await apiFetch("/auth/send-verification", {
        method: "POST",
        body: {
          email: emailToUse,
          userId: user?.id || emailToUse,
        },
      });

      setStatus("success");
      setMessage(
        `Verification email sent to ${emailToUse}. Please check your inbox!`
      );
    } catch (error) {
      console.error("Error resending verification:", error);
      setStatus("error");
      setMessage(
        error.message || "Failed to send verification email"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bm-page-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full bm-card bm-card-elevated p-8">
        <div className="text-center mb-6">
          <div className="inline-flex w-16 h-16 bg-blue-100 rounded-full items-center justify-center mb-4">
            <Mail className="text-blue-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-[#1F2A44] mb-2">
            Resend Verification Email
          </h1>
          <p className="text-gray-600">
            Didn't receive the verification email? We'll send you a new one.
          </p>
        </div>

        {status === "success" ? (
          <div className="text-center">
            <CheckCircle className="text-green-500 mx-auto mb-4" size={48} />
            <p className="text-gray-700 mb-6">{message}</p>
            <div className="space-y-3">
              <a
                href="/account/signin"
                className="bm-btn-primary w-full"
              >
                Go to Sign In
              </a>
              <button
                onClick={() => {
                  setStatus("");
                  setMessage("");
                }}
                className="bm-btn-outline w-full"
              >
                Send Another
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleResend} className="space-y-4">
            {!user && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="bm-input w-full"
                  required
                />
              </div>
            )}

            {user && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="text-sm text-gray-700">
                  We'll send the verification email to:{" "}
                  <strong className="text-[#1F2A44]">{user.email}</strong>
                </p>
              </div>
            )}

            {status === "error" && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                <span>{message}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bm-btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Verification Email"}
            </button>

            <p className="text-center text-sm text-gray-600">
              <a
                href="/account/signin"
                className="text-[#3FA9A6] font-semibold hover:underline"
              >
                Back to Sign In
              </a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
