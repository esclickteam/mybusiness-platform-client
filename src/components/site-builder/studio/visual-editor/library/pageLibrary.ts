import type {
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
  {
    category: "hero",
    idPrefix: "page-home",
    pages: [
      {
        title: "דף הבית – פתיחה מפוצלת",
        description: "הירו מפוצל, כרטיסי ערך ומספרים",
        slugSuggestion: "home-01",
        keywords: ["בית","ראשי","home","hero","wix"],
        sectionIds: ["section-home-page-01", FOOTER],
      },
      {
        title: "דף הבית – Editorial",
        description: "פתיחה ממורכזת עם תמונה רחבה",
        slugSuggestion: "home-02",
        keywords: ["בית","ראשי","home","hero","wix"],
        sectionIds: ["section-home-page-02", FOOTER],
      },
      {
        title: "דף הבית – מגזין",
        description: "קולאז׳ תמונות וסיפור מותג",
        slugSuggestion: "home-03",
        keywords: ["בית","ראשי","home","hero","wix"],
        sectionIds: ["section-home-page-03", FOOTER],
      },
      {
        title: "דף הבית – כרטיסי ערך",
        description: "רשת שישה כרטיסים ויזואליים",
        slugSuggestion: "home-04",
        keywords: ["בית","ראשי","home","hero","wix"],
        sectionIds: ["section-home-page-04", FOOTER],
      },
      {
        title: "דף הבית – תהליך",
        description: "ציר שלבים ברור עד להשקה",
        slugSuggestion: "home-05",
        keywords: ["בית","ראשי","home","hero","wix"],
        sectionIds: ["section-home-page-05", FOOTER],
      },
      {
        title: "דף הבית – מספרים",
        description: "סטטיסטיקות, תמונה רחבה וסיפור",
        slugSuggestion: "home-06",
        keywords: ["בית","ראשי","home","hero","wix"],
        sectionIds: ["section-home-page-06", FOOTER],
      },
      {
        title: "דף הבית – כהה קולנועי",
        description: "פתיחה דרמטית על רקע כהה",
        slugSuggestion: "home-07",
        keywords: ["בית","ראשי","home","hero","wix"],
        sectionIds: ["section-home-page-07", FOOTER],
      },
      {
        title: "דף הבית – לייפסטייל",
        description: "אווירה רכה עם תמונת גיבור גדולה",
        slugSuggestion: "home-08",
        keywords: ["בית","ראשי","home","hero","wix"],
        sectionIds: ["section-home-page-08", FOOTER],
      },
      {
        title: "דף הבית – רשימה ומדיה",
        description: "יתרונות ברשימה לצד מדיה",
        slugSuggestion: "home-09",
        keywords: ["בית","ראשי","home","hero","wix"],
        sectionIds: ["section-home-page-09", FOOTER],
      },
      {
        title: "דף הבית – המרה",
        description: "טופס בולט וקריאה לפעולה",
        slugSuggestion: "home-10",
        keywords: ["בית","ראשי","home","hero","wix"],
        sectionIds: ["section-home-page-10", FOOTER],
      },
    ],
  },
  {
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
  },
  {
    category: "services",
    idPrefix: "page-services",
    pages: [
      {
        title: "שירותים – מפוצל",
        description: "תמונה חזקה וכרטיסי שירות",
        slugSuggestion: "services-01",
        keywords: ["שירותים","services","wix"],
        sectionIds: ["section-services-page-01", FOOTER],
      },
      {
        title: "שירותים – מרכזי",
        description: "פתיחה editorial ממוקדת",
        slugSuggestion: "services-02",
        keywords: ["שירותים","services","wix"],
        sectionIds: ["section-services-page-02", FOOTER],
      },
      {
        title: "שירותים – מגזין",
        description: "פריסה מגזינית לשירותי בוטיק",
        slugSuggestion: "services-03",
        keywords: ["שירותים","services","wix"],
        sectionIds: ["section-services-page-03", FOOTER],
      },
      {
        title: "שירותים – כרטיסים",
        description: "רשת שישה שירותים",
        slugSuggestion: "services-04",
        keywords: ["שירותים","services","wix"],
        sectionIds: ["section-services-page-04", FOOTER],
      },
      {
        title: "שירותים – תהליך",
        description: "שירותים כמסע לקוח",
        slugSuggestion: "services-05",
        keywords: ["שירותים","services","wix"],
        sectionIds: ["section-services-page-05", FOOTER],
      },
      {
        title: "שירותים – תוצאות",
        description: "מדדים לצד הצעת הערך",
        slugSuggestion: "services-06",
        keywords: ["שירותים","services","wix"],
        sectionIds: ["section-services-page-06", FOOTER],
      },
      {
        title: "שירותים – כהה",
        description: "חוויית שירות פרימיום",
        slugSuggestion: "services-07",
        keywords: ["שירותים","services","wix"],
        sectionIds: ["section-services-page-07", FOOTER],
      },
      {
        title: "שירותים – רך",
        description: "טון חם לשירות אישי",
        slugSuggestion: "services-08",
        keywords: ["שירותים","services","wix"],
        sectionIds: ["section-services-page-08", FOOTER],
      },
      {
        title: "שירותים – רשימה",
        description: "קטלוג מסודר עם מדיה",
        slugSuggestion: "services-09",
        keywords: ["שירותים","services","wix"],
        sectionIds: ["section-services-page-09", FOOTER],
      },
      {
        title: "שירותים – פנייה",
        description: "טופס קביעה לצד יתרונות",
        slugSuggestion: "services-10",
        keywords: ["שירותים","services","wix"],
        sectionIds: ["section-services-page-10", FOOTER],
      },
    ],
  },
  {
    category: "gallery",
    idPrefix: "page-gallery",
    pages: [
      {
        title: "גלריה – מפוצלת",
        description: "תמונה דומיננטית וכרטיסי פרויקטים",
        slugSuggestion: "gallery-01",
        keywords: ["גלריה","gallery","portfolio","wix"],
        sectionIds: ["section-gallery-page-01", FOOTER],
      },
      {
        title: "גלריה – Editorial",
        description: "תצוגה מרכזית עם דגש ויזואלי",
        slugSuggestion: "gallery-02",
        keywords: ["גלריה","gallery","portfolio","wix"],
        sectionIds: ["section-gallery-page-02", FOOTER],
      },
      {
        title: "גלריה – קולאז׳",
        description: "פריסת מגזין לעבודות נבחרות",
        slugSuggestion: "gallery-03",
        keywords: ["גלריה","gallery","portfolio","wix"],
        sectionIds: ["section-gallery-page-03", FOOTER],
      },
      {
        title: "גלריה – רשת",
        description: "שישה פרויקטים בכרטיסים",
        slugSuggestion: "gallery-04",
        keywords: ["גלריה","gallery","portfolio","wix"],
        sectionIds: ["section-gallery-page-04", FOOTER],
      },
      {
        title: "גלריה – ציר",
        description: "מהרעיון לתוצאה",
        slugSuggestion: "gallery-05",
        keywords: ["גלריה","gallery","portfolio","wix"],
        sectionIds: ["section-gallery-page-05", FOOTER],
      },
      {
        title: "גלריה – הישגים",
        description: "מספרים ותצוגה חזקה",
        slugSuggestion: "gallery-06",
        keywords: ["גלריה","gallery","portfolio","wix"],
        sectionIds: ["section-gallery-page-06", FOOTER],
      },
      {
        title: "גלריה – כהה",
        description: "ויזואליות דרמטית",
        slugSuggestion: "gallery-07",
        keywords: ["גלריה","gallery","portfolio","wix"],
        sectionIds: ["section-gallery-page-07", FOOTER],
      },
      {
        title: "גלריה – רכה",
        description: "אווירת לייפסטייל",
        slugSuggestion: "gallery-08",
        keywords: ["גלריה","gallery","portfolio","wix"],
        sectionIds: ["section-gallery-page-08", FOOTER],
      },
      {
        title: "גלריה – רשימה",
        description: "פרויקטים נבחרים ומדיה",
        slugSuggestion: "gallery-09",
        keywords: ["גלריה","gallery","portfolio","wix"],
        sectionIds: ["section-gallery-page-09", FOOTER],
      },
      {
        title: "גלריה – פנייה",
        description: "גלריה שמסתיימת בטופס",
        slugSuggestion: "gallery-10",
        keywords: ["גלריה","gallery","portfolio","wix"],
        sectionIds: ["section-gallery-page-10", FOOTER],
      },
    ],
  },
  {
    category: "contact",
    idPrefix: "page-contact",
    pages: [
      {
        title: "יצירת קשר – מפוצל",
        description: "פרטים, טופס וכרטיסי מידע",
        slugSuggestion: "contact-01",
        keywords: ["צור קשר","contact","wix"],
        sectionIds: ["section-contact-page-01", FOOTER],
      },
      {
        title: "יצירת קשר – מרכזי",
        description: "פתיחה נקייה להמרה",
        slugSuggestion: "contact-02",
        keywords: ["צור קשר","contact","wix"],
        sectionIds: ["section-contact-page-02", FOOTER],
      },
      {
        title: "יצירת קשר – מגזין",
        description: "פריסה ויזואלית חמה",
        slugSuggestion: "contact-03",
        keywords: ["צור קשר","contact","wix"],
        sectionIds: ["section-contact-page-03", FOOTER],
      },
      {
        title: "יצירת קשר – ערוצים",
        description: "כרטיסי טלפון מייל וכתובת",
        slugSuggestion: "contact-04",
        keywords: ["צור קשר","contact","wix"],
        sectionIds: ["section-contact-page-04", FOOTER],
      },
      {
        title: "יצירת קשר – תהליך",
        description: "מה קורה אחרי שפונים",
        slugSuggestion: "contact-05",
        keywords: ["צור קשר","contact","wix"],
        sectionIds: ["section-contact-page-05", FOOTER],
      },
      {
        title: "יצירת קשר – אמון",
        description: "מספרים וסיבות לפנות",
        slugSuggestion: "contact-06",
        keywords: ["צור קשר","contact","wix"],
        sectionIds: ["section-contact-page-06", FOOTER],
      },
      {
        title: "יצירת קשר – כהה",
        description: "סגנון פרימיום",
        slugSuggestion: "contact-07",
        keywords: ["צור קשר","contact","wix"],
        sectionIds: ["section-contact-page-07", FOOTER],
      },
      {
        title: "יצירת קשר – חם",
        description: "טון מזמין לעסק מקומי",
        slugSuggestion: "contact-08",
        keywords: ["צור קשר","contact","wix"],
        sectionIds: ["section-contact-page-08", FOOTER],
      },
      {
        title: "יצירת קשר – מיקום",
        description: "פרטי ביקור ומדיה",
        slugSuggestion: "contact-09",
        keywords: ["צור קשר","contact","wix"],
        sectionIds: ["section-contact-page-09", FOOTER],
      },
      {
        title: "יצירת קשר – טופס",
        description: "טופס גדול וברור",
        slugSuggestion: "contact-10",
        keywords: ["צור קשר","contact","wix"],
        sectionIds: ["section-contact-page-10", FOOTER],
      },
    ],
  },
  {
    category: "commerce",
    idPrefix: "page-products",
    pages: [
      {
        title: "מוצרים – מפוצל",
        description: "הדגשת מוצר מוביל",
        slugSuggestion: "products-01",
        keywords: ["מוצרים","products","shop","wix"],
        sectionIds: ["section-products-page-01", FOOTER],
      },
      {
        title: "מוצרים – מרכזי",
        description: "קולקציה חדשה ממוקדת",
        slugSuggestion: "products-02",
        keywords: ["מוצרים","products","shop","wix"],
        sectionIds: ["section-products-page-02", FOOTER],
      },
      {
        title: "מוצרים – מגזין",
        description: "בחירות בסגנון editorial",
        slugSuggestion: "products-03",
        keywords: ["מוצרים","products","shop","wix"],
        sectionIds: ["section-products-page-03", FOOTER],
      },
      {
        title: "מוצרים – רשת",
        description: "שישה מוצרים מובילים",
        slugSuggestion: "products-04",
        keywords: ["מוצרים","products","shop","wix"],
        sectionIds: ["section-products-page-04", FOOTER],
      },
      {
        title: "מוצרים – מסע",
        description: "מהרעיון למוצר מדף",
        slugSuggestion: "products-05",
        keywords: ["מוצרים","products","shop","wix"],
        sectionIds: ["section-products-page-05", FOOTER],
      },
      {
        title: "מוצרים – ביצועים",
        description: "הנמכרים ביותר",
        slugSuggestion: "products-06",
        keywords: ["מוצרים","products","shop","wix"],
        sectionIds: ["section-products-page-06", FOOTER],
      },
      {
        title: "מוצרים – כהה",
        description: "קולקציית פרימיום",
        slugSuggestion: "products-07",
        keywords: ["מוצרים","products","shop","wix"],
        sectionIds: ["section-products-page-07", FOOTER],
      },
      {
        title: "מוצרים – רכה",
        description: "מוצרי לייפסטייל",
        slugSuggestion: "products-08",
        keywords: ["מוצרים","products","shop","wix"],
        sectionIds: ["section-products-page-08", FOOTER],
      },
      {
        title: "מוצרים – רשימה",
        description: "המלצות השבוע",
        slugSuggestion: "products-09",
        keywords: ["מוצרים","products","shop","wix"],
        sectionIds: ["section-products-page-09", FOOTER],
      },
      {
        title: "מוצרים – הזמנה",
        description: "טופס הזמנה מהיר",
        slugSuggestion: "products-10",
        keywords: ["מוצרים","products","shop","wix"],
        sectionIds: ["section-products-page-10", FOOTER],
      },
    ],
  },
  {
    category: "pricing",
    idPrefix: "page-pricing",
    pages: [
      {
        title: "תמחור – מפוצל",
        description: "מחירים שקופים עם CTA",
        slugSuggestion: "pricing-01",
        keywords: ["תמחור","pricing","wix"],
        sectionIds: ["section-pricing-page-01", FOOTER],
      },
      {
        title: "תמחור – מרכזי",
        description: "בחירת מסלול נקייה",
        slugSuggestion: "pricing-02",
        keywords: ["תמחור","pricing","wix"],
        sectionIds: ["section-pricing-page-02", FOOTER],
      },
      {
        title: "תמחור – מגזין",
        description: "הערך מאחורי המחיר",
        slugSuggestion: "pricing-03",
        keywords: ["תמחור","pricing","wix"],
        sectionIds: ["section-pricing-page-03", FOOTER],
      },
      {
        title: "תמחור – כרטיסים",
        description: "שלוש חבילות ברורות",
        slugSuggestion: "pricing-04",
        keywords: ["תמחור","pricing","wix"],
        sectionIds: ["section-pricing-page-04", FOOTER],
      },
      {
        title: "תמחור – תהליך",
        description: "מה כלול בכל שלב",
        slugSuggestion: "pricing-05",
        keywords: ["תמחור","pricing","wix"],
        sectionIds: ["section-pricing-page-05", FOOTER],
      },
      {
        title: "תמחור – ROI",
        description: "החזר השקעה שרואים",
        slugSuggestion: "pricing-06",
        keywords: ["תמחור","pricing","wix"],
        sectionIds: ["section-pricing-page-06", FOOTER],
      },
      {
        title: "תמחור – כהה",
        description: "מסלול Pro",
        slugSuggestion: "pricing-07",
        keywords: ["תמחור","pricing","wix"],
        sectionIds: ["section-pricing-page-07", FOOTER],
      },
      {
        title: "תמחור – רך",
        description: "תמחור בלי הפתעות",
        slugSuggestion: "pricing-08",
        keywords: ["תמחור","pricing","wix"],
        sectionIds: ["section-pricing-page-08", FOOTER],
      },
      {
        title: "תמחור – השוואה",
        description: "השוו ותבחרו נכון",
        slugSuggestion: "pricing-09",
        keywords: ["תמחור","pricing","wix"],
        sectionIds: ["section-pricing-page-09", FOOTER],
      },
      {
        title: "תמחור – הצעה",
        description: "טופס להצעה מותאמת",
        slugSuggestion: "pricing-10",
        keywords: ["תמחור","pricing","wix"],
        sectionIds: ["section-pricing-page-10", FOOTER],
      },
    ],
  },
  {
    category: "blog",
    idPrefix: "page-blog",
    pages: [
      {
        title: "בלוג – מפוצל",
        description: "מאמר מוביל וכרטיסים",
        slugSuggestion: "blog-01",
        keywords: ["בלוג","blog","wix"],
        sectionIds: ["section-blog-page-01", FOOTER],
      },
      {
        title: "בלוג – מרכזי",
        description: "פתיחה editorial",
        slugSuggestion: "blog-02",
        keywords: ["בלוג","blog","wix"],
        sectionIds: ["section-blog-page-02", FOOTER],
      },
      {
        title: "בלוג – מגזין",
        description: "סיפורים מהשטח",
        slugSuggestion: "blog-03",
        keywords: ["בלוג","blog","wix"],
        sectionIds: ["section-blog-page-03", FOOTER],
      },
      {
        title: "בלוג – כרטיסים",
        description: "הפוסטים האחרונים",
        slugSuggestion: "blog-04",
        keywords: ["בלוג","blog","wix"],
        sectionIds: ["section-blog-page-04", FOOTER],
      },
      {
        title: "בלוג – סדרה",
        description: "מדריכים שלב אחר שלב",
        slugSuggestion: "blog-05",
        keywords: ["בלוג","blog","wix"],
        sectionIds: ["section-blog-page-05", FOOTER],
      },
      {
        title: "בלוג – טרנדים",
        description: "הנושאים שכולם קוראים",
        slugSuggestion: "blog-06",
        keywords: ["בלוג","blog","wix"],
        sectionIds: ["section-blog-page-06", FOOTER],
      },
      {
        title: "בלוג – כהה",
        description: "מאמרים לעומק",
        slugSuggestion: "blog-07",
        keywords: ["בלוג","blog","wix"],
        sectionIds: ["section-blog-page-07", FOOTER],
      },
      {
        title: "בלוג – רך",
        description: "הערות קצרות",
        slugSuggestion: "blog-08",
        keywords: ["בלוג","blog","wix"],
        sectionIds: ["section-blog-page-08", FOOTER],
      },
      {
        title: "בלוג – ארכיון",
        description: "רשימה מסודרת",
        slugSuggestion: "blog-09",
        keywords: ["בלוג","blog","wix"],
        sectionIds: ["section-blog-page-09", FOOTER],
      },
      {
        title: "בלוג – ניוזלטר",
        description: "הרשמה לתובנות",
        slugSuggestion: "blog-10",
        keywords: ["בלוג","blog","wix"],
        sectionIds: ["section-blog-page-10", FOOTER],
      },
    ],
  },
  {
    category: "events",
    idPrefix: "page-events",
    pages: [
      {
        title: "אירועים – מפוצל",
        description: "אירוע קרוב וכרטיסים",
        slugSuggestion: "events-01",
        keywords: ["אירועים","events","wix"],
        sectionIds: ["section-events-page-01", FOOTER],
      },
      {
        title: "אירועים – מרכזי",
        description: "מה קורה החודש",
        slugSuggestion: "events-02",
        keywords: ["אירועים","events","wix"],
        sectionIds: ["section-events-page-02", FOOTER],
      },
      {
        title: "אירועים – מגזין",
        description: "חוויות שנשארות",
        slugSuggestion: "events-03",
        keywords: ["אירועים","events","wix"],
        sectionIds: ["section-events-page-03", FOOTER],
      },
      {
        title: "אירועים – לוח",
        description: "שישה אירועים קרובים",
        slugSuggestion: "events-04",
        keywords: ["אירועים","events","wix"],
        sectionIds: ["section-events-page-04", FOOTER],
      },
      {
        title: "אירועים – לו״ז",
        description: "ציר זמן ליום האירוע",
        slugSuggestion: "events-05",
        keywords: ["אירועים","events","wix"],
        sectionIds: ["section-events-page-05", FOOTER],
      },
      {
        title: "אירועים – קהילה",
        description: "מספרים על מעורבות",
        slugSuggestion: "events-06",
        keywords: ["אירועים","events","wix"],
        sectionIds: ["section-events-page-06", FOOTER],
      },
      {
        title: "אירועים – כהה",
        description: "אירוע לילה פרימיום",
        slugSuggestion: "events-07",
        keywords: ["אירועים","events","wix"],
        sectionIds: ["section-events-page-07", FOOTER],
      },
      {
        title: "אירועים – רך",
        description: "מפגשים באווירה נעימה",
        slugSuggestion: "events-08",
        keywords: ["אירועים","events","wix"],
        sectionIds: ["section-events-page-08", FOOTER],
      },
      {
        title: "אירועים – ליינאפ",
        description: "רשימת מופעים",
        slugSuggestion: "events-09",
        keywords: ["אירועים","events","wix"],
        sectionIds: ["section-events-page-09", FOOTER],
      },
      {
        title: "אירועים – RSVP",
        description: "טופס שמירת מקום",
        slugSuggestion: "events-10",
        keywords: ["אירועים","events","wix"],
        sectionIds: ["section-events-page-10", FOOTER],
      },
    ],
  },
  {
    category: "testimonials",
    idPrefix: "page-testimonials",
    pages: [
      {
        title: "ביקורות – מפוצל",
        description: "ציטוט מוביל וכרטיסים",
        slugSuggestion: "testimonials-01",
        keywords: ["ביקורות","testimonials","reviews","wix"],
        sectionIds: ["section-testimonials-page-01", FOOTER],
      },
      {
        title: "ביקורות – מרכזי",
        description: "אמון שנבנה מתוצאות",
        slugSuggestion: "testimonials-02",
        keywords: ["ביקורות","testimonials","reviews","wix"],
        sectionIds: ["section-testimonials-page-02", FOOTER],
      },
      {
        title: "ביקורות – מגזין",
        description: "סיפורי הצלחה",
        slugSuggestion: "testimonials-03",
        keywords: ["ביקורות","testimonials","reviews","wix"],
        sectionIds: ["section-testimonials-page-03", FOOTER],
      },
      {
        title: "ביקורות – קיר",
        description: "רשת המלצות",
        slugSuggestion: "testimonials-04",
        keywords: ["ביקורות","testimonials","reviews","wix"],
        sectionIds: ["section-testimonials-page-04", FOOTER],
      },
      {
        title: "ביקורות – מסע",
        description: "המלצות על ציר זמן",
        slugSuggestion: "testimonials-05",
        keywords: ["ביקורות","testimonials","reviews","wix"],
        sectionIds: ["section-testimonials-page-05", FOOTER],
      },
      {
        title: "ביקורות – דירוגים",
        description: "מספרים וציטוטים",
        slugSuggestion: "testimonials-06",
        keywords: ["ביקורות","testimonials","reviews","wix"],
        sectionIds: ["section-testimonials-page-06", FOOTER],
      },
      {
        title: "ביקורות – כהה",
        description: "קולות דרמטיים",
        slugSuggestion: "testimonials-07",
        keywords: ["ביקורות","testimonials","reviews","wix"],
        sectionIds: ["section-testimonials-page-07", FOOTER],
      },
      {
        title: "ביקורות – רך",
        description: "מילים חמות",
        slugSuggestion: "testimonials-08",
        keywords: ["ביקורות","testimonials","reviews","wix"],
        sectionIds: ["section-testimonials-page-08", FOOTER],
      },
      {
        title: "ביקורות – רשימה",
        description: "ציטוטים נבחרים",
        slugSuggestion: "testimonials-09",
        keywords: ["ביקורות","testimonials","reviews","wix"],
        sectionIds: ["section-testimonials-page-09", FOOTER],
      },
      {
        title: "ביקורות – כתיבה",
        description: "טופס להשארת ביקורת",
        slugSuggestion: "testimonials-10",
        keywords: ["ביקורות","testimonials","reviews","wix"],
        sectionIds: ["section-testimonials-page-10", FOOTER],
      },
    ],
  },
  {
    category: "team",
    idPrefix: "page-team",
    pages: [
      {
        title: "צוות – מפוצל",
        description: "האנשים מאחורי העשייה",
        slugSuggestion: "team-01",
        keywords: ["צוות","team","wix"],
        sectionIds: ["section-team-page-01", FOOTER],
      },
      {
        title: "צוות – מרכזי",
        description: "צוות קטן עם השפעה",
        slugSuggestion: "team-02",
        keywords: ["צוות","team","wix"],
        sectionIds: ["section-team-page-02", FOOTER],
      },
      {
        title: "צוות – מגזין",
        description: "כישרונות שמניעים מותגים",
        slugSuggestion: "team-03",
        keywords: ["צוות","team","wix"],
        sectionIds: ["section-team-page-03", FOOTER],
      },
      {
        title: "צוות – כרטיסים",
        description: "שישה פנים להכיר",
        slugSuggestion: "team-04",
        keywords: ["צוות","team","wix"],
        sectionIds: ["section-team-page-04", FOOTER],
      },
      {
        title: "צוות – תרבות",
        description: "איך עובדים יחד",
        slugSuggestion: "team-05",
        keywords: ["צוות","team","wix"],
        sectionIds: ["section-team-page-05", FOOTER],
      },
      {
        title: "צוות – מספרים",
        description: "שנים פרויקטים ואנשים",
        slugSuggestion: "team-06",
        keywords: ["צוות","team","wix"],
        sectionIds: ["section-team-page-06", FOOTER],
      },
      {
        title: "צוות – כהה",
        description: "כישרון מאחורי הקלעים",
        slugSuggestion: "team-07",
        keywords: ["צוות","team","wix"],
        sectionIds: ["section-team-page-07", FOOTER],
      },
      {
        title: "צוות – רך",
        description: "יותר מעסק — קהילה",
        slugSuggestion: "team-08",
        keywords: ["צוות","team","wix"],
        sectionIds: ["section-team-page-08", FOOTER],
      },
      {
        title: "צוות – תפקידים",
        description: "רשימת התמחויות",
        slugSuggestion: "team-09",
        keywords: ["צוות","team","wix"],
        sectionIds: ["section-team-page-09", FOOTER],
      },
      {
        title: "צוות – גיוס",
        description: "טופס מועמדות",
        slugSuggestion: "team-10",
        keywords: ["צוות","team","wix"],
        sectionIds: ["section-team-page-10", FOOTER],
      },
    ],
  },
  {
    category: "faq",
    idPrefix: "page-faq",
    pages: [
      {
        title: "שאלות נפוצות – מפוצל",
        description: "תשובות וכרטיסי נושאים",
        slugSuggestion: "faq-01",
        keywords: ["שאלות נפוצות","faq","wix"],
        sectionIds: ["section-faq-page-01", FOOTER],
      },
      {
        title: "שאלות נפוצות – מרכזי",
        description: "מרכז עזרה נקי",
        slugSuggestion: "faq-02",
        keywords: ["שאלות נפוצות","faq","wix"],
        sectionIds: ["section-faq-page-02", FOOTER],
      },
      {
        title: "שאלות נפוצות – מגזין",
        description: "שאלות עם הקשר",
        slugSuggestion: "faq-03",
        keywords: ["שאלות נפוצות","faq","wix"],
        sectionIds: ["section-faq-page-03", FOOTER],
      },
      {
        title: "שאלות נפוצות – נושאים",
        description: "קטגוריות שאלות",
        slugSuggestion: "faq-04",
        keywords: ["שאלות נפוצות","faq","wix"],
        sectionIds: ["section-faq-page-04", FOOTER],
      },
      {
        title: "שאלות נפוצות – שלבים",
        description: "לפי שלבי שימוש",
        slugSuggestion: "faq-05",
        keywords: ["שאלות נפוצות","faq","wix"],
        sectionIds: ["section-faq-page-05", FOOTER],
      },
      {
        title: "שאלות נפוצות – מהיר",
        description: "עובדות בקצרה",
        slugSuggestion: "faq-06",
        keywords: ["שאלות נפוצות","faq","wix"],
        sectionIds: ["section-faq-page-06", FOOTER],
      },
      {
        title: "שאלות נפוצות – כהה",
        description: "תמיכה בלי בלבול",
        slugSuggestion: "faq-07",
        keywords: ["שאלות נפוצות","faq","wix"],
        sectionIds: ["section-faq-page-07", FOOTER],
      },
      {
        title: "שאלות נפוצות – רך",
        description: "עזרה בשפה פשוטה",
        slugSuggestion: "faq-08",
        keywords: ["שאלות נפוצות","faq","wix"],
        sectionIds: ["section-faq-page-08", FOOTER],
      },
      {
        title: "שאלות נפוצות – רשימה",
        description: "שאלות ותשובות",
        slugSuggestion: "faq-09",
        keywords: ["שאלות נפוצות","faq","wix"],
        sectionIds: ["section-faq-page-09", FOOTER],
      },
      {
        title: "שאלות נפוצות – פנייה",
        description: "טופס אם אין תשובה",
        slugSuggestion: "faq-10",
        keywords: ["שאלות נפוצות","faq","wix"],
        sectionIds: ["section-faq-page-10", FOOTER],
      },
    ],
  },
  {
    category: "promote",
    idPrefix: "page-landing",
    pages: [
      {
        title: "נחיתה – מפוצלת",
        description: "הצעה אחת עם CTA חזק",
        slugSuggestion: "landing-01",
        keywords: ["נחיתה","landing","promote","wix"],
        sectionIds: ["section-landing-page-01", FOOTER],
      },
      {
        title: "נחיתה – מרכזית",
        description: "קמפיין ממוקד המרה",
        slugSuggestion: "landing-02",
        keywords: ["נחיתה","landing","promote","wix"],
        sectionIds: ["section-landing-page-02", FOOTER],
      },
      {
        title: "נחיתה – מגזין",
        description: "מבצע מוגבל בזמן",
        slugSuggestion: "landing-03",
        keywords: ["נחיתה","landing","promote","wix"],
        sectionIds: ["section-landing-page-03", FOOTER],
      },
      {
        title: "נחיתה – יתרונות",
        description: "כרטיסי ערך להחלטה מהירה",
        slugSuggestion: "landing-04",
        keywords: ["נחיתה","landing","promote","wix"],
        sectionIds: ["section-landing-page-04", FOOTER],
      },
      {
        title: "נחיתה – שלבים",
        description: "שלושה צעדים להטבה",
        slugSuggestion: "landing-05",
        keywords: ["נחיתה","landing","promote","wix"],
        sectionIds: ["section-landing-page-05", FOOTER],
      },
      {
        title: "נחיתה – הוכחות",
        description: "מספרים שמחזקים הצעה",
        slugSuggestion: "landing-06",
        keywords: ["נחיתה","landing","promote","wix"],
        sectionIds: ["section-landing-page-06", FOOTER],
      },
      {
        title: "נחיתה – כהה",
        description: "גישה מוקדמת בלעדית",
        slugSuggestion: "landing-07",
        keywords: ["נחיתה","landing","promote","wix"],
        sectionIds: ["section-landing-page-07", FOOTER],
      },
      {
        title: "נחיתה – רכה",
        description: "הזמנה בלי לחץ",
        slugSuggestion: "landing-08",
        keywords: ["נחיתה","landing","promote","wix"],
        sectionIds: ["section-landing-page-08", FOOTER],
      },
      {
        title: "נחיתה – תכולה",
        description: "מה מקבלים בחבילה",
        slugSuggestion: "landing-09",
        keywords: ["נחיתה","landing","promote","wix"],
        sectionIds: ["section-landing-page-09", FOOTER],
      },
      {
        title: "נחיתה – טופס",
        description: "טופס לידים דומיננטי",
        slugSuggestion: "landing-10",
        keywords: ["נחיתה","landing","promote","wix"],
        sectionIds: ["section-landing-page-10", FOOTER],
      },
    ],
  },
  {
    category: "resume",
    idPrefix: "page-resume",
    pages: [
      {
        title: "קורות חיים – מפוצל",
        description: "פרופיל מקצועי במבט אחד",
        slugSuggestion: "resume-01",
        keywords: ["קורות חיים","resume","cv","wix"],
        sectionIds: ["section-resume-page-01", FOOTER],
      },
      {
        title: "קורות חיים – מרכזי",
        description: "ניסיון כישורים ותוצאות",
        slugSuggestion: "resume-02",
        keywords: ["קורות חיים","resume","cv","wix"],
        sectionIds: ["section-resume-page-02", FOOTER],
      },
      {
        title: "קורות חיים – מגזין",
        description: "סיפור מקצועי editorial",
        slugSuggestion: "resume-03",
        keywords: ["קורות חיים","resume","cv","wix"],
        sectionIds: ["section-resume-page-03", FOOTER],
      },
      {
        title: "קורות חיים – כרטיסים",
        description: "כישורים וניסיון נבחר",
        slugSuggestion: "resume-04",
        keywords: ["קורות חיים","resume","cv","wix"],
        sectionIds: ["section-resume-page-04", FOOTER],
      },
      {
        title: "קורות חיים – ציר",
        description: "דרך הקריירה",
        slugSuggestion: "resume-05",
        keywords: ["קורות חיים","resume","cv","wix"],
        sectionIds: ["section-resume-page-05", FOOTER],
      },
      {
        title: "קורות חיים – הישגים",
        description: "מספרים מהקריירה",
        slugSuggestion: "resume-06",
        keywords: ["קורות חיים","resume","cv","wix"],
        sectionIds: ["section-resume-page-06", FOOTER],
      },
      {
        title: "קורות חיים – כהה",
        description: "פרופיל בולט",
        slugSuggestion: "resume-07",
        keywords: ["קורות חיים","resume","cv","wix"],
        sectionIds: ["section-resume-page-07", FOOTER],
      },
      {
        title: "קורות חיים – רך",
        description: "טון אישי",
        slugSuggestion: "resume-08",
        keywords: ["קורות חיים","resume","cv","wix"],
        sectionIds: ["section-resume-page-08", FOOTER],
      },
      {
        title: "קורות חיים – רשימה",
        description: "ניסיון תעסוקתי מפורט",
        slugSuggestion: "resume-09",
        keywords: ["קורות חיים","resume","cv","wix"],
        sectionIds: ["section-resume-page-09", FOOTER],
      },
      {
        title: "קורות חיים – גיוס",
        description: "טופס פנייה להזדמנות",
        slugSuggestion: "resume-10",
        keywords: ["קורות חיים","resume","cv","wix"],
        sectionIds: ["section-resume-page-10", FOOTER],
      },
    ],
  }
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
        id: `${categoryDef.idPrefix}-${num}`,
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
