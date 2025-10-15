import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API, { setAuthToken } from "../api";
import createSocket from "../socket"; // singleton socket helper

/* ===========================
   🧩 Normalize User
   =========================== */
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

/* ===========================
   🔁 Token Refresh (single-flight)
   =========================== */
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
        }

        return accessToken;
      })
      .finally(() => {
        ongoingRefresh = null;
      });
  }
  return ongoingRefresh;
}

/* ===========================
   ⚙️ Context
   =========================== */
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [socket, setSocket] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("businessDetails");
    return saved ? normalizeUser(JSON.parse(saved)) : null;
  });
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  /* ===========================
     👤 Refresh user data
     =========================== */
  const refreshUser = async (force = false) => {
    try {
      const { data } = await API.get(`/auth/me${force ? "?forceRefresh=1" : ""}`, {
        withCredentials: true,
      });
      const normalized = normalizeUser(data);
      setUser(normalized);
      localStorage.setItem("businessDetails", JSON.stringify(normalized));
      return normalized;
    } catch (e) {
      console.error("Failed to refresh user", e);
      return null;
    }
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

      const { accessToken, user: loggedInUser } = data;
      if (!accessToken) throw new Error("No access token received");

      // ✅ שמירת טוקן
      localStorage.setItem("token", accessToken);
      setAuthToken(accessToken);
      setToken(accessToken);

      // ✅ נירמול משתמש
      const normalizedUser = normalizeUser(loggedInUser);
      setUser(normalizedUser);
      localStorage.setItem("businessDetails", JSON.stringify(normalizedUser));

      document.body.style.background = "linear-gradient(to bottom, #f6f7fb, #e8ebf8)";
      refreshUser(true).catch(() => {});

      // ✅ ניתוב אחרי התחברות
      if (!skipRedirect) {
        const isTrialExpired =
          normalizedUser.role === "business" &&
          normalizedUser.subscriptionPlan === "trial" &&
          normalizedUser.subscriptionEnd &&
          new Date(normalizedUser.subscriptionEnd) < new Date();

        // 🟣 ניסיון פג → רק מודאל
        if (isTrialExpired) {
          console.log("⚠️ ניסיון פג – מציגים מודאל בלבד");
          navigate("/trial-expired", { replace: true });
          setLoading(false);
          return;
        }

        // ✅ ניסיון פעיל / מנוי פעיל
        if (normalizedUser.hasAccess) {
          sessionStorage.setItem("justRegistered", "true");
          if (normalizedUser.role === "business" && normalizedUser.businessId) {
            navigate(`/business/${normalizedUser.businessId}/dashboard`, { replace: true });
          } else {
            navigate("/dashboard", { replace: true });
          }
        }
      }

      setLoading(false);
      return { user: normalizedUser };
    } catch (e) {
      setError(
        e.response?.status >= 400 && e.response?.status < 500
          ? "❌ אימייל או סיסמה שגויים"
          : "❌ שגיאה בשרת, נסה שוב"
      );
      setLoading(false);
      throw e;
    }
  };

  /* ===========================
     🚪 Logout
     =========================== */
  const logout = async () => {
    setLoading(true);
    try {
      await API.post("/auth/logout", {}, { withCredentials: true });
    } catch {}
    setAuthToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("businessDetails");
    localStorage.removeItem("dashboardStats");
    setToken(null);
    setUser(null);
    socket?.disconnect();
    setSocket(null);
    setLoading(false);
    navigate("/login", { replace: true });
  };

  /* ===========================
     ⚡ Initialize on mount
     =========================== */
  useEffect(() => {
    if (!token) {
      socket?.disconnect();
      setSocket(null);
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
        const newSocket = await createSocket(singleFlightRefresh, logout, freshUser.businessId);
        setSocket(newSocket);

        // 🟣 ניסיון פג – מעבר למסך מודאל בלבד
        const isTrialExpired =
          freshUser.role === "business" &&
          freshUser.subscriptionPlan === "trial" &&
          freshUser.subscriptionEnd &&
          new Date(freshUser.subscriptionEnd) < new Date();

        if (isTrialExpired) {
          console.log("⚠️ ניסיון פג – מעבר למסך מודאל בלבד");
          navigate("/trial-expired", { replace: true });
          setLoading(false);
          setInitialized(true);
          return;
        }

        // ✅ אם יש ניסיון/מנוי פעיל – ממשיכים לדשבורד
        const hasActiveTrial =
          freshUser.subscriptionPlan === "trial" &&
          freshUser.subscriptionEnd &&
          new Date(freshUser.subscriptionEnd) > new Date();

        const hasActiveSubscription =
          freshUser.subscriptionPlan !== "trial" &&
          freshUser.subscriptionEnd &&
          new Date(freshUser.subscriptionEnd) > new Date();

        if (
          freshUser.role === "business" &&
          freshUser.businessId &&
          location.pathname === "/" &&
          (hasActiveTrial || hasActiveSubscription)
        ) {
          navigate(`/business/${freshUser.businessId}/dashboard`, { replace: true });
        }
      } catch {
        await logout();
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    })();
  }, [token, navigate, location.pathname]);

  /* ===========================
     🕓 Success message timeout
     =========================== */
  useEffect(() => {
    if (!successMessage) return;
    const t = setTimeout(() => setSuccessMessage(null), 4000);
    return () => clearTimeout(t);
  }, [successMessage]);

  /* ===========================
     🧩 Context value
     =========================== */
  const ctx = {
    token,
    user,
    loading,
    initialized,
    error,
    login,
    logout,
    refreshUser,
    refreshAccessToken: singleFlightRefresh,
    socket,
    setUser,
  };

  /* ===========================
     🧩 Loader בזמן טעינה ראשונית
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
     ✅ Render
     =========================== */
  return (
    <AuthContext.Provider value={ctx}>
      {successMessage && <div className="global-success-toast">{successMessage}</div>}
      {children}
    </AuthContext.Provider>
  );
}

/* ===========================
   🔗 Hook
   =========================== */
export function useAuth() {
  return useContext(AuthContext);
}
