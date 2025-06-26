import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { io } from "socket.io-client";
import jwtDecode from "jwt-decode";

export const AuthContext = createContext();

function SessionExpiredNotice({ onLoginClick }) {
  return (
    <div style={{
      position: "fixed",
      bottom: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      backgroundColor: "#ffdddd",
      padding: "16px 24px",
      border: "1px solid #ff5c5c",
      borderRadius: "8px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
      zIndex: 9999,
      fontSize: "16px",
      textAlign: "center",
      maxWidth: "300px",
    }}>
      <p>שמנו לב שלא היית כאן, אז ניתקנו אותך מטעמי אבטחה.</p>
      <p>לא נורא – אפשר להתחבר שוב בלחיצה 👇</p>
      <button
        style={{
          backgroundColor: "#ff5c5c",
          color: "#fff",
          border: "none",
          padding: "8px 16px",
          borderRadius: "4px",
          cursor: "pointer",
          fontWeight: "bold",
          marginTop: "8px",
        }}
        onClick={onLoginClick}
      >
        התחבר מחדש
      </button>
    </div>
  );
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const refreshingTokenPromise = useRef(null);
  const ws = useRef(null);
  const refreshTimeout = useRef(null);

  // פונקציה לניקוי טוקן אוטומטי
  const clearRefreshTimeout = () => {
    if (refreshTimeout.current) {
      clearTimeout(refreshTimeout.current);
      refreshTimeout.current = null;
    }
  };

  // רענון טוקן עם queue למניעת קריאות מרובות במקביל
  const refreshAccessToken = async () => {
    if (refreshingTokenPromise.current) return refreshingTokenPromise.current;

    refreshingTokenPromise.current = API.post("/auth/refresh-token", null, { withCredentials: true })
      .then(response => {
        const newToken = response.data.accessToken;
        if (newToken) {
          localStorage.setItem("token", newToken);
          API.defaults.headers['Authorization'] = `Bearer ${newToken}`;
          scheduleTokenRefresh(newToken);
        }
        refreshingTokenPromise.current = null;
        return newToken;
      })
      .catch(err => {
        refreshingTokenPromise.current = null;
        throw err;
      });

    return refreshingTokenPromise.current;
  };

  // תזמון רענון אוטומטי 2 דקות לפני שפג תוקף הטוקן
  const scheduleTokenRefresh = (token) => {
    clearRefreshTimeout();
    try {
      const decoded = jwtDecode(token);
      const expiresAt = decoded.exp * 1000; // exp ב-SECONDS, ממיר ל-millis
      const now = Date.now();
      const timeout = expiresAt - now - 2 * 60 * 1000; // 2 דקות לפני תום תוקף

      if (timeout > 0) {
        refreshTimeout.current = setTimeout(() => {
          refreshAccessToken().catch(() => {
            logout(true);
          });
        }, timeout);
      } else {
        // אם הטוקן כבר עומד לפוג או פג, מבצעים logout מיד
        logout(true);
      }
    } catch {
      // אם יש בעיה בפענוח הטוקן, מנותקים
      logout(true);
    }
  };

  const createSocketConnection = (token, userData) => {
    if (ws.current) {
      ws.current.disconnect();
      ws.current = null;
    }
    if (!token) {
      console.warn("No token available for Socket.IO connection");
      return;
    }

    ws.current = io("https://api.esclick.co.il", {
      path: "/socket.io",
      transports: ["websocket"],
      auth: {
        token,
        role: userData?.role,
        businessId: userData?.businessId || userData?.business?._id,
      },
    });

    ws.current.on("connect", () => {
      console.log("✅ Socket.IO connected, socket id:", ws.current.id);
    });

    ws.current.on("disconnect", (reason) => {
      console.log("🔴 Socket.IO disconnected, reason:", reason);
    });

    ws.current.on("tokenExpired", async () => {
      console.log("🚨 Socket token expired, refreshing...");
      try {
        const newToken = await refreshAccessToken();
        if (newToken) {
          console.log("🔄 Got new token, reconnecting socket");
          ws.current.auth.token = newToken;
          ws.current.disconnect();
          ws.current.connect();
        } else {
          logout(true);
        }
      } catch {
        logout(true);
      }
    });

    ws.current.on("connect_error", async (err) => {
      console.error("Socket.IO connect error:", err.message);
      if (err.message === "jwt expired") {
        try {
          const newToken = await refreshAccessToken();
          if (newToken) {
            createSocketConnection(newToken, userData);
          } else {
            logout(true);
          }
        } catch {
          logout(true);
        }
      }
    });
  };

  // logout עם פרמטר שמציין האם זו ניתוק עקב פקיעת טוקן/אבטחה
  const logout = async (expired = false) => {
    setLoading(true);
    clearRefreshTimeout();
    try {
      await API.post("/auth/logout", {}, { withCredentials: true });
    } catch (e) {
      console.warn("Logout failed:", e.response?.data || e.message || e);
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
    if (expired) {
      setSessionExpired(true);
    } else {
      navigate("/login", { replace: true });
    }
  };

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
            scheduleTokenRefresh(token);
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
              if (isMounted) logout(true);
            });
        } catch (e) {
          if (isMounted) logout(true);
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
      clearRefreshTimeout();
      if (ws.current) {
        ws.current.disconnect();
        ws.current = null;
      }
    };
  }, [navigate]);

  const apiRequest = async (url, options = {}) => {
    try {
      return await API(url, options);
    } catch (error) {
      if (error.response?.status === 401) {
        try {
          const newToken = await refreshAccessToken();
          if (newToken) {
            options.headers = {
              ...options.headers,
              Authorization: `Bearer ${newToken}`,
            };
            return await API(url, options);
          } else {
            await logout(true);
            throw new Error("Session expired");
          }
        } catch {
          await logout(true);
          throw new Error("Session expired");
        }
      }
      throw error;
    }
  };

  const login = async (email, password, options = { skipRedirect: false }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await API.post("/auth/login", { email: email.trim().toLowerCase(), password }, { withCredentials: true });
      const { accessToken } = response.data;

      if (!accessToken) throw new Error("No access token received");

      localStorage.setItem("token", accessToken);
      API.defaults.headers['Authorization'] = `Bearer ${accessToken}`;
      scheduleTokenRefresh(accessToken);

      const decoded = jwtDecode(accessToken);
      setUser({
        userId: decoded.userId,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
        subscriptionPlan: decoded.subscriptionPlan,
        businessId: decoded.businessId || null,
      });

      createSocketConnection(accessToken, decoded);

      const { data } = await API.get("/auth/me", { withCredentials: true });
      if (data.businessId) {
        localStorage.setItem("businessDetails", JSON.stringify({ _id: data.businessId }));
      }
      setUser({
        userId: data.userId,
        name: data.name,
        email: data.email,
        role: data.role,
        subscriptionPlan: data.subscriptionPlan,
        businessId: data.businessId || null,
      });
      createSocketConnection(accessToken, data);

      if (!options.skipRedirect && data) {
        let path = "/";
        switch (data.role) {
          case "business":
            path = `/business/${data.businessId}/dashboard`;
            break;
          case "customer":
            path = "/client/dashboard";
            break;
          case "worker":
            path = "/staff/dashboard";
            break;
          case "manager":
            path = "/manager/dashboard";
            break;
          case "admin":
            path = "/admin/dashboard";
            break;
        }
        navigate(path, { replace: true });
      }

      setLoading(false);
      return data;

    } catch (e) {
      if (e.response?.status === 401) {
        try {
          const newToken = await refreshAccessToken();
          if (!newToken) {
            await logout(true);
            setError("❌ אימייל או סיסמה שגויים");
            navigate("/login");
          }
        } catch {
          await logout(true);
          setError("❌ אימייל או סיסמה שגויים");
          navigate("/login");
        }
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
    <AuthContext.Provider
      value={{
        user,
        loading,
        initialized,
        error,
        login,
        logout,
        refreshAccessToken,
        apiRequest,
        socket: ws.current,
        setUser,
      }}
    >
      {successMessage && <div className="global-success-toast">{successMessage}</div>}
      {sessionExpired && (
        <SessionExpiredNotice onLoginClick={() => {
          setSessionExpired(false);
          navigate("/login", { replace: true });
        }} />
      )}
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
