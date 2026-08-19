const PREV_TOKEN_KEY = "guidedDemo.prevToken";
const PREV_USER_KEY = "guidedDemo.prevUser";
const SESSION_KEY = "guidedDemo.session";
const ACTIVE_KEY = "guidedDemo.active";

export function isGuidedDemoActive() {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(ACTIVE_KEY) === "1";
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
