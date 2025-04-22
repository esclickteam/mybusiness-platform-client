// src/pages/Login.jsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";
import ForgotPassword from "./ForgotPassword";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", username: "", password: "" });
  const [isEmployeeLogin, setIsEmployeeLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth(); // login returns the user object

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // לפי מצב – מזהה בכניסה
    const identifier = isEmployeeLogin ? formData.username.trim() : formData.email.trim();
    const password   = formData.password;

    if (!identifier || !password) {
      setError("נא למלא את כל השדות");
      setLoading(false);
      return;
    }

    try {
      // login מחזיר אובייקט user
      const user = await login(identifier, password);

      if (!user || !user.role) {
        setError("❌ לא ניתן לקבוע תפקיד משתמש");
        setLoading(false);
        return;
      }

      // ניתוב לפי תפקיד
      let dashboardPath = "/";
      switch (user.role) {
        case "admin":
          dashboardPath = "/admin/dashboard";
          break;
        case "manager":
          dashboardPath = "/manager/dashboard";
          break;
        case "worker":
          dashboardPath = "/staff/dashboard";
          break;
        case "business":
          // ניתוב פשוט ל־/dashboard
          dashboardPath = "/dashboard";
          break;
        case "customer":
          dashboardPath = "/client-dashboard";
          break;
        default:
          dashboardPath = "/";
      }

      navigate(dashboardPath);
    } catch (err) {
      const status = err.response?.status;
      setError(
        status === 401
          ? "❌ שם משתמש או סיסמה שגויים"
          : "❌ שגיאה בשרת, נסו שוב מאוחר יותר"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{isEmployeeLogin ? "כניסת צוות" : "התחברות"}</h2>
        <form onSubmit={handleSubmit}>
          {isEmployeeLogin ? (
            <input
              type="text"
              name="username"
              placeholder="שם משתמש"
              value={formData.username}
              onChange={handleChange}
              autoComplete="username"
            />
          ) : (
            <input
              type="email"
              name="email"
              placeholder="אימייל"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
          )}
          <input
            type="password"
            name="password"
            placeholder="סיסמה"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
          />
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "🔄 מתחבר..." : "התחבר"}
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}

        <div className="login-extra-options">
          {isEmployeeLogin ? (
            <button
              className="staff-login-link"
              onClick={() => {
                setIsEmployeeLogin(false);
                setError("");
              }}
            >
              🔙 חזרה להתחברות רגילה
            </button>
          ) : (
            <button
              className="staff-login-link"
              onClick={() => {
                setIsEmployeeLogin(true);
                setError("");
              }}
            >
              👥 כניסת צוות
            </button>
          )}

          <div className="bottom-links">
            <span
              className="forgot-password"
              onClick={() => setShowForgot(true)}
            >
              שכחת את הסיסמה?
            </span>

            {!isEmployeeLogin && (
              <>
                <span className="separator">|</span>
                <Link to="/register" className="register-link">
                  אין לך חשבון? הירשם עכשיו
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {showForgot && <ForgotPassword closePopup={() => setShowForgot(false)} />}
    </div>
  );
};

export default Login;
