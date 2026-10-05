import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";

import API from "../../api";
import { useAuth } from "../../context/AuthContext";
import { applyLanguageFromUrl, coerceSupportedLanguage, getTextDirection, normalizeLanguage } from "../../i18n/localeUtils";
import { clearRefreshDead, refreshAccessTokenOnce } from "../../utils/tokenRefresh";
import { clearPostLoginRedirect, resolvePostLoginDestination } from "../../utils/safeInternalRedirect";
import { messageForLoginFailure } from "../../utils/loginFailureMessage";
import { isWhatsAppApiPortalUser, whatsappApiPortalHome } from "../../utils/whatsappApiPortal";
import { startSocialAuth, useWhatsAppApiAuthConfig, type SocialProvider } from "../../components/whatsappApiAuth/authConfig";
import { oauthErrorMessage, useWaAuthCopy } from "../../components/whatsappApiAuth/copy";
import SocialAuthButtons from "../../components/whatsappApiAuth/SocialAuthButtons";
import { PRIVACY_URL, SIGN_UP_URL, TERMS_URL, WHATSAPP_SITE_URL } from "../public/whatsapp/siteConfig";
import { LanguagePicker } from "../public/whatsapp/SiteChrome";
import "../public/whatsapp/whatsappSite.css";

type SessionUser = {
  role?: string;
  businessId?: string | null;
  subscriptionPlan?: string | null;
  hasAccess?: boolean;
  enabledModules?: string[] | null;
  mustChangePassword?: boolean;
  isTempPassword?: boolean;
  isGuidedDemo?: boolean;
  isShowcaseDemo?: boolean;
};

const PROVIDER_LABEL: Record<string, string> = { google: "Google", microsoft: "Microsoft" };

