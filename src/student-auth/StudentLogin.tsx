import { useState } from "react";
import type { FormEvent } from "react";
import { useResendVerification } from "./useResendVerification";
import { useStudentLogin } from "./useStudentLogin";
import type { LoginResponse } from "./types";

export function StudentLogin(): JSX.Element {
  const { login, loading, error } = useStudentLogin();
  const { resend, loading: resendLoading, error: resendError } = useResendVerification();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [response, setResponse] = useState<LoginResponse | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState<string>("");
  const [resendSuccess, setResendSuccess] = useState<boolean>(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const trimmedEmail = email.trim();

    setSubmittedEmail(trimmedEmail);
    setResponse(null);
    setResendSuccess(false);
    setResendMessage(null);

    const result = await login(trimmedEmail, password);
    setResponse(result);
  };

  const handleResend = async (): Promise<void> => {
    if (!submittedEmail) return;

    setResendSuccess(false);
    setResendMessage(null);

    const result = await resend(submittedEmail);
    if (result?.success === true) {
      setResendSuccess(true);
      setResendMessage(result.message ?? null);
    } else if (result) {
      setResendMessage(result.message ?? "Unable to resend verification email.");
    }
  };

  const verificationRequired =
    response?.requiresEmailVerification === true || response?.user?.emailVerified === false;

  const loginSuccess = Boolean(response?.token && response?.user?.emailVerified === true);

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 22, marginBottom: 16 }}>Student Login</h1>

      <form onSubmit={handleSubmit} aria-busy={loading}>
        <label htmlFor="login-email" style={{ display: "block", marginBottom: 6 }}>
          Email
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          disabled={loading}
          style={{ width: "100%", marginBottom: 12, padding: 8 }}
        />

        <label htmlFor="login-password" style={{ display: "block", marginBottom: 6 }}>
          Password
        </label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          disabled={loading}
          style={{ width: "100%", marginBottom: 16, padding: 8 }}
        />

        <button type="submit" disabled={loading} style={{ width: "100%", padding: 10 }}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      {error && (
        <p role="alert" style={{ color: "#b00020", marginTop: 12 }}>
          {error}
        </p>
      )}

      {response?.message && !error && (
        <p role="status" style={{ color: "#333", marginTop: 12 }}>
          {response.message}
        </p>
      )}

      {verificationRequired && (
        <div style={{ marginTop: 16 }}>
          <p role="status" style={{ color: "#333" }}>
            Your email is not verified. Please verify it before logging in.
          </p>

          <button
            type="button"
            onClick={handleResend}
            disabled={resendLoading || !submittedEmail}
            style={{ marginTop: 8, padding: 8 }}
          >
            {resendLoading ? "Resending..." : "Resend verification email"}
          </button>

          {resendError && (
            <p role="alert" style={{ color: "#b00020", marginTop: 8 }}>
              {resendError}
            </p>
          )}

          {!resendError && resendMessage && (
            <p
              role="status"
              style={{ color: resendSuccess ? "#0f6b3a" : "#b00020", marginTop: 8 }}
            >
              {resendMessage}
            </p>
          )}

          {resendSuccess && !resendMessage && (
            <p role="status" style={{ color: "#0f6b3a", marginTop: 8 }}>
              Verification email sent.
            </p>
          )}
        </div>
      )}

      {loginSuccess && (
        <p role="status" style={{ color: "#0f6b3a", marginTop: 12 }}>
          Login successful.
          {/* TODO: Navigate to the student dashboard. */}
        </p>
      )}
    </div>
  );
}
