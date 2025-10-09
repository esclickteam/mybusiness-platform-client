// src/socket.js — Singleton WebSocket helper (v3)
import { io } from "socket.io-client";
import { getUserRole } from "./utils/authHelpers";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://api.BizUply.co.il";

let socketInstance = null;  // singleton instance
let currentToken   = null;  // last used token

/**
 * Returns a single Socket.IO instance; if one already exists with the same token – returns it
 * @param {() => Promise<string|null>} getValidAccessToken
 * @param {() => void|Promise<void>}   onLogout
 * @param {string|null}                businessId
 */
export async function createSocket(getValidAccessToken, onLogout, businessId = null) {
  // Get the latest token
  const token = await getValidAccessToken();
  if (!token) {
    onLogout?.();
    return null;
  }

  // Check role and businessId
  const role = getUserRole();
  const needBiz = ["business", "business-dashboard"];
  if (needBiz.includes(role) && !businessId) {
    onLogout?.();
    return null;
  }

  // If there is already an active instance with the same token – return it
  if (socketInstance && token === currentToken) {
    return socketInstance;
  }

  // Otherwise – disconnect the previous instance (if there was one)
  if (socketInstance) {
    socketInstance.removeAllListeners();
    socketInstance.disconnect();
    socketInstance = null;
  }

  currentToken = token;

  // Create a new instance
  socketInstance = io(SOCKET_URL, {
    path: "/socket.io",
    transports: ["websocket"],
    auth: { token, role, businessId },
    reconnection: true,
  });

  // Connection/disconnection log
  socketInstance.on("connect", () =>
    console.log(`✅ WS connected (${socketInstance.id})`)
  );
  socketInstance.on("disconnect", (reason) => {
    console.log(`🔴 WS disconnected: ${reason}`);
    // If the reason is client/server disconnect – reset the instance
    if (["io client disconnect", "io server disconnect"].includes(reason)) {
      socketInstance = null;
    }
  });

  // Handling expired token
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