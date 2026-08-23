import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPartnerStorefront, updatePartnerStorefront } from "../../lib/partnerApi";

export default function PartnerStorefrontSettings() {
  const [form, setForm] = useState({
    slug: "",
    logoUrl: "",
    description: "",
    phone: "",
    email: "",
    whatsapp: "",
    heroText: "",
    enabled: false,
    hideBizuplyBranding: false,
    showRetailComparison: false,
  });
  const [meta, setMeta] = useState({
    canHideBizuplyBranding: false,
    customDomainEligible: false,
  });
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");

  useEffect(() => {
    fetchPartnerStorefront()
      .then((data) => {
        setForm({
          slug: data.slug || "",
          logoUrl: data.branding?.logoUrl || "",
          description: data.branding?.description || "",
          phone: data.branding?.phone || "",
          email: data.branding?.email || "",
          whatsapp: data.branding?.whatsapp || "",
          heroText: data.branding?.heroText || "",
          enabled: Boolean(data.storefront?.enabled),
          hideBizuplyBranding: Boolean(data.branding?.hideBizuplyBranding),
          showRetailComparison: Boolean(data.branding?.showRetailComparison),
        });
        setMeta({
          canHideBizuplyBranding: Boolean(data.canHideBizuplyBranding),
          customDomainEligible: Boolean(data.customDomainEligible),
        });
      })
      .catch((err) => setError(err.response?.data?.error || "שגיאה בטעינת חנות"));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaved("");
    try {
      const data = await updatePartnerStorefront(form);
      setForm((prev) => ({ ...prev, slug: data.slug || prev.slug }));
      setSaved("נשמר");
    } catch (err: any) {
      setError(err.response?.data?.error || "שגיאה בשמירה");
    }
  }

  return (
    <form onSubmit={save} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="text-xl font-black">הגדרות חנות</h2>
      {error ? <p className="text-sm font-bold text-rose-600">{error}</p> : null}
      {saved ? <p className="text-sm font-bold text-emerald-700">{saved}</p> : null}
      <input
        value={form.slug}
        onChange={(e) => setForm({ ...form, slug: e.target.value })}
        className="w-full rounded-xl border border-slate-200 px-3 py-2"
        placeholder="slug"
      />
      <input
        value={form.logoUrl}
        onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
        className="w-full rounded-xl border border-slate-200 px-3 py-2"
        placeholder="לוגו URL"
      />
      <textarea
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        className="w-full rounded-xl border border-slate-200 px-3 py-2"
        placeholder="תיאור"
      />
      <input
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        className="w-full rounded-xl border border-slate-200 px-3 py-2"
        placeholder="טלפון"
      />
      <input
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full rounded-xl border border-slate-200 px-3 py-2"
        placeholder="אימייל"
      />
      <input
        value={form.whatsapp}
        onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
        className="w-full rounded-xl border border-slate-200 px-3 py-2"
        placeholder="WhatsApp"
      />
      <label className="block text-sm font-bold">
        <input
          type="checkbox"
          checked={form.enabled}
          onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
        />{" "}
        הפעל עמוד מכירה
      </label>
      <label className="block text-sm font-bold">
        <input
          type="checkbox"
          checked={form.showRetailComparison}
          onChange={(e) => setForm({ ...form, showRetailComparison: e.target.checked })}
        />{" "}
        הצג מחיר Retail להשוואה בלבד
      </label>
      {meta.canHideBizuplyBranding ? (
        <label className="block text-sm font-bold">
          <input
            type="checkbox"
            checked={form.hideBizuplyBranding}
            onChange={(e) => setForm({ ...form, hideBizuplyBranding: e.target.checked })}
          />{" "}
          הסתר מיתוג Bizuply בעמוד המכירה
        </label>
      ) : null}
      {meta.customDomainEligible ? (
        <p className="text-sm font-bold text-slate-500">
          דומיין מותאם זכאי במסלול זה — החיבור עצמו יגיע ב-Phase 1B.
        </p>
      ) : null}
      {form.slug ? (
        <Link to={`/p/${form.slug}`} className="block text-sm font-black text-[#7C4DFF]">
          תצוגה מקדימה: /p/{form.slug}
        </Link>
      ) : null}
      <button type="submit" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-black text-white">
        שמור
      </button>
    </form>
  );
}
