import axios from "axios";
import jwtDecode from "jwt-decode";

const isProd = import.meta.env.MODE === "production";
const BASE_URL = isProd ? "https://api.bizuply.com/api" : "/api";

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

/**
 * Single-flight refresh via httpOnly cookie.
 * Safe to call from Axios interceptor and AuthContext.
 */
export async function refreshAccessTokenOnce() {
  const isImpersonating = Boolean(localStorage.getItem("impersonatedBy"));

  if (isImpersonating) {
    throw new Error("Refresh disabled during impersonation");
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
          throw new Error("NO_REFRESH_TOKEN");
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

    if (err.message === "NO_REFRESH_TOKEN") {
      return token || null;
    }

    console.error("Failed to refresh access token:", err);
    localStorage.removeItem("token");
    if (typeof authHeaderSetter === "function") {
      authHeaderSetter(null);
    }
    return null;
  }
}
