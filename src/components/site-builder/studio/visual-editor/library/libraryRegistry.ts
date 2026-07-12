import { ELEMENT_LIBRARY } from "./elementLibrary";
import { ADVANCED_ELEMENT_LIBRARY } from "./advancedElementLibrary";
import { MEDIA_LIBRARY } from "./mediaLibrary";
import { PAGE_LIBRARY } from "./pageLibrary";
import { SECTION_LIBRARY } from "./sectionLibrary";
import { SOCIAL_LIBRARY } from "./socialLibrary";
import type {
  VisualLibraryCategory,
  VisualLibraryEntry,
  VisualLibraryTab,
} from "./visualLibraryTypes";

export const VISUAL_LIBRARY_ENTRIES: VisualLibraryEntry[] = [
  ...ELEMENT_LIBRARY,
  ...ADVANCED_ELEMENT_LIBRARY,
  ...SOCIAL_LIBRARY,
  ...SECTION_LIBRARY,
  ...PAGE_LIBRARY,
  ...MEDIA_LIBRARY,
];

export const TAB_LABELS: Record<VisualLibraryTab, string> = {
  elements: "אלמנטים",
  sections: "סקשנים",
  pages: "עמודים",
  media: "מדיה",
};

export const CATEGORY_LABELS: Record<
  VisualLibraryCategory,
  string
> = {
  featured: "מומלצים",
  text: "טקסט",
  buttons: "כפתורים",
  images: "תמונות",
  video: "וידאו",
  social: "רשתות חברתיות",
  contact: "יצירת קשר",
  graphics: "גרפיקה",
  shapes: "קופסאות וצורות",
  gallery: "גלריות",
  forms: "טפסים",
  menu: "תפריטים",
  lists: "רשימות",
  embed: "Embed",
  apps: "אפליקציות",
  hero: "Hero",
  about: "אודות",
  services: "שירותים",
  portfolio: "תיק עבודות",
  testimonials: "המלצות",
  pricing: "מחירים",
  faq: "שאלות נפוצות",
  team: "צוות",
  stats: "מספרים ונתונים",
  cta: "קריאה לפעולה",
  footer: "Footer",
  legal: "משפטי",
  blog: "בלוג",
  commerce: "מוצרים ומסחר",
};

const TAB_CATEGORY_ORDER: Record<
  VisualLibraryTab,
  VisualLibraryCategory[]
> = {
  elements: [
    "featured",
    "text",
    "images",
    "buttons",
    "social",
    "contact",
    "graphics",
    "shapes",
    "video",
    "forms",
    "menu",
    "gallery",
    "lists",
    "embed",
    "apps",
  ],
  sections: [
    "featured",
    "hero",
    "about",
    "services",
    "portfolio",
    "testimonials",
    "pricing",
    "faq",
    "team",
    "stats",
    "contact",
    "cta",
    "footer",
  ],
  pages: [
    "featured",
    "about",
    "services",
    "portfolio",
    "pricing",
    "team",
    "faq",
    "contact",
    "legal",
  ],
  media: [
    "featured",
    "commerce",
    "graphics",
  ],
};

export function getLibraryEntriesByTab(
  tab: VisualLibraryTab,
) {
  return VISUAL_LIBRARY_ENTRIES.filter(
    (entry) => entry.tab === tab,
  );
}

export function getLibraryCategories(
  tab: VisualLibraryTab,
) {
  const available = new Set(
    getLibraryEntriesByTab(tab).map((entry) => entry.category),
  );

  return TAB_CATEGORY_ORDER[tab].filter((category) =>
    available.has(category),
  );
}

export function searchVisualLibrary({
  tab,
  category,
  query,
}: {
  tab: VisualLibraryTab;
  category?: VisualLibraryCategory | "all";
  query?: string;
}) {
  const normalizedQuery = String(query || "")
    .trim()
    .toLowerCase();

  return getLibraryEntriesByTab(tab).filter((entry) => {
    if (
      category &&
      category !== "all" &&
      entry.category !== category
    ) {
      return false;
    }

    if (!normalizedQuery) return true;

    const haystack = [
      entry.title,
      entry.description,
      entry.category,
      ...(entry.keywords || []),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}
