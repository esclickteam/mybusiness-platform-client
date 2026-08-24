import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API, { setAuthToken } from "../api";
import createSocket from "../socket";
import {
  getValidAccessToken,
  refreshAccessTokenOnce,
  isAccessTokenExpired,
  shouldAttemptRefresh,
  clearRefreshDead,
  markRefreshDead,
} from "../utils/tokenRefresh";
import { getApiErrorMessage } from "../utils/apiErrorMessage";
import {
  bindSessionInvalidationListeners,
  clearPersistedAuthState,
  isSessionInvalidated,
  resetSessionInvalidationGuard,
} from "../utils/sessionInvalidation";
import { clearAdminActiveBusinessId } from "../utils/adminTenant";
import {
  applyManagedSessionToUser,
  clearManagedBusinessContext,
  setManagedBusinessContext,
} from "../lib/partnerManagedContext";
import { decodeJwtPayload } from "../lib/decodeJwtPayload";
import {
  clearLastDashboardRoute,
  resolveBusinessDashboardPath,
} from "../utils/dashboardRoutePersistence";
import { consumePendingNotificationUrl } from "../utils/notificationNavigation";
import {
  alignRedirectBusinessId,
  consumePostLoginRedirect,
  peekPostLoginRedirect,
  rememberPostLoginRedirect,
  resolvePostLoginDestination,
  sanitizeInternalRedirect,
  clearPostLoginRedirect,
  isCompatibleRedirect,
} from "../utils/safeInternalRedirect";
import { isAllowedPluginBillingReturn } from "../utils/pluginBillingReturn";
import BizuplyLoader from "../components/ui/BizuplyLoader";
import { isPublicCustomerSiteHost } from "../utils/publicSiteHost";
import { clearPushEnabledPreferenceCache } from "../utils/pushPreference";

/* ===========================
   🧩 Normalize User
=========================== */
function normalizeUser(user) {
  if (!user) return null;

  const now = new Date();

  /* ============================
     🔐 Subscription (paid)
  ============================ */
  let computedIsValid = false;
  if (user.subscriptionStart && user.subscriptionEnd) {
    computedIsValid = new Date(user.subscriptionEnd) > now;
  }

  const isPendingActivation = user.status === "pending_activation";

  /* ============================
     ⏳ Trial
  ============================ */
  const TRIAL_DAYS = 14;

  let trialEndsAt = user.trialEndsAt ? new Date(user.trialEndsAt) : null;

  if (
    !trialEndsAt &&
    user.subscriptionPlan === "trial" &&
    user.trialStartedAt
  ) {
    const start = new Date(user.trialStartedAt);
    trialEndsAt = new Date(start);
    trialEndsAt.setDate(start.getDate() + TRIAL_DAYS);
  }

  const DAY = 1000 * 60 * 60 * 24;

  const diffMs =
    user.subscriptionPlan === "trial" && trialEndsAt
      ? trialEndsAt.getTime() - now.getTime()
      : 0;

  const trialDaysLeft = diffMs > 0 ? Math.floor(diffMs / DAY) + 1 : 0;
  const isTrialEndingToday = diffMs > 0 && diffMs < DAY;
  const isTrialActive = Boolean(trialEndsAt && trialEndsAt > now);

  /* ============================
     🎁 Early Bird (48h)
  ============================ */
  const earlyBirdExpiresAt = user.earlyBirdExpiresAt
    ? new Date(user.earlyBirdExpiresAt)
    : null;

  const isEarlyBirdActive = Boolean(
    earlyBirdExpiresAt &&
      earlyBirdExpiresAt > now &&
      user?.earlyBirdUsed !== true
  );

  const hasPaid =
    user?.paymentStatus === "paid" || user?.paymentStatus === "active";

  return {
    ...user,

    trialEndsAt,
    trialDaysLeft,
    isTrialEndingToday,
    paymentStatus: user.paymentStatus,
    isTrialActive,
    isEarlyBirdActive,

    earlyBirdHoursLeft: isEarlyBirdActive
      ? Math.ceil(
          (earlyBirdExpiresAt.getTime() - now.getTime()) /
            (1000 * 60 * 60)
        )
      : 0,

    hasPaid,
    subscriptionCancelled: Boolean(user?.subscriptionCancelled),

    isSubscriptionValid:
      typeof user?.isSubscriptionValid === "boolean"
        ? user.isSubscriptionValid
        : computedIsValid,

    subscriptionStatus:
      user.subscriptionStatus || user.status || user.subscriptionPlan || "free",

    hasAccess: isTrialActive || hasPaid || isPendingActivation,
  };
}

