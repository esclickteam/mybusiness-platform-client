// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  // ✅ DEV-only: fake user on localhost
  if (import.meta.env.DEV) {
    const devUser = {
      userId: "dev123",
      email: "dev@example.com",
      subscriptionPlan: "premium",
      role: "business",
      businessId: "dev-id",
    };

    return (
      <AuthContext.Provider
        value={{
          user: devUser,
          login: () => {},
          logout: () => {},
          error: null,
          refreshUserData: () => {},
          setUser: () => {},
          loading: false,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }

  // ✅ real auth flow
  const [user, setUser]     = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const refreshUserData = async () => {
    try {
      console.log("📡 loading user data…");
      const res = await API.get("/users/me");
      if (!res.data) throw new Error("Empty response");
      const u = {
        userId: res.data.userId || res.data._id,
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

  useEffect(() => {
    // Always attempt to refresh user from the server
    refreshUserData();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      console.log("📡 logging in…");
      const res = await API.post(
        "/auth/login",
        { email, password },
        { withCredentials: true }
      );
      if (!res.data?.token || !res.data?.user) throw new Error("Invalid response");
      const u = {
        userId: res.data.user.userId || res.data.user._id,
        email: res.data.user.email,
        subscriptionPlan: res.data.user.subscriptionPlan || "free",
        role: res.data.user.role || "customer",
        isTempPassword: res.data.user.isTempPassword || false,
        businessId: res.data.user.businessId || null,
      };
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(u));
      console.log("✅ logged in:", u);
      setUser(u);
    } catch (e) {
      console.error("❌ login failed:", e.response?.data || e.message);
      setError("⚠️ אימייל או סיסמה שגויים");
      throw e;
    }
  };

  const logout = async () => {
    try {
      console.log("📡 logging out…");
      await API.post("/auth/logout", {}, { withCredentials: true });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      console.log("✅ logged out");
      window.location.replace("/login");
    } catch (e) {
      console.error("❌ logout error:", e.response?.data || e.message);
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
