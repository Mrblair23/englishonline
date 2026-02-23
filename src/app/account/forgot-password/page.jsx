import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email) {
      setError("Please enter your email address");
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const API_BASE = import.meta.env.PROD
        ? "/api"
        : "http://localhost:4000";

      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 429) {
        setError("Too many requests. Please wait a few minutes and try again.");
        return;
      }

      if (!res.ok) {
        setError(data?.error || "Something went wrong. Please try again.");
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError("Unable to connect. Please check your internet and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bm-page-bg p-4">
        <div className="w-full max-w-md bm-card bm-card-elevated p-8 sm:p-12 text-center">
          <div className="inline-flex w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-6">
            <span className="text-4xl">✉️</span>
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
            Check Your Email
          </h1>

          <p className="text-gray-600 mb-2">
            We've sent a password reset link to:
          </p>
          <p className="text-[#1e3a8a] font-bold text-lg mb-6">{email}</p>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6 text-left">
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong className="text-gray-900">Didn't receive it?</strong>
              <br />• Check your spam/junk folder
              <br />• Make sure you entered the correct email
              <br />• Link expires in 24 hours
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                setSuccess(false);
                setLoading(false);
                setError(null);
              }}
              disabled={loading}
              className="w-full bg-[#1e3a8a] text-white py-4 rounded-2xl font-bold text-lg hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? "Sending..." : "Resend Reset Link"}
            </button>

            <a
              href="/account/signin"
              className="block w-full py-4 rounded-2xl font-bold text-lg text-gray-700 hover:bg-gray-50 transition-all"
            >
              Back to Sign In
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bm-page-bg p-4">
      <div className="w-full max-w-md bm-card bm-card-elevated p-8 sm:p-12">
        <div className="text-center mb-10">
          <div className="inline-flex w-12 h-12 bg-[#1e3a8a] rounded-xl items-center justify-center mb-4">
            <span className="text-white font-bold text-2xl">🔑</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Forgot Password?
          </h1>
          <p className="text-gray-500 mt-2">
            No worries! Enter your email and we'll send you a reset link
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              placeholder="name@example.com"
              className={`w-full px-5 py-3.5 bg-gray-50 border ${
                error ? "border-red-300 ring-2 ring-red-100" : "border-gray-200"
              } rounded-2xl focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none transition-all`}
            />
            {error && (
              <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                <span>⚠️</span> {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1e3a8a] text-white py-4 rounded-2xl font-bold text-lg hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          <p className="text-center text-gray-600 font-medium">
            Remember your password?{" "}
            <a
              href="/account/signin"
              className="text-[#1e3a8a] font-bold hover:underline"
            >
              Sign in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
