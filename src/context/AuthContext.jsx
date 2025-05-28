// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

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
    } else {
      delete API.defaults.headers.common["Authorization"];
    }
  };

  // אתחול המשתמש
  useEffect(() => {
    if (initRan.current) return;
    initRan.current = true;

    const initialize = async () => {
      setLoading(true);
      try {
        const { data } = await API.get("/auth/me");
        setUser({
          userId: data.userId,
          name: data.name,
          email: data.email,
          role: data.role,
          subscriptionPlan: data.subscriptionPlan,
          businessId: data.businessId || null,
        });

        if (data.businessId) {
          localStorage.setItem(
            "businessDetails",
            JSON.stringify({ businessId: data.businessId, _id: data.businessId })
          );
        } else {
          localStorage.removeItem("businessDetails");
        }
      } catch {
        setUser(null);
        localStorage.removeItem("businessDetails");
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initialize();
  }, []);

  // הפונקציה ל־login
  const login = async (identifier, password, options = { skipRedirect: false }) => {
    setLoading(true);
    setError(null);
    const clean = identifier.trim();
    const isEmail = clean.includes("@");

    try {
      const response = isEmail
        ? await API.post("/auth/login", { email: clean.toLowerCase(), password })
        : await API.post("/auth/staff-login", { username: clean, password });
      const { token, refreshToken } = response.data;

      // שומרים טוקנים ומעדכנים header
      if (token) {
        localStorage.setItem("token", token);
        applyAccessToken(token);
      }
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      // משאירים את ה-cookie ל־HttpOnly
      const { data } = await API.get("/auth/me");
      setUser({
        userId: data.userId,
        name: data.name,
        email: data.email,
        role: data.role,
        subscriptionPlan: data.subscriptionPlan,
        businessId: data.businessId || null,
      });

      if (data.businessId) {
        localStorage.setItem(
          "businessDetails",
          JSON.stringify({ businessId: data.businessId, _id: data.businessId })
        );
      } else {
        localStorage.removeItem("businessDetails");
      }

      if (!options.skipRedirect) {
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

  const logout = async () => {
    setLoading(true);
    try {
      await API.post("/auth/logout");
      setSuccessMessage("✅ נותקת בהצלחה");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
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

  // ניהול תצוגת הודעת הצלחה
  useEffect(() => {
    if (successMessage) {
      const t = setTimeout(() => setSuccessMessage(null), 4000);
      return () => clearTimeout(t);
    }
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
