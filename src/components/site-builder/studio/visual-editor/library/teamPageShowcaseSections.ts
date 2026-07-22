import { VISUAL_LIBRARY_IMAGES as IMG } from "./libraryAssets";
import type { VisualLibrarySectionTemplate } from "./visualLibraryTypes";
import {
  buildCategoryPageNodes,
  getRecipeMeta,
  makePageSection,
} from "./pageShowcaseHelpers";

const page01 = (() => {
  const meta = getRecipeMeta("team", 0);
  return makePageSection({
    id: "section-team-page-01",
    category: "team",
    title: "צוות – פורטרטים",
    previewLayout: "section-team-page-01",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.team,
    keywords: ["צוות","team","wix"],
    nodes: buildCategoryPageNodes("team", 0, {
      eyebrow: 'TEAM',
      title: 'האנשים\nמאחורי העשייה',
      subtitle: 'גריד דיוקנאות מקצועי.',
      cta: 'הכירו את כולם',
      image: IMG.team,
      images: [IMG.team, IMG.portrait, IMG.meeting, IMG.hands, IMG.office, IMG.workspace, IMG.studio, IMG.hospitality, IMG.cafe, IMG.city, IMG.laptop, IMG.finance],
      items: [{ title: 'עיצוב', copy: 'ויזואל וממשקים.' }, { title: 'פיתוח', copy: 'קוד וביצועים.' }, { title: 'שיווק', copy: 'צמיחה.' }, { title: 'מכירות', copy: 'סגירות.' }, { title: 'תמיכה', copy: 'לקוחות מרוצים.' }, { title: 'הנהלה', copy: 'חזון.' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page02 = (() => {
  const meta = getRecipeMeta("team", 1);
  return makePageSection({
    id: "section-team-page-02",
    category: "team",
    title: "צוות – הנהלה",
    previewLayout: "section-team-page-02",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.portrait,
    keywords: ["צוות","team","wix"],
    nodes: buildCategoryPageNodes("team", 1, {
      eyebrow: 'LEADERSHIP',
      title: 'צוות קטן\nעם השפעה גדולה',
      subtitle: 'פיצול היכרות עם ההנהלה.',
      cta: 'לפרופילים',
      image: IMG.portrait,
      images: [IMG.portrait, IMG.meeting, IMG.hands, IMG.office, IMG.workspace, IMG.studio, IMG.hospitality, IMG.cafe, IMG.city, IMG.laptop, IMG.finance, IMG.team],
      items: [{ title: 'היכרות', copy: 'יום ראשון.', meta: '01' }, { title: 'חניכה', copy: 'ליווי צמוד.', meta: '02' }, { title: 'עשייה', copy: 'פרויקטים.', meta: '03' }, { title: 'צמיחה', copy: 'קידום.', meta: '04' }, { title: 'מנהיגות', copy: 'הובלה.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page03 = (() => {
  const meta = getRecipeMeta("team", 2);
  return makePageSection({
    id: "section-team-page-03",
    category: "team",
    title: "צוות – פסיפס",
    previewLayout: "section-team-page-03",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.meeting,
    keywords: ["צוות","team","wix"],
    nodes: buildCategoryPageNodes("team", 2, {
      eyebrow: 'CREW',
      title: 'כישרונות\nשמניעים מותגים',
      subtitle: 'פסיפס צוות לא־סימטרי.',
      cta: 'גלו מי אנחנו',
      image: IMG.meeting,
      images: [IMG.meeting, IMG.hands, IMG.office, IMG.workspace, IMG.studio, IMG.hospitality, IMG.cafe, IMG.city, IMG.laptop, IMG.finance, IMG.team, IMG.portrait],
      items: [{ title: 'עיצוב', copy: 'ויזואל וממשקים.' }, { title: 'פיתוח', copy: 'קוד וביצועים.' }, { title: 'שיווק', copy: 'צמיחה.' }, { title: 'מכירות', copy: 'סגירות.' }, { title: 'תמיכה', copy: 'לקוחות מרוצים.' }, { title: 'הנהלה', copy: 'חזון.' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page04 = (() => {
  const meta = getRecipeMeta("team", 3);
  return makePageSection({
    id: "section-team-page-04",
    category: "team",
    title: "צוות – תפקידים",
    previewLayout: "section-team-page-04",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.hands,
    keywords: ["צוות","team","wix"],
    nodes: buildCategoryPageNodes("team", 3, {
      eyebrow: 'MEMBERS',
      title: 'שישה פנים\nבצבעים שונים',
      subtitle: 'כרטיסי תפקיד חיים.',
      cta: 'צרו קשר עם הצוות',
      image: IMG.hands,
      images: [IMG.hands, IMG.office, IMG.workspace, IMG.studio, IMG.hospitality, IMG.cafe, IMG.city, IMG.laptop, IMG.finance, IMG.team, IMG.portrait, IMG.meeting],
      items: [{ title: 'היכרות', copy: 'יום ראשון.', meta: '01' }, { title: 'חניכה', copy: 'ליווי צמוד.', meta: '02' }, { title: 'עשייה', copy: 'פרויקטים.', meta: '03' }, { title: 'צמיחה', copy: 'קידום.', meta: '04' }, { title: 'מנהיגות', copy: 'הובלה.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page05 = (() => {
  const meta = getRecipeMeta("team", 4);
  return makePageSection({
    id: "section-team-page-05",
    category: "team",
    title: "צוות – סטודיו כהה",
    previewLayout: "section-team-page-05",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.office,
    keywords: ["צוות","team","wix"],
    nodes: buildCategoryPageNodes("team", 4, {
      eyebrow: 'TALENT',
      title: 'הצוות\nשמאחורי הקלעים',
      subtitle: 'סטודיו כהה לכישרון.',
      cta: 'דברו עם המומחים',
      image: IMG.office,
      images: [IMG.office, IMG.workspace, IMG.studio, IMG.hospitality, IMG.cafe, IMG.city, IMG.laptop, IMG.finance, IMG.team, IMG.portrait, IMG.meeting, IMG.hands],
      items: [{ title: 'עיצוב', copy: 'ויזואל וממשקים.' }, { title: 'פיתוח', copy: 'קוד וביצועים.' }, { title: 'שיווק', copy: 'צמיחה.' }, { title: 'מכירות', copy: 'סגירות.' }, { title: 'תמיכה', copy: 'לקוחות מרוצים.' }, { title: 'הנהלה', copy: 'חזון.' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page06 = (() => {
  const meta = getRecipeMeta("team", 5);
  return makePageSection({
    id: "section-team-page-06",
    category: "team",
    title: "צוות – אנשים",
    previewLayout: "section-team-page-06",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.workspace,
    keywords: ["צוות","team","wix"],
    nodes: buildCategoryPageNodes("team", 5, {
      eyebrow: 'FAMILY',
      title: 'יותר מעסק\nקהילה',
      subtitle: 'טון חם לעמוד צוות.',
      cta: 'הכירו מקרוב',
      image: IMG.workspace,
      images: [IMG.workspace, IMG.studio, IMG.hospitality, IMG.cafe, IMG.city, IMG.laptop, IMG.finance, IMG.team, IMG.portrait, IMG.meeting, IMG.hands, IMG.office],
      items: [{ title: 'היכרות', copy: 'יום ראשון.', meta: '01' }, { title: 'חניכה', copy: 'ליווי צמוד.', meta: '02' }, { title: 'עשייה', copy: 'פרויקטים.', meta: '03' }, { title: 'צמיחה', copy: 'קידום.', meta: '04' }, { title: 'מנהיגות', copy: 'הובלה.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page07 = (() => {
  const meta = getRecipeMeta("team", 6);
  return makePageSection({
    id: "section-team-page-07",
    category: "team",
    title: "צוות – גיוס",
    previewLayout: "section-team-page-07",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.studio,
    keywords: ["צוות","team","wix"],
    nodes: buildCategoryPageNodes("team", 6, {
      eyebrow: 'CAREERS',
      title: 'רוצים\nלעבוד איתנו?',
      subtitle: 'סטייטמנט גיוס גדול.',
      cta: 'שלחו קו״ח',
      image: IMG.studio,
      images: [IMG.studio, IMG.hospitality, IMG.cafe, IMG.city, IMG.laptop, IMG.finance, IMG.team, IMG.portrait, IMG.meeting, IMG.hands, IMG.office, IMG.workspace],
      items: [{ title: 'עיצוב', copy: 'ויזואל וממשקים.' }, { title: 'פיתוח', copy: 'קוד וביצועים.' }, { title: 'שיווק', copy: 'צמיחה.' }, { title: 'מכירות', copy: 'סגירות.' }, { title: 'תמיכה', copy: 'לקוחות מרוצים.' }, { title: 'הנהלה', copy: 'חזון.' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page08 = (() => {
  const meta = getRecipeMeta("team", 7);
  return makePageSection({
    id: "section-team-page-08",
    category: "team",
    title: "צוות – כישורים",
    previewLayout: "section-team-page-08",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.hospitality,
    keywords: ["צוות","team","wix"],
    nodes: buildCategoryPageNodes("team", 7, {
      eyebrow: 'ROLES',
      title: 'תפקידים\nוהתמחויות',
      subtitle: 'רשימת תפקידים לצד תמונה.',
      cta: 'לפרטי התפקיד',
      image: IMG.hospitality,
      images: [IMG.hospitality, IMG.cafe, IMG.city, IMG.laptop, IMG.finance, IMG.team, IMG.portrait, IMG.meeting, IMG.hands, IMG.office, IMG.workspace, IMG.studio],
      items: [{ title: 'היכרות', copy: 'יום ראשון.', meta: '01' }, { title: 'חניכה', copy: 'ליווי צמוד.', meta: '02' }, { title: 'עשייה', copy: 'פרויקטים.', meta: '03' }, { title: 'צמיחה', copy: 'קידום.', meta: '04' }, { title: 'מנהיגות', copy: 'הובלה.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page09 = (() => {
  const meta = getRecipeMeta("team", 8);
  return makePageSection({
    id: "section-team-page-09",
    category: "team",
    title: "צוות – תרבות",
    previewLayout: "section-team-page-09",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.cafe,
    keywords: ["צוות","team","wix"],
    nodes: buildCategoryPageNodes("team", 8, {
      eyebrow: 'TOGETHER',
      title: 'שנים, פרויקטים\nואנשים',
      subtitle: 'מדדי תרבות על רקע כהה.',
      cta: 'ראו קריירה',
      image: IMG.cafe,
      images: [IMG.cafe, IMG.city, IMG.laptop, IMG.finance, IMG.team, IMG.portrait, IMG.meeting, IMG.hands, IMG.office, IMG.workspace, IMG.studio, IMG.hospitality],
      items: [{ title: 'עיצוב', copy: 'ויזואל וממשקים.' }, { title: 'פיתוח', copy: 'קוד וביצועים.' }, { title: 'שיווק', copy: 'צמיחה.' }, { title: 'מכירות', copy: 'סגירות.' }, { title: 'תמיכה', copy: 'לקוחות מרוצים.' }, { title: 'הנהלה', copy: 'חזון.' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page10 = (() => {
  const meta = getRecipeMeta("team", 9);
  return makePageSection({
    id: "section-team-page-10",
    category: "team",
    title: "צוות – הצטרפות",
    previewLayout: "section-team-page-10",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.city,
    keywords: ["צוות","team","wix"],
    nodes: buildCategoryPageNodes("team", 9, {
      eyebrow: 'JOIN',
      title: 'הצטרפו\nלצוות שלנו',
      subtitle: 'טופס מועמדות.',
      cta: 'שלחו קו״ח',
      image: IMG.city,
      images: [IMG.city, IMG.laptop, IMG.finance, IMG.team, IMG.portrait, IMG.meeting, IMG.hands, IMG.office, IMG.workspace, IMG.studio, IMG.hospitality, IMG.cafe],
      items: [{ title: 'היכרות', copy: 'יום ראשון.', meta: '01' }, { title: 'חניכה', copy: 'ליווי צמוד.', meta: '02' }, { title: 'עשייה', copy: 'פרויקטים.', meta: '03' }, { title: 'צמיחה', copy: 'קידום.', meta: '04' }, { title: 'מנהיגות', copy: 'הובלה.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

export const TEAM_PAGE_SHOWCASE_SECTIONS: VisualLibrarySectionTemplate[] = [
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
