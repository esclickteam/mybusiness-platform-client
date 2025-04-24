import axios from "axios";

const BASE_URL = "/api";

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// שליחת Authorization רק אם את עובדת עם טוקן (למשל בפיתוח)
API.interceptors.request.use((config) => {
  if (process.env.NODE_ENV !== "production") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});


// ✅ מטפל בהתנתקות אוטומטית אם הטוקן לא תקין
API.interceptors.response.use(
  (resp) => resp,
  (error) => {
    const isOnLoginPage = window.location.pathname === "/login";
    if (error.response?.status === 401 && !isOnLoginPage) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.replace("/login");
    }
    return Promise.reject(error);
  }
);

export default API;
