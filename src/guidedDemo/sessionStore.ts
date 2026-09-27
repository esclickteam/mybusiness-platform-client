const PREV_TOKEN_KEY = "guidedDemo.prevToken";
const PREV_USER_KEY = "guidedDemo.prevUser";
const SESSION_KEY = "guidedDemo.session";
const ACTIVE_KEY = "guidedDemo.active";
const LOCALE_KEY = "guidedDemo.locale";

const DEMO_LOCALES = ["en", "he", "es", "pt-BR", "ar"] as const;
export type DemoLocale = (typeof DEMO_LOCALES)[number];

export function normalizeDemoLocale(value: unknown): DemoLocale | null {
  const raw = String(value || "").trim().replace("_", "-").toLowerCase();
  if (!raw) return null;
  if (raw === "pt" || raw.startsWith("pt-")) return "pt-BR";
  if (raw === "iw" || raw.startsWith("he")) return "he";
  const base = raw.split("-")[0];
  return (DEMO_LOCALES as readonly string[]).includes(base) ? (base as DemoLocale) : null;
}

export function isGuidedDemoActive() {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(ACTIVE_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * The demo document's locale. While a guided demo is active it outranks the
 * account language, i18next persistence, geo, the browser and stale storage.
 */
export function readGuidedDemoLocaleLock(): DemoLocale | null {
  if (!isGuidedDemoActive()) return null;
  try {
    const stored = normalizeDemoLocale(sessionStorage.getItem(LOCALE_KEY));
    if (stored) return stored;
    const raw = sessionStorage.getItem(SESSION_KEY);
    const session = raw ? JSON.parse(raw) : null;
    const fromSession = normalizeDemoLocale(session?.locale || session?.language);
    if (fromSession) return fromSession;
    const payload = decodeDemoJwt(localStorage.getItem("token"));
    return normalizeDemoLocale(payload?.guidedDemoLocale);
  } catch {
    return null;
  }
}

export function readGuidedDemoSession() {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function writeGuidedDemoSession(session) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session || {}));
  sessionStorage.setItem(ACTIVE_KEY, "1");
  const locale = normalizeDemoLocale(session?.locale || session?.language);
  if (locale) sessionStorage.setItem(LOCALE_KEY, locale);
}

export function backupCurrentAuth() {
  if (typeof window === "undefined") return;
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("businessDetails");
  if (token) sessionStorage.setItem(PREV_TOKEN_KEY, token);
  if (user) sessionStorage.setItem(PREV_USER_KEY, user);
}

export function restorePreviousAuth() {
  if (typeof window === "undefined") return { token: null, user: null };
  const token = sessionStorage.getItem(PREV_TOKEN_KEY);
  const userRaw = sessionStorage.getItem(PREV_USER_KEY);
  let user = null;
  try {
    user = userRaw ? JSON.parse(userRaw) : null;
  } catch {
    user = null;
  }
  return { token, user };
}

export function clearGuidedDemoLocal() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(ACTIVE_KEY);
  sessionStorage.removeItem(LOCALE_KEY);
  sessionStorage.removeItem(PREV_TOKEN_KEY);
  sessionStorage.removeItem(PREV_USER_KEY);
}

export function decodeDemoJwt(token) {
  try {
    return JSON.parse(atob(String(token).split(".")[1]));
  } catch {
    return null;
  }
}

export function isGuidedDemoToken(token) {
  const payload = decodeDemoJwt(token);
  return Boolean(payload?.isGuidedDemo || payload?.guidedDemoSessionId);
}
