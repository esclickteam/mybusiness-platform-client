import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API, { setAuthToken } from "../api";
import createSocket from "../socket";
import {
  getValidAccessToken,
  refreshAccessTokenOnce,
  isAccessTokenExpired,
  clearAccessToken,
  shouldAttemptRefresh,
  clearRefreshDead,
  markRefreshDead,
} from "../utils/tokenRefresh";
import {
  clearLastDashboardRoute,
  resolveBusinessDashboardPath,
} from "../utils/dashboardRoutePersistence";
import { consumePendingNotificationUrl } from "../utils/notificationNavigation";
import BizuplyLoader from "../components/ui/BizuplyLoader";
import { isPublicCustomerSiteHost } from "../utils/publicSiteHost";

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
    "/terms",
    "/accessibility",
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
  clearAccessToken();
  localStorage.removeItem("businessDetails");
  localStorage.removeItem("dashboardStats");
  localStorage.removeItem("impersonatedBy");
  localStorage.removeItem("impersonatorRole");

  if (clearDashboardRoute) {
    clearLastDashboardRoute();
  }
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

      const normalized = normalizeUser(data);
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
    clearRefreshDead();
    localStorage.setItem("token", accessToken);
    setAuthToken(accessToken);
    setToken(accessToken);

    const normalizedUser = normalizeUser(userFromServer);
    setUser(normalizedUser);
    localStorage.setItem("businessDetails", JSON.stringify(normalizedUser));

    try {
      const payload = JSON.parse(atob(accessToken.split(".")[1]));

      if (payload.impersonatedBy) {
        localStorage.setItem("impersonatedBy", payload.impersonatedBy);
        if (payload.impersonatorRole) {
          localStorage.setItem("impersonatorRole", payload.impersonatorRole);
        } else if (userFromServer?.impersonatorRole) {
          localStorage.setItem(
            "impersonatorRole",
            userFromServer.impersonatorRole
          );
        }
      } else {
        localStorage.removeItem("impersonatedBy");
        localStorage.removeItem("impersonatorRole");
      }
    } catch {
      localStorage.removeItem("impersonatedBy");
      localStorage.removeItem("impersonatorRole");
    }

    const isImpersonating = Boolean(localStorage.getItem("impersonatedBy"));

    if (skipRedirect || isImpersonating) return;

    if (normalizedUser.role === "marketer") {
      navigate("/marketer/dashboard", { replace: true });
      return;
    }

    if (normalizedUser.role === "business" && normalizedUser.businessId) {
      const limitedModules = Array.isArray(normalizedUser.enabledModules)
        ? normalizedUser.enabledModules
        : null;
      const fallback = limitedModules?.includes("crm")
        ? `/business/${normalizedUser.businessId}/dashboard/crm`
        : undefined;
      navigate(
        resolveBusinessDashboardPath(normalizedUser.businessId, fallback),
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
    setLoading(true);
    setError(null);

    try {
      const { data } = await API.post(
        "/auth/login",
        { email: email.trim().toLowerCase(), password },
        { withCredentials: true }
      );

      const { accessToken, user: loggedInUser, redirectUrl } = data;

      clearRefreshDead();
      localStorage.setItem("token", accessToken);
      setAuthToken(accessToken);
      setToken(accessToken);

      const normalizedUser = normalizeUser(loggedInUser);
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

      const urlRedirect = new URLSearchParams(window.location.search).get(
        "redirect"
      );

      if (urlRedirect) {
        navigate(urlRedirect, { replace: true });
        setLoading(false);
        return { user: normalizedUser, redirectUrl: urlRedirect };
      }

      if (!skipRedirect) {
        const isImpersonating = Boolean(localStorage.getItem("impersonatedBy"));

        if (normalizedUser.role === "admin" && !isImpersonating) {
          navigate("/admin/dashboard", { replace: true });
          setLoading(false);
          return { user: normalizedUser, redirectUrl: "/admin/dashboard" };
        }

        if (normalizedUser.role === "marketer" && !isImpersonating) {
          navigate("/marketer/dashboard", { replace: true });
          setLoading(false);
          return { user: normalizedUser, redirectUrl: "/marketer/dashboard" };
        }

        if (normalizedUser.role !== "admin" && normalizedUser.hasAccess) {
          sessionStorage.setItem("justRegistered", "true");

          if (normalizedUser.role === "business" && normalizedUser.businessId) {
            const limitedModules = Array.isArray(normalizedUser.enabledModules)
              ? normalizedUser.enabledModules
              : null;
            const fallback = limitedModules?.includes("crm")
              ? `/business/${normalizedUser.businessId}/dashboard/crm`
              : undefined;
            navigate(
              resolveBusinessDashboardPath(
                normalizedUser.businessId,
                fallback
              ),
              { replace: true }
            );
          } else {
            navigate("/dashboard", { replace: true });
          }
        }
      }

      const safeRedirectUrl =
        normalizedUser.role === "admin"
          ? "/admin/dashboard"
          : normalizedUser.role === "marketer"
            ? "/marketer/dashboard"
            : redirectUrl;

      setLoading(false);
      return { user: normalizedUser, redirectUrl: safeRedirectUrl };
    } catch (err) {
      setError(
        err.response?.status >= 400 && err.response?.status < 500
          ? "❌ אימייל או סיסמה שגויים"
          : "❌ שגיאת שרת"
      );

      setLoading(false);
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

      clearRefreshDead();
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
      setError(err.message || "שגיאה");
      setLoading(false);
      throw err;
    }
  };

  /* ===========================
     🚪 Logout
  =========================== */
  const logout = async ({ callServer = true, redirect = true } = {}) => {
    setLoading(true);

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

    // Explicit logout → next login lands on main dashboard
    clearLocalAuth({ clearDashboardRoute: true });
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
     🔥 Initialize
  =========================== */
  useEffect(() => {
    let cancelled = false;

    if (initialized) return;

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
          navigate("/admin/dashboard", { replace: true });
          return;
        }

        const newSocket = await createSocket(
          getValidAccessToken,
          null,
          freshUser.businessId
        );

        if (!cancelled) {
          setSocket(newSocket);
        }

        const justRegistered = sessionStorage.getItem("justRegistered");
        const savedRedirect = sessionStorage.getItem("postLoginRedirect");

        if (justRegistered) {
          sessionStorage.removeItem("justRegistered");

          // Unpaid staged purchase / checkout-first return must not be
          // overwritten by the legacy "just registered → dashboard" hop.
          if (
            savedRedirect === "/pricing" ||
            savedRedirect === "/checkout" ||
            isCheckoutContinuationPath(location.pathname)
          ) {
            if (savedRedirect) {
              sessionStorage.removeItem("postLoginRedirect");
              navigate(savedRedirect, { replace: true });
            }
            return;
          }

          if (freshUser.role === "business" && freshUser.businessId) {
            navigate(resolveBusinessDashboardPath(freshUser.businessId), {
              replace: true,
            });
          } else {
            navigate("/dashboard", { replace: true });
          }

          return;
        }

        if (savedRedirect) {
          const isPricing = savedRedirect === "/pricing";
          const shouldSkip = isPricing && freshUser.hasAccess;

          if (!shouldSkip) {
            navigate(savedRedirect, { replace: true });
          }

          sessionStorage.removeItem("postLoginRedirect");
          return;
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
          !location.pathname.startsWith("/business/") &&
          !isMetaCallbackRoute &&
          !isCheckoutContinuationPath(location.pathname)
        ) {
          navigate(resolveBusinessDashboardPath(freshUser.businessId), {
            replace: true,
          });
        }
      } catch (err) {
        console.error("❌ Auth init failed:", err);

        const cachedRaw = localStorage.getItem("businessDetails");

        if (cachedRaw && !cancelled) {
          try {
            setUser(normalizeUser(JSON.parse(cachedRaw)));
          } catch {
            clearLocalAuth();
            setToken(null);
            setUser(null);
          }
        } else if (!cancelled) {
          clearLocalAuth();
          setToken(null);
          setUser(null);

          if (socket) {
            socket.disconnect();
            setSocket(null);
          }

          if (!isPublicRoute(location.pathname)) {
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