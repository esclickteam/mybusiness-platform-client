import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  ExternalLink,
  FileUp,
  Loader2,
  RefreshCw,
  Search,
  Upload,
} from "lucide-react";

import type { SiteSeoSettings } from "../../../types";
import {
  extractGoogleSiteVerificationToken,
  normalizeGoogleHtmlFileName,
} from "../../../utils/pageSeoUtils";
import {
  runGscReadinessChecks,
  type GscCheckResult,
} from "../../../utils/gscReadinessChecks";
import { seoFieldClass, seoTextareaClass } from "./SeoUi";

const GSC_WELCOME_URL =
  "https://search.google.com/search-console/welcome";
const GSC_HOME_URL = "https://search.google.com/search-console";

export type GscVerificationMethod = "meta" | "html";

type GscVerificationWizardProps = {
  siteBaseUrl: string;
  publicUrlIsPlaceholder?: boolean;
  siteSeoDraft: SiteSeoSettings;
  setSiteSeoDraft: React.Dispatch<React.SetStateAction<SiteSeoSettings>>;
  fieldClass?: string;
  textareaClass?: string;
};

function RecommendedBadge() {
  const { t } = useTranslation();
  return (
    <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-700">
      {t("studio.gsc.recommended")}
    </span>
  );
}

function StepBadge({ n }: { n: number }) {
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-black text-white">
      {n}
    </span>
  );
}

function MethodCard({
  selected,
  title,
  subtitle,
  recommended,
  onClick,
}: {
  selected: boolean;
  title: string;
  subtitle: string;
  recommended?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full rounded-2xl border px-3.5 py-3 text-start transition",
        selected
          ? "border-blue-400 bg-blue-50 shadow-sm ring-2 ring-blue-100"
          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-black text-slate-900">{title}</p>
          <p className="mt-1 text-[11px] font-semibold leading-5 text-slate-500">
            {subtitle}
          </p>
        </div>
        {recommended ? (
          <RecommendedBadge />
        ) : null}
      </div>
    </button>
  );
}

