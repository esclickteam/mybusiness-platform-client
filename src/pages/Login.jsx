import React, { useState, lazy, Suspense, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationsContext";
import { lazyWithPreload } from "../utils/lazyWithPreload";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";

// ────────────────────────────────────────────────────────────────────────────────
//  Dynamic imports & pre‑loading
// ────────────────────────────────────────────────────────────────────────────────
const ForgotPassword = lazy(() => import("./ForgotPassword"));
const DashboardPage = lazyWithPreload(() =>
  import("./business/dashboardPages/DashboardPage")
);

// ────────────────────────────────────────────────────────────────────────────────
//  Skeleton Loader (Shimmer)
// ────────────────────────────────────────────────────────────────────────────────
export function LoginSkeleton() {
  return (
    <div className="login-skeleton">
      <div className="skeleton-input" />
      <div className="skeleton-input" />
      <div className="skeleton-button" />
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
//  Login Component
// ────────────────────────────────────────────────────────────────────────────────
export default function Login() {
  const { login, error: authError } = useAuth();
  const { fetchNotifications } = useNotifications();
  const navigate = useNavigate();

  // ─── State ────────────────────────────────────────────────────────────────
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [dashPreloadDone, setDashPreloadDone] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showForgot, setShowForgot] = useState(false);

  // ─── Pre‑load Dashboard bundle once on mount ───────────────────────────────
  useEffect(() => {
    DashboardPage.preload().finally(() => setDashPreloadDone(true));
  }, []);

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");

    // Basic client‑side validation
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

      // ─── Payment / Subscription Normalisation ────────────────────────────
      const normalizedHasPaid =
        loggedInUser?.hasPaid === true ||
        loggedInUser?.hasPaid === "true" ||
        loggedInUser?.hasPaid === 1;

      const isPaymentApproved =
        loggedInUser?.paymentStatus === "approved" || normalizedHasPaid;

      // ─── Routing matrix ──────────────────────────────────────────────────
      if (redirectUrl) {
        navigate(redirectUrl, { replace: true });
      } else if (loggedInUser?.role === "business" && isPaymentApproved) {
        navigate("/business-dashboard", { replace: true });
      } else if (loggedInUser?.role === "business") {
        navigate("/plans", { replace: true });
      } else {
        navigate("/client/dashboard", { replace: true });
      }

      // ─── Deferred notification fetch ( UX – allow redirect first ) ──────
      setTimeout(() => {
        if (typeof fetchNotifications === "function") fetchNotifications();
      }, 1000);
    } catch (err) {
      setLoginError(authError || err?.message || "אימייל או סיסמה שגויים");
    } finally {
      setLoading(false);
    }
  };

  // ─── LOADING STATES ───────────────────────────────────────────────────────
  if (!dashPreloadDone || loading) {
    return <LoginSkeleton />;
  }

  // ─── RENDER ───────────────────────────────────────────────────────────────
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
          />

          <input
            type="password"
            name="password"
            placeholder="סיסמה"
            value={form.password}
            onChange={handleChange}
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

        {/* ─── Extra options ─────────────────────────────────────────────── */}
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
