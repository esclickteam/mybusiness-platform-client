/**
 * Client guard for the single PR preview that is allowed to call production.
 * It does not change server auth. It stops this preview from calling another
 * business, an admin surface, or an action that sends, automates, launches a
 * campaign, or takes payment.
 */

const AUTH_POST_PATHS = [
  "/auth/login",
  "/auth/staff-login",
  "/auth/logout",
  "/auth/refresh-token",
  "/auth/refresh",
  "/users/refresh",
];

const EXTERNAL_ACTION =
  /\/(whatsapp(?:-api)?|meta-campaigns|automations|stripe|lemonsqueezy|lemon|plugin-billing|push-billing|client-portal-billing|billing|checkout|voice-verification|embedded-signup|early-access)(?:\/|$)/i;

const READ_ONLY_PREVIEW = /\/(?:ad-preview|mapping-preview|send-preview|preview)(?:\/|$)/i;

function requestPath(url) {
  const raw = String(url || "");
  if (!raw) return "/";
  try {
    if (/^https?:\/\//i.test(raw)) return new URL(raw).pathname || "/";
  } catch {
    /* relative URL */
  }
  const path = raw.split("?")[0].split("#")[0];
  return path.startsWith("/") ? path : `/${path}`;
}

function requestQuery(url) {
  const raw = String(url || "");
  const query = raw.split("?")[1] || "";
  return new URLSearchParams(query.split("#")[0]);
}

function headerValue(headers, name) {
  if (!headers) return "";
  if (typeof headers.get === "function") {
    const fromGetter = headers.get(name);
    if (fromGetter) return String(fromGetter).trim();
  }
  const target = name.toLowerCase();
  for (const key of Object.keys(headers)) {
    if (String(key).toLowerCase() === target && headers[key]) {
      return String(headers[key]).trim();
    }
  }
  return "";
}

function decodeJwtPayload(token) {
  const part = String(token || "").split(".")[1];
  if (!part) return null;
  try {
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const json =
      typeof atob === "function"
        ? atob(padded)
        : Buffer.from(padded, "base64").toString("utf8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function isAuthPost(path) {
  return AUTH_POST_PATHS.some((item) => path === item || path.endsWith(item));
}

function isSafeMethod(method) {
  const verb = String(method || "get").toUpperCase();
  return verb === "GET" || verb === "HEAD" || verb === "OPTIONS";
}

/**
 * @returns {string | null} a stable block code, or null when the request may leave the browser
 */
export function previewProductionBlockReason({
  method = "get",
  url = "",
  headers = null,
  token = "",
} = {}) {
  const path = requestPath(url);
  const verb = String(method || "get").toUpperCase();

  if (/\/admin(?:\/|$)/i.test(path)) return "admin_surface";

  if (verb === "POST" && isAuthPost(path)) return null;

  const claims = decodeJwtPayload(token);
  const role = String(claims?.role || "");
  const businessId = String(claims?.businessId || "");

  if (claims && (role !== "business" || !businessId)) return "test_business_only";

  if (!claims) {
    return isSafeMethod(verb) ? null : "test_business_only";
  }

  const headerBusinessId = headerValue(headers, "X-Business-Id");
  const managedBusinessId = headerValue(headers, "X-Managed-Business-Id");
  if (managedBusinessId) return "other_business";
  if (headerBusinessId && headerBusinessId !== businessId) return "other_business";

  const pathBusiness = path.match(/\/business\/([a-f0-9]{24})/i);
  if (pathBusiness && pathBusiness[1] !== businessId) return "other_business";

  const query = requestQuery(url);
  const queryBusinessId = query.get("businessId") || query.get("business_id") || "";
  if (queryBusinessId && queryBusinessId !== businessId) return "other_business";

  if (!isSafeMethod(verb)) {
    if (READ_ONLY_PREVIEW.test(path)) return null;
    if (EXTERNAL_ACTION.test(path)) return "external_action";
  }

  return null;
}
