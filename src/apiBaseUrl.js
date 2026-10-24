export const RAILWAY_STAGING_API = "https://server-staging-15bb.up.railway.app/api";
export const PRODUCTION_API = "https://api.bizuply.com/api";

function trimApiUrl(value) {
  return String(value || "")
    .trim()
    .replace(/\/+$/, "");
}

/** Vercel Preview / branch URLs for this client — never production bizuply.com. */
export function isVercelPreviewHost(hostname) {
  const host = String(hostname || "")
    .toLowerCase()
    .trim()
    .split(":")[0];
  if (!host.endsWith(".vercel.app")) return false;
  if (host === "mybusiness-platform-client-staging.vercel.app") return true;
  return (
    host.startsWith("mybusiness-platform-client-") &&
    host.includes("-esclicks-projects")
  );
}

export function browserHostname() {
  if (typeof window === "undefined" || !window.location) return "";
  return String(window.location.hostname || "");
}

/**
 * Preview deployments must talk to Railway staging. Project env on Vercel
 * currently bakes VITE_API_URL=https://api.bizuply.com/api for every target.
 */
export function resolveApiBaseUrl({
  envApiUrl = "",
  mode = "development",
  hostname = "",
} = {}) {
  if (isVercelPreviewHost(hostname)) return RAILWAY_STAGING_API;
  const trimmed = trimApiUrl(envApiUrl);
  if (trimmed) return trimmed;
  if (mode === "production") return PRODUCTION_API;
  return "/api";
}
