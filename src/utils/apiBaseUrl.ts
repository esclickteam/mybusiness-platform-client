/**
 * Resolve API base URL.
 * Staging/Preview must set VITE_API_URL to the Staging API (never production).
 * Production keeps VITE_API_URL=https://api.bizuply.com/api via .env.production.
 */
export function getApiBaseUrl(): string {
  const fromEnv = String(
    import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || ""
  )
    .trim()
    .replace(/\/$/, "");

  if (fromEnv) {
    return fromEnv.endsWith("/api") ? fromEnv : `${fromEnv}/api`;
  }

  if (import.meta.env.MODE === "production") {
    return "https://api.bizuply.com/api";
  }

  return "/api";
}

export function getSocketUrl(): string {
  const fromEnv = String(import.meta.env.VITE_SOCKET_URL || "").trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  const api = getApiBaseUrl().replace(/\/api$/, "");
  if (api && !api.startsWith("/")) return api;

  return "https://api.bizuply.com";
}
