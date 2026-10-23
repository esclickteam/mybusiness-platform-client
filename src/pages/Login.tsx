import React, { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationsContext";
import { lazyWithPreload } from "../utils/lazyWithPreload";
import AuthShell, { AuthCard } from "../components/auth/AuthShell";
import { LoginFormSkeleton } from "../components/auth/LoginFormSkeleton";
import { usePartnerHostBranding } from "../hooks/usePartnerHostBranding";
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
import { messageForLoginFailure } from "../utils/loginFailureMessage";
import { legacyWhatsAppApiLoginRedirect } from "../utils/whatsappApiPortal";
import API from "../api";
import { clearRefreshDead, refreshAccessTokenOnce } from "../utils/tokenRefresh";
import SocialAuthButtons from "../components/auth/SocialAuthButtons";
import {
  DEFAULT_BIZUPLY_AUTH_PROVIDERS,
  fetchBizuplyAuthProviders,
  oauthErrorMessage,
  startBizuplySocialAuth,
  type SocialProvider,
} from "../components/auth/socialAuth";

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
  subscriptionPlan?: string | null;
  accountKind?: string | null;
};

type LoginResponse = {
  user?: LoginUser | null;
  redirectUrl?: string;
};

export default function Login() {
  const location = useLocation();
  const whatsappApiLogin = legacyWhatsAppApiLoginRedirect(location.search);
  if (whatsappApiLogin) return <Navigate to={whatsappApiLogin} replace />;
  return <BusinessLogin />;
}

