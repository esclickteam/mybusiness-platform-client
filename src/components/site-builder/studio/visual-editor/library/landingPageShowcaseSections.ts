import { VISUAL_LIBRARY_IMAGES as IMG } from "./libraryAssets";
import type { VisualLibrarySectionTemplate } from "./visualLibraryTypes";
import {
  buildLayoutNodes,
  makePageSection,
  type PageLayoutKind,
} from "./pageShowcaseHelpers";

const page01 = makePageSection({
  id: "section-landing-page-01",
  category: "promote",
  title: "נחיתה – מפוצלת",
  previewLayout: "section-landing-page-01",
  backgroundColor: "#ffffff",
  minHeight: "1480px",
  thumbnail: IMG.product,
  keywords: ["נחיתה","landing","promote","wix"],
  nodes: buildLayoutNodes("split" as PageLayoutKind, {
    eyebrow: 'LANDING',
    title: 'הצעה אחת\nשאי אפשר לפספס',
    subtitle: 'עמוד נחיתה ממוקד עם CTA חזק.',
    cta: 'להרשמה',
    secondaryCta: 'למידע',
    image: IMG.product,
    items: [{ title: 'ערך ברור', copy: 'מסר מדויק שמדבר לקהל הנכון.' }, { title: 'עיצוב חזק', copy: 'קומפוזיציה שנראית מקצועית מהשנייה הראשונה.' }, { title: 'המרה', copy: 'קריאה לפעולה שמניעה את הצעד הבא.' }, { title: 'אמון', copy: 'הוכחות חברתיות ותוצאות אמיתיות.' }, { title: 'פשטות', copy: 'מבנה נקי שקל לסרוק ולהבין.' }, { title: 'גמישות', copy: 'מתאים לעסקים קטנים וצומחים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר פניות' }, { value: '14', label: 'ימים להשקה' }, { value: '24/7', label: 'זמינות' }],
  }),
});

const page02 = makePageSection({
  id: "section-landing-page-02",
  category: "promote",
  title: "נחיתה – מרכזית",
  previewLayout: "section-landing-page-02",
  backgroundColor: "#ffffff",
  minHeight: "1400px",
  thumbnail: IMG.tech,
  keywords: ["נחיתה","landing","promote","wix"],
  nodes: buildLayoutNodes("center" as PageLayoutKind, {
    eyebrow: 'CAMPAIGN',
    title: 'השקה ממוקדת\nשמובילה לפעולה',
    subtitle: 'מינימום הסחות דעת, מקסימום המרה.',
    cta: 'הצטרפו עכשיו',
    image: IMG.tech,
    items: [{ title: 'ערך ברור', copy: 'מסר מדויק שמדבר לקהל הנכון.' }, { title: 'עיצוב חזק', copy: 'קומפוזיציה שנראית מקצועית מהשנייה הראשונה.' }, { title: 'המרה', copy: 'קריאה לפעולה שמניעה את הצעד הבא.' }, { title: 'אמון', copy: 'הוכחות חברתיות ותוצאות אמיתיות.' }, { title: 'פשטות', copy: 'מבנה נקי שקל לסרוק ולהבין.' }, { title: 'גמישות', copy: 'מתאים לעסקים קטנים וצומחים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר פניות' }, { value: '14', label: 'ימים להשקה' }, { value: '24/7', label: 'זמינות' }],
  }),
});

const page03 = makePageSection({
  id: "section-landing-page-03",
  category: "promote",
  title: "נחיתה – מגזין",
  previewLayout: "section-landing-page-03",
  backgroundColor: "#ffffff",
  minHeight: "1320px",
  thumbnail: IMG.fashion,
  keywords: ["נחיתה","landing","promote","wix"],
  nodes: buildLayoutNodes("magazine" as PageLayoutKind, {
    eyebrow: 'OFFER',
    title: 'מבצע מוגבל\nבזמן',
    subtitle: 'סיפור ויזואלי סביב הצעה אחת.',
    cta: 'מימוש ההטבה',
    image: IMG.fashion,
    items: [{ title: 'ערך ברור', copy: 'מסר מדויק שמדבר לקהל הנכון.' }, { title: 'עיצוב חזק', copy: 'קומפוזיציה שנראית מקצועית מהשנייה הראשונה.' }, { title: 'המרה', copy: 'קריאה לפעולה שמניעה את הצעד הבא.' }, { title: 'אמון', copy: 'הוכחות חברתיות ותוצאות אמיתיות.' }, { title: 'פשטות', copy: 'מבנה נקי שקל לסרוק ולהבין.' }, { title: 'גמישות', copy: 'מתאים לעסקים קטנים וצומחים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר פניות' }, { value: '14', label: 'ימים להשקה' }, { value: '24/7', label: 'זמינות' }],
  }),
});

