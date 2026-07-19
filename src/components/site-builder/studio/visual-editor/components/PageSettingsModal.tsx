import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  Globe,
  Lightbulb,
  Search,
  Settings2,
  Share2,
  Sparkles,
  X,
} from "lucide-react";

import type {
  SitePageSeoSettings,
  SiteSeoSettings,
  StudioSitePage,
} from "../../types";
import {
  buildPagePath,
  buildPublicSiteUrl,
  getSeoFieldLengthStatus,
  normalizePageSeo,
  normalizeSiteSeoSettings,
  resolvePageSeoMeta,
  truncateForPreview,
} from "../../utils/pageSeoUtils";

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

export default function PageSettingsModal({
  open,
  tab: initialTab,
  page,
  pages,
  siteName,
  siteSlug,
  publicUrl,
  seoSettings,
  onClose,
  onSave,
}: PageSettingsModalProps) {
  const [tab, setTab] = useState<PageSettingsModalTab>(initialTab);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [seoDraft, setSeoDraft] = useState<SitePageSeoSettings>({});

  useEffect(() => {
    if (!open || !page) return;

    setTab(initialTab);
    setTitle(String(page.title || ""));
    setSlug(String(page.slug || ""));
    setSeoDraft(normalizePageSeo(page.seo));
  }, [open, page, initialTab]);

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
    setSeoDraft((current) => normalizePageSeo({ ...current, ...patch }));
  };

  const updateSocial = (patch: Partial<NonNullable<SitePageSeoSettings["social"]>>) => {
    setSeoDraft((current) =>
      normalizePageSeo({
        ...current,
        social: {
          ...(current.social || {}),
          ...patch,
        },
      }),
    );
  };

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
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-black text-slate-800">
                    Title tag (כותרת בתוצאות החיפוש)
                  </span>
                  <LengthHint
                    value={seoDraft.titleTag || previewMeta?.titleTag || ""}
                    idealMax={60}
                    hardMax={70}
                  />
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
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-black text-slate-800">
                    Meta description
                  </span>
                  <LengthHint
                    value={seoDraft.metaDescription || ""}
                    idealMax={160}
                    hardMax={320}
                  />
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
            </div>
          ) : null}

          {tab === "advanced" ? (
            <div className="space-y-5">
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
                <span className="text-sm font-black text-slate-800">
                  מילות מפתח
                </span>
                <input
                  value={seoDraft.keywords || ""}
                  onChange={(event) =>
                    updateSeo({ keywords: event.target.value })
                  }
                  className={fieldClassName}
                  placeholder="מילה1, מילה2, מילה3"
                />
              </label>
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
