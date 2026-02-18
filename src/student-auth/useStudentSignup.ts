import { useCallback, useState } from "react";
import { api } from "@/lib/api";
import type { SignupResponse } from "./types";

type SignupAction = (email: string, password: string) => Promise<SignupResponse | null>;

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "string") return error;
  if (error && typeof error === "object") {
    if ("message" in error && typeof error.message === "string") return error.message;
    if ("error" in error && typeof error.error === "string") return error.error;
  }
  return "Unable to sign up. Please try again.";
};

const storeTokenIfVerified = (response: SignupResponse | null): void => {
  if (!response?.token) return;
  if (response.user?.emailVerified !== true) return;

  if (typeof window !== "undefined") {
    window.localStorage.setItem("auth_token", response.token);
  }
};

export function useStudentSignup(): {
  signup: SignupAction;
  loading: boolean;
  error: string | null;
} {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const signup = useCallback<SignupAction>(async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api<SignupResponse>("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: "student" }),
        auth: false,
      });

      storeTokenIfVerified(response ?? null);
      return response ?? null;
    } catch (err: unknown) {
      setError(getErrorMessage(err));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { signup, loading, error };
}
