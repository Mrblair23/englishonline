import { useCallback } from "react";
import { useNavigate } from "react-router";
import { useAuthContext } from "@/context/AuthContext";
import { apiFetch } from "@/utils/apiClient";
import { routeForRole } from "@/utils/roleRoutes";

const unsupported = () => {
  throw new Error("This authentication method is not available yet.");
};

function useAuth() {
  const navigate = useNavigate();
  const { login, logout, setAuthState } = useAuthContext();

  const handleRedirect = useCallback(
    (redirect, callbackUrl) => {
      if (redirect === false) {
        return;
      }
      navigate(callbackUrl || "/");
    },
    [navigate]
  );

  const signInWithCredentials = useCallback(
    async ({ email, password, callbackUrl, redirect = true }) => {
      const result = await login({ email, password });
      const target = callbackUrl ?? routeForRole(result?.user?.role);
      handleRedirect(redirect, target);
      return result;
    },
    [handleRedirect, login]
  );

  const signUpWithCredentials = useCallback(
    async ({ email, password, name, callbackUrl, redirect = true }) => {
      const response = await apiFetch("/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
        auth: false,
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        const error = new Error(
          payload?.error || "Failed to create account. Please try again."
        );
        error.status = response.status;
        throw error;
      }

      if (payload?.token && payload?.user) {
        setAuthState({ token: payload.token, user: payload.user });
        const target = callbackUrl ?? routeForRole(payload.user.role);
        handleRedirect(redirect, target);
      }

      return payload;
    },
    [handleRedirect, setAuthState]
  );

  const signOut = useCallback(
    ({ callbackUrl = "/", redirect = true } = {}) => {
      logout();
      handleRedirect(redirect, callbackUrl);
    },
    [handleRedirect, logout]
  );

  return {
    signInWithCredentials,
    signUpWithCredentials,
    signInWithGoogle: unsupported,
    signInWithFacebook: unsupported,
    signInWithTwitter: unsupported,
    signOut,
  };
}

export default useAuth;
