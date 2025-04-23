import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  // מצב פיתוח: משתמש מזויף
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

  // מצב אמיתי
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // טוען נתוני משתמש מהשרת (משתמש ב-cookie בלבד)
  const refreshUserData = async () => {
    try {
      console.log("📡 fetching /api/users/me");
      const res = await API.get("/users/me", { withCredentials: true });
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
      setUser(u);
      setError(null);
      return u;
    } catch (e) {
      console.error("❌ refreshUserData failed:", e.response?.data || e.message);
      setUser(null);
      setError("⚠️ יש להתחבר מחדש");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // טען משתמש ברגע שהקומפוננט עולה
  useEffect(() => {
    refreshUserData();
  }, []);

  // login: שולח identifier/password ו־userType, שומר את המשתמש מה־/users/me
  const login = async (identifier, password, isEmployeeLogin = false) => {
    setLoading(true);
    setError(null);
    try {
      // 1. בחרי את ה־userType לפי האם זו כניסת צוות או רגילה
      const userType = isEmployeeLogin ? "worker" : "customer";

      // 2. הכנת ה־payload: אם זה אימייל – שלחי email, אחרת username
      const body = {
        password,
        userType,
        ...(identifier.includes("@")
          ? { email: identifier.trim() }
          : { username: identifier.trim() }),
      };
      console.log("📡 POST /api/auth/login", body);

      // 3. קריאה ל־API עם body מלא ו־withCredentials
      await API.post("/auth/login", body, { withCredentials: true });

      // 4. קבלת פרטי המשתמש אחרי התחברות
      const u = await refreshUserData();
      if (!u) throw new Error("User load failed");
      return u;
    } catch (e) {
      console.error("❌ login error:", e.response?.data || e.message);
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

  // logout: מוחק cookie במידת הצורך ונקה state
  const logout = async () => {
    try {
      console.log("📡 POST /api/auth/logout");
      await API.post("/auth/logout", {}, { withCredentials: true });
    } catch (e) {
      console.error("❌ logout error:", e.response?.data || e.message);
    } finally {
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
    return {
      user: null,
      loading: false,
      error: null,
      login: async () => {},
      logout: async () => {},
      refreshUserData: async () => null,
      setUser: () => {},
    };
  }
  return ctx;
}
