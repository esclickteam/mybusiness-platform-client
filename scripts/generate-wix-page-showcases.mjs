import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(
  __dirname,
  "../src/components/site-builder/studio/visual-editor/library",
);

const LAYOUTS = [
  "split",
  "center",
  "magazine",
  "cards",
  "timeline",
  "stats",
  "dark",
  "lifestyle",
  "listMedia",
  "ctaForm",
];

const HEIGHTS = {
  split: "1480px",
  center: "1400px",
  magazine: "1320px",
  cards: "1120px",
  timeline: "1280px",
  stats: "1280px",
  dark: "1320px",
  lifestyle: "1280px",
  listMedia: "1200px",
  ctaForm: "1180px",
};

const BGS = {
  split: "#ffffff",
  center: "#ffffff",
  magazine: "#ffffff",
  cards: "#ffffff",
  timeline: "#ffffff",
  stats: "#ffffff",
  dark: "#0f1115",
  lifestyle: "#faf9f7",
  listMedia: "#ffffff",
  ctaForm: "#ffffff",
};

const DEFAULT_ITEMS = [
  { title: "ערך ברור", copy: "מסר מדויק שמדבר לקהל הנכון." },
  { title: "עיצוב חזק", copy: "קומפוזיציה שנראית מקצועית מהשנייה הראשונה." },
  { title: "המרה", copy: "קריאה לפעולה שמניעה את הצעד הבא." },
  { title: "אמון", copy: "הוכחות חברתיות ותוצאות אמיתיות." },
  { title: "פשטות", copy: "מבנה נקי שקל לסרוק ולהבין." },
  { title: "גמישות", copy: "מתאים לעסקים קטנים וצומחים." },
];

const DEFAULT_STATS = [
  { value: "98%", label: "שביעות רצון" },
  { value: "3x", label: "יותר פניות" },
  { value: "14", label: "ימים להשקה" },
  { value: "24/7", label: "זמינות" },
];

function esc(s) {
  return String(s)
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/\r/g, "")
    .replace(/\n/g, "\\n");
}

function makePages(heName, configs) {
  return configs.map((cfg, index) => {
    const layout = LAYOUTS[index];
    return {
      key: String(index + 1).padStart(2, "0"),
      layout,
      title: `${heName} – ${cfg.label}`,
      eyebrow: cfg.eyebrow,
      h: cfg.h,
      sub: cfg.sub,
      cta: cfg.cta,
      cta2: cfg.cta2,
      img: cfg.img,
      items: cfg.items || DEFAULT_ITEMS,
      stats: cfg.stats || DEFAULT_STATS,
    };
  });
}

