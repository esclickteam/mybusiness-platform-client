// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const navigate = useNavigate();

  // טוען פרטי משתמש מ־/auth/me
  const refreshUserData = async () => {
    try {
      const res = await API.get("/auth/me");
      console.log("🔍 /auth/me returned:", res.data);
      // במידה והשרת לא עוטף ב־{ user: … }
      const data = res.data.user ?? res.data;
      console.log("🚩 parsed user role:", data.role);

      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      setError(null);
      return data;
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

  // בקריאה ראשונית: אם יש token נטען session
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      refreshUserData();
    } else {
      setLoading(false);
    }
  }, []);

  // ברגע שה־user נטען (loading עבר ל־false ו־user אינו null), ננווט ל־dashboard
  useEffect(() => {
    if (!loading && user) {
      console.log("🚀 navigating as:", user.role);
      if (user.role === "business") {
        navigate("/dashboard/business", { replace: true });
      } else {
        navigate("/dashboard/client",   { replace: true });
      }
    }
  }, [user, loading, navigate]);

  // התחברות
  const login = async (identifier, password) => {
    setLoading(true);
    setError(null);

    // נקה טוקן קודם
    document.cookie = "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    localStorage.removeItem("token");

    try {
      const body = identifier.includes("@")
        ? { email: identifier.trim(),    password }
        : { username: identifier.trim(), password };

      const res = await API.post("/auth/login", body);
      localStorage.setItem("token", res.data.token);

      const u = await refreshUserData();
      if (!u) throw new Error("User load failed");
      return u;
    } catch (e) {
      setError(
        e.response?.status === 401
          ? "❌ שם משתמש או סיסמה שגויים"
          : "❌ שגיאה בשרת, נסו שוב"
      );
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // התנתקות
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
