import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { io } from "socket.io-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const ws = useRef(null);
  const refreshingTokenPromise = useRef(null);

  // רענון טוקן עם queue כדי למנוע קריאות מקבילות
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

  // יצירת חיבור socket.IO עם הטוקן
  const createSocketConnection = (token, currentUser) => {
    if (ws.current) {
      ws.current.disconnect();
      ws.current = null;
    }
    if (!token) {
      console.warn("No token for Socket.IO");
      return;
    }
    ws.current = io("https://api.esclick.co.il", {
      path: "/socket.io",
      transports: ["websocket"],
      auth: {
        token,
        role: currentUser?.role,
        businessId: currentUser?.businessId || currentUser?.business?._id,
      },
    });

    ws.current.on("connect", () => {
      console.log("✅ Socket.IO connected", ws.current.id);
    });

    ws.current.on("disconnect", (reason) => {
      console.log("🔴 Socket.IO disconnected", reason);
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
          logout();
        }
      } catch {
        logout();
      }
    });

    ws.current.on("connect_error", async (err) => {
      console.error("Socket connect error:", err.message);
      if (err.message === "jwt expired") {
        try {
          const newToken = await refreshAccessToken();
          if (newToken) {
            createSocketConnection(newToken, user);
          } else {
            logout();
          }
        } catch {
          logout();
        }
      }
    });
  };

  // React Query - טעינת פרטי משתמש
  const {
    data: userData,
    isLoading,
    isError,
    refetch: refetchUser,
    isFetching,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token");

      API.defaults.headers['Authorization'] = `Bearer ${token}`;
      const res = await API.get("/auth/me", { withCredentials: true });
      return res.data;
    },
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!localStorage.getItem("token"),
    onSuccess: (data) => {
      setUser({
        userId: data.userId,
        name: data.name,
        email: data.email,
        role: data.role,
        subscriptionPlan: data.subscriptionPlan,
        businessId: data.businessId || null,
      });
      createSocketConnection(localStorage.getItem("token"), data);
    },
    onError: async (error) => {
      try {
        const newToken = await refreshAccessToken();
        if (newToken) {
          refetchUser();
        } else {
          logout();
        }
      } catch {
        logout();
      }
    },
  });

  const login = async (email, password, options = { skipRedirect: false }) => {
    setError(null);

    try {
      const response = await API.post(
        "/auth/login",
        { email: email.trim().toLowerCase(), password },
        { withCredentials: true }
      );
      const { accessToken } = response.data;

      if (!accessToken) throw new Error("No access token");

      localStorage.setItem("token", accessToken);
      API.defaults.headers['Authorization'] = `Bearer ${accessToken}`;

      // טען את פרטי המשתמש עם React Query מחדש
      await refetchUser();

      if (!options.skipRedirect && userData) {
        let path = "/";
        switch (userData.role) {
          case "business":
            path = `/business/${userData.businessId}/dashboard`;
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

      return userData;
    } catch (e) {
      if (e.response?.status === 401) {
        setError("❌ אימייל או סיסמה שגויים");
        navigate("/login");
      } else {
        setError("❌ שגיאה בשרת, נסה שוב");
      }
      throw e;
    }
  };

  const logout = async () => {
    try {
      await API.post("/auth/logout", {}, { withCredentials: true });
    } catch {
      // התעלם משגיאות ביציאה
    }
    setUser(null);
    localStorage.removeItem("token");
    delete API.defaults.headers['Authorization'];
    if (ws.current) {
      ws.current.disconnect();
      ws.current = null;
    }
    navigate("/", { replace: true });
  };

  useEffect(() => {
    return () => {
      if (ws.current) {
        ws.current.disconnect();
      }
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: isLoading || isFetching,
        error: isError,
        login,
        logout,
        refreshAccessToken,
        socket: ws.current,
        initialized: !isLoading && !!user,
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
