// client/src/api.js
import axios from "axios";

// 1️⃣ משיכה מה־.env:
//    – ב־.env.development (ב־root של client) תשאירו blank או לא מגדירים בכלל
//    – ב־.env.production (או ב־Vercel Env Vars) תגדירו:
//        VITE_API_URL=https://mybusinessplatformclean-production.up.railway.app/api
//    או אם אתם מעדיפים להשתמש בדומיין הסופי:
//        VITE_API_URL=https://api.esclick.co.il/api
const BASE_URL = import.meta.env.VITE_API_URL || "/api";

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// 2️⃣ Interceptor לשילוח ה־JWT
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 3️⃣ אם מקבלים 401 ולא על עמוד הלוגין — לוגאאוט
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
