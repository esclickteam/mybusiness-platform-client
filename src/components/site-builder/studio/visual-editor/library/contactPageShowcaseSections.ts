import { VISUAL_LIBRARY_IMAGES as IMG } from "./libraryAssets";
import type { VisualLibrarySectionTemplate } from "./visualLibraryTypes";
import {
  buildCategoryPageNodes,
  getRecipeMeta,
  makePageSection,
} from "./pageShowcaseHelpers";

const page01 = (() => {
  const meta = getRecipeMeta("contact", 0);
  return makePageSection({
    id: "section-contact-page-01",
    category: "contact",
    title: "יצירת קשר – דלפק",
    previewLayout: "section-contact-page-01",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.office,
    keywords: ["צור קשר","contact","wix"],
    nodes: buildCategoryPageNodes("contact", 0, {
      eyebrow: 'CONTACT',
      title: 'נשמח\nלשמוע מכם',
      subtitle: 'מפה + ערוצים + טופס בדלפק אחד.',
      cta: 'שלחו הודעה',
      secondaryCta: 'התקשרו',
      image: IMG.office,
      images: [IMG.office, IMG.team, IMG.workspace, IMG.tech, IMG.finance, IMG.medical, IMG.abstract, IMG.hospitality, IMG.architecture, IMG.office],
      items: [{ title: 'טלפון', copy: 'שיחה ישירה.' }, { title: 'מייל', copy: 'מענה כתוב.' }, { title: 'וואטסאפ', copy: 'הודעה מהירה.' }, { title: 'כתובת', copy: 'ביקור במשרד.' }, { title: 'זום', copy: 'פגישה מרחוק.' }, { title: 'טופס', copy: 'השארת פרטים.' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page02 = (() => {
  const meta = getRecipeMeta("contact", 1);
  return makePageSection({
    id: "section-contact-page-02",
    category: "contact",
    title: "יצירת קשר – מפוצל",
    previewLayout: "section-contact-page-02",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.team,
    keywords: ["צור קשר","contact","wix"],
    nodes: buildCategoryPageNodes("contact", 1, {
      eyebrow: 'LET\'S TALK',
      title: 'השיחה הבאה\nמתחילה כאן',
      subtitle: 'פיצול מקצועי עם כרטיסי ערוץ.',
      cta: 'כתבו לנו',
      image: IMG.team,
      images: [IMG.team, IMG.workspace, IMG.tech, IMG.finance, IMG.medical, IMG.abstract, IMG.hospitality, IMG.architecture, IMG.office, IMG.office],
      items: [{ title: 'מהיר', copy: 'חוזרים תוך יום.', meta: '01' }, { title: 'אנושי', copy: 'בלי בוטים.', meta: '02' }, { title: 'ברור', copy: 'בלי סיבובים.', meta: '03' }, { title: 'מדויק', copy: 'תיאום יומן.', meta: '04' }, { title: 'סגירה', copy: 'הצעה בכתב.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page03 = (() => {
  const meta = getRecipeMeta("contact", 2);
  return makePageSection({
    id: "section-contact-page-03",
    category: "contact",
    title: "יצירת קשר – צוות",
    previewLayout: "section-contact-page-03",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.workspace,
    keywords: ["צור קשר","contact","wix"],
    nodes: buildCategoryPageNodes("contact", 2, {
      eyebrow: 'DESK',
      title: 'הכירו את\nמי שעונה לכם',
      subtitle: 'יצירת קשר דרך אנשי הצוות.',
      cta: 'דברו עם הצוות',
      image: IMG.workspace,
      images: [IMG.workspace, IMG.tech, IMG.finance, IMG.medical, IMG.abstract, IMG.hospitality, IMG.architecture, IMG.office, IMG.office, IMG.team],
      items: [{ title: 'טלפון', copy: 'שיחה ישירה.' }, { title: 'מייל', copy: 'מענה כתוב.' }, { title: 'וואטסאפ', copy: 'הודעה מהירה.' }, { title: 'כתובת', copy: 'ביקור במשרד.' }, { title: 'זום', copy: 'פגישה מרחוק.' }, { title: 'טופס', copy: 'השארת פרטים.' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page04 = (() => {
  const meta = getRecipeMeta("contact", 3);
  return makePageSection({
    id: "section-contact-page-04",
    category: "contact",
    title: "יצירת קשר – טופס ראשון",
    previewLayout: "section-contact-page-04",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.tech,
    keywords: ["צור קשר","contact","wix"],
    nodes: buildCategoryPageNodes("contact", 3, {
      eyebrow: 'MESSAGE',
      title: 'השאירו פרטים\nונחזור אליכם',
      subtitle: 'טופס דומיננטי עם הבטחות מענה.',
      cta: 'שליחה',
      secondaryCta: 'וואטסאפ',
      image: IMG.tech,
      images: [IMG.tech, IMG.finance, IMG.medical, IMG.abstract, IMG.hospitality, IMG.architecture, IMG.office, IMG.office, IMG.team, IMG.workspace],
      items: [{ title: 'מהיר', copy: 'חוזרים תוך יום.', meta: '01' }, { title: 'אנושי', copy: 'בלי בוטים.', meta: '02' }, { title: 'ברור', copy: 'בלי סיבובים.', meta: '03' }, { title: 'מדויק', copy: 'תיאום יומן.', meta: '04' }, { title: 'סגירה', copy: 'הצעה בכתב.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page05 = (() => {
  const meta = getRecipeMeta("contact", 4);
  return makePageSection({
    id: "section-contact-page-05",
    category: "contact",
    title: "יצירת קשר – ערוצים",
    previewLayout: "section-contact-page-05",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.finance,
    keywords: ["צור קשר","contact","wix"],
    nodes: buildCategoryPageNodes("contact", 4, {
      eyebrow: 'CHANNELS',
      title: 'כל דרכי\nההתקשרות',
      subtitle: 'ערוצים בכרטיסים צבעוניים.',
      cta: 'בחרו ערוץ',
      image: IMG.finance,
      images: [IMG.finance, IMG.medical, IMG.abstract, IMG.hospitality, IMG.architecture, IMG.office, IMG.office, IMG.team, IMG.workspace, IMG.tech],
      items: [{ title: 'טלפון', copy: 'שיחה ישירה.' }, { title: 'מייל', copy: 'מענה כתוב.' }, { title: 'וואטסאפ', copy: 'הודעה מהירה.' }, { title: 'כתובת', copy: 'ביקור במשרד.' }, { title: 'זום', copy: 'פגישה מרחוק.' }, { title: 'טופס', copy: 'השארת פרטים.' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page06 = (() => {
  const meta = getRecipeMeta("contact", 5);
  return makePageSection({
    id: "section-contact-page-06",
    category: "contact",
    title: "יצירת קשר – פרימיום",
    previewLayout: "section-contact-page-06",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.medical,
    keywords: ["צור קשר","contact","wix"],
    nodes: buildCategoryPageNodes("contact", 5, {
      eyebrow: 'PRIVATE LINE',
      title: 'יצירת קשר\nבסגנון פרימיום',
      subtitle: 'קו פרטי למותגים יוקרתיים.',
      cta: 'השאירו פרטים',
      image: IMG.medical,
      images: [IMG.medical, IMG.abstract, IMG.hospitality, IMG.architecture, IMG.office, IMG.office, IMG.team, IMG.workspace, IMG.tech, IMG.finance],
      items: [{ title: 'מהיר', copy: 'חוזרים תוך יום.', meta: '01' }, { title: 'אנושי', copy: 'בלי בוטים.', meta: '02' }, { title: 'ברור', copy: 'בלי סיבובים.', meta: '03' }, { title: 'מדויק', copy: 'תיאום יומן.', meta: '04' }, { title: 'סגירה', copy: 'הצעה בכתב.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page07 = (() => {
  const meta = getRecipeMeta("contact", 6);
  return makePageSection({
    id: "section-contact-page-07",
    category: "contact",
    title: "יצירת קשר – קבלת פנים",
    previewLayout: "section-contact-page-07",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.abstract,
    keywords: ["צור קשר","contact","wix"],
    nodes: buildCategoryPageNodes("contact", 6, {
      eyebrow: 'WELCOME',
      title: 'דלת פתוחה\nלשיחה אמיתית',
      subtitle: 'טון חם לעסק מקומי.',
      cta: 'שלחו הודעה',
      image: IMG.abstract,
      images: [IMG.abstract, IMG.hospitality, IMG.architecture, IMG.office, IMG.office, IMG.team, IMG.workspace, IMG.tech, IMG.finance, IMG.medical],
      items: [{ title: 'טלפון', copy: 'שיחה ישירה.' }, { title: 'מייל', copy: 'מענה כתוב.' }, { title: 'וואטסאפ', copy: 'הודעה מהירה.' }, { title: 'כתובת', copy: 'ביקור במשרד.' }, { title: 'זום', copy: 'פגישה מרחוק.' }, { title: 'טופס', copy: 'השארת פרטים.' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page08 = (() => {
  const meta = getRecipeMeta("contact", 7);
  return makePageSection({
    id: "section-contact-page-08",
    category: "contact",
    title: "יצירת קשר – רשימה",
    previewLayout: "section-contact-page-08",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.hospitality,
    keywords: ["צור קשר","contact","wix"],
    nodes: buildCategoryPageNodes("contact", 7, {
      eyebrow: 'VISIT US',
      title: 'בואו לבקר\nאו כתבו מרחוק',
      subtitle: 'פרטי מיקום לצד מדיה.',
      cta: 'נווטו אלינו',
      image: IMG.hospitality,
      images: [IMG.hospitality, IMG.architecture, IMG.office, IMG.office, IMG.team, IMG.workspace, IMG.tech, IMG.finance, IMG.medical, IMG.abstract],
      items: [{ title: 'מהיר', copy: 'חוזרים תוך יום.', meta: '01' }, { title: 'אנושי', copy: 'בלי בוטים.', meta: '02' }, { title: 'ברור', copy: 'בלי סיבובים.', meta: '03' }, { title: 'מדויק', copy: 'תיאום יומן.', meta: '04' }, { title: 'סגירה', copy: 'הצעה בכתב.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page09 = (() => {
  const meta = getRecipeMeta("contact", 8);
  return makePageSection({
    id: "section-contact-page-09",
    category: "contact",
    title: "יצירת קשר – פסיפס",
    previewLayout: "section-contact-page-09",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.architecture,
    keywords: ["צור קשר","contact","wix"],
    nodes: buildCategoryPageNodes("contact", 8, {
      eyebrow: 'SUPPORT',
      title: 'שירות לקוחות\nשאפשר לסמוך עליו',
      subtitle: 'פסיפס ערוצי תמיכה.',
      cta: 'פתחו פנייה',
      image: IMG.architecture,
      images: [IMG.architecture, IMG.office, IMG.office, IMG.team, IMG.workspace, IMG.tech, IMG.finance, IMG.medical, IMG.abstract, IMG.hospitality],
      items: [{ title: 'טלפון', copy: 'שיחה ישירה.' }, { title: 'מייל', copy: 'מענה כתוב.' }, { title: 'וואטסאפ', copy: 'הודעה מהירה.' }, { title: 'כתובת', copy: 'ביקור במשרד.' }, { title: 'זום', copy: 'פגישה מרחוק.' }, { title: 'טופס', copy: 'השארת פרטים.' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page10 = (() => {
  const meta = getRecipeMeta("contact", 9);
  return makePageSection({
    id: "section-contact-page-10",
    category: "contact",
    title: "יצירת קשר – שעות פעילות",
    previewLayout: "section-contact-page-10",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.office,
    keywords: ["צור קשר","contact","wix"],
    nodes: buildCategoryPageNodes("contact", 9, {
      eyebrow: 'HOURS',
      title: 'מתי אנחנו\nזמינים בשבילכם',
      subtitle: 'אג׳נדת שעות + CTA.',
      cta: 'קבעו שיחה',
      image: IMG.office,
      images: [IMG.office, IMG.office, IMG.team, IMG.workspace, IMG.tech, IMG.finance, IMG.medical, IMG.abstract, IMG.hospitality, IMG.architecture],
      items: [{ title: 'מהיר', copy: 'חוזרים תוך יום.', meta: '01' }, { title: 'אנושי', copy: 'בלי בוטים.', meta: '02' }, { title: 'ברור', copy: 'בלי סיבובים.', meta: '03' }, { title: 'מדויק', copy: 'תיאום יומן.', meta: '04' }, { title: 'סגירה', copy: 'הצעה בכתב.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

export const CONTACT_PAGE_SHOWCASE_SECTIONS: VisualLibrarySectionTemplate[] = [
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