const categories = [
  {
    file: "homePageShowcaseSections.ts",
    exportName: "HOME_PAGE_SHOWCASE_SECTIONS",
    category: "hero",
    idPrefix: "section-home-page",
    keywords: ["בית", "ראשי", "home", "hero", "wix"],
    pages: makePages("דף הבית", [
      {
        label: "פתיחה מפוצלת",
        eyebrow: "ברוכים הבאים",
        h: "נהלו את העסק\\nבמקום אחד",
        sub: "פלטפורמה חכמה ללקוחות, תורים ו-CRM — הכל מחובר.",
        cta: "התחילו עכשיו",
        cta2: "למד עוד",
        img: "office",
      },
      {
        label: "Editorial",
        eyebrow: "HOME",
        h: "המקום שלך\\nלהתחיל מחדש",
        sub: "עיצוב נקי, מסר ברור וקריאה לפעולה אחת.",
        cta: "קבעו שיחה",
        img: "nature",
      },
      {
        label: "מגזין",
        eyebrow: "STUDIO",
        h: "רעיונות\\nשאי אפשר לפספס",
        sub: "קומפוזיציה מגזינית עם תמונות חזקות.",
        cta: "גלו עוד",
        img: "workspace",
      },
      {
        label: "כרטיסי ערך",
        eyebrow: "SERVICES",
        h: "כל מה שהעסק\\nצריך כדי לצמוח",
        sub: "שישה כרטיסים ויזואליים במבט אחד.",
        cta: "לכל השירותים",
        img: "tech",
      },
      {
        label: "תהליך",
        eyebrow: "HOW IT WORKS",
        h: "מארבעה שלבים\\nלעסק מסודר",
        sub: "תהליך ברור שמוריד עומס ומעלה תוצאות.",
        cta: "התחילו בשלב 1",
        img: "finance",
        items: [
          { title: "מקימים פרופיל", copy: "פרטי העסק והשירותים.", meta: "שלב 01" },
          { title: "בונים אתר", copy: "תבנית או AI.", meta: "שלב 02" },
          { title: "מחברים CRM", copy: "לידים ותורים.", meta: "שלב 03" },
          { title: "מפרסמים", copy: "יוצאים לאוויר.", meta: "שלב 04" },
          { title: "משתפרים", copy: "המלצות חכמות.", meta: "שלב 05" },
        ],
      },
      {
        label: "מספרים",
        eyebrow: "RESULTS",
        h: "תוצאות\\nשמדברות בעד עצמן",
        sub: "שקיפות מלאה: מספרים, סיפור וערך ממשי.",
        cta: "ראו דמו",
        img: "office",
      },
      {
        label: "כהה קולנועי",
        eyebrow: "PREMIUM",
        h: "נוכחות דיגיטלית\\nברמה אחרת",
        sub: "פתיחה דרמטית עם מסר חד.",
        cta: "הצטרפו עכשיו",
        img: "abstract",
      },
      {
        label: "לייפסטייל",
        eyebrow: "WELLNESS",
        h: "אימון שמשנה\\nאת היום שלכם",
        sub: "אווירה רכה ותמונה גדולה שמזמינה לפעולה.",
        cta: "קבעו אימון",
        img: "fitness",
      },
      {
        label: "רשימה ומדיה",
        eyebrow: "FEATURES",
        h: "הכלים שהופכים\\nעסק לעסק מסודר",
        sub: "רשימת יתרונות לצד תמונה דומיננטית.",
        cta: "נסו בחינם",
        img: "ecommerce",
      },
      {
        label: "המרה",
        eyebrow: "GET STARTED",
        h: "בואו נבנה\\nאת האתר שלכם",
        sub: "טופס בולט ומסר ברור לפנייה מיידית.",
        cta: "שלחו פרטים",
        cta2: "דברו איתנו",
        img: "hospitality",
      },
    ]),
  },
  {
    file: "servicesPageShowcaseSections.ts",
    exportName: "SERVICES_PAGE_SHOWCASE_SECTIONS",
    category: "services",
    idPrefix: "section-services-page",
    keywords: ["שירותים", "services", "wix"],
    pages: makePages("שירותים", [
      { label: "מפוצל", eyebrow: "SERVICES", h: "שירותים\\nשמובילים לתוצאה", sub: "הצגת שירותים עם תמונה חזקה וכרטיסים ברורים.", cta: "בחרו שירות", cta2: "דברו איתנו", img: "tech" },
      { label: "מרכזי", eyebrow: "WHAT WE OFFER", h: "המומחיות\\nשלנו בשירותכם", sub: "עמוד שירותים נקי עם מיקוד בהמרה.", cta: "לכל השירותים", img: "office" },
      { label: "מגזין", eyebrow: "EXPERTISE", h: "שירותים\\nבסגנון סטודיו", sub: "פריסה מגזינית לשירותים פרימיום.", cta: "גלו שירות", img: "workspace" },
      { label: "כרטיסים", eyebrow: "PACKAGES", h: "שישה שירותים\\nלבחירה", sub: "רשת כרטיסים ויזואלית עם תיאורים קצרים.", cta: "השוו חבילות", img: "product" },
      { label: "תהליך", eyebrow: "PROCESS", h: "איך העבודה\\nמתבצעת", sub: "שירותים מוצגים כמסע לקוח ברור.", cta: "התחילו תהליך", img: "finance" },
      { label: "תוצאות", eyebrow: "IMPACT", h: "שירותים\\nעם מדדים", sub: "מחברים בין שירות לתוצאה עסקית.", cta: "ראו תוצאות", img: "finance" },
      { label: "כהה", eyebrow: "PREMIUM SERVICES", h: "שירותים\\nברמת בוטיק", sub: "חוויית שירות יוקרתית על רקע כהה.", cta: "הזמינו פגישה", img: "abstract" },
      { label: "רך", eyebrow: "CARE", h: "שירות אישי\\nשמרגיש נכון", sub: "טון חם לשירותי טיפוח, בריאות וליווי.", cta: "קבעו תור", img: "wellness" },
      { label: "רשימה", eyebrow: "MENU", h: "קטלוג שירותים\\nמסודר", sub: "רשימה ברורה לצד מדיה משכנעת.", cta: "בחרו מהרשימה", img: "beauty" },
      { label: "פנייה", eyebrow: "BOOK NOW", h: "השירות הנכון\\nמתחיל בשיחה", sub: "טופס קביעה לצד יתרונות השירות.", cta: "שלחו בקשה", cta2: "התקשרו", img: "medical" },
    ]),
  },
  {
    file: "galleryPageShowcaseSections.ts",
    exportName: "GALLERY_PAGE_SHOWCASE_SECTIONS",
    category: "gallery",
    idPrefix: "section-gallery-page",
    keywords: ["גלריה", "gallery", "portfolio", "wix"],
    pages: makePages("גלריה", [
      { label: "מפוצלת", eyebrow: "GALLERY", h: "עבודות\\nשמספרות סיפור", sub: "גלריה עם תמונה דומיננטית וכרטיסי פרויקטים.", cta: "לכל העבודות", img: "architecture" },
      { label: "Editorial", eyebrow: "PORTFOLIO", h: "מבחר נבחר\\nמהסטודיו", sub: "תצוגה מרכזית עם דגש ויזואלי חזק.", cta: "צפו בגלריה", img: "interior" },
      { label: "קולאז׳", eyebrow: "SHOWCASE", h: "רגעים\\nשנבחרו בקפידה", sub: "פריסת קולאז׳ בהשראת מגזינים.", cta: "גלו פרויקט", img: "fashion" },
      { label: "רשת", eyebrow: "PROJECTS", h: "שישה פרויקטים\\nמובילים", sub: "גריד כרטיסים עם תמונות ותיאורים.", cta: "פתחו פרויקט", img: "workspace" },
      { label: "ציר", eyebrow: "JOURNEY", h: "מהרעיון\\nלתוצאה", sub: "גלריה שמוצגת כתהליך יצירה.", cta: "התחילו פרויקט", img: "construction" },
      { label: "הישגים", eyebrow: "HIGHLIGHTS", h: "העבודות\\nשמדברות הכי חזק", sub: "שילוב מספרים ותצוגה ויזואלית.", cta: "ראו עוד", img: "architecture" },
      { label: "כהה", eyebrow: "DARK GALLERY", h: "ויזואליות\\nדרמטית", sub: "גלריה על רקע כהה למותגי פרימיום.", cta: "היכנסו לגלריה", img: "abstract" },
      { label: "רכה", eyebrow: "MOOD", h: "אווירה\\nשנשארת בזיכרון", sub: "תצוגה לייפסטייל רגועה ומזמינה.", cta: "שמרו השראה", img: "beauty" },
      { label: "רשימה", eyebrow: "SELECTED WORK", h: "פרויקטים\\nנבחרים", sub: "רשימת עבודות לצד מדיה גדולה.", cta: "צפו בפרטים", img: "interior" },
      { label: "פנייה", eyebrow: "COLLABORATE", h: "רוצים פרויקט\\nכזה?", sub: "גלריה שמסתיימת בטופס יצירת קשר.", cta: "דברו איתנו", img: "event" },
    ]),
  },
  {
    file: "contactPageShowcaseSections.ts",
    exportName: "CONTACT_PAGE_SHOWCASE_SECTIONS",
    category: "contact",
    idPrefix: "section-contact-page",
    keywords: ["צור קשר", "contact", "wix"],
    pages: makePages("יצירת קשר", [
      { label: "מפוצל", eyebrow: "CONTACT", h: "נשמח\\nלשמוע מכם", sub: "פרטי קשר ברורים לצד טופס וכרטיסי מידע.", cta: "שלחו הודעה", cta2: "התקשרו", img: "office" },
      { label: "מרכזי", eyebrow: "LET'S TALK", h: "השיחה הבאה\\nמתחילה כאן", sub: "עמוד קשר נקי עם מיקוד בהמרה.", cta: "כתבו לנו", img: "team" },
      { label: "מגזין", eyebrow: "STUDIO DESK", h: "בואו נדבר\\nעל הפרויקט", sub: "פריסה ויזואלית חמה ליצירת קשר.", cta: "קבעו שיחה", img: "workspace" },
      { label: "ערוצים", eyebrow: "CHANNELS", h: "כל דרכי\\nההתקשרות", sub: "כרטיסי טלפון, מייל, כתובת ווואטסאפ.", cta: "בחרו ערוץ", img: "tech" },
      { label: "תהליך", eyebrow: "NEXT STEPS", h: "מה קורה\\nאחרי שפונים", sub: "שקיפות מלאה לגבי תהליך המענה.", cta: "התחילו עכשיו", img: "finance" },
      { label: "אמון", eyebrow: "SUPPORT", h: "שירות לקוחות\\nשאפשר לסמוך עליו", sub: "מספרים וסיבות לפנות בביטחון.", cta: "פתחו פנייה", img: "medical" },
      { label: "כהה", eyebrow: "PRIVATE LINE", h: "יצירת קשר\\nבסגנון פרימיום", sub: "עמוד קשר דרמטי למותגים יוקרתיים.", cta: "השאירו פרטים", img: "abstract" },
      { label: "חם", eyebrow: "WELCOME", h: "דלת פתוחה\\nלשיחה אמיתית", sub: "טון חם ומזמין לעסקים מקומיים.", cta: "שלחו הודעה", img: "hospitality" },
      { label: "מיקום", eyebrow: "VISIT US", h: "בואו לבקר\\nאו כתבו מרחוק", sub: "רשימת פרטים לצד תמונת המקום.", cta: "נווטו אלינו", img: "architecture" },
      { label: "טופס", eyebrow: "MESSAGE", h: "השאירו פרטים\\nונחזור אליכם", sub: "טופס גדול וברור עם יתרונות קצרים.", cta: "שליחה", cta2: "וואטסאפ", img: "office" },
    ]),
  },
  {
    file: "landingPageShowcaseSections.ts",
    exportName: "LANDING_PAGE_SHOWCASE_SECTIONS",
    category: "promote",
    idPrefix: "section-landing-page",
    keywords: ["נחיתה", "landing", "promote", "wix"],
    pages: makePages("נחיתה", [
      { label: "מפוצלת", eyebrow: "LANDING", h: "הצעה אחת\\nשאי אפשר לפספס", sub: "עמוד נחיתה ממוקד עם CTA חזק.", cta: "להרשמה", cta2: "למידע", img: "product" },
      { label: "מרכזית", eyebrow: "CAMPAIGN", h: "השקה ממוקדת\\nשמובילה לפעולה", sub: "מינימום הסחות דעת, מקסימום המרה.", cta: "הצטרפו עכשיו", img: "tech" },
      { label: "מגזין", eyebrow: "OFFER", h: "מבצע מוגבל\\nבזמן", sub: "סיפור ויזואלי סביב הצעה אחת.", cta: "מימוש ההטבה", img: "fashion" },
      { label: "כרטיסים", eyebrow: "BENEFITS", h: "למה זה\\nמשתלם עכשיו", sub: "יתרונות בקלפים שמאיצים החלטה.", cta: "אני בפנים", img: "ecommerce" },
      { label: "תהליך", eyebrow: "STEPS", h: "שלושה צעדים\\nלהטבה", sub: "מסע קצר וברור עד להמרה.", cta: "התחילו", img: "event" },
      { label: "הוכחות", eyebrow: "PROOF", h: "המספרים\\nמאחורי ההצעה", sub: "סטטיסטיקות שמחזקות את הקריאה לפעולה.", cta: "נסו בלי סיכון", img: "finance" },
      { label: "כהה", eyebrow: "EXCLUSIVE", h: "גישה מוקדמת\\nלחברים בלבד", sub: "תחושת בלעדיות על רקע כהה.", cta: "בקשו גישה", img: "abstract" },
      { label: "רכה", eyebrow: "SOFT SELL", h: "הזמנה\\nבלי לחץ", sub: "נחיתה רגועה למותגי לייפסטייל.", cta: "שמרו מקום", img: "wellness" },
      { label: "רשימה", eyebrow: "INCLUDED", h: "מה מקבלים\\nבחבילה", sub: "רשימת תכולה לצד תמונה מפתה.", cta: "לקנייה", img: "product" },
      { label: "טופס", eyebrow: "LEAD FORM", h: "השאירו פרטים\\nוקבלו גישה", sub: "טופס לידים דומיננטי עם יתרונות.", cta: "שלחו", cta2: "חזרו אליי", img: "tech" },
    ]),
  },
  {
    file: "productsPageShowcaseSections.ts",
    exportName: "PRODUCTS_PAGE_SHOWCASE_SECTIONS",
    category: "commerce",
    idPrefix: "section-products-page",
    keywords: ["מוצרים", "products", "shop", "wix"],
    pages: makePages("מוצרים", [
      { label: "מפוצל", eyebrow: "SHOP", h: "מוצרים\\nשנבחרו בקפידה", sub: "חנות ויזואלית עם הדגשת מוצר מוביל.", cta: "לקנייה", cta2: "לכל המוצרים", img: "ecommerce" },
      { label: "מרכזי", eyebrow: "COLLECTION", h: "הקולקציה\\nהחדשה כאן", sub: "עמוד מוצרים נקי וממוקד המרה.", cta: "גלו קולקציה", img: "product" },
      { label: "מגזין", eyebrow: "CURATED", h: "בחירות\\nשל המותג", sub: "תצוגת מוצרים בסגנון editorial.", cta: "הוסיפו לסל", img: "fashion" },
      { label: "רשת", eyebrow: "CATALOG", h: "שישה מוצרים\\nמובילים", sub: "גריד מוצרים עם תיאורים קצרים.", cta: "פתחו חנות", img: "ecommerce" },
      { label: "מסע", eyebrow: "FROM IDEA", h: "מהרעיון\\nלמוצר מדף", sub: "סיפור מוצר כתהליך.", cta: "הכירו את הקו", img: "skincare" },
      { label: "ביצועים", eyebrow: "BEST SELLERS", h: "הנמכרים\\nביותר", sub: "מספרים לצד מוצרים מובילים.", cta: "קנו עכשיו", img: "product" },
      { label: "כהה", eyebrow: "LUXE", h: "קולקציית\\nפרימיום", sub: "חוויית קנייה יוקרתית.", cta: "גלו פרימיום", img: "fashion" },
      { label: "רכה", eyebrow: "DAILY", h: "מוצרים\\nלשגרה יפה", sub: "אווירה רכה למוצרי לייפסטייל.", cta: "הוסיפו לסל", img: "skincare" },
      { label: "רשימה", eyebrow: "PICKS", h: "המלצות\\nהשבוע", sub: "רשימת מוצרים לצד תמונה גדולה.", cta: "לרכישה", img: "ecommerce" },
      { label: "הזמנה", eyebrow: "ORDER", h: "הזמינו\\nבכמה קליקים", sub: "טופס הזמנה מהיר עם יתרונות.", cta: "שלחו הזמנה", img: "product" },
    ]),
  },
  {
    file: "pricingPageShowcaseSections.ts",
    exportName: "PRICING_PAGE_SHOWCASE_SECTIONS",
    category: "pricing",
    idPrefix: "section-pricing-page",
    keywords: ["תמחור", "pricing", "wix"],
    pages: makePages("תמחור", [
      { label: "מפוצל", eyebrow: "PRICING", h: "מחירים\\nשקופים ופשוטים", sub: "השוואת חבילות עם CTA ברור.", cta: "בחרו חבילה", cta2: "שאלו אותנו", img: "finance" },
      { label: "מרכזי", eyebrow: "PLANS", h: "בחרו את\\nהמסלול שלכם", sub: "תמחור נקי שקל להשוות.", cta: "התחילו ניסיון", img: "tech" },
      { label: "מגזין", eyebrow: "VALUE", h: "הערך\\nמאחורי המחיר", sub: "סיפור ויזואלי סביב חבילות.", cta: "השוו מסלולים", img: "office" },
      { label: "כרטיסים", eyebrow: "TIERS", h: "שלוש חבילות\\nלכל צורך", sub: "כרטיסי מחיר ברורים עם יתרונות.", cta: "בחרו עכשיו", img: "product" },
      { label: "תהליך", eyebrow: "ONBOARDING", h: "מה כלול\\nבכל שלב", sub: "תמחור שמוצג כמסע לקוח.", cta: "הצטרפו", img: "finance" },
      { label: "ROI", eyebrow: "NUMBERS", h: "החזר השקעה\\nשרואים", sub: "מספרים שמחזקים את בחירת החבילה.", cta: "חשבו חיסכון", img: "finance" },
      { label: "כהה", eyebrow: "PRO", h: "מסלול Pro\\nלעסקים רציניים", sub: "תמחור פרימיום על רקע כהה.", cta: "שדרגו ל-Pro", img: "abstract" },
      { label: "רך", eyebrow: "SIMPLE", h: "תמחור\\nבלי הפתעות", sub: "שפה רגועה למחירים שקופים.", cta: "בחרו מסלול", img: "wellness" },
      { label: "השוואה", eyebrow: "COMPARE", h: "השוו\\nותבחרו נכון", sub: "רשימת הבדלים לצד ויזואל חזק.", cta: "השוואה מלאה", img: "tech" },
      { label: "טופס", eyebrow: "CUSTOM QUOTE", h: "צריכים\\nהצעה מותאמת?", sub: "טופס להצעת מחיר אישית.", cta: "בקשו הצעה", img: "office" },
    ]),
  },
  {
    file: "blogPageShowcaseSections.ts",
    exportName: "BLOG_PAGE_SHOWCASE_SECTIONS",
    category: "blog",
    idPrefix: "section-blog-page",
    keywords: ["בלוג", "blog", "wix"],
    pages: makePages("בלוג", [
      { label: "מפוצל", eyebrow: "BLOG", h: "תובנות\\nלעסק צומח", sub: "עמוד בלוג עם מאמר מוביל וכרטיסים.", cta: "לכל הפוסטים", img: "education" },
      { label: "מרכזי", eyebrow: "INSIGHTS", h: "ידע שעוזר\\nלקבל החלטות", sub: "פתיחה editorial לבלוג מקצועי.", cta: "התחילו לקרוא", img: "office" },
      { label: "מגזין", eyebrow: "STORIES", h: "סיפורים\\nמהשטח", sub: "פריסת מגזין למאמרים נבחרים.", cta: "גלו כתבה", img: "workspace" },
      { label: "כרטיסים", eyebrow: "LATEST", h: "הפוסטים\\nהאחרונים", sub: "רשת כרטיסי מאמרים ויזואלית.", cta: "עוד מאמרים", img: "tech" },
      { label: "סדרה", eyebrow: "SERIES", h: "סדרת מדריכים\\nשלב אחר שלב", sub: "בלוג שמוצג כמסע למידה.", cta: "למדריך הראשון", img: "education" },
      { label: "השפעה", eyebrow: "TRENDING", h: "הנושאים\\nשכולם קוראים", sub: "מספרים לצד תוכן פופולרי.", cta: "לטרנדים", img: "finance" },
      { label: "כהה", eyebrow: "DEEP DIVES", h: "מאמרים\\nלעומק", sub: "בלוג כהה לתוכן מקצועי כבד.", cta: "צללו פנימה", img: "abstract" },
      { label: "רך", eyebrow: "NOTES", h: "הערות קצרות\\nמהיום־יום", sub: "טון אישי ורגוע לבלוג לייפסטייל.", cta: "קראו הערה", img: "nature" },
      { label: "רשימה", eyebrow: "ARCHIVE", h: "ארכיון\\nמסודר", sub: "רשימת פוסטים לצד תמונה גדולה.", cta: "לכל הארכיון", img: "education" },
      { label: "ניוזלטר", eyebrow: "SUBSCRIBE", h: "קבלו תובנות\\nלמייל", sub: "טופס הרשמה דומיננטי לבלוג.", cta: "להרשמה", img: "office" },
    ]),
  },
  {
    file: "eventsPageShowcaseSections.ts",
    exportName: "EVENTS_PAGE_SHOWCASE_SECTIONS",
    category: "events",
    idPrefix: "section-events-page",
    keywords: ["אירועים", "events", "wix"],
    pages: makePages("אירועים", [
      { label: "מפוצל", eyebrow: "EVENTS", h: "אירועים\\nששווה להגיע אליהם", sub: "הדגשת אירוע קרוב וכרטיסי מופעים.", cta: "לרכישת כרטיס", cta2: "לכל האירועים", img: "event" },
      { label: "מרכזי", eyebrow: "UPCOMING", h: "מה קורה\\nהחודש", sub: "עמוד אירועים ממוקד וברור.", cta: "שמרו מקום", img: "hospitality" },
      { label: "מגזין", eyebrow: "EXPERIENCE", h: "חוויות\\nשנשארות", sub: "סיפור ויזואלי סביב אירוע מרכזי.", cta: "גלו חוויה", img: "event" },
      { label: "כרטיסים", eyebrow: "CALENDAR", h: "שישה אירועים\\nקרובים", sub: "רשת כרטיסי אירוע עם תאריכים.", cta: "ללוח השנה", img: "travel" },
      { label: "לוח זמנים", eyebrow: "SCHEDULE", h: "לו״ז מלא\\nליום האירוע", sub: "ציר זמן ברור למשתתפים.", cta: "הורידו לו״ז", img: "event" },
      { label: "השפעה", eyebrow: "COMMUNITY", h: "קהילה\\nשגדלה בכל מפגש", sub: "מספרים על קהל ומעורבות.", cta: "הצטרפו", img: "team" },
      { label: "כהה", eyebrow: "NIGHT", h: "אירוע לילה\\nבלתי נשכח", sub: "אווירה דרמטית לאירועי פרימיום.", cta: "הזמינו כרטיס", img: "abstract" },
      { label: "רך", eyebrow: "GATHER", h: "מפגשים\\nבאווירה נעימה", sub: "אירועים קהילתיים בטון חם.", cta: "אני מגיע/ה", img: "hospitality" },
      { label: "רשימה", eyebrow: "LINEUP", h: "הליינאפ\\nהמלא", sub: "רשימת מופעים לצד ויזואל גדול.", cta: "לפרטי האירוע", img: "event" },
      { label: "הרשמה", eyebrow: "RSVP", h: "שמרו מקום\\nלפני שייגמר", sub: "טופס הרשמה לאירוע.", cta: "RSVP", img: "hospitality" },
    ]),
  },
  {
    file: "testimonialsPageShowcaseSections.ts",
    exportName: "TESTIMONIALS_PAGE_SHOWCASE_SECTIONS",
    category: "testimonials",
    idPrefix: "section-testimonials-page",
    keywords: ["ביקורות", "testimonials", "reviews", "wix"],
    pages: makePages("ביקורות", [
      { label: "מפוצל", eyebrow: "REVIEWS", h: "לקוחות\\nשממליצים", sub: "עמוד ביקורות עם ציטוט מוביל וכרטיסים.", cta: "קראו עוד", img: "team" },
      { label: "מרכזי", eyebrow: "LOVED BY", h: "אמון שנבנה\\nמתוצאות", sub: "פתיחה נקייה סביב המלצות.", cta: "ראו המלצות", img: "office" },
      { label: "מגזין", eyebrow: "STORIES", h: "סיפורי הצלחה\\nאמיתיים", sub: "ביקורות בסגנון סיפור ויזואלי.", cta: "גלו סיפור", img: "portrait" },
      { label: "כרטיסים", eyebrow: "WALL", h: "קיר המלצות\\nמהשטח", sub: "רשת כרטיסי ביקורת.", cta: "לכל הביקורות", img: "team" },
      { label: "מסע", eyebrow: "JOURNEY", h: "מהלקוח אמר\\nאחרי התהליך", sub: "המלצות על ציר זמן.", cta: "התחילו גם אתם", img: "workspace" },
      { label: "דירוגים", eyebrow: "RATINGS", h: "המספרים\\nשל שביעות הרצון", sub: "סטטיסטיקות לצד ציטוטים.", cta: "בדקו דירוגים", img: "finance" },
      { label: "כהה", eyebrow: "VOICES", h: "קולות\\nשמכירים את העבודה", sub: "עמוד המלצות דרמטי.", cta: "הקשיבו ללקוחות", img: "abstract" },
      { label: "רך", eyebrow: "KIND WORDS", h: "מילים חמות\\nמלקוחות אמיתיים", sub: "טון רך להמלצות שירות.", cta: "קראו המלצה", img: "wellness" },
      { label: "רשימה", eyebrow: "QUOTES", h: "ציטוטים\\nנבחרים", sub: "רשימת המלצות לצד דיוקן.", cta: "עוד ציטוטים", img: "portrait" },
      { label: "השאירו ביקורת", eyebrow: "SHARE", h: "החוויה שלכם\\nחשובה לנו", sub: "טופס להשארת ביקורת.", cta: "כתבו ביקורת", img: "team" },
    ]),
  },
  {
    file: "teamPageShowcaseSections.ts",
    exportName: "TEAM_PAGE_SHOWCASE_SECTIONS",
    category: "team",
    idPrefix: "section-team-page",
    keywords: ["צוות", "team", "wix"],
    pages: makePages("צוות", [
      { label: "מפוצל", eyebrow: "TEAM", h: "האנשים\\nמאחורי העשייה", sub: "היכרות עם הצוות ועם הערכים.", cta: "הכירו את כולם", img: "team" },
      { label: "מרכזי", eyebrow: "PEOPLE", h: "צוות קטן\\nעם השפעה גדולה", sub: "עמוד צוות נקי ומזמין.", cta: "לפרופילים", img: "office" },
      { label: "מגזין", eyebrow: "CREW", h: "כישרונות\\nשמניעים מותגים", sub: "פריסה מגזינית לחברי צוות.", cta: "גלו מי אנחנו", img: "workspace" },
      { label: "כרטיסים", eyebrow: "MEMBERS", h: "שישה פנים\\nשכדאי להכיר", sub: "רשת כרטיסי צוות.", cta: "צרו קשר עם הצוות", img: "team" },
      { label: "מסע", eyebrow: "CULTURE", h: "איך אנחנו\\nעובדים יחד", sub: "תרבות ארגונית כתהליך.", cta: "הצטרפו אלינו", img: "office" },
      { label: "מספרים", eyebrow: "TOGETHER", h: "שנים, פרויקטים\\nואנשים", sub: "סטטיסטיקות על הצוות.", cta: "ראו קריירה", img: "finance" },
      { label: "כהה", eyebrow: "TALENT", h: "הצוות\\nשמאחורי הקלעים", sub: "תצוגת כישרון על רקע כהה.", cta: "דברו עם המומחים", img: "abstract" },
      { label: "רך", eyebrow: "FAMILY", h: "יותר מעסק\\nקהילה", sub: "טון חם לעמוד צוות.", cta: "הכירו מקרוב", img: "hospitality" },
      { label: "רשימה", eyebrow: "ROLES", h: "תפקידים\\nוהתמחויות", sub: "רשימת תפקידים לצד תמונה.", cta: "לפרטי התפקיד", img: "team" },
      { label: "גיוס", eyebrow: "CAREERS", h: "רוצים\\nלעבוד איתנו?", sub: "טופס מועמדות קצר.", cta: "שלחו קו״ח", img: "office" },
    ]),
  },
  {
    file: "faqPageShowcaseSections.ts",
    exportName: "FAQ_PAGE_SHOWCASE_SECTIONS",
    category: "faq",
    idPrefix: "section-faq-page",
    keywords: ["שאלות נפוצות", "faq", "wix"],
    pages: makePages("שאלות נפוצות", [
      { label: "מפוצל", eyebrow: "FAQ", h: "תשובות\\nלשאלות החשובות", sub: "עמוד FAQ עם כרטיסי נושאים.", cta: "לא מצאתם תשובה?", img: "education" },
      { label: "מרכזי", eyebrow: "HELP", h: "כל מה שרציתם\\nלדעת", sub: "פתיחה נקייה למרכז עזרה.", cta: "חיפוש תשובה", img: "office" },
      { label: "מגזין", eyebrow: "GUIDES", h: "שאלות\\nעם הקשר", sub: "FAQ בסגנון מדריך ויזואלי.", cta: "למדריכים", img: "workspace" },
      { label: "נושאים", eyebrow: "TOPICS", h: "נושאים\\nנפוצים", sub: "כרטיסי קטגוריות לשאלות.", cta: "בחרו נושא", img: "tech" },
      { label: "שלבים", eyebrow: "SETUP", h: "שאלות לפי\\nשלבי שימוש", sub: "FAQ על ציר תהליך.", cta: "להתחלה מהירה", img: "finance" },
      { label: "מהיר", eyebrow: "QUICK FACTS", h: "עובדות\\nבקצרה", sub: "מספרים ותשובות זריזות.", cta: "עוד פרטים", img: "tech" },
      { label: "כהה", eyebrow: "SUPPORT", h: "תמיכה\\nבלי בלבול", sub: "עמוד עזרה דרמטי וברור.", cta: "פתחו קריאה", img: "abstract" },
      { label: "רך", eyebrow: "FRIENDLY HELP", h: "עזרה\\nבשפה פשוטה", sub: "טון חם לשאלות נפוצות.", cta: "שאלו אותנו", img: "wellness" },
      { label: "רשימה", eyebrow: "ANSWERS", h: "שאלות\\nותשובות", sub: "רשימת FAQ לצד מדיה.", cta: "לכל השאלות", img: "education" },
      { label: "פנייה", eyebrow: "STILL STUCK", h: "עדיין צריכים\\nעזרה?", sub: "טופס פנייה בסוף עמוד FAQ.", cta: "שלחו שאלה", img: "office" },
    ]),
  },
  {
    file: "resumePageShowcaseSections.ts",
    exportName: "RESUME_PAGE_SHOWCASE_SECTIONS",
    category: "resume",
    idPrefix: "section-resume-page",
    keywords: ["קורות חיים", "resume", "cv", "wix"],
    pages: makePages("קורות חיים", [
      { label: "מפוצל", eyebrow: "RESUME", h: "פרופיל מקצועי\\nבמבט אחד", sub: "קו״ח ויזואלי עם ניסיון והדגשות.", cta: "הורידו PDF", cta2: "צרו קשר", img: "portrait" },
      { label: "מרכזי", eyebrow: "CV", h: "ניסיון, כישורים\\nותוצאות", sub: "עמוד קו״ח נקי וממוקד.", cta: "שלחו הצעה", img: "office" },
      { label: "מגזין", eyebrow: "PORTFOLIO CV", h: "הסיפור\\nהמקצועי שלי", sub: "קו״ח בסגנון editorial.", cta: "ראו פרויקטים", img: "workspace" },
      { label: "כרטיסים", eyebrow: "SKILLS", h: "כישורים\\nוניסיון נבחר", sub: "כרטיסי מיומנויות ותפקידים.", cta: "לפרטים", img: "tech" },
      { label: "ציר קריירה", eyebrow: "CAREER", h: "הדרך\\nעד היום", sub: "ציר זמן מקצועי.", cta: "הזמינו ראיון", img: "finance" },
      { label: "הישגים", eyebrow: "IMPACT", h: "מספרים\\nמהקריירה", sub: "הישגים מדידים לצד סיפור.", cta: "דברו איתי", img: "finance" },
      { label: "כהה", eyebrow: "PROFILE", h: "פרופיל\\nמקצועי בולט", sub: "קו״ח דרמטי למותג אישי.", cta: "צור קשר", img: "abstract" },
      { label: "רך", eyebrow: "ABOUT ME", h: "מי אני\\nומה אני מביא/ה", sub: "טון אישי לעמוד קו״ח.", cta: "בואו נדבר", img: "portrait" },
      { label: "רשימה", eyebrow: "EXPERIENCE", h: "ניסיון תעסוקתי\\nמפורט", sub: "רשימת תפקידים לצד דיוקן.", cta: "הורדה", img: "office" },
      { label: "הזמנה", eyebrow: "HIRE ME", h: "פנויים\\nלהזדמנות הבאה", sub: "טופס פנייה לגיוס.", cta: "שלחו הצעת עבודה", img: "team" },
    ]),
  },
];

