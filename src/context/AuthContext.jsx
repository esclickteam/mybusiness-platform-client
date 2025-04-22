// src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  // ✅ מצב פיתוח: משתמש מזויף
  if (import.meta.env.DEV) {
    const devUser = {
      userId: "dev123",
      name: "משתמש מבחן",
      email: "dev@example.com",
      subscriptionPlan: "premium",
      role: "business",
      businessId: "dev-id",
    };

    const devLogin = async (identifier, password) => {
      console.log("🔑 dev login:", identifier, password);
      return devUser;
    };
    const devLogout = async () => {
      console.log("🔒 dev logout");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    };
    const devRefresh = async () => devUser;

    return (
      <AuthContext.Provider
        value={{
          user: devUser,
          loading: false,
          error: null,
          login: devLogin,
          logout: devLogout,
          refreshUserData: devRefresh,
          setUser: () => {},
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }

  // ✅ מצב אמיתי
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // טוען נתוני משתמש מהשרת
  const refreshUserData = async () => {
    try {
      console.log("📡 fetching /api/users/me");
      const res = await API.get("/users/me");
      const data = res.data;
      const u = {
        userId: data.userId,
        name: data.name || data.username || "",
        email: data.email,
        subscriptionPlan: data.subscriptionPlan,
        role: data.role,
        isTempPassword: data.isTempPassword || false,
        businessId: data.businessId || null,
      };
      console.log("✅ loaded user:", u);
      localStorage.setItem("user", JSON.stringify(u));
      setUser(u);
      setError(null);
      return u;
    } catch (e) {
      console.error("❌ refreshUserData failed:", e.response?.data || e.message);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setError("⚠️ יש להתחבר מחדש");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // טען משתמש בהתקנת הקומפוננטה
  useEffect(() => {
    refreshUserData();
  }, []);

  // login(identifier, password)
  const login = async (identifier, password) => {
    setLoading(true);
    setError(null);
    try {
      console.log("📡 POST /api/auth/login", identifier);
      // בודק אם זה אימייל או username
      const body = identifier.includes("@")
        ? { email: identifier.trim(), password }
        : { username: identifier.trim(), password };

      await API.post("/auth/login", body);
      const u = await refreshUserData();
      if (!u) throw new Error("User load failed");
      return u;
    } catch (e) {
      console.error("❌ login error:", e.response?.data || e.message);
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

  const logout = async () => {
    try {
      console.log("📡 POST /api/auth/logout");
      await API.post("/auth/logout");
    } catch (e) {
      console.error("❌ logout error:", e.response?.data || e.message);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, logout, refreshUserData, setUser }}
    >
      {loading ? <div className="loading-screen">🔄 טוען נתונים…</div> : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    console.warn("⚠️ useAuth must be used within AuthProvider");
    return { user: null, loading: false, error: null, login: async () => {}, logout: async () => {}, refreshUserData: async () => null, setUser: () => {} };
  }
  return ctx;
}
