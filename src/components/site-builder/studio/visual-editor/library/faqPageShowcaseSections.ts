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
  title: "שאלות נפוצות – מפוצל",
  previewLayout: "section-faq-page-01",
  backgroundColor: "#ffffff",
  minHeight: "1480px",
  thumbnail: IMG.education,
  keywords: ["שאלות נפוצות","faq","wix"],
  nodes: buildLayoutNodes("split" as PageLayoutKind, {
    eyebrow: 'FAQ',
    title: 'תשובות\nלשאלות החשובות',
    subtitle: 'עמוד FAQ עם כרטיסי נושאים.',
    cta: 'לא מצאתם תשובה?',
    image: IMG.education,
    items: [{ title: 'ערך ברור', copy: 'מסר מדויק שמדבר לקהל הנכון.' }, { title: 'עיצוב חזק', copy: 'קומפוזיציה שנראית מקצועית מהשנייה הראשונה.' }, { title: 'המרה', copy: 'קריאה לפעולה שמניעה את הצעד הבא.' }, { title: 'אמון', copy: 'הוכחות חברתיות ותוצאות אמיתיות.' }, { title: 'פשטות', copy: 'מבנה נקי שקל לסרוק ולהבין.' }, { title: 'גמישות', copy: 'מתאים לעסקים קטנים וצומחים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר פניות' }, { value: '14', label: 'ימים להשקה' }, { value: '24/7', label: 'זמינות' }],
  }),
});

const page02 = makePageSection({
  id: "section-faq-page-02",
  category: "faq",
  title: "שאלות נפוצות – מרכזי",
  previewLayout: "section-faq-page-02",
  backgroundColor: "#ffffff",
  minHeight: "1400px",
  thumbnail: IMG.office,
  keywords: ["שאלות נפוצות","faq","wix"],
  nodes: buildLayoutNodes("center" as PageLayoutKind, {
    eyebrow: 'HELP',
    title: 'כל מה שרציתם\nלדעת',
    subtitle: 'פתיחה נקייה למרכז עזרה.',
    cta: 'חיפוש תשובה',
    image: IMG.office,
    items: [{ title: 'ערך ברור', copy: 'מסר מדויק שמדבר לקהל הנכון.' }, { title: 'עיצוב חזק', copy: 'קומפוזיציה שנראית מקצועית מהשנייה הראשונה.' }, { title: 'המרה', copy: 'קריאה לפעולה שמניעה את הצעד הבא.' }, { title: 'אמון', copy: 'הוכחות חברתיות ותוצאות אמיתיות.' }, { title: 'פשטות', copy: 'מבנה נקי שקל לסרוק ולהבין.' }, { title: 'גמישות', copy: 'מתאים לעסקים קטנים וצומחים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר פניות' }, { value: '14', label: 'ימים להשקה' }, { value: '24/7', label: 'זמינות' }],
  }),
});

const page03 = makePageSection({
  id: "section-faq-page-03",
  category: "faq",
  title: "שאלות נפוצות – מגזין",
  previewLayout: "section-faq-page-03",
  backgroundColor: "#ffffff",
  minHeight: "1320px",
  thumbnail: IMG.workspace,
  keywords: ["שאלות נפוצות","faq","wix"],
  nodes: buildLayoutNodes("magazine" as PageLayoutKind, {
    eyebrow: 'GUIDES',
    title: 'שאלות\nעם הקשר',
    subtitle: 'FAQ בסגנון מדריך ויזואלי.',
    cta: 'למדריכים',
    image: IMG.workspace,
    items: [{ title: 'ערך ברור', copy: 'מסר מדויק שמדבר לקהל הנכון.' }, { title: 'עיצוב חזק', copy: 'קומפוזיציה שנראית מקצועית מהשנייה הראשונה.' }, { title: 'המרה', copy: 'קריאה לפעולה שמניעה את הצעד הבא.' }, { title: 'אמון', copy: 'הוכחות חברתיות ותוצאות אמיתיות.' }, { title: 'פשטות', copy: 'מבנה נקי שקל לסרוק ולהבין.' }, { title: 'גמישות', copy: 'מתאים לעסקים קטנים וצומחים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר פניות' }, { value: '14', label: 'ימים להשקה' }, { value: '24/7', label: 'זמינות' }],
  }),
});

