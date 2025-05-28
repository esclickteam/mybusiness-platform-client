import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API, { setAccessToken, setRefreshToken } from "../api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const initRan = useRef(false);

  const getToken = () => localStorage.getItem("token");
  const getRefreshToken = () => localStorage.getItem("refreshToken");

  const refreshToken = async () => {
    try {
      const response = await API.post("/auth/refresh-token", {}, {
        headers: { 'x-refresh-token': getRefreshToken() }
      });
      const newToken = response.data.token;
      const newRefresh = response.data.refreshToken;
      if (newToken) {
        localStorage.setItem("token", newToken);
        setAccessToken(newToken);
      }
      if (newRefresh) {
        localStorage.setItem("refreshToken", newRefresh);
        setRefreshToken(newRefresh);
      }
      return newToken;
    } catch (error) {
      console.error("Failed to refresh token", error);
      throw error;
    }
  };

  // Initialize API header and user state
  useEffect(() => {
    if (initRan.current) return;
    initRan.current = true;

    const initialize = async () => {
      setLoading(true);
      try {
        const token = getToken();
        if (!token) throw new Error("No token");
        setAccessToken(token);

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

  const login = async (identifier, password, options = { skipRedirect: false }) => {
    setLoading(true);
    setError(null);

    const clean = identifier.trim();
    const isEmail = clean.includes("@");

    try {
      let response;
      if (isEmail) {
        response = await API.post("/auth/login", {
          email: clean.toLowerCase(),
          password,
        });
      } else {
        response = await API.post("/auth/staff-login", {
          username: clean,
          password,
        });
      }

      const token = response.data.token;
      const refresh = response.data.refreshToken;
      if (token) {
        localStorage.setItem("token", token);
        setAccessToken(token);
      }
      if (refresh) {
        localStorage.setItem("refreshToken", refresh);
        setRefreshToken(refresh);
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
        localStorage.setItem(
          "businessDetails",
          JSON.stringify({ businessId: data.businessId, _id: data.businessId })
        );
      } else {
        localStorage.removeItem("businessDetails");
      }

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
      setSuccessMessage("✅ נותקת בהצלחה");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("businessDetails");
      setAccessToken(null);
      setRefreshToken(null);
    } catch (e) {
      console.warn("Logout failed:", e);
    } finally {
      setUser(null);
      setLoading(false);
      navigate("/", { replace: true });
    }
  };

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
        refreshToken,
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
