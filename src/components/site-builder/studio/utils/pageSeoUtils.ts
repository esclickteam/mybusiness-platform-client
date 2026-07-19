import type {
  ResolvedPageSeoMeta,
  SeoCustomMetaTag,
  SeoHreflangEntry,
  SeoMaxImagePreview,
  SeoRobotsDirective,
  SeoStructuredDataEntry,
  SitePageSeoSettings,
  SiteSeoSettings,
  StudioSitePage,
} from "../types";

const ROBOTS_DIRECTIVES: SeoRobotsDirective[] = [
  "nofollow",
  "noarchive",
  "nosnippet",
  "noimageindex",
  "notranslate",
];

const MAX_IMAGE_PREVIEW_VALUES: SeoMaxImagePreview[] = [
  "",
  "none",
  "standard",
  "large",
];

let seoIdCounter = 0;

export function createSeoId(prefix = "seo") {
  seoIdCounter += 1;
  return `${prefix}_${Date.now().toString(36)}_${seoIdCounter.toString(36)}`;
}

const PUBLIC_SITE_DOMAIN =
  import.meta.env.VITE_BIZUPLY_PUBLIC_SITE_DOMAIN || "sites.bizuply.com";

function safeString(value: unknown) {
  return String(value ?? "").trim();
}

function asPlainObject(value: unknown): Record<string, any> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value as Record<string, any>;
}

export function buildPublicSiteUrl(slug: string) {
  const cleanSlug = safeString(slug).toLowerCase().replace(/[^a-z0-9-]/g, "-");
  if (!cleanSlug) return "";
  return `https://${cleanSlug}.${PUBLIC_SITE_DOMAIN}`;
}

export function buildPagePath(page?: Pick<StudioSitePage, "slug" | "id" | "isHome"> | null) {
  if (!page) return "/";
  if (page.isHome) return "/";

  const slug = safeString(page.slug || page.id).replace(/^\/+|\/+$/g, "");
  return slug ? `/${slug}` : "/";
}

export function applyTitleTemplate(
  template: string,
  pageTitle: string,
  siteName: string,
) {
  const cleanTemplate = safeString(template) || "%page% | %site%";
  const page = safeString(pageTitle) || "עמוד";
  const site = safeString(siteName) || "האתר שלי";

  return cleanTemplate
    .replace(/%page%/g, page)
    .replace(/%site%/g, site)
    .replace(/\s+\|\s+$/g, "")
    .trim();
}

function normalizeRobotsDirectives(value: unknown): SeoRobotsDirective[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<SeoRobotsDirective>();
  value.forEach((entry) => {
    const clean = safeString(entry).toLowerCase() as SeoRobotsDirective;
    if (ROBOTS_DIRECTIVES.includes(clean)) seen.add(clean);
  });
  return ROBOTS_DIRECTIVES.filter((directive) => seen.has(directive));
}

function normalizeIntOrNull(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  if (!Number.isFinite(num)) return null;
  return Math.trunc(num);
}

function normalizeMaxImagePreview(value: unknown): SeoMaxImagePreview {
  const clean = safeString(value).toLowerCase() as SeoMaxImagePreview;
  return MAX_IMAGE_PREVIEW_VALUES.includes(clean) ? clean : "";
}

function normalizeStructuredData(value: unknown): SeoStructuredDataEntry[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => {
      const source = asPlainObject(entry);
      const json = safeString(source.json);
      if (!json) return null;
      return {
        id: safeString(source.id) || createSeoId("ld"),
        name: safeString(source.name),
        json,
      } as SeoStructuredDataEntry;
    })
    .filter(Boolean) as SeoStructuredDataEntry[];
}

function normalizeCustomMetaTags(value: unknown): SeoCustomMetaTag[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => {
      const source = asPlainObject(entry);
      const key = safeString(source.key);
      if (!key) return null;
      const attr = safeString(source.attr).toLowerCase() === "property"
        ? "property"
        : "name";
      return {
        id: safeString(source.id) || createSeoId("meta"),
        attr,
        key,
        content: safeString(source.content),
      } as SeoCustomMetaTag;
    })
    .filter(Boolean) as SeoCustomMetaTag[];
}

function normalizeHreflang(value: unknown): SeoHreflangEntry[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => {
      const source = asPlainObject(entry);
      const lang = safeString(source.lang);
      const href = safeString(source.href);
      if (!lang || !href) return null;
      return {
        id: safeString(source.id) || createSeoId("hl"),
        lang,
        href,
      } as SeoHreflangEntry;
    })
    .filter(Boolean) as SeoHreflangEntry[];
}

