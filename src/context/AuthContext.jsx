import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback
} from "react";
import { useNavigate } from "react-router-dom";
import API, { setAuthToken } from "../api";
import { io } from "socket.io-client";

// Single-flight token refresh state
let ongoingRefresh = null;
let isRefreshing = false;

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  // Token and user state
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  // initialized true if no token, otherwise false until /auth/me resolves
  const [initialized, setInitialized] = useState(() => (token ? false : true));

  // WebSocket ref
  const ws = useRef(null);

  // Single-flight refresh inside component for access to setToken
  const singleFlightRefresh = useCallback(async () => {
    if (!ongoingRefresh) {
      isRefreshing = true;
      ongoingRefresh = API.post("/auth/refresh-token", null, { withCredentials: true })
        .then(res => {
          const newToken = res.data.accessToken;
          if (!newToken) throw new Error("No new token");
          localStorage.setItem("token", newToken);
          setAuthToken(newToken);
          setToken(newToken);
          return newToken;
        })
        .catch(err => {
          throw err;
        })
        .finally(() => {
          isRefreshing = false;
          ongoingRefresh = null;
        });
    }
    return ongoingRefresh;
  }, []);

  // Logout callback
  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await API.post("/auth/logout", {}, { withCredentials: true });
    } catch {
      // ignore
    }
    // Reset auth state
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
  }, [navigate]);

  // Login function
  const login = useCallback(
    async (email, password, options = { skipRedirect: false }) => {
      setLoading(true);
      setError(null);
      try {
        const {
          data: { accessToken, redirectUrl }
        } = await API.post(
          "/auth/login",
          { email: email.trim().toLowerCase(), password },
          { withCredentials: true }
        );
        if (!accessToken) throw new Error("No access token received");

        localStorage.setItem("token", accessToken);
        setAuthToken(accessToken);
        setToken(accessToken);

        const { data } = await API.get("/auth/me", { withCredentials: true });
        if (data.businessId) {
          localStorage.setItem(
            "businessDetails",
            JSON.stringify({ _id: data.businessId })
          );
        }
        setUser(data);

        // Open WS
        if (data) {
          if (ws.current) {
            ws.current.removeAllListeners();
            ws.current.disconnect();
          }
          ws.current = io("https://api.esclick.co.il", {
            path: "/socket.io",
            transports: ["websocket"],
            auth: {
              token: accessToken,
              role: data.role,
              businessId: data.businessId
            }
          });
        }

        if (!options.skipRedirect) {
          const path =
            redirectUrl ||
            {
              business: `/business/${data.businessId}/dashboard`,
              customer: "/client/dashboard",
              worker: "/staff/dashboard",
              manager: "/manager/dashboard",
              admin: "/admin/dashboard"
            }[data.role] ||
            "/";
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
    },
    [navigate]
  );

  // Fetch wrapper for 401/403
  const fetchWithAuth = useCallback(
    async fn => {
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
    },
    [logout, navigate]
  );

  // Effect: load user on token change
  useEffect(() => {
    if (!token) return;
    let isMounted = true;
    const controller = new AbortController();

    setLoading(true);
    setAuthToken(token);
    API.get("/auth/me", { signal: controller.signal })
      .then(({ data }) => {
        if (!isMounted) return;
        setUser(data);
      })
      .catch(async err => {
        if (!controller.signal.aborted) {
          await logout();
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
          setInitialized(true);
        }
      });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [token, logout]);

  // Auto-dismiss successMessage
  useEffect(() => {
    if (!successMessage) return;
    const timeout = setTimeout(() => setSuccessMessage(null), 4000);
    return () => clearTimeout(timeout);
  }, [successMessage]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        initialized,
        error,
        successMessage,
        login,
        logout,
        refreshAccessToken: singleFlightRefresh,
        fetchWithAuth,
        socket: ws.current,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
