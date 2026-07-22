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
  title: "נחיתה – כחול עסקי",
  previewLayout: "section-landing-page-01",
  backgroundColor: "#ffffff",
  minHeight: "1600px",
  thumbnail: IMG.product,
  keywords: ["נחיתה","landing","wix"],
  nodes: buildLayoutNodes("split" as PageLayoutKind, {
    eyebrow: 'LANDING',
    title: 'הצעה אחת\nשאי אפשר לפספס',
    subtitle: 'נחיתה כחולה ממוקדת המרה.',
    cta: 'להרשמה',
    secondaryCta: 'למידע',
    image: IMG.product,
    items: [{ title: 'הטבה', copy: 'מחיר מוגבל.' }, { title: 'בונוס', copy: 'מתנה בהרשמה.' }, { title: 'אחריות', copy: 'בלי סיכון.' }, { title: 'מהיר', copy: 'התחלה מיידית.' }, { title: 'פשוט', copy: 'שלושה קליקים.' }, { title: 'תוצאה', copy: 'רואים הבדל.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page02 = makePageSection({
  id: "section-landing-page-02",
  category: "promote",
  title: "נחיתה – Editorial חם",
  previewLayout: "section-landing-page-02",
  backgroundColor: "#f7f1ea",
  minHeight: "1500px",
  thumbnail: IMG.tech,
  keywords: ["נחיתה","landing","wix"],
  nodes: buildLayoutNodes("center" as PageLayoutKind, {
    eyebrow: 'CAMPAIGN',
    title: 'השקה ממוקדת\nשמובילה לפעולה',
    subtitle: 'מינימום רעש, מקסימום CTA.',
    cta: 'הצטרפו עכשיו',
    image: IMG.tech,
    items: [{ title: 'לחצו', copy: 'בוחרים מסלול.', meta: '01' }, { title: 'נרשמים', copy: 'משאירים פרטים.', meta: '02' }, { title: 'מקבלים', copy: 'הגישה נפתחת.', meta: '03' }, { title: 'מתחילים', copy: 'עובדים.', meta: '04' }, { title: 'צומחים', copy: 'מודדים.', meta: '05' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page03 = makePageSection({
  id: "section-landing-page-03",
  category: "promote",
  title: "נחיתה – מגזין שחור",
  previewLayout: "section-landing-page-03",
  backgroundColor: "#ffffff",
  minHeight: "1550px",
  thumbnail: IMG.fashion,
  keywords: ["נחיתה","landing","wix"],
  nodes: buildLayoutNodes("magazine" as PageLayoutKind, {
    eyebrow: 'OFFER',
    title: 'מבצע מוגבל\nבזמן',
    subtitle: 'סיפור ויזואלי חד סביב ההצעה.',
    cta: 'מימוש ההטבה',
    image: IMG.fashion,
    items: [{ title: 'הטבה', copy: 'מחיר מוגבל.' }, { title: 'בונוס', copy: 'מתנה בהרשמה.' }, { title: 'אחריות', copy: 'בלי סיכון.' }, { title: 'מהיר', copy: 'התחלה מיידית.' }, { title: 'פשוט', copy: 'שלושה קליקים.' }, { title: 'תוצאה', copy: 'רואים הבדל.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page04 = makePageSection({
  id: "section-landing-page-04",
  category: "promote",
  title: "נחיתה – כרטיסים צבעוניים",
  previewLayout: "section-landing-page-04",
  backgroundColor: "#eef6ff",
  minHeight: "1500px",
  thumbnail: IMG.ecommerce,
  keywords: ["נחיתה","landing","wix"],
  nodes: buildLayoutNodes("cards" as PageLayoutKind, {
    eyebrow: 'BENEFITS',
    title: 'למה זה\nמשתלם עכשיו',
    subtitle: 'יתרונות בצבעים חיים.',
    cta: 'אני בפנים',
    image: IMG.ecommerce,
    items: [{ title: 'לחצו', copy: 'בוחרים מסלול.', meta: '01' }, { title: 'נרשמים', copy: 'משאירים פרטים.', meta: '02' }, { title: 'מקבלים', copy: 'הגישה נפתחת.', meta: '03' }, { title: 'מתחילים', copy: 'עובדים.', meta: '04' }, { title: 'צומחים', copy: 'מודדים.', meta: '05' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page05 = makePageSection({
  id: "section-landing-page-05",
  category: "promote",
  title: "נחיתה – ציר סגול",
  previewLayout: "section-landing-page-05",
  backgroundColor: "#f6f4ff",
  minHeight: "1580px",
  thumbnail: IMG.event,
  keywords: ["נחיתה","landing","wix"],
  nodes: buildLayoutNodes("timeline" as PageLayoutKind, {
    eyebrow: 'STEPS',
    title: 'שלושה צעדים\nלהטבה',
    subtitle: 'מסע קצר עד להמרה.',
    cta: 'התחילו',
    image: IMG.event,
    items: [{ title: 'הטבה', copy: 'מחיר מוגבל.' }, { title: 'בונוס', copy: 'מתנה בהרשמה.' }, { title: 'אחריות', copy: 'בלי סיכון.' }, { title: 'מהיר', copy: 'התחלה מיידית.' }, { title: 'פשוט', copy: 'שלושה קליקים.' }, { title: 'תוצאה', copy: 'רואים הבדל.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page06 = makePageSection({
  id: "section-landing-page-06",
  category: "promote",
  title: "נחיתה – לוח מספרים",
  previewLayout: "section-landing-page-06",
  backgroundColor: "#111827",
  minHeight: "1480px",
  thumbnail: IMG.finance,
  keywords: ["נחיתה","landing","wix"],
  nodes: buildLayoutNodes("stats" as PageLayoutKind, {
    eyebrow: 'PROOF',
    title: 'המספרים\nמאחורי ההצעה',
    subtitle: 'הוכחות חברתיות על רקע כהה.',
    cta: 'נסו בלי סיכון',
    image: IMG.finance,
    items: [{ title: 'לחצו', copy: 'בוחרים מסלול.', meta: '01' }, { title: 'נרשמים', copy: 'משאירים פרטים.', meta: '02' }, { title: 'מקבלים', copy: 'הגישה נפתחת.', meta: '03' }, { title: 'מתחילים', copy: 'עובדים.', meta: '04' }, { title: 'צומחים', copy: 'מודדים.', meta: '05' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page07 = makePageSection({
  id: "section-landing-page-07",
  category: "promote",
  title: "נחיתה – קולנוע זהב",
  previewLayout: "section-landing-page-07",
  backgroundColor: "#09090b",
  minHeight: "1500px",
  thumbnail: IMG.abstract,
  keywords: ["נחיתה","landing","wix"],
  nodes: buildLayoutNodes("dark" as PageLayoutKind, {
    eyebrow: 'EXCLUSIVE',
    title: 'גישה מוקדמת\nלחברים בלבד',
    subtitle: 'תחושת בלעדיות שחורה-זהב.',
    cta: 'בקשו גישה',
    image: IMG.abstract,
    items: [{ title: 'הטבה', copy: 'מחיר מוגבל.' }, { title: 'בונוס', copy: 'מתנה בהרשמה.' }, { title: 'אחריות', copy: 'בלי סיכון.' }, { title: 'מהיר', copy: 'התחלה מיידית.' }, { title: 'פשוט', copy: 'שלושה קליקים.' }, { title: 'תוצאה', copy: 'רואים הבדל.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page08 = makePageSection({
  id: "section-landing-page-08",
  category: "promote",
  title: "נחיתה – לייפסטייל ורוד",
  previewLayout: "section-landing-page-08",
  backgroundColor: "#fde8e4",
  minHeight: "1520px",
  thumbnail: IMG.wellness,
  keywords: ["נחיתה","landing","wix"],
  nodes: buildLayoutNodes("lifestyle" as PageLayoutKind, {
    eyebrow: 'SOFT SELL',
    title: 'הזמנה\nבלי לחץ',
    subtitle: 'נחיתה רגועה למותגי לייפסטייל.',
    cta: 'שמרו מקום',
    image: IMG.wellness,
    items: [{ title: 'לחצו', copy: 'בוחרים מסלול.', meta: '01' }, { title: 'נרשמים', copy: 'משאירים פרטים.', meta: '02' }, { title: 'מקבלים', copy: 'הגישה נפתחת.', meta: '03' }, { title: 'מתחילים', copy: 'עובדים.', meta: '04' }, { title: 'צומחים', copy: 'מודדים.', meta: '05' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page09 = makePageSection({
  id: "section-landing-page-09",
  category: "promote",
  title: "נחיתה – רשימה ירוקה",
  previewLayout: "section-landing-page-09",
  backgroundColor: "#f0faf4",
  minHeight: "1450px",
  thumbnail: IMG.product,
  keywords: ["נחיתה","landing","wix"],
  nodes: buildLayoutNodes("listMedia" as PageLayoutKind, {
    eyebrow: 'INCLUDED',
    title: 'מה מקבלים\nבחבילה',
    subtitle: 'תכולה ברורה לצד תמונה.',
    cta: 'לקנייה',
    image: IMG.product,
    items: [{ title: 'הטבה', copy: 'מחיר מוגבל.' }, { title: 'בונוס', copy: 'מתנה בהרשמה.' }, { title: 'אחריות', copy: 'בלי סיכון.' }, { title: 'מהיר', copy: 'התחלה מיידית.' }, { title: 'פשוט', copy: 'שלושה קליקים.' }, { title: 'תוצאה', copy: 'רואים הבדל.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page10 = makePageSection({
  id: "section-landing-page-10",
  category: "promote",
  title: "נחיתה – טופס כתום",
  previewLayout: "section-landing-page-10",
  backgroundColor: "#fff7ed",
  minHeight: "1450px",
  thumbnail: IMG.tech,
  keywords: ["נחיתה","landing","wix"],
  nodes: buildLayoutNodes("ctaForm" as PageLayoutKind, {
    eyebrow: 'LEAD FORM',
    title: 'השאירו פרטים\nוקבלו גישה',
    subtitle: 'טופס לידים כתום ודומיננטי.',
    cta: 'שלחו',
    secondaryCta: 'חזרו אליי',
    image: IMG.tech,
    items: [{ title: 'לחצו', copy: 'בוחרים מסלול.', meta: '01' }, { title: 'נרשמים', copy: 'משאירים פרטים.', meta: '02' }, { title: 'מקבלים', copy: 'הגישה נפתחת.', meta: '03' }, { title: 'מתחילים', copy: 'עובדים.', meta: '04' }, { title: 'צומחים', copy: 'מודדים.', meta: '05' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
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
