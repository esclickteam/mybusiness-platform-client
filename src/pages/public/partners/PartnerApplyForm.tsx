import { useId, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { browserHostname, resolveApiBaseUrl } from "../../../apiBaseUrl";
import { createConsentKey, storePrivacyConsent } from "../../../lib/privacyConsentClient";
import { NOTICE_VERSION } from "../../../lib/trackingConsent";

export const PARTNER_TRACK_OPTIONS = [
  "Affiliate",
  "Business Partner",
  "Reseller",
  "White Label",
  "Exclusive Territory",
  "Strategic Partner",
] as const;

export type PartnerTrackOption = (typeof PARTNER_TRACK_OPTIONS)[number];

const DIAL_CODES = [
  "+1",
  "+44",
  "+61",
  "+49",
  "+33",
  "+34",
  "+39",
  "+31",
  "+971",
  "+966",
  "+972",
  "+91",
  "+55",
  "+52",
  "+27",
  "+65",
  "+81",
  "+82",
  "+86",
  "+90",
  "+7",
];

type FormState = {
  name: string;
  company: string;
  email: string;
  dialCode: string;
  phone: string;
  country: string;
  website: string;
  partnershipType: PartnerTrackOption | "";
  activity: string;
  experience: string;
  customers: string;
  message: string;
  privacyAccepted: boolean;
  marketingOptIn: boolean;
};

type FormCopy = {
  title: string;
  lead: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  dialCode: string;
  country: string;
  website: string;
  websiteOptional: string;
  track: string;
  activity: string;
  experience: string;
  customersLabel: string;
  customersOptional: string;
  about: string;
  submit: string;
  sending: string;
  successTitle: string;
  successBody: string;
  errorGeneric: string;
  errorConsent: string;
  requiredHint: string;
  emailInvalid: string;
  privacyNotice: string;
  privacyAccept: string;
  privacyLink: string;
  marketingOptIn: string;
  trackLabels: Record<PartnerTrackOption, string>;
};

type Errors = Partial<Record<keyof FormState, string>>;

const EMPTY: FormState = {
  name: "",
  company: "",
  email: "",
  dialCode: "",
  phone: "",
  country: "",
  website: "",
  partnershipType: "Business Partner",
  activity: "",
  experience: "",
  customers: "",
  message: "",
  privacyAccepted: false,
  marketingOptIn: false,
};

/** Extra answers stay inside the existing message field. The payload keys do not change. */
function composedMessage(form: FormState) {
  const lines = [form.message.trim()];
  if (form.activity.trim()) lines.push(`Field of activity: ${form.activity.trim()}`);
  if (form.experience.trim()) lines.push(`Prior sales or partnership experience: ${form.experience.trim()}`);
  if (form.customers.trim()) lines.push(`Existing business customers: ${form.customers.trim()}`);
  return lines.filter(Boolean).join("\n\n").slice(0, 4000);
}

function composedPhone(dialCode: string, phone: string) {
  const trimmed = phone.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("+")) return trimmed.slice(0, 40);
  const code = dialCode.trim();
  if (!code) return trimmed.slice(0, 40);
  return `${code}${trimmed.replace(/^0+/, "")}`.slice(0, 40);
}

function validate(form: FormState, copy: FormCopy): Errors {
  const errors: Errors = {};
  if (!form.name.trim()) errors.name = copy.requiredHint;
  if (!form.company.trim()) errors.company = copy.requiredHint;
  if (!form.email.trim()) {
    errors.email = copy.requiredHint;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = copy.emailInvalid;
  }
  if (!form.phone.trim()) errors.phone = copy.requiredHint;
  if (!form.country.trim()) errors.country = copy.requiredHint;
  if (!form.partnershipType || !PARTNER_TRACK_OPTIONS.includes(form.partnershipType)) {
    errors.partnershipType = copy.requiredHint;
  }
  if (!form.activity.trim()) errors.activity = copy.requiredHint;
  if (!form.experience.trim()) errors.experience = copy.requiredHint;
  if (!form.message.trim()) errors.message = copy.requiredHint;
  if (!form.privacyAccepted) errors.privacyAccepted = copy.requiredHint;
  return errors;
}

