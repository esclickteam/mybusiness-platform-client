// src/socket.js
import { io } from "socket.io-client";
import { getUserRole } from "./utils/authHelpers";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://api.esclick.co.il";

let socketInstance = null; // מופע יחיד

/**
 * יוצר או מחזיר מופע Socket.IO קיים, עם אימות JWT והצטרפות לחדרים.
 * @param {Function} getValidAccessToken - פונקציה אסינכרונית שמחזירה Access Token תקין
 * @param {Function} onLogout - callback לביצוע logout במקרה של טוקן פג תוקף
 * @param {string|null} businessId - מזהה העסק (נחוץ לתפקידים עסקיים)
 */
export async function createSocket(getValidAccessToken, onLogout, businessId = null) {
  // reuse existing socket אם קיים ומחובר
  if (socketInstance && socketInstance.connected) {
    console.log("Reusing existing socket instance:", socketInstance.id);
    return socketInstance;
  }

  const token = await getValidAccessToken();
  if (!token) {
    onLogout?.();
    return null;
  }

  const role = getUserRole();
  const rolesNeedingBiz = ["business", "business-dashboard"];
  if (rolesNeedingBiz.includes(role) && !businessId) {
    console.error("❌ Missing businessId for role", role);
    onLogout?.();
    return null;
  }

  console.log("🔗 Connecting socket:", { SOCKET_URL, role, businessId });
  const auth = { token, role, ...(businessId && { businessId }) };

  socketInstance = io(SOCKET_URL, {
    path: "/socket.io",
    transports: ["websocket"],
    auth,
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    randomizationFactor: 0.5,
  });

  socketInstance.connect();

  // ברגע שמתחברים – מצטרפים לחדרים
  socketInstance.on("connect", () => {
    console.log("✅ Connected to WebSocket server. Socket ID:", socketInstance.id);

    if (businessId) {
      // חדר לקבלת התראות עסקיות ודשבורד
      socketInstance.emit("joinBusinessRoom", businessId);
      console.log(`Requested joinBusinessRoom for business-${businessId}`);
    }

    // אם סיימנו להצטרף לשיחה ספציפית
    if (socketInstance.conversationId) {
      socketInstance.emit(
        "joinConversation",
        socketInstance.conversationId,
        (ack) => {
          if (!ack.ok) console.error("Failed to rejoin conversation:", ack.error);
          else console.log("Rejoined conversation after reconnect");
        }
      );
    }
  });

  socketInstance.on("disconnect", (reason) => {
    console.log("🔴 Disconnected from WebSocket server. Reason:", reason);
    if (reason === "io client disconnect") {
      socketInstance = null; // איפוס כשמתנתקים ידנית
    }
  });

  // טיפול בתוקף הטוקן
  socketInstance.on("tokenExpired", async () => {
    console.log("🚨 Token expired. Attempting silent refresh...");
    const newToken = await getValidAccessToken();
    if (newToken) {
      socketInstance.auth.token = newToken;
      socketInstance.io.opts.auth.token = newToken;
      socketInstance.emit("authenticate", { token: newToken }, (ack) => {
        if (!ack.ok) {
          socketInstance.disconnect();
          socketInstance = null;
          onLogout?.();
        }
      });
    } else {
      onLogout?.();
    }
  });

  socketInstance.on("connect_error", (err) => {
    console.error("❌ Socket connection error:", err.message);
  });

  return socketInstance;
}

export default createSocket;
