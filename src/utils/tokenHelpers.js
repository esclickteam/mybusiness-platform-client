import jwtDecode from "jwt-decode";

/**
 * בודק אם ה־JWT פג תוקף
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
  return localStorage.getItem("token");
}

/**
 * מביא את ה־refreshToken מה־localStorage
 */
export function getRefreshToken() {
  return localStorage.getItem("refreshToken");
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
 * מבצע בדיקה אם הטוקן בתוקף, אם לא — מחזיר את ה-refreshToken.
 */
export function ensureValidToken() {
  const token = getAccessToken();
  if (isTokenExpired(token)) {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      return refreshToken;
    }
    return null;
  }
  return token;
}
