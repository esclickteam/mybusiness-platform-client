import { io } from "socket.io-client";
import {
  getValidAccessToken,
  getRefreshToken,
  getBusinessId,
  getUserRole,
} from "./authHelpers";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://api.esclick.co.il";

export async function createSocket() {
  const token = await getValidAccessToken();
  const refreshToken = getRefreshToken();
  const role = getUserRole();

  console.log("createSocket() - detected role:", role);
  console.log("createSocket() - token:", token);
  console.log("createSocket() - refreshToken:", refreshToken);
  console.log("createSocket() - businessId:", getBusinessId());

  let businessId = null;
  const rolesNeedingBusinessId = ["business", "business-dashboard"];
  if (rolesNeedingBusinessId.includes(role)) {
    const rawBusinessId = getBusinessId();
    businessId =
      typeof rawBusinessId === "string"
        ? rawBusinessId
        : rawBusinessId?._id?.toString() || rawBusinessId?.toString();
  }

  if (!token) {
    console.error("❌ Missing token for role", role);
    alert("Missing authentication token. Please log in again.");
    window.location.href = "/login";
    return null;
  }

  if (rolesNeedingBusinessId.includes(role) && !businessId) {
    console.error("❌ Missing businessId for role", role);
    alert("Missing business ID. Please log in again.");
    window.location.href = "/login";
    return null;
  }

  const auth = { token, refreshToken, role };
  if (businessId) auth.businessId = businessId;

  console.log("🔗 Connecting socket with auth:", auth);

  const socket = io(SOCKET_URL, {
    path: "/socket.io",
    transports: ["polling", "websocket"],
    auth,
    autoConnect: false,
  });

  socket.connect();

  socket.on("connect", () => {
    console.log("✅ Connected to WebSocket server. Socket ID:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("🔴 Disconnected from WebSocket server. Reason:", reason);
  });

  socket.on("tokenExpired", async () => {
    console.log("🚨 Token expired. Refreshing...");
    const newToken = await getValidAccessToken();
    if (!newToken) {
      alert("Session expired. Please log in again.");
      window.location.href = "/login";
      return;
    }
    localStorage.setItem("token", newToken);
    socket.auth.token = newToken;
    socket.disconnect();
    socket.connect();
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
