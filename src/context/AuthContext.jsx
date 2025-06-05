import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api"; // אובייקט axios או fetch מותאם מראש

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const initRan = useRef(false);

  // חידוש Access Token
  const refreshAccessToken = async () => {
    try {
      // לא שולחים body - ה-refreshToken בעוגיה HttpOnly נשלח אוטומטית
      const response = await API.post("/auth/refresh-token", null, { credentials: "include" });
      if (response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        API.defaults.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
        return true;
      }
    } catch (err) {
      console.error("Failed to refresh token:", err);
    }
    return false;
  };

  // אתחול מצב משתמש במעמד טעינת האפליקציה
  useEffect(() => {
    if (initRan.current) return;
    initRan.current = true;

    const initialize = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (token) {
        try {
          API.defaults.headers['Authorization'] = `Bearer ${token}`;
          const { data } = await API.get("/auth/me", { credentials: "include" });

          if (data.businessId) {
            localStorage.setItem("businessDetails", JSON.stringify({ _id: data.businessId }));
          }

          setUser({
            userId: data.userId,
            name: data.name,
            email: data.email,
            role: data.role,
            subscriptionPlan: data.subscriptionPlan,
            businessId: data.businessId || null,
          });
        } catch {
          // אם השגת טוקן לא תקין - נסה לרענן
          const refreshed = await refreshAccessToken();
          if (refreshed) {
            try {
              const { data } = await API.get("/auth/me", { credentials: "include" });
              setUser({
                userId: data.userId,
                name: data.name,
                email: data.email,
                role: data.role,
                subscriptionPlan: data.subscriptionPlan,
                businessId: data.businessId || null,
              });
            } catch {
              setUser(null);
              localStorage.removeItem("token");
            }
          } else {
            setUser(null);
            localStorage.removeItem("token");
          }
        }
      } else {
        setUser(null);
      }
      setLoading(false);
      setInitialized(true);
    };

    initialize();
  }, []);

  // התחברות
  const login = async (identifier, password, options = { skipRedirect: false }) => {
    setLoading(true);
    setError(null);

    const clean = identifier.trim();
    const isEmail = clean.includes("@");

    try {
      let response;
      if (isEmail) {
        response = await API.post("/auth/login", { email: clean.toLowerCase(), password }, { credentials: "include" });
      } else {
        response = await API.post("/auth/staff-login", { username: clean, password }, { credentials: "include" });
      }

      // שמירת ה-Access Token בלבד ב-localStorage
      const { accessToken } = response.data;
      if (accessToken) {
        localStorage.setItem("token", accessToken);
        API.defaults.headers['Authorization'] = `Bearer ${accessToken}`;
      } else {
        throw new Error("No access token received");
      }

      const { data } = await API.get("/auth/me", { credentials: "include" });

      if (data.businessId) {
        localStorage.setItem("businessDetails", JSON.stringify({ _id: data.businessId }));
      }

      setUser({
        userId: data.userId,
        name: data.name,
        email: data.email,
        role: data.role,
        subscriptionPlan: data.subscriptionPlan,
        businessId: data.businessId || null,
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
        const refreshed = await refreshAccessToken();
        if (!refreshed) {
          setError("❌ אימייל/שם משתמש או סיסמה שגויים");
          navigate("/login");
        }
      } else {
        setError("❌ שגיאה בשרת, נסה שוב");
      }
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // התנתקות
  const logout = async () => {
    setLoading(true);
    try {
      await API.post("/auth/logout", null);
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("businessDetails");
      delete API.defaults.headers['Authorization'];
      setSuccessMessage("✅ נותקת בהצלחה");
      navigate("/", { replace: true });
    } catch (e) {
      console.warn("Logout failed:", e);
    } finally {
      setLoading(false);
    }
  };

  // ניקוי הודעות הצלחה
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
        logout,
        refreshAccessToken,
      }}
    >
      {successMessage && <div className="global-success-toast">{successMessage}</div>}
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
