import axios from "axios";

const isProd = import.meta.env.MODE === "production";
const BASE_URL = isProd
  ? "https://api.esclick.co.il/api"
  : "/api";

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,  // שולח אוטומטית את ה־HttpOnly cookie
  headers: {
    Accept: "application/json",
  },
});

// interceptor to set Content-Type for JSON requests only
API.interceptors.request.use((config) => {
  if (config.data && !(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }
  // no more Authorization header—כל הפיתוח מתבסס על cookie-Only
  return config;
});

// handle automatic logout on 401 and better error parsing
API.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    const { response } = error;
    if (!response) {
      console.error("Network error:", error);
      return Promise.reject(new Error("שגיאת רשת"));
    }

    // אם 401 – משתמש לא מאומת או טוקן פג תוקף
    if (response.status === 401 && window.location.pathname !== "/login") {
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

    return Promise.reject(new Error(message));
  }
);

export default API;
