/**
 * Edge helpers for Server-Side Redirect of authenticated users off marketing home.
 * Pure utilities + fetch wrapper — used by middleware.js only on home document navigations.
 */

import { splitMarketingLocale } from "./localePathCore.mjs";

export const REFRESH_COOKIE_NAME = "refreshToken";
export const HOME_BOOTSTRAP_PATH = "/api/auth/home-bootstrap";

const DEFAULT_TIMEOUT_MS = Math.max(
  200,
  Number(
    typeof process !== "undefined" &&
      process.env &&
      process.env.BIZUPLY_HOME_SSR_AUTH_TIMEOUT_MS
      ? process.env.BIZUPLY_HOME_SSR_AUTH_TIMEOUT_MS
      : 800,
  ) || 800,
);

const PRODUCTION_AUTH_API = "https://api.bizuply.com/api";
const STAGING_AUTH_API =
  "https://server-staging-15bb.up.railway.app/api";

/** Paths we never 302 into (prevents redirect loops onto marketing home). */
const BLOCKED_REDIRECT_PREFIXES = [
  "/",
  "/he",
  "/es",
  "/ar",
  "/pt-br",
  "/pt-BR",
];

const ALLOWED_REDIRECT_PREFIXES = [
  "/dashboard",
  "/admin",
  "/affiliate",
  "/marketer",
  "/partner",
  "/staff",
  "/manager",
  "/client",
  "/business/",
  "/pricing",
  "/reset-password",
  "/create-password",
  "/payment-success",
];

export function isHomeSessionRedirectEnabled() {
  if (typeof process === "undefined" || !process.env) return true;
  return String(process.env.BIZUPLY_HOME_SSR_AUTH_REDIRECT || "1").trim() !== "0";
}

export function isMarketingHomePath(pathname) {
  try {
    return splitMarketingLocale(pathname || "/").path === "/";
  } catch {
    return pathname === "/" || pathname === "";
  }
}

export function readCookieValue(cookieHeader, name) {
  if (!cookieHeader || !name) return "";
  const parts = String(cookieHeader).split(";");
  const prefix = `${name}=`;
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.startsWith(prefix)) {
      return trimmed.slice(prefix.length);
    }
  }
  return "";
}

export function hasRefreshSessionCookie(cookieHeader) {
  return Boolean(readCookieValue(cookieHeader, REFRESH_COOKIE_NAME));
}

function isBlockedHomeRedirect(pathname) {
  const path = String(pathname || "").split(/[?#]/)[0];
  if (!path) return true;
  return BLOCKED_REDIRECT_PREFIXES.some(
    (blocked) => path === blocked || path === `${blocked}/`,
  );
}

export function sanitizeEdgeRedirect(raw) {
  if (raw == null) return null;
  let value = String(raw).trim();
  if (!value) return null;
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
  if (value.includes("\\") || value.includes("@")) return null;
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(value)) return null;

  try {
    const parsed = new URL(value, "https://bizuply.com");
    if (parsed.origin !== "https://bizuply.com") return null;
    if (parsed.username || parsed.password) return null;
    const out = `${parsed.pathname}${parsed.search}`;
    if (!out.startsWith("/") || out.startsWith("//")) return null;
    if (isBlockedHomeRedirect(out)) return null;
    const pathOnly = out.split(/[?#]/)[0];
    const allowed = ALLOWED_REDIRECT_PREFIXES.some(
      (prefix) => pathOnly === prefix || pathOnly.startsWith(prefix),
    );
    if (!allowed) return null;
    return out;
  } catch {
    return null;
  }
}

export function resolveHomeBootstrapApiBase(host) {
  const h = String(host || "").toLowerCase();
  if (h.includes("staging")) {
    return (
      (typeof process !== "undefined" &&
        process.env &&
        process.env.BIZUPLY_STAGING_AUTH_API) ||
      STAGING_AUTH_API
    );
  }
  if (
    typeof process !== "undefined" &&
    process.env &&
    process.env.BIZUPLY_PRODUCTION_AUTH_API
  ) {
    return process.env.BIZUPLY_PRODUCTION_AUTH_API;
  }
  return PRODUCTION_AUTH_API;
}

/**
 * Ask the API whether the refresh cookie is a live session and where to send the user.
 * Returns a safe internal path or null (continue rendering home).
 */
export async function fetchHomeSessionRedirectUrl({
  request,
  host,
  fetchImpl = fetch,
  timeoutMs = DEFAULT_TIMEOUT_MS,
} = {}) {
  if (!request) return null;
  const cookie = request.headers.get("cookie") || "";
  if (!hasRefreshSessionCookie(cookie)) return null;

  const apiBase = resolveHomeBootstrapApiBase(host || "");
  const url = `${String(apiBase).replace(/\/$/, "")}/auth/home-bootstrap`;
  const controller =
    typeof AbortController !== "undefined" ? new AbortController() : null;
  const timer =
    controller && timeoutMs > 0
      ? setTimeout(() => controller.abort(), timeoutMs)
      : null;

  try {
    const res = await fetchImpl(url, {
      method: "GET",
      headers: {
        cookie,
        accept: "application/json",
        // Identify edge call; no browser Origin → trusted by authOriginGuard.
        "x-bizuply-edge": "home-ssr-auth",
      },
      redirect: "manual",
      signal: controller ? controller.signal : undefined,
    });

    if (!res || !res.ok) return null;
    const data = await res.json().catch(() => null);
    if (!data || data.ok !== true) return null;
    return sanitizeEdgeRedirect(data.redirectUrl);
  } catch {
    return null;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export function buildHomeSessionRedirectResponse(request, redirectPath) {
  const safe = sanitizeEdgeRedirect(redirectPath);
  if (!safe) return null;
  const location = new URL(safe, request.url).toString();
  return new Response(null, {
    status: 302,
    headers: {
      location,
      "cache-control": "private, no-store, no-cache, must-revalidate",
      pragma: "no-cache",
      vary: "Cookie",
      "x-bizuply-home-ssr-auth": "redirect",
    },
  });
}
