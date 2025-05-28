import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api"; // הפניה לאובייקט ה-API שלך

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const initRan = useRef(false);

  // פונקציה לחידוש הטוקן
  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      console.warn("אין Refresh Token, יש להתחבר מחדש");
      navigate("/login");
      return;
    }

    try {
      const response = await API.post("/auth/refresh-token", { refreshToken });

      if (response.data.accessToken) {
        // עדכון ה־Access Token החדש
        localStorage.setItem("token", response.data.accessToken);
        API.defaults.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
      } else {
        console.error("Failed to refresh access token.");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error refreshing access token:", error);
      navigate("/login");
    }
  };

  // 1. On mount: fetch current user if token exists
  useEffect(() => {
    if (initRan.current) return;
    initRan.current = true;

    const initialize = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (token) {
        try {
          API.defaults.headers['Authorization'] = `Bearer ${token}`; // קביעת הטוקן כ־Authorization header

          const { data } = await API.get("/auth/me");
          setUser({
            userId:           data.userId,
            name:             data.name,
            email:            data.email,
            role:             data.role,
            subscriptionPlan: data.subscriptionPlan,
            businessId:       data.businessId || null,
          });
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
      setInitialized(true);
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

      // שמירת הטוקן ב־localStorage
      const token = response.data.token || response.data.accessToken;
      if (token) {
        localStorage.setItem("token", token);  // שמור את ה־Access Token ב־localStorage
        API.defaults.headers['Authorization'] = `Bearer ${token}`; // הגדר את הטוקן עבור כל בקשה עתידית
      } else {
        console.warn("No token received from login response");
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
      if (e.response?.status === 401) {
        // נתקבלה שגיאה 401 – ננסה לחדש את ה־Access Token
        await refreshAccessToken();
      } else {
        setError(
          e.response?.status === 401
            ? "❌ אימייל/שם משתמש או סיסמה שגויים"
            : "❌ שגיאה בשרת, נסה שוב"
        );
      }
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
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        await API.post("/auth/logout", { refreshToken });  // שלח את ה-refreshToken בעת ההתנתקות
      } else {
        console.warn("No refresh token found during logout");
      }

      setSuccessMessage("✅ נותקת בהצלחה");

      // הסרת הטוקנים מ־localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");

      // ניקוי ה־Authorization header
      delete API.defaults.headers['Authorization'];

      // אם יש גם businessDetails, מחוק אותו
      localStorage.removeItem("businessDetails");

    } catch (e) {
      console.warn("Logout failed:", e);
    } finally {
      setUser(null);
      setLoading(false);
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
