import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API, { setAuthToken } from "../api";
import { io } from "socket.io-client";

let ongoingRefresh = null;
let isRefreshing = false;

// Single-flight token refresh
async function singleFlightRefresh() {
  console.log("[AuthContext] singleFlightRefresh called");
  if (!ongoingRefresh) {
    isRefreshing = true;
    console.log("[AuthContext] Starting token refresh");
    ongoingRefresh = API.post("/auth/refresh-token", null, { withCredentials: true })
      .then(res => {
        const newToken = res.data.accessToken;
        if (!newToken) throw new Error("No new token");
        console.log("[AuthContext] Refresh token success:", newToken);
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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const ws = useRef(null);

  // Helper to update user
  const setBusinessToChatWith = (businessId) => {
    setUser(prev => prev ? { ...prev, businessToChatWith: businessId } : prev);
  };

  // Logout logic
  const logout = async () => {
    console.log("[AuthContext] logout called");
    setLoading(true);
    try {
      await API.post("/auth/logout", {}, { withCredentials: true });
      console.log("[AuthContext] logout API success");
    } catch (e) {
      console.warn("[AuthContext] logout API error (ignored):", e);
    } finally {
      ongoingRefresh = null;
      isRefreshing = false;
      setAuthToken(null);
      localStorage.removeItem("token");
      localStorage.removeItem("businessDetails");
      console.log("[AuthContext] Cleared token and businessDetails from storage");
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

  // Login logic
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
      console.log("[AuthContext] login success, accessToken:", accessToken);

      localStorage.setItem("token", accessToken);
      setAuthToken(accessToken);

      const { data } = await API.get("/auth/me", { withCredentials: true });
      console.log("[AuthContext] /auth/me returned:", data);

      if (data.businessId) {
        localStorage.setItem(
          "businessDetails",
          JSON.stringify({ _id: data.businessId })
        );
        console.log("[AuthContext] Stored businessDetails:", data.businessId);
      }
      setUser(data);
      createSocketConnection(accessToken, data);

      if (!options.skipRedirect) {
        const path = redirectUrl || (() => {
          switch (data.role) {
            case "business": return `/business/${data.businessId}/dashboard`;
            case "customer": return "/client/dashboard";
            case "worker": return "/staff/dashboard";
            case "manager": return "/manager/dashboard";
            case "admin": return "/admin/dashboard";
            default: return "/";
          }
        })();
        console.log("[AuthContext] Redirecting to:", path);
        navigate(path, { replace: true });
      }

      setLoading(false);
      return { user: data, redirectUrl };
    } catch (e) {
      console.error("[AuthContext] login error:", e);
      if (e.response?.status === 401 || e.response?.status === 403) {
        setError("❌ אימייל או סיסמה שגויים");
      } else {
        setError("❌ שגיאה בשרת, נסה שוב");
      }
      setLoading(false);
      throw e;
    }
  };

  // Helper to fetch with auth & handle expiration
  const fetchWithAuth = async (fn) => {
    try {
      return await fn();
    } catch (err) {
      const status = err.response?.status;
      if (status === 401 || status === 403) {
        console.warn("[AuthContext] fetchWithAuth detected unauthorized, logging out");
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
      console.log("[AuthContext] Previous WebSocket disposed");
    }
    if (!token) return;

    ws.current = io("https://api.esclick.co.il", {
      path: "/socket.io",
      transports: ["websocket"],
      auth: { token, role: userData.role, businessId: userData.businessId }
    });

    ws.current.on("connect", () => console.log("✅ Socket connected:"));
    ws.current.on("disconnect", () => console.log("🔴 Socket disconnected"));
    ws.current.on("tokenExpired", async () => {
      console.warn("[AuthContext] Socket tokenExpired event");
      try {
        const newToken = await singleFlightRefresh();
        if (newToken) {
          ws.current.auth.token = newToken;
          ws.current.connect();
          console.log("[AuthContext] Reconnected socket with new token");
        } else await logout();
      } catch {
        await logout();
      }
    });
    ws.current.on("connect_error", async err => {
      console.error("[AuthContext] socket connect_error:", err);
      if (err.message === "jwt expired") {
        try {
          const newToken = await singleFlightRefresh();
          if (newToken) createSocketConnection(newToken, userData);
          else await logout();
        } catch {
          await logout();
        }
      }
    });
  };

  // Initial load: get token from storage & fetch user
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    (async () => {
      console.log("[AuthContext] Initializing auth on mount");
      setLoading(true);
      const token = localStorage.getItem("token");
      console.log("[AuthContext] Token from localStorage:", token);
      if (!token) {
        console.log("[AuthContext] No token found, skipping /auth/me");
        setUser(null);
      } else {
        setAuthToken(token);
        try {
          const { data } = await API.get("/auth/me", { signal: controller.signal });
          console.log("[AuthContext] /auth/me success on mount:", data);
          if (isMounted) {
            setUser(data);
            createSocketConnection(token, data);
            if (data.businessId) {
              localStorage.setItem(
                "businessDetails",
                JSON.stringify({ _id: data.businessId })
              );
              console.log("[AuthContext] Stored businessDetails on mount:", data.businessId);
            }
          }
        } catch (e) {
          if (!controller.signal.aborted) {
            console.error("[AuthContext] /auth/me error on mount:", e);
            await logout();
          }
        }
      }
      if (isMounted) {
        setLoading(false);
        setInitialized(true);
        console.log("[AuthContext] Initialization complete");
      }
    })();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  // Cleanup success toast
  useEffect(() => {
    if (successMessage) {
      const t = setTimeout(() => setSuccessMessage(null), 4000);
      return () => clearTimeout(t);
    }
  }, [successMessage]);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      initialized,
      error,
      login,
      logout,
      refreshAccessToken: singleFlightRefresh,
      fetchWithAuth,
      socket: ws.current,
      setUser,
      setBusinessToChatWith
    }}>
      {successMessage && <div className="global-success-toast">{successMessage}</div>}
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
