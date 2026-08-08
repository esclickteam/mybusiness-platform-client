/**
 * Central session-invalidation handling.
 *
 * Only SESSION_REVOKED / AUTH_VERSION_MISMATCH trigger atomic logout.
 * Other 401s (expired JWT, missing token on anonymous routes, business ACL)
 * must keep their existing refresh / error behavior.
 */

import axios from "axios";
import { clearLastDashboardRoute } from "./dashboardRoutePersistence";
import {
  abortAuthRefreshPipeline,
  clearAccessToken,
  clearRefreshDead,
  markRefreshDead,
} from "./tokenRefresh";

function getApiBaseUrl() {
  const envApiUrl = String(import.meta.env.VITE_API_URL || "")
    .trim()
    .replace(/\/+$/, "");
  return (
    envApiUrl ||
    (import.meta.env.MODE === "production"
      ? "https://api.bizuply.com/api"
      : "/api")
  );
}
export const SESSION_INVALID_CODES = Object.freeze([
  "SESSION_REVOKED",
  "AUTH_VERSION_MISMATCH",
]);

const SESSION_INVALID_CODE_SET = new Set(SESSION_INVALID_CODES);
const SESSION_INVALID_EVENT = "bizuply:session-invalid";
const SESSION_INVALID_STORAGE_KEY = "bizuply:sessionInvalidatedAt";
const LOGIN_PATH = "/login";

let invalidated = false;
let redirectScheduled = false;
let abortRetriesHandler = null;
let serverLogoutStarted = false;

function safePathname() {
  try {
    return window.location?.pathname || "";
  } catch {
    return "";
  }
}

function isAlreadyOnLogin() {
  const path = safePathname();
  return path === LOGIN_PATH || path.startsWith(`${LOGIN_PATH}/`);
}

/**
 * Register a callback (api.js) that rejects pending refresh-waiters
 * and clears in-flight interceptor retry state.
 */
export function registerAuthRetryAbort(handler) {
  abortRetriesHandler = typeof handler === "function" ? handler : null;
}

export function isSessionInvalidAuthCode(code) {
  if (!code) return false;
  return SESSION_INVALID_CODE_SET.has(String(code));
}

/**
 * Accepts axios response, axios error, or a bare code string.
 */
export function isSessionInvalidAuthError(input) {
  if (!input) return false;
  if (typeof input === "string") return isSessionInvalidAuthCode(input);

  const code =
    input?.code ||
    input?.response?.data?.code ||
    input?.data?.code ||
    null;

  return isSessionInvalidAuthCode(code);
}

export function isSessionInvalidated() {
  return invalidated;
}

export function clearPersistedAuthState({ clearDashboardRoute = true } = {}) {
  clearAccessToken();

  try {
    localStorage.removeItem("businessDetails");
    localStorage.removeItem("dashboardStats");
    localStorage.removeItem("impersonatedBy");
    localStorage.removeItem("impersonatorRole");
  } catch {
    /* ignore */
  }

  if (clearDashboardRoute) {
    clearLastDashboardRoute();
  }

  try {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith("bizuplyEarlyBirdDismissed")) {
        sessionStorage.removeItem(key);
      }
    });
  } catch {
    /* ignore */
  }
}

function broadcastToOtherTabs() {
  try {
    localStorage.setItem(SESSION_INVALID_STORAGE_KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
}

function notifyListeners(detail) {
  try {
    window.dispatchEvent(
      new CustomEvent(SESSION_INVALID_EVENT, { detail: detail || {} })
    );
  } catch {
    /* ignore */
  }
}

function scheduleLoginRedirect() {
  if (redirectScheduled) return;
  if (typeof window === "undefined") return;
  if (isAlreadyOnLogin()) return;

  redirectScheduled = true;

  // Hard replace: drop the stale React tree so dashboards stop polling.
  try {
    window.location.replace(LOGIN_PATH);
  } catch {
    try {
      window.location.href = LOGIN_PATH;
    } catch {
      /* ignore */
    }
  }
}

function clearRefreshCookieBestEffort() {
  if (serverLogoutStarted) return;
  serverLogoutStarted = true;

  const base = getApiBaseUrl();
  axios
    .post(`${base}/auth/logout`, null, { withCredentials: true })
    .catch(() => {
      /* cookie may already be gone */
    });
}

/**
 * Atomic local logout for irrevocable session invalidation.
 * Safe to call many times ג€” runs once per tab until reset on login.
 */
export function handleSessionInvalidated(options = {}) {
  const code = options.code || options.reason || "SESSION_REVOKED";
  const fromStorage = Boolean(options.fromStorage);
  const redirect = options.redirect !== false;

  if (invalidated) {
    if (redirect) scheduleLoginRedirect();
    return { alreadyHandled: true, code };
  }

  invalidated = true;

  // 1ג€“2. Kill refresh pipeline + access token header
  abortAuthRefreshPipeline();
  markRefreshDead();

  // 3. Clear persisted auth
  clearPersistedAuthState({ clearDashboardRoute: true });

  // 4. Cancel pending interceptor retries
  try {
    abortRetriesHandler?.();
  } catch {
    /* ignore */
  }

  // Best-effort refresh-cookie revoke (httpOnly ג€” needs server)
  if (!fromStorage) {
    clearRefreshCookieBestEffort();
    broadcastToOtherTabs();
  }

  notifyListeners({ code, fromStorage: Boolean(fromStorage) });

  // 6ג€“7. One-shot redirect; never keep a stale dashboard painted
  if (redirect) {
    scheduleLoginRedirect();
  }

  return { alreadyHandled: false, code };
}

/**
 * Call after a successful login so a new session can start.
 */
export function resetSessionInvalidationGuard() {
  invalidated = false;
  redirectScheduled = false;
  serverLogoutStarted = false;
  clearRefreshDead();

  try {
    localStorage.removeItem(SESSION_INVALID_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Multi-tab + AuthContext wiring. Call once from AuthProvider.
 */
export function bindSessionInvalidationListeners(onInvalidated) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const onEvent = (event) => {
    try {
      onInvalidated?.(event?.detail || {});
    } catch {
      /* ignore */
    }
  };

  const onStorage = (event) => {
    if (event.key !== SESSION_INVALID_STORAGE_KEY || !event.newValue) return;
    handleSessionInvalidated({
      code: "SESSION_REVOKED",
      fromStorage: true,
      redirect: true,
    });
  };

  window.addEventListener(SESSION_INVALID_EVENT, onEvent);
  window.addEventListener("storage", onStorage);

  return () => {
    window.removeEventListener(SESSION_INVALID_EVENT, onEvent);
    window.removeEventListener("storage", onStorage);
  };
}

export const __sessionInvalidationTestUtils = {
  SESSION_INVALID_EVENT,
  SESSION_INVALID_STORAGE_KEY,
  resetForTests() {
    invalidated = false;
    redirectScheduled = false;
    serverLogoutStarted = false;
    abortRetriesHandler = null;
  },
};
