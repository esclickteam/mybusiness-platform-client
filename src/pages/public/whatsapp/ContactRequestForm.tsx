import React, { useId, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import MenuSelect from "../MenuSelect";
import { SIGN_IN_URL, SUPPORT_EMAIL } from "./siteConfig";

export type RequestIntent = "connect" | "agency" | "demo" | "support";

const INTENT_LABEL: Record<RequestIntent, string> = {
  connect: "Connect a WhatsApp number ($29/month)",
  agency: "Agency or SaaS: several client numbers",
  demo: "Book a product walkthrough",
  support: "Support for an existing connection",
};

const SUGGESTED: Record<RequestIntent, string> = {
  connect: "I want to connect a WhatsApp number to the Bizuply WhatsApp API.",
  agency: "We want to connect WhatsApp numbers for several clients and integrate them with our own system.",
  demo: "I would like a walkthrough of the Bizuply WhatsApp API.",
  support: "I need help with an existing WhatsApp API connection.",
};

type FormState = {
  name: string;
  email: string;
  company: string;
  phone: string;
  numbers: string;
  message: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

function validate(form: FormState): Errors {
  const errors: Errors = {};
  if (!form.name.trim()) errors.name = "Enter your name.";
  if (!form.email.trim()) errors.email = "Enter your work email.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = "Enter a valid email address.";
  if (!form.company.trim()) errors.company = "Enter your company name.";
  if (form.numbers && !/^\d{1,5}$/.test(form.numbers.trim())) errors.numbers = "Use a whole number.";
  if (!form.message.trim()) errors.message = "Tell us briefly what you need.";
  return errors;
}

export default function ContactRequestForm({ defaultIntent = "connect" }: { defaultIntent?: RequestIntent }) {
  const id = useId();
  const [intent, setIntent] = useState<RequestIntent>(defaultIntent);
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    company: "",
    phone: "",
    numbers: defaultIntent === "agency" ? "" : "1",
    message: SUGGESTED[defaultIntent],
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [failure, setFailure] = useState("");
  const [sent, setSent] = useState(false);

  const update = (name: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const changeIntent = (next: RequestIntent) => {
    setIntent(next);
    setForm((prev) => {
      const isSuggestion = (Object.values(SUGGESTED) as string[]).includes(prev.message);
      return isSuggestion || !prev.message.trim() ? { ...prev, message: SUGGESTED[next] } : prev;
    });
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
    const issueDescription = [
      "WhatsApp API inquiry",
      `Request: ${INTENT_LABEL[intent]}`,
      `Company: ${form.company.trim()}`,
      form.numbers.trim() ? `WhatsApp numbers: ${form.numbers.trim()}` : "",
      "",
      form.message.trim(),
      "",
      "Source: https://whatsapp.bizuply.com",
    ]
      .filter((line, index, all) => line !== "" || (index > 0 && all[index - 1] !== ""))
      .join("\n");

    setSubmitting(true);
    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "omit",
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          issueDescription,
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || data?.success === false) throw new Error(data?.message || "Failed to send");
      setSent(true);
    } catch {
      setFailure(`We could not send your request right now. Please email ${SUPPORT_EMAIL} instead.`);
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="wa-success" role="status">
        <h3>Request received</h3>
        <p>
          We will reply to {form.email.trim()} with the next onboarding steps. For anything urgent, email{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
        </p>
      </div>
    );
  }

  const field = (name: keyof FormState) => ({
    id: `${id}-${name}`,
    name,
    value: form[name],
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${id}-${name}-error` : undefined,
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => update(name, event.target.value),
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
        Already a Bizuply customer? <a className="wa-link" href={SIGN_IN_URL}>Log in</a> and open WhatsApp → Connection.
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
          <label htmlFor={`${id}-company`}>Company</label>
          <input {...field("company")} autoComplete="organization" maxLength={160} required />
          {error("company")}
        </div>
        <div className="wa-field">
          <label htmlFor={`${id}-phone`}>
            Phone <span className="req">(optional)</span>
          </label>
          <input {...field("phone")} type="tel" autoComplete="tel" maxLength={40} />
        </div>
        <div className="wa-field">
          <span className="wa-label" id={`${id}-intent-label`}>Request</span>
          <MenuSelect
            id={`${id}-intent`}
            theme="dark"
            ariaLabel="Request"
            value={intent}
            options={(Object.keys(INTENT_LABEL) as RequestIntent[]).map((key) => ({ value: key, label: INTENT_LABEL[key] }))}
            onChange={(next) => changeIntent(next as RequestIntent)}
          />
        </div>
        <div className="wa-field">
          <label htmlFor={`${id}-numbers`}>
            WhatsApp numbers <span className="req">(optional)</span>
          </label>
          <input {...field("numbers")} inputMode="numeric" maxLength={5} />
          {error("numbers")}
        </div>
        <div className="wa-field is-full">
          <label htmlFor={`${id}-message`}>Message</label>
          <textarea {...field("message")} maxLength={2000} required />
          {error("message")}
        </div>
        {failure ? (
          <p className="wa-alert" role="alert">
            {failure}
          </p>
        ) : null}
        <div className="wa-form-actions">
          <button type="submit" className="wa-btn wa-btn-primary" disabled={submitting}>
            {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
            {submitting ? "Sending…" : "Send request"}
            {!submitting ? <ArrowRight size={16} /> : null}
          </button>
          <span className="wa-fine" style={{ margin: 0 }}>
            Or email <a className="wa-link" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
          </span>
        </div>
      </div>
    </form>
  );
}
