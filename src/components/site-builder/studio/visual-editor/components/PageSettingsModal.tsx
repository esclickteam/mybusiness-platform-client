import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocaleDir } from "../../../../../hooks/useLocaleDir";
import { createPortal } from "react-dom";
import {
  AlertTriangle,
  Braces,
  Bot,
  Building2,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Globe,
  Languages,
  Plus,
  Search,
  Settings2,
  Share2,
  Sparkles,
  Tags,
  Trash2,
  X,
} from "lucide-react";

import { getApiErrorMessage } from "../../../../../utils/apiErrorMessage";
import type {
  SeoCustomMetaTag,
  SeoHreflangEntry,
  SeoMaxImagePreview,
  SeoRobotsDirective,
  SeoStructuredDataEntry,
  SiteBrandSettings,
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
  extractGoogleSiteVerificationToken,
  extractPlainTextFromHtml,
  isSafeHttpUrl,
  normalizeGoogleHtmlFileName,
  normalizeKeywords,
  normalizePageSeo,
  normalizeSiteBrandSettings,
  normalizeSiteSeoSettings,
  resolvePageSeoMeta,
  truncateForPreview,
  validateJsonLd,
} from "../../utils/pageSeoUtils";
import SchemaBuilder from "./seo/schema-builder/SchemaBuilder";
import type { SchemaBuilderContext } from "./seo/schema-builder/schemaTypes";
import SeoImageUploader from "./seo/SeoImageUploader";
import GscVerificationWizard from "./seo/GscVerificationWizard";
import {
  GooglePreviewCard,
  SeoActionLink,
  SeoAdvancedSection,
  SeoExampleButton,
  SeoFieldLabel,
  SeoHelpNote,
  SeoLengthHint,
  SeoScoreCard,
  SeoSection,
  SeoSmartBanner,
  SeoStatusPill,
  SeoTabBar,
  SeoToggle,
  SocialPreviewCard,
  computeSeoScore,
  seoFieldClass,
  seoTextareaClass,
} from "./seo/SeoUi";

const ROBOTS_DIRECTIVE_OPTIONS: Array<{
  value: SeoRobotsDirective;
  hintKey: string;
}> = [
  { value: "nofollow", hintKey: "studio.pageSettings.robotsNofollow" },
  { value: "noarchive", hintKey: "studio.pageSettings.robotsNoarchive" },
  { value: "nosnippet", hintKey: "studio.pageSettings.robotsNosnippet" },
  { value: "noimageindex", hintKey: "studio.pageSettings.robotsNoimageindex" },
  { value: "notranslate", hintKey: "studio.pageSettings.robotsNotranslate" },
];

export type PageSettingsModalTab =
  | "settings"
  | "site"
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
  businessId?: string;
  publicUrl?: string;
  publicUrlIsPlaceholder?: boolean;
  seoSettings?: SiteSeoSettings | null;
  brandSettings?: SiteBrandSettings | null;
  pageHtml?: string;
  onClose: () => void;
  onSave: (payload: {
    title: string;
    slug: string;
    seo: SitePageSeoSettings;
    siteSeo?: SiteSeoSettings;
    siteBrand?: SiteBrandSettings;
  }) => void | Promise<void>;
};

const TAB_DEFS: Array<{
  id: PageSettingsModalTab;
  labelKey: string;
  icon: React.ReactNode;
}> = [
  { id: "settings", labelKey: "studio.pageSettings.tabSettings", icon: <Settings2 className="h-4 w-4" /> },
  { id: "site", labelKey: "studio.pageSettings.tabSite", icon: <Building2 className="h-4 w-4" /> },
  { id: "seo", labelKey: "studio.pageSettings.tabSeo", icon: <Search className="h-4 w-4" /> },
  { id: "advanced", labelKey: "studio.pageSettings.tabAdvanced", icon: <Sparkles className="h-4 w-4" /> },
  { id: "social", labelKey: "studio.pageSettings.tabSocial", icon: <Share2 className="h-4 w-4" /> },
];

