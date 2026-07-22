import { VISUAL_LIBRARY_IMAGES as IMG } from "./libraryAssets";
import type { VisualLibrarySectionTemplate } from "./visualLibraryTypes";
import {
  buildLayoutNodes,
  makePageSection,
  type PageLayoutKind,
} from "./pageShowcaseHelpers";

const page01 = makePageSection({
  id: "section-team-page-01",
  category: "team",
  title: "צוות – כחול עסקי",
  previewLayout: "section-team-page-01",
  backgroundColor: "#ffffff",
  minHeight: "1600px",
  thumbnail: IMG.team,
  keywords: ["צוות","team","wix"],
  nodes: buildLayoutNodes("split" as PageLayoutKind, {
    eyebrow: 'TEAM',
    title: 'האנשים\nמאחורי העשייה',
    subtitle: 'עמוד צוות כחול ומקצועי.',
    cta: 'הכירו את כולם',
    image: IMG.team,
    items: [{ title: 'עיצוב', copy: 'ויזואל וממשקים.' }, { title: 'פיתוח', copy: 'קוד וביצועים.' }, { title: 'שיווק', copy: 'צמיחה.' }, { title: 'מכירות', copy: 'סגירות.' }, { title: 'תמיכה', copy: 'לקוחות מרוצים.' }, { title: 'הנהלה', copy: 'חזון.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page02 = makePageSection({
  id: "section-team-page-02",
  category: "team",
  title: "צוות – Editorial חם",
  previewLayout: "section-team-page-02",
  backgroundColor: "#f7f1ea",
  minHeight: "1500px",
  thumbnail: IMG.office,
  keywords: ["צוות","team","wix"],
  nodes: buildLayoutNodes("center" as PageLayoutKind, {
    eyebrow: 'PEOPLE',
    title: 'צוות קטן\nעם השפעה גדולה',
    subtitle: 'היכרות חמה עם האנשים.',
    cta: 'לפרופילים',
    image: IMG.office,
    items: [{ title: 'היכרות', copy: 'יום ראשון.', meta: '01' }, { title: 'חניכה', copy: 'ליווי צמוד.', meta: '02' }, { title: 'עשייה', copy: 'פרויקטים.', meta: '03' }, { title: 'צמיחה', copy: 'קידום.', meta: '04' }, { title: 'מנהיגות', copy: 'הובלה.', meta: '05' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page03 = makePageSection({
  id: "section-team-page-03",
  category: "team",
  title: "צוות – מגזין שחור",
  previewLayout: "section-team-page-03",
  backgroundColor: "#ffffff",
  minHeight: "1550px",
  thumbnail: IMG.workspace,
  keywords: ["צוות","team","wix"],
  nodes: buildLayoutNodes("magazine" as PageLayoutKind, {
    eyebrow: 'CREW',
    title: 'כישרונות\nשמניעים מותגים',
    subtitle: 'צוות בסגנון מגזין.',
    cta: 'גלו מי אנחנו',
    image: IMG.workspace,
    items: [{ title: 'עיצוב', copy: 'ויזואל וממשקים.' }, { title: 'פיתוח', copy: 'קוד וביצועים.' }, { title: 'שיווק', copy: 'צמיחה.' }, { title: 'מכירות', copy: 'סגירות.' }, { title: 'תמיכה', copy: 'לקוחות מרוצים.' }, { title: 'הנהלה', copy: 'חזון.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page04 = makePageSection({
  id: "section-team-page-04",
  category: "team",
  title: "צוות – כרטיסים צבעוניים",
  previewLayout: "section-team-page-04",
  backgroundColor: "#eef6ff",
  minHeight: "1500px",
  thumbnail: IMG.team,
  keywords: ["צוות","team","wix"],
  nodes: buildLayoutNodes("cards" as PageLayoutKind, {
    eyebrow: 'MEMBERS',
    title: 'שישה פנים\nבצבעים שונים',
    subtitle: 'כרטיסי צוות חיים.',
    cta: 'צרו קשר עם הצוות',
    image: IMG.team,
    items: [{ title: 'היכרות', copy: 'יום ראשון.', meta: '01' }, { title: 'חניכה', copy: 'ליווי צמוד.', meta: '02' }, { title: 'עשייה', copy: 'פרויקטים.', meta: '03' }, { title: 'צמיחה', copy: 'קידום.', meta: '04' }, { title: 'מנהיגות', copy: 'הובלה.', meta: '05' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page05 = makePageSection({
  id: "section-team-page-05",
  category: "team",
  title: "צוות – ציר סגול",
  previewLayout: "section-team-page-05",
  backgroundColor: "#f6f4ff",
  minHeight: "1580px",
  thumbnail: IMG.office,
  keywords: ["צוות","team","wix"],
  nodes: buildLayoutNodes("timeline" as PageLayoutKind, {
    eyebrow: 'CULTURE',
    title: 'איך אנחנו\nעובדים יחד',
    subtitle: 'תרבות ארגונית כתהליך.',
    cta: 'הצטרפו אלינו',
    image: IMG.office,
    items: [{ title: 'עיצוב', copy: 'ויזואל וממשקים.' }, { title: 'פיתוח', copy: 'קוד וביצועים.' }, { title: 'שיווק', copy: 'צמיחה.' }, { title: 'מכירות', copy: 'סגירות.' }, { title: 'תמיכה', copy: 'לקוחות מרוצים.' }, { title: 'הנהלה', copy: 'חזון.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page06 = makePageSection({
  id: "section-team-page-06",
  category: "team",
  title: "צוות – לוח מספרים",
  previewLayout: "section-team-page-06",
  backgroundColor: "#111827",
  minHeight: "1480px",
  thumbnail: IMG.finance,
  keywords: ["צוות","team","wix"],
  nodes: buildLayoutNodes("stats" as PageLayoutKind, {
    eyebrow: 'TOGETHER',
    title: 'שנים, פרויקטים\nואנשים',
    subtitle: 'מספרי צוות על רקע כהה.',
    cta: 'ראו קריירה',
    image: IMG.finance,
    items: [{ title: 'היכרות', copy: 'יום ראשון.', meta: '01' }, { title: 'חניכה', copy: 'ליווי צמוד.', meta: '02' }, { title: 'עשייה', copy: 'פרויקטים.', meta: '03' }, { title: 'צמיחה', copy: 'קידום.', meta: '04' }, { title: 'מנהיגות', copy: 'הובלה.', meta: '05' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page07 = makePageSection({
  id: "section-team-page-07",
  category: "team",
  title: "צוות – קולנוע זהב",
  previewLayout: "section-team-page-07",
  backgroundColor: "#09090b",
  minHeight: "1500px",
  thumbnail: IMG.abstract,
  keywords: ["צוות","team","wix"],
  nodes: buildLayoutNodes("dark" as PageLayoutKind, {
    eyebrow: 'TALENT',
    title: 'הצוות\nשמאחורי הקלעים',
    subtitle: 'כישרון דרמטי.',
    cta: 'דברו עם המומחים',
    image: IMG.abstract,
    items: [{ title: 'עיצוב', copy: 'ויזואל וממשקים.' }, { title: 'פיתוח', copy: 'קוד וביצועים.' }, { title: 'שיווק', copy: 'צמיחה.' }, { title: 'מכירות', copy: 'סגירות.' }, { title: 'תמיכה', copy: 'לקוחות מרוצים.' }, { title: 'הנהלה', copy: 'חזון.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page08 = makePageSection({
  id: "section-team-page-08",
  category: "team",
  title: "צוות – לייפסטייל ורוד",
  previewLayout: "section-team-page-08",
  backgroundColor: "#fde8e4",
  minHeight: "1520px",
  thumbnail: IMG.hospitality,
  keywords: ["צוות","team","wix"],
  nodes: buildLayoutNodes("lifestyle" as PageLayoutKind, {
    eyebrow: 'FAMILY',
    title: 'יותר מעסק\nקהילה',
    subtitle: 'טון חם לעמוד צוות.',
    cta: 'הכירו מקרוב',
    image: IMG.hospitality,
    items: [{ title: 'היכרות', copy: 'יום ראשון.', meta: '01' }, { title: 'חניכה', copy: 'ליווי צמוד.', meta: '02' }, { title: 'עשייה', copy: 'פרויקטים.', meta: '03' }, { title: 'צמיחה', copy: 'קידום.', meta: '04' }, { title: 'מנהיגות', copy: 'הובלה.', meta: '05' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page09 = makePageSection({
  id: "section-team-page-09",
  category: "team",
  title: "צוות – רשימה ירוקה",
  previewLayout: "section-team-page-09",
  backgroundColor: "#f0faf4",
  minHeight: "1450px",
  thumbnail: IMG.team,
  keywords: ["צוות","team","wix"],
  nodes: buildLayoutNodes("listMedia" as PageLayoutKind, {
    eyebrow: 'ROLES',
    title: 'תפקידים\nוהתמחויות',
    subtitle: 'רשימת תפקידים לצד תמונה.',
    cta: 'לפרטי התפקיד',
    image: IMG.team,
    items: [{ title: 'עיצוב', copy: 'ויזואל וממשקים.' }, { title: 'פיתוח', copy: 'קוד וביצועים.' }, { title: 'שיווק', copy: 'צמיחה.' }, { title: 'מכירות', copy: 'סגירות.' }, { title: 'תמיכה', copy: 'לקוחות מרוצים.' }, { title: 'הנהלה', copy: 'חזון.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page10 = makePageSection({
  id: "section-team-page-10",
  category: "team",
  title: "צוות – טופס כתום",
  previewLayout: "section-team-page-10",
  backgroundColor: "#fff7ed",
  minHeight: "1450px",
  thumbnail: IMG.office,
  keywords: ["צוות","team","wix"],
  nodes: buildLayoutNodes("ctaForm" as PageLayoutKind, {
    eyebrow: 'CAREERS',
    title: 'רוצים\nלעבוד איתנו?',
    subtitle: 'טופס מועמדות כתום.',
    cta: 'שלחו קו״ח',
    image: IMG.office,
    items: [{ title: 'היכרות', copy: 'יום ראשון.', meta: '01' }, { title: 'חניכה', copy: 'ליווי צמוד.', meta: '02' }, { title: 'עשייה', copy: 'פרויקטים.', meta: '03' }, { title: 'צמיחה', copy: 'קידום.', meta: '04' }, { title: 'מנהיגות', copy: 'הובלה.', meta: '05' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

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
