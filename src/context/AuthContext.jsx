import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import jwt from 'jsonwebtoken';

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

  useEffect(() => {
    if (initRan.current) return;
    initRan.current = true;

    const initialize = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (token) {
          applyAccessToken(token);
          // קבל פרטי משתמש
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
            localStorage.setItem("businessDetails", JSON.stringify({ businessId: data.businessId }));
          } else {
            localStorage.removeItem("businessDetails");
          }
        } else {
          setUser(null);
        }
      } catch (error) {
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
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refreshToken);
        applyAccessToken(token);
      }

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
        localStorage.setItem("businessDetails", JSON.stringify({ businessId: data.businessId }));
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
      setError(e.response?.status === 401 ? "❌ אימייל/שם משתמש או סיסמה שגויים" : "❌ שגיאה בשרת, נסה שוב");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await API.post("/auth/logout");
      setSuccessMessage("✅ נותקת בהצלחה");
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

  const refreshTokenIfNeeded = async () => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");

    if (token && isTokenExpired(token)) {
      try {
        const response = await API.post("/refresh-token", { refreshToken });
        const { accessToken } = response.data;

        if (accessToken) {
          localStorage.setItem("token", accessToken);
          applyAccessToken(accessToken);
        } else {
          console.error("Unable to refresh token");
        }
      } catch (err) {
        console.error("Error refreshing token:", err);
      }
    }
  };

  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const { exp } = jwt.decode(token);
      return Date.now() >= exp * 1000;
    } catch {
      return true;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        initialized,
        error,
        login,
        logout,
        refreshTokenIfNeeded,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
