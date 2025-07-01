// src/socket.js — Singleton WebSocket helper (v3)
import { io } from "socket.io-client";
import { getUserRole } from "./utils/authHelpers";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://api.esclick.co.il";

let socketInstance = null;  // singleton instance
let currentToken   = null;  // last used token

/**
 * מחזיר מופע Socket.IO יחיד; אם כבר קיים עם אותו טוקן – מחזיר אותו
 * @param {() => Promise<string|null>} getValidAccessToken
 * @param {() => void|Promise<void>}   onLogout
 * @param {string|null}                businessId
 */
export async function createSocket(getValidAccessToken, onLogout, businessId = null) {
  // קבל טוקן עדכני
  const token = await getValidAccessToken();
  if (!token) {
    onLogout?.();
    return null;
  }

  // בדיקת role ו-businessId
  const role = getUserRole();
  const needBiz = ["business", "business-dashboard"];
  if (needBiz.includes(role) && !businessId) {
    onLogout?.();
    return null;
  }

  // אם כבר יש מופע פעיל עם אותו טוקן – החזרו
  if (socketInstance && token === currentToken) {
    return socketInstance;
  }

  // אחרת – נתקו מופע קודם (אם היה)
  if (socketInstance) {
    socketInstance.removeAllListeners();
    socketInstance.disconnect();
    socketInstance = null;
  }

  currentToken = token;

  // צרו מופע חדש
  socketInstance = io(SOCKET_URL, {
    path: "/socket.io",
    transports: ["websocket"],
    auth: { token, role, businessId },
    reconnection: true,
  });

  // לוג חיבור/ניתוק
  socketInstance.on("connect", () =>
    console.log(`✅ WS connected (${socketInstance.id})`)
  );
  socketInstance.on("disconnect", (reason) => {
    console.log(`🔴 WS disconnected: ${reason}`);
    // אם הסיבה היא client/server disconnect – נשטוף את המופע
    if (["io client disconnect", "io server disconnect"].includes(reason)) {
      socketInstance = null;
    }
  });

  // טיפול ב-expired token
  const refreshAndReconnect = async () => {
    const newT = await getValidAccessToken();
    if (!newT) {
      onLogout?.();
      return;
    }
    currentToken = newT;
    socketInstance.auth.token = newT;
    socketInstance.io.opts.auth.token = newT;
    socketInstance.connect();
  };
  socketInstance.on("tokenExpired", refreshAndReconnect);
  socketInstance.on("connect_error", (err) => {
    if (err?.message === "jwt expired") {
      refreshAndReconnect();
    }
  });

  return socketInstance;
}

export default createSocket;
