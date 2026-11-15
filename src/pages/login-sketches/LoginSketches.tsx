import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import API from "../../api";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { applyLanguageFromUrl, normalizeLanguage } from "../../i18n/localeUtils";
import { messageForLoginFailure } from "../../utils/loginFailureMessage";
import {
  DEFAULT_BIZUPLY_AUTH_PROVIDERS,
  fetchBizuplyAuthProviders,
  startBizuplySocialAuth,
  type SocialProvider,
} from "../../components/auth/socialAuth";
import LoginCompare from "./LoginCompare";
import "./loginSketches.css";

type Variant = "clean" | "premium";
type Mode = "password" | "code";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 23 23" aria-hidden="true">
      <path fill="#F25022" d="M1 1h10v10H1z" />
      <path fill="#7FBA00" d="M12 1h10v10H12z" />
      <path fill="#00A4EF" d="M1 12h10v10H1z" />
      <path fill="#FFB900" d="M12 12h10v10H12z" />
    </svg>
  );
}

export default function LoginSketches() {
  const { variant } = useParams();
  if (variant === "compare") return <LoginCompare />;
  if (variant !== "clean" && variant !== "premium") return <Navigate to="/login-sketches/clean" replace />;
  return <LoginSketch variant={variant} />;
}

function LoginSketch({ variant }: { variant: Variant }) {
  const { t, i18n } = useTranslation();
  const [search] = useSearchParams();
  useEffect(() => {
    const fromUrl = applyLanguageFromUrl();
    if (fromUrl && normalizeLanguage(i18n.language) !== fromUrl) void i18n.changeLanguage(fromUrl);
  }, [i18n, search]);
  const { login, loginWithToken } = useAuth() as {
    login: (email: string, password: string, opts?: { rememberMe?: boolean }) => Promise<unknown>;
    loginWithToken: (user: unknown, token: string, opts?: { rememberMe?: boolean }) => void;
  };
  const he = i18n.language.toLowerCase().startsWith("he");
  const premium = variant === "premium";
  const [mode, setMode] = useState<Mode>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [masked, setMasked] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [busy, setBusy] = useState<SocialProvider | "otp" | null>(null);
  const [providers, setProviders] = useState<SocialProvider[]>(DEFAULT_BIZUPLY_AUTH_PROVIDERS);

  useEffect(() => {
    const remembered = localStorage.getItem("bizuply_remember_email");
    if (remembered) setEmail(remembered);
    void fetchBizuplyAuthProviders().then(setProviders);
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = window.setTimeout(() => setCooldown((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  const resendCode = async () => {
    if (cooldown > 0) return;
    setBusy("otp");
    setError("");
    try {
      const { data } = await API.post("/auth/login/email/send", {});
      setCodeSent(true);
      if (data?.emailMasked) setMasked(String(data.emailMasked));
      setCooldown(Number(data?.cooldownSeconds || 60) || 60);
    } catch (err) {
      const body = (err as { response?: { data?: { code?: string; cooldownSeconds?: number } } }).response?.data;
      if (body?.code === "otp_cooldown") setCooldown(Number(body.cooldownSeconds || 60) || 60);
      setError(t(`login.errors.${body?.code || "otp_send_failed"}`, { defaultValue: t("login.errors.otp_send_failed") }));
    } finally {
      setBusy(null);
    }
  };

  const other = premium ? "clean" : "premium";
  const otherLabel = he
    ? premium ? "סקיצה א" : "סקיצה ב"
    : premium ? "Sketch A" : "Sketch B";

  const startSocial = (provider: SocialProvider) => {
    setBusy(provider);
    startBizuplySocialAuth(provider, {
      intent: "login",
      language: normalizeLanguage(i18n.language) || "en",
    });
  };

  const sendCode = async (value: string) => {
    const clean = value.trim().toLowerCase();
    if (!clean.includes("@")) {
      setError(t("login.errors.enterEmail"));
      return;
    }
    setBusy("otp");
    setError("");
    try {
      const { data } = await API.post("/auth/login/email/start", {
        email: clean,
        language: normalizeLanguage(i18n.language) || "en",
      });
      setCodeSent(true);
      setMasked(String(data?.emailMasked || clean));
      setEmail(clean);
      setCooldown(Number(data?.cooldownSeconds || 60) || 60);
    } catch (err) {
      const codeKey = (err as { response?: { data?: { code?: string } } }).response?.data?.code || "otp_send_failed";
      setError(t(`login.errors.${codeKey}`, { defaultValue: t("login.errors.otp_send_failed") }));
    } finally {
      setBusy(null);
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const data = new FormData(event.currentTarget);
    const emailValue = String(data.get("email") || email);
    if (mode === "code") {
      if (!codeSent) {
        await sendCode(emailValue);
        return;
      }
      const otp = String(data.get("loginOtp") || code).replace(/\D/g, "");
      if (otp.length !== 6) {
        setError(t("login.errors.otp_invalid"));
        return;
      }
      setLoading(true);
      try {
        const { data: body } = await API.post<{ user?: unknown; accessToken?: string }>(
          "/auth/login/email/verify",
          { code: otp, rememberMe },
        );
        if (!body?.accessToken || !body.user) {
          setError(t("login.errors.otp_invalid"));
          return;
        }
        loginWithToken(body.user, body.accessToken, { rememberMe });
      } catch (err) {
        const codeKey = (err as { response?: { data?: { code?: string } } }).response?.data?.code || "otp_invalid";
        setError(t(`login.errors.${codeKey}`, { defaultValue: t("login.errors.otp_invalid") }));
      } finally {
        setLoading(false);
      }
      return;
    }
    const passwordValue = String(data.get("password") || password);
    if (!emailValue.trim() || !passwordValue) {
      setError(t("login.errors.enterCredentials"));
      return;
    }
    setLoading(true);
    try {
      const clean = emailValue.trim().toLowerCase();
      if (rememberMe) localStorage.setItem("bizuply_remember_email", clean);
      else localStorage.removeItem("bizuply_remember_email");
      await login(clean, passwordValue, { rememberMe });
    } catch (err) {
      setError(messageForLoginFailure(err, t));
    } finally {
      setLoading(false);
    }
  };

  const shown = (["google", "microsoft"] as SocialProvider[]).filter((item) => providers.includes(item));

  const social = shown.length ? (
    <div className="lsk-social">
      {shown.map((provider) => (
        <button key={provider} type="button" disabled={busy !== null || loading} onClick={() => startSocial(provider)}>
          {provider === "google" ? <GoogleIcon /> : <MicrosoftIcon />}
          <span>{busy === provider ? t("login.redirecting") : t(provider === "google" ? "login.continueGoogle" : "login.continueMicrosoft")}</span>
        </button>
      ))}
    </div>
  ) : null;
  const divider = shown.length ? <p className="lsk-or">{t("login.or")}</p> : null;

  return (
    <div className={premium ? "lsk lsk-b" : "lsk lsk-a"} dir={i18n.dir()}>
      <Helmet>
        <title>{t("login.cardTitle")} | BizUply</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      {premium ? (
        <header className="lsk-bar">
          <img className="lsk-logo" src="/logo-mark.svg" alt="BizUply" width="148" height="44" />
          <div className="lsk-bar-tools">
            <Link className="lsk-switch" to={`/login-sketches/${other}`}>{otherLabel}</Link>
            <LanguageSwitcher />
          </div>
        </header>
      ) : (
        <>
          <Link className="lsk-switch" to={`/login-sketches/${other}`}>{otherLabel}</Link>
          <div className="lsk-lang"><LanguageSwitcher /></div>
        </>
      )}
      <form className="lsk-form" onSubmit={onSubmit} noValidate>
        {premium ? null : <img className="lsk-logo" src="/logo-mark.svg" alt="BizUply" width="176" height="52" />}
        <h1>{t("login.cardTitle")}</h1>
        {premium ? <p className="lsk-lead">{t("login.cardSubtitle")}</p> : null}
        {premium ? (
          <div className="lsk-modes" role="tablist" aria-label={t("login.cardTitle")}>
            <button type="button" role="tab" aria-selected={mode === "password"} onClick={() => { setMode("password"); setError(""); }}>
              {t("login.passwordLabel")}
            </button>
            <button type="button" role="tab" aria-selected={mode === "code"} onClick={() => { setMode("code"); setError(""); }}>
              {t("login.useCodeInstead")}
            </button>
          </div>
        ) : null}
        {premium ? null : social}
        {premium ? null : divider}
        <div>
          <label className="lsk-label" htmlFor="sketch-email">{t("login.emailLabel")}</label>
          <div className="lsk-field">
            <input
              id="sketch-email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              dir="ltr"
              value={email}
              disabled={loading || (mode === "code" && codeSent)}
              aria-invalid={Boolean(error) || undefined}
              placeholder="name@company.com"
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
        </div>
        {mode === "password" ? (
          <div>
            <label className="lsk-label" htmlFor="sketch-password">{t("login.passwordLabel")}</label>
            <div className="lsk-field">
              <input
                id="sketch-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                dir="ltr"
                value={password}
                disabled={loading}
                aria-invalid={Boolean(error) || undefined}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                type="button"
                className="lsk-eye"
                aria-label={showPassword ? t("login.hidePassword") : t("login.showPassword")}
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        ) : (
          <div className="lsk-code">
            <p className="lsk-hint">
              {t("login.otpHint", { email: masked || email || t("login.emailLabel") })}
            </p>
            {codeSent ? (
              <>
                <label className="lsk-label" htmlFor="sketch-otp">{t("login.otpLabel")}</label>
                <input
                  id="sketch-otp"
                  name="loginOtp"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  dir="ltr"
                  maxLength={6}
                  value={code}
                  placeholder="••••••"
                  aria-invalid={Boolean(error) || undefined}
                  onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                />
                <button type="button" className="lsk-resend" disabled={busy !== null || cooldown > 0} onClick={() => void resendCode()}>
                  {cooldown > 0
                    ? t("login.otpResendIn", { seconds: String(cooldown) })
                    : t("login.otpResend")}
                </button>
              </>
            ) : null}
          </div>
        )}
        <div className="lsk-row">
          {mode === "password" ? (
            <Link to="/forgot-password">{t("login.forgotPassword")}</Link>
          ) : <span />}
          <label className="lsk-check">
            <input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} />
            {t("login.rememberMe")}
          </label>
        </div>
        {mode === "password" && !premium ? (
          <button type="button" className="lsk-alt" onClick={() => { setMode("code"); setError(""); }}>
            {t("login.useCodeInstead")}
          </button>
        ) : null}
        {mode === "code" && !premium ? (
          <button type="button" className="lsk-alt" onClick={() => { setMode("password"); setError(""); }}>
            {t("login.usePasswordInstead")}
          </button>
        ) : null}
        {error ? <p className="lsk-error" role="alert">{error}</p> : null}
        <button className="lsk-submit" type="submit" disabled={loading || busy !== null} aria-busy={loading || undefined}>
          {mode === "code" && !codeSent
            ? busy === "otp" ? t("login.otpSending") : t("login.otpSend")
            : mode === "code" && loading
              ? t("login.otpVerifying")
              : loading
                ? t("login.loggingIn")
                : mode === "code"
                  ? t("login.otpVerify")
                  : t("login.signIn")}
        </button>
        {premium ? divider : null}
        {premium ? social : null}
        <p className="lsk-foot">
          {t("login.noAccount")}{" "}
          <Link to="/pricing">{t("login.registerCta")}</Link>
        </p>
      </form>
    </div>
  );
}
