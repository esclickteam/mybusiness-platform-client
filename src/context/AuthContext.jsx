import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API, { setAuthToken } from "../api";
import { io } from "socket.io-client";
import jwtDecode from "jwt-decode";

let ongoingRefresh = null;
let isRefreshing = false;

async function singleFlightRefresh() {
  if (!ongoingRefresh) {
    isRefreshing = true;
    ongoingRefresh = API.post("/auth/refresh-token", null, { withCredentials: true })
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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const ws = useRef(null);

  const setBusinessToChatWith = (businessId) => {
    setUser(prev => prev ? { ...prev, businessToChatWith: businessId } : prev);
  };

  // Response interceptor for automatic token refresh
  useEffect(() => {
    const interceptor = API.interceptors.response.use(
      res => res,
      async err => {
        const status = err.response?.status;
        const original = err.config;
        if ((status === 401 || status === 403) && !original._retry) {
          original._retry = true;
          try {
            const newToken = await singleFlightRefresh();
            setAuthToken(newToken);
            original.headers['Authorization'] = `Bearer ${newToken}`;
            return API(original);
          } catch {
            await logout();
            return Promise.reject(err);
          }
        }
        return Promise.reject(err);
      }
    );
    return () => API.interceptors.response.eject(interceptor);
  }, []);

  const logout = async () => {
    setLoading(true);
    try {
      await API.post("/auth/logout", {}, { withCredentials: true });
    } catch {
      // ignore
    } finally {
      ongoingRefresh = null;
      isRefreshing = false;
      setAuthToken(null);
      localStorage.removeItem("token");
      localStorage.removeItem("businessDetails");
      if (ws.current) {
        ws.current.removeAllListeners();
        ws.current.disconnect();
        ws.current = null;
      }
      setUser(null);
      setLoading(false);
      navigate("/login", { replace: true });
    }
  };

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

      // Decode initial user data and open socket
      const decoded = jwtDecode(accessToken);
      setUser({ ...decoded, businessId: decoded.businessId || null });
      createSocketConnection(accessToken, decoded);

      // Fetch full profile
      const { data } = await API.get("/auth/me", { withCredentials: true });
      if (data.businessId) {
        localStorage.setItem("businessDetails", JSON.stringify({ _id: data.businessId }));
      }
      setUser({ ...data, businessId: data.businessId || null });
      createSocketConnection(accessToken, data);

      // Handle redirect
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
        navigate(path, { replace: true });
      }

      setLoading(false);
      return { user: data, redirectUrl };
    } catch (e) {
      if (e.response?.status === 401 || e.response?.status === 403) {
        setError("❌ אימייל או סיסמה שגויים");
      } else {
        setError("❌ שגיאה בשרת, נסה שוב");
      }
      setLoading(false);
      throw e;
    }
  };

  const fetchWithAuth = async (fn) => {
    try {
      return await fn();
    } catch (err) {
      const status = err.response?.status;
      if (status === 401 || status === 403) {
        await logout();
        setError("❌ יש להתחבר מחדש");
        navigate("/login", { replace: true });
        throw new Error("Session expired");
      }
      throw err;
    }
  };

  const createSocketConnection = (token, userData) => {
    if (ws.current) {
      ws.current.removeAllListeners();
      ws.current.disconnect();
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
      try {
        const newToken = await singleFlightRefresh();
        if (newToken) {
          ws.current.auth.token = newToken;
          ws.current.connect();
        } else await logout();
      } catch {
        await logout();
      }
    });
    ws.current.on("connect_error", async err => {
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

  // Initialize session on mount
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    (async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
      } else {
        // חשוב: הדבקת ה-Authorization לפני קריאות API
        setAuthToken(token);
        try {
          const decoded = jwtDecode(token);
          if (decoded.exp * 1000 < Date.now()) await singleFlightRefresh();
          if (isMounted) {
            setUser(decoded);
            createSocketConnection(token, decoded);
          }
          const { data } = await API.get("/auth/me", { signal: controller.signal });
          if (isMounted) {
            setUser(data);
            createSocketConnection(token, data);
            if (data.businessId) localStorage.setItem("businessDetails", JSON.stringify({ _id: data.businessId }));
          }
        } catch {
          if (!controller.signal.aborted) await logout();
        }
      }
      if (isMounted) {
        setLoading(false);
        setInitialized(true);
      }
    })();

    return () => { isMounted = false; controller.abort(); };
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
