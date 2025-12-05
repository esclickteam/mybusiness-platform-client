// src/socket.js — Singleton WebSocket helper (v4 stable)
import { io } from "socket.io-client";
import { getUserRole } from "./utils/authHelpers";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://api.bizuply.com";

let socketInstance = null;   // Singleton instance
let currentToken = null;     // Cache last token used
let initialized = false;     // Prevent duplicate setup

/**
 * Creates or returns an existing Socket.IO singleton connection
 * Automatically refreshes token when expired and reconnects
 * 
 * @param {() => Promise<string|null>} getValidAccessToken
 * @param {() => void|Promise<void>}   onLogout
 * @param {string|null}                businessId
 */
export async function createSocket(getValidAccessToken, onLogout, businessId = null) {
  // ⛔ If instance exists & connected → return it
  if (socketInstance && socketInstance.connected) {
    return socketInstance;
  }

  // Ensure valid access token
  const token = await getValidAccessToken();
  if (!token) {
    onLogout?.();
    return null;
  }
  currentToken = token;

  // Validate role & businessId requirement
  const role = getUserRole();
  const needBiz = ["business", "business-dashboard"];
  if (needBiz.includes(role) && !businessId) {
    console.warn("[Socket] Missing businessId for role:", role);
    onLogout?.();
    return null;
  }

  // Create NEW socket instance ALWAYS with proper auth (important!)
  socketInstance = io(SOCKET_URL, {
    path: "/socket.io",
    transports: ["websocket"],
    withCredentials: true,
    reconnection: true,
    autoConnect: true,  // ⬅️ Connect instantly with auth
    auth: {
      token,
      role,
      businessId,       // ⬅️ CRITICAL: Required so server joins business rooms
    },
  });

  // Initialize listeners once
  if (!initialized) {
    initialized = true;

    socketInstance.on("connect", () => {
      console.log(`✅ WS connected (${socketInstance.id})`);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log(`🔴 WS disconnected: ${reason}`);
    });

    /**
     * 🔁 Auto-refresh token when expired
     */
    const refreshAndReconnect = async () => {
      try {
        const newToken = await getValidAccessToken();
        if (!newToken) {
          console.warn("[Socket] Token refresh failed → logging out");
          onLogout?.();
          return;
        }

        currentToken = newToken;

        // Update auth & reconnect
        socketInstance.auth = {
          token: newToken,
          role,
          businessId,
        };
        socketInstance.io.opts.auth = socketInstance.auth;

        if (!socketInstance.connected) socketInstance.connect();
      } catch (err) {
        console.error("[Socket] Token refresh error:", err);
        onLogout?.();
      }
    };

    socketInstance.on("tokenExpired", refreshAndReconnect);
    socketInstance.on("connect_error", (err) => {
      if (err?.message === "jwt expired") {
        refreshAndReconnect();
      } else {
        console.warn("[Socket] connect_error:", err.message);
      }
    });

    /**
     * 📡 Forward server-side businessUpdates to the app
     */
    socketInstance.on("businessUpdates", (payload) => {
      console.log("📩 [Socket] businessUpdates received:", payload);

      // Fire global event accessible everywhere (notifications, inbox, CRM, etc.)
      window.dispatchEvent(
        new CustomEvent("biz:businessUpdates", { detail: payload })
      );
    });
  }

  return socketInstance;
}

export default createSocket;
