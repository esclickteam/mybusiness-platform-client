/**
 * Host detection for published customer websites.
 * Keep in sync with middleware.js `isCustomerSiteHost`.
 */

const PUBLIC_SITE_DOMAIN =
  (typeof import.meta !== "undefined" &&
    (import.meta as any)?.env?.VITE_BIZUPLY_PUBLIC_SITE_DOMAIN) ||
  "sites.bizuply.com";

const MARKETING_HOSTS = new Set([
  "bizuply.com",
  "www.bizuply.com",
  "localhost",
  "127.0.0.1",
]);

export function normalizeHostname(hostname?: string | null): string {
  return String(hostname || "")
    .toLowerCase()
    .trim()
    .split(":")[0];
}

export function getBrowserHostname(): string {
  if (typeof window === "undefined") return "";
  return normalizeHostname(window.location.hostname);
}

/**
 * True for `{slug}.sites.bizuply.com` and any custom/external domain
 * that is not the marketing app / Vercel preview host.
 */
export function isPublicCustomerSiteHost(hostname?: string | null): boolean {
  const host = normalizeHostname(hostname ?? getBrowserHostname());
  if (!host) return false;

  const publicDomain = String(PUBLIC_SITE_DOMAIN || "sites.bizuply.com")
    .toLowerCase()
    .trim();

  if (host === publicDomain) return false;
  if (host.endsWith(`.${publicDomain}`)) return true;

  // Legacy platform subdomain hosts (still served by the public API).
  if (host.endsWith(".bizuply.com") && host !== "bizuply.com" && host !== "www.bizuply.com") {
    return true;
  }

  if (MARKETING_HOSTS.has(host) || host.endsWith(".vercel.app")) {
    return false;
  }

  // Custom / external domains pointed at published sites.
  return host.includes(".");
}

export function getPublicSiteDomain(): string {
  return String(PUBLIC_SITE_DOMAIN || "sites.bizuply.com")
    .toLowerCase()
    .trim();
}
