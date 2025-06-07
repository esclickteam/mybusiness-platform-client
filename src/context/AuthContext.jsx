import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api"; // axios instance עם withCredentials:true כברירת מחדל
import { io } from "socket.io-client";

export const AuthContext = createContext();

function isTokenExpired(token) {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp;
    if (!exp) return true;
    const now = Math.floor(Date.now() / 1000);
    return exp < now + 30; // 30 שניות מרווח ביטחון
  } catch {
    return true;
  }
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const initRan = useRef(false);

  const ws = useRef(null);
  const refreshingTokenPromise = useRef(null);

  // רענון טוקן עם queue למניעת קריאות מקבילות
  const refreshAccessToken = async () => {
    if (refreshingTokenPromise.current) return refreshingTokenPromise.current;

    refreshingTokenPromise.current = API.post("/auth/refresh-token", null, { withCredentials: true })
      .then(response => {
        const newToken = response.data.accessToken;
        if (newToken) {
          localStorage.setItem("token", newToken);
          API.defaults.headers['Authorization'] = `Bearer ${newToken}`;

          if (ws.current) {
            ws.current.auth.token = newToken;
            ws.current.disconnect();
            ws.current.connect();
          }
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

  // interceptor של axios לטיפול אוטומטי ברפרש טוקן לפני כל בקשה
  useEffect(() => {
    const interceptor = API.interceptors.request.use(async (config) => {
      let token = localStorage.getItem("token");

      if (isTokenExpired(token)) {
        try {
          token = await refreshAccessToken();
        } catch (err) {
          // אם לא מצליח לרענן - logout
          setUser(null);
          localStorage.removeItem("token");
          navigate("/login");
          throw err;
        }
      }

      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }

      return config;
    }, (error) => {
      return Promise.reject(error);
    });

    return () => {
      API.interceptors.request.eject(interceptor);
    };
  }, []);

  const createSocketConnection = (token, user) => {
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
        role: user?.role,
        businessId: user?.businessId || user?.business?._id,
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
          setUser(null);
          localStorage.removeItem("token");
          navigate("/login");
        }
      } catch {
        setUser(null);
        localStorage.removeItem("token");
        navigate("/login");
      }
    });

    ws.current.on("connect_error", async (err) => {
      console.error("Socket.IO connect error:", err.message);
      if (err.message === "jwt expired") {
        try {
          const newToken = await refreshAccessToken();
          if (newToken) {
            createSocketConnection(newToken, user);
          } else {
            setUser(null);
            localStorage.removeItem("token");
            navigate("/login");
          }
        } catch {
          setUser(null);
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    });
  };

  useEffect(() => {
    if (initRan.current) return;
    initRan.current = true;

    const initialize = async () => {
      setLoading(true);
      let token = localStorage.getItem("token");

      if (token) {
        API.defaults.headers['Authorization'] = `Bearer ${token}`;

        try {
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
          createSocketConnection(token, data);
        } catch {
          const newToken = await refreshAccessToken();
          if (newToken) {
            try {
              const { data } = await API.get("/auth/me", { withCredentials: true });
              setUser({
                userId: data.userId,
                name: data.name,
                email: data.email,
                role: data.role,
                subscriptionPlan: data.subscriptionPlan,
                businessId: data.businessId || null,
              });
              token = newToken;
              createSocketConnection(token, data);
            } catch {
              setUser(null);
              localStorage.removeItem("token");
              token = null;
            }
          } else {
            setUser(null);
            localStorage.removeItem("token");
            token = null;
          }
        }
      } else {
        setUser(null);
        token = null;
      }

      setLoading(false);
      setInitialized(true);
    };

    initialize();

    return () => {
      if (ws.current) {
        ws.current.disconnect();
      }
    };
  }, []);

  const login = async (email, password, options = { skipRedirect: false }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await API.post("/auth/login", { email: email.trim().toLowerCase(), password }, { withCredentials: true });
      const { accessToken } = response.data;

      if (!accessToken) throw new Error("No access token received");

      localStorage.setItem("token", accessToken);
      API.defaults.headers['Authorization'] = `Bearer ${accessToken}`;

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
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await API.post("/auth/logout", {}, { withCredentials: true });
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("businessDetails");
      delete API.defaults.headers['Authorization'];

      if (ws.current) {
        ws.current.disconnect();
        ws.current = null;
      }

      setSuccessMessage("✅ נותקת בהצלחה");
      navigate("/", { replace: true });
    } catch (e) {
      console.warn("Logout failed:", e.response?.data || e.message || e);
    } finally {
      setLoading(false);
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
