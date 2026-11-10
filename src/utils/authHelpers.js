import jwtDecode from "jwt-decode";
import {
  getValidAccessToken as sharedGetValidAccessToken,
  isAccessTokenExpired,
} from "./tokenRefresh";
import { browserHostname, resolveApiBaseUrl } from "../apiBaseUrl";

// Never silently fall back to Production from Staging/Preview hosts.
const BASE_URL = resolveApiBaseUrl({
  envApiUrl: import.meta.env.VITE_API_URL,
  mode: import.meta.env.MODE,
  hostname: browserHostname(),
});

// Checks if the token is expired
export function isTokenExpired(token) {
  return isAccessTokenExpired(token);
}

// Returns the access token from localStorage
export function getAccessToken() {
  return localStorage.getItem("token");
}

// Returns the business ID from localStorage, if it exists
export function getBusinessId() {
  try {
    const biz = JSON.parse(localStorage.getItem("businessDetails") || "{}");
    return biz._id || biz.businessId || null;
  } catch {
    return null;
  }
}

// Returns a valid access token, refreshes it if expired
export async function getValidAccessToken() {
  return sharedGetValidAccessToken();
}

// Returns the user role from the token
export function getUserRole() {
  const token = getAccessToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    const role = decoded.role || null;

    if (role === "business" && window.location.pathname.includes("/dashboard")) {
      return "business-dashboard";
    }

    return role;
  } catch {
    return null;
  }
}

export { BASE_URL };
