import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

export const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user) return;

    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://api.esclick.co.il";
    const token = localStorage.getItem("token");

    // נשלוף businessId רק אם התפקיד הוא בעל עסק
    let businessId = null;
    if (user.role === "business") {
      const businessDetailsStr = localStorage.getItem("businessDetails");
      if (businessDetailsStr) {
        const details = JSON.parse(businessDetailsStr);
        businessId = details.id || details._id || null;
      }
    }

    // חיבור רק אם יש token, ולבעל עסק - גם businessId
    if (!token) return;
    if (user.role === "business" && !businessId) return;

    // auth: אם יש businessId נשלח אותו, אחרת לא
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
