import { Navigate, useLocation } from "react-router";
import { useAuthContext } from "@/context/AuthContext";
import {
  isRole,
  normalizeAllowedRoles,
  routeForRole,
} from "@/utils/roleRoutes";

export default function RoleGuard({ allow, children, fallbackRoute = "/" }) {
  const { user, loading, hydrating } = useAuthContext();
  const location = useLocation();
  const allowedRoles = normalizeAllowedRoles(allow);

  if (loading || hydrating) {
    return (
      <div className="flex min-h-screen items-center justify-center bm-page-bg">
        <p className="text-sm font-medium text-gray-500">Checking permissions…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/account/signin"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (allowedRoles.length === 0) {
    throw new Error("RoleGuard requires at least one valid role");
  }

  if (!isRole(user.role)) {
    return <Navigate to={fallbackRoute} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={routeForRole(user.role)} replace />;
  }

  return <>{children}</>;
}
