import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const libDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../src/components/site-builder/studio/visual-editor/library",
);

function pages(prefix, sectionPrefix, entries, keywords) {
  return entries
    .map(([title, description], i) => {
      const nn = String(i + 1).padStart(2, "0");
      return `      {
        title: ${JSON.stringify(title)},
        description: ${JSON.stringify(description)},
        slugSuggestion: ${JSON.stringify(`${prefix.replace("page-", "")}-${nn}`)},
        keywords: ${JSON.stringify(keywords)},
        sectionIds: ["${sectionPrefix}-${nn}", FOOTER],
      }`;
    })
    .join(",\n");
}

const aboutBlock = `  {
    category: "about",
    idPrefix: "page-about",
    pages: [
      {
        title: "אודות – פרופיל עסקי",
        description: "ביוגרפיה, הישגים והכרה בסגנון Wix Corporate",
        slugSuggestion: "about",
        keywords: ["אודות", "פרופיל", "עסק", "about", "corporate", "wix"],
        sectionIds: ["section-about-page-corporate", FOOTER],
      },
      {
        title: "אודות – הסטודיו",
        description: "סיפור סטודיו, תמונה רחבה והסמכות",
        slugSuggestion: "about-studio",
        keywords: ["אודות", "סטודיו", "studio", "about", "wix"],
        sectionIds: ["section-about-page-studio", FOOTER],
      },
      {
        title: "אודות – חברי צוות",
        description: "גריד צוות 3×3 עם תפקידים וקישורי LinkedIn",
        slugSuggestion: "about-team",
        keywords: ["אודות", "צוות", "team", "about", "wix"],
        sectionIds: ["section-about-page-team-grid", FOOTER],
      },
      {
        title: "אודות – משרות פתוחות",
        description: "עמוד קריירה עם כרטיסי משרות וקריאה להגשה",
        slugSuggestion: "careers",
        keywords: ["אודות", "קריירה", "משרות", "careers", "jobs", "wix"],
        sectionIds: ["section-about-page-careers", FOOTER],
      },
      {
        title: "אודות – קורות חיים",
        description: "CV ויזואלי עם פורטרטים, ניסיון והשכלה",
        slugSuggestion: "about-cv",
        keywords: ["אודות", "קורות חיים", "cv", "resume", "wix"],
        sectionIds: ["section-about-page-cv", FOOTER],
      },
      {
        title: "אודות – משימה וערכים",
        description: "כרטיס משימה על תמונה ורשת ערכים ממוספרת",
        slugSuggestion: "about-mission",
        keywords: ["אודות", "משימה", "ערכים", "mission", "values", "wix"],
        sectionIds: ["section-about-page-mission-values", FOOTER],
      },
      {
        title: "אודות – סיפור ויזואלי",
        description: "גריד תמונות 2×2 וסיפור קצר – ויזואלי קודם",
        slugSuggestion: "about-visual",
        keywords: ["אודות", "ויזואלי", "גלריה", "mood", "visual", "wix"],
        sectionIds: ["section-about-page-visual-mood", FOOTER],
      },
      {
        title: "אודות – פרופיל מקצועי",
        description: "פרופיל אישי עם תמונה רחבה ותחומי התמחות",
        slugSuggestion: "about-profile",
        keywords: ["אודות", "פרופיל", "מומחה", "profile", "wix"],
        sectionIds: ["section-about-page-profile", FOOTER],
      },
      {
        title: "אודות – המקום",
        description: "עמוד Venue עם כרטיס צף ורשימת מתקנים",
        slugSuggestion: "about-venue",
        keywords: ["אודות", "מקום", "venue", "facilities", "wix"],
        sectionIds: ["section-about-page-venue", FOOTER],
      },
      {
        title: "אודות – נרטיב מלא",
        description: "סיפור, חזון והיכרות עם הצוות בזרימה אחת",
        slugSuggestion: "about-story",
        keywords: ["אודות", "סיפור", "חזון", "narrative", "story", "wix"],
        sectionIds: ["section-about-page-narrative", FOOTER],
      },
    ],
  }`;

