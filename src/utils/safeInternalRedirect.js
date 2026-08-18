/**
 * Safe post-login redirect helpers.
 * Blocks open redirects; allows only same-origin internal paths.
 */

export const POST_LOGIN_REDIRECT_KEY = "postLoginRedirect";

const BASE = "https://bizuply.com";

/**
 * @param {unknown} raw
 * @returns {string | null} pathname+search+hash or null if unsafe
 */
export function sanitizeInternalRedirect(raw) {
  if (raw == null) return null;
  let value = String(raw).trim();
  if (!value) return null;

  // Decode once when the value is still percent-encoded.
  if (/%[0-9A-Fa-f]{2}/.test(value)) {
    try {
      value = decodeURIComponent(value);
    } catch {
      return null;
    }
  }

  value = value.trim();
  if (!value.startsWith("/")) return null;
  if (value.startsWith("//")) return null;
  if (value.includes("\\")) return null;
  if (value.includes("@")) return null;
  // Reject scheme-relative / absolute URLs smuggled as path
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(value)) return null;

  try {
    const parsed = new URL(value, BASE);
    if (parsed.origin !== BASE) return null;
    if (parsed.username || parsed.password) return null;
    const out = `${parsed.pathname}${parsed.search}${parsed.hash}`;
    if (!out.startsWith("/") || out.startsWith("//")) return null;
    return out;
  } catch {
    return null;
  }
}

/**
 * Keep email deep-links on the authenticated user's business.
 * @param {string} path
 * @param {string | null | undefined} businessId
 */
export function alignRedirectBusinessId(path, businessId) {
  const safe = sanitizeInternalRedirect(path);
  if (!safe || !businessId) return safe;
  const match = safe.match(/^\/business\/([^/]+)(\/.*)?$/);
  if (!match) return safe;
  if (String(match[1]) === String(businessId)) return safe;
  return `/business/${businessId}${match[2] || ""}`;
}

export function rememberPostLoginRedirect(raw) {
  const safe = sanitizeInternalRedirect(raw);
  if (!safe) return null;
  try {
    sessionStorage.setItem(POST_LOGIN_REDIRECT_KEY, safe);
  } catch {
    // ignore
  }
  return safe;
}

export function peekPostLoginRedirect() {
  try {
    return sanitizeInternalRedirect(
      sessionStorage.getItem(POST_LOGIN_REDIRECT_KEY)
    );
  } catch {
    return null;
  }
}

export function consumePostLoginRedirect() {
  try {
    const value = sessionStorage.getItem(POST_LOGIN_REDIRECT_KEY);
    sessionStorage.removeItem(POST_LOGIN_REDIRECT_KEY);
    return sanitizeInternalRedirect(value);
  } catch {
    return null;
  }
}

export function clearPostLoginRedirect() {
  try {
    sessionStorage.removeItem(POST_LOGIN_REDIRECT_KEY);
  } catch {
    // ignore
  }
}

/**
 * Resolve where to send the user after a successful login.
 */
export function resolvePostLoginDestination({
  role,
  businessId,
  hasAccess = true,
  enabledModules = null,
  queryRedirect = null,
  storedRedirect = null,
} = {}) {
  const preferred =
    sanitizeInternalRedirect(queryRedirect) ||
    sanitizeInternalRedirect(storedRedirect);

  if (preferred) {
    return alignRedirectBusinessId(preferred, businessId) || preferred;
  }

  const normalizedRole = String(role || "").toLowerCase();
  if (normalizedRole === "admin") return "/admin/dashboard";
  if (normalizedRole === "marketer") return "/marketer/dashboard";
  if (normalizedRole === "partner") return "/partner/dashboard";
  if (normalizedRole === "affiliate") return "/affiliate/dashboard";
  if (normalizedRole === "customer") return "/client/dashboard";

  if (normalizedRole === "business") {
    if (!hasAccess) return "/pricing";
    if (!businessId) return "/dashboard";
    const limited = Array.isArray(enabledModules) ? enabledModules : null;
    const isWebsiteOnly =
      Boolean(limited?.includes("website")) &&
      !limited?.includes("crm") &&
      !limited?.includes("dashboard");
    if (isWebsiteOnly) {
      return `/business/${businessId}/dashboard/website`;
    }
    return `/business/${businessId}/dashboard`;
  }

  return "/dashboard";
}
