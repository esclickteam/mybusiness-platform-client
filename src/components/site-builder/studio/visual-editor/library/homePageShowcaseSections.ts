import { VISUAL_LIBRARY_IMAGES as IMG } from "./libraryAssets";
import type { VisualLibrarySectionTemplate } from "./visualLibraryTypes";
import {
  buildCategoryPageNodes,
  getRecipeMeta,
  makePageSection,
} from "./pageShowcaseHelpers";

const page01 = (() => {
  const meta = getRecipeMeta("hero", 0);
  return makePageSection({
    id: "section-home-page-01",
    category: "hero",
    title: "דף הבית – פסיפס פיצ׳רים",
    previewLayout: "section-home-page-01",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.office,
    keywords: ["בית","ראשי","home","hero","wix"],
    nodes: buildCategoryPageNodes("hero", 0, {
      eyebrow: 'BUSINESS OS',
      title: 'נהלו את העסק\nבמקום אחד',
      subtitle: 'CRM, תורים ואתר — מערכת אחת שמניעה צמיחה.',
      cta: 'התחילו עכשיו',
      secondaryCta: 'למד עוד',
      image: IMG.office,
      images: [IMG.office, IMG.tech, IMG.workspace, IMG.team, IMG.finance, IMG.product, IMG.meeting, IMG.laptop, IMG.city, IMG.hands, IMG.studio, IMG.cafe],
      items: [{ title: 'CRM חכם', copy: 'לידים ולקוחות במקום אחד.' }, { title: 'תורים', copy: 'יומן אוטומטי בלי חיכוך.' }, { title: 'אתר', copy: 'נוכחות שממירה מבקרים.' }, { title: 'AI', copy: 'המלצות פעולה לעסק.' }, { title: 'שותפים', copy: 'רשת שיתופי פעולה.' }, { title: 'הצעות', copy: 'מסמכים מקצועיים במהירות.' }],
      stats: [{ value: '12K+', label: 'עסקים' }, { value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר לידים' }, { value: '14', label: 'ימים להשקה' }],
    }),
  });
})();

const page02 = (() => {
  const meta = getRecipeMeta("hero", 1);
  return makePageSection({
    id: "section-home-page-02",
    category: "hero",
    title: "דף הבית – סטייטמנט גדול",
    previewLayout: "section-home-page-02",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.nature,
    keywords: ["בית","ראשי","home","hero","wix"],
    nodes: buildCategoryPageNodes("hero", 1, {
      eyebrow: 'START FRESH',
      title: 'המקום שלך\nלהתחיל מחדש',
      subtitle: 'מסר אחד ברור עם טיפוגרפיה דומיננטית.',
      cta: 'קבעו שיחה',
      image: IMG.nature,
      images: [IMG.tech, IMG.workspace, IMG.team, IMG.finance, IMG.product, IMG.meeting, IMG.laptop, IMG.city, IMG.hands, IMG.studio, IMG.cafe, IMG.office],
      items: [{ title: 'CRM חכם', copy: 'לידים ולקוחות במקום אחד.' }, { title: 'תורים', copy: 'יומן אוטומטי בלי חיכוך.' }, { title: 'אתר', copy: 'נוכחות שממירה מבקרים.' }],
      stats: [{ value: '12K+', label: 'עסקים' }, { value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר לידים' }, { value: '14', label: 'ימים להשקה' }],
    }),
  });
})();

const page03 = (() => {
  const meta = getRecipeMeta("hero", 2);
  return makePageSection({
    id: "section-home-page-03",
    category: "hero",
    title: "דף הבית – מדדים כהים",
    previewLayout: "section-home-page-03",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.finance,
    keywords: ["בית","ראשי","home","hero","wix"],
    nodes: buildCategoryPageNodes("hero", 2, {
      eyebrow: 'RESULTS',
      title: 'תוצאות\nשמדברות חזק',
      subtitle: 'מספרים זוהרים על רקע כהה.',
      cta: 'ראו דמו',
      image: IMG.finance,
      images: [IMG.workspace, IMG.team, IMG.finance, IMG.product, IMG.meeting, IMG.laptop, IMG.city, IMG.hands, IMG.studio, IMG.cafe, IMG.office, IMG.tech],
      items: [{ title: 'CRM חכם', copy: 'לידים ולקוחות במקום אחד.' }, { title: 'תורים', copy: 'יומן אוטומטי בלי חיכוך.' }, { title: 'אתר', copy: 'נוכחות שממירה מבקרים.' }],
      stats: [{ value: '12K+', label: 'עסקים' }, { value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר לידים' }, { value: '14', label: 'ימים להשקה' }],
    }),
  });
})();

const page04 = (() => {
  const meta = getRecipeMeta("hero", 3);
  return makePageSection({
    id: "section-home-page-04",
    category: "hero",
    title: "דף הבית – לייפסטייל",
    previewLayout: "section-home-page-04",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.fitness,
    keywords: ["בית","ראשי","home","hero","wix"],
    nodes: buildCategoryPageNodes("hero", 3, {
      eyebrow: 'WELLNESS',
      title: 'אימון שמשנה\nאת היום',
      subtitle: 'אווירה רכה עם תמונת גיבור ענקית.',
      cta: 'קבעו אימון',
      image: IMG.fitness,
      images: [IMG.team, IMG.finance, IMG.product, IMG.meeting, IMG.laptop, IMG.city, IMG.hands, IMG.studio, IMG.cafe, IMG.office, IMG.tech, IMG.workspace],
      items: [{ title: 'CRM חכם', copy: 'לידים ולקוחות במקום אחד.' }, { title: 'תורים', copy: 'יומן אוטומטי בלי חיכוך.' }, { title: 'אתר', copy: 'נוכחות שממירה מבקרים.' }],
      stats: [{ value: '12K+', label: 'עסקים' }, { value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר לידים' }, { value: '14', label: 'ימים להשקה' }],
    }),
  });
})();

const page05 = (() => {
  const meta = getRecipeMeta("hero", 4);
  return makePageSection({
    id: "section-home-page-05",
    category: "hero",
    title: "דף הבית – טופס המרה",
    previewLayout: "section-home-page-05",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.hospitality,
    keywords: ["בית","ראשי","home","hero","wix"],
    nodes: buildCategoryPageNodes("hero", 4, {
      eyebrow: 'GET STARTED',
      title: 'בואו נבנה\nאת האתר שלכם',
      subtitle: 'טופס המרה בולט עם מסגרת חמה.',
      cta: 'שלחו פרטים',
      secondaryCta: 'דברו איתנו',
      image: IMG.hospitality,
      images: [IMG.finance, IMG.product, IMG.meeting, IMG.laptop, IMG.city, IMG.hands, IMG.studio, IMG.cafe, IMG.office, IMG.tech, IMG.workspace, IMG.team],
      items: [{ title: 'CRM חכם', copy: 'לידים ולקוחות במקום אחד.' }, { title: 'תורים', copy: 'יומן אוטומטי בלי חיכוך.' }, { title: 'אתר', copy: 'נוכחות שממירה מבקרים.' }],
      stats: [{ value: '12K+', label: 'עסקים' }, { value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר לידים' }, { value: '14', label: 'ימים להשקה' }],
    }),
  });
})();

const page06 = (() => {
  const meta = getRecipeMeta("hero", 5);
  return makePageSection({
    id: "section-home-page-06",
    category: "hero",
    title: "דף הבית – קרוסלה",
    previewLayout: "section-home-page-06",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.product,
    keywords: ["בית","ראשי","home","hero","wix"],
    nodes: buildCategoryPageNodes("hero", 5, {
      eyebrow: 'PRODUCT TOUR',
      title: 'כלים שזזים\nאיתכם קדימה',
      subtitle: 'כרטיסים חופפים בסגנון קרוסלה.',
      cta: 'לסיור מוצר',
      image: IMG.product,
      images: [IMG.product, IMG.meeting, IMG.laptop, IMG.city, IMG.hands, IMG.studio, IMG.cafe, IMG.office, IMG.tech, IMG.workspace, IMG.team, IMG.finance],
      items: [{ title: 'CRM חכם', copy: 'לידים ולקוחות במקום אחד.' }, { title: 'תורים', copy: 'יומן אוטומטי בלי חיכוך.' }, { title: 'אתר', copy: 'נוכחות שממירה מבקרים.' }, { title: 'AI', copy: 'המלצות פעולה לעסק.' }],
      stats: [{ value: '12K+', label: 'עסקים' }, { value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר לידים' }, { value: '14', label: 'ימים להשקה' }],
    }),
  });
})();

const page07 = (() => {
  const meta = getRecipeMeta("hero", 6);
  return makePageSection({
    id: "section-home-page-07",
    category: "hero",
    title: "דף הבית – מדף מוצרים",
    previewLayout: "section-home-page-07",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.ecommerce,
    keywords: ["בית","ראשי","home","hero","wix"],
    nodes: buildCategoryPageNodes("hero", 6, {
      eyebrow: 'SUITE',
      title: 'החבילה המלאה\nלעסק מודרני',
      subtitle: 'מדף מוצרים דיגיטליים במבט אחד.',
      cta: 'לכל הכלים',
      image: IMG.ecommerce,
      images: [IMG.meeting, IMG.laptop, IMG.city, IMG.hands, IMG.studio, IMG.cafe, IMG.office, IMG.tech, IMG.workspace, IMG.team, IMG.finance, IMG.product],
      items: [{ title: 'CRM חכם', copy: 'לידים ולקוחות במקום אחד.' }, { title: 'תורים', copy: 'יומן אוטומטי בלי חיכוך.' }, { title: 'אתר', copy: 'נוכחות שממירה מבקרים.' }, { title: 'AI', copy: 'המלצות פעולה לעסק.' }, { title: 'שותפים', copy: 'רשת שיתופי פעולה.' }, { title: 'הצעות', copy: 'מסמכים מקצועיים במהירות.' }],
      stats: [{ value: '12K+', label: 'עסקים' }, { value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר לידים' }, { value: '14', label: 'ימים להשקה' }],
    }),
  });
})();

const page08 = (() => {
  const meta = getRecipeMeta("hero", 7);
  return makePageSection({
    id: "section-home-page-08",
    category: "hero",
    title: "דף הבית – סינמטי",
    previewLayout: "section-home-page-08",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.abstract,
    keywords: ["בית","ראשי","home","hero","wix"],
    nodes: buildCategoryPageNodes("hero", 7, {
      eyebrow: 'PREMIUM',
      title: 'נוכחות דיגיטלית\nברמה אחרת',
      subtitle: 'דרמה שחורה עם מבטאי זהב.',
      cta: 'הצטרפו עכשיו',
      image: IMG.abstract,
      images: [IMG.laptop, IMG.city, IMG.hands, IMG.studio, IMG.cafe, IMG.office, IMG.tech, IMG.workspace, IMG.team, IMG.finance, IMG.product, IMG.meeting],
      items: [{ title: 'CRM חכם', copy: 'לידים ולקוחות במקום אחד.' }, { title: 'תורים', copy: 'יומן אוטומטי בלי חיכוך.' }, { title: 'אתר', copy: 'נוכחות שממירה מבקרים.' }],
      stats: [{ value: '12K+', label: 'עסקים' }, { value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר לידים' }, { value: '14', label: 'ימים להשקה' }],
    }),
  });
})();

const page09 = (() => {
  const meta = getRecipeMeta("hero", 8);
  return makePageSection({
    id: "section-home-page-09",
    category: "hero",
    title: "דף הבית – רשימה+מדיה",
    previewLayout: "section-home-page-09",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.tech,
    keywords: ["בית","ראשי","home","hero","wix"],
    nodes: buildCategoryPageNodes("hero", 8, {
      eyebrow: 'TOOLKIT',
      title: 'הכלים שהופכים\nעסק למסודר',
      subtitle: 'רשימה ממוספרת לצד מדיה דומיננטית.',
      cta: 'נסו בחינם',
      image: IMG.tech,
      images: [IMG.city, IMG.hands, IMG.studio, IMG.cafe, IMG.office, IMG.tech, IMG.workspace, IMG.team, IMG.finance, IMG.product, IMG.meeting, IMG.laptop],
      items: [{ title: 'CRM חכם', copy: 'לידים ולקוחות במקום אחד.' }, { title: 'תורים', copy: 'יומן אוטומטי בלי חיכוך.' }, { title: 'אתר', copy: 'נוכחות שממירה מבקרים.' }, { title: 'AI', copy: 'המלצות פעולה לעסק.' }, { title: 'שותפים', copy: 'רשת שיתופי פעולה.' }],
      stats: [{ value: '12K+', label: 'עסקים' }, { value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר לידים' }, { value: '14', label: 'ימים להשקה' }],
    }),
  });
})();

const page10 = (() => {
  const meta = getRecipeMeta("hero", 9);
  return makePageSection({
    id: "section-home-page-10",
    category: "hero",
    title: "דף הבית – מפוצל",
    previewLayout: "section-home-page-10",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.workspace,
    keywords: ["בית","ראשי","home","hero","wix"],
    nodes: buildCategoryPageNodes("hero", 9, {
      eyebrow: 'PLATFORM',
      title: 'פלטפורמה אחת\nלכל העסק',
      subtitle: 'פיצול תמונה/טקסט עם כרטיסי ערך.',
      cta: 'התחילו',
      secondaryCta: 'למד עוד',
      image: IMG.workspace,
      images: [IMG.hands, IMG.studio, IMG.cafe, IMG.office, IMG.tech, IMG.workspace, IMG.team, IMG.finance, IMG.product, IMG.meeting, IMG.laptop, IMG.city],
      items: [{ title: 'CRM חכם', copy: 'לידים ולקוחות במקום אחד.' }, { title: 'תורים', copy: 'יומן אוטומטי בלי חיכוך.' }, { title: 'אתר', copy: 'נוכחות שממירה מבקרים.' }],
      stats: [{ value: '12K+', label: 'עסקים' }, { value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'יותר לידים' }, { value: '14', label: 'ימים להשקה' }],
    }),
  });
})();

export const HOME_PAGE_SHOWCASE_SECTIONS: VisualLibrarySectionTemplate[] = [
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
