import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";
import ForgotPassword from "./ForgotPassword";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();               // ← קבלת הפונקציה מה־context
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [loading, setLoading]       = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");

    if (!email.trim() || !password) {
      setLoginError("יש למלא אימייל וסיסמה");
      return;
    }

    setLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      // ← קוראים ל־context.login, שמטפל ב־API, שמירת טוקן ו־fetch של user
      const user = await login(cleanEmail, password);

      const role = (user.role || "").toLowerCase();
      switch (role) {
        case "business":
          navigate(`/business/${user.businessId}/dashboard`, { replace: true });
          break;
        case "customer":
          navigate("/client/dashboard", { replace: true });
          break;
        case "admin":
        case "worker":
        case "manager":
        case "מנהל":
          navigate("/dashboard", { replace: true });
          break;
        default:
          setLoginError("אין לך הרשאה להתחבר כאן");
      }
    } catch (err) {
      console.error("Login failed:", err);
      if (err.response?.status === 403) {
        setLoginError("אין לך הרשאה להתחבר כאן");
      } else {
        setLoginError(err.response?.data?.error || "אימייל או סיסמה שגויים");
      }
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
            type="email"
            placeholder="אימייל"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={loading}
            required
          />
          <input
            type="password"
            placeholder="סיסמה"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
            required
          />
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "🔄 מתחבר..." : "התחבר"}
          </button>
        </form>

        {loginError && <p className="error-message">{loginError}</p>}

        <div className="login-extra-options">
          <span
            className="forgot-password"
            onClick={() => setShowForgot(true)}
          >
            שכחת את הסיסמה?
          </span>
          <p className="signup-link">
            לא רשום?{' '}
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
