import axios from "axios";

// הגדרת BASE_URL דינמית לפי סביבת הפיתוח או הפרודקשן
const isProd = import.meta.env.MODE === "production";
const BASE_URL = isProd
  ? "https://api.esclick.co.il/api"
  : "/api";

// יצירת instance של Axios
const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,        // שולח את ה־HttpOnly cookie אוטומטית
  timeout: 5000,                // timeout לאחר 5 שניות
  headers: {
    Accept: "application/json",
  },
});

// interceptor לביצוע לוג של כל Request
API.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    // Content-Type אוטומטי עבור JSON
    if (config.data && !(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// interceptor לתשובות: טיפול ב־401, הפקת שגיאות ולוג
API.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    const { response } = error;
    if (!response) {
      console.error("Network error:", error);
      return Promise.reject(new Error("שגיאת רשת"));
    }

    // logout אוטומטי והפנייה ל־/login במקרה 401
    if (response.status === 401 && window.location.pathname !== "/login") {
      window.location.replace("/login");
      return;
    }

    // קריאה לתוכן השגיאה
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

export default API;
