import React, { useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import API from "../../../api";
import { normalizeLanguage } from "../../../i18n/localeUtils";
import { PRICE_PER_NUMBER_USD, SIGN_IN_URL, SUPPORT_EMAIL } from "./siteConfig";

type FormState = { email: string; password: string };
type Errors = Partial<Record<keyof FormState, string>>;
type Provider = "google" | "facebook" | "microsoft";

function validate(form: FormState): Errors {
  const errors: Errors = {};
  if (!form.email.trim()) errors.email = "Enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = "Enter a valid email address.";
  if (form.password.length < 8) errors.password = "Use at least 8 characters.";
  return errors;
}

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

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#1877F2" d="M24 12a12 12 0 1 0-13.9 11.9v-8.4h-3V12h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.5h-2.9v8.4A12 12 0 0 0 24 12z" />
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

const PROVIDERS: Array<{ id: Provider; label: string; Icon: () => React.ReactElement }> = [
  { id: "google", label: "Continue with Google", Icon: GoogleIcon },
  { id: "facebook", label: "Continue with Facebook", Icon: FacebookIcon },
  { id: "microsoft", label: "Continue with Microsoft", Icon: MicrosoftIcon },
];

/** New customer: email/password or a social provider, then the first month in Lemon Squeezy checkout. */
export default function SignupCheckoutForm() {
  const id = useId();
  const { i18n } = useTranslation();
  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState<"email" | Provider | null>(null);
  const [failure, setFailure] = useState<React.ReactNode>("");
  const language = normalizeLanguage(i18n.language) || "en";

  const update = (name: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  function startProvider(provider: Provider) {
    setFailure("");
    setSubmitting(provider);
    const base = String(API.defaults.baseURL || "").replace(/\/$/, "");
    const params = new URLSearchParams({ intent: "whatsapp_api_signup", language });
    window.location.assign(`${base}/auth/oauth/${provider}/start?${params}`);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFailure("");
    const nextErrors = validate(form);
    setErrors(nextErrors);
    const firstInvalid = (Object.keys(nextErrors) as Array<keyof FormState>)[0];
    if (firstInvalid) {
      document.getElementById(`${id}-${firstInvalid}`)?.focus();
      return;
    }
    setSubmitting("email");
    try {
      const { data } = await API.post("/whatsapp-api/signup-checkout", {
        email: form.email.trim(),
        password: form.password,
        language,
      });
      if (!data?.url) throw new Error("missing_checkout_url");
      window.location.assign(data.url);
    } catch (err: any) {
      const code = err?.response?.data?.code;
      if (code === "EMAIL_ALREADY_REGISTERED") {
        setFailure(
          <>
            This email already has an account. <a className="wa-link" href={SIGN_IN_URL}>Log in</a> to continue.
          </>
        );
      } else if (err?.response?.status === 400 && err.response.data?.error) {
        setFailure(err.response.data.error);
      } else if (code === "RATE_LIMITED") {
        setFailure("Too many attempts. Try again in a few minutes.");
      } else {
        setFailure(`We couldn't open checkout right now. Please try again or email ${SUPPORT_EMAIL}.`);
      }
      setSubmitting(null);
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
      <h3 className="wa-auth-title">Create your WhatsApp API account</h3>
      <p className="wa-auth-sub">${PRICE_PER_NUMBER_USD}/month per WhatsApp number. Cancel anytime.</p>

      <div className="wa-auth-providers">
        {PROVIDERS.map(({ id: provider, label, Icon }) => (
          <button
            key={provider}
            type="button"
            className="wa-auth-provider"
            onClick={() => startProvider(provider)}
            disabled={submitting !== null}
          >
            {submitting === provider ? <Loader2 size={18} className="animate-spin" /> : <Icon />}
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="wa-auth-divider" role="separator">
        <span>OR</span>
      </div>

      <form onSubmit={onSubmit} noValidate className="wa-auth-form">
        <div className="wa-field">
          <label htmlFor={`${id}-email`}>Email address</label>
          <input {...field("email")} type="email" autoComplete="email" maxLength={200} required />
          {error("email")}
        </div>
        <div className="wa-field">
          <label htmlFor={`${id}-password`}>Password</label>
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
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
            >
              {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
            </button>
          </div>
          {error("password")}
        </div>
        {failure ? (
          <p className="wa-alert" role="alert">
            {failure}
          </p>
        ) : null}
        <button type="submit" className="wa-btn wa-btn-primary wa-auth-submit" disabled={submitting !== null}>
          {submitting === "email" ? <Loader2 size={16} className="animate-spin" /> : null}
          {submitting === "email" ? "Opening checkout…" : "Continue"}
          {submitting !== "email" ? <ArrowRight size={16} aria-hidden="true" /> : null}
        </button>
        <p className="wa-auth-note">
          <Lock size={13} aria-hidden="true" /> Next: secure ${PRICE_PER_NUMBER_USD}/month checkout with Lemon Squeezy.
        </p>
      </form>

      <p className="wa-auth-switch">
        Already have an account? <a className="wa-link" href={SIGN_IN_URL}>Log in</a>
      </p>
    </div>
  );
}
