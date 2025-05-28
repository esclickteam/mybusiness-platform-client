// src/context/SocketContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

export const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user) return;  // מחכה ל־user

    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || window.location.origin;
    const token = localStorage.getItem("token");
    if (!token) return;

    const sock = io(SOCKET_URL, {
      path: "/socket.io",
      transports: ["websocket"],
      withCredentials: true,
      auth: {
        token,
        role: user.role || "client",
      },
    });

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

    return () => {
      sock.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
