import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import useAuth from "@/utils/useAuth";
import useUser from "@/utils/useUser";
import { apiFetch } from "@/utils/apiClient";
import { routeForRole } from "@/utils/roleRoutes";

export default function SignInPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [resendStatus, setResendStatus] = useState("");
  const [resendError, setResendError] = useState("");
  const [isResending, setIsResending] = useState(false);

  const { signInWithCredentials } = useAuth();
  const { data: user } = useUser();
  const navigate = useNavigate();

  const hasRedirected = useRef(false);
  const userRole = user?.role;

  useEffect(() => {
    if (!userRole || hasRedirected.current) {
      return;
    }
    hasRedirected.current = true;
    navigate(routeForRole(userRole), { replace: true });
  }, [navigate, userRole]);

  const validateForm = () => {
    const errors = {};

    if (!email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email";
    }

    if (!password) {
      errors.password = "Password is required";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      await signInWithCredentials({
        email,
        password,
        redirect: true,
      });
    } catch (err) {
      setError("Incorrect email or password. Please check and try again.");
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (isResending) return;
    setIsResending(true);
    setResendStatus("");
    setResendError("");

    try {
      const response = await apiFetch("/auth/resend-verification", {
        method: "POST",
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.error || "Failed to resend verification email");
      }

      setResendStatus("Verification email sent. Please check your inbox.");
    } catch (resendFailure) {
      console.error("Resend verification failed:", resendFailure);
      setResendError(
        resendFailure?.message ||
          "Unable to resend verification email right now."
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bm-page-bg p-4">
      <div className="w-full max-w-md bm-card bm-card-elevated p-8 sm:p-12">
        <div className="text-center mb-10">
          <div className="inline-flex w-12 h-12 bg-[#1e3a8a] rounded-xl items-center justify-center mb-4">
            <span className="text-white font-bold text-2xl">P</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Welcome Back
          </h1>
          <p className="text-gray-500 mt-2">
            Sign in to continue your English journey
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
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <a
                href="/account/forgot-password"
                className="text-sm font-medium text-[#1e3a8a] hover:underline"
              >
                Forgot password?
              </a>
            </div>
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
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a] cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                Remember me for 30 days
              </span>
            </label>
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
            {loading ? "Signing in..." : "Log In"}
          </button>

          <p className="text-center text-gray-600 font-medium">
            New here?{" "}
            <a
              href="/account/signup"
              className="text-[#1e3a8a] font-bold hover:underline"
            >
              Create an account
            </a>
          </p>
        </form>

        {user?.email_verified === false && (
          <div className="mt-6 text-center">
            <button
              onClick={handleResendVerification}
              disabled={isResending}
              className="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-2xl font-semibold hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              {isResending ? "Sending..." : "Resend verification email"}
            </button>
            {resendStatus && (
              <p className="text-sm text-green-700 mt-3">{resendStatus}</p>
            )}
            {resendError && (
              <p className="text-sm text-red-600 mt-3">{resendError}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
