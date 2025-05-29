import { io } from "socket.io-client";
import { getAccessToken, getRefreshToken, getBusinessId, ensureValidToken } from "./utils/authHelpers";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://api.esclick.co.il";  // עדכון משתנה סביבה

export function createSocket() {
  // קבלת הטוקן, ה-refreshToken ומזהה העסק
  const token = ensureValidToken();  // אם הטוקן פג תוקף, נשלח את ה-refreshToken
  const refreshToken = getRefreshToken();  // טוקן רענון
  const businessId = getBusinessId();

  // אם אחד מהערכים חסר או אם הטוקן פג תוקף, נבצע התחברות מחדש
  if (!token || !refreshToken || !businessId) {
    console.error("Missing token, refreshToken, or businessId");
    alert("Missing required authentication data. Please log in again.");
    window.location.href = "/login";  // הפניית משתמש להתחברות מחדש
    return null;
  }

  // יצירת החיבור לסוקט
  console.log("🔗 Creating socket connection...");

  const socket = io(SOCKET_URL, {
    path: "/socket.io",
    transports: ["websocket"],
    withCredentials: true,
    auth: {
      token,
      refreshToken,  // שלח את ה־refreshToken
      role: "business",
      businessId,
    },
    autoConnect: false,  // לא להתחבר אוטומטית
  });

  // חיבור מחדש אם התוקן תקף
  socket.on("connect", () => {
    console.log("✅ Connected to WebSocket server:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Disconnected from WebSocket server");
  });

  // טיפול במקרה של expired token
  socket.on("tokenExpired", async () => {
    console.log("🚨 Token expired, attempting to refresh...");

    const newRefreshToken = getRefreshToken();  // קבלת ה־refreshToken ממקום מאובטח

    if (!newRefreshToken) {
      alert("Session expired. Please log in again.");
      window.location.href = "/login"; // הפניית התחברות מחדש
      return;
    }

    try {
      const response = await fetch(`${SOCKET_URL}/auth/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: newRefreshToken }),  // שליחת ה-refreshToken
      });

      if (!response.ok) {
        console.error('Failed to refresh token: HTTP error', response.status);
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      if (data.accessToken) {
        console.log('✅ New accessToken received');
        localStorage.setItem("token", data.accessToken);  // שמירת הטוקן החדש ב־localStorage
        socket.auth.token = data.accessToken;

        // הפסק את החיבור הקודם והתחבר מחדש עם ה־accessToken החדש
        socket.disconnect();
        socket.connect();  // התחבר מחדש עם ה־accessToken החדש
        console.log("✅ Access token refreshed and reconnected");
      } else {
        console.error("Failed to refresh token: No access token returned");
        alert("Session expired. Please log in again.");
        window.location.href = "/login";  // הפניית התחברות מחדש
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      alert("An error occurred while refreshing the token. Please try again.");
      window.location.href = "/login";  // הפניית התחברות מחדש
    }
  });

  // טיפול בשגיאות חיבור
  socket.on("connect_error", (err) => {
    console.error('Socket connection error:', err.message);
    alert('Connection failed: ' + err.message);
  });

  socket.on("connect_failed", () => {
    console.error('Socket connection failed');
    alert('Failed to connect to server. Please try again.');
  });

  return socket;
}

export default createSocket;
