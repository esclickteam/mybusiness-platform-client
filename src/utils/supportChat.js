import { io } from "socket.io-client";
import { getApiBaseUrl, getSocketUrl } from "../config/runtimeUrls";

const VISITOR_KEY = "bizuply_support_visitor_id";
const SESSION_KEY = "bizuply_support_session";

const API_BASE = getApiBaseUrl();
const SOCKET_URL = getSocketUrl();

export function getSupportVisitorId() {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `v-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return `v-${Date.now()}`;
  }
}

export function loadSupportSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveSupportSession(session) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session || {}));
  } catch {
    /* ignore */
  }
}

export function clearSupportSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

function isJwtExpired(token) {
  if (!token || typeof token !== "string") return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1] || ""));
    if (!payload?.exp) return false;
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

async function supportFetch(path, { method = "GET", body, token } = {}) {
  const visitorId = getSupportVisitorId();
  const headers = {
    "Content-Type": "application/json",
    "X-Support-Visitor-Id": visitorId,
  };

  // Prefer explicit guest/session token. Never send an expired dashboard access token.
  const authToken =
    token ||
    (() => {
      const stored = localStorage.getItem("token");
      return stored && !isJwtExpired(stored) ? stored : null;
    })();
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const canSendBody = method !== "GET" && method !== "HEAD";
  const payload =
    canSendBody && body && typeof body === "object"
      ? { visitorId, ...body }
      : canSendBody
        ? body
        : undefined;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    credentials: "include",
    body: payload != null ? JSON.stringify(payload) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || data.message || "Support request failed");
  }
  return data;
}

export async function openSupportSession({ name, email } = {}) {
  const visitorId = getSupportVisitorId();
  const data = await supportFetch("/support-chat/session", {
    method: "POST",
    body: { visitorId, name, email },
  });

  const session = {
    visitorId: data.visitorId || visitorId,
    guestToken: data.guestToken,
    conversation: data.conversation,
  };
  saveSupportSession(session);
  return session;
}

export async function saveBotExchange(conversationId, visitorText, botText, guestToken) {
  return supportFetch(`/support-chat/${conversationId}/bot-message`, {
    method: "POST",
    token: guestToken,
    body: { visitorText, botText },
  });
}

export async function requestHumanAgent(
  conversationId,
  { name, email, note } = {},
  guestToken
) {
  const data = await supportFetch(`/support-chat/${conversationId}/request-human`, {
    method: "POST",
    token: guestToken,
    body: { name, email, note },
  });

  const prev = loadSupportSession() || {};
  saveSupportSession({
    ...prev,
    conversation: data.conversation,
    guestToken: guestToken || prev.guestToken,
  });

  return data;
}

export async function fetchSupportMessages(conversationId, guestToken) {
  return supportFetch(`/support-chat/${conversationId}/messages`, {
    token: guestToken,
  });
}

export async function fetchSupportHistory(guestToken) {
  const visitorId = getSupportVisitorId();
  const q = encodeURIComponent(visitorId);
  return supportFetch(`/support-chat/history?visitorId=${q}`, {
    token: guestToken,
  });
}

export async function sendSupportMessageRest(conversationId, text, guestToken) {
  return supportFetch(`/support-chat/${conversationId}/messages`, {
    method: "POST",
    token: guestToken,
    body: { text },
  });
}

let guestSocket = null;
let guestSocketToken = null;

export function getSupportGuestSocket(guestToken) {
  if (!guestToken) return null;

  if (guestSocket && guestSocketToken === guestToken) {
    if (!guestSocket.connected) guestSocket.connect();
    return guestSocket;
  }

  if (guestSocket) {
    guestSocket.removeAllListeners();
    guestSocket.disconnect();
    guestSocket = null;
  }

  guestSocketToken = guestToken;
  guestSocket = io(SOCKET_URL, {
    path: "/socket.io",
    transports: ["websocket", "polling"],
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 800,
    autoConnect: true,
    auth: {
      token: guestToken,
      role: "support-guest",
    },
  });

  return guestSocket;
}

export function joinSupportConversation(guestToken, conversationId) {
  const socket = getSupportGuestSocket(guestToken);
  if (!socket || !conversationId) return null;

  const doJoin = () => {
    socket.emit("support:join", conversationId, (ack) => {
      if (ack && ack.ok === false) {
        console.warn("[support] join failed:", ack.error);
      }
    });
  };

  if (socket.connected) doJoin();
  else socket.once("connect", doJoin);

  return socket;
}

export function disconnectSupportGuestSocket() {
  if (guestSocket) {
    guestSocket.removeAllListeners();
    guestSocket.disconnect();
    guestSocket = null;
    guestSocketToken = null;
  }
}

export function showBrowserNotify(title, body, { tag, onClick } = {}) {
  try {
    if (typeof Notification === "undefined") return;
    if (Notification.permission !== "granted") return;

    const n = new Notification(title, {
      body,
      tag: tag || "bizuply-support",
      renotify: true,
    });
    if (typeof onClick === "function") {
      n.onclick = () => {
        window.focus();
        onClick();
        n.close();
      };
    }
  } catch {
    /* ignore */
  }
}

export async function ensureNotifyPermission() {
  try {
    if (typeof Notification === "undefined") return "unsupported";
    if (Notification.permission === "granted") return "granted";
    if (Notification.permission === "denied") return "denied";
    return await Notification.requestPermission();
  } catch {
    return "denied";
  }
}
