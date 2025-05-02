// src/context/AuthContext.jsx
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
      // 1️⃣ מבצעים POST ל-login כדי לקבל את ה־Set-Cookie
      await API.post("/auth/login", {
        identifier: identifier.trim(),
        password,
      });

      // 2️⃣ עכשיו שה-cookie שמור, קוראים ל-/me כדי להביא את ה-user האמיתי
      const me = await API.get("/auth/me");
      const userData = me.data;
      setUser(userData);

      // 3️⃣ ניווט לפי role מתוך userData
      navigate(
        userData.role === "business"
          ? `/business/${userData.businessId}/dashboard`
          : userData.role === "customer"
          ? "/client/dashboard"
          : userData.role === "worker"
          ? "/staff/dashboard"
          : userData.role === "manager"
          ? "/manager/dashboard"
          : userData.role === "admin"
          ? "/admin/dashboard"
          : "/",
        { replace: true }
      );

      return userData;
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

  // logout: מבקש מהשרת לנקות את ה-cookie, ואז מפנה ל־Home
  const logout = async () => {
    setLoading(true);
    try {
      await API.post("/auth/logout");
    } catch (e) {
      console.warn("Logout failed:", e);
    } finally {
      setUser(null);
      setLoading(false);
      navigate("/", { replace: true });
    }
  };

  // בזמן טעינה – מציג מסך טעינה
  if (loading) {
    return (
      <div className="loading-screen" style={{ textAlign: "center", padding: "2rem" }}>
        🔄 טוען נתונים...
      </div>
    );
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
