import React, { useEffect, useState } from "react";
import AdminHeader from "./AdminsHeader";
import AdminPageHeader from "./shell/AdminPageHeader";
import API from "../../api";
import { useLocaleDir } from "../../hooks/useLocaleDir";

type Profile = {
  legalCompanyName: string;
  brandName: string;
  entityType: string;
  incorporationCountryCode: string;
  formationJurisdiction: string;
  registrationNumber: string;
  formationDate: string;
  ein: string;
  taxIdMasked: string;
  taxIdOnFile: boolean;
  displayTaxIdInAgreements: boolean;
  registeredAddress: string;
  businessAddress: string;
  legalEmail: string;
  legalPhone: string;
  signatoryName: string;
  signatoryTitle: string;
  signatoryEmail: string;
  signatoryPhone: string;
  governingLaw: string;
  courtsJurisdiction: string;
};

const EMPTY: Profile = {
  legalCompanyName: "",
  brandName: "",
  entityType: "",
  incorporationCountryCode: "",
  formationJurisdiction: "",
  registrationNumber: "",
  formationDate: "",
  ein: "",
  taxIdMasked: "",
  taxIdOnFile: false,
  displayTaxIdInAgreements: false,
  registeredAddress: "",
  businessAddress: "",
  legalEmail: "",
  legalPhone: "",
  signatoryName: "",
  signatoryTitle: "",
  signatoryEmail: "",
  signatoryPhone: "",
  governingLaw: "",
  courtsJurisdiction: "",
};

export default function AdminLegalProfile() {
  const dir = useLocaleDir();
  const [profile, setProfile] = useState<Profile>(EMPTY);
  const [taxId, setTaxId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/admin/legal-profile")
      .then((res) => setProfile({ ...EMPTY, ...res.data.profile }))
      .catch(() => setError("Could not load the Bizuply legal profile."));
  }, []);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      const res = await API.put("/admin/legal-profile", { ...profile, taxId });
      setProfile({ ...EMPTY, ...res.data.profile });
      setTaxId("");
      setMessage("Legal profile saved. New agreements snapshot it. Signed agreements stay as they were.");
    } catch (err: unknown) {
      const row = err as { response?: { data?: { error?: string } } };
      setError(row.response?.data?.error || "Could not save the legal profile.");
    }
  }

  const field = (label: string, key: keyof Profile, type = "text") => (
    <label className="block text-sm font-bold text-slate-800">
      {label}
      {type === "checkbox" ? (
        <input
          className="ms-2"
          type="checkbox"
          checked={Boolean(profile[key])}
          onChange={(e) => setProfile((prev) => ({ ...prev, [key]: e.target.checked }))}
        />
      ) : (
        <input
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold"
          value={String(profile[key] || "")}
          onChange={(e) => setProfile((prev) => ({ ...prev, [key]: e.target.value }))}
        />
      )}
    </label>
  );

  return (
    <div className="min-h-screen bg-[#F7F8FA]" dir={dir}>
      <AdminHeader />
      <main className="mx-auto max-w-[900px] px-4 py-6">
        <AdminPageHeader
          title="פרופיל משפטי"
          description="הפרטים האלה מועתקים לכל הסכם פרטנר בעת יצירת הגרסה. מספר המס מוצפן ומופיע בהסכם רק כשהתצוגה מופעלת."
        />
        <form onSubmit={save} className="mt-5 grid gap-3 rounded-3xl border border-slate-200 bg-white p-5 md:grid-cols-2" data-testid="legal-profile-form">
          {field("שם חברה משפטי", "legalCompanyName")}
          {field("שם מותג לתצוגה", "brandName")}
          {field("סוג ישות", "entityType")}
          {field("מדינת התאגדות", "incorporationCountryCode")}
          {field("מדינה / סמכות התאגדות", "formationJurisdiction")}
          {field("מספר רישום", "registrationNumber")}
          {field("תאריך התאגדות", "formationDate")}
          {field("EIN", "ein")}
          <label className="block text-sm font-bold text-slate-800">
            מספר מס
            <input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold" value={taxId} placeholder={profile.taxIdOnFile ? `שמור ${profile.taxIdMasked}` : "לא נשמר"} onChange={(e) => setTaxId(e.target.value)} />
          </label>
          {field("הצגת מספר מס בהסכמים", "displayTaxIdInAgreements", "checkbox")}
          {field("כתובת משפטית רשומה", "registeredAddress")}
          {field("כתובת עסק אם שונה", "businessAddress")}
          {field("אימייל ליצירת קשר משפטי", "legalEmail")}
          {field("טלפון ליצירת קשר משפטי", "legalPhone")}
          {field("שם מורשה חתימה", "signatoryName")}
          {field("תפקיד מורשה חתימה", "signatoryTitle")}
          {field("אימייל מורשה חתימה", "signatoryEmail")}
          {field("טלפון מורשה חתימה", "signatoryPhone")}
          {field("הדין החל", "governingLaw")}
          {field("בתי משפט / סמכות שיפוט", "courtsJurisdiction")}
          <div className="md:col-span-2">
            <button className="biz-btn" type="submit">שמירת פרופיל</button>
            {message ? <p className="mt-3 text-sm font-bold text-emerald-800">{message}</p> : null}
            {error ? <p className="mt-3 text-sm font-bold text-rose-800">{error}</p> : null}
          </div>
        </form>
      </main>
    </div>
  );
}