export default function GscVerificationWizard({
  siteBaseUrl,
  publicUrlIsPlaceholder,
  siteSeoDraft,
  setSiteSeoDraft,
  fieldClass = seoFieldClass,
  textareaClass = seoTextareaClass,
}: GscVerificationWizardProps) {
  const { t } = useTranslation();
  const verificationCode = String(
    siteSeoDraft.googleSiteVerification || "",
  ).trim();
  const htmlFileName = String(
    siteSeoDraft.googleHtmlVerificationFile || "",
  ).trim();
  const htmlContent = String(
    siteSeoDraft.googleHtmlVerificationContent || "",
  ).trim();

  const hasMeta = Boolean(verificationCode);
  const hasHtmlPair = Boolean(htmlFileName && htmlContent);
  const hasAnyVerification = hasMeta || hasHtmlPair;

  const [method, setMethod] = useState<GscVerificationMethod>(() =>
    hasHtmlPair && !hasMeta ? "html" : "meta",
  );
  const [copiedKey, setCopiedKey] = useState("");
  const [copyError, setCopyError] = useState("");
  const [metaError, setMetaError] = useState("");
  const [htmlError, setHtmlError] = useState("");
  const [uploadName, setUploadName] = useState("");
  const [checks, setChecks] = useState<GscCheckResult[] | null>(null);
  const [checksLoading, setChecksLoading] = useState(false);
  const [checksError, setChecksError] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const copyTimerRef = useRef<number | null>(null);

  const sitemapUrl = siteBaseUrl ? `${siteBaseUrl}/sitemap.xml` : "";
  const htmlPublicUrl =
    siteBaseUrl && htmlFileName
      ? `${siteBaseUrl}/${htmlFileName.replace(/^\/+/, "")}`
      : "";

  const domainKind = useMemo(() => {
    const host = (() => {
      try {
        return new URL(
          siteBaseUrl.includes("://") ? siteBaseUrl : `https://${siteBaseUrl}`,
        ).host.toLowerCase();
      } catch {
        return "";
      }
    })();
    if (!host) return "unknown" as const;
    if (
      host.endsWith(".sites.bizuply.com") ||
      host === "sites.bizuply.com" ||
      host.endsWith(".bizuply.com")
    ) {
      return "platform" as const;
    }
    return "custom" as const;
  }, [siteBaseUrl]);

  const statusLabel = useMemo(() => {
    if (!hasAnyVerification) return t("studio.gsc.notSet");
    if (hasMeta) return t("studio.gsc.metaSaved");
    const htmlCheck = checks?.find((item) => item.id === "htmlFile");
    if (hasHtmlPair && htmlCheck?.ok) return t("studio.gsc.fileReady");
    if (hasHtmlPair) return t("studio.gsc.fileSavedChecking");
    return t("studio.gsc.notSet");
  }, [hasAnyVerification, hasMeta, hasHtmlPair, checks, t]);

  const setVerificationCode = (rawValue: string) => {
    setMetaError("");
    const value = extractGoogleSiteVerificationToken(rawValue);
    setSiteSeoDraft((current) => ({
      ...current,
      googleSiteVerification: value,
    }));
  };

  const copyToClipboard = async (value: string, key: string) => {
    setCopyError("");
    if (!value) {
      setCopyError(t("studio.gsc.nothingToCopy"));
      return;
    }
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("clipboard unavailable");
      }
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
      copyTimerRef.current = window.setTimeout(() => setCopiedKey(""), 2000);
    } catch {
      setCopyError(t("studio.gsc.copyFailed"));
      setCopiedKey("");
    }
  };

  const runChecks = async () => {
    if (!siteBaseUrl || publicUrlIsPlaceholder) {
      setChecks(null);
      setChecksError(
        publicUrlIsPlaceholder
          ? t("studio.gsc.notPublished")
          : t("studio.gsc.noUrl"),
      );
      return;
    }
    setChecksLoading(true);
    setChecksError("");
    try {
      const results = await runGscReadinessChecks({
        siteBaseUrl,
        googleSiteVerification: verificationCode,
        googleHtmlVerificationFile: htmlFileName,
      });
      setChecks(results);
      const htmlResult = results.find((item) => item.id === "htmlFile");
      if (hasHtmlPair && htmlResult && !htmlResult.ok && !htmlResult.skipped) {
        setHtmlError(
          t("studio.gsc.fileNotLive"),
        );
      }
    } catch {
      setChecksError(t("studio.gsc.checkFailed"));
    } finally {
      setChecksLoading(false);
    }
  };

  useEffect(() => {
    if (!siteBaseUrl || publicUrlIsPlaceholder) return;
    void runChecks();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refresh when saved verification values change
  }, [
    siteBaseUrl,
    publicUrlIsPlaceholder,
    verificationCode,
    htmlFileName,
    htmlContent,
  ]);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    };
  }, []);

  const handleHtmlFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setHtmlError("");
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const normalized = normalizeGoogleHtmlFileName(file.name);
    if (!normalized) {
      setHtmlError(
        t("studio.gsc.badFileName"),
      );
      return;
    }

    try {
      const text = await file.text();
      const clean = String(text || "").trim();
      if (!clean) {
        setHtmlError(t("studio.gsc.emptyFile"));
        return;
      }
      if (clean.length > 2000) {
        setHtmlError(t("studio.gsc.fileTooLong"));
        return;
      }
      setUploadName(file.name);
      setSiteSeoDraft((current) => ({
        ...current,
        googleHtmlVerificationFile: normalized,
        googleHtmlVerificationContent: clean.slice(0, 2000),
      }));
      setMethod("html");
    } catch {
      setHtmlError(t("studio.gsc.uploadFailed"));
    }
  };

  const validateMetaBeforeHint = () => {
    if (!verificationCode) {
      setMetaError(t("studio.gsc.pasteCodeFirst"));
      return false;
    }
    if (verificationCode.length < 8) {
      setMetaError(t("studio.gsc.codeTooShort"));
      return false;
    }
    setMetaError("");
    return true;
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-black text-slate-800 ring-1 ring-slate-200">
            {statusLabel}
          </span>
          {hasAnyVerification ? (
            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-black text-amber-800 ring-1 ring-amber-200">
              {t("studio.gsc.needVerify")}
            </span>
          ) : null}
        </div>
        <p className="mt-2 text-[11px] font-semibold leading-5 text-slate-500">
          {t("studio.gsc.intro")}
        </p>
      </div>

      {domainKind === "custom" ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-xs font-semibold leading-6 text-emerald-900">
          <p className="font-black">{t("studio.gsc.customDomainActive")}</p>
          <p className="mt-1">
            {t("studio.gsc.useYourDomain")}
            <span className="font-black" dir="ltr">
              {siteBaseUrl}
            </span>
            {t("studio.gsc.notBizuply")}{" "}
            <span className="font-black" dir="ltr">
              *.sites.bizuply.com
            </span>
            .
          </p>
        </div>
      ) : domainKind === "platform" ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-3.5 py-3 text-xs font-semibold leading-6 text-slate-600">
          <p className="font-black text-slate-900">{t("studio.gsc.platformAddress")}</p>
          <p className="mt-1">
            {t("studio.gsc.noCustomDomain")}{" "}
            <span className="font-black" dir="ltr">
              {siteBaseUrl || "*.sites.bizuply.com"}
            </span>
            .
          </p>
        </div>
      ) : null}

      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-xs font-semibold leading-6 text-amber-900">
        <p className="mb-1 flex items-center gap-1.5 text-sm font-black">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
          {t("studio.gsc.chooseUrlPrefix")}
        </p>
        <p>
          {t("studio.gsc.leftChoosePrefix")}{" "}
          <span className="font-black">{t("studio.gsc.urlPrefix")}</span> — {t("studio.gsc.notDomain")}
          {t("studio.gsc.domainHarder")}
        </p>
      </div>

      <ol className="space-y-3">
        <li className="flex gap-3">
          <StepBadge n={1} />
          <div className="min-w-0 flex-1 space-y-2 pt-0.5">
            <p className="text-sm font-black text-slate-900">
              {t("studio.gsc.openGsc")}
            </p>
            <p className="text-xs font-semibold text-slate-500">
              {t("studio.gsc.addPropertyHint")}
            </p>
            <a
              href={GSC_WELCOME_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-3.5 py-2 text-xs font-black text-blue-700 transition hover:bg-blue-50"
            >
              <ExternalLink className="h-4 w-4" />
              {t("studio.gsc.openGsc")}
            </a>
          </div>
        </li>

        <li className="flex gap-3">
          <StepBadge n={2} />
          <div className="min-w-0 flex-1 space-y-2 pt-0.5">
            <p className="text-sm font-black text-slate-900">
              {t("studio.gsc.chooseUrlPrefixTitle")}
            </p>
            <p className="text-xs font-semibold text-slate-500">
              {t("studio.gsc.chooseUrlPrefixText")}
            </p>
          </div>
        </li>

        <li className="flex gap-3">
          <StepBadge n={3} />
          <div className="min-w-0 flex-1 space-y-2 pt-0.5">
            <p className="text-sm font-black text-slate-900">
              {t("studio.gsc.copySiteUrl")}
            </p>
            <p className="text-xs font-semibold text-slate-500">
              {t("studio.gsc.copySiteUrlText")}{" "}
              <span className="font-black" dir="ltr">
                /business/.../dashboard
              </span>
              .
            </p>
            {publicUrlIsPlaceholder ? (
              <p className="flex items-start gap-1.5 rounded-xl bg-amber-50 px-3 py-2 text-[11px] font-bold text-amber-700">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {t("studio.gsc.exampleUrl")}
              </p>
            ) : null}
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5">
              <input
                value={siteBaseUrl}
                readOnly
                dir="ltr"
                className="h-9 min-w-0 flex-1 rounded-lg bg-slate-50 px-3 text-xs font-bold text-slate-700 outline-none"
              />
              <button
                type="button"
                onClick={() => void copyToClipboard(siteBaseUrl, "site")}
                className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 text-xs font-black text-blue-800 transition hover:bg-blue-100"
              >
                {copiedKey === "site" ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" /> {t("studio.gsc.copied")}
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" /> {t("studio.gsc.copyAddress")}
                  </>
                )}
              </button>
            </div>
          </div>
        </li>

        <li className="flex gap-3">
          <StepBadge n={4} />
          <div className="min-w-0 flex-1 space-y-3 pt-0.5">
            <p className="text-sm font-black text-slate-900">
              {t("studio.gsc.chooseMethod")}
            </p>
            <p className="text-xs font-semibold text-slate-500">
              {t("studio.gsc.chooseMethodText")}
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              <MethodCard
                selected={method === "meta"}
                recommended
                title={t("studio.gsc.metaTitle")}
                subtitle={t("studio.gsc.metaSubtitle")}
                onClick={() => setMethod("meta")}
              />
              <MethodCard
                selected={method === "html"}
                title={t("studio.gsc.fileTitle")}
                subtitle={t("studio.gsc.fileSubtitle")}
                onClick={() => setMethod("html")}
              />
            </div>
            <p className="text-[10px] font-semibold text-slate-400">
              {t("studio.gsc.techTerms")}
            </p>
          </div>
        </li>

        <li className="flex gap-3">
          <StepBadge n={5} />
          <div className="min-w-0 flex-1 space-y-3 pt-0.5">
            {method === "meta" ? (
              <>
                <p className="text-sm font-black text-slate-900">
                  {t("studio.gsc.enterMeta")}
                </p>
                <p className="text-xs font-semibold text-slate-500">
                  {t("studio.gsc.enterMetaText")}
                </p>
                <input
                  value={verificationCode}
                  onChange={(event) => setVerificationCode(event.target.value)}
                  onBlur={() => {
                    if (verificationCode) validateMetaBeforeHint();
                  }}
                  className={fieldClass}
                  placeholder={t("studio.gsc.metaPlaceholder")}
                  dir="ltr"
                />
                {metaError ? (
                  <p className="flex items-start gap-1.5 text-xs font-bold text-rose-600">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    {metaError}
                  </p>
                ) : null}
                {hasMeta && !metaError ? (
                  <p className="flex items-center gap-1.5 text-xs font-black text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" />
                    {t("studio.gsc.metaReady")}
                  </p>
                ) : null}
                <p className="text-[11px] font-semibold text-slate-500">
                  {t("studio.gsc.clickSave")}{" "}
                  <span className="font-black text-slate-700">
                    {t("studio.gsc.saveMeta")}
                  </span>
                  .
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-black text-slate-900">
                  {t("studio.gsc.uploadFile")}
                </p>
                <p className="text-xs font-semibold text-slate-500">
                  {t("studio.gsc.uploadFileText")}
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".html,text/html"
                  className="hidden"
                  onChange={(event) => void handleHtmlFileUpload(event)}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-3.5 py-2 text-xs font-black text-blue-700 transition hover:bg-blue-50"
                >
                  <Upload className="h-4 w-4" />
                  {t("studio.gsc.uploadFileBtn")}
                </button>
                {uploadName || htmlFileName ? (
                  <p className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <FileUp className="h-4 w-4 text-slate-500" />
                    {t("studio.gsc.fileName")}{" "}
                    <span className="font-black" dir="ltr">
                      {htmlFileName || uploadName}
                    </span>
                  </p>
                ) : null}
                <input
                  value={htmlFileName}
                  onChange={(event) => {
                    setHtmlError("");
                    let next = event.target.value.trim().replace(/^\/+/, "");
                    if (/^google[a-z0-9]+$/i.test(next)) {
                      next = `${next}.html`;
                    }
                    setSiteSeoDraft((current) => ({
                      ...current,
                      googleHtmlVerificationFile: next,
                    }));
                  }}
                  className={fieldClass}
                  placeholder="googleXXXXXXXX.html"
                  dir="ltr"
                />
                <textarea
                  value={htmlContent}
                  onChange={(event) => {
                    setHtmlError("");
                    setSiteSeoDraft((current) => ({
                      ...current,
                      googleHtmlVerificationContent: event.target.value,
                    }));
                  }}
                  className={textareaClass}
                  placeholder={t("studio.gsc.fileContentPh")}
                  dir="ltr"
                  rows={3}
                />
                {htmlError ? (
                  <p className="flex items-start gap-1.5 text-xs font-bold text-rose-600">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    {htmlError}
                  </p>
                ) : null}
                {hasHtmlPair && !htmlError ? (
                  <p className="flex items-center gap-1.5 text-xs font-black text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" />
                    {t("studio.gsc.fileReadySave")}
                  </p>
                ) : null}
                {htmlPublicUrl ? (
                  <p className="text-[11px] font-semibold text-slate-500">
                    {t("studio.gsc.afterSaveFile")}{" "}
                    <a
                      href={htmlPublicUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-black text-blue-700 underline"
                      dir="ltr"
                    >
                      {htmlPublicUrl}
                    </a>
                  </p>
                ) : null}
              </>
            )}
          </div>
        </li>

        <li className="flex gap-3">
          <StepBadge n={6} />
          <div className="min-w-0 flex-1 space-y-2 pt-0.5">
            <p className="text-sm font-black text-slate-900">{t("studio.gsc.saveInBizuply")}</p>
            <p className="text-xs font-semibold text-slate-500">
              {t("studio.gsc.saveInBizuplyText")}
            </p>
          </div>
        </li>

        <li className="flex gap-3">
          <StepBadge n={7} />
          <div className="min-w-0 flex-1 space-y-2 pt-0.5">
            <p className="text-sm font-black text-slate-900">
              {t("studio.gsc.backToGoogle")}
            </p>
            <p className="text-xs font-semibold text-slate-500">
              {t("studio.gsc.backToGoogleText")}
            </p>
            <a
              href={GSC_HOME_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-600 px-3.5 py-2 text-xs font-black text-white transition hover:bg-blue-700"
            >
              <ExternalLink className="h-4 w-4" />
              {t("studio.gsc.doneBack")}
            </a>
          </div>
        </li>
      </ol>

      <div className="rounded-2xl border border-blue-200 bg-blue-50 px-3.5 py-3 text-xs font-semibold leading-6 text-blue-950">
        <p className="mb-2 flex items-center gap-1.5 text-sm font-black text-blue-900">
          <Search className="h-4 w-4 shrink-0" />
          {t("studio.gsc.submitSitemap")}
        </p>
        <p className="mb-2">
          {t("studio.gsc.submitSitemapText")}
        </p>
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-blue-200 bg-white p-1.5">
          <input
            value={sitemapUrl}
            readOnly
            dir="ltr"
            className="h-9 min-w-0 flex-1 rounded-lg bg-blue-50/80 px-3 text-xs font-bold text-slate-700 outline-none"
          />
          <button
            type="button"
            onClick={() => void copyToClipboard(sitemapUrl, "sitemap")}
            className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-blue-700 px-3 text-xs font-black text-white transition hover:bg-blue-800"
          >
            {copiedKey === "sitemap" ? (
              <>
                <CheckCircle2 className="h-4 w-4" /> {t("studio.gsc.copied")}
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" /> {t("studio.gsc.copySitemap")}
              </>
            )}
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href={GSC_HOME_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-blue-300 bg-white px-3 py-2 text-[11px] font-black text-blue-700 transition hover:bg-blue-50"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Open Search Console
          </a>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white px-3.5 py-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-sm font-black text-slate-900">
            {t("studio.gsc.readinessChecks")}
          </p>
          <button
            type="button"
            onClick={() => void runChecks()}
            disabled={checksLoading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-black text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
          >
            {checksLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" />
            )}
            {t("studio.gsc.recheck")}
          </button>
        </div>
        <p className="mb-3 text-[11px] font-semibold leading-5 text-slate-500">
          {t("studio.gsc.readinessHint")}
        </p>
        {checksError ? (
          <p className="mb-2 flex items-start gap-1.5 text-xs font-bold text-rose-600">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {checksError}
          </p>
        ) : null}
        <ul className="space-y-1.5">
          {(checks || []).map((item) => (
            <li
              key={item.id}
              className="flex items-start gap-2 rounded-xl bg-slate-50 px-2.5 py-2 text-xs font-semibold text-slate-700"
            >
              {item.skipped ? (
                <span className="mt-0.5 text-slate-400">—</span>
              ) : item.ok ? (
                <span className="mt-0.5 text-emerald-600" aria-label={t("studio.gsc.passed")}>
                  ✅
                </span>
              ) : (
                <span className="mt-0.5 text-rose-500" aria-label={t("studio.gsc.failed")}>
                  ❌
                </span>
              )}
              <div className="min-w-0">
                <p className="font-black text-slate-800">{item.label}</p>
                {item.detail ? (
                  <p className="mt-0.5 text-[11px] font-semibold text-slate-500">
                    {item.detail}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
          {!checks && !checksLoading && !checksError ? (
            <li className="text-xs font-semibold text-slate-400">
              {t("studio.gsc.clickRecheck")}
            </li>
          ) : null}
        </ul>
      </div>

      {copyError ? (
        <p className="flex items-start gap-1.5 text-xs font-bold text-rose-600">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {copyError}
        </p>
      ) : null}

      <p className="rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-[11px] font-semibold leading-5 text-slate-500">
        {t("studio.gsc.footer")}
      </p>
    </div>
  );
}