/* ===========================
   🔓 Public routes
=========================== */
function isEmbedRoute(pathname) {
  return String(pathname || "").startsWith("/embed/");
}

function isPublicRoute(pathname) {
  if (isEmbedRoute(pathname)) return true;

  const publicRoutes = [
    "/",
    "/login",
    "/register",
    "/pricing",
    "/features",
    "/solutions",
    "/how-it-works",
    "/about",
    "/contact",
    "/privacy",
    "/privacy-policy",
    "/terms",
    "/accessibility",
    // Hidden private offers (e.g. /offer/crm) are viewable without login.
    "/offer",
    "/demo",
  ];

  return publicRoutes.some((route) => {
    if (route === "/") return pathname === "/";
    return pathname === route || pathname.startsWith(`${route}/`);
  });
}

/** Routes where an authenticated business must stay to finish payment/signup. */
function isCheckoutContinuationPath(pathname) {
  const path = String(pathname || "");
  return (
    path === "/pricing" ||
    path.startsWith("/pricing/") ||
    path === "/checkout" ||
    path.startsWith("/checkout/") ||
    path === "/register" ||
    path.startsWith("/register/")
  );
}

/* ===========================
   🧹 Clear local auth only
=========================== */
function clearLocalAuth({ clearDashboardRoute = false } = {}) {
  clearPersistedAuthState({ clearDashboardRoute });
}

async function tryRefreshWithRetries(maxAttempts = 3) {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      return await refreshAccessTokenOnce();
    } catch (err) {
      if (
        err.message === "NO_REFRESH_TOKEN" ||
        err.message === "REFRESH_REVOKED" ||
        err.code === "REFRESH_TOKEN_NOT_FOUND" ||
        err.code === "REFRESH_TOKEN_INVALID"
      ) {
        return null;
      }
      if (attempt < maxAttempts - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * (attempt + 1))
        );
      }
    }
  }
  return null;
}

/* ===========================
   🔁 Token refresh (single flight) — shared with api.js
=========================== */
export async function singleFlightRefresh() {
  return refreshAccessTokenOnce();
}

