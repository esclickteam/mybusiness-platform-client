import axios from "axios";
import {
  getValidAccessToken,
  registerAuthHeaderSetter,
  refreshAccessTokenOnce,
} from "./utils/tokenRefresh";
import { getAdminActiveBusinessId } from "./utils/adminTenant";

const isProd = import.meta.env.MODE === "production";
const BASE_URL = isProd
  ? "https://api.bizuply.com/api"
  : "/api";

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

const PUBLIC_PATHS = new Set([
  "/",
  "/login",
  "/register",
  "/pricing",
  "/features",
  "/about",
  "/contact",
]);

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

function redirectToLoginIfNeeded() {
  const pathname = window.location.pathname;
  const isAlreadyOnLogin = pathname === "/login";
  const isPublicPage = PUBLIC_PATHS.has(pathname);

  if (!isAlreadyOnLogin && !isPublicPage) {
    window.location.replace("/login");
  }
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

    // Admin cross-tenant: scope /business/my and CRM to the target business
    const adminBusinessId = getAdminActiveBusinessId();
    if (adminBusinessId) {
      config.headers["X-Business-Id"] = adminBusinessId;
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

    // Handle unauthorized — refresh cookie then retry (including /auth/me)
    if (
      (response.status === 401 || response.status === 403) &&
      config &&
      !isRefreshEndpoint(config.url) &&
      !isLoginOrRegisterEndpoint(config.url) &&
      !config._retry
    ) {
      config._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          addRefreshSubscriber((token) => {
            if (!token) return reject(new Error("Failed to refresh token"));
            config.headers["Authorization"] = `Bearer ${token}`;
            resolve(API(config));
          });
        });
      }

      isRefreshing = true;

      try {
        const newToken = await refreshAccessTokenOnce();

        if (newToken) {
          config.headers["Authorization"] = `Bearer ${newToken}`;
          onRefreshed(newToken);
          return API(config);
        }

        throw new Error("No new token");
      } catch (err) {
        onRefreshed(null);
        console.error("Error refreshing token:", err);

        localStorage.removeItem("token");
        delete API.defaults.headers.common["Authorization"];
        redirectToLoginIfNeeded();

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle standard errors
    const contentType = response.headers["content-type"] || "";
    let message;

    if (!contentType.includes("application/json")) {
      message =
        typeof response.data === "string"
          ? response.data
          : JSON.stringify(response.data);
    } else {
      message = response.data?.message || JSON.stringify(response.data);
    }

    console.error(`API Error ${response.status}:`, message);
    return Promise.reject(new Error(message));
  }
);

export { setAuthToken, getValidAccessToken };
export default API;
