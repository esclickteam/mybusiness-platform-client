export type GalleryFilter = "all" | "studio" | "style" | "property" | "business";

export type GallerySite = {
  key: string;
  name: string;
  filter: Exclude<GalleryFilter, "all">;
  heCategory: string;
  enCategory: string;
  heText: string;
  enText: string;
};

/** Real studio templates. Images are crops of public/template-screenshots. */
export const GALLERY_SITES: readonly GallerySite[] = [
  {
    key: "virello",
    name: "Virello",
    filter: "studio",
    heCategory: "סוכנות",
    enCategory: "Agency",
    heText: "סטודיו דיגיטלי עם טיפוגרפיה גדולה ותמונות שצפות על העמוד.",
    enText: "A digital studio with large type and images that float across the page.",
  },
  {
    key: "novastra",
    name: "Novastra",
    filter: "style",
    heCategory: "אופנה",
    enCategory: "Fashion",
    heText: "חנות אופנה עם פתיח עריכתי, קולקציות ומוצרים שנראים כמו מגזין.",
    enText: "A fashion shop with an editorial opening, collections and magazine-like products.",
  },
  {
    key: "adion",
    name: "Adion",
    filter: "studio",
    heCategory: "תיק עבודות",
    enCategory: "Portfolio",
    heText: "תיק עבודות קולנועי לצלמים ולסטודיו שרוצים נוכחות חזקה.",
    enText: "A cinematic portfolio for photographers and studios that want a strong presence.",
  },
  {
    key: "nadlanist",
    name: "Nadlanist",
    filter: "property",
    heCategory: "נדל״ן",
    enCategory: "Real estate",
    heText: "ייעוץ נדל״ן יוקרתי עם נכסים גדולים, בלי מחירון פומבי.",
    enText: "A luxury real-estate practice with large properties and no public price list.",
  },
  {
    key: "lashora",
    name: "Lashora",
    filter: "style",
    heCategory: "יופי",
    enCategory: "Beauty",
    heText: "סטודיו לריסים ולגבות, עם טיפולים, צוות וקביעת תור.",
    enText: "A lash and brow studio with treatments, a team and appointment booking.",
  },
  {
    key: "florique",
    name: "Florique",
    filter: "style",
    heCategory: "דף נחיתה",
    enCategory: "Landing page",
    heText: "דף נחיתה פרחוני עם תנועה רכה וקריאה ברורה לפעולה.",
    enText: "A floral landing page with soft motion and a clear call to action.",
  },
  {
    key: "wantravel",
    name: "Wantravel",
    filter: "business",
    heCategory: "עסקים",
    enCategory: "Business",
    heText: "סוכנות נסיעות עם יעדים גדולים, חבילות וטופס יצירת קשר.",
    enText: "A travel agency with large destinations, packages and a contact form.",
  },
  {
    key: "servora",
    name: "Servora",
    filter: "business",
    heCategory: "שירותים",
    enCategory: "Services",
    heText: "שירות לבית, מהנדימן ועד שיפוץ, עם פנייה ישירה וברורה.",
    enText: "Home services, from handyman to renovation, with a direct enquiry.",
  },
];

export const GALLERY_FILTERS: readonly GalleryFilter[] = ["all", "studio", "style", "property", "business"];

export function sitesForFilter(filter: GalleryFilter): GallerySite[] {
  if (filter === "all") return [...GALLERY_SITES];
  return GALLERY_SITES.filter((site) => site.filter === filter);
}

export function selectedAfterFilter(currentKey: string, filter: GalleryFilter): string {
  const sites = sitesForFilter(filter);
  if (sites.some((site) => site.key === currentKey)) return currentKey;
  return sites[0]?.key || GALLERY_SITES[0].key;
}

/** Public render of the real studio template. Card embeds stay clipped; this opens the full page. */
export function galleryDemoPath(key: string, language: string): string {
  const lang = language.toLowerCase().startsWith("he") || language.toLowerCase().startsWith("iw") ? "he" : "en";
  const clean = key.trim().toLowerCase();
  return `/embed/template/${encodeURIComponent(clean)}?lang=${lang}&presentation=page`;
}

/**
 * Signed-in businesses open the existing studio with this template.
 * Everyone else goes to the public website-builder page. That page cannot preselect a template,
 * so the link must not pretend the design is copied automatically.
 */
export function galleryBuildPath(key: string, role?: string, businessId?: string): string {
  const id = String(businessId || "").trim();
  const clean = key.trim().toLowerCase();
  const allowed = role === "business" || role === "admin";
  if (allowed && id) {
    return `/business/${encodeURIComponent(id)}/dashboard/website/templates/${encodeURIComponent(clean)}/edit`;
  }
  return "/website-builder";
}

export function galleryStageSrc(key: string): string {
  return `/demo-media/home/gallery/${key}-stage.webp`;
}

export function galleryThumbSrc(key: string): string {
  return `/demo-media/home/gallery/${key}-thumb.webp`;
}
