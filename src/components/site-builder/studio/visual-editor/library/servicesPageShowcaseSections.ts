import { VISUAL_LIBRARY_IMAGES as IMG } from "./libraryAssets";
import type { VisualLibrarySectionTemplate } from "./visualLibraryTypes";
import {
  buildLayoutNodes,
  makePageSection,
  type PageLayoutKind,
} from "./pageShowcaseHelpers";

const page01 = makePageSection({
  id: "section-services-page-01",
  category: "services",
  title: "שירותים – כחול עסקי",
  previewLayout: "section-services-page-01",
  backgroundColor: "#ffffff",
  minHeight: "1600px",
  thumbnail: IMG.tech,
  keywords: ["שירותים","services","wix"],
  nodes: buildLayoutNodes("split" as PageLayoutKind, {
    eyebrow: 'SERVICES',
    title: 'שירותים\nשמובילים לתוצאה',
    subtitle: 'הצגת שירותים מקצועית עם דגש כחול.',
    cta: 'בחרו שירות',
    secondaryCta: 'דברו איתנו',
    image: IMG.tech,
    items: [{ title: 'ייעוץ', copy: 'אבחון ואסטרטגיה.' }, { title: 'עיצוב', copy: 'חוויה ויזואלית.' }, { title: 'פיתוח', copy: 'ביצועים ומוצר.' }, { title: 'שיווק', copy: 'משפך שממיר.' }, { title: 'תמיכה', copy: 'ליווי שוטף.' }, { title: 'הדרכה', copy: 'צוות עצמאי.' }],
    stats: [{ value: '40+', label: 'שירותים' }, { value: '4.9', label: 'דירוג' }, { value: '72ש׳', label: 'מענה' }, { value: '100%', label: 'מותאם' }],
  }),
});

const page02 = makePageSection({
  id: "section-services-page-02",
  category: "services",
  title: "שירותים – Editorial חם",
  previewLayout: "section-services-page-02",
  backgroundColor: "#f7f1ea",
  minHeight: "1500px",
  thumbnail: IMG.office,
  keywords: ["שירותים","services","wix"],
  nodes: buildLayoutNodes("center" as PageLayoutKind, {
    eyebrow: 'WHAT WE OFFER',
    title: 'המומחיות\nשלנו בשירותכם',
    subtitle: 'עמוד שירותים רגוע ומזמין.',
    cta: 'לכל השירותים',
    image: IMG.office,
    items: [{ title: 'אסטרטגיה', copy: 'מסר מדויק.' }, { title: 'ביצוע', copy: 'תוצרים מוכנים.' }, { title: 'מדידה', copy: 'תוצאות ברורות.' }],
    stats: [{ value: '3', label: 'שלבים' }, { value: '1', label: 'צוות' }, { value: '∞', label: 'שיפור' }, { value: '24/7', label: 'גיבוי' }],
  }),
});

