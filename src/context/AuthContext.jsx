import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API, { setAuthToken } from "../api";
import { createSocket } from "../socket";

/* ==========================
   🧩 Normalize User
   ========================== */
function normalizeUser(user) {
  if (!user) return null;

  const now = new Date();
  let computedIsValid = false;

  if (user.subscriptionStart && user.subscriptionEnd) {
    computedIsValid = new Date(user.subscriptionEnd) > now;
  }

  const isTrialing = user.subscriptionPlan === "trial" && computedIsValid;
  const isPendingActivation = user.status === "pending_activation";

  return {
    ...user,
    hasPaid: Boolean(user?.hasPaid),
    isSubscriptionValid:
      typeof user?.isSubscriptionValid === "boolean"
        ? user.isSubscriptionValid
        : computedIsValid,
    subscriptionStatus: user.status || user.subscriptionPlan || "free",
    daysLeft:
      user.subscriptionEnd && computedIsValid
        ? Math.ceil((new Date(user.subscriptionEnd) - now) / (1000 * 60 * 60 * 24))
        : 0,
    hasAccess: isTrialing || Boolean(user?.hasPaid) || isPendingActivation,
  };
}

/* ==========================
   🎨 Theme Helper
   ========================== */
function applyTheme(user) {
  const savedTheme = localStorage.getItem("theme");

  // אם כבר נשמר theme — נטען אותו
  if (savedTheme) {
    document.body.setAttribute("data-theme", savedTheme);
    return;
  }

  // אחרת נגדיר theme לפי סוג המשתמש (דוגמה)
  const theme = user?.role === "business" ? "dark" : "light";
  document.body.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

/* ==========================
   🔄 Refresh Token (Single Flight)
   ========================== */
let ongoingRefresh = null;
export async function singleFlightRefresh() {
  if (!ongoingRefresh) {
    ongoingRefresh = API.post("/auth/refresh-token", null, { withCredentials: true })
      .then((res) => {
        const { accessToken, user: refreshedUser } = res.data;
        if (!accessToken) throw new Error("No new token");

        localStorage.setItem("token", accessToken);
        setAuthToken(accessToken);

        if (refreshedUser) {
          const normalizedUser = normalizeUser(refreshedUser);
          localStorage.setItem("businessDetails", JSON.stringify(normalizedUser));
          applyTheme(normalizedUser); // שומר על theme עקבי גם אחרי רענון טוקן
        }

        return accessToken;
      })
      .finally(() => {
        ongoingRefresh = null;
      });
  }
  return ongoingRefresh;
}

/* ==========================
   🔐 Context
   ========================== */
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  /* ✨ החלת theme לפני כל רינדור ✨
     אם כבר יש data-theme על ה-body לא ניגע; אחרת נטען מה-localStorage או ברירת מחדל "light".
     זה מונע הבהוב/שינוי צבעים בין התחברות לריענון. */
  if (typeof document !== "undefined" && !document.body.getAttribute("data-theme")) {
    const savedTheme = localStorage.getItem("theme");
    document.body.setAttribute("data-theme", savedTheme || "light");
  }

  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("businessDetails");
    return saved ? normalizeUser(JSON.parse(saved)) : null;
  });
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // אפשר להחליף למימוש אמיתי אם צריך, כרגע נשמר כפי שהיה
  const socket = useMemo(() => null, []);

  /* ==========================
     👤 Fetch / Refresh User
     ========================== */
  const refreshUser = async (force = false) => {
    try {
      const { data } = await API.get(`/auth/me${force ? "?forceRefresh=1" : ""}`, {
        withCredentials: true,
      });
      const normalized = normalizeUser(data);
      setUser(normalized);
      localStorage.setItem("businessDetails", JSON.stringify(normalized));
      applyTheme(normalized);
      return normalized;
    } catch (e) {
      console.error("Failed to refresh user", e);
      return null;
    }
  };

  /* ==========================
     🚪 Login (UPDATED)
     ========================== */
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
      if (!accessToken) throw new Error("No access token received");

      localStorage.setItem("token", accessToken);
      setAuthToken(accessToken);
      setToken(accessToken);

      // ✅ נטען את המשתמש ונחיל theme מיידית לפני הניווט
      const freshUser = await refreshUser(true);
      const normalizedUser = freshUser || normalizeUser(loggedInUser);
      setUser(normalizedUser);
      localStorage.setItem("businessDetails", JSON.stringify(normalizedUser));
      applyTheme(normalizedUser); // 🟣 חשוב: לפני הניווט

      // השהייה זעירה כדי לאפשר ל-DOM לעדכן data-theme לפני הצגת הדשבורד
      await new Promise((res) => setTimeout(res, 50));

      if (!skipRedirect) {
        if (normalizedUser.hasAccess) {
          sessionStorage.setItem("justRegistered", "true");
          if (normalizedUser.role === "business" && normalizedUser.businessId) {
            navigate(`/business/${normalizedUser.businessId}/dashboard`, { replace: true });
          } else {
            navigate("/dashboard", { replace: true });
          }
        } else if (redirectUrl) {
          const isPlans = redirectUrl === "/plans";
          const shouldSkip = isPlans && normalizedUser.hasAccess;
          if (!shouldSkip) {
            if (redirectUrl === "/dashboard" && normalizedUser.businessId) {
              navigate(`/business/${normalizedUser.businessId}/dashboard`, { replace: true });
            } else {
              navigate(redirectUrl, { replace: true });
            }
          }
        }
      }

      setLoading(false);
      return { user: normalizedUser, redirectUrl };
    } catch (e) {
      setError(
        e.response?.status >= 400 && e.response?.status < 500
          ? "❌ Incorrect email or password"
          : "❌ Server error, please try again"
      );
      setLoading(false);
      throw e;
    }
  };

  /* ==========================
     🚪 Logout
     ========================== */
  const logout = async () => {
    setLoading(true);
    try {
      await API.post("/auth/logout", {}, { withCredentials: true });
    } catch {}
    setAuthToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("businessDetails");
    localStorage.removeItem("dashboardStats");
    localStorage.removeItem("theme");
    setToken(null);
    setUser(null);
    socket?.disconnect();
    setLoading(false);
    navigate("/login", { replace: true });
  };

  /* ==========================
     ⚙️ Initialize Auth + Socket
     ========================== */
  useEffect(() => {
    // אם אין טוקן — ננטרל הכל ונסיים את האתחול
    if (!token) {
      socket?.disconnect?.();
      setUser(null);
      localStorage.removeItem("businessDetails");
      setInitialized(true);
      return;
    }

    setLoading(true);
    setAuthToken(token);

    (async () => {
      try {
        const freshUser = await refreshUser(true);
        if (!freshUser) throw new Error("No fresh user data");
        setUser(freshUser);

        const socketInstance = await createSocket(
          singleFlightRefresh,
          logout,
          freshUser.businessId
        );
        if (socketInstance && !socketInstance.connected) socketInstance.connect();

        const justRegistered = sessionStorage.getItem("justRegistered");
        if (justRegistered) {
          sessionStorage.removeItem("justRegistered");
          if (freshUser.role === "business" && freshUser.businessId) {
            navigate(`/business/${freshUser.businessId}/dashboard`, { replace: true });
          } else {
            navigate("/dashboard", { replace: true });
          }
          return;
        }

        const savedRedirect = sessionStorage.getItem("postLoginRedirect");
        if (savedRedirect) {
          const isPlans = savedRedirect === "/plans";
          const shouldSkip = isPlans && freshUser.hasAccess;
          if (!shouldSkip) navigate(savedRedirect, { replace: true });
          sessionStorage.removeItem("postLoginRedirect");
          return;
        }

        if (freshUser.role === "business" && freshUser.businessId && location.pathname === "/") {
          navigate(`/business/${freshUser.businessId}/dashboard`, { replace: true });
        }
      } catch (err) {
        console.error("[Auth] init error:", err);
        await logout();
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    })();
  }, [token, navigate, location.pathname]);

  /* ==========================
     🕒 Success Message Timeout
     ========================== */
  useEffect(() => {
    if (!successMessage) return;
    const t = setTimeout(() => setSuccessMessage(null), 4000);
    return () => clearTimeout(t);
  }, [successMessage]);

  /* ==========================
     📦 Context Value
     ========================== */
  const ctx = {
    token,
    user,
    loading,
    initialized,
    error,
    login,
    logout,
    refreshAccessToken: singleFlightRefresh,
    refreshUser,
    socket,
    setUser,
  };

  /* ==========================
     🌀 Prevent UI flash before init
     ========================== */
  if (!initialized) {
    return (
      <div className="auth-loading-screen">
        <div className="loader" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={ctx}>
      {successMessage && <div className="global-success-toast">{successMessage}</div>}
      {children}
    </AuthContext.Provider>
  );
}

/* ==========================
   📡 Hook
   ========================== */
export function useAuth() {
  return useContext(AuthContext);
}
