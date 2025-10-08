import axios from "axios";

const isProd = import.meta.env.MODE === "production";
const BASE_URL = isProd
  ? "https://api.esclick.co.il/api"
  : "/api";

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 20000,
  headers: {
    Accept: "application/json",
  },
});

// Central function to set the Authorization header
const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
};

// Setting the token on module load
setAuthToken(localStorage.getItem("token"));

// Identifying authentication endpoints to ignore them in token refresh
const isAuthEndpoint = (url) => {
  return [
    "/auth/me",
    "/auth/refresh-token",
    "/auth/login",
    "/auth/register",
  ].some((endpoint) => url.endsWith(endpoint));
};

// Variables to track token refresh and register callback
let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(token) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback) {
  refreshSubscribers.push(callback);
}

// Request interceptor: adds Authorization header to every call
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    } else {
      delete config.headers["Authorization"];
    }
    if (config.data && !(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }
    console.log(`API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor: handling error responses, including token refresh
API.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  async (error) => {
    const { response, config } = error;
    if (!response) {
      console.error("Network error:", error);
      return Promise.reject(new Error("Network error"));
    }

    // Handling 401/403 for non-authentication calls
    if (
      (response.status === 401 || response.status === 403) &&
      !isAuthEndpoint(config.url) &&
      !config._retry
    ) {
      config._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          addRefreshSubscriber((token) => {
            if (!token) {
              reject(new Error("Failed to refresh token"));
              return;
            }
            config.headers["Authorization"] = `Bearer ${token}`;
            resolve(API(config));
          });
        });
      }

      isRefreshing = true;
      try {
        const refreshResponse = await axios.post(
          `${BASE_URL}/auth/refresh-token`,
          null,
          { withCredentials: true }
        );
        const newToken = refreshResponse.data.accessToken;
        if (newToken) {
          localStorage.setItem("token", newToken);
          setAuthToken(newToken);
          config.headers["Authorization"] = `Bearer ${newToken}`;
          onRefreshed(newToken);
          return API(config);
        }
      } catch (err) {
        onRefreshed(null);
        console.error("Error refreshing token:", err);
        window.location.replace("/login");
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // Handling regular errors
    const contentType = response.headers["content-type"] || "";
    let message;
    if (!contentType.includes("application/json")) {
      message = typeof response.data === "string"
        ? response.data
        : JSON.stringify(response.data);
    } else {
      message = response.data?.message || JSON.stringify(response.data);
    }
    console.error(`API Error ${response.status}:`, message);
    return Promise.reject(new Error(message));
  }
);

export { setAuthToken };
export default API;
