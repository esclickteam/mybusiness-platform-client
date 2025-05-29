import jwtDecode from "jwt-decode";

/**
 * בודק אם ה־JWT פג תוקף
 */
export function isTokenExpired(token) {
  if (!token) return true;
  try {
    const { exp } = jwtDecode(token);  // Decode את הטוקן כדי לקרוא את זמן התפוגה
    return Date.now() >= exp * 1000;  // אם התאריך הנוכחי אחרי התאריך של exp, הטוקן פג תוקף
  } catch {
    return true;  // אם קרתה שגיאה בהפענוח, נחזיר true (כמו טוקן פג תוקף)
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
 * מחזיר את ה־accessToken הנוכחי אם הוא תקין, או את ה־refreshToken אם לא.
 * זה מחזיר את ה־refreshToken אם ה־accessToken פג תוקף.
 */
export function ensureValidToken() {
  const token = getAccessToken();
  if (isTokenExpired(token)) {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      return refreshToken;  // אם הטוקן פג תוקף, תחזיר את ה-refreshToken
    }
    return null;  // אם לא נמצא טוקן תקף, תחזיר null
  }
  return token;  // אם הטוקן תקין, תחזיר את ה-accessToken
}
