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

const ink = "#0f172a";
const muted = "#64748b";
const accent = "#0284c7";
const soft = "#f0f9ff";

const button = {
  color: "#ffffff",
  backgroundColor: ink,
  borderRadius: "16px",
  padding: "12px 24px",
  fontSize: "14px",
  fontWeight: "700",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
};

const DEMO_ATTR = { "data-bizuply-booking-demo": "true" } as const;

/** Mount point — auto-hydrates when the booking plugin is installed. */
function bookingMount(
  key: string,
  layout: ReturnType<typeof absoluteLayout>,
  style: Record<string, any> = {},
): VisualLibraryNodeTemplate {
  return {
    ...boxNode(
      key,
      {
        backgroundColor: "#ffffff",
        borderRadius: "24px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 18px 50px -28px rgba(15,23,42,0.28)",
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
    },
  };
}

function demoBox(
  key: string,
  style: Record<string, any>,
  layout: ReturnType<typeof absoluteLayout>,
): VisualLibraryNodeTemplate {
  return {
    ...boxNode(key, style, layout),
    attributes: { ...DEMO_ATTR },
  };
}

function demoText(
  key: string,
  text: string,
  style: Record<string, any>,
  layout: ReturnType<typeof absoluteLayout>,
): VisualLibraryNodeTemplate {
  return {
    ...textNode(key, text, style, layout),
    attributes: { ...DEMO_ATTR },
  };
}

function demoButton(
  key: string,
  text: string,
  style: Record<string, any>,
  layout: ReturnType<typeof absoluteLayout>,
  href = "#booking",
): VisualLibraryNodeTemplate {
  return {
    ...buttonNode(key, text, style, layout, href),
    attributes: { ...DEMO_ATTR },
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
      "סקשן יומן פגישות — מתחבר אוטומטית לתוסף «יומן ותורים» כשמותקן",
    keywords: [
      "יומן",
      "פגישות",
      "תורים",
      "booking",
      "calendar",
      "קביעת תור",
      "תיאום",
    ],
    previewLayout,
    backgroundColor,
    minHeight,
    thumbnail,
    nodes,
  };
}

const calendarSplit = booking(
  "section-booking-showcase-calendar-split",
  "יומן פגישות — פיצול עם לוח",
  "booking-showcase-calendar-split",
  "#f8fafc",
  "680px",
  IMG.meeting,
  [
    textNode(
      "eyebrow",
      "מחובר ליומן העסק",
      {
        color: accent,
        fontSize: "12px",
        fontWeight: "800",
        letterSpacing: "0.14em",
      },
      absoluteLayout(48, 56, "280px", "24px", 20),
    ),
    textNode(
      "title",
      "קבעו פגישה\nבלי לחכות",
      {
        color: ink,
        fontSize: "52px",
        fontWeight: "700",
        lineHeight: "1.02",
        letterSpacing: "-0.04em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(48, 95, "420px", "130px", 20),
    ),
    textNode(
      "copy",
      "בחרו שירות, תאריך ושעה פנויה — התור נכנס אוטומטית ליומן שלכם.",
      { color: muted, fontSize: "16px", lineHeight: "1.65" },
      absoluteLayout(48, 245, "400px", "70px", 20),
    ),
    buttonNode(
      "cta",
      "קביעת תור",
      { ...button, backgroundColor: accent },
      absoluteLayout(48, 340, "170px", "48px", 22),
      "#booking",
    ),
    textNode(
      "hint",
      "מתחבר אוטומטית לתוסף יומן ותורים",
      { color: "#94a3b8", fontSize: "13px", fontWeight: "600" },
      absoluteLayout(48, 410, "320px", "24px", 20),
    ),
    bookingMount(
      "booking-mount",
      absoluteLayout(500, 48, "520px", "580px", 12),
      { backgroundColor: soft },
    ),
    demoText(
      "mount-label",
      "יומן פגישות חי",
      {
        color: accent,
        fontSize: "13px",
        fontWeight: "800",
        letterSpacing: "0.12em",
      },
      absoluteLayout(540, 80, "200px", "24px", 22),
    ),
    demoText(
      "mount-title",
      "בחרו תאריך ושעה",
      { color: ink, fontSize: "28px", fontWeight: "800" },
      absoluteLayout(540, 115, "420px", "40px", 22),
    ),
    ...["א׳ 12", "ב׳ 13", "ג׳ 14", "ד׳ 15", "ה׳ 16", "ו׳ 17", "ש׳ 18"].flatMap(
      (label, index) => {
        const x = 540 + (index % 7) * 62;
        const active = index === 1;
        return [
          demoBox(
            `day-${index}`,
            {
              backgroundColor: active ? ink : "#ffffff",
              borderRadius: "14px",
              border: active ? "none" : "1px solid #e2e8f0",
            },
            absoluteLayout(x, 180, "54px", "64px", 18),
          ),
          demoText(
            `day-label-${index}`,
            label,
            {
              color: active ? "#ffffff" : ink,
              fontSize: "12px",
              fontWeight: "800",
              textAlign: "center",
            },
            absoluteLayout(x, 198, "54px", "28px", 22),
          ),
        ];
      },
    ),
    ...["09:00", "10:30", "12:00", "14:00", "16:30", "18:00"].flatMap(
      (time, index) => {
        const col = index % 3;
        const row = Math.floor(index / 3);
        const x = 540 + col * 145;
        const y = 280 + row * 70;
        const active = index === 1;
        return [
          demoBox(
            `slot-${index}`,
            {
              backgroundColor: active ? accent : "#ffffff",
              borderRadius: "14px",
              border: active ? "none" : "1px solid #e2e8f0",
            },
            absoluteLayout(x, y, "130px", "52px", 18),
          ),
          demoText(
            `slot-label-${index}`,
            time,
            {
              color: active ? "#ffffff" : ink,
              fontSize: "15px",
              fontWeight: "800",
              textAlign: "center",
            },
            absoluteLayout(x, y + 14, "130px", "24px", 22),
          ),
        ];
      },
    ),
    demoButton(
      "confirm",
      "אישור תור",
      { ...button, backgroundColor: ink, borderRadius: "14px" },
      absoluteLayout(540, 450, "420px", "52px", 22),
    ),
  ],
);

const calendarCentered = booking(
  "section-booking-showcase-calendar-centered",
  "יומן פגישות — לוח מרכזי",
  "booking-showcase-calendar-centered",
  "#ffffff",
  "720px",
  IMG.office,
  [
    textNode(
      "eyebrow",
      "תיאום תורים אונליין",
      {
        color: muted,
        fontSize: "12px",
        fontWeight: "800",
        letterSpacing: "0.16em",
        textAlign: "center",
      },
      absoluteLayout(300, 40, "480px", "24px", 20),
    ),
    textNode(
      "title",
      "היומן שלכם — פתוח ללקוחות",
      {
        color: ink,
        fontSize: "42px",
        fontWeight: "700",
        letterSpacing: "-0.035em",
        textAlign: "center",
      },
      absoluteLayout(180, 75, "720px", "55px", 20),
    ),
    textNode(
      "copy",
      "הסקשן מתמלא אוטומטית בשירותים ובזמינות מהתוסף יומן ותורים.",
      {
        color: muted,
        fontSize: "16px",
        textAlign: "center",
        lineHeight: "1.6",
      },
      absoluteLayout(250, 140, "580px", "45px", 20),
    ),
    bookingMount("booking-mount", absoluteLayout(175, 210, "730px", "460px", 12)),
    ...["טיפול קלאסי · 60 דק׳", "ייעוץ · 30 דק׳", "חבילה · 90 דק׳"].flatMap(
      (label, index) => {
        const x = 220 + index * 230;
        return [
          demoBox(
            `svc-${index}`,
            {
              backgroundColor: index === 0 ? soft : "#f8fafc",
              borderRadius: "18px",
              border: index === 0 ? `2px solid ${accent}` : "1px solid #e2e8f0",
            },
            absoluteLayout(x, 250, "210px", "90px", 18),
          ),
          demoText(
            `svc-label-${index}`,
            label,
            {
              color: ink,
              fontSize: "15px",
              fontWeight: "800",
              textAlign: "center",
            },
            absoluteLayout(x + 10, 282, "190px", "30px", 22),
          ),
        ];
      },
    ),
    ...["09:00", "10:00", "11:30", "13:00", "15:00", "17:00"].flatMap(
      (time, index) => {
        const x = 230 + index * 105;
        const active = index === 2;
        return [
          demoBox(
            `t-${index}`,
            {
              backgroundColor: active ? ink : "#ffffff",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
            },
            absoluteLayout(x, 380, "90px", "44px", 18),
          ),
          demoText(
            `t-label-${index}`,
            time,
            {
              color: active ? "#ffffff" : ink,
              fontSize: "14px",
              fontWeight: "800",
              textAlign: "center",
            },
            absoluteLayout(x, 391, "90px", "22px", 22),
          ),
        ];
      },
    ),
    demoButton(
      "confirm",
      "שמירת תור",
      { ...button, backgroundColor: accent, borderRadius: "14px" },
      absoluteLayout(360, 470, "360px", "52px", 22),
    ),
  ],
);

const bookingHero = booking(
  "section-booking-showcase-hero-calendar",
  "יומן פגישות — Hero עם תאריך",
  "booking-showcase-hero-calendar",
  "#0b1220",
  "640px",
  IMG.hospitality,
  [
    imageNode(
      "bg",
      IMG.hospitality,
      {
        borderRadius: "0",
        objectFit: "cover",
        filter: "brightness(.45)",
      },
      absoluteLayout(0, 0, "1100px", "640px", 2),
      "רקע יומן",
    ),
    boxNode(
      "shade",
      {
        backgroundImage:
          "linear-gradient(90deg,rgba(8,12,20,.92) 0%,rgba(8,12,20,.55) 55%,rgba(8,12,20,.2) 100%)",
      },
      absoluteLayout(0, 0, "1100px", "640px", 5),
    ),
    textNode(
      "eyebrow",
      "BOOKING · ONLINE",
      {
        color: "#7dd3fc",
        fontSize: "12px",
        fontWeight: "800",
        letterSpacing: "0.18em",
      },
      absoluteLayout(56, 100, "260px", "24px", 20),
    ),
    textNode(
      "title",
      "הזמן שלכם\nשווה יותר",
      {
        color: "#ffffff",
        fontSize: "56px",
        fontWeight: "650",
        lineHeight: "1",
        letterSpacing: "-0.045em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(56, 145, "420px", "140px", 20),
    ),
    textNode(
      "copy",
      "לקוחות קובעים פגישה ישירות מהאתר — מסונכרן ליומן העסק.",
      { color: "#cbd5e1", fontSize: "16px", lineHeight: "1.65" },
      absoluteLayout(56, 310, "380px", "60px", 20),
    ),
    buttonNode(
      "cta",
      "קביעת פגישה",
      { ...button, backgroundColor: "#38bdf8", color: "#082f49" },
      absoluteLayout(56, 400, "180px", "50px", 22),
      "#booking",
    ),
    bookingMount(
      "booking-mount",
      absoluteLayout(520, 70, "500px", "500px", 12),
      { backgroundColor: "rgba(255,255,255,.96)" },
    ),
    demoText(
      "mount-title",
      "פגישה קרובה",
      { color: ink, fontSize: "26px", fontWeight: "800" },
      absoluteLayout(560, 110, "400px", "36px", 22),
    ),
    demoText(
      "mount-copy",
      "בחרו שירות ותאריך פנוי מהיומן",
      { color: muted, fontSize: "14px" },
      absoluteLayout(560, 155, "400px", "28px", 22),
    ),
    ...["13", "14", "15", "16", "17", "18", "19", "20"].flatMap((day, index) => {
      const col = index % 4;
      const row = Math.floor(index / 4);
      const x = 560 + col * 100;
      const y = 210 + row * 100;
      const active = day === "14";
      return [
        demoBox(
          `d-${index}`,
          {
            backgroundColor: active ? ink : "#f1f5f9",
            borderRadius: "16px",
          },
          absoluteLayout(x, y, "88px", "88px", 18),
        ),
        demoText(
          `d-label-${index}`,
          day,
          {
            color: active ? "#ffffff" : ink,
            fontSize: "28px",
            fontWeight: "700",
            textAlign: "center",
          },
          absoluteLayout(x, y + 28, "88px", "36px", 22),
        ),
      ];
    }),
  ],
);

const servicesBooking = booking(
  "section-booking-showcase-services-slots",
  "יומן פגישות — שירותים ושעות",
  "booking-showcase-services-slots",
  "#f8fafc",
  "700px",
  IMG.wellness,
  [
    textNode(
      "title",
      "בחרו שירות וקבעו תור",
      {
        color: ink,
        fontSize: "40px",
        fontWeight: "750",
        letterSpacing: "-0.035em",
      },
      absoluteLayout(48, 48, "520px", "55px", 20),
    ),
    textNode(
      "copy",
      "השירותים והזמינות נמשכים אוטומטית מתוסף היומן.",
      { color: muted, fontSize: "16px" },
      absoluteLayout(48, 115, "480px", "36px", 20),
    ),
    ...[
      ["ייעוץ ראשוני", "30 דק׳ · ₪150"],
      ["טיפול מלא", "60 דק׳ · ₪280"],
      ["חבילת זוגיות", "90 דק׳ · ₪480"],
    ].flatMap(([title, meta], index) => {
      const y = 175 + index * 110;
      const active = index === 0;
      return [
        boxNode(
          `svc-${index}`,
          {
            backgroundColor: active ? soft : "#ffffff",
            borderRadius: "20px",
            border: active ? `2px solid ${accent}` : "1px solid #e2e8f0",
          },
          absoluteLayout(48, y, "420px", "95px", 10),
        ),
        textNode(
          `svc-title-${index}`,
          title,
          { color: ink, fontSize: "20px", fontWeight: "800" },
          absoluteLayout(72, y + 22, "300px", "30px", 20),
        ),
        textNode(
          `svc-meta-${index}`,
          meta,
          { color: muted, fontSize: "14px", fontWeight: "600" },
          absoluteLayout(72, y + 54, "280px", "24px", 20),
        ),
      ];
    }),
    bookingMount("booking-mount", absoluteLayout(520, 48, "500px", "600px", 12)),
    demoText(
      "slots-title",
      "שעות פנויות היום",
      { color: ink, fontSize: "24px", fontWeight: "800" },
      absoluteLayout(560, 90, "400px", "36px", 22),
    ),
    ...[
      "09:00",
      "10:30",
      "12:00",
      "14:00",
      "15:30",
      "17:00",
      "18:30",
      "20:00",
    ].flatMap((time, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = 560 + col * 200;
      const y = 150 + row * 70;
      const active = index === 1;
      const disabled = index === 7;
      return [
        demoBox(
          `slot-${index}`,
          {
            backgroundColor: disabled
              ? "#f1f5f9"
              : active
                ? accent
                : "#ffffff",
            borderRadius: "14px",
            border: disabled || active ? "none" : "1px solid #e2e8f0",
          },
          absoluteLayout(x, y, "180px", "52px", 18),
        ),
        demoText(
          `slot-label-${index}`,
          time,
          {
            color: disabled ? "#cbd5e1" : active ? "#ffffff" : ink,
            fontSize: "16px",
            fontWeight: "800",
            textAlign: "center",
          },
          absoluteLayout(x, y + 14, "180px", "24px", 22),
        ),
      ];
    }),
    demoButton(
      "confirm",
      "אישור והמשך",
      { ...button, backgroundColor: ink, borderRadius: "14px" },
      absoluteLayout(560, 470, "400px", "52px", 22),
    ),
  ],
);

const compactCard = booking(
  "section-booking-showcase-compact-card",
  "יומן פגישות — כרטיס קומפקטי",
  "booking-showcase-compact-card",
  "#ffffff",
  "560px",
  IMG.cafe,
  [
    boxNode(
      "panel",
      { backgroundColor: "#0f172a", borderRadius: "32px" },
      absoluteLayout(80, 40, "940px", "480px", 5),
    ),
    textNode(
      "eyebrow",
      "NEXT AVAILABLE",
      {
        color: "#7dd3fc",
        fontSize: "12px",
        fontWeight: "800",
        letterSpacing: "0.16em",
      },
      absoluteLayout(130, 90, "240px", "24px", 20),
    ),
    textNode(
      "title",
      "תור פנוי\nהשבוע",
      {
        color: "#ffffff",
        fontSize: "48px",
        fontWeight: "700",
        lineHeight: "1.05",
        letterSpacing: "-0.04em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(130, 130, "340px", "120px", 20),
    ),
    textNode(
      "copy",
      "הלקוח רואה זמינות אמיתית מהיומן שלכם — בלי תיאום ידני.",
      { color: "#94a3b8", fontSize: "15px", lineHeight: "1.65" },
      absoluteLayout(130, 280, "320px", "70px", 20),
    ),
    buttonNode(
      "cta",
      "פתחו יומן",
      { ...button, backgroundColor: "#38bdf8", color: "#082f49" },
      absoluteLayout(130, 380, "160px", "48px", 22),
      "#booking",
    ),
    bookingMount("booking-mount", absoluteLayout(520, 80, "440px", "400px", 12)),
    demoText(
      "mount-title",
      "השבוע הקרוב",
      { color: ink, fontSize: "22px", fontWeight: "800" },
      absoluteLayout(560, 120, "360px", "32px", 22),
    ),
    ...["ב׳", "ג׳", "ד׳", "ה׳", "ו׳"].flatMap((day, index) => {
      const x = 560 + index * 72;
      const active = index === 0;
      return [
        demoBox(
          `w-${index}`,
          {
            backgroundColor: active ? accent : "#f1f5f9",
            borderRadius: "14px",
          },
          absoluteLayout(x, 180, "62px", "70px", 18),
        ),
        demoText(
          `w-label-${index}`,
          day,
          {
            color: active ? "#ffffff" : ink,
            fontSize: "14px",
            fontWeight: "800",
            textAlign: "center",
          },
          absoluteLayout(x, 204, "62px", "24px", 22),
        ),
      ];
    }),
    ...["10:00", "11:30", "13:00", "15:30"].flatMap((time, index) => {
      const y = 280 + index * 42;
      return [
        demoText(
          `slot-${index}`,
          time,
          {
            color: index === 1 ? accent : ink,
            fontSize: "16px",
            fontWeight: "800",
          },
          absoluteLayout(560, y, "100px", "28px", 22),
        ),
        demoText(
          `slot-meta-${index}`,
          index === 1 ? "נבחר" : "פנוי",
          {
            color: index === 1 ? accent : muted,
            fontSize: "13px",
            fontWeight: "700",
          },
          absoluteLayout(720, y, "120px", "28px", 22),
        ),
      ];
    }),
  ],
);

const minimalCta = booking(
  "section-booking-showcase-minimal-cta",
  "יומן פגישות — מינימלי",
  "booking-showcase-minimal-cta",
  "#f1f5f9",
  "520px",
  IMG.workspace,
  [
    textNode(
      "title",
      "מוכנים לפגישה?",
      {
        color: ink,
        fontSize: "46px",
        fontWeight: "750",
        letterSpacing: "-0.04em",
        textAlign: "center",
      },
      absoluteLayout(200, 70, "680px", "60px", 20),
    ),
    textNode(
      "copy",
      "לחצו לקביעת תור — היומן מתעדכן אוטומטית מהתוסף של העסק.",
      {
        color: muted,
        fontSize: "17px",
        textAlign: "center",
        lineHeight: "1.6",
      },
      absoluteLayout(250, 145, "580px", "50px", 20),
    ),
    bookingMount(
      "booking-mount",
      absoluteLayout(250, 220, "580px", "230px", 12),
      { backgroundColor: "#ffffff" },
    ),
    ...["היום 16:00", "מחר 10:30", "יום א׳ 12:00"].flatMap((label, index) => {
      const x = 290 + index * 170;
      const active = index === 0;
      return [
        demoBox(
          `chip-${index}`,
          {
            backgroundColor: active ? ink : "#f8fafc",
            borderRadius: "999px",
            border: active ? "none" : "1px solid #e2e8f0",
          },
          absoluteLayout(x, 280, "150px", "48px", 18),
        ),
        demoText(
          `chip-label-${index}`,
          label,
          {
            color: active ? "#ffffff" : ink,
            fontSize: "14px",
            fontWeight: "800",
            textAlign: "center",
          },
          absoluteLayout(x, 293, "150px", "24px", 22),
        ),
      ];
    }),
    demoButton(
      "cta-confirm",
      "קביעת תור עכשיו",
      { ...button, backgroundColor: accent, borderRadius: "14px" },
      absoluteLayout(390, 360, "300px", "52px", 22),
    ),
  ],
);

export const BOOKING_SHOWCASE_SECTIONS: VisualLibrarySectionTemplate[] = [
  calendarSplit,
  calendarCentered,
  bookingHero,
  servicesBooking,
  compactCard,
  minimalCta,
];

export const DEFAULT_BOOKING_SECTION_ID =
  "section-booking-showcase-calendar-split";
