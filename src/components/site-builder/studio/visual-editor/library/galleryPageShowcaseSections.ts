import { VISUAL_LIBRARY_IMAGES as IMG } from "./libraryAssets";
import type { VisualLibrarySectionTemplate } from "./visualLibraryTypes";
import {
  buildCategoryPageNodes,
  getRecipeMeta,
  makePageSection,
} from "./pageShowcaseHelpers";

const page01 = (() => {
  const meta = getRecipeMeta("gallery", 0);
  return makePageSection({
    id: "section-gallery-page-01",
    category: "gallery",
    title: "גלריה – מייסון",
    previewLayout: "section-gallery-page-01",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.architecture,
    keywords: ["גלריה","gallery","wix"],
    nodes: buildCategoryPageNodes("gallery", 0, {
      eyebrow: 'GALLERY',
      title: 'עבודות\nבפריסת מייסון',
      subtitle: 'רשת לא־סימטרית לעבודות נבחרות.',
      cta: 'לכל העבודות',
      image: IMG.architecture,
      items: [{ title: 'פרויקט מגורים', copy: 'חללים חמים ומדויקים.' }, { title: 'מסחרי', copy: 'נוכחות רחוב חזקה.' }, { title: 'מותג', copy: 'שפה ויזואלית עקבית.' }, { title: 'אירוע', copy: 'רגעים שנבחרו.' }, { title: 'מוצר', copy: 'צילום שמוכר.' }, { title: 'דיגיטל', copy: 'ממשקים נקיים.' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page02 = (() => {
  const meta = getRecipeMeta("gallery", 1);
  return makePageSection({
    id: "section-gallery-page-02",
    category: "gallery",
    title: "גלריה – פילמסטריפ",
    previewLayout: "section-gallery-page-02",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.interior,
    keywords: ["גלריה","gallery","wix"],
    nodes: buildCategoryPageNodes("gallery", 1, {
      eyebrow: 'FRAMES',
      title: 'רצף פריימים\nמהסטודיו',
      subtitle: 'פילמסטריפ אופקי עם סיפור ויזואלי.',
      cta: 'צפו ברצף',
      image: IMG.interior,
      items: [{ title: 'אור', copy: 'קומפוזיציה בהירה.', meta: '01' }, { title: 'צל', copy: 'דרמה מבוקרת.', meta: '02' }, { title: 'טקסטורה', copy: 'חומרים אמיתיים.', meta: '03' }, { title: 'פריים', copy: 'רגע מדויק.', meta: '04' }, { title: 'עריכה', copy: 'סלקציה.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page03 = (() => {
  const meta = getRecipeMeta("gallery", 2);
  return makePageSection({
    id: "section-gallery-page-03",
    category: "gallery",
    title: "גלריה – קייס",
    previewLayout: "section-gallery-page-03",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.fashion,
    keywords: ["גלריה","gallery","wix"],
    nodes: buildCategoryPageNodes("gallery", 2, {
      eyebrow: 'CASE',
      title: 'פרויקט דגל\nבמבט אחד',
      subtitle: 'כיסוי גדול + מדדי הצלחה.',
      cta: 'פתחו קייס',
      image: IMG.fashion,
      items: [{ title: '01 נבחר', copy: 'עבודת דגל.', meta: '01' }, { title: '02 חדש', copy: 'מהסטודיו.', meta: '02' }, { title: '03 אהוב', copy: 'הכי נצפה.', meta: '03' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page04 = (() => {
  const meta = getRecipeMeta("gallery", 3);
  return makePageSection({
    id: "section-gallery-page-04",
    category: "gallery",
    title: "גלריה – קולאז׳",
    previewLayout: "section-gallery-page-04",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.workspace,
    keywords: ["גלריה","gallery","wix"],
    nodes: buildCategoryPageNodes("gallery", 3, {
      eyebrow: 'SHOWCASE',
      title: 'רגעים\nשנבחרו בקפידה',
      subtitle: 'פריסת מגזין נועזת לגלריה.',
      cta: 'גלו פרויקט',
      image: IMG.workspace,
      items: [{ title: 'פרויקט מגורים', copy: 'חללים חמים ומדויקים.' }, { title: 'מסחרי', copy: 'נוכחות רחוב חזקה.' }, { title: 'מותג', copy: 'שפה ויזואלית עקבית.' }, { title: 'אירוע', copy: 'רגעים שנבחרו.' }, { title: 'מוצר', copy: 'צילום שמוכר.' }, { title: 'דיגיטל', copy: 'ממשקים נקיים.' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page05 = (() => {
  const meta = getRecipeMeta("gallery", 4);
  return makePageSection({
    id: "section-gallery-page-05",
    category: "gallery",
    title: "גלריה – ארכיון",
    previewLayout: "section-gallery-page-05",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.construction,
    keywords: ["גלריה","gallery","wix"],
    nodes: buildCategoryPageNodes("gallery", 4, {
      eyebrow: 'ARCHIVE',
      title: 'פרויקטים\nנבחרים',
      subtitle: 'רשימת ארכיון לצד מדיה גדולה.',
      cta: 'צפו בפרטים',
      image: IMG.construction,
      items: [{ title: 'אור', copy: 'קומפוזיציה בהירה.', meta: '01' }, { title: 'צל', copy: 'דרמה מבוקרת.', meta: '02' }, { title: 'טקסטורה', copy: 'חומרים אמיתיים.', meta: '03' }, { title: 'פריים', copy: 'רגע מדויק.', meta: '04' }, { title: 'עריכה', copy: 'סלקציה.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page06 = (() => {
  const meta = getRecipeMeta("gallery", 5);
  return makePageSection({
    id: "section-gallery-page-06",
    category: "gallery",
    title: "גלריה – תערוכה כהה",
    previewLayout: "section-gallery-page-06",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.abstract,
    keywords: ["גלריה","gallery","wix"],
    nodes: buildCategoryPageNodes("gallery", 5, {
      eyebrow: 'EXHIBITION',
      title: 'תערוכה\nבאווירה כהה',
      subtitle: 'גלריה סינמטית למותגי פרימיום.',
      cta: 'היכנסו לתערוכה',
      image: IMG.abstract,
      items: [{ title: '01 נבחר', copy: 'עבודת דגל.', meta: '01' }, { title: '02 חדש', copy: 'מהסטודיו.', meta: '02' }, { title: '03 אהוב', copy: 'הכי נצפה.', meta: '03' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page07 = (() => {
  const meta = getRecipeMeta("gallery", 6);
  return makePageSection({
    id: "section-gallery-page-07",
    category: "gallery",
    title: "גלריה – סטודיו רך",
    previewLayout: "section-gallery-page-07",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.beauty,
    keywords: ["גלריה","gallery","wix"],
    nodes: buildCategoryPageNodes("gallery", 6, {
      eyebrow: 'MOOD',
      title: 'אווירה\nשנשארת בזיכרון',
      subtitle: 'קיר סטודיו רך ומזמין.',
      cta: 'שמרו השראה',
      image: IMG.beauty,
      items: [{ title: 'פרויקט מגורים', copy: 'חללים חמים ומדויקים.' }, { title: 'מסחרי', copy: 'נוכחות רחוב חזקה.' }, { title: 'מותג', copy: 'שפה ויזואלית עקבית.' }, { title: 'אירוע', copy: 'רגעים שנבחרו.' }, { title: 'מוצר', copy: 'צילום שמוכר.' }, { title: 'דיגיטל', copy: 'ממשקים נקיים.' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page08 = (() => {
  const meta = getRecipeMeta("gallery", 7);
  return makePageSection({
    id: "section-gallery-page-08",
    category: "gallery",
    title: "גלריה – רשת צבעונית",
    previewLayout: "section-gallery-page-08",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.event,
    keywords: ["גלריה","gallery","wix"],
    nodes: buildCategoryPageNodes("gallery", 7, {
      eyebrow: 'PROJECTS',
      title: 'שישה פרויקטים\nבצבעים שונים',
      subtitle: 'כרטיסי פרויקט חיים.',
      cta: 'פתחו פרויקט',
      image: IMG.event,
      items: [{ title: 'אור', copy: 'קומפוזיציה בהירה.', meta: '01' }, { title: 'צל', copy: 'דרמה מבוקרת.', meta: '02' }, { title: 'טקסטורה', copy: 'חומרים אמיתיים.', meta: '03' }, { title: 'פריים', copy: 'רגע מדויק.', meta: '04' }, { title: 'עריכה', copy: 'סלקציה.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page09 = (() => {
  const meta = getRecipeMeta("gallery", 8);
  return makePageSection({
    id: "section-gallery-page-09",
    category: "gallery",
    title: "גלריה – קרוסלה",
    previewLayout: "section-gallery-page-09",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.nature,
    keywords: ["גלריה","gallery","wix"],
    nodes: buildCategoryPageNodes("gallery", 8, {
      eyebrow: 'SELECTED',
      title: 'מבחר חופף\nמהפורטפוליו',
      subtitle: 'קרוסלת עבודות עם עומק.',
      cta: 'גללו הלאה',
      image: IMG.nature,
      items: [{ title: '01 נבחר', copy: 'עבודת דגל.', meta: '01' }, { title: '02 חדש', copy: 'מהסטודיו.', meta: '02' }, { title: '03 אהוב', copy: 'הכי נצפה.', meta: '03' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page10 = (() => {
  const meta = getRecipeMeta("gallery", 9);
  return makePageSection({
    id: "section-gallery-page-10",
    category: "gallery",
    title: "גלריה – פנייה",
    previewLayout: "section-gallery-page-10",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.travel,
    keywords: ["גלריה","gallery","wix"],
    nodes: buildCategoryPageNodes("gallery", 9, {
      eyebrow: 'COLLABORATE',
      title: 'רוצים פרויקט\nכזה?',
      subtitle: 'גלריה שמסתיימת בטופס פנייה.',
      cta: 'דברו איתנו',
      secondaryCta: 'שלחו רעיון',
      image: IMG.travel,
      items: [{ title: 'פרויקט מגורים', copy: 'חללים חמים ומדויקים.' }, { title: 'מסחרי', copy: 'נוכחות רחוב חזקה.' }, { title: 'מותג', copy: 'שפה ויזואלית עקבית.' }, { title: 'אירוע', copy: 'רגעים שנבחרו.' }, { title: 'מוצר', copy: 'צילום שמוכר.' }, { title: 'דיגיטל', copy: 'ממשקים נקיים.' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

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
