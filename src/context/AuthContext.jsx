// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API, { setAccessToken as setAPIAccessToken, setRefreshToken as setAPIRefreshToken } from "../api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [accessToken, _setAccessToken] = useState(localStorage.getItem("accessToken"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const initRan = useRef(false);

  // עדכון state + API defaults בבת אחת
  const setAccessToken = (token) => {
    _setAccessToken(token);
    setAPIAccessToken(token);
  };

  // שמירת פרטי העסק בלוקל סטורג'
  const saveBusinessDetails = (data) => {
    if (data.business) {
      localStorage.setItem("businessDetails", JSON.stringify(data.business));
    } else if (data.businessId) {
      localStorage.setItem("businessDetails", JSON.stringify({ _id: data.businessId }));
    } else {
      localStorage.removeItem("businessDetails");
    }
  };

  // פונקציה לרענון טוקן
  async function refreshToken() {
    try {
      const rToken = localStorage.getItem("refreshToken");
      if (!rToken) throw new Error("No refresh token");

      const res = await API.post("/auth/refresh-token", { refreshToken: rToken });
      const newAT = res.data.accessToken || res.data.token;
      const newRT = res.data.refreshToken;

      setAccessToken(newAT);
      if (newRT) {
        localStorage.setItem("refreshToken", newRT);
        setAPIRefreshToken(newRT);
      }
      return newAT;
    } catch (e) {
      // על כשל – לנקות כל הנתונים
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("businessDetails");
      throw e;
    }
  }

  // אתחול אוטומטי ב-mount
  useEffect(() => {
    if (initRan.current) return;
    initRan.current = true;

    const initialize = async () => {
      setLoading(true);
      try {
        const storedAT = localStorage.getItem("accessToken");
        const storedRT = localStorage.getItem("refreshToken");
        if (storedAT) {
          // הגדר ל-API את הטוקן שנשמר
          setAccessToken(storedAT);
        }
        if (storedRT) {
          setAPIRefreshToken(storedRT);
        }

        // נסה לרענן לפני טעינת המשתמש
        if (storedRT) {
          await refreshToken();
        }

        // טען נתוני משתמש
        const { data } = await API.get("/auth/me");
        setUser({
          userId:           data.userId,
          name:             data.name,
          email:            data.email,
          role:             data.role,
          subscriptionPlan: data.subscriptionPlan,
          businessId:       data.businessId || null,
        });
        saveBusinessDetails(data);
      } catch {
        // לא יעלה – משתמש לא מחובר
        setUser(null);
        setAccessToken(null);
        localStorage.removeItem("businessDetails");
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initialize();
  }, []);

  // התחברות (login)
  const login = async (identifier, password, options = { skipRedirect: false }) => {
    setLoading(true);
    setError(null);

    const clean = identifier.trim();
    const isEmail = clean.includes("@");

    try {
      const endpoint = isEmail ? "/auth/login" : "/auth/staff-login";
      const payload  = isEmail
        ? { email: clean.toLowerCase(), password }
        : { username: clean, password };
      const response = await API.post(endpoint, payload);

      const newAT = response.data.accessToken || response.data.token;
      const newRT = response.data.refreshToken;

      setAccessToken(newAT);
      if (newRT) {
        localStorage.setItem("refreshToken", newRT);
        setAPIRefreshToken(newRT);
      }

      const u = response.data.user;
      setUser({
        userId:           u.userId,
        name:             u.name,
        email:            u.email,
        role:             u.role,
        subscriptionPlan: u.subscriptionPlan,
        businessId:       u.businessId || null,
      });
      saveBusinessDetails(u);

      if (!options.skipRedirect) {
        let path = "/";
        switch (u.role) {
          case "business": path = `/business/${u.businessId}/dashboard`; break;
          case "customer": path = "/client/dashboard";            break;
          case "worker":   path = "/staff/dashboard";             break;
          case "manager":  path = "/manager/dashboard";           break;
          case "admin":    path = "/admin/dashboard";             break;
        }
        navigate(path, { replace: true });
      }

      return u;
    } catch (e) {
      setError(
        e.response?.status === 401
          ? "❌ אימייל/סיסמה לא נכונים"
          : "❌ שגיאה בשרת, נסה שוב"
      );
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // יציאה (logout)
  const logout = async () => {
    setLoading(true);
    try {
      await API.post("/auth/logout");
    } catch {
      // מתעלמים
    } finally {
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("businessDetails");
      navigate("/", { replace: true });
      setLoading(false);
    }
  };

  // ניקוי הודעות הצלחה
  useEffect(() => {
    if (!successMessage) return;
    const t = setTimeout(() => setSuccessMessage(null), 4000);
    return () => clearTimeout(t);
  }, [successMessage]);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        initialized,
        error,
        login,
        logout,
        refreshToken,
        successMessage,
        setSuccessMessage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
