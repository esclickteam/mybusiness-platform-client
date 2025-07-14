// src/context/socketContext.jsx – thin wrapper that reuses AuthContext socket
import React, { createContext, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";

/**
 * SocketContext אינו יוצר חיבור משלו.
 * הוא רק חושף את ה‑socket שמנוהל ב‑AuthContext כדי לשמור על API קיים (useSocket).
 * כך אנו נמנעים מחיבורים כפולים, ועדיין לא צריכים לשנות את כל הקוד הקיים.
 */
export const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { socket, user } = useAuth(); // מקבל singleton קיים ופרטי משתמש

  useEffect(() => {
    if (!socket || !user?.businessId) return;

    // פונקציה להצטרפות לחדר העסק
    const joinBusinessRoom = () => {
      socket.emit(
        "joinConversation",
        "business-business",
        user.businessId,
        true,
        (ack) => {
          if (!ack.ok) {
            console.error("Failed to join business room:", ack.error);
          }
        }
      );
    };

    // הצטרפות מיידית אם כבר מחובר
    if (socket.connected) {
      joinBusinessRoom();
    }

    // מאזין לאירועי התחברות מחדש (reconnect)
    socket.on("connect", joinBusinessRoom);

    return () => {
      socket.off("connect", joinBusinessRoom);
      socket.emit("leaveConversation", "business-business", user.businessId, true);
    };
  }, [socket, user?.businessId]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

/**
 * useSocket – hook תואם לאחור שמחזיר את מופע הסוקט היחיד.
 * תחת Hood פשוט מפנה ל‑AuthContext.
 */
export function useSocket() {
  const ctxSocket = useContext(SocketContext);
  if (ctxSocket) return ctxSocket;
  const { socket } = useAuth();
  return socket;
}