const page04 = makePageSection({
  id: "section-faq-page-04",
  category: "faq",
  title: "שאלות נפוצות – נושאים",
  previewLayout: "section-faq-page-04",
  backgroundColor: "#ffffff",
  minHeight: "1120px",
  thumbnail: IMG.tech,
  keywords: ["שאלות נפוצות","faq","wix"],
  nodes: buildLayoutNodes("cards" as PageLayoutKind, {
    eyebrow: 'TOPICS',
    title: 'נושאים\nנפוצים',
    subtitle: 'כרטיסי קטגוריות לשאלות.',
    cta: 'בחרו נושא',
    image: IMG.tech,
    items: [{ title: 'ערך ברור', copy: 'מסר מדויק שמדבר לקהל הנכון.' }, { title: 'עיצוב חזק', copy: 'קומפוזיציה שנראית מקצועית מהשנייה הראשונה.' }, { title: 'המרה', copy: 'קריאה לפעולה שמניעה את הצעד הבא.' }, { title: 'אמון', copy: 'הוכחות חברתיות ותוצאות אמיתיות.' }, { title: 'פשטות', copy: 'מבנה נקי שקל לסרוק ולהבין.' }, { title: 'גמישות', copy: 'מתאים לעסקים קטנים וצומחים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר פניות' }, { value: '14', label: 'ימים להשקה' }, { value: '24/7', label: 'זמינות' }],
  }),
});

const page05 = makePageSection({
  id: "section-faq-page-05",
  category: "faq",
  title: "שאלות נפוצות – שלבים",
  previewLayout: "section-faq-page-05",
  backgroundColor: "#ffffff",
  minHeight: "1280px",
  thumbnail: IMG.finance,
  keywords: ["שאלות נפוצות","faq","wix"],
  nodes: buildLayoutNodes("timeline" as PageLayoutKind, {
    eyebrow: 'SETUP',
    title: 'שאלות לפי\nשלבי שימוש',
    subtitle: 'FAQ על ציר תהליך.',
    cta: 'להתחלה מהירה',
    image: IMG.finance,
    items: [{ title: 'ערך ברור', copy: 'מסר מדויק שמדבר לקהל הנכון.' }, { title: 'עיצוב חזק', copy: 'קומפוזיציה שנראית מקצועית מהשנייה הראשונה.' }, { title: 'המרה', copy: 'קריאה לפעולה שמניעה את הצעד הבא.' }, { title: 'אמון', copy: 'הוכחות חברתיות ותוצאות אמיתיות.' }, { title: 'פשטות', copy: 'מבנה נקי שקל לסרוק ולהבין.' }, { title: 'גמישות', copy: 'מתאים לעסקים קטנים וצומחים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר פניות' }, { value: '14', label: 'ימים להשקה' }, { value: '24/7', label: 'זמינות' }],
  }),
});

const page06 = makePageSection({
  id: "section-faq-page-06",
  category: "faq",
  title: "שאלות נפוצות – מהיר",
  previewLayout: "section-faq-page-06",
  backgroundColor: "#ffffff",
  minHeight: "1280px",
  thumbnail: IMG.tech,
  keywords: ["שאלות נפוצות","faq","wix"],
  nodes: buildLayoutNodes("stats" as PageLayoutKind, {
    eyebrow: 'QUICK FACTS',
    title: 'עובדות\nבקצרה',
    subtitle: 'מספרים ותשובות זריזות.',
    cta: 'עוד פרטים',
    image: IMG.tech,
    items: [{ title: 'ערך ברור', copy: 'מסר מדויק שמדבר לקהל הנכון.' }, { title: 'עיצוב חזק', copy: 'קומפוזיציה שנראית מקצועית מהשנייה הראשונה.' }, { title: 'המרה', copy: 'קריאה לפעולה שמניעה את הצעד הבא.' }, { title: 'אמון', copy: 'הוכחות חברתיות ותוצאות אמיתיות.' }, { title: 'פשטות', copy: 'מבנה נקי שקל לסרוק ולהבין.' }, { title: 'גמישות', copy: 'מתאים לעסקים קטנים וצומחים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר פניות' }, { value: '14', label: 'ימים להשקה' }, { value: '24/7', label: 'זמינות' }],
  }),
});

const page07 = makePageSection({
  id: "section-faq-page-07",
  category: "faq",
  title: "שאלות נפוצות – כהה",
  previewLayout: "section-faq-page-07",
  backgroundColor: "#0f1115",
  minHeight: "1320px",
  thumbnail: IMG.abstract,
  keywords: ["שאלות נפוצות","faq","wix"],
  nodes: buildLayoutNodes("dark" as PageLayoutKind, {
    eyebrow: 'SUPPORT',
    title: 'תמיכה\nבלי בלבול',
    subtitle: 'עמוד עזרה דרמטי וברור.',
    cta: 'פתחו קריאה',
    image: IMG.abstract,
    items: [{ title: 'ערך ברור', copy: 'מסר מדויק שמדבר לקהל הנכון.' }, { title: 'עיצוב חזק', copy: 'קומפוזיציה שנראית מקצועית מהשנייה הראשונה.' }, { title: 'המרה', copy: 'קריאה לפעולה שמניעה את הצעד הבא.' }, { title: 'אמון', copy: 'הוכחות חברתיות ותוצאות אמיתיות.' }, { title: 'פשטות', copy: 'מבנה נקי שקל לסרוק ולהבין.' }, { title: 'גמישות', copy: 'מתאים לעסקים קטנים וצומחים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר פניות' }, { value: '14', label: 'ימים להשקה' }, { value: '24/7', label: 'זמינות' }],
  }),
});

