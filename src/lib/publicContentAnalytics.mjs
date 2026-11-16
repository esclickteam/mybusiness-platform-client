/**
 * First-party events for the public Bizuply site.
 * The flag defaults off. No event is built unless analytics consent is true.
 */

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const ANALYTICS_NOTICE_VERSION = "2026-11-07";
const VISITOR_KEY = "bizuply_content_vid";
const SESSION_KEY = "bizuply_content_sid";
const LAST_PATH = "bizuply_content_last";
const FILES = new Set([
  "bizuply-lead-tracker.xlsx",
  "bizuply-sales-follow-up.xlsx",
  "bizuply-crm-checklist.xlsx",
  "bizuply-sales-funnel.xlsx",
]);
const PRODUCTS = new Set(["crm", "automations", "appointments", "website-builder", "platform", "whatsapp-api"]);

export function publicContentAnalyticsEnabled(env = import.meta.env) {
  return String(env?.VITE_PUBLIC_CONTENT_ANALYTICS || "") === "1";
}

export function consentGrantsAnalytics(proof) {
  const value = String(proof || "");
  if (value === "analytics" || value === "all" || value === "essential") return false;
  const match = new RegExp(`^v2:([a-z.]{1,32}):(${ANALYTICS_NOTICE_VERSION})$`).exec(value);
  if (!match) return false;
  const tokens = match[1].split(".").filter(Boolean);
  return tokens.includes("an") && tokens.every((token) => token === "ad" || token === "an");
}

function referrerForServer() {
  try {
    const host = new URL(document.referrer || "").hostname.toLowerCase();
    if (!host || host.includes("@")) return "";
    return `https://${host}/`;
  } catch {
    return "";
  }
}

function consentProof() {
  if (typeof document === "undefined") return "";
  const values = String(document.cookie || "")
    .split(";")
    .map((part) => part.trim())
    .filter((part) => part.startsWith("bizuply_tracking="))
    .map((part) => {
      const raw = part.slice("bizuply_tracking=".length);
      try {
        return decodeURIComponent(raw);
      } catch {
        return raw;
      }
    });
  return values.length ? values[values.length - 1] : "";
}