export default function PageSettingsModal({
  open,
  tab: initialTab,
  page,
  pages,
  siteName,
  siteSlug,
  publicUrl,
  publicUrlIsPlaceholder,
  seoSettings,
  brandSettings,
  businessId,
  pageHtml,
  onClose,
  onSave,
}: PageSettingsModalProps) {
  const { t } = useTranslation();
  const dir = useLocaleDir();
  const tabs = useMemo(
    () => TAB_DEFS.map((item) => ({ ...item, label: t(item.labelKey) })),
    [t],
  );
  const [tab, setTab] = useState<PageSettingsModalTab>(initialTab);
  const [smartHint, setSmartHint] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [seoDraft, setSeoDraft] = useState<SitePageSeoSettings>({});
  const [siteSeoDraft, setSiteSeoDraft] = useState<SiteSeoSettings>(() =>
    normalizeSiteSeoSettings(seoSettings),
  );
  const [siteBrandDraft, setSiteBrandDraft] = useState<SiteBrandSettings>(() =>
    normalizeSiteBrandSettings(brandSettings, siteName),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (!open || !page) return;

    setTab(initialTab);
    setTitle(String(page.title || ""));
    setSlug(String(page.slug || ""));
    setSmartHint("");
    setSaveError("");
    setIsSaving(false);

    const normalized = normalizePageSeo(page.seo);

    /*
      Auto-fill description only. titleTag stays empty when unset so SEO score
      does not credit template/fallback titles; the input placeholder shows the
      resolved preview title instead.
    */
    const pageText = extractPlainTextFromHtml(pageHtml || "");
    if (!normalized.metaDescription) {
      normalized.metaDescription = deriveMetaDescription(pageText);
    }

    /*
      Migrate legacy page-level GSC tokens into site settings, and keep the
      page custom-meta list free of google-site-verification duplicates.
    */
    const siteNormalized = normalizeSiteSeoSettings(seoSettings);
    const legacyPageToken = extractGoogleSiteVerificationToken(
      (normalized.customMetaTags || []).find(
        (item) => item.key === "google-site-verification",
      )?.content,
    );
    const googleSiteVerification =
      siteNormalized.googleSiteVerification || legacyPageToken;

    normalized.customMetaTags = (normalized.customMetaTags || []).filter(
      (item) => item.key !== "google-site-verification",
    );

    const nextSiteSeo = {
      ...siteNormalized,
      googleSiteVerification,
    };
    const nextBrand = normalizeSiteBrandSettings(brandSettings, siteName);

    setSeoDraft(normalized);
    setSiteSeoDraft(nextSiteSeo);
    setSiteBrandDraft(nextBrand);
  }, [open, page, initialTab, siteName, siteSlug, publicUrl, seoSettings, brandSettings, pageHtml]);

  const requestClose = () => {
    onClose();
  };

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      onClose();
    };

    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
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

  const canonicalUrlError = useMemo(() => {
    const raw = String(seoDraft.canonicalUrl || "").trim();
    if (!raw) return "";
    if (isSafeHttpUrl(raw)) return "";
    return t("studio.pageSettings.invalidCanonical");
  }, [seoDraft.canonicalUrl, t]);

  const seoScore = useMemo(() => {
    // Score only explicit draft fields — never credit template/fallback title.
    const titleValue = String(seoDraft.titleTag || "").trim();
    const descValue = String(seoDraft.metaDescription || "").trim();
    const hasSchema = (seoDraft.structuredData || []).length > 0;
    const hasKeywords = Boolean(normalizeKeywords(seoDraft.keywords));
    const hasOgImage = Boolean(
      seoDraft.social?.ogImage || siteSeo.ogImage || siteSeo.defaultOgImage,
    );
    const hasGscMeta = Boolean(
      String(siteSeoDraft.googleSiteVerification || "").trim(),
    );
    const hasGscHtml =
      Boolean(String(siteSeoDraft.googleHtmlVerificationFile || "").trim()) &&
      Boolean(String(siteSeoDraft.googleHtmlVerificationContent || "").trim());

    return computeSeoScore([
      {
        id: "title",
        label: t("studio.pageSettings.googleTitle"),
        done: titleValue.length >= 20 && titleValue.length <= 70,
        hint: t("studio.pageSettings.googleTitleHint"),
      },
      {
        id: "description",
        label: t("studio.pageSettings.metaLabel"),
        done: descValue.length >= 50 && descValue.length <= 160,
        hint: t("studio.pageSettings.metaHint"),
      },
      {
        id: "index",
        label: t("studio.pageSettings.openToIndexShort"),
        done: pageIndexingEnabled,
      },
      {
        id: "schema",
        label: t("studio.pageSettings.schemaCard"),
        done: hasSchema,
      },
      {
        id: "keywords",
        label: t("studio.pageSettings.keywords"),
        done: hasKeywords,
      },
      {
        id: "social",
        label: t("studio.pageSettings.shareImageShort"),
        done: hasOgImage,
      },
      {
        id: "favicon",
        label: t("studio.pageSettings.siteFavicon"),
        done: Boolean(String(siteBrandDraft.faviconUrl || "").trim()),
      },
      {
        id: "gsc",
        label: t("studio.pageSettings.gscPrep"),
        done: hasGscMeta || hasGscHtml,
      },
    ]);
  }, [seoDraft, pageIndexingEnabled, siteSeo, siteBrandDraft, siteSeoDraft, t]);

  if (!open || !page || typeof document === "undefined") return null;

  const handleSave = async () => {
    if (isSaving) return;

    const cleanTitle = String(title || "").trim();
    if (!cleanTitle) return;
    if (canonicalUrlError) {
      setSaveError(canonicalUrlError);
      setTab("advanced");
      return;
    }

    const rawHtmlFile = String(
      siteSeoDraft.googleHtmlVerificationFile || "",
    ).trim();
    const rawHtmlContent = String(
      siteSeoDraft.googleHtmlVerificationContent || "",
    ).trim();
    if (rawHtmlFile || rawHtmlContent) {
      const normalizedHtmlFile = normalizeGoogleHtmlFileName(rawHtmlFile);
      if (!normalizedHtmlFile) {
        setSaveError(
          t("studio.pageSettings.invalidGoogleFile"),
        );
        setTab("advanced");
        return;
      }
      if (!rawHtmlContent) {
        setSaveError(t("studio.pageSettings.missingVerifyFile"));
        setTab("advanced");
        return;
      }
    }

    const pageSeo = normalizePageSeo({
      ...seoDraft,
      keywords: normalizeKeywords(seoDraft.keywords),
      customMetaTags: (seoDraft.customMetaTags || []).filter(
        (item) => item.key !== "google-site-verification",
      ),
    });

    setIsSaving(true);
    setSaveError("");
    try {
      const pending = onSave({
        title: cleanTitle,
        slug: page.isHome ? "" : String(slug || "").trim(),
        seo: pageSeo,
        siteSeo: normalizeSiteSeoSettings({
          ...siteSeoDraft,
          keywords: normalizeKeywords(siteSeoDraft.keywords),
          googleSiteVerification: extractGoogleSiteVerificationToken(
            siteSeoDraft.googleSiteVerification,
          ),
        }),
        siteBrand: normalizeSiteBrandSettings(
          siteBrandDraft,
          cleanTitle || siteName,
        ),
      });
      onClose();
      await Promise.resolve(pending);
    } catch (error) {
      setSaveError(
        getApiErrorMessage(error, t("studio.pageSettings.saveFailed")),
      );
    } finally {
      setIsSaving(false);
    }
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
    if (smart.titleTag) filled.push(t("studio.pageSettings.filledTitle"));
    if (smart.metaDescription) filled.push(t("studio.pageSettings.filledDescription"));
    const keywordCount = (smart.keywords || "")
      .split(",")
      .map((word) => word.trim())
      .filter(Boolean).length;
    if (keywordCount) filled.push(t("studio.pageSettings.filledKeywords", { count: keywordCount }));
    if (smart.social?.ogTitle || smart.social?.ogDescription) {
      filled.push(t("studio.pageSettings.filledSocial"));
    }
    if ((smart.structuredData || []).length > beforeSchemaCount) {
      filled.push(t("studio.pageSettings.filledSchema"));
    }

    setSeoDraft(smart);
    setSmartHint(
      filled.length
        ? t("studio.pageSettings.smartFilled", { items: filled.join(" · ") })
        : t("studio.pageSettings.smartEmpty"),
    );
    window.setTimeout(() => setSmartHint(""), 8000);
  };

  const fillExample = (field: "titleTag" | "metaDescription" | "keywords") => {
    const exampleSiteName = siteName || t("studio.pageSettings.exampleSiteName");
    const examplePage = title || page?.title || t("studio.page");
    if (field === "titleTag") {
      updateSeo({ titleTag: `${examplePage} | ${exampleSiteName}` });
    } else if (field === "metaDescription") {
      updateSeo({
        metaDescription: t("studio.pageSettings.exampleMeta", {
          page: examplePage,
          site: exampleSiteName,
        }),
      });
    } else {
      updateSeo({
        keywords: t("studio.pageSettings.exampleKeywords", {
          page: examplePage,
          site: exampleSiteName,
        }),
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

  const siteBaseUrl = (() => {
    const raw = String(publicUrl || buildPublicSiteUrl(siteSlug) || "").trim();
    if (!raw) return "";
    try {
      // Always origin only — never /business/.../dashboard from the studio URL bar.
      const parsed = new URL(raw.includes("://") ? raw : `https://${raw}`);
      return `${parsed.protocol}//${parsed.host}`.replace(/\/+$/, "");
    } catch {
      return raw
        .replace(/^https?:\/\//i, "https://")
        .replace(/\/(business|admin|dashboard)(\/.*)?$/i, "")
        .replace(/\/+$/, "");
    }
  })();

  const verificationCode = String(
    siteSeoDraft.googleSiteVerification || "",
  ).trim();
  const hasGscHtmlReady =
    Boolean(String(siteSeoDraft.googleHtmlVerificationFile || "").trim()) &&
    Boolean(String(siteSeoDraft.googleHtmlVerificationContent || "").trim());

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

  const parentPage = pages.find((item) => item.id === seoDraft.parentPageId);

  const schemaBuilderContext: SchemaBuilderContext = {
    siteName,
    pageTitle: title || page.title || "",
    previewUrl,
    publicUrl: siteBaseUrl,
    ogImage:
      seoDraft.social?.ogImage || siteSeo.ogImage || siteSeo.defaultOgImage,
    metaDescription: seoDraft.metaDescription || "",
    logoUrl: siteBrandDraft.logoUrl || siteSeo.ogImage || "",
    parentPageId: seoDraft.parentPageId || "",
    parentPageTitle: parentPage?.title || "",
    parentPageUrl: parentPage
      ? `${siteBaseUrl}/${String(parentPage.slug || parentPage.id || "").replace(/^\/+/, "")}`
      : "",
    homeUrl: siteBaseUrl,
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[2147483605] flex items-center justify-center overflow-y-auto border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800/55 p-3 backdrop-blur-md sm:p-6"
      dir={dir}
      data-testid="page-settings-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${t("studio.pageSettings.title")} (${page.title || t("studio.page")})`}
        data-testid="page-settings-modal"
        className="relative my-auto flex h-[min(780px,calc(100vh-24px))] w-full max-w-[900px] flex-col overflow-hidden rounded-[32px] border border-white/80 bg-white shadow-[0_32px_120px_rgba(15,23,42,0.28)] sm:h-[min(780px,calc(100vh-48px))]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.14),transparent_55%),radial-gradient(circle_at_top_left,rgba(14,165,233,0.12),transparent_52%)]" />

        <header className="relative flex shrink-0 items-start justify-between border-b border-slate-100/80 bg-white/80 px-5 py-5 backdrop-blur-sm sm:px-7 sm:py-6">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-300/40 ring-2 ring-white">
              <Globe className="h-6 w-6" />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-wider text-blue-600">
                {t("studio.pageSettings.title")}
              </p>
              <h2 className="mt-0.5 truncate text-xl font-black tracking-tight text-slate-800 sm:text-2xl">
{page.title || t("studio.page")}
              </h2>
              <p className="mt-1 truncate text-xs font-semibold text-slate-400">
                {tab === "settings"
                  ? t("studio.pageSettings.subtitleNameUrl")
                  : tab === "site"
                    ? t("studio.pageSettings.subtitleSite")
                    : tab === "seo"
                    ? t("studio.pageSettings.subtitleSeo")
                    : tab === "advanced"
                      ? t("studio.pageSettings.subtitleAdvanced")
                      : t("studio.pageSettings.subtitleSocial")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={requestClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
            aria-label={t("studio.pageSettings.close")}
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="relative shrink-0 border-b border-slate-100/80 bg-slate-50/40">
          <SeoTabBar<PageSettingsModalTab> tabs={tabs} active={tab} onChange={setTab} />
        </div>

        <div className="relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain bg-gradient-to-b from-slate-50/30 to-white px-5 py-5 text-right sm:px-7 sm:py-6">
          {tab !== "settings" ? (
            <SeoSmartBanner onApply={applySmartSeo} hint={smartHint || undefined} />
          ) : null}

          {tab !== "settings" ? (
            <div className="mb-5">
              <SeoScoreCard score={seoScore.score} items={seoScore.items} />
            </div>
          ) : null}

          {(tab === "seo" || tab === "social") && previewMeta ? (
            <div className="mb-6">
              {tab === "seo" ? (
                <GooglePreviewCard
                  title={
                    truncateForPreview(previewMeta.titleTag, 70) || t("studio.pageSettings.pageTitleFallback")
                  }
                  url={previewUrl}
                  description={
                    truncateForPreview(previewMeta.metaDescription, 160) ||
                    t("studio.pageSettings.searchMayDiffer")
                  }
                />
              ) : (
                <SocialPreviewCard
                  title={truncateForPreview(previewMeta.social.ogTitle, 80)}
                  description={truncateForPreview(
                    previewMeta.social.ogDescription,
                    160,
                  )}
                  imageUrl={previewMeta.social.ogImage}
                  domain={previewUrl.replace(/^https?:\/\//, "")}
                />
              )}
            </div>
          ) : null}

          {tab === "settings" ? (
            <SeoSection
              icon={<Settings2 className="h-5 w-5" />}
              title={t("studio.pageSettings.pageDetails")}
              subtitle={t("studio.pageSettings.pageDetailsHint")}
            >
              <label className="block space-y-2">
                <span className="text-sm font-black text-slate-800">{t("studio.pageSettings.pageName")}</span>
                <input
                  name="title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className={seoFieldClass}
                  placeholder={t("studio.pageSettings.pageNamePlaceholder")}
                />
              </label>

              {!page.isHome ? (
                <label className="block space-y-2">
                  <span className="text-sm font-black text-slate-800">
                    {t("studio.pageSettings.urlSlug")}
                  </span>
                  <div className="flex items-center gap-2 rounded-2xl border border-slate-200/90 bg-slate-50/80 px-3">
                    <span className="text-sm font-bold text-slate-400">/</span>
                    <input
                      name="slug"
                      value={slug}
                      onChange={(event) => setSlug(event.target.value)}
                      className="h-11 min-w-0 flex-1 border-0 bg-transparent px-1 text-left text-sm font-semibold text-slate-900 outline-none"
                      placeholder="services"
                      dir="ltr"
                    />
                  </div>
                </label>
              ) : null}
            </SeoSection>
          ) : null}

          {tab === "site" ? (
            <div className="space-y-5">
              <SeoHelpNote>
                {t("studio.pageSettings.siteWideNote")}
              </SeoHelpNote>

              <SeoSection
                icon={<Building2 className="h-5 w-5" />}
                title={t("studio.pageSettings.siteIdentity")}
                subtitle={t("studio.pageSettings.siteIdentityHint")}
              >
                <SeoImageUploader
                  label={t("studio.pageSettings.favicon")}
                  hint={t("studio.pageSettings.faviconHint")}
                  value={siteBrandDraft.faviconUrl || ""}
                  onChange={(url) =>
                    setSiteBrandDraft((current) => ({ ...current, faviconUrl: url }))
                  }
                  businessId={businessId}
                  previewAspect="square"
                />

                <SeoImageUploader
                  label={t("studio.pageSettings.businessLogo")}
                  hint={t("studio.pageSettings.businessLogoHint")}
                  value={siteBrandDraft.logoUrl || ""}
                  onChange={(url) =>
                    setSiteBrandDraft((current) => ({ ...current, logoUrl: url }))
                  }
                  businessId={businessId}
                  previewAspect="square"
                />
              </SeoSection>

              <SeoSection
                icon={<Share2 className="h-5 w-5" />}
                title={t("studio.pageSettings.defaultShare")}
                subtitle={t("studio.pageSettings.defaultShareHint")}
              >
                <SeoImageUploader
                  label={t("studio.pageSettings.defaultShareImage")}
                  hint={t("studio.pageSettings.defaultShareImageHint")}
                  value={siteSeoDraft.defaultOgImage || siteSeoDraft.ogImage || ""}
                  onChange={(url) =>
                    setSiteSeoDraft((current) => ({
                      ...current,
                      defaultOgImage: url,
                      ogImage: url,
                    }))
                  }
                  businessId={businessId}
                  previewAspect="social"
                />
              </SeoSection>
            </div>
          ) : null}

          {tab === "seo" ? (
            <div className="space-y-5">
              <SeoSection
                icon={<Search className="h-5 w-5" />}
                title={t("studio.pageSettings.structureAddress")}
                subtitle={t("studio.pageSettings.structureAddressHint")}
              >
                <label className="block space-y-2">
                  <span className="text-sm font-black text-slate-800">
                    {t("studio.pageSettings.parentPage")}
                  </span>
                  <select
                    value={seoDraft.parentPageId || ""}
                    onChange={(event) =>
                      updateSeo({ parentPageId: event.target.value })
                    }
                    className={seoFieldClass}
                  >
                    <option value="">{t("studio.pageSettings.homePageOption")}</option>
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
                      {t("studio.pageSettings.urlSlug")}
                    </span>
                    <div className="flex items-center gap-2 rounded-2xl border border-slate-200/90 bg-slate-50/80 px-3">
                      <span className="text-sm font-bold text-slate-400">/</span>
                      <input
                        value={slug}
                        onChange={(event) => setSlug(event.target.value)}
                        className="h-11 min-w-0 flex-1 border-0 bg-transparent px-1 text-left text-sm font-semibold text-slate-900 outline-none"
                        dir="ltr"
                      />
                    </div>
                  </label>
                ) : null}
              </SeoSection>

              <SeoSection
                icon={<Sparkles className="h-5 w-5" />}
                title={t("studio.pageSettings.seoContent")}
                subtitle={t("studio.pageSettings.seoContentHint")}
              >
                <label className="block space-y-2">
                  <SeoFieldLabel
                    label={t("studio.pageSettings.titleTag")}
                    actions={
                      <>
                        <SeoExampleButton onClick={() => fillExample("titleTag")} />
                        <SeoLengthHint
                          value={seoDraft.titleTag || previewMeta?.titleTag || ""}
                          idealMax={60}
                          hardMax={70}
                        />
                      </>
                    }
                  />
                  <input
                    value={seoDraft.titleTag || ""}
                    onChange={(event) =>
                      updateSeo({ titleTag: event.target.value })
                    }
                    className={seoFieldClass}
                    placeholder={previewMeta?.titleTag || t("studio.pageSettings.titlePlaceholder")}
                  />
                </label>

                <label className="block space-y-2">
                  <SeoFieldLabel
                    label={t("studio.pageSettings.metaDescription")}
                    actions={
                      <>
                        <SeoExampleButton
                          onClick={() => fillExample("metaDescription")}
                        />
                        <SeoLengthHint
                          value={seoDraft.metaDescription || ""}
                          idealMax={160}
                          hardMax={320}
                        />
                      </>
                    }
                  />
                  <textarea
                    value={seoDraft.metaDescription || ""}
                    onChange={(event) =>
                      updateSeo({ metaDescription: event.target.value })
                    }
                    className={seoTextareaClass}
                    placeholder={t("studio.pageSettings.metaDescriptionPlaceholder")}
                  />
                </label>
              </SeoSection>

              <SeoSection
                icon={<Globe className="h-5 w-5" />}
                title={t("studio.pageSettings.googleIndex")}
                subtitle={t("studio.pageSettings.googleIndexHint")}
              >
                <SeoToggle
                  checked={pageIndexingEnabled}
                  onChange={() => updateSeo({ indexable: !pageIndexingEnabled })}
                  label={t("studio.pageSettings.allowIndex")}
                  description={t("studio.pageSettings.allowIndexHint")}
                />

                {siteSeo.siteIndexingEnabled === false ? (
                  <p className="rounded-xl border border-amber-200/80 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700">
                    {t("studio.pageSettings.siteIndexOff")}
                  </p>
                ) : null}
              </SeoSection>

              <SeoSection
                icon={<Globe className="h-5 w-5" />}
                title={t("studio.pageSettings.googleCheck")}
                subtitle={t("studio.pageSettings.googleCheckHint")}
              >
                <SeoStatusPill tone={pageIndexingEnabled ? "success" : "danger"}>
                  {pageIndexingEnabled
                    ? t("studio.pageSettings.openToIndex")
                    : t("studio.pageSettings.blockedFromIndex")}
                </SeoStatusPill>

                <div className="grid gap-2 sm:grid-cols-2">
                  <SeoActionLink
                    href={`https://search.google.com/test/rich-results?url=${encodeURIComponent(
                      previewUrl,
                    )}`}
                    icon={<Search className="h-4 w-4" />}
                  >
                    {t("studio.pageSettings.googlePreviewCheck")}
                  </SeoActionLink>
                  <SeoActionLink
                    href={`https://www.google.com/search?q=${encodeURIComponent(
                      `site:${(publicUrl || buildPublicSiteUrl(siteSlug)).replace(
                        /^https?:\/\//,
                        "",
                      )}`,
                    )}`}
                    icon={<Globe className="h-4 w-4" />}
                  >
                    {t("studio.pageSettings.alreadyOnGoogle")}
                  </SeoActionLink>
                  <SeoActionLink
                    href={`${siteBaseUrl}/sitemap.xml`}
                    icon={<ExternalLink className="h-4 w-4" />}
                  >
                    {t("studio.pageSettings.sitemap")}
                  </SeoActionLink>
                  <SeoActionLink
                    href="https://search.google.com/search-console"
                    icon={<ExternalLink className="h-4 w-4" />}
                  >
                    {t("studio.pageSettings.openGsc")}
                  </SeoActionLink>
                </div>

                <p className="text-[11px] font-semibold leading-5 text-slate-500">
                  {t("studio.pageSettings.verifyInAdvanced")}
                </p>
              </SeoSection>
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
                    {t("studio.pageSettings.advancedOptionalTitle")}
                  </p>
                  <p className="mt-1 text-xs font-semibold leading-5 text-slate-600">
                    {t("studio.pageSettings.advancedOptionalText")}
                  </p>
                </div>
              </div>

              <SeoAdvancedSection
                icon={<Braces className="h-5 w-5" />}
                title={t("studio.pageSettings.schemaTitle")}
                description={t("studio.pageSettings.schemaDescription")}
                badge={{ label: t("studio.pageSettings.recommended"), tone: "recommended" }}
                defaultOpen
              >
                <SeoHelpNote>
                  {t("studio.pageSettings.schemaHelp")}
                </SeoHelpNote>

                <SchemaBuilder
                  entries={seoDraft.structuredData || []}
                  context={schemaBuilderContext}
                  onChange={(next) => updateSeo({ structuredData: next })}
                />
              </SeoAdvancedSection>

              <SeoAdvancedSection
                icon={<Bot className="h-5 w-5" />}
                title={t("studio.pageSettings.robotsTitle")}
                description={t("studio.pageSettings.robotsDescription")}
                badge={{ label: t("studio.pageSettings.optional"), tone: "optional" }}
              >
                <SeoHelpNote>
                  {t("studio.pageSettings.robotsHelp")}
                </SeoHelpNote>

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
                            {t(option.hintKey)}
                          </span>
                          <span className="block font-mono text-[11px] font-semibold text-slate-400">
                            {option.value}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                <details className="group/adv rounded-2xl border border-slate-200 bg-white [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer list-none items-center gap-1.5 px-3.5 py-3 text-xs font-black text-slate-600">
                    <ChevronDown className="h-4 w-4 transition group-open/adv:rotate-180" />
                    {t("studio.pageSettings.moreDisplayOptions")}
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
                        <option value="">{t("studio.pageSettings.defaultOption")}</option>
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
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-right text-sm font-bold text-slate-800 outline-none focus:border-blue-400"
                        placeholder="-1"
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
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-right text-sm font-bold text-slate-800 outline-none focus:border-blue-400"
                        placeholder="-1"
                      />
                    </label>
                  </div>
                  <p className="px-3.5 pb-3 text-[11px] font-semibold text-slate-500">
                    {t("studio.pageSettings.emptyDefaultNoLimit")}
                  </p>
                </details>

                <div className="rounded-md border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 px-4 py-3">
                  <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">
                    {t("studio.pageSettings.robotsTagPreview")}
                  </p>
                  <code
                    className="mt-1 block break-all font-mono text-xs text-emerald-300"
                    dir="ltr"
                  >
                    &lt;meta name="robots" content="{robotsPreview}"&gt;
                  </code>
                </div>
              </SeoAdvancedSection>

              <SeoAdvancedSection
                icon={<Globe className="h-5 w-5" />}
                title={t("studio.pageSettings.canonicalTitle")}
                description={t("studio.pageSettings.canonicalDescription")}
                badge={{ label: t("studio.pageSettings.optional"), tone: "optional" }}
              >
                <SeoHelpNote>
                  {t("studio.pageSettings.canonicalHelp")}
                </SeoHelpNote>
                <label className="block space-y-2">
                  <span className="text-sm font-black text-slate-800">
                    Canonical URL
                  </span>
                  <input
                    value={seoDraft.canonicalUrl || ""}
                    onChange={(event) =>
                      updateSeo({ canonicalUrl: event.target.value })
                    }
                    className={seoFieldClass}
                    placeholder={previewUrl}
                    dir="ltr"
                  />
                  {canonicalUrlError ? (
                    <p className="text-xs font-semibold text-rose-600">
                      {canonicalUrlError}
                    </p>
                  ) : null}
                </label>

                <label className="block space-y-2">
                  <SeoFieldLabel
                    label={t("studio.pageSettings.keywords")}
                    actions={
                      <SeoExampleButton onClick={() => fillExample("keywords")} />
                    }
                  />
                  <input
                    value={seoDraft.keywords || ""}
                    onChange={(event) =>
                      updateSeo({ keywords: event.target.value })
                    }
                    className={seoFieldClass}
                    placeholder={t("studio.pageSettings.keywordsPlaceholder")}
                  />
                </label>
              </SeoAdvancedSection>

              <SeoAdvancedSection
                icon={<Tags className="h-5 w-5" />}
                title={t("studio.pageSettings.gscTitle")}
                description={t("studio.pageSettings.gscDescription")}
                badge={
                  verificationCode || hasGscHtmlReady
                    ? { label: t("studio.pageSettings.readyToVerify"), tone: "recommended" }
                    : { label: t("studio.pageSettings.recommended"), tone: "recommended" }
                }
                defaultOpen
              >
                <GscVerificationWizard
                  siteBaseUrl={siteBaseUrl}
                  publicUrlIsPlaceholder={publicUrlIsPlaceholder}
                  siteSeoDraft={siteSeoDraft}
                  setSiteSeoDraft={setSiteSeoDraft}
                  fieldClass={seoFieldClass}
                  textareaClass={seoTextareaClass}
                />

                <details className="group/meta rounded-2xl border border-slate-200 bg-white [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer list-none items-center gap-1.5 px-3.5 py-3 text-xs font-black text-slate-600">
                    <ChevronDown className="h-4 w-4 transition group-open/meta:rotate-180" />
                    {t("studio.pageSettings.extraMetaTitle")}
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
                            className="h-10 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-right text-sm font-semibold text-slate-900 outline-none focus:border-blue-400"
                            placeholder={t("studio.pageSettings.tagValuePlaceholder")}
                          />
                          <button
                            type="button"
                            onClick={() => removeCustomMetaTag(meta.id)}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-rose-500 transition hover:bg-rose-50"
                            aria-label={t("studio.pageSettings.deleteTag")}
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
<Plus className="h-4 w-4" /> {t("studio.pageSettings.newTag")}
                      </button>
                    </div>
                  </div>
                </details>
              </SeoAdvancedSection>

              <SeoAdvancedSection
                icon={<Languages className="h-5 w-5" />}
                title={t("studio.pageSettings.hreflangTitle")}
                description={t("studio.pageSettings.hreflangDescription")}
                badge={{ label: t("studio.pageSettings.optional"), tone: "optional" }}
              >
                <SeoHelpNote>
                  {t("studio.pageSettings.hreflangHelp")}
                </SeoHelpNote>
                {(seoDraft.hreflang || []).length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-4 text-center text-xs font-semibold text-slate-400">
                    {t("studio.pageSettings.noExtraLanguages")}
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
                      aria-label={t("studio.pageSettings.deleteLanguage")}
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
<Plus className="h-4 w-4" /> {t("studio.pageSettings.addLanguage")}
                </button>
              </SeoAdvancedSection>
            </div>
          ) : null}

          {tab === "social" ? (
            <SeoSection
              icon={<Share2 className="h-5 w-5" />}
              title={t("studio.pageSettings.socialTitle")}
              subtitle={t("studio.pageSettings.socialSubtitle")}
            >
              <label className="block space-y-2">
                <span className="text-sm font-black text-slate-800">
                  {t("studio.pageSettings.shareTitle")}
                </span>
                <input
                  value={seoDraft.social?.ogTitle || ""}
                  onChange={(event) =>
                    updateSocial({ ogTitle: event.target.value })
                  }
                  className={seoFieldClass}
                  placeholder={previewMeta?.titleTag || ""}
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-black text-slate-800">
                  {t("studio.pageSettings.shareDescription")}
                </span>
                <textarea
                  value={seoDraft.social?.ogDescription || ""}
                  onChange={(event) =>
                    updateSocial({ ogDescription: event.target.value })
                  }
                  className={seoTextareaClass}
                  placeholder={previewMeta?.metaDescription || ""}
                />
              </label>

              <SeoImageUploader
                label={t("studio.pageSettings.shareImage")}
                hint={t("studio.pageSettings.shareImageHint")}
                value={seoDraft.social?.ogImage || ""}
                onChange={(url) => updateSocial({ ogImage: url })}
                businessId={businessId}
                previewAspect="social"
              />
            </SeoSection>
          ) : null}
        </div>

        <footer className="relative flex shrink-0 flex-col gap-2 border-t border-slate-100/80 bg-white/90 px-5 py-4 backdrop-blur-sm sm:px-7">
          {saveError ? (
            <p className="text-xs font-semibold text-rose-600">{saveError}</p>
          ) : null}
          <div className="flex items-center justify-between gap-3">
            <p className="hidden text-xs font-semibold text-slate-400 sm:block">
              {tab !== "settings"
                ? t("studio.pageSettings.seoScoreSaving", { score: seoScore.score })
                : t("studio.pageSettings.savingUpdatesServer")}
            </p>
            <div className="flex w-full items-center justify-end gap-3 sm:w-auto">
              <button
                type="button"
                onClick={requestClose}
                className="rounded-2xl border border-slate-200/90 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                {t("studio.cancel")}
              </button>
              <button
                type="button"
                data-testid="page-settings-save"
                onClick={() => {
                  void handleSave();
                }}
                disabled={isSaving || Boolean(canonicalUrlError)}
                className="rounded-2xl bg-gradient-to-l from-blue-600 to-sky-500 px-6 py-3 text-sm font-black text-black shadow-md shadow-blue-200/50 transition hover:from-blue-700 hover:to-sky-600 disabled:opacity-50"
              >
{isSaving ? t("studio.saving") : t("studio.save")}
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>,
    document.body,
  );
}
