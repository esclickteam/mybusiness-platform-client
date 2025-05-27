// src/utils/tokenHelpers.js
import API from "../api";

export async function refreshToken() {
  try {
    const refreshToken = localStorage.getItem("refreshToken"); // שלוף את ה-refreshToken
    if (!refreshToken) throw new Error("No refresh token stored");

    const res = await API.post("/auth/refresh-token", { refreshToken });  // שלח ב-body
    const newAccessToken = res.data.accessToken || res.data.token;
    if (!newAccessToken) throw new Error("No token in refresh response");

    localStorage.setItem("accessToken", newAccessToken);

    // שמור גם את ה-refreshToken החדש אם קיים (לעיתים שרת מחזיר טוקן רענון חדש)
    if (res.data.refreshToken) {
      localStorage.setItem("refreshToken", res.data.refreshToken);
    }

    return newAccessToken;
  } catch (err) {
    console.error("Failed to refresh token:", err);
    throw err;
  }
}
