import React, { lazy, Suspense, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Bot,
  CalendarDays,
  Eye,
  EyeOff,
  Globe2,
  Lock,
  Mail,
  Megaphone,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationsContext";
import { lazyWithPreload } from "../utils/lazyWithPreload";
import BizuplyLoader from "../components/ui/BizuplyLoader";

const ForgotPassword = lazy(() => import("./ForgotPassword"));

const DashboardPage = lazyWithPreload(() =>
  import("./business/dashboardPages/DashboardPage")
);

const LOGO_SRC = "/bizuply%20logo.png";

type LoginForm = {
  email: string;
  password: string;
};

type LoginUser = {
  role?: string;
  businessId?: string;
};

type LoginResponse = {
  user?: LoginUser | null;
  redirectUrl?: string;
};

type ApiError = {
  message?: string;
};

const FEATURE_CARDS = [
  {
    title: "CRM",
    subtitle: "לידים וניהול",
    icon: Users,
  },
  {
    title: "תורים",
    subtitle: "וזמינות",
    icon: CalendarDays,
  },
  {
    title: "אוטומציות",
    subtitle: "חכמות",
    icon: Bot,
  },
  {
    title: "בניית אתר",
    subtitle: "מקצועי",
    icon: Globe2,
  },
  {
    title: "לידים ממטא",
    subtitle: "פייסבוק ואינסטגרם",
    icon: Megaphone,
  },
] as const;

export function LoginSkeleton() {
  return <BizuplyLoader fullScreen label="Loading..." />;
}

function BrandMark({ size = "md" }: { size?: "sm" | "md" }) {
  const box = size === "sm" ? "h-10 w-10" : "h-12 w-12";
  const text = size === "sm" ? "text-xl" : "text-2xl";

  return (
    <div className="inline-flex items-center gap-3">
      <img
        src={LOGO_SRC}
        alt="Bizuply"
        className={`${box} rounded-2xl object-contain shadow-sm`}
      />
      <span className={`${text} font-black tracking-tight text-slate-900`}>
        Bizuply
      </span>
    </div>
  );
}

export default function Login() {
  const { t } = useTranslation();
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
  const [showForgot, setShowForgot] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  useEffect(() => {
    DashboardPage.preload().finally(() => {
      setDashPreloadDone(true);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError("");

    if (!form.email.trim() || !form.password) {
      setLoginError(t("login.errors.enterCredentials"));
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
      } else if (
        finalRedirect &&
        finalRedirect.startsWith("/") &&
        !finalRedirect.startsWith("/client/dashboard")
      ) {
        navigate(finalRedirect, { replace: true });
      } else if (role === "affiliate") {
        navigate("/affiliate/dashboard", { replace: true });
      } else if (role === "business") {
        navigate(`/business/${loggedInUser?.businessId}/dashboard`, {
          replace: true,
        });
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

      setLoginError(
        authError || apiError.message || t("login.errors.incorrectCredentials")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const remembered = localStorage.getItem("bizuply_remember_email");
    if (remembered) {
      setForm((prev) => ({ ...prev, email: remembered }));
      setRememberMe(true);
    }
  }, []);

  if (!dashPreloadDone || loading) {
    return <LoginSkeleton />;
  }

  return (
    <div
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-[#F7F8FC] text-slate-800"
      style={{ fontFamily: '"Heebo", "Assistant", "Rubik", sans-serif' }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-16 h-[420px] w-[420px] rounded-full bg-violet-200/35 blur-3xl" />
        <div className="absolute left-10 top-10 hidden h-40 w-40 bg-[radial-gradient(circle,#94a3b8_1.2px,transparent_1.2px)] opacity-30 [background-size:14px_14px] lg:block" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-sky-200/25 blur-3xl" />
      </div>

      <main className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-5 py-12 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:py-16">
        {/* Login card — first in RTL so it sits on the right */}
        <section className="mx-auto w-full max-w-[440px] lg:mx-0 lg:justify-self-start">
          <div className="rounded-[32px] border border-white bg-white p-7 shadow-[0_28px_80px_rgba(15,23,42,0.10)] sm:p-9">
            <div className="flex flex-col items-center text-center">
              <BrandMark size="sm" />
              <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900">
                התחברות
              </h1>
              <p className="mt-2 text-sm font-semibold text-slate-500">
                התחברו כדי לנהל את העסק שלכם ב-Bizuply
              </p>
              <div className="mt-5 flex w-full items-center gap-3">
                <span className="h-px flex-1 bg-slate-200" />
                <span className="h-2 w-2 rounded-full border border-slate-300" />
                <span className="h-px flex-1 bg-slate-200" />
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
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
                    aria-label={
                      showPassword
                        ? t("login.hidePassword")
                        : t("login.showPassword")
                    }
                    className="absolute left-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-1 text-sm font-semibold">
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-slate-500 transition hover:text-violet-700"
                >
                  שכחתם סיסמה?
                </button>

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
            </form>
          </div>
        </section>

        {/* Marketing panel — visually on the left, content centered */}
        <section className="hidden text-center lg:flex lg:flex-col lg:items-center lg:justify-center">
          <BrandMark />

          <h2 className="mt-8 max-w-xl text-4xl font-black leading-[1.15] tracking-tight text-slate-900 xl:text-5xl">
            להתחבר אל{" "}
            <span className="bg-gradient-to-l from-sky-500 via-indigo-500 to-violet-600 bg-clip-text text-transparent">
              מערכת ההפעלה
            </span>
            <br />
            <span className="bg-gradient-to-l from-sky-500 via-indigo-500 to-violet-600 bg-clip-text text-transparent">
              העסקית
            </span>
          </h2>

          <div className="mt-6 flex w-48 items-center gap-2">
            <span className="h-px flex-1 bg-gradient-to-l from-transparent via-sky-400 to-violet-500" />
            <span className="h-2 w-2 rounded-full bg-violet-500" />
          </div>

          <div className="mt-8 flex max-w-xl flex-wrap items-stretch justify-center gap-3">
            {FEATURE_CARDS.map(({ title, subtitle, icon: Icon }) => (
              <div
                key={title}
                className="flex w-[148px] flex-col items-center rounded-[22px] border border-white bg-white px-4 py-4 text-center shadow-[0_10px_28px_rgba(15,23,42,0.06)]"
              >
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-violet-50 text-violet-600">
                  <Icon size={18} />
                </span>
                <strong className="mt-3 text-sm font-black text-slate-900">
                  {title}
                </strong>
                <span className="mt-1 text-xs font-semibold text-slate-500">
                  {subtitle}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {showForgot && (
        <Suspense
          fallback={
            <BizuplyLoader fullScreen label={t("login.loadingForgot")} />
          }
        >
          <ForgotPassword closePopup={() => setShowForgot(false)} />
        </Suspense>
      )}
    </div>
  );
}
