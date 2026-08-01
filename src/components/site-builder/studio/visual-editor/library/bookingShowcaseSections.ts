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

/** Colors outside the site-theme remap map — stay stable on insert, still editable after. */
const ink = "#0b1220";
const muted = "#5c6570";
const teal = "#0f766e";
const slate = "#2f3a46";
const sand = "#f3eee4";
const forest = "#174a2c";
const navy = "#0a1628";
const charcoal = "#1c1917";
const soft = "#f3f4f6";
const line = "#d9dee5";

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
const btnLime = {
  ...btnInk,
  backgroundColor: "#b8e03a",
  color: charcoal,
};

function bookingMount(
  key: string,
  layout: ReturnType<typeof absoluteLayout>,
  variant: "week" | "month" = "month",
  style: Record<string, any> = {},
  theme: {
    accent?: string;
    ink?: string;
    muted?: string;
    surface?: string;
    line?: string;
    soft?: string;
  } = {},
): VisualLibraryNodeTemplate {
  const accent = theme.accent || teal;
  const inkColor = theme.ink || ink;
  const mutedColor = theme.muted || muted;
  const surface = theme.surface || "#ffffff";
  const lineColor = theme.line || line;
  const softColor = theme.soft || soft;

  return {
    ...boxNode(
      key,
      {
        backgroundColor: surface,
        color: inkColor,
        borderRadius: "20px",
        border: `1px solid ${lineColor}`,
        boxShadow: "0 18px 44px -28px rgba(11,18,32,0.45)",
        ["--biz-booking-accent" as any]: accent,
        ["--biz-booking-ink" as any]: inkColor,
        ["--biz-booking-muted" as any]: mutedColor,
        ["--biz-booking-surface" as any]: surface,
        ["--biz-booking-line" as any]: lineColor,
        ["--biz-booking-soft" as any]: softColor,
        ...style,
      },
      layout,
      "יומן פגישות — שירותים ויומן",
    ),
    attributes: {
      "data-bizuply-block": "booking",
      "data-bizuply-widget": "booking",
      "data-bizuply-booking-mount": "true",
      "data-bizuply-booking-variant": variant,
      "data-bizuply-booking-chrome": "card",
      "data-bizuply-crm-calendar": "true",
      "data-bizuply-booking-accent": accent,
      "data-bizuply-booking-ink": inkColor,
      "data-bizuply-booking-muted": mutedColor,
      "data-bizuply-booking-surface": surface,
      "data-bizuply-booking-line": lineColor,
      "data-bizuply-booking-soft": softColor,
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
    description:
      "שירותים בצד אחד ויומן בצד השני — מחובר ל-CRM, עם עריכת צבעים ועיצוב",
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
    lockPalette: false,
    nodes,
  };
}

const weekSplit = booking(
  "section-booking-showcase-calendar-split",
  "יומן פגישות — שירותים ויומן",
  "booking-showcase-calendar-split",
  "#f4f6f8",
  "680px",
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
      absoluteLayout(48, 48, "300px", "24px", 20),
    ),
    textNode(
      "title",
      "הזמן שלכם\nמנוהל חכם",
      {
        color: ink,
        fontSize: "44px",
        fontWeight: "700",
        lineHeight: "1.05",
        letterSpacing: "-0.04em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(48, 85, "340px", "120px", 20),
    ),
    textNode(
      "copy",
      "השירותים בצד אחד, היומן בצד השני — התור נכנס ישירות ל-CRM.",
      { color: muted, fontSize: "16px", lineHeight: "1.65" },
      absoluteLayout(48, 230, "340px", "70px", 20),
    ),
    buttonNode(
      "cta",
      "קביעת תור",
      btnTeal,
      absoluteLayout(48, 320, "160px", "48px", 22),
      "#booking",
    ),
    bookingMount(
      "booking-mount",
      absoluteLayout(420, 36, "620px", "600px", 12),
      "week",
      {},
      { accent: teal, ink },
    ),
  ],
);

