import axios from "axios";

const isProd = import.meta.env.MODE === "production";
const BASE_URL = isProd
  ? "https://api.esclick.co.il/api"
  : "/api";

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

// interceptor to set Content-Type for JSON requests only
API.interceptors.request.use((config) => {
  if (config.data && !(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }

  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log("Authorization header:", config.headers.Authorization);
  return config;
});

// handle automatic logout on 401 and better error parsing
API.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    const { response } = error;
    // רשת כושלת
    if (!response) {
      console.error("Network error:", error);
      return Promise.reject(new Error("שגיאת רשת"));
    }

    const contentType = response.headers["content-type"] || "";
    let message;

    // אם התוכן לא JSON, נסה לקרוא טקסט
    if (!contentType.includes("application/json")) {
      try {
        // axios כבר שם את body ב־response.data
        message = typeof response.data === "string"
          ? response.data
          : JSON.stringify(response.data);
      } catch {
        message = "שגיאה לא ידועה";
      }
    } else {
      // JSON – תן ל־axios לפרט error.response.data
      message = response.data?.message || JSON.stringify(response.data);
    }

    // אם 401, נקה סשן והעבר ל־login
    if (response.status === 401 && window.location.pathname !== "/login") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.replace("/login");
      return; // לא להמשיך
    }

    return Promise.reject(new Error(message));
  }
);

export default API;
