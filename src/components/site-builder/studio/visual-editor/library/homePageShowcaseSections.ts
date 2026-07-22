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
  title: "דף הבית – פתיחה מפוצלת",
  previewLayout: "section-home-page-01",
  backgroundColor: "#ffffff",
  minHeight: "1480px",
  thumbnail: IMG.office,
  keywords: ["בית","ראשי","home","hero","wix"],
  nodes: buildLayoutNodes("split" as PageLayoutKind, {
    eyebrow: 'ברוכים הבאים',
    title: 'נהלו את העסק\nבמקום אחד',
    subtitle: 'פלטפורמה חכמה ללקוחות, תורים ו-CRM — הכל מחובר.',
    cta: 'התחילו עכשיו',
    secondaryCta: 'למד עוד',
    image: IMG.office,
    items: [{ title: 'ערך ברור', copy: 'מסר מדויק שמדבר לקהל הנכון.' }, { title: 'עיצוב חזק', copy: 'קומפוזיציה שנראית מקצועית מהשנייה הראשונה.' }, { title: 'המרה', copy: 'קריאה לפעולה שמניעה את הצעד הבא.' }, { title: 'אמון', copy: 'הוכחות חברתיות ותוצאות אמיתיות.' }, { title: 'פשטות', copy: 'מבנה נקי שקל לסרוק ולהבין.' }, { title: 'גמישות', copy: 'מתאים לעסקים קטנים וצומחים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר פניות' }, { value: '14', label: 'ימים להשקה' }, { value: '24/7', label: 'זמינות' }],
  }),
});

const page02 = makePageSection({
  id: "section-home-page-02",
  category: "hero",
  title: "דף הבית – Editorial",
  previewLayout: "section-home-page-02",
  backgroundColor: "#ffffff",
  minHeight: "1400px",
  thumbnail: IMG.nature,
  keywords: ["בית","ראשי","home","hero","wix"],
  nodes: buildLayoutNodes("center" as PageLayoutKind, {
    eyebrow: 'HOME',
    title: 'המקום שלך\nלהתחיל מחדש',
    subtitle: 'עיצוב נקי, מסר ברור וקריאה לפעולה אחת.',
    cta: 'קבעו שיחה',
    image: IMG.nature,
    items: [{ title: 'ערך ברור', copy: 'מסר מדויק שמדבר לקהל הנכון.' }, { title: 'עיצוב חזק', copy: 'קומפוזיציה שנראית מקצועית מהשנייה הראשונה.' }, { title: 'המרה', copy: 'קריאה לפעולה שמניעה את הצעד הבא.' }, { title: 'אמון', copy: 'הוכחות חברתיות ותוצאות אמיתיות.' }, { title: 'פשטות', copy: 'מבנה נקי שקל לסרוק ולהבין.' }, { title: 'גמישות', copy: 'מתאים לעסקים קטנים וצומחים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר פניות' }, { value: '14', label: 'ימים להשקה' }, { value: '24/7', label: 'זמינות' }],
  }),
});

const page03 = makePageSection({
  id: "section-home-page-03",
  category: "hero",
  title: "דף הבית – מגזין",
  previewLayout: "section-home-page-03",
  backgroundColor: "#ffffff",
  minHeight: "1320px",
  thumbnail: IMG.workspace,
  keywords: ["בית","ראשי","home","hero","wix"],
  nodes: buildLayoutNodes("magazine" as PageLayoutKind, {
    eyebrow: 'STUDIO',
    title: 'רעיונות\nשאי אפשר לפספס',
    subtitle: 'קומפוזיציה מגזינית עם תמונות חזקות.',
    cta: 'גלו עוד',
    image: IMG.workspace,
    items: [{ title: 'ערך ברור', copy: 'מסר מדויק שמדבר לקהל הנכון.' }, { title: 'עיצוב חזק', copy: 'קומפוזיציה שנראית מקצועית מהשנייה הראשונה.' }, { title: 'המרה', copy: 'קריאה לפעולה שמניעה את הצעד הבא.' }, { title: 'אמון', copy: 'הוכחות חברתיות ותוצאות אמיתיות.' }, { title: 'פשטות', copy: 'מבנה נקי שקל לסרוק ולהבין.' }, { title: 'גמישות', copy: 'מתאים לעסקים קטנים וצומחים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר פניות' }, { value: '14', label: 'ימים להשקה' }, { value: '24/7', label: 'זמינות' }],
  }),
});

