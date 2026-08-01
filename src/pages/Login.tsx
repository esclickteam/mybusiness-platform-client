import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationsContext";
import { lazyWithPreload } from "../utils/lazyWithPreload";
import AuthShell, { AuthCard } from "../components/auth/AuthShell";
import { LoginFormSkeleton } from "../components/auth/LoginFormSkeleton";

const DashboardPage = lazyWithPreload(() =>
  import("./business/dashboardPages/DashboardPage")
);

type LoginForm = {
  email: string;
  password: string;
};

type LoginUser = {
  role?: string;
  businessId?: string;
  enabledModules?: string[] | null;
};

type LoginResponse = {
  user?: LoginUser | null;
  redirectUrl?: string;
};

type ApiError = {
  message?: string;
};

export default function Login() {
  const { login, error: authError } = useAuth();
  const { fetchNotifications } = useNotifications();

  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [dashPreloadDone, setDashPreloadDone] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  useEffect(() => {
    DashboardPage.preload().finally(() => {
      setDashPreloadDone(true);
    });
  }, []);

  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const checkoutSuccess = searchParams.get("checkout") === "success";
  const checkoutEmail = searchParams.get("email") || "";

  useEffect(() => {
    const remembered = localStorage.getItem("bizuply_remember_email");
    const emailFromCheckout = checkoutEmail.trim().toLowerCase();
    if (emailFromCheckout) {
      setForm((prev) => ({ ...prev, email: emailFromCheckout }));
      setRememberMe(true);
      return;
    }
    if (remembered) {
      setForm((prev) => ({ ...prev, email: remembered }));
      setRememberMe(true);
    }
  }, [checkoutEmail]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError("");

    if (!form.email.trim() || !form.password) {
      setLoginError("אנא הזינו אימייל וסיסמה");
      return;
    }

    setLoading(true);

    try {
      const cleanEmail = form.email.trim().toLowerCase();

      if (rememberMe) {
        localStorage.setItem("bizuply_remember_email", cleanEmail);
      } else {
        localStorage.removeItem("bizuply_remember_email");
      }

      const loginResult = (await login(
        cleanEmail,
        form.password
      )) as LoginResponse;

      const loggedInUser = loginResult?.user;
      const role = String(loggedInUser?.role || "").toLowerCase();
      const redirectUrl = loginResult?.redirectUrl;
      const urlRedirect = new URLSearchParams(location.search).get("redirect");
      const finalRedirect = urlRedirect || redirectUrl;

      if (role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (role === "marketer") {
        navigate("/marketer/dashboard", { replace: true });
      } else if (
        finalRedirect &&
        finalRedirect.startsWith("/") &&
        !finalRedirect.startsWith("/client/dashboard")
      ) {
        navigate(finalRedirect, { replace: true });
      } else if (role === "affiliate") {
        navigate("/affiliate/dashboard", { replace: true });
      } else if (role === "business") {
        const limited = Array.isArray(loggedInUser?.enabledModules)
          ? loggedInUser.enabledModules
          : null;
        const dest =
          limited?.includes("crm")
            ? `/business/${loggedInUser?.businessId}/dashboard/crm`
            : `/business/${loggedInUser?.businessId}/dashboard`;
        navigate(dest, { replace: true });
      } else if (role === "customer") {
        navigate("/client/dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }

      setTimeout(() => {
        if (typeof fetchNotifications === "function") {
          fetchNotifications();
        }
      }, 1000);
    } catch (err) {
      const apiError = err as ApiError;
      setLoginError(authError || apiError.message || "אימייל או סיסמה שגויים");
    } finally {
      setLoading(false);
    }
  };

  if (!dashPreloadDone || loading) {
    return <LoginFormSkeleton />;
  }

  return (
    <AuthShell>
      <AuthCard
        title="התחברות"
        subtitle="התחברו כדי לנהל את העסק שלכם ב-BizUply"
      >
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {checkoutSuccess ? (
            <p
              className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-bold leading-6 text-emerald-800"
              role="status"
            >
              התשלום התקבל בהצלחה. החשבון נפתח — התחברו עם האימייל והסיסמה שבחרתם בהרשמה.
            </p>
          ) : null}

          <div className="text-right">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-bold text-slate-700"
            >
              אימייל
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                disabled={loading}
                required
                autoComplete="email"
                placeholder="name@company.com"
                dir="ltr"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white pr-11 pl-4 text-left text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-100 disabled:opacity-70"
              />
            </div>
          </div>

          <div className="text-right">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-bold text-slate-700"
            >
              סיסמה
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                disabled={loading}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                dir="ltr"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white pr-11 pl-12 text-left text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-100 disabled:opacity-70"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "הסתר סיסמה" : "הצג סיסמה"}
                className="absolute left-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-1 text-sm font-semibold">
            <Link
              to="/forgot-password"
              className="text-slate-500 transition hover:text-violet-700"
            >
              שכחתם סיסמה?
            </Link>

            <label className="inline-flex cursor-pointer items-center gap-2 text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
              />
              זכור אותי
            </label>
          </div>

          {loginError ? (
            <p
              className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-bold leading-6 text-rose-600"
              role="alert"
            >
              {loginError}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-sky-500 via-indigo-500 to-violet-600 text-base font-black text-white shadow-[0_14px_30px_rgba(99,102,241,0.35)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "מתחבר..." : "התחברות"}
            {!loading ? <span aria-hidden>←</span> : null}
          </button>

          <p className="pt-2 text-center text-sm font-semibold text-slate-600">
            אין חשבון?{" "}
            <Link
              to="/pricing"
              className="font-black text-violet-700 transition hover:text-indigo-700"
            >
              הירשמו עכשיו
            </Link>
          </p>
        </form>
      </AuthCard>
    </AuthShell>
  );
}
