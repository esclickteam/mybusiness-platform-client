import React, { useState, lazy, Suspense, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationsContext";
import { lazyWithPreload } from "../utils/lazyWithPreload";

const ForgotPassword = lazy(() => import("./ForgotPassword"));
const DashboardPage = lazyWithPreload(() =>
  import("./business/dashboardPages/DashboardPage")
);

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
  const { login, error: authError } = useAuth();
  const { fetchNotifications } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

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

      const urlRedirect = new URLSearchParams(location.search).get("redirect");
      const finalRedirect = urlRedirect || redirectUrl;

      if (finalRedirect && finalRedirect.startsWith("/")) {
        navigate(finalRedirect, { replace: true });
      } else if (loggedInUser?.role === "affiliate") {
        navigate("/affiliate/dashboard", { replace: true });
      } else if (loggedInUser?.role === "business") {
        navigate(`/business/${loggedInUser.businessId}/dashboard`, {
          replace: true,
        });
      } else {
        navigate("/client/dashboard", { replace: true });
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

  if (!dashPreloadDone || loading) return <LoginSkeleton />;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#ffffff_0%,#f7f8ff_42%,#eef3ff_76%,#ffffff_100%)] text-slate-950">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-200/35 blur-3xl" />
        <div className="absolute -right-40 top-40 h-[420px] w-[420px] rounded-full bg-cyan-200/35 blur-3xl" />
        <div className="absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full bg-violet-200/35 blur-3xl" />
        <div className="absolute right-24 top-32 hidden h-56 w-56 bg-[radial-gradient(circle,#6366f1_1px,transparent_1px)] [background-size:16px_16px] opacity-20 lg:block" />
      </div>

      <main className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        {/* Left content */}
        <section className="hidden lg:block">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/85 px-5 py-2 text-sm font-black text-indigo-700 shadow-xl shadow-indigo-100/70 backdrop-blur">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-600 shadow-[0_0_16px_rgba(79,70,229,0.8)]" />
            WELCOME BACK
          </div>

          <h1 className="mt-8 max-w-2xl text-6xl font-black leading-[0.98] tracking-[-0.05em] text-slate-950 xl:text-7xl">
            Sign in to your
            <br />
            <span className="bg-gradient-to-r from-indigo-700 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
              business OS.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-xl leading-8 text-slate-600">
            Manage your business page, CRM, clients, appointments,
            collaborations and AI tools from one premium workspace.
          </p>

          <div className="mt-10 grid max-w-xl gap-4">
            {[
              ["CRM", "Track clients, leads and follow-ups"],
              ["Appointments", "Manage bookings and availability"],
              ["AI Tools", "Get insights and next-step recommendations"],
            ].map(([title, text], index) => (
              <div
                key={title}
                className="flex items-center gap-4 rounded-3xl border border-white/80 bg-white/80 p-5 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-100"
              >
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-base font-black text-white shadow-lg shadow-indigo-100">
                  {index + 1}
                </div>

                <div>
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
          <div className="overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/75 p-3 shadow-[0_30px_100px_rgba(79,70,229,0.16)] backdrop-blur-xl">
            <div
              className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white"
              aria-live="polite"
              aria-busy={loading}
            >
              <div className="relative overflow-hidden bg-slate-950 px-7 py-8 text-white">
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-indigo-500/35 blur-3xl" />
                  <div className="absolute -bottom-24 left-10 h-56 w-56 rounded-full bg-cyan-400/25 blur-3xl" />
                </div>

                <div className="relative">
                  <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-xl font-black shadow-xl shadow-indigo-950/30">
                    B
                  </div>

                  <h2 className="text-3xl font-black tracking-[-0.04em]">
                    Login
                  </h2>

                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-300">
                    Access your BizUply workspace and continue managing your
                    business.
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                noValidate
                className="bg-gradient-to-br from-white to-indigo-50/60 px-7 py-7"
              >
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-black text-slate-700"
                  >
                    Email <span className="text-rose-500">*</span>
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
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-70"
                    placeholder="you@example.com"
                  />
                </div>

                <div className="mt-5">
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-black text-slate-700"
                  >
                    Password <span className="text-rose-500">*</span>
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
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 pr-14 text-sm font-semibold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-70"
                      placeholder="Enter your password"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className={`absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border transition ${
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
                    className="mt-5 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-bold leading-6 text-rose-600"
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
                  {loading ? "Logging in..." : "Sign in"}
                  {!loading && (
                    <span className="ml-2 transition group-hover:translate-x-1">
                      →
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="mt-4 w-full rounded-full px-5 py-3 text-sm font-black text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-700"
                >
                  Forgot password?
                </button>

                <div className="mt-6 rounded-2xl border border-slate-100 bg-white/80 px-5 py-4 text-center shadow-sm">
                  <p className="text-sm font-semibold text-slate-600">
                    Don’t have an account?{" "}
                    <Link
                      to="/register"
                      className="font-black text-indigo-700 hover:text-violet-700"
                    >
                      Start 14-day free trial
                    </Link>
                  </p>
                </div>
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
                Loading reset password form...
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