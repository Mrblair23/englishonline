import { useMemo, useState } from "react";
import { useLocation } from "react-router";
import { apiFetch } from "@/utils/apiClient";

export const prerender = false;

export default function SetPasswordPage() {
  const location = useLocation();
  const token = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("token");
  }, [location.search]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;

    setError(null);

    if (!token) {
      setError("Missing or invalid setup token.");
      return;
    }

    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setBusy(true);

    try {
      const response = await apiFetch("/auth/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.error || payload?.message || "Failed to set password");
      }

      if (payload?.token) {
        window.localStorage.setItem("eo_auth", JSON.stringify({
          token: payload.token,
          user: payload.user || null,
        }));
      }

      setSuccess(true);
    } catch (err) {
      setError(err?.message || "Unable to set password right now.");
    } finally {
      setBusy(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bm-page-bg flex items-center justify-center p-4">
        <div className="w-full max-w-md bm-card bm-card-elevated p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Password set</h1>
          <p className="mt-2 text-gray-600">Your account is now active. You can sign in.</p>
          <a href="/account/signin" className="bm-btn-primary mt-6 inline-flex justify-center">
            Go to sign in
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bm-page-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md bm-card bm-card-elevated p-8">
        <h1 className="text-2xl font-bold text-gray-900">Set your password</h1>
        <p className="mt-2 text-sm text-gray-600">
          Choose a password to activate your account.
        </p>

        {error && (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block">
            <div className="mb-1 text-sm font-semibold text-gray-900">New password</div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bm-input"
              placeholder="At least 8 characters"
              autoComplete="new-password"
              disabled={busy}
              required
              minLength={8}
            />
          </label>

          <label className="block">
            <div className="mb-1 text-sm font-semibold text-gray-900">Confirm password</div>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bm-input"
              autoComplete="new-password"
              disabled={busy}
              required
              minLength={8}
            />
          </label>

          <button type="submit" className="bm-btn-primary w-full" disabled={busy}>
            {busy ? "Saving…" : "Set password"}
          </button>
        </form>
      </div>
    </div>
  );
}
