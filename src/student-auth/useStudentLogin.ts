import { useCallback, useState } from "react";
import { api } from "@/lib/api";
import type { LoginResponse } from "./types";

type LoginAction = (email: string, password: string) => Promise<LoginResponse | null>;

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "string") return error;
  if (error && typeof error === "object") {
    if ("message" in error && typeof error.message === "string") return error.message;
    if ("error" in error && typeof error.error === "string") return error.error;
  }
  return "Unable to log in. Please try again.";
};

const storeTokenIfVerified = (response: LoginResponse | null): void => {
  if (!response?.token) return;
  if (response.user?.emailVerified !== true) return;

  if (typeof window !== "undefined") {
    window.localStorage.setItem("auth_token", response.token);
  }
};

export function useStudentLogin(): {
  login: LoginAction;
  loading: boolean;
  error: string | null;
} {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback<LoginAction>(async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api<LoginResponse>("/auth/login", {
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

  return { login, loading, error };
}
