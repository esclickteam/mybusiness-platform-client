import jwtDecode from "jwt-decode";

export function isTokenExpired(token) {
  if (!token) return true;
  try {
    const { exp } = jwtDecode(token);
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}

export function getAccessToken() {
  return localStorage.getItem("token");
}

export function getRefreshToken() {
  return localStorage.getItem("refreshToken");
}

export function getBusinessId() {
  try {
    const biz = JSON.parse(localStorage.getItem("businessDetails") || "{}");
    return biz._id || biz.businessId || null;
  } catch {
    return null;
  }
}

/**
 * מחזיר AccessToken תקין. אם פג תוקף – מנסה לרענן.
 * במקרה של כישלון מחזיר null.
 */
export async function getValidAccessToken() {
  let token = getAccessToken();

  if (!token || isTokenExpired(token)) {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      return null;
    }
    try {
      const response = await fetch(`/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (!response.ok) {
        return null;
      }
      const data = await response.json();
      if (data.accessToken) {
        localStorage.setItem("token", data.accessToken);
        token = data.accessToken;
      } else {
        return null;
      }
    } catch {
      return null;
    }
  }
  return token;
}

// הוספתי את הפונקציה הזו להחזרת תפקיד המשתמש
export function getUserRole() {
  const token = getAccessToken();
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.role || null;
  } catch {
    return null;
  }
}
