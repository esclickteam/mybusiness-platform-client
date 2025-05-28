// src/utils/authHelpers.js
import jwtDecode from "jwt-decode";

/**
 * בודק האם ה־JWT פג תוקף
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
  // כעת אנחנו שומרים את הטוקן תחת 'token'
  return localStorage.getItem("token");
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
 * מחזיר את ה־accessToken הנוכחי.
 * אין יותר רענון אוטומטי כאן — ה־Axios interceptor מטפל ברענון.
 */
export function ensureValidToken() {
  return getAccessToken();
}
