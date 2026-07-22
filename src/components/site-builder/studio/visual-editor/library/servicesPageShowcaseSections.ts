import { VISUAL_LIBRARY_IMAGES as IMG } from "./libraryAssets";
import type { VisualLibrarySectionTemplate } from "./visualLibraryTypes";
import {
  buildCategoryPageNodes,
  getRecipeMeta,
  makePageSection,
} from "./pageShowcaseHelpers";

const page01 = (() => {
  const meta = getRecipeMeta("services", 0);
  return makePageSection({
    id: "section-services-page-01",
    category: "services",
    title: "שירותים – חבילות",
    previewLayout: "section-services-page-01",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.tech,
    keywords: ["שירותים","services","wix"],
    nodes: buildCategoryPageNodes("services", 0, {
      eyebrow: 'PACKAGES',
      title: 'שלוש חבילות\nשמתאימות לכל שלב',
      subtitle: 'תפריט שירותים בסגנון מסלולים.',
      cta: 'בחרו חבילה',
      secondaryCta: 'השוו',
      image: IMG.tech,
      images: [IMG.tech, IMG.office, IMG.workspace, IMG.product, IMG.finance, IMG.meeting, IMG.hands, IMG.laptop, IMG.studio, IMG.medical, IMG.beauty, IMG.abstract],
      items: [{ title: 'Starter', copy: 'להתחלה מהירה.' }, { title: 'Growth', copy: 'לצמיחה עקבית.' }, { title: 'Pro', copy: 'לעסקים רציניים.' }, { title: 'Design', copy: 'עיצוב מלא.' }, { title: 'Tech', copy: 'פיתוח מתקדם.' }, { title: 'Care', copy: 'תחזוקה.' }],
      stats: [{ value: '₪990', label: 'התחלה' }, { value: '₪1,990', label: 'צמיחה' }, { value: '₪3,900', label: 'Pro' }, { value: '14', label: 'ימים' }],
    }),
  });
})();

const page02 = (() => {
  const meta = getRecipeMeta("services", 1);
  return makePageSection({
    id: "section-services-page-02",
    category: "services",
    title: "שירותים – תהליך",
    previewLayout: "section-services-page-02",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.finance,
    keywords: ["שירותים","services","wix"],
    nodes: buildCategoryPageNodes("services", 1, {
      eyebrow: 'PROCESS',
      title: 'איך העבודה\nמתבצעת',
      subtitle: 'שירותים כמסע לקוח עם ציר ברור.',
      cta: 'התחילו תהליך',
      image: IMG.finance,
      images: [IMG.office, IMG.workspace, IMG.product, IMG.finance, IMG.meeting, IMG.hands, IMG.laptop, IMG.studio, IMG.medical, IMG.beauty, IMG.abstract, IMG.tech],
      items: [{ title: 'שיחת אפיון', copy: 'מבינים צורך.', meta: '01' }, { title: 'הצעה', copy: 'תוכנית ברורה.', meta: '02' }, { title: 'ביצוע', copy: 'עבודה מדויקת.', meta: '03' }, { title: 'השקה', copy: 'יציאה לאוויר.', meta: '04' }, { title: 'אופטימיזציה', copy: 'שיפור מתמשך.', meta: '05' }],
      stats: [{ value: '5', label: 'שלבים' }, { value: '1', label: 'מנהל' }, { value: 'Weekly', label: 'עדכון' }, { value: 'SLA', label: 'מחייבים' }],
    }),
  });
})();

const page03 = (() => {
  const meta = getRecipeMeta("services", 2);
  return makePageSection({
    id: "section-services-page-03",
    category: "services",
    title: "שירותים – השוואה",
    previewLayout: "section-services-page-03",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.office,
    keywords: ["שירותים","services","wix"],
    nodes: buildCategoryPageNodes("services", 2, {
      eyebrow: 'COMPARE',
      title: 'מה כלול\nבכל שירות',
      subtitle: 'מטריצת יכולות שמבהירה הבדלים.',
      cta: 'השוו שירותים',
      image: IMG.office,
      images: [IMG.workspace, IMG.product, IMG.finance, IMG.meeting, IMG.hands, IMG.laptop, IMG.studio, IMG.medical, IMG.beauty, IMG.abstract, IMG.tech, IMG.office],
      items: [{ title: 'אסטרטגיה', copy: 'כלול במסלולים נבחרים.' }, { title: 'עיצוב', copy: 'כלול במסלולים נבחרים.' }, { title: 'פיתוח', copy: 'כלול במסלולים נבחרים.' }, { title: 'שיווק', copy: 'כלול במסלולים נבחרים.' }, { title: 'תמיכה', copy: 'כלול במסלולים נבחרים.' }, { title: 'הדרכה', copy: 'כלול במסלולים נבחרים.' }],
      stats: [{ value: '6', label: 'יכולות' }, { value: '3', label: 'מסלולים' }, { value: '∞', label: 'שדרוג' }, { value: '1', label: 'צוות' }],
    }),
  });
})();

