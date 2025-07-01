import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API, { setAuthToken } from "../api";
import { io } from "socket.io-client";

let ongoingRefresh = null;
let isRefreshing = false;

// Single-flight token refresh – לא משנה state, רק header ו-localStorage
export async function singleFlightRefresh() {
  console.log("[AuthContext] singleFlightRefresh called");
  if (!ongoingRefresh) {
    isRefreshing = true;
    console.log("[AuthContext] Starting token refresh");
    ongoingRefresh = API.post("/auth/refresh-token", null, { withCredentials: true })
      .then(res => {
        const newToken = res.data.accessToken;
        if (!newToken) throw new Error("No new token");
        console.log("[AuthContext] Refresh token success:", newToken);
        // עדכון ה־header וה־storage בלבד, ללא setToken
        localStorage.setItem("token", newToken);
        setAuthToken(newToken);
        return newToken;
      })
      .catch(err => {
        console.error("[AuthContext] Refresh token failed:", err);
        throw err;
      })
      .finally(() => {
        isRefreshing = false;
        ongoingRefresh = null;
        console.log("[AuthContext] Token refresh finished");
      });
  } else {
    console.log("[AuthContext] Using ongoing token refresh");
  }
  return ongoingRefresh;
}

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const ws = useRef(null);

  // Logout
  const logout = async () => {
    console.log("[AuthContext] logout called");
    setLoading(true);
    try {
      await API.post("/auth/logout", {}, { withCredentials: true });
      console.log("[AuthContext] logout API success");
    } catch {
      console.warn("[AuthContext] logout API error (ignored)");
    } finally {
      ongoingRefresh = null;
      isRefreshing = false;
      setAuthToken(null);
      localStorage.removeItem("token");
      setToken(null);
      localStorage.removeItem("businessDetails");
      console.log("[AuthContext] Cleared token & details");
      if (ws.current) {
        ws.current.removeAllListeners();
        ws.current.disconnect();
        ws.current = null;
        console.log("[AuthContext] WebSocket disconnected");
      }
      setUser(null);
      setLoading(false);
      navigate("/login", { replace: true });
    }
  };

  // Login
  const login = async (email, password, options = { skipRedirect: false }) => {
    console.log("[AuthContext] login called with:", email);
    setLoading(true);
    setError(null);
    try {
      const { data: { accessToken, redirectUrl } } = await API.post(
        "/auth/login",
        { email: email.trim().toLowerCase(), password },
        { withCredentials: true }
      );
      if (!accessToken) throw new Error("No access token received");
      console.log("[AuthContext] login success:", accessToken);

      localStorage.setItem("token", accessToken);
      setAuthToken(accessToken);
      setToken(accessToken);

      const { data } = await API.get("/auth/me", { withCredentials: true });
      console.log("[AuthContext] /auth/me returned:", data);

      if (data.businessId) {
        localStorage.setItem("businessDetails", JSON.stringify({ _id: data.businessId }));
        console.log("[AuthContext] Stored businessDetails:", data.businessId);
      }
      setUser(data);
      // חיבור ראשוני של socket
      createSocketConnection(accessToken, data);

      if (!options.skipRedirect) {
        const path = redirectUrl || {
          business: `/business/${data.businessId}/dashboard`,
          customer: "/client/dashboard",
          worker: "/staff/dashboard",
          manager: "/manager/dashboard",
          admin: "/admin/dashboard"
        }[data.role] || "/";
        console.log("[AuthContext] Redirecting to:", path);
        navigate(path, { replace: true });
      }

      setLoading(false);
      return { user: data, redirectUrl };
    } catch (e) {
      console.error("[AuthContext] login error:", e);
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
        console.warn("[AuthContext] Unauthorized – logging out");
        await logout();
        setError("❌ יש להתחבר מחדש");
        navigate("/login", { replace: true });
        throw new Error("Session expired");
      }
      throw err;
    }
  };

  // WebSocket setup
  const createSocketConnection = (token, userData) => {
    console.log("[AuthContext] createSocketConnection:", { token, userData });
    if (ws.current) {
      ws.current.removeAllListeners();
      ws.current.disconnect();
      ws.current = null;
      console.log("[AuthContext] Disposed previous WS");
    }
    if (!token) return;

    ws.current = io("https://api.esclick.co.il", {
      path: "/socket.io",
      transports: ["websocket"],
      auth: { token, role: userData.role, businessId: userData.businessId }
    });

    ws.current.on("connect",    () => console.log("✅ Socket connected"));
    ws.current.on("disconnect", () => console.log("🔴 Socket disconnected"));

    // טיפול באירוע tokenExpired ללא setToken
    ws.current.on("tokenExpired", async () => {
      console.warn("[AuthContext] Socket tokenExpired");
      try {
        const newToken = await singleFlightRefresh();
        setAuthToken(newToken);
        ws.current.auth.token = newToken;
        ws.current.disconnect();
        ws.current.connect();
        console.log("[AuthContext] WS reconnected with new token");
      } catch {
        await logout();
      }
    });

    ws.current.on("connect_error", async err => {
      console.error("[AuthContext] WS connect_error:", err);
      if (err.message === "jwt expired") {
        try {
          const newToken = await singleFlightRefresh();
          setAuthToken(newToken);
          createSocketConnection(newToken, userData);
        } catch {
          await logout();
        }
      }
    });
  };

  // watch token changes: fetch /auth/me & init WS
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    console.log("[AuthContext] useEffect token changed:", token);
    if (!token) {
      setUser(null);
      setInitialized(true);
      return;
    }

    setLoading(true);
    setAuthToken(token);
    API.get("/auth/me", { signal: controller.signal })
      .then(({ data }) => {
        if (!isMounted) return;
        console.log("[AuthContext] /auth/me success:", data);
        setUser(data);
        createSocketConnection(token, data);
        if (data.businessId) {
          localStorage.setItem("businessDetails", JSON.stringify({ _id: data.businessId }));
          console.log("[AuthContext] Stored businessDetails:", data.businessId);
        }
      })
      .catch(async e => {
        if (!controller.signal.aborted) {
          console.error("[AuthContext] /auth/me error:", e);
          await logout();
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
          setInitialized(true);
          console.log("[AuthContext] Initialization complete");
        }
      });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [token]);

  // Auto-dismiss success toast
  useEffect(() => {
    if (!successMessage) return;
    const t = setTimeout(() => setSuccessMessage(null), 4000);
    return () => clearTimeout(t);
  }, [successMessage]);

  // contextValue ישירות בלי useMemo
  const contextValue = {
    token,
    user,
    loading,
    initialized,
    error,
    login,
    logout,
    refreshAccessToken: singleFlightRefresh,
    fetchWithAuth,
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

// ייצוא ה-hook useAuth כדי שתוכלו לייבא אותו כ־named import
export function useAuth() {
  return useContext(AuthContext);
}
