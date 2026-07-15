import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API, { setAuthToken } from "../api";
import createSocket from "../socket";
import {
  getValidAccessToken,
  refreshAccessTokenOnce,
} from "../utils/tokenRefresh";
import {
  clearLastDashboardRoute,
  resolveBusinessDashboardPath,
} from "../utils/dashboardRoutePersistence";

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
function isPublicRoute(pathname) {
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

/* ===========================
   🧹 Clear local auth only
=========================== */
function clearLocalAuth({ clearDashboardRoute = false } = {}) {
  setAuthToken(null);
  localStorage.removeItem("token");
  localStorage.removeItem("businessDetails");
  localStorage.removeItem("dashboardStats");
  localStorage.removeItem("impersonatedBy");

  if (clearDashboardRoute) {
    clearLastDashboardRoute();
  }
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
      } else {
        localStorage.removeItem("impersonatedBy");
      }
    } catch {
      localStorage.removeItem("impersonatedBy");
    }

    const isImpersonating = Boolean(localStorage.getItem("impersonatedBy"));

    if (skipRedirect || isImpersonating) return;

    if (normalizedUser.role === "business" && normalizedUser.businessId) {
      navigate(
        resolveBusinessDashboardPath(normalizedUser.businessId),
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

      console.log("RAW /auth/login response:", data);

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
          return { user: normalizedUser, redirectUrl };
        }

        if (normalizedUser.role !== "admin" && normalizedUser.hasAccess) {
          sessionStorage.setItem("justRegistered", "true");

          if (normalizedUser.role === "business" && normalizedUser.businessId) {
            navigate(
              resolveBusinessDashboardPath(normalizedUser.businessId),
              { replace: true }
            );
          } else {
            navigate("/dashboard", { replace: true });
          }
        }
      }

      setLoading(false);
      return { user: normalizedUser, redirectUrl };
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

    if (!token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }

      setUser(null);
      localStorage.removeItem("businessDetails");
      setInitialized(true);
      return;
    }

    if (initialized) return;

    setLoading(true);
    setAuthToken(token);

    (async () => {
      try {
        const isImpersonating = Boolean(localStorage.getItem("impersonatedBy"));

        const freshUser = await refreshUser();

        if (!freshUser) {
          throw new Error("Missing user");
        }

        if (cancelled) return;

        if (
          freshUser.role === "admin" &&
          !isImpersonating &&
          !location.pathname.startsWith("/admin")
        ) {
          navigate("/admin/dashboard", { replace: true });
          return;
        }

        const newSocket = await createSocket(
          getValidAccessToken,
          () => logout({ callServer: false, redirect: true }),
          freshUser.businessId
        );

        if (!cancelled) {
          setSocket(newSocket);
        }

        const justRegistered = sessionStorage.getItem("justRegistered");

        if (justRegistered) {
          sessionStorage.removeItem("justRegistered");

          if (freshUser.role === "business" && freshUser.businessId) {
            navigate(resolveBusinessDashboardPath(freshUser.businessId), {
              replace: true,
            });
          } else {
            navigate("/dashboard", { replace: true });
          }

          return;
        }

        const savedRedirect = sessionStorage.getItem("postLoginRedirect");

        if (savedRedirect) {
          const isPricing = savedRedirect === "/pricing";
          const shouldSkip = isPricing && freshUser.hasAccess;

          if (!shouldSkip) {
            navigate(savedRedirect, { replace: true });
          }

          sessionStorage.removeItem("postLoginRedirect");
          return;
        }

        const isMetaCallbackRoute = location.pathname.startsWith(
          "/integrations/meta/callback"
        );

        if (
          freshUser.role === "business" &&
          freshUser.businessId &&
          !location.pathname.startsWith("/business/") &&
          !isMetaCallbackRoute
        ) {
          navigate(resolveBusinessDashboardPath(freshUser.businessId), {
            replace: true,
          });
        }
      } catch (err) {
        console.error("❌ Auth init failed:", err);

        clearLocalAuth();

        if (!cancelled) {
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
          await logout({ callServer: false, redirect: true });
          setError("❌ יש להתחבר מחדש");
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
  if (loading && !initialized) {
    return (
      <div
        style={{
          background: "linear-gradient(to bottom, #f6f7fb, #e8ebf8)",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="spinner"></div>
      </div>
    );
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