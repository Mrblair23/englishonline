export type DashboardRole = "admin" | "teacher" | "student";

export {
  ROLE_ROUTES as roleRoutes,
  ROLE_ROUTES,
  normalizeAllowedRoles,
  routeForRole,
  isRole,
} from "@/utils/roleRoutes";
