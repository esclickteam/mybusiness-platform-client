import axios from "axios";
import {
  getValidAccessToken,
  isAccessTokenExpired,
  isHardRefreshFailure,
  isRefreshDead,
  registerAuthHeaderSetter,
  refreshAccessTokenOnce,
  shouldAttemptRefresh,
} from "./utils/tokenRefresh";
import {
  handleSessionInvalidated,
  isSessionInvalidAuthCode,
  isSessionInvalidated,
  registerAuthRetryAbort,
} from "./utils/sessionInvalidation";
import { getAdminActiveBusinessId, getBusinessIdFromPath } from "./utils/adminTenant";

const envApiUrl = String(import.meta.env.VITE_API_URL || "")
  .trim()
  .replace(/\/+$/, "");
const BASE_URL =
  envApiUrl ||
  (import.meta.env.MODE === "production"
    ? "https://api.bizuply.com/api"
    : "/api");

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 20000,
  headers: {
    Accept: "application/json",
  },
});

// Main function to set the Authorization header
const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
};

registerAuthHeaderSetter(setAuthToken);

// Set token when the module is loaded
setAuthToken(localStorage.getItem("token"));

// Auth endpoints that must not trigger a recursive refresh retry
const isRefreshEndpoint = (url = "") => {
  return String(url).endsWith("/auth/refresh-token");
};

const isLoginOrRegisterEndpoint = (url = "") => {
  return [
    "/auth/login",
    "/auth/register",
    "/auth/staff-login",
    "/auth/logout",
  ].some((endpoint) => String(url).endsWith(endpoint));
};

// Variables for tracking token refresh and registering callbacks
let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(token) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback) {
  refreshSubscribers.push(callback);
}

function cancelPendingAuthRetries() {
  onRefreshed(null);
  refreshSubscribers = [];
  isRefreshing = false;
}

registerAuthRetryAbort(cancelPendingAuthRetries);

function rejectWithApiMessage(response) {
  const contentType = response.headers["content-type"] || "";
  let message;

  if (!contentType.includes("application/json")) {
    message =
      typeof response.data === "string"
        ? response.data
        : JSON.stringify(response.data);
  } else {
    message =
      response.data?.error ||
      response.data?.message ||
      (typeof response.data === "string"
        ? response.data
        : JSON.stringify(response.data));
  }

  console.error(`API Error ${response.status}:`, message);
  const err = new Error(message);
  err.code = response.data?.code;
  err.status = response.status;
  return Promise.reject(err);
}

// Request interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    } else {
      delete config.headers["Authorization"];
    }

    // Scope tenant by active business route. Backend applies this for admins
    // (and ignores it for users who don't own the business).
    const tenantBusinessId =
      getAdminActiveBusinessId() || getBusinessIdFromPath() || null;
    if (tenantBusinessId) {
      config.headers["X-Business-Id"] = tenantBusinessId;
    } else {
      delete config.headers["X-Business-Id"];
    }

    // FormData must not be forced to JSON
    if (config.data && !(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    } else {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
API.interceptors.response.use(
  (response) => response,

  async (error) => {
    const { response, config } = error;

    if (!response) {
      console.error("Network error:", error);
      return Promise.reject(new Error("Network error"));
    }

    const authErrorCode = response.data?.code;

    // Irrevocable session invalidation ג€” atomic logout, never refresh/retry.
    if (
      response.status === 401 &&
      isSessionInvalidAuthCode(authErrorCode)
    ) {
      handleSessionInvalidated({ code: authErrorCode });
      return rejectWithApiMessage(response);
    }

    // Handle unauthorized ג€” refresh cookie then retry (including /auth/me)
    const shouldTryRefresh =
      response.status === 401 ||
      (response.status === 403 && authErrorCode === "TOKEN_EXPIRED");

    if (
      shouldTryRefresh &&
      config &&
      !isRefreshEndpoint(config.url) &&
      !isLoginOrRegisterEndpoint(config.url) &&
      !config._retry &&
      !isRefreshDead() &&
      !isSessionInvalidated() &&
      shouldAttemptRefresh()
    ) {
      config._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          addRefreshSubscriber((token) => {
            if (!token) return reject(new Error("Failed to refresh token"));
            if (isSessionInvalidated()) {
              return reject(new Error("SESSION_REVOKED"));
            }
            config.headers["Authorization"] = `Bearer ${token}`;
            resolve(API(config));
          });
        });
      }

      isRefreshing = true;

      try {
        const newToken = await refreshAccessTokenOnce();

        if (newToken && !isSessionInvalidated()) {
          config.headers["Authorization"] = `Bearer ${newToken}`;
          onRefreshed(newToken);
          return API(config);
        }

        throw new Error("No new token");
      } catch (err) {
        onRefreshed(null);

        // Never re-send a non-expired but revoked/mismatched access token.
        if (
          isHardRefreshFailure(err) ||
          isSessionInvalidAuthCode(err?.code) ||
          isSessionInvalidated()
        ) {
          if (isSessionInvalidAuthCode(err?.code)) {
            handleSessionInvalidated({ code: err.code });
          }
          return Promise.reject(err);
        }

        const existing = localStorage.getItem("token");
        if (existing && !isAccessTokenExpired(existing) && !isSessionInvalidated()) {
          config.headers["Authorization"] = `Bearer ${existing}`;
          return API(config);
        }

        if (!isHardRefreshFailure(err)) {
          console.warn("Error refreshing token:", err?.message || err);
        }

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return rejectWithApiMessage(response);
  }
);

export { setAuthToken, getValidAccessToken };
export default API;
