// src/context/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import API, { setAuthToken } from "../api";
import { io } from "socket.io-client";

/* ------------------------------------------------------------------ */
/*  Utility: single-flight refresh                                     */
/* ------------------------------------------------------------------ */
let ongoingRefresh = null;
let isRefreshing   = false;

export async function singleFlightRefresh() {
  if (!ongoingRefresh) {
    isRefreshing   = true;
    ongoingRefresh = API.post("/auth/refresh-token", null, { withCredentials: true })
      .then((res) => {
        const newToken = res.data.accessToken;
        if (!newToken) throw new Error("No new token");
        localStorage.setItem("token", newToken);
        setAuthToken(newToken);
        return newToken;
      })
      .finally(() => {
        isRefreshing   = false;
        ongoingRefresh = null;
      });
  }
  return ongoingRefresh;
}

/* ------------------------------------------------------------------ */
/*  Context init                                                      */
/* ------------------------------------------------------------------ */
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  /* -------------------------------------------------------------- */
  /*  State                                                         */
  /* -------------------------------------------------------------- */
  const socketRef            = useRef(null); // live socket instance
  const [socket, setSocket]  = useState(null); // state for consumers

  const [token, setToken]    = useState(() => localStorage.getItem("token") || null);
  const [user, setUser]      = useState(null);
  const [loading, setLoading]          = useState(false);
  const [initialized, setInitialized]  = useState(false);
  const [error, setError]              = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  /* -------------------------------------------------------------- */
  /*  Disconnect helper                                             */
  /* -------------------------------------------------------------- */
  const disconnectSocket = () => {
    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
      setSocket(null);
    }
  };

  /* -------------------------------------------------------------- */
  /*  WS creator — idempotent                                        */
  /* -------------------------------------------------------------- */
  const ensureSocket = (tokenValue, userData) => {
    if (!tokenValue || !userData) return;

    // אם כבר יש סוקט פעיל עם אותו טוקן – השאר אותו
    if (socketRef.current && socketRef.current.connected) {
      if (socketRef.current.auth.token === tokenValue) return;
      // token changed (refresh) → רק עדכן auth ולאתחל מחדש
      socketRef.current.auth.token = tokenValue;
      return;
    }

    // צור חדש
    const s = io("https://api.esclick.co.il", {
      path: "/socket.io",
      transports: ["websocket"],
      auth: { token: tokenValue, role: userData.role, businessId: userData.businessId },
      reconnection: true,
    });

    socketRef.current = s;
    setSocket(s);

    s.on("connect", () => {
      console.log("✅ WS connected", s.id);
    });
    s.on("disconnect", () => console.log("🔴 WS disconnected"));

    // Token expiry ↔ refresh
    const refreshAndReconnect = async () => {
      try {
        const newToken = await singleFlightRefresh();
        setAuthToken(newToken);
        s.auth.token = newToken;
        s.connect();
        console.log("🔄 WS reconnected with new token");
      } catch {
        await logout();
      }
    };

    s.on("tokenExpired", refreshAndReconnect);
    s.on("connect_error", async (err) => {
      if (err?.message === "jwt expired") await refreshAndReconnect();
    });
  };

  /* -------------------------------------------------------------- */
  /*  Logout                                                        */
  /* -------------------------------------------------------------- */
  const logout = async () => {
    setLoading(true);
    try {
      await API.post("/auth/logout", {}, { withCredentials: true });
    } catch {}

    ongoingRefresh = null;
    isRefreshing   = false;

    setAuthToken(null);
    localStorage.removeItem("token");
    setToken(null);
    localStorage.removeItem("businessDetails");

    disconnectSocket();

    setUser(null);
    setLoading(false);
    navigate("/login", { replace: true });
  };

  /* -------------------------------------------------------------- */
  /*  Login                                                         */
  /* -------------------------------------------------------------- */
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

      // העסקת רידיירקט וכו' תתבצע אחרי שה-token effect יביא את המשתמש
      if (!options.skipRedirect) {
        // נשמור redirectUrl כדי שה-effect ישתמש מאוחר יותר
        sessionStorage.setItem("postLoginRedirect", redirectUrl || "");
      }

      setLoading(false);
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

  /* -------------------------------------------------------------- */
  /*  Fetch wrapper – auto logout on 401/403                         */
  /* -------------------------------------------------------------- */
  const fetchWithAuth = async (fn) => {
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

  /* -------------------------------------------------------------- */
  /*  Init on token                                                 */
  /* -------------------------------------------------------------- */
  useEffect(() => {
    if (!token) {
      setUser(null);
      disconnectSocket();
      setInitialized(true);
      return;
    }

    setLoading(true);
    setAuthToken(token);

    API.get("/auth/me", { withCredentials: true })
      .then(({ data }) => {
        setUser(data);
        ensureSocket(token, data);

        // redirect after login if pending
        const redirectUrl = sessionStorage.getItem("postLoginRedirect") || "";
        if (redirectUrl) {
          navigate(redirectUrl || "/", { replace: true });
          sessionStorage.removeItem("postLoginRedirect");
        }
      })
      .catch(logout)
      .finally(() => {
        setLoading(false);
        setInitialized(true);
      });
  }, [token]);

  /* -------------------------------------------------------------- */
  /*  Auto-dismiss success toast                                    */
  /* -------------------------------------------------------------- */
  useEffect(() => {
    if (!successMessage) return;
    const t = setTimeout(() => setSuccessMessage(null), 4000);
    return () => clearTimeout(t);
  }, [successMessage]);

  /* -------------------------------------------------------------- */
  /*  Context value                                                 */
  /* -------------------------------------------------------------- */
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
    socket,
    setUser,
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
