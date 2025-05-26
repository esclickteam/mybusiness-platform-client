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

API.interceptors.request.use(
  (config) => {
    if (!isProd) {
      console.log(`API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
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

API.interceptors.response.use(
  (response) => {
    if (!isProd) {
      console.log(`API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    const { response, config } = error;
    if (!response) {
      if (!isProd) console.error("Network error:", error);
      return Promise.reject(new Error("שגיאת רשת"));
    }
    if (
      response.status === 401 &&
      !config.url.endsWith("/auth/me") &&
      window.location.pathname !== "/login"
    ) {
      window.location.replace("/login");
      return;
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
    if (!isProd) console.error(`API Error ${response.status}:`, message);
    return Promise.reject(new Error(message));
  }
);

export default API;
