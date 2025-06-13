// src/pages/Login.jsx
import React, { useState, lazy, Suspense } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = lazy(() => import("./ForgotPassword"));

// טוען את הדשבורד בצורה דינמית עם אפשרות preload
const BusinessDashboardRoutes = lazy(() => import("../pages/business/BusinessDashboardRoutes"));
BusinessDashboardRoutes.preload = () => import("../pages/business/BusinessDashboardRoutes");

export default function Login() {
  const { login, error: authError, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
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
      await login(cleanEmail, password);

      // טען מראש את הדשבורד ברקע כדי לזרז טעינה בהמשך
      BusinessDashboardRoutes.preload();

      // נווט לדשבורד עם businessId אם קיים
      if (user?.businessId) {
        navigate(`/business/${user.businessId}/dashboard`);
      } else {
        // ניווט ברירת מחדל אם אין businessId
        navigate("/");
      }
    } catch (err) {
      setLoginError(authError || err?.message || "אימייל או סיסמה שגויים");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box" aria-live="polite" aria-busy={loading}>
        <h2>התחברות</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="אימייל"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
            autoComplete="email"
            aria-label="אימייל"
          />
          <input
            type="password"
            placeholder="סיסמה"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
            autoComplete="current-password"
            aria-label="סיסמה"
          />
          <button
            type="submit"
            className="login-button"
            disabled={loading}
            aria-live="polite"
          >
            {loading ? "🔄 מתחבר..." : "התחבר"}
          </button>
        </form>

        {loginError && (
          <p className="error-message" role="alert">
            {loginError}
          </p>
        )}

        <div className="login-extra-options">
          <span
            className="forgot-password"
            onClick={() => setShowForgot(true)}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setShowForgot(true);
            }}
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

      {showForgot && (
        <Suspense fallback={<div>טוען טופס איפוס סיסמה...</div>}>
          <ForgotPassword closePopup={() => setShowForgot(false)} />
        </Suspense>
      )}
    </div>
  );
}