const page04 = (() => {
  const meta = getRecipeMeta("services", 3);
  return makePageSection({
    id: "section-services-page-04",
    category: "services",
    title: "שירותים – יכולות",
    previewLayout: "section-services-page-04",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.product,
    keywords: ["שירותים","services","wix"],
    nodes: buildCategoryPageNodes("services", 3, {
      eyebrow: 'CAPABILITIES',
      title: 'שישה שירותים\nבצבעים חיים',
      subtitle: 'רשת יכולות עם מבטא צבע לכל כרטיס.',
      cta: 'לכל השירותים',
      image: IMG.product,
      images: [IMG.product, IMG.finance, IMG.meeting, IMG.hands, IMG.laptop, IMG.studio, IMG.medical, IMG.beauty, IMG.abstract, IMG.tech, IMG.office, IMG.workspace],
      items: [{ title: 'ייעוץ', copy: 'אבחון ואסטרטגיה.' }, { title: 'עיצוב', copy: 'חוויה ויזואלית.' }, { title: 'פיתוח', copy: 'ביצועים ומוצר.' }, { title: 'שיווק', copy: 'משפך שממיר.' }, { title: 'תמיכה', copy: 'ליווי שוטף.' }, { title: 'הדרכה', copy: 'צוות עצמאי.' }],
      stats: [{ value: '40+', label: 'שירותים' }, { value: '4.9', label: 'דירוג' }, { value: '72ש׳', label: 'מענה' }, { value: '100%', label: 'מותאם' }],
    }),
  });
})();

const page05 = (() => {
  const meta = getRecipeMeta("services", 4);
  return makePageSection({
    id: "section-services-page-05",
    category: "services",
    title: "שירותים – קייס סטדי",
    previewLayout: "section-services-page-05",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.workspace,
    keywords: ["שירותים","services","wix"],
    nodes: buildCategoryPageNodes("services", 4, {
      eyebrow: 'CASE STUDY',
      title: 'שירותים\nעם תוצאות מוכחות',
      subtitle: 'סיפור לקוח עם מדדים ותהליך.',
      cta: 'ראו תוצאות',
      image: IMG.workspace,
      images: [IMG.finance, IMG.meeting, IMG.hands, IMG.laptop, IMG.studio, IMG.medical, IMG.beauty, IMG.abstract, IMG.tech, IMG.office, IMG.workspace, IMG.product],
      items: [{ title: 'אתגר', copy: 'פיזור כלים.', meta: '01' }, { title: 'פתרון', copy: 'מערכת אחת.', meta: '02' }, { title: 'תוצאה', copy: 'יותר לידים.', meta: '03' }],
      stats: [{ value: '86%', label: 'חיסכון' }, { value: '2.4x', label: 'ROI' }, { value: '4.9', label: 'דירוג' }, { value: '30+', label: 'תבניות' }],
    }),
  });
})();

const page06 = (() => {
  const meta = getRecipeMeta("services", 5);
  return makePageSection({
    id: "section-services-page-06",
    category: "services",
    title: "שירותים – Editorial",
    previewLayout: "section-services-page-06",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.interior,
    keywords: ["שירותים","services","wix"],
    nodes: buildCategoryPageNodes("services", 5, {
      eyebrow: 'WHAT WE OFFER',
      title: 'המומחיות\nשלנו בשירותכם',
      subtitle: 'פתיחה editorial רגועה לשירותי בוטיק.',
      cta: 'לכל השירותים',
      image: IMG.interior,
      images: [IMG.meeting, IMG.hands, IMG.laptop, IMG.studio, IMG.medical, IMG.beauty, IMG.abstract, IMG.tech, IMG.office, IMG.workspace, IMG.product, IMG.finance],
      items: [{ title: 'אסטרטגיה', copy: 'מסר מדויק.' }, { title: 'ביצוע', copy: 'תוצרים מוכנים.' }, { title: 'מדידה', copy: 'תוצאות ברורות.' }],
      stats: [{ value: '3', label: 'שלבים' }, { value: '1', label: 'צוות' }, { value: '∞', label: 'שיפור' }, { value: '24/7', label: 'גיבוי' }],
    }),
  });
})();

const page07 = (() => {
  const meta = getRecipeMeta("services", 6);
  return makePageSection({
    id: "section-services-page-07",
    category: "services",
    title: "שירותים – קרוסלה",
    previewLayout: "section-services-page-07",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.team,
    keywords: ["שירותים","services","wix"],
    nodes: buildCategoryPageNodes("services", 6, {
      eyebrow: 'RETAINERS',
      title: 'ריטיינרים\nשממשיכים לעבוד',
      subtitle: 'כרטיסי שירות חופפים בסגנון קרוסלה.',
      cta: 'בחרו ריטיינר',
      image: IMG.team,
      images: [IMG.hands, IMG.laptop, IMG.studio, IMG.medical, IMG.beauty, IMG.abstract, IMG.tech, IMG.office, IMG.workspace, IMG.product, IMG.finance, IMG.meeting],
      items: [{ title: 'חודשי', copy: 'ליווי קבוע.' }, { title: 'רבעוני', copy: 'מנועי צמיחה.' }, { title: 'שנתי', copy: 'שותפות מלאה.' }, { title: 'אד-הוק', copy: 'לפי פרויקט.' }],
      stats: [{ value: '4', label: 'מסלולים' }, { value: 'VIP', label: 'יחס' }, { value: '1:1', label: 'מנהל' }, { value: '24h', label: 'מענה' }],
    }),
  });
})();

