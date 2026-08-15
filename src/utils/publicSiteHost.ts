/**
 * Single source of truth for published customer-site hosts.
 * Keep in sync with middleware.js `isCustomerSiteHost`.
 *
 * Staging client must resolve to sites-staging.bizuply.com.
 * Production client must resolve to sites.bizuply.com.
 */

export const PRODUCTION_PUBLIC_SITE_DOMAIN = "sites.bizuply.com";
export const STAGING_PUBLIC_SITE_DOMAIN = "sites-staging.bizuply.com";
export const LEGACY_PUBLIC_SITE_DOMAIN = "bizuply.com";

const MARKETING_HOSTS = new Set([
  "bizuply.com",
  "www.bizuply.com",
  "localhost",
  "127.0.0.1",
]);

function readViteEnv(name: string): string {
  try {
    const env = (import.meta as any)?.env;
    return String(env?.[name] || "").trim();
  } catch {
    return "";
  }
}

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

function isStagingRuntime(hostname?: string | null): boolean {
  const api = `${readViteEnv("VITE_API_URL")} ${readViteEnv("VITE_PUBLIC_API_URL")}`;
  if (/staging/i.test(api)) return true;
  const host = normalizeHostname(hostname ?? getBrowserHostname());
  return /staging/i.test(host);
}

/**
 * Public platform domain for preview / publish / copy-URL UI.
 * Explicit VITE_BIZUPLY_PUBLIC_SITE_DOMAIN always wins.
 */
export function getPublicSiteDomain(hostname?: string | null): string {
  const fromEnv = readViteEnv("VITE_BIZUPLY_PUBLIC_SITE_DOMAIN").toLowerCase();
  if (fromEnv) return fromEnv;
  if (isStagingRuntime(hostname)) return STAGING_PUBLIC_SITE_DOMAIN;
  return PRODUCTION_PUBLIC_SITE_DOMAIN;
}

export function getLegacyPublicSiteDomain(): string {
  const fromEnv = readViteEnv("VITE_BIZUPLY_LEGACY_PUBLIC_SITE_DOMAIN").toLowerCase();
  return fromEnv || LEGACY_PUBLIC_SITE_DOMAIN;
}

export function buildPublicSiteUrl(slug: string, hostname?: string | null): string {
  const clean = String(slug || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  if (!clean) return "";
  return `https://${clean}.${getPublicSiteDomain(hostname)}`;
}

/**
 * True for `{slug}.sites.bizuply.com`, `{slug}.sites-staging.bizuply.com`,
 * and any custom/external domain that is not the marketing app / Vercel host.
 */
export function isPublicCustomerSiteHost(hostname?: string | null): boolean {
  const host = normalizeHostname(hostname ?? getBrowserHostname());
  if (!host) return false;

  const publicDomain = getPublicSiteDomain(host);
  if (host === publicDomain) return false;
  if (host.endsWith(`.${publicDomain}`)) return true;
  if (host.endsWith(`.${STAGING_PUBLIC_SITE_DOMAIN}`)) return true;
  if (host.endsWith(`.${PRODUCTION_PUBLIC_SITE_DOMAIN}`)) return true;

  if (host.endsWith(".bizuply.com") && host !== "bizuply.com" && host !== "www.bizuply.com") {
    return true;
  }

  if (MARKETING_HOSTS.has(host) || host.endsWith(".vercel.app")) {
    return false;
  }

  return host.includes(".");
}
