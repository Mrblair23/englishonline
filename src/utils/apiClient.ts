const API_BASE_URL = import.meta.env.PROD ? "/api" : "http://localhost:4000";
const AUTH_STORAGE_KEY = "eo_auth";

type StoredAuth = {
  token: string;
  user: unknown;
};

function isBrowser() {
  return typeof window !== "undefined";
}

function resolvePath(path: string) {
  if (!path) throw new Error("API path is required");
  if (/^https?:\/\//i.test(path)) return path;

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  // In production our API base is already "/api". Some call sites already
  // pass "/api/..." paths, so avoid generating "/api/api/...".
  if (API_BASE_URL === "/api" && normalizedPath.startsWith("/api/")) {
    return normalizedPath;
  }

  return `${API_BASE_URL}${normalizedPath}`;
}

export function getStoredAuth(): StoredAuth | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredAuth) : null;
  } catch (error) {
    console.warn("Failed to parse auth storage", error);
    return null;
  }
}

export function setStoredAuth(auth: StoredAuth) {
  if (!isBrowser()) return;
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
}

export function clearStoredAuth() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function getStoredToken(): string | null {
  return getStoredAuth()?.token ?? null;
}

export async function apiFetch(input: string, init: RequestInit = {}) {
  const url = resolvePath(input);
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  const token = getStoredToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(url, {
    ...init,
    credentials: "include",
    headers,
  });
}

export { API_BASE_URL };
