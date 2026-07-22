import React, { lazy, Suspense, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationsContext";
import { lazyWithPreload } from "../utils/lazyWithPreload";

const ForgotPassword = lazy(() => import("./ForgotPassword"));

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
};

type LoginResponse = {
  user?: LoginUser | null;
  redirectUrl?: string;
};

type ApiError = {
  message?: string;
};

export function LoginSkeleton() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#ffffff_0%,#f7f8ff_42%,#eef3ff_76%,#ffffff_100%)] px-6 py-20">
      <div className="mx-auto max-w-md overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 p-3 shadow-[0_28px_90px_rgba(79,70,229,0.14)] backdrop-blur-xl">
        <div className="rounded-[1.5rem] border border-slate-100 bg-white p-8">
          <div className="mb-8 h-8 w-40 animate-pulse rounded-full bg-slate-100" />
          <div className="mb-4 h-12 animate-pulse rounded-2xl bg-slate-100" />
          <div className="mb-4 h-12 animate-pulse rounded-2xl bg-slate-100" />
          <div className="h-12 animate-pulse rounded-full bg-indigo-100" />
        </div>
      </div>
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

      const loginResult = (await login(
        cleanEmail,
        form.password
      )) as LoginResponse;

      const loggedInUser = loginResult?.user;
      const role = String(loggedInUser?.role || "").toLowerCase();
      const redirectUrl = loginResult?.redirectUrl;

      const urlRedirect = new URLSearchParams(location.search).get("redirect");
      const finalRedirect = urlRedirect || redirectUrl;

      // Admin must always land on the admin panel — never client/business routes
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

  if (!dashPreloadDone || loading) {
    return <LoginSkeleton />;
  }

  const featureItems = [
    [t("login.featureCrmTitle"), t("login.featureCrmText")],
    [t("login.featureAppointmentsTitle"), t("login.featureAppointmentsText")],
    [t("login.featureAiTitle"), t("login.featureAiText")],
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#ffffff_0%,#f7f8ff_42%,#eef3ff_76%,#ffffff_100%)] text-slate-950">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-200/35 blur-3xl" />
        <div className="absolute -right-40 top-40 h-[420px] w-[420px] rounded-full bg-cyan-200/35 blur-3xl" />
        <div className="absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full bg-violet-200/35 blur-3xl" />
        <div className="absolute right-24 top-32 hidden h-56 w-56 bg-[radial-gradient(circle,#6366f1_1px,transparent_1px)] opacity-20 [background-size:16px_16px] lg:block" />
      </div>

      <main className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-5 py-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-20">
        {/* Left content */}
        <section className="hidden lg:block">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/85 px-5 py-2 text-sm font-black text-indigo-700 shadow-xl shadow-indigo-100/70 backdrop-blur">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-600 shadow-[0_0_16px_rgba(79,70,229,0.8)]" />
            {t("login.welcomeBadge")}
          </div>

          <h1 className="mt-8 max-w-2xl text-6xl font-black leading-[0.98] tracking-[-0.05em] text-slate-950 xl:text-7xl">
            {t("login.heroTitleTop")}
            <br />
            <span className="bg-gradient-to-r from-indigo-700 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
              {t("login.heroTitleHighlight")}
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-xl leading-8 text-slate-600">
            {t("login.heroSubtitle")}
          </p>

          <div className="mt-10 grid max-w-xl gap-4">
            {featureItems.map(([title, text], index) => (
              <div
                key={title}
                className="flex items-center gap-4 rounded-3xl border border-white/80 bg-white/80 p-5 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-100"
              >
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-base font-black text-white shadow-lg shadow-indigo-100">
                  {index + 1}
                </div>

                <div className="text-start">
                  <h3 className="text-lg font-black text-slate-950">
                    {title}
                  </h3>

                  <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Login card */}
        <section className="mx-auto w-full max-w-md">
          <div className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/75 p-2 shadow-[0_30px_100px_rgba(79,70,229,0.16)] backdrop-blur-xl sm:rounded-[2.5rem] sm:p-3">
            <div
              className="overflow-hidden rounded-[1.6rem] border border-slate-100 bg-white sm:rounded-[2rem]"
              aria-live="polite"
              aria-busy={loading}
            >
              <div className="relative overflow-hidden bg-slate-950 px-7 py-8 text-white">
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-indigo-500/35 blur-3xl" />
                  <div className="absolute -bottom-24 left-10 h-56 w-56 rounded-full bg-cyan-400/25 blur-3xl" />
                </div>

                <div className="relative text-start">
                  <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-xl font-black shadow-xl shadow-indigo-950/30">
                    B
                  </div>

                  <h2 className="text-3xl font-black tracking-[-0.04em]">
                    {t("login.cardTitle")}
                  </h2>

                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-300">
                    {t("login.cardSubtitle")}
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                noValidate
                className="bg-gradient-to-br from-white to-indigo-50/60 px-7 py-7"
              >
                <div className="text-start">
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-black text-slate-700"
                  >
                    {t("login.emailLabel")}{" "}
                    <span className="text-rose-500">*</span>
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
                    placeholder={t("login.emailPlaceholder")}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-70"
                  />
                </div>

                <div className="mt-5 text-start">
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-black text-slate-700"
                  >
                    {t("login.passwordLabel")}{" "}
                    <span className="text-rose-500">*</span>
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      disabled={loading}
                      required
                      autoComplete="current-password"
                      placeholder={t("login.passwordPlaceholder")}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 pe-14 text-sm font-semibold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-70"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={
                        showPassword
                          ? t("login.hidePassword")
                          : t("login.showPassword")
                      }
                      className={`absolute end-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border transition ${
                        showPassword
                          ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                          : "border-slate-200 bg-white text-slate-500 hover:text-indigo-700"
                      }`}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {loginError && (
                  <p
                    className="mt-5 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-bold leading-6 text-rose-600 text-start"
                    role="alert"
                  >
                    {loginError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  aria-live="polite"
                  className="group mt-7 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 px-8 py-4 text-base font-black text-white shadow-[0_18px_40px_rgba(99,102,241,0.28)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? t("login.loggingIn") : t("login.signIn")}

                  {!loading && (
                    <span className="ms-2 transition group-hover:translate-x-1">
                      →
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="mt-4 w-full rounded-full px-5 py-3 text-sm font-black text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-700"
                >
                  {t("login.forgotPassword")}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {showForgot && (
        <Suspense
          fallback={
            <div className="fixed inset-0 z-[9999] grid place-items-center bg-slate-950/40 p-6 backdrop-blur-xl">
              <div className="rounded-2xl bg-white px-6 py-4 text-sm font-black text-slate-700 shadow-xl">
                {t("login.loadingForgot")}
              </div>
            </div>
          }
        >
          <ForgotPassword closePopup={() => setShowForgot(false)} />
        </Suspense>
      )}
    </div>
  );
}
