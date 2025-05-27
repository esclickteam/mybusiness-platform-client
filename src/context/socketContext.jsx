// src/context/socketContext.jsx
import React, { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return; // אפשר להוסיף טיפול טוב יותר אם אין טוקן

    const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
      auth: { token, role: "client" }, // שנה לפי תפקיד מתאים
      path: "/socket.io",
      transports: ["websocket"],
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // מחזיר את ה-socket גם אם עדיין לא מחובר (לא מחזיר null)
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}
