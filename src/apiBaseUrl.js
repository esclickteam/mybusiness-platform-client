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

/** Ephemeral Staging preview tunnels used by agents — never Production API. */
export function isStagingTunnelHost(hostname) {
  const host = String(hostname || "")
    .toLowerCase()
    .trim()
    .split(":")[0];
  return host.endsWith(".trycloudflare.com");
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
  const host = String(hostname || "")
    .toLowerCase()
    .trim()
    .split(":")[0];
  const trimmed = trimApiUrl(envApiUrl);

  // Staging Preview / temporary Vercel hosts must never silently use Production.
  if (isVercelPreviewHost(hostname)) return RAILWAY_STAGING_API;
  // Cloudflare Staging tunnels are served with a same-origin /api proxy to Railway Staging.
  if (isStagingTunnelHost(hostname)) return "/api";
  if (host === "mybusiness-platform-client-staging.vercel.app") {
    return RAILWAY_STAGING_API;
  }
  // Explicit Staging API baked into the build wins over Production defaults.
  if (/server-staging-15bb\.up\.railway\.app/i.test(trimmed)) {
    return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
  }

  // Login and refresh must stay on the site host. A cross-site POST to
  // api.bizuply.com does not send a SameSite=Lax session cookie, so the
  // access token expires and the user looks logged out. Vercel proxies /api.
  // NOTE: geo.bizuply.com is Production and must keep Production /api proxy.
  if (
    host === "bizuply.com" ||
    host === "www.bizuply.com" ||
    host === "bizuply.co.il" ||
    host === "www.bizuply.co.il" ||
    host === "geo.bizuply.com" ||
    host === "www.geo.bizuply.com" ||
    host === "partners.bizuply.com" ||
    host === "www.partners.bizuply.com"
  ) {
    return "/api";
  }
  if (trimmed) return trimmed;
  if (mode === "production") return PRODUCTION_API;
  return "/api";
}
