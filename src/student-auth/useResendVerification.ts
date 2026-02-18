import { useCallback, useState } from "react";
import { api } from "@/lib/api";

type ResendVerificationResponse = {
  success?: boolean;
  message?: string;
};

type ResendAction = (email: string) => Promise<ResendVerificationResponse | null>;

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "string") return error;
  if (error && typeof error === "object") {
    if ("message" in error && typeof error.message === "string") return error.message;
    if ("error" in error && typeof error.error === "string") return error.error;
  }
  return "Unable to resend verification email. Please try again.";
};

export function useResendVerification(): {
  resend: ResendAction;
  loading: boolean;
  error: string | null;
} {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const resend = useCallback<ResendAction>(async (email) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api<ResendVerificationResponse>("/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        auth: false,
      });

      return response ?? null;
    } catch (err: unknown) {
      setError(getErrorMessage(err));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { resend, loading, error };
}
