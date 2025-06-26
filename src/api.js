import axios from "axios";

const isProd = import.meta.env.MODE === "production";
const BASE_URL = isProd
  ? "https://api.esclick.co.il/api"
  : "/api";

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 20000,
  headers: {
    Accept: "application/json",
  },
});

const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
};

setAuthToken(localStorage.getItem("token"));

// משתנה שמצביע אם ריענון טוקן מתבצע
let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(token) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback) {
  refreshSubscribers.push(callback);
}

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

    if (response.status === 401 && !config.url.endsWith("/auth/me")) {
      if (isRefreshing) {
        // אם כבר מתבצע ריענון, מחכים שיסיים וממשיכים עם הטוקן החדש
        return new Promise((resolve, reject) => {
          addRefreshSubscriber((token) => {
            if (!token) {
              reject(new Error("Failed to refresh token"));
              return;
            }
            config.headers["Authorization"] = `Bearer ${token}`;
            resolve(API(config));
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshResponse = await axios.post(`${BASE_URL}/auth/refresh-token`, null, { withCredentials: true });
        if (refreshResponse.data.accessToken) {
          localStorage.setItem("token", refreshResponse.data.accessToken);
          setAuthToken(refreshResponse.data.accessToken);
          config.headers["Authorization"] = `Bearer ${refreshResponse.data.accessToken}`;
          onRefreshed(refreshResponse.data.accessToken);
          return API(config);
        }
      } catch (err) {
        onRefreshed(null);
        console.error("Error refreshing token:", err);
        window.location.replace("/login");
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
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
