import { io } from "socket.io-client";
import { getUserRole } from "./utils/authHelpers";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://api.esclick.co.il";

let socketInstance = null; // משתנה מחוץ לפונקציה לשמירת מופע יחיד

export async function createSocket(getValidAccessToken, onLogout, businessId = null) {
  // אם כבר יש socket פעיל, מחזירים אותו
  if (socketInstance && socketInstance.connected) {
    console.log("Reusing existing socket instance:", socketInstance.id);
    return socketInstance;
  }

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

  socketInstance = io(SOCKET_URL, {
    path: "/socket.io",
    transports: ["polling", "websocket"],
    auth,
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    randomizationFactor: 0.5,
  });

  socketInstance.connect();

  socketInstance.on("connect", () => {
    console.log("✅ Connected to WebSocket server. Socket ID:", socketInstance.id);
    if (socketInstance.conversationId) {
      socketInstance.emit("joinConversation", socketInstance.conversationId, (ack) => {
        if (!ack.ok) {
          console.error("Failed to rejoin conversation:", ack.error);
        } else {
          console.log("Rejoined conversation after reconnect");
        }
      });
    }
  });

  socketInstance.on("disconnect", (reason) => {
    console.log("🔴 Disconnected from WebSocket server. Reason:", reason);
    if (reason === "io client disconnect") {
      console.log("Socket manually disconnected.");
      socketInstance = null; // איפוס המופע כשמתנתקים ידנית
    } else {
      console.log("Trying to reconnect...");
    }
  });

  socketInstance.on("reconnect_attempt", (attempt) => {
    console.log("🔄 Reconnect attempt:", attempt);
  });

  socketInstance.on("reconnect_error", (error) => {
    console.error("❌ Reconnect error:", error);
  });

  socketInstance.on("reconnect_failed", () => {
    console.error("❌ Reconnect failed");
    alert("Failed to reconnect to server.");
  });

  socketInstance.on("tokenExpired", async () => {
    console.log("🚨 Token expired. Refreshing...");
    const newToken = await getValidAccessToken();
    if (!newToken) {
      alert("Session expired. Please log in again.");
      if (onLogout) onLogout();
      return;
    }
    console.log("🔄 New token received, updating socket auth");

    socketInstance.auth.token = newToken;
    socketInstance.io.opts.auth.token = newToken;

    socketInstance.emit("authenticate", { token: newToken }, (ack) => {
      if (ack && ack.ok) {
        console.log("✅ Socket re-authenticated successfully");
      } else {
        console.warn("⚠ Socket re-authentication failed, disconnecting");
        socketInstance.disconnect();
        socketInstance = null;
        if (onLogout) onLogout();
      }
    });
  });

  socketInstance.on("connect_error", (err) => {
    console.error("❌ Socket connection error:", err.message);
    alert("Connection failed: " + err.message);
  });

  socketInstance.on("connect_failed", () => {
    console.error("❌ Socket connection failed");
    alert("Failed to connect to server. Please try again.");
  });

  return socketInstance;
}

async function fetchConversationHistory(conversationId) {
  try {
    const response = await fetch(`/api/conversations/history?conversationId=${conversationId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch conversation history");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching conversation history:", error);
    return [];
  }
}

export default createSocket;
