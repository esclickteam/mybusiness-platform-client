import {
  absoluteLayout,
  boxNode,
  buttonNode,
  imageNode,
  textNode,
} from "./libraryFactories";
import { VISUAL_LIBRARY_IMAGES as IMG } from "./libraryAssets";
import type {
  VisualLibraryNodeTemplate,
  VisualLibrarySectionTemplate,
} from "./visualLibraryTypes";

const ink = "#111827";
const muted = "#6b7280";
const teal = "#0f766e";
const slate = "#334155";
const sand = "#f5f1e8";
const forest = "#14532d";
const navy = "#0b1f33";

const buttonDark = {
  color: "#ffffff",
  backgroundColor: ink,
  borderRadius: "12px",
  padding: "12px 22px",
  fontSize: "14px",
  fontWeight: "700",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
};

const buttonTeal = {
  ...buttonDark,
  backgroundColor: teal,
};

/** Live calendar mount — fills exactly the saved box position. */
function bookingMount(
  key: string,
  layout: ReturnType<typeof absoluteLayout>,
  variant: "week" | "month" = "week",
  style: Record<string, any> = {},
): VisualLibraryNodeTemplate {
  return {
    ...boxNode(
      key,
      {
        backgroundColor: "#ffffff",
        borderRadius: "20px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 16px 40px -24px rgba(15,23,42,0.35)",
        ...style,
      },
      layout,
      "יומן פגישות",
    ),
    attributes: {
      "data-bizuply-block": "booking",
      "data-bizuply-plugin": "booking",
      "data-bizuply-widget": "booking",
      "data-bizuply-booking-mount": "true",
      "data-bizuply-booking-variant": variant,
    },
  };
}

function booking(
  id: string,
  title: string,
  previewLayout: string,
  backgroundColor: string,
  minHeight: string,
  thumbnail: string,
  nodes: VisualLibraryNodeTemplate[],
): VisualLibrarySectionTemplate {
  return {
    id,
    kind: "section",
    tab: "sections",
    category: "booking",
    title,
    description: "יומן פגישות מחובר אוטומטית לתוסף יומן ותורים",
    keywords: [
      "יומן",
      "פגישות",
      "תורים",
      "booking",
      "calendar",
      "חודשי",
      "קביעת תור",
    ],
    previewLayout,
    backgroundColor,
    minHeight,
    thumbnail,
    nodes,
  };
}