const page04 = makePageSection({
  id: "section-home-page-04",
  category: "hero",
  title: "דף הבית – כרטיסי ערך",
  previewLayout: "section-home-page-04",
  backgroundColor: "#ffffff",
  minHeight: "1120px",
  thumbnail: IMG.tech,
  keywords: ["בית","ראשי","home","hero","wix"],
  nodes: buildLayoutNodes("cards" as PageLayoutKind, {
    eyebrow: 'SERVICES',
    title: 'כל מה שהעסק\nצריך כדי לצמוח',
    subtitle: 'שישה כרטיסים ויזואליים במבט אחד.',
    cta: 'לכל השירותים',
    image: IMG.tech,
    items: [{ title: 'ערך ברור', copy: 'מסר מדויק שמדבר לקהל הנכון.' }, { title: 'עיצוב חזק', copy: 'קומפוזיציה שנראית מקצועית מהשנייה הראשונה.' }, { title: 'המרה', copy: 'קריאה לפעולה שמניעה את הצעד הבא.' }, { title: 'אמון', copy: 'הוכחות חברתיות ותוצאות אמיתיות.' }, { title: 'פשטות', copy: 'מבנה נקי שקל לסרוק ולהבין.' }, { title: 'גמישות', copy: 'מתאים לעסקים קטנים וצומחים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר פניות' }, { value: '14', label: 'ימים להשקה' }, { value: '24/7', label: 'זמינות' }],
  }),
});

