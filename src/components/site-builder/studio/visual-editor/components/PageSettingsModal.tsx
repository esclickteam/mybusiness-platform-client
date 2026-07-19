import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  AlertTriangle,
  Braces,
  Bot,
  CheckCircle2,
  ChevronDown,
  Copy,
  ExternalLink,
  Globe,
  Languages,
  Lightbulb,
  Plus,
  Search,
  Settings2,
  Share2,
  Sparkles,
  Tags,
  Trash2,
  Wand2,
  X,
} from "lucide-react";

import type {
  SeoCustomMetaTag,
  SeoHreflangEntry,
  SeoMaxImagePreview,
  SeoRobotsDirective,
  SeoStructuredDataEntry,
  SitePageSeoSettings,
  SiteSeoSettings,
  StudioSitePage,
} from "../../types";
import {
  STRUCTURED_DATA_PRESETS,
  buildPagePath,
  buildPublicSiteUrl,
  buildRobotsContent,
  buildSmartPageSeo,
  createSeoId,
  deriveMetaDescription,
  extractPlainTextFromHtml,
  getSeoFieldLengthStatus,
  normalizePageSeo,
  normalizeSiteSeoSettings,
  resolvePageSeoMeta,
  truncateForPreview,
  validateJsonLd,
} from "../../utils/pageSeoUtils";

const ROBOTS_DIRECTIVE_OPTIONS: Array<{
  value: SeoRobotsDirective;
  label: string;
  hint: string;
}> = [
  { value: "nofollow", label: "nofollow", hint: "לא לעקוב אחרי הקישורים בעמוד" },
  { value: "noarchive", label: "noarchive", hint: "לא לשמור עותק שמור (cache)" },
  { value: "nosnippet", label: "nosnippet", hint: "לא להציג תקציר טקסט בתוצאות" },
  { value: "noimageindex", label: "noimageindex", hint: "לא לאנדקס תמונות מהעמוד" },
  { value: "notranslate", label: "notranslate", hint: "לא להציע תרגום בתוצאות" },
];

export type PageSettingsModalTab =
  | "settings"
  | "seo"
  | "advanced"
  | "social";

type PageSettingsModalProps = {
  open: boolean;
  tab: PageSettingsModalTab;
  page: StudioSitePage | null;
  pages: StudioSitePage[];
  siteName: string;
  siteSlug: string;
  publicUrl?: string;
  seoSettings?: SiteSeoSettings | null;
  pageHtml?: string;
  onClose: () => void;
  onSave: (payload: {
    title: string;
    slug: string;
    seo: SitePageSeoSettings;
  }) => void;
};

const TABS: Array<{
  id: PageSettingsModalTab;
  label: string;
  icon: React.ReactNode;
}> = [
  { id: "settings", label: "הגדרות", icon: <Settings2 className="h-4 w-4" /> },
  { id: "seo", label: "יסודות SEO", icon: <Search className="h-4 w-4" /> },
  { id: "advanced", label: "SEO מתקדם", icon: <Sparkles className="h-4 w-4" /> },
  { id: "social", label: "שיתוף ברשתות", icon: <Share2 className="h-4 w-4" /> },
];

const fieldClassName =
  "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-100";

const textareaClassName =
  "min-h-[104px] w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-100";

function LengthHint({
  value,
  idealMax,
  hardMax,
}: {
  value: string;
  idealMax: number;
  hardMax: number;
}) {
  const status = getSeoFieldLengthStatus(value, idealMax, hardMax);
  const length = String(value || "").length;

  const color =
    status === "good"
      ? "text-emerald-600"
      : status === "warn"
        ? "text-amber-600"
        : status === "bad"
          ? "text-rose-600"
          : "text-slate-400";

  return (
    <p className={`text-xs font-bold ${color}`}>
      {length}/{idealMax} תווים מומלצים
    </p>
  );
}

function AdvancedSection({
  icon,
  title,
  description,
  badge,
  defaultOpen = false,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: { label: string; tone: "recommended" | "optional" };
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details
      open={defaultOpen}
      className="group overflow-hidden rounded-3xl border border-slate-200 bg-white [&_summary::-webkit-details-marker]:hidden"
    >
      <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-4 transition hover:bg-slate-50/70">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          {icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="text-sm font-black text-slate-900">{title}</span>
            {badge ? (
              <span
                className={[
                  "rounded-full px-2 py-0.5 text-[10px] font-black",
                  badge.tone === "recommended"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-100 text-slate-500",
                ].join(" ")}
              >
                {badge.label}
              </span>
            ) : null}
          </span>
          <span className="mt-0.5 block text-xs font-semibold leading-5 text-slate-500">
            {description}
          </span>
        </span>
        <ChevronDown className="h-5 w-5 shrink-0 text-slate-400 transition group-open:rotate-180" />
      </summary>
      <div className="space-y-4 border-t border-slate-100 bg-slate-50/40 px-4 py-4">
        {children}
      </div>
    </details>
  );
}

function HelpNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-start gap-2 rounded-2xl bg-blue-50/80 px-3.5 py-2.5 text-xs font-semibold leading-5 text-blue-800">
      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
      <span>{children}</span>
    </p>
  );
}

