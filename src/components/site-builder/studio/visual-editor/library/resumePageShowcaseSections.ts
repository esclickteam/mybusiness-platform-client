import { VISUAL_LIBRARY_IMAGES as IMG } from "./libraryAssets";
import type { VisualLibrarySectionTemplate } from "./visualLibraryTypes";
import {
  buildLayoutNodes,
  makePageSection,
  type PageLayoutKind,
} from "./pageShowcaseHelpers";

const page01 = makePageSection({
  id: "section-resume-page-01",
  category: "resume",
  title: "קורות חיים – כחול עסקי",
  previewLayout: "section-resume-page-01",
  backgroundColor: "#ffffff",
  minHeight: "1600px",
  thumbnail: IMG.portrait,
  keywords: ["קורות חיים","resume","wix"],
  nodes: buildLayoutNodes("split" as PageLayoutKind, {
    eyebrow: 'RESUME',
    title: 'פרופיל מקצועי\nבמבט אחד',
    subtitle: 'קו״ח כחול ומדויק.',
    cta: 'הורידו PDF',
    secondaryCta: 'צרו קשר',
    image: IMG.portrait,
    items: [{ title: 'עיצוב', copy: 'UI/UX ומותג.' }, { title: 'פיתוח', copy: 'React ו-Node.' }, { title: 'ניהול', copy: 'צוותים ופרויקטים.' }, { title: 'שיווק', copy: 'צמיחה דיגיטלית.' }, { title: 'כתיבה', copy: 'תוכן ומסרים.' }, { title: 'אסטרטגיה', copy: 'חשיבה עסקית.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page02 = makePageSection({
  id: "section-resume-page-02",
  category: "resume",
  title: "קורות חיים – Editorial חם",
  previewLayout: "section-resume-page-02",
  backgroundColor: "#f7f1ea",
  minHeight: "1500px",
  thumbnail: IMG.office,
  keywords: ["קורות חיים","resume","wix"],
  nodes: buildLayoutNodes("center" as PageLayoutKind, {
    eyebrow: 'CV',
    title: 'ניסיון, כישורים\nותוצאות',
    subtitle: 'עמוד קו״ח חם ונקי.',
    cta: 'שלחו הצעה',
    image: IMG.office,
    items: [{ title: 'התחלה', copy: 'תפקיד ראשון.', meta: '01' }, { title: 'צמיחה', copy: 'קידום.', meta: '02' }, { title: 'הובלה', copy: 'ניהול.', meta: '03' }, { title: 'השפעה', copy: 'תוצאות.', meta: '04' }, { title: 'היום', copy: 'מוכן להזדמנות.', meta: '05' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page03 = makePageSection({
  id: "section-resume-page-03",
  category: "resume",
  title: "קורות חיים – מגזין שחור",
  previewLayout: "section-resume-page-03",
  backgroundColor: "#ffffff",
  minHeight: "1550px",
  thumbnail: IMG.workspace,
  keywords: ["קורות חיים","resume","wix"],
  nodes: buildLayoutNodes("magazine" as PageLayoutKind, {
    eyebrow: 'PORTFOLIO CV',
    title: 'הסיפור\nהמקצועי שלי',
    subtitle: 'קו״ח editorial נועז.',
    cta: 'ראו פרויקטים',
    image: IMG.workspace,
    items: [{ title: 'עיצוב', copy: 'UI/UX ומותג.' }, { title: 'פיתוח', copy: 'React ו-Node.' }, { title: 'ניהול', copy: 'צוותים ופרויקטים.' }, { title: 'שיווק', copy: 'צמיחה דיגיטלית.' }, { title: 'כתיבה', copy: 'תוכן ומסרים.' }, { title: 'אסטרטגיה', copy: 'חשיבה עסקית.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page04 = makePageSection({
  id: "section-resume-page-04",
  category: "resume",
  title: "קורות חיים – כרטיסים צבעוניים",
  previewLayout: "section-resume-page-04",
  backgroundColor: "#eef6ff",
  minHeight: "1500px",
  thumbnail: IMG.tech,
  keywords: ["קורות חיים","resume","wix"],
  nodes: buildLayoutNodes("cards" as PageLayoutKind, {
    eyebrow: 'SKILLS',
    title: 'כישורים\nבצבעים חיים',
    subtitle: 'כרטיסי מיומנויות מגוונים.',
    cta: 'לפרטים',
    image: IMG.tech,
    items: [{ title: 'התחלה', copy: 'תפקיד ראשון.', meta: '01' }, { title: 'צמיחה', copy: 'קידום.', meta: '02' }, { title: 'הובלה', copy: 'ניהול.', meta: '03' }, { title: 'השפעה', copy: 'תוצאות.', meta: '04' }, { title: 'היום', copy: 'מוכן להזדמנות.', meta: '05' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page05 = makePageSection({
  id: "section-resume-page-05",
  category: "resume",
  title: "קורות חיים – ציר סגול",
  previewLayout: "section-resume-page-05",
  backgroundColor: "#f6f4ff",
  minHeight: "1580px",
  thumbnail: IMG.finance,
  keywords: ["קורות חיים","resume","wix"],
  nodes: buildLayoutNodes("timeline" as PageLayoutKind, {
    eyebrow: 'CAREER',
    title: 'הדרך\nעד היום',
    subtitle: 'ציר קריירה ברור.',
    cta: 'הזמינו ראיון',
    image: IMG.finance,
    items: [{ title: 'עיצוב', copy: 'UI/UX ומותג.' }, { title: 'פיתוח', copy: 'React ו-Node.' }, { title: 'ניהול', copy: 'צוותים ופרויקטים.' }, { title: 'שיווק', copy: 'צמיחה דיגיטלית.' }, { title: 'כתיבה', copy: 'תוכן ומסרים.' }, { title: 'אסטרטגיה', copy: 'חשיבה עסקית.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page06 = makePageSection({
  id: "section-resume-page-06",
  category: "resume",
  title: "קורות חיים – לוח מספרים",
  previewLayout: "section-resume-page-06",
  backgroundColor: "#111827",
  minHeight: "1480px",
  thumbnail: IMG.finance,
  keywords: ["קורות חיים","resume","wix"],
  nodes: buildLayoutNodes("stats" as PageLayoutKind, {
    eyebrow: 'IMPACT',
    title: 'מספרים\nמהקריירה',
    subtitle: 'הישגים מדידים על כהה.',
    cta: 'דברו איתי',
    image: IMG.finance,
    items: [{ title: 'התחלה', copy: 'תפקיד ראשון.', meta: '01' }, { title: 'צמיחה', copy: 'קידום.', meta: '02' }, { title: 'הובלה', copy: 'ניהול.', meta: '03' }, { title: 'השפעה', copy: 'תוצאות.', meta: '04' }, { title: 'היום', copy: 'מוכן להזדמנות.', meta: '05' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page07 = makePageSection({
  id: "section-resume-page-07",
  category: "resume",
  title: "קורות חיים – קולנוע זהב",
  previewLayout: "section-resume-page-07",
  backgroundColor: "#09090b",
  minHeight: "1500px",
  thumbnail: IMG.abstract,
  keywords: ["קורות חיים","resume","wix"],
  nodes: buildLayoutNodes("dark" as PageLayoutKind, {
    eyebrow: 'PROFILE',
    title: 'פרופיל\nמקצועי בולט',
    subtitle: 'מותג אישי דרמטי.',
    cta: 'צור קשר',
    image: IMG.abstract,
    items: [{ title: 'עיצוב', copy: 'UI/UX ומותג.' }, { title: 'פיתוח', copy: 'React ו-Node.' }, { title: 'ניהול', copy: 'צוותים ופרויקטים.' }, { title: 'שיווק', copy: 'צמיחה דיגיטלית.' }, { title: 'כתיבה', copy: 'תוכן ומסרים.' }, { title: 'אסטרטגיה', copy: 'חשיבה עסקית.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page08 = makePageSection({
  id: "section-resume-page-08",
  category: "resume",
  title: "קורות חיים – לייפסטייל ורוד",
  previewLayout: "section-resume-page-08",
  backgroundColor: "#fde8e4",
  minHeight: "1520px",
  thumbnail: IMG.portrait,
  keywords: ["קורות חיים","resume","wix"],
  nodes: buildLayoutNodes("lifestyle" as PageLayoutKind, {
    eyebrow: 'ABOUT ME',
    title: 'מי אני\nומה אני מביא/ה',
    subtitle: 'טון אישי לעמוד קו״ח.',
    cta: 'בואו נדבר',
    image: IMG.portrait,
    items: [{ title: 'התחלה', copy: 'תפקיד ראשון.', meta: '01' }, { title: 'צמיחה', copy: 'קידום.', meta: '02' }, { title: 'הובלה', copy: 'ניהול.', meta: '03' }, { title: 'השפעה', copy: 'תוצאות.', meta: '04' }, { title: 'היום', copy: 'מוכן להזדמנות.', meta: '05' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page09 = makePageSection({
  id: "section-resume-page-09",
  category: "resume",
  title: "קורות חיים – רשימה ירוקה",
  previewLayout: "section-resume-page-09",
  backgroundColor: "#f0faf4",
  minHeight: "1450px",
  thumbnail: IMG.office,
  keywords: ["קורות חיים","resume","wix"],
  nodes: buildLayoutNodes("listMedia" as PageLayoutKind, {
    eyebrow: 'EXPERIENCE',
    title: 'ניסיון תעסוקתי\nמפורט',
    subtitle: 'רשימת תפקידים לצד דיוקן.',
    cta: 'הורדה',
    image: IMG.office,
    items: [{ title: 'עיצוב', copy: 'UI/UX ומותג.' }, { title: 'פיתוח', copy: 'React ו-Node.' }, { title: 'ניהול', copy: 'צוותים ופרויקטים.' }, { title: 'שיווק', copy: 'צמיחה דיגיטלית.' }, { title: 'כתיבה', copy: 'תוכן ומסרים.' }, { title: 'אסטרטגיה', copy: 'חשיבה עסקית.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page10 = makePageSection({
  id: "section-resume-page-10",
  category: "resume",
  title: "קורות חיים – טופס כתום",
  previewLayout: "section-resume-page-10",
  backgroundColor: "#fff7ed",
  minHeight: "1450px",
  thumbnail: IMG.team,
  keywords: ["קורות חיים","resume","wix"],
  nodes: buildLayoutNodes("ctaForm" as PageLayoutKind, {
    eyebrow: 'HIRE ME',
    title: 'פנויים\nלהזדמנות הבאה',
    subtitle: 'טופס גיוס כתום.',
    cta: 'שלחו הצעת עבודה',
    image: IMG.team,
    items: [{ title: 'התחלה', copy: 'תפקיד ראשון.', meta: '01' }, { title: 'צמיחה', copy: 'קידום.', meta: '02' }, { title: 'הובלה', copy: 'ניהול.', meta: '03' }, { title: 'השפעה', copy: 'תוצאות.', meta: '04' }, { title: 'היום', copy: 'מוכן להזדמנות.', meta: '05' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

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
