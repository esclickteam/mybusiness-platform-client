import { VISUAL_LIBRARY_IMAGES as IMG } from "./libraryAssets";
import type { VisualLibrarySectionTemplate } from "./visualLibraryTypes";
import {
  buildCategoryPageNodes,
  getRecipeMeta,
  makePageSection,
} from "./pageShowcaseHelpers";

const page01 = (() => {
  const meta = getRecipeMeta("pricing", 0);
  return makePageSection({
    id: "section-pricing-page-01",
    category: "pricing",
    title: "תמחור – 3 מסלולים",
    previewLayout: "section-pricing-page-01",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.finance,
    keywords: ["תמחור","pricing","wix"],
    nodes: buildCategoryPageNodes("pricing", 0, {
      eyebrow: 'PRICING',
      title: 'מחירים\nשקופים ופשוטים',
      subtitle: 'שלושה מסלולים עם הדגשת Pro.',
      cta: 'בחרו חבילה',
      secondaryCta: 'שאלו אותנו',
      image: IMG.finance,
      items: [{ title: 'Basic', copy: 'להתחלה.' }, { title: 'Plus', copy: 'לצמיחה.' }, { title: 'Pro', copy: 'לעסקים.' }, { title: 'שנתי', copy: 'חיסכון.' }, { title: 'חודשי', copy: 'גמיש.' }, { title: 'מותאם', copy: 'לפי צורך.' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page02 = (() => {
  const meta = getRecipeMeta("pricing", 1);
  return makePageSection({
    id: "section-pricing-page-02",
    category: "pricing",
    title: "תמחור – מטריצה",
    previewLayout: "section-pricing-page-02",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.tech,
    keywords: ["תמחור","pricing","wix"],
    nodes: buildCategoryPageNodes("pricing", 1, {
      eyebrow: 'COMPARE',
      title: 'השוו\nותבחרו נכון',
      subtitle: 'טבלת פיצ׳רים מלאה.',
      cta: 'השוואה מלאה',
      image: IMG.tech,
      items: [{ title: 'בחירה', copy: 'מסלול.', meta: '01' }, { title: 'ניסיון', copy: '14 יום.', meta: '02' }, { title: 'הפעלה', copy: 'מיידית.', meta: '03' }, { title: 'שימוש', copy: 'כל הכלים.', meta: '04' }, { title: 'שדרוג', copy: 'בכל רגע.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page03 = (() => {
  const meta = getRecipeMeta("pricing", 2);
  return makePageSection({
    id: "section-pricing-page-03",
    category: "pricing",
    title: "תמחור – ערך",
    previewLayout: "section-pricing-page-03",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.office,
    keywords: ["תמחור","pricing","wix"],
    nodes: buildCategoryPageNodes("pricing", 2, {
      eyebrow: 'VALUE',
      title: 'הערך\nמאחורי המחיר',
      subtitle: 'פסיפס יתרונות מול עלות.',
      cta: 'התחילו ניסיון',
      image: IMG.office,
      items: [{ title: 'Basic', copy: 'להתחלה.' }, { title: 'Plus', copy: 'לצמיחה.' }, { title: 'Pro', copy: 'לעסקים.' }, { title: 'שנתי', copy: 'חיסכון.' }, { title: 'חודשי', copy: 'גמיש.' }, { title: 'מותאם', copy: 'לפי צורך.' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page04 = (() => {
  const meta = getRecipeMeta("pricing", 3);
  return makePageSection({
    id: "section-pricing-page-04",
    category: "pricing",
    title: "תמחור – פרימיום",
    previewLayout: "section-pricing-page-04",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.product,
    keywords: ["תמחור","pricing","wix"],
    nodes: buildCategoryPageNodes("pricing", 3, {
      eyebrow: 'PRO',
      title: 'מסלול Pro\nלעסקים רציניים',
      subtitle: 'תמחור דרמטי שחור-זהב.',
      cta: 'שדרגו ל-Pro',
      image: IMG.product,
      items: [{ title: 'בחירה', copy: 'מסלול.', meta: '01' }, { title: 'ניסיון', copy: '14 יום.', meta: '02' }, { title: 'הפעלה', copy: 'מיידית.', meta: '03' }, { title: 'שימוש', copy: 'כל הכלים.', meta: '04' }, { title: 'שדרוג', copy: 'בכל רגע.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page05 = (() => {
  const meta = getRecipeMeta("pricing", 4);
  return makePageSection({
    id: "section-pricing-page-05",
    category: "pricing",
    title: "תמחור – סטארטר",
    previewLayout: "section-pricing-page-05",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.finance,
    keywords: ["תמחור","pricing","wix"],
    nodes: buildCategoryPageNodes("pricing", 4, {
      eyebrow: 'SIMPLE',
      title: 'תמחור\nבלי הפתעות',
      subtitle: 'שפה רגועה למחירים.',
      cta: 'בחרו מסלול',
      image: IMG.finance,
      items: [{ title: 'Basic', copy: 'להתחלה.' }, { title: 'Plus', copy: 'לצמיחה.' }, { title: 'Pro', copy: 'לעסקים.' }, { title: 'שנתי', copy: 'חיסכון.' }, { title: 'חודשי', copy: 'גמיש.' }, { title: 'מותאם', copy: 'לפי צורך.' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page06 = (() => {
  const meta = getRecipeMeta("pricing", 5);
  return makePageSection({
    id: "section-pricing-page-06",
    category: "pricing",
    title: "תמחור – סטאק",
    previewLayout: "section-pricing-page-06",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.tech,
    keywords: ["תמחור","pricing","wix"],
    nodes: buildCategoryPageNodes("pricing", 5, {
      eyebrow: 'STACK',
      title: 'מה כלול\nבכל שלב',
      subtitle: 'רשימת ערך לצד מדיה.',
      cta: 'הצטרפו',
      image: IMG.tech,
      items: [{ title: 'בחירה', copy: 'מסלול.', meta: '01' }, { title: 'ניסיון', copy: '14 יום.', meta: '02' }, { title: 'הפעלה', copy: 'מיידית.', meta: '03' }, { title: 'שימוש', copy: 'כל הכלים.', meta: '04' }, { title: 'שדרוג', copy: 'בכל רגע.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page07 = (() => {
  const meta = getRecipeMeta("pricing", 6);
  return makePageSection({
    id: "section-pricing-page-07",
    category: "pricing",
    title: "תמחור – FAQ+מחיר",
    previewLayout: "section-pricing-page-07",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.abstract,
    keywords: ["תמחור","pricing","wix"],
    nodes: buildCategoryPageNodes("pricing", 6, {
      eyebrow: 'HELP',
      title: 'שאלות על\nהתמחור',
      subtitle: 'אקורדיון תשובות ליד המחיר.',
      cta: 'עוד פרטים',
      image: IMG.abstract,
      items: [{ title: 'Basic', copy: 'להתחלה.' }, { title: 'Plus', copy: 'לצמיחה.' }, { title: 'Pro', copy: 'לעסקים.' }, { title: 'שנתי', copy: 'חיסכון.' }, { title: 'חודשי', copy: 'גמיש.' }, { title: 'מותאם', copy: 'לפי צורך.' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page08 = (() => {
  const meta = getRecipeMeta("pricing", 7);
  return makePageSection({
    id: "section-pricing-page-08",
    category: "pricing",
    title: "תמחור – סטייטמנט",
    previewLayout: "section-pricing-page-08",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.wellness,
    keywords: ["תמחור","pricing","wix"],
    nodes: buildCategoryPageNodes("pricing", 7, {
      eyebrow: 'CLEAR PRICE',
      title: 'מחיר אחד\nשחוסך זמן',
      subtitle: 'מסר מחיר גדול וחד.',
      cta: 'התחילו עכשיו',
      image: IMG.wellness,
      items: [{ title: 'בחירה', copy: 'מסלול.', meta: '01' }, { title: 'ניסיון', copy: '14 יום.', meta: '02' }, { title: 'הפעלה', copy: 'מיידית.', meta: '03' }, { title: 'שימוש', copy: 'כל הכלים.', meta: '04' }, { title: 'שדרוג', copy: 'בכל רגע.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page09 = (() => {
  const meta = getRecipeMeta("pricing", 8);
  return makePageSection({
    id: "section-pricing-page-09",
    category: "pricing",
    title: "תמחור – מדדים",
    previewLayout: "section-pricing-page-09",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.tech,
    keywords: ["תמחור","pricing","wix"],
    nodes: buildCategoryPageNodes("pricing", 8, {
      eyebrow: 'ROI',
      title: 'החזר השקעה\nשרואים',
      subtitle: 'מספרי חיסכון על רקע כהה.',
      cta: 'חשבו חיסכון',
      image: IMG.tech,
      items: [{ title: 'Basic', copy: 'להתחלה.' }, { title: 'Plus', copy: 'לצמיחה.' }, { title: 'Pro', copy: 'לעסקים.' }, { title: 'שנתי', copy: 'חיסכון.' }, { title: 'חודשי', copy: 'גמיש.' }, { title: 'מותאם', copy: 'לפי צורך.' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page10 = (() => {
  const meta = getRecipeMeta("pricing", 9);
  return makePageSection({
    id: "section-pricing-page-10",
    category: "pricing",
    title: "תמחור – הצעת מחיר",
    previewLayout: "section-pricing-page-10",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.office,
    keywords: ["תמחור","pricing","wix"],
    nodes: buildCategoryPageNodes("pricing", 9, {
      eyebrow: 'CUSTOM QUOTE',
      title: 'צריכים\nהצעה מותאמת?',
      subtitle: 'טופס הצעת מחיר.',
      cta: 'בקשו הצעה',
      image: IMG.office,
      items: [{ title: 'בחירה', copy: 'מסלול.', meta: '01' }, { title: 'ניסיון', copy: '14 יום.', meta: '02' }, { title: 'הפעלה', copy: 'מיידית.', meta: '03' }, { title: 'שימוש', copy: 'כל הכלים.', meta: '04' }, { title: 'שדרוג', copy: 'בכל רגע.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

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
