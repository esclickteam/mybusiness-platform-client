import { VISUAL_LIBRARY_IMAGES as IMG } from "./libraryAssets";
import type { VisualLibrarySectionTemplate } from "./visualLibraryTypes";
import {
  buildLayoutNodes,
  makePageSection,
  type PageLayoutKind,
} from "./pageShowcaseHelpers";

const page01 = makePageSection({
  id: "section-gallery-page-01",
  category: "gallery",
  title: "גלריה – מפוצלת",
  previewLayout: "section-gallery-page-01",
  backgroundColor: "#ffffff",
  minHeight: "1480px",
  thumbnail: IMG.architecture,
  keywords: ["גלריה","gallery","portfolio","wix"],
  nodes: buildLayoutNodes("split" as PageLayoutKind, {
    eyebrow: 'GALLERY',
    title: 'עבודות\nשמספרות סיפור',
    subtitle: 'גלריה עם תמונה דומיננטית וכרטיסי פרויקטים.',
    cta: 'לכל העבודות',
    image: IMG.architecture,
    items: [{ title: 'ערך ברור', copy: 'מסר מדויק שמדבר לקהל הנכון.' }, { title: 'עיצוב חזק', copy: 'קומפוזיציה שנראית מקצועית מהשנייה הראשונה.' }, { title: 'המרה', copy: 'קריאה לפעולה שמניעה את הצעד הבא.' }, { title: 'אמון', copy: 'הוכחות חברתיות ותוצאות אמיתיות.' }, { title: 'פשטות', copy: 'מבנה נקי שקל לסרוק ולהבין.' }, { title: 'גמישות', copy: 'מתאים לעסקים קטנים וצומחים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר פניות' }, { value: '14', label: 'ימים להשקה' }, { value: '24/7', label: 'זמינות' }],
  }),
});

const page02 = makePageSection({
  id: "section-gallery-page-02",
  category: "gallery",
  title: "גלריה – Editorial",
  previewLayout: "section-gallery-page-02",
  backgroundColor: "#ffffff",
  minHeight: "1400px",
  thumbnail: IMG.interior,
  keywords: ["גלריה","gallery","portfolio","wix"],
  nodes: buildLayoutNodes("center" as PageLayoutKind, {
    eyebrow: 'PORTFOLIO',
    title: 'מבחר נבחר\nמהסטודיו',
    subtitle: 'תצוגה מרכזית עם דגש ויזואלי חזק.',
    cta: 'צפו בגלריה',
    image: IMG.interior,
    items: [{ title: 'ערך ברור', copy: 'מסר מדויק שמדבר לקהל הנכון.' }, { title: 'עיצוב חזק', copy: 'קומפוזיציה שנראית מקצועית מהשנייה הראשונה.' }, { title: 'המרה', copy: 'קריאה לפעולה שמניעה את הצעד הבא.' }, { title: 'אמון', copy: 'הוכחות חברתיות ותוצאות אמיתיות.' }, { title: 'פשטות', copy: 'מבנה נקי שקל לסרוק ולהבין.' }, { title: 'גמישות', copy: 'מתאים לעסקים קטנים וצומחים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר פניות' }, { value: '14', label: 'ימים להשקה' }, { value: '24/7', label: 'זמינות' }],
  }),
});

const page03 = makePageSection({
  id: "section-gallery-page-03",
  category: "gallery",
  title: "גלריה – קולאז׳",
  previewLayout: "section-gallery-page-03",
  backgroundColor: "#ffffff",
  minHeight: "1320px",
  thumbnail: IMG.fashion,
  keywords: ["גלריה","gallery","portfolio","wix"],
  nodes: buildLayoutNodes("magazine" as PageLayoutKind, {
    eyebrow: 'SHOWCASE',
    title: 'רגעים\nשנבחרו בקפידה',
    subtitle: 'פריסת קולאז׳ בהשראת מגזינים.',
    cta: 'גלו פרויקט',
    image: IMG.fashion,
    items: [{ title: 'ערך ברור', copy: 'מסר מדויק שמדבר לקהל הנכון.' }, { title: 'עיצוב חזק', copy: 'קומפוזיציה שנראית מקצועית מהשנייה הראשונה.' }, { title: 'המרה', copy: 'קריאה לפעולה שמניעה את הצעד הבא.' }, { title: 'אמון', copy: 'הוכחות חברתיות ותוצאות אמיתיות.' }, { title: 'פשטות', copy: 'מבנה נקי שקל לסרוק ולהבין.' }, { title: 'גמישות', copy: 'מתאים לעסקים קטנים וצומחים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר פניות' }, { value: '14', label: 'ימים להשקה' }, { value: '24/7', label: 'זמינות' }],
  }),
});

