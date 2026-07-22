import { VISUAL_LIBRARY_IMAGES as IMG } from "./libraryAssets";
import type { VisualLibrarySectionTemplate } from "./visualLibraryTypes";
import {
  buildLayoutNodes,
  makePageSection,
  type PageLayoutKind,
} from "./pageShowcaseHelpers";

const page01 = makePageSection({
  id: "section-contact-page-01",
  category: "contact",
  title: "יצירת קשר – מפוצל",
  previewLayout: "section-contact-page-01",
  backgroundColor: "#ffffff",
  minHeight: "1480px",
  thumbnail: IMG.office,
  keywords: ["צור קשר","contact","wix"],
  nodes: buildLayoutNodes("split" as PageLayoutKind, {
    eyebrow: 'CONTACT',
    title: 'נשמח\nלשמוע מכם',
    subtitle: 'פרטי קשר ברורים לצד טופס וכרטיסי מידע.',
    cta: 'שלחו הודעה',
    secondaryCta: 'התקשרו',
    image: IMG.office,
    items: [{ title: 'ערך ברור', copy: 'מסר מדויק שמדבר לקהל הנכון.' }, { title: 'עיצוב חזק', copy: 'קומפוזיציה שנראית מקצועית מהשנייה הראשונה.' }, { title: 'המרה', copy: 'קריאה לפעולה שמניעה את הצעד הבא.' }, { title: 'אמון', copy: 'הוכחות חברתיות ותוצאות אמיתיות.' }, { title: 'פשטות', copy: 'מבנה נקי שקל לסרוק ולהבין.' }, { title: 'גמישות', copy: 'מתאים לעסקים קטנים וצומחים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר פניות' }, { value: '14', label: 'ימים להשקה' }, { value: '24/7', label: 'זמינות' }],
  }),
});

const page02 = makePageSection({
  id: "section-contact-page-02",
  category: "contact",
  title: "יצירת קשר – מרכזי",
  previewLayout: "section-contact-page-02",
  backgroundColor: "#ffffff",
  minHeight: "1400px",
  thumbnail: IMG.team,
  keywords: ["צור קשר","contact","wix"],
  nodes: buildLayoutNodes("center" as PageLayoutKind, {
    eyebrow: 'LET\'S TALK',
    title: 'השיחה הבאה\nמתחילה כאן',
    subtitle: 'עמוד קשר נקי עם מיקוד בהמרה.',
    cta: 'כתבו לנו',
    image: IMG.team,
    items: [{ title: 'ערך ברור', copy: 'מסר מדויק שמדבר לקהל הנכון.' }, { title: 'עיצוב חזק', copy: 'קומפוזיציה שנראית מקצועית מהשנייה הראשונה.' }, { title: 'המרה', copy: 'קריאה לפעולה שמניעה את הצעד הבא.' }, { title: 'אמון', copy: 'הוכחות חברתיות ותוצאות אמיתיות.' }, { title: 'פשטות', copy: 'מבנה נקי שקל לסרוק ולהבין.' }, { title: 'גמישות', copy: 'מתאים לעסקים קטנים וצומחים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר פניות' }, { value: '14', label: 'ימים להשקה' }, { value: '24/7', label: 'זמינות' }],
  }),
});

const page03 = makePageSection({
  id: "section-contact-page-03",
  category: "contact",
  title: "יצירת קשר – מגזין",
  previewLayout: "section-contact-page-03",
  backgroundColor: "#ffffff",
  minHeight: "1320px",
  thumbnail: IMG.workspace,
  keywords: ["צור קשר","contact","wix"],
  nodes: buildLayoutNodes("magazine" as PageLayoutKind, {
    eyebrow: 'STUDIO DESK',
    title: 'בואו נדבר\nעל הפרויקט',
    subtitle: 'פריסה ויזואלית חמה ליצירת קשר.',
    cta: 'קבעו שיחה',
    image: IMG.workspace,
    items: [{ title: 'ערך ברור', copy: 'מסר מדויק שמדבר לקהל הנכון.' }, { title: 'עיצוב חזק', copy: 'קומפוזיציה שנראית מקצועית מהשנייה הראשונה.' }, { title: 'המרה', copy: 'קריאה לפעולה שמניעה את הצעד הבא.' }, { title: 'אמון', copy: 'הוכחות חברתיות ותוצאות אמיתיות.' }, { title: 'פשטות', copy: 'מבנה נקי שקל לסרוק ולהבין.' }, { title: 'גמישות', copy: 'מתאים לעסקים קטנים וצומחים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר פניות' }, { value: '14', label: 'ימים להשקה' }, { value: '24/7', label: 'זמינות' }],
  }),
});

