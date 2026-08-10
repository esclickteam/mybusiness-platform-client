/**
 * Shared edge/runtime helpers for public-site host + API base.
 * Used by middleware.js (Vercel Edge) and unit tests.
 * Keep free of Node-only / Vite-only APIs so middleware can import it.
 */

const PRODUCTION_PUBLIC_API = "https://api.bizuply.com";
const PRODUCTION_PUBLIC_SITE_DOMAIN = "sites.bizuply.com";

/**
 * Resolve public API origin for edge SEO fetches.
 * Staging must NEVER fall back to api.bizuply.com.
 *
 * @param {Record<string, string|undefined>|undefined} env
 * @returns {{ apiOrigin: string, isStaging: boolean, source: string }}
 */
export function resolvePublicApiOrigin(env = {}) {
  const appEnv = String(env.VITE_APP_ENV || env.APP_ENV || "")
    .trim()
    .toLowerCase();
  const vercelEnv = String(env.VERCEL_ENV || "")
    .trim()
    .toLowerCase();
  const isStaging =
    appEnv === "staging" ||
    appEnv === "preview" ||
    vercelEnv === "preview" ||
    vercelEnv === "development";

  const candidates = [
    env.BIZUPLY_PUBLIC_API_URL,
    env.VITE_API_URL,
    env.VITE_API_BASE_URL,
    env.VITE_BACKEND_URL,
    env.PUBLIC_API_URL,
  ];

  for (const raw of candidates) {
    const value = String(raw || "").trim();
    if (!value) continue;
    try {
      const u = new URL(value);
      const origin = u.origin;
      if (isStaging && /api\.bizuply\.com$/i.test(u.hostname)) {
        continue;
      }
      return {
        apiOrigin: origin,
        isStaging,
        source: "env",
      };
    } catch {
      /* try next */
    }
  }

  if (isStaging) {
    return {
      apiOrigin: "https://server-staging-15bb.up.railway.app",
      isStaging: true,
      source: "staging-fallback",
    };
  }

  return {
    apiOrigin: PRODUCTION_PUBLIC_API,
    isStaging: false,
    source: "production-fallback",
  };
}

/**
 * @param {Record<string, string|undefined>|undefined} env
 */
export function resolveEdgePublicSiteDomain(env = {}) {
  const appEnv = String(env.VITE_APP_ENV || env.APP_ENV || "")
    .trim()
    .toLowerCase();
  const vercelEnv = String(env.VERCEL_ENV || "")
    .trim()
    .toLowerCase();
  const isStaging =
    appEnv === "staging" ||
    appEnv === "preview" ||
    vercelEnv === "preview" ||
    vercelEnv === "development";

  const candidates = [
    env.STAGING_PUBLIC_SITE_DOMAIN,
    env.VITE_BIZUPLY_PUBLIC_SITE_DOMAIN,
    env.BIZUPLY_PUBLIC_SITE_DOMAIN,
  ];

  for (const raw of candidates) {
    const value = String(raw || "")
      .trim()
      .toLowerCase();
    if (!value) continue;
    if (isStaging && value === PRODUCTION_PUBLIC_SITE_DOMAIN) {
      // Never accept production public host on staging, even if
      // BIZUPLY_PUBLIC_SITE_DOMAIN=sites.bizuply.com is present.
      continue;
    }
    return value;
  }

  if (isStaging) return "sites-staging.invalid";
  return PRODUCTION_PUBLIC_SITE_DOMAIN;
}

export { PRODUCTION_PUBLIC_API, PRODUCTION_PUBLIC_SITE_DOMAIN };