const page05 = makePageSection({
  id: "section-home-page-05",
  category: "hero",
  title: "דף הבית – תהליך",
  previewLayout: "section-home-page-05",
  backgroundColor: "#ffffff",
  minHeight: "1280px",
  thumbnail: IMG.finance,
  keywords: ["בית","ראשי","home","hero","wix"],
  nodes: buildLayoutNodes("timeline" as PageLayoutKind, {
    eyebrow: 'HOW IT WORKS',
    title: 'מארבעה שלבים\nלעסק מסודר',
    subtitle: 'תהליך ברור שמוריד עומס ומעלה תוצאות.',
    cta: 'התחילו בשלב 1',
    image: IMG.finance,
    items: [{ title: 'מקימים פרופיל', copy: 'פרטי העסק והשירותים.', meta: 'שלב 01' }, { title: 'בונים אתר', copy: 'תבנית או AI.', meta: 'שלב 02' }, { title: 'מחברים CRM', copy: 'לידים ותורים.', meta: 'שלב 03' }, { title: 'מפרסמים', copy: 'יוצאים לאוויר.', meta: 'שלב 04' }, { title: 'משתפרים', copy: 'המלצות חכמות.', meta: 'שלב 05' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר פניות' }, { value: '14', label: 'ימים להשקה' }, { value: '24/7', label: 'זמינות' }],
  }),
});

const page06 = makePageSection({
  id: "section-home-page-06",
  category: "hero",
  title: "דף הבית – מספרים",
  previewLayout: "section-home-page-06",
  backgroundColor: "#ffffff",
  minHeight: "1280px",
  thumbnail: IMG.office,
  keywords: ["בית","ראשי","home","hero","wix"],
  nodes: buildLayoutNodes("stats" as PageLayoutKind, {
    eyebrow: 'RESULTS',
    title: 'תוצאות\nשמדברות בעד עצמן',
    subtitle: 'שקיפות מלאה: מספרים, סיפור וערך ממשי.',
    cta: 'ראו דמו',
    image: IMG.office,
    items: [{ title: 'ערך ברור', copy: 'מסר מדויק שמדבר לקהל הנכון.' }, { title: 'עיצוב חזק', copy: 'קומפוזיציה שנראית מקצועית מהשנייה הראשונה.' }, { title: 'המרה', copy: 'קריאה לפעולה שמניעה את הצעד הבא.' }, { title: 'אמון', copy: 'הוכחות חברתיות ותוצאות אמיתיות.' }, { title: 'פשטות', copy: 'מבנה נקי שקל לסרוק ולהבין.' }, { title: 'גמישות', copy: 'מתאים לעסקים קטנים וצומחים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר פניות' }, { value: '14', label: 'ימים להשקה' }, { value: '24/7', label: 'זמינות' }],
  }),
});

const page07 = makePageSection({
  id: "section-home-page-07",
  category: "hero",
  title: "דף הבית – כהה קולנועי",
  previewLayout: "section-home-page-07",
  backgroundColor: "#0f1115",
  minHeight: "1320px",
  thumbnail: IMG.abstract,
  keywords: ["בית","ראשי","home","hero","wix"],
  nodes: buildLayoutNodes("dark" as PageLayoutKind, {
    eyebrow: 'PREMIUM',
    title: 'נוכחות דיגיטלית\nברמה אחרת',
    subtitle: 'פתיחה דרמטית עם מסר חד.',
    cta: 'הצטרפו עכשיו',
    image: IMG.abstract,
    items: [{ title: 'ערך ברור', copy: 'מסר מדויק שמדבר לקהל הנכון.' }, { title: 'עיצוב חזק', copy: 'קומפוזיציה שנראית מקצועית מהשנייה הראשונה.' }, { title: 'המרה', copy: 'קריאה לפעולה שמניעה את הצעד הבא.' }, { title: 'אמון', copy: 'הוכחות חברתיות ותוצאות אמיתיות.' }, { title: 'פשטות', copy: 'מבנה נקי שקל לסרוק ולהבין.' }, { title: 'גמישות', copy: 'מתאים לעסקים קטנים וצומחים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר פניות' }, { value: '14', label: 'ימים להשקה' }, { value: '24/7', label: 'זמינות' }],
  }),
});

const page08 = makePageSection({
  id: "section-home-page-08",
  category: "hero",
  title: "דף הבית – לייפסטייל",
  previewLayout: "section-home-page-08",
  backgroundColor: "#faf9f7",
  minHeight: "1280px",
  thumbnail: IMG.fitness,
  keywords: ["בית","ראשי","home","hero","wix"],
  nodes: buildLayoutNodes("lifestyle" as PageLayoutKind, {
    eyebrow: 'WELLNESS',
    title: 'אימון שמשנה\nאת היום שלכם',
    subtitle: 'אווירה רכה ותמונה גדולה שמזמינה לפעולה.',
    cta: 'קבעו אימון',
    image: IMG.fitness,
    items: [{ title: 'ערך ברור', copy: 'מסר מדויק שמדבר לקהל הנכון.' }, { title: 'עיצוב חזק', copy: 'קומפוזיציה שנראית מקצועית מהשנייה הראשונה.' }, { title: 'המרה', copy: 'קריאה לפעולה שמניעה את הצעד הבא.' }, { title: 'אמון', copy: 'הוכחות חברתיות ותוצאות אמיתיות.' }, { title: 'פשטות', copy: 'מבנה נקי שקל לסרוק ולהבין.' }, { title: 'גמישות', copy: 'מתאים לעסקים קטנים וצומחים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר פניות' }, { value: '14', label: 'ימים להשקה' }, { value: '24/7', label: 'זמינות' }],
  }),
});

const page09 = makePageSection({
  id: "section-home-page-09",
  category: "hero",
  title: "דף הבית – רשימה ומדיה",
  previewLayout: "section-home-page-09",
  backgroundColor: "#ffffff",
  minHeight: "1200px",
  thumbnail: IMG.ecommerce,
  keywords: ["בית","ראשי","home","hero","wix"],
  nodes: buildLayoutNodes("listMedia" as PageLayoutKind, {
    eyebrow: 'FEATURES',
    title: 'הכלים שהופכים\nעסק לעסק מסודר',
    subtitle: 'רשימת יתרונות לצד תמונה דומיננטית.',
    cta: 'נסו בחינם',
    image: IMG.ecommerce,
    items: [{ title: 'ערך ברור', copy: 'מסר מדויק שמדבר לקהל הנכון.' }, { title: 'עיצוב חזק', copy: 'קומפוזיציה שנראית מקצועית מהשנייה הראשונה.' }, { title: 'המרה', copy: 'קריאה לפעולה שמניעה את הצעד הבא.' }, { title: 'אמון', copy: 'הוכחות חברתיות ותוצאות אמיתיות.' }, { title: 'פשטות', copy: 'מבנה נקי שקל לסרוק ולהבין.' }, { title: 'גמישות', copy: 'מתאים לעסקים קטנים וצומחים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר פניות' }, { value: '14', label: 'ימים להשקה' }, { value: '24/7', label: 'זמינות' }],
  }),
});

const page10 = makePageSection({
  id: "section-home-page-10",
  category: "hero",
  title: "דף הבית – המרה",
  previewLayout: "section-home-page-10",
  backgroundColor: "#ffffff",
  minHeight: "1180px",
  thumbnail: IMG.hospitality,
  keywords: ["בית","ראשי","home","hero","wix"],
  nodes: buildLayoutNodes("ctaForm" as PageLayoutKind, {
    eyebrow: 'GET STARTED',
    title: 'בואו נבנה\nאת האתר שלכם',
    subtitle: 'טופס בולט ומסר ברור לפנייה מיידית.',
    cta: 'שלחו פרטים',
    secondaryCta: 'דברו איתנו',
    image: IMG.hospitality,
    items: [{ title: 'ערך ברור', copy: 'מסר מדויק שמדבר לקהל הנכון.' }, { title: 'עיצוב חזק', copy: 'קומפוזיציה שנראית מקצועית מהשנייה הראשונה.' }, { title: 'המרה', copy: 'קריאה לפעולה שמניעה את הצעד הבא.' }, { title: 'אמון', copy: 'הוכחות חברתיות ותוצאות אמיתיות.' }, { title: 'פשטות', copy: 'מבנה נקי שקל לסרוק ולהבין.' }, { title: 'גמישות', copy: 'מתאים לעסקים קטנים וצומחים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר פניות' }, { value: '14', label: 'ימים להשקה' }, { value: '24/7', label: 'זמינות' }],
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
