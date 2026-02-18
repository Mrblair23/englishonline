import useUser from "@/utils/useUser";

/**
 * Hook to check if the current user is an admin
 * @returns {Object} { isAdmin: boolean, loading: boolean, user: object }
 */
export default function useAdmin() {
  const { data: user, loading } = useUser();

  const isAdmin = user && user.role === "admin";

  return {
    isAdmin,
    loading,
    user,
  };
}
