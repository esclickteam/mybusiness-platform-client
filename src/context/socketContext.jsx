// src/context/SocketContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

export const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { accessToken, refreshToken, user } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    let sock;

    async function initSocket() {
      let token = accessToken;
      if (!token) return;

      // בדיקת תוקף ורענון אם צריך
      try {
        token = await refreshToken(); // אם הטוקן פג, ירענן ויחזיר חדש
      } catch {
        console.warn("לא הצלחנו לרענן את הטוקן – לא מתחברים לסוקט");
        return;
      }

      // URL בלי /api
      const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || window.location.origin;

      sock = io(SOCKET_URL, {
        path: "/socket.io",
        transports: ["websocket"],
        auth: {
          token,
          role: user?.role || "client",
        },
      });

      // אופציונלי: listeners
      sock.on("connect", () => {
        console.log("🔌 Socket connected:", sock.id);
      });
      sock.on("disconnect", (reason) => {
        console.log("🔌 Socket disconnected:", reason);
      });
      sock.on("connect_error", (err) => {
        console.error("❌ Socket connect error:", err.message);
      });

      setSocket(sock);
    }

    initSocket();

    return () => {
      if (sock) sock.disconnect();
    };
  }, [accessToken, refreshToken, user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