/** Standalone WhatsApp API customers sign in here (`/login?product=whatsapp_api`), never on the CRM login. */
export default function WhatsAppApiLoginPage() {
  const id = useId();
  const { t, i18n } = useTranslation();
  const copy = useWaAuthCopy();
  const config = useWhatsAppApiAuthConfig();
  const { login, loginWithToken } = useAuth() as any;
  const navigate = useNavigate();
  const location = useLocation();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const lang = coerceSupportedLanguage(i18n.language);
  const dir = getTextDirection(lang);
  const language = normalizeLanguage(i18n.language) || "en";

  const oauthSuccess = params.get("oauth") === "success";
  const checkoutReturn = params.get("checkout") === "whatsapp_api";
  const checkoutEmail = (params.get("email") || "").trim().toLowerCase();
  const signupRef = params.get("ref") || "";

  const [email, setEmail] = useState(checkoutEmail);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState<SocialProvider | "email" | null>(null);
  const [error, setError] = useState<string>(() => oauthErrorMessage(params.get("oauth_error"), params.get("provider"), copy) || "");
  const [completing, setCompleting] = useState(oauthSuccess);
  const [activation, setActivation] = useState<"pending" | "ready" | "slow">("pending");
  const [signupMethod, setSignupMethod] = useState<string>("email");
  const completedRef = useRef(false);

  useEffect(() => {
    const fromUrl = applyLanguageFromUrl();
    if (fromUrl && normalizeLanguage(i18n.language) !== fromUrl) void i18n.changeLanguage(fromUrl);
  }, [i18n, location.search]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  useEffect(() => {
    const previous = document.title;
    document.title = `${t("whatsappApiAuth.login.title", { defaultValue: "Log in to your WhatsApp API account" })} | Bizuply WhatsApp API`;
    return () => {
      document.title = previous;
    };
  }, [t, lang]);

  function goToDestination(user: SessionUser | null | undefined, { welcome = false } = {}) {
    clearPostLoginRedirect();
    if (!user) return;
    if (String(user.role || "").toLowerCase() === "business" && (user.mustChangePassword || user.isTempPassword)) {
      navigate("/change-password", { replace: true });
      return;
    }
    if (isWhatsAppApiPortalUser(user) && user.businessId) {
      navigate(`${whatsappApiPortalHome(user.businessId)}${welcome ? "?welcome=whatsapp_api" : ""}`, { replace: true });
      return;
    }
    navigate(
      resolvePostLoginDestination({
        role: user.role,
        businessId: user.businessId,
        hasAccess: user.hasAccess !== false,
        enabledModules: user.enabledModules ?? null,
        subscriptionPlan: user.subscriptionPlan ?? null,
        queryRedirect: null,
        storedRedirect: null,
      }),
      { replace: true }
    );
  }

  // Social sign-in: the API set the httpOnly refresh cookie; exchange it for a session here.
  useEffect(() => {
    if (!oauthSuccess || completedRef.current) return;
    completedRef.current = true;
    (async () => {
      try {
        clearRefreshDead();
        const accessToken = await refreshAccessTokenOnce();
        const { data } = await API.get("/auth/me", { headers: { Authorization: `Bearer ${accessToken}` } });
        loginWithToken(data, accessToken, { skipRedirect: true });
        goToDestination(data, { welcome: checkoutReturn });
      } catch {
        setCompleting(false);
        setError(copy.errors.session);
        navigate("/login?product=whatsapp_api", { replace: true });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oauthSuccess]);

  // After the $29 checkout the account exists only once Lemon's signed webhook has been processed.
  useEffect(() => {
    if (!checkoutReturn || !signupRef || !checkoutEmail) return undefined;
    let cancelled = false;
    let attempts = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const poll = async () => {
      attempts += 1;
      try {
        const { data } = await API.get("/whatsapp-api/signup-status", { params: { ref: signupRef, email: checkoutEmail } });
        if (cancelled) return;
        if (data?.method) setSignupMethod(String(data.method));
        if (data?.status === "ready") {
          setActivation("ready");
          return;
        }
      } catch {
        /* keep polling */
      }
      if (cancelled) return;
      if (attempts >= 40) {
        setActivation("slow");
        return;
      }
      timer = setTimeout(poll, 3000);
    };
    void poll();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [checkoutReturn, signupRef, checkoutEmail]);

  function onProvider(provider: SocialProvider) {
    setError("");
    setBusy(provider);
    startSocialAuth(provider, "login", language);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const cleanEmail = String(form.get("email") || email).trim().toLowerCase();
    const pass = String(form.get("password") || password);
    if (!cleanEmail || !pass) {
      setError(t("whatsappApiAuth.login.enterCredentials", { defaultValue: "Enter your email and password." }));
      return;
    }
    setBusy("email");
    try {
      const result = await login(cleanEmail, pass, { skipRedirect: true });
      goToDestination(result?.user, { welcome: checkoutReturn });
    } catch (err) {
      setError(messageForLoginFailure(err, t));
      setBusy(null);
    }
  }

  const providerName = PROVIDER_LABEL[signupMethod] || "";
  const activationText = !signupRef || activation === "ready"
    ? providerName
      ? t("whatsappApiAuth.checkout.readyProvider", {
          provider: providerName,
          defaultValue: "Your WhatsApp API account is ready. Continue with {{provider}} to open your portal.",
        })
      : t("login.whatsappApiCheckout.ready")
    : activation === "slow"
      ? t("login.whatsappApiCheckout.slow")
      : t("login.whatsappApiCheckout.pending");

  return (
    <div className="wa-page wa-login" dir={dir} lang={lang}>
      <div className="wa-ambient" aria-hidden="true" />
      <header className="wa-login-header">
        <a className="wa-brand" href={WHATSAPP_SITE_URL} aria-label="Bizuply WhatsApp API">
          <img src="/favicon-v2.png" alt="" width="32" height="32" />
          <span className="wa-brand-name" dir="ltr">
            Bizuply <span>WhatsApp API</span>
          </span>
        </a>
        <LanguagePicker lang={lang} />
      </header>

      <main className="wa-login-main">
        <section className="wa-login-card" aria-labelledby={`${id}-title`}>
          <p className="wa-login-eyebrow" dir="ltr">Bizuply WhatsApp API</p>
          <h1 id={`${id}-title`} className="wa-auth-title">
            {t("whatsappApiAuth.login.title", { defaultValue: "Log in to your WhatsApp API account" })}
          </h1>
          <p className="wa-auth-sub">
            {t("whatsappApiAuth.login.subtitle", { defaultValue: "Manage your numbers, API keys and webhooks." })}
          </p>

          {completing ? (
            <p className="wa-login-status" role="status" aria-live="polite" data-testid="wa-oauth-completing">
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              {t("whatsappApiAuth.login.completing", { defaultValue: "Signing you in…" })}
            </p>
          ) : (
            <>
              {checkoutReturn ? (
                <p
                  className={`wa-login-status ${activation === "ready" || !signupRef ? "is-ready" : ""}`}
                  role="status"
                  aria-live="polite"
                  data-testid="wa-checkout-activation"
                  data-state={signupRef ? activation : "ready"}
                >
                  {activationText}
                </p>
              ) : null}

              {error ? (
                <p className="wa-alert" role="alert" data-testid="wa-login-error">
                  {error}
                </p>
              ) : null}

              <SocialAuthButtons providers={config.providers} copy={copy} busy={busy} onStart={onProvider} />

              <form onSubmit={onSubmit} noValidate className="wa-auth-form">
                <div className="wa-field">
                  <label htmlFor={`${id}-email`}>{copy.email}</label>
                  <input
                    id={`${id}-email`}
                    name="email"
                    type="email"
                    autoComplete="email"
                    dir="ltr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    maxLength={200}
                    required
                  />
                </div>
                <div className="wa-field">
                  <div className="wa-login-label-row">
                    <label htmlFor={`${id}-password`}>{copy.password}</label>
                    <Link className="wa-link wa-login-forgot" to="/forgot-password">
                      {t("whatsappApiAuth.login.forgot", { defaultValue: "Forgot password?" })}
                    </Link>
                  </div>
                  <div className="wa-auth-password">
                    <input
                      id={`${id}-password`}
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      dir="ltr"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      maxLength={128}
                      required
                    />
                    <button
                      type="button"
                      className="wa-auth-reveal"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? copy.hidePassword : copy.showPassword}
                      aria-pressed={showPassword}
                    >
                      {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                    </button>
                  </div>
                </div>
                <button type="submit" className="wa-btn wa-btn-primary wa-auth-submit" disabled={busy !== null}>
                  {busy === "email" ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : null}
                  {busy === "email"
                    ? t("whatsappApiAuth.login.submitting", { defaultValue: "Logging in…" })
                    : t("whatsappApiAuth.login.submit", { defaultValue: "Log in" })}
                  {busy !== "email" ? <ArrowRight size={16} className="rtl-flip" aria-hidden="true" /> : null}
                </button>
              </form>

              <p className="wa-auth-switch">
                {t("whatsappApiAuth.login.noAccount", { defaultValue: "New to Bizuply WhatsApp API?" })}{" "}
                <a className="wa-link" href={SIGN_UP_URL}>
                  {t("whatsappApiAuth.login.signupCta", { defaultValue: "Create an account" })}
                </a>
              </p>
            </>
          )}
        </section>

        <p className="wa-login-trust">
          <ShieldCheck size={14} aria-hidden="true" />
          {t("whatsappApiAuth.login.trust", { defaultValue: "Secure sign-in by Bizuply" })}
        </p>
      </main>

      <footer className="wa-login-footer">
        <a href={PRIVACY_URL}>{t("whatsappApiAuth.login.privacy", { defaultValue: "Privacy" })}</a>
        <a href={TERMS_URL}>{t("whatsappApiAuth.login.terms", { defaultValue: "Terms" })}</a>
        <a href={`${WHATSAPP_SITE_URL}/help`}>{t("whatsappApiAuth.login.help", { defaultValue: "Help" })}</a>
        <Link to="/login?product=business">
          {t("whatsappApiAuth.login.businessLogin", { defaultValue: "Bizuply business login" })}
        </Link>
      </footer>
    </div>
  );
}
