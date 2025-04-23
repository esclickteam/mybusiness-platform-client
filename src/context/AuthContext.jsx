// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // טוען פרטי משתמש מ־/users/me
  const refreshUserData = async () => {
    try {
      const res = await API.get("/users/me");
      const data = res.data;
      const u = {
        userId: data.userId,
        name: data.name || "",
        email: data.email,
        subscriptionPlan: data.subscriptionPlan,
        role: data.role,
        isTempPassword: data.isTempPassword,
        businessId: data.businessId,
      };
      localStorage.setItem("user", JSON.stringify(u));
      setUser(u);
      setError(null);
      return u;
    } catch (e) {
      // אם אין session תקין, מנקים הכל
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setError("⚠️ יש להתחבר מחדש");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // בדיקה ראשונית אם כבר מחובר
  useEffect(() => {
    refreshUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // פונקציית התחברות
  const login = async (identifier, password) => {
    setLoading(true);
    setError(null);
    try {
      const body = identifier.includes("@")
        ? { email: identifier.trim(), password }
        : { username: identifier.trim(), password };

      // 1️⃣ התחברות ושמירת הטוקן
      const res = await API.post("/auth/login", body);
      localStorage.setItem("token", res.data.token);

      // 2️⃣ טעינת פרטי המשתמש
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

  // פונקציית התנתקות
  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } catch {
      // ממשיכים לנקות גם אם ה־logout לוקה בכשל
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {loading ? <div className="loading-screen">🔄 טוען נתונים…</div> : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