export function normalizePageSeo(rawSeo?: SitePageSeoSettings | null): SitePageSeoSettings {
  const source = asPlainObject(rawSeo);
  const social = asPlainObject(source.social);

  return {
    titleTag: safeString(source.titleTag),
    metaDescription: safeString(source.metaDescription),
    parentPageId: safeString(source.parentPageId),
    indexable: source.indexable !== false,
    canonicalUrl: safeString(source.canonicalUrl),
    keywords: safeString(source.keywords),
    robotsDirectives: normalizeRobotsDirectives(source.robotsDirectives),
    maxSnippet: normalizeIntOrNull(source.maxSnippet),
    maxImagePreview: normalizeMaxImagePreview(source.maxImagePreview),
    maxVideoPreview: normalizeIntOrNull(source.maxVideoPreview),
    structuredData: normalizeStructuredData(source.structuredData),
    customMetaTags: normalizeCustomMetaTags(source.customMetaTags),
    hreflang: normalizeHreflang(source.hreflang),
    social: {
      ogTitle: safeString(social.ogTitle),
      ogDescription: safeString(social.ogDescription),
      ogImage: safeString(social.ogImage),
      twitterCard: safeString(social.twitterCard) || "summary_large_image",
    },
  };
}

export function buildRobotsContent(input: {
  indexable: boolean;
  directives?: SeoRobotsDirective[];
  maxSnippet?: number | null;
  maxImagePreview?: SeoMaxImagePreview;
  maxVideoPreview?: number | null;
}): string {
  const directives = normalizeRobotsDirectives(input.directives);
  const parts: string[] = [];

  parts.push(input.indexable ? "index" : "noindex");
  parts.push(directives.includes("nofollow") ? "nofollow" : "follow");

  directives.forEach((directive) => {
    if (directive === "nofollow") return;
    parts.push(directive);
  });

  const maxSnippet = normalizeIntOrNull(input.maxSnippet);
  if (maxSnippet !== null) parts.push(`max-snippet:${maxSnippet}`);

  const maxImagePreview = normalizeMaxImagePreview(input.maxImagePreview);
  if (maxImagePreview) parts.push(`max-image-preview:${maxImagePreview}`);

  const maxVideoPreview = normalizeIntOrNull(input.maxVideoPreview);
  if (maxVideoPreview !== null) parts.push(`max-video-preview:${maxVideoPreview}`);

  return parts.join(", ");
}

export function validateJsonLd(value: string): { valid: boolean; error: string } {
  const clean = safeString(value);
  if (!clean) return { valid: false, error: "" };
  try {
    JSON.parse(clean);
    return { valid: true, error: "" };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : "JSON לא תקין",
    };
  }
}

export function normalizeSiteSeoSettings(
  rawSettings?: SiteSeoSettings | null,
): SiteSeoSettings {
  const source = asPlainObject(rawSettings);

  return {
    title: safeString(source.title),
    description: safeString(source.description),
    keywords: safeString(source.keywords),
    ogImage: safeString(source.ogImage || source.defaultOgImage),
    siteIndexingEnabled: source.siteIndexingEnabled !== false,
    defaultTitleTemplate:
      safeString(source.defaultTitleTemplate) || "%page% | %site%",
    defaultOgImage: safeString(source.defaultOgImage || source.ogImage),
  };
}

export function resolvePageSeoMeta(input: {
  page?: Pick<StudioSitePage, "title" | "slug" | "id" | "isHome" | "seo"> | null;
  siteName?: string;
  siteSlug?: string;
  publicUrl?: string;
  seoSettings?: SiteSeoSettings | null;
}): ResolvedPageSeoMeta {
  const page = input.page || null;
  const siteSeoSettings = normalizeSiteSeoSettings(input.seoSettings);
  const pageSeo = normalizePageSeo(page?.seo);
  const siteName =
    safeString(input.siteName) ||
    safeString(siteSeoSettings.title) ||
    "האתר שלי";
  const pageTitle = safeString(page?.title) || "עמוד";
  const pagePath = buildPagePath(page);
  const baseUrl =
    safeString(input.publicUrl) || buildPublicSiteUrl(safeString(input.siteSlug));
  const absoluteUrl = baseUrl
    ? `${baseUrl.replace(/\/+$/, "")}${pagePath === "/" ? "" : pagePath}`
    : pagePath;

  const titleTag =
    pageSeo.titleTag ||
    applyTitleTemplate(
      siteSeoSettings.defaultTitleTemplate || "%page% | %site%",
      pageTitle,
      siteName,
    );

  const metaDescription =
    pageSeo.metaDescription || siteSeoSettings.description || "";

  const ogTitle = pageSeo.social?.ogTitle || titleTag;
  const ogDescription = pageSeo.social?.ogDescription || metaDescription;
  const ogImage =
    pageSeo.social?.ogImage ||
    siteSeoSettings.defaultOgImage ||
    siteSeoSettings.ogImage ||
    "";

  const indexable =
    siteSeoSettings.siteIndexingEnabled !== false && pageSeo.indexable !== false;

  const robotsDirectives = pageSeo.robotsDirectives || [];
  const robots = buildRobotsContent({
    indexable,
    directives: robotsDirectives,
    maxSnippet: pageSeo.maxSnippet ?? null,
    maxImagePreview: pageSeo.maxImagePreview || "",
    maxVideoPreview: pageSeo.maxVideoPreview ?? null,
  });

  return {
    titleTag,
    metaDescription,
    keywords: pageSeo.keywords || siteSeoSettings.keywords || "",
    canonicalUrl: pageSeo.canonicalUrl || absoluteUrl,
    pagePath,
    absoluteUrl,
    indexable,
    robots,
    robotsDirectives,
    maxSnippet: pageSeo.maxSnippet ?? null,
    maxImagePreview: pageSeo.maxImagePreview || "",
    maxVideoPreview: pageSeo.maxVideoPreview ?? null,
    structuredData: pageSeo.structuredData || [],
    customMetaTags: pageSeo.customMetaTags || [],
    hreflang: pageSeo.hreflang || [],
    social: {
      ogTitle,
      ogDescription,
      ogImage,
      twitterCard: pageSeo.social?.twitterCard || "summary_large_image",
    },
    parentPageId: pageSeo.parentPageId || "",
    siteIndexingEnabled: siteSeoSettings.siteIndexingEnabled !== false,
  };
}

