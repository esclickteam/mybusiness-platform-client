import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPartnerStorefront, updatePartnerStorefront } from "../../lib/partnerApi";
import PartnerPageHeader from "../../components/partner/PartnerPageHeader";
import {
  PartnerCard,
  PartnerInput,
  PartnerPrimaryButton,
  PartnerTextarea,
} from "../../components/partner/partnerUi";

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
    <form onSubmit={save} className="space-y-5">
      <PartnerPageHeader
        eyebrow="קטלוג"
        title="הגדרות קטלוג מוצרים"
        subtitle="קטלוג ציבורי להצגת מוצרים ושירותים. רכישה מתבצעת מול הפרטנר, או בעמוד החבילות אם הופעל."
      />
      <PartnerCard className="space-y-4 p-6">
      {error ? <p className="text-sm font-bold text-rose-600">{error}</p> : null}
      {saved ? <p className="text-sm font-bold text-emerald-700">{saved}</p> : null}
      <PartnerInput
        value={form.slug}
        onChange={(e) => setForm({ ...form, slug: e.target.value })}
        placeholder="slug"
      />
      <PartnerInput
        value={form.logoUrl}
        onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
        placeholder="לוגו URL"
      />
      <p className="text-xs font-bold text-slate-500">
        אם מוגדר לוגו, הוא יופיע בהצעת העסקה ובקישור שנשלח ללקוח.
      </p>
      <PartnerTextarea
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        placeholder="תיאור"
      />
      <PartnerInput
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        placeholder="טלפון"
      />
      <PartnerInput
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        placeholder="אימייל"
      />
      <PartnerInput
        value={form.whatsapp}
        onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
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
      <PartnerPrimaryButton type="submit">שמור</PartnerPrimaryButton>
      </PartnerCard>
    </form>
  );
}
