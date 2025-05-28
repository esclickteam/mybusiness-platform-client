// src/api/index.js
import axios from "axios";

// הגדרת BASE_URL דינמית לפי סביבת הפיתוח או הפרודקשן
const isProd = import.meta.env.MODE === "production";
const BASE_URL = isProd
  ? "https://api.esclick.co.il/api"
  : "/api";  // ב־dev proxied ל־localhost:5000/api

// יצירת instance של Axios
const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,        // שולח HttpOnly cookie אוטומטית
  timeout: 5000,                // timeout לאחר 5 שניות
  headers: {
    Accept: "application/json",
  },
});

// interceptor לביצוע לוג של כל Request
API.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
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

// interceptor לתשובות: טיפול ב־401 + רענון טוקן + retry + הפקת שגיאות ולוג
let isRefreshing = false;
let subscribers = [];

function onRefreshed() {
  subscribers.forEach(cb => cb());
  subscribers = [];
}

function addSubscriber(cb) {
  subscribers.push(cb);
}

API.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    const { response, config } = error;

    // רשתית
    if (!response) {
      console.error("Network error:", error);
      return Promise.reject(new Error("שגיאת רשת"));
    }

    // טיפול ב־401
    if (response.status === 401 && !config._retry) {
      config._retry = true;

      // אם כבר ברענון, נחכה לתוצאות
      if (isRefreshing) {
        return new Promise(resolve => {
          addSubscriber(() => resolve(API(config)));
        });
      }

      isRefreshing = true;
      // ביצוע רענון טוקן דרך ה-cookie
      return API.post("/auth/refresh-token")
        .then(res => {
          isRefreshing = false;
          onRefreshed();
          // אחרי רענון, נריץ שוב את הקריאה המקורית
          return API(config);
        })
        .catch(err => {
          isRefreshing = false;
          console.warn("Refresh token failed:", err);
          // כשל ברענון -> נשלח ל־login
          window.location.replace("/login");
          return Promise.reject(err);
        });
    }

    // לא 401 רגיל או כבר ניסינו ורענון כשל
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
