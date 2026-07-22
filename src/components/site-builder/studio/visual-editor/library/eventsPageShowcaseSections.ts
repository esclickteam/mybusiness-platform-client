import { VISUAL_LIBRARY_IMAGES as IMG } from "./libraryAssets";
import type { VisualLibrarySectionTemplate } from "./visualLibraryTypes";
import {
  buildCategoryPageNodes,
  getRecipeMeta,
  makePageSection,
} from "./pageShowcaseHelpers";

const page01 = (() => {
  const meta = getRecipeMeta("events", 0);
  return makePageSection({
    id: "section-events-page-01",
    category: "events",
    title: "אירועים – כרטיס",
    previewLayout: "section-events-page-01",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.event,
    keywords: ["אירועים","events","wix"],
    nodes: buildCategoryPageNodes("events", 0, {
      eyebrow: 'EVENTS',
      title: 'אירועים\nששווה להגיע אליהם',
      subtitle: 'כרטיס אירוע דרמטי עם stub.',
      cta: 'לרכישת כרטיס',
      secondaryCta: 'לכל האירועים',
      image: IMG.event,
      images: [IMG.event, IMG.stage, IMG.hospitality, IMG.travel, IMG.team, IMG.city, IMG.abstract, IMG.cafe, IMG.meeting, IMG.hands, IMG.studio, IMG.nature],
      items: [{ title: 'הופעה', copy: 'במה חיה.', meta: '20:00' }, { title: 'סדנה', copy: 'למידה מעשית.', meta: '18:30' }, { title: 'מפגש', copy: 'נטוורקינג.', meta: '19:00' }, { title: 'השקה', copy: 'מוצר חדש.', meta: '17:00' }, { title: 'כנס', copy: 'יום מלא.', meta: '09:00' }, { title: 'ערב', copy: 'אווירה.', meta: '21:00' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page02 = (() => {
  const meta = getRecipeMeta("events", 1);
  return makePageSection({
    id: "section-events-page-02",
    category: "events",
    title: "אירועים – אג׳נדה",
    previewLayout: "section-events-page-02",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.stage,
    keywords: ["אירועים","events","wix"],
    nodes: buildCategoryPageNodes("events", 1, {
      eyebrow: 'SCHEDULE',
      title: 'לו״ז מלא\nליום האירוע',
      subtitle: 'שורות אג׳נדה ברורות.',
      cta: 'הורידו לו״ז',
      image: IMG.stage,
      images: [IMG.stage, IMG.hospitality, IMG.travel, IMG.team, IMG.city, IMG.abstract, IMG.cafe, IMG.meeting, IMG.hands, IMG.studio, IMG.nature, IMG.event],
      items: [{ title: 'שמירה', copy: 'RSVP.', meta: '01' }, { title: 'תזכורת', copy: 'הודעה.', meta: '02' }, { title: 'הגעה', copy: 'צ׳ק אין.', meta: '03' }, { title: 'חוויה', copy: 'האירוע.', meta: '04' }, { title: 'אחרי', copy: 'סיכום.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page03 = (() => {
  const meta = getRecipeMeta("events", 2);
  return makePageSection({
    id: "section-events-page-03",
    category: "events",
    title: "אירועים – מקום",
    previewLayout: "section-events-page-03",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.hospitality,
    keywords: ["אירועים","events","wix"],
    nodes: buildCategoryPageNodes("events", 2, {
      eyebrow: 'VENUE',
      title: 'המקום\nשעושה את האווירה',
      subtitle: 'קייס מקום + מדדים.',
      cta: 'גלו את המקום',
      image: IMG.hospitality,
      images: [IMG.hospitality, IMG.travel, IMG.team, IMG.city, IMG.abstract, IMG.cafe, IMG.meeting, IMG.hands, IMG.studio, IMG.nature, IMG.event, IMG.stage],
      items: [{ title: 'הופעה', copy: 'במה חיה.', meta: '20:00' }, { title: 'סדנה', copy: 'למידה מעשית.', meta: '18:30' }, { title: 'מפגש', copy: 'נטוורקינג.', meta: '19:00' }, { title: 'השקה', copy: 'מוצר חדש.', meta: '17:00' }, { title: 'כנס', copy: 'יום מלא.', meta: '09:00' }, { title: 'ערב', copy: 'אווירה.', meta: '21:00' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page04 = (() => {
  const meta = getRecipeMeta("events", 3);
  return makePageSection({
    id: "section-events-page-04",
    category: "events",
    title: "אירועים – לוח",
    previewLayout: "section-events-page-04",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.travel,
    keywords: ["אירועים","events","wix"],
    nodes: buildCategoryPageNodes("events", 3, {
      eyebrow: 'CALENDAR',
      title: 'שישה אירועים\nבצבעים שונים',
      subtitle: 'כרטיסי אירוע חיים.',
      cta: 'ללוח השנה',
      image: IMG.travel,
      images: [IMG.travel, IMG.team, IMG.city, IMG.abstract, IMG.cafe, IMG.meeting, IMG.hands, IMG.studio, IMG.nature, IMG.event, IMG.stage, IMG.hospitality],
      items: [{ title: 'שמירה', copy: 'RSVP.', meta: '01' }, { title: 'תזכורת', copy: 'הודעה.', meta: '02' }, { title: 'הגעה', copy: 'צ׳ק אין.', meta: '03' }, { title: 'חוויה', copy: 'האירוע.', meta: '04' }, { title: 'אחרי', copy: 'סיכום.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page05 = (() => {
  const meta = getRecipeMeta("events", 4);
  return makePageSection({
    id: "section-events-page-05",
    category: "events",
    title: "אירועים – דוברים",
    previewLayout: "section-events-page-05",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.team,
    keywords: ["אירועים","events","wix"],
    nodes: buildCategoryPageNodes("events", 4, {
      eyebrow: 'LINEUP',
      title: 'הדוברים\nשלא כדאי לפספס',
      subtitle: 'גריד דיוקנאות לליינאפ.',
      cta: 'לפרטי הדוברים',
      image: IMG.team,
      images: [IMG.team, IMG.city, IMG.abstract, IMG.cafe, IMG.meeting, IMG.hands, IMG.studio, IMG.nature, IMG.event, IMG.stage, IMG.hospitality, IMG.travel],
      items: [{ title: 'הופעה', copy: 'במה חיה.', meta: '20:00' }, { title: 'סדנה', copy: 'למידה מעשית.', meta: '18:30' }, { title: 'מפגש', copy: 'נטוורקינג.', meta: '19:00' }, { title: 'השקה', copy: 'מוצר חדש.', meta: '17:00' }, { title: 'כנס', copy: 'יום מלא.', meta: '09:00' }, { title: 'ערב', copy: 'אווירה.', meta: '21:00' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page06 = (() => {
  const meta = getRecipeMeta("events", 5);
  return makePageSection({
    id: "section-events-page-06",
    category: "events",
    title: "אירועים – לילה",
    previewLayout: "section-events-page-06",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.city,
    keywords: ["אירועים","events","wix"],
    nodes: buildCategoryPageNodes("events", 5, {
      eyebrow: 'NIGHT',
      title: 'אירוע לילה\nבלתי נשכח',
      subtitle: 'אווירת לילה סינמטית.',
      cta: 'הזמינו כרטיס',
      image: IMG.city,
      images: [IMG.city, IMG.abstract, IMG.cafe, IMG.meeting, IMG.hands, IMG.studio, IMG.nature, IMG.event, IMG.stage, IMG.hospitality, IMG.travel, IMG.team],
      items: [{ title: 'שמירה', copy: 'RSVP.', meta: '01' }, { title: 'תזכורת', copy: 'הודעה.', meta: '02' }, { title: 'הגעה', copy: 'צ׳ק אין.', meta: '03' }, { title: 'חוויה', copy: 'האירוע.', meta: '04' }, { title: 'אחרי', copy: 'סיכום.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page07 = (() => {
  const meta = getRecipeMeta("events", 6);
  return makePageSection({
    id: "section-events-page-07",
    category: "events",
    title: "אירועים – סדנה",
    previewLayout: "section-events-page-07",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.abstract,
    keywords: ["אירועים","events","wix"],
    nodes: buildCategoryPageNodes("events", 6, {
      eyebrow: 'GATHER',
      title: 'מפגשים\nבאווירה נעימה',
      subtitle: 'אירועים קהילתיים רכים.',
      cta: 'אני מגיע/ה',
      image: IMG.abstract,
      images: [IMG.abstract, IMG.cafe, IMG.meeting, IMG.hands, IMG.studio, IMG.nature, IMG.event, IMG.stage, IMG.hospitality, IMG.travel, IMG.team, IMG.city],
      items: [{ title: 'הופעה', copy: 'במה חיה.', meta: '20:00' }, { title: 'סדנה', copy: 'למידה מעשית.', meta: '18:30' }, { title: 'מפגש', copy: 'נטוורקינג.', meta: '19:00' }, { title: 'השקה', copy: 'מוצר חדש.', meta: '17:00' }, { title: 'כנס', copy: 'יום מלא.', meta: '09:00' }, { title: 'ערב', copy: 'אווירה.', meta: '21:00' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page08 = (() => {
  const meta = getRecipeMeta("events", 7);
  return makePageSection({
    id: "section-events-page-08",
    category: "events",
    title: "אירועים – ספירה",
    previewLayout: "section-events-page-08",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.cafe,
    keywords: ["אירועים","events","wix"],
    nodes: buildCategoryPageNodes("events", 7, {
      eyebrow: 'COMMUNITY',
      title: 'קהילה\nשגדלה בכל מפגש',
      subtitle: 'מספרי קהל על רקע כהה.',
      cta: 'הצטרפו',
      image: IMG.cafe,
      images: [IMG.cafe, IMG.meeting, IMG.hands, IMG.studio, IMG.nature, IMG.event, IMG.stage, IMG.hospitality, IMG.travel, IMG.team, IMG.city, IMG.abstract],
      items: [{ title: 'שמירה', copy: 'RSVP.', meta: '01' }, { title: 'תזכורת', copy: 'הודעה.', meta: '02' }, { title: 'הגעה', copy: 'צ׳ק אין.', meta: '03' }, { title: 'חוויה', copy: 'האירוע.', meta: '04' }, { title: 'אחרי', copy: 'סיכום.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page09 = (() => {
  const meta = getRecipeMeta("events", 8);
  return makePageSection({
    id: "section-events-page-09",
    category: "events",
    title: "אירועים – לו״ז",
    previewLayout: "section-events-page-09",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.meeting,
    keywords: ["אירועים","events","wix"],
    nodes: buildCategoryPageNodes("events", 8, {
      eyebrow: 'FLOW',
      title: 'מהרעיון\nעד סוף הערב',
      subtitle: 'ציר זמן למשתתפים.',
      cta: 'ללו״ז המלא',
      image: IMG.meeting,
      images: [IMG.meeting, IMG.hands, IMG.studio, IMG.nature, IMG.event, IMG.stage, IMG.hospitality, IMG.travel, IMG.team, IMG.city, IMG.abstract, IMG.cafe],
      items: [{ title: 'הופעה', copy: 'במה חיה.', meta: '20:00' }, { title: 'סדנה', copy: 'למידה מעשית.', meta: '18:30' }, { title: 'מפגש', copy: 'נטוורקינג.', meta: '19:00' }, { title: 'השקה', copy: 'מוצר חדש.', meta: '17:00' }, { title: 'כנס', copy: 'יום מלא.', meta: '09:00' }, { title: 'ערב', copy: 'אווירה.', meta: '21:00' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

const page10 = (() => {
  const meta = getRecipeMeta("events", 9);
  return makePageSection({
    id: "section-events-page-10",
    category: "events",
    title: "אירועים – RSVP",
    previewLayout: "section-events-page-10",
    backgroundColor: meta.backgroundColor,
    minHeight: meta.minHeight,
    thumbnail: IMG.hands,
    keywords: ["אירועים","events","wix"],
    nodes: buildCategoryPageNodes("events", 9, {
      eyebrow: 'RSVP',
      title: 'שמרו מקום\nלפני שייגמר',
      subtitle: 'טופס RSVP דומיננטי.',
      cta: 'RSVP',
      image: IMG.hands,
      images: [IMG.hands, IMG.studio, IMG.nature, IMG.event, IMG.stage, IMG.hospitality, IMG.travel, IMG.team, IMG.city, IMG.abstract, IMG.cafe, IMG.meeting],
      items: [{ title: 'שמירה', copy: 'RSVP.', meta: '01' }, { title: 'תזכורת', copy: 'הודעה.', meta: '02' }, { title: 'הגעה', copy: 'צ׳ק אין.', meta: '03' }, { title: 'חוויה', copy: 'האירוע.', meta: '04' }, { title: 'אחרי', copy: 'סיכום.', meta: '05' }],
      stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
    }),
  });
})();

export const EVENTS_PAGE_SHOWCASE_SECTIONS: VisualLibrarySectionTemplate[] = [
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
