import type {
  ResolvedPageSeoMeta,
  SitePageSeoSettings,
  SiteSeoSettings,
  StudioSitePage,
} from "../types";

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
    social: {
      ogTitle: safeString(social.ogTitle),
      ogDescription: safeString(social.ogDescription),
      ogImage: safeString(social.ogImage),
      twitterCard: safeString(social.twitterCard) || "summary_large_image",
    },
  };
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

  return {
    titleTag,
    metaDescription,
    keywords: pageSeo.keywords || siteSeoSettings.keywords || "",
    canonicalUrl: pageSeo.canonicalUrl || absoluteUrl,
    pagePath,
    absoluteUrl,
    indexable,
    robots: indexable ? "index, follow" : "noindex, nofollow",
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
