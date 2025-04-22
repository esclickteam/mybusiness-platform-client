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
  const { login } = useAuth(); // שימוש ב־login מתוך AuthContext

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const identifier = isEmployeeLogin ? formData.username : formData.email;

    if (!identifier || !formData.password) {
      setError("נא למלא את כל השדות");
      setLoading(false);
      return;
    }

    try {
      const user = await login(identifier, formData.password);

      if (!user || !user.role) {
        setError("❌ לא ניתן לקבוע תפקיד משתמש");
        return;
      }

      // ✅ ניתוב לפי תפקיד
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

        <div className="login-extra-options">
          {!isEmployeeLogin ? (
            <button
              className="staff-login-link"
              onClick={() => {
                setIsEmployeeLogin(true);
                setError("");
              }}
            >
              👤 כניסת עובדים
            </button>
          ) : (
            <button
              className="staff-login-link"
              onClick={() => {
                setIsEmployeeLogin(false);
                setError("");
              }}
            >
              🔙 חזרה להתחברות רגילה
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

      {showForgot && (
        <ForgotPassword closePopup={() => setShowForgot(false)} />
      )}
    </div>
  );
};

export default Login;
