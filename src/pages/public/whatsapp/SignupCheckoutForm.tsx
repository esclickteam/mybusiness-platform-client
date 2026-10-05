import React, { useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import API from "../../../api";
import { normalizeLanguage } from "../../../i18n/localeUtils";
import { PRICE_PER_NUMBER_USD, SIGN_IN_URL, SUPPORT_EMAIL } from "./siteConfig";

type FormState = { email: string; password: string };
type Errors = Partial<Record<keyof FormState, string>>;

function validate(form: FormState): Errors {
  const errors: Errors = {};
  if (!form.email.trim()) errors.email = "Enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = "Enter a valid email address.";
  if (form.password.length < 8) errors.password = "Use at least 8 characters.";
  return errors;
}

/** New customer: email + password, then the first month in Lemon Squeezy checkout. Business details come later, in the portal. */
export default function SignupCheckoutForm() {
  const id = useId();
  const { i18n } = useTranslation();
  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [failure, setFailure] = useState<React.ReactNode>("");
  const language = normalizeLanguage(i18n.language) || "en";

  const update = (name: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

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
    setSubmitting(true);
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
      setSubmitting(false);
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
        <button type="submit" className="wa-btn wa-btn-primary wa-auth-submit" disabled={submitting}>
          {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
          {submitting ? "Opening checkout…" : "Continue"}
          {!submitting ? <ArrowRight size={16} aria-hidden="true" /> : null}
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
