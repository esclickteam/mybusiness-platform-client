// src/utils/tokenHelpers.js
import API from "../api";

/**
 * פונקציה לרענון ה־access token
 */
export async function refreshToken() {
  try {
    const token = localStorage.getItem("token"); // שלוף את ה־access token
    if (!token) throw new Error("No access token stored");

    // שלח את ה־access token לשרת כדי לקבל טוקן חדש
    const res = await API.post("/auth/refresh-token", { token });

    const newAccessToken = res.data.accessToken || res.data.token;
    if (!newAccessToken) throw new Error("No token in refresh response");

    // שמור את ה־access token החדש
    localStorage.setItem("token", newAccessToken);

    return newAccessToken;
  } catch (err) {
    console.error("Failed to refresh token:", err);
    throw err;
  }
}
