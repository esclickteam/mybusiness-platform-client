// src/api.js

import axios from "axios";

// -----------------------------
// 1. Base URL חייב להיות מוגדר כ־env var!
//    תוודא/י ב־Vercel (Settings → Environment Variables):
//      Key:   REACT_APP_API_URL
//      Value: https://api.esclick.co.il/api
//    ואז תעשה Redeploy, כדי שהערך ייטמע ב־bundle.
// -----------------------------
const BASE_URL = process.env.REACT_APP_API_URL;
if (!BASE_URL) {
  throw new Error(
    "Missing REACT_APP_API_URL – " +
    "define it in Vercel (Settings → Environment Variables) " +
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

// מוסיף את ה-JWT אוטומטית
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// אם 401 ומבחוץ לדף /login – מפנה מחדש ל־login
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
