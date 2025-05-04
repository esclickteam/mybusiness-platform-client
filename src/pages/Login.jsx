// src/pages/Login.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";
import ForgotPassword from "./ForgotPassword";
import { Link, useNavigate } from "react-router-dom";

export default function Login({ staff = false }) {
  const { login, logout, error: contextError } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword]     = useState("");
  const [loading, setLoading]       = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const navigate = useNavigate();

  // אם props.staff הוא true, זו כניסת עובדים
  const isStaffLogin = staff;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");

    if (!identifier.trim() || !password) {
      setLoginError("יש למלא שם משתמש וסיסמה");
      return;
    }

    setLoading(true);
    try {
      // עובדים משתמשים רק בשם משתמש — לא יוריד ל־lowercase
      const idValue = identifier.trim();
      const user = await login(idValue, password, { skipRedirect: true });

      // ניווט לפי תפקיד
      if (user.role === "business") {
        navigate(`/business/${user.businessId}/dashboard`, { replace: true });
      } else if (user.role === "customer") {
        navigate("/client/dashboard", { replace: true });
      } else {
        // כל תפקיד staff: פשוט לוח בקרה משותפת לעובדים
        navigate("/staff/dashboard", { replace: true });
      }
    } catch (err) {
      console.error("Login failed:", err);
      setLoginError(
        contextError ||
        err.response?.data?.error ||
        "שם משתמש או סיסמה שגויים"
      );
      await logout();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{isStaffLogin ? "כניסת עובדים" : "התחברות"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="identifier"
            placeholder={isStaffLogin ? "שם משתמש" : "אימייל או שם משתמש"}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            disabled={loading}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="סיסמה"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "🔄 מתחבר..." : "התחבר"}
          </button>
        </form>

        {(loginError || contextError) && (
          <p className="error-message">{loginError || contextError}</p>
        )}

        {!isStaffLogin && (
          <div className="login-extra-options">
            <span
              className="forgot-password"
              onClick={() => setShowForgot(true)}
            >
              שכחת את הסיסמה?
            </span>
            <p className="signup-link">
              לא רשום? <Link to="/register">הרשמה</Link>
            </p>
            <button
              className="staff-login-btn"
              onClick={() => navigate("/staff-login")}
              disabled={loading}
            >
              כניסת עובדים
            </button>
          </div>
        )}
      </div>

      {showForgot && <ForgotPassword closePopup={() => setShowForgot(false)} />}
    </div>
  );
}
