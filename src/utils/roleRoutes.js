export const ROLE_ROUTES = Object.freeze({
  admin: "/admin/dashboard",
  teacher: "/teacher/dashboard",
  student: "/student/dashboard",
});

export function isRole(role) {
  return role === "admin" || role === "teacher" || role === "student";
}

export function normalizeAllowedRoles(allow) {
  if (!Array.isArray(allow)) {
    return [];
  }
  const seen = new Set();
  for (const candidate of allow) {
    if (isRole(candidate)) {
      seen.add(candidate);
    }
  }
  return Array.from(seen);
}

export function routeForRole(role, fallback = "/") {
  if (isRole(role)) {
    return ROLE_ROUTES[role];
  }
  return fallback;
}