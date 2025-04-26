// src/api.js
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

  // attach Authorization token in non-production
  if (process.env.NODE_ENV !== "production") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

// handle automatic logout on 401
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
