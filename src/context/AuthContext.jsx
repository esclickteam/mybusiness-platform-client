import React, { createContext, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { io } from "socket.io-client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const ws = useRef(null);
  const refreshingTokenPromise = useRef(null);

  const refreshAccessToken = async () => {
    if (refreshingTokenPromise.current) {
      return refreshingTokenPromise.current;
    }
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

  const createSocketConnection = (token, user) => {
    if (ws.current) {
      ws.current.disconnect();
      ws.current = null;
    }
    if (!token) return;

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
      try {
        const newToken = await refreshAccessToken();
        if (newToken) {
          ws.current.auth.token = newToken;
          ws.current.disconnect();
          ws.current.connect();
        } else {
          queryClient.setQueryData('authUser', null);
          localStorage.removeItem("token");
          navigate("/login");
        }
      } catch {
        queryClient.setQueryData('authUser', null);
        localStorage.removeItem("token");
        navigate("/login");
      }
    });

    ws.current.on("connect_error", async (err) => {
      if (err.message === "jwt expired") {
        try {
          const newToken = await refreshAccessToken();
          if (newToken) {
            createSocketConnection(newToken, user);
          } else {
            queryClient.setQueryData('authUser', null);
            localStorage.removeItem("token");
            navigate("/login");
          }
        } catch {
          queryClient.setQueryData('authUser', null);
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    });
  };

  // useQuery לטעינת פרטי המשתמש (עדכון סינטקס)
  const { data: user, error, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token");
      API.defaults.headers['Authorization'] = `Bearer ${token}`;
      const { data } = await API.get("/auth/me", { withCredentials: true });
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 דקות
    retry: false,
    onSuccess: (data) => {
      if (data.businessId) {
        localStorage.setItem("businessDetails", JSON.stringify({ _id: data.businessId }));
      }
      createSocketConnection(localStorage.getItem("token"), data);
    },
    onError: async () => {
      try {
        const newToken = await refreshAccessToken();
        if (newToken) {
          await refetch();
        } else {
          queryClient.setQueryData('authUser', null);
          localStorage.removeItem("token");
          navigate("/login");
        }
      } catch {
        queryClient.setQueryData('authUser', null);
        localStorage.removeItem("token");
        navigate("/login");
      }
    },
    enabled: !!localStorage.getItem("token"),
  });

  // useMutation להתחברות (עדכון סינטקס)
  const loginMutation = useMutation({
    mutationFn: async ({ email, password }) => {
      const response = await API.post("/auth/login", { email: email.trim().toLowerCase(), password }, { withCredentials: true });
      if (!response.data.accessToken) throw new Error("No access token");
      localStorage.setItem("token", response.data.accessToken);
      API.defaults.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
      return response.data.accessToken;
    },
    onSuccess: async () => {
      await refetch();
      if (user) {
        let path = "/";
        switch (user.role) {
          case "business":
            path = `/business/${user.businessId}/dashboard`;
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
    },
  });

  // useMutation להתנתקות (עדכון סינטקס)
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await API.post("/auth/logout", {}, { withCredentials: true });
    },
    onSuccess: () => {
      queryClient.setQueryData('authUser', null);
      localStorage.removeItem("token");
      localStorage.removeItem("businessDetails");
      delete API.defaults.headers['Authorization'];
      if (ws.current) {
        ws.current.disconnect();
        ws.current = null;
      }
      navigate("/", { replace: true });
    }
  });

  useEffect(() => {
    return () => {
      if (ws.current) {
        ws.current.disconnect();
        ws.current = null;
      }
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: isLoading || isFetching,
        error,
        login: loginMutation.mutateAsync,
        logout: logoutMutation.mutateAsync,
        refreshAccessToken,
        socket: ws.current,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
