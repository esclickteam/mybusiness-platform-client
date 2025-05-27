import React, { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { isTokenExpired } from "../utils/authHelpers";  // פונקציה לבדיקה
import { refreshToken } from "../utils/tokenHelpers";    // פונקציה לרענון טוקן

export const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    async function initSocket() {
      let token = localStorage.getItem("token");
      if (!token) return;

      // בדיקת תוקף טוקן
      if (isTokenExpired(token)) {
        try {
          token = await refreshToken();
          if (!token) {
            console.warn("Failed to refresh token");
            return;
          }
          localStorage.setItem("token", token);  // שמירת הטוקן החדש
        } catch (e) {
          console.error("Error refreshing token:", e);
          return;
        }
      }

      const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
        auth: { token, role: "client" }, // שנה לפי תפקיד מתאים
        path: "/socket.io",
        transports: ["websocket"],
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }

    initSocket();
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}
