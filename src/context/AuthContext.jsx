import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // ✅ 1. פעם ראשונה נטען /auth/me אם יש טוקן
  //    כדי לשמור ב-state את פרטי המשתמש (role, email וכו’).
  const refreshUserData = async () => {
    try {
      // 📌 שולח GET ל־/auth/me עם ה־Authorization header שמוכן ב־API.interceptors
      const res  = await API.get("/auth/me");
      console.log("🔍 /auth/me returned:", res.data);

      const data = res.data;
      const u = {
        userId:           data.userId,
        name:             data.name  || "",
        email:            data.email,
        subscriptionPlan: data.subscriptionPlan,
        role:             data.role,          // ✅ role שמחזיר השרת
        isTempPassword:   data.isTempPassword,
        businessId:       data.businessId,
      };
      localStorage.setItem("user", JSON.stringify(u));
      setUser(u);
      setError(null);
      return u;
    } catch (e) {
      // ❌ אם אין session תקין – מחזירים מאפסים
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setError("⚠️ יש להתחבר מחדש");
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // ✅ אם קיים token ב־localStorage – נטען פרטי משתמש
      refreshUserData();
    } else {
      // ✅ אחרת – נחכה עד שילחץ login
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ 2. פונקציית התחברות שמקבלת identifier (email או username) + password
  const login = async (identifier, password) => {
    setLoading(true);
    setError(null);

    try {
      // ✅ שולחים בדיוק את שני השדות שהשרת מצפה להם:
      //    { identifier: "...", password: "..." }
      //    במקום לשלוח { email } או { username } – השרת מפענח בעצמו
      const res = await API.post("/auth/login", {
        identifier: identifier.trim(),
        password:   password,
      });

      // ✅ שומרים את הטוקן שהשרת שלח לנו
      localStorage.setItem("token", res.data.token);

      // ✅ מרעננים את הפרטים (role, businessId וכו’) עם הטוקן החדש
      const u = await refreshUserData();
      if (!u) throw new Error("User load failed");
      return u;
    } catch (e) {
      setError(
        e.response?.status === 401
          ? "❌ אימייל/שם משתמש או סיסמה שגויים"
          : "❌ שגיאה בשרת, נסו שוב"
      );
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // ✅ 3. התנתקות: קורא ל־/auth/logout ומנקה state ו־localStorage
  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } catch {}
    finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {/* ✅ עד לסיום הטעינה מראה מסך טוען ולא מרנדר כלום */}
      {loading ? <div className="loading-screen">🔄 טוען נתונים…</div> : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
