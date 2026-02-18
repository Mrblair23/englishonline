const rawBase = import.meta.env.VITE_API_URL;
const API_BASE = rawBase ? rawBase.replace(/\/+$/, "") : "";

export async function apiFetch(
  path: string,
  options: RequestInit = {}
) {
  const finalPath = path.startsWith("/api")
    ? path
    : `/api${path}`;

  const res = await fetch(`${API_BASE}${finalPath}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
    body:
      options.body && typeof options.body === "object"
        ? JSON.stringify(options.body)
        : options.body,
  });

  return res; // ← IMPORTANT
}
