import { VISUAL_LIBRARY_IMAGES as IMG } from "./libraryAssets";
import type { VisualLibrarySectionTemplate } from "./visualLibraryTypes";
import {
  buildLayoutNodes,
  makePageSection,
  type PageLayoutKind,
} from "./pageShowcaseHelpers";

const page01 = makePageSection({
  id: "section-events-page-01",
  category: "events",
  title: "אירועים – כחול עסקי",
  previewLayout: "section-events-page-01",
  backgroundColor: "#ffffff",
  minHeight: "1600px",
  thumbnail: IMG.event,
  keywords: ["אירועים","events","wix"],
  nodes: buildLayoutNodes("split" as PageLayoutKind, {
    eyebrow: 'EVENTS',
    title: 'אירועים\nששווה להגיע אליהם',
    subtitle: 'הדגשת אירוע קרוב בכחול.',
    cta: 'לרכישת כרטיס',
    secondaryCta: 'לכל האירועים',
    image: IMG.event,
    items: [{ title: 'הופעה', copy: 'במה חיה.' }, { title: 'סדנה', copy: 'למידה מעשית.' }, { title: 'מפגש', copy: 'נטוורקינג.' }, { title: 'השקה', copy: 'מוצר חדש.' }, { title: 'כנס', copy: 'יום מלא.' }, { title: 'ערב', copy: 'אווירה.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page02 = makePageSection({
  id: "section-events-page-02",
  category: "events",
  title: "אירועים – Editorial חם",
  previewLayout: "section-events-page-02",
  backgroundColor: "#f7f1ea",
  minHeight: "1500px",
  thumbnail: IMG.hospitality,
  keywords: ["אירועים","events","wix"],
  nodes: buildLayoutNodes("center" as PageLayoutKind, {
    eyebrow: 'UPCOMING',
    title: 'מה קורה\nהחודש',
    subtitle: 'לוח אירועים רגוע.',
    cta: 'שמרו מקום',
    image: IMG.hospitality,
    items: [{ title: 'שמירה', copy: 'RSVP.', meta: '01' }, { title: 'תזכורת', copy: 'הודעה.', meta: '02' }, { title: 'הגעה', copy: 'צ׳ק אין.', meta: '03' }, { title: 'חוויה', copy: 'האירוע.', meta: '04' }, { title: 'אחרי', copy: 'סיכום.', meta: '05' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page03 = makePageSection({
  id: "section-events-page-03",
  category: "events",
  title: "אירועים – מגזין שחור",
  previewLayout: "section-events-page-03",
  backgroundColor: "#ffffff",
  minHeight: "1550px",
  thumbnail: IMG.event,
  keywords: ["אירועים","events","wix"],
  nodes: buildLayoutNodes("magazine" as PageLayoutKind, {
    eyebrow: 'EXPERIENCE',
    title: 'חוויות\nשנשארות',
    subtitle: 'אירוע בסגנון מגזין.',
    cta: 'גלו חוויה',
    image: IMG.event,
    items: [{ title: 'הופעה', copy: 'במה חיה.' }, { title: 'סדנה', copy: 'למידה מעשית.' }, { title: 'מפגש', copy: 'נטוורקינג.' }, { title: 'השקה', copy: 'מוצר חדש.' }, { title: 'כנס', copy: 'יום מלא.' }, { title: 'ערב', copy: 'אווירה.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page04 = makePageSection({
  id: "section-events-page-04",
  category: "events",
  title: "אירועים – כרטיסים צבעוניים",
  previewLayout: "section-events-page-04",
  backgroundColor: "#eef6ff",
  minHeight: "1500px",
  thumbnail: IMG.travel,
  keywords: ["אירועים","events","wix"],
  nodes: buildLayoutNodes("cards" as PageLayoutKind, {
    eyebrow: 'CALENDAR',
    title: 'שישה אירועים\nבצבעים שונים',
    subtitle: 'כרטיסי אירוע חיים.',
    cta: 'ללוח השנה',
    image: IMG.travel,
    items: [{ title: 'שמירה', copy: 'RSVP.', meta: '01' }, { title: 'תזכורת', copy: 'הודעה.', meta: '02' }, { title: 'הגעה', copy: 'צ׳ק אין.', meta: '03' }, { title: 'חוויה', copy: 'האירוע.', meta: '04' }, { title: 'אחרי', copy: 'סיכום.', meta: '05' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page05 = makePageSection({
  id: "section-events-page-05",
  category: "events",
  title: "אירועים – ציר סגול",
  previewLayout: "section-events-page-05",
  backgroundColor: "#f6f4ff",
  minHeight: "1580px",
  thumbnail: IMG.event,
  keywords: ["אירועים","events","wix"],
  nodes: buildLayoutNodes("timeline" as PageLayoutKind, {
    eyebrow: 'SCHEDULE',
    title: 'לו״ז מלא\nליום האירוע',
    subtitle: 'ציר זמן למשתתפים.',
    cta: 'הורידו לו״ז',
    image: IMG.event,
    items: [{ title: 'הופעה', copy: 'במה חיה.' }, { title: 'סדנה', copy: 'למידה מעשית.' }, { title: 'מפגש', copy: 'נטוורקינג.' }, { title: 'השקה', copy: 'מוצר חדש.' }, { title: 'כנס', copy: 'יום מלא.' }, { title: 'ערב', copy: 'אווירה.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page06 = makePageSection({
  id: "section-events-page-06",
  category: "events",
  title: "אירועים – לוח מספרים",
  previewLayout: "section-events-page-06",
  backgroundColor: "#111827",
  minHeight: "1480px",
  thumbnail: IMG.team,
  keywords: ["אירועים","events","wix"],
  nodes: buildLayoutNodes("stats" as PageLayoutKind, {
    eyebrow: 'COMMUNITY',
    title: 'קהילה\nשגדלה בכל מפגש',
    subtitle: 'מספרי קהל על רקע כהה.',
    cta: 'הצטרפו',
    image: IMG.team,
    items: [{ title: 'שמירה', copy: 'RSVP.', meta: '01' }, { title: 'תזכורת', copy: 'הודעה.', meta: '02' }, { title: 'הגעה', copy: 'צ׳ק אין.', meta: '03' }, { title: 'חוויה', copy: 'האירוע.', meta: '04' }, { title: 'אחרי', copy: 'סיכום.', meta: '05' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page07 = makePageSection({
  id: "section-events-page-07",
  category: "events",
  title: "אירועים – קולנוע זהב",
  previewLayout: "section-events-page-07",
  backgroundColor: "#09090b",
  minHeight: "1500px",
  thumbnail: IMG.abstract,
  keywords: ["אירועים","events","wix"],
  nodes: buildLayoutNodes("dark" as PageLayoutKind, {
    eyebrow: 'NIGHT',
    title: 'אירוע לילה\nבלתי נשכח',
    subtitle: 'אווירת לילה שחורה-זהב.',
    cta: 'הזמינו כרטיס',
    image: IMG.abstract,
    items: [{ title: 'הופעה', copy: 'במה חיה.' }, { title: 'סדנה', copy: 'למידה מעשית.' }, { title: 'מפגש', copy: 'נטוורקינג.' }, { title: 'השקה', copy: 'מוצר חדש.' }, { title: 'כנס', copy: 'יום מלא.' }, { title: 'ערב', copy: 'אווירה.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page08 = makePageSection({
  id: "section-events-page-08",
  category: "events",
  title: "אירועים – לייפסטייל ורוד",
  previewLayout: "section-events-page-08",
  backgroundColor: "#fde8e4",
  minHeight: "1520px",
  thumbnail: IMG.hospitality,
  keywords: ["אירועים","events","wix"],
  nodes: buildLayoutNodes("lifestyle" as PageLayoutKind, {
    eyebrow: 'GATHER',
    title: 'מפגשים\nבאווירה נעימה',
    subtitle: 'אירועים קהילתיים רכים.',
    cta: 'אני מגיע/ה',
    image: IMG.hospitality,
    items: [{ title: 'שמירה', copy: 'RSVP.', meta: '01' }, { title: 'תזכורת', copy: 'הודעה.', meta: '02' }, { title: 'הגעה', copy: 'צ׳ק אין.', meta: '03' }, { title: 'חוויה', copy: 'האירוע.', meta: '04' }, { title: 'אחרי', copy: 'סיכום.', meta: '05' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page09 = makePageSection({
  id: "section-events-page-09",
  category: "events",
  title: "אירועים – רשימה ירוקה",
  previewLayout: "section-events-page-09",
  backgroundColor: "#f0faf4",
  minHeight: "1450px",
  thumbnail: IMG.event,
  keywords: ["אירועים","events","wix"],
  nodes: buildLayoutNodes("listMedia" as PageLayoutKind, {
    eyebrow: 'LINEUP',
    title: 'הליינאפ\nהמלא',
    subtitle: 'רשימת מופעים לצד ויזואל.',
    cta: 'לפרטי האירוע',
    image: IMG.event,
    items: [{ title: 'הופעה', copy: 'במה חיה.' }, { title: 'סדנה', copy: 'למידה מעשית.' }, { title: 'מפגש', copy: 'נטוורקינג.' }, { title: 'השקה', copy: 'מוצר חדש.' }, { title: 'כנס', copy: 'יום מלא.' }, { title: 'ערב', copy: 'אווירה.' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

const page10 = makePageSection({
  id: "section-events-page-10",
  category: "events",
  title: "אירועים – טופס כתום",
  previewLayout: "section-events-page-10",
  backgroundColor: "#fff7ed",
  minHeight: "1450px",
  thumbnail: IMG.hospitality,
  keywords: ["אירועים","events","wix"],
  nodes: buildLayoutNodes("ctaForm" as PageLayoutKind, {
    eyebrow: 'RSVP',
    title: 'שמרו מקום\nלפני שייגמר',
    subtitle: 'טופס RSVP כתום.',
    cta: 'RSVP',
    image: IMG.hospitality,
    items: [{ title: 'שמירה', copy: 'RSVP.', meta: '01' }, { title: 'תזכורת', copy: 'הודעה.', meta: '02' }, { title: 'הגעה', copy: 'צ׳ק אין.', meta: '03' }, { title: 'חוויה', copy: 'האירוע.', meta: '04' }, { title: 'אחרי', copy: 'סיכום.', meta: '05' }],
    stats: [{ value: '98%', label: 'שביעות רצון' }, { value: '3x', label: 'צמיחה' }, { value: '14', label: 'ימים' }, { value: '5★', label: 'דירוג' }],
  }),
});

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
