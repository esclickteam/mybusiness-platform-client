import React, { useEffect, useState } from "react";
import {
  fetchPartnerBranding,
  fetchPartnerMe,
  partnerApiError,
  updatePartnerBranding,
  uploadPartnerLogo,
} from "../../lib/partnerApi";
import type { PublicPartnerBranding } from "../../lib/partnerBranding";
import {
  PartnerCard,
  PartnerInput,
  PartnerPrimaryButton,
} from "./partnerUi";

export default function PartnerBrandingCard({ showPersonalLink = true }: { showPersonalLink?: boolean }) {
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
  const [slug, setSlug] = useState("");

  async function load() {
    const [me, data] = await Promise.all([fetchPartnerMe(), fetchPartnerBranding()]);
    setSlug(me.slug || "");
    setBranding(data.branding);
    setUrls(data.urls || data.branding?.urls || {});
    setEntitled(Boolean(data.entitled || data.branding?.whiteLabelEntitled));
    setBrandName(data.branding?.stored?.brandName || data.branding?.brandName || me.name || "");
    setSubdomain(data.branding?.stored?.subdomain || data.branding?.subdomain || "");
    setSupportEmail(data.branding?.stored?.supportEmail || data.branding?.supportEmail || "");
    setSupportPhone(data.branding?.stored?.supportPhone || data.branding?.supportPhone || "");
  }

  useEffect(() => {
    load().catch((err) => setError(partnerApiError(err, "שגיאה בטעינת מיתוג")));
  }, []);

  const savedSubdomain = String(branding?.stored?.subdomain || branding?.subdomain || "").trim();
  const personalUrl = savedSubdomain
    ? `https://${savedSubdomain}.bizuply.com`
    : urls?.personalUrl ||
      urls?.slugUrl ||
      (slug ? `${typeof window !== "undefined" ? window.location.origin : ""}/p/${slug}` : "");
  const logoUrl = branding?.stored?.logoUrl || branding?.logoUrl || "";
  const active = Boolean(branding?.whiteLabelEnabled);

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
      setSaved(active || entitled ? "המיתוג נשמר" : "המיתוג נשמר. יוצג ללקוחות אחרי שדרוג ל-Premium.");
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
    <PartnerCard className="space-y-4 p-6">
      <h2 className="text-lg font-black">מיתוג וכתובת אישית</h2>
      {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{error}</p> : null}
      {saved ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">{saved}</p> : null}
      {!entitled ? (
        <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
          White Label פעיל רק במסלול Premium. אפשר לשמור מיתוג כבר עכשיו — הלקוחות ימשיכו לראות את Bizuply עד שדרוג.
        </p>
      ) : !active ? (
        <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
          כדי להפעיל White Label נדרשים שם מותג, לוגו וכתובת משנה.
        </p>
      ) : null}

      {showPersonalLink && personalUrl ? (
        <div className="space-y-2">
          <p className="text-sm font-black">הקישור האישי שלי</p>
          <p className="break-all text-sm font-bold text-violet-700" dir="ltr">
            {personalUrl}
          </p>
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
          </div>
        </div>
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
            לוגו
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="mt-1 block text-sm"
              onChange={(e) => onLogo(e.target.files?.[0], "logo")}
            />
          </label>
          <label className="block text-sm font-black">
            Favicon (אופציונלי)
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="mt-1 block text-sm"
              onChange={(e) => onLogo(e.target.files?.[0], "favicon")}
            />
          </label>
          {logoUrl ? (
            <button type="button" className="text-sm font-black text-rose-700" onClick={removeLogo}>
              הסרת לוגו
            </button>
          ) : null}
        </div>
      </div>
      <label className="block text-sm font-black">
        Brand Name
        <PartnerInput value={brandName} onChange={(e) => setBrandName(e.target.value)} className="mt-1" />
      </label>
      <label className="block text-sm font-black">
        Subdomain
        <PartnerInput
          value={subdomain}
          onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
          className="mt-1"
          placeholder="mybrand"
          dir="ltr"
        />
        <span className="mt-1 block text-xs font-bold text-slate-500" dir="ltr">
          https://{subdomain || "mybrand"}.bizuply.com
        </span>
        <span className="mt-1 block text-xs font-bold text-slate-500">
          אותיות לטיניות, ספרות ומקף. ייחודית במערכת. White Label דורש גם לוגו ושם מותג.
          הפניית DNS / wildcard של *.bizuply.com עדיין לא מאומתת בייצור.
        </span>
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-black">
          אימייל תמיכה (אופציונלי)
          <PartnerInput value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} className="mt-1" />
        </label>
        <label className="text-sm font-black">
          טלפון תמיכה (אופציונלי)
          <PartnerInput value={supportPhone} onChange={(e) => setSupportPhone(e.target.value)} className="mt-1" />
        </label>
      </div>
      <PartnerPrimaryButton type="button" disabled={saving} onClick={saveBranding}>
        {saving ? "שומר..." : "שמירת מיתוג"}
      </PartnerPrimaryButton>
    </PartnerCard>
  );
}
