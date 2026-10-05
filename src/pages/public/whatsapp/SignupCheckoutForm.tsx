import React, { useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, Loader2, Lock } from "lucide-react";
import API from "../../../api";
import { normalizeLanguage } from "../../../i18n/localeUtils";
import { PRICE_PER_NUMBER_USD, SIGN_IN_URL, SUPPORT_EMAIL } from "./siteConfig";

type FormState = {
  name: string;
  email: string;
  businessName: string;
  phone: string;
  password: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

function validate(form: FormState): Errors {
  const errors: Errors = {};
  if (!form.name.trim()) errors.name = "Enter your name.";
  if (!form.email.trim()) errors.email = "Enter your work email.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = "Enter a valid email address.";
  if (!form.businessName.trim()) errors.businessName = "Enter your company name.";
  if (!form.phone.trim()) errors.phone = "Enter a phone number.";
  if (form.password.length < 8) errors.password = "Use at least 8 characters.";
  return errors;
}

/** New customer: create the account details, then pay the first month in Lemon Squeezy checkout. */
export default function SignupCheckoutForm() {
  const id = useId();
  const { i18n } = useTranslation();
  const [form, setForm] = useState<FormState>({ name: "", email: "", businessName: "", phone: "", password: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [failure, setFailure] = useState<React.ReactNode>("");

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
        name: form.name.trim(),
        email: form.email.trim(),
        businessName: form.businessName.trim(),
        phone: form.phone.trim(),
        password: form.password,
        language: normalizeLanguage(i18n.language) || "en",
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
    <form onSubmit={onSubmit} noValidate aria-describedby={`${id}-intro`}>
      <p id={`${id}-intro`} className="wa-fine" style={{ marginTop: 0, marginBottom: 18 }}>
        Already have an account? <a className="wa-link" href={SIGN_IN_URL}>Log in</a> to the WhatsApp API portal.
      </p>
      <div className="wa-form">
        <div className="wa-field">
          <label htmlFor={`${id}-name`}>Name</label>
          <input {...field("name")} autoComplete="name" maxLength={120} required />
          {error("name")}
        </div>
        <div className="wa-field">
          <label htmlFor={`${id}-email`}>Work email</label>
          <input {...field("email")} type="email" autoComplete="email" maxLength={200} required />
          {error("email")}
        </div>
        <div className="wa-field">
          <label htmlFor={`${id}-businessName`}>Company</label>
          <input {...field("businessName")} autoComplete="organization" maxLength={160} required />
          {error("businessName")}
        </div>
        <div className="wa-field">
          <label htmlFor={`${id}-phone`}>Phone</label>
          <input {...field("phone")} type="tel" autoComplete="tel" maxLength={40} required />
          {error("phone")}
        </div>
        <div className="wa-field is-full">
          <label htmlFor={`${id}-password`}>Password</label>
          <input {...field("password")} type="password" autoComplete="new-password" minLength={8} maxLength={128} required />
          {error("password")}
        </div>
        {failure ? (
          <p className="wa-alert" role="alert">
            {failure}
          </p>
        ) : null}
        <div className="wa-form-actions">
          <button type="submit" className="wa-btn wa-btn-primary" disabled={submitting}>
            {submitting ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} aria-hidden="true" />}
            {submitting ? "Opening checkout…" : `Continue to payment · $${PRICE_PER_NUMBER_USD}/month`}
            {!submitting ? <ArrowRight size={16} aria-hidden="true" /> : null}
          </button>
          <span className="wa-fine" style={{ margin: 0 }}>
            Covers one WhatsApp number. Your account is created after the first payment. Cancel anytime.
          </span>
        </div>
      </div>
    </form>
  );
}
