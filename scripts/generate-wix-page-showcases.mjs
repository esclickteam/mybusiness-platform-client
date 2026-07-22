import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(
  __dirname,
  "../src/components/site-builder/studio/visual-editor/library",
);

function esc(s) {
  return String(s)
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/\r/g, "")
    .replace(/\n/g, "\\n");
}

/** Rotate a category image pack so each page starts on a different primary photo. */
function rotatePack(pack, start) {
  const n = pack.length;
  return Array.from({ length: n }, (_, i) => pack[(start + i) % n]);
}

function makePages(heName, configs, imgPack) {
  return configs.map((cfg, index) => {
    const pack = rotatePack(imgPack || [cfg.img], index);
    return {
      key: String(index + 1).padStart(2, "0"),
      index,
      title: `${heName} – ${cfg.label}`,
      eyebrow: cfg.eyebrow,
      h: cfg.h,
      sub: cfg.sub,
      cta: cfg.cta,
      cta2: cfg.cta2,
      img: cfg.img || pack[0],
      images: pack,
      items: cfg.items,
      stats: cfg.stats,
    };
  });
}

const HOME_IMGS = [
  "office",
  "tech",
  "workspace",
  "team",
  "finance",
  "product",
  "meeting",
  "laptop",
  "city",
  "hands",
  "studio",
  "cafe",
];
const SERVICES_IMGS = [
  "tech",
  "office",
  "workspace",
  "product",
  "finance",
  "meeting",
  "hands",
  "laptop",
  "studio",
  "medical",
  "beauty",
  "abstract",
];

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
      { label: "פסיפס פיצ׳רים", eyebrow: "BUSINESS OS", h: "נהלו את העסק\nבמקום אחד", sub: "CRM, תורים ואתר — מערכת אחת שמניעה צמיחה.", cta: "התחילו עכשיו", cta2: "למד עוד", img: "office", items: homeItems[0], stats: homeItems[1] },
      { label: "סטייטמנט גדול", eyebrow: "START FRESH", h: "המקום שלך\nלהתחיל מחדש", sub: "מסר אחד ברור עם טיפוגרפיה דומיננטית.", cta: "קבעו שיחה", img: "nature", items: homeItems[0].slice(0, 3), stats: homeItems[1] },
      { label: "מדדים כהים", eyebrow: "RESULTS", h: "תוצאות\nשמדברות חזק", sub: "מספרים זוהרים על רקע כהה.", cta: "ראו דמו", img: "finance", items: homeItems[0].slice(0, 3), stats: homeItems[1] },
      { label: "לייפסטייל", eyebrow: "WELLNESS", h: "אימון שמשנה\nאת היום", sub: "אווירה רכה עם תמונת גיבור ענקית.", cta: "קבעו אימון", img: "fitness", items: homeItems[0].slice(0, 3), stats: homeItems[1] },
      { label: "טופס המרה", eyebrow: "GET STARTED", h: "בואו נבנה\nאת האתר שלכם", sub: "טופס המרה בולט עם מסגרת חמה.", cta: "שלחו פרטים", cta2: "דברו איתנו", img: "hospitality", items: homeItems[0].slice(0, 3), stats: homeItems[1] },
      { label: "קרוסלה", eyebrow: "PRODUCT TOUR", h: "כלים שזזים\nאיתכם קדימה", sub: "כרטיסים חופפים בסגנון קרוסלה.", cta: "לסיור מוצר", img: "product", items: homeItems[0].slice(0, 4), stats: homeItems[1] },
      { label: "מדף מוצרים", eyebrow: "SUITE", h: "החבילה המלאה\nלעסק מודרני", sub: "מדף מוצרים דיגיטליים במבט אחד.", cta: "לכל הכלים", img: "ecommerce", items: homeItems[0], stats: homeItems[1] },
      { label: "סינמטי", eyebrow: "PREMIUM", h: "נוכחות דיגיטלית\nברמה אחרת", sub: "דרמה שחורה עם מבטאי זהב.", cta: "הצטרפו עכשיו", img: "abstract", items: homeItems[0].slice(0, 3), stats: homeItems[1] },
      { label: "רשימה+מדיה", eyebrow: "TOOLKIT", h: "הכלים שהופכים\nעסק למסודר", sub: "רשימה ממוספרת לצד מדיה דומיננטית.", cta: "נסו בחינם", img: "tech", items: homeItems[0].slice(0, 5), stats: homeItems[1] },
      { label: "מפוצל", eyebrow: "PLATFORM", h: "פלטפורמה אחת\nלכל העסק", sub: "פיצול תמונה/טקסט עם כרטיסי ערך.", cta: "התחילו", cta2: "למד עוד", img: "workspace", items: homeItems[0].slice(0, 3), stats: homeItems[1] },
    ], HOME_IMGS),
  },
  {
    file: "servicesPageShowcaseSections.ts",
    exportName: "SERVICES_PAGE_SHOWCASE_SECTIONS",
    category: "services",
    idPrefix: "section-services-page",
    keywords: ["שירותים", "services", "wix"],
    pages: makePages("שירותים", [
      { label: "חבילות", eyebrow: "PACKAGES", h: "שלוש חבילות\nשמתאימות לכל שלב", sub: "תפריט שירותים בסגנון מסלולים.", cta: "בחרו חבילה", cta2: "השוו", img: "tech", items: [{ title: "Starter", copy: "להתחלה מהירה." }, { title: "Growth", copy: "לצמיחה עקבית." }, { title: "Pro", copy: "לעסקים רציניים." }, { title: "Design", copy: "עיצוב מלא." }, { title: "Tech", copy: "פיתוח מתקדם." }, { title: "Care", copy: "תחזוקה." }], stats: [{ value: "₪990", label: "התחלה" }, { value: "₪1,990", label: "צמיחה" }, { value: "₪3,900", label: "Pro" }, { value: "14", label: "ימים" }] },
      { label: "תהליך", eyebrow: "PROCESS", h: "איך העבודה\nמתבצעת", sub: "שירותים כמסע לקוח עם ציר ברור.", cta: "התחילו תהליך", img: "finance", items: [{ title: "שיחת אפיון", copy: "מבינים צורך.", meta: "01" }, { title: "הצעה", copy: "תוכנית ברורה.", meta: "02" }, { title: "ביצוע", copy: "עבודה מדויקת.", meta: "03" }, { title: "השקה", copy: "יציאה לאוויר.", meta: "04" }, { title: "אופטימיזציה", copy: "שיפור מתמשך.", meta: "05" }], stats: [{ value: "5", label: "שלבים" }, { value: "1", label: "מנהל" }, { value: "Weekly", label: "עדכון" }, { value: "SLA", label: "מחייבים" }] },
      { label: "השוואה", eyebrow: "COMPARE", h: "מה כלול\nבכל שירות", sub: "מטריצת יכולות שמבהירה הבדלים.", cta: "השוו שירותים", img: "office", items: [{ title: "אסטרטגיה" }, { title: "עיצוב" }, { title: "פיתוח" }, { title: "שיווק" }, { title: "תמיכה" }, { title: "הדרכה" }].map((x) => ({ title: x.title, copy: "כלול במסלולים נבחרים." })), stats: [{ value: "6", label: "יכולות" }, { value: "3", label: "מסלולים" }, { value: "∞", label: "שדרוג" }, { value: "1", label: "צוות" }] },
      { label: "יכולות", eyebrow: "CAPABILITIES", h: "שישה שירותים\nבצבעים חיים", sub: "רשת יכולות עם מבטא צבע לכל כרטיס.", cta: "לכל השירותים", img: "product", items: [{ title: "ייעוץ", copy: "אבחון ואסטרטגיה." }, { title: "עיצוב", copy: "חוויה ויזואלית." }, { title: "פיתוח", copy: "ביצועים ומוצר." }, { title: "שיווק", copy: "משפך שממיר." }, { title: "תמיכה", copy: "ליווי שוטף." }, { title: "הדרכה", copy: "צוות עצמאי." }], stats: [{ value: "40+", label: "שירותים" }, { value: "4.9", label: "דירוג" }, { value: "72ש׳", label: "מענה" }, { value: "100%", label: "מותאם" }] },
      { label: "קייס סטדי", eyebrow: "CASE STUDY", h: "שירותים\nעם תוצאות מוכחות", sub: "סיפור לקוח עם מדדים ותהליך.", cta: "ראו תוצאות", img: "workspace", items: [{ title: "אתגר", copy: "פיזור כלים.", meta: "01" }, { title: "פתרון", copy: "מערכת אחת.", meta: "02" }, { title: "תוצאה", copy: "יותר לידים.", meta: "03" }], stats: [{ value: "86%", label: "חיסכון" }, { value: "2.4x", label: "ROI" }, { value: "4.9", label: "דירוג" }, { value: "30+", label: "תבניות" }] },
      { label: "Editorial", eyebrow: "WHAT WE OFFER", h: "המומחיות\nשלנו בשירותכם", sub: "פתיחה editorial רגועה לשירותי בוטיק.", cta: "לכל השירותים", img: "interior", items: [{ title: "אסטרטגיה", copy: "מסר מדויק." }, { title: "ביצוע", copy: "תוצרים מוכנים." }, { title: "מדידה", copy: "תוצאות ברורות." }], stats: [{ value: "3", label: "שלבים" }, { value: "1", label: "צוות" }, { value: "∞", label: "שיפור" }, { value: "24/7", label: "גיבוי" }] },
      { label: "קרוסלה", eyebrow: "RETAINERS", h: "ריטיינרים\nשממשיכים לעבוד", sub: "כרטיסי שירות חופפים בסגנון קרוסלה.", cta: "בחרו ריטיינר", img: "team", items: [{ title: "חודשי", copy: "ליווי קבוע." }, { title: "רבעוני", copy: "מנועי צמיחה." }, { title: "שנתי", copy: "שותפות מלאה." }, { title: "אד-הוק", copy: "לפי פרויקט." }], stats: [{ value: "4", label: "מסלולים" }, { value: "VIP", label: "יחס" }, { value: "1:1", label: "מנהל" }, { value: "24h", label: "מענה" }] },
      { label: "מגזין", eyebrow: "EXPERTISE", h: "שירותי בוטיק\nבפריסה נועזת", sub: "קולאז׳ שחור-לבן עם היררכיה חזקה.", cta: "גלו שירות", img: "fashion", items: [{ title: "מיתוג", copy: "זהות שלמה.", meta: "01" }, { title: "אתר", copy: "עמודים ממירים.", meta: "02" }, { title: "תוכן", copy: "מסרים חדים.", meta: "03" }, { title: "צמיחה", copy: "תהליכים יציבים.", meta: "04" }], stats: [{ value: "A+", label: "איכות" }, { value: "12", label: "שנים" }, { value: "300+", label: "פרויקטים" }, { value: "5★", label: "דירוג" }] },
      { label: "תפריט", eyebrow: "MENU", h: "קטלוג שירותים\nמסודר", sub: "רשימה ברורה לצד מדיה גדולה.", cta: "בחרו מהרשימה", img: "beauty", items: [{ title: "פגישת ייעוץ", copy: "45 דקות.", meta: "01" }, { title: "חבילת בסיס", copy: "ליווי חודשי.", meta: "02" }, { title: "חבילת צמיחה", copy: "אתר + CRM.", meta: "03" }, { title: "ריטיינר", copy: "תחזוקה מלאה.", meta: "04" }, { title: "סדנה", copy: "הדרכת צוות.", meta: "05" }], stats: [{ value: "5", label: "פריטים" }, { value: "Clear", label: "מחיר" }, { value: "Fast", label: "הזמנה" }, { value: "Easy", label: "בחירה" }] },
      { label: "ייעוץ", eyebrow: "BOOK NOW", h: "השירות הנכון\nמתחיל בשיחה", sub: "טופס קביעה דומיננטי לסגירת פגישה.", cta: "שלחו בקשה", cta2: "התקשרו", img: "medical", items: [{ title: "מענה מהיר", copy: "תוך יום עסקים." }, { title: "ליווי", copy: "לא נעלמים." }, { title: "שקיפות", copy: "בלי הפתעות." }], stats: [{ value: "<24h", label: "חזרה" }, { value: "Free", label: "שיחה" }, { value: "No spam", label: "הבטחה" }, { value: "Human", label: "מענה" }] },
    ], SERVICES_IMGS),
  },
];

