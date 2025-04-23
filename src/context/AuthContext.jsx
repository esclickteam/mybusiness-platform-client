// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate }         from "react-router-dom";
import API                     from "../api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const navigate = useNavigate();

  // 1️⃣ טוען את המשתמש הנוכחי מ־/auth/me
  const refreshUserData = async () => {
    try {
      const res = await API.get("/auth/me");
      // אם השרת מחזיר { user: {...} } או ישר את השדות
      const u = res.data.user ?? res.data;
      console.log("🔍 /auth/me returned:", u);
      setUser(u);
      localStorage.setItem("user", JSON.stringify(u));
      setError(null);
      return u;
    } catch (e) {
      console.warn("⚠️ /auth/me failed:", e);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setError("יש להתחבר מחדש");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ביצוע ראשוני: אם יש token נטען נתונים, אחרת נהפוך ל־false לטעינה
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      refreshUserData();
    } else {
      setLoading(false);
    }
  }, []);

  // 2️⃣ ניווט אוטומטי כש־user נטען (ולא בזמן טעינה)
  useEffect(() => {
    if (!loading && user) {
      if (user.role === "business") {
        navigate("/dashboard/business", { replace: true });
      } else {
        navigate("/dashboard/client",   { replace: true });
      }
    }
  }, [user, loading, navigate]);

  // 3️⃣ פונקציית התחברות
  const login = async (identifier, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.post("/auth/login", {
        identifier: identifier.trim(),
        password,
      });
      localStorage.setItem("token", res.data.token);
      await refreshUserData();
    } catch (e) {
      setError(
        e.response?.status === 401
          ? "אימייל/שם משתמש או סיסמה שגויים"
          : "שגיאה בשרת, נסה שוב"
      );
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // 4️⃣ התנתקות
  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } catch {}
    finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      navigate("/login", { replace: true });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {loading
        ? <div className="loading-screen">🔄 טוען נתונים…</div>
        : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
