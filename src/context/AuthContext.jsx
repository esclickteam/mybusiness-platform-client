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

    const devLogout = async () => {
      console.log("🔒 dev logout");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    };

    return (
      <AuthContext.Provider
        value={{
          user: devUser,
          login: async () => devUser,
          logout: devLogout,
          error: null,
          refreshUserData: async () => devUser,
          setUser: () => {},
          loading: false,
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

  const refreshUserData = async () => {
    try {
      console.log("📡 loading user data from /users/me");
      const res = await API.get("/users/me");
      if (!res.data) throw new Error("Empty response");

      const u = {
        userId: res.data.userId || res.data._id,
        name: res.data.name || res.data.username || "",
        email: res.data.email,
        subscriptionPlan: res.data.subscriptionPlan || "free",
        role: res.data.role || "customer",
        isTempPassword: res.data.isTempPassword || false,
        businessId: res.data.businessId || null,
      };

      console.log("✅ user loaded:", u);
      localStorage.setItem("user", JSON.stringify(u));
      setUser(u);
      return u;
    } catch (e) {
      console.error("❌ failed to refresh user:", e.response?.data || e.message);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setError("⚠️ failed to load user");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ⏳ טען משתמש בעת טעינת האפליקציה
  useEffect(() => {
    refreshUserData();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      console.log("📡 logging in...");
      await API.post("/auth/login", { email, password });

      // ✅ טען את המשתמש מחדש מהשרת לאחר התחברות
      const refreshedUser = await refreshUserData();
      if (!refreshedUser) throw new Error("User failed to load");
      return refreshedUser;
    } catch (e) {
      console.error("❌ login failed:", e.response?.data || e.message);
      setError("⚠️ אימייל או סיסמה שגויים");
      throw e;
    }
  };

  const logout = async () => {
    try {
      console.log("📡 logging out...");
      await API.post("/auth/logout");
    } catch (e) {
      console.error("❌ logout error:", e.response?.data || e.message);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      console.log("✅ logged out");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, error, refreshUserData, setUser, loading }}
    >
      {loading ? <div className="loading-screen">🔄 טוען נתונים…</div> : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    console.warn("⚠️ useAuth called outside AuthProvider");
    return {
      user: null,
      loading: false,
      login: async () => {},
      logout: async () => {},
      error: null,
      refreshUserData: async () => null,
      setUser: () => {},
    };
  }
  return ctx;
}
