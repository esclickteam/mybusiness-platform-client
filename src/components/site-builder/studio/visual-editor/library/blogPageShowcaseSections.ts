import { VISUAL_LIBRARY_IMAGES as IMG } from "./libraryAssets";
import type { VisualLibrarySectionTemplate } from "./visualLibraryTypes";
import {
  buildCategoryPageNodes,
  getRecipeMeta,
  makePageSection,
} from "./pageShowcaseHelpers";

const page01 = (() => {
  const meta = getRecipeMeta("blog", 0);
  return makePageSection({
    id: "section-blog-page-01",
    category: "blog",
    title: "בלוג – רשימת מאמרים",
    previewLayout: "section-blog-page-01",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.education,
    keywords: ["בלוג","blog","wix"],
    nodes: buildCategoryPageNodes("blog", 0, {
      eyebrow: 'BLOG',
      title: 'תובנות\nלעסק צומח',
      subtitle: 'רשימת מאמרים לצד מדיה.',
      cta: 'לכל הפוסטים',
      image: IMG.education,
      images: [IMG.education, IMG.writing, IMG.bookshelf, IMG.laptop, IMG.office, IMG.workspace, IMG.cafe, IMG.nature, IMG.meeting, IMG.hands, IMG.studio, IMG.tech],
      items: [{ title: 'מדריך', copy: 'שלב אחר שלב.' }, { title: 'טיפ', copy: 'מהיר ליישום.' }, { title: 'ראיון', copy: 'מאחורי הקלעים.' }, { title: 'ניתוח', copy: 'מספרים אמיתיים.' }, { title: 'סיפור', copy: 'מהשטח.' }, { title: 'עדכון', copy: 'מה חדש.' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page02 = (() => {
  const meta = getRecipeMeta("blog", 1);
  return makePageSection({
    id: "section-blog-page-02",
    category: "blog",
    title: "בלוג – כתבה מובילה",
    previewLayout: "section-blog-page-02",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.writing,
    keywords: ["בלוג","blog","wix"],
    nodes: buildCategoryPageNodes("blog", 1, {
      eyebrow: 'FEATURED',
      title: 'הכתבה\nשכולם קוראים',
      subtitle: 'כיסוי גדול למאמר דגל.',
      cta: 'התחילו לקרוא',
      image: IMG.writing,
      images: [IMG.writing, IMG.bookshelf, IMG.laptop, IMG.office, IMG.workspace, IMG.cafe, IMG.nature, IMG.meeting, IMG.hands, IMG.studio, IMG.tech, IMG.education],
      items: [{ title: 'קוראים', copy: 'פותחים פוסט.', meta: '01' }, { title: 'לומדים', copy: 'מיישמים.', meta: '02' }, { title: 'משתפים', copy: 'מעבירים הלאה.', meta: '03' }, { title: 'חוזרים', copy: 'לפוסט הבא.', meta: '04' }, { title: 'נרשמים', copy: 'לניוזלטר.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page03 = (() => {
  const meta = getRecipeMeta("blog", 2);
  return makePageSection({
    id: "section-blog-page-03",
    category: "blog",
    title: "בלוג – מגזין",
    previewLayout: "section-blog-page-03",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.bookshelf,
    keywords: ["בלוג","blog","wix"],
    nodes: buildCategoryPageNodes("blog", 2, {
      eyebrow: 'STORIES',
      title: 'סיפורים\nמהשטח',
      subtitle: 'פריסת מגזין נועזת.',
      cta: 'גלו כתבה',
      image: IMG.bookshelf,
      images: [IMG.bookshelf, IMG.laptop, IMG.office, IMG.workspace, IMG.cafe, IMG.nature, IMG.meeting, IMG.hands, IMG.studio, IMG.tech, IMG.education, IMG.writing],
      items: [{ title: 'מדריך', copy: 'שלב אחר שלב.' }, { title: 'טיפ', copy: 'מהיר ליישום.' }, { title: 'ראיון', copy: 'מאחורי הקלעים.' }, { title: 'ניתוח', copy: 'מספרים אמיתיים.' }, { title: 'סיפור', copy: 'מהשטח.' }, { title: 'עדכון', copy: 'מה חדש.' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page04 = (() => {
  const meta = getRecipeMeta("blog", 3);
  return makePageSection({
    id: "section-blog-page-04",
    category: "blog",
    title: "בלוג – נושאים",
    previewLayout: "section-blog-page-04",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.laptop,
    keywords: ["בלוג","blog","wix"],
    nodes: buildCategoryPageNodes("blog", 3, {
      eyebrow: 'TOPICS',
      title: 'הנושאים\nהחמים השבוע',
      subtitle: 'כרטיסי נושא בצבעים.',
      cta: 'בחרו נושא',
      image: IMG.laptop,
      images: [IMG.laptop, IMG.office, IMG.workspace, IMG.cafe, IMG.nature, IMG.meeting, IMG.hands, IMG.studio, IMG.tech, IMG.education, IMG.writing, IMG.bookshelf],
      items: [{ title: 'קוראים', copy: 'פותחים פוסט.', meta: '01' }, { title: 'לומדים', copy: 'מיישמים.', meta: '02' }, { title: 'משתפים', copy: 'מעבירים הלאה.', meta: '03' }, { title: 'חוזרים', copy: 'לפוסט הבא.', meta: '04' }, { title: 'נרשמים', copy: 'לניוזלטר.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page05 = (() => {
  const meta = getRecipeMeta("blog", 4);
  return makePageSection({
    id: "section-blog-page-05",
    category: "blog",
    title: "בלוג – כותב",
    previewLayout: "section-blog-page-05",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.office,
    keywords: ["בלוג","blog","wix"],
    nodes: buildCategoryPageNodes("blog", 4, {
      eyebrow: 'AUTHOR',
      title: 'הכירו את\nהכותבים שלנו',
      subtitle: 'ספוטלייט לכותבים.',
      cta: 'לפרופילים',
      image: IMG.office,
      images: [IMG.office, IMG.workspace, IMG.cafe, IMG.nature, IMG.meeting, IMG.hands, IMG.studio, IMG.tech, IMG.education, IMG.writing, IMG.bookshelf, IMG.laptop],
      items: [{ title: 'מדריך', copy: 'שלב אחר שלב.' }, { title: 'טיפ', copy: 'מהיר ליישום.' }, { title: 'ראיון', copy: 'מאחורי הקלעים.' }, { title: 'ניתוח', copy: 'מספרים אמיתיים.' }, { title: 'סיפור', copy: 'מהשטח.' }, { title: 'עדכון', copy: 'מה חדש.' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page06 = (() => {
  const meta = getRecipeMeta("blog", 5);
  return makePageSection({
    id: "section-blog-page-06",
    category: "blog",
    title: "בלוג – קריאה כהה",
    previewLayout: "section-blog-page-06",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.workspace,
    keywords: ["בלוג","blog","wix"],
    nodes: buildCategoryPageNodes("blog", 5, {
      eyebrow: 'DEEP DIVES',
      title: 'מאמרים\nלעומק',
      subtitle: 'בלוג כהה לתוכן כבד.',
      cta: 'צללו פנימה',
      image: IMG.workspace,
      images: [IMG.workspace, IMG.cafe, IMG.nature, IMG.meeting, IMG.hands, IMG.studio, IMG.tech, IMG.education, IMG.writing, IMG.bookshelf, IMG.laptop, IMG.office],
      items: [{ title: 'קוראים', copy: 'פותחים פוסט.', meta: '01' }, { title: 'לומדים', copy: 'מיישמים.', meta: '02' }, { title: 'משתפים', copy: 'מעבירים הלאה.', meta: '03' }, { title: 'חוזרים', copy: 'לפוסט הבא.', meta: '04' }, { title: 'נרשמים', copy: 'לניוזלטר.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page07 = (() => {
  const meta = getRecipeMeta("blog", 6);
  return makePageSection({
    id: "section-blog-page-07",
    category: "blog",
    title: "בלוג – ניוזלטר",
    previewLayout: "section-blog-page-07",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.cafe,
    keywords: ["בלוג","blog","wix"],
    nodes: buildCategoryPageNodes("blog", 6, {
      eyebrow: 'NOTES',
      title: 'הערות קצרות\nמהיום־יום',
      subtitle: 'טון אישי ורגוע.',
      cta: 'קראו הערה',
      image: IMG.cafe,
      images: [IMG.cafe, IMG.nature, IMG.meeting, IMG.hands, IMG.studio, IMG.tech, IMG.education, IMG.writing, IMG.bookshelf, IMG.laptop, IMG.office, IMG.workspace],
      items: [{ title: 'מדריך', copy: 'שלב אחר שלב.' }, { title: 'טיפ', copy: 'מהיר ליישום.' }, { title: 'ראיון', copy: 'מאחורי הקלעים.' }, { title: 'ניתוח', copy: 'מספרים אמיתיים.' }, { title: 'סיפור', copy: 'מהשטח.' }, { title: 'עדכון', copy: 'מה חדש.' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page08 = (() => {
  const meta = getRecipeMeta("blog", 7);
  return makePageSection({
    id: "section-blog-page-08",
    category: "blog",
    title: "בלוג – סדרה",
    previewLayout: "section-blog-page-08",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.nature,
    keywords: ["בלוג","blog","wix"],
    nodes: buildCategoryPageNodes("blog", 7, {
      eyebrow: 'SERIES',
      title: 'סדרת מדריכים\nשלב אחר שלב',
      subtitle: 'בלוג כמסע למידה.',
      cta: 'למדריך הראשון',
      image: IMG.nature,
      images: [IMG.nature, IMG.meeting, IMG.hands, IMG.studio, IMG.tech, IMG.education, IMG.writing, IMG.bookshelf, IMG.laptop, IMG.office, IMG.workspace, IMG.cafe],
      items: [{ title: 'קוראים', copy: 'פותחים פוסט.', meta: '01' }, { title: 'לומדים', copy: 'מיישמים.', meta: '02' }, { title: 'משתפים', copy: 'מעבירים הלאה.', meta: '03' }, { title: 'חוזרים', copy: 'לפוסט הבא.', meta: '04' }, { title: 'נרשמים', copy: 'לניוזלטר.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page09 = (() => {
  const meta = getRecipeMeta("blog", 8);
  return makePageSection({
    id: "section-blog-page-09",
    category: "blog",
    title: "בלוג – ארכיון",
    previewLayout: "section-blog-page-09",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.meeting,
    keywords: ["בלוג","blog","wix"],
    nodes: buildCategoryPageNodes("blog", 8, {
      eyebrow: 'ARCHIVE',
      title: 'ארכיון\nמסודר',
      subtitle: 'מדף מאמרים ארכיוני.',
      cta: 'לכל הארכיון',
      image: IMG.meeting,
      images: [IMG.meeting, IMG.hands, IMG.studio, IMG.tech, IMG.education, IMG.writing, IMG.bookshelf, IMG.laptop, IMG.office, IMG.workspace, IMG.cafe, IMG.nature],
      items: [{ title: 'מדריך', copy: 'שלב אחר שלב.' }, { title: 'טיפ', copy: 'מהיר ליישום.' }, { title: 'ראיון', copy: 'מאחורי הקלעים.' }, { title: 'ניתוח', copy: 'מספרים אמיתיים.' }, { title: 'סיפור', copy: 'מהשטח.' }, { title: 'עדכון', copy: 'מה חדש.' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page10 = (() => {
  const meta = getRecipeMeta("blog", 9);
  return makePageSection({
    id: "section-blog-page-10",
    category: "blog",
    title: "בלוג – הרשמה",
    previewLayout: "section-blog-page-10",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.hands,
    keywords: ["בלוג","blog","wix"],
    nodes: buildCategoryPageNodes("blog", 9, {
      eyebrow: 'SUBSCRIBE',
      title: 'קבלו תובנות\nלמייל',
      subtitle: 'טופס ניוזלטר.',
      cta: 'להרשמה',
      image: IMG.hands,
      images: [IMG.hands, IMG.studio, IMG.tech, IMG.education, IMG.writing, IMG.bookshelf, IMG.laptop, IMG.office, IMG.workspace, IMG.cafe, IMG.nature, IMG.meeting],
      items: [{ title: 'קוראים', copy: 'פותחים פוסט.', meta: '01' }, { title: 'לומדים', copy: 'מיישמים.', meta: '02' }, { title: 'משתפים', copy: 'מעבירים הלאה.', meta: '03' }, { title: 'חוזרים', copy: 'לפוסט הבא.', meta: '04' }, { title: 'נרשמים', copy: 'לניוזלטר.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

export const BLOG_PAGE_SHOWCASE_SECTIONS: VisualLibrarySectionTemplate[] = [
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
