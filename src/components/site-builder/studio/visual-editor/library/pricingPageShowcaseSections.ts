import { VISUAL_LIBRARY_IMAGES as IMG } from "./libraryAssets";
import type { VisualLibrarySectionTemplate } from "./visualLibraryTypes";
import {
  buildLayoutNodes,
  makePageSection,
  type PageLayoutKind,
} from "./pageShowcaseHelpers";

const page01 = makePageSection({
  id: "section-pricing-page-01",
  category: "pricing",
  title: "תמחור – כחול עסקי",
  previewLayout: "section-pricing-page-01",
  backgroundColor: "#ffffff",
  minHeight: "1600px",
  thumbnail: IMG.finance,
  keywords: ["תמחור","pricing","wix"],
  nodes: buildLayoutNodes("split" as PageLayoutKind, {
    eyebrow: 'PRICING',
    title: 'מחירים\nשקופים ופשוטים',
    subtitle: 'השוואת חבילות כחולה.',
    cta: 'בחרו חבילה',
    secondaryCta: 'שאלו אותנו',
    image: IMG.finance,
    items: [{ title: 'Basic', copy: 'להתחלה.' }, { title: 'Plus', copy: 'לצמיחה.' }, { title: 'Pro', copy: 'לעסקים.' }, { title: 'שנתי', copy: 'חיסכון.' }, { title: 'חודשי', copy: 'גמיש.' }, { title: 'מותאם', copy: 'לפי צורך.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page02 = makePageSection({
  id: "section-pricing-page-02",
  category: "pricing",
  title: "תמחור – Editorial חם",
  previewLayout: "section-pricing-page-02",
  backgroundColor: "#f7f1ea",
  minHeight: "1500px",
  thumbnail: IMG.tech,
  keywords: ["תמחור","pricing","wix"],
  nodes: buildLayoutNodes("center" as PageLayoutKind, {
    eyebrow: 'PLANS',
    title: 'בחרו את\nהמסלול שלכם',
    subtitle: 'תמחור נקי וחם.',
    cta: 'התחילו ניסיון',
    image: IMG.tech,
    items: [{ title: 'בחירה', copy: 'מסלול.', meta: '01' }, { title: 'ניסיון', copy: '14 יום.', meta: '02' }, { title: 'הפעלה', copy: 'מיידית.', meta: '03' }, { title: 'שימוש', copy: 'כל הכלים.', meta: '04' }, { title: 'שדרוג', copy: 'בכל רגע.', meta: '05' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page03 = makePageSection({
  id: "section-pricing-page-03",
  category: "pricing",
  title: "תמחור – מגזין שחור",
  previewLayout: "section-pricing-page-03",
  backgroundColor: "#ffffff",
  minHeight: "1550px",
  thumbnail: IMG.office,
  keywords: ["תמחור","pricing","wix"],
  nodes: buildLayoutNodes("magazine" as PageLayoutKind, {
    eyebrow: 'VALUE',
    title: 'הערך\nמאחורי המחיר',
    subtitle: 'סיפור מחיר editorial.',
    cta: 'השוו מסלולים',
    image: IMG.office,
    items: [{ title: 'Basic', copy: 'להתחלה.' }, { title: 'Plus', copy: 'לצמיחה.' }, { title: 'Pro', copy: 'לעסקים.' }, { title: 'שנתי', copy: 'חיסכון.' }, { title: 'חודשי', copy: 'גמיש.' }, { title: 'מותאם', copy: 'לפי צורך.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page04 = makePageSection({
  id: "section-pricing-page-04",
  category: "pricing",
  title: "תמחור – כרטיסים צבעוניים",
  previewLayout: "section-pricing-page-04",
  backgroundColor: "#eef6ff",
  minHeight: "1500px",
  thumbnail: IMG.product,
  keywords: ["תמחור","pricing","wix"],
  nodes: buildLayoutNodes("cards" as PageLayoutKind, {
    eyebrow: 'TIERS',
    title: 'שלוש חבילות\nבצבעים חיים',
    subtitle: 'כל מסלול עם מבטא צבע.',
    cta: 'בחרו עכשיו',
    image: IMG.product,
    items: [{ title: 'בחירה', copy: 'מסלול.', meta: '01' }, { title: 'ניסיון', copy: '14 יום.', meta: '02' }, { title: 'הפעלה', copy: 'מיידית.', meta: '03' }, { title: 'שימוש', copy: 'כל הכלים.', meta: '04' }, { title: 'שדרוג', copy: 'בכל רגע.', meta: '05' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page05 = makePageSection({
  id: "section-pricing-page-05",
  category: "pricing",
  title: "תמחור – ציר סגול",
  previewLayout: "section-pricing-page-05",
  backgroundColor: "#f6f4ff",
  minHeight: "1580px",
  thumbnail: IMG.finance,
  keywords: ["תמחור","pricing","wix"],
  nodes: buildLayoutNodes("timeline" as PageLayoutKind, {
    eyebrow: 'ONBOARDING',
    title: 'מה כלול\nבכל שלב',
    subtitle: 'תמחור כמסע לקוח.',
    cta: 'הצטרפו',
    image: IMG.finance,
    items: [{ title: 'Basic', copy: 'להתחלה.' }, { title: 'Plus', copy: 'לצמיחה.' }, { title: 'Pro', copy: 'לעסקים.' }, { title: 'שנתי', copy: 'חיסכון.' }, { title: 'חודשי', copy: 'גמיש.' }, { title: 'מותאם', copy: 'לפי צורך.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page06 = makePageSection({
  id: "section-pricing-page-06",
  category: "pricing",
  title: "תמחור – לוח מספרים",
  previewLayout: "section-pricing-page-06",
  backgroundColor: "#111827",
  minHeight: "1480px",
  thumbnail: IMG.tech,
  keywords: ["תמחור","pricing","wix"],
  nodes: buildLayoutNodes("stats" as PageLayoutKind, {
    eyebrow: 'ROI',
    title: 'החזר השקעה\nשרואים',
    subtitle: 'מספרי חיסכון על רקע כהה.',
    cta: 'חשבו חיסכון',
    image: IMG.tech,
    items: [{ title: 'בחירה', copy: 'מסלול.', meta: '01' }, { title: 'ניסיון', copy: '14 יום.', meta: '02' }, { title: 'הפעלה', copy: 'מיידית.', meta: '03' }, { title: 'שימוש', copy: 'כל הכלים.', meta: '04' }, { title: 'שדרוג', copy: 'בכל רגע.', meta: '05' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page07 = makePageSection({
  id: "section-pricing-page-07",
  category: "pricing",
  title: "תמחור – קולנוע זהב",
  previewLayout: "section-pricing-page-07",
  backgroundColor: "#09090b",
  minHeight: "1500px",
  thumbnail: IMG.abstract,
  keywords: ["תמחור","pricing","wix"],
  nodes: buildLayoutNodes("dark" as PageLayoutKind, {
    eyebrow: 'PRO',
    title: 'מסלול Pro\nלעסקים רציניים',
    subtitle: 'תמחור פרימיום שחור-זהב.',
    cta: 'שדרגו ל-Pro',
    image: IMG.abstract,
    items: [{ title: 'Basic', copy: 'להתחלה.' }, { title: 'Plus', copy: 'לצמיחה.' }, { title: 'Pro', copy: 'לעסקים.' }, { title: 'שנתי', copy: 'חיסכון.' }, { title: 'חודשי', copy: 'גמיש.' }, { title: 'מותאם', copy: 'לפי צורך.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page08 = makePageSection({
  id: "section-pricing-page-08",
  category: "pricing",
  title: "תמחור – לייפסטייל ורוד",
  previewLayout: "section-pricing-page-08",
  backgroundColor: "#fde8e4",
  minHeight: "1520px",
  thumbnail: IMG.wellness,
  keywords: ["תמחור","pricing","wix"],
  nodes: buildLayoutNodes("lifestyle" as PageLayoutKind, {
    eyebrow: 'SIMPLE',
    title: 'תמחור\nבלי הפתעות',
    subtitle: 'שפה רגועה למחירים.',
    cta: 'בחרו מסלול',
    image: IMG.wellness,
    items: [{ title: 'בחירה', copy: 'מסלול.', meta: '01' }, { title: 'ניסיון', copy: '14 יום.', meta: '02' }, { title: 'הפעלה', copy: 'מיידית.', meta: '03' }, { title: 'שימוש', copy: 'כל הכלים.', meta: '04' }, { title: 'שדרוג', copy: 'בכל רגע.', meta: '05' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page09 = makePageSection({
  id: "section-pricing-page-09",
  category: "pricing",
  title: "תמחור – רשימה ירוקה",
  previewLayout: "section-pricing-page-09",
  backgroundColor: "#f0faf4",
  minHeight: "1450px",
  thumbnail: IMG.tech,
  keywords: ["תמחור","pricing","wix"],
  nodes: buildLayoutNodes("listMedia" as PageLayoutKind, {
    eyebrow: 'COMPARE',
    title: 'השוו\nותבחרו נכון',
    subtitle: 'הבדלים ברשימה ברורה.',
    cta: 'השוואה מלאה',
    image: IMG.tech,
    items: [{ title: 'Basic', copy: 'להתחלה.' }, { title: 'Plus', copy: 'לצמיחה.' }, { title: 'Pro', copy: 'לעסקים.' }, { title: 'שנתי', copy: 'חיסכון.' }, { title: 'חודשי', copy: 'גמיש.' }, { title: 'מותאם', copy: 'לפי צורך.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page10 = makePageSection({
  id: "section-pricing-page-10",
  category: "pricing",
  title: "תמחור – טופס כתום",
  previewLayout: "section-pricing-page-10",
  backgroundColor: "#fff7ed",
  minHeight: "1450px",
  thumbnail: IMG.office,
  keywords: ["תמחור","pricing","wix"],
  nodes: buildLayoutNodes("ctaForm" as PageLayoutKind, {
    eyebrow: 'CUSTOM QUOTE',
    title: 'צריכים\nהצעה מותאמת?',
    subtitle: 'טופס הצעת מחיר כתום.',
    cta: 'בקשו הצעה',
    image: IMG.office,
    items: [{ title: 'בחירה', copy: 'מסלול.', meta: '01' }, { title: 'ניסיון', copy: '14 יום.', meta: '02' }, { title: 'הפעלה', copy: 'מיידית.', meta: '03' }, { title: 'שימוש', copy: 'כל הכלים.', meta: '04' }, { title: 'שדרוג', copy: 'בכל רגע.', meta: '05' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

export const PRICING_PAGE_SHOWCASE_SECTIONS: VisualLibrarySectionTemplate[] = [
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
