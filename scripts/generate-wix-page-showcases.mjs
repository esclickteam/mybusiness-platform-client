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

const META = {
  split: { backgroundColor: "#ffffff", minHeight: "1600px" },
  center: { backgroundColor: "#f7f1ea", minHeight: "1500px" },
  magazine: { backgroundColor: "#ffffff", minHeight: "1550px" },
  cards: { backgroundColor: "#eef6ff", minHeight: "1500px" },
  timeline: { backgroundColor: "#f6f4ff", minHeight: "1580px" },
  stats: { backgroundColor: "#111827", minHeight: "1480px" },
  dark: { backgroundColor: "#09090b", minHeight: "1500px" },
  lifestyle: { backgroundColor: "#fde8e4", minHeight: "1520px" },
  listMedia: { backgroundColor: "#f0faf4", minHeight: "1450px" },
  ctaForm: { backgroundColor: "#fff7ed", minHeight: "1450px" },
};

function esc(s) {
  return String(s)
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/\r/g, "")
    .replace(/\n/g, "\\n");
}

function makePages(heName, configs) {
  return configs.map((cfg, index) => ({
    key: String(index + 1).padStart(2, "0"),
    layout: LAYOUTS[index],
    title: `${heName} – ${cfg.label}`,
    eyebrow: cfg.eyebrow,
    h: cfg.h,
    sub: cfg.sub,
    cta: cfg.cta,
    cta2: cfg.cta2,
    img: cfg.img,
    items: cfg.items,
    stats: cfg.stats,
  }));
}

const homeItems = [
  [
    { title: "CRM חכם", copy: "לידים ולקוחות במקום אחד." },
    { title: "תורים", copy: "יומן אוטומטי בלי חיכוך." },
    { title: "אתר", copy: "נוכחות שממירה מבקרים." },
    { title: "AI", copy: "המלצות פעולה לעסק." },
    { title: "שותפים", copy: "רשת שיתופי פעולה." },
    { title: "הצעות", copy: "מסמכים מקצועיים במהירות." },
  ],
  [
    { value: "12K+", label: "עסקים" },
    { value: "98%", label: "שביעות רצון" },
    { value: "3x", label: "יותר לידים" },
    { value: "14", label: "ימים להשקה" },
  ],
];

