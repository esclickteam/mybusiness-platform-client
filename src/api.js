import axios from "axios";

// הגדרת BASE_URL דינמית לפי סביבה (פיתוח / פרודקשן)
const isProd = import.meta.env.MODE === "production";
const BASE_URL = isProd
  ? "https://api.esclick.co.il/api"
  : "/api";  // ב־dev proxied ל־localhost:5000/api

// יצירת instance של Axios
const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,        // שולח את ה־HttpOnly cookie אוטומטית אם קיים
  timeout: 5000,                // timeout לאחר 5 שניות
  headers: {
    Accept: "application/json",
  },
});

// הגדרת טוקן קיים מראש
const token = localStorage.getItem("token");
if (token) {
  API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// interceptor לבקשות שמוודא Authorization header מעודכן
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
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

// interceptor לתשובות: טיפול ב־401, רענון טוקן ולוג שגיאות
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

    // במקרה של 401 (לא עבור /auth/me) – נסה רענון טוקן
    if (response.status === 401 && !config.url.endsWith("/auth/me")) {
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const refreshResponse = await axios.post(`${BASE_URL}/auth/refresh-token`, { refreshToken });
          if (refreshResponse.data.accessToken) {
            // עדכון הטוקן החדש ב־localStorage
            localStorage.setItem("token", refreshResponse.data.accessToken);
            // עדכון ה־Axios
            API.defaults.headers.common["Authorization"] = `Bearer ${refreshResponse.data.accessToken}`;
            config.headers["Authorization"] = `Bearer ${refreshResponse.data.accessToken}`;
            // נסה שנית את הבקשה המקורית
            return API(config);
          }
        }
      } catch (err) {
        console.error("Error refreshing token:", err);
        // ניווט ללוגין אם לא הצלחנו לחדש את הטוקן
        window.location.replace("/login");
      }
    }

    // טיפול בשגיאות אחרות והצגת הודעות מתאימות
    const contentType = response.headers["content-type"] || "";
    let message;
    if (!contentType.includes("application/json")) {
      message = typeof response.data === "string" ? response.data : JSON.stringify(response.data);
    } else {
      message = response.data?.message || JSON.stringify(response.data);
    }

    console.error(`API Error ${response.status}:`, message);
    return Promise.reject(new Error(message));
  }
);

export default API;
