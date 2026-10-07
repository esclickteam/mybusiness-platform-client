import React, { useId, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import API from "../../../api";
import { coerceSupportedLanguage, normalizeLanguage } from "../../../i18n/localeUtils";
import {
  startSocialAuth,
  type SocialProvider,
  type WhatsAppApiAuthConfig,
} from "../../../components/whatsappApiAuth/authConfig";
import { oauthErrorMessage, useWaAuthCopy } from "../../../components/whatsappApiAuth/copy";
import SocialAuthButtons from "../../../components/whatsappApiAuth/SocialAuthButtons";
import TurnstileWidget, { type TurnstileHandle } from "../../../components/whatsappApiAuth/TurnstileWidget";
import { getStartedCopy, type GetStartedCopy } from "./getStartedCopy";
import { SIGN_IN_URL, SUPPORT_EMAIL } from "./siteConfig";

type FormState = { email: string; password: string };
type Errors = Partial<Record<keyof FormState, string>>;

function validate(form: FormState, text: GetStartedCopy["form"]): Errors {
  const errors: Errors = {};
  if (!form.email.trim()) errors.email = text.emailRequired;
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = text.emailInvalid;
  if (form.password.length < 8) errors.password = text.passwordShort;
  return errors;
}

/** New customer: a social provider or email + password, then the first month in Lemon Squeezy checkout. Business details come later, in the portal. */
export default function SignupCheckoutForm({ config }: { config: WhatsAppApiAuthConfig }) {
  const id = useId();
  const { i18n } = useTranslation();
  const copy = useWaAuthCopy();
  const text = getStartedCopy(coerceSupportedLanguage(i18n.language)).form;
  const { search } = useLocation();
  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState<SocialProvider | "email" | null>(null);
  const [failure, setFailure] = useState<React.ReactNode>("");
  const [checkingBot, setCheckingBot] = useState(false);
  const turnstile = useRef<TurnstileHandle>(null);
  const language = normalizeLanguage(i18n.language) || "en";

  const providerError = useMemo(() => {
    const params = new URLSearchParams(search);
    return oauthErrorMessage(params.get("oauth_error"), params.get("provider"), copy);
  }, [search, copy]);

  const update = (name: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  function onProvider(provider: SocialProvider) {
    setFailure("");
    setBusy(provider);
    startSocialAuth(provider, "signup", language);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFailure("");
    const nextErrors = validate(form, text);
    setErrors(nextErrors);
    const firstInvalid = (Object.keys(nextErrors) as Array<keyof FormState>)[0];
    if (firstInvalid) {
      document.getElementById(`${id}-${firstInvalid}`)?.focus();
      return;
    }
    setBusy("email");
    let turnstileToken: string | null = null;
    if (config.turnstileSiteKey) {
      setCheckingBot(true);
      turnstileToken = (await turnstile.current?.getToken()) ?? null;
      setCheckingBot(false);
      if (!turnstileToken) {
        setFailure(copy.botCheck);
        turnstile.current?.reset();
        setBusy(null);
        return;
      }
    }
    try {
      const { data } = await API.post("/whatsapp-api/signup-checkout", {
        email: form.email.trim(),
        password: form.password,
        language,
        ...(turnstileToken ? { turnstileToken } : {}),
      });
      if (!data?.url) throw new Error("missing_checkout_url");
      window.location.assign(data.url);
    } catch (err: any) {
      turnstile.current?.reset();
      const code = err?.response?.data?.code;
      if (code === "EMAIL_ALREADY_REGISTERED") {
        setFailure(
          <>
            {text.emailTakenBefore} <a className="wa-link" href={SIGN_IN_URL}>{text.emailTakenLink}</a> {text.emailTakenAfter}
          </>
        );
      } else if (code === "BOT_CHECK_FAILED") {
        setFailure(copy.botCheck);
      } else if (err?.response?.status === 400 && err.response.data?.error) {
        setFailure(err.response.data.error);
      } else if (code === "RATE_LIMITED") {
        setFailure(text.rateLimited);
      } else {
        setFailure(text.checkoutFailed(SUPPORT_EMAIL));
      }
      setBusy(null);
    }
  }

  const field = (name: keyof FormState) => ({
    id: `${id}-${name}`,
    name,
    value: form[name],
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${id}-${name}-error` : undefined,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => update(name, event.target.value),
  });

  const error = (name: keyof FormState) =>
    errors[name] ? (
      <p className="wa-field-error" id={`${id}-${name}-error`}>
        {errors[name]}
      </p>
    ) : null;

  return (
    <div className="wa-auth">
      <h3 className="wa-auth-title">{text.title}</h3>
      <p className="wa-auth-sub">{text.sub}</p>

      {providerError ? (
        <p className="wa-alert" role="alert" data-testid="wa-oauth-error">
          {providerError}
        </p>
      ) : null}

      <SocialAuthButtons providers={config.providers} copy={copy} busy={busy} onStart={onProvider} />

      <form onSubmit={onSubmit} noValidate className="wa-auth-form">
        <div className="wa-field">
          <label htmlFor={`${id}-email`}>{copy.email}</label>
          <input {...field("email")} type="email" autoComplete="email" maxLength={200} required dir="ltr" />
          {error("email")}
        </div>
        <div className="wa-field">
          <label htmlFor={`${id}-password`}>{copy.password}</label>
          <div className="wa-auth-password">
            <input
              {...field("password")}
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              minLength={8}
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
          {error("password")}
        </div>
        {config.turnstileSiteKey ? (
          <TurnstileWidget ref={turnstile} siteKey={config.turnstileSiteKey} language={language} action="wa_signup" />
        ) : null}
        {failure ? (
          <p className="wa-alert" role="alert">
            {failure}
          </p>
        ) : null}
        <button type="submit" className="wa-btn wa-btn-primary wa-auth-submit" disabled={busy !== null}>
          {busy === "email" ? <Loader2 size={16} className="animate-spin" /> : null}
          {busy === "email" ? (checkingBot ? copy.botChecking : text.openingCheckout) : text.continue}
          {busy !== "email" ? <ArrowRight size={16} aria-hidden="true" /> : null}
        </button>
        <p className="wa-auth-note">
          <Lock size={13} aria-hidden="true" /> {text.note}
        </p>
      </form>

      <p className="wa-auth-switch">
        {text.haveAccount} <a className="wa-link" href={SIGN_IN_URL}>{text.login}</a>
      </p>
    </div>
  );
}