const page08 = (() => {
  const meta = getRecipeMeta("services", 7);
  return makePageSection({
    id: "section-services-page-08",
    category: "services",
    title: "שירותים – מגזין",
    previewLayout: "section-services-page-08",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.fashion,
    keywords: ["שירותים","services","wix"],
    nodes: buildCategoryPageNodes("services", 7, {
      eyebrow: 'EXPERTISE',
      title: 'שירותי בוטיק\nבפריסה נועזת',
      subtitle: 'קולאז׳ שחור-לבן עם היררכיה חזקה.',
      cta: 'גלו שירות',
      image: IMG.fashion,
      images: [IMG.laptop, IMG.studio, IMG.medical, IMG.beauty, IMG.abstract, IMG.tech, IMG.office, IMG.workspace, IMG.product, IMG.finance, IMG.meeting, IMG.hands],
      items: [{ title: 'מיתוג', copy: 'זהות שלמה.', meta: '01' }, { title: 'אתר', copy: 'עמודים ממירים.', meta: '02' }, { title: 'תוכן', copy: 'מסרים חדים.', meta: '03' }, { title: 'צמיחה', copy: 'תהליכים יציבים.', meta: '04' }],
      stats: [{ value: 'A+', label: 'איכות' }, { value: '12', label: 'שנים' }, { value: '300+', label: 'פרויקטים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page09 = (() => {
  const meta = getRecipeMeta("services", 8);
  return makePageSection({
    id: "section-services-page-09",
    category: "services",
    title: "שירותים – תפריט",
    previewLayout: "section-services-page-09",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.beauty,
    keywords: ["שירותים","services","wix"],
    nodes: buildCategoryPageNodes("services", 8, {
      eyebrow: 'MENU',
      title: 'קטלוג שירותים\nמסודר',
      subtitle: 'רשימה ברורה לצד מדיה גדולה.',
      cta: 'בחרו מהרשימה',
      image: IMG.beauty,
      images: [IMG.studio, IMG.medical, IMG.beauty, IMG.abstract, IMG.tech, IMG.office, IMG.workspace, IMG.product, IMG.finance, IMG.meeting, IMG.hands, IMG.laptop],
      items: [{ title: 'פגישת ייעוץ', copy: '45 דקות.', meta: '01' }, { title: 'חבילת בסיס', copy: 'ליווי חודשי.', meta: '02' }, { title: 'חבילת צמיחה', copy: 'אתר + CRM.', meta: '03' }, { title: 'ריטיינר', copy: 'תחזוקה מלאה.', meta: '04' }, { title: 'סדנה', copy: 'הדרכת צוות.', meta: '05' }],
      stats: [{ value: '5', label: 'פריטים' }, { value: 'Clear', label: 'מחיר' }, { value: 'Fast', label: 'הזמנה' }, { value: 'Easy', label: 'בחירה' }],
    }),
  });
})();

const page10 = (() => {
  const meta = getRecipeMeta("services", 9);
  return makePageSection({
    id: "section-services-page-10",
    category: "services",
    title: "שירותים – ייעוץ",
    previewLayout: "section-services-page-10",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.medical,
    keywords: ["שירותים","services","wix"],
    nodes: buildCategoryPageNodes("services", 9, {
      eyebrow: 'BOOK NOW',
      title: 'השירות הנכון\nמתחיל בשיחה',
      subtitle: 'טופס קביעה דומיננטי לסגירת פגישה.',
      cta: 'שלחו בקשה',
      secondaryCta: 'התקשרו',
      image: IMG.medical,
      images: [IMG.medical, IMG.beauty, IMG.abstract, IMG.tech, IMG.office, IMG.workspace, IMG.product, IMG.finance, IMG.meeting, IMG.hands, IMG.laptop, IMG.studio],
      items: [{ title: 'מענה מהיר', copy: 'תוך יום עסקים.' }, { title: 'ליווי', copy: 'לא נעלמים.' }, { title: 'שקיפות', copy: 'בלי הפתעות.' }],
      stats: [{ value: '<24h', label: 'חזרה' }, { value: 'Free', label: 'שיחה' }, { value: 'No spam', label: 'הבטחה' }, { value: 'Human', label: 'מענה' }],
    }),
  });
})();

export const SERVICES_PAGE_SHOWCASE_SECTIONS: VisualLibrarySectionTemplate[] = [
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
