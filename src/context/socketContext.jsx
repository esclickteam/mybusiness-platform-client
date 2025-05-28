// src/context/SocketContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

export const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user } = useAuth();  // קח את פרטי המשתמש מקונטקסט
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user) return;  // מחכה ל־user

    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://api.esclick.co.il";
    const token = localStorage.getItem("token");
    const businessId = localStorage.getItem("businessId"); // קח את ה-businessId מ-localStorage
    
    if (!token || !businessId) return; // ודא ש-businessId ו-token קיימים

    const sock = io(SOCKET_URL, {
      path: "/socket.io",
      transports: ["websocket"],
      withCredentials: true,
      auth: {
        token,          // שלח את ה־accessToken עם החיבור
        role: user.role || "client",  // שלח את ה-role של המשתמש
        businessId,     // שלח את ה-businessId כחלק מהאימות
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
      sock.disconnect();  // נתק את החיבור כשלא צריך יותר
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
