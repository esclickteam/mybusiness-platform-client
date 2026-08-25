import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchPartnerBranding,
  fetchPartnerMe,
  fetchPartnerPricebook,
  partnerApiError,
  updatePartnerBranding,
  uploadPartnerLogo,
} from "../../lib/partnerApi";
import type { PartnerMe } from "../../types/partner";
import type { PublicPartnerBranding } from "../../lib/partnerBranding";
import PartnerPageHeader from "../../components/partner/PartnerPageHeader";
import {
  PartnerCard,
  PartnerInput,
  PartnerPrimaryButton,
  PartnerGhostButton,
} from "../../components/partner/partnerUi";

export default function PartnerMyPage() {
  const [partner, setPartner] = useState<PartnerMe | null>(null);
  const [branding, setBranding] = useState<PublicPartnerBranding | null>(null);
  const [urls, setUrls] = useState<PublicPartnerBranding["urls"]>({});
  const [entitled, setEntitled] = useState(false);
  const [brandName, setBrandName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [supportPhone, setSupportPhone] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState("");
  const [salesCount, setSalesCount] = useState<number | null>(null);

  async function load() {
    const [me, data, pricebook] = await Promise.all([
      fetchPartnerMe(),
      fetchPartnerBranding(),
      fetchPartnerPricebook().catch(() => []),
    ]);
    setPartner(me);
    setBranding(data.branding);
    setUrls(data.urls || data.branding?.urls || {});
    setEntitled(Boolean(data.entitled || data.branding?.whiteLabelEntitled));
    setBrandName(data.branding?.stored?.brandName || data.branding?.brandName || me.name || "");
    setSubdomain(data.branding?.stored?.subdomain || data.branding?.subdomain || "");
    setSupportEmail(data.branding?.supportEmail || "");
    setSupportPhone(data.branding?.supportPhone || "");
    setSalesCount(
      pricebook.filter((row) => row.enabledInStorefront || row.visibleOnSalesPage).length
    );
  }

  useEffect(() => {
    load().catch((err) => setError(partnerApiError(err, "שגיאה בטעינת העמוד")));
  }, []);

  const personalUrl = urls?.personalUrl || urls?.slugUrl || (partner?.slug ? `${window.location.origin}/p/${partner.slug}` : "");
  const plansUrl = urls?.plansUrl || (partner?.slug ? `${window.location.origin}/p/${partner.slug}/plans` : "");
  const logoUrl = branding?.stored?.logoUrl || branding?.logoUrl || "";

  async function copy(url: string, key: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(key);
      setTimeout(() => setCopied(""), 2000);
    } catch {
      setError("לא ניתן להעתיק");
    }
  }

  async function saveBranding() {
    setSaving(true);
    setError("");
    setSaved("");
    try {
      const data = await updatePartnerBranding({
        brandName,
        subdomain,
        supportEmail,
        supportPhone,
      });
      setBranding(data.branding);
      setUrls(data.urls || data.branding?.urls || {});
      setSaved("המיתוג נשמר");
    } catch (err: unknown) {
      setError(partnerApiError(err, "שגיאה בשמירת מיתוג"));
    } finally {
      setSaving(false);
    }
  }

  async function onLogo(file?: File, kind: "logo" | "favicon" = "logo") {
    if (!file) return;
    setError("");
    try {
      const data = await uploadPartnerLogo(file, kind);
      setBranding(data.branding || data);
      setSaved(kind === "favicon" ? "ה-favicon עודכן" : "הלוגו עודכן");
    } catch (err: unknown) {
      setError(partnerApiError(err, "שגיאה בהעלאת קובץ"));
    }
  }

  async function removeLogo() {
    setError("");
    try {
      const data = await updatePartnerBranding({ logoUrl: "" });
      setBranding(data.branding);
      setSaved("הלוגו הוסר");
    } catch (err: unknown) {
      setError(partnerApiError(err, "לא ניתן להסיר לוגו"));
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
      {saved ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">{saved}</p> : null}

      <PartnerCard className="space-y-4 p-6">
        <h2 className="text-lg font-black">הקישור האישי שלי</h2>
        <p className="break-all text-sm font-bold text-violet-700">{personalUrl}</p>
        <div className="flex flex-wrap gap-2">
          <PartnerPrimaryButton type="button" onClick={() => copy(personalUrl, "home")}>
            {copied === "home" ? "הועתק" : "העתק קישור"}
          </PartnerPrimaryButton>
          <a
            href={personalUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm"
          >
            הצג עמוד
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
        </div>
      </PartnerCard>

      <PartnerCard className="space-y-4 p-6">
        <h2 className="text-lg font-black">מיתוג וכתובת אישית</h2>
        {!entitled ? (
          <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
            White Label זמין במסלול Premium בלבד. ההגדרות נשמרות אבל לא יוצגו ללקוחות עד שדרוג.
          </p>
        ) : null}
        <div className="flex flex-wrap items-center gap-4">
          {logoUrl ? (
            <img src={logoUrl} alt="" className="h-20 w-20 rounded-2xl border object-contain" />
          ) : (
            <div className="grid h-20 w-20 place-items-center rounded-2xl bg-slate-100 text-xs font-black text-slate-400">
              אין לוגו
            </div>
          )}
          <div className="space-y-2">
            <label className="block text-sm font-black">
              העלאת לוגו (JPG/PNG/WEBP עד 2MB)
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={!entitled}
                className="mt-1 block text-sm"
                onChange={(e) => onLogo(e.target.files?.[0], "logo")}
              />
            </label>
            <label className="block text-sm font-black">
              Favicon (אופציונלי)
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={!entitled}
                className="mt-1 block text-sm"
                onChange={(e) => onLogo(e.target.files?.[0], "favicon")}
              />
            </label>
            {logoUrl ? (
              <button type="button" className="text-sm font-black text-rose-700" onClick={removeLogo} disabled={!entitled}>
                הסרת לוגו
              </button>
            ) : null}
          </div>
        </div>
        <label className="block text-sm font-black">
          שם מותג
          <PartnerInput value={brandName} onChange={(e) => setBrandName(e.target.value)} className="mt-1" disabled={!entitled} />
        </label>
        <label className="block text-sm font-black">
          כתובת האתר האישית שלך
          <PartnerInput
            value={subdomain}
            onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
            className="mt-1"
            disabled={!entitled}
            placeholder="mybrand"
            dir="ltr"
          />
          <span className="mt-1 block text-xs font-bold text-slate-500" dir="ltr">
            https://{subdomain || "mybrand"}.bizuply.com
          </span>
          <span className="mt-1 block text-xs font-bold text-slate-500">
            כתובת המשנה נשמרת במערכת. הפניית DNS / wildcard לדומיין עדיין לא פעילה בסביבת הייצור — עד אז
            השתמשו בקישור /p/slug.
          </span>
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-black">
            אימייל תמיכה (אופציונלי)
            <PartnerInput value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} className="mt-1" disabled={!entitled} />
          </label>
          <label className="text-sm font-black">
            טלפון תמיכה (אופציונלי)
            <PartnerInput value={supportPhone} onChange={(e) => setSupportPhone(e.target.value)} className="mt-1" disabled={!entitled} />
          </label>
        </div>
        <PartnerPrimaryButton type="button" disabled={!entitled || saving} onClick={saveBranding}>
          {saving ? "שומר..." : "שמירת מיתוג"}
        </PartnerPrimaryButton>
      </PartnerCard>
    </div>
  );
}
