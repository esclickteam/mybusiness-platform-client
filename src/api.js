// src/api.js
import axios from "axios";
import { isTokenExpired } from "../utils/authHelpers";          // הוספה
import { refreshToken as contextRefreshToken } from "../context/AuthContext"; // ייבוא רענון טוקן

const isProd = import.meta.env.MODE === "production";
const BASE_URL = isProd
  ? "https://api.esclick.co.il/api"
  : "/api";

// ---------- יצירת אינסטנס של axios ----------
const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 5000,
  headers: {
    Accept: "application/json",
    "Accept-Language": navigator.language || "he-IL",
  },
});

// ---------- משתנה פנימי להחזקת access token ----------
let accessToken = localStorage.getItem("accessToken") || null;

// ---------- פונקציות לעדכון access/refresh token ----------
export function setAccessToken(token) {
  accessToken = token;
  if (token) {
    localStorage.setItem("accessToken", token);
    API.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem("accessToken");
    delete API.defaults.headers.common.Authorization;
  }
}

export function setRefreshToken(token) {
  if (token) {
    localStorage.setItem("refreshToken", token);
  } else {
    localStorage.removeItem("refreshToken");
  }
}

// ---------- לוגיקת רענון טוקן ----------
let isRefreshing = false;
let refreshQueue = [];

function processQueue(error, newToken) {
  refreshQueue.forEach(p => {
    if (error) p.reject(error);
    else p.resolve(newToken);
  });
  refreshQueue = [];
}

// ---------- אינטרספטור לבקשות יוצאות ----------
API.interceptors.request.use(
  async config => {
    // אם הטוקן פג, רענן אותו אוטומטית
    if (isTokenExpired(accessToken)) {
      try {
        const newAT = await contextRefreshToken();
        setAccessToken(newAT);
      } catch {
        // כישלון ברענון → ניווט ל־login
        window.location.replace("/login");
        return Promise.reject(new Error("Session expired"));
      }
    }

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    if (!isProd) {
      console.log(`🔀 API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    if (config.data && !(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  err => {
    if (!isProd) console.error("❌ API Request Error:", err);
    return Promise.reject(err);
  }
);

// ---------- אינטרספטור לתגובות נכנסות ----------
API.interceptors.response.use(
  response => {
    if (!isProd) {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  async error => {
    const { response, config } = error;
    if (!response) {
      if (!isProd) console.error("❌ Network error:", error);
      return Promise.reject(new Error("שגיאת רשת"));
    }

    const shouldRefresh =
      response.status === 401 &&
      !config._retry &&
      !config.url.endsWith("/auth/refresh-token") &&
      window.location.pathname !== "/login";

    if (shouldRefresh) {
      config._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({
            resolve: token => {
              config.headers.Authorization = `Bearer ${token}`;
              resolve(API(config));
            },
            reject: err => reject(err),
          });
        });
      }

      isRefreshing = true;
      try {
        const rToken = localStorage.getItem("refreshToken");
        if (!rToken) throw new Error("אין refresh token");

        const refreshInstance = axios.create({
          baseURL: BASE_URL,
          withCredentials: true,
        });
        const res = await refreshInstance.post("/auth/refresh-token", { refreshToken: rToken });

        const { accessToken: newAT, refreshToken: newRT } = res.data;
        setAccessToken(newAT);
        setRefreshToken(newRT);

        processQueue(null, newAT);
        config.headers.Authorization = `Bearer ${newAT}`;
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

    const contentType = response.headers["content-type"] || "";
    let message;
    if (!contentType.includes("application/json")) {
      message = typeof response.data === "string"
        ? response.data
        : JSON.stringify(response.data);
    } else {
      message = response.data?.message || JSON.stringify(response.data);
    }
    if (!isProd) console.error(`❌ API Error ${response.status}:`, message);
    return Promise.reject(new Error(message));
  }
);

export default API;
