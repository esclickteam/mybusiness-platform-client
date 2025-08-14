import React, { useState, lazy, Suspense, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationsContext";
import { lazyWithPreload } from "../utils/lazyWithPreload";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";

const ForgotPassword = lazy(() => import("./ForgotPassword"));
const DashboardPage = lazyWithPreload(() =>
  import("./business/dashboardPages/DashboardPage")
);

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
  const { fetchNotifications } = useNotifications();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [dashPreloadDone, setDashPreloadDone] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    DashboardPage.preload().finally(() => setDashPreloadDone(true));
  }, []);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");

    if (!form.email.trim() || !form.password) {
      setLoginError("יש למלא אימייל וסיסמה");
      return;
    }

    setLoading(true);
    try {
      const cleanEmail = form.email.trim().toLowerCase();
      await login(cleanEmail, form.password); 
      // אין כאן navigate – ההפניה תיעשה ב־AuthContext
      setTimeout(() => {
        if (typeof fetchNotifications === "function") fetchNotifications();
      }, 1000);
    } catch (err) {
      setLoginError(authError || err?.message || "אימייל או סיסמה שגויים");
    } finally {
      setLoading(false);
    }
  };

  if (!dashPreloadDone || loading) {
    return <LoginSkeleton />;
  }

  return (
    <div className="login-container">
      <div className="login-box" aria-live="polite" aria-busy={loading}>
        <h2>התחברות</h2>

        <form onSubmit={handleSubmit} noValidate>
          <input
            type="email"
            name="email"
            placeholder="אימייל"
            value={form.email}
            onChange={handleChange}
            disabled={loading}
            required
            autoComplete="email"
            aria-label="אימייל"
            className="login-input"
          />

          <div className="password-wrapper">
            <div className="password-row">
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="password-toggle-btn"
                aria-label={showPassword ? "הסתר סיסמה" : "הצג סיסמה"}
                tabIndex={-1}
              >
                {/* כאן אפשר לשים אייקון הצגה/הסתרה */}
                👁
              </button>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="סיסמה"
                value={form.password}
                onChange={handleChange}
                disabled={loading}
                required
                autoComplete="current-password"
                aria-label="סיסמה"
                className="password-input"
              />
            </div>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
            aria-live="polite"
          >
            {loading ? "🔄 מתחבר..." : "התחבר"}
          </button>

          <button
            type="button"
            className="forgot-inside-btn"
            onClick={() => setShowForgot(true)}
          >
            שכחת סיסמה?
          </button>
        </form>

        {loginError && (
          <p className="error-message" role="alert">
            {loginError}
          </p>
        )}

        <div className="login-extra-options">
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
