import { io } from "socket.io-client";
import { getUserRole } from "./utils/authHelpers";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://api.esclick.co.il";

/**
 * @param {function} getValidAccessToken - פונקציה להחזרת טוקן תקין (רענון במידת הצורך)
 * @param {function} onLogout - פונקציה לטיפול ביציאה (למשל הפניה ל-login)
 * @param {string|null} businessId - מזהה העסק (אם רלוונטי)
 */
export async function createSocket(getValidAccessToken, onLogout, businessId = null) {
  const token = await getValidAccessToken();

  if (!token) {
    alert("Session expired. Please log in again.");
    if (onLogout) onLogout();
    return null;
  }

  const role = getUserRole();

  console.log("createSocket() - detected role:", role);
  console.log("createSocket() - received businessId:", businessId);

  const rolesNeedingBusinessId = ["business", "business-dashboard"];
  if (rolesNeedingBusinessId.includes(role) && !businessId) {
    console.error("❌ Missing businessId for role", role);
    alert("Missing business ID. Please log in again.");
    if (onLogout) onLogout();
    return null;
  }

  console.log("🔗 Connecting socket:", { SOCKET_URL, role, businessId: businessId || "(none)" });

  const auth = { token, role };
  if (businessId) auth.businessId = businessId;

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
    if (!getValidAccessToken) {
      console.error("No getValidAccessToken function provided");
      return;
    }
    const newToken = await getValidAccessToken();
    if (!newToken) {
      alert("Session expired. Please log in again.");
      if (onLogout) onLogout();
      return;
    }
    console.log("🔄 New token received, reconnecting socket");
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
