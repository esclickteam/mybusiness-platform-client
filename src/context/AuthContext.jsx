import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import API, { setAuthToken } from "../api";
import createSocket from "../socket"; // singleton socket helper

/* ------------------------------------------------------------------ */
/*  Utility: single‑flight refresh (local)                            */
/* ------------------------------------------------------------------ */
let ongoingRefresh = null;
let isRefreshing = false;

export async function singleFlightRefresh() {
  if (!ongoingRefresh) {
    isRefreshing = true;
    ongoingRefresh = API.post("/auth/refresh-token", null, { withCredentials: true })
      .then((res) => {
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

/* ------------------------------------------------------------------ */
/*  Context init                                                      */
/* ------------------------------------------------------------------ */
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  /* -------------------------------------------------------------- */
  /*  State                                                         */
  /* -------------------------------------------------------------- */
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  /* -------------------------------------------------------------- */
  /*  Logout                                                        */
  /* -------------------------------------------------------------- */
  const logout = async () => {
    setLoading(true);
    try {
      await API.post("/auth/logout", {}, { withCredentials: true });
    } catch {}

    setAuthToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("businessDetails");
    localStorage.removeItem("user"); // ניקוי פרטי משתמש מ-localStorage
    setToken(null);
    setUser(null);

    socketRef.current?.removeAllListeners();
    socketRef.current?.disconnect();
    socketRef.current = null;
    setSocket(null);

    setLoading(false);
    navigate("/login", { replace: true });
  };

  /* -------------------------------------------------------------- */
  /*  Login                                                         */
  /* -------------------------------------------------------------- */
  const login = async (email, password, { skipRedirect = false } = {}) => {
    setLoading(true);
    setError(null);

    try {
      const {
        data: { accessToken, redirectUrl },
      } = await API.post(
        "/auth/login",
        { email: email.trim().toLowerCase(), password },
        { withCredentials: true }
      );

      if (!accessToken) throw new Error("No access token received");

      localStorage.setItem("token", accessToken);
      setAuthToken(accessToken);
      setToken(accessToken);

      if (!skipRedirect) sessionStorage.setItem("postLoginRedirect", redirectUrl || "");

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
  /*  Fetch wrapper                                                 */
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
  /*  Init / token change                                           */
  /* -------------------------------------------------------------- */
  useEffect(() => {
    if (!token) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setSocket(null);
      setUser(null);
      localStorage.removeItem("user"); // ניקוי פרטי משתמש ב-localStorage
      setInitialized(true);
      return;
    }

    setLoading(true);
    setAuthToken(token);

    (async () => {
      try {
        const { data } = await API.get("/auth/me", { withCredentials: true });
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data)); // שמירת פרטי משתמש

        const s = await createSocket(singleFlightRefresh, logout, data.businessId);
        socketRef.current = s;
        setSocket(s);

        const redirectUrl = sessionStorage.getItem("postLoginRedirect") || "";
        if (redirectUrl) {
          navigate(redirectUrl || "/", { replace: true });
          sessionStorage.removeItem("postLoginRedirect");
        }
      } catch (err) {
        localStorage.removeItem("user"); // ניקוי במקרה של שגיאה
        await logout();
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    })();
  }, [token]);

  /* -------------------------------------------------------------- */
  /*  Toast auto‑dismiss                                            */
  /* -------------------------------------------------------------- */
  useEffect(() => {
    if (!successMessage) return;
    const t = setTimeout(() => setSuccessMessage(null), 4000);
    return () => clearTimeout(t);
  }, [successMessage]);

  /* -------------------------------------------------------------- */
  /*  Context value                                                 */
  /* -------------------------------------------------------------- */
  const ctx = {
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
    <AuthContext.Provider value={ctx}>
      {successMessage && <div className="global-success-toast">{successMessage}</div>}
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
