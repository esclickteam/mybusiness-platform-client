import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { io } from "socket.io-client";
import jwtDecode from "jwt-decode";

export const AuthContext = createContext(null);

// Singleton promise למניעת קריאות רענון מקביליות
let ongoingRefresh = null;

// פונקציה לרענון access token עם single-flight
async function singleFlightRefresh() {
  if (!ongoingRefresh) {
    ongoingRefresh = API.post("/auth/refresh-token", null, { withCredentials: true })
      .then(res => {
        const newToken = res.data.accessToken;
        if (!newToken) throw new Error("No new token");
        localStorage.setItem("token", newToken);
        API.defaults.headers['Authorization'] = `Bearer ${newToken}`;
        return newToken;
      })
      .catch(err => {
        ongoingRefresh = null;  // מאפשר ניסוי חדש
        throw err;
      })
      .finally(() => {
        ongoingRefresh = null;  // איפוס בסוף
      });
  }
  return ongoingRefresh;
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const ws = useRef(null);

  // logout מרכזי
  const logout = async () => {
    console.log("🚪 Logging out user...");
    setLoading(true);
    try {
      await API.post("/auth/logout", {}, { withCredentials: true });
      console.log("✅ Logout request succeeded");
    } catch (e) {
      console.warn("⚠️ Logout request failed:", e.response?.data || e.message || e);
    }
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("businessDetails");
    delete API.defaults.headers['Authorization'];
    if (ws.current) {
      ws.current.disconnect();
      ws.current = null;
    }
    setLoading(false);
    navigate("/login", { replace: true });
    console.log("🏁 User redirected to /login");
  };

  // רענון טוקן עם טיפול ב-403 → logout
  const refreshAccessToken = async () => {
    try {
      const newToken = await singleFlightRefresh();
      console.log("✅ Refresh succeeded, new token received");
      return newToken;
    } catch (err) {
      if (err.response?.status === 403) {
        console.warn("⚠️ Refresh token invalid/expired (403), logging out...");
        await logout();
      }
      throw err;
    }
  };

  // עטיפה לבקשות עם אימות ורענון אוטומטי
  const fetchWithAuth = async (requestFunc) => {
    try {
      return await requestFunc();
    } catch (err) {
      const status = err.response?.status;
      if (status === 401 || status === 403) {
        try {
          await refreshAccessToken();
          return await requestFunc();
        } catch {
          await logout();
          setError("❌ יש להתחבר מחדש");
          navigate("/login", { replace: true });
          throw new Error("Session expired");
        }
      }
      throw err;
    }
  };

  // יצירת חיבור Socket.IO עם טיפול ברענון טוקן
  const createSocketConnection = (token, userData) => {
    if (ws.current) {
      ws.current.disconnect();
      ws.current = null;
    }
    if (!token) {
      console.warn("No token for socket connection");
      return;
    }

    ws.current = io("https://api.esclick.co.il", {
      path: "/socket.io",
      transports: ["websocket"],
      auth: {
        token,
        role: userData?.role,
        businessId: userData?.businessId || (userData.business && userData.business._id),
      },
    });

    ws.current.on("connect", () => {
      console.log("✅ Socket connected:", ws.current.id);
    });
    ws.current.on("disconnect", reason => {
      console.log("🔴 Socket disconnected:", reason);
    });

    ws.current.on("tokenExpired", async () => {
      console.log("🚨 Socket token expired, refreshing...");
      try {
        const newToken = await refreshAccessToken();
        if (newToken) {
          ws.current.auth.token = newToken;
          ws.current.disconnect();
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
          const newToken = await refreshAccessToken();
          if (newToken) createSocketConnection(newToken, userData);
          else await logout();
        } catch {
          await logout();
        }
      }
    });
  };

  // אתחול מצב בעת mount
  useEffect(() => {
    let isMounted = true;
    const initialize = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
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

          API.get("/auth/me", { withCredentials: true })
            .then(({ data }) => {
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
              }
            })
            .catch(() => {
              if (isMounted) logout();
            });
        } catch {
          if (isMounted) logout();
        }
      } else {
        setUser(null);
      }
      if (isMounted) {
        setLoading(false);
        setInitialized(true);
      }
    };

    initialize();
    return () => {
      isMounted = false;
      if (ws.current) {
        ws.current.disconnect();
        ws.current = null;
      }
    };
  }, [navigate]);

  // פונקציית login
  const login = async (email, password, options = { skipRedirect: false }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.post("/auth/login", { email: email.trim().toLowerCase(), password }, { withCredentials: true });
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

      if (!options.skipRedirect && data) {
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

  useEffect(() => {
    if (successMessage) {
      const t = setTimeout(() => setSuccessMessage(null), 4000);
      return () => clearTimeout(t);
    }
  }, [successMessage]);

  return (
    <AuthContext.Provider value={{ user, loading, initialized, error, login, logout, refreshAccessToken, fetchWithAuth, socket: ws.current, setUser }}>
      {successMessage && <div className="global-success-toast">{successMessage}</div>}
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
