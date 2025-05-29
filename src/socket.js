import { io } from "socket.io-client";
import { ensureValidToken, getRefreshToken, getBusinessId } from "./utils/authHelpers";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://api.esclick.co.il";

export function createSocket() {
  // קבלת הטוקנים ומזהה העסק
  const token = ensureValidToken();
  const refreshToken = getRefreshToken();
  const businessId = getBusinessId();

  console.log("🔍 Checking authentication data...");
  console.log("Token:", token);
  console.log("RefreshToken:", refreshToken);
  console.log("BusinessId:", businessId);

  if (!token || !refreshToken || !businessId) {
    console.error("❌ Missing token, refreshToken, or businessId");
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
      refreshToken,
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

    const newRefreshToken = getRefreshToken();
    console.log("New refresh token fetched:", newRefreshToken ? "Available" : "Not available");

    if (!newRefreshToken) {
      alert("Session expired. Please log in again.");
      window.location.href = "/login";
      return;
    }

    try {
      const response = await fetch(`${SOCKET_URL}/auth/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: newRefreshToken }),
      });

      if (!response.ok) {
        console.error("❌ Failed to refresh token: HTTP status", response.status);
        throw new Error("Failed to refresh token");
      }

      const data = await response.json();
      console.log("Response from refresh-token endpoint:", data);

      if (data.accessToken) {
        console.log("✅ New access token received");
        localStorage.setItem("token", data.accessToken);
        socket.auth.token = data.accessToken;

        console.log("🔄 Disconnecting and reconnecting socket with new token...");
        socket.disconnect();
        socket.connect();
        console.log("✅ Reconnected with refreshed access token");
      } else {
        console.error("❌ No access token returned from refresh");
        alert("Session expired. Please log in again.");
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("❌ Error refreshing token:", error);
      alert("An error occurred while refreshing the token. Please try again.");
      window.location.href = "/login";
    }
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
