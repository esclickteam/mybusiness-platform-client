import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import jwt from "jsonwebtoken";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const initRan = useRef(false);

  const applyAccessToken = (token) => {
    if (token) {
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      console.log("הוזן טוקן חדש ל-axios:", token);
    } else {
      delete API.defaults.headers.common["Authorization"];
      console.log("הוסר טוקן מ-axios");
    }
  };

  // אתחול המשתמש
  useEffect(() => {
    if (initRan.current) return;
    initRan.current = true;

    const initialize = async () => {
      setLoading(true);
      try {
        // טען את ה- accessToken
        const token = localStorage.getItem("token");
        console.log("נשלף טוקן מ-localStorage:", token);
        if (token) applyAccessToken(token);

        // קבל פרטי משתמש
        const { data } = await API.get("/auth/me");
        console.log("פרטי משתמש התקבלו:", data);

        setUser({
          userId: data.userId,
          name: data.name,
          email: data.email,
          role: data.role,
          subscriptionPlan: data.subscriptionPlan,
          businessId: data.businessId || null,
        });

        // שמור את פרטי העסק אם קיימים
        if (data.businessId) {
          console.log("שומר את פרטי העסק ב-localStorage:", data.businessId);
          localStorage.setItem(
            "businessDetails",
            JSON.stringify({ businessId: data.businessId, _id: data.businessId })
          );
        } else {
          localStorage.removeItem("businessDetails");
        }
      } catch (err) {
        console.error("שגיאה בהתחול:", err);
        setUser(null);
        localStorage.removeItem("businessDetails");
        applyAccessToken(null);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initialize();
  }, []);

  // פונקציה לרענן את ה- accessToken
  const refreshTokenIfNeeded = async () => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");

    console.log("בודק אם יש צורך לרענן את הטוקן");

    if (token && isTokenExpired(token)) {
      console.log("הטוקן פג תוקף, מנסה לרענן");

      try {
        const response = await API.post("/refresh-token", { refreshToken });
        const { accessToken } = response.data;

        if (accessToken) {
          console.log("טוקן חדש התקבל:", accessToken);
          localStorage.setItem("token", accessToken);
          applyAccessToken(accessToken);
        } else {
          console.error("לא ניתן לרענן את הטוקן");
        }
      } catch (err) {
        console.error("שגיאה ברענון הטוקן:", err);
      }
    }
  };

  // בדיקת תקפות ה- accessToken
  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const { exp } = jwt.decode(token);
      return Date.now() >= exp * 1000;
    } catch {
      return true;
    }
  };

  // פונקציית login
  const login = async (identifier, password, options = { skipRedirect: false }) => {
    setLoading(true);
    setError(null);

    const clean = identifier.trim();
    const isEmail = clean.includes("@");

    try {
      // שלח בקשת login
      const response = isEmail
        ? await API.post("/auth/login", { email: clean.toLowerCase(), password })
        : await API.post("/auth/staff-login", { username: clean, password });

      const { token, refreshToken } = response.data;
      if (token) {
        console.log("שומר טוקן ב-localStorage:", token);
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refreshToken);
        applyAccessToken(token);
      }

      // קבל מחדש פרטי משתמש
      const { data } = await API.get("/auth/me");
      console.log("פרטי משתמש התקבלו לאחר התחברות:", data);

      setUser({
        userId: data.userId,
        name: data.name,
        email: data.email,
        role: data.role,
        subscriptionPlan: data.subscriptionPlan,
        businessId: data.businessId || null,
      });

      if (data.businessId) {
        console.log("שומר את פרטי העסק ב-localStorage:", data.businessId);
        localStorage.setItem(
          "businessDetails",
          JSON.stringify({ businessId: data.businessId, _id: data.businessId })
        );
      } else {
        localStorage.removeItem("businessDetails");
      }

      // ניתוב לפי תפקיד
      let path = "/";
      switch (data.role) {
        case "business":
          path = `/business/${data.businessId}/dashboard`;
          break;
        case "customer":
          path = "/client/dashboard";
          break;
        case "worker":
          path = "/staff/dashboard";
          break;
        case "manager":
          path = "/manager/dashboard";
          break;
        case "admin":
          path = "/admin/dashboard";
          break;
      }
      if (!options.skipRedirect) {
        navigate(path, { replace: true });
      }

      return data;
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

  const staffLogin = (username, password) =>
    login(username, password, { skipRedirect: true });

  // פונקציית logout
  const logout = async () => {
    setLoading(true);
    try {
      await API.post("/auth/logout");
      setSuccessMessage("✅ נותקת בהצלחה");
      console.log("מבצע logout, מנקה את ה-localStorage");
      localStorage.removeItem("token");
      localStorage.removeItem("businessDetails");
      applyAccessToken(null);
    } catch (err) {
      console.warn("Logout failed:", err);
    } finally {
      setUser(null);
      setLoading(false);
      navigate("/", { replace: true });
    }
  };

  // ניהול הודעת הצלחה
  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        initialized,
        error,
        login,
        staffLogin,
        logout,
        refreshTokenIfNeeded,  // הוספנו את הפונקציה לרענון ה- token
      }}
    >
      {successMessage && (
        <div className="global-success-toast">{successMessage}</div>
      )}
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