export type StructuredDataPreset = {
  id: string;
  label: string;
  description: string;
  build: (ctx: { siteName: string; pageTitle: string; url: string }) => string;
};

function jsonld(value: Record<string, any>) {
  return JSON.stringify(value, null, 2);
}

export const STRUCTURED_DATA_PRESETS: StructuredDataPreset[] = [
  {
    id: "Organization",
    label: "ארגון / עסק (Organization)",
    description: "פרטי העסק, לוגו וקישורים לרשתות.",
    build: ({ siteName, url }) =>
      jsonld({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: siteName,
        url,
        logo: "",
        sameAs: [],
      }),
  },
  {
    id: "LocalBusiness",
    label: "עסק מקומי (LocalBusiness)",
    description: "כתובת, טלפון ושעות פעילות — מצוין ל‑Local SEO.",
    build: ({ siteName, url }) =>
      jsonld({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: siteName,
        url,
        telephone: "",
        address: {
          "@type": "PostalAddress",
          streetAddress: "",
          addressLocality: "",
          addressCountry: "IL",
        },
        openingHours: [],
      }),
  },
  {
    id: "Service",
    label: "שירות (Service)",
    description: "תיאור שירות שהעסק מספק.",
    build: ({ siteName, pageTitle }) =>
      jsonld({
        "@context": "https://schema.org",
        "@type": "Service",
        name: pageTitle,
        provider: { "@type": "Organization", name: siteName },
        areaServed: "IL",
        description: "",
      }),
  },
  {
    id: "Product",
    label: "מוצר (Product)",
    description: "מוצר עם מחיר ודירוג — מפעיל תוצאות עשירות.",
    build: ({ pageTitle }) =>
      jsonld({
        "@context": "https://schema.org",
        "@type": "Product",
        name: pageTitle,
        image: [],
        description: "",
        offers: {
          "@type": "Offer",
          priceCurrency: "ILS",
          price: "",
          availability: "https://schema.org/InStock",
        },
      }),
  },
  {
    id: "FAQPage",
    label: "שאלות ותשובות (FAQPage)",
    description: "בלוק שו״ת שיכול להופיע ישירות בגוגל.",
    build: () =>
      jsonld({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "שאלה לדוגמה?",
            acceptedAnswer: { "@type": "Answer", text: "תשובה לדוגמה." },
          },
        ],
      }),
  },
  {
    id: "BreadcrumbList",
    label: "פירורי לחם (BreadcrumbList)",
    description: "היררכיית ניווט שמופיעה בתוצאות החיפוש.",
    build: ({ siteName, pageTitle, url }) =>
      jsonld({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: siteName, item: "" },
          { "@type": "ListItem", position: 2, name: pageTitle, item: url },
        ],
      }),
  },
  {
    id: "Article",
    label: "מאמר / בלוג (Article)",
    description: "כתבה או פוסט בלוג עם מחבר ותאריך.",
    build: ({ siteName, pageTitle, url }) =>
      jsonld({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: pageTitle,
        author: { "@type": "Organization", name: siteName },
        publisher: { "@type": "Organization", name: siteName },
        mainEntityOfPage: url,
        datePublished: "",
      }),
  },
];

