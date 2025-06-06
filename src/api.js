import axios from "axios";

// הגדרת BASE_URL דינמית לפי סביבה (פיתוח / פרודקשן)
const isProd = import.meta.env.MODE === "production";
const BASE_URL = isProd
  ? "https://api.esclick.co.il/api"
  : "/api";  // ב־dev proxied ל־localhost:5000/api

// יצירת instance של Axios
const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // חשוב לשלוח עוגיות אוטומטית
  timeout: 20000,
  headers: {
    Accept: "application/json",
  },
});

// הגדרת טוקן קיים מראש (כדאי לאפשר גם במידול כעת, לא רק בהתחלה)
const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
};

// הגדר טוקן קיים (אם יש)
setAuthToken(localStorage.getItem("token"));

// interceptor לבקשות שמוודא Authorization header מעודכן
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    } else {
      delete config.headers["Authorization"];
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

    // טיפול ב־401 (למעט בקשת auth/me) – ניסיון רענון טוקן
    if (response.status === 401 && !config.url.endsWith("/auth/me")) {
      try {
        // ** כאן לא שולחים את ה-refreshToken ב-body **
        const refreshResponse = await axios.post(`${BASE_URL}/auth/refresh-token`, null, { withCredentials: true });
        if (refreshResponse.data.accessToken) {
          localStorage.setItem("token", refreshResponse.data.accessToken);
          setAuthToken(refreshResponse.data.accessToken);
          config.headers["Authorization"] = `Bearer ${refreshResponse.data.accessToken}`;
          return API(config);
        }
      } catch (err) {
        console.error("Error refreshing token:", err);
        window.location.replace("/login");
      }
    }

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