/** 1 — פיצול נקי + שבוע */
const weekSplit = booking(
  "section-booking-showcase-calendar-split",
  "יומן פגישות — פיצול",
  "booking-showcase-calendar-split",
  "#f8fafc",
  "640px",
  IMG.meeting,
  [
    textNode(
      "eyebrow",
      "קביעת פגישה אונליין",
      {
        color: teal,
        fontSize: "12px",
        fontWeight: "800",
        letterSpacing: "0.14em",
      },
      absoluteLayout(48, 70, "300px", "24px", 20),
    ),
    textNode(
      "title",
      "הזמן שלכם\nמנוהל חכם",
      {
        color: ink,
        fontSize: "48px",
        fontWeight: "700",
        lineHeight: "1.05",
        letterSpacing: "-0.04em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(48, 110, "400px", "130px", 20),
    ),
    textNode(
      "copy",
      "הלקוח בוחר שירות ותאריך — התור נכנס ישירות ליומן העסק.",
      { color: muted, fontSize: "16px", lineHeight: "1.65" },
      absoluteLayout(48, 260, "380px", "70px", 20),
    ),
    buttonNode(
      "cta",
      "קביעת תור",
      buttonTeal,
      absoluteLayout(48, 360, "160px", "48px", 22),
      "#booking",
    ),
    bookingMount(
      "booking-mount",
      absoluteLayout(480, 48, "540px", "540px", 12),
      "week",
    ),
  ],
);

/** 2 — לוח חודשי מרכזי */
const monthCentered = booking(
  "section-booking-showcase-month-centered",
  "יומן פגישות — לוח חודשי",
  "booking-showcase-month-centered",
  "#ffffff",
  "760px",
  IMG.office,
  [
    textNode(
      "eyebrow",
      "לוח חודשי",
      {
        color: muted,
        fontSize: "12px",
        fontWeight: "800",
        letterSpacing: "0.16em",
        textAlign: "center",
      },
      absoluteLayout(300, 36, "480px", "24px", 20),
    ),
    textNode(
      "title",
      "בחרו יום מהחודש וקבעו פגישה",
      {
        color: ink,
        fontSize: "38px",
        fontWeight: "750",
        letterSpacing: "-0.03em",
        textAlign: "center",
      },
      absoluteLayout(160, 70, "760px", "55px", 20),
    ),
    textNode(
      "copy",
      "תצוגת חודש מלאה — מסונכרנת לזמינות האמיתית ביומן.",
      {
        color: muted,
        fontSize: "16px",
        textAlign: "center",
      },
      absoluteLayout(250, 135, "580px", "36px", 20),
    ),
    bookingMount(
      "booking-mount",
      absoluteLayout(200, 190, "680px", "520px", 12),
      "month",
    ),
  ],
);

/** 3 — לוח חודשי כהה לייעוץ / עסקים */
const monthDark = booking(
  "section-booking-showcase-month-dark",
  "יומן פגישות — חודשי כהה",
  "booking-showcase-month-dark",
  navy,
  "700px",
  IMG.workspace,
  [
    textNode(
      "eyebrow",
      "CONSULTING · BOOKING",
      {
        color: "#94a3b8",
        fontSize: "12px",
        fontWeight: "800",
        letterSpacing: "0.16em",
      },
      absoluteLayout(56, 70, "280px", "24px", 20),
    ),
    textNode(
      "title",
      "פגישת ייעוץ\nבלוח החודש",
      {
        color: "#ffffff",
        fontSize: "48px",
        fontWeight: "650",
        lineHeight: "1.05",
        letterSpacing: "-0.04em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(56, 110, "400px", "130px", 20),
    ),
    textNode(
      "copy",
      "מתאים ליועצים, עורכי דין, מאמנים וקליניקות.",
      { color: "#94a3b8", fontSize: "16px", lineHeight: "1.6" },
      absoluteLayout(56, 265, "360px", "60px", 20),
    ),
    buttonNode(
      "cta",
      "קביעת פגישה",
      { ...buttonDark, backgroundColor: "#e2e8f0", color: navy },
      absoluteLayout(56, 350, "180px", "48px", 22),
      "#booking",
    ),
    bookingMount(
      "booking-mount",
      absoluteLayout(480, 50, "540px", "600px", 12),
      "month",
      { backgroundColor: "#ffffff" },
    ),
  ],
);

/** 4 — שירותים + שבוע */
const servicesWeek = booking(
  "section-booking-showcase-services-slots",
  "יומן פגישות — שירותים ושעות",
  "booking-showcase-services-slots",
  "#f3f4f6",
  "680px",
  IMG.medical,
  [
    textNode(
      "title",
      "בחרו שירות וקבעו תור",
      {
        color: ink,
        fontSize: "40px",
        fontWeight: "750",
        letterSpacing: "-0.03em",
      },
      absoluteLayout(48, 48, "500px", "55px", 20),
    ),
    textNode(
      "copy",
      "השירותים והזמינות נמשכים אוטומטית מהיומן של העסק.",
      { color: muted, fontSize: "16px" },
      absoluteLayout(48, 115, "460px", "40px", 20),
    ),
    ...[
      ["ייעוץ ראשוני", "30 דק׳"],
      ["טיפול / מפגש", "60 דק׳"],
      ["חבילת ליווי", "90 דק׳"],
    ].flatMap(([title, meta], index) => {
      const y = 180 + index * 100;
      return [
        boxNode(
          `svc-${index}`,
          {
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            border: index === 0 ? `2px solid ${teal}` : "1px solid #e5e7eb",
          },
          absoluteLayout(48, y, "400px", "84px", 10),
        ),
        textNode(
          `svc-title-${index}`,
          title,
          { color: ink, fontSize: "18px", fontWeight: "800" },
          absoluteLayout(72, y + 18, "320px", "28px", 20),
        ),
        textNode(
          `svc-meta-${index}`,
          meta,
          { color: muted, fontSize: "14px", fontWeight: "600" },
          absoluteLayout(72, y + 48, "200px", "24px", 20),
        ),
      ];
    }),
    bookingMount(
      "booking-mount",
      absoluteLayout(500, 48, "520px", "580px", 12),
      "week",
    ),
  ],
);

/** 5 — מינימל עסקי */
const minimalBusiness = booking(
  "section-booking-showcase-minimal-cta",
  "יומן פגישות — מינימלי עסקי",
  "booking-showcase-minimal-cta",
  "#eef2f7",
  "560px",
  IMG.laptop,
  [
    textNode(
      "title",
      "מוכנים לפגישה?",
      {
        color: ink,
        fontSize: "42px",
        fontWeight: "750",
        letterSpacing: "-0.035em",
        textAlign: "center",
      },
      absoluteLayout(200, 48, "680px", "55px", 20),
    ),
    textNode(
      "copy",
      "בחרו מועד פנוי מהיומן — בלי שיחות ובלי המתנה.",
      {
        color: muted,
        fontSize: "16px",
        textAlign: "center",
      },
      absoluteLayout(260, 115, "560px", "36px", 20),
    ),
    bookingMount(
      "booking-mount",
      absoluteLayout(220, 170, "640px", "340px", 12),
      "week",
    ),
  ],
);

/** 6 — ספא / וולנס ירוק (לא ורוד) */
const wellnessGreen = booking(
  "section-booking-showcase-wellness-green",
  "יומן פגישות — וולנס",
  "booking-showcase-wellness-green",
  "#ecfdf5",
  "660px",
  IMG.wellness,
  [
    imageNode(
      "photo",
      IMG.wellness,
      { borderRadius: "18px", objectFit: "cover" },
      absoluteLayout(48, 60, "380px", "520px", 8),
      "וולנס",
    ),
    textNode(
      "eyebrow",
      "WELLNESS BOOKING",
      {
        color: forest,
        fontSize: "12px",
        fontWeight: "800",
        letterSpacing: "0.14em",
      },
      absoluteLayout(480, 80, "280px", "24px", 20),
    ),
    textNode(
      "title",
      "שמרו מקום\nלטיפול הבא",
      {
        color: forest,
        fontSize: "44px",
        fontWeight: "700",
        lineHeight: "1.05",
        whiteSpace: "pre-line",
      },
      absoluteLayout(480, 120, "420px", "120px", 20),
    ),
    bookingMount(
      "booking-mount",
      absoluteLayout(480, 270, "520px", "340px", 12),
      "week",
      { border: "1px solid #bbf7d0" },
    ),
  ],
);

/** 7 — לוח חודשי צדדי לקליניקה */
const clinicMonth = booking(
  "section-booking-showcase-clinic-month",
  "יומן פגישות — קליניקה חודשי",
  "booking-showcase-clinic-month",
  "#f8fafc",
  "720px",
  IMG.medical,
  [
    textNode(
      "eyebrow",
      "CLINIC SCHEDULE",
      {
        color: slate,
        fontSize: "12px",
        fontWeight: "800",
        letterSpacing: "0.14em",
      },
      absoluteLayout(48, 56, "260px", "24px", 20),
    ),
    textNode(
      "title",
      "תאמו תור\nלחודש הקרוב",
      {
        color: ink,
        fontSize: "46px",
        fontWeight: "700",
        lineHeight: "1.05",
        whiteSpace: "pre-line",
      },
      absoluteLayout(48, 100, "380px", "130px", 20),
    ),
    textNode(
      "copy",
      "לוח חודשי ברור לקליניקות, מטפלים ונותני שירות.",
      { color: muted, fontSize: "16px", lineHeight: "1.6" },
      absoluteLayout(48, 250, "360px", "60px", 20),
    ),
    ...["א׳–ה׳ 09:00–19:00", "ו׳ 09:00–13:00", "אישור תוך שעתיים"].map(
      (label, index) =>
        textNode(
          `meta-${index}`,
          label,
          { color: slate, fontSize: "14px", fontWeight: "700" },
          absoluteLayout(48, 340 + index * 36, "320px", "28px", 20),
        ),
    ),
    bookingMount(
      "booking-mount",
      absoluteLayout(460, 48, "560px", "620px", 12),
      "month",
    ),
  ],
);

/** 8 — כרטיס חול / אדריכלות */
const sandCard = booking(
  "section-booking-showcase-compact-card",
  "יומן פגישות — כרטיס חול",
  "booking-showcase-compact-card",
  sand,
  "600px",
  IMG.architecture,
  [
    boxNode(
      "panel",
      {
        backgroundColor: "#ffffff",
        borderRadius: "28px",
        border: "1px solid #e7e0d4",
      },
      absoluteLayout(70, 50, "940px", "500px", 5),
    ),
    textNode(
      "eyebrow",
      "STUDIO APPOINTMENTS",
      {
        color: "#8a7f6d",
        fontSize: "12px",
        fontWeight: "800",
        letterSpacing: "0.14em",
      },
      absoluteLayout(120, 100, "280px", "24px", 20),
    ),
    textNode(
      "title",
      "פגישה בסטודיו\nהשבוע",
      {
        color: "#1c1915",
        fontSize: "42px",
        fontWeight: "700",
        lineHeight: "1.05",
        whiteSpace: "pre-line",
      },
      absoluteLayout(120, 145, "340px", "120px", 20),
    ),
    textNode(
      "copy",
      "עיצוב ניטרלי למותגים, סטודיות ומשרדים.",
      { color: "#7a7166", fontSize: "15px", lineHeight: "1.6" },
      absoluteLayout(120, 290, "300px", "50px", 20),
    ),
    buttonNode(
      "cta",
      "קביעת פגישה",
      { ...buttonDark, backgroundColor: "#1c1915", borderRadius: "10px" },
      absoluteLayout(120, 370, "170px", "48px", 22),
      "#booking",
    ),
    bookingMount(
      "booking-mount",
      absoluteLayout(500, 90, "450px", "420px", 12),
      "week",
      { border: "1px solid #e7e0d4", boxShadow: "none" },
    ),
  ],
);

/** 9 — לוח חודשי מלא רוחב */
const monthWide = booking(
  "section-booking-showcase-month-wide",
  "יומן פגישות — חודשי רחב",
  "booking-showcase-month-wide",
  "#ffffff",
  "780px",
  IMG.city,
  [
    textNode(
      "title",
      "היומן החודשי של העסק",
      {
        color: ink,
        fontSize: "40px",
        fontWeight: "750",
        letterSpacing: "-0.03em",
      },
      absoluteLayout(48, 40, "700px", "55px", 20),
    ),
    textNode(
      "copy",
      "תצוגה רחבה לבחירת תאריך — מתחבר אוטומטית לתוסף היומן.",
      { color: muted, fontSize: "16px" },
      absoluteLayout(48, 105, "620px", "36px", 20),
    ),
    bookingMount(
      "booking-mount",
      absoluteLayout(48, 160, "980px", "560px", 12),
      "month",
    ),
  ],
);

/** 10 — ספורט / כושר */
const fitnessWeek = booking(
  "section-booking-showcase-fitness",
  "יומן פגישות — כושר ואימון",
  "booking-showcase-fitness",
  "#0a0a0a",
  "640px",
  IMG.fitness,
  [
    textNode(
      "eyebrow",
      "TRAINING SESSIONS",
      {
        color: "#a3e635",
        fontSize: "12px",
        fontWeight: "800",
        letterSpacing: "0.16em",
      },
      absoluteLayout(48, 70, "280px", "24px", 20),
    ),
    textNode(
      "title",
      "קבעו אימון\nבלוח הזמנים",
      {
        color: "#ffffff",
        fontSize: "48px",
        fontWeight: "700",
        lineHeight: "1.05",
        whiteSpace: "pre-line",
      },
      absoluteLayout(48, 115, "400px", "130px", 20),
    ),
    textNode(
      "copy",
      "למאמנים אישיים, סטודיו יוגה וחדרי כושר.",
      { color: "#9ca3af", fontSize: "16px" },
      absoluteLayout(48, 270, "360px", "50px", 20),
    ),
    buttonNode(
      "cta",
      "קביעת אימון",
      { ...buttonDark, backgroundColor: "#a3e635", color: "#0a0a0a" },
      absoluteLayout(48, 350, "170px", "48px", 22),
      "#booking",
    ),
    bookingMount(
      "booking-mount",
      absoluteLayout(480, 48, "540px", "540px", 12),
      "week",
    ),
  ],
);

export const BOOKING_SHOWCASE_SECTIONS: VisualLibrarySectionTemplate[] = [
  weekSplit,
  monthCentered,
  monthDark,
  servicesWeek,
  minimalBusiness,
  wellnessGreen,
  clinicMonth,
  sandCard,
  monthWide,
  fitnessWeek,
];

export const DEFAULT_BOOKING_SECTION_ID =
  "section-booking-showcase-calendar-split";