const defs = [
  [
    "hero",
    "page-home",
    "section-home-page",
    ["בית", "ראשי", "home", "hero", "wix"],
    [
      ["דף הבית – פתיחה מפוצלת", "הירו מפוצל, כרטיסי ערך ומספרים"],
      ["דף הבית – Editorial", "פתיחה ממורכזת עם תמונה רחבה"],
      ["דף הבית – מגזין", "קולאז׳ תמונות וסיפור מותג"],
      ["דף הבית – כרטיסי ערך", "רשת שישה כרטיסים ויזואליים"],
      ["דף הבית – תהליך", "ציר שלבים ברור עד להשקה"],
      ["דף הבית – מספרים", "סטטיסטיקות, תמונה רחבה וסיפור"],
      ["דף הבית – כהה קולנועי", "פתיחה דרמטית על רקע כהה"],
      ["דף הבית – לייפסטייל", "אווירה רכה עם תמונת גיבור גדולה"],
      ["דף הבית – רשימה ומדיה", "יתרונות ברשימה לצד מדיה"],
      ["דף הבית – המרה", "טופס בולט וקריאה לפעולה"],
    ],
  ],
  [
    "services",
    "page-services",
    "section-services-page",
    ["שירותים", "services", "wix"],
    [
      ["שירותים – מפוצל", "תמונה חזקה וכרטיסי שירות"],
      ["שירותים – מרכזי", "פתיחה editorial ממוקדת"],
      ["שירותים – מגזין", "פריסה מגזינית לשירותי בוטיק"],
      ["שירותים – כרטיסים", "רשת שישה שירותים"],
      ["שירותים – תהליך", "שירותים כמסע לקוח"],
      ["שירותים – תוצאות", "מדדים לצד הצעת הערך"],
      ["שירותים – כהה", "חוויית שירות פרימיום"],
      ["שירותים – רך", "טון חם לשירות אישי"],
      ["שירותים – רשימה", "קטלוג מסודר עם מדיה"],
      ["שירותים – פנייה", "טופס קביעה לצד יתרונות"],
    ],
  ],
  [
    "gallery",
    "page-gallery",
    "section-gallery-page",
    ["גלריה", "gallery", "portfolio", "wix"],
    [
      ["גלריה – מפוצלת", "תמונה דומיננטית וכרטיסי פרויקטים"],
      ["גלריה – Editorial", "תצוגה מרכזית עם דגש ויזואלי"],
      ["גלריה – קולאז׳", "פריסת מגזין לעבודות נבחרות"],
      ["גלריה – רשת", "שישה פרויקטים בכרטיסים"],
      ["גלריה – ציר", "מהרעיון לתוצאה"],
      ["גלריה – הישגים", "מספרים ותצוגה חזקה"],
      ["גלריה – כהה", "ויזואליות דרמטית"],
      ["גלריה – רכה", "אווירת לייפסטייל"],
      ["גלריה – רשימה", "פרויקטים נבחרים ומדיה"],
      ["גלריה – פנייה", "גלריה שמסתיימת בטופס"],
    ],
  ],
  [
    "contact",
    "page-contact",
    "section-contact-page",
    ["צור קשר", "contact", "wix"],
    [
      ["יצירת קשר – מפוצל", "פרטים, טופס וכרטיסי מידע"],
      ["יצירת קשר – מרכזי", "פתיחה נקייה להמרה"],
      ["יצירת קשר – מגזין", "פריסה ויזואלית חמה"],
      ["יצירת קשר – ערוצים", "כרטיסי טלפון מייל וכתובת"],
      ["יצירת קשר – תהליך", "מה קורה אחרי שפונים"],
      ["יצירת קשר – אמון", "מספרים וסיבות לפנות"],
      ["יצירת קשר – כהה", "סגנון פרימיום"],
      ["יצירת קשר – חם", "טון מזמין לעסק מקומי"],
      ["יצירת קשר – מיקום", "פרטי ביקור ומדיה"],
      ["יצירת קשר – טופס", "טופס גדול וברור"],
    ],
  ],
  [
    "commerce",
    "page-products",
    "section-products-page",
    ["מוצרים", "products", "shop", "wix"],
    [
      ["מוצרים – מפוצל", "הדגשת מוצר מוביל"],
      ["מוצרים – מרכזי", "קולקציה חדשה ממוקדת"],
      ["מוצרים – מגזין", "בחירות בסגנון editorial"],
      ["מוצרים – רשת", "שישה מוצרים מובילים"],
      ["מוצרים – מסע", "מהרעיון למוצר מדף"],
      ["מוצרים – ביצועים", "הנמכרים ביותר"],
      ["מוצרים – כהה", "קולקציית פרימיום"],
      ["מוצרים – רכה", "מוצרי לייפסטייל"],
      ["מוצרים – רשימה", "המלצות השבוע"],
      ["מוצרים – הזמנה", "טופס הזמנה מהיר"],
    ],
  ],
  [
    "pricing",
    "page-pricing",
    "section-pricing-page",
    ["תמחור", "pricing", "wix"],
    [
      ["תמחור – מפוצל", "מחירים שקופים עם CTA"],
      ["תמחור – מרכזי", "בחירת מסלול נקייה"],
      ["תמחור – מגזין", "הערך מאחורי המחיר"],
      ["תמחור – כרטיסים", "שלוש חבילות ברורות"],
      ["תמחור – תהליך", "מה כלול בכל שלב"],
      ["תמחור – ROI", "החזר השקעה שרואים"],
      ["תמחור – כהה", "מסלול Pro"],
      ["תמחור – רך", "תמחור בלי הפתעות"],
      ["תמחור – השוואה", "השוו ותבחרו נכון"],
      ["תמחור – הצעה", "טופס להצעה מותאמת"],
    ],
  ],
  [
    "blog",
    "page-blog",
    "section-blog-page",
    ["בלוג", "blog", "wix"],
    [
      ["בלוג – מפוצל", "מאמר מוביל וכרטיסים"],
      ["בלוג – מרכזי", "פתיחה editorial"],
      ["בלוג – מגזין", "סיפורים מהשטח"],
      ["בלוג – כרטיסים", "הפוסטים האחרונים"],
      ["בלוג – סדרה", "מדריכים שלב אחר שלב"],
      ["בלוג – טרנדים", "הנושאים שכולם קוראים"],
      ["בלוג – כהה", "מאמרים לעומק"],
      ["בלוג – רך", "הערות קצרות"],
      ["בלוג – ארכיון", "רשימה מסודרת"],
      ["בלוג – ניוזלטר", "הרשמה לתובנות"],
    ],
  ],
  [
    "events",
    "page-events",
    "section-events-page",
    ["אירועים", "events", "wix"],
    [
      ["אירועים – מפוצל", "אירוע קרוב וכרטיסים"],
      ["אירועים – מרכזי", "מה קורה החודש"],
      ["אירועים – מגזין", "חוויות שנשארות"],
      ["אירועים – לוח", "שישה אירועים קרובים"],
      ["אירועים – לו״ז", "ציר זמן ליום האירוע"],
      ["אירועים – קהילה", "מספרים על מעורבות"],
      ["אירועים – כהה", "אירוע לילה פרימיום"],
      ["אירועים – רך", "מפגשים באווירה נעימה"],
      ["אירועים – ליינאפ", "רשימת מופעים"],
      ["אירועים – RSVP", "טופס שמירת מקום"],
    ],
  ],
  [
    "testimonials",
    "page-testimonials",
    "section-testimonials-page",
    ["ביקורות", "testimonials", "reviews", "wix"],
    [
      ["ביקורות – מפוצל", "ציטוט מוביל וכרטיסים"],
      ["ביקורות – מרכזי", "אמון שנבנה מתוצאות"],
      ["ביקורות – מגזין", "סיפורי הצלחה"],
      ["ביקורות – קיר", "רשת המלצות"],
      ["ביקורות – מסע", "המלצות על ציר זמן"],
      ["ביקורות – דירוגים", "מספרים וציטוטים"],
      ["ביקורות – כהה", "קולות דרמטיים"],
      ["ביקורות – רך", "מילים חמות"],
      ["ביקורות – רשימה", "ציטוטים נבחרים"],
      ["ביקורות – כתיבה", "טופס להשארת ביקורת"],
    ],
  ],
  [
    "team",
    "page-team",
    "section-team-page",
    ["צוות", "team", "wix"],
    [
      ["צוות – מפוצל", "האנשים מאחורי העשייה"],
      ["צוות – מרכזי", "צוות קטן עם השפעה"],
      ["צוות – מגזין", "כישרונות שמניעים מותגים"],
      ["צוות – כרטיסים", "שישה פנים להכיר"],
      ["צוות – תרבות", "איך עובדים יחד"],
      ["צוות – מספרים", "שנים פרויקטים ואנשים"],
      ["צוות – כהה", "כישרון מאחורי הקלעים"],
      ["צוות – רך", "יותר מעסק — קהילה"],
      ["צוות – תפקידים", "רשימת התמחויות"],
      ["צוות – גיוס", "טופס מועמדות"],
    ],
  ],
  [
    "faq",
    "page-faq",
    "section-faq-page",
    ["שאלות נפוצות", "faq", "wix"],
    [
      ["שאלות נפוצות – מפוצל", "תשובות וכרטיסי נושאים"],
      ["שאלות נפוצות – מרכזי", "מרכז עזרה נקי"],
      ["שאלות נפוצות – מגזין", "שאלות עם הקשר"],
      ["שאלות נפוצות – נושאים", "קטגוריות שאלות"],
      ["שאלות נפוצות – שלבים", "לפי שלבי שימוש"],
      ["שאלות נפוצות – מהיר", "עובדות בקצרה"],
      ["שאלות נפוצות – כהה", "תמיכה בלי בלבול"],
      ["שאלות נפוצות – רך", "עזרה בשפה פשוטה"],
      ["שאלות נפוצות – רשימה", "שאלות ותשובות"],
      ["שאלות נפוצות – פנייה", "טופס אם אין תשובה"],
    ],
  ],
  [
    "promote",
    "page-landing",
    "section-landing-page",
    ["נחיתה", "landing", "promote", "wix"],
    [
      ["נחיתה – מפוצלת", "הצעה אחת עם CTA חזק"],
      ["נחיתה – מרכזית", "קמפיין ממוקד המרה"],
      ["נחיתה – מגזין", "מבצע מוגבל בזמן"],
      ["נחיתה – יתרונות", "כרטיסי ערך להחלטה מהירה"],
      ["נחיתה – שלבים", "שלושה צעדים להטבה"],
      ["נחיתה – הוכחות", "מספרים שמחזקים הצעה"],
      ["נחיתה – כהה", "גישה מוקדמת בלעדית"],
      ["נחיתה – רכה", "הזמנה בלי לחץ"],
      ["נחיתה – תכולה", "מה מקבלים בחבילה"],
      ["נחיתה – טופס", "טופס לידים דומיננטי"],
    ],
  ],
  [
    "resume",
    "page-resume",
    "section-resume-page",
    ["קורות חיים", "resume", "cv", "wix"],
    [
      ["קורות חיים – מפוצל", "פרופיל מקצועי במבט אחד"],
      ["קורות חיים – מרכזי", "ניסיון כישורים ותוצאות"],
      ["קורות חיים – מגזין", "סיפור מקצועי editorial"],
      ["קורות חיים – כרטיסים", "כישורים וניסיון נבחר"],
      ["קורות חיים – ציר", "דרך הקריירה"],
      ["קורות חיים – הישגים", "מספרים מהקריירה"],
      ["קורות חיים – כהה", "פרופיל בולט"],
      ["קורות חיים – רך", "טון אישי"],
      ["קורות חיים – רשימה", "ניסיון תעסוקתי מפורט"],
      ["קורות חיים – גיוס", "טופס פנייה להזדמנות"],
    ],
  ],
];

