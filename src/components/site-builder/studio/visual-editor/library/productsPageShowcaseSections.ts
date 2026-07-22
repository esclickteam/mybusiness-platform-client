import { VISUAL_LIBRARY_IMAGES as IMG } from "./libraryAssets";
import type { VisualLibrarySectionTemplate } from "./visualLibraryTypes";
import {
  buildCategoryPageNodes,
  getRecipeMeta,
  makePageSection,
} from "./pageShowcaseHelpers";

const page01 = (() => {
  const meta = getRecipeMeta("commerce", 0);
  return makePageSection({
    id: "section-products-page-01",
    category: "commerce",
    title: "מוצרים – קטלוג",
    previewLayout: "section-products-page-01",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.ecommerce,
    keywords: ["מוצרים","products","wix"],
    nodes: buildCategoryPageNodes("commerce", 0, {
      eyebrow: 'SHOP',
      title: 'מוצרים\nשנבחרו בקפידה',
      subtitle: 'מדף קטלוג עם מחירים ברורים.',
      cta: 'לקנייה',
      secondaryCta: 'לכל המוצרים',
      image: IMG.ecommerce,
      images: [IMG.ecommerce, IMG.product, IMG.fashion, IMG.skincare, IMG.beauty, IMG.kitchen, IMG.food, IMG.tech, IMG.workspace, IMG.cafe, IMG.studio, IMG.abstract],
      items: [{ title: 'חדש', copy: 'מהמדף עכשיו.' }, { title: 'נמכר', copy: 'הכי מבוקש.' }, { title: 'מוגבל', copy: 'מלאי קטן.' }, { title: 'סט', copy: 'חיסכון בחבילה.' }, { title: 'מתנה', copy: 'אריזה מוכנה.' }, { title: 'דיגיטלי', copy: 'הורדה מיידית.' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page02 = (() => {
  const meta = getRecipeMeta("commerce", 1);
  return makePageSection({
    id: "section-products-page-02",
    category: "commerce",
    title: "מוצרים – מוצר מוביל",
    previewLayout: "section-products-page-02",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.product,
    keywords: ["מוצרים","products","wix"],
    nodes: buildCategoryPageNodes("commerce", 1, {
      eyebrow: 'FEATURED',
      title: 'המוצר\nשכולם מדברים עליו',
      subtitle: 'כיסוי גדול + מדדי מכירה.',
      cta: 'הוסיפו לסל',
      image: IMG.product,
      images: [IMG.product, IMG.fashion, IMG.skincare, IMG.beauty, IMG.kitchen, IMG.food, IMG.tech, IMG.workspace, IMG.cafe, IMG.studio, IMG.abstract, IMG.ecommerce],
      items: [{ title: 'בחירה', copy: 'מוצר אחד.', meta: '01' }, { title: 'פרטים', copy: 'מידות וצבע.', meta: '02' }, { title: 'סל', copy: 'מוסיפים.', meta: '03' }, { title: 'תשלום', copy: 'מאובטח.', meta: '04' }, { title: 'משלוח', copy: 'עד הבית.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page03 = (() => {
  const meta = getRecipeMeta("commerce", 2);
  return makePageSection({
    id: "section-products-page-03",
    category: "commerce",
    title: "מוצרים – קולקציה",
    previewLayout: "section-products-page-03",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.fashion,
    keywords: ["מוצרים","products","wix"],
    nodes: buildCategoryPageNodes("commerce", 2, {
      eyebrow: 'COLLECTION',
      title: 'הקולקציה\nהחדשה כאן',
      subtitle: 'מייסון לקולקציית עונה.',
      cta: 'גלו קולקציה',
      image: IMG.fashion,
      images: [IMG.fashion, IMG.skincare, IMG.beauty, IMG.kitchen, IMG.food, IMG.tech, IMG.workspace, IMG.cafe, IMG.studio, IMG.abstract, IMG.ecommerce, IMG.product],
      items: [{ title: 'חדש', copy: 'מהמדף עכשיו.' }, { title: 'נמכר', copy: 'הכי מבוקש.' }, { title: 'מוגבל', copy: 'מלאי קטן.' }, { title: 'סט', copy: 'חיסכון בחבילה.' }, { title: 'מתנה', copy: 'אריזה מוכנה.' }, { title: 'דיגיטלי', copy: 'הורדה מיידית.' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page04 = (() => {
  const meta = getRecipeMeta("commerce", 3);
  return makePageSection({
    id: "section-products-page-04",
    category: "commerce",
    title: "מוצרים – מפרט",
    previewLayout: "section-products-page-04",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.skincare,
    keywords: ["מוצרים","products","wix"],
    nodes: buildCategoryPageNodes("commerce", 3, {
      eyebrow: 'SPECS',
      title: 'השוו מוצרים\nלפי תכונות',
      subtitle: 'מטריצת מפרט לקנייה חכמה.',
      cta: 'השוו דגמים',
      image: IMG.skincare,
      images: [IMG.skincare, IMG.beauty, IMG.kitchen, IMG.food, IMG.tech, IMG.workspace, IMG.cafe, IMG.studio, IMG.abstract, IMG.ecommerce, IMG.product, IMG.fashion],
      items: [{ title: 'בחירה', copy: 'מוצר אחד.', meta: '01' }, { title: 'פרטים', copy: 'מידות וצבע.', meta: '02' }, { title: 'סל', copy: 'מוסיפים.', meta: '03' }, { title: 'תשלום', copy: 'מאובטח.', meta: '04' }, { title: 'משלוח', copy: 'עד הבית.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page05 = (() => {
  const meta = getRecipeMeta("commerce", 4);
  return makePageSection({
    id: "section-products-page-05",
    category: "commerce",
    title: "מוצרים – מרצ׳ כהה",
    previewLayout: "section-products-page-05",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.beauty,
    keywords: ["מוצרים","products","wix"],
    nodes: buildCategoryPageNodes("commerce", 4, {
      eyebrow: 'LUXE',
      title: 'קולקציית\nפרימיום',
      subtitle: 'חנות כהה למוצרי יוקרה.',
      cta: 'גלו פרימיום',
      image: IMG.beauty,
      images: [IMG.beauty, IMG.kitchen, IMG.food, IMG.tech, IMG.workspace, IMG.cafe, IMG.studio, IMG.abstract, IMG.ecommerce, IMG.product, IMG.fashion, IMG.skincare],
      items: [{ title: 'חדש', copy: 'מהמדף עכשיו.' }, { title: 'נמכר', copy: 'הכי מבוקש.' }, { title: 'מוגבל', copy: 'מלאי קטן.' }, { title: 'סט', copy: 'חיסכון בחבילה.' }, { title: 'מתנה', copy: 'אריזה מוכנה.' }, { title: 'דיגיטלי', copy: 'הורדה מיידית.' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page06 = (() => {
  const meta = getRecipeMeta("commerce", 5);
  return makePageSection({
    id: "section-products-page-06",
    category: "commerce",
    title: "מוצרים – בוטיק",
    previewLayout: "section-products-page-06",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.kitchen,
    keywords: ["מוצרים","products","wix"],
    nodes: buildCategoryPageNodes("commerce", 5, {
      eyebrow: 'DAILY',
      title: 'מוצרים\nלשגרה יפה',
      subtitle: 'אווירה רכה למוצרי יום-יום.',
      cta: 'הוסיפו לסל',
      image: IMG.kitchen,
      images: [IMG.kitchen, IMG.food, IMG.tech, IMG.workspace, IMG.cafe, IMG.studio, IMG.abstract, IMG.ecommerce, IMG.product, IMG.fashion, IMG.skincare, IMG.beauty],
      items: [{ title: 'בחירה', copy: 'מוצר אחד.', meta: '01' }, { title: 'פרטים', copy: 'מידות וצבע.', meta: '02' }, { title: 'סל', copy: 'מוסיפים.', meta: '03' }, { title: 'תשלום', copy: 'מאובטח.', meta: '04' }, { title: 'משלוח', copy: 'עד הבית.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page07 = (() => {
  const meta = getRecipeMeta("commerce", 6);
  return makePageSection({
    id: "section-products-page-07",
    category: "commerce",
    title: "מוצרים – השוואה",
    previewLayout: "section-products-page-07",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.food,
    keywords: ["מוצרים","products","wix"],
    nodes: buildCategoryPageNodes("commerce", 6, {
      eyebrow: 'TIERS',
      title: 'בחרו את\nהחבילה הנכונה',
      subtitle: 'שלושה מסלולי מוצר.',
      cta: 'בחרו עכשיו',
      image: IMG.food,
      images: [IMG.food, IMG.tech, IMG.workspace, IMG.cafe, IMG.studio, IMG.abstract, IMG.ecommerce, IMG.product, IMG.fashion, IMG.skincare, IMG.beauty, IMG.kitchen],
      items: [{ title: 'חדש', copy: 'מהמדף עכשיו.' }, { title: 'נמכר', copy: 'הכי מבוקש.' }, { title: 'מוגבל', copy: 'מלאי קטן.' }, { title: 'סט', copy: 'חיסכון בחבילה.' }, { title: 'מתנה', copy: 'אריזה מוכנה.' }, { title: 'דיגיטלי', copy: 'הורדה מיידית.' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page08 = (() => {
  const meta = getRecipeMeta("commerce", 7);
  return makePageSection({
    id: "section-products-page-08",
    category: "commerce",
    title: "מוצרים – בסטסלרים",
    previewLayout: "section-products-page-08",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.tech,
    keywords: ["מוצרים","products","wix"],
    nodes: buildCategoryPageNodes("commerce", 7, {
      eyebrow: 'BEST SELLERS',
      title: 'הנמכרים\nביותר',
      subtitle: 'קרוסלת מוצרים מובילים.',
      cta: 'קנו עכשיו',
      image: IMG.tech,
      images: [IMG.tech, IMG.workspace, IMG.cafe, IMG.studio, IMG.abstract, IMG.ecommerce, IMG.product, IMG.fashion, IMG.skincare, IMG.beauty, IMG.kitchen, IMG.food],
      items: [{ title: 'בחירה', copy: 'מוצר אחד.', meta: '01' }, { title: 'פרטים', copy: 'מידות וצבע.', meta: '02' }, { title: 'סל', copy: 'מוסיפים.', meta: '03' }, { title: 'תשלום', copy: 'מאובטח.', meta: '04' }, { title: 'משלוח', copy: 'עד הבית.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page09 = (() => {
  const meta = getRecipeMeta("commerce", 8);
  return makePageSection({
    id: "section-products-page-09",
    category: "commerce",
    title: "מוצרים – לוקבּוק",
    previewLayout: "section-products-page-09",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.workspace,
    keywords: ["מוצרים","products","wix"],
    nodes: buildCategoryPageNodes("commerce", 8, {
      eyebrow: 'LOOKBOOK',
      title: 'לוקבּוק\nויזואלי',
      subtitle: 'פילמסטריפ לקולקציה.',
      cta: 'עלעל בלוקבּוק',
      image: IMG.workspace,
      images: [IMG.workspace, IMG.cafe, IMG.studio, IMG.abstract, IMG.ecommerce, IMG.product, IMG.fashion, IMG.skincare, IMG.beauty, IMG.kitchen, IMG.food, IMG.tech],
      items: [{ title: 'חדש', copy: 'מהמדף עכשיו.' }, { title: 'נמכר', copy: 'הכי מבוקש.' }, { title: 'מוגבל', copy: 'מלאי קטן.' }, { title: 'סט', copy: 'חיסכון בחבילה.' }, { title: 'מתנה', copy: 'אריזה מוכנה.' }, { title: 'דיגיטלי', copy: 'הורדה מיידית.' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page10 = (() => {
  const meta = getRecipeMeta("commerce", 9);
  return makePageSection({
    id: "section-products-page-10",
    category: "commerce",
    title: "מוצרים – הזמנה",
    previewLayout: "section-products-page-10",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.cafe,
    keywords: ["מוצרים","products","wix"],
    nodes: buildCategoryPageNodes("commerce", 9, {
      eyebrow: 'ORDER',
      title: 'הזמינו\nבכמה קליקים',
      subtitle: 'טופס הזמנה מהיר.',
      cta: 'שלחו הזמנה',
      image: IMG.cafe,
      images: [IMG.cafe, IMG.studio, IMG.abstract, IMG.ecommerce, IMG.product, IMG.fashion, IMG.skincare, IMG.beauty, IMG.kitchen, IMG.food, IMG.tech, IMG.workspace],
      items: [{ title: 'בחירה', copy: 'מוצר אחד.', meta: '01' }, { title: 'פרטים', copy: 'מידות וצבע.', meta: '02' }, { title: 'סל', copy: 'מוסיפים.', meta: '03' }, { title: 'תשלום', copy: 'מאובטח.', meta: '04' }, { title: 'משלוח', copy: 'עד הבית.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

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