function BusinessLogin() {
  const { login, loginWithToken } = useAuth() as {
    login: (...args: unknown[]) => Promise<LoginResponse>;
    loginWithToken: (
      user: unknown,
      token: string,
      opts?: { skipRedirect?: boolean }
    ) => void;
  };
  const { fetchNotifications } = useNotifications();
  const { i18n, t } = useTranslation();
  const { whiteLabelEnabled } = usePartnerHostBranding();

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
  const [socialProviders, setSocialProviders] = useState<SocialProvider[]>(DEFAULT_BIZUPLY_AUTH_PROVIDERS);
  const [socialBusy, setSocialBusy] = useState<SocialProvider | "oauth" | "link" | "otp" | null>(null);
  const [linkEmail, setLinkEmail] = useState<string>("");
  const [linkEmailMasked, setLinkEmailMasked] = useState<string>("");
  const [linkProvider, setLinkProvider] = useState<string>("");
  const [linkHasPassword, setLinkHasPassword] = useState<boolean>(true);
  const [linkMethod, setLinkMethod] = useState<"otp" | "password">("otp");
  const [linkOtp, setLinkOtp] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpCooldown, setOtpCooldown] = useState<number>(0);

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
  const oauthSuccess = searchParams.get("oauth") === "success";
  const linkRequired = searchParams.get("oauth") === "link_required";
  const oauthProvider = searchParams.get("provider");
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
    let alive = true;
    void fetchBizuplyAuthProviders().then((list) => {
      if (alive) setSocialProviders(list);
    });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const fromQuery = oauthErrorMessage(
      searchParams.get("oauth_error"),
      oauthProvider,
      t
    );
    if (fromQuery) setLoginError(fromQuery);
  }, [oauthProvider, searchParams, t]);

  const finishOauthSession = async () => {
    clearRefreshDead();
    const accessToken = await refreshAccessTokenOnce();
    const { data } = await API.get("/auth/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    loginWithToken(data, accessToken, { skipRedirect: true });
    const loggedInUser = data as LoginUser;
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
      accountKind: loggedInUser?.accountKind ?? null,
      enabledModules: loggedInUser?.enabledModules ?? null,
      subscriptionPlan: loggedInUser?.subscriptionPlan ?? null,
      queryRedirect,
      storedRedirect: null,
    });
    if (queryRedirect && isCompatibleRedirect(role, queryRedirect)) {
      rememberPostLoginRedirect(queryRedirect);
    } else {
      clearPostLoginRedirect();
    }
    navigate(finalRedirect, { replace: true });
  };

  useEffect(() => {
    if (!oauthSuccess) return;
    let cancelled = false;
    setSocialBusy("oauth");
    (async () => {
      try {
        await finishOauthSession();
      } catch {
        if (!cancelled) {
          setSocialBusy(null);
          setLoginError(t("login.oauth.errors.session"));
          navigate("/login", { replace: true });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oauthSuccess]);

  useEffect(() => {
    if (!linkRequired) return;
    let alive = true;
    (async () => {
      try {
        const { data } = await API.get("/auth/oauth/link-preview");
        if (!alive) return;
        setLinkEmail(String(data?.email || ""));
        setLinkEmailMasked(String(data?.emailMasked || data?.email || ""));
        setLinkProvider(String(data?.provider || oauthProvider || ""));
        const hasPassword = data?.hasPassword !== false;
        setLinkHasPassword(hasPassword);
        const methods = Array.isArray(data?.methods) ? data.methods : [];
        const preferOtp = methods.includes("otp") || !hasPassword;
        setLinkMethod(preferOtp ? "otp" : "password");
        setOtpCooldown(Number(data?.otpCooldownSeconds || 0) || 0);
      } catch {
        if (!alive) return;
        setLoginError(t("login.oauth.errors.state_invalid"));
      }
    })();
    return () => {
      alive = false;
    };
  }, [linkRequired, oauthProvider, t]);

  useEffect(() => {
    if (otpCooldown <= 0) return;
    const id = window.setInterval(() => {
      setOtpCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [otpCooldown]);

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
        accountKind: loggedInUser?.accountKind ?? null,
        enabledModules: loggedInUser?.enabledModules ?? null,
        subscriptionPlan: loggedInUser?.subscriptionPlan ?? null,
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

      const lang = normalizeLanguage(searchParams.get("lang"));
      const withReviewLang = (path) => {
        if (!lang) return path;
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
      setLoginError(messageForLoginFailure(err, t));
    } finally {
      setLoading(false);
    }
  };

  const handleSocialStart = (provider: SocialProvider) => {
    setLoginError("");
    setSocialBusy(provider);
    startBizuplySocialAuth(provider, {
      intent: "login",
      language: normalizeLanguage(i18n.language) || "en",
      redirect: queryRedirect,
    });
  };

  const providerLabel =
    linkProvider === "microsoft" ? t("login.providerMicrosoft") : t("login.providerGoogle");

  const handleSendLinkOtp = async () => {
    setLoginError("");
    setSocialBusy("otp");
    try {
      const { data } = await API.post("/auth/oauth/link-otp/send", {});
      setOtpSent(true);
      setOtpCooldown(Number(data?.cooldownSeconds || 60) || 60);
      if (data?.emailMasked) setLinkEmailMasked(String(data.emailMasked));
    } catch (err) {
      const apiErr = err as {
        response?: { data?: { code?: string; cooldownSeconds?: number } };
      };
      const code = apiErr.response?.data?.code || "otp_send_failed";
      if (code === "otp_cooldown") {
        setOtpCooldown(Number(apiErr.response?.data?.cooldownSeconds || 60) || 60);
      }
      setLoginError(oauthErrorMessage(code, linkProvider, t) || t("login.oauth.errors.otp_send_failed"));
    } finally {
      setSocialBusy(null);
    }
  };

  const handleLinkSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError("");
    const formData = new FormData(e.currentTarget);
    setSocialBusy("link");
    try {
      if (linkMethod === "otp") {
        const code = String(formData.get("otp") || linkOtp || "").replace(/\D/g, "");
        if (code.length !== 6) {
          setLoginError(t("login.oauth.errors.otp_invalid"));
          setSocialBusy(null);
          return;
        }
        await API.post("/auth/oauth/link", { code });
      } else {
        const passwordValue = String(formData.get("password") || form.password || "");
        if (!passwordValue) {
          setLoginError(t("login.oauth.errors.incorrect_password"));
          setSocialBusy(null);
          return;
        }
        await API.post("/auth/oauth/link", { password: passwordValue });
      }
      await finishOauthSession();
    } catch (err) {
      const apiErr = err as { response?: { data?: { code?: string } } };
      const fallback = linkMethod === "otp" ? "otp_invalid" : "incorrect_password";
      setLoginError(
        oauthErrorMessage(apiErr.response?.data?.code || fallback, linkProvider, t) ||
          t(`login.oauth.errors.${fallback}`)
      );
      setSocialBusy(null);
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
        <form
          onSubmit={linkRequired ? handleLinkSubmit : handleSubmit}
          noValidate
          className="space-y-4"
        >
          {checkoutSuccess ? (
            <p
              className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-bold leading-6 text-emerald-800"
              role="status"
            >
              {t("login.checkoutSuccess")}
            </p>
          ) : null}
          {oauthSuccess || socialBusy === "oauth" ? (
            <p
              className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-sm font-bold leading-6 text-violet-800"
              role="status"
            >
              {t("login.oauth.completing")}
            </p>
          ) : null}
          {linkRequired ? (
            <>
              <p
                className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-bold leading-6 text-amber-800"
                role="status"
              >
                {t("login.oauth.linkFound", { provider: providerLabel })}
              </p>
              {linkHasPassword ? (
                <div
                  className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1"
                  role="tablist"
                  aria-label={t("login.oauth.verifyMethods")}
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={linkMethod === "otp"}
                    onClick={() => {
                      setLinkMethod("otp");
                      setLoginError("");
                    }}
                    className={`h-10 rounded-xl text-sm font-bold transition ${
                      linkMethod === "otp"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {t("login.oauth.methodOtp")}
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={linkMethod === "password"}
                    onClick={() => {
                      setLinkMethod("password");
                      setLoginError("");
                    }}
                    className={`h-10 rounded-xl text-sm font-bold transition ${
                      linkMethod === "password"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {t("login.oauth.methodPassword")}
                  </button>
                </div>
              ) : null}

              {linkMethod === "otp" ? (
                <div className="space-y-3 text-start">
                  <p className="text-sm font-semibold leading-6 text-slate-600">
                    {t("login.oauth.otpHint", {
                      email: linkEmailMasked || linkEmail || t("login.emailLabel"),
                    })}
                  </p>
                  <button
                    type="button"
                    onClick={() => void handleSendLinkOtp()}
                    disabled={socialBusy !== null || otpCooldown > 0}
                    className="inline-flex h-11 w-full items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm font-bold text-slate-800 transition hover:border-violet-200 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {socialBusy === "otp"
                      ? t("login.oauth.otpSending")
                      : otpCooldown > 0
                        ? t("login.oauth.otpResendIn", { seconds: String(otpCooldown) })
                        : otpSent
                          ? t("login.oauth.otpResend")
                          : t("login.oauth.otpSend")}
                  </button>
                  <div>
                    <label
                      htmlFor="otp"
                      className="mb-2 block text-sm font-bold text-slate-700"
                    >
                      {t("login.oauth.otpLabel")}
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      id="otp"
                      name="otp"
                      value={linkOtp}
                      onChange={(e) =>
                        setLinkOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      disabled={loading || socialBusy === "link"}
                      required={linkMethod === "otp"}
                      maxLength={6}
                      placeholder="••••••"
                      dir="ltr"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-center text-lg font-bold tracking-[0.35em] text-slate-900 outline-none transition placeholder:tracking-[0.35em] placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-100 disabled:opacity-70"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-start">
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    {t("login.passwordLabel")}
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute end-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      disabled={loading || socialBusy === "link"}
                      required={linkMethod === "password"}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      dir="ltr"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-white pe-11 ps-12 text-start text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-100 disabled:opacity-70"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? t("login.hidePassword") : t("login.showPassword")}
                      className="absolute start-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                  <div className="pt-2 text-sm font-semibold">
                    <Link
                      to="/forgot-password"
                      className="text-slate-500 transition hover:text-violet-700"
                    >
                      {t("login.forgotPassword")}
                    </Link>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <SocialAuthButtons
                providers={socialProviders}
                labels={{
                  google: t("login.continueGoogle"),
                  microsoft: t("login.continueMicrosoft"),
                }}
                orLabel={t("login.or")}
                redirectingLabel={t("login.redirecting")}
                busy={socialBusy}
                onStart={handleSocialStart}
              />
              <div className="text-start">
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  {t("login.emailLabel")}
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute end-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
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
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white pe-11 ps-11 text-start text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-100 disabled:opacity-70"
                  />
                </div>
              </div>

              <div className="text-start">
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  {t("login.passwordLabel")}
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute end-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
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
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white pe-11 ps-12 text-start text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-100 disabled:opacity-70"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? t("login.hidePassword") : t("login.showPassword")}
                    className="absolute start-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
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
            </>
          )}

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
            disabled={loading || socialBusy !== null}
            className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-sky-500 via-indigo-500 to-violet-600 text-base font-black text-white shadow-[0_14px_30px_rgba(99,102,241,0.35)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {linkRequired
              ? socialBusy === "link"
                ? t("login.oauth.linking")
                : t("login.oauth.linkSubmit")
              : loading
                ? t("login.loggingIn")
                : t("login.signIn")}
            {!loading && socialBusy !== "link" && socialBusy !== "otp" ? (
              <span aria-hidden className="rtl-flip">
                ←
              </span>
            ) : null}
          </button>

          {linkRequired ? (
            <p className="pt-2 text-center text-sm font-semibold text-slate-600">
              {t("login.oauth.linkKeepData")}
            </p>
          ) : (
            <p className="pt-2 text-center text-sm font-semibold text-slate-600">
              {t("login.noAccount")}{" "}
              <Link
                to={whiteLabelEnabled ? "/plans" : "/pricing"}
                className="font-black text-violet-700 transition hover:text-indigo-700"
              >
                {t("login.registerCta")}
              </Link>
            </p>
          )}
        </form>
      </AuthCard>
    </AuthShell>
  );
}
