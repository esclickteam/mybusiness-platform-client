import { VISUAL_LIBRARY_IMAGES as IMG } from "./libraryAssets";
import type { VisualLibrarySectionTemplate } from "./visualLibraryTypes";
import {
  buildLayoutNodes,
  makePageSection,
  type PageLayoutKind,
} from "./pageShowcaseHelpers";

const page01 = makePageSection({
  id: "section-faq-page-01",
  category: "faq",
  title: "שאלות נפוצות – כחול עסקי",
  previewLayout: "section-faq-page-01",
  backgroundColor: "#ffffff",
  minHeight: "1600px",
  thumbnail: IMG.education,
  keywords: ["שאלות נפוצות","faq","wix"],
  nodes: buildLayoutNodes("split" as PageLayoutKind, {
    eyebrow: 'FAQ',
    title: 'תשובות\nלשאלות החשובות',
    subtitle: 'מרכז עזרה כחול וברור.',
    cta: 'לא מצאתם תשובה?',
    image: IMG.education,
    items: [{ title: 'איך מתחילים?', copy: 'נרשמים ובוחרים תבנית.' }, { title: 'יש ניסיון?', copy: 'כן, 14 יום.' }, { title: 'צריך כרטיס?', copy: 'לא לשלב הניסיון.' }, { title: 'אפשר לבטל?', copy: 'בכל רגע.' }, { title: 'יש תמיכה?', copy: 'צ׳אט ומייל.' }, { title: 'מה עם דומיין?', copy: 'אפשר לחבר.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page02 = makePageSection({
  id: "section-faq-page-02",
  category: "faq",
  title: "שאלות נפוצות – Editorial חם",
  previewLayout: "section-faq-page-02",
  backgroundColor: "#f7f1ea",
  minHeight: "1500px",
  thumbnail: IMG.office,
  keywords: ["שאלות נפוצות","faq","wix"],
  nodes: buildLayoutNodes("center" as PageLayoutKind, {
    eyebrow: 'HELP',
    title: 'כל מה שרציתם\nלדעת',
    subtitle: 'עזרה בטון חם.',
    cta: 'חיפוש תשובה',
    image: IMG.office,
    items: [{ title: 'שאלה', copy: 'פותחים נושא.', meta: '01' }, { title: 'חיפוש', copy: 'מוצאים תשובה.', meta: '02' }, { title: 'הבנה', copy: 'מיישמים.', meta: '03' }, { title: 'עזרה', copy: 'אם צריך — פונים.', meta: '04' }, { title: 'פתרון', copy: 'חוזרים לעבודה.', meta: '05' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page03 = makePageSection({
  id: "section-faq-page-03",
  category: "faq",
  title: "שאלות נפוצות – מגזין שחור",
  previewLayout: "section-faq-page-03",
  backgroundColor: "#ffffff",
  minHeight: "1550px",
  thumbnail: IMG.workspace,
  keywords: ["שאלות נפוצות","faq","wix"],
  nodes: buildLayoutNodes("magazine" as PageLayoutKind, {
    eyebrow: 'GUIDES',
    title: 'שאלות\nעם הקשר',
    subtitle: 'FAQ בסגנון מדריך.',
    cta: 'למדריכים',
    image: IMG.workspace,
    items: [{ title: 'איך מתחילים?', copy: 'נרשמים ובוחרים תבנית.' }, { title: 'יש ניסיון?', copy: 'כן, 14 יום.' }, { title: 'צריך כרטיס?', copy: 'לא לשלב הניסיון.' }, { title: 'אפשר לבטל?', copy: 'בכל רגע.' }, { title: 'יש תמיכה?', copy: 'צ׳אט ומייל.' }, { title: 'מה עם דומיין?', copy: 'אפשר לחבר.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page04 = makePageSection({
  id: "section-faq-page-04",
  category: "faq",
  title: "שאלות נפוצות – כרטיסים צבעוניים",
  previewLayout: "section-faq-page-04",
  backgroundColor: "#eef6ff",
  minHeight: "1500px",
  thumbnail: IMG.tech,
  keywords: ["שאלות נפוצות","faq","wix"],
  nodes: buildLayoutNodes("cards" as PageLayoutKind, {
    eyebrow: 'TOPICS',
    title: 'נושאים\nבצבעים שונים',
    subtitle: 'קטגוריות שאלות חיות.',
    cta: 'בחרו נושא',
    image: IMG.tech,
    items: [{ title: 'שאלה', copy: 'פותחים נושא.', meta: '01' }, { title: 'חיפוש', copy: 'מוצאים תשובה.', meta: '02' }, { title: 'הבנה', copy: 'מיישמים.', meta: '03' }, { title: 'עזרה', copy: 'אם צריך — פונים.', meta: '04' }, { title: 'פתרון', copy: 'חוזרים לעבודה.', meta: '05' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page05 = makePageSection({
  id: "section-faq-page-05",
  category: "faq",
  title: "שאלות נפוצות – ציר סגול",
  previewLayout: "section-faq-page-05",
  backgroundColor: "#f6f4ff",
  minHeight: "1580px",
  thumbnail: IMG.finance,
  keywords: ["שאלות נפוצות","faq","wix"],
  nodes: buildLayoutNodes("timeline" as PageLayoutKind, {
    eyebrow: 'SETUP',
    title: 'שאלות לפי\nשלבי שימוש',
    subtitle: 'FAQ על ציר תהליך.',
    cta: 'להתחלה מהירה',
    image: IMG.finance,
    items: [{ title: 'איך מתחילים?', copy: 'נרשמים ובוחרים תבנית.' }, { title: 'יש ניסיון?', copy: 'כן, 14 יום.' }, { title: 'צריך כרטיס?', copy: 'לא לשלב הניסיון.' }, { title: 'אפשר לבטל?', copy: 'בכל רגע.' }, { title: 'יש תמיכה?', copy: 'צ׳אט ומייל.' }, { title: 'מה עם דומיין?', copy: 'אפשר לחבר.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page06 = makePageSection({
  id: "section-faq-page-06",
  category: "faq",
  title: "שאלות נפוצות – לוח מספרים",
  previewLayout: "section-faq-page-06",
  backgroundColor: "#111827",
  minHeight: "1480px",
  thumbnail: IMG.tech,
  keywords: ["שאלות נפוצות","faq","wix"],
  nodes: buildLayoutNodes("stats" as PageLayoutKind, {
    eyebrow: 'QUICK FACTS',
    title: 'עובדות\nבקצרה',
    subtitle: 'תשובות זריזות על רקע כהה.',
    cta: 'עוד פרטים',
    image: IMG.tech,
    items: [{ title: 'שאלה', copy: 'פותחים נושא.', meta: '01' }, { title: 'חיפוש', copy: 'מוצאים תשובה.', meta: '02' }, { title: 'הבנה', copy: 'מיישמים.', meta: '03' }, { title: 'עזרה', copy: 'אם צריך — פונים.', meta: '04' }, { title: 'פתרון', copy: 'חוזרים לעבודה.', meta: '05' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page07 = makePageSection({
  id: "section-faq-page-07",
  category: "faq",
  title: "שאלות נפוצות – קולנוע זהב",
  previewLayout: "section-faq-page-07",
  backgroundColor: "#09090b",
  minHeight: "1500px",
  thumbnail: IMG.abstract,
  keywords: ["שאלות נפוצות","faq","wix"],
  nodes: buildLayoutNodes("dark" as PageLayoutKind, {
    eyebrow: 'SUPPORT',
    title: 'תמיכה\nבלי בלבול',
    subtitle: 'עזרה דרמטית וברורה.',
    cta: 'פתחו קריאה',
    image: IMG.abstract,
    items: [{ title: 'איך מתחילים?', copy: 'נרשמים ובוחרים תבנית.' }, { title: 'יש ניסיון?', copy: 'כן, 14 יום.' }, { title: 'צריך כרטיס?', copy: 'לא לשלב הניסיון.' }, { title: 'אפשר לבטל?', copy: 'בכל רגע.' }, { title: 'יש תמיכה?', copy: 'צ׳אט ומייל.' }, { title: 'מה עם דומיין?', copy: 'אפשר לחבר.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page08 = makePageSection({
  id: "section-faq-page-08",
  category: "faq",
  title: "שאלות נפוצות – לייפסטייל ורוד",
  previewLayout: "section-faq-page-08",
  backgroundColor: "#fde8e4",
  minHeight: "1520px",
  thumbnail: IMG.wellness,
  keywords: ["שאלות נפוצות","faq","wix"],
  nodes: buildLayoutNodes("lifestyle" as PageLayoutKind, {
    eyebrow: 'FRIENDLY HELP',
    title: 'עזרה\nבשפה פשוטה',
    subtitle: 'טון רך לשאלות נפוצות.',
    cta: 'שאלו אותנו',
    image: IMG.wellness,
    items: [{ title: 'שאלה', copy: 'פותחים נושא.', meta: '01' }, { title: 'חיפוש', copy: 'מוצאים תשובה.', meta: '02' }, { title: 'הבנה', copy: 'מיישמים.', meta: '03' }, { title: 'עזרה', copy: 'אם צריך — פונים.', meta: '04' }, { title: 'פתרון', copy: 'חוזרים לעבודה.', meta: '05' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page09 = makePageSection({
  id: "section-faq-page-09",
  category: "faq",
  title: "שאלות נפוצות – רשימה ירוקה",
  previewLayout: "section-faq-page-09",
  backgroundColor: "#f0faf4",
  minHeight: "1450px",
  thumbnail: IMG.education,
  keywords: ["שאלות נפוצות","faq","wix"],
  nodes: buildLayoutNodes("listMedia" as PageLayoutKind, {
    eyebrow: 'ANSWERS',
    title: 'שאלות\nותשובות',
    subtitle: 'רשימת FAQ לצד מדיה.',
    cta: 'לכל השאלות',
    image: IMG.education,
    items: [{ title: 'איך מתחילים?', copy: 'נרשמים ובוחרים תבנית.' }, { title: 'יש ניסיון?', copy: 'כן, 14 יום.' }, { title: 'צריך כרטיס?', copy: 'לא לשלב הניסיון.' }, { title: 'אפשר לבטל?', copy: 'בכל רגע.' }, { title: 'יש תמיכה?', copy: 'צ׳אט ומייל.' }, { title: 'מה עם דומיין?', copy: 'אפשר לחבר.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page10 = makePageSection({
  id: "section-faq-page-10",
  category: "faq",
  title: "שאלות נפוצות – טופס כתום",
  previewLayout: "section-faq-page-10",
  backgroundColor: "#fff7ed",
  minHeight: "1450px",
  thumbnail: IMG.office,
  keywords: ["שאלות נפוצות","faq","wix"],
  nodes: buildLayoutNodes("ctaForm" as PageLayoutKind, {
    eyebrow: 'STILL STUCK',
    title: 'עדיין צריכים\nעזרה?',
    subtitle: 'טופס פנייה כתום בסוף העמוד.',
    cta: 'שלחו שאלה',
    image: IMG.office,
    items: [{ title: 'שאלה', copy: 'פותחים נושא.', meta: '01' }, { title: 'חיפוש', copy: 'מוצאים תשובה.', meta: '02' }, { title: 'הבנה', copy: 'מיישמים.', meta: '03' }, { title: 'עזרה', copy: 'אם צריך — פונים.', meta: '04' }, { title: 'פתרון', copy: 'חוזרים לעבודה.', meta: '05' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

export const FAQ_PAGE_SHOWCASE_SECTIONS: VisualLibrarySectionTemplate[] = [
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
