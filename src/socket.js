// src/socket.js — Singleton WebSocket helper
import { io } from "socket.io-client";
import { getUserRole } from "./utils/authHelpers";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://api.esclick.co.il";

let socketInstance = null;          // מופע סוקט יחיד לכל האפליקציה
let currentToken   = null;          // token האחרון שהוזרק

/**
 * יוצר (או מחזיר) מופע Socket.IO מאומת, ללא כפילויות.
 * – מצרף businessId ו‑role כבר ב‑handshake כך שהשרת ישים את הסוקט בחדרים לפני  connect.
 * – מטפל ברענון טוקן אוטומטי ובניתוק נקי בלוג‑אאוט.
 *
 * @param {() => Promise<string|null>} getValidAccessToken  פונקציה שמחזירה JWT תקין
 * @param {() => Promise<void>|void}  onLogout             להתנתק אם אי‑אפשר לרענן
 * @param {string|null}                businessId          ID עסק (נחוץ לתפקידים עסקיים)
 * @returns {Promise<import("socket.io-client").Socket|null>}
 */
export async function createSocket(getValidAccessToken, onLogout, businessId = null) {
  // 1. קבל/חדש טוקן
  const token = await getValidAccessToken();
  if (!token) {
    onLogout?.();
    return null;
  }

  const role = getUserRole();
  const rolesNeedBiz = ["business", "business-dashboard"];
  if (rolesNeedBiz.includes(role) && !businessId) {
    console.error("❌ Missing businessId for role", role);
    onLogout?.();
    return null;
  }

  // 2. אם כבר יש סוקט עם אותו טוקן → החזר אותו
  if (socketInstance && socketInstance.connected && token === currentToken) {
    return socketInstance;
  }

  // 3. אם יש אינסטנס קיים עם טוקן ישן → נתק ונאפס
  if (socketInstance) {
    socketInstance.removeAllListeners();
    socketInstance.disconnect();
    socketInstance = null;
  }

  currentToken = token;

  /* ------------------------------------------------------------------ */
  /*  יצירת סוקט חדש                                                   */
  /* ------------------------------------------------------------------ */
  socketInstance = io(SOCKET_URL, {
    path: "/socket.io",
    transports: ["websocket"],
    auth: { token, role, businessId }, // ← נשלח ב‑handshake
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    randomizationFactor: 0.3,
  });

  /* -------------------------‬ EVENTS -------------------------------- */
  socketInstance.on("connect", () => {
    console.log(`✅ WS connected (${socketInstance.id}) role=${role}`);
  });

  socketInstance.on("disconnect", (reason) => {
    console.log("🔴 WS disconnected:", reason);
    if (["io client disconnect", "io server disconnect"].includes(reason)) {
      socketInstance = null;
    }
  });

  /*  רענון טוקן אוטומטי  */
  const refreshAndReconnect = async () => {
    const newToken = await getValidAccessToken();
    if (!newToken) {
      await onLogout?.();
      return;
    }
    currentToken = newToken;
    socketInstance.auth.token = newToken;
    socketInstance.io.opts.auth.token = newToken;
    socketInstance.connect();
  };

  socketInstance.on("tokenExpired", refreshAndReconnect);
  socketInstance.on("connect_error", (err) => {
    if (err?.message === "jwt expired") refreshAndReconnect();
    else console.error("❌ WS connect_error:", err.message);
  });

  return socketInstance;
}

export default createSocket;
