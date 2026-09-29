import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import {
  Copy,
  Download,
  Eye,
  Heart,
  Languages,
  Search,
  Share2,
  Star,
  Plus,
} from "lucide-react";
import LanguageSwitcher from "../LanguageSwitcher";
import { coerceSupportedLanguage, getTextDirection } from "../../i18n/localeUtils";
import { LANGUAGE_META } from "../../i18n/languages";
import {
  archivePartnerCenterMaterial,
  downloadPartnerCenterOriginal,
  downloadPartnerCenterPdf,
  materialHasOriginalFile,
  fetchPartnerCenterKpis,
  fetchPartnerCenterMaterial,
  fetchPartnerCenterMaterials,
  fetchPartnerOnboarding,
  patchPartnerOnboarding,
  listPartnerCenterShareAudit,
  listPartnerCenterShares,
  reseedPartnerCenter,
  revokePartnerCenterShare,
  savePartnerCenterKpi,
  savePartnerCenterMaterial,
  sharePartnerCenterMaterial,
  togglePartnerCenterFavorite,
  type PartnerMaterial,
  type PartnerOnboardingSnapshot,
} from "../../lib/partnerCenterApi";
import PartnerOnboardingPanel from "./PartnerOnboardingPanel";
import { partnerProductDemoUrl } from "../../lib/partnerOnboardingDemo";

const HUB = [
  { id: "training", key: "hubTraining", categories: ["learn_bizuply"] },
  { id: "sales", key: "hubSales", categories: ["sales_training", "scripts_templates", "demo_presentation"] },
  { id: "marketing", key: "hubMarketing", categories: ["marketing_materials"] },
  { id: "videos", key: "hubVideos", categories: ["videos"] },
  { id: "industry", key: "hubIndustry", categories: ["industry_kits"] },
  { id: "brand", key: "hubBrand", categories: ["brand_assets"] },
] as const;

function splitLines(value?: string) {
  return String(value || "")
    .split("\n")
    .map((row) => row.trim())
    .filter(Boolean);
}

