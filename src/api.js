import axios from "axios";

// הגדרת BASE_URL דינמית לפי סביבת הפיתוח או הפרודקשן
const isProd = import.meta.env.MODE === "production";
const BASE_URL = isProd
  ? "https://api.esclick.co.il/api"
  : "/api";  // ב־dev proxied ל־localhost:5000/api

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
    if (config.data && !(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }
    // הוספת ה-Authorization אוטומטית לטוקן שנמצא בלוקלסטורג'
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// interceptor לתשובות: טיפול ב־401, רענון טוקן, הפקת שגיאות ולוג
API.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  async (error) => {
    const { response, config } = error;
    if (!response) {
      console.error("Network error:", error);
      return Promise.reject(new Error("שגיאת רשת"));
    }

    // טיפול ברענון טוקן אוטומטי ב-401
    if (
      response.status === 401 &&
      !config._retry &&
      !config.url.endsWith("/auth/refresh-token")
    ) {
      if (isRefreshing) {
        // מחכים לסיום רענון קודם
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            config.headers["Authorization"] = "Bearer " + token;
            return API(config);
          })
          .catch(err => Promise.reject(err));
      }

      config._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const res = await API.post(
          "/auth/refresh-token",
          {},
          { headers: { "x-refresh-token": refreshToken } }
        );

        const { token: newToken, refreshToken: newRefreshToken } = res.data;

        if (newToken) {
          localStorage.setItem("token", newToken);
          API.defaults.headers.common["Authorization"] = "Bearer " + newToken;
          if (newRefreshToken) {
            localStorage.setItem("refreshToken", newRefreshToken);
          }
          processQueue(null, newToken);
          config.headers["Authorization"] = "Bearer " + newToken;
          return API(config);
        }
      } catch (err) {
        processQueue(err, null);
        // רענון נכשל - ניתוב ללוגין
        window.location.replace("/login");
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // במקרה של 401 בשאר המקרים (לא אחרי ניסיון רענון), ניתוב ללוגין
    if (
      response.status === 401 &&
      !config.url.endsWith("/auth/me") &&
      window.location.pathname !== "/login"
    ) {
      window.location.replace("/login");
      return;
    }

    // טיפול בשגיאות רגילות - הפקת הודעה לקריאה נוחה
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