export default function PageSettingsModal({
  open,
  tab: initialTab,
  page,
  pages,
  siteName,
  siteSlug,
  publicUrl,
  seoSettings,
  pageHtml,
  onClose,
  onSave,
}: PageSettingsModalProps) {
  const [tab, setTab] = useState<PageSettingsModalTab>(initialTab);
  const [smartHint, setSmartHint] = useState("");
  const [copiedHint, setCopiedHint] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [seoDraft, setSeoDraft] = useState<SitePageSeoSettings>({});

  useEffect(() => {
    if (!open || !page) return;

    setTab(initialTab);
    setTitle(String(page.title || ""));
    setSlug(String(page.slug || ""));
    setSmartHint("");

    const normalized = normalizePageSeo(page.seo);

    /*
      Basic auto-fill: if a page has no title/description yet, pre-populate the
      fields with sensible values derived from the page + site so the owner sees
      editable content instead of empty boxes. They can freely change it.
    */
    const meta = resolvePageSeoMeta({
      page,
      siteName,
      siteSlug,
      publicUrl,
      seoSettings,
    });
    const pageText = extractPlainTextFromHtml(pageHtml || "");

    if (!normalized.titleTag) {
      normalized.titleTag = meta.titleTag;
    }
    if (!normalized.metaDescription) {
      normalized.metaDescription = deriveMetaDescription(pageText);
    }

    setSeoDraft(normalized);
  }, [open, page, initialTab, siteName, siteSlug, publicUrl, seoSettings, pageHtml]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const parentPageOptions = useMemo(
    () =>
      pages.filter((item) => item.id !== page?.id && !item.isHome),
    [pages, page?.id],
  );

  const previewMeta = useMemo(() => {
    if (!page) return null;

    return resolvePageSeoMeta({
      page: {
        ...page,
        title,
        slug,
        seo: seoDraft,
      },
      siteName,
      siteSlug,
      publicUrl,
      seoSettings,
    });
  }, [page, title, slug, seoDraft, siteName, siteSlug, publicUrl, seoSettings]);

  const siteSeo = normalizeSiteSeoSettings(seoSettings);
  const pageIndexingEnabled =
    siteSeo.siteIndexingEnabled !== false && seoDraft.indexable !== false;

  if (!open || !page || typeof document === "undefined") return null;

  const handleSave = () => {
    const cleanTitle = String(title || "").trim();
    if (!cleanTitle) return;

    onSave({
      title: cleanTitle,
      slug: page.isHome ? "" : String(slug || "").trim(),
      seo: normalizePageSeo(seoDraft),
    });
    onClose();
  };

  const updateSeo = (patch: Partial<SitePageSeoSettings>) => {
    setSeoDraft((current) => ({ ...current, ...patch }));
  };

  const updateSocial = (patch: Partial<NonNullable<SitePageSeoSettings["social"]>>) => {
    setSeoDraft((current) => ({
      ...current,
      social: {
        ...(current.social || {}),
        ...patch,
      },
    }));
  };

  const applySmartSeo = () => {
    if (!page) return;
    const beforeSchemaCount = (seoDraft.structuredData || []).length;
    const smart = buildSmartPageSeo({
      page: { ...page, title, slug, seo: seoDraft },
      siteName,
      siteSlug,
      publicUrl,
      seoSettings,
      pageHtml,
      overwrite: true,
    });

    const filled: string[] = [];
    if (smart.titleTag) filled.push("כותרת");
    if (smart.metaDescription) filled.push("תיאור");
    const keywordCount = (smart.keywords || "")
      .split(",")
      .map((word) => word.trim())
      .filter(Boolean).length;
    if (keywordCount) filled.push(`${keywordCount} מילות מפתח`);
    if (smart.social?.ogTitle || smart.social?.ogDescription) {
      filled.push("שיתוף ברשתות");
    }
    if ((smart.structuredData || []).length > beforeSchemaCount) {
      filled.push("כרטיס Schema");
    }

    setSeoDraft(smart);
    setSmartHint(
      filled.length
        ? `מולא אוטומטית: ${filled.join(" · ")}. עברי על הטאבים וערכי מה שצריך.`
        : "לא נמצא מספיק תוכן בעמוד. הוסיפי טקסט לעמוד ונסי שוב.",
    );
    window.setTimeout(() => setSmartHint(""), 8000);
  };

  const fillExample = (field: "titleTag" | "metaDescription" | "keywords") => {
    const exampleSiteName = siteName || "העסק שלי";
    const examplePage = title || page?.title || "עמוד";
    if (field === "titleTag") {
      updateSeo({ titleTag: `${examplePage} | ${exampleSiteName}` });
    } else if (field === "metaDescription") {
      updateSeo({
        metaDescription: `${examplePage} של ${exampleSiteName} — שירות מקצועי, איכותי ואמין. צרו קשר עוד היום לפרטים והצעת מחיר.`,
      });
    } else {
      updateSeo({
        keywords: `${examplePage}, ${exampleSiteName}, שירות, מקצועי, המלצות`,
      });
    }
  };

  const toggleRobotsDirective = (directive: SeoRobotsDirective) => {
    setSeoDraft((current) => {
      const list = Array.isArray(current.robotsDirectives)
        ? current.robotsDirectives
        : [];
      const next = list.includes(directive)
        ? list.filter((item) => item !== directive)
        : [...list, directive];
      return { ...current, robotsDirectives: next };
    });
  };

  const addStructuredData = (entry: SeoStructuredDataEntry) => {
    setSeoDraft((current) => ({
      ...current,
      structuredData: [...(current.structuredData || []), entry],
    }));
  };

  const updateStructuredData = (
    id: string,
    patch: Partial<SeoStructuredDataEntry>,
  ) => {
    setSeoDraft((current) => ({
      ...current,
      structuredData: (current.structuredData || []).map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    }));
  };

  const removeStructuredData = (id: string) => {
    setSeoDraft((current) => ({
      ...current,
      structuredData: (current.structuredData || []).filter(
        (item) => item.id !== id,
      ),
    }));
  };

  const addCustomMetaTag = (preset?: Partial<SeoCustomMetaTag>) => {
    setSeoDraft((current) => ({
      ...current,
      customMetaTags: [
        ...(current.customMetaTags || []),
        {
          id: createSeoId("meta"),
          attr: preset?.attr || "name",
          key: preset?.key || "",
          content: preset?.content || "",
        },
      ],
    }));
  };

  const updateCustomMetaTag = (id: string, patch: Partial<SeoCustomMetaTag>) => {
    setSeoDraft((current) => ({
      ...current,
      customMetaTags: (current.customMetaTags || []).map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    }));
  };

  const removeCustomMetaTag = (id: string) => {
    setSeoDraft((current) => ({
      ...current,
      customMetaTags: (current.customMetaTags || []).filter(
        (item) => item.id !== id,
      ),
    }));
  };

  const addHreflang = () => {
    setSeoDraft((current) => ({
      ...current,
      hreflang: [
        ...(current.hreflang || []),
        { id: createSeoId("hl"), lang: "", href: "" },
      ],
    }));
  };

  const updateHreflang = (id: string, patch: Partial<SeoHreflangEntry>) => {
    setSeoDraft((current) => ({
      ...current,
      hreflang: (current.hreflang || []).map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    }));
  };

  const removeHreflang = (id: string) => {
    setSeoDraft((current) => ({
      ...current,
      hreflang: (current.hreflang || []).filter((item) => item.id !== id),
    }));
  };

  const siteBaseUrl = (publicUrl || buildPublicSiteUrl(siteSlug)).replace(
    /\/+$/,
    "",
  );

  const verificationCode =
    (seoDraft.customMetaTags || []).find(
      (meta) => meta.key === "google-site-verification",
    )?.content || "";

  const setVerificationCode = (rawValue: string) => {
    const match = rawValue.match(/content=["']([^"']+)["']/i);
    const value = (match ? match[1] : rawValue).trim();

    setSeoDraft((current) => {
      const list = current.customMetaTags || [];
      const existing = list.find(
        (meta) => meta.key === "google-site-verification",
      );

      let next: SeoCustomMetaTag[];
      if (!value) {
        next = list.filter((meta) => meta.key !== "google-site-verification");
      } else if (existing) {
        next = list.map((meta) =>
          meta.key === "google-site-verification"
            ? { ...meta, content: value }
            : meta,
        );
      } else {
        next = [
          ...list,
          {
            id: createSeoId("meta"),
            attr: "name",
            key: "google-site-verification",
            content: value,
          },
        ];
      }
      return { ...current, customMetaTags: next };
    });
  };

  const copyToClipboard = (value: string) => {
    try {
      navigator.clipboard?.writeText(value);
      setCopiedHint(true);
      window.setTimeout(() => setCopiedHint(false), 2000);
    } catch {
      /* clipboard not available */
    }
  };

  const robotsPreview = buildRobotsContent({
    indexable: pageIndexingEnabled,
    directives: seoDraft.robotsDirectives || [],
    maxSnippet: seoDraft.maxSnippet ?? null,
    maxImagePreview: (seoDraft.maxImagePreview as SeoMaxImagePreview) || "",
    maxVideoPreview: seoDraft.maxVideoPreview ?? null,
  });

  const previewUrl =
    previewMeta?.absoluteUrl ||
    `${(publicUrl || buildPublicSiteUrl(siteSlug)).replace(/\/+$/, "")}${buildPagePath({
      ...page,
      slug,
    })}`;

  return createPortal(
    <div
      className="fixed inset-0 z-[2147483605] flex items-center justify-center overflow-y-auto bg-slate-950/55 p-3 backdrop-blur-md sm:p-6"
      dir="rtl"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`הגדרות עמוד (${page.title || "עמוד"})`}
        className="relative my-auto flex h-[min(760px,calc(100vh-24px))] w-full max-w-[860px] flex-col overflow-hidden rounded-[32px] border border-white/70 bg-white shadow-[0_32px_100px_rgba(15,23,42,0.32)] sm:h-[min(760px,calc(100vh-48px))]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.14),transparent_55%),radial-gradient(circle_at_top_left,rgba(14,165,233,0.12),transparent_52%)]" />

        <header className="relative flex shrink-0 items-start justify-between border-b border-slate-100 px-5 py-5 sm:px-7 sm:py-6">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-200">
              <Globe className="h-6 w-6" />
            </div>

            <div className="min-w-0">
              <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-[30px]">
                הגדרות עמוד
              </h2>
              <p className="mt-1 truncate text-sm font-semibold text-slate-500">
                {page.title || "עמוד"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
            aria-label="סגירה"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="relative flex shrink-0 gap-1 overflow-x-auto border-b border-slate-100 px-4 sm:px-7">
          {TABS.map((item) => {
            const active = tab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={[
                  "flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-black transition",
                  active
                    ? "border-blue-600 text-blue-700"
                    : "border-transparent text-slate-500 hover:text-slate-800",
                ].join(" ")}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-7 sm:py-6">
          {tab !== "settings" ? (
            <div className="mb-5 rounded-3xl border border-blue-200 bg-gradient-to-l from-blue-600 to-sky-500 p-4 text-white shadow-lg shadow-blue-200">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/20">
                    <Wand2 className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-black">SEO חכם — מילוי אוטומטי</p>
                    <p className="text-xs font-semibold text-blue-50">
                      נמלא כותרת, תיאור, מילות מפתח וכרטיס Schema מתוכן העמוד.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={applySmartSeo}
                  className="flex h-11 shrink-0 items-center gap-2 rounded-2xl bg-white px-5 text-sm font-black text-blue-700 shadow-sm transition hover:bg-blue-50"
                >
                  <Sparkles className="h-4 w-4" /> מלא אוטומטית
                </button>
              </div>
              {smartHint ? (
                <p className="mt-3 flex items-center gap-2 rounded-2xl bg-white/15 px-3 py-2 text-xs font-bold">
                  <CheckCircle2 className="h-4 w-4" /> {smartHint}
                </p>
              ) : null}
            </div>
          ) : null}

          {(tab === "seo" || tab === "social") && previewMeta ? (
            <section className="mb-6 rounded-3xl border border-slate-200 bg-slate-50/80 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-black text-slate-700">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                {tab === "social" ? "תצוגה מקדימה לשיתוף" : "תצוגה מקדימה בגוגל"}
              </div>

              {tab === "seo" ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="truncate text-lg font-medium text-[#1a0dab]">
                    {truncateForPreview(previewMeta.titleTag, 70) || "כותרת העמוד"}
                  </p>
                  <p className="mt-1 truncate text-sm text-[#006621]">
                    {previewUrl}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {truncateForPreview(
                      previewMeta.metaDescription,
                      160,
                    ) || "מנועי החיפוש עשויים להציג תיאור שונה."}
                  </p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  {previewMeta.social.ogImage ? (
                    <img
                      src={previewMeta.social.ogImage}
                      alt=""
                      className="h-40 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-40 items-center justify-center bg-slate-100 text-sm font-bold text-slate-400">
                      אין תמונת שיתוף
                    </div>
                  )}
                  <div className="p-4">
                    <p className="truncate text-sm font-black text-slate-900">
                      {truncateForPreview(previewMeta.social.ogTitle, 80)}
                    </p>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                      {truncateForPreview(previewMeta.social.ogDescription, 160)}
                    </p>
                    <p className="mt-2 truncate text-xs font-bold uppercase tracking-wide text-slate-400">
                      {previewUrl.replace(/^https?:\/\//, "")}
                    </p>
                  </div>
                </div>
              )}
            </section>
          ) : null}

          {tab === "settings" ? (
            <div className="space-y-5">
              <label className="block space-y-2">
                <span className="text-sm font-black text-slate-800">שם העמוד</span>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className={fieldClassName}
                  placeholder="לדוגמה: שירותים"
                />
              </label>

              {!page.isHome ? (
                <label className="block space-y-2">
                  <span className="text-sm font-black text-slate-800">
                    כתובת URL (slug)
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-400">/</span>
                    <input
                      value={slug}
                      onChange={(event) => setSlug(event.target.value)}
                      className={fieldClassName}
                      placeholder="services"
                      dir="ltr"
                    />
                  </div>
                </label>
              ) : null}
            </div>
          ) : null}

          {tab === "seo" ? (
            <div className="space-y-5">
              <label className="block space-y-2">
                <span className="text-sm font-black text-slate-800">
                  עמוד אב (היררכיית האתר)
                </span>
                <select
                  value={seoDraft.parentPageId || ""}
                  onChange={(event) =>
                    updateSeo({ parentPageId: event.target.value })
                  }
                  className={fieldClassName}
                >
                  <option value="">דף הבית</option>
                  {parentPageOptions.map((parentPage) => (
                    <option key={parentPage.id} value={parentPage.id}>
                      {parentPage.title}
                    </option>
                  ))}
                </select>
              </label>

              {!page.isHome ? (
                <label className="block space-y-2">
                  <span className="text-sm font-black text-slate-800">
                    כתובת URL (slug)
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-400">/</span>
                    <input
                      value={slug}
                      onChange={(event) => setSlug(event.target.value)}
                      className={fieldClassName}
                      dir="ltr"
                    />
                  </div>
                </label>
              ) : null}

              <label className="block space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-black text-slate-800">
                    Title tag (כותרת בתוצאות החיפוש)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fillExample("titleTag")}
                      className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-black text-slate-600 transition hover:bg-slate-200"
                    >
                      <Lightbulb className="h-3.5 w-3.5" /> דוגמה
                    </button>
                    <LengthHint
                      value={seoDraft.titleTag || previewMeta?.titleTag || ""}
                      idealMax={60}
                      hardMax={70}
                    />
                  </div>
                </div>
                <input
                  value={seoDraft.titleTag || ""}
                  onChange={(event) =>
                    updateSeo({ titleTag: event.target.value })
                  }
                  className={fieldClassName}
                  placeholder={previewMeta?.titleTag || "שם העמוד | שם האתר"}
                />
              </label>

              <label className="block space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-black text-slate-800">
                    Meta description
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fillExample("metaDescription")}
                      className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-black text-slate-600 transition hover:bg-slate-200"
                    >
                      <Lightbulb className="h-3.5 w-3.5" /> דוגמה
                    </button>
                    <LengthHint
                      value={seoDraft.metaDescription || ""}
                      idealMax={160}
                      hardMax={320}
                    />
                  </div>
                </div>
                <textarea
                  value={seoDraft.metaDescription || ""}
                  onChange={(event) =>
                    updateSeo({ metaDescription: event.target.value })
                  }
                  className={textareaClassName}
                  placeholder="תיאור קצר שמסביר על מה העמוד. מנועי החיפוש עשויים להציג תיאור שונה."
                />
              </label>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-black text-slate-900">
                      לאפשר למנועי חיפוש לאנדקס את העמוד
                    </p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      כשהאפשרות כבויה, העמוד לא יופיע בתוצאות החיפוש.
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={pageIndexingEnabled}
                    onClick={() =>
                      updateSeo({ indexable: !pageIndexingEnabled })
                    }
                    className={[
                      "relative h-7 w-12 shrink-0 rounded-full transition",
                      pageIndexingEnabled ? "bg-blue-600" : "bg-slate-300",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition",
                        pageIndexingEnabled ? "right-0.5" : "right-[22px]",
                      ].join(" ")}
                    />
                  </button>
                </div>

                {siteSeo.siteIndexingEnabled === false ? (
                  <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700">
                    כיביתם אינדוקס לכל האתר בהגדרות האתר. כדי שהעמוד יופיע בגוגל,
                    יש להפעיל אינדוקס ברמת האתר.
                  </p>
                ) : null}
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <Globe className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <p className="text-sm font-black text-slate-900">
                      בדיקה וחיבור לגוגל
                    </p>
                    <p className="text-[11px] font-semibold text-slate-500">
                      גוגל סורק את האתר לבד אחרי פרסום — אין צורך בהתחברות.
                    </p>
                  </div>
                </div>

                <div
                  className={[
                    "mt-3 flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-black",
                    pageIndexingEnabled
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-rose-50 text-rose-700",
                  ].join(" ")}
                >
                  {pageIndexingEnabled ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" /> העמוד פתוח לאינדוקס —
                      גוגל יכול להציג אותו.
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4" /> העמוד חסום מאינדוקס —
                      הפעילי את המתג למעלה.
                    </>
                  )}
                </div>

                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <a
                    href={`https://search.google.com/test/rich-results?url=${encodeURIComponent(
                      previewUrl,
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-black text-slate-700 transition hover:border-blue-300 hover:bg-blue-50"
                  >
                    <Search className="h-4 w-4" /> בדיקת תצוגה בגוגל
                  </a>
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(
                      `site:${(publicUrl || buildPublicSiteUrl(siteSlug)).replace(
                        /^https?:\/\//,
                        "",
                      )}`,
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-black text-slate-700 transition hover:border-blue-300 hover:bg-blue-50"
                  >
                    <Globe className="h-4 w-4" /> האם האתר כבר בגוגל?
                  </a>
                  <a
                    href={`${(publicUrl || buildPublicSiteUrl(siteSlug)).replace(
                      /\/+$/,
                      "",
                    )}/sitemap.xml`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-black text-slate-700 transition hover:border-blue-300 hover:bg-blue-50"
                  >
                    מפת אתר (sitemap.xml)
                  </a>
                  <a
                    href="https://search.google.com/search-console"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-black text-slate-700 transition hover:border-blue-300 hover:bg-blue-50"
                  >
                    Google Search Console
                  </a>
                </div>

                <p className="mt-3 text-[11px] font-semibold leading-5 text-slate-500">
                  לחיבור מלא לגוגל: עברו לטאב{" "}
                  <span className="font-black text-slate-700">"SEO מתקדם"</span>{" "}
                  → "אימות מול Google" ועקבו אחרי השלבים. אחרי פרסום האתר, גוגל
                  יתחיל להציג אותו תוך כמה ימים.
                </p>
              </div>
            </div>
          ) : null}

          {tab === "advanced" ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-3xl border border-blue-100 bg-gradient-to-l from-blue-50 to-sky-50 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-black text-slate-900">
                    הגדרות למתקדמים — לא חובה
                  </p>
                  <p className="mt-1 text-xs font-semibold leading-5 text-slate-600">
                    אפשר להשאיר הכל ריק והאתר יופיע בגוגל מצוין. הכלים כאן נועדו
                    למי שרוצה שליטה מקצועית. לא בטוחים? דלגו — מה שחשוב באמת נמצא
                    בטאב{" "}
                    <span className="font-black text-blue-700">"יסודות SEO"</span>.
                  </p>
                </div>
              </div>

              <AdvancedSection
                icon={<Braces className="h-5 w-5" />}
                title="כרטיס חכם בגוגל (Schema)"
                description="עוזר לגוגל להציג כוכבי דירוג, שעות פתיחה, שאלות ותשובות — וגם ל-AI להבין את העסק."
                badge={{ label: "מומלץ", tone: "recommended" }}
                defaultOpen
              >
                <HelpNote>
                  בחרו מה שמתאים לעמוד ולחצו — נבנה עבורכם קוד מוכן. רוב העסקים
                  מתחילים מ״עסק מקומי״. אפשר להוסיף כמה סוגים.
                </HelpNote>

                <div className="grid gap-2 sm:grid-cols-2">
                  {STRUCTURED_DATA_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() =>
                        addStructuredData({
                          id: createSeoId("ld"),
                          name: preset.id,
                          json: preset.build({
                            siteName,
                            pageTitle: title || page.title || "",
                            url: previewUrl,
                          }),
                        })
                      }
                      className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-right transition hover:border-blue-300 hover:bg-blue-50/50"
                    >
                      <Plus className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                      <span className="min-w-0">
                        <span className="block text-sm font-black text-slate-900">
                          {preset.label}
                        </span>
                        <span className="block text-[11px] font-semibold leading-4 text-slate-500">
                          {preset.description}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>

                {(seoDraft.structuredData || []).length ? (
                  <div className="space-y-2">
                    <p className="text-xs font-black text-slate-700">
                      סכימות בעמוד ({(seoDraft.structuredData || []).length})
                    </p>
                    {(seoDraft.structuredData || []).map((entry) => {
                      const status = validateJsonLd(entry.json);
                      return (
                        <div
                          key={entry.id}
                          className="rounded-2xl border border-slate-200 bg-white p-3"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              value={entry.name}
                              onChange={(event) =>
                                updateStructuredData(entry.id, {
                                  name: event.target.value,
                                })
                              }
                              className="h-10 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-900 outline-none focus:border-blue-400"
                              placeholder="שם הסכימה"
                            />
                            <span
                              className={[
                                "flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-black",
                                status.valid
                                  ? "bg-emerald-50 text-emerald-600"
                                  : "bg-rose-50 text-rose-600",
                              ].join(" ")}
                            >
                              {status.valid ? (
                                <>
                                  <CheckCircle2 className="h-3.5 w-3.5" /> תקין
                                </>
                              ) : (
                                <>
                                  <AlertTriangle className="h-3.5 w-3.5" /> לתיקון
                                </>
                              )}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeStructuredData(entry.id)}
                              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-rose-500 transition hover:bg-rose-50"
                              aria-label="מחיקת סכימה"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <details className="group/code mt-2 [&_summary::-webkit-details-marker]:hidden">
                            <summary className="flex cursor-pointer list-none items-center gap-1.5 text-xs font-black text-blue-600">
                              <ChevronDown className="h-4 w-4 transition group-open/code:rotate-180" />
                              עריכת הקוד (JSON-LD)
                            </summary>
                            <textarea
                              value={entry.json}
                              onChange={(event) =>
                                updateStructuredData(entry.id, {
                                  json: event.target.value,
                                })
                              }
                              className="mt-2 min-h-[140px] w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs leading-5 text-slate-900 outline-none focus:border-blue-400"
                              dir="ltr"
                              spellCheck={false}
                            />
                            {!status.valid && entry.json ? (
                              <p
                                className="mt-1 text-[11px] font-bold text-rose-600"
                                dir="ltr"
                              >
                                {status.error}
                              </p>
                            ) : null}
                          </details>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </AdvancedSection>

              <AdvancedSection
                icon={<Bot className="h-5 w-5" />}
                title="שליטה בהופעה בגוגל (Robots)"
                description="מה גוגל יציג מהעמוד. ברירת המחדל מצוינת לרוב העסקים."
                badge={{ label: "לא חובה", tone: "optional" }}
              >
                <HelpNote>
                  סמנו כאן רק אם יש סיבה ברורה. אם לא בטוחים — אל תשנו כלום.
                </HelpNote>

                <div className="space-y-2">
                  {ROBOTS_DIRECTIVE_OPTIONS.map((option) => {
                    const checked = (seoDraft.robotsDirectives || []).includes(
                      option.value,
                    );
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => toggleRobotsDirective(option.value)}
                        className={[
                          "flex w-full items-center gap-3 rounded-2xl border px-3.5 py-3 text-right transition",
                          checked
                            ? "border-blue-500 bg-blue-50"
                            : "border-slate-200 bg-white hover:border-slate-300",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border",
                            checked
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "border-slate-300 bg-white",
                          ].join(" ")}
                        >
                          {checked ? <CheckCircle2 className="h-4 w-4" /> : null}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-black text-slate-900">
                            {option.hint}
                          </span>
                          <span className="block font-mono text-[11px] font-semibold text-slate-400">
                            {option.label}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                <details className="group/adv rounded-2xl border border-slate-200 bg-white [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer list-none items-center gap-1.5 px-3.5 py-3 text-xs font-black text-slate-600">
                    <ChevronDown className="h-4 w-4 transition group-open/adv:rotate-180" />
                    אפשרויות תצוגה נוספות (למומחים)
                  </summary>
                  <div className="grid gap-3 border-t border-slate-100 px-3.5 py-3 sm:grid-cols-3">
                    <label className="block space-y-1.5">
                      <span className="text-xs font-black text-slate-700">
                        max-image-preview
                      </span>
                      <select
                        value={seoDraft.maxImagePreview || ""}
                        onChange={(event) =>
                          updateSeo({
                            maxImagePreview: event.target
                              .value as SeoMaxImagePreview,
                          })
                        }
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-800 outline-none focus:border-blue-400"
                      >
                        <option value="">ברירת מחדל</option>
                        <option value="none">none</option>
                        <option value="standard">standard</option>
                        <option value="large">large</option>
                      </select>
                    </label>
                    <label className="block space-y-1.5">
                      <span className="text-xs font-black text-slate-700">
                        max-snippet
                      </span>
                      <input
                        type="number"
                        value={
                          seoDraft.maxSnippet === null ||
                          seoDraft.maxSnippet === undefined
                            ? ""
                            : seoDraft.maxSnippet
                        }
                        onChange={(event) =>
                          updateSeo({
                            maxSnippet:
                              event.target.value === ""
                                ? null
                                : Number(event.target.value),
                          })
                        }
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-800 outline-none focus:border-blue-400"
                        placeholder="-1 = ללא הגבלה"
                        dir="ltr"
                      />
                    </label>
                    <label className="block space-y-1.5">
                      <span className="text-xs font-black text-slate-700">
                        max-video-preview
                      </span>
                      <input
                        type="number"
                        value={
                          seoDraft.maxVideoPreview === null ||
                          seoDraft.maxVideoPreview === undefined
                            ? ""
                            : seoDraft.maxVideoPreview
                        }
                        onChange={(event) =>
                          updateSeo({
                            maxVideoPreview:
                              event.target.value === ""
                                ? null
                                : Number(event.target.value),
                          })
                        }
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-800 outline-none focus:border-blue-400"
                        placeholder="-1 = ללא הגבלה"
                        dir="ltr"
                      />
                    </label>
                  </div>
                </details>

                <div className="rounded-2xl bg-slate-900 px-4 py-3">
                  <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">
                    תג robots שייווצר אוטומטית
                  </p>
                  <code
                    className="mt-1 block break-all font-mono text-xs text-emerald-300"
                    dir="ltr"
                  >
                    &lt;meta name="robots" content="{robotsPreview}"&gt;
                  </code>
                </div>
              </AdvancedSection>

              <AdvancedSection
                icon={<Globe className="h-5 w-5" />}
                title="כתובת רשמית ומילות מפתח"
                description="למניעת תוכן כפול כשאותו עמוד נגיש מכמה כתובות."
                badge={{ label: "לא חובה", tone: "optional" }}
              >
                <HelpNote>
                  Canonical אומר לגוגל מהי הכתובת ה״רשמית״ של העמוד. השאירו ריק אם
                  יש רק כתובת אחת — נשתמש בה אוטומטית.
                </HelpNote>
                <label className="block space-y-2">
                  <span className="text-sm font-black text-slate-800">
                    Canonical URL
                  </span>
                  <input
                    value={seoDraft.canonicalUrl || ""}
                    onChange={(event) =>
                      updateSeo({ canonicalUrl: event.target.value })
                    }
                    className={fieldClassName}
                    placeholder={previewUrl}
                    dir="ltr"
                  />
                </label>

                <label className="block space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-black text-slate-800">
                      מילות מפתח
                    </span>
                    <button
                      type="button"
                      onClick={() => fillExample("keywords")}
                      className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-black text-slate-600 transition hover:bg-slate-200"
                    >
                      <Lightbulb className="h-3.5 w-3.5" /> דוגמה
                    </button>
                  </div>
                  <input
                    value={seoDraft.keywords || ""}
                    onChange={(event) =>
                      updateSeo({ keywords: event.target.value })
                    }
                    className={fieldClassName}
                    placeholder="מילה1, מילה2, מילה3"
                  />
                </label>
              </AdvancedSection>

              <AdvancedSection
                icon={<Tags className="h-5 w-5" />}
                title="אימות מול Google ותגי מטא"
                description="חברו את האתר ל-Google Search Console כדי לעקוב אחרי הביצועים ולשלוח עמודים לגוגל."
                badge={{ label: "מומלץ", tone: "recommended" }}
              >
                <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-3.5 text-xs font-semibold leading-6 text-slate-700">
                  <p className="mb-1 flex items-center gap-1.5 text-sm font-black text-slate-900">
                    <Lightbulb className="h-4 w-4 text-blue-500" /> מה זה "קוד
                    אימות" של גוגל?
                  </p>
                  זהו קוד קצר ש-Google נותן לך, שמוכיח שהאתר הזה באמת שלך. מדביקים
                  אותו פעם אחת — ומאותו רגע גוגל נותן לך לראות נתונים על האתר
                  ולבקש ממנו לסרוק עמודים. זה חד-פעמי.
                </div>

                <ol className="space-y-3">
                  <li className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-black text-white">
                      1
                    </span>
                    <div className="flex-1 space-y-2 pt-0.5">
                      <p className="text-sm font-black text-slate-900">
                        היכנסי ל-Google Search Console (בחינם)
                      </p>
                      <a
                        href="https://search.google.com/search-console/welcome"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-3.5 py-2 text-xs font-black text-blue-700 transition hover:bg-blue-50"
                      >
                        <ExternalLink className="h-4 w-4" /> פתיחת Search Console
                      </a>
                    </div>
                  </li>

                  <li className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-black text-white">
                      2
                    </span>
                    <div className="flex-1 space-y-2 pt-0.5">
                      <p className="text-sm font-black text-slate-900">
                        בחרי "קידומת כתובת אתר" והדביקי את הכתובת שלך
                      </p>
                      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5">
                        <input
                          value={siteBaseUrl}
                          readOnly
                          dir="ltr"
                          className="h-9 min-w-0 flex-1 rounded-lg bg-slate-50 px-3 text-xs font-bold text-slate-700 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => copyToClipboard(siteBaseUrl)}
                          className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-slate-900 px-3 text-xs font-black text-white transition hover:bg-slate-800"
                        >
                          {copiedHint ? (
                            <>
                              <CheckCircle2 className="h-4 w-4" /> הועתק
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4" /> העתקה
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </li>

                  <li className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-black text-white">
                      3
                    </span>
                    <div className="flex-1 space-y-2 pt-0.5">
                      <p className="text-sm font-black text-slate-900">
                        בחרי אימות בשיטת "תג HTML" — גוגל יציג שורה כזו:
                      </p>
                      <code
                        className="block break-all rounded-xl bg-slate-900 px-3 py-2 font-mono text-[11px] leading-5 text-emerald-300"
                        dir="ltr"
                      >
                        &lt;meta name="google-site-verification"
                        content="AbC123…" /&gt;
                      </code>
                      <p className="text-xs font-semibold text-slate-500">
                        צריך להעתיק <span className="font-black">רק</span> את
                        הקוד שבתוך content (למשל AbC123…).
                      </p>
                    </div>
                  </li>

                  <li className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-black text-white">
                      4
                    </span>
                    <div className="flex-1 space-y-2 pt-0.5">
                      <p className="text-sm font-black text-slate-900">
                        הדביקי כאן את קוד האימות
                      </p>
                      <input
                        value={verificationCode}
                        onChange={(event) =>
                          setVerificationCode(event.target.value)
                        }
                        className={fieldClassName}
                        placeholder="אפשר להדביק את הקוד או את כל השורה של גוגל"
                        dir="ltr"
                      />
                      {verificationCode ? (
                        <p className="flex items-center gap-1.5 text-xs font-black text-emerald-600">
                          <CheckCircle2 className="h-4 w-4" /> הקוד נשמר — יתווסף
                          לאתר אחרי לחיצה על "שמירה".
                        </p>
                      ) : null}
                    </div>
                  </li>

                  <li className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-black text-white">
                      5
                    </span>
                    <div className="flex-1 space-y-1 pt-0.5">
                      <p className="text-sm font-black text-slate-900">
                        שמרי כאן, פרסמי את האתר, וחזרי ל-Search Console ללחוץ
                        "אמת"
                      </p>
                      <p className="text-xs font-semibold text-slate-500">
                        חשוב: האתר צריך להיות מפורסם כדי שגוגל ימצא את הקוד.
                      </p>
                    </div>
                  </li>
                </ol>

                <details className="group/meta rounded-2xl border border-slate-200 bg-white [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer list-none items-center gap-1.5 px-3.5 py-3 text-xs font-black text-slate-600">
                    <ChevronDown className="h-4 w-4 transition group-open/meta:rotate-180" />
                    תגי מטא נוספים (למומחים)
                  </summary>
                  <div className="space-y-2 border-t border-slate-100 px-3.5 py-3">
                    {(seoDraft.customMetaTags || [])
                      .filter(
                        (meta) => meta.key !== "google-site-verification",
                      )
                      .map((meta) => (
                        <div
                          key={meta.id}
                          className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2"
                        >
                          <select
                            value={meta.attr}
                            onChange={(event) =>
                              updateCustomMetaTag(meta.id, {
                                attr: event.target.value as "name" | "property",
                              })
                            }
                            className="h-10 rounded-xl border border-slate-200 bg-white px-2 text-xs font-bold text-slate-800 outline-none focus:border-blue-400"
                            dir="ltr"
                          >
                            <option value="name">name</option>
                            <option value="property">property</option>
                          </select>
                          <input
                            value={meta.key}
                            onChange={(event) =>
                              updateCustomMetaTag(meta.id, {
                                key: event.target.value,
                              })
                            }
                            className="h-10 w-[150px] rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-900 outline-none focus:border-blue-400"
                            placeholder="og:site_name"
                            dir="ltr"
                          />
                          <input
                            value={meta.content}
                            onChange={(event) =>
                              updateCustomMetaTag(meta.id, {
                                content: event.target.value,
                              })
                            }
                            className="h-10 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none focus:border-blue-400"
                            placeholder="הערך של התג"
                            dir="ltr"
                          />
                          <button
                            type="button"
                            onClick={() => removeCustomMetaTag(meta.id)}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-rose-500 transition hover:bg-rose-50"
                            aria-label="מחיקת תג"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          addCustomMetaTag({
                            attr: "property",
                            key: "og:site_name",
                          })
                        }
                        className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
                      >
                        + og:site_name
                      </button>
                      <button
                        type="button"
                        onClick={() => addCustomMetaTag()}
                        className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
                      >
                        <Plus className="h-4 w-4" /> תג חדש
                      </button>
                    </div>
                  </div>
                </details>
              </AdvancedSection>

              <AdvancedSection
                icon={<Languages className="h-5 w-5" />}
                title="שפות ואזורים (hreflang)"
                description="קישור בין גרסאות של העמוד בשפות או מדינות שונות."
                badge={{ label: "לא חובה", tone: "optional" }}
              >
                <HelpNote>
                  רלוונטי רק אם יש לעמוד גרסה בשפה אחרת. לדוגמה: he-IL לעברית,
                  en-US לאנגלית.
                </HelpNote>
                {(seoDraft.hreflang || []).length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-4 text-center text-xs font-semibold text-slate-400">
                    אין שפות נוספות. הוסיפו רק אם קיימת גרסה בשפה/מדינה אחרת.
                  </p>
                ) : null}
                {(seoDraft.hreflang || []).map((entry) => (
                  <div
                    key={entry.id}
                    className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2"
                  >
                    <input
                      value={entry.lang}
                      onChange={(event) =>
                        updateHreflang(entry.id, { lang: event.target.value })
                      }
                      className="h-10 w-[110px] rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-900 outline-none focus:border-blue-400"
                      placeholder="he-IL"
                      dir="ltr"
                    />
                    <input
                      value={entry.href}
                      onChange={(event) =>
                        updateHreflang(entry.id, { href: event.target.value })
                      }
                      className="h-10 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none focus:border-blue-400"
                      placeholder="https://example.com/en"
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() => removeHreflang(entry.id)}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-rose-500 transition hover:bg-rose-50"
                      aria-label="מחיקת שפה"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addHreflang}
                  className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:bg-slate-50"
                >
                  <Plus className="h-4 w-4" /> הוספת שפה
                </button>
              </AdvancedSection>
            </div>
          ) : null}

          {tab === "social" ? (
            <div className="space-y-5">
              <label className="block space-y-2">
                <span className="text-sm font-black text-slate-800">
                  כותרת לשיתוף
                </span>
                <input
                  value={seoDraft.social?.ogTitle || ""}
                  onChange={(event) =>
                    updateSocial({ ogTitle: event.target.value })
                  }
                  className={fieldClassName}
                  placeholder={previewMeta?.titleTag || ""}
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-black text-slate-800">
                  תיאור לשיתוף
                </span>
                <textarea
                  value={seoDraft.social?.ogDescription || ""}
                  onChange={(event) =>
                    updateSocial({ ogDescription: event.target.value })
                  }
                  className={textareaClassName}
                  placeholder={previewMeta?.metaDescription || ""}
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-black text-slate-800">
                  תמונת שיתוף (URL)
                </span>
                <input
                  value={seoDraft.social?.ogImage || ""}
                  onChange={(event) =>
                    updateSocial({ ogImage: event.target.value })
                  }
                  className={fieldClassName}
                  placeholder="https://..."
                  dir="ltr"
                />
              </label>
            </div>
          ) : null}
        </div>

        <footer className="relative flex shrink-0 items-center justify-end gap-3 border-t border-slate-100 bg-white px-5 py-4 sm:px-7">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
          >
            ביטול
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-blue-700"
          >
            שמירה
          </button>
        </footer>
      </div>
    </div>,
    document.body,
  );
}