function moduleNumberOf(item: PartnerMaterial) {
  const n = Number(item.extra?.moduleNumber || item.sortOrder / 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function CreativePreview({ item, dir }: { item: PartnerMaterial; dir: string }) {
  const extra = item.extra || {};
  const w = Number(extra.width || 1080);
  const h = Number(extra.height || 1080);
  const ratio = Math.min(1, 420 / w);
  const width = Math.round(w * ratio);
  const height = Math.round(h * ratio);
  const headline = (item.title || "").split(" — ")[0];
  return (
    <svg width={width} height={height} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={item.title} className="max-w-full rounded-2xl border border-slate-200 bg-white">
      <rect width={w} height={h} fill="#F7F8FA" />
      <rect x={w * 0.08} y={h * 0.08} width={w * 0.84} height={h * 0.84} rx={24} fill="#FFFFFF" stroke="#E2E8F0" />
      <rect x={w * 0.08} y={h * 0.08} width={8} height={h * 0.84} fill="#6D28D9" />
      <text x={dir === "rtl" ? w * 0.88 : w * 0.14} y={h * 0.28} textAnchor={dir === "rtl" ? "end" : "start"} fill="#6D28D9" fontSize={Math.max(28, w / 22)} fontWeight={800}>
        Bizuply
      </text>
      <text x={dir === "rtl" ? w * 0.88 : w * 0.14} y={h * 0.42} textAnchor={dir === "rtl" ? "end" : "start"} fill="#0F172A" fontSize={Math.max(36, w / 16)} fontWeight={800}>
        {headline.slice(0, 42)}
      </text>
      <text x={dir === "rtl" ? w * 0.88 : w * 0.14} y={h * 0.54} textAnchor={dir === "rtl" ? "end" : "start"} fill="#64748B" fontSize={Math.max(22, w / 32)} fontWeight={700}>
        {(item.description || "").slice(0, 64)}
      </text>
      <rect x={dir === "rtl" ? w * 0.5 : w * 0.14} y={h * 0.72} width={w * 0.36} height={h * 0.08} rx={16} fill="#6D28D9" />
      <text x={dir === "rtl" ? w * 0.68 : w * 0.32} y={h * 0.775} textAnchor="middle" fill="#FFFFFF" fontSize={Math.max(20, w / 36)} fontWeight={800}>
        {item.extra?.cta || "Bizuply"}
      </text>
    </svg>
  );
}

export default function PartnerCenterHub({
  admin = false,
}: {
  admin?: boolean;
}) {
  const { t, i18n } = useTranslation();
  const locale = coerceSupportedLanguage(i18n.language);
  const dir = getTextDirection(locale);
  const [searchParams, setSearchParams] = useSearchParams();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("learn_bizuply");
  const [doneSlugs, setDoneSlugs] = useState<string[]>([]);
  const [onboarding, setOnboarding] = useState<PartnerOnboardingSnapshot | null>(null);
  const [onboardingBusy, setOnboardingBusy] = useState(false);
  const [guideItems, setGuideItems] = useState<PartnerMaterial[]>([]);
  const [industry, setIndustry] = useState("");
  const [assetType, setAssetType] = useState("");
  const [audience, setAudience] = useState("");
  const [status, setStatus] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [items, setItems] = useState<PartnerMaterial[]>([]);
  const [meta, setMeta] = useState<Record<string, string[]>>({});
  const [counts, setCounts] = useState<{ total: number; byCategory: Record<string, number> }>({
    total: 0,
    byCategory: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<PartnerMaterial | null>(null);
  const [previewTab, setPreviewTab] = useState("video");
  const [shareItem, setShareItem] = useState<PartnerMaterial | null>(null);
  const [shareDays, setShareDays] = useState("30");
  const [shareRows, setShareRows] = useState<any[]>([]);
  const [auditRows, setAuditRows] = useState<any[]>([]);
  const [editor, setEditor] = useState<PartnerMaterial | null>(null);
  const [toast, setToast] = useState("");
  const [downloading, setDownloading] = useState("");
  const [kpis, setKpis] = useState<any[]>([]);
  const [kpiForm, setKpiForm] = useState({
    periodStart: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10),
    periodEnd: new Date().toISOString().slice(0, 10),
    leadsContacted: 0,
    replies: 0,
    qualifiedLeads: 0,
    demosBooked: 0,
    demosCompleted: 0,
    followUps: 0,
    customersClosed: 0,
    activeCustomers: 0,
  });

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await fetchPartnerCenterMaterials(
        {
          locale,
          q: q || undefined,
          category: category || undefined,
          industry: industry || undefined,
          assetType: assetType || undefined,
          audience: audience || undefined,
          status: admin ? status || undefined : undefined,
          favorites: !admin && favoritesOnly ? "1" : undefined,
        },
        admin
      );
      setItems(data.items || []);
      setMeta(data.meta || {});
      setCounts({ total: data.counts?.total || 0, byCategory: data.counts?.byCategory || {} });
      if (!admin) {
        const [kpi, progress, academy, kits, sales, demos, scripts] = await Promise.all([
          fetchPartnerCenterKpis().catch(() => ({ items: [] })),
          fetchPartnerOnboarding().catch(() => null),
          fetchPartnerCenterMaterials({ locale, category: "learn_bizuply" }).catch(() => ({ items: [] })),
          fetchPartnerCenterMaterials({ locale, category: "industry_kits" }).catch(() => ({ items: [] })),
          fetchPartnerCenterMaterials({ locale, category: "sales_training" }).catch(() => ({ items: [] })),
          fetchPartnerCenterMaterials({ locale, category: "demo_presentation" }).catch(() => ({ items: [] })),
          fetchPartnerCenterMaterials({ locale, category: "scripts_templates" }).catch(() => ({ items: [] })),
        ]);
        setKpis(kpi.items || []);
        if (progress) {
          setOnboarding(progress);
          setDoneSlugs(progress.completedModuleSlugs || []);
        }
        setGuideItems([
          ...(academy.items || []),
          ...(kits.items || []),
          ...(sales.items || []),
          ...(demos.items || []),
          ...(scripts.items || []),
        ]);
      } else {
        const audit = await listPartnerCenterShareAudit().catch(() => ({ items: [] }));
        setAuditRows(audit.items || []);
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, category, industry, assetType, audience, status, favoritesOnly]);

  const visibleItems = useMemo(() => {
    const rows = [...items];
    if (category === "learn_bizuply") {
      rows.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    }
    return rows;
  }, [items, category]);

  const trainingSeries = useMemo(
    () =>
      [...(guideItems.length ? guideItems : items)]
        .filter((row) => row.category === "learn_bizuply")
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)),
    [items, guideItems]
  );

  const onboardingMaterials = useMemo(() => {
    const map = new Map<string, PartnerMaterial>();
    for (const row of [...guideItems, ...items]) map.set(row.slug, row);
    return [...map.values()];
  }, [guideItems, items]);

  function openLesson(item: PartnerMaterial) {
    setPreviewTab(item.category === "learn_bizuply" || item.assetType === "video_script" ? "video" : "script");
    setPreview(item);
  }

  async function applyOnboarding(payload: Record<string, unknown>) {
    setOnboardingBusy(true);
    try {
      const next = await patchPartnerOnboarding(payload);
      setOnboarding(next);
      setDoneSlugs(next.completedModuleSlugs || []);
      return next;
    } catch (err: any) {
      notify(err?.response?.data?.error || err?.message || t("partnerCenter.downloadFailed"));
      return onboarding;
    } finally {
      setOnboardingBusy(false);
    }
  }

  async function toggleDone(slug: string) {
    const complete = !doneSlugs.includes(slug);
    await applyOnboarding({ action: complete ? "completeModule" : "uncompleteModule", slug });
  }

  async function openMaterialBySlug(slug: string, tab?: string) {
    let item = onboardingMaterials.find((row) => row.slug === slug) || items.find((row) => row.slug === slug);
    if (!item) {
      try {
        item = await fetchPartnerCenterMaterial(slug, locale, admin);
      } catch {
        item = undefined;
      }
    }
    if (!item) return;
    if (tab) setPreviewTab(tab);
    else openLesson(item);
    if (tab) setPreview(item);
  }

  useEffect(() => {
    if (admin || loading || !onboarding) return;
    const raw = String(searchParams.get("module") || "").trim();
    if (!raw) return;
    const byNumber = onboarding.modules.find((row) => String(row.n) === raw);
    const slug = byNumber?.slug || raw;
    openMaterialBySlug(slug, "video");
    // Open once per module query so refresh still works but loops do not.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admin, loading, Boolean(onboarding), searchParams.get("module")]);

  const hubCounts = useMemo(() => {
    return HUB.map((hub) => ({
      ...hub,
      count: hub.categories.reduce((sum, cat) => sum + (counts.byCategory[cat] || 0), 0),
    }));
  }, [counts]);

  function notify(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(""), 2200);
  }

  async function onCopy(item: PartnerMaterial) {
    const text = item.body || item.script || item.title;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* clipboard may be blocked in automated/insecure contexts */
    }
    notify(t("partnerCenter.copied"));
  }

  async function onDownloadPdf(item: PartnerMaterial, variant?: string) {
    const key = `${item.id}:${variant || "content"}`;
    setDownloading(key);
    try {
      await downloadPartnerCenterPdf(item.id, locale, admin, variant);
    } catch {
      notify(t("partnerCenter.downloadFailed"));
    } finally {
      setDownloading("");
    }
  }

  function downloadButtons(item: PartnerMaterial) {
    const original = materialHasOriginalFile(item);
    const isLesson = item.assetType === "video_script" || item.category === "learn_bizuply";
    const isBrand = item.category === "brand_assets" || item.assetType === "brand_kit";
    const pdfBusy = downloading.startsWith(`${item.id}:`);
    return (
      <>
        {original ? (
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-black"
            onClick={() => downloadPartnerCenterOriginal(item)}
          >
            <Download className="h-3.5 w-3.5" />
            {original === "video" ? t("partnerCenter.downloadVideo") : t("partnerCenter.downloadOriginal")}
          </button>
        ) : null}
        <button
          type="button"
          disabled={pdfBusy}
          className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-black disabled:opacity-50"
          onClick={() => onDownloadPdf(item, isLesson ? "training" : "content")}
        >
          <Download className="h-3.5 w-3.5" />
          {pdfBusy
            ? t("partnerCenter.downloading")
            : isLesson
              ? t("partnerCenter.downloadTrainingPdf")
              : isBrand && original
                ? t("partnerCenter.downloadBrandGuide")
                : t("partnerCenter.download")}
        </button>
      </>
    );
  }

  async function onShare(item: PartnerMaterial) {
    if (item.audience !== "client_facing") {
      notify(t("partnerCenter.shareClientOnly"));
      return;
    }
    const rows = await listPartnerCenterShares(item.id, admin).catch(() => ({ items: [] }));
    setShareRows(rows.items || []);
    setShareItem(item);
  }

  async function createShareLink() {
    if (!shareItem) return;
    const days = shareDays === "never" ? 0 : Number(shareDays);
    const share = await sharePartnerCenterMaterial(shareItem.id, locale, admin, days);
    const url = `${window.location.origin}/partner-materials/${share.token}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* clipboard may be blocked in automated/insecure contexts */
    }
    notify(t("partnerCenter.shareCopied"));
    const rows = await listPartnerCenterShares(shareItem.id, admin);
    setShareRows(rows.items || []);
    if (admin) {
      const audit = await listPartnerCenterShareAudit();
      setAuditRows(audit.items || []);
    }
  }

  async function onFavorite(item: PartnerMaterial) {
    const result = await togglePartnerCenterFavorite(item.id);
    setItems((prev) => prev.map((row) => (row.id === item.id ? { ...row, favorite: result.favorite } : row)));
  }

  return (
    <div dir={dir} className="mx-auto max-w-[1480px]">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#7C3AED]">
            Bizuply Partner
          </p>
          <h1 className="text-2xl font-black text-slate-900 md:text-3xl">{t("partnerCenter.title")}</h1>
          <p className="mt-1 max-w-2xl text-sm font-bold text-slate-500">{t("partnerCenter.subtitle")}</p>
          {admin ? <p className="mt-1 text-xs font-bold text-violet-700">{t("partnerCenter.adminHint")}</p> : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <LanguageSwitcher />
          {admin ? (
            <>
              <button
                type="button"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-black"
                onClick={() => reseedPartnerCenter(false).then(load)}
              >
                {t("partnerCenter.reseed")}
              </button>
              <button
                type="button"
                className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-black text-amber-900"
                onClick={() => reseedPartnerCenter(true).then(load)}
              >
                {t("partnerCenter.forceReseed")}
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#6D28D9] px-4 py-2 text-sm font-black text-white"
                onClick={() =>
                  setEditor({
                    id: "",
                    slug: "",
                    category: "scripts_templates",
                    assetType: "document",
                    audience: "internal_partner_training",
                    industry: "all",
                    status: "draft",
                    visibility: "partners",
                    featured: false,
                    version: 1,
                    sortOrder: 100,
                    locale,
                    title: "",
                    description: "",
                    body: "",
                    locales: Object.fromEntries(
                      LANGUAGE_META.map((l) => [
                        l.code,
                        { title: l.nativeLabel, description: "", body: "", script: "" },
                      ])
                    ),
                  } as PartnerMaterial)
                }
              >
                <Plus className="h-4 w-4" />
                {t("partnerCenter.create")}
              </button>
            </>
          ) : null}
        </div>
      </div>

      {!admin && onboarding ? (
        <PartnerOnboardingPanel
          snapshot={onboarding}
          materials={onboardingMaterials}
          busy={onboardingBusy}
          onStart={() =>
            applyOnboarding({ action: "start" }).then((next) => {
              if (next?.modules?.[0]) {
                setSearchParams({ module: "1" });
                openMaterialBySlug(next.modules[0].slug, "video");
              }
            })
          }
          onOpenMaterial={(slug) => openMaterialBySlug(slug)}
          onWatch={(slug) => openMaterialBySlug(slug, "video")}
          onDownload={async (slug) => {
            const item = onboardingMaterials.find((row) => row.slug === slug) || (await fetchPartnerCenterMaterial(slug, locale, admin).catch(() => null));
            if (item) onDownloadPdf(item, "training");
          }}
          onToggleModule={(slug, complete) => applyOnboarding({ action: complete ? "completeModule" : "uncompleteModule", slug })}
          onToggleCheckpoint={(id, complete) => applyOnboarding({ action: complete ? "completeCheckpoint" : "uncompleteCheckpoint", id })}
          onToggleChecklist={(key, done) => applyOnboarding({ action: "setChecklist", key, done })}
          onSelectKit={(slug) => applyOnboarding({ action: "selectIndustryKit", slug })}
          onHub={(cat) => setCategory(cat)}
        />
      ) : null}

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {hubCounts.map((hub) => (
          <button
            key={hub.id}
            type="button"
            onClick={() => setCategory(hub.categories[0])}
            className={`rounded-[16px] border p-4 text-start shadow-[0_4px_20px_rgba(15,23,42,0.05)] ${
              hub.categories.includes(category) ? "border-violet-300 bg-violet-50" : "border-slate-100 bg-white"
            }`}
          >
            <p className="text-xs font-black uppercase tracking-wide text-[#7C3AED]">{t(`partnerCenter.${hub.key}`)}</p>
            <p className="mt-2 text-2xl font-black text-slate-900">{hub.count}</p>
          </button>
        ))}
      </div>

      <div className="mb-5 flex flex-col gap-3 rounded-[16px] border border-slate-100 bg-white p-4">
        <label className="relative block">
          <Search className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 inset-inline-start-3" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") load();
            }}
            placeholder={t("partnerCenter.search")}
            className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pe-3 ps-10 text-sm font-bold"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            ["category", category, setCategory, meta.CATEGORIES],
            ["industry", industry, setIndustry, meta.INDUSTRIES],
            ["assetType", assetType, setAssetType, meta.ASSET_TYPES],
            ["audience", audience, setAudience, meta.AUDIENCES],
            ...(admin ? [["status", status, setStatus, meta.STATUSES] as const] : []),
          ].map(([key, value, setter, options]) => (
            <select
              key={String(key)}
              value={String(value || "")}
              onChange={(e) => (setter as (v: string) => void)(e.target.value)}
              className="h-10 min-w-[140px] rounded-2xl border border-slate-200 bg-white px-3 text-xs font-black"
              aria-label={t(`partnerCenter.${key}`)}
            >
              <option value="">{t(`partnerCenter.${key}`)} — {t("partnerCenter.all")}</option>
              {(options || []).map((opt) => (
                <option key={opt} value={opt}>
                  {t(`partnerCenter.meta.${opt}`, { defaultValue: opt })}
                </option>
              ))}
            </select>
          ))}
          {!admin ? (
            <button
              type="button"
              onClick={() => setFavoritesOnly((v) => !v)}
              className={`h-10 rounded-2xl px-3 text-xs font-black ${favoritesOnly ? "bg-violet-100 text-violet-800" : "border border-slate-200"}`}
            >
              {t("partnerCenter.favorites")}
            </button>
          ) : null}
          <button type="button" onClick={load} className="h-10 rounded-2xl bg-slate-900 px-4 text-xs font-black text-white">
            {t("partnerCenter.search")}
          </button>
        </div>
      </div>

      {error ? <p className="mb-4 text-sm font-bold text-rose-600">{error}</p> : null}
      {loading ? <p className="text-sm font-bold text-slate-500">…</p> : null}
      {!loading && items.length === 0 ? <p className="text-sm font-bold text-slate-500">{t("partnerCenter.empty")}</p> : null}

      {category === "learn_bizuply" ? (
        <div className="mb-5 rounded-[16px] border border-violet-100 bg-violet-50/70 p-4">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#7C3AED]">{t("partnerCenter.academyKicker")}</p>
          <h2 className="mt-1 text-xl font-black text-slate-900">{t("partnerCenter.academyTitle")}</h2>
          <p className="mt-1 text-sm font-bold text-slate-600">{t("partnerCenter.academyHint")}</p>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleItems.map((item) => {
          const moduleN = moduleNumberOf(item);
          const isTraining = item.category === "learn_bizuply";
          const completed = doneSlugs.includes(item.slug);
          return (
          <article key={item.id} className="flex flex-col rounded-[16px] border border-slate-100 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
            <div className="mb-3 flex flex-wrap gap-2">
              {isTraining && moduleN ? (
                <span className="rounded-full bg-[#6D28D9] px-2.5 py-1 text-[11px] font-black text-white">
                  {t("partnerCenter.moduleN", { n: moduleN })}
                </span>
              ) : null}
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-black ${item.audience === "client_facing" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"}`}>
                {item.audience === "client_facing" ? t("partnerCenter.clientFacing") : t("partnerCenter.internal")}
              </span>
              {item.featured ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2.5 py-1 text-[11px] font-black text-violet-800">
                  <Star className="h-3 w-3" /> {t("partnerCenter.featured")}
                </span>
              ) : null}
              {isTraining ? (
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-black ${item.videoReady ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>
                  {item.videoReady ? t("partnerCenter.videoReady") : t("partnerCenter.videoPending")}
                </span>
              ) : (
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-black text-slate-600">{t(`partnerCenter.meta.${item.category}`, { defaultValue: item.category })}</span>
              )}
              {completed ? (
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-black text-emerald-800">{t("partnerCenter.completed")}</span>
              ) : isTraining ? (
                <span className="rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-black text-slate-500">{t("partnerCenter.notCompleted")}</span>
              ) : null}
            </div>
            <h2 className="text-lg font-black text-slate-900">{item.title}</h2>
            <p className="mt-1 line-clamp-3 text-sm font-bold text-slate-500">{item.description}</p>
            <p className="mt-3 text-[11px] font-bold text-slate-400">
              {item.estimatedDurationMinutes ? `${t("partnerCenter.duration", { n: item.estimatedDurationMinutes })} · ` : ""}
              {t("partnerCenter.lastUpdated")}: {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString(locale) : "—"}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-black" onClick={() => openLesson(item)}>
                <Eye className="h-3.5 w-3.5" /> {isTraining ? t("partnerCenter.tabVideo") : t("partnerCenter.preview")}
              </button>
              {isTraining ? (
                <a
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-black"
                  href={partnerProductDemoUrl(onboarding?.modules.find((row) => row.slug === item.slug)?.demoKey || "dashboard")}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open Demo
                </a>
              ) : null}
              <button type="button" className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-black" onClick={() => onCopy(item)}>
                <Copy className="h-3.5 w-3.5" /> {t("partnerCenter.copy")}
              </button>
              {downloadButtons(item)}
              <button type="button" className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-black" onClick={() => onShare(item)}>
                <Share2 className="h-3.5 w-3.5" /> {t("partnerCenter.share")}
              </button>
              {admin ? (
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-black"
                  onClick={async () => {
                    await savePartnerCenterMaterial({ featured: !item.featured }, item.id);
                    load();
                  }}
                >
                  <Star className={`h-3.5 w-3.5 ${item.featured ? "fill-violet-600 text-violet-600" : ""}`} />
                  {t("partnerCenter.featured")}
                </button>
              ) : null}
              {!admin ? (
                <button type="button" className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-black" onClick={() => onFavorite(item)}>
                  <Heart className={`h-3.5 w-3.5 ${item.favorite ? "fill-rose-500 text-rose-500" : ""}`} />
                </button>
              ) : (
                <>
                  <button type="button" className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black" onClick={async () => setEditor(await fetchPartnerCenterMaterial(item.id, locale, true))}>
                    {t("partnerCenter.edit")}
                  </button>
                  <button type="button" className="rounded-xl border border-rose-200 px-3 py-2 text-xs font-black text-rose-700" onClick={() => archivePartnerCenterMaterial(item.id).then(load)}>
                    {t("partnerCenter.archive")}
                  </button>
                </>
              )}
            </div>
          </article>
          );
        })}
      </div>

      {!admin ? (
        <section className="mt-10 rounded-[16px] border border-slate-100 bg-white p-5">
          <h2 className="text-xl font-black">{t("partnerCenter.kpiTitle")}</h2>
          <p className="mb-4 text-sm font-bold text-slate-500">{t("partnerCenter.kpiHint")}</p>
          <form
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
            onSubmit={async (e) => {
              e.preventDefault();
              await savePartnerCenterKpi(kpiForm);
              const data = await fetchPartnerCenterKpis();
              setKpis(data.items || []);
            }}
          >
            {Object.entries(kpiForm).map(([key, value]) => (
              <label key={key} className="text-xs font-black text-slate-500">
                {t(`partnerCenter.kpiFields.${key}`, { defaultValue: key })}
                <input
                  className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm font-bold text-slate-900"
                  type={key.startsWith("period") ? "date" : "number"}
                  value={value as any}
                  onChange={(e) => setKpiForm((prev) => ({ ...prev, [key]: key.startsWith("period") ? e.target.value : Number(e.target.value) }))}
                />
              </label>
            ))}
            <button type="submit" className="h-10 self-end rounded-2xl bg-[#6D28D9] px-4 text-sm font-black text-white">
              {t("partnerCenter.save")}
            </button>
          </form>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-start text-sm">
              <thead>
                <tr className="text-xs font-black text-slate-500">
                  <th className="p-2">{t("partnerCenter.kpiFields.period")}</th>
                  <th className="p-2">{t("partnerCenter.kpiFields.replyRate")}</th>
                  <th className="p-2">{t("partnerCenter.kpiFields.qualifyRate")}</th>
                  <th className="p-2">{t("partnerCenter.kpiFields.showRate")}</th>
                  <th className="p-2">{t("partnerCenter.kpiFields.closeRate")}</th>
                </tr>
              </thead>
              <tbody>
                {kpis.map((row) => (
                  <tr key={row.id} className="border-t border-slate-100 font-bold">
                    <td className="p-2">{String(row.periodStart).slice(0, 10)}</td>
                    <td className="p-2">{row.rates?.replyRate ?? "—"}</td>
                    <td className="p-2">{row.rates?.qualifyRate ?? "—"}</td>
                    <td className="p-2">{row.rates?.demoShowRate ?? "—"}</td>
                    <td className="p-2">{row.rates?.closeRate ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {admin && auditRows.length ? (
        <section className="mt-10 rounded-[16px] border border-slate-100 bg-white p-5">
          <h2 className="text-xl font-black">{t("partnerCenter.shareAudit")}</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-start text-sm">
              <thead>
                <tr className="text-xs font-black text-slate-500">
                  <th className="p-2">{t("partnerCenter.materialSlug")}</th>
                  <th className="p-2">{t("partnerCenter.shareCreated")}</th>
                  <th className="p-2">{t("partnerCenter.shareExpires")}</th>
                  <th className="p-2">{t("partnerCenter.shareUser")}</th>
                  <th className="p-2" />
                </tr>
              </thead>
              <tbody>
                {auditRows.map((row) => (
                  <tr key={row.id || row.token} className="border-t border-slate-100 font-bold">
                    <td className="p-2">{row.materialSlug}</td>
                    <td className="p-2">{row.createdAt ? new Date(row.createdAt).toLocaleString(locale) : "—"}</td>
                    <td className="p-2">
                      {row.revokedAt ? t("partnerCenter.revoked") : row.expiresAt ? new Date(row.expiresAt).toLocaleDateString(locale) : t("partnerCenter.shareNever")}
                    </td>
                    <td className="p-2">{row.createdByEmail || row.createdByName || "—"}</td>
                    <td className="p-2">
                      {row.active ? (
                        <button
                          type="button"
                          className="text-rose-700"
                          onClick={async () => {
                            await revokePartnerCenterShare(row.token, true);
                            load();
                          }}
                        >
                          {t("partnerCenter.shareRevoke")}
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {preview ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 sm:items-center sm:p-6" onClick={() => setPreview(null)}>
          <div
            dir={dir}
            className="max-h-[92dvh] w-full max-w-3xl overflow-y-auto rounded-t-[28px] bg-white p-6 sm:rounded-[28px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black text-[#7C3AED]">
                  {preview.category === "learn_bizuply" && moduleNumberOf(preview)
                    ? t("partnerCenter.moduleN", { n: moduleNumberOf(preview) })
                    : preview.audience === "client_facing"
                      ? t("partnerCenter.clientFacing")
                      : t("partnerCenter.internal")}
                </p>
                <h3 className="text-2xl font-black">{preview.title}</h3>
                <p className="mt-1 text-sm font-bold text-slate-500">{preview.description}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {preview.estimatedDurationMinutes ? (
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-black text-slate-600">
                      {t("partnerCenter.duration", { n: preview.estimatedDurationMinutes })}
                    </span>
                  ) : null}
                  {preview.category === "learn_bizuply" ? (
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-black ${preview.videoReady ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"}`}>
                      {preview.videoReady ? t("partnerCenter.videoReady") : t("partnerCenter.videoPending")}
                    </span>
                  ) : null}
                </div>
              </div>
              <button type="button" className="rounded-xl px-3 py-2 text-sm font-black" onClick={() => setPreview(null)}>
                {t("partnerCenter.cancel")}
              </button>
            </div>
            {["banner", "social_post", "paid_ad", "short_video"].includes(preview.assetType) ? (
              <div className="mb-4">
                <p className="mb-2 text-xs font-black uppercase text-slate-400">{t("partnerCenter.bannerPreview")}</p>
                <CreativePreview item={preview} dir={dir} />
              </div>
            ) : null}
            <div className="mb-4 flex flex-wrap gap-2">
              {[
                ["video", t("partnerCenter.tabVideo")],
                ["learn", t("partnerCenter.tabLesson")],
                ["script", t("partnerCenter.writtenSummary")],
                ["voice", t("partnerCenter.tabVoiceOver")],
                ["captions", t("partnerCenter.tabCaptions")],
                ["shots", t("partnerCenter.tabShotList")],
                ["onscreen", t("partnerCenter.tabOnScreen")],
              ].map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  className={`rounded-full px-3 py-1 text-xs font-black ${previewTab === id ? "bg-[#6D28D9] text-white" : "bg-slate-100"}`}
                  onClick={() => setPreviewTab(id)}
                >
                  {label}
                </button>
              ))}
            </div>
            {previewTab === "video" ? (
              preview.videoReady && preview.localeVideoUrl ? (
                <video className="w-full rounded-2xl" controls src={preview.localeVideoUrl} poster={preview.thumbnailUrl || undefined} />
              ) : (
                <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-black text-amber-900">
                  {t("partnerCenter.videoPending")}
                </p>
              )
            ) : previewTab === "learn" ? (
              <div className="space-y-5 text-sm font-bold leading-relaxed text-slate-700">
                {splitLines(preview.extra?.youWillLearn).length ? (
                  <section>
                    <h4 className="mb-2 text-xs font-black uppercase tracking-wide text-[#7C3AED]">{t("partnerCenter.youWillLearn")}</h4>
                    <ul className="list-disc space-y-1 ps-5">
                      {splitLines(preview.extra?.youWillLearn).map((row) => (
                        <li key={row}>{row}</li>
                      ))}
                    </ul>
                  </section>
                ) : null}
                {splitLines(preview.extra?.takeaways).length ? (
                  <section>
                    <h4 className="mb-2 text-xs font-black uppercase tracking-wide text-[#7C3AED]">{t("partnerCenter.takeaways")}</h4>
                    <ul className="list-disc space-y-1 ps-5">
                      {splitLines(preview.extra?.takeaways).map((row) => (
                        <li key={row}>{row}</li>
                      ))}
                    </ul>
                  </section>
                ) : null}
                {preview.extra?.explainToCustomer ? (
                  <section>
                    <h4 className="mb-2 text-xs font-black uppercase tracking-wide text-[#7C3AED]">{t("partnerCenter.explainToCustomer")}</h4>
                    <p>{preview.extra.explainToCustomer}</p>
                  </section>
                ) : null}
                {Array.isArray(preview.extra?.relatedSlugs) && preview.extra.relatedSlugs.length ? (
                  <section>
                    <h4 className="mb-2 text-xs font-black uppercase tracking-wide text-[#7C3AED]">{t("partnerCenter.relatedModules")}</h4>
                    <div className="flex flex-wrap gap-2">
                      {preview.extra.relatedSlugs.map((slug: string) => {
                        const related = trainingSeries.find((row) => row.slug === slug) || items.find((row) => row.slug === slug);
                        if (!related) return null;
                        return (
                          <button
                            key={slug}
                            type="button"
                            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-black"
                            onClick={() => openLesson(related)}
                          >
                            {moduleNumberOf(related) ? `${moduleNumberOf(related)}. ` : ""}
                            {related.title}
                          </button>
                        );
                      })}
                    </div>
                  </section>
                ) : null}
              </div>
            ) : (
              <pre className="whitespace-pre-wrap text-sm font-bold leading-relaxed text-slate-700">
                {previewTab === "voice"
                  ? preview.voiceOver || preview.script
                  : previewTab === "captions"
                    ? preview.captions
                    : previewTab === "shots"
                      ? preview.shotList
                      : previewTab === "onscreen"
                        ? preview.onScreenText
                        : preview.body || preview.script}
              </pre>
            )}
            <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
              {preview.category === "learn_bizuply" ? (
                <a
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black"
                  href={partnerProductDemoUrl(onboarding?.modules.find((row) => row.slug === preview.slug)?.demoKey || "dashboard")}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open Demo
                </a>
              ) : null}
              {downloadButtons(preview)}
            </div>
            {preview.category === "learn_bizuply" ? (
              <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4">
                {!admin ? (
                <button
                  type="button"
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black"
                  onClick={() => toggleDone(preview.slug)}
                >
                  {doneSlugs.includes(preview.slug) ? t("partnerCenter.completed") : t("partnerCenter.markComplete")}
                </button>
                ) : <span />}
                <div className="flex flex-wrap gap-2">
                  {(() => {
                    const idx = trainingSeries.findIndex((row) => row.slug === preview.slug);
                    const prev = idx > 0 ? trainingSeries[idx - 1] : null;
                    const next = idx >= 0 && idx < trainingSeries.length - 1 ? trainingSeries[idx + 1] : null;
                    return (
                      <>
                        <button
                          type="button"
                          disabled={!prev}
                          className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black disabled:opacity-40"
                          onClick={() => prev && openLesson(prev)}
                        >
                          {t("partnerCenter.prevModule")}
                        </button>
                        <button
                          type="button"
                          disabled={!next}
                          className="rounded-xl bg-[#6D28D9] px-3 py-2 text-xs font-black text-white disabled:opacity-40"
                          onClick={() => next && openLesson(next)}
                        >
                          {t("partnerCenter.nextModule")}
                        </button>
                      </>
                    );
                  })()}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {shareItem ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 sm:items-center sm:p-6" onClick={() => setShareItem(null)}>
          <div className="w-full max-w-lg rounded-t-[28px] bg-white p-6 sm:rounded-[28px]" onClick={(e) => e.stopPropagation()} dir={dir}>
            <h3 className="mb-3 text-xl font-black">{t("partnerCenter.share")}</h3>
            <label className="mb-3 block text-xs font-black text-slate-500">
              {t("partnerCenter.shareExpires")}
              <select className="mt-1 h-11 w-full rounded-xl border px-3 text-sm font-bold" value={shareDays} onChange={(e) => setShareDays(e.target.value)}>
                <option value="7">{t("partnerCenter.days7")}</option>
                <option value="30">{t("partnerCenter.days30")}</option>
                <option value="90">{t("partnerCenter.days90")}</option>
                <option value="never">{t("partnerCenter.shareNever")}</option>
              </select>
            </label>
            <button type="button" className="mb-4 rounded-2xl bg-[#6D28D9] px-4 py-2 text-sm font-black text-white" onClick={createShareLink}>
              {t("partnerCenter.share")}
            </button>
            <div className="space-y-2">
              {shareRows.map((row) => (
                <div key={row.token} className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 p-3 text-xs font-bold">
                  <span className="truncate">{row.token.slice(0, 10)}… · {row.revokedAt ? t("partnerCenter.revoked") : row.active ? (row.expiresAt || t("partnerCenter.shareNever")) : t("partnerCenter.expired")}</span>
                  {row.active ? (
                    <button
                      type="button"
                      className="text-rose-700"
                      onClick={async () => {
                        await revokePartnerCenterShare(row.token, admin);
                        const rows = await listPartnerCenterShares(shareItem.id, admin);
                        setShareRows(rows.items || []);
                      }}
                    >
                      {t("partnerCenter.shareRevoke")}
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {editor && admin ? (
        <MaterialEditor
          item={editor}
          onClose={() => setEditor(null)}
          onSaved={() => {
            setEditor(null);
            load();
          }}
        />
      ) : null}

      {toast ? (
        <div className="fixed bottom-4 inset-inline-end-4 z-50 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-black text-white shadow-xl">
          {toast}
        </div>
      ) : null}
    </div>
  );
}

function MaterialEditor({
  item,
  onClose,
  onSaved,
}: {
  item: PartnerMaterial;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { t } = useTranslation();
  const [tab, setTab] = useState(item.locale || "en");
  const [form, setForm] = useState<PartnerMaterial>(item);
  const [busy, setBusy] = useState(false);

  function patchLocale(lng: string, patch: Record<string, string>) {
    setForm((prev) => ({
      ...prev,
      locales: {
        ...(prev.locales || {}),
        [lng]: { ...(prev.locales?.[lng] || {}), ...patch },
      },
    }));
  }

  async function save() {
    setBusy(true);
    try {
      await savePartnerCenterMaterial(
        {
          slug: form.slug,
          category: form.category,
          assetType: form.assetType,
          audience: form.audience,
          industry: form.industry,
          status: form.status,
          visibility: form.visibility,
          featured: form.featured,
          fileUrl: form.fileUrl,
          videoUrl: form.videoUrl,
          locales: form.locales,
          localeVideos: form.localeVideos,
        },
        form.id || undefined
      );
      onSaved();
    } finally {
      setBusy(false);
    }
  }

  const current = form.locales?.[tab] || {};

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 sm:items-center sm:p-6">
      <div className="max-h-[94dvh] w-full max-w-4xl overflow-y-auto rounded-t-[28px] bg-white p-6 sm:rounded-[28px]">
        <h3 className="mb-4 text-xl font-black">{form.id ? t("partnerCenter.edit") : t("partnerCenter.create")}</h3>
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          <input className="h-11 rounded-xl border px-3 text-sm font-bold" placeholder="slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <select className="h-11 rounded-xl border px-3 text-sm font-bold" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} aria-label={t("partnerCenter.category")}>
            {["learn_bizuply", "sales_training", "marketing_materials", "demo_presentation", "industry_kits", "customer_onboarding", "scripts_templates", "videos", "brand_assets"].map((opt) => (
              <option key={opt} value={opt}>{t(`partnerCenter.meta.${opt}`, { defaultValue: opt })}</option>
            ))}
          </select>
          <select className="h-11 rounded-xl border px-3 text-sm font-bold" value={form.assetType} onChange={(e) => setForm({ ...form, assetType: e.target.value })} aria-label={t("partnerCenter.assetType")}>
            {["video_script", "playbook", "document", "whatsapp_template", "email_template", "social_post", "paid_ad", "short_video", "banner", "presentation", "demo_script", "industry_kit", "faq", "brand_kit", "kpi_tracker", "checklist"].map((opt) => (
              <option key={opt} value={opt}>{t(`partnerCenter.meta.${opt}`, { defaultValue: opt })}</option>
            ))}
          </select>
          <select className="h-11 rounded-xl border px-3 text-sm font-bold" value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value as any })} aria-label={t("partnerCenter.audience")}>
            <option value="internal_partner_training">{t("partnerCenter.internal")}</option>
            <option value="client_facing">{t("partnerCenter.clientFacing")}</option>
          </select>
          <select className="h-11 rounded-xl border px-3 text-sm font-bold" value={form.visibility || "partners"} onChange={(e) => setForm({ ...form, visibility: e.target.value })} aria-label={t("partnerCenter.visibility")}>
            <option value="partners">{t("partnerCenter.visibilityPartners")}</option>
            <option value="hidden">{t("partnerCenter.visibilityHidden")}</option>
            <option value="admin_only">{t("partnerCenter.visibilityAdmin")}</option>
          </select>
          <select className="h-11 rounded-xl border px-3 text-sm font-bold" value={form.status || "draft"} onChange={(e) => setForm({ ...form, status: e.target.value })} aria-label={t("partnerCenter.status")}>
            <option value="draft">{t("partnerCenter.meta.draft")}</option>
            <option value="published">{t("partnerCenter.meta.published")}</option>
            <option value="archived">{t("partnerCenter.meta.archived")}</option>
          </select>
          <input className="h-11 rounded-xl border px-3 text-sm font-bold" placeholder="file URL" value={form.fileUrl || ""} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })} />
          <input
            className="h-11 rounded-xl border px-3 text-sm font-bold"
            placeholder={t("partnerCenter.videoUrlLocale")}
            value={form.localeVideos?.[tab]?.videoUrl || ""}
            onChange={(e) =>
              setForm({
                ...form,
                localeVideos: {
                  ...(form.localeVideos || {}),
                  [tab]: { ...(form.localeVideos?.[tab] || {}), videoUrl: e.target.value },
                },
              })
            }
          />
        </div>
        <div className="mb-3 flex flex-wrap gap-2">
          {LANGUAGE_META.map((lng) => (
            <button
              key={lng.code}
              type="button"
              onClick={() => setTab(lng.code)}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black ${tab === lng.code ? "bg-[#6D28D9] text-white" : "bg-slate-100"}`}
            >
              <Languages className="h-3 w-3" /> {lng.nativeLabel}
            </button>
          ))}
        </div>
        <input
          dir={getTextDirection(tab)}
          className="mb-2 h-11 w-full rounded-xl border px-3 text-sm font-black"
          placeholder="title"
          value={current.title || ""}
          onChange={(e) => patchLocale(tab, { title: e.target.value })}
        />
        <textarea
          dir={getTextDirection(tab)}
          className="mb-4 min-h-[220px] w-full rounded-xl border p-3 text-sm font-bold"
          placeholder="body"
          value={current.body || current.script || ""}
          onChange={(e) => patchLocale(tab, { body: e.target.value, script: e.target.value })}
        />
        <div className="flex gap-2">
          <button type="button" disabled={busy} className="rounded-2xl bg-[#6D28D9] px-4 py-2 text-sm font-black text-white" onClick={save}>
            {t("partnerCenter.save")}
          </button>
          <button type="button" className="rounded-2xl border px-4 py-2 text-sm font-black" onClick={onClose}>
            {t("partnerCenter.cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}
