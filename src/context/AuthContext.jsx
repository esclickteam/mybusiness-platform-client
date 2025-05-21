// src/context/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const initRan = useRef(false);

  useEffect(() => {
    if (initRan.current) return;
    initRan.current = true;

    const initialize = async () => {
      setLoading(true);
      try {
        const { data } = await API.get("/auth/me");

        let realBusinessId = data.businessId || null;
        if (data.role === "business" && !realBusinessId) {
          try {
            const resp = await API.get("/business/my");
            const bizObj = resp.data.business || resp.data;
            realBusinessId = bizObj._id || bizObj.businessId || null;
          } catch {
            realBusinessId = null;
          }
        }

        if (data.role === "business" && !realBusinessId) {
          setError(
            "⚠️ לעסק שלך אין מזהה עסק (businessId) תקין. פנה לתמיכה או צור עסק חדש."
          );
          setUser(null);
        } else {
          setUser({
            userId: data.userId,
            name: data.name,
            email: data.email,
            role: data.role,
            subscriptionPlan: data.subscriptionPlan,
            businessId: realBusinessId,
          });
        }
      } catch {
        setUser(null);
        setError(null);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    if (user?.businessId) {
      startSSEConnection(user.businessId);
    }
  }, [user]);

  const login = async (identifier, password, options = { skipRedirect: false }) => {
    setLoading(true);
    setError(null);

    try {
      let response;
      if (identifier.includes("@")) {
        response = await API.post("/auth/login", {
          email: identifier.toLowerCase(),
          password,
        });
      } else {
        response = await API.post("/auth/staff-login", {
          username: identifier,
          password,
        });
      }

      if (!response.data.token) {
        throw new Error("❌ לא התקבל טוקן מהשרת");
      }
      localStorage.setItem("token", response.data.token);

      const { data } = await API.get("/auth/me");

      let realBusinessId = data.businessId || null;
      if (data.role === "business" && !realBusinessId) {
        try {
          const resp = await API.get("/business/my");
          const bizObj = resp.data.business || resp.data;
          realBusinessId = bizObj._id || bizObj.businessId || null;
        } catch {
          realBusinessId = null;
        }
      }

      if (data.role === "business" && !realBusinessId) {
        setError(
          "⚠️ לעסק שלך אין מזהה עסק (businessId) תקין. פנה לתמיכה או צור עסק חדש."
        );
        setUser(null);
        return null;
      }

      setUser({
        userId: data.userId,
        name: data.name,
        email: data.email,
        role: data.role,
        subscriptionPlan: data.subscriptionPlan,
        businessId: realBusinessId,
      });

      startSSEConnection(realBusinessId);

      if (!options.skipRedirect) {
        let path = "/";
        switch (data.role) {
          case "business":
            path = `/business/${realBusinessId}/dashboard`;
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
          : e.message || "❌ שגיאה בשרת, נסה שוב"
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
    } catch {
      console.warn("⚠️ Logout failed");
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      setLoading(false);
      navigate("/", { replace: true });
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, initialized, error, login, staffLogin, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
