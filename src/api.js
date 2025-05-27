import axios from "axios";

const isProd = import.meta.env.MODE === "production";
const BASE_URL = isProd
  ? "https://api.esclick.co.il/api"
  : "/api";

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 5000,
  headers: {
    Accept: "application/json",
    "Accept-Language": navigator.language || "he-IL",
  },
});

export function setAccessToken(token) {
  if (token) {
    localStorage.setItem("accessToken", token);
  } else {
    localStorage.removeItem("accessToken");
  }
}

export function setRefreshToken(token) {
  if (token) {
    localStorage.setItem("refreshToken", token);
  } else {
    localStorage.removeItem("refreshToken");
  }
}

// ========== Refresh Logic ==========
let isRefreshing = false;
let refreshQueue = [];

function processQueue(error, newAccessToken) {
  refreshQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(newAccessToken);
    }
  });
  refreshQueue = [];
}

// ========== REQUEST INTERCEPTOR ==========
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (!isProd) {
      console.log(
        `API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`
      );
    }
    if (config.data && !(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => {
    if (!isProd) {
      console.error("API Request Error:", error);
    }
    return Promise.reject(error);
  }
);

// ========== RESPONSE INTERCEPTOR ==========
API.interceptors.response.use(
  (response) => {
    if (!isProd) {
      console.log(
        `API Response: ${response.status} ${response.config.url}`
      );
    }
    return response;
  },
  async (error) => {
    const { response, config } = error;
    if (!response) {
      if (!isProd) console.error("Network error:", error);
      return Promise.reject(new Error("שגיאת רשת"));
    }

    const isAuthFail =
      response.status === 401 &&
      !config._retry &&
      !config.url.endsWith("/auth/refresh-token") &&
      window.location.pathname !== "/login";

    if (isAuthFail) {
      config._retry = true;

      if (isRefreshing) {
        // המתן עד שהרענון יסתיים ואז נסה שוב
        return new Promise((resolve, reject) => {
          refreshQueue.push({
            resolve: (token) => {
              config.headers.Authorization = `Bearer ${token}`;
              resolve(API(config));
            },
            reject: (err) => {
              reject(err);
            },
          });
        });
      }

      isRefreshing = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");

        // שימוש ב־axios ללא אינטרספטורים כדי למנוע לולאה!
        const refreshInstance = axios.create({
          baseURL: BASE_URL,
          withCredentials: true,
        });
        const res = await refreshInstance.post("/auth/refresh-token", { refreshToken });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = res.data;
        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);

        API.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);

        config.headers.Authorization = `Bearer ${newAccessToken}`;
        return API(config);
      } catch (err) {
        processQueue(err, null);
        setAccessToken(null);
        setRefreshToken(null);
        window.location.replace("/login");
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // other errors → stringify message
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
    if (!isProd) console.error(`API Error ${response.status}:`, message);
    return Promise.reject(new Error(message));
  }
);

export default API;