const monthCentered = booking(
  "section-booking-showcase-month-centered",
  "יומן פגישות — לוח חודשי מפוצל",
  "booking-showcase-month-centered",
  "#ffffff",
  "780px",
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
      absoluteLayout(300, 28, "480px", "24px", 20),
    ),
    textNode(
      "title",
      "שירותים בצד אחד · יומן בצד השני",
      {
        color: ink,
        fontSize: "36px",
        fontWeight: "750",
        letterSpacing: "-0.03em",
        textAlign: "center",
      },
      absoluteLayout(140, 60, "800px", "50px", 20),
    ),
    textNode(
      "copy",
      "עברו בין חודשים, בחרו שירות ותאריך — הכל מסונכרן ל-CRM.",
      {
        color: muted,
        fontSize: "16px",
        textAlign: "center",
      },
      absoluteLayout(230, 120, "620px", "36px", 20),
    ),
    bookingMount(
      "booking-mount",
      absoluteLayout(70, 175, "940px", "560px", 12),
      "month",
    ),
  ],
);

const monthDark = booking(
  "section-booking-showcase-month-dark",
  "יומן פגישות — חודשי כהה",
  "booking-showcase-month-dark",
  navy,
  "720px",
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
      absoluteLayout(48, 56, "280px", "24px", 20),
    ),
    textNode(
      "title",
      "פגישת ייעוץ\nבלוח החודש",
      {
        color: "#f5f7fa",
        fontSize: "44px",
        fontWeight: "650",
        lineHeight: "1.05",
        letterSpacing: "-0.04em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(48, 95, "340px", "120px", 20),
    ),
    textNode(
      "copy",
      "שירותים ויומן זה לצד זה — ליועצים, עורכי דין ומאמנים.",
      { color: "#9aa7b5", fontSize: "16px", lineHeight: "1.6" },
      absoluteLayout(48, 240, "340px", "60px", 20),
    ),
    buttonNode(
      "cta",
      "קביעת פגישה",
      { ...btnInk, backgroundColor: "#e8edf2", color: navy },
      absoluteLayout(48, 330, "180px", "48px", 22),
      "#booking",
    ),
    bookingMount(
      "booking-mount",
      absoluteLayout(420, 40, "620px", "640px", 12),
      "month",
      {},
      {
        accent: "#9aa7b5",
        ink: navy,
        surface: "#f8fafc",
        line: "#d7dee7",
        soft: "#eef2f6",
      },
    ),
  ],
);

const servicesWeek = booking(
  "section-booking-showcase-services-slots",
  "יומן פגישות — שירותים ושעות",
  "booking-showcase-services-slots",
  "#eef1f4",
  "700px",
  IMG.medical,
  [
    textNode(
      "title",
      "בחרו שירות וקבעו תור",
      {
        color: ink,
        fontSize: "38px",
        fontWeight: "750",
        letterSpacing: "-0.03em",
      },
      absoluteLayout(48, 36, "980px", "50px", 20),
    ),
    textNode(
      "copy",
      "השירותים בצד ימין, היומן והשעות בצד שמאל — נמשכים אוטומטית מה-CRM.",
      { color: muted, fontSize: "16px" },
      absoluteLayout(48, 95, "980px", "36px", 20),
    ),
    bookingMount(
      "booking-mount",
      absoluteLayout(48, 150, "980px", "510px", 12),
      "week",
      {},
      { accent: teal, ink },
    ),
  ],
);

const minimalBusiness = booking(
  "section-booking-showcase-minimal-cta",
  "יומן פגישות — מינימלי עסקי",
  "booking-showcase-minimal-cta",
  "#e8edf2",
  "620px",
  IMG.laptop,
  [
    textNode(
      "title",
      "מוכנים לפגישה?",
      {
        color: ink,
        fontSize: "40px",
        fontWeight: "750",
        letterSpacing: "-0.035em",
        textAlign: "center",
      },
      absoluteLayout(200, 36, "680px", "50px", 20),
    ),
    textNode(
      "copy",
      "שירותים ויומן זה לצד זה — בלי שיחות ובלי המתנה.",
      {
        color: muted,
        fontSize: "16px",
        textAlign: "center",
      },
      absoluteLayout(260, 100, "560px", "36px", 20),
    ),
    bookingMount(
      "booking-mount",
      absoluteLayout(80, 155, "920px", "420px", 12),
      "week",
    ),
  ],
);

