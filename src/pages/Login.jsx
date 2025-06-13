import React, { useState, lazy, Suspense, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { lazyWithPreload } from "../utils/lazyWithPreload";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";

// טופס שכחת סיסמה בטעינה דינמית
const ForgotPassword = lazy(() => import("./ForgotPassword"));

// טעינה מוקדמת של הדשבורד
const DashboardPage = lazyWithPreload(() => import("./business/dashboardPages/DashboardPage"));

// Skeleton UI לטעינת התחברות
export function LoginSkeleton() {
  return (
    <div className="login-skeleton">
      <div className="skeleton-input" />
      <div className="skeleton-input" />
      <div className="skeleton-button" />
    </div>
  );
}

export default function Login() {
  const { login, error: authError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const navigate = useNavigate();

  // שימוש ב-useRef לשמירת מצב טעינה מוקדמת
  const dashboardPreloaded = useRef(false);

  const handleInputChange = (setter) => (e) => {
    if (!dashboardPreloaded.current) {
      setDashboardLoading(true);
      DashboardPage.preload().then(() => setDashboardLoading(false));
      dashboardPreloaded.current = true;
    }
    setter(e.target.value);
  };

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
      // ניווט מתבצע בתוך login או ב-AuthContext
    } catch (err) {
      setLoginError(authError || err?.message || "אימייל או סיסמה שגויים");
    } finally {
      setLoading(false);
    }
  };

  if (dashboardLoading) {
    return <LoginSkeleton />;
  }

  return (
    <div className="login-container">
      <div className="login-box" aria-live="polite" aria-busy={loading}>
        <h2>התחברות</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="אימייל"
            value={email}
            onChange={handleInputChange(setEmail)}
            disabled={loading}
            required
            autoComplete="email"
            aria-label="אימייל"
          />
          <input
            type="password"
            placeholder="סיסמה"
            value={password}
            onChange={handleInputChange(setPassword)}
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
