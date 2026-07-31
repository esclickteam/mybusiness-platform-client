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

/** Colors outside the site-theme remap map — never become pink/primary. */
const ink = "#0b1220";
const muted = "#5c6570";
const teal = "#0f766e";
const slate = "#2f3a46";
const sand = "#f3eee4";
const forest = "#174a2c";
const navy = "#0a1628";
const charcoal = "#1c1917";

const btnInk = {
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

const btnTeal = { ...btnInk, backgroundColor: teal };
const btnForest = { ...btnInk, backgroundColor: forest };
const btnLime = {
  ...btnInk,
  backgroundColor: "#b8e03a",
  color: charcoal,
};

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
        border: "1px solid #d9dee5",
        boxShadow: "0 18px 44px -28px rgba(11,18,32,0.45)",
        ...style,
      },
      layout,
      "יומן פגישות",
    ),
    attributes: {
      "data-bizuply-block": "booking",
      "data-bizuply-widget": "booking",
      "data-bizuply-booking-mount": "true",
      "data-bizuply-booking-variant": variant,
      "data-bizuply-crm-calendar": "true",
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
    description: "מחובר אוטומטית ליומן, השירותים ושעות הפעילות מה-CRM",
    keywords: [
      "יומן",
      "פגישות",
      "תורים",
      "CRM",
      "calendar",
      "חודשי",
      "שירותים",
    ],
    previewLayout,
    backgroundColor,
    minHeight,
    thumbnail,
    lockPalette: true,
    nodes,
  };
}

const weekSplit = booking(
  "section-booking-showcase-calendar-split",
  "יומן פגישות — פיצול",
  "booking-showcase-calendar-split",
  "#f4f6f8",
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
      "הלקוח בוחר שירות ותאריך — התור נכנס ישירות ליומן העסק ב-CRM.",
      { color: muted, fontSize: "16px", lineHeight: "1.65" },
      absoluteLayout(48, 260, "380px", "70px", 20),
    ),
    buttonNode(
      "cta",
      "קביעת תור",
      btnTeal,
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
      "תצוגת חודש מלאה — מסונכרנת לשירותים ולשעות הפעילות מה-CRM.",
      {
        color: muted,
        fontSize: "16px",
        textAlign: "center",
      },
      absoluteLayout(230, 135, "620px", "36px", 20),
    ),
    bookingMount(
      "booking-mount",
      absoluteLayout(200, 190, "680px", "520px", 12),
      "month",
    ),
  ],
);

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
        color: "#9aa7b5",
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
        color: "#f5f7fa",
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
      { color: "#9aa7b5", fontSize: "16px", lineHeight: "1.6" },
      absoluteLayout(56, 265, "360px", "60px", 20),
    ),
    buttonNode(
      "cta",
      "קביעת פגישה",
      { ...btnInk, backgroundColor: "#e8edf2", color: navy },
      absoluteLayout(56, 350, "180px", "48px", 22),
      "#booking",
    ),
    bookingMount(
      "booking-mount",
      absoluteLayout(480, 50, "540px", "600px", 12),
      "month",
    ),
  ],
);

const servicesWeek = booking(
  "section-booking-showcase-services-slots",
  "יומן פגישות — שירותים ושעות",
  "booking-showcase-services-slots",
  "#eef1f4",
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
      "השירותים והזמינות נמשכים אוטומטית מהיומן ב-CRM.",
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
            border: index === 0 ? `2px solid ${teal}` : "1px solid #d9dee5",
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

const minimalBusiness = booking(
  "section-booking-showcase-minimal-cta",
  "יומן פגישות — מינימלי עסקי",
  "booking-showcase-minimal-cta",
  "#e8edf2",
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

const wellnessGreen = booking(
  "section-booking-showcase-wellness-green",
  "יומן פגישות — וולנס",
  "booking-showcase-wellness-green",
  "#e8f5ee",
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
      { border: "1px solid #b7d8c4" },
    ),
  ],
);

const clinicMonth = booking(
  "section-booking-showcase-clinic-month",
  "יומן פגישות — קליניקה חודשי",
  "booking-showcase-clinic-month",
  "#f4f6f8",
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
        border: "1px solid #ddd4c4",
      },
      absoluteLayout(70, 50, "940px", "500px", 5),
    ),
    textNode(
      "eyebrow",
      "STUDIO APPOINTMENTS",
      {
        color: "#7d7263",
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
        color: charcoal,
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
      { color: "#7d7263", fontSize: "15px", lineHeight: "1.6" },
      absoluteLayout(120, 290, "300px", "50px", 20),
    ),
    buttonNode(
      "cta",
      "קביעת פגישה",
      { ...btnInk, backgroundColor: charcoal, borderRadius: "10px" },
      absoluteLayout(120, 370, "170px", "48px", 22),
      "#booking",
    ),
    bookingMount(
      "booking-mount",
      absoluteLayout(500, 90, "450px", "420px", 12),
      "week",
      { border: "1px solid #ddd4c4", boxShadow: "none" },
    ),
  ],
);

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
      "תצוגה רחבה לבחירת תאריך — מסונכרנת ליומן ולשירותים מה-CRM.",
      { color: muted, fontSize: "16px" },
      absoluteLayout(48, 105, "680px", "36px", 20),
    ),
    bookingMount(
      "booking-mount",
      absoluteLayout(48, 160, "980px", "560px", 12),
      "month",
    ),
  ],
);

const fitnessWeek = booking(
  "section-booking-showcase-fitness",
  "יומן פגישות — כושר ואימון",
  "booking-showcase-fitness",
  charcoal,
  "640px",
  IMG.fitness,
  [
    textNode(
      "eyebrow",
      "TRAINING SESSIONS",
      {
        color: "#b8e03a",
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
        color: "#f4f4f5",
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
      { color: "#a1a1aa", fontSize: "16px" },
      absoluteLayout(48, 270, "360px", "50px", 20),
    ),
    buttonNode(
      "cta",
      "קביעת אימון",
      btnLime,
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

/** Extra monthly for legal / finance */
const financeMonth = booking(
  "section-booking-showcase-finance-month",
  "יומן פגישות — משרדי / פיננסי",
  "booking-showcase-finance-month",
  "#f7f5f1",
  "700px",
  IMG.office,
  [
    textNode(
      "eyebrow",
      "OFFICE APPOINTMENTS",
      {
        color: "#6b645a",
        fontSize: "12px",
        fontWeight: "800",
        letterSpacing: "0.14em",
      },
      absoluteLayout(48, 60, "300px", "24px", 20),
    ),
    textNode(
      "title",
      "תיאום פגישה\nמקצועית",
      {
        color: charcoal,
        fontSize: "46px",
        fontWeight: "700",
        lineHeight: "1.05",
        whiteSpace: "pre-line",
      },
      absoluteLayout(48, 100, "400px", "130px", 20),
    ),
    textNode(
      "copy",
      "למשרדי עורכי דין, רואי חשבון ויועצים עסקיים.",
      { color: "#6b645a", fontSize: "16px", lineHeight: "1.6" },
      absoluteLayout(48, 250, "380px", "60px", 20),
    ),
    buttonNode(
      "cta",
      "קביעת פגישה",
      { ...btnInk, backgroundColor: charcoal },
      absoluteLayout(48, 340, "180px", "48px", 22),
      "#booking",
    ),
    bookingMount(
      "booking-mount",
      absoluteLayout(480, 48, "540px", "600px", 12),
      "month",
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
  financeMonth,
];

export const DEFAULT_BOOKING_SECTION_ID =
  "section-booking-showcase-month-centered";
