import { useEffect, useRef, useState } from "react";
import { apiFetch } from "@/utils/apiClient";

const STATUS_META = {
  checking: {
    label: "Checking backend…",
    dotClass: "bg-orange-400",
  },
  ok: {
    label: "Backend connected",
    dotClass: "bg-emerald-500",
  },
  down: {
    label: "Backend unreachable",
    dotClass: "bg-red-500",
  },
};

const HEALTH_TIMEOUT_MS = 8000;

export default function BackendStatusIndicator() {
  const [status, setStatus] = useState("checking");
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), HEALTH_TIMEOUT_MS);

      // Removed VITE_API_BASE_URL usage
      const healthUrl = "/health";

    async function checkHealth() {
      try {
        const response = await fetch(healthUrl, {
          method: "GET",
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });

        window.clearTimeout(timeoutId);
        if (!mountedRef.current) return;
        setStatus(response.ok ? "ok" : "down");
      } catch (error) {
        window.clearTimeout(timeoutId);
        if (!mountedRef.current) return;
        setStatus("down");
      }
    }

    checkHealth();

    return () => {
      mountedRef.current = false;
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, []);

  const { label, dotClass } = STATUS_META[status];

  return (
    <div className="flex items-center gap-2 text-xs text-gray-600" aria-live="polite">
      <span className={`inline-flex h-2.5 w-2.5 rounded-full ${dotClass}`} aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
