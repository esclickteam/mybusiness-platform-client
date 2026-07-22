import { VISUAL_LIBRARY_IMAGES as IMG } from "./libraryAssets";
import type { VisualLibrarySectionTemplate } from "./visualLibraryTypes";
import {
  buildLayoutNodes,
  makePageSection,
  type PageLayoutKind,
} from "./pageShowcaseHelpers";

const page01 = makePageSection({
  id: "section-blog-page-01",
  category: "blog",
  title: "בלוג – כחול עסקי",
  previewLayout: "section-blog-page-01",
  backgroundColor: "#ffffff",
  minHeight: "1600px",
  thumbnail: IMG.education,
  keywords: ["בלוג","blog","wix"],
  nodes: buildLayoutNodes("split" as PageLayoutKind, {
    eyebrow: 'BLOG',
    title: 'תובנות\nלעסק צומח',
    subtitle: 'בלוג כחול עם מאמר מוביל.',
    cta: 'לכל הפוסטים',
    image: IMG.education,
    items: [{ title: 'מדריך', copy: 'שלב אחר שלב.' }, { title: 'טיפ', copy: 'מהיר ליישום.' }, { title: 'ראיון', copy: 'מאחורי הקלעים.' }, { title: 'ניתוח', copy: 'מספרים אמיתיים.' }, { title: 'סיפור', copy: 'מהשטח.' }, { title: 'עדכון', copy: 'מה חדש.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page02 = makePageSection({
  id: "section-blog-page-02",
  category: "blog",
  title: "בלוג – Editorial חם",
  previewLayout: "section-blog-page-02",
  backgroundColor: "#f7f1ea",
  minHeight: "1500px",
  thumbnail: IMG.office,
  keywords: ["בלוג","blog","wix"],
  nodes: buildLayoutNodes("center" as PageLayoutKind, {
    eyebrow: 'INSIGHTS',
    title: 'ידע שעוזר\nלקבל החלטות',
    subtitle: 'פתיחה editorial חמה.',
    cta: 'התחילו לקרוא',
    image: IMG.office,
    items: [{ title: 'קוראים', copy: 'פותחים פוסט.', meta: '01' }, { title: 'לומדים', copy: 'מיישמים.', meta: '02' }, { title: 'משתפים', copy: 'מעבירים הלאה.', meta: '03' }, { title: 'חוזרים', copy: 'לפוסט הבא.', meta: '04' }, { title: 'נרשמים', copy: 'לניוזלטר.', meta: '05' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page03 = makePageSection({
  id: "section-blog-page-03",
  category: "blog",
  title: "בלוג – מגזין שחור",
  previewLayout: "section-blog-page-03",
  backgroundColor: "#ffffff",
  minHeight: "1550px",
  thumbnail: IMG.workspace,
  keywords: ["בלוג","blog","wix"],
  nodes: buildLayoutNodes("magazine" as PageLayoutKind, {
    eyebrow: 'STORIES',
    title: 'סיפורים\nמהשטח',
    subtitle: 'פריסת מגזין נועזת.',
    cta: 'גלו כתבה',
    image: IMG.workspace,
    items: [{ title: 'מדריך', copy: 'שלב אחר שלב.' }, { title: 'טיפ', copy: 'מהיר ליישום.' }, { title: 'ראיון', copy: 'מאחורי הקלעים.' }, { title: 'ניתוח', copy: 'מספרים אמיתיים.' }, { title: 'סיפור', copy: 'מהשטח.' }, { title: 'עדכון', copy: 'מה חדש.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page04 = makePageSection({
  id: "section-blog-page-04",
  category: "blog",
  title: "בלוג – כרטיסים צבעוניים",
  previewLayout: "section-blog-page-04",
  backgroundColor: "#eef6ff",
  minHeight: "1500px",
  thumbnail: IMG.tech,
  keywords: ["בלוג","blog","wix"],
  nodes: buildLayoutNodes("cards" as PageLayoutKind, {
    eyebrow: 'LATEST',
    title: 'הפוסטים\nהאחרונים',
    subtitle: 'כרטיסי מאמרים בצבעים שונים.',
    cta: 'עוד מאמרים',
    image: IMG.tech,
    items: [{ title: 'קוראים', copy: 'פותחים פוסט.', meta: '01' }, { title: 'לומדים', copy: 'מיישמים.', meta: '02' }, { title: 'משתפים', copy: 'מעבירים הלאה.', meta: '03' }, { title: 'חוזרים', copy: 'לפוסט הבא.', meta: '04' }, { title: 'נרשמים', copy: 'לניוזלטר.', meta: '05' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page05 = makePageSection({
  id: "section-blog-page-05",
  category: "blog",
  title: "בלוג – ציר סגול",
  previewLayout: "section-blog-page-05",
  backgroundColor: "#f6f4ff",
  minHeight: "1580px",
  thumbnail: IMG.education,
  keywords: ["בלוג","blog","wix"],
  nodes: buildLayoutNodes("timeline" as PageLayoutKind, {
    eyebrow: 'SERIES',
    title: 'סדרת מדריכים\nשלב אחר שלב',
    subtitle: 'בלוג כמסע למידה.',
    cta: 'למדריך הראשון',
    image: IMG.education,
    items: [{ title: 'מדריך', copy: 'שלב אחר שלב.' }, { title: 'טיפ', copy: 'מהיר ליישום.' }, { title: 'ראיון', copy: 'מאחורי הקלעים.' }, { title: 'ניתוח', copy: 'מספרים אמיתיים.' }, { title: 'סיפור', copy: 'מהשטח.' }, { title: 'עדכון', copy: 'מה חדש.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page06 = makePageSection({
  id: "section-blog-page-06",
  category: "blog",
  title: "בלוג – לוח מספרים",
  previewLayout: "section-blog-page-06",
  backgroundColor: "#111827",
  minHeight: "1480px",
  thumbnail: IMG.finance,
  keywords: ["בלוג","blog","wix"],
  nodes: buildLayoutNodes("stats" as PageLayoutKind, {
    eyebrow: 'TRENDING',
    title: 'הנושאים\nשכולם קוראים',
    subtitle: 'פופולריות במספרים כהים.',
    cta: 'לטרנדים',
    image: IMG.finance,
    items: [{ title: 'קוראים', copy: 'פותחים פוסט.', meta: '01' }, { title: 'לומדים', copy: 'מיישמים.', meta: '02' }, { title: 'משתפים', copy: 'מעבירים הלאה.', meta: '03' }, { title: 'חוזרים', copy: 'לפוסט הבא.', meta: '04' }, { title: 'נרשמים', copy: 'לניוזלטר.', meta: '05' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page07 = makePageSection({
  id: "section-blog-page-07",
  category: "blog",
  title: "בלוג – קולנוע זהב",
  previewLayout: "section-blog-page-07",
  backgroundColor: "#09090b",
  minHeight: "1500px",
  thumbnail: IMG.abstract,
  keywords: ["בלוג","blog","wix"],
  nodes: buildLayoutNodes("dark" as PageLayoutKind, {
    eyebrow: 'DEEP DIVES',
    title: 'מאמרים\nלעומק',
    subtitle: 'בלוג כהה לתוכן כבד.',
    cta: 'צללו פנימה',
    image: IMG.abstract,
    items: [{ title: 'מדריך', copy: 'שלב אחר שלב.' }, { title: 'טיפ', copy: 'מהיר ליישום.' }, { title: 'ראיון', copy: 'מאחורי הקלעים.' }, { title: 'ניתוח', copy: 'מספרים אמיתיים.' }, { title: 'סיפור', copy: 'מהשטח.' }, { title: 'עדכון', copy: 'מה חדש.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page08 = makePageSection({
  id: "section-blog-page-08",
  category: "blog",
  title: "בלוג – לייפסטייל ורוד",
  previewLayout: "section-blog-page-08",
  backgroundColor: "#fde8e4",
  minHeight: "1520px",
  thumbnail: IMG.nature,
  keywords: ["בלוג","blog","wix"],
  nodes: buildLayoutNodes("lifestyle" as PageLayoutKind, {
    eyebrow: 'NOTES',
    title: 'הערות קצרות\nמהיום־יום',
    subtitle: 'טון אישי ורגוע.',
    cta: 'קראו הערה',
    image: IMG.nature,
    items: [{ title: 'קוראים', copy: 'פותחים פוסט.', meta: '01' }, { title: 'לומדים', copy: 'מיישמים.', meta: '02' }, { title: 'משתפים', copy: 'מעבירים הלאה.', meta: '03' }, { title: 'חוזרים', copy: 'לפוסט הבא.', meta: '04' }, { title: 'נרשמים', copy: 'לניוזלטר.', meta: '05' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page09 = makePageSection({
  id: "section-blog-page-09",
  category: "blog",
  title: "בלוג – רשימה ירוקה",
  previewLayout: "section-blog-page-09",
  backgroundColor: "#f0faf4",
  minHeight: "1450px",
  thumbnail: IMG.education,
  keywords: ["בלוג","blog","wix"],
  nodes: buildLayoutNodes("listMedia" as PageLayoutKind, {
    eyebrow: 'ARCHIVE',
    title: 'ארכיון\nמסודר',
    subtitle: 'רשימת פוסטים לצד תמונה.',
    cta: 'לכל הארכיון',
    image: IMG.education,
    items: [{ title: 'מדריך', copy: 'שלב אחר שלב.' }, { title: 'טיפ', copy: 'מהיר ליישום.' }, { title: 'ראיון', copy: 'מאחורי הקלעים.' }, { title: 'ניתוח', copy: 'מספרים אמיתיים.' }, { title: 'סיפור', copy: 'מהשטח.' }, { title: 'עדכון', copy: 'מה חדש.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page10 = makePageSection({
  id: "section-blog-page-10",
  category: "blog",
  title: "בלוג – טופס כתום",
  previewLayout: "section-blog-page-10",
  backgroundColor: "#fff7ed",
  minHeight: "1450px",
  thumbnail: IMG.office,
  keywords: ["בלוג","blog","wix"],
  nodes: buildLayoutNodes("ctaForm" as PageLayoutKind, {
    eyebrow: 'SUBSCRIBE',
    title: 'קבלו תובנות\nלמייל',
    subtitle: 'טופס ניוזלטר כתום.',
    cta: 'להרשמה',
    image: IMG.office,
    items: [{ title: 'קוראים', copy: 'פותחים פוסט.', meta: '01' }, { title: 'לומדים', copy: 'מיישמים.', meta: '02' }, { title: 'משתפים', copy: 'מעבירים הלאה.', meta: '03' }, { title: 'חוזרים', copy: 'לפוסט הבא.', meta: '04' }, { title: 'נרשמים', copy: 'לניוזלטר.', meta: '05' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

export const BLOG_PAGE_SHOWCASE_SECTIONS: VisualLibrarySectionTemplate[] = [
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
