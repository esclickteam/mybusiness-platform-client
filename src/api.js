// src/api.js
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

let accessToken = localStorage.getItem("accessToken") || null;

export function setAccessToken(token) {
  accessToken = token;
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

// attach token header & debug log on each request
API.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
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

// handle responses, auto-refresh token on 401
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

    // refresh flow
    const isAuthFail =
      response.status === 401 &&
      !config._retry &&
      !config.url.endsWith("/auth/refresh-token") &&
      window.location.pathname !== "/login";

    if (isAuthFail) {
      config._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");

        // use API instance so baseURL and withCredentials stay in effect
        const res = await API.post("/auth/refresh-token", { refreshToken });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          res.data;

        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);

        // retry original request
        config.headers.Authorization = `Bearer ${newAccessToken}`;
        return API(config);
      } catch (err) {
        // failed to refresh → logout
        setAccessToken(null);
        setRefreshToken(null);
        window.location.replace("/login");
        return Promise.reject(err);
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
