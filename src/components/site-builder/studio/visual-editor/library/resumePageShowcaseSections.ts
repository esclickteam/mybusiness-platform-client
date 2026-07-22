import { VISUAL_LIBRARY_IMAGES as IMG } from "./libraryAssets";
import type { VisualLibrarySectionTemplate } from "./visualLibraryTypes";
import {
  buildCategoryPageNodes,
  getRecipeMeta,
  makePageSection,
} from "./pageShowcaseHelpers";

const page01 = (() => {
  const meta = getRecipeMeta("resume", 0);
  return makePageSection({
    id: "section-resume-page-01",
    category: "resume",
    title: "קורות חיים – עמודות CV",
    previewLayout: "section-resume-page-01",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.portrait,
    keywords: ["קורות חיים","resume","wix"],
    nodes: buildCategoryPageNodes("resume", 0, {
      eyebrow: 'RESUME',
      title: 'פרופיל מקצועי\nבמבט אחד',
      subtitle: 'עמודת זהות + ניסיון.',
      cta: 'הורידו PDF',
      secondaryCta: 'צרו קשר',
      image: IMG.portrait,
      images: [IMG.portrait, IMG.office, IMG.workspace, IMG.tech, IMG.finance, IMG.finance, IMG.abstract, IMG.portrait, IMG.office, IMG.team],
      items: [{ title: 'עיצוב', copy: 'UI/UX ומותג.' }, { title: 'פיתוח', copy: 'React ו-Node.' }, { title: 'ניהול', copy: 'צוותים ופרויקטים.' }, { title: 'שיווק', copy: 'צמיחה דיגיטלית.' }, { title: 'כתיבה', copy: 'תוכן ומסרים.' }, { title: 'אסטרטגיה', copy: 'חשיבה עסקית.' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page02 = (() => {
  const meta = getRecipeMeta("resume", 1);
  return makePageSection({
    id: "section-resume-page-02",
    category: "resume",
    title: "קורות חיים – ציר קריירה",
    previewLayout: "section-resume-page-02",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.office,
    keywords: ["קורות חיים","resume","wix"],
    nodes: buildCategoryPageNodes("resume", 1, {
      eyebrow: 'CAREER',
      title: 'הדרך\nעד היום',
      subtitle: 'ציר קריירה ברור.',
      cta: 'הזמינו ראיון',
      image: IMG.office,
      images: [IMG.office, IMG.workspace, IMG.tech, IMG.finance, IMG.finance, IMG.abstract, IMG.portrait, IMG.office, IMG.team, IMG.portrait],
      items: [{ title: 'התחלה', copy: 'תפקיד ראשון.', meta: '01' }, { title: 'צמיחה', copy: 'קידום.', meta: '02' }, { title: 'הובלה', copy: 'ניהול.', meta: '03' }, { title: 'השפעה', copy: 'תוצאות.', meta: '04' }, { title: 'היום', copy: 'מוכן להזדמנות.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page03 = (() => {
  const meta = getRecipeMeta("resume", 2);
  return makePageSection({
    id: "section-resume-page-03",
    category: "resume",
    title: "קורות חיים – כישורים",
    previewLayout: "section-resume-page-03",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.workspace,
    keywords: ["קורות חיים","resume","wix"],
    nodes: buildCategoryPageNodes("resume", 2, {
      eyebrow: 'SKILLS',
      title: 'כישורים\nבצבעים חיים',
      subtitle: 'כרטיסי מיומנויות.',
      cta: 'לפרטים',
      image: IMG.workspace,
      images: [IMG.workspace, IMG.tech, IMG.finance, IMG.finance, IMG.abstract, IMG.portrait, IMG.office, IMG.team, IMG.portrait, IMG.office],
      items: [{ title: 'עיצוב', copy: 'UI/UX ומותג.' }, { title: 'פיתוח', copy: 'React ו-Node.' }, { title: 'ניהול', copy: 'צוותים ופרויקטים.' }, { title: 'שיווק', copy: 'צמיחה דיגיטלית.' }, { title: 'כתיבה', copy: 'תוכן ומסרים.' }, { title: 'אסטרטגיה', copy: 'חשיבה עסקית.' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page04 = (() => {
  const meta = getRecipeMeta("resume", 3);
  return makePageSection({
    id: "section-resume-page-04",
    category: "resume",
    title: "קורות חיים – פרויקטים",
    previewLayout: "section-resume-page-04",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.tech,
    keywords: ["קורות חיים","resume","wix"],
    nodes: buildCategoryPageNodes("resume", 3, {
      eyebrow: 'PROJECTS',
      title: 'פרויקטים\nשמספרים עליי',
      subtitle: 'קייס פרויקטים עם מדדים.',
      cta: 'ראו פרויקטים',
      image: IMG.tech,
      images: [IMG.tech, IMG.finance, IMG.finance, IMG.abstract, IMG.portrait, IMG.office, IMG.team, IMG.portrait, IMG.office, IMG.workspace],
      items: [{ title: 'התחלה', copy: 'תפקיד ראשון.', meta: '01' }, { title: 'צמיחה', copy: 'קידום.', meta: '02' }, { title: 'הובלה', copy: 'ניהול.', meta: '03' }, { title: 'השפעה', copy: 'תוצאות.', meta: '04' }, { title: 'היום', copy: 'מוכן להזדמנות.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page05 = (() => {
  const meta = getRecipeMeta("resume", 4);
  return makePageSection({
    id: "section-resume-page-05",
    category: "resume",
    title: "קורות חיים – פורטפוליו כהה",
    previewLayout: "section-resume-page-05",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.finance,
    keywords: ["קורות חיים","resume","wix"],
    nodes: buildCategoryPageNodes("resume", 4, {
      eyebrow: 'PROFILE',
      title: 'פרופיל\nמקצועי בולט',
      subtitle: 'מותג אישי דרמטי.',
      cta: 'צור קשר',
      image: IMG.finance,
      images: [IMG.finance, IMG.finance, IMG.abstract, IMG.portrait, IMG.office, IMG.team, IMG.portrait, IMG.office, IMG.workspace, IMG.tech],
      items: [{ title: 'עיצוב', copy: 'UI/UX ומותג.' }, { title: 'פיתוח', copy: 'React ו-Node.' }, { title: 'ניהול', copy: 'צוותים ופרויקטים.' }, { title: 'שיווק', copy: 'צמיחה דיגיטלית.' }, { title: 'כתיבה', copy: 'תוכן ומסרים.' }, { title: 'אסטרטגיה', copy: 'חשיבה עסקית.' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page06 = (() => {
  const meta = getRecipeMeta("resume", 5);
  return makePageSection({
    id: "section-resume-page-06",
    category: "resume",
    title: "קורות חיים – אישי",
    previewLayout: "section-resume-page-06",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.finance,
    keywords: ["קורות חיים","resume","wix"],
    nodes: buildCategoryPageNodes("resume", 5, {
      eyebrow: 'ABOUT ME',
      title: 'מי אני\nומה אני מביא/ה',
      subtitle: 'טון אישי לעמוד קו״ח.',
      cta: 'בואו נדבר',
      image: IMG.finance,
      images: [IMG.finance, IMG.abstract, IMG.portrait, IMG.office, IMG.team, IMG.portrait, IMG.office, IMG.workspace, IMG.tech, IMG.finance],
      items: [{ title: 'התחלה', copy: 'תפקיד ראשון.', meta: '01' }, { title: 'צמיחה', copy: 'קידום.', meta: '02' }, { title: 'הובלה', copy: 'ניהול.', meta: '03' }, { title: 'השפעה', copy: 'תוצאות.', meta: '04' }, { title: 'היום', copy: 'מוכן להזדמנות.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page07 = (() => {
  const meta = getRecipeMeta("resume", 6);
  return makePageSection({
    id: "section-resume-page-07",
    category: "resume",
    title: "קורות חיים – השכלה",
    previewLayout: "section-resume-page-07",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.abstract,
    keywords: ["קורות חיים","resume","wix"],
    nodes: buildCategoryPageNodes("resume", 6, {
      eyebrow: 'EDUCATION',
      title: 'השכלה\nוהכשרות',
      subtitle: 'רשימת רקע לצד דיוקן.',
      cta: 'הורדה',
      image: IMG.abstract,
      images: [IMG.abstract, IMG.portrait, IMG.office, IMG.team, IMG.portrait, IMG.office, IMG.workspace, IMG.tech, IMG.finance, IMG.finance],
      items: [{ title: 'עיצוב', copy: 'UI/UX ומותג.' }, { title: 'פיתוח', copy: 'React ו-Node.' }, { title: 'ניהול', copy: 'צוותים ופרויקטים.' }, { title: 'שיווק', copy: 'צמיחה דיגיטלית.' }, { title: 'כתיבה', copy: 'תוכן ומסרים.' }, { title: 'אסטרטגיה', copy: 'חשיבה עסקית.' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page08 = (() => {
  const meta = getRecipeMeta("resume", 7);
  return makePageSection({
    id: "section-resume-page-08",
    category: "resume",
    title: "קורות חיים – הישגים",
    previewLayout: "section-resume-page-08",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.portrait,
    keywords: ["קורות חיים","resume","wix"],
    nodes: buildCategoryPageNodes("resume", 7, {
      eyebrow: 'IMPACT',
      title: 'מספרים\nמהקריירה',
      subtitle: 'הישגים מדידים על כהה.',
      cta: 'דברו איתי',
      image: IMG.portrait,
      images: [IMG.portrait, IMG.office, IMG.team, IMG.portrait, IMG.office, IMG.workspace, IMG.tech, IMG.finance, IMG.finance, IMG.abstract],
      items: [{ title: 'התחלה', copy: 'תפקיד ראשון.', meta: '01' }, { title: 'צמיחה', copy: 'קידום.', meta: '02' }, { title: 'הובלה', copy: 'ניהול.', meta: '03' }, { title: 'השפעה', copy: 'תוצאות.', meta: '04' }, { title: 'היום', copy: 'מוכן להזדמנות.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page09 = (() => {
  const meta = getRecipeMeta("resume", 8);
  return makePageSection({
    id: "section-resume-page-09",
    category: "resume",
    title: "קורות חיים – מפוצל",
    previewLayout: "section-resume-page-09",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.office,
    keywords: ["קורות חיים","resume","wix"],
    nodes: buildCategoryPageNodes("resume", 8, {
      eyebrow: 'CV',
      title: 'ניסיון, כישורים\nותוצאות',
      subtitle: 'פיצול מקצועי לקו״ח.',
      cta: 'שלחו הצעה',
      image: IMG.office,
      images: [IMG.office, IMG.team, IMG.portrait, IMG.office, IMG.workspace, IMG.tech, IMG.finance, IMG.finance, IMG.abstract, IMG.portrait],
      items: [{ title: 'עיצוב', copy: 'UI/UX ומותג.' }, { title: 'פיתוח', copy: 'React ו-Node.' }, { title: 'ניהול', copy: 'צוותים ופרויקטים.' }, { title: 'שיווק', copy: 'צמיחה דיגיטלית.' }, { title: 'כתיבה', copy: 'תוכן ומסרים.' }, { title: 'אסטרטגיה', copy: 'חשיבה עסקית.' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page10 = (() => {
  const meta = getRecipeMeta("resume", 9);
  return makePageSection({
    id: "section-resume-page-10",
    category: "resume",
    title: "קורות חיים – גיוס",
    previewLayout: "section-resume-page-10",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.team,
    keywords: ["קורות חיים","resume","wix"],
    nodes: buildCategoryPageNodes("resume", 9, {
      eyebrow: 'HIRE ME',
      title: 'פנויים\nלהזדמנות הבאה',
      subtitle: 'טופס גיוס.',
      cta: 'שלחו הצעת עבודה',
      image: IMG.team,
      images: [IMG.team, IMG.portrait, IMG.office, IMG.workspace, IMG.tech, IMG.finance, IMG.finance, IMG.abstract, IMG.portrait, IMG.office],
      items: [{ title: 'התחלה', copy: 'תפקיד ראשון.', meta: '01' }, { title: 'צמיחה', copy: 'קידום.', meta: '02' }, { title: 'הובלה', copy: 'ניהול.', meta: '03' }, { title: 'השפעה', copy: 'תוצאות.', meta: '04' }, { title: 'היום', copy: 'מוכן להזדמנות.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

export const RESUME_PAGE_SHOWCASE_SECTIONS: VisualLibrarySectionTemplate[] = [
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
