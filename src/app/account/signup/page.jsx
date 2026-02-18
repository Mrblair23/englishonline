import { useState } from "react";
import useAuth from "@/utils/useAuth";
import { apiFetch } from "@/utils/apiClient";
import { Mail } from "lucide-react";

export default function SignUpPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [showEmailSent, setShowEmailSent] = useState(false);
  const [resendStatus, setResendStatus] = useState("");
  const [resendError, setResendError] = useState("");
  const [isResending, setIsResending] = useState(false);

  const { signUpWithCredentials } = useAuth();

  const validateForm = () => {
    const errors = {};

    // Name validation
    if (!name.trim()) {
      errors.name = "Please enter your name";
    } else if (name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    // Email validation
    if (!email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      errors.password =
        "Password must include uppercase, lowercase, and number";
    }

    // Confirm password validation
    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords don't match";
    }

    // Terms agreement validation
    if (!agreedToTerms) {
      errors.terms = "You must agree to continue";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Prevent double submission
    if (loading) {
      console.log("[SIGNUP] Already processing, ignoring duplicate submit");
      return;
    }

    setLoading(true);
    setError(null);
    setFieldErrors({});

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      console.log("[SIGNUP] Creating account for:", email);

      const result = await signUpWithCredentials({
        email,
        password,
        name,
        callbackUrl: "/dashboard",
        redirect: false, // Don't redirect immediately
      });

      console.log("[SIGNUP] Account created, verification email sent by server.");
      setShowEmailSent(true);
      setLoading(false);
    } catch (err) {
      console.error("[SIGNUP] Signup error:", err);
      setError(
        err?.message ||
          "Sign ups aren't available right now. Please reach out to support to create an account."
      );
      setLoading(false);
    }
  };

  // Show email sent confirmation
  if (showEmailSent) {
    const handleResend = async () => {
      if (isResending) return;
      setIsResending(true);
      setResendStatus("");
      setResendError("");

      const trimmedEmail = email.trim();
      if (!trimmedEmail) {
        setResendError("Please enter your email address first.");
        setIsResending(false);
        return;
      }

      try {
        const response = await apiFetch("/auth/resend-verification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: trimmedEmail }),
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload?.error || "Failed to resend verification email");
        }

        setResendStatus("Verification email sent. Please check your inbox.");
      } catch (error) {
        console.error("Resend verification email failed:", error);
        setResendError(
          error?.message || "Unable to resend verification email right now."
        );
      } finally {
        setIsResending(false);
      }
    };

    return (
      <div className="flex min-h-screen w-full items-center justify-center bm-page-bg p-4">
        <div className="w-full max-w-md bm-card bm-card-elevated p-8 sm:p-12 text-center">
          <div className="inline-flex w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-6">
            <Mail className="text-green-600" size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
            Check Your Email! 📧
          </h1>
          <p className="text-gray-600 mb-6 leading-relaxed">
            We've sent a verification link to{" "}
            <strong className="text-[#1e3a8a]">{email}</strong>
          </p>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-700">
              Click the link in the email to verify your account. The link
              expires in 24 hours.
            </p>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            Didn't receive the email? Check your spam folder or{" "}
            <button
              onClick={() => setShowEmailSent(false)}
              className="text-[#1e3a8a] font-semibold hover:underline"
            >
              try again
            </button>
          </p>
          <div className="mb-6 space-y-3">
            <button
              onClick={handleResend}
              disabled={isResending}
              className="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-2xl font-semibold hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              {isResending ? "Sending..." : "Resend verification email"}
            </button>
            {resendStatus && (
              <p className="text-sm text-green-700">{resendStatus}</p>
            )}
            {resendError && (
              <p className="text-sm text-red-600">{resendError}</p>
            )}
          </div>
          <a
            href="/account/signin"
            className="inline-block w-full bg-[#1e3a8a] text-white py-4 rounded-2xl font-bold text-lg hover:brightness-110 transition-all"
          >
            Go to Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bm-page-bg p-4">
      <div className="w-full max-w-md bm-card bm-card-elevated p-8 sm:p-12">
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 bg-[#1e3a8a] rounded-xl items-center justify-center mb-4">
            <span className="text-white font-bold text-2xl">E</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">Get Started</h1>
          <p className="text-gray-500 mt-2">
            Join Be More English Online and master English
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (fieldErrors.name) {
                  setFieldErrors({ ...fieldErrors, name: null });
                }
              }}
              placeholder="John Doe"
              className={`w-full px-5 py-3.5 bg-gray-50 border ${
                fieldErrors.name
                  ? "border-red-300 ring-2 ring-red-100"
                  : "border-gray-200"
              } rounded-2xl focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none transition-all`}
            />
            {fieldErrors.name && (
              <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                <span>⚠️</span> {fieldErrors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) {
                  setFieldErrors({ ...fieldErrors, email: null });
                }
              }}
              placeholder="name@example.com"
              className={`w-full px-5 py-3.5 bg-gray-50 border ${
                fieldErrors.email
                  ? "border-red-300 ring-2 ring-red-100"
                  : "border-gray-200"
              } rounded-2xl focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none transition-all`}
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                <span>⚠️</span> {fieldErrors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) {
                  setFieldErrors({ ...fieldErrors, password: null });
                }
              }}
              placeholder="••••••••"
              className={`w-full px-5 py-3.5 bg-gray-50 border ${
                fieldErrors.password
                  ? "border-red-300 ring-2 ring-red-100"
                  : "border-gray-200"
              } rounded-2xl focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none transition-all`}
            />
            {fieldErrors.password && (
              <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                <span>⚠️</span> {fieldErrors.password}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (fieldErrors.confirmPassword) {
                  setFieldErrors({ ...fieldErrors, confirmPassword: null });
                }
              }}
              placeholder="••••••••"
              className={`w-full px-5 py-3.5 bg-gray-50 border ${
                fieldErrors.confirmPassword
                  ? "border-red-300 ring-2 ring-red-100"
                  : "border-gray-200"
              } rounded-2xl focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none transition-all`}
            />
            {fieldErrors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                <span>⚠️</span> {fieldErrors.confirmPassword}
              </p>
            )}
          </div>

          <div>
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => {
                  setAgreedToTerms(e.target.checked);
                  if (fieldErrors.terms) {
                    setFieldErrors({ ...fieldErrors, terms: null });
                  }
                }}
                className="mt-0.5 w-5 h-5 rounded border-gray-300 text-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a] cursor-pointer"
              />
              <span className="text-sm text-gray-600 leading-tight">
                I agree to Be More English Online's{" "}
                <a
                  href="/terms"
                  className="text-[#1e3a8a] font-semibold hover:underline"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  className="text-[#1e3a8a] font-semibold hover:underline"
                >
                  Privacy Policy
                </a>
              </span>
            </label>
            {fieldErrors.terms && (
              <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1 ml-8">
                <span>⚠️</span> {fieldErrors.terms}
              </p>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 flex items-start gap-2">
              <span className="text-lg">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1e3a8a] text-white py-4 rounded-2xl font-bold text-lg hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <p className="text-center text-gray-600 font-medium">
            Already have an account?{" "}
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
