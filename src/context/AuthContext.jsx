import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // טען בהתחלה את פרטי המשתמש אם קיים cookie תקף
  useEffect(() => {
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

  // login: שולח credentials, ה-cookie נטען אוטומטית על ידי השרת
  const login = async (identifier, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.post("/auth/login", {
        identifier: identifier.trim(),
        password,
      });
      setUser(res.data.user);
      navigate(
        res.data.user.role === "business"
          ? `/business/${res.data.user.businessId}/dashboard`
          : res.data.user.role === "customer"
          ? "/client/dashboard"
          : res.data.user.role === "worker"
          ? "/staff/dashboard"
          : res.data.user.role === "manager"
          ? "/manager/dashboard"
          : res.data.user.role === "admin"
          ? "/admin/dashboard"
          : "/",
        { replace: true }
      );
      return res.data.user;
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

  // logout: מבקש מהשרת לנקות את ה-cookie
  const logout = async () => {
    setLoading(true);
    try {
      await API.post("/auth/logout");
    } catch (e) {
      console.warn("Logout failed:", e);
    } finally {
      setUser(null);
      setLoading(false);
      navigate("/login", { replace: true });
    }
  };

  // ה-render מחכה לטעינה לפני הצגת children
  if (loading) {
    return <div className="loading-screen">🔄 טוען נתונים...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
