import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useClub } from "./GlobalBusinessClubPage";
import { clubError, clubSend } from "./clubApi";
import { CATEGORIES, COUNTRIES, ClubCard, Field, PrimaryButton, fieldClass } from "./clubUi";

const EMPTY = {
  fullName: "",
  businessName: "",
  country: "",
  businessCategory: "",
  website: "",
  shortDescription: "",
  offer: "",
  lookingFor: "",
  marketsCurrent: "",
  marketsDesired: "",
  socialProfile: "",
  message: "",
};

export default function ClubJoinPage() {
  const { t } = useTranslation();
  const { me, base, refresh } = useClub();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  if (me?.status === "active") {
    return <p className="text-sm text-slate-600">{t("club.join.alreadyMember")}</p>;
  }
  if (me?.status === "pending") {
    return (
      <ClubCard>
        <p className="font-semibold">{t("club.landing.pendingTitle")}</p>
        <p className="mt-1 text-sm text-slate-600">{t("club.landing.pendingBody")}</p>
      </ClubCard>
    );
  }
  if (me?.status === "suspended") {
    return (
      <ClubCard>
        <p className="font-semibold">{t("club.join.suspendedTitle")}</p>
        <p className="mt-1 text-sm text-slate-600">{t("club.join.suspendedBody")}</p>
      </ClubCard>
    );
  }

  function set(field: keyof typeof EMPTY, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await clubSend("post", "/club/join", form);
      await refresh();
      navigate(base);
    } catch (err) {
      setError(clubError(err, t));
    } finally {
      setSaving(false);
    }
  }

  return (
    <ClubCard>
      <h2 className="text-2xl font-bold">{t("club.join.title")}</h2>
      <p className="mt-1 text-sm text-slate-500">{t("club.join.intro")}</p>
      <form onSubmit={onSubmit} className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label={t("club.join.fullName")}><input className={fieldClass} value={form.fullName} onChange={(e) => set("fullName", e.target.value)} required /></Field>
        <Field label={t("club.join.businessName")}><input className={fieldClass} value={form.businessName} onChange={(e) => set("businessName", e.target.value)} required /></Field>
        <Field label={t("club.join.country")}>
          <select className={fieldClass} value={form.country} onChange={(e) => set("country", e.target.value)} required>
            <option value="">{t("club.join.selectCountry")}</option>
            {COUNTRIES.map((country) => <option key={country} value={country}>{t(`club.countries.${country}`)}</option>)}
          </select>
        </Field>
        <Field label={t("club.join.category")}>
          <select className={fieldClass} value={form.businessCategory} onChange={(e) => set("businessCategory", e.target.value)} required>
            <option value="">{t("club.join.selectCategory")}</option>
            {CATEGORIES.map((category) => <option key={category} value={category}>{t(`club.categories.${category}`)}</option>)}
          </select>
        </Field>
        <Field label={t("club.join.website")}><input className={fieldClass} value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="https://" /></Field>
        <Field label={t("club.join.social")}><input className={fieldClass} value={form.socialProfile} onChange={(e) => set("socialProfile", e.target.value)} /></Field>
        <div className="sm:col-span-2">
          <Field label={t("club.join.shortDescription")}><textarea className={fieldClass} rows={3} value={form.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} required /></Field>
        </div>
        <Field label={t("club.join.offer")}><textarea className={fieldClass} rows={3} value={form.offer} onChange={(e) => set("offer", e.target.value)} required /></Field>
        <Field label={t("club.join.lookingFor")}><textarea className={fieldClass} rows={3} value={form.lookingFor} onChange={(e) => set("lookingFor", e.target.value)} required /></Field>
        <Field label={t("club.join.marketsCurrent")}><textarea className={fieldClass} rows={2} value={form.marketsCurrent} onChange={(e) => set("marketsCurrent", e.target.value)} /></Field>
        <Field label={t("club.join.marketsDesired")}><textarea className={fieldClass} rows={2} value={form.marketsDesired} onChange={(e) => set("marketsDesired", e.target.value)} /></Field>
        <div className="sm:col-span-2">
          <Field label={t("club.join.message")}><textarea className={fieldClass} rows={3} value={form.message} onChange={(e) => set("message", e.target.value)} /></Field>
        </div>
        {error ? <p className="text-sm text-rose-600 sm:col-span-2">{error}</p> : null}
        <div>
          <PrimaryButton type="submit" disabled={saving}>{saving ? t("club.join.sending") : t("club.join.submit")}</PrimaryButton>
        </div>
      </form>
    </ClubCard>
  );
}
