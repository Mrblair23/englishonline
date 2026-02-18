import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  apiFetch,
  clearStoredAuth,
  getStoredAuth,
  setStoredAuth,
} from "@/utils/apiClient";

export const AuthContext = createContext(null);

function normalizeAuthPayload(payload) {
  if (!payload) return null;
  const { token, user } = payload;
  if (typeof token !== "string" || !token) {
    return null;
  }
  return { token, user };
}

export function AuthProvider({ children }) {
  const initialAuth = normalizeAuthPayload(getStoredAuth());
  const [authState, setAuthState] = useState(initialAuth);
  const [pending, setPending] = useState(false);
  const [hydrating, setHydrating] = useState(Boolean(initialAuth?.token));

  const updateAuthState = useCallback((next) => {
    const normalized = normalizeAuthPayload(next);
    setAuthState(normalized);
    if (normalized) {
      setStoredAuth(normalized);
    } else {
      clearStoredAuth();
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      if (!authState?.token) {
        setHydrating(false);
        return;
      }

      setHydrating(true);
      try {
        const response = await apiFetch("/auth/me");
        if (!response.ok) {
          throw new Error("Unauthorized");
        }
        const data = await response.json();
        if (cancelled) return;
        const mergedUser = authState.user ? { ...authState.user, ...data } : data;
        updateAuthState({ token: authState.token, user: mergedUser });
      } catch (error) {
        if (!cancelled) {
          updateAuthState(null);
        }
      } finally {
        if (!cancelled) {
          setHydrating(false);
        }
      }
    }

    hydrate();
    return () => {
      cancelled = true;
    };
  }, [authState?.token, updateAuthState]);

  const login = useCallback(
    async ({ email, password }) => {
      setPending(true);
      try {
        const response = await apiFetch("/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          throw new Error("Invalid credentials");
        }

        const data = await response.json();
        const payload = {
          token: data.token,
          user: data.user,
        };
        updateAuthState(payload);
        return payload;
      } finally {
        setPending(false);
      }
    },
    [updateAuthState]
  );

  const logout = useCallback(() => {
    updateAuthState(null);
  }, [updateAuthState]);

  const value = useMemo(
    () => ({
      user: authState?.user ?? null,
      token: authState?.token ?? null,
      loading: pending,
      hydrating,
      login,
      logout,
      setAuthState: updateAuthState,
    }),
    [authState, hydrating, login, logout, pending, updateAuthState]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}
