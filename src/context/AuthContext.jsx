// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API, { setAuthToken } from "../api";
import { io } from "socket.io-client";

let ongoingRefresh = null;
let isRefreshing = false;

// Single-flight token refresh – רק header ו-localStorage
export async function singleFlightRefresh() {
  if (!ongoingRefresh) {
    isRefreshing = true;
    ongoingRefresh = API
      .post("/auth/refresh-token", null, { withCredentials: true })
      .then(res => {
        const newToken = res.data.accessToken;
        if (!newToken) throw new Error("No new token");
        localStorage.setItem("token", newToken);
        setAuthToken(newToken);
        return newToken;
      })
      .finally(() => {
        isRefreshing = false;
        ongoingRefresh = null;
      });
  }
  return ongoingRefresh;
}

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const ws = useRef(null);

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Logout
  const logout = async () => {
    setLoading(true);
    try { await API.post("/auth/logout", {}, { withCredentials: true }); } catch {}
    ongoingRefresh = null;
    isRefreshing = false;
    setAuthToken(null);
    localStorage.removeItem("token");
    setToken(null);
    localStorage.removeItem("businessDetails");
    if (ws.current) {
      ws.current.removeAllListeners();
      ws.current.disconnect();
      ws.current = null;
    }
    setUser(null);
    setLoading(false);
    navigate("/login", { replace: true });
  };

  // Login
  const login = async (email, password, options = { skipRedirect: false }) => {
    setLoading(true);
    setError(null);
    try {
      const { data: { accessToken, redirectUrl } } = await API.post(
        "/auth/login",
        { email: email.trim().toLowerCase(), password },
        { withCredentials: true }
      );
      if (!accessToken) throw new Error("No access token received");

      localStorage.setItem("token", accessToken);
      setAuthToken(accessToken);
      setToken(accessToken);

      const { data } = await API.get("/auth/me", { withCredentials: true });
      if (data.businessId) localStorage.setItem(
        "businessDetails",
        JSON.stringify({ _id: data.businessId })
      );
      setUser(data);
      createSocketConnection(accessToken, data);

      if (!options.skipRedirect) {
        const path = redirectUrl || {
          business: `/business/${data.businessId}/dashboard`,
          customer: "/client/dashboard",
          worker: "/staff/dashboard",
          manager: "/manager/dashboard",
          admin: "/admin/dashboard"
        }[data.role] || "/";
        navigate(path, { replace: true });
      }

      setLoading(false);
      return { user: data, redirectUrl };
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

  // Fetch wrapper
  const fetchWithAuth = async fn => {
    try {
      return await fn();
    } catch (err) {
      if ([401, 403].includes(err.response?.status)) {
        await logout();
        setError("❌ יש להתחבר מחדש");
        navigate("/login", { replace: true });
        throw new Error("Session expired");
      }
      throw err;
    }
  };

  // WebSocket setup (connect only)
  const createSocketConnection = (token, userData) => {
    if (ws.current) ws.current.removeAllListeners();

    ws.current = io("https://api.esclick.co.il", {
      path: "/socket.io",
      transports: ["websocket"],
      auth: { token, role: userData.role, businessId: userData.businessId },
      reconnection: true
    });

    ws.current.on("connect", () => {
      console.log("✅ Socket connected");
      ws.current.emit("joinRoom", `business-${userData.businessId}`);
      ws.current.emit("joinRoom", `dashboard-${userData.businessId}`);
    });
    ws.current.on("disconnect", () => console.log("🔴 Socket disconnected"));

    ws.current.on("tokenExpired", async () => {
      try {
        const newToken = await singleFlightRefresh();
        setAuthToken(newToken);
        ws.current.auth.token = newToken;
        ws.current.connect();
        console.log("🔄 WS reconnected with new token");
      } catch {
        await logout();
      }
    });

    ws.current.on("connect_error", async err => {
      if (err.message === "jwt expired") {
        try {
          const newToken = await singleFlightRefresh();
          setAuthToken(newToken);
          ws.current.auth.token = newToken;
          ws.current.connect();
        } catch {
          await logout();
        }
      }
    });
  };

  // On token change
  useEffect(() => {
    if (!token) {
      setUser(null);
      setInitialized(true);
      return;
    }
    setLoading(true);
    setAuthToken(token);
    API.get("/auth/me", { withCredentials: true })
      .then(({ data }) => {
        setUser(data);
        createSocketConnection(token, data);
      })
      .catch(logout)
      .finally(() => {
        setLoading(false);
        setInitialized(true);
      });
  }, [token]);

  // Auto-dismiss toast
  useEffect(() => {
    if (!successMessage) return;
    const t = setTimeout(() => setSuccessMessage(null), 4000);
    return () => clearTimeout(t);
  }, [successMessage]);

  const contextValue = {
    token,
    user,
    loading,
    initialized,
    error,
    login,
    logout,
    fetchWithAuth,
    refreshAccessToken: singleFlightRefresh,
    socket: ws.current,
    setUser
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {successMessage && <div className="global-success-toast">{successMessage}</div>}
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
