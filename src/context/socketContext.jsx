import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext"; // נניח שיש לך קונטקסט לאימות

export const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user, refreshAccessToken, logout } = useAuth();
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    const setupSocket = async () => {
      const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://api.esclick.co.il";
      console.log('SOCKET_URL:', SOCKET_URL);

      const token = await refreshAccessToken();
      if (!token) {
        logout();
        return;
      }

      let businessId = null;
      if (user.role === "business") {
        const businessDetailsStr = localStorage.getItem("businessDetails");
        if (businessDetailsStr) {
          try {
            const details = JSON.parse(businessDetailsStr);
            businessId = details.id || details._id || null;
          } catch (err) {
            console.error("שגיאה בפענוח businessDetails", err);
          }
        }
        if (!businessId) {
          logout();
          return;
        }
      }

      // תמיד מנתקים סוקט קודם, אם יש
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }

      const auth = {
        token,
        role: user.role || "client",
        ...(businessId ? { businessId } : {}),
      };

      const sock = io(SOCKET_URL, {
        path: "/socket.io",
        transports: ["websocket"],
        withCredentials: true,
        auth,
      });

      sock.on("connect", () => {
        console.log("🔌 Socket connected:", sock.id);
      });

      sock.on("disconnect", (reason) => {
        console.log("🔌 Socket disconnected:", reason);
      });

      sock.on("tokenExpired", async () => {
        console.log("🚨 Socket token expired, refreshing...");
        const newToken = await refreshAccessToken();
        if (!newToken) {
          logout();
          return;
        }
        sock.auth.token = newToken;
        sock.disconnect();
        sock.connect();
      });

      sock.on("connect_error", (err) => {
        console.error("❌ Socket connect error:", err.message);
      });

      socketRef.current = sock;
      setSocket(sock);
    };

    setupSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        console.log("🔌 Socket disconnected and cleaned up.");
      }
    };
  }, [user, refreshAccessToken, logout]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
