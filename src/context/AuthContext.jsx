import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API, { setAccessToken as setAPIAccessToken } from "../api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const initRan = useRef(false);

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
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("No refresh token");
      const res = await API.post("/auth/refresh-token", { refreshToken });
      const newAccessToken = res.data.accessToken || res.data.token;

      if (newAccessToken) {
        localStorage.setItem("accessToken", newAccessToken);
        setAccessToken(newAccessToken);
        setAPIAccessToken(newAccessToken);
      }
      if (res.data.refreshToken) {
        localStorage.setItem("refreshToken", res.data.refreshToken);
      }
      return newAccessToken;
    } catch (e) {
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem("businessDetails");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      throw e;
    }
  }

  // אתחול על mount - רענון טוקן וטעינת משתמש
  useEffect(() => {
    if (initRan.current) return;
    initRan.current = true;

    const initialize = async () => {
      setLoading(true);
      try {
        const refreshTokenStored = localStorage.getItem("refreshToken");
        if (refreshTokenStored) {
          await refreshToken();

          // טען נתוני משתמש אחרי רענון מוצלח
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
        }
      } catch (e) {
        setUser(null);
        setAccessToken(null);
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

  // פונקציית התחברות כללית
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

      // שמירת טוקנים
      const newAccessToken = response.data.accessToken || response.data.token;
      const newRefreshToken = response.data.refreshToken;
      if (newAccessToken) {
        localStorage.setItem("accessToken", newAccessToken);
        setAccessToken(newAccessToken);
        setAPIAccessToken(newAccessToken);
      }
      if (newRefreshToken) {
        localStorage.setItem("refreshToken", newRefreshToken);
      }

      const userData = response.data.user;
      setUser({
        userId:           userData.userId,
        name:             userData.name,
        email:            userData.email,
        role:             userData.role,
        subscriptionPlan: userData.subscriptionPlan,
        businessId:       userData.businessId || null,
      });
      saveBusinessDetails(userData);

      if (!options.skipRedirect && userData) {
        let path = "/";
        switch (userData.role) {
          case "business":
            path = `/business/${userData.businessId}/dashboard`;
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
      setAccessToken(null);
      setLoading(false);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("businessDetails");
      setAPIAccessToken(null);
      navigate("/", { replace: true });
    }
  };

  // ניקוי הודעות הצלחה אוטומטי
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
        accessToken,
        loading,
        initialized,
        error,
        login,
        staffLogin,
        logout,
        refreshToken,   // <-- הוספת הפונקציה כאן
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
