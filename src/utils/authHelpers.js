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

// מביא את ה־accessToken מהlocalStorage
export function getAccessToken() {
  return localStorage.getItem("accessToken");
}

// מביא את ה־businessId מהlocalStorage
export function getBusinessId() {
  try {
    const biz = JSON.parse(localStorage.getItem("businessDetails") || "{}");
    return biz._id || biz.businessId || null;
  } catch {
    return null;
  }
}

// מוודא טוקן תקף או מרענן אותו
// refreshTokenFunc זה פונקציה שצריך להעביר מבחוץ
export async function ensureValidToken(refreshTokenFunc) {
  let token = getAccessToken();
  if (isTokenExpired(token)) {
    if (!refreshTokenFunc) throw new Error("refreshToken function is required");
    try {
      token = await refreshTokenFunc();
      localStorage.setItem("accessToken", token);
    } catch (e) {
      throw new Error("Cannot refresh token");
    }
  }
  return token;
}
