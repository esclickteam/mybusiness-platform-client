// src/context/socketContext.jsx – thin wrapper that reuses AuthContext socket

import { useAuth } from "./AuthContext";

/**
 * useSocket – hook תואם לאחור שמחזיר את מופע הסוקט מה־AuthContext.
 * נועד למנוע שימוש ישיר ב־useAuth בכל מקום, ולשמור על API קיים.
 */
export function useSocket() {
  const { socket } = useAuth();
  return socket;
}
