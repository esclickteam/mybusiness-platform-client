import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const refreshUserData = async () => {
    try {
      const res = await API.get("/auth/me");
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
      localStorage.removeItem("user");
      setUser(null);
      setError("⚠️ יש להתחבר מחדש");
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      API.defaults.headers.common.Authorization = `Bearer ${token}`;
      refreshUserData();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (identifier, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.post("/auth/login", {
        identifier: identifier.trim(),
        password,
      });
      const token = res.data.token;
      if (token) {
        localStorage.setItem("authToken", token);
        API.defaults.headers.common.Authorization = `Bearer ${token}`;
      }
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

  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (e) {
      console.warn("Logout failed:", e);
    }
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    delete API.defaults.headers.common.Authorization;
    setUser(null);
    setLoading(false);
    navigate("/", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {loading ? (
        <div className="loading-screen">🔄 טוען נתונים...</div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
