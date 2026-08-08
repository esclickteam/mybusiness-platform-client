import axios from "axios";
import jwtDecode from "jwt-decode";
import { getApiBaseUrl } from "../config/runtimeUrls";

const BASE_URL = getApiBaseUrl();

const REFRESH_DEAD_KEY = "bizuply:refreshDead";

let ongoingRefresh = null;
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
  clearRefreshDead();
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

  if (
    code === "NO_REFRESH_TOKEN" ||
    code === "REFRESH_TOKEN_NOT_FOUND" ||
    code === "REFRESH_TOKEN_INVALID"
  ) {
    return true;
  }
  if (message === "NO_REFRESH_TOKEN" || message === "REFRESH_REVOKED") return true;
  if (message === "No refresh token") return true;
  return false;
}

/** True when a prior refresh already proved there is no usable session cookie. */
export function isRefreshDead() {
  try {
    return sessionStorage.getItem(REFRESH_DEAD_KEY) === "1";
  } catch {
    return false;
  }
}

export function markRefreshDead() {
  try {
    sessionStorage.setItem(REFRESH_DEAD_KEY, "1");
  } catch {
    // ignore
  }
}

export function clearRefreshDead() {
  try {
    sessionStorage.removeItem(REFRESH_DEAD_KEY);
  } catch {
    // ignore
  }
}

/**
 * Only call /auth/refresh-token when something suggests a session may exist.
 * Anonymous first visits must not hit the endpoint (browser logs every 401 in red).
 */
export function shouldAttemptRefresh() {
  if (isRefreshDead()) return false;
  if (localStorage.getItem("impersonatedBy")) return false;
  if (localStorage.getItem("token")) return true;
  if (localStorage.getItem("businessDetails")) return true;
  return false;
}

function throwHardRefreshError(code) {
  const e = new Error(code === "NO_REFRESH_TOKEN" ? "NO_REFRESH_TOKEN" : "REFRESH_REVOKED");
  e.code = code;
  throw e;
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

  if (isRefreshDead()) {
    throwHardRefreshError("NO_REFRESH_TOKEN");
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

        applyAccessToken(accessToken);
        return accessToken;
      })
      .catch((err) => {
        const status = err.response?.status;
        const code = err.response?.data?.code;
        const message = err.response?.data?.message;

        if (
          status === 401 &&
          (code === "NO_REFRESH_TOKEN" || message === "No refresh token")
        ) {
          markRefreshDead();
          clearAccessToken();
          try {
            localStorage.removeItem("businessDetails");
          } catch {
            /* ignore */
          }
          throwHardRefreshError("NO_REFRESH_TOKEN");
        }

        if (
          status === 401 &&
          (code === "REFRESH_TOKEN_NOT_FOUND" ||
            code === "REFRESH_TOKEN_INVALID")
        ) {
          markRefreshDead();
          clearAccessToken();
          try {
            localStorage.removeItem("businessDetails");
          } catch {
            /* ignore */
          }
          throwHardRefreshError(code);
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

  // No session signal / known-dead cookie → never hit the network (avoids red 401)
  if (!shouldAttemptRefresh()) {
    return token && !isAccessTokenExpired(token) ? token : null;
  }

  try {
    return await refreshAccessTokenOnce();
  } catch (err) {
    if (localStorage.getItem("impersonatedBy")) {
      return token || null;
    }

    // Hard failures: never hand sockets an expired token (retry storm)
    if (isHardRefreshFailure(err)) {
      return null;
    }

    // Transient failure: reuse cached token only while still valid
    if (token && !isAccessTokenExpired(token)) {
      return token;
    }

    return null;
  }
}

/**
 * Clear access token from storage. Call only from explicit logout / hard refresh miss.
 */
export function clearAccessToken() {
  localStorage.removeItem("token");
  if (typeof authHeaderSetter === "function") {
    authHeaderSetter(null);
  }
}
