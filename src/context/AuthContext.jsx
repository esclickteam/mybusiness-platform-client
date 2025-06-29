import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { io } from "socket.io-client";
import jwtDecode from "jwt-decode";

let ongoingRefresh = null;
let isRefreshing = false;

// עוטף את הרענון - אם כבר יש רענון פעיל, מחכה לו (single flight)
async function singleFlightRefresh() {
  if (!ongoingRefresh) {
    isRefreshing = true;
    ongoingRefresh = API.post("/auth/refresh-token", null, { withCredentials: true })
      .then(res => {
        const newToken = res.data.accessToken;
        if (!newToken) throw new Error("No new token");
        localStorage.setItem("token", newToken);
        API.defaults.headers['Authorization'] = `Bearer ${newToken}`;
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

  // לעדכון העסק
  const setBusinessToChatWith = (businessId) => {
    setUser(prevUser => {
      if (!prevUser) return prevUser;
      return { ...prevUser, businessToChatWith: businessId };
    });
  };

  // Interceptor לרענון טוקן אוטומטי
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
            API.defaults.headers['Authorization'] = `Bearer ${newToken}`;
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
      console.log("✅ Logout request succeeded");
    } catch (e) {
      console.warn("⚠️ Logout request failed:", e.response?.data || e.message);
    } finally {
      ongoingRefresh = null;
      isRefreshing = false;
      delete API.defaults.headers['Authorization'];
      if (ws.current) {
        ws.current.removeAllListeners();
        ws.current.disconnect();
        ws.current = null;
      }
      localStorage.removeItem("token");
      localStorage.removeItem("businessDetails");

      setUser(null);
      setLoading(false);
      navigate("/login", { replace: true });
    }
  };

  const login = async (email, password, options = { skipRedirect: false }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.post(
        "/auth/login",
        { email: email.trim().toLowerCase(), password },
        { withCredentials: true }
      );
      const { accessToken } = response.data;
      if (!accessToken) throw new Error("No access token received");
      localStorage.setItem("token", accessToken);
      API.defaults.headers['Authorization'] = `Bearer ${accessToken}`;

      const decoded = jwtDecode(accessToken);
      setUser({ ...decoded, businessId: decoded.businessId || null });
      createSocketConnection(accessToken, decoded);

      const { data } = await API.get("/auth/me", { withCredentials: true });
      if (data.businessId) {
        localStorage.setItem("businessDetails", JSON.stringify({ _id: data.businessId }));
      }
      setUser({ ...data, businessId: data.businessId || null });
      createSocketConnection(accessToken, data);

      if (!options.skipRedirect) {
        let path = "/";
        switch (data.role) {
          case "business": path = `/business/${data.businessId}/dashboard`; break;
          case "customer": path = "/client/dashboard"; break;
          case "worker": path = "/staff/dashboard"; break;
          case "manager": path = "/manager/dashboard"; break;
          case "admin": path = "/admin/dashboard"; break;
        }
        navigate(path, { replace: true });
      }

      setLoading(false);
      return data;
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

  const fetchWithAuth = async (requestFunc) => {
    try {
      return await requestFunc();
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
      auth: {
        token,
        role: userData?.role,
        businessId: userData?.businessId || (userData.business && userData.business._id),
      },
    });

    ws.current.on("connect", () => console.log("✅ Socket connected:", ws.current.id));
    ws.current.on("disconnect", reason => console.log("🔴 Socket disconnected:", reason));

    ws.current.on("tokenExpired", async () => {
      console.log("🚨 Socket token expired, refreshing...");
      try {
        const newToken = await singleFlightRefresh();
        if (newToken) {
          ws.current.auth.token = newToken;
          ws.current.removeAllListeners();
          ws.current.connect();
        } else {
          await logout();
        }
      } catch {
        await logout();
      }
    });

    ws.current.on("connect_error", async err => {
      console.error("Socket connect error:", err.message);
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

  // ✨ אתחול עם בדיקה אם הטוקן בתוקף ורענון אוטומטי במידת הצורך
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    (async () => {
      setLoading(true);
      let token = localStorage.getItem("token");
      if (token) {
        let decoded = null;
        try {
          decoded = jwtDecode(token);
        } catch (e) {
          await logout();
          return;
        }

        // אם פג תוקף – רענן!
        if (decoded.exp * 1000 < Date.now()) {
          try {
            token = await singleFlightRefresh();
            decoded = jwtDecode(token);
          } catch (err) {
            if (!controller.signal.aborted) {
              await logout();
            }
            return;
          }
        }

        if (isMounted) {
          setUser({
            userId: decoded.userId,
            name: decoded.name,
            email: decoded.email,
            role: decoded.role,
            subscriptionPlan: decoded.subscriptionPlan,
            businessId: decoded.businessId || null,
          });
          API.defaults.headers['Authorization'] = `Bearer ${token}`;
          createSocketConnection(token, decoded);
        }

        try {
          // בזמן רענון – לא לשלוח שום בקשה
          if (isRefreshing) {
            await ongoingRefresh;
            token = localStorage.getItem("token");
          }
          const { data } = await API.get("/auth/me", { withCredentials: true, signal: controller.signal });
          if (isMounted) {
            setUser({
              userId: data.userId,
              name: data.name,
              email: data.email,
              role: data.role,
              subscriptionPlan: data.subscriptionPlan,
              businessId: data.businessId || null,
            });
            createSocketConnection(token, data);
            if (data.businessId) {
              localStorage.setItem("businessDetails", JSON.stringify({ _id: data.businessId }));
            }
          }
        } catch (err) {
          if (!controller.signal.aborted) {
            await logout();
          }
        }
      } else {
        setUser(null);
      }
      if (isMounted) {
        setLoading(false);
        setInitialized(true);
      }
    })();

    return () => {
      isMounted = false;
      controller.abort();
      if (ws.current) {
        ws.current.removeAllListeners();
        ws.current.disconnect();
        ws.current = null;
      }
    };
  }, [navigate]);

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
