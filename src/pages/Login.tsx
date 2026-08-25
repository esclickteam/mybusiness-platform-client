import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationsContext";
import { lazyWithPreload } from "../utils/lazyWithPreload";
import AuthShell, { AuthCard } from "../components/auth/AuthShell";
import { LoginFormSkeleton } from "../components/auth/LoginFormSkeleton";
import { isPartnerWhiteLabelHostname } from "../lib/partnerHost.mjs";
import {
  clearPostLoginRedirect,
  isCompatibleRedirect,
  rememberPostLoginRedirect,
  resolvePostLoginDestination,
  sanitizeInternalRedirect,
} from "../utils/safeInternalRedirect";
import { useTranslation } from "react-i18next";
import {
  applyLanguageFromUrl,
  normalizeLanguage,
} from "../i18n/localeUtils";

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
  hasAccess?: boolean;
  mustChangePassword?: boolean;
  isTempPassword?: boolean;
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
  const { i18n, t } = useTranslation();

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

  useEffect(() => {
    const fromUrl = applyLanguageFromUrl();
    if (fromUrl && normalizeLanguage(i18n.language) !== fromUrl) {
      void i18n.changeLanguage(fromUrl);
    }
  }, [i18n, location.search]);

  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const checkoutSuccess = searchParams.get("checkout") === "success";
  const checkoutEmail = searchParams.get("email") || "";
  const stateFrom = useMemo(() => {
    const fromState = (location.state as { from?: string } | null)?.from;
    return sanitizeInternalRedirect(fromState);
  }, [location.state]);
  const queryRedirect = useMemo(
    () =>
      sanitizeInternalRedirect(searchParams.get("redirect")) || stateFrom,
    [searchParams, stateFrom]
  );

  useEffect(() => {
    if (queryRedirect && queryRedirect !== "/") {
      rememberPostLoginRedirect(queryRedirect);
    }
  }, [queryRedirect]);

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

    // Prefer live DOM values so browser autofill (dots in the field without
    // a React onChange) still submits email/password correctly.
    const formData = new FormData(e.currentTarget);
    const emailValue = String(formData.get("email") || form.email || "");
    const passwordValue = String(formData.get("password") || form.password || "");

    if (!emailValue.trim() || !passwordValue) {
      setLoginError(t("login.errors.enterCredentials"));
      return;
    }

    setLoading(true);

    try {
      const cleanEmail = emailValue.trim().toLowerCase();

      if (rememberMe) {
        localStorage.setItem("bizuply_remember_email", cleanEmail);
      } else {
        localStorage.removeItem("bizuply_remember_email");
      }

      const loginResult = (await login(cleanEmail, passwordValue, {
        skipRedirect: true,
      })) as LoginResponse;

      const loggedInUser = loginResult?.user;
      const role = String(loggedInUser?.role || "").toLowerCase();

      if (
        role === "business" &&
        (loggedInUser?.mustChangePassword || loggedInUser?.isTempPassword)
      ) {
        clearPostLoginRedirect();
        navigate("/change-password", { replace: true });
        return;
      }

      const finalRedirect = resolvePostLoginDestination({
        role: loggedInUser?.role,
        businessId: loggedInUser?.businessId,
        hasAccess: loggedInUser?.hasAccess !== false,
        enabledModules: loggedInUser?.enabledModules ?? null,
        queryRedirect,
        storedRedirect: loginResult?.redirectUrl || null,
      });

      // Keep only a role-compatible deep link. Stale `/`, `/dashboard`, or
      // `/client/dashboard` (or a server payload for the wrong product area)
      // must not win over the partner home on the next auth bootstrap.
      if (queryRedirect && isCompatibleRedirect(role, queryRedirect)) {
        rememberPostLoginRedirect(queryRedirect);
      } else {
        clearPostLoginRedirect();
      }

      const lang = searchParams.get("lang");
      const withReviewLang = (path) => {
        if (lang !== "en" && lang !== "he") return path;
        const [pathname, search = ""] = String(path || "/").split("?");
        const params = new URLSearchParams(search);
        params.set("lang", lang);
        const query = params.toString();
        return query ? `${pathname}?${query}` : pathname;
      };

      navigate(withReviewLang(finalRedirect), { replace: true });

      setTimeout(() => {
        if (typeof fetchNotifications === "function") {
          fetchNotifications();
        }
      }, 1000);
    } catch (err) {
      const apiError = err as ApiError;
      setLoginError(authError || apiError.message || t("login.errors.incorrectCredentials"));
    } finally {
      setLoading(false);
    }
  };

  // Keep the form mounted while submitting so API errors stay visible.
  // Skeleton is only for the initial dashboard-chunk preload.
  if (!dashPreloadDone) {
    return <LoginFormSkeleton />;
  }

  return (
    <AuthShell>
      <AuthCard
        title={t("login.cardTitle")}
        subtitle={t("login.cardSubtitle")}
      >
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {checkoutSuccess ? (
            <p
              className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-bold leading-6 text-emerald-800"
              role="status"
            >
              {t("login.checkoutSuccess")}
            </p>
          ) : null}

          <div className="text-right">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-bold text-slate-700"
            >
              {t("login.emailLabel")}
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
              {t("login.passwordLabel")}
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
                aria-label={showPassword ? t("login.hidePassword") : t("login.showPassword")}
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
              {t("login.forgotPassword")}
            </Link>

            <label className="inline-flex cursor-pointer items-center gap-2 text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
              />
              {t("login.rememberMe")}
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
            {loading ? t("login.loggingIn") : t("login.signIn")}
            {!loading ? <span aria-hidden>←</span> : null}
          </button>

          <p className="pt-2 text-center text-sm font-semibold text-slate-600">
            {t("login.noAccount")}{" "}
            <Link
              to={
                isPartnerWhiteLabelHostname(
                  typeof window !== "undefined" ? window.location.hostname : ""
                )
                  ? "/plans"
                  : "/pricing"
              }
              className="font-black text-violet-700 transition hover:text-indigo-700"
            >
              {t("login.registerCta")}
            </Link>
          </p>
        </form>
      </AuthCard>
    </AuthShell>
  );
}