const page04 = makePageSection({
  id: "section-gallery-page-04",
  category: "gallery",
  title: "גלריה – רשת",
  previewLayout: "section-gallery-page-04",
  backgroundColor: "#ffffff",
  minHeight: "1120px",
  thumbnail: IMG.workspace,
  keywords: ["גלריה","gallery","portfolio","wix"],
  nodes: buildLayoutNodes("cards" as PageLayoutKind, {
    eyebrow: 'PROJECTS',
    title: 'שישה פרויקטים\nמובילים',
    subtitle: 'גריד כרטיסים עם תמונות ותיאורים.',
    cta: 'פתחו פרויקט',
    image: IMG.workspace,
    items: [{ title: 'ערך ברור', copy: 'מסר מדויק שמדבר לקהל הנכון.' }, { title: 'עיצוב חזק', copy: 'קומפוזיציה שנראית מקצועית מהשנייה הראשונה.' }, { title: 'המרה', copy: 'קריאה לפעולה שמניעה את הצעד הבא.' }, { title: 'אמון', copy: 'הוכחות חברתיות ותוצאות אמיתיות.' }, { title: 'פשטות', copy: 'מבנה נקי שקל לסרוק ולהבין.' }, { title: 'גמישות', copy: 'מתאים לעסקים קטנים וצומחים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר פניות' }, { value: '14', label: 'ימים להשקה' }, { value: '24/7', label: 'זמינות' }],
  }),
});

const page05 = makePageSection({
  id: "section-gallery-page-05",
  category: "gallery",
  title: "גלריה – ציר",
  previewLayout: "section-gallery-page-05",
  backgroundColor: "#ffffff",
  minHeight: "1280px",
  thumbnail: IMG.construction,
  keywords: ["גלריה","gallery","portfolio","wix"],
  nodes: buildLayoutNodes("timeline" as PageLayoutKind, {
    eyebrow: 'JOURNEY',
    title: 'מהרעיון\nלתוצאה',
    subtitle: 'גלריה שמוצגת כתהליך יצירה.',
    cta: 'התחילו פרויקט',
    image: IMG.construction,
    items: [{ title: 'ערך ברור', copy: 'מסר מדויק שמדבר לקהל הנכון.' }, { title: 'עיצוב חזק', copy: 'קומפוזיציה שנראית מקצועית מהשנייה הראשונה.' }, { title: 'המרה', copy: 'קריאה לפעולה שמניעה את הצעד הבא.' }, { title: 'אמון', copy: 'הוכחות חברתיות ותוצאות אמיתיות.' }, { title: 'פשטות', copy: 'מבנה נקי שקל לסרוק ולהבין.' }, { title: 'גמישות', copy: 'מתאים לעסקים קטנים וצומחים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר פניות' }, { value: '14', label: 'ימים להשקה' }, { value: '24/7', label: 'זמינות' }],
  }),
});

const page06 = makePageSection({
  id: "section-gallery-page-06",
  category: "gallery",
  title: "גלריה – הישגים",
  previewLayout: "section-gallery-page-06",
  backgroundColor: "#ffffff",
  minHeight: "1280px",
  thumbnail: IMG.architecture,
  keywords: ["גלריה","gallery","portfolio","wix"],
  nodes: buildLayoutNodes("stats" as PageLayoutKind, {
    eyebrow: 'HIGHLIGHTS',
    title: 'העבודות\nשמדברות הכי חזק',
    subtitle: 'שילוב מספרים ותצוגה ויזואלית.',
    cta: 'ראו עוד',
    image: IMG.architecture,
    items: [{ title: 'ערך ברור', copy: 'מסר מדויק שמדבר לקהל הנכון.' }, { title: 'עיצוב חזק', copy: 'קומפוזיציה שנראית מקצועית מהשנייה הראשונה.' }, { title: 'המרה', copy: 'קריאה לפעולה שמניעה את הצעד הבא.' }, { title: 'אמון', copy: 'הוכחות חברתיות ותוצאות אמיתיות.' }, { title: 'פשטות', copy: 'מבנה נקי שקל לסרוק ולהבין.' }, { title: 'גמישות', copy: 'מתאים לעסקים קטנים וצומחים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר פניות' }, { value: '14', label: 'ימים להשקה' }, { value: '24/7', label: 'זמינות' }],
  }),
});

const page07 = makePageSection({
  id: "section-gallery-page-07",
  category: "gallery",
  title: "גלריה – כהה",
  previewLayout: "section-gallery-page-07",
  backgroundColor: "#0f1115",
  minHeight: "1320px",
  thumbnail: IMG.abstract,
  keywords: ["גלריה","gallery","portfolio","wix"],
  nodes: buildLayoutNodes("dark" as PageLayoutKind, {
    eyebrow: 'DARK GALLERY',
    title: 'ויזואליות\nדרמטית',
    subtitle: 'גלריה על רקע כהה למותגי פרימיום.',
    cta: 'היכנסו לגלריה',
    image: IMG.abstract,
    items: [{ title: 'ערך ברור', copy: 'מסר מדויק שמדבר לקהל הנכון.' }, { title: 'עיצוב חזק', copy: 'קומפוזיציה שנראית מקצועית מהשנייה הראשונה.' }, { title: 'המרה', copy: 'קריאה לפעולה שמניעה את הצעד הבא.' }, { title: 'אמון', copy: 'הוכחות חברתיות ותוצאות אמיתיות.' }, { title: 'פשטות', copy: 'מבנה נקי שקל לסרוק ולהבין.' }, { title: 'גמישות', copy: 'מתאים לעסקים קטנים וצומחים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר פניות' }, { value: '14', label: 'ימים להשקה' }, { value: '24/7', label: 'זמינות' }],
  }),
});

