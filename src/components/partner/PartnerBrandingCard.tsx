import React, { useEffect, useMemo, useState } from "react";
import { Check, Copy, ExternalLink, ImagePlus, Loader2, Upload } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  checkPartnerSubdomain,
  fetchPartnerBranding,
  fetchPartnerMe,
  partnerApiError,
  updatePartnerBranding,
  uploadPartnerLogo,
  type PartnerSubdomainCheck,
} from "../../lib/partnerApi";
import type { PublicPartnerBranding } from "../../lib/partnerBranding";
import {
  PartnerCard,
  PartnerFileButton,
  PartnerGhostButton,
  PartnerInput,
  PartnerPrimaryButton,
} from "./partnerUi";

const LOGO_ACCEPT = "image/jpeg,image/png,image/webp";

function ChecklistItem({ done, label }: { done: boolean; label: string }) {
  return (
    <li className="flex items-center gap-2 text-sm font-bold">
      <span
        className={`grid h-5 w-5 place-items-center rounded-full ${
          done ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"
        }`}
      >
        <Check className="h-3.5 w-3.5" />
      </span>
      <span className={done ? "text-slate-800" : "text-slate-500"}>{label}</span>
    </li>
  );
}

export default function PartnerBrandingCard({ showPersonalLink = true }: { showPersonalLink?: boolean }) {
  const { t } = useTranslation();
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
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [copied, setCopied] = useState("");
  const [slug, setSlug] = useState("");
  const [subdomainCheck, setSubdomainCheck] = useState<PartnerSubdomainCheck | null>(null);
  const [checkingSubdomain, setCheckingSubdomain] = useState(false);

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
    load().catch((err) => setError(partnerApiError(err, t("partner.errors.branding"))));
  }, [t]);

  const savedSubdomain = String(branding?.stored?.subdomain || branding?.subdomain || "").trim();
  const personalUrl = savedSubdomain
    ? `https://${savedSubdomain}.bizuply.com`
    : urls?.personalUrl ||
      urls?.slugUrl ||
      (slug ? `${typeof window !== "undefined" ? window.location.origin : ""}/p/${slug}` : "");
  const logoUrl = branding?.stored?.logoUrl || branding?.logoUrl || "";
  const active = Boolean(branding?.whiteLabelEnabled);
  const hasBrandName = Boolean(brandName.trim());
  const hasLogo = Boolean(logoUrl);
  const subdomainReady = Boolean(
    subdomain.trim() && (subdomainCheck?.available !== false || subdomain.trim() === savedSubdomain)
  );

  useEffect(() => {
    const value = subdomain.trim().toLowerCase();
    if (!value) {
      setSubdomainCheck(null);
      setCheckingSubdomain(false);
      return;
    }
    if (value === savedSubdomain) {
      setSubdomainCheck({
        value,
        available: true,
        code: "SUBDOMAIN_CURRENT",
        message: t("partner.branding.thisIsLive"),
      });
      setCheckingSubdomain(false);
      return;
    }
    if (value.length < 3) {
      setSubdomainCheck({
        value,
        available: false,
        code: "SUBDOMAIN_SHORT",
        message: t("partner.branding.minChars"),
      });
      setCheckingSubdomain(false);
      return;
    }

    let cancelled = false;
    setCheckingSubdomain(true);
    const timer = window.setTimeout(() => {
      checkPartnerSubdomain(value)
        .then((result) => {
          if (!cancelled) setSubdomainCheck(result);
        })
        .catch((err) => {
          if (!cancelled) {
            setSubdomainCheck({
              value,
              available: false,
              code: "SUBDOMAIN_CHECK_FAILED",
              message: partnerApiError(err, t("partner.errors.slugCheck")),
            });
          }
        })
        .finally(() => {
          if (!cancelled) setCheckingSubdomain(false);
        });
    }, 400);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [subdomain, savedSubdomain, t]);

  const subdomainStatus = useMemo(() => {
    if (!subdomain.trim()) {
      return { tone: "slate", text: t("partner.branding.typeToCheck") };
    }
    if (checkingSubdomain) {
      return { tone: "slate", text: t("partner.branding.checking") };
    }
    if (!subdomainCheck) {
      return { tone: "slate", text: t("partner.branding.checking") };
    }
    if (subdomainCheck.available) {
      return {
        tone: "emerald",
        text: subdomainCheck.message || t("partner.branding.available", { defaultValue: "הכתובת פנויה" }),
      };
    }
    return {
      tone: "rose",
        text: subdomainCheck.message || t("partner.branding.unavailable"),
    };
  }, [subdomain, checkingSubdomain, subdomainCheck, t]);

  async function copy(url: string, key: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(key);
      setTimeout(() => setCopied(""), 2000);
    } catch {
      setError(t("partner.errors.copy"));
    }
  }

  async function saveBranding() {
    if (subdomain.trim() && subdomainCheck?.available === false) {
      setError(subdomainCheck.message || t("partner.errors.slugTaken"));
      return;
    }
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
      setSaved(active || entitled ? t("partner.branding.saved") : t("partner.branding.savedPremium"));
    } catch (err: unknown) {
      setError(partnerApiError(err, t("partner.errors.saveBranding")));
    } finally {
      setSaving(false);
    }
  }

  async function onLogo(file?: File) {
    if (!file) return;
    setUploadingLogo(true);
    setError("");
    try {
      const data = await uploadPartnerLogo(file, "logo");
      setBranding(data.branding || data);
      setSaved(t("partner.branding.logoUpdated"));
    } catch (err: unknown) {
      setError(partnerApiError(err, t("partner.errors.logoUpload")));
    } finally {
      setUploadingLogo(false);
    }
  }

  async function removeLogo() {
    setError("");
    try {
      const data = await updatePartnerBranding({ logoUrl: "" });
      setBranding(data.branding);
      setSaved(t("partner.branding.logoRemoved"));
    } catch (err: unknown) {
      setError(partnerApiError(err, t("partner.errors.logoRemove")));
    }
  }

  const saveBlocked = Boolean(saving || checkingSubdomain || (subdomain.trim() && subdomainCheck?.available === false));

  return (
    <PartnerCard className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-black">{t("partner.branding.title", { defaultValue: "מיתוג וכתובת אישית" })}</h2>
          <p className="mt-1 text-sm font-bold text-slate-500">
            {t("partner.branding.intro")}
          </p>
        </div>
        {active ? (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800">
            {t("partner.branding.whiteLabelOn")}
          </span>
        ) : entitled ? (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-800">
            {t("partner.branding.missingDetails")}
          </span>
        ) : (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
            {t("partner.branding.premiumOnly")}
          </span>
        )}
      </div>

      {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{error}</p> : null}
      {saved ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">{saved}</p> : null}

      {!entitled ? (
        <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
          {t("partner.branding.premiumHint")}
        </p>
      ) : !active ? (
        <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
          {t("partner.branding.needAll")}
        </p>
      ) : null}

      <ul className="grid gap-2 rounded-2xl bg-slate-50 p-4 sm:grid-cols-3">
        <ChecklistItem done={hasBrandName} label={t("partner.branding.brandName", { defaultValue: "שם מותג" })} />
        <ChecklistItem done={hasLogo} label={t("partner.branding.logo")} />
        <ChecklistItem done={subdomainReady} label={t("partner.branding.availableSubdomain")} />
      </ul>

      {showPersonalLink && personalUrl ? (
        <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
          <p className="text-sm font-black">{t("partner.branding.personalLink", { defaultValue: "הקישור האישי שלי" })}</p>
          <p className="mt-1 break-all text-sm font-bold text-violet-700" dir="ltr">
            {personalUrl}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <PartnerPrimaryButton type="button" onClick={() => copy(personalUrl, "home")}>
              <Copy className="h-4 w-4" />
              {copied === "home" ? t("partner.copied") : t("partner.copy", { defaultValue: "העתקה" })}
            </PartnerPrimaryButton>
            <a
              href={personalUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm"
            >
              <ExternalLink className="h-4 w-4" />
              {t("partner.branding.preview", { defaultValue: "תצוגה מקדימה" })}
            </a>
          </div>
        </div>
      ) : null}

      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-black text-slate-900">{t("partner.branding.logo")}</h3>
          <p className="text-xs font-bold text-slate-500">{t("partner.branding.logoHint")}</p>
        </div>
        <div
          className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center"
          onDragOver={(event) => {
            event.preventDefault();
          }}
          onDrop={(event) => {
            event.preventDefault();
            if (uploadingLogo) return;
            const file = event.dataTransfer.files?.[0];
            if (file) void onLogo(file);
          }}
        >
          <label
            htmlFor="partner-logo-file"
            className="grid h-24 w-24 shrink-0 cursor-pointer place-items-center overflow-hidden rounded-2xl border border-dashed border-violet-200 bg-violet-50/60"
          >
            {logoUrl ? (
              <img src={logoUrl} alt={t("partner.branding.logo")} className="h-full w-full object-contain p-2" />
            ) : (
              <div className="flex flex-col items-center gap-1 text-violet-500">
                <ImagePlus className="h-6 w-6" />
                <span className="text-[11px] font-black">{t("partner.branding.upload")}</span>
              </div>
            )}
          </label>
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex flex-wrap gap-2">
              <PartnerFileButton
                inputId="partner-logo-file"
                accept={LOGO_ACCEPT}
                disabled={uploadingLogo}
                onFile={onLogo}
              >
                {uploadingLogo ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t("partner.branding.uploading")}
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    {logoUrl ? t("partner.branding.replaceLogo") : t("partner.branding.uploadLogo", { defaultValue: "העלאת לוגו" })}
                  </>
                )}
              </PartnerFileButton>
              {logoUrl ? (
                <PartnerGhostButton type="button" onClick={removeLogo}>
                  {t("partner.branding.removeLogo")}
                </PartnerGhostButton>
              ) : null}
            </div>
            <p className="text-xs font-bold text-slate-500">{t("partner.branding.uploadHint")}</p>
          </div>
        </div>
      </section>

      <label className="block text-sm font-black text-slate-800">
        {t("partner.branding.brandName", { defaultValue: "שם מותג" })}
        <PartnerInput
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
          className="mt-1"
          placeholder={t("partner.branding.customersSee")}
        />
      </label>

      <section className="space-y-2">
        <label className="block text-sm font-black text-slate-800">
          {t("partner.branding.subdomain", { defaultValue: "כתובת משנה" })}
          <div className="mt-1 flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2" dir="ltr">
            <span className="text-sm font-bold text-slate-400">https://</span>
            <input
              value={subdomain}
              onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
              className="min-w-[8rem] flex-1 bg-transparent py-1 text-sm font-bold text-slate-800 outline-none"
              placeholder="mybrand"
              autoComplete="off"
              spellCheck={false}
            />
            <span className="text-sm font-bold text-slate-400">.bizuply.com</span>
          </div>
        </label>
        <p
          className={`text-xs font-bold ${
            subdomainStatus.tone === "emerald"
              ? "text-emerald-700"
              : subdomainStatus.tone === "rose"
                ? "text-rose-700"
                : "text-slate-500"
          }`}
        >
          {subdomainStatus.text}
        </p>
        <p className="text-xs font-bold text-slate-500">
          {t("partner.branding.slugHint")}
        </p>
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-black text-slate-800">
          {t("partner.branding.supportEmail")}
          <PartnerInput value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} className="mt-1" />
        </label>
        <label className="text-sm font-black text-slate-800">
          {t("partner.branding.supportPhone")}
          <PartnerInput value={supportPhone} onChange={(e) => setSupportPhone(e.target.value)} className="mt-1" />
        </label>
      </div>

      <PartnerPrimaryButton type="button" disabled={saveBlocked} onClick={saveBranding}>
        {saving ? t("partner.saving") : t("partner.branding.saveBranding")}
      </PartnerPrimaryButton>
    </PartnerCard>
  );
}
