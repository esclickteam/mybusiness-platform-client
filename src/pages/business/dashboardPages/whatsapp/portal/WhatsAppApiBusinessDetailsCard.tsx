import React, { useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { Building2, Loader2 } from "lucide-react";
import {
  updateWhatsAppApiBusinessProfile,
  type WhatsAppApiBusinessProfile,
  type WhatsAppApiBusinessProfileInput,
} from "../../../../../api/whatsappApiPortal";
import { btnPrimary, cardBase, iconBadge, inputBase } from "../../../../../styles/bizuplyUi";

/** Same rule as the server's PROFILE_PHONE_RE. */
const PHONE_RE = /^\+?[0-9][0-9\s().-]{5,28}$/;

type Field = keyof WhatsAppApiBusinessProfileInput;
type Errors = Partial<Record<Field, "required" | "invalidPhone">>;

type Props = {
  businessId: string;
  profile: WhatsAppApiBusinessProfile;
  onSaved: (profile: WhatsAppApiBusinessProfile) => void;
};

export const BUSINESS_DETAILS_ANCHOR = "wa-api-business-details";

export default function WhatsAppApiBusinessDetailsCard({ businessId, profile, onSaved }: Props) {
  const { t } = useTranslation();
  const id = useId();
  const [form, setForm] = useState<WhatsAppApiBusinessProfileInput>({
    name: profile.name,
    businessName: profile.businessName,
    phone: profile.phone,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const [failure, setFailure] = useState("");

  function validate(values: WhatsAppApiBusinessProfileInput): Errors {
    const next: Errors = {};
    if (!values.name.trim()) next.name = "required";
    if (!values.businessName.trim()) next.businessName = "required";
    if (!values.phone.trim()) next.phone = "required";
    else if (!PHONE_RE.test(values.phone.trim())) next.phone = "invalidPhone";
    return next;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFailure("");
    const next = validate(form);
    setErrors(next);
    const firstInvalid = (Object.keys(next) as Field[])[0];
    if (firstInvalid) {
      document.getElementById(`${id}-${firstInvalid}`)?.focus();
      return;
    }
    setSaving(true);
    try {
      const data = await updateWhatsAppApiBusinessProfile(businessId, {
        name: form.name.trim(),
        businessName: form.businessName.trim(),
        phone: form.phone.trim(),
      });
      onSaved(data.profile);
    } catch (err: any) {
      const fields = err?.response?.data?.fields as Partial<Record<Field, string>> | undefined;
      if (fields && Object.keys(fields).length) {
        setErrors(
          Object.fromEntries(
            (Object.keys(fields) as Field[]).map((key) => [key, key === "phone" ? "invalidPhone" : "required"])
          )
        );
      } else {
        setFailure(t("whatsappApiPortal.setup.businessDetails.error"));
      }
      setSaving(false);
    }
  }

  const input = (name: Field, autoComplete: string, type = "text", maxLength = 120) => (
    <div>
      <label htmlFor={`${id}-${name}`} className="mb-1 block text-xs font-bold text-slate-700">
        {t(`whatsappApiPortal.setup.businessDetails.${name}`)}
      </label>
      <input
        id={`${id}-${name}`}
        name={name}
        type={type}
        dir={type === "tel" ? "ltr" : undefined}
        autoComplete={autoComplete}
        maxLength={maxLength}
        value={form[name]}
        aria-invalid={errors[name] ? true : undefined}
        aria-describedby={errors[name] ? `${id}-${name}-error` : name === "phone" ? `${id}-phone-hint` : undefined}
        onChange={(event) => {
          const { value } = event.target;
          setForm((prev) => ({ ...prev, [name]: value }));
          if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
        }}
        className={`${inputBase} ${errors[name] ? "border-rose-300 focus:border-rose-300 focus:ring-rose-100" : ""}`}
      />
      {errors[name] ? (
        <p id={`${id}-${name}-error`} className="mt-1 text-xs font-semibold text-rose-600">
          {t(`whatsappApiPortal.setup.businessDetails.${errors[name]}`)}
        </p>
      ) : name === "phone" ? (
        <p id={`${id}-phone-hint`} className="mt-1 text-xs font-semibold text-slate-500">
          {t("whatsappApiPortal.setup.businessDetails.phoneHint")}
        </p>
      ) : null}
    </div>
  );

  return (
    <section
      id={BUSINESS_DETAILS_ANCHOR}
      className={`${cardBase} scroll-mt-24 p-4 sm:p-5`}
      data-testid="wa-api-business-details"
      aria-labelledby={`${id}-title`}
    >
      <div className="flex items-start gap-3">
        <span className={`${iconBadge} h-9 w-9 shrink-0`}>
          <Building2 className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <h2 id={`${id}-title`} className="text-sm font-black text-slate-900">
            {t("whatsappApiPortal.setup.businessDetails.title")}
          </h2>
          <p className="mt-0.5 text-xs font-semibold text-slate-500">
            {t("whatsappApiPortal.setup.businessDetails.text")}
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} noValidate className="mt-4 grid gap-3 sm:grid-cols-2">
        {input("name", "name")}
        {input("businessName", "organization", "text", 100)}
        <div className="sm:col-span-2 sm:max-w-[calc(50%-0.375rem)]">{input("phone", "tel", "tel", 30)}</div>
        {failure ? (
          <p className="text-xs font-semibold text-rose-600 sm:col-span-2" role="alert">
            {failure}
          </p>
        ) : null}
        <div className="sm:col-span-2">
          <button type="submit" className={`${btnPrimary} w-full sm:w-auto`} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
            {saving
              ? t("whatsappApiPortal.setup.businessDetails.saving")
              : t("whatsappApiPortal.setup.businessDetails.save")}
          </button>
        </div>
      </form>
    </section>
  );
}
