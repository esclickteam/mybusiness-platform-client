import { VISUAL_LIBRARY_IMAGES as IMG } from "./libraryAssets";
import type { VisualLibrarySectionTemplate } from "./visualLibraryTypes";
import {
  buildCategoryPageNodes,
  getRecipeMeta,
  makePageSection,
} from "./pageShowcaseHelpers";

const page01 = (() => {
  const meta = getRecipeMeta("faq", 0);
  return makePageSection({
    id: "section-faq-page-01",
    category: "faq",
    title: "שאלות נפוצות – אקורדיון",
    previewLayout: "section-faq-page-01",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.education,
    keywords: ["שאלות נפוצות","faq","wix"],
    nodes: buildCategoryPageNodes("faq", 0, {
      eyebrow: 'FAQ',
      title: 'תשובות\nלשאלות החשובות',
      subtitle: 'אקורדיון שאלות קלאסי.',
      cta: 'לא מצאתם תשובה?',
      image: IMG.education,
      items: [{ title: 'איך מתחילים?', copy: 'נרשמים ובוחרים תבנית.' }, { title: 'יש ניסיון?', copy: 'כן, 14 יום.' }, { title: 'צריך כרטיס?', copy: 'לא לשלב הניסיון.' }, { title: 'אפשר לבטל?', copy: 'בכל רגע.' }, { title: 'יש תמיכה?', copy: 'צ׳אט ומייל.' }, { title: 'מה עם דומיין?', copy: 'אפשר לחבר.' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page02 = (() => {
  const meta = getRecipeMeta("faq", 1);
  return makePageSection({
    id: "section-faq-page-02",
    category: "faq",
    title: "שאלות נפוצות – חיפוש",
    previewLayout: "section-faq-page-02",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.office,
    keywords: ["שאלות נפוצות","faq","wix"],
    nodes: buildCategoryPageNodes("faq", 1, {
      eyebrow: 'HELP',
      title: 'כל מה שרציתם\nלדעת',
      subtitle: 'רשימת תשובות לצד מדיה.',
      cta: 'חיפוש תשובה',
      image: IMG.office,
      items: [{ title: 'שאלה', copy: 'פותחים נושא.', meta: '01' }, { title: 'חיפוש', copy: 'מוצאים תשובה.', meta: '02' }, { title: 'הבנה', copy: 'מיישמים.', meta: '03' }, { title: 'עזרה', copy: 'אם צריך — פונים.', meta: '04' }, { title: 'פתרון', copy: 'חוזרים לעבודה.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page03 = (() => {
  const meta = getRecipeMeta("faq", 2);
  return makePageSection({
    id: "section-faq-page-03",
    category: "faq",
    title: "שאלות נפוצות – נושאים",
    previewLayout: "section-faq-page-03",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.workspace,
    keywords: ["שאלות נפוצות","faq","wix"],
    nodes: buildCategoryPageNodes("faq", 2, {
      eyebrow: 'TOPICS',
      title: 'נושאים\nבצבעים שונים',
      subtitle: 'קטגוריות שאלות חיות.',
      cta: 'בחרו נושא',
      image: IMG.workspace,
      items: [{ title: 'איך מתחילים?', copy: 'נרשמים ובוחרים תבנית.' }, { title: 'יש ניסיון?', copy: 'כן, 14 יום.' }, { title: 'צריך כרטיס?', copy: 'לא לשלב הניסיון.' }, { title: 'אפשר לבטל?', copy: 'בכל רגע.' }, { title: 'יש תמיכה?', copy: 'צ׳אט ומייל.' }, { title: 'מה עם דומיין?', copy: 'אפשר לחבר.' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page04 = (() => {
  const meta = getRecipeMeta("faq", 3);
  return makePageSection({
    id: "section-faq-page-04",
    category: "faq",
    title: "שאלות נפוצות – עזרה כהה",
    previewLayout: "section-faq-page-04",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.tech,
    keywords: ["שאלות נפוצות","faq","wix"],
    nodes: buildCategoryPageNodes("faq", 3, {
      eyebrow: 'SUPPORT',
      title: 'תמיכה\nבלי בלבול',
      subtitle: 'עזרה דרמטית וברורה.',
      cta: 'פתחו קריאה',
      image: IMG.tech,
      items: [{ title: 'שאלה', copy: 'פותחים נושא.', meta: '01' }, { title: 'חיפוש', copy: 'מוצאים תשובה.', meta: '02' }, { title: 'הבנה', copy: 'מיישמים.', meta: '03' }, { title: 'עזרה', copy: 'אם צריך — פונים.', meta: '04' }, { title: 'פתרון', copy: 'חוזרים לעבודה.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page05 = (() => {
  const meta = getRecipeMeta("faq", 4);
  return makePageSection({
    id: "section-faq-page-05",
    category: "faq",
    title: "שאלות נפוצות – תמיכה רכה",
    previewLayout: "section-faq-page-05",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.finance,
    keywords: ["שאלות נפוצות","faq","wix"],
    nodes: buildCategoryPageNodes("faq", 4, {
      eyebrow: 'FRIENDLY HELP',
      title: 'עזרה\nבשפה פשוטה',
      subtitle: 'טון רך לשאלות נפוצות.',
      cta: 'שאלו אותנו',
      image: IMG.finance,
      items: [{ title: 'איך מתחילים?', copy: 'נרשמים ובוחרים תבנית.' }, { title: 'יש ניסיון?', copy: 'כן, 14 יום.' }, { title: 'צריך כרטיס?', copy: 'לא לשלב הניסיון.' }, { title: 'אפשר לבטל?', copy: 'בכל רגע.' }, { title: 'יש תמיכה?', copy: 'צ׳אט ומייל.' }, { title: 'מה עם דומיין?', copy: 'אפשר לחבר.' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page06 = (() => {
  const meta = getRecipeMeta("faq", 5);
  return makePageSection({
    id: "section-faq-page-06",
    category: "faq",
    title: "שאלות נפוצות – שלבים",
    previewLayout: "section-faq-page-06",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.tech,
    keywords: ["שאלות נפוצות","faq","wix"],
    nodes: buildCategoryPageNodes("faq", 5, {
      eyebrow: 'SETUP',
      title: 'שאלות לפי\nשלבי שימוש',
      subtitle: 'FAQ על ציר תהליך.',
      cta: 'להתחלה מהירה',
      image: IMG.tech,
      items: [{ title: 'שאלה', copy: 'פותחים נושא.', meta: '01' }, { title: 'חיפוש', copy: 'מוצאים תשובה.', meta: '02' }, { title: 'הבנה', copy: 'מיישמים.', meta: '03' }, { title: 'עזרה', copy: 'אם צריך — פונים.', meta: '04' }, { title: 'פתרון', copy: 'חוזרים לעבודה.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page07 = (() => {
  const meta = getRecipeMeta("faq", 6);
  return makePageSection({
    id: "section-faq-page-07",
    category: "faq",
    title: "שאלות נפוצות – קשר+FAQ",
    previewLayout: "section-faq-page-07",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.abstract,
    keywords: ["שאלות נפוצות","faq","wix"],
    nodes: buildCategoryPageNodes("faq", 6, {
      eyebrow: 'CONTACT HELP',
      title: 'שאלה שלא\nמצאתם כאן?',
      subtitle: 'ערוצי קשר לצד עזרה.',
      cta: 'כתבו לנו',
      image: IMG.abstract,
      items: [{ title: 'איך מתחילים?', copy: 'נרשמים ובוחרים תבנית.' }, { title: 'יש ניסיון?', copy: 'כן, 14 יום.' }, { title: 'צריך כרטיס?', copy: 'לא לשלב הניסיון.' }, { title: 'אפשר לבטל?', copy: 'בכל רגע.' }, { title: 'יש תמיכה?', copy: 'צ׳אט ומייל.' }, { title: 'מה עם דומיין?', copy: 'אפשר לחבר.' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page08 = (() => {
  const meta = getRecipeMeta("faq", 7);
  return makePageSection({
    id: "section-faq-page-08",
    category: "faq",
    title: "שאלות נפוצות – פסיפס",
    previewLayout: "section-faq-page-08",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.wellness,
    keywords: ["שאלות נפוצות","faq","wix"],
    nodes: buildCategoryPageNodes("faq", 7, {
      eyebrow: 'QUICK FACTS',
      title: 'עובדות\nבקצרה',
      subtitle: 'פסיפס תשובות זריזות.',
      cta: 'עוד פרטים',
      image: IMG.wellness,
      items: [{ title: 'שאלה', copy: 'פותחים נושא.', meta: '01' }, { title: 'חיפוש', copy: 'מוצאים תשובה.', meta: '02' }, { title: 'הבנה', copy: 'מיישמים.', meta: '03' }, { title: 'עזרה', copy: 'אם צריך — פונים.', meta: '04' }, { title: 'פתרון', copy: 'חוזרים לעבודה.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page09 = (() => {
  const meta = getRecipeMeta("faq", 8);
  return makePageSection({
    id: "section-faq-page-09",
    category: "faq",
    title: "שאלות נפוצות – מדריך",
    previewLayout: "section-faq-page-09",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.education,
    keywords: ["שאלות נפוצות","faq","wix"],
    nodes: buildCategoryPageNodes("faq", 8, {
      eyebrow: 'GUIDES',
      title: 'שאלות\nעם הקשר',
      subtitle: 'FAQ בסגנון מדריך.',
      cta: 'למדריכים',
      image: IMG.education,
      items: [{ title: 'איך מתחילים?', copy: 'נרשמים ובוחרים תבנית.' }, { title: 'יש ניסיון?', copy: 'כן, 14 יום.' }, { title: 'צריך כרטיס?', copy: 'לא לשלב הניסיון.' }, { title: 'אפשר לבטל?', copy: 'בכל רגע.' }, { title: 'יש תמיכה?', copy: 'צ׳אט ומייל.' }, { title: 'מה עם דומיין?', copy: 'אפשר לחבר.' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page10 = (() => {
  const meta = getRecipeMeta("faq", 9);
  return makePageSection({
    id: "section-faq-page-10",
    category: "faq",
    title: "שאלות נפוצות – שאלה",
    previewLayout: "section-faq-page-10",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.office,
    keywords: ["שאלות נפוצות","faq","wix"],
    nodes: buildCategoryPageNodes("faq", 9, {
      eyebrow: 'STILL STUCK',
      title: 'עדיין צריכים\nעזרה?',
      subtitle: 'טופס פנייה בסוף העמוד.',
      cta: 'שלחו שאלה',
      image: IMG.office,
      items: [{ title: 'שאלה', copy: 'פותחים נושא.', meta: '01' }, { title: 'חיפוש', copy: 'מוצאים תשובה.', meta: '02' }, { title: 'הבנה', copy: 'מיישמים.', meta: '03' }, { title: 'עזרה', copy: 'אם צריך — פונים.', meta: '04' }, { title: 'פתרון', copy: 'חוזרים לעבודה.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

export const FAQ_PAGE_SHOWCASE_SECTIONS: VisualLibrarySectionTemplate[] = [
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
