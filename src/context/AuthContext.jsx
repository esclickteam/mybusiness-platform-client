import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API, { setAccessToken } from "../api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const initRan = useRef(false);

  // ============================
  // פונקציית עזר לשמירת businessDetails
  // ============================
  const saveBusinessDetails = (data) => {
    if (data.business) {
      localStorage.setItem("businessDetails", JSON.stringify(data.business));
    } else if (data.businessId) {
      localStorage.setItem("businessDetails", JSON.stringify({ _id: data.businessId }));
    } else {
      localStorage.removeItem("businessDetails");
    }
  };

  // 1. On mount: try refresh token + load user
  useEffect(() => {
    if (initRan.current) return;
    initRan.current = true;

    const initialize = async () => {
      setLoading(true);
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const res = await API.post("/auth/refresh-token", { refreshToken });
          setAccessToken(res.data.accessToken);
          if (res.data.refreshToken) {
            localStorage.setItem("refreshToken", res.data.refreshToken);
          }
        }
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
      } catch (e) {
        setUser(null);
        localStorage.removeItem("businessDetails");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };
    initialize();
  }, []);

  /**
   * generic login (handles both customer/business by email and staff by username)
   */
  const login = async (identifier, password, options = { skipRedirect: false }) => {
    setLoading(true);
    setError(null);

    const clean = identifier.trim();
    const isEmail = clean.includes("@");

    try {
      let response;
      if (isEmail) {
        response = await API.post("/auth/login", { email: clean.toLowerCase(), password });
      } else {
        response = await API.post("/auth/staff-login", { username: clean, password });
      }

      // שמירת הטוקנים
      const accessToken = response.data.accessToken || response.data.token;
      const refreshToken = response.data.refreshToken;
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        setAccessToken(accessToken);
      }
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      // הבאת פרטי המשתמש לאחר התחברות
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

      if (!options.skipRedirect && data) {
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
    } catch (e) {
      console.warn("Logout failed:", e);
    } finally {
      setUser(null);
      setLoading(false);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("businessDetails");
      setAccessToken(null);
      navigate("/", { replace: true });
    }
  };

  // clear success message after 4s
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
