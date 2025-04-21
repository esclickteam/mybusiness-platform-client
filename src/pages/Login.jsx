// src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import "../styles/Login.css";
import ForgotPassword from "./ForgotPassword";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isEmployeeLogin, setIsEmployeeLogin] = useState(false);
  const navigate = useNavigate();

  const refreshUserData = async () => {
    try {
      const response = await API.get("/users/me");
      const userData = {
        userId: response.data.userId || response.data._id,
        email: response.data.email,
        subscriptionPlan: response.data.subscriptionPlan,
        role: response.data.role,
        isTempPassword: response.data.isTempPassword,
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
    setLoading(true);

    const { email, username, password } = formData;
    if ((!email && !username) || !password) {
      setError("נא למלא את כל השדות.");
      setLoading(false);
      return;
    }

    try {
      const response = await API.post("/auth/login", formData, { withCredentials: true });
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      const updatedUser = await refreshUserData();
      if (!updatedUser) {
        setError("⚠️ התחברות נכשלה.");
        setLoading(false);
        return;
      }
      if (updatedUser.isTempPassword) {
        navigate("/change-password");
        return;
      }

      switch (updatedUser.role) {
        case "business":
          navigate("/dashboard");
          break;
        case "customer":
          navigate("/client-dashboard");
          break;
        case "worker":
          navigate("/worker-dashboard");
          break;
        case "manager":
          navigate("/manager-dashboard");
          break;
        case "admin":
          navigate("/admin-dashboard");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      const status = err.response?.status;
      setError(
        err.response?.data?.error ||
          (status === 401
            ? "❌ אימייל או סיסמה שגויים"
            : "❌ שגיאה לא צפויה, נסו שוב מאוחר יותר")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>התחברות</h2>
        <p className="login-subtitle">
          {isEmployeeLogin
            ? "כניסת עובדים"
            : "היכנסו לחשבון שלכם והתחילו לנהל את העסק"}
        </p>

        <form onSubmit={handleSubmit}>
          {isEmployeeLogin && (
            <input
              type="text"
              name="username"
              placeholder="שם משתמש"
              value={formData.username}
              onChange={handleChange}
              autoComplete="username"
              required
            />
          )}

          {!isEmployeeLogin && (
            <input
              type="email"
              name="email"
              placeholder="אימייל"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          )}

          <input
            type="password"
            name="password"
            placeholder="סיסמה"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "🔄 מתחבר..." : "כניסת עובדים"}
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}

        <p className="forgot-password-link">
          <span className="forgot-link" onClick={() => setShowForgotPassword(true)}>
            שכחתם את הסיסמה?
          </span>
        </p>

        {!isEmployeeLogin && (
          <p className="register-link">
            אין לכם חשבון? <Link to="/register">הירשמו עכשיו</Link>
          </p>
        )}

        <p className="employee-login-toggle">
          <span
            onClick={() => setIsEmployeeLogin(!isEmployeeLogin)}
            style={{ cursor: "pointer", color: "#6a1b9a" }}
          >
            {isEmployeeLogin ? "🔙 חזרה להתחברות רגילה" : "👤 כניסת עובדים"}
          </span>
        </p>
      </div>

      {showForgotPassword && (
        <ForgotPassword closePopup={() => setShowForgotPassword(false)} />
      )}
    </div>
  );
};

export default Login;
