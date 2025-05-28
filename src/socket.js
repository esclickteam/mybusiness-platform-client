// src/socket.js
import { io } from "socket.io-client";
import { getAccessToken, getRefreshToken, getBusinessId } from "./utils/authHelpers";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export function createSocket() {
  const token = getAccessToken();
  const refreshToken = getRefreshToken();  // קבל את ה־refreshToken
  const businessId = getBusinessId();

  if (!token || !refreshToken || !businessId) {
    console.error("Missing token, refreshToken, or businessId");
    return null;
  }

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
    console.log("Connected to WebSocket server:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from WebSocket server");
  });

  // טיפול במקרה של expired token
  socket.on("tokenExpired", async () => {
    try {
      console.log("🔄 Refreshing token...");
      
      const response = await fetch(`${SOCKET_URL}/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();
      if (data.accessToken) {
        // עדכון ה־accessToken החדש
        socket.auth.token = data.accessToken;

        // הפסק את החיבור הקודם והתחבר מחדש עם ה־accessToken החדש
        socket.disconnect();
        socket.connect();  // התחבר מחדש עם ה־accessToken החדש
        console.log("✅ Access token refreshed and reconnected");
      } else {
        console.error("Failed to refresh token");
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  });

  return socket;
}

export default createSocket;
