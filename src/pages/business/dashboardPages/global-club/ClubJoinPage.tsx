import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const { me, base, refresh } = useClub();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  if (me?.status === "active") {
    return <p className="text-sm text-slate-600">You are already a Club member.</p>;
  }
  if (me?.status === "pending") {
    return (
      <ClubCard>
        <p className="font-semibold">Your request has been received.</p>
        <p className="mt-1 text-sm text-slate-600">The Bizuply team will review your application.</p>
      </ClubCard>
    );
  }
  if (me?.status === "suspended") {
    return (
      <ClubCard>
        <p className="font-semibold">Your Club membership is suspended.</p>
        <p className="mt-1 text-sm text-slate-600">The Bizuply team can restore access from the Club admin desk.</p>
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
      setError(clubError(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <ClubCard>
      <h2 className="text-2xl font-bold">Request to Join</h2>
      <p className="mt-1 text-sm text-slate-500">
        Membership is reviewed by the Bizuply team. Sending this form does not activate Club access.
      </p>
      <form onSubmit={onSubmit} className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Full name"><input className={fieldClass} value={form.fullName} onChange={(e) => set("fullName", e.target.value)} required /></Field>
        <Field label="Business name"><input className={fieldClass} value={form.businessName} onChange={(e) => set("businessName", e.target.value)} required /></Field>
        <Field label="Country">
          <select className={fieldClass} value={form.country} onChange={(e) => set("country", e.target.value)} required>
            <option value="">Select a country</option>
            {COUNTRIES.map((country) => <option key={country}>{country}</option>)}
          </select>
        </Field>
        <Field label="Business category">
          <select className={fieldClass} value={form.businessCategory} onChange={(e) => set("businessCategory", e.target.value)} required>
            <option value="">Select a category</option>
            {CATEGORIES.map((category) => <option key={category}>{category}</option>)}
          </select>
        </Field>
        <Field label="Website"><input className={fieldClass} value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="https://" /></Field>
        <Field label="LinkedIn or social profile – optional"><input className={fieldClass} value={form.socialProfile} onChange={(e) => set("socialProfile", e.target.value)} /></Field>
        <div className="sm:col-span-2">
          <Field label="Short business description"><textarea className={fieldClass} rows={3} value={form.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} required /></Field>
        </div>
        <Field label="What do you offer?"><textarea className={fieldClass} rows={3} value={form.offer} onChange={(e) => set("offer", e.target.value)} required /></Field>
        <Field label="What are you looking for?"><textarea className={fieldClass} rows={3} value={form.lookingFor} onChange={(e) => set("lookingFor", e.target.value)} required /></Field>
        <Field label="Markets/countries you currently work in"><textarea className={fieldClass} rows={2} value={form.marketsCurrent} onChange={(e) => set("marketsCurrent", e.target.value)} /></Field>
        <Field label="Markets you would like to enter"><textarea className={fieldClass} rows={2} value={form.marketsDesired} onChange={(e) => set("marketsDesired", e.target.value)} /></Field>
        <div className="sm:col-span-2">
          <Field label="Short message – optional"><textarea className={fieldClass} rows={3} value={form.message} onChange={(e) => set("message", e.target.value)} /></Field>
        </div>
        {error ? <p className="text-sm text-rose-600 sm:col-span-2">{error}</p> : null}
        <div>
          <PrimaryButton type="submit" disabled={saving}>{saving ? "Sending…" : "Submit request"}</PrimaryButton>
        </div>
      </form>
    </ClubCard>
  );
}
