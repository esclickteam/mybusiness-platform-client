import { VISUAL_LIBRARY_IMAGES as IMG } from "./libraryAssets";
import type { VisualLibrarySectionTemplate } from "./visualLibraryTypes";
import {
  buildLayoutNodes,
  makePageSection,
  type PageLayoutKind,
} from "./pageShowcaseHelpers";

const page01 = makePageSection({
  id: "section-home-page-01",
  category: "hero",
  title: "דף הבית – כחול עסקי",
  previewLayout: "section-home-page-01",
  backgroundColor: "#ffffff",
  minHeight: "1600px",
  thumbnail: IMG.office,
  keywords: ["בית","ראשי","home","hero","wix"],
  nodes: buildLayoutNodes("split" as PageLayoutKind, {
    eyebrow: 'BUSINESS OS',
    title: 'נהלו את העסק\nבמקום אחד',
    subtitle: 'CRM, תורים ואתר — מערכת אחת שמניעה צמיחה.',
    cta: 'התחילו עכשיו',
    secondaryCta: 'למד עוד',
    image: IMG.office,
    items: [{ title: 'CRM חכם', copy: 'לידים ולקוחות במקום אחד.' }, { title: 'תורים', copy: 'יומן אוטומטי בלי חיכוך.' }, { title: 'אתר', copy: 'נוכחות שממירה מבקרים.' }, { title: 'AI', copy: 'המלצות פעולה לעסק.' }, { title: 'שותפים', copy: 'רשת שיתופי פעולה.' }, { title: 'הצעות', copy: 'מסמכים מקצועיים במהירות.' }],
    stats: [{ value: '12K+', label: 'עסקים' }, { value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר לידים' }, { value: '14', label: 'ימים להשקה' }],
  }),
});

const page02 = makePageSection({
  id: "section-home-page-02",
  category: "hero",
  title: "דף הבית – Editorial חם",
  previewLayout: "section-home-page-02",
  backgroundColor: "#f7f1ea",
  minHeight: "1500px",
  thumbnail: IMG.nature,
  keywords: ["בית","ראשי","home","hero","wix"],
  nodes: buildLayoutNodes("center" as PageLayoutKind, {
    eyebrow: 'START FRESH',
    title: 'המקום שלך\nלהתחיל מחדש',
    subtitle: 'עיצוב רגוע עם מסר אחד ברור.',
    cta: 'קבעו שיחה',
    image: IMG.nature,
    items: [{ title: 'CRM חכם', copy: 'לידים ולקוחות במקום אחד.' }, { title: 'תורים', copy: 'יומן אוטומטי בלי חיכוך.' }, { title: 'אתר', copy: 'נוכחות שממירה מבקרים.' }],
    stats: [{ value: '12K+', label: 'עסקים' }, { value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר לידים' }, { value: '14', label: 'ימים להשקה' }],
  }),
});

const page03 = makePageSection({
  id: "section-home-page-03",
  category: "hero",
  title: "דף הבית – מגזין שחור",
  previewLayout: "section-home-page-03",
  backgroundColor: "#ffffff",
  minHeight: "1550px",
  thumbnail: IMG.workspace,
  keywords: ["בית","ראשי","home","hero","wix"],
  nodes: buildLayoutNodes("magazine" as PageLayoutKind, {
    eyebrow: 'STUDIO',
    title: 'רעיונות\nשאי אפשר לפספס',
    subtitle: 'קומפוזיציה מגזינית חדה ונועזת.',
    cta: 'גלו עוד',
    image: IMG.workspace,
    items: [{ title: 'CRM חכם', copy: 'לידים ולקוחות במקום אחד.' }, { title: 'תורים', copy: 'יומן אוטומטי בלי חיכוך.' }, { title: 'אתר', copy: 'נוכחות שממירה מבקרים.' }, { title: 'AI', copy: 'המלצות פעולה לעסק.' }],
    stats: [{ value: '12K+', label: 'עסקים' }, { value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר לידים' }, { value: '14', label: 'ימים להשקה' }],
  }),
});

const page04 = makePageSection({
  id: "section-home-page-04",
  category: "hero",
  title: "דף הבית – כרטיסים צבעוניים",
  previewLayout: "section-home-page-04",
  backgroundColor: "#eef6ff",
  minHeight: "1500px",
  thumbnail: IMG.tech,
  keywords: ["בית","ראשי","home","hero","wix"],
  nodes: buildLayoutNodes("cards" as PageLayoutKind, {
    eyebrow: 'FEATURES',
    title: 'כל הכלים\nבכרטיסים חיים',
    subtitle: 'שישה ערכים בצבעים שונים — לא עוד אפור.',
    cta: 'לכל הפיצ׳רים',
    image: IMG.tech,
    items: [{ title: 'CRM חכם', copy: 'לידים ולקוחות במקום אחד.' }, { title: 'תורים', copy: 'יומן אוטומטי בלי חיכוך.' }, { title: 'אתר', copy: 'נוכחות שממירה מבקרים.' }, { title: 'AI', copy: 'המלצות פעולה לעסק.' }, { title: 'שותפים', copy: 'רשת שיתופי פעולה.' }, { title: 'הצעות', copy: 'מסמכים מקצועיים במהירות.' }],
    stats: [{ value: '12K+', label: 'עסקים' }, { value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר לידים' }, { value: '14', label: 'ימים להשקה' }],
  }),
});

const page05 = makePageSection({
  id: "section-home-page-05",
  category: "hero",
  title: "דף הבית – ציר סגול",
  previewLayout: "section-home-page-05",
  backgroundColor: "#f6f4ff",
  minHeight: "1580px",
  thumbnail: IMG.finance,
  keywords: ["בית","ראשי","home","hero","wix"],
  nodes: buildLayoutNodes("timeline" as PageLayoutKind, {
    eyebrow: 'HOW IT WORKS',
    title: 'מארבעה שלבים\nלעסק מסודר',
    subtitle: 'תהליך ברור עם ציר ויזואלי בולט.',
    cta: 'התחילו בשלב 1',
    image: IMG.finance,
    items: [{ title: 'פרופיל', copy: 'פרטי העסק והשירותים.', meta: '01' }, { title: 'אתר', copy: 'תבנית או AI.', meta: '02' }, { title: 'CRM', copy: 'לידים ותורים.', meta: '03' }, { title: 'פרסום', copy: 'יוצאים לאוויר.', meta: '04' }, { title: 'שיפור', copy: 'המלצות חכמות.', meta: '05' }],
    stats: [{ value: '12K+', label: 'עסקים' }, { value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר לידים' }, { value: '14', label: 'ימים להשקה' }],
  }),
});

const page06 = makePageSection({
  id: "section-home-page-06",
  category: "hero",
  title: "דף הבית – לוח מספרים",
  previewLayout: "section-home-page-06",
  backgroundColor: "#111827",
  minHeight: "1480px",
  thumbnail: IMG.office,
  keywords: ["בית","ראשי","home","hero","wix"],
  nodes: buildLayoutNodes("stats" as PageLayoutKind, {
    eyebrow: 'RESULTS',
    title: 'תוצאות\nשמדברות חזק',
    subtitle: 'מספרים זוהרים על רקע כהה.',
    cta: 'ראו דמו',
    image: IMG.office,
    items: [{ title: 'CRM חכם', copy: 'לידים ולקוחות במקום אחד.' }, { title: 'תורים', copy: 'יומן אוטומטי בלי חיכוך.' }, { title: 'אתר', copy: 'נוכחות שממירה מבקרים.' }],
    stats: [{ value: '12K+', label: 'עסקים' }, { value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר לידים' }, { value: '14', label: 'ימים להשקה' }],
  }),
});

const page07 = makePageSection({
  id: "section-home-page-07",
  category: "hero",
  title: "דף הבית – קולנוע זהב",
  previewLayout: "section-home-page-07",
  backgroundColor: "#09090b",
  minHeight: "1500px",
  thumbnail: IMG.abstract,
  keywords: ["בית","ראשי","home","hero","wix"],
  nodes: buildLayoutNodes("dark" as PageLayoutKind, {
    eyebrow: 'PREMIUM',
    title: 'נוכחות דיגיטלית\nברמה אחרת',
    subtitle: 'דרמה שחורה עם מבטאי זהב.',
    cta: 'הצטרפו עכשיו',
    image: IMG.abstract,
    items: [{ title: 'CRM חכם', copy: 'לידים ולקוחות במקום אחד.' }, { title: 'תורים', copy: 'יומן אוטומטי בלי חיכוך.' }, { title: 'אתר', copy: 'נוכחות שממירה מבקרים.' }],
    stats: [{ value: '12K+', label: 'עסקים' }, { value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר לידים' }, { value: '14', label: 'ימים להשקה' }],
  }),
});

const page08 = makePageSection({
  id: "section-home-page-08",
  category: "hero",
  title: "דף הבית – לייפסטייל ורוד",
  previewLayout: "section-home-page-08",
  backgroundColor: "#fde8e4",
  minHeight: "1520px",
  thumbnail: IMG.fitness,
  keywords: ["בית","ראשי","home","hero","wix"],
  nodes: buildLayoutNodes("lifestyle" as PageLayoutKind, {
    eyebrow: 'WELLNESS',
    title: 'אימון שמשנה\nאת היום',
    subtitle: 'אווירה רכה עם תמונת גיבור ענקית.',
    cta: 'קבעו אימון',
    image: IMG.fitness,
    items: [{ title: 'CRM חכם', copy: 'לידים ולקוחות במקום אחד.' }, { title: 'תורים', copy: 'יומן אוטומטי בלי חיכוך.' }, { title: 'אתר', copy: 'נוכחות שממירה מבקרים.' }],
    stats: [{ value: '12K+', label: 'עסקים' }, { value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר לידים' }, { value: '14', label: 'ימים להשקה' }],
  }),
});

const page09 = makePageSection({
  id: "section-home-page-09",
  category: "hero",
  title: "דף הבית – רשימה ירוקה",
  previewLayout: "section-home-page-09",
  backgroundColor: "#f0faf4",
  minHeight: "1450px",
  thumbnail: IMG.ecommerce,
  keywords: ["בית","ראשי","home","hero","wix"],
  nodes: buildLayoutNodes("listMedia" as PageLayoutKind, {
    eyebrow: 'TOOLKIT',
    title: 'הכלים שהופכים\nעסק למסודר',
    subtitle: 'רשימה ממוספרת לצד מדיה דומיננטית.',
    cta: 'נסו בחינם',
    image: IMG.ecommerce,
    items: [{ title: 'CRM חכם', copy: 'לידים ולקוחות במקום אחד.' }, { title: 'תורים', copy: 'יומן אוטומטי בלי חיכוך.' }, { title: 'אתר', copy: 'נוכחות שממירה מבקרים.' }, { title: 'AI', copy: 'המלצות פעולה לעסק.' }, { title: 'שותפים', copy: 'רשת שיתופי פעולה.' }],
    stats: [{ value: '12K+', label: 'עסקים' }, { value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר לידים' }, { value: '14', label: 'ימים להשקה' }],
  }),
});

const page10 = makePageSection({
  id: "section-home-page-10",
  category: "hero",
  title: "דף הבית – טופס כתום",
  previewLayout: "section-home-page-10",
  backgroundColor: "#fff7ed",
  minHeight: "1450px",
  thumbnail: IMG.hospitality,
  keywords: ["בית","ראשי","home","hero","wix"],
  nodes: buildLayoutNodes("ctaForm" as PageLayoutKind, {
    eyebrow: 'GET STARTED',
    title: 'בואו נבנה\nאת האתר שלכם',
    subtitle: 'טופס המרה בולט עם מסגרת כתומה.',
    cta: 'שלחו פרטים',
    secondaryCta: 'דברו איתנו',
    image: IMG.hospitality,
    items: [{ title: 'CRM חכם', copy: 'לידים ולקוחות במקום אחד.' }, { title: 'תורים', copy: 'יומן אוטומטי בלי חיכוך.' }, { title: 'אתר', copy: 'נוכחות שממירה מבקרים.' }],
    stats: [{ value: '12K+', label: 'עסקים' }, { value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר לידים' }, { value: '14', label: 'ימים להשקה' }],
  }),
});

export const HOME_PAGE_SHOWCASE_SECTIONS: VisualLibrarySectionTemplate[] = [
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
