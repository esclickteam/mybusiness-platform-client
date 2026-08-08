// src/socket.js — Singleton WebSocket helper (v4 stable)
import { io } from "socket.io-client";
import { getUserRole } from "./utils/authHelpers";
import { getSocketUrl } from "./config/runtimeUrls";

const SOCKET_URL = getSocketUrl();

let socketInstance = null;
let currentToken = null;
let listenersBound = false;
let refreshInFlight = false;

function bindSocketListeners(socket, getValidAccessToken, businessId) {
  if (listenersBound || !socket) return;
  listenersBound = true;

  socket.on("connect", () => {
    // Use this socket's own id — not a possibly-replaced module singleton
    console.log(`✅ WS connected (${socket.id})`);
  });

  socket.on("disconnect", (reason) => {
    console.log(`🔴 WS disconnected: ${reason}`);
  });

  const refreshAndReconnect = async () => {
    if (refreshInFlight) return;
    refreshInFlight = true;

    try {
      const newToken = await getValidAccessToken({ force: true });
      if (!newToken || !socketInstance) {
        console.warn("[Socket] Token refresh failed — will retry on next event");
        return;
      }

      currentToken = newToken;
      const role = getUserRole();

      socketInstance.auth = {
        token: newToken,
        role,
        businessId,
      };
      socketInstance.io.opts.auth = socketInstance.auth;

      if (!socketInstance.connected) socketInstance.connect();
    } catch (err) {
      console.warn("[Socket] Token refresh error:", err?.message || err);
    } finally {
      refreshInFlight = false;
    }
  };

  socket.on("tokenExpired", refreshAndReconnect);
  socket.on("connect_error", (err) => {
    const msg = String(err?.message || "");
    if (msg.includes("jwt expired") || msg.includes("TokenExpired")) {
      refreshAndReconnect();
    } else {
      console.warn("[Socket] connect_error:", msg);
    }
  });

  socket.on("businessUpdates", (payload) => {
    console.log("📩 [Socket] businessUpdates received:", payload);
    window.dispatchEvent(
      new CustomEvent("biz:businessUpdates", { detail: payload })
    );
  });
}

/**
 * Creates or returns an existing Socket.IO singleton connection
 * Automatically refreshes token when expired and reconnects
 *
 * @param {() => Promise<string|null>} getValidAccessToken
 * @param {() => void|Promise<void>}   onLogout
 * @param {string|null}                businessId
 */
export async function createSocket(getValidAccessToken, onLogout, businessId = null) {
  // Reuse existing singleton (connected or still connecting)
  if (socketInstance) {
    if (!socketInstance.connected) {
      const token = await getValidAccessToken();
      if (token) {
        currentToken = token;
        const role = getUserRole();
        socketInstance.auth = { token, role, businessId };
        socketInstance.io.opts.auth = socketInstance.auth;
        socketInstance.connect();
      }
    }
    return socketInstance;
  }

  const token = await getValidAccessToken();
  if (!token) {
    console.warn("[Socket] No access token yet — skipping connection");
    return null;
  }
  currentToken = token;

  const role = getUserRole();
  const needBiz = ["business", "business-dashboard"];
  if (needBiz.includes(role) && !businessId) {
    console.warn("[Socket] Missing businessId for role:", role);
    return null;
  }

  socketInstance = io(SOCKET_URL, {
    path: "/socket.io",
    transports: ["websocket"],
    withCredentials: true,
    reconnection: true,
    autoConnect: true,
    auth: {
      token,
      role,
      businessId,
    },
  });

  bindSocketListeners(socketInstance, getValidAccessToken, businessId);

  return socketInstance;
}

export default createSocket;