function cat(file, exportName, category, idPrefix, keywords, heName, imgSet, itemSets, labels) {
  const pages = labels.map((cfg, index) => {
    const pack = rotatePack(imgSet, index);
    return {
      key: String(index + 1).padStart(2, "0"),
      index,
      title: `${heName} – ${cfg.label}`,
      eyebrow: cfg.eyebrow,
      h: cfg.h,
      sub: cfg.sub,
      cta: cfg.cta,
      cta2: cfg.cta2,
      img: pack[0],
      images: pack,
      items: itemSets[index % itemSets.length],
      stats: cfg.stats || [
        { value: "98%", label: "שביעות רצון" },
        { value: "3x", label: "צמיחה" },
        { value: "14", label: "ימים" },
        { value: "5★", label: "דירוג" },
      ],
    };
  });
  return { file, exportName, category, idPrefix, keywords, pages };
}

const rest = [
  cat("galleryPageShowcaseSections.ts", "GALLERY_PAGE_SHOWCASE_SECTIONS", "gallery", "section-gallery-page", ["גלריה", "gallery", "wix"], "גלריה",
    ["architecture", "interior", "fashion", "workspace", "construction", "abstract", "beauty", "event", "nature", "travel", "camera", "studio"],
    [
      [{ title: "פרויקט מגורים", copy: "חללים חמים ומדויקים." }, { title: "מסחרי", copy: "נוכחות רחוב חזקה." }, { title: "מותג", copy: "שפה ויזואלית עקבית." }, { title: "אירוע", copy: "רגעים שנבחרו." }, { title: "מוצר", copy: "צילום שמוכר." }, { title: "דיגיטל", copy: "ממשקים נקיים." }],
      [{ title: "אור", copy: "קומפוזיציה בהירה.", meta: "01" }, { title: "צל", copy: "דרמה מבוקרת.", meta: "02" }, { title: "טקסטורה", copy: "חומרים אמיתיים.", meta: "03" }, { title: "פריים", copy: "רגע מדויק.", meta: "04" }, { title: "עריכה", copy: "סלקציה.", meta: "05" }],
      [{ title: "01 נבחר", copy: "עבודת דגל.", meta: "01" }, { title: "02 חדש", copy: "מהסטודיו.", meta: "02" }, { title: "03 אהוב", copy: "הכי נצפה.", meta: "03" }],
    ],
    [
      { label: "מייסון", eyebrow: "GALLERY", h: "עבודות\nבפריסת מייסון", sub: "רשת לא־סימטרית לעבודות נבחרות.", cta: "לכל העבודות" },
      { label: "פילמסטריפ", eyebrow: "FRAMES", h: "רצף פריימים\nמהסטודיו", sub: "פילמסטריפ אופקי עם סיפור ויזואלי.", cta: "צפו ברצף" },
      { label: "קייס", eyebrow: "CASE", h: "פרויקט דגל\nבמבט אחד", sub: "כיסוי גדול + מדדי הצלחה.", cta: "פתחו קייס" },
      { label: "קולאז׳", eyebrow: "SHOWCASE", h: "רגעים\nשנבחרו בקפידה", sub: "פריסת מגזין נועזת לגלריה.", cta: "גלו פרויקט" },
      { label: "ארכיון", eyebrow: "ARCHIVE", h: "פרויקטים\nנבחרים", sub: "רשימת ארכיון לצד מדיה גדולה.", cta: "צפו בפרטים" },
      { label: "תערוכה כהה", eyebrow: "EXHIBITION", h: "תערוכה\nבאווירה כהה", sub: "גלריה סינמטית למותגי פרימיום.", cta: "היכנסו לתערוכה" },
      { label: "סטודיו רך", eyebrow: "MOOD", h: "אווירה\nשנשארת בזיכרון", sub: "קיר סטודיו רך ומזמין.", cta: "שמרו השראה" },
      { label: "רשת צבעונית", eyebrow: "PROJECTS", h: "שישה פרויקטים\nבצבעים שונים", sub: "כרטיסי פרויקט חיים.", cta: "פתחו פרויקט" },
      { label: "קרוסלה", eyebrow: "SELECTED", h: "מבחר חופף\nמהפורטפוליו", sub: "קרוסלת עבודות עם עומק.", cta: "גללו הלאה" },
      { label: "פנייה", eyebrow: "COLLABORATE", h: "רוצים פרויקט\nכזה?", sub: "גלריה שמסתיימת בטופס פנייה.", cta: "דברו איתנו", cta2: "שלחו רעיון" },
    ],
  ),
  cat("contactPageShowcaseSections.ts", "CONTACT_PAGE_SHOWCASE_SECTIONS", "contact", "section-contact-page", ["צור קשר", "contact", "wix"], "יצירת קשר",
    ["office", "team", "workspace", "tech", "finance", "medical", "abstract", "hospitality", "architecture", "office"],
    [
      [{ title: "טלפון", copy: "שיחה ישירה." }, { title: "מייל", copy: "מענה כתוב." }, { title: "וואטסאפ", copy: "הודעה מהירה." }, { title: "כתובת", copy: "ביקור במשרד." }, { title: "זום", copy: "פגישה מרחוק." }, { title: "טופס", copy: "השארת פרטים." }],
      [{ title: "מהיר", copy: "חוזרים תוך יום.", meta: "01" }, { title: "אנושי", copy: "בלי בוטים.", meta: "02" }, { title: "ברור", copy: "בלי סיבובים.", meta: "03" }, { title: "מדויק", copy: "תיאום יומן.", meta: "04" }, { title: "סגירה", copy: "הצעה בכתב.", meta: "05" }],
    ],
    [
      { label: "דלפק", eyebrow: "CONTACT", h: "נשמח\nלשמוע מכם", sub: "מפה + ערוצים + טופס בדלפק אחד.", cta: "שלחו הודעה", cta2: "התקשרו" },
      { label: "מפוצל", eyebrow: "LET'S TALK", h: "השיחה הבאה\nמתחילה כאן", sub: "פיצול מקצועי עם כרטיסי ערוץ.", cta: "כתבו לנו" },
      { label: "צוות", eyebrow: "DESK", h: "הכירו את\nמי שעונה לכם", sub: "יצירת קשר דרך אנשי הצוות.", cta: "דברו עם הצוות" },
      { label: "טופס ראשון", eyebrow: "MESSAGE", h: "השאירו פרטים\nונחזור אליכם", sub: "טופס דומיננטי עם הבטחות מענה.", cta: "שליחה", cta2: "וואטסאפ" },
      { label: "ערוצים", eyebrow: "CHANNELS", h: "כל דרכי\nההתקשרות", sub: "ערוצים בכרטיסים צבעוניים.", cta: "בחרו ערוץ" },
      { label: "פרימיום", eyebrow: "PRIVATE LINE", h: "יצירת קשר\nבסגנון פרימיום", sub: "קו פרטי למותגים יוקרתיים.", cta: "השאירו פרטים" },
      { label: "קבלת פנים", eyebrow: "WELCOME", h: "דלת פתוחה\nלשיחה אמיתית", sub: "טון חם לעסק מקומי.", cta: "שלחו הודעה" },
      { label: "רשימה", eyebrow: "VISIT US", h: "בואו לבקר\nאו כתבו מרחוק", sub: "פרטי מיקום לצד מדיה.", cta: "נווטו אלינו" },
      { label: "פסיפס", eyebrow: "SUPPORT", h: "שירות לקוחות\nשאפשר לסמוך עליו", sub: "פסיפס ערוצי תמיכה.", cta: "פתחו פנייה" },
      { label: "שעות פעילות", eyebrow: "HOURS", h: "מתי אנחנו\nזמינים בשבילכם", sub: "אג׳נדת שעות + CTA.", cta: "קבעו שיחה" },
    ],
  ),
  cat("landingPageShowcaseSections.ts", "LANDING_PAGE_SHOWCASE_SECTIONS", "promote", "section-landing-page", ["נחיתה", "landing", "wix"], "נחיתה",
    ["product", "tech", "fashion", "ecommerce", "event", "finance", "abstract", "wellness", "product", "tech"],
    [
      [{ title: "הטבה", copy: "מחיר מוגבל." }, { title: "בונוס", copy: "מתנה בהרשמה." }, { title: "אחריות", copy: "בלי סיכון." }, { title: "מהיר", copy: "התחלה מיידית." }, { title: "פשוט", copy: "שלושה קליקים." }, { title: "תוצאה", copy: "רואים הבדל." }],
      [{ title: "לחצו", copy: "בוחרים מסלול.", meta: "01" }, { title: "נרשמים", copy: "משאירים פרטים.", meta: "02" }, { title: "מקבלים", copy: "הגישה נפתחת.", meta: "03" }, { title: "מתחילים", copy: "עובדים.", meta: "04" }, { title: "צומחים", copy: "מודדים.", meta: "05" }],
    ],
    [
      { label: "CTA יחיד", eyebrow: "LANDING", h: "הצעה אחת\nשאי אפשר לפספס", sub: "טיפוגרפיה דומיננטית סביב CTA יחיד.", cta: "להרשמה", cta2: "למידע" },
      { label: "הוכחה חברתית", eyebrow: "PROOF", h: "למה אלפי\nעסקים בחרו בזה", sub: "פסיפס יתרונות עם הוכחות.", cta: "הצטרפו עכשיו" },
      { label: "הצעה", eyebrow: "OFFER", h: "מבצע מוגבל\nבזמן", sub: "כרטיס הצעה בסגנון טיקט.", cta: "מימוש ההטבה" },
      { label: "יתרונות", eyebrow: "INCLUDED", h: "מה מקבלים\nבחבילה", sub: "רשימת תכולה לצד תמונה.", cta: "לקנייה" },
      { label: "השקה כהה", eyebrow: "EXCLUSIVE", h: "גישה מוקדמת\nלחברים בלבד", sub: "השקה סינמטית שחורה-זהב.", cta: "בקשו גישה" },
      { label: "ווייטליסט", eyebrow: "SOFT SELL", h: "הזמנה\nבלי לחץ", sub: "נחיתה רגועה למותגי לייפסטייל.", cta: "שמרו מקום" },
      { label: "דמו", eyebrow: "DEMO", h: "ראו את המוצר\nבפעולה", sub: "קייס דמו עם מדדים.", cta: "בקשו דמו" },
      { label: "פסיפס", eyebrow: "BENEFITS", h: "למה זה\nמשתלם עכשיו", sub: "יתרונות בכרטיסים חיים.", cta: "אני בפנים" },
      { label: "השוואה", eyebrow: "VS", h: "לפני ואחרי\nהמעבר אלינו", sub: "מטריצת השוואה חדה.", cta: "השוו בעצמכם" },
      { label: "ליד", eyebrow: "LEAD FORM", h: "השאירו פרטים\nוקבלו גישה", sub: "טופס לידים דומיננטי.", cta: "שלחו", cta2: "חזרו אליי" },
    ],
  ),
  cat("productsPageShowcaseSections.ts", "PRODUCTS_PAGE_SHOWCASE_SECTIONS", "commerce", "section-products-page", ["מוצרים", "products", "wix"], "מוצרים",
    ["ecommerce", "product", "fashion", "skincare", "beauty", "kitchen", "food", "tech", "workspace", "cafe", "studio", "abstract"],
    [
      [{ title: "חדש", copy: "מהמדף עכשיו." }, { title: "נמכר", copy: "הכי מבוקש." }, { title: "מוגבל", copy: "מלאי קטן." }, { title: "סט", copy: "חיסכון בחבילה." }, { title: "מתנה", copy: "אריזה מוכנה." }, { title: "דיגיטלי", copy: "הורדה מיידית." }],
      [{ title: "בחירה", copy: "מוצר אחד.", meta: "01" }, { title: "פרטים", copy: "מידות וצבע.", meta: "02" }, { title: "סל", copy: "מוסיפים.", meta: "03" }, { title: "תשלום", copy: "מאובטח.", meta: "04" }, { title: "משלוח", copy: "עד הבית.", meta: "05" }],
    ],
    [
      { label: "קטלוג", eyebrow: "SHOP", h: "מוצרים\nשנבחרו בקפידה", sub: "מדף קטלוג עם מחירים ברורים.", cta: "לקנייה", cta2: "לכל המוצרים" },
      { label: "מוצר מוביל", eyebrow: "FEATURED", h: "המוצר\nשכולם מדברים עליו", sub: "כיסוי גדול + מדדי מכירה.", cta: "הוסיפו לסל" },
      { label: "קולקציה", eyebrow: "COLLECTION", h: "הקולקציה\nהחדשה כאן", sub: "מייסון לקולקציית עונה.", cta: "גלו קולקציה" },
      { label: "מפרט", eyebrow: "SPECS", h: "השוו מוצרים\nלפי תכונות", sub: "מטריצת מפרט לקנייה חכמה.", cta: "השוו דגמים" },
      { label: "מרצ׳ כהה", eyebrow: "LUXE", h: "קולקציית\nפרימיום", sub: "חנות כהה למוצרי יוקרה.", cta: "גלו פרימיום" },
      { label: "בוטיק", eyebrow: "DAILY", h: "מוצרים\nלשגרה יפה", sub: "אווירה רכה למוצרי יום-יום.", cta: "הוסיפו לסל" },
      { label: "השוואה", eyebrow: "TIERS", h: "בחרו את\nהחבילה הנכונה", sub: "שלושה מסלולי מוצר.", cta: "בחרו עכשיו" },
      { label: "בסטסלרים", eyebrow: "BEST SELLERS", h: "הנמכרים\nביותר", sub: "קרוסלת מוצרים מובילים.", cta: "קנו עכשיו" },
      { label: "לוקבּוק", eyebrow: "LOOKBOOK", h: "לוקבּוק\nויזואלי", sub: "פילמסטריפ לקולקציה.", cta: "עלעל בלוקבּוק" },
      { label: "הזמנה", eyebrow: "ORDER", h: "הזמינו\nבכמה קליקים", sub: "טופס הזמנה מהיר.", cta: "שלחו הזמנה" },
    ],
  ),
  cat("pricingPageShowcaseSections.ts", "PRICING_PAGE_SHOWCASE_SECTIONS", "pricing", "section-pricing-page", ["תמחור", "pricing", "wix"], "תמחור",
    ["finance", "tech", "office", "product", "finance", "tech", "abstract", "wellness", "tech", "office"],
    [
      [{ title: "Basic", copy: "להתחלה." }, { title: "Plus", copy: "לצמיחה." }, { title: "Pro", copy: "לעסקים." }, { title: "שנתי", copy: "חיסכון." }, { title: "חודשי", copy: "גמיש." }, { title: "מותאם", copy: "לפי צורך." }],
      [{ title: "בחירה", copy: "מסלול.", meta: "01" }, { title: "ניסיון", copy: "14 יום.", meta: "02" }, { title: "הפעלה", copy: "מיידית.", meta: "03" }, { title: "שימוש", copy: "כל הכלים.", meta: "04" }, { title: "שדרוג", copy: "בכל רגע.", meta: "05" }],
    ],
    [
      { label: "3 מסלולים", eyebrow: "PRICING", h: "מחירים\nשקופים ופשוטים", sub: "שלושה מסלולים עם הדגשת Pro.", cta: "בחרו חבילה", cta2: "שאלו אותנו" },
      { label: "מטריצה", eyebrow: "COMPARE", h: "השוו\nותבחרו נכון", sub: "טבלת פיצ׳רים מלאה.", cta: "השוואה מלאה" },
      { label: "ערך", eyebrow: "VALUE", h: "הערך\nמאחורי המחיר", sub: "פסיפס יתרונות מול עלות.", cta: "התחילו ניסיון" },
      { label: "פרימיום", eyebrow: "PRO", h: "מסלול Pro\nלעסקים רציניים", sub: "תמחור דרמטי שחור-זהב.", cta: "שדרגו ל-Pro" },
      { label: "סטארטר", eyebrow: "SIMPLE", h: "תמחור\nבלי הפתעות", sub: "שפה רגועה למחירים.", cta: "בחרו מסלול" },
      { label: "סטאק", eyebrow: "STACK", h: "מה כלול\nבכל שלב", sub: "רשימת ערך לצד מדיה.", cta: "הצטרפו" },
      { label: "FAQ+מחיר", eyebrow: "HELP", h: "שאלות על\nהתמחור", sub: "אקורדיון תשובות ליד המחיר.", cta: "עוד פרטים" },
      { label: "סטייטמנט", eyebrow: "CLEAR PRICE", h: "מחיר אחד\nשחוסך זמן", sub: "מסר מחיר גדול וחד.", cta: "התחילו עכשיו" },
      { label: "מדדים", eyebrow: "ROI", h: "החזר השקעה\nשרואים", sub: "מספרי חיסכון על רקע כהה.", cta: "חשבו חיסכון" },
      { label: "הצעת מחיר", eyebrow: "CUSTOM QUOTE", h: "צריכים\nהצעה מותאמת?", sub: "טופס הצעת מחיר.", cta: "בקשו הצעה" },
    ],
  ),
  cat("blogPageShowcaseSections.ts", "BLOG_PAGE_SHOWCASE_SECTIONS", "blog", "section-blog-page", ["בלוג", "blog", "wix"], "בלוג",
    ["education", "writing", "bookshelf", "laptop", "office", "workspace", "cafe", "nature", "meeting", "hands", "studio", "tech"],
    [
      [{ title: "מדריך", copy: "שלב אחר שלב." }, { title: "טיפ", copy: "מהיר ליישום." }, { title: "ראיון", copy: "מאחורי הקלעים." }, { title: "ניתוח", copy: "מספרים אמיתיים." }, { title: "סיפור", copy: "מהשטח." }, { title: "עדכון", copy: "מה חדש." }],
      [{ title: "קוראים", copy: "פותחים פוסט.", meta: "01" }, { title: "לומדים", copy: "מיישמים.", meta: "02" }, { title: "משתפים", copy: "מעבירים הלאה.", meta: "03" }, { title: "חוזרים", copy: "לפוסט הבא.", meta: "04" }, { title: "נרשמים", copy: "לניוזלטר.", meta: "05" }],
    ],
    [
      { label: "רשימת מאמרים", eyebrow: "BLOG", h: "תובנות\nלעסק צומח", sub: "רשימת מאמרים לצד מדיה.", cta: "לכל הפוסטים" },
      { label: "כתבה מובילה", eyebrow: "FEATURED", h: "הכתבה\nשכולם קוראים", sub: "כיסוי גדול למאמר דגל.", cta: "התחילו לקרוא" },
      { label: "מגזין", eyebrow: "STORIES", h: "סיפורים\nמהשטח", sub: "פריסת מגזין נועזת.", cta: "גלו כתבה" },
      { label: "נושאים", eyebrow: "TOPICS", h: "הנושאים\nהחמים השבוע", sub: "כרטיסי נושא בצבעים.", cta: "בחרו נושא" },
      { label: "כותב", eyebrow: "AUTHOR", h: "הכירו את\nהכותבים שלנו", sub: "ספוטלייט לכותבים.", cta: "לפרופילים" },
      { label: "קריאה כהה", eyebrow: "DEEP DIVES", h: "מאמרים\nלעומק", sub: "בלוג כהה לתוכן כבד.", cta: "צללו פנימה" },
      { label: "ניוזלטר", eyebrow: "NOTES", h: "הערות קצרות\nמהיום־יום", sub: "טון אישי ורגוע.", cta: "קראו הערה" },
      { label: "סדרה", eyebrow: "SERIES", h: "סדרת מדריכים\nשלב אחר שלב", sub: "בלוג כמסע למידה.", cta: "למדריך הראשון" },
      { label: "ארכיון", eyebrow: "ARCHIVE", h: "ארכיון\nמסודר", sub: "מדף מאמרים ארכיוני.", cta: "לכל הארכיון" },
      { label: "הרשמה", eyebrow: "SUBSCRIBE", h: "קבלו תובנות\nלמייל", sub: "טופס ניוזלטר.", cta: "להרשמה" },
    ],
  ),
  cat("eventsPageShowcaseSections.ts", "EVENTS_PAGE_SHOWCASE_SECTIONS", "events", "section-events-page", ["אירועים", "events", "wix"], "אירועים",
    ["event", "stage", "hospitality", "travel", "team", "city", "abstract", "cafe", "meeting", "hands", "studio", "nature"],
    [
      [{ title: "הופעה", copy: "במה חיה.", meta: "20:00" }, { title: "סדנה", copy: "למידה מעשית.", meta: "18:30" }, { title: "מפגש", copy: "נטוורקינג.", meta: "19:00" }, { title: "השקה", copy: "מוצר חדש.", meta: "17:00" }, { title: "כנס", copy: "יום מלא.", meta: "09:00" }, { title: "ערב", copy: "אווירה.", meta: "21:00" }],
      [{ title: "שמירה", copy: "RSVP.", meta: "01" }, { title: "תזכורת", copy: "הודעה.", meta: "02" }, { title: "הגעה", copy: "צ׳ק אין.", meta: "03" }, { title: "חוויה", copy: "האירוע.", meta: "04" }, { title: "אחרי", copy: "סיכום.", meta: "05" }],
    ],
    [
      { label: "כרטיס", eyebrow: "EVENTS", h: "אירועים\nששווה להגיע אליהם", sub: "כרטיס אירוע דרמטי עם stub.", cta: "לרכישת כרטיס", cta2: "לכל האירועים" },
      { label: "אג׳נדה", eyebrow: "SCHEDULE", h: "לו״ז מלא\nליום האירוע", sub: "שורות אג׳נדה ברורות.", cta: "הורידו לו״ז" },
      { label: "מקום", eyebrow: "VENUE", h: "המקום\nשעושה את האווירה", sub: "קייס מקום + מדדים.", cta: "גלו את המקום" },
      { label: "לוח", eyebrow: "CALENDAR", h: "שישה אירועים\nבצבעים שונים", sub: "כרטיסי אירוע חיים.", cta: "ללוח השנה" },
      { label: "דוברים", eyebrow: "LINEUP", h: "הדוברים\nשלא כדאי לפספס", sub: "גריד דיוקנאות לליינאפ.", cta: "לפרטי הדוברים" },
      { label: "לילה", eyebrow: "NIGHT", h: "אירוע לילה\nבלתי נשכח", sub: "אווירת לילה סינמטית.", cta: "הזמינו כרטיס" },
      { label: "סדנה", eyebrow: "GATHER", h: "מפגשים\nבאווירה נעימה", sub: "אירועים קהילתיים רכים.", cta: "אני מגיע/ה" },
      { label: "ספירה", eyebrow: "COMMUNITY", h: "קהילה\nשגדלה בכל מפגש", sub: "מספרי קהל על רקע כהה.", cta: "הצטרפו" },
      { label: "לו״ז", eyebrow: "FLOW", h: "מהרעיון\nעד סוף הערב", sub: "ציר זמן למשתתפים.", cta: "ללו״ז המלא" },
      { label: "RSVP", eyebrow: "RSVP", h: "שמרו מקום\nלפני שייגמר", sub: "טופס RSVP דומיננטי.", cta: "RSVP" },
    ],
  ),
  cat("testimonialsPageShowcaseSections.ts", "TESTIMONIALS_PAGE_SHOWCASE_SECTIONS", "testimonials", "section-testimonials-sheet", ["ביקורות", "reviews", "wix"], "ביקורות",
    ["team", "office", "portrait", "team", "workspace", "finance", "abstract", "wellness", "portrait", "team"],
    [
      [{ title: "״שירות מדהים״", copy: "חזרנו לקוחות קבועים." }, { title: "״מהיר ומדויק״", copy: "הכול בזמן." }, { title: "״מקצועי״", copy: "הרגשנו בידיים טובות." }, { title: "״מומלץ״", copy: "כבר שלחנו חברים." }, { title: "״שווה כל שקל״", copy: "ראינו תוצאה." }, { title: "״יחס אישי״", copy: "לא עוד מספר." }],
      [{ title: "לפני", copy: "בלגן וכלים רבים.", meta: "01" }, { title: "במהלך", copy: "ליווי צמוד.", meta: "02" }, { title: "אחרי", copy: "סדר ותוצאות.", meta: "03" }, { title: "המלצה", copy: "ממליצים הלאה.", meta: "04" }, { title: "חזרה", copy: "עובדים שוב.", meta: "05" }],
    ],
    [
      { label: "קיר ציטוטים", eyebrow: "REVIEWS", h: "לקוחות\nשממליצים", sub: "קיר ציטוטים חי עם מבטאים.", cta: "קראו עוד" },
      { label: "המלצה מובילה", eyebrow: "FEATURED", h: "הסיפור\nשמסכם הכול", sub: "המלצה מובילה עם מדדים.", cta: "ראו המלצות" },
      { label: "קרוסלה", eyebrow: "WALL", h: "קיר המלצות\nבתנועה", sub: "כרטיסי ביקורת חופפים.", cta: "לכל הביקורות" },
      { label: "לוגו+ציטוט", eyebrow: "STORIES", h: "סיפורי הצלחה\nאמיתיים", sub: "מגזין המלצות נועז.", cta: "גלו סיפור" },
      { label: "דירוגים", eyebrow: "RATINGS", h: "המספרים\nשל שביעות הרצון", sub: "דירוגים זוהרים על כהה.", cta: "בדקו דירוגים" },
      { label: "כהה", eyebrow: "VOICES", h: "קולות\nשמכירים את העבודה", sub: "המלצות דרמטיות.", cta: "הקשיבו ללקוחות" },
      { label: "מילים חמות", eyebrow: "KIND WORDS", h: "מילים חמות\nמלקוחות אמיתיים", sub: "טון רך להמלצות שירות.", cta: "קראו המלצה" },
      { label: "לפני/אחרי", eyebrow: "JOURNEY", h: "מהלקוח אמר\nאחרי התהליך", sub: "המלצות על ציר זמן.", cta: "התחילו גם אתם" },
      { label: "פילמסטריפ", eyebrow: "FACES", h: "פנים וציטוטים\nברצף", sub: "פילמסטריפ לקוחות.", cta: "עוד ציטוטים" },
      { label: "טופס ביקורת", eyebrow: "SHARE", h: "החוויה שלכם\nחשובה לנו", sub: "טופס ביקורת.", cta: "כתבו ביקורת" },
    ],
  ),
];

