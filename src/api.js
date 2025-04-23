// src/api.js

import axios from "axios";

// השתמש ישירות ב־REACT_APP_API_URL (מוגדר ב־Vercel לסביבת Production)
// אם אינו מוגדר – נשתמש בריק כדי להפיל שגיאה ברורה, ולא ב־localhost
const BASE_URL = process.env.REACT_APP_API_URL;
if (!BASE_URL) {
  throw new Error(
    "Missing environment variable REACT_APP_API_URL. " +
    "Please define it in Vercel under Settings → Environment Variables " +
    "with value https://api.esclick.co.il/api"
  );
}

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// מוסיף את ה-JWT לכל בקשה אם קיים
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// מנתק אוטומטית אם מקבל 401 ולא בדף /login
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
