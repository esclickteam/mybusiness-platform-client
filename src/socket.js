import { io } from "socket.io-client";
import { getValidAccessToken, getBusinessId } from "./utils/authHelpers";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://api.esclick.co.il";

export async function createSocket() {
  // קבלת AccessToken תקין ומזהה העסק
  const token = await getValidAccessToken();
  const businessId = getBusinessId();

  console.log("🔍 Checking authentication data...");
  console.log("Token:", token);
  console.log("BusinessId:", businessId);

  if (!token || !businessId) {
    console.error("❌ Missing token or businessId");
    alert("Missing required authentication data. Please log in again.");
    window.location.href = "/login";
    return null;
  }

  console.log("🔗 Creating socket connection to:", SOCKET_URL);

  const socket = io(SOCKET_URL, {
    path: "/socket.io",
    transports: ["websocket"],
    withCredentials: true,
    auth: {
      token,
      role: "business",
      businessId,
    },
    autoConnect: false,
  });

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
