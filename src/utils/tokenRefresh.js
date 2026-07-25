import axios from "axios";
import jwtDecode from "jwt-decode";

const isProd = import.meta.env.MODE === "production";
const BASE_URL = isProd ? "https://api.bizuply.com/api" : "/api";

let ongoingRefresh = null;
let lastRefreshFailureAt = 0;
const REFRESH_FAILURE_COOLDOWN_MS = 8_000;

const HARD_REFRESH_FAILURE_CODES = new Set([
  "NO_REFRESH_TOKEN",
  "REFRESH_TOKEN_NOT_FOUND",
  "REFRESH_TOKEN_INVALID",
]);

let authHeaderSetter = null;

/**
 * Lets api.js register setAuthToken without a circular import.
 */
export function registerAuthHeaderSetter(setter) {
  authHeaderSetter = setter;
}

function applyAccessToken(accessToken) {
  if (!accessToken) return;
  localStorage.setItem("token", accessToken);
  if (typeof authHeaderSetter === "function") {
    authHeaderSetter(accessToken);
  }
}

export function isAccessTokenExpired(token, { skewMs = 0 } = {}) {
  if (!token) return true;

  try {
    const { exp } = jwtDecode(token);
    return Date.now() >= exp * 1000 - skewMs;
  } catch {
    return true;
  }
}

export function isHardRefreshFailure(err) {
  const code = err?.code || err?.response?.data?.code;
  const message = err?.message || err?.response?.data?.message || "";

  if (HARD_REFRESH_FAILURE_CODES.has(code)) return true;
  if (message === "NO_REFRESH_TOKEN" || message === "REFRESH_REVOKED") return true;
  if (message === "No refresh token") return true;
  return false;
}

/**
 * Single-flight refresh via httpOnly cookie.
 * Safe to call from Axios interceptor and AuthContext.
 */
export async function refreshAccessTokenOnce() {
  const isImpersonating = Boolean(localStorage.getItem("impersonatedBy"));

  if (isImpersonating) {
    throw new Error("Refresh disabled during impersonation");
  }

  if (
    !ongoingRefresh &&
    lastRefreshFailureAt &&
    Date.now() - lastRefreshFailureAt < REFRESH_FAILURE_COOLDOWN_MS
  ) {
    const cooldownErr = new Error("REFRESH_COOLDOWN");
    cooldownErr.code = "REFRESH_COOLDOWN";
    throw cooldownErr;
  }

  if (!ongoingRefresh) {
    ongoingRefresh = axios
      .post(`${BASE_URL}/auth/refresh-token`, null, {
        withCredentials: true,
      })
      .then((res) => {
        const { accessToken } = res.data || {};

        if (!accessToken) {
          throw new Error("No new token");
        }

        lastRefreshFailureAt = 0;
        applyAccessToken(accessToken);
        return accessToken;
      })
      .catch((err) => {
        const status = err.response?.status;
        const code = err.response?.data?.code;
        const message = err.response?.data?.message;

        if (err.code === "REFRESH_COOLDOWN") {
          throw err;
        }

        lastRefreshFailureAt = Date.now();

        if (
          status === 401 &&
          (code === "NO_REFRESH_TOKEN" || message === "No refresh token")
        ) {
          const e = new Error("NO_REFRESH_TOKEN");
          e.code = "NO_REFRESH_TOKEN";
          throw e;
        }

        if (
          status === 401 &&
          (code === "REFRESH_TOKEN_NOT_FOUND" ||
            code === "REFRESH_TOKEN_INVALID")
        ) {
          const e = new Error("REFRESH_REVOKED");
          e.code = code;
          throw e;
        }

        throw err;
      })
      .finally(() => {
        ongoingRefresh = null;
      });
  }

  return ongoingRefresh;
}

/**
 * Return a usable access token. Only hits the refresh endpoint when needed.
 * Pass `{ force: true }` to always request a new access token (e.g. socket tokenExpired).
 */
export async function getValidAccessToken(options = {}) {
  const force = Boolean(options?.force);
  const token = localStorage.getItem("token");

  // Refresh ~30s early to avoid races with in-flight requests
  if (!force && token && !isAccessTokenExpired(token, { skewMs: 30_000 })) {
    return token;
  }

  try {
    return await refreshAccessTokenOnce();
  } catch (err) {
    // Impersonation cannot refresh — keep the current access token
    if (localStorage.getItem("impersonatedBy")) {
      return token || null;
    }

    // Hard failures / cooldown: never hand sockets an expired token (retry storm)
    if (isHardRefreshFailure(err) || err?.code === "REFRESH_COOLDOWN") {
      console.warn("Failed to refresh access token:", err?.message || err);
      return null;
    }

    // Transient failure: only reuse cached token if it is still valid
    if (token && !isAccessTokenExpired(token)) {
      return token;
    }

    console.warn("Failed to refresh access token:", err?.message || err);
    return null;
  }
}

/**
 * Clear access token from storage. Call only from explicit logout.
 */
export function clearAccessToken() {
  localStorage.removeItem("token");
  if (typeof authHeaderSetter === "function") {
    authHeaderSetter(null);
  }
}
