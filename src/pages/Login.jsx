// src/pages/Login.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";
import ForgotPassword from "./ForgotPassword";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const { login, logout, error: contextError } = useAuth(); 
  const [identifier, setIdentifier] = useState("");  // יכול להיות אימייל או שם משתמש
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");

    if (!identifier.trim() || !password) {
      setLoginError("יש למלא אימייל/שם משתמש וסיסמה");
      return;
    }

    setLoading(true);
    try {
      const user = await login(
        identifier.trim(),
        password,
        { skipRedirect: true }
      );

      if (user.role === "business") {
        navigate(`/business/${user.businessId}/dashboard`, { replace: true });
      } else if (user.role === "customer") {
        navigate("/client/dashboard", { replace: true });
      } else {
        await logout();
        setLoginError("אין לך הרשאה להתחבר כאן");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setLoginError(contextError || err.response?.data?.error || "שגיאה בהתחברות");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>התחברות</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="identifier"
            placeholder="אימייל או שם משתמש"
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

        <div className="login-extra-options">
          <span
            className="forgot-password"
            onClick={() => setShowForgot(true)}
          >
            שכחת את הסיסמה?
          </span>

          <p className="signup-link">
            לא רשום?{" "}
            <Link to="/register" className="signup-link-text">
              הירשם עכשיו
            </Link>
          </p>

          <button
            className="staff-login-btn"
            onClick={() => navigate("/staff-login")}
            disabled={loading}
          >
            כניסת עובדים
          </button>
        </div>
      </div>

      {showForgot && <ForgotPassword closePopup={() => setShowForgot(false)} />}
    </div>
  );
}
