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

function normalizeUser(user) {
  return {
    ...user,
    hasPaid: Boolean(user?.hasPaid),  // המרה ברורה ל־Boolean אמיתי
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
  const socketRef = useRef(null);

  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("businessDetails");
    return saved ? normalizeUser(JSON.parse(saved)) : null;
  });
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const affiliateLogin = async (publicToken) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.get(`/affiliate/login/${publicToken}`, { withCredentials: true });
      if (!data.success) throw new Error("משווק לא נמצא");

      const userData = await API.get("/auth/me", { withCredentials: true });
      const normalizedUser = normalizeUser(userData.data);
      setUser(normalizedUser);
      localStorage.setItem("businessDetails", JSON.stringify(normalizedUser));

      setToken(null);

      setLoading(false);
      return normalizedUser;
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
    setToken(null);
    setUser(null);
    socketRef.current?.disconnect();
    socketRef.current = null;
    setLoading(false);
    navigate("/login", { replace: true });
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

      const normalizedUser = normalizeUser(loggedInUser);
      setUser(normalizedUser);
      localStorage.setItem("businessDetails", JSON.stringify(normalizedUser));

      if (!skipRedirect && redirectUrl) {
        if (redirectUrl === "/dashboard" && normalizedUser.businessId) {
          navigate(`/business/${normalizedUser.businessId}/dashboard`, { replace: true });
        } else {
          navigate(redirectUrl, { replace: true });
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

      const normalizedStaffUser = normalizeUser(staffUser);
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

  useEffect(() => {
    console.log("AuthContext useEffect - token:", token);
    if (!token) {
      console.log("Token missing, resetting user...");
      socketRef.current?.disconnect();
      socketRef.current = null;
      setUser(null);
      localStorage.removeItem("businessDetails");
      setInitialized(true);
      return;
    }

    setLoading(true);
    setAuthToken(token);

    (async () => {
      try {
        if (!user) {
          const { data } = await API.get("/auth/me", { withCredentials: true });
          const normalized = normalizeUser(data);
          setUser(normalized);
          localStorage.setItem("businessDetails", JSON.stringify(normalized));
        }

        socketRef.current = await createSocket(singleFlightRefresh, logout, user?.businessId);

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
    fetchWithAuth,
    refreshAccessToken: singleFlightRefresh,
    socket: socketRef.current,
    setUser,
    staffLogin,
    affiliateLogin,
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