/* ===========================
   ⚙ Context
=========================== */
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [socket, setSocket] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("businessDetails");
      return saved ? normalizeUser(JSON.parse(saved)) : null;
    } catch {
      localStorage.removeItem("businessDetails");
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  /* ===========================
     👤 Refresh user
  =========================== */
  const refreshUser = async (force = false) => {
    const loadMe = async () => {
      const { data } = await API.get(
        `/auth/me${force ? "?forceRefresh=1" : ""}`,
        {
          withCredentials: true,
        }
      );

      const normalized = applyManagedSessionToUser(normalizeUser(data));
      setUser(normalized);
      localStorage.setItem("businessDetails", JSON.stringify(normalized));
      return normalized;
    };

    try {
      return await loadMe();
    } catch (err) {
      // Access JWT may be expired while refresh cookie is still valid
      try {
        const newToken = await getValidAccessToken();
        if (!newToken) {
          console.error("Failed to refresh user — no valid token", err);
          return null;
        }

        setToken(newToken);
        return await loadMe();
      } catch (retryErr) {
        console.error("Failed to refresh user", retryErr);
        return null;
      }
    }
  };

  /* ===========================
     🔐 Login with token
  =========================== */
  const loginWithToken = (
    userFromServer,
    accessToken,
    { skipRedirect = false } = {}
  ) => {
    resetSessionInvalidationGuard();
    clearRefreshDead();
    localStorage.setItem("token", accessToken);
    setAuthToken(accessToken);
    setToken(accessToken);

    let normalizedUser = normalizeUser(userFromServer);
    setUser(normalizedUser);
    localStorage.setItem("businessDetails", JSON.stringify(normalizedUser));

    try {
      const payload = decodeJwtPayload(accessToken) || {};

      if (payload.impersonatedBy && payload.impersonatorRole !== "partner") {
        localStorage.setItem("impersonatedBy", String(payload.impersonatedBy));
        if (payload.impersonatorRole) {
          localStorage.setItem("impersonatorRole", String(payload.impersonatorRole));
        } else if (userFromServer?.impersonatorRole) {
          localStorage.setItem(
            "impersonatorRole",
            userFromServer.impersonatorRole
          );
        }
      } else {
        localStorage.removeItem("impersonatedBy");
        localStorage.removeItem("impersonatorRole");
        clearAdminActiveBusinessId();
      }

      const managedBusinessId =
        userFromServer?.managedBusinessId ||
        payload.managedBusinessId ||
        null;
      const managedBusinessName =
        userFromServer?.managedBusinessName ||
        payload.managedBusinessName ||
        null;
      const partnerName =
        userFromServer?.partnerName || payload.partnerName || null;
      setManagedBusinessContext({
        managedBusinessId,
        managedBusinessName,
        partnerName,
      });
      if (managedBusinessId) {
        normalizedUser = applyManagedSessionToUser({
          ...normalizedUser,
          role: "partner",
          managedBusinessId,
          managedBusinessName,
          partnerName,
          businessId: userFromServer?.businessId || managedBusinessId,
        });
        setUser(normalizedUser);
        localStorage.setItem("businessDetails", JSON.stringify(normalizedUser));
      } else if (normalizedUser.role === "partner") {
        clearManagedBusinessContext();
      }
    } catch {
      localStorage.removeItem("impersonatedBy");
      localStorage.removeItem("impersonatorRole");
    }

    const isImpersonating = Boolean(localStorage.getItem("impersonatedBy"));
    const isPartnerManaged = Boolean(
      normalizedUser.managedBusinessId ||
        localStorage.getItem("managedBusinessId")
    );

    if (skipRedirect || isImpersonating) return;

    if (normalizedUser.role === "marketer") {
      navigate("/marketer/dashboard", { replace: true });
      return;
    }

    if (normalizedUser.role === "partner") {
      if (isPartnerManaged) return;
      navigate("/partner/dashboard", { replace: true });
      return;
    }

    if (normalizedUser.role === "business" && normalizedUser.businessId) {
      clearLastDashboardRoute(normalizedUser.businessId);
      navigate(
        `/business/${normalizedUser.businessId}/dashboard/dashboard`,
        { replace: true }
      );
      return;
    }

    if (normalizedUser.role === "admin") {
      navigate("/admin/dashboard", { replace: true });
      return;
    }

    navigate("/dashboard", { replace: true });
  };

  /* ===========================
     🔐 Login
  =========================== */
  const login = async (email, password, { skipRedirect = false } = {}) => {
    // Do not flip the global `loading` boot flag here — App.jsx treats that as
    // "unmount the whole tree", which drops /login mid-submit and hides errors.
    setError(null);

    try {
      const { data } = await API.post(
        "/auth/login",
        { email: email.trim().toLowerCase(), password },
        { withCredentials: true }
      );

      const { accessToken, user: loggedInUser, redirectUrl } = data;

      resetSessionInvalidationGuard();
      clearRefreshDead();
      localStorage.removeItem("impersonatedBy");
      localStorage.removeItem("impersonatorRole");
      clearManagedBusinessContext();
      clearAdminActiveBusinessId();
      localStorage.setItem("token", accessToken);
      setAuthToken(accessToken);
      setToken(accessToken);

      const normalizedUser = normalizeUser(loggedInUser);
      if (
        normalizedUser.role === "partner" &&
        !loggedInUser?.managedBusinessId
      ) {
        // Leftover managed-business localStorage must not overlay a fresh
        // partner session and skip /partner/dashboard.
        clearManagedBusinessContext();
      }
      setUser(normalizedUser);
      localStorage.setItem("businessDetails", JSON.stringify(normalizedUser));

      document.body.style.background =
        "linear-gradient(to bottom, #f6f7fb, #e8ebf8)";

      refreshUser(true)
        .then((freshUser) => {
          if (freshUser) {
            localStorage.setItem("businessDetails", JSON.stringify(freshUser));
            setUser(freshUser);
          }
        })
        .catch(() => {});

      const urlRedirect = sanitizeInternalRedirect(
        new URLSearchParams(window.location.search).get("redirect")
      );
      const storedRedirect = peekPostLoginRedirect();
      if (
        urlRedirect &&
        isCompatibleRedirect(normalizedUser.role, urlRedirect)
      ) {
        rememberPostLoginRedirect(urlRedirect);
      } else if (
        !isCompatibleRedirect(normalizedUser.role, storedRedirect)
      ) {
        clearPostLoginRedirect();
      }

      const destination = resolvePostLoginDestination({
        role: normalizedUser.role,
        businessId: normalizedUser.businessId,
        hasAccess: normalizedUser.hasAccess,
        enabledModules: normalizedUser.enabledModules,
        queryRedirect: urlRedirect,
        storedRedirect: peekPostLoginRedirect() || storedRedirect,
      });

      // Login.tsx owns navigation when skipRedirect=true so auth bootstrap
      // cannot race and overwrite a deep-link CTA with the generic dashboard.
      if (!skipRedirect) {
        const isImpersonating = Boolean(localStorage.getItem("impersonatedBy"));

        if (normalizedUser.role === "admin" && !isImpersonating && !urlRedirect) {
          navigate("/admin/dashboard", { replace: true });
          return { user: normalizedUser, redirectUrl: "/admin/dashboard" };
        }

        if (
          normalizedUser.role === "marketer" &&
          !isImpersonating &&
          !urlRedirect
        ) {
          navigate("/marketer/dashboard", { replace: true });
          return { user: normalizedUser, redirectUrl: "/marketer/dashboard" };
        }

        if (
          normalizedUser.role === "partner" &&
          !isImpersonating &&
          !urlRedirect
        ) {
          navigate("/partner/dashboard", { replace: true });
          return { user: normalizedUser, redirectUrl: "/partner/dashboard" };
        }

        consumePostLoginRedirect();
        if (normalizedUser.role === "business" && normalizedUser.businessId) {
          clearLastDashboardRoute(normalizedUser.businessId);
        }
        navigate(destination, { replace: true });
        return { user: normalizedUser, redirectUrl: destination };
      }

      return {
        user: normalizedUser,
        redirectUrl: redirectUrl || destination || null,
      };
    } catch (err) {
      setError(
        err.response?.status >= 400 && err.response?.status < 500
          ? "❌ אימייל או סיסמה שגויים"
          : "❌ שגיאת שרת"
      );

      throw err;
    }
  };

  /* ===========================
     🧑‍💼 Staff login
  =========================== */
  const staffLogin = async (username, password) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await API.post(
        "/auth/staff-login",
        { username: username.trim(), password },
        { withCredentials: true }
      );

      const { accessToken, user: staffUser } = data;

      resetSessionInvalidationGuard();
      clearRefreshDead();
      localStorage.removeItem("impersonatedBy");
      localStorage.removeItem("impersonatorRole");
      clearManagedBusinessContext();
      clearAdminActiveBusinessId();
      localStorage.setItem("token", accessToken);
      setAuthToken(accessToken);
      setToken(accessToken);

      const normalized = normalizeUser(staffUser);
      setUser(normalized);
      localStorage.setItem("businessDetails", JSON.stringify(normalized));

      refreshUser(true).catch(() => {});
      setLoading(false);

      return normalized;
    } catch (err) {
      setError("❌ שם משתמש או סיסמה שגויים");
      setLoading(false);
      throw err;
    }
  };

  /* ===========================
     🤝 Affiliate login
  =========================== */
  const affiliateLogin = async (publicToken) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await API.get(`/affiliate/login/${publicToken}`, {
        withCredentials: true,
      });

      const normalized = normalizeUser(data);
      setUser(normalized);
      localStorage.setItem("businessDetails", JSON.stringify(normalized));

      setToken(null);
      refreshUser(true).catch(() => {});

      setLoading(false);
      return normalized;
    } catch (err) {
      setError(getApiErrorMessage(err, "אירעה שגיאה. נסו שוב."));
      setLoading(false);
      throw err;
    }
  };

  /* ===========================
     🚪 Logout
  =========================== */
  const logout = async ({ callServer = true, redirect = true } = {}) => {
    setLoading(true);

    // Tear down Telnyx/Twilio softphone before/while server revoke runs.
    try {
      const { disconnectSoftphoneVoip } = await import(
        "../components/AdminSoftphone"
      );
      disconnectSoftphoneVoip();
    } catch {
      /* softphone module optional */
    }

    if (callServer) {
      try {
        await API.post("/auth/logout", {}, { withCredentials: true });
      } catch (err) {
        console.warn("Logout server call failed:", err?.message || err);
      }
    }

    if (typeof window !== "undefined") {
      Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith("bizuplyEarlyBirdDismissed")) {
          sessionStorage.removeItem(key);
        }
      });
    }

    // Explicit logout → next login lands on role home, not a stale deep-link
    clearLocalAuth({ clearDashboardRoute: true });
    clearPostLoginRedirect();
    clearPushEnabledPreferenceCache();
    markRefreshDead();

    setToken(null);
    setUser(null);

    if (socket) {
      socket.disconnect();
      setSocket(null);
    }

    setLoading(false);

    if (redirect) {
      navigate("/login", { replace: true });
    }
  };

  /* ===========================
     🛑 Session revoked / authVersion mismatch → clear React auth state
  =========================== */
  useEffect(() => {
    return bindSessionInvalidationListeners(() => {
      setToken(null);
      setUser(null);
      setError(null);

      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    });
  }, [socket]);

  /* ===========================
     🔥 Initialize
  =========================== */
  useEffect(() => {
    let cancelled = false;

    if (initialized) return;

    // Another tab / interceptor already invalidated the session.
    if (isSessionInvalidated()) {
      clearLocalAuth();
      markRefreshDead();
      setToken(null);
      setUser(null);
      setLoading(false);
      setInitialized(true);
      if (!isPublicRoute(location.pathname)) {
        navigate("/login", { replace: true });
      }
      return;
    }

    const finishLoggedOut = () => {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }

      setUser(null);
      localStorage.removeItem("businessDetails");
      setLoading(false);
      setInitialized(true);
    };

    // Published customer sites (custom domains / sites.*) never need auth.
    // Skip token refresh + /auth/me so the site can paint without Bizuply boot.
    if (isPublicCustomerSiteHost()) {
      finishLoggedOut();
      return;
    }

    (async () => {
      setLoading(true);

      let activeToken = token;

      // Restore or refresh only when a prior session is likely (avoids 401 spam for guests)
      if (!localStorage.getItem("impersonatedBy") && shouldAttemptRefresh()) {
        const shouldRefresh =
          !activeToken ||
          isAccessTokenExpired(activeToken, { skewMs: 30_000 });

        if (shouldRefresh) {
          try {
            activeToken = await refreshAccessTokenOnce();
            if (activeToken && !cancelled) {
              setToken(activeToken);
            }
          } catch {
            // No valid refresh cookie — fall through to logged-out state
          }
        }
      }

      if (!activeToken) {
        // Cached profile without a usable access/refresh session = zombie login.
        // Clear it instead of rendering a dashboard that 401s on every API call.
        if (shouldAttemptRefresh()) {
          const recovered = await tryRefreshWithRetries();
          if (recovered && !cancelled) {
            activeToken = recovered;
            setToken(recovered);
          } else if (!cancelled) {
            clearLocalAuth();
            markRefreshDead();
            finishLoggedOut();
            return;
          } else {
            return;
          }
        } else {
          if (!cancelled) {
            clearLocalAuth();
            finishLoggedOut();
          }
          return;
        }
      }

      if (!activeToken) {
        if (!cancelled) finishLoggedOut();
        return;
      }

      setAuthToken(activeToken);

      try {
        const isImpersonating = Boolean(localStorage.getItem("impersonatedBy"));

        const freshUser = await refreshUser();

        if (!freshUser) {
          throw new Error("Missing user");
        }

        if (cancelled) return;

        // Never redirect away from embed iframes (template/site card previews)
        if (isEmbedRoute(location.pathname)) {
          if (!cancelled) {
            setLoading(false);
            setInitialized(true);
          }
          return;
        }

        if (
          freshUser.role === "admin" &&
          !isImpersonating &&
          !location.pathname.startsWith("/admin") &&
          !location.pathname.startsWith("/business/")
        ) {
          const adminSocket = await createSocket(
            getValidAccessToken,
            null,
            freshUser.businessId
          );
          if (!cancelled) {
            setSocket(adminSocket);
          }
          navigate("/admin/dashboard", { replace: true });
          return;
        }

        if (freshUser.role === "partner" && !isImpersonating) {
          const path = location.pathname;
          const onPartnerArea =
            path === "/partner" || path.startsWith("/partner/");
          const grantedManagedId = String(
            freshUser.managedBusinessId || ""
          ).trim();
          const onGrantedManagedBusiness = Boolean(
            grantedManagedId &&
              path.startsWith(`/business/${grantedManagedId}`)
          );
          // Leftover localStorage managedBusinessId must not keep a partner
          // on public `/` (or any non-partner path) before auth settles.
          if (!onPartnerArea && !onGrantedManagedBusiness) {
            navigate("/partner/dashboard", { replace: true });
            return;
          }
        }

        const newSocket = await createSocket(
          getValidAccessToken,
          null,
          freshUser.managedBusinessId || freshUser.businessId
        );

        if (!cancelled) {
          setSocket(newSocket);
        }

        const justRegistered = sessionStorage.getItem("justRegistered");
        const queryRedirect =
          location.pathname === "/login"
            ? sanitizeInternalRedirect(
                new URLSearchParams(location.search).get("redirect")
              )
            : null;
        if (queryRedirect) {
          rememberPostLoginRedirect(queryRedirect);
        }

        // Prefer an explicit post-login deep link (email CTAs, pricing, etc.)
        // over the generic dashboard hop — including when justRegistered is set.
        const pendingDeepLink =
          peekPostLoginRedirect() ||
          sanitizeInternalRedirect(
            sessionStorage.getItem("postLoginRedirect")
          );

        if (justRegistered) {
          sessionStorage.removeItem("justRegistered");

          // Unpaid staged purchase / checkout-first return must not be
          // overwritten by the legacy "just registered → dashboard" hop.
          if (
            pendingDeepLink === "/pricing" ||
            pendingDeepLink === "/checkout" ||
            isCheckoutContinuationPath(location.pathname)
          ) {
            const dest = consumePostLoginRedirect() || pendingDeepLink;
            if (dest) {
              navigate(dest, { replace: true });
            }
            return;
          }

          if (
            pendingDeepLink &&
            isCompatibleRedirect(freshUser.role, pendingDeepLink)
          ) {
            const dest = alignRedirectBusinessId(
              consumePostLoginRedirect() || pendingDeepLink,
              freshUser.businessId
            );
            if (dest) {
              navigate(dest, { replace: true });
              return;
            }
          }

          if (freshUser.role === "business" && freshUser.businessId) {
            navigate(
              freshUser.hasAccess
                ? resolveBusinessDashboardPath(freshUser.businessId)
                : "/pricing",
              { replace: true }
            );
          } else {
            navigate("/dashboard", { replace: true });
          }

          return;
        }

        if (pendingDeepLink) {
          if (!isCompatibleRedirect(freshUser.role, pendingDeepLink)) {
            clearPostLoginRedirect();
          } else {
            const savedRedirect = consumePostLoginRedirect() || pendingDeepLink;
            const isPricing = savedRedirect === "/pricing";
            const shouldSkip = isPricing && freshUser.hasAccess;

            if (!shouldSkip) {
              navigate(
                alignRedirectBusinessId(savedRedirect, freshUser.businessId) ||
                  savedRedirect,
                { replace: true }
              );
            }

            return;
          }
        }

        const pendingNotificationUrl = consumePendingNotificationUrl();

        if (pendingNotificationUrl) {
          navigate(pendingNotificationUrl, { replace: true });
          return;
        }

        const isMetaCallbackRoute = location.pathname.startsWith(
          "/integrations/meta/callback"
        );

        if (
          freshUser.role === "business" &&
          freshUser.businessId &&
          !isMetaCallbackRoute &&
          !isCheckoutContinuationPath(location.pathname)
        ) {
          if (freshUser.hasAccess) {
            // Already inside the business app (including after a CTA navigate) —
            // never snap back to the generic dashboard.
            if (location.pathname.startsWith("/business/")) {
              return;
            }

            if (location.pathname === "/login") {
              const dest = resolvePostLoginDestination({
                role: freshUser.role,
                businessId: freshUser.businessId,
                hasAccess: freshUser.hasAccess,
                enabledModules: freshUser.enabledModules,
                queryRedirect: sanitizeInternalRedirect(
                  new URLSearchParams(location.search).get("redirect")
                ),
                storedRedirect: peekPostLoginRedirect(),
              });
              consumePostLoginRedirect();
              navigate(dest, { replace: true });
              return;
            }

            navigate(resolveBusinessDashboardPath(freshUser.businessId), {
              replace: true,
            });
          } else if (
            location.pathname === "/" ||
            location.pathname === "/dashboard" ||
            location.pathname.startsWith("/dashboard/") ||
            (location.pathname.startsWith("/business/") &&
              !isAllowedPluginBillingReturn({
                pathname: location.pathname,
                search: location.search,
              }))
          ) {
            navigate("/pricing", { replace: true });
          }
        }
      } catch (err) {
        console.error("❌ Auth init failed:", err);

        // Never restore a cached profile after bootstrap failure — that left a
        // zombie "logged in" UI that kept hammering APIs with a revoked session.
        if (!cancelled) {
          clearLocalAuth();
          markRefreshDead();
          setToken(null);
          setUser(null);

          if (socket) {
            socket.disconnect();
            setSocket(null);
          }

          if (!isPublicRoute(location.pathname) && !isSessionInvalidated()) {
            navigate("/login", { replace: true });
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setInitialized(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, initialized, location.pathname]);

  useEffect(() => {
    if (!initialized || !user || socket) return;
    let cancelled = false;
    (async () => {
      const recovered = await createSocket(
        getValidAccessToken,
        null,
        user.businessId
      );
      if (!cancelled && recovered) setSocket(recovered);
    })();
    return () => {
      cancelled = true;
    };
  }, [initialized, user, socket]);

  /* ===========================
     🔁 Proactive token refresh
  =========================== */
  useEffect(() => {
    if (!initialized || !user) return;
    if (localStorage.getItem("impersonatedBy")) return;

    const CHECK_MS = 60_000;
    const REFRESH_SKEW_MS = 5 * 60_000;

    const timer = setInterval(async () => {
      try {
        if (!shouldAttemptRefresh()) return;

        const current = localStorage.getItem("token");
        if (current && !isAccessTokenExpired(current, { skewMs: REFRESH_SKEW_MS })) {
          return;
        }

        const refreshed = await refreshAccessTokenOnce();
        if (refreshed) {
          setToken(refreshed);
        }
      } catch {
        // Expected when the refresh cookie is missing/expired
      }
    }, CHECK_MS);

    return () => clearInterval(timer);
  }, [initialized, user]);

  /* ===========================
     Toast timeout
  =========================== */
  useEffect(() => {
    if (!successMessage) return;

    const timer = setTimeout(() => setSuccessMessage(null), 4000);

    return () => clearTimeout(timer);
  }, [successMessage]);

  /* ===========================
     Context value
  =========================== */
  const ctx = {
    token,
    user,
    loading,
    initialized,
    error,

    login,
    loginWithToken,
    logout,
    staffLogin,
    affiliateLogin,

    isImpersonating: Boolean(localStorage.getItem("impersonatedBy")),

    fetchWithAuth: async (fn) => {
      try {
        return await fn();
      } catch (err) {
        if ([401, 403].includes(err.response?.status)) {
          try {
            const newToken = await getValidAccessToken({ force: true });
            if (newToken) {
              return await fn();
            }
          } catch (retryErr) {
            console.warn("fetchWithAuth retry failed:", retryErr?.message || retryErr);
          }
          setError("❌ שגיאת הרשאה — נסה שוב");
        }

        throw err;
      }
    },

    refreshAccessToken: getValidAccessToken,
    getValidAccessToken,
    refreshUser,
    socket,
    setUser,
  };

  /* ===========================
     Loader while initializing
  =========================== */
  // Never block published customer sites behind the Bizuply splash.
  if (loading && !initialized && !isPublicCustomerSiteHost()) {
    return <BizuplyLoader fullScreen label="Loading..." />;
  }

  /* ===========================
     Render
  =========================== */
  return (
    <AuthContext.Provider value={ctx}>
      {successMessage && (
        <div className="global-success-toast">{successMessage}</div>
      )}
      {children}
    </AuthContext.Provider>
  );
}

/* ===========================
   Hook
=========================== */
export function useAuth() {
  return useContext(AuthContext);
}