const categories = [
  {
    file: "homePageShowcaseSections.ts",
    exportName: "HOME_PAGE_SHOWCASE_SECTIONS",
    category: "hero",
    idPrefix: "section-home-page",
    keywords: ["בית", "ראשי", "home", "hero", "wix"],
    pages: makePages("דף הבית", [
      { label: "כחול עסקי", eyebrow: "BUSINESS OS", h: "נהלו את העסק\nבמקום אחד", sub: "CRM, תורים ואתר — מערכת אחת שמניעה צמיחה.", cta: "התחילו עכשיו", cta2: "למד עוד", img: "office", items: homeItems[0], stats: homeItems[1] },
      { label: "Editorial חם", eyebrow: "START FRESH", h: "המקום שלך\nלהתחיל מחדש", sub: "עיצוב רגוע עם מסר אחד ברור.", cta: "קבעו שיחה", img: "nature", items: homeItems[0].slice(0, 3), stats: homeItems[1] },
      { label: "מגזין שחור", eyebrow: "STUDIO", h: "רעיונות\nשאי אפשר לפספס", sub: "קומפוזיציה מגזינית חדה ונועזת.", cta: "גלו עוד", img: "workspace", items: homeItems[0].slice(0, 4), stats: homeItems[1] },
      { label: "כרטיסים צבעוניים", eyebrow: "FEATURES", h: "כל הכלים\nבכרטיסים חיים", sub: "שישה ערכים בצבעים שונים — לא עוד אפור.", cta: "לכל הפיצ׳רים", img: "tech", items: homeItems[0], stats: homeItems[1] },
      { label: "ציר סגול", eyebrow: "HOW IT WORKS", h: "מארבעה שלבים\nלעסק מסודר", sub: "תהליך ברור עם ציר ויזואלי בולט.", cta: "התחילו בשלב 1", img: "finance", items: [{ title: "פרופיל", copy: "פרטי העסק והשירותים.", meta: "01" }, { title: "אתר", copy: "תבנית או AI.", meta: "02" }, { title: "CRM", copy: "לידים ותורים.", meta: "03" }, { title: "פרסום", copy: "יוצאים לאוויר.", meta: "04" }, { title: "שיפור", copy: "המלצות חכמות.", meta: "05" }], stats: homeItems[1] },
      { label: "לוח מספרים", eyebrow: "RESULTS", h: "תוצאות\nשמדברות חזק", sub: "מספרים זוהרים על רקע כהה.", cta: "ראו דמו", img: "office", items: homeItems[0].slice(0, 3), stats: homeItems[1] },
      { label: "קולנוע זהב", eyebrow: "PREMIUM", h: "נוכחות דיגיטלית\nברמה אחרת", sub: "דרמה שחורה עם מבטאי זהב.", cta: "הצטרפו עכשיו", img: "abstract", items: homeItems[0].slice(0, 3), stats: homeItems[1] },
      { label: "לייפסטייל ורוד", eyebrow: "WELLNESS", h: "אימון שמשנה\nאת היום", sub: "אווירה רכה עם תמונת גיבור ענקית.", cta: "קבעו אימון", img: "fitness", items: homeItems[0].slice(0, 3), stats: homeItems[1] },
      { label: "רשימה ירוקה", eyebrow: "TOOLKIT", h: "הכלים שהופכים\nעסק למסודר", sub: "רשימה ממוספרת לצד מדיה דומיננטית.", cta: "נסו בחינם", img: "ecommerce", items: homeItems[0].slice(0, 5), stats: homeItems[1] },
      { label: "טופס כתום", eyebrow: "GET STARTED", h: "בואו נבנה\nאת האתר שלכם", sub: "טופס המרה בולט עם מסגרת כתומה.", cta: "שלחו פרטים", cta2: "דברו איתנו", img: "hospitality", items: homeItems[0].slice(0, 3), stats: homeItems[1] },
    ]),
  },
  {
    file: "servicesPageShowcaseSections.ts",
    exportName: "SERVICES_PAGE_SHOWCASE_SECTIONS",
    category: "services",
    idPrefix: "section-services-page",
    keywords: ["שירותים", "services", "wix"],
    pages: makePages("שירותים", [
      { label: "כחול עסקי", eyebrow: "SERVICES", h: "שירותים\nשמובילים לתוצאה", sub: "הצגת שירותים מקצועית עם דגש כחול.", cta: "בחרו שירות", cta2: "דברו איתנו", img: "tech", items: [{ title: "ייעוץ", copy: "אבחון ואסטרטגיה." }, { title: "עיצוב", copy: "חוויה ויזואלית." }, { title: "פיתוח", copy: "ביצועים ומוצר." }, { title: "שיווק", copy: "משפך שממיר." }, { title: "תמיכה", copy: "ליווי שוטף." }, { title: "הדרכה", copy: "צוות עצמאי." }], stats: [{ value: "40+", label: "שירותים" }, { value: "4.9", label: "דירוג" }, { value: "72ש׳", label: "מענה" }, { value: "100%", label: "מותאם" }] },
      { label: "Editorial חם", eyebrow: "WHAT WE OFFER", h: "המומחיות\nשלנו בשירותכם", sub: "עמוד שירותים רגוע ומזמין.", cta: "לכל השירותים", img: "office", items: [{ title: "אסטרטגיה", copy: "מסר מדויק." }, { title: "ביצוע", copy: "תוצרים מוכנים." }, { title: "מדידה", copy: "תוצאות ברורות." }], stats: [{ value: "3", label: "שלבים" }, { value: "1", label: "צוות" }, { value: "∞", label: "שיפור" }, { value: "24/7", label: "גיבוי" }] },
      { label: "מגזין שחור", eyebrow: "EXPERTISE", h: "שירותי בוטיק\nבפריסה נועזת", sub: "שחור-לבן עם היררכיה חזקה.", cta: "גלו שירות", img: "workspace", items: [{ title: "מיתוג", copy: "זהות שלמה." }, { title: "אתר", copy: "עמודים ממירים." }, { title: "תוכן", copy: "מסרים חדים." }, { title: "צמיחה", copy: "תהליכים יציבים." }], stats: [{ value: "A+", label: "איכות" }, { value: "12", label: "שנים" }, { value: "300+", label: "פרויקטים" }, { value: "5★", label: "דירוג" }] },
      { label: "כרטיסים צבעוניים", eyebrow: "PACKAGES", h: "שישה שירותים\nבצבעים חיים", sub: "כל כרטיס בצבע אחר — מגוון אמיתי.", cta: "השוו חבילות", img: "product", items: [{ title: "Starter", copy: "להתחלה מהירה." }, { title: "Growth", copy: "לצמיחה." }, { title: "Pro", copy: "לעסקים רציניים." }, { title: "Design", copy: "עיצוב מלא." }, { title: "Tech", copy: "פיתוח מתקדם." }, { title: "Care", copy: "תחזוקה שוטפת." }], stats: [{ value: "6", label: "חבילות" }, { value: "0", label: "קוד" }, { value: "14", label: "ימים" }, { value: "1", label: "מחיר" }] },
      { label: "ציר סגול", eyebrow: "PROCESS", h: "איך העבודה\nמתבצעת", sub: "שירותים כמסע לקוח סגול.", cta: "התחילו תהליך", img: "finance", items: [{ title: "שיחת אפיון", copy: "מבינים צורך.", meta: "01" }, { title: "הצעה", copy: "תוכנית ברורה.", meta: "02" }, { title: "ביצוע", copy: "עבודה מדויקת.", meta: "03" }, { title: "השקה", copy: "יציאה לאוויר.", meta: "04" }, { title: "אופטימיזציה", copy: "שיפור מתמשך.", meta: "05" }], stats: [{ value: "5", label: "שלבים" }, { value: "1", label: "מנהל" }, { value: "Weekly", label: "עדכון" }, { value: "SLA", label: "מחייבים" }] },
      { label: "לוח מספרים", eyebrow: "IMPACT", h: "שירותים\nעם מדדים", sub: "מחברים שירות לתוצאה עסקית.", cta: "ראו תוצאות", img: "finance", items: [{ title: "מהירות", copy: "מסירה בזמן." }, { title: "איכות", copy: "סטנדרט גבוה." }, { title: "שקיפות", copy: "דיווח שוטף." }], stats: [{ value: "86%", label: "חיסכון" }, { value: "2.4x", label: "ROI" }, { value: "4.9", label: "דירוג" }, { value: "30+", label: "תבניות" }] },
      { label: "קולנוע זהב", eyebrow: "PREMIUM", h: "שירותים\nברמת בוטיק", sub: "יוקרה שחורה עם זהב.", cta: "הזמינו פגישה", img: "abstract", items: [{ title: "ליווי אישי", copy: "יחס one-to-one." }, { title: "דיוק", copy: "פרטים קטנים." }, { title: "בלעדיות", copy: "קשב מלא." }], stats: [{ value: "VIP", label: "מסלול" }, { value: "1:1", label: "יחס" }, { value: "Gold", label: "סטנדרט" }, { value: "24h", label: "מענה" }] },
      { label: "לייפסטייל ורוד", eyebrow: "CARE", h: "שירות אישי\nשמרגיש נכון", sub: "טון חם לשירותי טיפוח וליווי.", cta: "קבעו תור", img: "wellness", items: [{ title: "אישי", copy: "מותאם לכם." }, { title: "רגוע", copy: "בלי לחץ." }, { title: "קרוב", copy: "תמיד זמינים." }], stats: [{ value: "♥", label: "יחס" }, { value: "Same day", label: "תורים" }, { value: "Soft", label: "טון" }, { value: "Local", label: "שירות" }] },
      { label: "רשימה ירוקה", eyebrow: "MENU", h: "קטלוג שירותים\nמסודר", sub: "רשימה ברורה לצד מדיה.", cta: "בחרו מהרשימה", img: "beauty", items: [{ title: "פגישת ייעוץ", copy: "45 דקות." }, { title: "חבילת בסיס", copy: "ליווי חודשי." }, { title: "חבילת צמיחה", copy: "אתר + CRM." }, { title: "ריטיינר", copy: "תחזוקה מלאה." }, { title: "סדנה", copy: "הדרכת צוות." }], stats: [{ value: "5", label: "פריטים" }, { value: "Clear", label: "מחיר" }, { value: "Fast", label: "הזמנה" }, { value: "Easy", label: "בחירה" }] },
      { label: "טופס כתום", eyebrow: "BOOK NOW", h: "השירות הנכון\nמתחיל בשיחה", sub: "טופס קביעה דומיננטי.", cta: "שלחו בקשה", cta2: "התקשרו", img: "medical", items: [{ title: "מענה מהיר", copy: "תוך יום עסקים." }, { title: "ליווי", copy: "לא נעלמים." }, { title: "שקיפות", copy: "בלי הפתעות." }], stats: [{ value: "<24h", label: "חזרה" }, { value: "Free", label: "שיחה" }, { value: "No spam", label: "הבטחה" }, { value: "Human", label: "מענה" }] },
    ]),
  },
];