const page04 = makePageSection({
  id: "section-landing-page-04",
  category: "promote",
  title: "נחיתה – כרטיסים",
  previewLayout: "section-landing-page-04",
  backgroundColor: "#ffffff",
  minHeight: "1120px",
  thumbnail: IMG.ecommerce,
  keywords: ["נחיתה","landing","promote","wix"],
  nodes: buildLayoutNodes("cards" as PageLayoutKind, {
    eyebrow: 'BENEFITS',
    title: 'למה זה\nמשתלם עכשיו',
    subtitle: 'יתרונות בקלפים שמאיצים החלטה.',
    cta: 'אני בפנים',
    image: IMG.ecommerce,
    items: [{ title: 'ערך ברור', copy: 'מסר מדויק שמדבר לקהל הנכון.' }, { title: 'עיצוב חזק', copy: 'קומפוזיציה שנראית מקצועית מהשנייה הראשונה.' }, { title: 'המרה', copy: 'קריאה לפעולה שמניעה את הצעד הבא.' }, { title: 'אמון', copy: 'הוכחות חברתיות ותוצאות אמיתיות.' }, { title: 'פשטות', copy: 'מבנה נקי שקל לסרוק ולהבין.' }, { title: 'גמישות', copy: 'מתאים לעסקים קטנים וצומחים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר פניות' }, { value: '14', label: 'ימים להשקה' }, { value: '24/7', label: 'זמינות' }],
  }),
});

const page05 = makePageSection({
  id: "section-landing-page-05",
  category: "promote",
  title: "נחיתה – תהליך",
  previewLayout: "section-landing-page-05",
  backgroundColor: "#ffffff",
  minHeight: "1280px",
  thumbnail: IMG.event,
  keywords: ["נחיתה","landing","promote","wix"],
  nodes: buildLayoutNodes("timeline" as PageLayoutKind, {
    eyebrow: 'STEPS',
    title: 'שלושה צעדים\nלהטבה',
    subtitle: 'מסע קצר וברור עד להמרה.',
    cta: 'התחילו',
    image: IMG.event,
    items: [{ title: 'ערך ברור', copy: 'מסר מדויק שמדבר לקהל הנכון.' }, { title: 'עיצוב חזק', copy: 'קומפוזיציה שנראית מקצועית מהשנייה הראשונה.' }, { title: 'המרה', copy: 'קריאה לפעולה שמניעה את הצעד הבא.' }, { title: 'אמון', copy: 'הוכחות חברתיות ותוצאות אמיתיות.' }, { title: 'פשטות', copy: 'מבנה נקי שקל לסרוק ולהבין.' }, { title: 'גמישות', copy: 'מתאים לעסקים קטנים וצומחים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר פניות' }, { value: '14', label: 'ימים להשקה' }, { value: '24/7', label: 'זמינות' }],
  }),
});

const page06 = makePageSection({
  id: "section-landing-page-06",
  category: "promote",
  title: "נחיתה – הוכחות",
  previewLayout: "section-landing-page-06",
  backgroundColor: "#ffffff",
  minHeight: "1280px",
  thumbnail: IMG.finance,
  keywords: ["נחיתה","landing","promote","wix"],
  nodes: buildLayoutNodes("stats" as PageLayoutKind, {
    eyebrow: 'PROOF',
    title: 'המספרים\nמאחורי ההצעה',
    subtitle: 'סטטיסטיקות שמחזקות את הקריאה לפעולה.',
    cta: 'נסו בלי סיכון',
    image: IMG.finance,
    items: [{ title: 'ערך ברור', copy: 'מסר מדויק שמדבר לקהל הנכון.' }, { title: 'עיצוב חזק', copy: 'קומפוזיציה שנראית מקצועית מהשנייה הראשונה.' }, { title: 'המרה', copy: 'קריאה לפעולה שמניעה את הצעד הבא.' }, { title: 'אמון', copy: 'הוכחות חברתיות ותוצאות אמיתיות.' }, { title: 'פשטות', copy: 'מבנה נקי שקל לסרוק ולהבין.' }, { title: 'גמישות', copy: 'מתאים לעסקים קטנים וצומחים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר פניות' }, { value: '14', label: 'ימים להשקה' }, { value: '24/7', label: 'זמינות' }],
  }),
});

const page07 = makePageSection({
  id: "section-landing-page-07",
  category: "promote",
  title: "נחיתה – כהה",
  previewLayout: "section-landing-page-07",
  backgroundColor: "#0f1115",
  minHeight: "1320px",
  thumbnail: IMG.abstract,
  keywords: ["נחיתה","landing","promote","wix"],
  nodes: buildLayoutNodes("dark" as PageLayoutKind, {
    eyebrow: 'EXCLUSIVE',
    title: 'גישה מוקדמת\nלחברים בלבד',
    subtitle: 'תחושת בלעדיות על רקע כהה.',
    cta: 'בקשו גישה',
    image: IMG.abstract,
    items: [{ title: 'ערך ברור', copy: 'מסר מדויק שמדבר לקהל הנכון.' }, { title: 'עיצוב חזק', copy: 'קומפוזיציה שנראית מקצועית מהשנייה הראשונה.' }, { title: 'המרה', copy: 'קריאה לפעולה שמניעה את הצעד הבא.' }, { title: 'אמון', copy: 'הוכחות חברתיות ותוצאות אמיתיות.' }, { title: 'פשטות', copy: 'מבנה נקי שקל לסרוק ולהבין.' }, { title: 'גמישות', copy: 'מתאים לעסקים קטנים וצומחים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר פניות' }, { value: '14', label: 'ימים להשקה' }, { value: '24/7', label: 'זמינות' }],
  }),
});

