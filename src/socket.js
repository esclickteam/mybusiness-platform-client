// src/socket.js — Singleton WebSocket helper (v2)
import { io } from "socket.io-client";
import { getUserRole } from "./utils/authHelpers";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://api.esclick.co.il";

let socketInstance = null; // מופע יחיד
let currentToken   = null; // הטוקן האחרון

/**
 * מחזיר מופע Socket.IO יחיד – אם כבר קיים (גם אם עדיין connecting) מחזיר אותו.
 * @param {() => Promise<string|null>} getValidAccessToken
 * @param {() => void|Promise<void>}   onLogout
 * @param {string|null}                businessId
 */
export async function createSocket(getValidAccessToken, onLogout, businessId = null) {
  const token = await getValidAccessToken();
  if (!token) { onLogout?.(); return null; }

  const role = getUserRole();
  const needBiz = ["business", "business-dashboard"];
  if (needBiz.includes(role) && !businessId) { onLogout?.(); return null; }

  // 👉 אם כבר קיים אינסטנס עם אותו טוקן – החזר אותו (גם אם עדיין לא connected)
  if (socketInstance && token === currentToken) return socketInstance;

  // 🧹 נתק את הקודם (טוקן הוחלף)
  if (socketInstance) {
    socketInstance.removeAllListeners();
    socketInstance.disconnect();
    socketInstance = null;
  }

  currentToken = token;

  socketInstance = io(SOCKET_URL, {
    path: "/socket.io",
    transports: ["websocket"],
    auth: { token, role, businessId },
    reconnection: true,
  });

  // לוגים בסיסיים
  socketInstance.on("connect", () => console.log(`✅ singleton WS connected (${socketInstance.id})`));
  socketInstance.on("disconnect", (r) => {
    console.log("🔴 WS disconnected:", r);
    if (["io client disconnect", "io server disconnect"].includes(r)) {
      socketInstance = null;
    }
  });

  // רענון טוקן
  const refreshAndReconnect = async () => {
    const newT = await getValidAccessToken();
    if (!newT) return onLogout?.();
    currentToken = newT;
    socketInstance.auth.token = newT;
    socketInstance.io.opts.auth.token = newT;
    socketInstance.connect();
  };
  socketInstance.on("tokenExpired", refreshAndReconnect);
  socketInstance.on("connect_error", (e) => {
    if (e?.message === "jwt expired") refreshAndReconnect();
  });

  return socketInstance;
}

export default createSocket;
