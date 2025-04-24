// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // טוען פרטי משתמש מ־/auth/me
  const refreshUserData = async () => {
    try {
      const res = await API.get("/auth/me");
      console.log("🔍 /auth/me returned:", res.data);

      const data = res.data;
      const u = {
        userId: data.userId,
        name: data.name || "",
        email: data.email,
        subscriptionPlan: data.subscriptionPlan,
        role: data.role,  // חשוב לוודא שה־role נכון
        isTempPassword: data.isTempPassword,
        businessId: data.businessId,
      };

      // שמירה ב־localStorage
      localStorage.setItem("user", JSON.stringify(u));
      setUser(u);
      setError(null);
      return u;
    } catch (e) {
      // אם אין session תקין, מנקים הכל
      console.error("Error in refreshUserData:", e);
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
    const token = localStorage.getItem("token");
    if (token) {
      refreshUserData();  // טוען את נתוני המשתמש אם יש טוקן
    } else {
      setLoading(false);  // אם אין טוקן, סיים את הטעינה
    }
  }, []);

  // פונקציית התחברות
  const login = async (identifier, password) => {
    setLoading(true);
    setError(null);

    // 🧹 נקה קודם את ה-token הישן (cookie ו-localStorage)
    document.cookie = "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    localStorage.removeItem("token");

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

      // הדפסת ה־role לאחר התחברות לצורך Debug
      console.log("User role after login:", u.role);

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
      await API.post("/auth/logout");  // שולח בקשה ל־logout בצד השרת
    } catch (err) {
      console.warn("Logout failed:", err);  // אם יש שגיאה בביצוע logout, מדפיסים אזהרה
    } finally {
      // מנקים את ה־token ו־user מ־localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // מאפסים את המשתמש בקונטקסט
      setUser(null);

      // הפניית המשתמש לדף התחברות לאחר יציאה
      window.location.href = "/login";
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
