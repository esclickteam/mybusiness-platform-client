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
  const initRan = useRef(false);

  // טען בהתחלה את פרטי המשתמש אם קיים cookie תקף
  useEffect(() => {
    if (initRan.current) return;
    initRan.current = true;

    const initialize = async () => {
      try {
        const res = await API.get("/auth/me");
        setUser(res.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initialize();
  }, []);

  /**
   * login
   * @param {string} identifier
   * @param {string} password
   * @param {{ skipRedirect?: boolean }} options
   * @returns {Promise<object>} user data
   */
  const login = async (
    identifier,
    password,
    options = { skipRedirect: false }
  ) => {
    setLoading(true);
    setError(null);
    try {
      await API.post("/auth/login", { identifier: identifier.trim(), password });
      const me = await API.get("/auth/me");
      setUser(me.data);

      // ניווט אוטומטי בהתאם לאפשרות
      if (!options.skipRedirect && me.data) {
        const path =
          me.data.role === "business"
            ? `/business/${me.data.businessId}/dashboard`
            : me.data.role === "customer"
            ? "/client/dashboard"
            : me.data.role === "worker"
            ? "/staff/dashboard"
            : me.data.role === "manager"
            ? "/manager/dashboard"
            : me.data.role === "admin"
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

  // logout
  const logout = async () => {
    setLoading(true);
    try {
      await API.post("/auth/logout");
      setSuccessMessage("✅ נותקת בהצלחה");
    } catch (e) {
      console.warn("Logout failed:", e);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      setLoading(false);
      navigate("/", { replace: true });
    }
  };

  // ניקוי ההודעה לאחר 4 שניות
  useEffect(() => {
    if (successMessage) {
      const timeout = setTimeout(() => setSuccessMessage(null), 4000);
      return () => clearTimeout(timeout);
    }
  }, [successMessage]);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {successMessage && (
        <div className="global-success-toast">
          {successMessage}
        </div>
      )}
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
