import { useId, useState, type FormEvent } from "react";

export const PARTNER_TRACK_OPTIONS = [
  "Affiliate",
  "Business Partner",
  "Reseller",
  "White Label",
  "Exclusive Territory",
  "Strategic Partner",
] as const;

export type PartnerTrackOption = (typeof PARTNER_TRACK_OPTIONS)[number];

type FormState = {
  name: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  website: string;
  partnershipType: PartnerTrackOption | "";
  message: string;
};

type FormCopy = {
  title: string;
  lead: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  website: string;
  websiteOptional: string;
  track: string;
  about: string;
  submit: string;
  sending: string;
  successTitle: string;
  successBody: string;
  errorGeneric: string;
  requiredHint: string;
  trackLabels: Record<PartnerTrackOption, string>;
};

type Errors = Partial<Record<keyof FormState, string>>;

const EMPTY: FormState = {
  name: "",
  company: "",
  email: "",
  phone: "",
  country: "",
  website: "",
  partnershipType: "Business Partner",
  message: "",
};

function validate(form: FormState, copy: FormCopy): Errors {
  const errors: Errors = {};
  if (!form.name.trim()) errors.name = copy.requiredHint;
  if (!form.company.trim()) errors.company = copy.requiredHint;
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = copy.requiredHint;
  }
  if (!form.phone.trim()) errors.phone = copy.requiredHint;
  if (!form.country.trim()) errors.country = copy.requiredHint;
  if (!form.partnershipType || !PARTNER_TRACK_OPTIONS.includes(form.partnershipType)) {
    errors.partnershipType = copy.requiredHint;
  }
  if (!form.message.trim()) errors.message = copy.requiredHint;
  return errors;
}

export default function PartnerApplyForm({
  copy,
  pageUrl,
}: {
  copy: FormCopy;
  pageUrl: string;
}) {
  const id = useId();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [failure, setFailure] = useState("");
  const [sent, setSent] = useState(false);

  const update = <K extends keyof FormState>(name: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFailure("");
    const nextErrors = validate(form, copy);
    setErrors(nextErrors);
    const firstInvalid = (Object.keys(nextErrors) as Array<keyof FormState>)[0];
    if (firstInvalid) {
      document.getElementById(`${id}-${firstInvalid}`)?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/support/partner-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "omit",
        body: JSON.stringify({
          name: form.name.trim(),
          company: form.company.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          country: form.country.trim(),
          website: form.website.trim(),
          partnershipType: form.partnershipType,
          message: form.message.trim(),
          pageUrl,
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || data?.success === false) {
        throw new Error(data?.message || "Failed");
      }
      setSent(true);
      setForm(EMPTY);
    } catch {
      setFailure(copy.errorGeneric);
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="ip-form-success" role="status" data-testid="partner-apply-success">
        <h3>{copy.successTitle}</h3>
        <p>{copy.successBody}</p>
      </div>
    );
  }

  return (
    <form
      className="ip-apply-form"
      onSubmit={onSubmit}
      noValidate
      data-testid="partner-apply-form"
      aria-describedby={`${id}-intro`}
    >
      <div className="ip-apply-intro">
        <h2 id="apply-heading">{copy.title}</h2>
        <p id={`${id}-intro`} className="ip-copy">
          {copy.lead}
        </p>
      </div>

      <div className="ip-apply-grid">
        <label>
          {copy.name}
          <input
            id={`${id}-name`}
            name="name"
            autoComplete="name"
            value={form.name}
            aria-invalid={errors.name ? true : undefined}
            onChange={(e) => update("name", e.target.value)}
          />
          {errors.name ? <span className="ip-field-error">{errors.name}</span> : null}
        </label>
        <label>
          {copy.company}
          <input
            id={`${id}-company`}
            name="company"
            autoComplete="organization"
            value={form.company}
            aria-invalid={errors.company ? true : undefined}
            onChange={(e) => update("company", e.target.value)}
          />
          {errors.company ? <span className="ip-field-error">{errors.company}</span> : null}
        </label>
        <label>
          {copy.email}
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={form.email}
            aria-invalid={errors.email ? true : undefined}
            onChange={(e) => update("email", e.target.value)}
          />
          {errors.email ? <span className="ip-field-error">{errors.email}</span> : null}
        </label>
        <label>
          {copy.phone}
          <input
            id={`${id}-phone`}
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            value={form.phone}
            aria-invalid={errors.phone ? true : undefined}
            onChange={(e) => update("phone", e.target.value)}
          />
          {errors.phone ? <span className="ip-field-error">{errors.phone}</span> : null}
        </label>
        <label>
          {copy.country}
          <input
            id={`${id}-country`}
            name="country"
            autoComplete="country-name"
            value={form.country}
            aria-invalid={errors.country ? true : undefined}
            onChange={(e) => update("country", e.target.value)}
          />
          {errors.country ? <span className="ip-field-error">{errors.country}</span> : null}
        </label>
        <label>
          {copy.website} <span className="ip-optional">{copy.websiteOptional}</span>
          <input
            id={`${id}-website`}
            name="website"
            type="url"
            inputMode="url"
            autoComplete="url"
            placeholder="https://"
            value={form.website}
            onChange={(e) => update("website", e.target.value)}
          />
        </label>
        <label className="ip-apply-span">
          {copy.track}
          <select
            id={`${id}-partnershipType`}
            name="partnershipType"
            value={form.partnershipType}
            aria-invalid={errors.partnershipType ? true : undefined}
            onChange={(e) => update("partnershipType", e.target.value as PartnerTrackOption | "")}
          >
            {PARTNER_TRACK_OPTIONS.map((track) => (
              <option key={track} value={track}>
                {copy.trackLabels[track]}
              </option>
            ))}
          </select>
          {errors.partnershipType ? (
            <span className="ip-field-error">{errors.partnershipType}</span>
          ) : null}
        </label>
        <label className="ip-apply-span">
          {copy.about}
          <textarea
            id={`${id}-message`}
            name="message"
            rows={4}
            value={form.message}
            aria-invalid={errors.message ? true : undefined}
            onChange={(e) => update("message", e.target.value)}
          />
          {errors.message ? <span className="ip-field-error">{errors.message}</span> : null}
        </label>
      </div>

      {failure ? (
        <p className="ip-form-error" role="alert">
          {failure}
        </p>
      ) : null}

      <button className="ip-btn ip-btn-primary" type="submit" disabled={submitting} data-testid="partner-apply-submit">
        {submitting ? copy.sending : copy.submit}
      </button>
    </form>
  );
}
