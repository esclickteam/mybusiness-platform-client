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

  useEffect(() => {
    if (initRan.current) return;
    initRan.current = true;

    const initialize = async () => {
      setLoading(true);
      try {
        const { data } = await API.get("/auth/me");

        // נסה לתקן businessId חסר (משתמש עסקי בלבד)
        let realBusinessId = data.businessId || null;
        if (data.role === "business" && !realBusinessId) {
          try {
            const resp = await API.get("/business/my");
            const bizObj = resp.data.business || resp.data;
            realBusinessId = bizObj._id || bizObj.businessId || null;
            if (realBusinessId) data.businessId = realBusinessId;
          } catch (e) {
            // לא הצלחנו לשלוף את העסק
            realBusinessId = null;
          }
        }

        // בדיקה מחמירה - אם זה עסק ואין businessId → הודעת שגיאה + לא להמשיך
        if (data.role === "business" && !realBusinessId) {
          console.warn("🔴 אין businessId למשתמש עסקי!", data);
          setUser(null);
          setError("⚠️ לעסק שלך אין מזהה עסק (businessId) תקין. פנה לתמיכה או צור עסק חדש.");
          setLoading(false);
          setInitialized(true);
          return;
        }

        setUser({
          userId:           data.userId,
          name:             data.name,
          email:            data.email,
          role:             data.role,
          subscriptionPlan: data.subscriptionPlan,
          businessId:       realBusinessId,
        });
      } catch (e) {
        setUser(null);
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
      if (isEmail) {
        await API.post("/auth/login", { email: clean.toLowerCase(), password });
      } else {
        await API.post("/auth/staff-login", { username: clean, password });
      }

      const { data } = await API.get("/auth/me");

      // נסה לתקן businessId חסר (משתמש עסקי בלבד)
      let realBusinessId = data.businessId || null;
      if (data.role === "business" && !realBusinessId) {
        try {
          const resp = await API.get("/business/my");
          const bizObj = resp.data.business || resp.data;
          realBusinessId = bizObj._id || bizObj.businessId || null;
          if (realBusinessId) data.businessId = realBusinessId;
        } catch (e) {
          realBusinessId = null;
        }
      }

      if (data.role === "business" && !realBusinessId) {
        setUser(null);
        setError("⚠️ לעסק שלך אין מזהה עסק (businessId) תקין. פנה לתמיכה או צור עסק חדש.");
        setLoading(false);
        return null;
      }

      setUser({
        userId:           data.userId,
        name:             data.name,
        email:            data.email,
        role:             data.role,
        subscriptionPlan: data.subscriptionPlan,
        businessId:       realBusinessId,
      });

      if (!options.skipRedirect && data) {
        let path = "/";
        switch (data.role) {
          case "business":
            path = "/business/" + realBusinessId + "/dashboard";
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
    } catch {
      console.warn("⚠️ Logout failed");
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
      }}
    >
      {successMessage && (
        <div className="global-success-toast">{successMessage}</div>
      )}
      {error && (
        <div className="global-error-toast">{error}</div>
      )}
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
