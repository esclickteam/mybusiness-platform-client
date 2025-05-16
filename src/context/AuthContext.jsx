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

  // 1. On mount: fetch current user if token exists
  useEffect(() => {
    if (initRan.current) return;
    initRan.current = true;

    const initialize = async () => {
      setLoading(true);
      try {
        const { data } = await API.get("/auth/me");
        console.log("🔍 initialize /auth/me returned:", data);

        if (data.role === "business" && !data.businessId) {
          try {
            const { data: biz } = await API.get("/business/my");
            data.businessId = biz._id || biz.businessId || null;
            console.log("🔍 initialize fetched businessId:", data.businessId);
          } catch {
            console.warn("⚠️ Could not fetch business profile on init");
          }
        }

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
      if (isEmail) {
        await API.post("/auth/login", { email: clean.toLowerCase(), password });
      } else {
        await API.post("/auth/staff-login", { username: clean, password });
      }

      const { data } = await API.get("/auth/me");
      console.log("🔍 login /auth/me returned:", data);

      if (data.role === "business" && !data.businessId) {
        try {
          const { data: biz } = await API.get("/business/my");
          data.businessId = biz._id || biz.businessId || null;
          console.log("🔍 login fetched businessId:", data.businessId);
        } catch {
          console.warn("⚠️ Could not fetch business profile on login");
        }
      }

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
            path = "/business/" + data.businessId + "/dashboard";
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
        console.log("🔀 AuthContext navigating to:", path);
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
    } catch (e) {
      console.warn("⚠️ Logout failed:", e);
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
