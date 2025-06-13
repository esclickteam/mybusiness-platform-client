import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { io } from "socket.io-client";
import jwtDecode from "jwt-decode";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const refreshingTokenPromise = useRef(null);
  const ws = useRef(null);

  // רענון טוקן עם queue
  const refreshAccessToken = async () => {
    if (refreshingTokenPromise.current) return refreshingTokenPromise.current;
    refreshingTokenPromise.current = API.post("/auth/refresh-token", null, { withCredentials: true })
      .then(response => {
        const newToken = response.data.accessToken;
        if (newToken) {
          localStorage.setItem("token", newToken);
          API.defaults.headers['Authorization'] = `Bearer ${newToken}`;
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
          logout();
        }
      } catch {
        logout();
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
            logout();
          }
        } catch {
          logout();
        }
      }
    });
  };

  const logout = async () => {
    setLoading(true);
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
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // פענוח JWT מידי להצגת UI מיידית
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

          // אימות טוקן וטעינת פרטים מעודכנים ברקע
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
              // טוקן לא תקף - התנתק
              if (isMounted) logout();
            });
        } catch (e) {
          // טוקן לא תקף - התנתק
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

  const login = async (email, password, options = { skipRedirect: false }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await API.post("/auth/login", { email: email.trim().toLowerCase(), password }, { withCredentials: true });
      const { accessToken } = response.data;

      if (!accessToken) throw new Error("No access token received");

      localStorage.setItem("token", accessToken);
      API.defaults.headers['Authorization'] = `Bearer ${accessToken}`;

      // פענוח מיידי להצגת UI
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

      // בקשת פרטים מעודכנים מהשרת (אפשר ברקע, אם רוצים)
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
        const newToken = await refreshAccessToken();
        if (!newToken) {
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
        socket: ws.current,
      }}
    >
      {successMessage && <div className="global-success-toast">{successMessage}</div>}
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
