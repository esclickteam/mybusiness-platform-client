import axios from "axios";

// משתמש רק בפרוקסי של vercel.json
const BASE_URL = "/api";

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ❌ הסר את הכנסת ה־Authorization אם אתה משתמש ב־cookie בלבד
// אפשר להשאיר אותו – רק אם אתה רוצה future support להרשאות חכמות יותר
// אבל כרגע – אפשר גם להסיר

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