const wellnessGreen = booking(
  "section-booking-showcase-wellness-green",
  "יומן פגישות — וולנס",
  "booking-showcase-wellness-green",
  "#e8f5ee",
  "700px",
  IMG.wellness,
  [
    imageNode(
      "photo",
      IMG.wellness,
      { borderRadius: "18px", objectFit: "cover" },
      absoluteLayout(40, 50, "280px", "600px", 8),
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
      absoluteLayout(360, 50, "280px", "24px", 20),
    ),
    textNode(
      "title",
      "שמרו מקום לטיפול הבא",
      {
        color: forest,
        fontSize: "34px",
        fontWeight: "700",
        lineHeight: "1.1",
      },
      absoluteLayout(360, 85, "680px", "50px", 20),
    ),
    bookingMount(
      "booking-mount",
      absoluteLayout(360, 150, "680px", "500px", 12),
      "week",
      { border: "1px solid #b7d8c4", boxShadow: "none" },
      {
        accent: forest,
        ink: forest,
        surface: "#ffffff",
        line: "#b7d8c4",
        soft: "#e8f5ee",
      },
    ),
  ],
);

const clinicMonth = booking(
  "section-booking-showcase-clinic-month",
  "יומן פגישות — קליניקה חודשי",
  "booking-showcase-clinic-month",
  "#f4f6f8",
  "740px",
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
      absoluteLayout(40, 48, "260px", "24px", 20),
    ),
    textNode(
      "title",
      "תאמו תור\nלחודש הקרוב",
      {
        color: ink,
        fontSize: "42px",
        fontWeight: "700",
        lineHeight: "1.05",
        whiteSpace: "pre-line",
      },
      absoluteLayout(40, 85, "300px", "120px", 20),
    ),
    textNode(
      "copy",
      "לוח חודשי ברור לקליניקות, מטפלים ונותני שירות.",
      { color: muted, fontSize: "15px", lineHeight: "1.6" },
      absoluteLayout(40, 230, "300px", "60px", 20),
    ),
    ...["א׳–ה׳ 09:00–19:00", "ו׳ 09:00–13:00", "אישור תוך שעתיים"].map(
      (label, index) =>
        textNode(
          `meta-${index}`,
          label,
          { color: slate, fontSize: "14px", fontWeight: "700" },
          absoluteLayout(40, 320 + index * 36, "300px", "28px", 20),
        ),
    ),
    bookingMount(
      "booking-mount",
      absoluteLayout(360, 36, "700px", "660px", 12),
      "month",
      {},
      { accent: teal, ink },
    ),
  ],
);

const sandCard = booking(
  "section-booking-showcase-compact-card",
  "יומן פגישות — כרטיס חול",
  "booking-showcase-compact-card",
  sand,
  "660px",
  IMG.architecture,
  [
    boxNode(
      "panel",
      {
        backgroundColor: "#ffffff",
        borderRadius: "28px",
        border: "1px solid #ddd4c4",
      },
      absoluteLayout(40, 40, "1000px", "580px", 5),
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
      absoluteLayout(80, 70, "280px", "24px", 20),
    ),
    textNode(
      "title",
      "פגישה בסטודיו\nהשבוע",
      {
        color: charcoal,
        fontSize: "38px",
        fontWeight: "700",
        lineHeight: "1.05",
        whiteSpace: "pre-line",
      },
      absoluteLayout(80, 110, "280px", "110px", 20),
    ),
    textNode(
      "copy",
      "שירותים ויומן זה לצד זה — עיצוב ניטרלי לסטודיות ומשרדים.",
      { color: "#7d7263", fontSize: "15px", lineHeight: "1.6" },
      absoluteLayout(80, 250, "280px", "70px", 20),
    ),
    buttonNode(
      "cta",
      "קביעת פגישה",
      { ...btnInk, backgroundColor: charcoal, borderRadius: "10px" },
      absoluteLayout(80, 350, "170px", "48px", 22),
      "#booking",
    ),
    bookingMount(
      "booking-mount",
      absoluteLayout(400, 70, "600px", "520px", 12),
      "week",
      { border: "1px solid #ddd4c4", boxShadow: "none" },
      {
        accent: charcoal,
        ink: charcoal,
        surface: "#ffffff",
        line: "#ddd4c4",
        soft: sand,
      },
    ),
  ],
);

