// src/authHelpers.js
import * as jwtDecode from "jwt-decode";
import { refreshToken as contextRefreshToken } from "../context/AuthContext";

// בודק אם הטוקן פג
export function isTokenExpired(token) {
  if (!token) return true;
  try {
    const { exp } = jwtDecode(token);
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}

// מביא את ה־accessToken מהקונטקסט או מ־localStorage
export function getAccessToken() {
  // אפשר לשלב קריאה ל־useAuth אם רוצים React hook
  return localStorage.getItem("accessToken");
}

// מביא את ה־businessId מה־localStorage
export function getBusinessId() {
  try {
    const biz = JSON.parse(localStorage.getItem("businessDetails") || "{}");
    return biz._id || biz.businessId || null;
  } catch {
    return null;
  }
}

// מוודא טוקן תקף או מרענן אותו
export async function ensureValidToken() {
  let token = getAccessToken();
  if (isTokenExpired(token)) {
    try {
      token = await contextRefreshToken();
      localStorage.setItem("accessToken", token);
    } catch (e) {
      throw new Error("Cannot refresh token");
    }
  }
  return token;
}
