import axios from "axios";

const BASE_URL = "/api";

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json"
  }
});

// interceptor to set Content-Type for JSON requests only
API.interceptors.request.use((config) => {
  // set JSON Content-Type when data is not FormData
  if (config.data && !(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }

  // attach Authorization token
  const token = localStorage.getItem("authToken"); // השתמש ב-"authToken" במקום "token"
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // הוסף console.log כדי לבדוק את כותרת ה-Authorization
  console.log("Authorization header:", config.headers.Authorization); // הדפס את כותרת Authorization

  return config;
});

// handle automatic logout on 401
API.interceptors.response.use(
  (resp) => resp,
  (error) => {
    const isOnLoginPage = window.location.pathname === "/login";
    if (error.response?.status === 401 && !isOnLoginPage) {
      // אם יש שגיאה 401, הסר את הטוקן ואת המשתמש מ-`localStorage` ונווט לדף ההתחברות
      localStorage.removeItem("authToken"); // הסר את הטוקן
      localStorage.removeItem("user"); // הסר את המידע על המשתמש
      window.location.replace("/login"); // הפנה לדף התחברות
    }
    return Promise.reject(error);
  }
);

export default API;