const page04 = makePageSection({
  id: "section-contact-page-04",
  category: "contact",
  title: "יצירת קשר – ערוצים",
  previewLayout: "section-contact-page-04",
  backgroundColor: "#ffffff",
  minHeight: "1120px",
  thumbnail: IMG.tech,
  keywords: ["צור קשר","contact","wix"],
  nodes: buildLayoutNodes("cards" as PageLayoutKind, {
    eyebrow: 'CHANNELS',
    title: 'כל דרכי\nההתקשרות',
    subtitle: 'כרטיסי טלפון, מייל, כתובת ווואטסאפ.',
    cta: 'בחרו ערוץ',
    image: IMG.tech,
    items: [{ title: 'ערך ברור', copy: 'מסר מדויק שמדבר לקהל הנכון.' }, { title: 'עיצוב חזק', copy: 'קומפוזיציה שנראית מקצועית מהשנייה הראשונה.' }, { title: 'המרה', copy: 'קריאה לפעולה שמניעה את הצעד הבא.' }, { title: 'אמון', copy: 'הוכחות חברתיות ותוצאות אמיתיות.' }, { title: 'פשטות', copy: 'מבנה נקי שקל לסרוק ולהבין.' }, { title: 'גמישות', copy: 'מתאים לעסקים קטנים וצומחים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר פניות' }, { value: '14', label: 'ימים להשקה' }, { value: '24/7', label: 'זמינות' }],
  }),
});

const page05 = makePageSection({
  id: "section-contact-page-05",
  category: "contact",
  title: "יצירת קשר – תהליך",
  previewLayout: "section-contact-page-05",
  backgroundColor: "#ffffff",
  minHeight: "1280px",
  thumbnail: IMG.finance,
  keywords: ["צור קשר","contact","wix"],
  nodes: buildLayoutNodes("timeline" as PageLayoutKind, {
    eyebrow: 'NEXT STEPS',
    title: 'מה קורה\nאחרי שפונים',
    subtitle: 'שקיפות מלאה לגבי תהליך המענה.',
    cta: 'התחילו עכשיו',
    image: IMG.finance,
    items: [{ title: 'ערך ברור', copy: 'מסר מדויק שמדבר לקהל הנכון.' }, { title: 'עיצוב חזק', copy: 'קומפוזיציה שנראית מקצועית מהשנייה הראשונה.' }, { title: 'המרה', copy: 'קריאה לפעולה שמניעה את הצעד הבא.' }, { title: 'אמון', copy: 'הוכחות חברתיות ותוצאות אמיתיות.' }, { title: 'פשטות', copy: 'מבנה נקי שקל לסרוק ולהבין.' }, { title: 'גמישות', copy: 'מתאים לעסקים קטנים וצומחים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר פניות' }, { value: '14', label: 'ימים להשקה' }, { value: '24/7', label: 'זמינות' }],
  }),
});

const page06 = makePageSection({
  id: "section-contact-page-06",
  category: "contact",
  title: "יצירת קשר – אמון",
  previewLayout: "section-contact-page-06",
  backgroundColor: "#ffffff",
  minHeight: "1280px",
  thumbnail: IMG.medical,
  keywords: ["צור קשר","contact","wix"],
  nodes: buildLayoutNodes("stats" as PageLayoutKind, {
    eyebrow: 'SUPPORT',
    title: 'שירות לקוחות\nשאפשר לסמוך עליו',
    subtitle: 'מספרים וסיבות לפנות בביטחון.',
    cta: 'פתחו פנייה',
    image: IMG.medical,
    items: [{ title: 'ערך ברור', copy: 'מסר מדויק שמדבר לקהל הנכון.' }, { title: 'עיצוב חזק', copy: 'קומפוזיציה שנראית מקצועית מהשנייה הראשונה.' }, { title: 'המרה', copy: 'קריאה לפעולה שמניעה את הצעד הבא.' }, { title: 'אמון', copy: 'הוכחות חברתיות ותוצאות אמיתיות.' }, { title: 'פשטות', copy: 'מבנה נקי שקל לסרוק ולהבין.' }, { title: 'גמישות', copy: 'מתאים לעסקים קטנים וצומחים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר פניות' }, { value: '14', label: 'ימים להשקה' }, { value: '24/7', label: 'זמינות' }],
  }),
});

const page07 = makePageSection({
  id: "section-contact-page-07",
  category: "contact",
  title: "יצירת קשר – כהה",
  previewLayout: "section-contact-page-07",
  backgroundColor: "#0f1115",
  minHeight: "1320px",
  thumbnail: IMG.abstract,
  keywords: ["צור קשר","contact","wix"],
  nodes: buildLayoutNodes("dark" as PageLayoutKind, {
    eyebrow: 'PRIVATE LINE',
    title: 'יצירת קשר\nבסגנון פרימיום',
    subtitle: 'עמוד קשר דרמטי למותגים יוקרתיים.',
    cta: 'השאירו פרטים',
    image: IMG.abstract,
    items: [{ title: 'ערך ברור', copy: 'מסר מדויק שמדבר לקהל הנכון.' }, { title: 'עיצוב חזק', copy: 'קומפוזיציה שנראית מקצועית מהשנייה הראשונה.' }, { title: 'המרה', copy: 'קריאה לפעולה שמניעה את הצעד הבא.' }, { title: 'אמון', copy: 'הוכחות חברתיות ותוצאות אמיתיות.' }, { title: 'פשטות', copy: 'מבנה נקי שקל לסרוק ולהבין.' }, { title: 'גמישות', copy: 'מתאים לעסקים קטנים וצומחים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר פניות' }, { value: '14', label: 'ימים להשקה' }, { value: '24/7', label: 'זמינות' }],
  }),
});

