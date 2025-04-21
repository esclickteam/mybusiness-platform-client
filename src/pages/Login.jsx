// src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import "../styles/Login.css";
import ForgotPassword from "./ForgotPassword";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", username: "", password: "" });
  const [isEmployeeLogin, setIsEmployeeLogin] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // בדיקת שדות
    if (
      (!isEmployeeLogin && (!formData.email || !formData.password)) ||
      ( isEmployeeLogin && (!formData.username || !formData.password))
    ) {
      setError("נא למלא את כל השדות");
      setLoading(false);
      return;
    }

    try {
      // בונים payload לפי מצב
      const payload = isEmployeeLogin
        ? { username: formData.username, password: formData.password }
        : { email: formData.email, password: formData.password };

      const res = await API.post("/auth/login", payload, { withCredentials: true });

      // שומרים טוקן
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      // שומרים משתמש
      const user = res.data.user;
      localStorage.setItem("user", JSON.stringify(user));

      // ניתוב לפי תפקיד
      switch (user.role) {
        case "business":
          navigate("/dashboard");
          break;
        case "customer":
          navigate("/client-dashboard");
          break;
        case "worker":
          navigate("/staff/dashboard");
          break;
        case "manager":
          navigate("/manager/dashboard");
          break;
        case "admin":
          navigate("/admin/dashboard");
          break;
        default:
          navigate("/");
      }
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
        <h2>{isEmployeeLogin ? "כניסת עובדים" : "התחברות"}</h2>
        <form onSubmit={handleSubmit}>
          {isEmployeeLogin ? (
            <input
              type="text"
              name="username"
              placeholder="שם משתמש"
              value={formData.username}
              onChange={handleChange}
              autoComplete="username"
              required
            />
          ) : (
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
            {loading ? "🔄 מתחבר..." : "התחבר"}
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}

        <div className="login-links">
          <button
            className="toggle-login-mode"
            onClick={() => {
              setIsEmployeeLogin(!isEmployeeLogin);
              setError("");
            }}
          >
            {isEmployeeLogin
              ? "🔙 חזרה להתחברות רגילה"
              : "👤 כניסת עובדים / מנהלים / אדמין"}
          </button>

          <span
            className="forgot-link"
            onClick={() => setShowForgot(true)}
          >
            שכחת את הסיסמה?
          </span>

          {!isEmployeeLogin && (
            <Link to="/register" className="register-link">
              אין לך חשבון? הירשם עכשיו
            </Link>
          )}
        </div>
      </div>

      {showForgot && (
        <ForgotPassword closePopup={() => setShowForgot(false)} />
      )}
    </div>
  );
};

export default Login;
