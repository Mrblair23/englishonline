import * as React from "react";
import { useAuthContext } from "@/context/AuthContext";
import { apiFetch } from "@/utils/apiClient";

const useUser = () => {
  const { user, loading, hydrating, setAuthState, token } = useAuthContext();

  const refetchUser = React.useCallback(async () => {
    if (!token) {
      return user ?? null;
    }

    const response = await apiFetch("/auth/me");
    if (!response.ok) {
      throw new Error("Failed to refresh user");
    }
    const data = await response.json();
    setAuthState({ token, user: data });
    return data;
  }, [setAuthState, token, user]);

  return {
    user,
    data: user,
    loading: loading || hydrating,
    refetch: refetchUser,
  };
};

export { useUser };

export default useUser;
