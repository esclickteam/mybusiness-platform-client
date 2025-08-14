import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API, { setAuthToken } from "../api";
import createSocket from "../socket"; // singleton socket helper

function normalizeUser(user) {
  if (!user) return null;

  const now = new Date();
  let computedIsValid = false;

  if (user.subscriptionStart && user.subscriptionEnd) {
    computedIsValid = new Date(user.subscriptionEnd) > now;
  }

  return {
    ...user,
    hasPaid: Boolean(user?.hasPaid),
    isSubscriptionValid:
      typeof user?.isSubscriptionValid === "boolean"
        ? user.isSubscriptionValid
        : computedIsValid,
    subscriptionStatus: user.subscriptionPlan || "free",
    daysLeft:
      user.subscriptionEnd && computedIsValid
        ? Math.ceil((new Date(user.subscriptionEnd) - now) / (1000 * 60 * 60 * 24))
        : 0,
  };
}

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

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
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

  const refreshUser = async (force = false) => {
    try {
      const { data } = await API.get(`/auth/me${force ? "?forceRefresh=1" : ""}`, {
        withCredentials: true,
      });
      console.log("refreshUser - user data received:", data);
      const normalized = normalizeUser(data);
      setUser(normalized);
      localStorage.setItem("businessDetails", JSON.stringify(normalized));
      return normalized;
    } catch (e) {
      console.error("Failed to refresh user", e);
      return null;
    }
  };

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

      const freshUser = await refreshUser(true);
      const normalizedUser = freshUser || normalizeUser(loggedInUser);
      setUser(normalizedUser);
      localStorage.setItem("businessDetails", JSON.stringify(normalizedUser));

      if (!skipRedirect) {
        if (normalizedUser.subscriptionStatus === "trial" && normalizedUser.isSubscriptionValid) {
          sessionStorage.setItem("justRegistered", "true");
          if (normalizedUser.businessId) {
            navigate(`/business/${normalizedUser.businessId}/dashboard`, { replace: true });
          } else {
            navigate("/dashboard", { replace: true });
          }
        } else if (redirectUrl) {
          const isPlans = redirectUrl === "/plans";
          const shouldSkip = isPlans && normalizedUser.hasPaid;
          if (!shouldSkip) {
            if (redirectUrl === "/dashboard" && normalizedUser.businessId) {
              navigate(`/business/${normalizedUser.businessId}/dashboard`, { replace: true });
            } else {
              navigate(redirectUrl, { replace: true });
            }
          }
        } else if (normalizedUser.role === "business") {
          if (normalizedUser.businessId) {
            navigate(`/business/${normalizedUser.businessId}/dashboard`, { replace: true });
          } else {
            navigate("/dashboard", { replace: true });
          }
        }
      }

      setLoading(false);
      return { user: normalizedUser, redirectUrl };
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

      const freshUser = await refreshUser(true);
      const normalizedStaffUser = freshUser || normalizeUser(staffUser);
      setUser(normalizedStaffUser);
      localStorage.setItem("businessDetails", JSON.stringify(normalizedStaffUser));

      setLoading(false);
      return normalizedStaffUser;
    } catch (e) {
      setError(
        e.response?.status >= 400 && e.response?.status < 500
          ? "❌ שם משתמש או סיסמה שגויים"
          : "❌ שגיאה בשרת, נסה שוב"
      );
      setLoading(false);
      throw e;
    }
  };

  const affiliateLogin = async (publicToken) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.get(`/affiliate/login/${publicToken}`, { withCredentials: true });
      if (!data.success) throw new Error("משווק לא נמצא");

      const freshUser = await refreshUser(true);
      const normalized = freshUser || normalizeUser(data);
      setUser(normalized);
      localStorage.setItem("businessDetails", JSON.stringify(normalized));

      setToken(null);
      setLoading(false);
      return normalized;
    } catch (e) {
      setError(e.message || "שגיאה בכניסה כמשווק");
      setLoading(false);
      throw e;
    }
  };

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

        const justRegistered = sessionStorage.getItem("justRegistered");
        if (justRegistered) {
          sessionStorage.removeItem("justRegistered");
          if (freshUser.role === "business") {
            if (freshUser.businessId) {
              navigate(`/business/${freshUser.businessId}/dashboard`, { replace: true });
            } else {
              navigate("/dashboard", { replace: true });
            }
          }
          return;
        }

        const savedRedirect = sessionStorage.getItem("postLoginRedirect");
        if (savedRedirect) {
          const isPlans = savedRedirect === "/plans";
          const shouldSkip = isPlans && freshUser.hasPaid;
          if (!shouldSkip) {
            navigate(savedRedirect, { replace: true });
          }
          sessionStorage.removeItem("postLoginRedirect");
        } else {
          if (freshUser.role === "business" && window.location.pathname === "/") {
            if (freshUser.businessId) {
              navigate(`/business/${freshUser.businessId}/dashboard`, { replace: true });
            } else {
              navigate("/dashboard", { replace: true });
            }
          }
        }
      } catch {
        await logout();
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    })();
  }, [token, navigate]);

  useEffect(() => {
    if (!successMessage) return;
    const t = setTimeout(() => setSuccessMessage(null), 4000);
    return () => clearTimeout(t);
  }, [successMessage]);

  const ctx = {
    token,
    user,
    loading,
    initialized,
    error,
    login,
    logout,
    staffLogin,
    affiliateLogin,
    fetchWithAuth: async (fn) => {
      try {
        return await fn();
      } catch (err) {
        if ([401, 403].includes(err.response?.status)) {
          await logout();
          setError("❌ יש להתחבר מחדש");
        }
        throw err;
      }
    },
    refreshAccessToken: singleFlightRefresh,
    refreshUser,
    socket,
    setUser,
  };

  return (
    <AuthContext.Provider value={ctx}>
      {successMessage && <div className="global-success-toast">{successMessage}</div>}
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
