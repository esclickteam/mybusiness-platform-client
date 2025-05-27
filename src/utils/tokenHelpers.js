// src/utils/tokenHelpers.js
import API from "../api"; // או נתיב מתאים לאקסיוס שלך

export async function refreshToken() {
  try {
    const res = await API.post("/auth/refresh-token");
    const newToken = res.data.token;
    if (!newToken) throw new Error("No token in refresh response");
    localStorage.setItem("accessToken", newToken);
    return newToken;
  } catch (err) {
    console.error("Failed to refresh token:", err);
    throw err;
  }
}