export function extractPlainTextFromHtml(html: string): string {
  const raw = safeString(html);
  if (!raw) return "";

  const withoutBlocks = raw
    .replace(/<(script|style|noscript|template)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ");

  const decoded = withoutBlocks
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");

  return decoded.replace(/\s+/g, " ").trim();
}

const STOP_WORDS = new Set([
  "של",
  "עם",
  "על",
  "אני",
  "אנחנו",
  "הוא",
  "היא",
  "זה",
  "זו",
  "את",
  "כל",
  "גם",
  "אבל",
  "או",
  "כי",
  "יש",
  "לא",
  "the",
  "and",
  "for",
  "with",
  "you",
  "your",
  "our",
  "are",
  "was",
  "this",
  "that",
  "from",
  "have",
]);

export function deriveKeywords(text: string, max = 6): string {
  const clean = safeString(text)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ");
  const counts = new Map<string, number>();

  clean
    .split(/\s+/)
    .filter((word) => word.length >= 3 && !STOP_WORDS.has(word))
    .forEach((word) => {
      counts.set(word, (counts.get(word) || 0) + 1);
    });

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, max)
    .map(([word]) => word)
    .join(", ");
}

export function deriveMetaDescription(text: string, max = 155): string {
  const clean = safeString(text);
  if (!clean) return "";
  if (clean.length <= max) return clean;

  const slice = clean.slice(0, max);
  const lastStop = Math.max(
    slice.lastIndexOf(". "),
    slice.lastIndexOf("! "),
    slice.lastIndexOf("? "),
    slice.lastIndexOf("। "),
  );
  if (lastStop > max * 0.6) return slice.slice(0, lastStop + 1).trim();

  const lastSpace = slice.lastIndexOf(" ");
  return `${slice.slice(0, lastSpace > 0 ? lastSpace : max).trim()}…`;
}

export function buildSmartPageSeo(input: {
  page?: Pick<StudioSitePage, "title" | "slug" | "id" | "isHome" | "seo"> | null;
  siteName?: string;
  siteSlug?: string;
  publicUrl?: string;
  seoSettings?: SiteSeoSettings | null;
  pageHtml?: string;
  overwrite?: boolean;
}): SitePageSeoSettings {
  const current = normalizePageSeo(input.page?.seo);
  const overwrite = input.overwrite !== false;
  const pick = (existing: string, generated: string) =>
    overwrite ? generated || existing : existing || generated;

  const meta = resolvePageSeoMeta({
    page: input.page,
    siteName: input.siteName,
    siteSlug: input.siteSlug,
    publicUrl: input.publicUrl,
    seoSettings: input.seoSettings,
  });

  const pageText = extractPlainTextFromHtml(input.pageHtml || "");
  const siteName = safeString(input.siteName) || "האתר שלי";
  const pageTitle = safeString(input.page?.title) || "עמוד";

  const generatedTitle = meta.titleTag;
  const generatedDescription =
    deriveMetaDescription(pageText) ||
    `${pageTitle} — ${siteName}. צרו קשר לפרטים נוספים.`;
  const generatedKeywords =
    deriveKeywords(`${pageTitle} ${siteName} ${pageText}`) ||
    [pageTitle, siteName].filter(Boolean).join(", ");

  const titleTag = pick(current.titleTag || "", generatedTitle);
  const metaDescription = pick(
    current.metaDescription || "",
    generatedDescription,
  );
  const keywords = pick(current.keywords || "", generatedKeywords);

  const social = {
    ogTitle: pick(current.social?.ogTitle || "", titleTag),
    ogDescription: pick(current.social?.ogDescription || "", metaDescription),
    ogImage:
      current.social?.ogImage ||
      normalizeSiteSeoSettings(input.seoSettings).ogImage ||
      "",
    twitterCard: current.social?.twitterCard || "summary_large_image",
  };

  const structuredData = [...(current.structuredData || [])];
  if (structuredData.length === 0) {
    const preset =
      STRUCTURED_DATA_PRESETS.find((item) => item.id === "LocalBusiness") ||
      STRUCTURED_DATA_PRESETS[0];
    if (preset) {
      structuredData.push({
        id: createSeoId("ld"),
        name: preset.id,
        json: preset.build({
          siteName,
          pageTitle,
          url: meta.absoluteUrl,
        }),
      });
    }
  }

  return normalizePageSeo({
    ...current,
    titleTag,
    metaDescription,
    keywords,
    social,
    structuredData,
  });
}

export function getSeoFieldLengthStatus(
  value: string,
  idealMax: number,
  hardMax: number,
) {
  const length = safeString(value).length;

  if (length === 0) return "empty" as const;
  if (length <= idealMax) return "good" as const;
  if (length <= hardMax) return "warn" as const;
  return "bad" as const;
}

export function truncateForPreview(value: string, max: number) {
  const clean = safeString(value);
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trim()}…`;
}