function uuid() {
  const cryptoApi = globalThis.crypto;
  if (cryptoApi?.randomUUID) return cryptoApi.randomUUID();
  if (!cryptoApi?.getRandomValues) return "";
  const bytes = new Uint8Array(16);
  cryptoApi.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function cleanContentPath(value) {
  const raw = String(value || "").trim();
  if (!raw.startsWith("/") || /[?#]/.test(raw) || raw.includes("://")) return "";
  const path = raw.replace(/\/+$/, "") || "/";
  return /^\/(?:(?:he|es|pt-br|ar)\/)?(?:resources|glossary|templates|academy|pricing|crm|automations|appointments|website-builder|platform|whatsapp-api|(?:guides|compare)\/[a-z0-9-]{1,80})$/.test(path)
    ? path
    : "";
}

function head(path) {
  const parts = path.split("/").filter(Boolean);
  return parts[0] === "he" || parts[0] === "es" || parts[0] === "pt-br" || parts[0] === "ar" ? parts[1] : parts[0];
}

export function classifyContentView(pathname) {
  const path = cleanContentPath(pathname);
  if (!path) return null;
  const name = head(path);
  if (name === "guides") return { event: "guide_view", path };
  if (["resources", "glossary", "templates", "academy", "compare"].includes(name)) {
    return { event: "resource_view", path };
  }
  return null;
}

export function classifyContentClick(currentPath, href) {
  const path = cleanContentPath(currentPath);
  if (!path || !classifyContentView(path)) return null;
  const raw = String(href || "");
  const pathname = raw.startsWith("http") ? new URL(raw).pathname : raw.split("?")[0].split("#")[0];
  const file = pathname.split("/").pop() || "";
  if (FILES.has(file) && head(path) === "templates") {
    return { event: "template_download", path, fileName: file };
  }
  const target = cleanContentPath(pathname);
  if (!target) return null;
  if (head(target) === "pricing") return { event: "pricing_click", path, targetPath: target };
  if (head(path) === "guides" && PRODUCTS.has(head(target))) {
    return { event: "guide_product_click", path, targetPath: target };
  }
  return null;
}

function storageGet(store, key) {
  try {
    return store.getItem(key) || "";
  } catch {
    return "";
  }
}

function storageSet(store, key, value) {
  try {
    store.setItem(key, value);
  } catch {
    /* Private mode can reject storage. The event is then not sent. */
  }
}

function storageRemove(store, key) {
  try {
    store.removeItem(key);
  } catch {
    /* Nothing to clear. */
  }
}

export function contentVisitorKey(create = false) {
  const existing = storageGet(localStorage, VISITOR_KEY);
  if (UUID.test(existing)) return existing;
  if (!create) return "";
  const next = uuid();
  storageSet(localStorage, VISITOR_KEY, next);
  return next;
}

export function contentSessionKey() {
  const existing = storageGet(sessionStorage, SESSION_KEY);
  if (UUID.test(existing)) return existing;
  const next = uuid();
  storageSet(sessionStorage, SESSION_KEY, next);
  return next;
}

export function rememberContentPath(path) {
  const clean = cleanContentPath(path);
  if (clean && classifyContentView(clean)) storageSet(sessionStorage, LAST_PATH, clean);
}

export function rememberedContentPath() {
  return cleanContentPath(storageGet(sessionStorage, LAST_PATH));
}

export function clearContentIdentity() {
  storageRemove(localStorage, VISITOR_KEY);
  storageRemove(sessionStorage, SESSION_KEY);
  storageRemove(sessionStorage, LAST_PATH);
}

function apiBase() {
  const configured = String(import.meta.env?.VITE_API_URL || "").trim().replace(/\/+$/, "");
  if (configured) return configured;
  return import.meta.env?.MODE === "production" ? "https://api.bizuply.com/api" : "/api";
}

function deduped(payload) {
  const key = `bizuply_ca:${payload.event}:${payload.path}:${payload.targetPath || ""}:${payload.fileName || ""}:${payload.calculatorId || ""}`;
  const now = Date.now();
  const previous = Number(storageGet(sessionStorage, key) || 0);
  if (previous && now - previous < 30000) return true;
  storageSet(sessionStorage, key, String(now));
  return false;
}

export function buildContentEvent(input) {
  if (!publicContentAnalyticsEnabled()) return null;
  const proof = consentProof();
  if (!consentGrantsAnalytics(proof)) return null;
  const path = cleanContentPath(input.path);
  if (!path) return null;
  const visitorKey = contentVisitorKey(true);
  const sessionKey = contentSessionKey();
  if (!UUID.test(visitorKey) || !UUID.test(sessionKey)) return null;
  const payload = {
    event: input.event,
    path,
    visitorKey,
    sessionKey,
    targetPath: input.targetPath ? cleanContentPath(input.targetPath) : "",
    fileName: input.fileName || "",
    calculatorId: input.calculatorId || "",
    referrer: referrerForServer(),
    device: /mobile|iphone|android/i.test(navigator.userAgent) ? "mobile" : "desktop",
  };
  if (deduped(payload)) return null;
  return payload;
}

export function sendContentEvent(input) {
  const payload = buildContentEvent(input);
  if (!payload) return;
  if (payload.event === "resource_view" || payload.event === "guide_view") rememberContentPath(payload.path);
  fetch(`${apiBase()}/public-analytics/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
    credentials: "include",
  }).catch(() => {});
}

export function forgetContentVisitor() {
  const visitorKey = contentVisitorKey(false);
  clearContentIdentity();
  if (!visitorKey) return;
  const body = JSON.stringify({ visitorKey, purpose: "withdraw_analytics" });
  fetch(`${apiBase()}/public-analytics/forget`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
    credentials: "include",
  }).catch(() => {});
}
