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
/*  Utility: single-flight refresh (local)                            */
/* ------------------------------------------------------------------ */
let ongoingRefresh = null;
export async function singleFlightRefresh() {
  if (!ongoingRefresh) {
    ongoingRefresh = API.post("/auth/refresh-token", null, { withCredentials: true })
      .then((res) => {
        const { accessToken, user: refreshedUser, redirectUrl } = res.data;
        if (!accessToken) throw new Error("No new token");
        // עדכון ה־token
        localStorage.setItem("token", accessToken);
        setAuthToken(accessToken);
        // עדכון המשתמש
        if (refreshedUser) {
          localStorage.setItem("businessDetails", JSON.stringify(refreshedUser));
        }
        // ניווט לפי מה שהשרת שולח
        if (redirectUrl) window.location.replace(redirectUrl);
        return accessToken;
      })
      .finally(() => {
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
  const socketRef = useRef(null);

  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("businessDetails");
    return saved ? JSON.parse(saved) : null;
  });
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
    setToken(null);
    setUser(null);
    socketRef.current?.disconnect();
    socketRef.current = null;
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
      const { data } = await API.post(
        "/auth/login",
        { email: email.trim().toLowerCase(), password },
        { withCredentials: true }
      );
      const { accessToken, user: loggedInUser, redirectUrl } = data;
      if (!accessToken) throw new Error("No access token received");

      // שמירת token ו־user
      localStorage.setItem("token", accessToken);
      setAuthToken(accessToken);
      setToken(accessToken);

      setUser(loggedInUser);
      localStorage.setItem("businessDetails", JSON.stringify(loggedInUser));

      // נווט לפי מה שהשרת שולח
      if (!skipRedirect && redirectUrl) {
        navigate(redirectUrl, { replace: true });
      }

      setLoading(false);
      return { user: loggedInUser, redirectUrl };
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
  /*  Staff Login                                                   */
  /* -------------------------------------------------------------- */
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
      setUser(staffUser);
      localStorage.setItem("businessDetails", JSON.stringify(staffUser));
      setLoading(false);
      return staffUser;
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
      }
      throw err;
    }
  };

  /* -------------------------------------------------------------- */
  /*  Init / token change                                           */
  /* -------------------------------------------------------------- */
  useEffect(() => {
    if (!token) {
      // אין token → מצב לא מאופסן
      socketRef.current?.disconnect();
      socketRef.current = null;
      setUser(null);
      localStorage.removeItem("businessDetails");
      setInitialized(true);
      return;
    }

    // יש token → טען פרטים
    setLoading(true);
    setAuthToken(token);

    (async () => {
      try {
        // אם אין לנו user עדיין, קרא ל־/auth/me
        if (!user) {
          const { data } = await API.get("/auth/me", { withCredentials: true });
          setUser(data);
          localStorage.setItem("businessDetails", JSON.stringify(data));
        }

        // חיבור socket
        const s = await createSocket(singleFlightRefresh, logout, user?.businessId);
        socketRef.current = s;

        // ניווט לפי redirectUrl מ־session (אם נשמר)
        const savedRedirect = sessionStorage.getItem("postLoginRedirect");
        if (savedRedirect) {
          navigate(savedRedirect, { replace: true });
          sessionStorage.removeItem("postLoginRedirect");
        }
      } catch {
        await logout();
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    })();
  }, [token]);

  /* -------------------------------------------------------------- */
  /*  Toast auto-dismiss                                            */
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
    socket: socketRef.current,
    setUser,
    staffLogin,
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
