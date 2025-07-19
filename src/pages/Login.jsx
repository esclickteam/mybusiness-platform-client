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
      const { user: loggedInUser, redirectUrl } = await login(
        cleanEmail,
        form.password
      );

      const normalizedHasPaid =
        loggedInUser?.hasPaid === true ||
        loggedInUser?.hasPaid === "true" ||
        loggedInUser?.hasPaid === 1;
      const isPaymentApproved =
        loggedInUser?.paymentStatus === "approved" && normalizedHasPaid;

      if (redirectUrl) {
        if (redirectUrl === "/dashboard" && loggedInUser?.businessId) {
          navigate(`/business/${loggedInUser.businessId}/dashboard`, {
            replace: true,
          });
        } else {
          navigate(redirectUrl, { replace: true });
        }
      } else if (loggedInUser?.role === "affiliate") {
        navigate("/affiliate/dashboard", { replace: true });
      } else if (loggedInUser?.role === "business" && isPaymentApproved) {
        navigate(`/business/${loggedInUser.businessId}/dashboard`, {
          replace: true,
        });
      } else if (loggedInUser?.role === "business") {
        navigate("/plans", { replace: true });
      } else {
        navigate("/client/dashboard", { replace: true });
      }

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
                {showPassword ? (
                  <svg
                    width="24"
                    height="24"
                    fill="none"
                    stroke="#222"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <ellipse cx="12" cy="12" rx="9" ry="6" stroke="#222" />
                    <circle cx="12" cy="12" r="2" fill="#222" />
                  </svg>
                ) : (
                  <svg
                    width="24"
                    height="24"
                    fill="none"
                    stroke="#222"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <ellipse cx="12" cy="12" rx="9" ry="6" stroke="#222" />
                    <circle cx="12" cy="12" r="2" fill="#222" />
                  </svg>
                )}
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

            <button
              type="button"
              className="forgot-inside-btn"
              onClick={() => setShowForgot(true)}
            >
              שכחת סיסמה?
            </button>
          </div>

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
