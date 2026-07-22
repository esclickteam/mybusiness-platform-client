import { VISUAL_LIBRARY_IMAGES as IMG } from "./libraryAssets";
import type { VisualLibrarySectionTemplate } from "./visualLibraryTypes";
import {
  buildCategoryPageNodes,
  getRecipeMeta,
  makePageSection,
} from "./pageShowcaseHelpers";

const page01 = (() => {
  const meta = getRecipeMeta("promote", 0);
  return makePageSection({
    id: "section-landing-page-01",
    category: "promote",
    title: "נחיתה – CTA יחיד",
    previewLayout: "section-landing-page-01",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.product,
    keywords: ["נחיתה","landing","wix"],
    nodes: buildCategoryPageNodes("promote", 0, {
      eyebrow: 'LANDING',
      title: 'הצעה אחת\nשאי אפשר לפספס',
      subtitle: 'טיפוגרפיה דומיננטית סביב CTA יחיד.',
      cta: 'להרשמה',
      secondaryCta: 'למידע',
      image: IMG.product,
      items: [{ title: 'הטבה', copy: 'מחיר מוגבל.' }, { title: 'בונוס', copy: 'מתנה בהרשמה.' }, { title: 'אחריות', copy: 'בלי סיכון.' }, { title: 'מהיר', copy: 'התחלה מיידית.' }, { title: 'פשוט', copy: 'שלושה קליקים.' }, { title: 'תוצאה', copy: 'רואים הבדל.' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page02 = (() => {
  const meta = getRecipeMeta("promote", 1);
  return makePageSection({
    id: "section-landing-page-02",
    category: "promote",
    title: "נחיתה – הוכחה חברתית",
    previewLayout: "section-landing-page-02",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.tech,
    keywords: ["נחיתה","landing","wix"],
    nodes: buildCategoryPageNodes("promote", 1, {
      eyebrow: 'PROOF',
      title: 'למה אלפי\nעסקים בחרו בזה',
      subtitle: 'פסיפס יתרונות עם הוכחות.',
      cta: 'הצטרפו עכשיו',
      image: IMG.tech,
      items: [{ title: 'לחצו', copy: 'בוחרים מסלול.', meta: '01' }, { title: 'נרשמים', copy: 'משאירים פרטים.', meta: '02' }, { title: 'מקבלים', copy: 'הגישה נפתחת.', meta: '03' }, { title: 'מתחילים', copy: 'עובדים.', meta: '04' }, { title: 'צומחים', copy: 'מודדים.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page03 = (() => {
  const meta = getRecipeMeta("promote", 2);
  return makePageSection({
    id: "section-landing-page-03",
    category: "promote",
    title: "נחיתה – הצעה",
    previewLayout: "section-landing-page-03",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.fashion,
    keywords: ["נחיתה","landing","wix"],
    nodes: buildCategoryPageNodes("promote", 2, {
      eyebrow: 'OFFER',
      title: 'מבצע מוגבל\nבזמן',
      subtitle: 'כרטיס הצעה בסגנון טיקט.',
      cta: 'מימוש ההטבה',
      image: IMG.fashion,
      items: [{ title: 'הטבה', copy: 'מחיר מוגבל.' }, { title: 'בונוס', copy: 'מתנה בהרשמה.' }, { title: 'אחריות', copy: 'בלי סיכון.' }, { title: 'מהיר', copy: 'התחלה מיידית.' }, { title: 'פשוט', copy: 'שלושה קליקים.' }, { title: 'תוצאה', copy: 'רואים הבדל.' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page04 = (() => {
  const meta = getRecipeMeta("promote", 3);
  return makePageSection({
    id: "section-landing-page-04",
    category: "promote",
    title: "נחיתה – יתרונות",
    previewLayout: "section-landing-page-04",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.ecommerce,
    keywords: ["נחיתה","landing","wix"],
    nodes: buildCategoryPageNodes("promote", 3, {
      eyebrow: 'INCLUDED',
      title: 'מה מקבלים\nבחבילה',
      subtitle: 'רשימת תכולה לצד תמונה.',
      cta: 'לקנייה',
      image: IMG.ecommerce,
      items: [{ title: 'לחצו', copy: 'בוחרים מסלול.', meta: '01' }, { title: 'נרשמים', copy: 'משאירים פרטים.', meta: '02' }, { title: 'מקבלים', copy: 'הגישה נפתחת.', meta: '03' }, { title: 'מתחילים', copy: 'עובדים.', meta: '04' }, { title: 'צומחים', copy: 'מודדים.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page05 = (() => {
  const meta = getRecipeMeta("promote", 4);
  return makePageSection({
    id: "section-landing-page-05",
    category: "promote",
    title: "נחיתה – השקה כהה",
    previewLayout: "section-landing-page-05",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.event,
    keywords: ["נחיתה","landing","wix"],
    nodes: buildCategoryPageNodes("promote", 4, {
      eyebrow: 'EXCLUSIVE',
      title: 'גישה מוקדמת\nלחברים בלבד',
      subtitle: 'השקה סינמטית שחורה-זהב.',
      cta: 'בקשו גישה',
      image: IMG.event,
      items: [{ title: 'הטבה', copy: 'מחיר מוגבל.' }, { title: 'בונוס', copy: 'מתנה בהרשמה.' }, { title: 'אחריות', copy: 'בלי סיכון.' }, { title: 'מהיר', copy: 'התחלה מיידית.' }, { title: 'פשוט', copy: 'שלושה קליקים.' }, { title: 'תוצאה', copy: 'רואים הבדל.' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page06 = (() => {
  const meta = getRecipeMeta("promote", 5);
  return makePageSection({
    id: "section-landing-page-06",
    category: "promote",
    title: "נחיתה – ווייטליסט",
    previewLayout: "section-landing-page-06",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.finance,
    keywords: ["נחיתה","landing","wix"],
    nodes: buildCategoryPageNodes("promote", 5, {
      eyebrow: 'SOFT SELL',
      title: 'הזמנה\nבלי לחץ',
      subtitle: 'נחיתה רגועה למותגי לייפסטייל.',
      cta: 'שמרו מקום',
      image: IMG.finance,
      items: [{ title: 'לחצו', copy: 'בוחרים מסלול.', meta: '01' }, { title: 'נרשמים', copy: 'משאירים פרטים.', meta: '02' }, { title: 'מקבלים', copy: 'הגישה נפתחת.', meta: '03' }, { title: 'מתחילים', copy: 'עובדים.', meta: '04' }, { title: 'צומחים', copy: 'מודדים.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page07 = (() => {
  const meta = getRecipeMeta("promote", 6);
  return makePageSection({
    id: "section-landing-page-07",
    category: "promote",
    title: "נחיתה – דמו",
    previewLayout: "section-landing-page-07",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.abstract,
    keywords: ["נחיתה","landing","wix"],
    nodes: buildCategoryPageNodes("promote", 6, {
      eyebrow: 'DEMO',
      title: 'ראו את המוצר\nבפעולה',
      subtitle: 'קייס דמו עם מדדים.',
      cta: 'בקשו דמו',
      image: IMG.abstract,
      items: [{ title: 'הטבה', copy: 'מחיר מוגבל.' }, { title: 'בונוס', copy: 'מתנה בהרשמה.' }, { title: 'אחריות', copy: 'בלי סיכון.' }, { title: 'מהיר', copy: 'התחלה מיידית.' }, { title: 'פשוט', copy: 'שלושה קליקים.' }, { title: 'תוצאה', copy: 'רואים הבדל.' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page08 = (() => {
  const meta = getRecipeMeta("promote", 7);
  return makePageSection({
    id: "section-landing-page-08",
    category: "promote",
    title: "נחיתה – פסיפס",
    previewLayout: "section-landing-page-08",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.wellness,
    keywords: ["נחיתה","landing","wix"],
    nodes: buildCategoryPageNodes("promote", 7, {
      eyebrow: 'BENEFITS',
      title: 'למה זה\nמשתלם עכשיו',
      subtitle: 'יתרונות בכרטיסים חיים.',
      cta: 'אני בפנים',
      image: IMG.wellness,
      items: [{ title: 'לחצו', copy: 'בוחרים מסלול.', meta: '01' }, { title: 'נרשמים', copy: 'משאירים פרטים.', meta: '02' }, { title: 'מקבלים', copy: 'הגישה נפתחת.', meta: '03' }, { title: 'מתחילים', copy: 'עובדים.', meta: '04' }, { title: 'צומחים', copy: 'מודדים.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page09 = (() => {
  const meta = getRecipeMeta("promote", 8);
  return makePageSection({
    id: "section-landing-page-09",
    category: "promote",
    title: "נחיתה – השוואה",
    previewLayout: "section-landing-page-09",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.product,
    keywords: ["נחיתה","landing","wix"],
    nodes: buildCategoryPageNodes("promote", 8, {
      eyebrow: 'VS',
      title: 'לפני ואחרי\nהמעבר אלינו',
      subtitle: 'מטריצת השוואה חדה.',
      cta: 'השוו בעצמכם',
      image: IMG.product,
      items: [{ title: 'הטבה', copy: 'מחיר מוגבל.' }, { title: 'בונוס', copy: 'מתנה בהרשמה.' }, { title: 'אחריות', copy: 'בלי סיכון.' }, { title: 'מהיר', copy: 'התחלה מיידית.' }, { title: 'פשוט', copy: 'שלושה קליקים.' }, { title: 'תוצאה', copy: 'רואים הבדל.' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page10 = (() => {
  const meta = getRecipeMeta("promote", 9);
  return makePageSection({
    id: "section-landing-page-10",
    category: "promote",
    title: "נחיתה – ליד",
    previewLayout: "section-landing-page-10",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.tech,
    keywords: ["נחיתה","landing","wix"],
    nodes: buildCategoryPageNodes("promote", 9, {
      eyebrow: 'LEAD FORM',
      title: 'השאירו פרטים\nוקבלו גישה',
      subtitle: 'טופס לידים דומיננטי.',
      cta: 'שלחו',
      secondaryCta: 'חזרו אליי',
      image: IMG.tech,
      items: [{ title: 'לחצו', copy: 'בוחרים מסלול.', meta: '01' }, { title: 'נרשמים', copy: 'משאירים פרטים.', meta: '02' }, { title: 'מקבלים', copy: 'הגישה נפתחת.', meta: '03' }, { title: 'מתחילים', copy: 'עובדים.', meta: '04' }, { title: 'צומחים', copy: 'מודדים.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

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
