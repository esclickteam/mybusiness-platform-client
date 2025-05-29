// src/utils/createSocket.js
import { io } from "socket.io-client";
import { getValidAccessToken, getBusinessId, getUserRole } from "./utils/authHelpers";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://api.esclick.co.il";

export async function createSocket() {
  // קבלת AccessToken תקין
  const token = await getValidAccessToken();

  // קבלת תפקיד המשתמש
  const role = getUserRole(); // דוגמא: "business", "customer", "chat", "client" וכו'

  // רק במידה והתפקיד דורש מזהה עסק - קבלת מזהה העסק
  let businessId = null;
  if (role === "business" || role === "business-dashboard") {
    const rawBusinessId = getBusinessId();
    businessId =
      typeof rawBusinessId === "string"
        ? rawBusinessId
        : rawBusinessId?._id?.toString() || rawBusinessId?.toString();
  }

  // בדיקות תקינות נתונים לפני יצירת החיבור
  if (!token || (["business", "business-dashboard"].includes(role) && !businessId)) {
    console.error("❌ Missing token or businessId for role", role);
    alert("Missing required authentication data. Please log in again.");
    window.location.href = "/login";
    return null;
  }

  console.log("🔍 Checking authentication data...");
  console.log("Token:", token);
  console.log("Role:", role);
  console.log("BusinessId:", businessId);

  console.log("🔗 Creating socket connection to:", SOCKET_URL);

  const socket = io(SOCKET_URL, {
    path: "/socket.io",
    transports: ["polling", "websocket"],  // כולל fallback ל-polling
    auth: {
      token,
      role,
      businessId,
    },
    autoConnect: false,
  });

  // מחברים את הסוקט מיד לאחר יצירתו
  socket.connect();

  socket.on("connect", () => {
    console.log("✅ Connected to WebSocket server. Socket ID:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("🔴 Disconnected from WebSocket server. Reason:", reason);
  });

  socket.on("tokenExpired", async () => {
    console.log("🚨 Token expired event received. Attempting to refresh token...");

    const newToken = await getValidAccessToken();

    if (!newToken) {
      alert("Session expired. Please log in again.");
      window.location.href = "/login";
      return;
    }

    console.log("✅ New access token received");
    localStorage.setItem("token", newToken);
    socket.auth.token = newToken;

    console.log("🔄 Disconnecting and reconnecting socket with new token...");
    socket.disconnect();
    socket.connect();
    console.log("✅ Reconnected with refreshed access token");
  });

  socket.on("connect_error", (err) => {
    console.error("❌ Socket connection error:", err.message);
    alert("Connection failed: " + err.message);
  });

  socket.on("connect_failed", () => {
    console.error("❌ Socket connection failed");
    alert("Failed to connect to server. Please try again.");
  });

  return socket;
}

export default createSocket;
