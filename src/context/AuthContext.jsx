// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

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
      // מניח שהשרת מחזיר { user: { ... } }
      const u = res.data.user;
      console.log("🔍 /auth/me returned user:", u);
      setUser(u);
      localStorage.setItem("user", JSON.stringify(u));
      setError(null);
      return u;
    } catch (e) {
      console.warn("⚠️ failed to fetch /auth/me:", e);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setError("יש להתחבר מחדש");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // בודק אם יש token ומשליך על refreshUserData
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      refreshUserData();
    } else {
      setLoading(false);
    }
  }, []);

  // 2️⃣ התחברות: שולח credentials, שומר token ומטען שוב את המשתמש
  const login = async (identifier, password) => {
    setLoading(true);
    setError(null);

    try {
      const res = await API.post("/auth/login", {
        identifier: identifier.trim(),
        password,
      });
      // שומר את ה־JWT
      localStorage.setItem("token", res.data.token);
      // מרענן את משתמש
      const u = await refreshUserData();
      if (!u) throw new Error("לא הצלחנו לטעון את המשתמש");
      // ניווט לפי תפקיד
      if (u.role === "business") {
        navigate("/dashboard/business", { replace: true });
      } else {
        navigate("/dashboard/client", { replace: true });
      }
      return u;
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

  // 3️⃣ ההתנתקות: קורא ל־logout ומאפס state
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