// Fix accidental typo in testimonials idPrefix
rest[rest.length - 1].idPrefix = "section-testimonials-page";

rest.push(
  cat("teamPageShowcaseSections.ts", "TEAM_PAGE_SHOWCASE_SECTIONS", "team", "section-team-page", ["צוות", "team", "wix"], "צוות",
    ["team", "portrait", "meeting", "hands", "office", "workspace", "studio", "hospitality", "cafe", "city", "laptop", "finance"],
    [
      [{ title: "עיצוב", copy: "ויזואל וממשקים." }, { title: "פיתוח", copy: "קוד וביצועים." }, { title: "שיווק", copy: "צמיחה." }, { title: "מכירות", copy: "סגירות." }, { title: "תמיכה", copy: "לקוחות מרוצים." }, { title: "הנהלה", copy: "חזון." }],
      [{ title: "היכרות", copy: "יום ראשון.", meta: "01" }, { title: "חניכה", copy: "ליווי צמוד.", meta: "02" }, { title: "עשייה", copy: "פרויקטים.", meta: "03" }, { title: "צמיחה", copy: "קידום.", meta: "04" }, { title: "מנהיגות", copy: "הובלה.", meta: "05" }],
    ],
    [
      { label: "פורטרטים", eyebrow: "TEAM", h: "האנשים\nמאחורי העשייה", sub: "גריד דיוקנאות מקצועי.", cta: "הכירו את כולם" },
      { label: "הנהלה", eyebrow: "LEADERSHIP", h: "צוות קטן\nעם השפעה גדולה", sub: "פיצול היכרות עם ההנהלה.", cta: "לפרופילים" },
      { label: "פסיפס", eyebrow: "CREW", h: "כישרונות\nשמניעים מותגים", sub: "פסיפס צוות לא־סימטרי.", cta: "גלו מי אנחנו" },
      { label: "תפקידים", eyebrow: "MEMBERS", h: "שישה פנים\nבצבעים שונים", sub: "כרטיסי תפקיד חיים.", cta: "צרו קשר עם הצוות" },
      { label: "סטודיו כהה", eyebrow: "TALENT", h: "הצוות\nשמאחורי הקלעים", sub: "סטודיו כהה לכישרון.", cta: "דברו עם המומחים" },
      { label: "אנשים", eyebrow: "FAMILY", h: "יותר מעסק\nקהילה", sub: "טון חם לעמוד צוות.", cta: "הכירו מקרוב" },
      { label: "גיוס", eyebrow: "CAREERS", h: "רוצים\nלעבוד איתנו?", sub: "סטייטמנט גיוס גדול.", cta: "שלחו קו״ח" },
      { label: "כישורים", eyebrow: "ROLES", h: "תפקידים\nוהתמחויות", sub: "רשימת תפקידים לצד תמונה.", cta: "לפרטי התפקיד" },
      { label: "תרבות", eyebrow: "TOGETHER", h: "שנים, פרויקטים\nואנשים", sub: "מדדי תרבות על רקע כהה.", cta: "ראו קריירה" },
      { label: "הצטרפות", eyebrow: "JOIN", h: "הצטרפו\nלצוות שלנו", sub: "טופס מועמדות.", cta: "שלחו קו״ח" },
    ],
  ),
  cat("faqPageShowcaseSections.ts", "FAQ_PAGE_SHOWCASE_SECTIONS", "faq", "section-faq-page", ["שאלות נפוצות", "faq", "wix"], "שאלות נפוצות",
    ["education", "office", "workspace", "tech", "finance", "tech", "abstract", "wellness", "education", "office"],
    [
      [{ title: "איך מתחילים?", copy: "נרשמים ובוחרים תבנית." }, { title: "יש ניסיון?", copy: "כן, 14 יום." }, { title: "צריך כרטיס?", copy: "לא לשלב הניסיון." }, { title: "אפשר לבטל?", copy: "בכל רגע." }, { title: "יש תמיכה?", copy: "צ׳אט ומייל." }, { title: "מה עם דומיין?", copy: "אפשר לחבר." }],
      [{ title: "שאלה", copy: "פותחים נושא.", meta: "01" }, { title: "חיפוש", copy: "מוצאים תשובה.", meta: "02" }, { title: "הבנה", copy: "מיישמים.", meta: "03" }, { title: "עזרה", copy: "אם צריך — פונים.", meta: "04" }, { title: "פתרון", copy: "חוזרים לעבודה.", meta: "05" }],
    ],
    [
      { label: "אקורדיון", eyebrow: "FAQ", h: "תשובות\nלשאלות החשובות", sub: "אקורדיון שאלות קלאסי.", cta: "לא מצאתם תשובה?" },
      { label: "חיפוש", eyebrow: "HELP", h: "כל מה שרציתם\nלדעת", sub: "רשימת תשובות לצד מדיה.", cta: "חיפוש תשובה" },
      { label: "נושאים", eyebrow: "TOPICS", h: "נושאים\nבצבעים שונים", sub: "קטגוריות שאלות חיות.", cta: "בחרו נושא" },
      { label: "עזרה כהה", eyebrow: "SUPPORT", h: "תמיכה\nבלי בלבול", sub: "עזרה דרמטית וברורה.", cta: "פתחו קריאה" },
      { label: "תמיכה רכה", eyebrow: "FRIENDLY HELP", h: "עזרה\nבשפה פשוטה", sub: "טון רך לשאלות נפוצות.", cta: "שאלו אותנו" },
      { label: "שלבים", eyebrow: "SETUP", h: "שאלות לפי\nשלבי שימוש", sub: "FAQ על ציר תהליך.", cta: "להתחלה מהירה" },
      { label: "קשר+FAQ", eyebrow: "CONTACT HELP", h: "שאלה שלא\nמצאתם כאן?", sub: "ערוצי קשר לצד עזרה.", cta: "כתבו לנו" },
      { label: "פסיפס", eyebrow: "QUICK FACTS", h: "עובדות\nבקצרה", sub: "פסיפס תשובות זריזות.", cta: "עוד פרטים" },
      { label: "מדריך", eyebrow: "GUIDES", h: "שאלות\nעם הקשר", sub: "FAQ בסגנון מדריך.", cta: "למדריכים" },
      { label: "שאלה", eyebrow: "STILL STUCK", h: "עדיין צריכים\nעזרה?", sub: "טופס פנייה בסוף העמוד.", cta: "שלחו שאלה" },
    ],
  ),
  cat("resumePageShowcaseSections.ts", "RESUME_PAGE_SHOWCASE_SECTIONS", "resume", "section-resume-page", ["קורות חיים", "resume", "wix"], "קורות חיים",
    ["portrait", "office", "workspace", "tech", "finance", "finance", "abstract", "portrait", "office", "team"],
    [
      [{ title: "עיצוב", copy: "UI/UX ומותג." }, { title: "פיתוח", copy: "React ו-Node." }, { title: "ניהול", copy: "צוותים ופרויקטים." }, { title: "שיווק", copy: "צמיחה דיגיטלית." }, { title: "כתיבה", copy: "תוכן ומסרים." }, { title: "אסטרטגיה", copy: "חשיבה עסקית." }],
      [{ title: "התחלה", copy: "תפקיד ראשון.", meta: "01" }, { title: "צמיחה", copy: "קידום.", meta: "02" }, { title: "הובלה", copy: "ניהול.", meta: "03" }, { title: "השפעה", copy: "תוצאות.", meta: "04" }, { title: "היום", copy: "מוכן להזדמנות.", meta: "05" }],
    ],
    [
      { label: "עמודות CV", eyebrow: "RESUME", h: "פרופיל מקצועי\nבמבט אחד", sub: "עמודת זהות + ניסיון.", cta: "הורידו PDF", cta2: "צרו קשר" },
      { label: "ציר קריירה", eyebrow: "CAREER", h: "הדרך\nעד היום", sub: "ציר קריירה ברור.", cta: "הזמינו ראיון" },
      { label: "כישורים", eyebrow: "SKILLS", h: "כישורים\nבצבעים חיים", sub: "כרטיסי מיומנויות.", cta: "לפרטים" },
      { label: "פרויקטים", eyebrow: "PROJECTS", h: "פרויקטים\nשמספרים עליי", sub: "קייס פרויקטים עם מדדים.", cta: "ראו פרויקטים" },
      { label: "פורטפוליו כהה", eyebrow: "PROFILE", h: "פרופיל\nמקצועי בולט", sub: "מותג אישי דרמטי.", cta: "צור קשר" },
      { label: "אישי", eyebrow: "ABOUT ME", h: "מי אני\nומה אני מביא/ה", sub: "טון אישי לעמוד קו״ח.", cta: "בואו נדבר" },
      { label: "השכלה", eyebrow: "EDUCATION", h: "השכלה\nוהכשרות", sub: "רשימת רקע לצד דיוקן.", cta: "הורדה" },
      { label: "הישגים", eyebrow: "IMPACT", h: "מספרים\nמהקריירה", sub: "הישגים מדידים על כהה.", cta: "דברו איתי" },
      { label: "מפוצל", eyebrow: "CV", h: "ניסיון, כישורים\nותוצאות", sub: "פיצול מקצועי לקו״ח.", cta: "שלחו הצעה" },
      { label: "גיוס", eyebrow: "HIRE ME", h: "פנויים\nלהזדמנות הבאה", sub: "טופס גיוס.", cta: "שלחו הצעת עבודה" },
    ],
  ),
);

