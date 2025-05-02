import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      setError("\u26a0\ufe0f יש להתחבר מחדש");
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user === null) {
      setLoading(true);  // נטען מחדש אם המשתמש מתנתק
      refreshUserData();
    }
  }, [user]);  // ה-useEffect ירוץ כל פעם שה-user משתנה

  const login = async (identifier, password) => {
    setLoading(true);
    setError(null);

    try {
      const res = await API.post("/auth/login", {
        identifier: identifier.trim(),
        password,
      });

      console.log("✅ login response:", res.data);
      console.log("🍪 current cookies:", document.cookie);

      const token = res.data.token;  // הנח שהטוקן מגיע מ-API התחברות
      if (token) {
        localStorage.setItem("authToken", token);  // שמור את הטוקן תחת authToken
      }

      const u = await refreshUserData();
      if (!u) throw new Error("User load failed");
      return u;
    } catch (e) {
      setError(
        e.response?.status === 401
          ? "\u274c שם משתמש או סיסמה שגויים"
          : "\u274c שגיאה בשרת, נסו שוב"
      );
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } catch {}
    localStorage.removeItem("user");
    setUser(null);
  
    // הוספת ה-console.log אחרי ההתנתקות
    setTimeout(() => {
      console.log("User after logout:", user);  // הדפסת ערך המשתמש אחרי ההתנתקות
    }, 0);  // שימוש ב-setTimeout כדי לוודא שה-`user` עודכן
  };
  

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {loading ? <div className="loading-screen">\uD83D\uDD04 טוען נתונים...</div> : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
