// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import API, {
  setAccessToken as setAPIAccessToken,
  setRefreshToken as setAPIRefreshToken,
} from "../api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, _setAccessToken] = useState(localStorage.getItem("accessToken"));
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const initRan = useRef(false);

  const setAccessToken = token => {
    _setAccessToken(token);
    setAPIAccessToken(token);
    token ? localStorage.setItem("accessToken", token) : localStorage.removeItem("accessToken");
  };

  const saveBusinessDetails = data => {
    if (data.business) {
      localStorage.setItem("businessDetails", JSON.stringify(data.business));
    } else if (data.businessId) {
      localStorage.setItem("businessDetails", JSON.stringify({ _id: data.businessId }));
    } else {
      localStorage.removeItem("businessDetails");
    }
  };

  async function refreshToken() {
    const rToken = localStorage.getItem("refreshToken");
    if (!rToken) throw new Error("No refresh token");
    const res = await API.post("/auth/refresh-token", { refreshToken: rToken });
    const newAT = res.data.accessToken || res.data.token;
    const newRT = res.data.refreshToken;
    setAccessToken(newAT);
    if (newRT) {
      localStorage.setItem("refreshToken", newRT);
      setAPIRefreshToken(newRT);
    }
    return newAT;
  }

  useEffect(() => {
  if (initRan.current) return;
  initRan.current = true;

  (async () => {
    setLoading(true);
    try {
      const storedAT = localStorage.getItem("accessToken");
      const storedRT = localStorage.getItem("refreshToken");

      // קודם כל מגדירים את הטוקנים במערכת
      if (storedAT) setAccessToken(storedAT);
      if (storedRT) setAPIRefreshToken(storedRT);

      // נסה לרענן טוקן אם יש refreshToken
      if (storedRT) {
        try {
          await refreshToken();
        } catch (err) {
          console.error("שגיאת רענון טוקן:", err);
          // טוקן לא בתוקף – ממשיכים למצב לא מחובר
        }
      }

      // נסה תמיד להביא את המשתמש (אם יש accessToken)
      try {
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
      } catch (err) {
        console.error("שגיאת הבאת משתמש:", err);
        setUser(null);
        setAccessToken(null);
        localStorage.removeItem("businessDetails");
      }
    } catch (err) {
      console.error("שגיאה כללית ב-AuthContext:", err);
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem("businessDetails");
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  })();
}, []);


  const login = async (identifier, password) => {
    setLoading(true);
    try {
      const clean = identifier.trim();
      const isEmail = clean.includes("@");
      const endpoint = isEmail ? "/auth/login" : "/auth/staff-login";
      const payload = isEmail
        ? { email: clean.toLowerCase(), password }
        : { username: clean, password };

      const response = await API.post(endpoint, payload);
      const newAT = response.data.accessToken || response.data.token;
      const newRT = response.data.refreshToken;

      setAccessToken(newAT);
      if (newRT) {
        localStorage.setItem("refreshToken", newRT);
        setAPIRefreshToken(newRT);
      }

      const u = response.data.user;
      const userData = {
        userId:           u.userId,
        name:             u.name,
        email:            u.email,
        role:             u.role,
        subscriptionPlan: u.subscriptionPlan,
        businessId:       u.businessId || null,
      };
      setUser(userData);
      saveBusinessDetails(u);
      return userData;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await API.post("/auth/logout");
    } catch {}
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("businessDetails");
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, accessToken, loading, initialized, login, logout, refreshToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