const page03 = makePageSection({
  id: "section-services-page-03",
  category: "services",
  title: "שירותים – מגזין שחור",
  previewLayout: "section-services-page-03",
  backgroundColor: "#ffffff",
  minHeight: "1550px",
  thumbnail: IMG.workspace,
  keywords: ["שירותים","services","wix"],
  nodes: buildLayoutNodes("magazine" as PageLayoutKind, {
    eyebrow: 'EXPERTISE',
    title: 'שירותי בוטיק\nבפריסה נועזת',
    subtitle: 'שחור-לבן עם היררכיה חזקה.',
    cta: 'גלו שירות',
    image: IMG.workspace,
    items: [{ title: 'מיתוג', copy: 'זהות שלמה.' }, { title: 'אתר', copy: 'עמודים ממירים.' }, { title: 'תוכן', copy: 'מסרים חדים.' }, { title: 'צמיחה', copy: 'תהליכים יציבים.' }],
    stats: [{ value: 'A+', label: 'איכות' }, { value: '12', label: 'שנים' }, { value: '300+', label: 'פרויקטים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page04 = makePageSection({
  id: "section-services-page-04",
  category: "services",
  title: "שירותים – כרטיסים צבעוניים",
  previewLayout: "section-services-page-04",
  backgroundColor: "#eef6ff",
  minHeight: "1500px",
  thumbnail: IMG.product,
  keywords: ["שירותים","services","wix"],
  nodes: buildLayoutNodes("cards" as PageLayoutKind, {
    eyebrow: 'PACKAGES',
    title: 'שישה שירותים\nבצבעים חיים',
    subtitle: 'כל כרטיס בצבע אחר — מגוון אמיתי.',
    cta: 'השוו חבילות',
    image: IMG.product,
    items: [{ title: 'Starter', copy: 'להתחלה מהירה.' }, { title: 'Growth', copy: 'לצמיחה.' }, { title: 'Pro', copy: 'לעסקים רציניים.' }, { title: 'Design', copy: 'עיצוב מלא.' }, { title: 'Tech', copy: 'פיתוח מתקדם.' }, { title: 'Care', copy: 'תחזוקה שוטפת.' }],
    stats: [{ value: '6', label: 'חבילות' }, { value: '0', label: 'קוד' }, { value: '14', label: 'ימים' }, { value: '1', label: 'מחיר' }],
  }),
});

const page05 = makePageSection({
  id: "section-services-page-05",
  category: "services",
  title: "שירותים – ציר סגול",
  previewLayout: "section-services-page-05",
  backgroundColor: "#f6f4ff",
  minHeight: "1580px",
  thumbnail: IMG.finance,
  keywords: ["שירותים","services","wix"],
  nodes: buildLayoutNodes("timeline" as PageLayoutKind, {
    eyebrow: 'PROCESS',
    title: 'איך העבודה\nמתבצעת',
    subtitle: 'שירותים כמסע לקוח סגול.',
    cta: 'התחילו תהליך',
    image: IMG.finance,
    items: [{ title: 'שיחת אפיון', copy: 'מבינים צורך.', meta: '01' }, { title: 'הצעה', copy: 'תוכנית ברורה.', meta: '02' }, { title: 'ביצוע', copy: 'עבודה מדויקת.', meta: '03' }, { title: 'השקה', copy: 'יציאה לאוויר.', meta: '04' }, { title: 'אופטימיזציה', copy: 'שיפור מתמשך.', meta: '05' }],
    stats: [{ value: '5', label: 'שלבים' }, { value: '1', label: 'מנהל' }, { value: 'Weekly', label: 'עדכון' }, { value: 'SLA', label: 'מחייבים' }],
  }),
});

const page06 = makePageSection({
  id: "section-services-page-06",
  category: "services",
  title: "שירותים – לוח מספרים",
  previewLayout: "section-services-page-06",
  backgroundColor: "#111827",
  minHeight: "1480px",
  thumbnail: IMG.finance,
  keywords: ["שירותים","services","wix"],
  nodes: buildLayoutNodes("stats" as PageLayoutKind, {
    eyebrow: 'IMPACT',
    title: 'שירותים\nעם מדדים',
    subtitle: 'מחברים שירות לתוצאה עסקית.',
    cta: 'ראו תוצאות',
    image: IMG.finance,
    items: [{ title: 'מהירות', copy: 'מסירה בזמן.' }, { title: 'איכות', copy: 'סטנדרט גבוה.' }, { title: 'שקיפות', copy: 'דיווח שוטף.' }],
    stats: [{ value: '86%', label: 'חיסכון' }, { value: '2.4x', label: 'ROI' }, { value: '4.9', label: 'דירוג' }, { value: '30+', label: 'תבניות' }],
  }),
});

const page07 = makePageSection({
  id: "section-services-page-07",
  category: "services",
  title: "שירותים – קולנוע זהב",
  previewLayout: "section-services-page-07",
  backgroundColor: "#09090b",
  minHeight: "1500px",
  thumbnail: IMG.abstract,
  keywords: ["שירותים","services","wix"],
  nodes: buildLayoutNodes("dark" as PageLayoutKind, {
    eyebrow: 'PREMIUM',
    title: 'שירותים\nברמת בוטיק',
    subtitle: 'יוקרה שחורה עם זהב.',
    cta: 'הזמינו פגישה',
    image: IMG.abstract,
    items: [{ title: 'ליווי אישי', copy: 'יחס one-to-one.' }, { title: 'דיוק', copy: 'פרטים קטנים.' }, { title: 'בלעדיות', copy: 'קשב מלא.' }],
    stats: [{ value: 'VIP', label: 'מסלול' }, { value: '1:1', label: 'יחס' }, { value: 'Gold', label: 'סטנדרט' }, { value: '24h', label: 'מענה' }],
  }),
});

const page08 = makePageSection({
  id: "section-services-page-08",
  category: "services",
  title: "שירותים – לייפסטייל ורוד",
  previewLayout: "section-services-page-08",
  backgroundColor: "#fde8e4",
  minHeight: "1520px",
  thumbnail: IMG.wellness,
  keywords: ["שירותים","services","wix"],
  nodes: buildLayoutNodes("lifestyle" as PageLayoutKind, {
    eyebrow: 'CARE',
    title: 'שירות אישי\nשמרגיש נכון',
    subtitle: 'טון חם לשירותי טיפוח וליווי.',
    cta: 'קבעו תור',
    image: IMG.wellness,
    items: [{ title: 'אישי', copy: 'מותאם לכם.' }, { title: 'רגוע', copy: 'בלי לחץ.' }, { title: 'קרוב', copy: 'תמיד זמינים.' }],
    stats: [{ value: '♥', label: 'יחס' }, { value: 'Same day', label: 'תורים' }, { value: 'Soft', label: 'טון' }, { value: 'Local', label: 'שירות' }],
  }),
});

const page09 = makePageSection({
  id: "section-services-page-09",
  category: "services",
  title: "שירותים – רשימה ירוקה",
  previewLayout: "section-services-page-09",
  backgroundColor: "#f0faf4",
  minHeight: "1450px",
  thumbnail: IMG.beauty,
  keywords: ["שירותים","services","wix"],
  nodes: buildLayoutNodes("listMedia" as PageLayoutKind, {
    eyebrow: 'MENU',
    title: 'קטלוג שירותים\nמסודר',
    subtitle: 'רשימה ברורה לצד מדיה.',
    cta: 'בחרו מהרשימה',
    image: IMG.beauty,
    items: [{ title: 'פגישת ייעוץ', copy: '45 דקות.' }, { title: 'חבילת בסיס', copy: 'ליווי חודשי.' }, { title: 'חבילת צמיחה', copy: 'אתר + CRM.' }, { title: 'ריטיינר', copy: 'תחזוקה מלאה.' }, { title: 'סדנה', copy: 'הדרכת צוות.' }],
    stats: [{ value: '5', label: 'פריטים' }, { value: 'Clear', label: 'מחיר' }, { value: 'Fast', label: 'הזמנה' }, { value: 'Easy', label: 'בחירה' }],
  }),
});

const page10 = makePageSection({
  id: "section-services-page-10",
  category: "services",
  title: "שירותים – טופס כתום",
  previewLayout: "section-services-page-10",
  backgroundColor: "#fff7ed",
  minHeight: "1450px",
  thumbnail: IMG.medical,
  keywords: ["שירותים","services","wix"],
  nodes: buildLayoutNodes("ctaForm" as PageLayoutKind, {
    eyebrow: 'BOOK NOW',
    title: 'השירות הנכון\nמתחיל בשיחה',
    subtitle: 'טופס קביעה דומיננטי.',
    cta: 'שלחו בקשה',
    secondaryCta: 'התקשרו',
    image: IMG.medical,
    items: [{ title: 'מענה מהיר', copy: 'תוך יום עסקים.' }, { title: 'ליווי', copy: 'לא נעלמים.' }, { title: 'שקיפות', copy: 'בלי הפתעות.' }],
    stats: [{ value: '<24h', label: 'חזרה' }, { value: 'Free', label: 'שיחה' }, { value: 'No spam', label: 'הבטחה' }, { value: 'Human', label: 'מענה' }],
  }),
});

export const SERVICES_PAGE_SHOWCASE_SECTIONS: VisualLibrarySectionTemplate[] = [
  page01,
  page02,
  page03,
  page04,
  page05,
  page06,
  page07,
  page08,
  page09,
  page10,
];
