// src/utils/tokenHelpers.js
import API from "../api";

/**
 * בודק אם הטוקן פג תוקף
 */
export function isTokenExpired(token) {
  if (!token) return true;
  try {
    const { exp } = jwtDecode(token);
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}

/**
 * מביא את ה־accessToken מה־localStorage
 */
export function getAccessToken() {
  return localStorage.getItem("token"); // רק הטוקן החדש נשמר ב־localStorage
}

/**
 * מביא את ה־businessId מה־localStorage
 */
export function getBusinessId() {
  try {
    const biz = JSON.parse(localStorage.getItem("businessDetails") || "{}");
    return biz._id || biz.businessId || null;
  } catch {
    return null;
  }
}

/**
 * לא מבצע רענון אוטומטי יותר.
 */
export function ensureValidToken() {
  return getAccessToken(); // מחזיר את ה־accessToken בלבד
}