const page08 = makePageSection({
  id: "section-contact-page-08",
  category: "contact",
  title: "יצירת קשר – חם",
  previewLayout: "section-contact-page-08",
  backgroundColor: "#faf9f7",
  minHeight: "1280px",
  thumbnail: IMG.hospitality,
  keywords: ["צור קשר","contact","wix"],
  nodes: buildLayoutNodes("lifestyle" as PageLayoutKind, {
    eyebrow: 'WELCOME',
    title: 'דלת פתוחה\nלשיחה אמיתית',
    subtitle: 'טון חם ומזמין לעסקים מקומיים.',
    cta: 'שלחו הודעה',
    image: IMG.hospitality,
    items: [{ title: 'ערך ברור', copy: 'מסר מדויק שמדבר לקהל הנכון.' }, { title: 'עיצוב חזק', copy: 'קומפוזיציה שנראית מקצועית מהשנייה הראשונה.' }, { title: 'המרה', copy: 'קריאה לפעולה שמניעה את הצעד הבא.' }, { title: 'אמון', copy: 'הוכחות חברתיות ותוצאות אמיתיות.' }, { title: 'פשטות', copy: 'מבנה נקי שקל לסרוק ולהבין.' }, { title: 'גמישות', copy: 'מתאים לעסקים קטנים וצומחים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר פניות' }, { value: '14', label: 'ימים להשקה' }, { value: '24/7', label: 'זמינות' }],
  }),
});

const page09 = makePageSection({
  id: "section-contact-page-09",
  category: "contact",
  title: "יצירת קשר – מיקום",
  previewLayout: "section-contact-page-09",
  backgroundColor: "#ffffff",
  minHeight: "1200px",
  thumbnail: IMG.architecture,
  keywords: ["צור קשר","contact","wix"],
  nodes: buildLayoutNodes("listMedia" as PageLayoutKind, {
    eyebrow: 'VISIT US',
    title: 'בואו לבקר\nאו כתבו מרחוק',
    subtitle: 'רשימת פרטים לצד תמונת המקום.',
    cta: 'נווטו אלינו',
    image: IMG.architecture,
    items: [{ title: 'ערך ברור', copy: 'מסר מדויק שמדבר לקהל הנכון.' }, { title: 'עיצוב חזק', copy: 'קומפוזיציה שנראית מקצועית מהשנייה הראשונה.' }, { title: 'המרה', copy: 'קריאה לפעולה שמניעה את הצעד הבא.' }, { title: 'אמון', copy: 'הוכחות חברתיות ותוצאות אמיתיות.' }, { title: 'פשטות', copy: 'מבנה נקי שקל לסרוק ולהבין.' }, { title: 'גמישות', copy: 'מתאים לעסקים קטנים וצומחים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר פניות' }, { value: '14', label: 'ימים להשקה' }, { value: '24/7', label: 'זמינות' }],
  }),
});

const page10 = makePageSection({
  id: "section-contact-page-10",
  category: "contact",
  title: "יצירת קשר – טופס",
  previewLayout: "section-contact-page-10",
  backgroundColor: "#ffffff",
  minHeight: "1180px",
  thumbnail: IMG.office,
  keywords: ["צור קשר","contact","wix"],
  nodes: buildLayoutNodes("ctaForm" as PageLayoutKind, {
    eyebrow: 'MESSAGE',
    title: 'השאירו פרטים\nונחזור אליכם',
    subtitle: 'טופס גדול וברור עם יתרונות קצרים.',
    cta: 'שליחה',
    secondaryCta: 'וואטסאפ',
    image: IMG.office,
    items: [{ title: 'ערך ברור', copy: 'מסר מדויק שמדבר לקהל הנכון.' }, { title: 'עיצוב חזק', copy: 'קומפוזיציה שנראית מקצועית מהשנייה הראשונה.' }, { title: 'המרה', copy: 'קריאה לפעולה שמניעה את הצעד הבא.' }, { title: 'אמון', copy: 'הוכחות חברתיות ותוצאות אמיתיות.' }, { title: 'פשטות', copy: 'מבנה נקי שקל לסרוק ולהבין.' }, { title: 'גמישות', copy: 'מתאים לעסקים קטנים וצומחים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר פניות' }, { value: '14', label: 'ימים להשקה' }, { value: '24/7', label: 'זמינות' }],
  }),
});

export const CONTACT_PAGE_SHOWCASE_SECTIONS: VisualLibrarySectionTemplate[] = [
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
