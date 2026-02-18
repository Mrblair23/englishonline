import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
import { apiFetch } from "@/lib/api";

type VerifiedUser = {
  id: string;
  email: string;
  role: "student";
  emailVerified: boolean;
};

type VerifyEmailResponse = {
  success?: boolean;
  token?: string;
  user?: VerifiedUser;
  message?: string;
  error?: string;
};

type Status = "idle" | "loading" | "success" | "error";

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "string") return error;
  if (error && typeof error === "object") {
    if ("message" in error && typeof error.message === "string") return error.message;
    if ("error" in error && typeof error.error === "string") return error.error;
  }
  return "We couldn't verify your email. Please try again.";
};

const saveTokenIfVerified = (payload: VerifyEmailResponse | null): void => {
  if (!payload?.token) return;
  if (payload.user?.emailVerified !== true) return;

  if (typeof window !== "undefined") {
    window.localStorage.setItem("auth_token", payload.token);
  }
};

export default function VerifyEmailPage(): JSX.Element {
  const location = useLocation();
  const token = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("token");
  }, [location.search]);

  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    let isActive = true;

    const verify = async (): Promise<void> => {
      if (!token) {
        setStatus("error");
        setMessage("Missing or invalid verification token.");
        return;
      }

      setStatus("loading");
      setMessage("");

      try {
        const response = await apiFetch(
          `/auth/verify-email?token=${encodeURIComponent(token)}`,
          { method: "GET" }
        );

        const payload = await response
          .json()
          .catch(() => null as VerifyEmailResponse | null);

        if (!response.ok) {
          throw new Error(
            payload?.error ||
              payload?.message ||
              "We couldn't verify your email. Please try again."
          );
        }

        if (!isActive) return;

        saveTokenIfVerified(payload ?? null);
        setStatus("success");
        setMessage(payload?.message || "Email verified successfully.");
      } catch (error: unknown) {
        if (!isActive) return;
        setStatus("error");
        setMessage(getErrorMessage(error));
      }
    };

    verify();

    return () => {
      isActive = false;
    };
  }, [token]);

  return (
    <div className="min-h-screen bm-page-bg flex justify-center p-6">
      <main className="w-full max-w-[480px]">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Verify your email</h1>

        {status === "loading" && (
          <p role="status" className="text-gray-700">
            Verifying your email...
          </p>
        )}

        {status === "success" && (
          <div className="bm-card bm-card-pad">
            <p role="status" className="text-emerald-700 mb-2">
              {message}
            </p>
            <p className="text-gray-700">
              You can now proceed to login.
              {/* TODO: Add navigation to the login page when routing is finalized. */}
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="bm-card bm-card-pad">
            <p role="alert" className="text-rose-700 mb-2">
              {message || "This verification link is invalid or has expired."}
            </p>
            <p className="text-gray-700">
              Please request a new verification email and try again.
            </p>
          </div>
        )}

        {status === "idle" && !token && (
          <p role="alert" className="text-rose-700">
            Missing or invalid verification token.
          </p>
        )}
      </main>
    </div>
  );
}
