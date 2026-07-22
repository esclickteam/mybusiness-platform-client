import { VISUAL_LIBRARY_IMAGES as IMG } from "./libraryAssets";
import type { VisualLibrarySectionTemplate } from "./visualLibraryTypes";
import {
  buildLayoutNodes,
  makePageSection,
  type PageLayoutKind,
} from "./pageShowcaseHelpers";

const page01 = makePageSection({
  id: "section-testimonials-page-01",
  category: "testimonials",
  title: "ביקורות – כחול עסקי",
  previewLayout: "section-testimonials-page-01",
  backgroundColor: "#ffffff",
  minHeight: "1600px",
  thumbnail: IMG.team,
  keywords: ["ביקורות","reviews","wix"],
  nodes: buildLayoutNodes("split" as PageLayoutKind, {
    eyebrow: 'REVIEWS',
    title: 'לקוחות\nשממליצים',
    subtitle: 'ביקורות עם נוכחות כחולה.',
    cta: 'קראו עוד',
    image: IMG.team,
    items: [{ title: '״שירות מדהים״', copy: 'חזרנו לקוחות קבועים.' }, { title: '״מהיר ומדויק״', copy: 'הכול בזמן.' }, { title: '״מקצועי״', copy: 'הרגשנו בידיים טובות.' }, { title: '״מומלץ״', copy: 'כבר שלחנו חברים.' }, { title: '״שווה כל שקל״', copy: 'ראינו תוצאה.' }, { title: '״יחס אישי״', copy: 'לא עוד מספר.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page02 = makePageSection({
  id: "section-testimonials-page-02",
  category: "testimonials",
  title: "ביקורות – Editorial חם",
  previewLayout: "section-testimonials-page-02",
  backgroundColor: "#f7f1ea",
  minHeight: "1500px",
  thumbnail: IMG.office,
  keywords: ["ביקורות","reviews","wix"],
  nodes: buildLayoutNodes("center" as PageLayoutKind, {
    eyebrow: 'LOVED BY',
    title: 'אמון שנבנה\nמתוצאות',
    subtitle: 'המלצות בטון חם.',
    cta: 'ראו המלצות',
    image: IMG.office,
    items: [{ title: 'לפני', copy: 'בלגן וכלים רבים.', meta: '01' }, { title: 'במהלך', copy: 'ליווי צמוד.', meta: '02' }, { title: 'אחרי', copy: 'סדר ותוצאות.', meta: '03' }, { title: 'המלצה', copy: 'ממליצים הלאה.', meta: '04' }, { title: 'חזרה', copy: 'עובדים שוב.', meta: '05' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page03 = makePageSection({
  id: "section-testimonials-page-03",
  category: "testimonials",
  title: "ביקורות – מגזין שחור",
  previewLayout: "section-testimonials-page-03",
  backgroundColor: "#ffffff",
  minHeight: "1550px",
  thumbnail: IMG.portrait,
  keywords: ["ביקורות","reviews","wix"],
  nodes: buildLayoutNodes("magazine" as PageLayoutKind, {
    eyebrow: 'STORIES',
    title: 'סיפורי הצלחה\nאמיתיים',
    subtitle: 'ביקורות בסגנון מגזין.',
    cta: 'גלו סיפור',
    image: IMG.portrait,
    items: [{ title: '״שירות מדהים״', copy: 'חזרנו לקוחות קבועים.' }, { title: '״מהיר ומדויק״', copy: 'הכול בזמן.' }, { title: '״מקצועי״', copy: 'הרגשנו בידיים טובות.' }, { title: '״מומלץ״', copy: 'כבר שלחנו חברים.' }, { title: '״שווה כל שקל״', copy: 'ראינו תוצאה.' }, { title: '״יחס אישי״', copy: 'לא עוד מספר.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page04 = makePageSection({
  id: "section-testimonials-page-04",
  category: "testimonials",
  title: "ביקורות – כרטיסים צבעוניים",
  previewLayout: "section-testimonials-page-04",
  backgroundColor: "#eef6ff",
  minHeight: "1500px",
  thumbnail: IMG.team,
  keywords: ["ביקורות","reviews","wix"],
  nodes: buildLayoutNodes("cards" as PageLayoutKind, {
    eyebrow: 'WALL',
    title: 'קיר המלצות\nבצבעים חיים',
    subtitle: 'כל ציטוט עם מבטא צבע.',
    cta: 'לכל הביקורות',
    image: IMG.team,
    items: [{ title: 'לפני', copy: 'בלגן וכלים רבים.', meta: '01' }, { title: 'במהלך', copy: 'ליווי צמוד.', meta: '02' }, { title: 'אחרי', copy: 'סדר ותוצאות.', meta: '03' }, { title: 'המלצה', copy: 'ממליצים הלאה.', meta: '04' }, { title: 'חזרה', copy: 'עובדים שוב.', meta: '05' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page05 = makePageSection({
  id: "section-testimonials-page-05",
  category: "testimonials",
  title: "ביקורות – ציר סגול",
  previewLayout: "section-testimonials-page-05",
  backgroundColor: "#f6f4ff",
  minHeight: "1580px",
  thumbnail: IMG.workspace,
  keywords: ["ביקורות","reviews","wix"],
  nodes: buildLayoutNodes("timeline" as PageLayoutKind, {
    eyebrow: 'JOURNEY',
    title: 'מהלקוח אמר\nאחרי התהליך',
    subtitle: 'המלצות על ציר זמן.',
    cta: 'התחילו גם אתם',
    image: IMG.workspace,
    items: [{ title: '״שירות מדהים״', copy: 'חזרנו לקוחות קבועים.' }, { title: '״מהיר ומדויק״', copy: 'הכול בזמן.' }, { title: '״מקצועי״', copy: 'הרגשנו בידיים טובות.' }, { title: '״מומלץ״', copy: 'כבר שלחנו חברים.' }, { title: '״שווה כל שקל״', copy: 'ראינו תוצאה.' }, { title: '״יחס אישי״', copy: 'לא עוד מספר.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page06 = makePageSection({
  id: "section-testimonials-page-06",
  category: "testimonials",
  title: "ביקורות – לוח מספרים",
  previewLayout: "section-testimonials-page-06",
  backgroundColor: "#111827",
  minHeight: "1480px",
  thumbnail: IMG.finance,
  keywords: ["ביקורות","reviews","wix"],
  nodes: buildLayoutNodes("stats" as PageLayoutKind, {
    eyebrow: 'RATINGS',
    title: 'המספרים\nשל שביעות הרצון',
    subtitle: 'דירוגים זוהרים על כהה.',
    cta: 'בדקו דירוגים',
    image: IMG.finance,
    items: [{ title: 'לפני', copy: 'בלגן וכלים רבים.', meta: '01' }, { title: 'במהלך', copy: 'ליווי צמוד.', meta: '02' }, { title: 'אחרי', copy: 'סדר ותוצאות.', meta: '03' }, { title: 'המלצה', copy: 'ממליצים הלאה.', meta: '04' }, { title: 'חזרה', copy: 'עובדים שוב.', meta: '05' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page07 = makePageSection({
  id: "section-testimonials-page-07",
  category: "testimonials",
  title: "ביקורות – קולנוע זהב",
  previewLayout: "section-testimonials-page-07",
  backgroundColor: "#09090b",
  minHeight: "1500px",
  thumbnail: IMG.abstract,
  keywords: ["ביקורות","reviews","wix"],
  nodes: buildLayoutNodes("dark" as PageLayoutKind, {
    eyebrow: 'VOICES',
    title: 'קולות\nשמכירים את העבודה',
    subtitle: 'המלצות דרמטיות.',
    cta: 'הקשיבו ללקוחות',
    image: IMG.abstract,
    items: [{ title: '״שירות מדהים״', copy: 'חזרנו לקוחות קבועים.' }, { title: '״מהיר ומדויק״', copy: 'הכול בזמן.' }, { title: '״מקצועי״', copy: 'הרגשנו בידיים טובות.' }, { title: '״מומלץ״', copy: 'כבר שלחנו חברים.' }, { title: '״שווה כל שקל״', copy: 'ראינו תוצאה.' }, { title: '״יחס אישי״', copy: 'לא עוד מספר.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page08 = makePageSection({
  id: "section-testimonials-page-08",
  category: "testimonials",
  title: "ביקורות – לייפסטייל ורוד",
  previewLayout: "section-testimonials-page-08",
  backgroundColor: "#fde8e4",
  minHeight: "1520px",
  thumbnail: IMG.wellness,
  keywords: ["ביקורות","reviews","wix"],
  nodes: buildLayoutNodes("lifestyle" as PageLayoutKind, {
    eyebrow: 'KIND WORDS',
    title: 'מילים חמות\nמלקוחות אמיתיים',
    subtitle: 'טון רך להמלצות שירות.',
    cta: 'קראו המלצה',
    image: IMG.wellness,
    items: [{ title: 'לפני', copy: 'בלגן וכלים רבים.', meta: '01' }, { title: 'במהלך', copy: 'ליווי צמוד.', meta: '02' }, { title: 'אחרי', copy: 'סדר ותוצאות.', meta: '03' }, { title: 'המלצה', copy: 'ממליצים הלאה.', meta: '04' }, { title: 'חזרה', copy: 'עובדים שוב.', meta: '05' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page09 = makePageSection({
  id: "section-testimonials-page-09",
  category: "testimonials",
  title: "ביקורות – רשימה ירוקה",
  previewLayout: "section-testimonials-page-09",
  backgroundColor: "#f0faf4",
  minHeight: "1450px",
  thumbnail: IMG.portrait,
  keywords: ["ביקורות","reviews","wix"],
  nodes: buildLayoutNodes("listMedia" as PageLayoutKind, {
    eyebrow: 'QUOTES',
    title: 'ציטוטים\nנבחרים',
    subtitle: 'רשימת המלצות לצד דיוקן.',
    cta: 'עוד ציטוטים',
    image: IMG.portrait,
    items: [{ title: '״שירות מדהים״', copy: 'חזרנו לקוחות קבועים.' }, { title: '״מהיר ומדויק״', copy: 'הכול בזמן.' }, { title: '״מקצועי״', copy: 'הרגשנו בידיים טובות.' }, { title: '״מומלץ״', copy: 'כבר שלחנו חברים.' }, { title: '״שווה כל שקל״', copy: 'ראינו תוצאה.' }, { title: '״יחס אישי״', copy: 'לא עוד מספר.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page10 = makePageSection({
  id: "section-testimonials-page-10",
  category: "testimonials",
  title: "ביקורות – טופס כתום",
  previewLayout: "section-testimonials-page-10",
  backgroundColor: "#fff7ed",
  minHeight: "1450px",
  thumbnail: IMG.team,
  keywords: ["ביקורות","reviews","wix"],
  nodes: buildLayoutNodes("ctaForm" as PageLayoutKind, {
    eyebrow: 'SHARE',
    title: 'החוויה שלכם\nחשובה לנו',
    subtitle: 'טופס ביקורת כתום.',
    cta: 'כתבו ביקורת',
    image: IMG.team,
    items: [{ title: 'לפני', copy: 'בלגן וכלים רבים.', meta: '01' }, { title: 'במהלך', copy: 'ליווי צמוד.', meta: '02' }, { title: 'אחרי', copy: 'סדר ותוצאות.', meta: '03' }, { title: 'המלצה', copy: 'ממליצים הלאה.', meta: '04' }, { title: 'חזרה', copy: 'עובדים שוב.', meta: '05' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

export const TESTIMONIALS_PAGE_SHOWCASE_SECTIONS: VisualLibrarySectionTemplate[] = [
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