const page08 = makePageSection({
  id: "section-faq-page-08",
  category: "faq",
  title: "שאלות נפוצות – רך",
  previewLayout: "section-faq-page-08",
  backgroundColor: "#faf9f7",
  minHeight: "1280px",
  thumbnail: IMG.wellness,
  keywords: ["שאלות נפוצות","faq","wix"],
  nodes: buildLayoutNodes("lifestyle" as PageLayoutKind, {
    eyebrow: 'FRIENDLY HELP',
    title: 'עזרה\nבשפה פשוטה',
    subtitle: 'טון חם לשאלות נפוצות.',
    cta: 'שאלו אותנו',
    image: IMG.wellness,
    items: [{ title: 'ערך ברור', copy: 'מסר מדויק שמדבר לקהל הנכון.' }, { title: 'עיצוב חזק', copy: 'קומפוזיציה שנראית מקצועית מהשנייה הראשונה.' }, { title: 'המרה', copy: 'קריאה לפעולה שמניעה את הצעד הבא.' }, { title: 'אמון', copy: 'הוכחות חברתיות ותוצאות אמיתיות.' }, { title: 'פשטות', copy: 'מבנה נקי שקל לסרוק ולהבין.' }, { title: 'גמישות', copy: 'מתאים לעסקים קטנים וצומחים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר פניות' }, { value: '14', label: 'ימים להשקה' }, { value: '24/7', label: 'זמינות' }],
  }),
});

const page09 = makePageSection({
  id: "section-faq-page-09",
  category: "faq",
  title: "שאלות נפוצות – רשימה",
  previewLayout: "section-faq-page-09",
  backgroundColor: "#ffffff",
  minHeight: "1200px",
  thumbnail: IMG.education,
  keywords: ["שאלות נפוצות","faq","wix"],
  nodes: buildLayoutNodes("listMedia" as PageLayoutKind, {
    eyebrow: 'ANSWERS',
    title: 'שאלות\nותשובות',
    subtitle: 'רשימת FAQ לצד מדיה.',
    cta: 'לכל השאלות',
    image: IMG.education,
    items: [{ title: 'ערך ברור', copy: 'מסר מדויק שמדבר לקהל הנכון.' }, { title: 'עיצוב חזק', copy: 'קומפוזיציה שנראית מקצועית מהשנייה הראשונה.' }, { title: 'המרה', copy: 'קריאה לפעולה שמניעה את הצעד הבא.' }, { title: 'אמון', copy: 'הוכחות חברתיות ותוצאות אמיתיות.' }, { title: 'פשטות', copy: 'מבנה נקי שקל לסרוק ולהבין.' }, { title: 'גמישות', copy: 'מתאים לעסקים קטנים וצומחים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר פניות' }, { value: '14', label: 'ימים להשקה' }, { value: '24/7', label: 'זמינות' }],
  }),
});

const page10 = makePageSection({
  id: "section-faq-page-10",
  category: "faq",
  title: "שאלות נפוצות – פנייה",
  previewLayout: "section-faq-page-10",
  backgroundColor: "#ffffff",
  minHeight: "1180px",
  thumbnail: IMG.office,
  keywords: ["שאלות נפוצות","faq","wix"],
  nodes: buildLayoutNodes("ctaForm" as PageLayoutKind, {
    eyebrow: 'STILL STUCK',
    title: 'עדיין צריכים\nעזרה?',
    subtitle: 'טופס פנייה בסוף עמוד FAQ.',
    cta: 'שלחו שאלה',
    image: IMG.office,
    items: [{ title: 'ערך ברור', copy: 'מסר מדויק שמדבר לקהל הנכון.' }, { title: 'עיצוב חזק', copy: 'קומפוזיציה שנראית מקצועית מהשנייה הראשונה.' }, { title: 'המרה', copy: 'קריאה לפעולה שמניעה את הצעד הבא.' }, { title: 'אמון', copy: 'הוכחות חברתיות ותוצאות אמיתיות.' }, { title: 'פשטות', copy: 'מבנה נקי שקל לסרוק ולהבין.' }, { title: 'גמישות', copy: 'מתאים לעסקים קטנים וצומחים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר פניות' }, { value: '14', label: 'ימים להשקה' }, { value: '24/7', label: 'זמינות' }],
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