// Build remaining categories with unique item sets from a compact factory
function cat(file, exportName, category, idPrefix, keywords, heName, imgSet, itemSets, labels) {
  const pages = labels.map((cfg, index) => ({
    key: String(index + 1).padStart(2, "0"),
    layout: LAYOUTS[index],
    title: `${heName} – ${cfg.label}`,
    eyebrow: cfg.eyebrow,
    h: cfg.h,
    sub: cfg.sub,
    cta: cfg.cta,
    cta2: cfg.cta2,
    img: imgSet[index % imgSet.length],
    items: itemSets[index % itemSets.length],
    stats: cfg.stats || [
      { value: "98%", label: "שביעות רצון" },
      { value: "3x", label: "צמיחה" },
      { value: "14", label: "ימים" },
      { value: "5★", label: "דירוג" },
    ],
  }));
  return { file, exportName, category, idPrefix, keywords, pages };
}

const rest = [
  cat(
    "galleryPageShowcaseSections.ts",
    "GALLERY_PAGE_SHOWCASE_SECTIONS",
    "gallery",
    "section-gallery-page",
    ["גלריה", "gallery", "wix"],
    "גלריה",
    ["architecture", "interior", "fashion", "workspace", "construction", "abstract", "beauty", "event", "nature", "travel"],
    [
      [{ title: "פרויקט מגורים", copy: "חללים חמים ומדויקים." }, { title: "מסחרי", copy: "נוכחות רחוב חזקה." }, { title: "מותג", copy: "שפה ויזואלית עקבית." }, { title: "אירוע", copy: "רגעים שנבחרו." }, { title: "מוצר", copy: "צילום שמוכר." }, { title: "דיגיטל", copy: "ממשקים נקיים." }],
      [{ title: "אור", copy: "קומפוזיציה בהירה." }, { title: "צל", copy: "דרמה מבוקרת." }, { title: "טקסטורה", copy: "חומרים אמיתיים." }],
      [{ title: "01 נבחר", copy: "עבודת דגל." }, { title: "02 חדש", copy: "מהסטודיו." }, { title: "03 אהוב", copy: "הכי נצפה." }, { title: "04 פרטי", copy: "פרויקט סגור." }],
      [{ title: "רעיון", copy: "סקיצה ראשונה.", meta: "01" }, { title: "פיתוח", copy: "עיצוב מלא.", meta: "02" }, { title: "צילום", copy: "הפקה." , meta: "03" }, { title: "עריכה", copy: "סלקציה.", meta: "04" }, { title: "פרסום", copy: "יציאה החוצה.", meta: "05" }],
    ],
    [
      { label: "כחול עסקי", eyebrow: "GALLERY", h: "עבודות\nשמספרות סיפור", sub: "גלריה עם נוכחות כחולה חדה.", cta: "לכל העבודות" },
      { label: "Editorial חם", eyebrow: "PORTFOLIO", h: "מבחר נבחר\nמהסטודיו", sub: "תצוגה מרכזית רגועה.", cta: "צפו בגלריה" },
      { label: "מגזין שחור", eyebrow: "SHOWCASE", h: "רגעים\nשנבחרו בקפידה", sub: "פריסת קולאז׳ נועזת.", cta: "גלו פרויקט" },
      { label: "כרטיסים צבעוניים", eyebrow: "PROJECTS", h: "שישה פרויקטים\nבצבעים שונים", sub: "כל כרטיס עם מבטא צבע אחר.", cta: "פתחו פרויקט" },
      { label: "ציר סגול", eyebrow: "JOURNEY", h: "מהרעיון\nלתוצאה", sub: "גלריה כמסע יצירה.", cta: "התחילו פרויקט" },
      { label: "לוח מספרים", eyebrow: "HIGHLIGHTS", h: "העבודות\nשמדברות הכי חזק", sub: "מספרים על רקע כהה.", cta: "ראו עוד" },
      { label: "קולנוע זהב", eyebrow: "DARK GALLERY", h: "ויזואליות\nדרמטית", sub: "שחור-זהב לגלריית פרימיום.", cta: "היכנסו לגלריה" },
      { label: "לייפסטייל ורוד", eyebrow: "MOOD", h: "אווירה\nשנשארת בזיכרון", sub: "גלריה רכה ומזמינה.", cta: "שמרו השראה" },
      { label: "רשימה ירוקה", eyebrow: "SELECTED", h: "פרויקטים\nנבחרים", sub: "רשימה לצד מדיה גדולה.", cta: "צפו בפרטים" },
      { label: "טופס כתום", eyebrow: "COLLABORATE", h: "רוצים פרויקט\nכזה?", sub: "גלריה שמסתיימת בטופס כתום.", cta: "דברו איתנו", cta2: "שלחו רעיון" },
    ],
  ),
  cat("contactPageShowcaseSections.ts", "CONTACT_PAGE_SHOWCASE_SECTIONS", "contact", "section-contact-page", ["צור קשר", "contact", "wix"], "יצירת קשר",
    ["office", "team", "workspace", "tech", "finance", "medical", "abstract", "hospitality", "architecture", "office"],
    [
      [{ title: "טלפון", copy: "שיחה ישירה." }, { title: "מייל", copy: "מענה כתוב." }, { title: "וואטסאפ", copy: "הודעה מהירה." }, { title: "כתובת", copy: "ביקור במשרד." }, { title: "זום", copy: "פגישה מרחוק." }, { title: "טופס", copy: "השארת פרטים." }],
      [{ title: "מהיר", copy: "חוזרים תוך יום." }, { title: "אנושי", copy: "בלי בוטים." }, { title: "ברור", copy: "בלי סיבובים." }],
      [{ title: "פנייה", copy: "משאירים פרטים.", meta: "01" }, { title: "אישור", copy: "מקבלים מייל.", meta: "02" }, { title: "שיחה", copy: "מתאמים זמן.", meta: "03" }, { title: "הצעה", copy: "שולחים תוכנית.", meta: "04" }, { title: "התחלה", copy: "יוצאים לדרך.", meta: "05" }],
    ],
    [
      { label: "כחול עסקי", eyebrow: "CONTACT", h: "נשמח\nלשמוע מכם", sub: "עמוד קשר כחול ומקצועי.", cta: "שלחו הודעה", cta2: "התקשרו" },
      { label: "Editorial חם", eyebrow: "LET'S TALK", h: "השיחה הבאה\nמתחילה כאן", sub: "פתיחה חמה ומזמינה.", cta: "כתבו לנו" },
      { label: "מגזין שחור", eyebrow: "STUDIO DESK", h: "בואו נדבר\nעל הפרויקט", sub: "פריסה שחור-לבן חדה.", cta: "קבעו שיחה" },
      { label: "כרטיסים צבעוניים", eyebrow: "CHANNELS", h: "כל דרכי\nההתקשרות", sub: "ערוצים בצבעים שונים.", cta: "בחרו ערוץ" },
      { label: "ציר סגול", eyebrow: "NEXT STEPS", h: "מה קורה\nאחרי שפונים", sub: "שקיפות מלאה לתהליך.", cta: "התחילו עכשיו" },
      { label: "לוח מספרים", eyebrow: "SUPPORT", h: "שירות לקוחות\nשאפשר לסמוך עליו", sub: "מדדי מענה על רקע כהה.", cta: "פתחו פנייה" },
      { label: "קולנוע זהב", eyebrow: "PRIVATE LINE", h: "יצירת קשר\nבסגנון פרימיום", sub: "קו פרטי למותגים יוקרתיים.", cta: "השאירו פרטים" },
      { label: "לייפסטייל ורוד", eyebrow: "WELCOME", h: "דלת פתוחה\nלשיחה אמיתית", sub: "טון חם לעסק מקומי.", cta: "שלחו הודעה" },
      { label: "רשימה ירוקה", eyebrow: "VISIT US", h: "בואו לבקר\nאו כתבו מרחוק", sub: "פרטי מיקום לצד מדיה.", cta: "נווטו אלינו" },
      { label: "טופס כתום", eyebrow: "MESSAGE", h: "השאירו פרטים\nונחזור אליכם", sub: "טופס כתום שאי אפשר לפספס.", cta: "שליחה", cta2: "וואטסאפ" },
    ],
  ),
  cat("landingPageShowcaseSections.ts", "LANDING_PAGE_SHOWCASE_SECTIONS", "promote", "section-landing-page", ["נחיתה", "landing", "wix"], "נחיתה",
    ["product", "tech", "fashion", "ecommerce", "event", "finance", "abstract", "wellness", "product", "tech"],
    [
      [{ title: "הטבה", copy: "מחיר מוגבל." }, { title: "בונוס", copy: "מתנה בהרשמה." }, { title: "אחריות", copy: "בלי סיכון." }, { title: "מהיר", copy: "התחלה מיידית." }, { title: "פשוט", copy: "שלושה קליקים." }, { title: "תוצאה", copy: "רואים הבדל." }],
      [{ title: "לחצו", copy: "בוחרים מסלול.", meta: "01" }, { title: "נרשמים", copy: "משאירים פרטים.", meta: "02" }, { title: "מקבלים", copy: "הגישה נפתחת.", meta: "03" }, { title: "מתחילים", copy: "עובדים.", meta: "04" }, { title: "צומחים", copy: "מודדים.", meta: "05" }],
    ],
    [
      { label: "כחול עסקי", eyebrow: "LANDING", h: "הצעה אחת\nשאי אפשר לפספס", sub: "נחיתה כחולה ממוקדת המרה.", cta: "להרשמה", cta2: "למידע" },
      { label: "Editorial חם", eyebrow: "CAMPAIGN", h: "השקה ממוקדת\nשמובילה לפעולה", sub: "מינימום רעש, מקסימום CTA.", cta: "הצטרפו עכשיו" },
      { label: "מגזין שחור", eyebrow: "OFFER", h: "מבצע מוגבל\nבזמן", sub: "סיפור ויזואלי חד סביב ההצעה.", cta: "מימוש ההטבה" },
      { label: "כרטיסים צבעוניים", eyebrow: "BENEFITS", h: "למה זה\nמשתלם עכשיו", sub: "יתרונות בצבעים חיים.", cta: "אני בפנים" },
      { label: "ציר סגול", eyebrow: "STEPS", h: "שלושה צעדים\nלהטבה", sub: "מסע קצר עד להמרה.", cta: "התחילו" },
      { label: "לוח מספרים", eyebrow: "PROOF", h: "המספרים\nמאחורי ההצעה", sub: "הוכחות חברתיות על רקע כהה.", cta: "נסו בלי סיכון" },
      { label: "קולנוע זהב", eyebrow: "EXCLUSIVE", h: "גישה מוקדמת\nלחברים בלבד", sub: "תחושת בלעדיות שחורה-זהב.", cta: "בקשו גישה" },
      { label: "לייפסטייל ורוד", eyebrow: "SOFT SELL", h: "הזמנה\nבלי לחץ", sub: "נחיתה רגועה למותגי לייפסטייל.", cta: "שמרו מקום" },
      { label: "רשימה ירוקה", eyebrow: "INCLUDED", h: "מה מקבלים\nבחבילה", sub: "תכולה ברורה לצד תמונה.", cta: "לקנייה" },
      { label: "טופס כתום", eyebrow: "LEAD FORM", h: "השאירו פרטים\nוקבלו גישה", sub: "טופס לידים כתום ודומיננטי.", cta: "שלחו", cta2: "חזרו אליי" },
    ],
  ),
  cat("productsPageShowcaseSections.ts", "PRODUCTS_PAGE_SHOWCASE_SECTIONS", "commerce", "section-products-page", ["מוצרים", "products", "wix"], "מוצרים",
    ["ecommerce", "product", "fashion", "skincare", "ecommerce", "product", "fashion", "skincare", "ecommerce", "product"],
    [
      [{ title: "חדש", copy: "מהמדף עכשיו." }, { title: "נמכר", copy: "הכי מבוקש." }, { title: "מוגבל", copy: "מלאי קטן." }, { title: "סט", copy: "חיסכון בחבילה." }, { title: "מתנה", copy: "אריזה מוכנה." }, { title: "דיגיטלי", copy: "הורדה מיידית." }],
      [{ title: "בחירה", copy: "מוצר אחד.", meta: "01" }, { title: "פרטים", copy: "מידות וצבע.", meta: "02" }, { title: "סל", copy: "מוסיפים.", meta: "03" }, { title: "תשלום", copy: "מאובטח.", meta: "04" }, { title: "משלוח", copy: "עד הבית.", meta: "05" }],
    ],
    [
      { label: "כחול עסקי", eyebrow: "SHOP", h: "מוצרים\nשנבחרו בקפידה", sub: "חנות כחולה עם הדגשת מוצר.", cta: "לקנייה", cta2: "לכל המוצרים" },
      { label: "Editorial חם", eyebrow: "COLLECTION", h: "הקולקציה\nהחדשה כאן", sub: "עמוד מוצרים רגוע ומדויק.", cta: "גלו קולקציה" },
      { label: "מגזין שחור", eyebrow: "CURATED", h: "בחירות\nשל המותג", sub: "תצוגת מוצרים editorial.", cta: "הוסיפו לסל" },
      { label: "כרטיסים צבעוניים", eyebrow: "CATALOG", h: "שישה מוצרים\nבצבעים שונים", sub: "רשת מוצרים חיה.", cta: "פתחו חנות" },
      { label: "ציר סגול", eyebrow: "FROM IDEA", h: "מהרעיון\nלמוצר מדף", sub: "סיפור מוצר כתהליך.", cta: "הכירו את הקו" },
      { label: "לוח מספרים", eyebrow: "BEST SELLERS", h: "הנמכרים\nביותר", sub: "מספרי מכירות על רקע כהה.", cta: "קנו עכשיו" },
      { label: "קולנוע זהב", eyebrow: "LUXE", h: "קולקציית\nפרימיום", sub: "קנייה יוקרתית.", cta: "גלו פרימיום" },
      { label: "לייפסטייל ורוד", eyebrow: "DAILY", h: "מוצרים\nלשגרה יפה", sub: "אווירה רכה למוצרי יום-יום.", cta: "הוסיפו לסל" },
      { label: "רשימה ירוקה", eyebrow: "PICKS", h: "המלצות\nהשבוע", sub: "רשימת מוצרים לצד מדיה.", cta: "לרכישה" },
      { label: "טופס כתום", eyebrow: "ORDER", h: "הזמינו\nבכמה קליקים", sub: "טופס הזמנה כתום ומהיר.", cta: "שלחו הזמנה" },
    ],
  ),
  cat("pricingPageShowcaseSections.ts", "PRICING_PAGE_SHOWCASE_SECTIONS", "pricing", "section-pricing-page", ["תמחור", "pricing", "wix"], "תמחור",
    ["finance", "tech", "office", "product", "finance", "tech", "abstract", "wellness", "tech", "office"],
    [
      [{ title: "Basic", copy: "להתחלה." }, { title: "Plus", copy: "לצמיחה." }, { title: "Pro", copy: "לעסקים." }, { title: "שנתי", copy: "חיסכון." }, { title: "חודשי", copy: "גמיש." }, { title: "מותאם", copy: "לפי צורך." }],
      [{ title: "בחירה", copy: "מסלול.", meta: "01" }, { title: "ניסיון", copy: "14 יום.", meta: "02" }, { title: "הפעלה", copy: "מיידית.", meta: "03" }, { title: "שימוש", copy: "כל הכלים.", meta: "04" }, { title: "שדרוג", copy: "בכל רגע.", meta: "05" }],
    ],
    [
      { label: "כחול עסקי", eyebrow: "PRICING", h: "מחירים\nשקופים ופשוטים", sub: "השוואת חבילות כחולה.", cta: "בחרו חבילה", cta2: "שאלו אותנו" },
      { label: "Editorial חם", eyebrow: "PLANS", h: "בחרו את\nהמסלול שלכם", sub: "תמחור נקי וחם.", cta: "התחילו ניסיון" },
      { label: "מגזין שחור", eyebrow: "VALUE", h: "הערך\nמאחורי המחיר", sub: "סיפור מחיר editorial.", cta: "השוו מסלולים" },
      { label: "כרטיסים צבעוניים", eyebrow: "TIERS", h: "שלוש חבילות\nבצבעים חיים", sub: "כל מסלול עם מבטא צבע.", cta: "בחרו עכשיו" },
      { label: "ציר סגול", eyebrow: "ONBOARDING", h: "מה כלול\nבכל שלב", sub: "תמחור כמסע לקוח.", cta: "הצטרפו" },
      { label: "לוח מספרים", eyebrow: "ROI", h: "החזר השקעה\nשרואים", sub: "מספרי חיסכון על רקע כהה.", cta: "חשבו חיסכון" },
      { label: "קולנוע זהב", eyebrow: "PRO", h: "מסלול Pro\nלעסקים רציניים", sub: "תמחור פרימיום שחור-זהב.", cta: "שדרגו ל-Pro" },
      { label: "לייפסטייל ורוד", eyebrow: "SIMPLE", h: "תמחור\nבלי הפתעות", sub: "שפה רגועה למחירים.", cta: "בחרו מסלול" },
      { label: "רשימה ירוקה", eyebrow: "COMPARE", h: "השוו\nותבחרו נכון", sub: "הבדלים ברשימה ברורה.", cta: "השוואה מלאה" },
      { label: "טופס כתום", eyebrow: "CUSTOM QUOTE", h: "צריכים\nהצעה מותאמת?", sub: "טופס הצעת מחיר כתום.", cta: "בקשו הצעה" },
    ],
  ),
  cat("blogPageShowcaseSections.ts", "BLOG_PAGE_SHOWCASE_SECTIONS", "blog", "section-blog-page", ["בלוג", "blog", "wix"], "בלוג",
    ["education", "office", "workspace", "tech", "education", "finance", "abstract", "nature", "education", "office"],
    [
      [{ title: "מדריך", copy: "שלב אחר שלב." }, { title: "טיפ", copy: "מהיר ליישום." }, { title: "ראיון", copy: "מאחורי הקלעים." }, { title: "ניתוח", copy: "מספרים אמיתיים." }, { title: "סיפור", copy: "מהשטח." }, { title: "עדכון", copy: "מה חדש." }],
      [{ title: "קוראים", copy: "פותחים פוסט.", meta: "01" }, { title: "לומדים", copy: "מיישמים.", meta: "02" }, { title: "משתפים", copy: "מעבירים הלאה.", meta: "03" }, { title: "חוזרים", copy: "לפוסט הבא.", meta: "04" }, { title: "נרשמים", copy: "לניוזלטר.", meta: "05" }],
    ],
    [
      { label: "כחול עסקי", eyebrow: "BLOG", h: "תובנות\nלעסק צומח", sub: "בלוג כחול עם מאמר מוביל.", cta: "לכל הפוסטים" },
      { label: "Editorial חם", eyebrow: "INSIGHTS", h: "ידע שעוזר\nלקבל החלטות", sub: "פתיחה editorial חמה.", cta: "התחילו לקרוא" },
      { label: "מגזין שחור", eyebrow: "STORIES", h: "סיפורים\nמהשטח", sub: "פריסת מגזין נועזת.", cta: "גלו כתבה" },
      { label: "כרטיסים צבעוניים", eyebrow: "LATEST", h: "הפוסטים\nהאחרונים", sub: "כרטיסי מאמרים בצבעים שונים.", cta: "עוד מאמרים" },
      { label: "ציר סגול", eyebrow: "SERIES", h: "סדרת מדריכים\nשלב אחר שלב", sub: "בלוג כמסע למידה.", cta: "למדריך הראשון" },
      { label: "לוח מספרים", eyebrow: "TRENDING", h: "הנושאים\nשכולם קוראים", sub: "פופולריות במספרים כהים.", cta: "לטרנדים" },
      { label: "קולנוע זהב", eyebrow: "DEEP DIVES", h: "מאמרים\nלעומק", sub: "בלוג כהה לתוכן כבד.", cta: "צללו פנימה" },
      { label: "לייפסטייל ורוד", eyebrow: "NOTES", h: "הערות קצרות\nמהיום־יום", sub: "טון אישי ורגוע.", cta: "קראו הערה" },
      { label: "רשימה ירוקה", eyebrow: "ARCHIVE", h: "ארכיון\nמסודר", sub: "רשימת פוסטים לצד תמונה.", cta: "לכל הארכיון" },
      { label: "טופס כתום", eyebrow: "SUBSCRIBE", h: "קבלו תובנות\nלמייל", sub: "טופס ניוזלטר כתום.", cta: "להרשמה" },
    ],
  ),
  cat("eventsPageShowcaseSections.ts", "EVENTS_PAGE_SHOWCASE_SECTIONS", "events", "section-events-page", ["אירועים", "events", "wix"], "אירועים",
    ["event", "hospitality", "event", "travel", "event", "team", "abstract", "hospitality", "event", "hospitality"],
    [
      [{ title: "הופעה", copy: "במה חיה." }, { title: "סדנה", copy: "למידה מעשית." }, { title: "מפגש", copy: "נטוורקינג." }, { title: "השקה", copy: "מוצר חדש." }, { title: "כנס", copy: "יום מלא." }, { title: "ערב", copy: "אווירה." }],
      [{ title: "שמירה", copy: "RSVP.", meta: "01" }, { title: "תזכורת", copy: "הודעה.", meta: "02" }, { title: "הגעה", copy: "צ׳ק אין.", meta: "03" }, { title: "חוויה", copy: "האירוע.", meta: "04" }, { title: "אחרי", copy: "סיכום.", meta: "05" }],
    ],
    [
      { label: "כחול עסקי", eyebrow: "EVENTS", h: "אירועים\nששווה להגיע אליהם", sub: "הדגשת אירוע קרוב בכחול.", cta: "לרכישת כרטיס", cta2: "לכל האירועים" },
      { label: "Editorial חם", eyebrow: "UPCOMING", h: "מה קורה\nהחודש", sub: "לוח אירועים רגוע.", cta: "שמרו מקום" },
      { label: "מגזין שחור", eyebrow: "EXPERIENCE", h: "חוויות\nשנשארות", sub: "אירוע בסגנון מגזין.", cta: "גלו חוויה" },
      { label: "כרטיסים צבעוניים", eyebrow: "CALENDAR", h: "שישה אירועים\nבצבעים שונים", sub: "כרטיסי אירוע חיים.", cta: "ללוח השנה" },
      { label: "ציר סגול", eyebrow: "SCHEDULE", h: "לו״ז מלא\nליום האירוע", sub: "ציר זמן למשתתפים.", cta: "הורידו לו״ז" },
      { label: "לוח מספרים", eyebrow: "COMMUNITY", h: "קהילה\nשגדלה בכל מפגש", sub: "מספרי קהל על רקע כהה.", cta: "הצטרפו" },
      { label: "קולנוע זהב", eyebrow: "NIGHT", h: "אירוע לילה\nבלתי נשכח", sub: "אווירת לילה שחורה-זהב.", cta: "הזמינו כרטיס" },
      { label: "לייפסטייל ורוד", eyebrow: "GATHER", h: "מפגשים\nבאווירה נעימה", sub: "אירועים קהילתיים רכים.", cta: "אני מגיע/ה" },
      { label: "רשימה ירוקה", eyebrow: "LINEUP", h: "הליינאפ\nהמלא", sub: "רשימת מופעים לצד ויזואל.", cta: "לפרטי האירוע" },
      { label: "טופס כתום", eyebrow: "RSVP", h: "שמרו מקום\nלפני שייגמר", sub: "טופס RSVP כתום.", cta: "RSVP" },
    ],
  ),
  cat("testimonialsPageShowcaseSections.ts", "TESTIMONIALS_PAGE_SHOWCASE_SECTIONS", "testimonials", "section-testimonials-page", ["ביקורות", "reviews", "wix"], "ביקורות",
    ["team", "office", "portrait", "team", "workspace", "finance", "abstract", "wellness", "portrait", "team"],
    [
      [{ title: "״שירות מדהים״", copy: "חזרנו לקוחות קבועים." }, { title: "״מהיר ומדויק״", copy: "הכול בזמן." }, { title: "״מקצועי״", copy: "הרגשנו בידיים טובות." }, { title: "״מומלץ״", copy: "כבר שלחנו חברים." }, { title: "״שווה כל שקל״", copy: "ראינו תוצאה." }, { title: "״יחס אישי״", copy: "לא עוד מספר." }],
      [{ title: "לפני", copy: "בלגן וכלים רבים.", meta: "01" }, { title: "במהלך", copy: "ליווי צמוד.", meta: "02" }, { title: "אחרי", copy: "סדר ותוצאות.", meta: "03" }, { title: "המלצה", copy: "ממליצים הלאה.", meta: "04" }, { title: "חזרה", copy: "עובדים שוב.", meta: "05" }],
    ],
    [
      { label: "כחול עסקי", eyebrow: "REVIEWS", h: "לקוחות\nשממליצים", sub: "ביקורות עם נוכחות כחולה.", cta: "קראו עוד" },
      { label: "Editorial חם", eyebrow: "LOVED BY", h: "אמון שנבנה\nמתוצאות", sub: "המלצות בטון חם.", cta: "ראו המלצות" },
      { label: "מגזין שחור", eyebrow: "STORIES", h: "סיפורי הצלחה\nאמיתיים", sub: "ביקורות בסגנון מגזין.", cta: "גלו סיפור" },
      { label: "כרטיסים צבעוניים", eyebrow: "WALL", h: "קיר המלצות\nבצבעים חיים", sub: "כל ציטוט עם מבטא צבע.", cta: "לכל הביקורות" },
      { label: "ציר סגול", eyebrow: "JOURNEY", h: "מהלקוח אמר\nאחרי התהליך", sub: "המלצות על ציר זמן.", cta: "התחילו גם אתם" },
      { label: "לוח מספרים", eyebrow: "RATINGS", h: "המספרים\nשל שביעות הרצון", sub: "דירוגים זוהרים על כהה.", cta: "בדקו דירוגים" },
      { label: "קולנוע זהב", eyebrow: "VOICES", h: "קולות\nשמכירים את העבודה", sub: "המלצות דרמטיות.", cta: "הקשיבו ללקוחות" },
      { label: "לייפסטייל ורוד", eyebrow: "KIND WORDS", h: "מילים חמות\nמלקוחות אמיתיים", sub: "טון רך להמלצות שירות.", cta: "קראו המלצה" },
      { label: "רשימה ירוקה", eyebrow: "QUOTES", h: "ציטוטים\nנבחרים", sub: "רשימת המלצות לצד דיוקן.", cta: "עוד ציטוטים" },
      { label: "טופס כתום", eyebrow: "SHARE", h: "החוויה שלכם\nחשובה לנו", sub: "טופס ביקורת כתום.", cta: "כתבו ביקורת" },
    ],
  ),
  cat("teamPageShowcaseSections.ts", "TEAM_PAGE_SHOWCASE_SECTIONS", "team", "section-team-page", ["צוות", "team", "wix"], "צוות",
    ["team", "office", "workspace", "team", "office", "finance", "abstract", "hospitality", "team", "office"],
    [
      [{ title: "עיצוב", copy: "ויזואל וממשקים." }, { title: "פיתוח", copy: "קוד וביצועים." }, { title: "שיווק", copy: "צמיחה." }, { title: "מכירות", copy: "סגירות." }, { title: "תמיכה", copy: "לקוחות מרוצים." }, { title: "הנהלה", copy: "חזון." }],
      [{ title: "היכרות", copy: "יום ראשון.", meta: "01" }, { title: "חניכה", copy: "ליווי צמוד.", meta: "02" }, { title: "עשייה", copy: "פרויקטים.", meta: "03" }, { title: "צמיחה", copy: "קידום.", meta: "04" }, { title: "מנהיגות", copy: "הובלה.", meta: "05" }],
    ],
    [
      { label: "כחול עסקי", eyebrow: "TEAM", h: "האנשים\nמאחורי העשייה", sub: "עמוד צוות כחול ומקצועי.", cta: "הכירו את כולם" },
      { label: "Editorial חם", eyebrow: "PEOPLE", h: "צוות קטן\nעם השפעה גדולה", sub: "היכרות חמה עם האנשים.", cta: "לפרופילים" },
      { label: "מגזין שחור", eyebrow: "CREW", h: "כישרונות\nשמניעים מותגים", sub: "צוות בסגנון מגזין.", cta: "גלו מי אנחנו" },
      { label: "כרטיסים צבעוניים", eyebrow: "MEMBERS", h: "שישה פנים\nבצבעים שונים", sub: "כרטיסי צוות חיים.", cta: "צרו קשר עם הצוות" },
      { label: "ציר סגול", eyebrow: "CULTURE", h: "איך אנחנו\nעובדים יחד", sub: "תרבות ארגונית כתהליך.", cta: "הצטרפו אלינו" },
      { label: "לוח מספרים", eyebrow: "TOGETHER", h: "שנים, פרויקטים\nואנשים", sub: "מספרי צוות על רקע כהה.", cta: "ראו קריירה" },
      { label: "קולנוע זהב", eyebrow: "TALENT", h: "הצוות\nשמאחורי הקלעים", sub: "כישרון דרמטי.", cta: "דברו עם המומחים" },
      { label: "לייפסטייל ורוד", eyebrow: "FAMILY", h: "יותר מעסק\nקהילה", sub: "טון חם לעמוד צוות.", cta: "הכירו מקרוב" },
      { label: "רשימה ירוקה", eyebrow: "ROLES", h: "תפקידים\nוהתמחויות", sub: "רשימת תפקידים לצד תמונה.", cta: "לפרטי התפקיד" },
      { label: "טופס כתום", eyebrow: "CAREERS", h: "רוצים\nלעבוד איתנו?", sub: "טופס מועמדות כתום.", cta: "שלחו קו״ח" },
    ],
  ),
  cat("faqPageShowcaseSections.ts", "FAQ_PAGE_SHOWCASE_SECTIONS", "faq", "section-faq-page", ["שאלות נפוצות", "faq", "wix"], "שאלות נפוצות",
    ["education", "office", "workspace", "tech", "finance", "tech", "abstract", "wellness", "education", "office"],
    [
      [{ title: "איך מתחילים?", copy: "נרשמים ובוחרים תבנית." }, { title: "יש ניסיון?", copy: "כן, 14 יום." }, { title: "צריך כרטיס?", copy: "לא לשלב הניסיון." }, { title: "אפשר לבטל?", copy: "בכל רגע." }, { title: "יש תמיכה?", copy: "צ׳אט ומייל." }, { title: "מה עם דומיין?", copy: "אפשר לחבר." }],
      [{ title: "שאלה", copy: "פותחים נושא.", meta: "01" }, { title: "חיפוש", copy: "מוצאים תשובה.", meta: "02" }, { title: "הבנה", copy: "מיישמים.", meta: "03" }, { title: "עזרה", copy: "אם צריך — פונים.", meta: "04" }, { title: "פתרון", copy: "חוזרים לעבודה.", meta: "05" }],
    ],
    [
      { label: "כחול עסקי", eyebrow: "FAQ", h: "תשובות\nלשאלות החשובות", sub: "מרכז עזרה כחול וברור.", cta: "לא מצאתם תשובה?" },
      { label: "Editorial חם", eyebrow: "HELP", h: "כל מה שרציתם\nלדעת", sub: "עזרה בטון חם.", cta: "חיפוש תשובה" },
      { label: "מגזין שחור", eyebrow: "GUIDES", h: "שאלות\nעם הקשר", sub: "FAQ בסגנון מדריך.", cta: "למדריכים" },
      { label: "כרטיסים צבעוניים", eyebrow: "TOPICS", h: "נושאים\nבצבעים שונים", sub: "קטגוריות שאלות חיות.", cta: "בחרו נושא" },
      { label: "ציר סגול", eyebrow: "SETUP", h: "שאלות לפי\nשלבי שימוש", sub: "FAQ על ציר תהליך.", cta: "להתחלה מהירה" },
      { label: "לוח מספרים", eyebrow: "QUICK FACTS", h: "עובדות\nבקצרה", sub: "תשובות זריזות על רקע כהה.", cta: "עוד פרטים" },
      { label: "קולנוע זהב", eyebrow: "SUPPORT", h: "תמיכה\nבלי בלבול", sub: "עזרה דרמטית וברורה.", cta: "פתחו קריאה" },
      { label: "לייפסטייל ורוד", eyebrow: "FRIENDLY HELP", h: "עזרה\nבשפה פשוטה", sub: "טון רך לשאלות נפוצות.", cta: "שאלו אותנו" },
      { label: "רשימה ירוקה", eyebrow: "ANSWERS", h: "שאלות\nותשובות", sub: "רשימת FAQ לצד מדיה.", cta: "לכל השאלות" },
      { label: "טופס כתום", eyebrow: "STILL STUCK", h: "עדיין צריכים\nעזרה?", sub: "טופס פנייה כתום בסוף העמוד.", cta: "שלחו שאלה" },
    ],
  ),
  cat("resumePageShowcaseSections.ts", "RESUME_PAGE_SHOWCASE_SECTIONS", "resume", "section-resume-page", ["קורות חיים", "resume", "wix"], "קורות חיים",
    ["portrait", "office", "workspace", "tech", "finance", "finance", "abstract", "portrait", "office", "team"],
    [
      [{ title: "עיצוב", copy: "UI/UX ומותג." }, { title: "פיתוח", copy: "React ו-Node." }, { title: "ניהול", copy: "צוותים ופרויקטים." }, { title: "שיווק", copy: "צמיחה דיגיטלית." }, { title: "כתיבה", copy: "תוכן ומסרים." }, { title: "אסטרטגיה", copy: "חשיבה עסקית." }],
      [{ title: "התחלה", copy: "תפקיד ראשון.", meta: "01" }, { title: "צמיחה", copy: "קידום.", meta: "02" }, { title: "הובלה", copy: "ניהול.", meta: "03" }, { title: "השפעה", copy: "תוצאות.", meta: "04" }, { title: "היום", copy: "מוכן להזדמנות.", meta: "05" }],
    ],
    [
      { label: "כחול עסקי", eyebrow: "RESUME", h: "פרופיל מקצועי\nבמבט אחד", sub: "קו״ח כחול ומדויק.", cta: "הורידו PDF", cta2: "צרו קשר" },
      { label: "Editorial חם", eyebrow: "CV", h: "ניסיון, כישורים\nותוצאות", sub: "עמוד קו״ח חם ונקי.", cta: "שלחו הצעה" },
      { label: "מגזין שחור", eyebrow: "PORTFOLIO CV", h: "הסיפור\nהמקצועי שלי", sub: "קו״ח editorial נועז.", cta: "ראו פרויקטים" },
      { label: "כרטיסים צבעוניים", eyebrow: "SKILLS", h: "כישורים\nבצבעים חיים", sub: "כרטיסי מיומנויות מגוונים.", cta: "לפרטים" },
      { label: "ציר סגול", eyebrow: "CAREER", h: "הדרך\nעד היום", sub: "ציר קריירה ברור.", cta: "הזמינו ראיון" },
      { label: "לוח מספרים", eyebrow: "IMPACT", h: "מספרים\nמהקריירה", sub: "הישגים מדידים על כהה.", cta: "דברו איתי" },
      { label: "קולנוע זהב", eyebrow: "PROFILE", h: "פרופיל\nמקצועי בולט", sub: "מותג אישי דרמטי.", cta: "צור קשר" },
      { label: "לייפסטייל ורוד", eyebrow: "ABOUT ME", h: "מי אני\nומה אני מביא/ה", sub: "טון אישי לעמוד קו״ח.", cta: "בואו נדבר" },
      { label: "רשימה ירוקה", eyebrow: "EXPERIENCE", h: "ניסיון תעסוקתי\nמפורט", sub: "רשימת תפקידים לצד דיוקן.", cta: "הורדה" },
      { label: "טופס כתום", eyebrow: "HIRE ME", h: "פנויים\nלהזדמנות הבאה", sub: "טופס גיוס כתום.", cta: "שלחו הצעת עבודה" },
    ],
  ),
];

const allCategories = [...categories, ...rest];

function genFile(catDef) {
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
  for (const p of catDef.pages) {
    const vn = `page${p.key}`;
    varNames.push(vn);
    const meta = META[p.layout];
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
    lines.push(`  id: "${catDef.idPrefix}-${p.key}",`);
    lines.push(`  category: "${catDef.category}",`);
    lines.push(`  title: "${esc(p.title)}",`);
    lines.push(`  previewLayout: "${catDef.idPrefix}-${p.key}",`);
    lines.push(`  backgroundColor: "${meta.backgroundColor}",`);
    lines.push(`  minHeight: "${meta.minHeight}",`);
    lines.push(`  thumbnail: IMG.${p.img},`);
    lines.push(`  keywords: ${JSON.stringify(catDef.keywords)},`);
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
    `export const ${catDef.exportName}: VisualLibrarySectionTemplate[] = [`,
  );
  lines.push(`  ${varNames.join(",\n  ")},`);
  lines.push("];");
  lines.push("");

  fs.writeFileSync(path.join(dir, catDef.file), lines.join("\n"), "utf8");
  console.log("wrote", catDef.file);
}

for (const c of allCategories) genFile(c);
console.log("done", allCategories.length);
