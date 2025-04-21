// src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";  // שימוש ב-API מעודכן
import "../styles/Login.css";
import ForgotPassword from "./ForgotPassword";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();

  const refreshUserData = async () => {
    try {
      // כאן אתה שולח את הבקשה לנתיב הנכון
      const response = await API.get("/users/me", { withCredentials: true });

      console.log("📦 נתוני משתמש מעודכנים מהשרת:", response.data);

      const userData = {
        userId: response.data.userId,
        email: response.data.email,
        subscriptionPlan: response.data.subscriptionPlan,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error("❌ שגיאה בקבלת נתוני המשתמש:", error.response?.data || error.message);
      return null;
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("נא למלא את כל השדות.");
      return;
    }

    try {
      // כאן אתה שולח את הבקשה לנתיב ה-login
      const response = await API.post("/auth/login", formData, { withCredentials: true });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      if (response.data.user) {
        const userData = {
          userId: response.data.user.userId,
          email: response.data.user.email,
          subscriptionPlan: response.data.user.subscriptionPlan,
        };
        localStorage.setItem("user", JSON.stringify(userData));
      }

      const updatedUser = await refreshUserData();

      if (!updatedUser || !updatedUser.subscriptionPlan) {
        navigate("/plans");
        return;
      }

      if (updatedUser.subscriptionPlan === "free") {
        navigate("/create-business-page");
      } else {
        navigate("/business-dashboard");
      }
    } catch (err) {
      console.error("❌ שגיאה בהתחברות:", err);
      const status = err.response?.status;
      setError(
        err.response?.data?.error ||
        (status === 401
          ? "❌ אימייל או סיסמה שגויים"
          : status === 500
          ? "❌ שגיאת שרת פנימית. נסה שוב מאוחר יותר."
          : "❌ שגיאה לא ידועה. נסה שוב מאוחר יותר.")
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>התחברות</h2>
        <p className="login-subtitle">היכנסו לחשבונכם והתחילו לנהל את העסק שלכם</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="אימייל"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
          <input
            type="password"
            name="password"
            placeholder="סיסמה"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />
          <button type="submit" className="login-button">התחבר</button>
        </form>
        {error && <p className="error-message">{error}</p>}

        <p className="forgot-password-link">
          <span className="forgot-link" onClick={() => setShowForgotPassword(true)}>
            שכחתם את הסיסמה?
          </span>
        </p>

        <p className="register-link">
          אין לכם חשבון? <Link to="/register">הירשמו עכשיו</Link>
        </p>
      </div>

      {showForgotPassword && <ForgotPassword closePopup={() => setShowForgotPassword(false)} />}
    </div>
  );
};

export default Login;
