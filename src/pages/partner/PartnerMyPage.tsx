import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchPartnerBranding,
  fetchPartnerMe,
  fetchPartnerPricebook,
  partnerApiError,
} from "../../lib/partnerApi";
import { partnerPersonalUrl } from "../../lib/partnerBranding";
import PartnerBrandingCard from "../../components/partner/PartnerBrandingCard";
import {
  PartnerCard,
  PartnerPrimaryButton,
  PartnerGhostButton,
} from "../../components/partner/partnerUi";

export default function PartnerMyPage() {
  const [personalUrl, setPersonalUrl] = useState("");
  const [plansUrl, setPlansUrl] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");
  const [salesCount, setSalesCount] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      fetchPartnerMe(),
      fetchPartnerBranding(),
      fetchPartnerPricebook().catch(() => []),
    ])
      .then(([me, data, pricebook]) => {
        const urls = data.urls || data.branding?.urls || {};
        setPersonalUrl(
          partnerPersonalUrl({
            subdomain: data.branding?.stored?.subdomain || data.branding?.subdomain,
            urls,
            slug: me.slug,
          })
        );
        setPlansUrl(
          urls.plansUrl || (me.slug ? `${window.location.origin}/p/${me.slug}/plans` : "")
        );
        setSalesCount(
          pricebook.filter((row) => row.enabledInStorefront || row.visibleOnSalesPage).length
        );
      })
      .catch((err) => setError(partnerApiError(err, "שגיאה בטעינת העמוד")));
  }, []);

  async function copy(url: string, key: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(key);
      setTimeout(() => setCopied(""), 2000);
    } catch {
      setError("לא ניתן להעתיק");
    }
  }

  return (
    <div className="space-y-5">
      <PartnerPageHeader
        eyebrow="העמוד שלי"
        title="הקישור האישי שלי"
        subtitle="שלחו ללקוחות את עמוד החבילות. רכישה עצמאית משויכת אליכם אוטומטית."
      />

      {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{error}</p> : null}

      <PartnerCard className="space-y-4 p-6">
        <h2 className="text-lg font-black">הקישור האישי שלי</h2>
        <p className="break-all text-sm font-bold text-violet-700">{personalUrl}</p>
        <div className="flex flex-wrap gap-2">
          <PartnerPrimaryButton type="button" onClick={() => copy(personalUrl, "home")}>
            {copied === "home" ? "הועתק" : "Copy"}
          </PartnerPrimaryButton>
          <a
            href={personalUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm"
          >
            Open
          </a>
          <a
            href={plansUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm"
          >
            עמוד חבילות
          </a>
          <PartnerGhostButton type="button" onClick={() => copy(plansUrl, "plans")}>
            {copied === "plans" ? "הועתק" : "העתק עמוד חבילות"}
          </PartnerGhostButton>
        </div>
        <p className="text-xs font-bold text-slate-500">
          קטלוג ציבורי להצגת מוצרים ושירותים. רכישה מתבצעת מול הפרטנר, או בעמוד החבילות אם הלקוח משלם אונליין.
          קישור /p/slug נשאר זמין כגיבוי.
        </p>
        {salesCount === 0 ? (
          <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
            אין חבילות בעמוד המכירה. הפעילו לפחות מוצר אחד במוצרים וחבילות עם הסימון הצג בעמוד המכירה.
          </p>
        ) : salesCount != null ? (
          <p className="text-xs font-bold text-emerald-700">
            {salesCount} חבילות מוצגות לרכישה עצמאית בעמוד החבילות.
          </p>
        ) : null}
        <div className="flex flex-wrap gap-3">
          <Link to="/partner/dashboard/pricing" className="text-sm font-black text-violet-700">
            מוצרים וחבילות
          </Link>
          <Link to="/partner/dashboard/storefront" className="text-sm font-black text-violet-700">
            הגדרות קטלוג מוצרים
          </Link>
          <Link to="/partner/dashboard/settings" className="text-sm font-black text-violet-700">
            מיתוג וכתובת אישית
          </Link>
        </div>
      </PartnerCard>

      <PartnerBrandingCard showPersonalLink={false} />
    </div>
  );
}
