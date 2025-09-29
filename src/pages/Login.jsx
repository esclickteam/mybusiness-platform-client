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
      setLoginError("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      const cleanEmail = form.email.trim().toLowerCase();
      const { user: loggedInUser, redirectUrl } = await login(
        cleanEmail,
        form.password
      );

      if (redirectUrl) {
        navigate(redirectUrl, { replace: true });
      } else {
        if (loggedInUser?.role === "affiliate") {
          navigate("/affiliate/dashboard", { replace: true });
        } else if (loggedInUser?.role === "business") {
          navigate(`/business/${loggedInUser.businessId}/dashboard`, {
            replace: true,
          });
        } else {
          navigate("/client/dashboard", { replace: true });
        }
      }

      setTimeout(() => {
        if (typeof fetchNotifications === "function") fetchNotifications();
      }, 1000);
    } catch (err) {
      setLoginError(authError || err?.message || "Incorrect email or password");
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
        <h2>Login</h2>

        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
              required
              autoComplete="email"
              className="login-input"
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">
              Password <span className="required">*</span>
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                disabled={loading}
                required
                autoComplete="current-password"
                className="password-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="password-toggle-inside"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? (
                  // 👁️ עין פתוחה
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  // 👁️‍🗨️ עין סגורה
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.67 21.67 0 0 1 5.06-6.94M9.88 9.88A3 3 0 0 0 12 15a3 3 0 0 0 2.12-5.12M1 1l22 22" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="login-button"
            disabled={loading}
            aria-live="polite"
          >
            {loading ? "🔄 Logging in..." : "Sign in"}
          </button>

          <button
            type="button"
            className="forgot-inside-btn"
            onClick={() => setShowForgot(true)}
          >
            Forgot password?
          </button>
        </form>

        {loginError && (
          <p className="error-message" role="alert">
            {loginError}
          </p>
        )}

        <div className="login-extra-options">
          <p className="signup-link">
            Don’t have an account yet?{" "}
            <Link to="/register" className="signup-link-text">
              Start here with a 14-day free trial
            </Link>
          </p>
          <button
            className="staff-login-btn"
            onClick={() => navigate("/staff-login")}
            disabled={loading}
          >
            Staff login
          </button>
        </div>
      </div>

      {showForgot && (
        <Suspense fallback={<div>Loading reset password form...</div>}>
          <ForgotPassword closePopup={() => setShowForgot(false)} />
        </Suspense>
      )}
    </div>
  );
}
