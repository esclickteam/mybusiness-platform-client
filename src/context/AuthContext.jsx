// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser]                   = useState(null);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [initialized, setInitialized]     = useState(false);
  const initRan = useRef(false);

  // 1. On mount: fetch current user if token exists
  useEffect(() => {
    if (initRan.current) return;
    initRan.current = true;

    const initialize = async () => {
      setLoading(true);
      try {
        const res = await API.get("/auth/me");
        setUser(res.data);
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
   * generic login (handles both customer/business by email, and staff by username)
   * @param {string} identifier  email or username
   * @param {string} password
   * @param {{ skipRedirect?: boolean }} options
   * @returns {Promise<object>}  the user object
   */
  const login = async (
    identifier,
    password,
    options = { skipRedirect: false }
  ) => {
    setLoading(true);
    setError(null);

    const clean = identifier.trim();
    const isEmail = clean.includes("@");

    try {
      if (isEmail) {
        // customer/business login
        await API.post("/api/auth/login", {
          email: clean.toLowerCase(),
          password
        });
      } else {
        // staff login
        await API.post("/api/auth/staff-login", {
          username: clean,
          password
        });
      }

      // fetch current user
      const me = await API.get("/auth/me");
      setUser(me.data);

      // auto-redirect unless skipped
      if (!options.skipRedirect && me.data) {
        const role = me.data.role;
        const path =
          role === "business"
            ? `/business/${me.data.businessId}/dashboard`
            : role === "customer"
            ? "/client/dashboard"
            : role === "worker"
            ? "/staff/dashboard"
            : role === "manager" || role === "מנהל"
            ? "/manager/dashboard"
            : role === "admin"
            ? "/admin/dashboard"
            : "/";
        navigate(path, { replace: true });
      }

      return me.data;
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

  /**
   * staffLogin wrapper: delegates to generic login but skips auto-redirect
   * so that StaffLogin page can handle navigation itself
   */
  const staffLogin = (username, password) =>
    login(username, password, { skipRedirect: true });

  const logout = async () => {
    setLoading(true);
    try {
      await API.post("/api/auth/logout");
      setSuccessMessage("✅ נותקת בהצלחה");
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
        logout
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