const allCategories = [...categories, ...rest];

function genFile(catDef) {
  const lines = [];
  lines.push('import { VISUAL_LIBRARY_IMAGES as IMG } from "./libraryAssets";');
  lines.push('import type { VisualLibrarySectionTemplate } from "./visualLibraryTypes";');
  lines.push("import {");
  lines.push("  buildCategoryPageNodes,");
  lines.push("  getRecipeMeta,");
  lines.push("  makePageSection,");
  lines.push('} from "./pageShowcaseHelpers";');
  lines.push("");

  const varNames = [];
  for (const p of catDef.pages) {
    const vn = `page${p.key}`;
    varNames.push(vn);
    const items = (p.items || [])
      .map(
        (it) =>
          `{ title: '${esc(it.title)}', copy: '${esc(it.copy || "")}'${
            it.meta ? `, meta: '${esc(it.meta)}'` : ""
          } }`,
      )
      .join(", ");
    const stats = (p.stats || [])
      .map((st) => `{ value: '${esc(st.value)}', label: '${esc(st.label)}' }`)
      .join(", ");

    lines.push(`const ${vn} = (() => {`);
    lines.push(`  const meta = getRecipeMeta("${catDef.category}", ${p.index});`);
    lines.push(`  return makePageSection({`);
    lines.push(`    id: "${catDef.idPrefix}-${p.key}",`);
    lines.push(`    category: "${catDef.category}",`);
    lines.push(`    title: "${esc(p.title)}",`);
    lines.push(`    previewLayout: "${catDef.idPrefix}-${p.key}",`);
    lines.push(`    backgroundColor: meta.backgroundColor,`);
    lines.push(`    minHeight: meta.minHeight,`);
    lines.push(`    thumbnail: IMG.${p.img},`);
    lines.push(`    keywords: ${JSON.stringify(catDef.keywords)},`);
    lines.push(`    nodes: buildCategoryPageNodes("${catDef.category}", ${p.index}, {`);
    lines.push(`      eyebrow: '${esc(p.eyebrow)}',`);
    lines.push(`      title: '${esc(p.h)}',`);
    lines.push(`      subtitle: '${esc(p.sub)}',`);
    lines.push(`      cta: '${esc(p.cta)}',`);
    if (p.cta2) lines.push(`      secondaryCta: '${esc(p.cta2)}',`);
    lines.push(`      image: IMG.${p.img},`);
    const imageList = (p.images || [p.img])
      .map((key) => `IMG.${key}`)
      .join(", ");
    lines.push(`      images: [${imageList}],`);
    lines.push(`      items: [${items}],`);
    lines.push(`      stats: [${stats}],`);
    lines.push("    }),");
    lines.push("  });");
    lines.push("})();");
    lines.push("");
  }

  lines.push(
    `export const ${catDef.exportName}: VisualLibrarySectionTemplate[] = [`,
  );
  lines.push(`  ${varNames.join(",\n  ")},`);
  lines.push("];");
  lines.push("");

  fs.writeFileSync(path.join(dir, catDef.file), lines.join("\n"), "utf8");
  console.log("wrote", catDef.file, "patterns via category recipes");
}

for (const c of allCategories) genFile(c);
console.log("done", allCategories.length, "categories");