const page08 = makePageSection({
  id: "section-gallery-page-08",
  category: "gallery",
  title: "גלריה – רכה",
  previewLayout: "section-gallery-page-08",
  backgroundColor: "#faf9f7",
  minHeight: "1280px",
  thumbnail: IMG.beauty,
  keywords: ["גלריה","gallery","portfolio","wix"],
  nodes: buildLayoutNodes("lifestyle" as PageLayoutKind, {
    eyebrow: 'MOOD',
    title: 'אווירה\nשנשארת בזיכרון',
    subtitle: 'תצוגה לייפסטייל רגועה ומזמינה.',
    cta: 'שמרו השראה',
    image: IMG.beauty,
    items: [{ title: 'ערך ברור', copy: 'מסר מדויק שמדבר לקהל הנכון.' }, { title: 'עיצוב חזק', copy: 'קומפוזיציה שנראית מקצועית מהשנייה הראשונה.' }, { title: 'המרה', copy: 'קריאה לפעולה שמניעה את הצעד הבא.' }, { title: 'אמון', copy: 'הוכחות חברתיות ותוצאות אמיתיות.' }, { title: 'פשטות', copy: 'מבנה נקי שקל לסרוק ולהבין.' }, { title: 'גמישות', copy: 'מתאים לעסקים קטנים וצומחים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר פניות' }, { value: '14', label: 'ימים להשקה' }, { value: '24/7', label: 'זמינות' }],
  }),
});

const page09 = makePageSection({
  id: "section-gallery-page-09",
  category: "gallery",
  title: "גלריה – רשימה",
  previewLayout: "section-gallery-page-09",
  backgroundColor: "#ffffff",
  minHeight: "1200px",
  thumbnail: IMG.interior,
  keywords: ["גלריה","gallery","portfolio","wix"],
  nodes: buildLayoutNodes("listMedia" as PageLayoutKind, {
    eyebrow: 'SELECTED WORK',
    title: 'פרויקטים\nנבחרים',
    subtitle: 'רשימת עבודות לצד מדיה גדולה.',
    cta: 'צפו בפרטים',
    image: IMG.interior,
    items: [{ title: 'ערך ברור', copy: 'מסר מדויק שמדבר לקהל הנכון.' }, { title: 'עיצוב חזק', copy: 'קומפוזיציה שנראית מקצועית מהשנייה הראשונה.' }, { title: 'המרה', copy: 'קריאה לפעולה שמניעה את הצעד הבא.' }, { title: 'אמון', copy: 'הוכחות חברתיות ותוצאות אמיתיות.' }, { title: 'פשטות', copy: 'מבנה נקי שקל לסרוק ולהבין.' }, { title: 'גמישות', copy: 'מתאים לעסקים קטנים וצומחים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר פניות' }, { value: '14', label: 'ימים להשקה' }, { value: '24/7', label: 'זמינות' }],
  }),
});

const page10 = makePageSection({
  id: "section-gallery-page-10",
  category: "gallery",
  title: "גלריה – פנייה",
  previewLayout: "section-gallery-page-10",
  backgroundColor: "#ffffff",
  minHeight: "1180px",
  thumbnail: IMG.event,
  keywords: ["גלריה","gallery","portfolio","wix"],
  nodes: buildLayoutNodes("ctaForm" as PageLayoutKind, {
    eyebrow: 'COLLABORATE',
    title: 'רוצים פרויקט\nכזה?',
    subtitle: 'גלריה שמסתיימת בטופס יצירת קשר.',
    cta: 'דברו איתנו',
    image: IMG.event,
    items: [{ title: 'ערך ברור', copy: 'מסר מדויק שמדבר לקהל הנכון.' }, { title: 'עיצוב חזק', copy: 'קומפוזיציה שנראית מקצועית מהשנייה הראשונה.' }, { title: 'המרה', copy: 'קריאה לפעולה שמניעה את הצעד הבא.' }, { title: 'אמון', copy: 'הוכחות חברתיות ותוצאות אמיתיות.' }, { title: 'פשטות', copy: 'מבנה נקי שקל לסרוק ולהבין.' }, { title: 'גמישות', copy: 'מתאים לעסקים קטנים וצומחים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר פניות' }, { value: '14', label: 'ימים להשקה' }, { value: '24/7', label: 'זמינות' }],
  }),
});

export const GALLERY_PAGE_SHOWCASE_SECTIONS: VisualLibrarySectionTemplate[] = [
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