function genFile(cat) {
  const lines = [];
  lines.push('import { VISUAL_LIBRARY_IMAGES as IMG } from "./libraryAssets";');
  lines.push('import type { VisualLibrarySectionTemplate } from "./visualLibraryTypes";');
  lines.push("import {");
  lines.push("  buildLayoutNodes,");
  lines.push("  makePageSection,");
  lines.push("  type PageLayoutKind,");
  lines.push('} from "./pageShowcaseHelpers";');
  lines.push("");

  const varNames = [];
  for (const p of cat.pages) {
    const vn = `page${p.key}`;
    varNames.push(vn);
    const items = (p.items || [])
      .map(
        (it) =>
          `{ title: '${esc(it.title)}', copy: '${esc(it.copy)}'${
            it.meta ? `, meta: '${esc(it.meta)}'` : ""
          } }`,
      )
      .join(", ");
    const stats = (p.stats || [])
      .map((st) => `{ value: '${esc(st.value)}', label: '${esc(st.label)}' }`)
      .join(", ");

    lines.push(`const ${vn} = makePageSection({`);
    lines.push(`  id: "${cat.idPrefix}-${p.key}",`);
    lines.push(`  category: "${cat.category}",`);
    lines.push(`  title: "${esc(p.title)}",`);
    lines.push(`  previewLayout: "${cat.idPrefix}-${p.key}",`);
    lines.push(`  backgroundColor: "${BGS[p.layout]}",`);
    lines.push(`  minHeight: "${HEIGHTS[p.layout]}",`);
    lines.push(`  thumbnail: IMG.${p.img},`);
    lines.push(`  keywords: ${JSON.stringify(cat.keywords)},`);
    lines.push(`  nodes: buildLayoutNodes("${p.layout}" as PageLayoutKind, {`);
    lines.push(`    eyebrow: '${esc(p.eyebrow)}',`);
    lines.push(`    title: '${esc(p.h)}',`);
    lines.push(`    subtitle: '${esc(p.sub)}',`);
    lines.push(`    cta: '${esc(p.cta)}',`);
    if (p.cta2) lines.push(`    secondaryCta: '${esc(p.cta2)}',`);
    lines.push(`    image: IMG.${p.img},`);
    lines.push(`    items: [${items}],`);
    lines.push(`    stats: [${stats}],`);
    lines.push("  }),");
    lines.push("});");
    lines.push("");
  }

  lines.push(
    `export const ${cat.exportName}: VisualLibrarySectionTemplate[] = [`,
  );
  lines.push(`  ${varNames.join(",\n  ")},`);
  lines.push("];");
  lines.push("");

  fs.writeFileSync(path.join(dir, cat.file), lines.join("\n"), "utf8");
  console.log("wrote", cat.file, varNames.length);
}

for (const cat of categories) genFile(cat);
console.log("done", categories.length, "files");
