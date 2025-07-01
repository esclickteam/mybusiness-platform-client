// src/context/socketContext.jsx – thin wrapper that reuses AuthContext socket
import React, { createContext, useContext } from "react";
import { useAuth } from "./AuthContext";

/**
 * SocketContext אינו יוצר חיבור משלו.
 * הוא רק חושף את ה‑socket שמנוהל ב‑AuthContext כדי לשמור על API קיים (useSocket).
 * כך אנו נמנעים מחיבורים כפולים, ועדיין לא צריכים לשנות את כל הקוד הקיים.
 */
export const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { socket } = useAuth(); // מקבל singleton קיים
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
  // fallback ישירות מה‑AuthContext אם Provider לא עטף
  if (ctxSocket) return ctxSocket;
  const { socket } = useAuth();
  return socket;
}
