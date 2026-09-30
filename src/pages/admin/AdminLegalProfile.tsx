import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminHeader from "./AdminsHeader";
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
        <Link to="/admin/settings" className="text-sm font-black text-[#6D28D9]">Settings</Link>
        <h1 className="mt-3 text-3xl font-black">Bizuply Legal Profile</h1>
        <p className="mt-2 text-sm font-semibold text-slate-600">
          These details are copied into each Partner Agreement when that version is generated. EIN / Tax ID is stored encrypted and appears in an agreement only when display is turned on.
        </p>
        <form onSubmit={save} className="mt-5 grid gap-3 rounded-3xl border border-slate-200 bg-white p-5 md:grid-cols-2" data-testid="legal-profile-form">
          {field("Legal company name", "legalCompanyName")}
          {field("Brand / display name", "brandName")}
          {field("Entity type", "entityType")}
          {field("Country of incorporation", "incorporationCountryCode")}
          {field("State / jurisdiction of formation", "formationJurisdiction")}
          {field("Company registration / Delaware file number", "registrationNumber")}
          {field("Formation date", "formationDate")}
          {field("EIN", "ein")}
          <label className="block text-sm font-bold text-slate-800">
            EIN / Tax ID
            <input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold" value={taxId} placeholder={profile.taxIdOnFile ? `On file ${profile.taxIdMasked}` : "Not stored"} onChange={(e) => setTaxId(e.target.value)} />
          </label>
          {field("Show tax ID in agreements", "displayTaxIdInAgreements", "checkbox")}
          {field("Registered legal address", "registeredAddress")}
          {field("Business address if different", "businessAddress")}
          {field("Legal contact email", "legalEmail")}
          {field("Legal contact phone", "legalPhone")}
          {field("Authorized signatory full name", "signatoryName")}
          {field("Authorized signatory title", "signatoryTitle")}
          {field("Authorized signatory email", "signatoryEmail")}
          {field("Authorized signatory phone", "signatoryPhone")}
          {field("Governing law", "governingLaw")}
          {field("Courts / jurisdiction", "courtsJurisdiction")}
          <div className="md:col-span-2">
            <button className="rounded-xl bg-[#6D28D9] px-4 py-2 text-sm font-black text-white" type="submit">Save legal profile</button>
            {message ? <p className="mt-3 text-sm font-bold text-emerald-800">{message}</p> : null}
            {error ? <p className="mt-3 text-sm font-bold text-rose-800">{error}</p> : null}
          </div>
        </form>
      </main>
    </div>
  );
}
