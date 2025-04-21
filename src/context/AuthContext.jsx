import { createContext, useContext, useState, useEffect } from "react";
import API from "../api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  // ✅ מצב פיתוח בלבד – משתמש מזויף רק ב־localhost
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

  // ✅ קוד התחברות אמיתי
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshUserData = async () => {
    try {
      console.log("📡 מנסה לטעון את נתוני המשתמש...");
      const response = await API.get("/users/me");


      if (response?.data) {
        const userData = {
          userId: response.data.userId || response.data._id,
          email: response.data.email,
          subscriptionPlan: response.data.subscriptionPlan || "free",
          role: response.data.role || "customer",
          isTempPassword: response.data.isTempPassword || false,
          businessId: response.data.businessId || null,
        };

        console.log("✅ נתוני משתמש נטענו:", userData);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        return userData;
      } else {
        throw new Error("🔴 תגובה מהשרת ריקה או לא תקינה.");
      }
    } catch (error) {
      console.error("❌ שגיאה בטעינת נתוני המשתמש:", error.response?.data || error.message);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setError("⚠️ שגיאה בטעינת הנתונים.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        setLoading(true);
        await refreshUserData();
      } else {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    setError("");
    try {
      console.log("📡 מנסה להתחבר...");
      const response = await API.post("/auth/login", { email, password }, { withCredentials: true });

      if (response?.data?.token && response?.data?.user) {
        const userData = {
          userId: response.data.user?.userId || response.data.user?._id,
          email: response.data.user.email,
          subscriptionPlan: response.data.user.subscriptionPlan || "free",
          role: response.data.user.role || "customer",
          isTempPassword: response.data.user.isTempPassword || false,
          businessId: response.data.user.businessId || null,
        };

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(userData));
        console.log("✅ התחברות מוצלחת:", userData);
        setUser(userData);
      } else {
        throw new Error("🔴 תגובה לא תקינה מהשרת");
      }
    } catch (error) {
      console.error("❌ שגיאה בהתחברות:", error.response?.data || error.message);
      setError("⚠️ אימייל או סיסמה שגויים. נסה שוב.");
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log("📡 מבצע יציאה...");
      await API.post("/auth/logout", {}, { withCredentials: true });

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);

      console.log("✅ התנתקות בוצעה בהצלחה");
      window.location.replace("/login");
    } catch (error) {
      console.error("❌ שגיאה ביציאה:", error.response?.data || error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, error, refreshUserData, setUser, loading }}>
      {loading ? <div className="loading-screen">🔄 טוען נתונים...</div> : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    console.warn("⚠️ AuthContext לא קיים – מוחזר אובייקט ברירת מחדל");
    return {
      user: null,
      loading: false,
      login: () => {},
      logout: () => {},
      error: null,
      refreshUserData: () => {},
      setUser: () => {},
    };
  }
  return context;
}