const page08 = makePageSection({
  id: "section-landing-page-08",
  category: "promote",
  title: "נחיתה – רכה",
  previewLayout: "section-landing-page-08",
  backgroundColor: "#faf9f7",
  minHeight: "1280px",
  thumbnail: IMG.wellness,
  keywords: ["נחיתה","landing","promote","wix"],
  nodes: buildLayoutNodes("lifestyle" as PageLayoutKind, {
    eyebrow: 'SOFT SELL',
    title: 'הזמנה\nבלי לחץ',
    subtitle: 'נחיתה רגועה למותגי לייפסטייל.',
    cta: 'שמרו מקום',
    image: IMG.wellness,
    items: [{ title: 'ערך ברור', copy: 'מסר מדויק שמדבר לקהל הנכון.' }, { title: 'עיצוב חזק', copy: 'קומפוזיציה שנראית מקצועית מהשנייה הראשונה.' }, { title: 'המרה', copy: 'קריאה לפעולה שמניעה את הצעד הבא.' }, { title: 'אמון', copy: 'הוכחות חברתיות ותוצאות אמיתיות.' }, { title: 'פשטות', copy: 'מבנה נקי שקל לסרוק ולהבין.' }, { title: 'גמישות', copy: 'מתאים לעסקים קטנים וצומחים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר פניות' }, { value: '14', label: 'ימים להשקה' }, { value: '24/7', label: 'זמינות' }],
  }),
});

const page09 = makePageSection({
  id: "section-landing-page-09",
  category: "promote",
  title: "נחיתה – רשימה",
  previewLayout: "section-landing-page-09",
  backgroundColor: "#ffffff",
  minHeight: "1200px",
  thumbnail: IMG.product,
  keywords: ["נחיתה","landing","promote","wix"],
  nodes: buildLayoutNodes("listMedia" as PageLayoutKind, {
    eyebrow: 'INCLUDED',
    title: 'מה מקבלים\nבחבילה',
    subtitle: 'רשימת תכולה לצד תמונה מפתה.',
    cta: 'לקנייה',
    image: IMG.product,
    items: [{ title: 'ערך ברור', copy: 'מסר מדויק שמדבר לקהל הנכון.' }, { title: 'עיצוב חזק', copy: 'קומפוזיציה שנראית מקצועית מהשנייה הראשונה.' }, { title: 'המרה', copy: 'קריאה לפעולה שמניעה את הצעד הבא.' }, { title: 'אמון', copy: 'הוכחות חברתיות ותוצאות אמיתיות.' }, { title: 'פשטות', copy: 'מבנה נקי שקל לסרוק ולהבין.' }, { title: 'גמישות', copy: 'מתאים לעסקים קטנים וצומחים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר פניות' }, { value: '14', label: 'ימים להשקה' }, { value: '24/7', label: 'זמינות' }],
  }),
});

const page10 = makePageSection({
  id: "section-landing-page-10",
  category: "promote",
  title: "נחיתה – טופס",
  previewLayout: "section-landing-page-10",
  backgroundColor: "#ffffff",
  minHeight: "1180px",
  thumbnail: IMG.tech,
  keywords: ["נחיתה","landing","promote","wix"],
  nodes: buildLayoutNodes("ctaForm" as PageLayoutKind, {
    eyebrow: 'LEAD FORM',
    title: 'השאירו פרטים\nוקבלו גישה',
    subtitle: 'טופס לידים דומיננטי עם יתרונות.',
    cta: 'שלחו',
    secondaryCta: 'חזרו אליי',
    image: IMG.tech,
    items: [{ title: 'ערך ברור', copy: 'מסר מדויק שמדבר לקהל הנכון.' }, { title: 'עיצוב חזק', copy: 'קומפוזיציה שנראית מקצועית מהשנייה הראשונה.' }, { title: 'המרה', copy: 'קריאה לפעולה שמניעה את הצעד הבא.' }, { title: 'אמון', copy: 'הוכחות חברתיות ותוצאות אמיתיות.' }, { title: 'פשטות', copy: 'מבנה נקי שקל לסרוק ולהבין.' }, { title: 'גמישות', copy: 'מתאים לעסקים קטנים וצומחים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר פניות' }, { value: '14', label: 'ימים להשקה' }, { value: '24/7', label: 'זמינות' }],
  }),
});

export const LANDING_PAGE_SHOWCASE_SECTIONS: VisualLibrarySectionTemplate[] = [
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
