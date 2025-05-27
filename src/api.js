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

let accessToken = null;

export function setAccessToken(token) {
  accessToken = token;
}

API.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
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
  async (error) => {
    const { response, config } = error;
    if (!response) {
      if (!isProd) console.error("Network error:", error);
      return Promise.reject(new Error("שגיאת רשת"));
    }
    if (
      response.status === 401 &&
      !config._retry &&
      !config.url.endsWith("/auth/refresh-token") &&
      window.location.pathname !== "/login"
    ) {
      config._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");

        const res = await axios.post(`${BASE_URL}/auth/refresh-token`, { refreshToken });

        const newAccessToken = res.data.accessToken;
        setAccessToken(newAccessToken);

        // Retry original request with new access token
        config.headers.Authorization = `Bearer ${newAccessToken}`;
        return API(config);
      } catch (err) {
        window.location.replace("/login");
        return Promise.reject(err);
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
    if (!isProd) console.error(`API Error ${response.status}:`, message);
    return Promise.reject(new Error(message));
  }
);

export default API;