const monthWide = booking(
  "section-booking-showcase-month-wide",
  "יומן פגישות — חודשי רחב",
  "booking-showcase-month-wide",
  "#ffffff",
  "800px",
  IMG.city,
  [
    textNode(
      "title",
      "היומן החודשי של העסק",
      {
        color: ink,
        fontSize: "38px",
        fontWeight: "750",
        letterSpacing: "-0.03em",
      },
      absoluteLayout(48, 28, "700px", "50px", 20),
    ),
    textNode(
      "copy",
      "שירותים בצד אחד, לוח חודשי עם חצים קדימה/אחורה בצד השני.",
      { color: muted, fontSize: "16px" },
      absoluteLayout(48, 90, "900px", "36px", 20),
    ),
    bookingMount(
      "booking-mount",
      absoluteLayout(48, 145, "980px", "600px", 12),
      "month",
    ),
  ],
);

const fitnessWeek = booking(
  "section-booking-showcase-fitness",
  "יומן פגישות — כושר ואימון",
  "booking-showcase-fitness",
  charcoal,
  "700px",
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
      absoluteLayout(40, 48, "280px", "24px", 20),
    ),
    textNode(
      "title",
      "קבעו אימון\nבלוח הזמנים",
      {
        color: "#f4f4f5",
        fontSize: "42px",
        fontWeight: "700",
        lineHeight: "1.05",
        whiteSpace: "pre-line",
      },
      absoluteLayout(40, 90, "300px", "120px", 20),
    ),
    textNode(
      "copy",
      "שירותי אימון בצד אחד, יומן שבועי בצד השני.",
      { color: "#a1a1aa", fontSize: "16px" },
      absoluteLayout(40, 240, "300px", "50px", 20),
    ),
    buttonNode(
      "cta",
      "קביעת אימון",
      btnLime,
      absoluteLayout(40, 320, "170px", "48px", 22),
      "#booking",
    ),
    bookingMount(
      "booking-mount",
      absoluteLayout(370, 40, "670px", "620px", 12),
      "week",
      {},
      {
        accent: "#b8e03a",
        ink: charcoal,
        surface: "#ffffff",
        line: "#e4e4e7",
        soft: "#f4f4f5",
      },
    ),
  ],
);

const financeMonth = booking(
  "section-booking-showcase-finance-month",
  "יומן פגישות — משרדי / פיננסי",
  "booking-showcase-finance-month",
  "#f7f5f1",
  "720px",
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
      absoluteLayout(40, 48, "300px", "24px", 20),
    ),
    textNode(
      "title",
      "תיאום פגישה\nמקצועית",
      {
        color: charcoal,
        fontSize: "42px",
        fontWeight: "700",
        lineHeight: "1.05",
        whiteSpace: "pre-line",
      },
      absoluteLayout(40, 90, "300px", "120px", 20),
    ),
    textNode(
      "copy",
      "שירותים ויומן חודשי זה לצד זה — למשרדים ויועצים.",
      { color: "#6b645a", fontSize: "16px", lineHeight: "1.6" },
      absoluteLayout(40, 240, "300px", "60px", 20),
    ),
    buttonNode(
      "cta",
      "קביעת פגישה",
      { ...btnInk, backgroundColor: charcoal },
      absoluteLayout(40, 330, "180px", "48px", 22),
      "#booking",
    ),
    bookingMount(
      "booking-mount",
      absoluteLayout(370, 40, "670px", "640px", 12),
      "month",
      {},
      {
        accent: charcoal,
        ink: charcoal,
        surface: "#ffffff",
        line: "#ddd4c4",
        soft: "#f7f5f1",
      },
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
