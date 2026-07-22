import { VISUAL_LIBRARY_IMAGES as IMG } from "./libraryAssets";
import type { VisualLibrarySectionTemplate } from "./visualLibraryTypes";
import {
  buildLayoutNodes,
  makePageSection,
  type PageLayoutKind,
} from "./pageShowcaseHelpers";

const page01 = makePageSection({
  id: "section-products-page-01",
  category: "commerce",
  title: "מוצרים – כחול עסקי",
  previewLayout: "section-products-page-01",
  backgroundColor: "#ffffff",
  minHeight: "1600px",
  thumbnail: IMG.ecommerce,
  keywords: ["מוצרים","products","wix"],
  nodes: buildLayoutNodes("split" as PageLayoutKind, {
    eyebrow: 'SHOP',
    title: 'מוצרים\nשנבחרו בקפידה',
    subtitle: 'חנות כחולה עם הדגשת מוצר.',
    cta: 'לקנייה',
    secondaryCta: 'לכל המוצרים',
    image: IMG.ecommerce,
    items: [{ title: 'חדש', copy: 'מהמדף עכשיו.' }, { title: 'נמכר', copy: 'הכי מבוקש.' }, { title: 'מוגבל', copy: 'מלאי קטן.' }, { title: 'סט', copy: 'חיסכון בחבילה.' }, { title: 'מתנה', copy: 'אריזה מוכנה.' }, { title: 'דיגיטלי', copy: 'הורדה מיידית.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page02 = makePageSection({
  id: "section-products-page-02",
  category: "commerce",
  title: "מוצרים – Editorial חם",
  previewLayout: "section-products-page-02",
  backgroundColor: "#f7f1ea",
  minHeight: "1500px",
  thumbnail: IMG.product,
  keywords: ["מוצרים","products","wix"],
  nodes: buildLayoutNodes("center" as PageLayoutKind, {
    eyebrow: 'COLLECTION',
    title: 'הקולקציה\nהחדשה כאן',
    subtitle: 'עמוד מוצרים רגוע ומדויק.',
    cta: 'גלו קולקציה',
    image: IMG.product,
    items: [{ title: 'בחירה', copy: 'מוצר אחד.', meta: '01' }, { title: 'פרטים', copy: 'מידות וצבע.', meta: '02' }, { title: 'סל', copy: 'מוסיפים.', meta: '03' }, { title: 'תשלום', copy: 'מאובטח.', meta: '04' }, { title: 'משלוח', copy: 'עד הבית.', meta: '05' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page03 = makePageSection({
  id: "section-products-page-03",
  category: "commerce",
  title: "מוצרים – מגזין שחור",
  previewLayout: "section-products-page-03",
  backgroundColor: "#ffffff",
  minHeight: "1550px",
  thumbnail: IMG.fashion,
  keywords: ["מוצרים","products","wix"],
  nodes: buildLayoutNodes("magazine" as PageLayoutKind, {
    eyebrow: 'CURATED',
    title: 'בחירות\nשל המותג',
    subtitle: 'תצוגת מוצרים editorial.',
    cta: 'הוסיפו לסל',
    image: IMG.fashion,
    items: [{ title: 'חדש', copy: 'מהמדף עכשיו.' }, { title: 'נמכר', copy: 'הכי מבוקש.' }, { title: 'מוגבל', copy: 'מלאי קטן.' }, { title: 'סט', copy: 'חיסכון בחבילה.' }, { title: 'מתנה', copy: 'אריזה מוכנה.' }, { title: 'דיגיטלי', copy: 'הורדה מיידית.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page04 = makePageSection({
  id: "section-products-page-04",
  category: "commerce",
  title: "מוצרים – כרטיסים צבעוניים",
  previewLayout: "section-products-page-04",
  backgroundColor: "#eef6ff",
  minHeight: "1500px",
  thumbnail: IMG.skincare,
  keywords: ["מוצרים","products","wix"],
  nodes: buildLayoutNodes("cards" as PageLayoutKind, {
    eyebrow: 'CATALOG',
    title: 'שישה מוצרים\nבצבעים שונים',
    subtitle: 'רשת מוצרים חיה.',
    cta: 'פתחו חנות',
    image: IMG.skincare,
    items: [{ title: 'בחירה', copy: 'מוצר אחד.', meta: '01' }, { title: 'פרטים', copy: 'מידות וצבע.', meta: '02' }, { title: 'סל', copy: 'מוסיפים.', meta: '03' }, { title: 'תשלום', copy: 'מאובטח.', meta: '04' }, { title: 'משלוח', copy: 'עד הבית.', meta: '05' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page05 = makePageSection({
  id: "section-products-page-05",
  category: "commerce",
  title: "מוצרים – ציר סגול",
  previewLayout: "section-products-page-05",
  backgroundColor: "#f6f4ff",
  minHeight: "1580px",
  thumbnail: IMG.ecommerce,
  keywords: ["מוצרים","products","wix"],
  nodes: buildLayoutNodes("timeline" as PageLayoutKind, {
    eyebrow: 'FROM IDEA',
    title: 'מהרעיון\nלמוצר מדף',
    subtitle: 'סיפור מוצר כתהליך.',
    cta: 'הכירו את הקו',
    image: IMG.ecommerce,
    items: [{ title: 'חדש', copy: 'מהמדף עכשיו.' }, { title: 'נמכר', copy: 'הכי מבוקש.' }, { title: 'מוגבל', copy: 'מלאי קטן.' }, { title: 'סט', copy: 'חיסכון בחבילה.' }, { title: 'מתנה', copy: 'אריזה מוכנה.' }, { title: 'דיגיטלי', copy: 'הורדה מיידית.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page06 = makePageSection({
  id: "section-products-page-06",
  category: "commerce",
  title: "מוצרים – לוח מספרים",
  previewLayout: "section-products-page-06",
  backgroundColor: "#111827",
  minHeight: "1480px",
  thumbnail: IMG.product,
  keywords: ["מוצרים","products","wix"],
  nodes: buildLayoutNodes("stats" as PageLayoutKind, {
    eyebrow: 'BEST SELLERS',
    title: 'הנמכרים\nביותר',
    subtitle: 'מספרי מכירות על רקע כהה.',
    cta: 'קנו עכשיו',
    image: IMG.product,
    items: [{ title: 'בחירה', copy: 'מוצר אחד.', meta: '01' }, { title: 'פרטים', copy: 'מידות וצבע.', meta: '02' }, { title: 'סל', copy: 'מוסיפים.', meta: '03' }, { title: 'תשלום', copy: 'מאובטח.', meta: '04' }, { title: 'משלוח', copy: 'עד הבית.', meta: '05' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page07 = makePageSection({
  id: "section-products-page-07",
  category: "commerce",
  title: "מוצרים – קולנוע זהב",
  previewLayout: "section-products-page-07",
  backgroundColor: "#09090b",
  minHeight: "1500px",
  thumbnail: IMG.fashion,
  keywords: ["מוצרים","products","wix"],
  nodes: buildLayoutNodes("dark" as PageLayoutKind, {
    eyebrow: 'LUXE',
    title: 'קולקציית\nפרימיום',
    subtitle: 'קנייה יוקרתית.',
    cta: 'גלו פרימיום',
    image: IMG.fashion,
    items: [{ title: 'חדש', copy: 'מהמדף עכשיו.' }, { title: 'נמכר', copy: 'הכי מבוקש.' }, { title: 'מוגבל', copy: 'מלאי קטן.' }, { title: 'סט', copy: 'חיסכון בחבילה.' }, { title: 'מתנה', copy: 'אריזה מוכנה.' }, { title: 'דיגיטלי', copy: 'הורדה מיידית.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page08 = makePageSection({
  id: "section-products-page-08",
  category: "commerce",
  title: "מוצרים – לייפסטייל ורוד",
  previewLayout: "section-products-page-08",
  backgroundColor: "#fde8e4",
  minHeight: "1520px",
  thumbnail: IMG.skincare,
  keywords: ["מוצרים","products","wix"],
  nodes: buildLayoutNodes("lifestyle" as PageLayoutKind, {
    eyebrow: 'DAILY',
    title: 'מוצרים\nלשגרה יפה',
    subtitle: 'אווירה רכה למוצרי יום-יום.',
    cta: 'הוסיפו לסל',
    image: IMG.skincare,
    items: [{ title: 'בחירה', copy: 'מוצר אחד.', meta: '01' }, { title: 'פרטים', copy: 'מידות וצבע.', meta: '02' }, { title: 'סל', copy: 'מוסיפים.', meta: '03' }, { title: 'תשלום', copy: 'מאובטח.', meta: '04' }, { title: 'משלוח', copy: 'עד הבית.', meta: '05' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page09 = makePageSection({
  id: "section-products-page-09",
  category: "commerce",
  title: "מוצרים – רשימה ירוקה",
  previewLayout: "section-products-page-09",
  backgroundColor: "#f0faf4",
  minHeight: "1450px",
  thumbnail: IMG.ecommerce,
  keywords: ["מוצרים","products","wix"],
  nodes: buildLayoutNodes("listMedia" as PageLayoutKind, {
    eyebrow: 'PICKS',
    title: 'המלצות\nהשבוע',
    subtitle: 'רשימת מוצרים לצד מדיה.',
    cta: 'לרכישה',
    image: IMG.ecommerce,
    items: [{ title: 'חדש', copy: 'מהמדף עכשיו.' }, { title: 'נמכר', copy: 'הכי מבוקש.' }, { title: 'מוגבל', copy: 'מלאי קטן.' }, { title: 'סט', copy: 'חיסכון בחבילה.' }, { title: 'מתנה', copy: 'אריזה מוכנה.' }, { title: 'דיגיטלי', copy: 'הורדה מיידית.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page10 = makePageSection({
  id: "section-products-page-10",
  category: "commerce",
  title: "מוצרים – טופס כתום",
  previewLayout: "section-products-page-10",
  backgroundColor: "#fff7ed",
  minHeight: "1450px",
  thumbnail: IMG.product,
  keywords: ["מוצרים","products","wix"],
  nodes: buildLayoutNodes("ctaForm" as PageLayoutKind, {
    eyebrow: 'ORDER',
    title: 'הזמינו\nבכמה קליקים',
    subtitle: 'טופס הזמנה כתום ומהיר.',
    cta: 'שלחו הזמנה',
    image: IMG.product,
    items: [{ title: 'בחירה', copy: 'מוצר אחד.', meta: '01' }, { title: 'פרטים', copy: 'מידות וצבע.', meta: '02' }, { title: 'סל', copy: 'מוסיפים.', meta: '03' }, { title: 'תשלום', copy: 'מאובטח.', meta: '04' }, { title: 'משלוח', copy: 'עד הבית.', meta: '05' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

export const PRODUCTS_PAGE_SHOWCASE_SECTIONS: VisualLibrarySectionTemplate[] = [
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
