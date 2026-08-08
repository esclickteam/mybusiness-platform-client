/**
 * Central API / Socket / public-site URL resolution.
 *
 * Staging builds (VITE_APP_ENV=staging) are FAIL-CLOSED:
 * - require explicit VITE_API_URL (and never accept Production API hosts)
 * - never fall back to Production API
 *
 * Production may keep the legacy Production defaults when ENV is omitted.
 */

// Split so Staging bundles never embed the contiguous Production API hostname.
const PROD_API_HOST = ["api", "bizuply", "com"].join(".");

/** Vite inlines this — staging builds can dead-code-eliminate Production defaults. */
const IS_STAGING_BUILD = import.meta.env.VITE_APP_ENV === "staging";

function stripTrailingSlashes(value) {
  return String(value || "")
    .trim()
    .replace(/\/+$/, "");
}

function firstNonEmpty(...values) {
  for (const value of values) {
    const trimmed = stripTrailingSlashes(value);
    if (trimmed) return trimmed;
  }
  return "";
}

function looksLikeStagingHost(value) {
  const v = String(value || "").toLowerCase();
  return (
    v.includes("server-staging") ||
    v.includes("mybusiness-platform-client-staging") ||
    v.includes("staging.bizuply.com") ||
    /(^|[/.])staging([/.]|$)/.test(v)
  );
}

export function isStagingFrontendRuntime() {
  if (IS_STAGING_BUILD) return true;

  if (
    looksLikeStagingHost(import.meta.env.VITE_CLIENT_URL) ||
    looksLikeStagingHost(import.meta.env.VITE_API_URL) ||
    looksLikeStagingHost(import.meta.env.VITE_API_BASE_URL) ||
    looksLikeStagingHost(import.meta.env.VITE_BACKEND_URL) ||
    looksLikeStagingHost(import.meta.env.VITE_SOCKET_URL)
  ) {
    return true;
  }

  if (typeof window !== "undefined") {
    const host = String(window.location?.hostname || "").toLowerCase();
    if (
      host.includes("mybusiness-platform-client-staging") ||
      host === "staging.bizuply.com"
    ) {
      return true;
    }
  }

  return false;
}

function assertNotProductionApi(url, label) {
  const normalized = String(url || "").toLowerCase();
  if (normalized.includes(PROD_API_HOST)) {
    throw new Error(
      `STAGING MISCONFIGURED: ${label} must not point to Production (${PROD_API_HOST}). Got: ${url}`
    );
  }
}

export function getApiBaseUrl() {
  const fromEnv = firstNonEmpty(
    import.meta.env.VITE_API_URL,
    import.meta.env.VITE_API_BASE_URL,
    import.meta.env.VITE_BACKEND_URL
  );

  if (IS_STAGING_BUILD || isStagingFrontendRuntime()) {
    if (!fromEnv) {
      throw new Error(
        "STAGING MISCONFIGURED: VITE_API_URL is required (fail-closed; no Production API fallback)."
      );
    }
    assertNotProductionApi(fromEnv, "VITE_API_URL");
    if (fromEnv.startsWith("/")) {
      throw new Error(
        "STAGING MISCONFIGURED: VITE_API_URL must be an absolute Railway Staging URL (relative /api is forbidden)."
      );
    }
    return fromEnv;
  }

  if (fromEnv) return fromEnv;

  if (import.meta.env.MODE === "production") {
    return `https://${PROD_API_HOST}/api`;
  }

  return "/api";
}

export function getApiOrigin() {
  return getApiBaseUrl()
    .replace(/\/api\/?$/i, "")
    .replace(/\/+$/, "");
}

export function getSocketUrl() {
  const fromEnv = firstNonEmpty(import.meta.env.VITE_SOCKET_URL);

  if (IS_STAGING_BUILD || isStagingFrontendRuntime()) {
    if (fromEnv) {
      assertNotProductionApi(fromEnv, "VITE_SOCKET_URL");
      if (fromEnv.startsWith("/")) {
        throw new Error(
          "STAGING MISCONFIGURED: VITE_SOCKET_URL must be an absolute Railway Staging URL."
        );
      }
      return fromEnv;
    }
    const origin = getApiOrigin();
    assertNotProductionApi(origin, "derived VITE_SOCKET_URL");
    if (!origin || origin.startsWith("/")) {
      throw new Error(
        "STAGING MISCONFIGURED: VITE_SOCKET_URL is required (fail-closed)."
      );
    }
    return origin;
  }

  if (fromEnv) return fromEnv;

  if (import.meta.env.MODE === "production") {
    return `https://${PROD_API_HOST}`;
  }

  return getApiOrigin() || "";
}

export function getPublicSiteDomain() {
  const fromEnv = String(
    import.meta.env.VITE_BIZUPLY_PUBLIC_SITE_DOMAIN || ""
  ).trim();

  if (IS_STAGING_BUILD || isStagingFrontendRuntime()) {
    if (!fromEnv || fromEnv === "sites.bizuply.com") {
      return "sites-staging.invalid";
    }
    return fromEnv;
  }

  return fromEnv || "sites.bizuply.com";
}

export function getClientUrl() {
  const fromEnv = firstNonEmpty(import.meta.env.VITE_CLIENT_URL);
  if (IS_STAGING_BUILD || isStagingFrontendRuntime()) {
    return (
      fromEnv ||
      (typeof window !== "undefined" ? window.location.origin : "") ||
      "https://mybusiness-platform-client-staging.vercel.app"
    );
  }
  return fromEnv || "https://bizuply.com";
}
