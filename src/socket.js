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
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    randomizationFactor: 0.5,
  });

  socket.connect();

  // חיבור מוצלח
  socket.on("connect", () => {
    console.log("✅ Connected to WebSocket server. Socket ID:", socket.id);
    if (socket.conversationId) {
      console.log("Rejoining conversation:", socket.conversationId);
      socket.emit("joinConversation", socket.conversationId, (ack) => {
        if (!ack.ok) {
          console.error("Failed to rejoin conversation:", ack.error);
        } else {
          console.log("Rejoined conversation after reconnect");
        }
      });
    }
  });

  // ניתוק מהשרת
  socket.on("disconnect", (reason) => {
    console.log("🔴 Disconnected from WebSocket server. Reason:", reason);
    if (reason === "io client disconnect") {
      console.log("Socket manually disconnected.");
    } else {
      console.log("Trying to reconnect...");
    }
  });

  // ניסיון התחברות מחדש
  socket.on("reconnect_attempt", (attempt) => {
    console.log("🔄 Reconnect attempt:", attempt);
  });

  // שגיאה בהתחברות מחדש
  socket.on("reconnect_error", (error) => {
    console.error("❌ Reconnect error:", error);
  });

  // כשלון בהתחברות מחדש
  socket.on("reconnect_failed", () => {
    console.error("❌ Reconnect failed");
    alert("Failed to reconnect to server.");
  });

  // אם הטוקן פג תוקף
  socket.on("tokenExpired", async () => {
    console.log("🚨 Token expired. Refreshing...");
    const newToken = await getValidAccessToken();
    if (!newToken) {
      alert("Session expired. Please log in again.");
      if (onLogout) onLogout();
      return;
    }
    console.log("🔄 New token received, updating socket auth");

    socket.auth.token = newToken;
    socket.io.opts.auth.token = newToken;

    socket.emit("authenticate", { token: newToken }, (ack) => {
      if (ack && ack.ok) {
        console.log("✅ Socket re-authenticated successfully");
      } else {
        console.warn("⚠ Socket re-authentication failed, disconnecting");
        socket.disconnect();
        if (onLogout) onLogout();
      }
    });
  });

  // שגיאה בהתחברות
  socket.on("connect_error", (err) => {
    console.error("❌ Socket connection error:", err.message);
    alert("Connection failed: " + err.message);
  });

  // שגיאה בהתחברות
  socket.on("connect_failed", () => {
    console.error("❌ Socket connection failed");
    alert("Failed to connect to server. Please try again.");
  });

  // לאחר חיבור מחדש, טוען את ההיסטוריה של השיחה
  socket.on("reconnect", async () => {
    console.log("🔄 Reconnected to server");
    if (socket.conversationId) {
      const history = await fetchConversationHistory(socket.conversationId);
      setMessages(history); // עדכון הסטייט עם ההיסטוריה
    }
  });

  return socket;
}

/**
 * Fetches the conversation history after reconnecting to the server.
 * @param {string} conversationId - The conversation ID to fetch the history for.
 * @returns {Promise<Array>} - The conversation history.
 */
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