export default function PartnerApplyForm({
  copy,
  pageUrl,
  locale,
}: {
  copy: FormCopy;
  pageUrl: string;
  locale: string;
}) {
  const id = useId();
  const consentKeyRef = useRef(createConsentKey());
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
      const field = document.getElementById(`${id}-${firstInvalid}`);
      if (field && typeof field.scrollIntoView === "function") {
        try {
          field.scrollIntoView({ behavior: "smooth", block: "center" });
        } catch {
          /* jsdom / older engines */
        }
      }
      field?.focus();
      setFailure(copy.requiredHint);
      return;
    }

    setSubmitting(true);
    try {
      let saved;
      try {
        saved = await storePrivacyConsent({
          consentKey: consentKeyRef.current,
          source: "contact",
          email: form.email.trim(),
          termsAccepted: false,
          marketingOptIn: form.marketingOptIn,
          locale,
        });
      } catch {
        setFailure(copy.errorConsent);
        return;
      }

      // Preview/staging Vercel hosts must hit Railway staging — not the
      // production /api rewrite baked into vercel.json.
      const apiBase = resolveApiBaseUrl({
        envApiUrl: import.meta.env.VITE_API_URL,
        mode: import.meta.env.MODE,
        hostname: browserHostname(),
      }).replace(/\/+$/, "");
      const payload: Record<string, unknown> = {
        name: form.name.trim(),
        company: form.company.trim(),
        email: form.email.trim(),
        phone: composedPhone(form.dialCode, form.phone),
        country: form.country.trim(),
        website: form.website.trim(),
        partnershipType: form.partnershipType,
        message: composedMessage(form),
        pageUrl,
        locale,
        privacyAccepted: true,
      };
      if (saved.status === "stored") {
        payload.consentKey = consentKeyRef.current;
        payload.marketingOptIn = form.marketingOptIn;
        payload.noticeVersion = NOTICE_VERSION;
      }

      const response = await fetch(`${apiBase}/support/partner-application`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "omit",
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || data?.success === false) {
        throw new Error(data?.message || "Failed");
      }
      setSent(true);
      setForm(EMPTY);
      consentKeyRef.current = createConsentKey();
    } catch {
      setFailure(copy.errorGeneric);
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="ip-form-success" role="status" aria-live="polite" data-testid="partner-apply-success">
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
            aria-describedby={errors.name ? `${id}-name-error` : undefined}
            onChange={(e) => update("name", e.target.value)}
          />
          {errors.name ? (
            <span className="ip-field-error" id={`${id}-name-error`} role="alert">
              {errors.name}
            </span>
          ) : null}
        </label>
        <label>
          {copy.company}
          <input
            id={`${id}-company`}
            name="company"
            autoComplete="organization"
            value={form.company}
            aria-invalid={errors.company ? true : undefined}
            aria-describedby={errors.company ? `${id}-company-error` : undefined}
            onChange={(e) => update("company", e.target.value)}
          />
          {errors.company ? (
            <span className="ip-field-error" id={`${id}-company-error`} role="alert">
              {errors.company}
            </span>
          ) : null}
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
            aria-describedby={errors.email ? `${id}-email-error` : undefined}
            onChange={(e) => update("email", e.target.value)}
          />
          {errors.email ? (
            <span className="ip-field-error" id={`${id}-email-error`} role="alert">
              {errors.email}
            </span>
          ) : null}
        </label>
        <label>
          {copy.country}
          <input
            id={`${id}-country`}
            name="country"
            autoComplete="country-name"
            value={form.country}
            aria-invalid={errors.country ? true : undefined}
            aria-describedby={errors.country ? `${id}-country-error` : undefined}
            onChange={(e) => update("country", e.target.value)}
          />
          {errors.country ? (
            <span className="ip-field-error" id={`${id}-country-error`} role="alert">
              {errors.country}
            </span>
          ) : null}
        </label>
        <div className="ip-phone-row">
          <label>
            {copy.dialCode}
            <select
              id={`${id}-dialCode`}
              name="dialCode"
              value={form.dialCode}
              onChange={(e) => update("dialCode", e.target.value)}
            >
              <option value="">{copy.dialCode}</option>
              {DIAL_CODES.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </label>
          <label>
            {copy.phone}
            <input
              id={`${id}-phone`}
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              dir="ltr"
              value={form.phone}
              aria-invalid={errors.phone ? true : undefined}
              aria-describedby={errors.phone ? `${id}-phone-error` : undefined}
              onChange={(e) => update("phone", e.target.value)}
            />
            {errors.phone ? (
              <span className="ip-field-error" id={`${id}-phone-error`} role="alert">
                {errors.phone}
              </span>
            ) : null}
          </label>
        </div>
        <label className="ip-apply-span">
          {copy.website} <span className="ip-optional">{copy.websiteOptional}</span>
          <input
            id={`${id}-website`}
            name="website"
            type="url"
            inputMode="url"
            autoComplete="url"
            placeholder="https://"
            dir="ltr"
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
            aria-describedby={errors.partnershipType ? `${id}-partnershipType-error` : undefined}
            onChange={(e) => update("partnershipType", e.target.value as PartnerTrackOption | "")}
          >
            {PARTNER_TRACK_OPTIONS.map((track) => (
              <option key={track} value={track}>
                {copy.trackLabels[track]}
              </option>
            ))}
          </select>
          {errors.partnershipType ? (
            <span className="ip-field-error" id={`${id}-partnershipType-error`} role="alert">
              {errors.partnershipType}
            </span>
          ) : null}
        </label>
        <label>
          {copy.activity}
          <input
            id={`${id}-activity`}
            name="activity"
            value={form.activity}
            aria-invalid={errors.activity ? true : undefined}
            aria-describedby={errors.activity ? `${id}-activity-error` : undefined}
            onChange={(e) => update("activity", e.target.value)}
          />
          {errors.activity ? (
            <span className="ip-field-error" id={`${id}-activity-error`} role="alert">
              {errors.activity}
            </span>
          ) : null}
        </label>
        <label>
          {copy.customersLabel} <span className="ip-optional">{copy.customersOptional}</span>
          <input
            id={`${id}-customers`}
            name="customers"
            inputMode="numeric"
            value={form.customers}
            onChange={(e) => update("customers", e.target.value)}
          />
        </label>
        <label className="ip-apply-span">
          {copy.experience}
          <textarea
            id={`${id}-experience`}
            name="experience"
            rows={3}
            value={form.experience}
            aria-invalid={errors.experience ? true : undefined}
            aria-describedby={errors.experience ? `${id}-experience-error` : undefined}
            onChange={(e) => update("experience", e.target.value)}
          />
          {errors.experience ? (
            <span className="ip-field-error" id={`${id}-experience-error`} role="alert">
              {errors.experience}
            </span>
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
            aria-describedby={errors.message ? `${id}-message-error` : undefined}
            onChange={(e) => update("message", e.target.value)}
          />
          {errors.message ? (
            <span className="ip-field-error" id={`${id}-message-error`} role="alert">
              {errors.message}
            </span>
          ) : null}
        </label>
      </div>

      <div className="ip-privacy">
        <p className="ip-privacy-notice">
          {copy.privacyNotice}{" "}
          <Link to="/privacy">{copy.privacyLink}</Link>.
        </p>
        <label className="ip-privacy-check">
          <input
            id={`${id}-privacyAccepted`}
            name="privacyAccepted"
            type="checkbox"
            checked={form.privacyAccepted}
            aria-invalid={errors.privacyAccepted ? true : undefined}
            aria-describedby={errors.privacyAccepted ? `${id}-privacyAccepted-error` : undefined}
            onChange={(e) => update("privacyAccepted", e.target.checked)}
          />
          <span>{copy.privacyAccept}</span>
        </label>
        {errors.privacyAccepted ? (
          <span className="ip-field-error" id={`${id}-privacyAccepted-error`} role="alert">
            {errors.privacyAccepted}
          </span>
        ) : null}
        <label className="ip-privacy-check">
          <input
            id={`${id}-marketingOptIn`}
            name="marketingOptIn"
            type="checkbox"
            checked={form.marketingOptIn}
            onChange={(e) => update("marketingOptIn", e.target.checked)}
          />
          <span>{copy.marketingOptIn}</span>
        </label>
      </div>

      {failure ? (
        <p className="ip-form-error" role="alert" aria-live="assertive">
          {failure}
        </p>
      ) : null}

      <button className="ip-btn ip-btn-primary" type="submit" disabled={submitting} data-testid="partner-apply-submit">
        {submitting ? copy.sending : copy.submit}
      </button>
    </form>
  );
}
