import { VISUAL_LIBRARY_IMAGES as IMG } from "./libraryAssets";
import type { VisualLibrarySectionTemplate } from "./visualLibraryTypes";
import {
  buildCategoryPageNodes,
  getRecipeMeta,
  makePageSection,
} from "./pageShowcaseHelpers";

const page01 = (() => {
  const meta = getRecipeMeta("testimonials", 0);
  return makePageSection({
    id: "section-testimonials-page-01",
    category: "testimonials",
    title: "ביקורות – קיר ציטוטים",
    previewLayout: "section-testimonials-page-01",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.team,
    keywords: ["ביקורות","reviews","wix"],
    nodes: buildCategoryPageNodes("testimonials", 0, {
      eyebrow: 'REVIEWS',
      title: 'לקוחות\nשממליצים',
      subtitle: 'קיר ציטוטים חי עם מבטאים.',
      cta: 'קראו עוד',
      image: IMG.team,
      images: [IMG.team, IMG.office, IMG.portrait, IMG.team, IMG.workspace, IMG.finance, IMG.abstract, IMG.wellness, IMG.portrait, IMG.team],
      items: [{ title: '״שירות מדהים״', copy: 'חזרנו לקוחות קבועים.' }, { title: '״מהיר ומדויק״', copy: 'הכול בזמן.' }, { title: '״מקצועי״', copy: 'הרגשנו בידיים טובות.' }, { title: '״מומלץ״', copy: 'כבר שלחנו חברים.' }, { title: '״שווה כל שקל״', copy: 'ראינו תוצאה.' }, { title: '״יחס אישי״', copy: 'לא עוד מספר.' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page02 = (() => {
  const meta = getRecipeMeta("testimonials", 1);
  return makePageSection({
    id: "section-testimonials-page-02",
    category: "testimonials",
    title: "ביקורות – המלצה מובילה",
    previewLayout: "section-testimonials-page-02",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.office,
    keywords: ["ביקורות","reviews","wix"],
    nodes: buildCategoryPageNodes("testimonials", 1, {
      eyebrow: 'FEATURED',
      title: 'הסיפור\nשמסכם הכול',
      subtitle: 'המלצה מובילה עם מדדים.',
      cta: 'ראו המלצות',
      image: IMG.office,
      images: [IMG.office, IMG.portrait, IMG.team, IMG.workspace, IMG.finance, IMG.abstract, IMG.wellness, IMG.portrait, IMG.team, IMG.team],
      items: [{ title: 'לפני', copy: 'בלגן וכלים רבים.', meta: '01' }, { title: 'במהלך', copy: 'ליווי צמוד.', meta: '02' }, { title: 'אחרי', copy: 'סדר ותוצאות.', meta: '03' }, { title: 'המלצה', copy: 'ממליצים הלאה.', meta: '04' }, { title: 'חזרה', copy: 'עובדים שוב.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page03 = (() => {
  const meta = getRecipeMeta("testimonials", 2);
  return makePageSection({
    id: "section-testimonials-page-03",
    category: "testimonials",
    title: "ביקורות – קרוסלה",
    previewLayout: "section-testimonials-page-03",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.portrait,
    keywords: ["ביקורות","reviews","wix"],
    nodes: buildCategoryPageNodes("testimonials", 2, {
      eyebrow: 'WALL',
      title: 'קיר המלצות\nבתנועה',
      subtitle: 'כרטיסי ביקורת חופפים.',
      cta: 'לכל הביקורות',
      image: IMG.portrait,
      images: [IMG.portrait, IMG.team, IMG.workspace, IMG.finance, IMG.abstract, IMG.wellness, IMG.portrait, IMG.team, IMG.team, IMG.office],
      items: [{ title: '״שירות מדהים״', copy: 'חזרנו לקוחות קבועים.' }, { title: '״מהיר ומדויק״', copy: 'הכול בזמן.' }, { title: '״מקצועי״', copy: 'הרגשנו בידיים טובות.' }, { title: '״מומלץ״', copy: 'כבר שלחנו חברים.' }, { title: '״שווה כל שקל״', copy: 'ראינו תוצאה.' }, { title: '״יחס אישי״', copy: 'לא עוד מספר.' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page04 = (() => {
  const meta = getRecipeMeta("testimonials", 3);
  return makePageSection({
    id: "section-testimonials-page-04",
    category: "testimonials",
    title: "ביקורות – לוגו+ציטוט",
    previewLayout: "section-testimonials-page-04",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.team,
    keywords: ["ביקורות","reviews","wix"],
    nodes: buildCategoryPageNodes("testimonials", 3, {
      eyebrow: 'STORIES',
      title: 'סיפורי הצלחה\nאמיתיים',
      subtitle: 'מגזין המלצות נועז.',
      cta: 'גלו סיפור',
      image: IMG.team,
      images: [IMG.team, IMG.workspace, IMG.finance, IMG.abstract, IMG.wellness, IMG.portrait, IMG.team, IMG.team, IMG.office, IMG.portrait],
      items: [{ title: 'לפני', copy: 'בלגן וכלים רבים.', meta: '01' }, { title: 'במהלך', copy: 'ליווי צמוד.', meta: '02' }, { title: 'אחרי', copy: 'סדר ותוצאות.', meta: '03' }, { title: 'המלצה', copy: 'ממליצים הלאה.', meta: '04' }, { title: 'חזרה', copy: 'עובדים שוב.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page05 = (() => {
  const meta = getRecipeMeta("testimonials", 4);
  return makePageSection({
    id: "section-testimonials-page-05",
    category: "testimonials",
    title: "ביקורות – דירוגים",
    previewLayout: "section-testimonials-page-05",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.workspace,
    keywords: ["ביקורות","reviews","wix"],
    nodes: buildCategoryPageNodes("testimonials", 4, {
      eyebrow: 'RATINGS',
      title: 'המספרים\nשל שביעות הרצון',
      subtitle: 'דירוגים זוהרים על כהה.',
      cta: 'בדקו דירוגים',
      image: IMG.workspace,
      images: [IMG.workspace, IMG.finance, IMG.abstract, IMG.wellness, IMG.portrait, IMG.team, IMG.team, IMG.office, IMG.portrait, IMG.team],
      items: [{ title: '״שירות מדהים״', copy: 'חזרנו לקוחות קבועים.' }, { title: '״מהיר ומדויק״', copy: 'הכול בזמן.' }, { title: '״מקצועי״', copy: 'הרגשנו בידיים טובות.' }, { title: '״מומלץ״', copy: 'כבר שלחנו חברים.' }, { title: '״שווה כל שקל״', copy: 'ראינו תוצאה.' }, { title: '״יחס אישי״', copy: 'לא עוד מספר.' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page06 = (() => {
  const meta = getRecipeMeta("testimonials", 5);
  return makePageSection({
    id: "section-testimonials-page-06",
    category: "testimonials",
    title: "ביקורות – כהה",
    previewLayout: "section-testimonials-page-06",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.finance,
    keywords: ["ביקורות","reviews","wix"],
    nodes: buildCategoryPageNodes("testimonials", 5, {
      eyebrow: 'VOICES',
      title: 'קולות\nשמכירים את העבודה',
      subtitle: 'המלצות דרמטיות.',
      cta: 'הקשיבו ללקוחות',
      image: IMG.finance,
      images: [IMG.finance, IMG.abstract, IMG.wellness, IMG.portrait, IMG.team, IMG.team, IMG.office, IMG.portrait, IMG.team, IMG.workspace],
      items: [{ title: 'לפני', copy: 'בלגן וכלים רבים.', meta: '01' }, { title: 'במהלך', copy: 'ליווי צמוד.', meta: '02' }, { title: 'אחרי', copy: 'סדר ותוצאות.', meta: '03' }, { title: 'המלצה', copy: 'ממליצים הלאה.', meta: '04' }, { title: 'חזרה', copy: 'עובדים שוב.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page07 = (() => {
  const meta = getRecipeMeta("testimonials", 6);
  return makePageSection({
    id: "section-testimonials-page-07",
    category: "testimonials",
    title: "ביקורות – מילים חמות",
    previewLayout: "section-testimonials-page-07",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.abstract,
    keywords: ["ביקורות","reviews","wix"],
    nodes: buildCategoryPageNodes("testimonials", 6, {
      eyebrow: 'KIND WORDS',
      title: 'מילים חמות\nמלקוחות אמיתיים',
      subtitle: 'טון רך להמלצות שירות.',
      cta: 'קראו המלצה',
      image: IMG.abstract,
      images: [IMG.abstract, IMG.wellness, IMG.portrait, IMG.team, IMG.team, IMG.office, IMG.portrait, IMG.team, IMG.workspace, IMG.finance],
      items: [{ title: '״שירות מדהים״', copy: 'חזרנו לקוחות קבועים.' }, { title: '״מהיר ומדויק״', copy: 'הכול בזמן.' }, { title: '״מקצועי״', copy: 'הרגשנו בידיים טובות.' }, { title: '״מומלץ״', copy: 'כבר שלחנו חברים.' }, { title: '״שווה כל שקל״', copy: 'ראינו תוצאה.' }, { title: '״יחס אישי״', copy: 'לא עוד מספר.' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page08 = (() => {
  const meta = getRecipeMeta("testimonials", 7);
  return makePageSection({
    id: "section-testimonials-page-08",
    category: "testimonials",
    title: "ביקורות – לפני/אחרי",
    previewLayout: "section-testimonials-page-08",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.wellness,
    keywords: ["ביקורות","reviews","wix"],
    nodes: buildCategoryPageNodes("testimonials", 7, {
      eyebrow: 'JOURNEY',
      title: 'מהלקוח אמר\nאחרי התהליך',
      subtitle: 'המלצות על ציר זמן.',
      cta: 'התחילו גם אתם',
      image: IMG.wellness,
      images: [IMG.wellness, IMG.portrait, IMG.team, IMG.team, IMG.office, IMG.portrait, IMG.team, IMG.workspace, IMG.finance, IMG.abstract],
      items: [{ title: 'לפני', copy: 'בלגן וכלים רבים.', meta: '01' }, { title: 'במהלך', copy: 'ליווי צמוד.', meta: '02' }, { title: 'אחרי', copy: 'סדר ותוצאות.', meta: '03' }, { title: 'המלצה', copy: 'ממליצים הלאה.', meta: '04' }, { title: 'חזרה', copy: 'עובדים שוב.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page09 = (() => {
  const meta = getRecipeMeta("testimonials", 8);
  return makePageSection({
    id: "section-testimonials-page-09",
    category: "testimonials",
    title: "ביקורות – פילמסטריפ",
    previewLayout: "section-testimonials-page-09",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.portrait,
    keywords: ["ביקורות","reviews","wix"],
    nodes: buildCategoryPageNodes("testimonials", 8, {
      eyebrow: 'FACES',
      title: 'פנים וציטוטים\nברצף',
      subtitle: 'פילמסטריפ לקוחות.',
      cta: 'עוד ציטוטים',
      image: IMG.portrait,
      images: [IMG.portrait, IMG.team, IMG.team, IMG.office, IMG.portrait, IMG.team, IMG.workspace, IMG.finance, IMG.abstract, IMG.wellness],
      items: [{ title: '״שירות מדהים״', copy: 'חזרנו לקוחות קבועים.' }, { title: '״מהיר ומדויק״', copy: 'הכול בזמן.' }, { title: '״מקצועי״', copy: 'הרגשנו בידיים טובות.' }, { title: '״מומלץ״', copy: 'כבר שלחנו חברים.' }, { title: '״שווה כל שקל״', copy: 'ראינו תוצאה.' }, { title: '״יחס אישי״', copy: 'לא עוד מספר.' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page10 = (() => {
  const meta = getRecipeMeta("testimonials", 9);
  return makePageSection({
    id: "section-testimonials-page-10",
    category: "testimonials",
    title: "ביקורות – טופס ביקורת",
    previewLayout: "section-testimonials-page-10",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.team,
    keywords: ["ביקורות","reviews","wix"],
    nodes: buildCategoryPageNodes("testimonials", 9, {
      eyebrow: 'SHARE',
      title: 'החוויה שלכם\nחשובה לנו',
      subtitle: 'טופס ביקורת.',
      cta: 'כתבו ביקורת',
      image: IMG.team,
      images: [IMG.team, IMG.team, IMG.office, IMG.portrait, IMG.team, IMG.workspace, IMG.finance, IMG.abstract, IMG.wellness, IMG.portrait],
      items: [{ title: 'לפני', copy: 'בלגן וכלים רבים.', meta: '01' }, { title: 'במהלך', copy: 'ליווי צמוד.', meta: '02' }, { title: 'אחרי', copy: 'סדר ותוצאות.', meta: '03' }, { title: 'המלצה', copy: 'ממליצים הלאה.', meta: '04' }, { title: 'חזרה', copy: 'עובדים שוב.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

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
