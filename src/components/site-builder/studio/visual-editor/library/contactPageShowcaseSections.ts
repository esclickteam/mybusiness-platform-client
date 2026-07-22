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
  title: "יצירת קשר – כחול עסקי",
  previewLayout: "section-contact-page-01",
  backgroundColor: "#ffffff",
  minHeight: "1600px",
  thumbnail: IMG.office,
  keywords: ["צור קשר","contact","wix"],
  nodes: buildLayoutNodes("split" as PageLayoutKind, {
    eyebrow: 'CONTACT',
    title: 'נשמח\nלשמוע מכם',
    subtitle: 'עמוד קשר כחול ומקצועי.',
    cta: 'שלחו הודעה',
    secondaryCta: 'התקשרו',
    image: IMG.office,
    items: [{ title: 'טלפון', copy: 'שיחה ישירה.' }, { title: 'מייל', copy: 'מענה כתוב.' }, { title: 'וואטסאפ', copy: 'הודעה מהירה.' }, { title: 'כתובת', copy: 'ביקור במשרד.' }, { title: 'זום', copy: 'פגישה מרחוק.' }, { title: 'טופס', copy: 'השארת פרטים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page02 = makePageSection({
  id: "section-contact-page-02",
  category: "contact",
  title: "יצירת קשר – Editorial חם",
  previewLayout: "section-contact-page-02",
  backgroundColor: "#f7f1ea",
  minHeight: "1500px",
  thumbnail: IMG.team,
  keywords: ["צור קשר","contact","wix"],
  nodes: buildLayoutNodes("center" as PageLayoutKind, {
    eyebrow: 'LET\'S TALK',
    title: 'השיחה הבאה\nמתחילה כאן',
    subtitle: 'פתיחה חמה ומזמינה.',
    cta: 'כתבו לנו',
    image: IMG.team,
    items: [{ title: 'מהיר', copy: 'חוזרים תוך יום.' }, { title: 'אנושי', copy: 'בלי בוטים.' }, { title: 'ברור', copy: 'בלי סיבובים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page03 = makePageSection({
  id: "section-contact-page-03",
  category: "contact",
  title: "יצירת קשר – מגזין שחור",
  previewLayout: "section-contact-page-03",
  backgroundColor: "#ffffff",
  minHeight: "1550px",
  thumbnail: IMG.workspace,
  keywords: ["צור קשר","contact","wix"],
  nodes: buildLayoutNodes("magazine" as PageLayoutKind, {
    eyebrow: 'STUDIO DESK',
    title: 'בואו נדבר\nעל הפרויקט',
    subtitle: 'פריסה שחור-לבן חדה.',
    cta: 'קבעו שיחה',
    image: IMG.workspace,
    items: [{ title: 'פנייה', copy: 'משאירים פרטים.', meta: '01' }, { title: 'אישור', copy: 'מקבלים מייל.', meta: '02' }, { title: 'שיחה', copy: 'מתאמים זמן.', meta: '03' }, { title: 'הצעה', copy: 'שולחים תוכנית.', meta: '04' }, { title: 'התחלה', copy: 'יוצאים לדרך.', meta: '05' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page04 = makePageSection({
  id: "section-contact-page-04",
  category: "contact",
  title: "יצירת קשר – כרטיסים צבעוניים",
  previewLayout: "section-contact-page-04",
  backgroundColor: "#eef6ff",
  minHeight: "1500px",
  thumbnail: IMG.tech,
  keywords: ["צור קשר","contact","wix"],
  nodes: buildLayoutNodes("cards" as PageLayoutKind, {
    eyebrow: 'CHANNELS',
    title: 'כל דרכי\nההתקשרות',
    subtitle: 'ערוצים בצבעים שונים.',
    cta: 'בחרו ערוץ',
    image: IMG.tech,
    items: [{ title: 'טלפון', copy: 'שיחה ישירה.' }, { title: 'מייל', copy: 'מענה כתוב.' }, { title: 'וואטסאפ', copy: 'הודעה מהירה.' }, { title: 'כתובת', copy: 'ביקור במשרד.' }, { title: 'זום', copy: 'פגישה מרחוק.' }, { title: 'טופס', copy: 'השארת פרטים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page05 = makePageSection({
  id: "section-contact-page-05",
  category: "contact",
  title: "יצירת קשר – ציר סגול",
  previewLayout: "section-contact-page-05",
  backgroundColor: "#f6f4ff",
  minHeight: "1580px",
  thumbnail: IMG.finance,
  keywords: ["צור קשר","contact","wix"],
  nodes: buildLayoutNodes("timeline" as PageLayoutKind, {
    eyebrow: 'NEXT STEPS',
    title: 'מה קורה\nאחרי שפונים',
    subtitle: 'שקיפות מלאה לתהליך.',
    cta: 'התחילו עכשיו',
    image: IMG.finance,
    items: [{ title: 'מהיר', copy: 'חוזרים תוך יום.' }, { title: 'אנושי', copy: 'בלי בוטים.' }, { title: 'ברור', copy: 'בלי סיבובים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page06 = makePageSection({
  id: "section-contact-page-06",
  category: "contact",
  title: "יצירת קשר – לוח מספרים",
  previewLayout: "section-contact-page-06",
  backgroundColor: "#111827",
  minHeight: "1480px",
  thumbnail: IMG.medical,
  keywords: ["צור קשר","contact","wix"],
  nodes: buildLayoutNodes("stats" as PageLayoutKind, {
    eyebrow: 'SUPPORT',
    title: 'שירות לקוחות\nשאפשר לסמוך עליו',
    subtitle: 'מדדי מענה על רקע כהה.',
    cta: 'פתחו פנייה',
    image: IMG.medical,
    items: [{ title: 'פנייה', copy: 'משאירים פרטים.', meta: '01' }, { title: 'אישור', copy: 'מקבלים מייל.', meta: '02' }, { title: 'שיחה', copy: 'מתאמים זמן.', meta: '03' }, { title: 'הצעה', copy: 'שולחים תוכנית.', meta: '04' }, { title: 'התחלה', copy: 'יוצאים לדרך.', meta: '05' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page07 = makePageSection({
  id: "section-contact-page-07",
  category: "contact",
  title: "יצירת קשר – קולנוע זהב",
  previewLayout: "section-contact-page-07",
  backgroundColor: "#09090b",
  minHeight: "1500px",
  thumbnail: IMG.abstract,
  keywords: ["צור קשר","contact","wix"],
  nodes: buildLayoutNodes("dark" as PageLayoutKind, {
    eyebrow: 'PRIVATE LINE',
    title: 'יצירת קשר\nבסגנון פרימיום',
    subtitle: 'קו פרטי למותגים יוקרתיים.',
    cta: 'השאירו פרטים',
    image: IMG.abstract,
    items: [{ title: 'טלפון', copy: 'שיחה ישירה.' }, { title: 'מייל', copy: 'מענה כתוב.' }, { title: 'וואטסאפ', copy: 'הודעה מהירה.' }, { title: 'כתובת', copy: 'ביקור במשרד.' }, { title: 'זום', copy: 'פגישה מרחוק.' }, { title: 'טופס', copy: 'השארת פרטים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page08 = makePageSection({
  id: "section-contact-page-08",
  category: "contact",
  title: "יצירת קשר – לייפסטייל ורוד",
  previewLayout: "section-contact-page-08",
  backgroundColor: "#fde8e4",
  minHeight: "1520px",
  thumbnail: IMG.hospitality,
  keywords: ["צור קשר","contact","wix"],
  nodes: buildLayoutNodes("lifestyle" as PageLayoutKind, {
    eyebrow: 'WELCOME',
    title: 'דלת פתוחה\nלשיחה אמיתית',
    subtitle: 'טון חם לעסק מקומי.',
    cta: 'שלחו הודעה',
    image: IMG.hospitality,
    items: [{ title: 'מהיר', copy: 'חוזרים תוך יום.' }, { title: 'אנושי', copy: 'בלי בוטים.' }, { title: 'ברור', copy: 'בלי סיבובים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page09 = makePageSection({
  id: "section-contact-page-09",
  category: "contact",
  title: "יצירת קשר – רשימה ירוקה",
  previewLayout: "section-contact-page-09",
  backgroundColor: "#f0faf4",
  minHeight: "1450px",
  thumbnail: IMG.architecture,
  keywords: ["צור קשר","contact","wix"],
  nodes: buildLayoutNodes("listMedia" as PageLayoutKind, {
    eyebrow: 'VISIT US',
    title: 'בואו לבקר\nאו כתבו מרחוק',
    subtitle: 'פרטי מיקום לצד מדיה.',
    cta: 'נווטו אלינו',
    image: IMG.architecture,
    items: [{ title: 'פנייה', copy: 'משאירים פרטים.', meta: '01' }, { title: 'אישור', copy: 'מקבלים מייל.', meta: '02' }, { title: 'שיחה', copy: 'מתאמים זמן.', meta: '03' }, { title: 'הצעה', copy: 'שולחים תוכנית.', meta: '04' }, { title: 'התחלה', copy: 'יוצאים לדרך.', meta: '05' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page10 = makePageSection({
  id: "section-contact-page-10",
  category: "contact",
  title: "יצירת קשר – טופס כתום",
  previewLayout: "section-contact-page-10",
  backgroundColor: "#fff7ed",
  minHeight: "1450px",
  thumbnail: IMG.office,
  keywords: ["צור קשר","contact","wix"],
  nodes: buildLayoutNodes("ctaForm" as PageLayoutKind, {
    eyebrow: 'MESSAGE',
    title: 'השאירו פרטים\nונחזור אליכם',
    subtitle: 'טופס כתום שאי אפשר לפספס.',
    cta: 'שליחה',
    secondaryCta: 'וואטסאפ',
    image: IMG.office,
    items: [{ title: 'טלפון', copy: 'שיחה ישירה.' }, { title: 'מייל', copy: 'מענה כתוב.' }, { title: 'וואטסאפ', copy: 'הודעה מהירה.' }, { title: 'כתובת', copy: 'ביקור במשרד.' }, { title: 'זום', copy: 'פגישה מרחוק.' }, { title: 'טופס', copy: 'השארת פרטים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
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
