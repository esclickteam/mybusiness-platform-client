import { io } from "socket.io-client";

const VISITOR_KEY = "bizuply_support_visitor_id";
const SESSION_KEY = "bizuply_support_session";

const isProd = import.meta.env.MODE === "production";
const API_BASE = isProd ? "https://api.bizuply.com/api" : "/api";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://api.bizuply.com";

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

async function supportFetch(path, { method = "GET", body, token } = {}) {
  const visitorId = getSupportVisitorId();
  const headers = {
    "Content-Type": "application/json",
    // Keep both casings for proxies that normalize oddly.
    "X-Support-Visitor-Id": visitorId,
  };

  const authToken = token || localStorage.getItem("token");
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
    autoConnect: true,
    auth: {
      token: guestToken,
      role: "support-guest",
    },
  });

  return guestSocket;
}

export function disconnectSupportGuestSocket() {
  if (guestSocket) {
    guestSocket.removeAllListeners();
    guestSocket.disconnect();
    guestSocket = null;
    guestSocketToken = null;
  }
}
