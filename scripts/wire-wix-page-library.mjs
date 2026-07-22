import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const libDir = path.join(
  __dirname,
  "../src/components/site-builder/studio/visual-editor/library",
);

const pageLibraryPath = path.join(libDir, "pageLibrary.ts");
const sectionLibraryPath = path.join(libDir, "sectionLibrary.ts");

const categoryWire = [
  {
    category: "hero",
    idPrefix: "page-home",
    sectionPrefix: "section-home-page",
    titles: [
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
    keywords: ["בית", "ראשי", "home", "hero", "wix"],
  },
  {
    category: "services",
    idPrefix: "page-services",
    sectionPrefix: "section-services-page",
    titles: [
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
    keywords: ["שירותים", "services", "wix"],
  },
  {
    category: "gallery",
    idPrefix: "page-gallery",
    sectionPrefix: "section-gallery-page",
    titles: [
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
    keywords: ["גלריה", "gallery", "portfolio", "wix"],
  },
  {
    category: "contact",
    idPrefix: "page-contact",
    sectionPrefix: "section-contact-page",
    titles: [
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
    keywords: ["צור קשר", "contact", "wix"],
  },
  {
    category: "commerce",
    idPrefix: "page-products",
    sectionPrefix: "section-products-page",
    titles: [
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
    keywords: ["מוצרים", "products", "shop", "wix"],
  },
  {
    category: "pricing",
    idPrefix: "page-pricing",
    sectionPrefix: "section-pricing-page",
    titles: [
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
    keywords: ["תמחור", "pricing", "wix"],
  },
  {
    category: "blog",
    idPrefix: "page-blog",
    sectionPrefix: "section-blog-page",
    titles: [
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
    keywords: ["בלוג", "blog", "wix"],
  },
  {
    category: "events",
    idPrefix: "page-events",
    sectionPrefix: "section-events-page",
    titles: [
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
    keywords: ["אירועים", "events", "wix"],
  },
  {
    category: "testimonials",
    idPrefix: "page-testimonials",
    sectionPrefix: "section-testimonials-page",
    titles: [
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
    keywords: ["ביקורות", "testimonials", "reviews", "wix"],
  },
  {
    category: "team",
    idPrefix: "page-team",
    sectionPrefix: "section-team-page",
    titles: [
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
    keywords: ["צוות", "team", "wix"],
  },
  {
    category: "faq",
    idPrefix: "page-faq",
    sectionPrefix: "section-faq-page",
    titles: [
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
    keywords: ["שאלות נפוצות", "faq", "wix"],
  },
  {
    category: "promote",
    idPrefix: "page-landing",
    sectionPrefix: "section-landing-page",
    titles: [
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
    keywords: ["נחיתה", "landing", "promote", "wix"],
  },
  {
    category: "resume",
    idPrefix: "page-resume",
    sectionPrefix: "section-resume-page",
    titles: [
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
    keywords: ["קורות חיים", "resume", "cv", "wix"],
  },
];

function buildCategoryBlock(wire) {
  const pages = wire.titles
    .map(([title, description], index) => {
      const nn = String(index + 1).padStart(2, "0");
      const slug = `${wire.idPrefix.replace("page-", "")}-${nn}`;
      return `      {
        title: ${JSON.stringify(title)},
        description: ${JSON.stringify(description)},
        slugSuggestion: ${JSON.stringify(slug)},
        keywords: ${JSON.stringify(wire.keywords)},
        sectionIds: ["${wire.sectionPrefix}-${nn}", FOOTER],
      }`;
    })
    .join(",\n");

  return `  {
    category: "${wire.category}",
    idPrefix: "${wire.idPrefix}",
    pages: [
${pages},
    ],
  }`;
}

let pageLibrary = fs.readFileSync(pageLibraryPath, "utf8");

for (const wire of categoryWire) {
  const blockRegex = new RegExp(
    `  \\{\\s*category: "${wire.category}",[\\s\\S]*?idPrefix: "${wire.idPrefix}",[\\s\\S]*?pages: \\[[\\s\\S]*?\\],\\s*\\},`,
    "m",
  );
  if (!blockRegex.test(pageLibrary)) {
    console.error("Failed to find category block", wire.category);
    process.exit(1);
  }
  pageLibrary = pageLibrary.replace(blockRegex, `${buildCategoryBlock(wire)},`);
  console.log("updated pageLibrary category", wire.category);
}

fs.writeFileSync(pageLibraryPath, pageLibrary, "utf8");

let sectionLibrary = fs.readFileSync(sectionLibraryPath, "utf8");

const imports = `
import { HOME_PAGE_SHOWCASE_SECTIONS } from "./homePageShowcaseSections";
import { SERVICES_PAGE_SHOWCASE_SECTIONS } from "./servicesPageShowcaseSections";
import { GALLERY_PAGE_SHOWCASE_SECTIONS } from "./galleryPageShowcaseSections";
import { CONTACT_PAGE_SHOWCASE_SECTIONS } from "./contactPageShowcaseSections";
import { LANDING_PAGE_SHOWCASE_SECTIONS } from "./landingPageShowcaseSections";
import { PRODUCTS_PAGE_SHOWCASE_SECTIONS } from "./productsPageShowcaseSections";
import { PRICING_PAGE_SHOWCASE_SECTIONS } from "./pricingPageShowcaseSections";
import { BLOG_PAGE_SHOWCASE_SECTIONS } from "./blogPageShowcaseSections";
import { EVENTS_PAGE_SHOWCASE_SECTIONS } from "./eventsPageShowcaseSections";
import { TESTIMONIALS_PAGE_SHOWCASE_SECTIONS } from "./testimonialsPageShowcaseSections";
import { TEAM_PAGE_SHOWCASE_SECTIONS } from "./teamPageShowcaseSections";
import { FAQ_PAGE_SHOWCASE_SECTIONS } from "./faqPageShowcaseSections";
import { RESUME_PAGE_SHOWCASE_SECTIONS } from "./resumePageShowcaseSections";
`;

if (!sectionLibrary.includes("HOME_PAGE_SHOWCASE_SECTIONS")) {
  sectionLibrary = sectionLibrary.replace(
    'import { ABOUT_PAGE_SHOWCASE_SECTIONS } from "./aboutPageShowcaseSections";',
    `import { ABOUT_PAGE_SHOWCASE_SECTIONS } from "./aboutPageShowcaseSections";${imports}`,
  );
}

const spreads = `
  ...HOME_PAGE_SHOWCASE_SECTIONS,
  ...SERVICES_PAGE_SHOWCASE_SECTIONS,
  ...GALLERY_PAGE_SHOWCASE_SECTIONS,
  ...CONTACT_PAGE_SHOWCASE_SECTIONS,
  ...LANDING_PAGE_SHOWCASE_SECTIONS,
  ...PRODUCTS_PAGE_SHOWCASE_SECTIONS,
  ...PRICING_PAGE_SHOWCASE_SECTIONS,
  ...BLOG_PAGE_SHOWCASE_SECTIONS,
  ...EVENTS_PAGE_SHOWCASE_SECTIONS,
  ...TESTIMONIALS_PAGE_SHOWCASE_SECTIONS,
  ...TEAM_PAGE_SHOWCASE_SECTIONS,
  ...FAQ_PAGE_SHOWCASE_SECTIONS,
  ...RESUME_PAGE_SHOWCASE_SECTIONS,`;

if (!sectionLibrary.includes("...HOME_PAGE_SHOWCASE_SECTIONS")) {
  sectionLibrary = sectionLibrary.replace(
    "...ABOUT_PAGE_SHOWCASE_SECTIONS,",
    `...ABOUT_PAGE_SHOWCASE_SECTIONS,${spreads}`,
  );
}

fs.writeFileSync(sectionLibraryPath, sectionLibrary, "utf8");
console.log("wired sectionLibrary");
console.log("done");