const categoryBlocks = defs.map(
  ([category, idPrefix, sectionPrefix, keywords, entries]) => `  {
    category: "${category}",
    idPrefix: "${idPrefix}",
    pages: [
${pages(idPrefix, sectionPrefix, entries, keywords)},
    ],
  }`,
);

// Insert about after hero
const allBlocks = [categoryBlocks[0], aboutBlock, ...categoryBlocks.slice(1)];

const content = `import type {
  VisualLibraryCategory,
  VisualLibraryPageTemplate,
} from "./visualLibraryTypes";
import { getSectionTemplateById } from "./sectionLibrary";

type PageDef = {
  title: string;
  description: string;
  slugSuggestion: string;
  keywords: string[];
  sectionIds: string[];
};

type CategoryDef = {
  category: VisualLibraryCategory;
  idPrefix: string;
  pages: PageDef[];
};

const FOOTER = "section-footer";

const CATEGORY_DEFS: CategoryDef[] = [
${allBlocks.join(",\n")}
];

function resolvePageThumbnail(sectionIds: string[]) {
  for (const sectionId of sectionIds || []) {
    if (sectionId === "section-footer") continue;
    const section = getSectionTemplateById(sectionId);
    if (section?.thumbnail) return section.thumbnail;
  }
  return undefined;
}

function buildPageLibrary(): VisualLibraryPageTemplate[] {
  const pages: VisualLibraryPageTemplate[] = [];

  for (const categoryDef of CATEGORY_DEFS) {
    categoryDef.pages.forEach((pageDef, index) => {
      const num = String(index + 1).padStart(2, "0");
      pages.push({
        id: \`\${categoryDef.idPrefix}-\${num}\`,
        kind: "page",
        tab: "pages",
        category: categoryDef.category,
        title: pageDef.title,
        description: pageDef.description,
        slugSuggestion: pageDef.slugSuggestion,
        keywords: pageDef.keywords,
        thumbnail: resolvePageThumbnail(pageDef.sectionIds),
        sectionIds: pageDef.sectionIds,
      });
    });
  }

  return pages;
}

/**
 * Ready-to-add Hebrew page templates (10 per category × 14 categories = 140).
 * Each page is a unique full Wix-style composition + footer.
 */
export const PAGE_LIBRARY: VisualLibraryPageTemplate[] = buildPageLibrary();

export const PAGE_LIBRARY_BY_CATEGORY: Record<
  string,
  VisualLibraryPageTemplate[]
> = PAGE_LIBRARY.reduce(
  (acc, page) => {
    if (!acc[page.category]) {
      acc[page.category] = [];
    }
    acc[page.category].push(page);
    return acc;
  },
  {} as Record<string, VisualLibraryPageTemplate[]>,
);

export const PAGE_LIBRARY_NAV: Array<{
  id: string;
  label: string;
}> = [
  { id: "all", label: "הכול" },
  { id: "hero", label: "דף הבית" },
  { id: "about", label: "אודות" },
  { id: "services", label: "שירותים" },
  { id: "gallery", label: "גלריה" },
  { id: "contact", label: "יצירת קשר" },
  { id: "commerce", label: "מוצרים" },
  { id: "pricing", label: "תמחור" },
  { id: "blog", label: "בלוג" },
  { id: "events", label: "אירועים" },
  { id: "testimonials", label: "ביקורות" },
  { id: "team", label: "צוות" },
  { id: "faq", label: "שאלות נפוצות" },
  { id: "promote", label: "נחיתה" },
  { id: "resume", label: "קורות חיים" },
];

export function getPagesByCategory(
  cat: string,
): VisualLibraryPageTemplate[] {
  if (!cat || cat === "all") {
    return PAGE_LIBRARY;
  }
  return PAGE_LIBRARY.filter((page) => page.category === cat);
}

export function getPageTemplateById(id: string) {
  return PAGE_LIBRARY.find((item) => item.id === id) || null;
}
`;

fs.writeFileSync(path.join(libDir, "pageLibrary.ts"), content, "utf8");
console.log("rewrote pageLibrary.ts with", allBlocks.length, "categories");
