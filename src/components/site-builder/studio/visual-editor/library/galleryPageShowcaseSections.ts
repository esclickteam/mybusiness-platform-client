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
  title: "גלריה – כחול עסקי",
  previewLayout: "section-gallery-page-01",
  backgroundColor: "#ffffff",
  minHeight: "1600px",
  thumbnail: IMG.architecture,
  keywords: ["גלריה","gallery","wix"],
  nodes: buildLayoutNodes("split" as PageLayoutKind, {
    eyebrow: 'GALLERY',
    title: 'עבודות\nשמספרות סיפור',
    subtitle: 'גלריה עם נוכחות כחולה חדה.',
    cta: 'לכל העבודות',
    image: IMG.architecture,
    items: [{ title: 'פרויקט מגורים', copy: 'חללים חמים ומדויקים.' }, { title: 'מסחרי', copy: 'נוכחות רחוב חזקה.' }, { title: 'מותג', copy: 'שפה ויזואלית עקבית.' }, { title: 'אירוע', copy: 'רגעים שנבחרו.' }, { title: 'מוצר', copy: 'צילום שמוכר.' }, { title: 'דיגיטל', copy: 'ממשקים נקיים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page02 = makePageSection({
  id: "section-gallery-page-02",
  category: "gallery",
  title: "גלריה – Editorial חם",
  previewLayout: "section-gallery-page-02",
  backgroundColor: "#f7f1ea",
  minHeight: "1500px",
  thumbnail: IMG.interior,
  keywords: ["גלריה","gallery","wix"],
  nodes: buildLayoutNodes("center" as PageLayoutKind, {
    eyebrow: 'PORTFOLIO',
    title: 'מבחר נבחר\nמהסטודיו',
    subtitle: 'תצוגה מרכזית רגועה.',
    cta: 'צפו בגלריה',
    image: IMG.interior,
    items: [{ title: 'אור', copy: 'קומפוזיציה בהירה.' }, { title: 'צל', copy: 'דרמה מבוקרת.' }, { title: 'טקסטורה', copy: 'חומרים אמיתיים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page03 = makePageSection({
  id: "section-gallery-page-03",
  category: "gallery",
  title: "גלריה – מגזין שחור",
  previewLayout: "section-gallery-page-03",
  backgroundColor: "#ffffff",
  minHeight: "1550px",
  thumbnail: IMG.fashion,
  keywords: ["גלריה","gallery","wix"],
  nodes: buildLayoutNodes("magazine" as PageLayoutKind, {
    eyebrow: 'SHOWCASE',
    title: 'רגעים\nשנבחרו בקפידה',
    subtitle: 'פריסת קולאז׳ נועזת.',
    cta: 'גלו פרויקט',
    image: IMG.fashion,
    items: [{ title: '01 נבחר', copy: 'עבודת דגל.' }, { title: '02 חדש', copy: 'מהסטודיו.' }, { title: '03 אהוב', copy: 'הכי נצפה.' }, { title: '04 פרטי', copy: 'פרויקט סגור.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page04 = makePageSection({
  id: "section-gallery-page-04",
  category: "gallery",
  title: "גלריה – כרטיסים צבעוניים",
  previewLayout: "section-gallery-page-04",
  backgroundColor: "#eef6ff",
  minHeight: "1500px",
  thumbnail: IMG.workspace,
  keywords: ["גלריה","gallery","wix"],
  nodes: buildLayoutNodes("cards" as PageLayoutKind, {
    eyebrow: 'PROJECTS',
    title: 'שישה פרויקטים\nבצבעים שונים',
    subtitle: 'כל כרטיס עם מבטא צבע אחר.',
    cta: 'פתחו פרויקט',
    image: IMG.workspace,
    items: [{ title: 'רעיון', copy: 'סקיצה ראשונה.', meta: '01' }, { title: 'פיתוח', copy: 'עיצוב מלא.', meta: '02' }, { title: 'צילום', copy: 'הפקה.', meta: '03' }, { title: 'עריכה', copy: 'סלקציה.', meta: '04' }, { title: 'פרסום', copy: 'יציאה החוצה.', meta: '05' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page05 = makePageSection({
  id: "section-gallery-page-05",
  category: "gallery",
  title: "גלריה – ציר סגול",
  previewLayout: "section-gallery-page-05",
  backgroundColor: "#f6f4ff",
  minHeight: "1580px",
  thumbnail: IMG.construction,
  keywords: ["גלריה","gallery","wix"],
  nodes: buildLayoutNodes("timeline" as PageLayoutKind, {
    eyebrow: 'JOURNEY',
    title: 'מהרעיון\nלתוצאה',
    subtitle: 'גלריה כמסע יצירה.',
    cta: 'התחילו פרויקט',
    image: IMG.construction,
    items: [{ title: 'פרויקט מגורים', copy: 'חללים חמים ומדויקים.' }, { title: 'מסחרי', copy: 'נוכחות רחוב חזקה.' }, { title: 'מותג', copy: 'שפה ויזואלית עקבית.' }, { title: 'אירוע', copy: 'רגעים שנבחרו.' }, { title: 'מוצר', copy: 'צילום שמוכר.' }, { title: 'דיגיטל', copy: 'ממשקים נקיים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page06 = makePageSection({
  id: "section-gallery-page-06",
  category: "gallery",
  title: "גלריה – לוח מספרים",
  previewLayout: "section-gallery-page-06",
  backgroundColor: "#111827",
  minHeight: "1480px",
  thumbnail: IMG.abstract,
  keywords: ["גלריה","gallery","wix"],
  nodes: buildLayoutNodes("stats" as PageLayoutKind, {
    eyebrow: 'HIGHLIGHTS',
    title: 'העבודות\nשמדברות הכי חזק',
    subtitle: 'מספרים על רקע כהה.',
    cta: 'ראו עוד',
    image: IMG.abstract,
    items: [{ title: 'אור', copy: 'קומפוזיציה בהירה.' }, { title: 'צל', copy: 'דרמה מבוקרת.' }, { title: 'טקסטורה', copy: 'חומרים אמיתיים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page07 = makePageSection({
  id: "section-gallery-page-07",
  category: "gallery",
  title: "גלריה – קולנוע זהב",
  previewLayout: "section-gallery-page-07",
  backgroundColor: "#09090b",
  minHeight: "1500px",
  thumbnail: IMG.beauty,
  keywords: ["גלריה","gallery","wix"],
  nodes: buildLayoutNodes("dark" as PageLayoutKind, {
    eyebrow: 'DARK GALLERY',
    title: 'ויזואליות\nדרמטית',
    subtitle: 'שחור-זהב לגלריית פרימיום.',
    cta: 'היכנסו לגלריה',
    image: IMG.beauty,
    items: [{ title: '01 נבחר', copy: 'עבודת דגל.' }, { title: '02 חדש', copy: 'מהסטודיו.' }, { title: '03 אהוב', copy: 'הכי נצפה.' }, { title: '04 פרטי', copy: 'פרויקט סגור.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page08 = makePageSection({
  id: "section-gallery-page-08",
  category: "gallery",
  title: "גלריה – לייפסטייל ורוד",
  previewLayout: "section-gallery-page-08",
  backgroundColor: "#fde8e4",
  minHeight: "1520px",
  thumbnail: IMG.event,
  keywords: ["גלריה","gallery","wix"],
  nodes: buildLayoutNodes("lifestyle" as PageLayoutKind, {
    eyebrow: 'MOOD',
    title: 'אווירה\nשנשארת בזיכרון',
    subtitle: 'גלריה רכה ומזמינה.',
    cta: 'שמרו השראה',
    image: IMG.event,
    items: [{ title: 'רעיון', copy: 'סקיצה ראשונה.', meta: '01' }, { title: 'פיתוח', copy: 'עיצוב מלא.', meta: '02' }, { title: 'צילום', copy: 'הפקה.', meta: '03' }, { title: 'עריכה', copy: 'סלקציה.', meta: '04' }, { title: 'פרסום', copy: 'יציאה החוצה.', meta: '05' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page09 = makePageSection({
  id: "section-gallery-page-09",
  category: "gallery",
  title: "גלריה – רשימה ירוקה",
  previewLayout: "section-gallery-page-09",
  backgroundColor: "#f0faf4",
  minHeight: "1450px",
  thumbnail: IMG.nature,
  keywords: ["גלריה","gallery","wix"],
  nodes: buildLayoutNodes("listMedia" as PageLayoutKind, {
    eyebrow: 'SELECTED',
    title: 'פרויקטים\nנבחרים',
    subtitle: 'רשימה לצד מדיה גדולה.',
    cta: 'צפו בפרטים',
    image: IMG.nature,
    items: [{ title: 'פרויקט מגורים', copy: 'חללים חמים ומדויקים.' }, { title: 'מסחרי', copy: 'נוכחות רחוב חזקה.' }, { title: 'מותג', copy: 'שפה ויזואלית עקבית.' }, { title: 'אירוע', copy: 'רגעים שנבחרו.' }, { title: 'מוצר', copy: 'צילום שמוכר.' }, { title: 'דיגיטל', copy: 'ממשקים נקיים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page10 = makePageSection({
  id: "section-gallery-page-10",
  category: "gallery",
  title: "גלריה – טופס כתום",
  previewLayout: "section-gallery-page-10",
  backgroundColor: "#fff7ed",
  minHeight: "1450px",
  thumbnail: IMG.travel,
  keywords: ["גלריה","gallery","wix"],
  nodes: buildLayoutNodes("ctaForm" as PageLayoutKind, {
    eyebrow: 'COLLABORATE',
    title: 'רוצים פרויקט\nכזה?',
    subtitle: 'גלריה שמסתיימת בטופס כתום.',
    cta: 'דברו איתנו',
    secondaryCta: 'שלחו רעיון',
    image: IMG.travel,
    items: [{ title: 'אור', copy: 'קומפוזיציה בהירה.' }, { title: 'צל', copy: 'דרמה מבוקרת.' }, { title: 'טקסטורה', copy: 'חומרים אמיתיים.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
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
