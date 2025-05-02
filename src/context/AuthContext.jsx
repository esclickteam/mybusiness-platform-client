import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const initRan = useRef(false);

  // טען בהתחלה את פרטי המשתמש אם קיים cookie תקף (מונע רינדור כפול ב-StrictMode)
  useEffect(() => {
    if (initRan.current) return;
    initRan.current = true;

    const initialize = async () => {
      try {
        const res = await API.get("/auth/me");
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initialize();
  }, []);

  // login: שולח credentials, ה-cookie מטופל אוטומטית ע"י השרת
  const login = async (identifier, password) => {
    setLoading(true);
    setError(null);
    try {
      await API.post("/auth/login", { identifier: identifier.trim(), password });
      const me = await API.get("/auth/me");
      setUser(me.data);
      // ניווט לפי תפקיד
      const path =
        me.data.role === "business"
          ? `/business/${me.data.businessId}/dashboard`
          : me.data.role === "customer"
          ? "/client/dashboard"
          : me.data.role === "worker"
          ? "/staff/dashboard"
          : me.data.role === "manager"
          ? "/manager/dashboard"
          : me.data.role === "admin"
          ? "/admin/dashboard"
          : "/";
      navigate(path, { replace: true });
      return me.data;
    } catch (e) {
      setError(
        e.response?.status === 401
          ? "❌ אימייל/שם משתמש או סיסמה שגויים"
          : "❌ שגיאה בשרת, נסה שוב"
      );
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // logout: מבקש לנקות את cookie ואז מפנה ל-Home
  const logout = async () => {
    setLoading(true);
    try {
      await API.post("/auth/logout");
    } catch (e) {
      console.warn("Logout failed:", e);
    } finally {
      setUser(null);
      setLoading(false);
      navigate("/", { replace: true });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
