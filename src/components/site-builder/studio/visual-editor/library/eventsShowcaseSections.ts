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

const ink = "#111318";
const body = {
  color: "#5a5f66",
  fontSize: "14px",
  lineHeight: "1.55",
};
const button = {
  color: "#ffffff",
  backgroundColor: ink,
  borderRadius: "999px",
  padding: "12px 24px",
  fontSize: "14px",
  fontWeight: "700",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
};

function events(
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
    category: "events",
    title,
    description: "סקשן אירועים מקצועי בקומפוזיציה Editorial ייחודית",
    keywords: ["אירועים", "events", "כנס", "הרשמה", "wix"],
    previewLayout,
    backgroundColor,
    minHeight,
    thumbnail,
    nodes,
  };
}

/** 1 — Hero אירוע עם תג תאריך */
const heroDateBadge = events(
  "section-events-showcase-hero-date-badge",
  "אירועים — Hero עם תאריך",
  "events-showcase-hero-date-badge",
  "#171717",
  "640px",
  IMG.event,
  [
    imageNode(
      "hero",
      IMG.event,
      {
        borderRadius: "0",
        objectFit: "cover",
        filter: "brightness(.7)",
      },
      absoluteLayout(0, 0, "1100px", "640px", 2),
      "אירוע דגל",
    ),
    boxNode(
      "shade",
      {
        backgroundImage:
          "linear-gradient(90deg,rgba(9,12,14,.92) 0%,rgba(9,12,14,.55) 50%,rgba(9,12,14,.15) 100%)",
      },
      absoluteLayout(0, 0, "1100px", "640px", 5),
    ),
    boxNode(
      "date-badge",
      {
        backgroundColor: "#ffffff",
        borderRadius: "16px",
      },
      absoluteLayout(65, 90, "110px", "120px", 15),
    ),
    textNode(
      "date-day",
      "24",
      {
        color: ink,
        fontSize: "42px",
        fontWeight: "700",
        textAlign: "center",
        letterSpacing: "-0.04em",
      },
      absoluteLayout(65, 100, "110px", "50px", 20),
    ),
    textNode(
      "date-month",
      "אוג׳",
      {
        color: "#777b82",
        fontSize: "16px",
        fontWeight: "700",
        textAlign: "center",
      },
      absoluteLayout(65, 155, "110px", "24px", 20),
    ),
    textNode(
      "date-year",
      "2026",
      { color: "#aaaaaa", fontSize: "13px", textAlign: "center" },
      absoluteLayout(65, 182, "110px", "20px", 20),
    ),
    textNode(
      "eyebrow",
      "כנס שנתי · תל אביב",
      {
        color: "#f5c86f",
        fontSize: "13px",
        fontWeight: "700",
        letterSpacing: "0.14em",
      },
      absoluteLayout(200, 100, "340px", "26px", 20),
    ),
    textNode(
      "title",
      "עתיד העסק\nמתחיל כאן",
      {
        color: "#ffffff",
        fontSize: "58px",
        fontWeight: "600",
        lineHeight: "0.98",
        letterSpacing: "-0.055em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(195, 145, "520px", "130px", 20),
    ),
    textNode(
      "copy",
      "יום מלא של הרצאות, נטוורקינג וכלים פרקטיים — עם המומחים המובילים בתחום.",
      { color: "#e2e4e5", fontSize: "16px", lineHeight: "1.65" },
      absoluteLayout(200, 310, "440px", "70px", 20),
    ),
    buttonNode(
      "cta",
      "הרשמה עכשיו",
      { ...button, backgroundColor: "#f5c86f", color: "#17120a" },
      absoluteLayout(200, 410, "190px", "48px", 22),
    ),
  ],
);

/** 2 — רשימת אירועים קרובים */
const upcomingList = events(
  "section-events-showcase-upcoming-list",
  "אירועים — רשימה קרובה",
  "events-showcase-upcoming-list",
  "#f3f4f6",
  "720px",
  IMG.hospitality,
  [
    textNode(
      "title",
      "אירועים קרובים",
      {
        color: ink,
        fontSize: "42px",
        fontWeight: "600",
        letterSpacing: "-0.04em",
      },
      absoluteLayout(40, 40, "600px", "55px", 20),
    ),
    textNode(
      "copy",
      "הצטרפו אלינו — כל אירוע הוא הזדמנות ללמוד, להתחבר ולצמוח.",
      { ...body, fontSize: "16px" },
      absoluteLayout(40, 100, "520px", "40px", 20),
    ),
    ...[
      [IMG.hospitality, "15 אוג׳", "ערב נטוורקינג", "מרכז העיר · ת״א", "₪120"],
      [IMG.food, "22 אוג׳", "סדנת קולינריה", "מטבח פתוח · הרצליה", "₪280"],
      [IMG.fitness, "5 ספט׳", "Retreat בריאות", "ים המלח · יום שלם", "₪490"],
      [IMG.education, "18 ספט׳", "כנס חינוך דיגיטלי", "אוניברסיטת ת״א", "חינם"],
    ].flatMap(([src, date, heading, location, price], index) => {
      const y = 160 + index * 130;
      return [
        boxNode(
          `row-${index}`,
          { backgroundColor: "#ffffff", borderRadius: "16px" },
          absoluteLayout(40, y, "1000px", "115px", 8),
        ),
        imageNode(
          `image-${index}`,
          String(src),
          { borderRadius: "12px", objectFit: "cover" },
          absoluteLayout(55, y + 15, "140px", "85px", 10),
          String(heading),
        ),
        textNode(
          `date-${index}`,
          String(date),
          { color: "#c9a227", fontSize: "14px", fontWeight: "700" },
          absoluteLayout(220, y + 22, "100px", "22px", 20),
        ),
        textNode(
          `heading-${index}`,
          String(heading),
          { color: ink, fontSize: "22px", fontWeight: "700" },
          absoluteLayout(220, y + 48, "400px", "32px", 20),
        ),
        textNode(
          `location-${index}`,
          String(location),
          { ...body, fontSize: "14px" },
          absoluteLayout(220, y + 82, "420px", "24px", 20),
        ),
        textNode(
          `price-${index}`,
          String(price),
          { color: ink, fontSize: "18px", fontWeight: "700" },
          absoluteLayout(780, y + 42, "120px", "28px", 20),
        ),
        buttonNode(
          `cta-${index}`,
          "הרשמה",
          { ...button, backgroundColor: "#eef0f3", color: ink, padding: "10px 18px" },
          absoluteLayout(880, y + 38, "130px", "42px", 20),
        ),
      ];
    }),
  ],
);

/** 3 — רשת לוח שנה */
const calendarGrid = events(
  "section-events-showcase-calendar-grid",
  "אירועים — רשת לוח שנה",
  "events-showcase-calendar-grid",
  "#ffffff",
  "680px",
  IMG.travel,
  [
    textNode(
      "eyebrow",
      "לוח אירועים · אוגוסט 2026",
      {
        color: "#777b82",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.14em",
      },
      absoluteLayout(40, 40, "320px", "24px", 20),
    ),
    textNode(
      "title",
      "מה קורה\nהחודש",
      {
        color: ink,
        fontSize: "48px",
        fontWeight: "500",
        lineHeight: "1",
        letterSpacing: "-0.05em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(40, 72, "400px", "110px", 20),
    ),
    ...[
      ["3", "סדנה", false],
      ["7", "", false],
      ["12", "וובינר", true],
      ["15", "כנס", true],
      ["18", "", false],
      ["22", "מפגש", true],
      ["25", "", false],
      ["28", "Retreat", true],
    ].flatMap(([day, label, active], index) => {
      const col = index % 4;
      const row = Math.floor(index / 4);
      const x = 480 + col * 155;
      const y = 45 + row * 155;
      return [
        boxNode(
          `cell-${index}`,
          {
            backgroundColor: active ? ink : "#f3f4f6",
            borderRadius: "14px",
          },
          absoluteLayout(x, y, "140px", "140px", 8),
        ),
        textNode(
          `day-${index}`,
          String(day),
          {
            color: active ? "#ffffff" : ink,
            fontSize: "32px",
            fontWeight: "600",
            letterSpacing: "-0.04em",
          },
          absoluteLayout(x + 18, y + 18, "60px", "40px", 20),
        ),
        ...(label
          ? [
              textNode(
                `label-${index}`,
                String(label),
                {
                  color: active ? "rgba(255,255,255,.75)" : "#777b82",
                  fontSize: "13px",
                  fontWeight: "700",
                },
                absoluteLayout(x + 18, y + 100, "110px", "22px", 20),
              ),
            ]
          : []),
      ];
    }),
    imageNode(
      "travel",
      IMG.travel,
      { borderRadius: "4px", objectFit: "cover" },
      absoluteLayout(40, 220, "400px", "420px", 5),
      "Retreat בחו״ל",
    ),
    buttonNode(
      "cta",
      "כל האירועים",
      button,
      absoluteLayout(40, 580, "170px", "48px", 20),
    ),
  ],
);

/** 4 — רשת Bento אירועים */
const bentoGrid = events(
  "section-events-showcase-bento-grid",
  "אירועים — רשת Bento",
  "events-showcase-bento-grid",
  "#111318",
  "700px",
  IMG.event,
  [
    textNode(
      "eyebrow",
      "השנה שלנו",
      {
        color: "rgba(255,255,255,.55)",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.16em",
      },
      absoluteLayout(45, 40, "240px", "22px", 20),
    ),
    textNode(
      "title",
      "אירועים במבט אחד",
      {
        color: "#ffffff",
        fontSize: "44px",
        fontWeight: "500",
        letterSpacing: "-0.045em",
      },
      absoluteLayout(45, 72, "520px", "60px", 20),
    ),
    boxNode(
      "card-a",
      { backgroundColor: "#1c1f26", borderRadius: "18px" },
      absoluteLayout(45, 160, "520px", "500px", 8),
    ),
    imageNode(
      "image-a",
      IMG.event,
      { borderRadius: "14px", objectFit: "cover", opacity: "0.9" },
      absoluteLayout(70, 185, "470px", "280px", 10),
      "כנס שנתי",
    ),
    textNode(
      "heading-a",
      "כנס שנתי 2026",
      { color: "#ffffff", fontSize: "28px", fontWeight: "700" },
      absoluteLayout(70, 490, "400px", "40px", 20),
    ),
    textNode(
      "copy-a",
      "24–25 אוג׳ · 500 משתתפים · תל אביב",
      { color: "rgba(255,255,255,.65)", fontSize: "14px", lineHeight: "1.5" },
      absoluteLayout(70, 540, "400px", "50px", 20),
    ),
    ...[
      [IMG.nature, 590, 160, 450, 235, "Retreat בטבע", "3 ימים · גליל"],
      [IMG.fashion, 590, 420, 450, 240, "Fashion Week", "18 ספט׳ · י-ם"],
    ].flatMap(([src, x, y, w, h, heading, copy], index) => [
      boxNode(
        `card-${index}`,
        { backgroundColor: "#1c1f26", borderRadius: "18px" },
        absoluteLayout(Number(x), Number(y), `${Number(w)}px`, `${Number(h)}px`, 8),
      ),
      imageNode(
        `image-${index}`,
        String(src),
        { borderRadius: "12px", objectFit: "cover", opacity: "0.88" },
        absoluteLayout(Number(x) + 20, Number(y) + 18, `${Number(w) - 40}px`, "110px", 10),
        String(heading),
      ),
      textNode(
        `heading-${index}`,
        String(heading),
        { color: "#ffffff", fontSize: "20px", fontWeight: "700" },
        absoluteLayout(Number(x) + 24, Number(y) + Number(h) - 78, "380px", "28px", 20),
      ),
      textNode(
        `copy-${index}`,
        String(copy),
        { color: "rgba(255,255,255,.6)", fontSize: "13px" },
        absoluteLayout(Number(x) + 24, Number(y) + Number(h) - 44, "380px", "28px", 20),
      ),
    ]),
  ],
);

/** 5 — Full bleed עם גradient */
const fullbleedGradient = events(
  "section-events-showcase-fullbleed-gradient",
  "אירועים — Full Bleed",
  "events-showcase-fullbleed-gradient",
  "#171717",
  "610px",
  IMG.nature,
  [
    imageNode(
      "image",
      IMG.nature,
      {
        borderRadius: "0px",
        objectFit: "cover",
        filter: "brightness(.72) saturate(.88)",
      },
      absoluteLayout(0, 0, "1100px", "610px", 2),
      "Retreat בטבע",
    ),
    boxNode(
      "shade",
      {
        backgroundImage:
          "linear-gradient(180deg,rgba(9,12,14,.15) 0%,rgba(9,12,14,.88) 100%)",
      },
      absoluteLayout(0, 0, "1100px", "610px", 5),
    ),
    textNode(
      "eyebrow",
      "Retreat · 3–5 אוק׳",
      {
        color: "#a8d5a2",
        fontSize: "13px",
        fontWeight: "700",
        letterSpacing: "0.15em",
      },
      absoluteLayout(65, 380, "330px", "26px", 20),
    ),
    textNode(
      "title",
      "נתקו. נשמו.\nחזרו מחודשים.",
      {
        color: "#ffffff",
        fontSize: "58px",
        fontWeight: "600",
        lineHeight: "0.98",
        letterSpacing: "-0.055em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(60, 420, "600px", "130px", 20),
    ),
    buttonNode(
      "cta",
      "פרטים והרשמה",
      {
        ...button,
        color: "#17120a",
        backgroundColor: "#a8d5a2",
      },
      absoluteLayout(65, 540, "200px", "48px", 22),
    ),
    textNode(
      "spots",
      "12 מקומות אחרונים",
      { color: "rgba(255,255,255,.65)", fontSize: "14px", fontWeight: "700" },
      absoluteLayout(290, 552, "200px", "24px", 20),
    ),
  ],
);

/** 6 — ציר זמן אירועים */
const timeline = events(
  "section-events-showcase-timeline",
  "אירועים — ציר זמן",
  "events-showcase-timeline",
  "#f7f5f1",
  "640px",
  IMG.architecture,
  [
    textNode(
      "eyebrow",
      "מסלול השנה",
      {
        color: "#8a7359",
        fontSize: "13px",
        fontWeight: "700",
        letterSpacing: "0.14em",
      },
      absoluteLayout(40, 45, "230px", "25px", 20),
    ),
    textNode(
      "title",
      "אירועים לאורך השנה",
      {
        color: "#1d1b18",
        fontSize: "42px",
        fontWeight: "600",
        letterSpacing: "-0.04em",
      },
      absoluteLayout(40, 80, "500px", "60px", 20),
    ),
    boxNode(
      "line",
      { backgroundColor: "#d6d0c7" },
      absoluteLayout(120, 170, "3px", "420px", 5),
    ),
    ...[
      ["מרץ", "פתיחת עונה", "ערב השקה עם הרצאה ונטוורקינג"],
      ["יוני", "כנס קיץ", "יום שלם של תוכן, סדנאות ופאנלים"],
      ["ספט׳", "Retreat", "3 ימים של למידה, טבע וחיבור"],
      ["דצמ׳", "סיום עונה", "מסיבת סיכום ופרסים"],
    ].flatMap(([month, heading, copy], index) => {
      const y = 165 + index * 100;
      return [
        boxNode(
          `dot-${index}`,
          { backgroundColor: "#8a7359", borderRadius: "50%" },
          absoluteLayout(112, y + 8, "18px", "18px", 10),
        ),
        textNode(
          `month-${index}`,
          month,
          { color: "#8a7359", fontSize: "14px", fontWeight: "700" },
          absoluteLayout(150, y, "85px", "28px", 20),
        ),
        textNode(
          `heading-${index}`,
          heading,
          { color: "#1d1b18", fontSize: "20px", fontWeight: "700" },
          absoluteLayout(240, y, "300px", "30px", 20),
        ),
        textNode(
          `copy-${index}`,
          copy,
          { color: "#66615a", fontSize: "13px", lineHeight: "1.45" },
          absoluteLayout(240, y + 34, "380px", "40px", 20),
        ),
      ];
    }),
    imageNode(
      "image",
      IMG.architecture,
      { borderRadius: "4px", objectFit: "cover" },
      absoluteLayout(680, 45, "380px", "550px", 5),
      "מקום האירוע",
    ),
  ],
);

/** 7 — כרטיסי כרטיסים (Ticket-style) */
const ticketCards = events(
  "section-events-showcase-ticket-cards",
  "אירועים — כרטיסי כניסה",
  "events-showcase-ticket-cards",
  "#f7f3ee",
  "680px",
  IMG.event,
  [
    textNode(
      "title",
      "בחרו את הכרטיס\nשמתאים לכם",
      {
        color: ink,
        fontSize: "42px",
        fontWeight: "500",
        lineHeight: "1.05",
        letterSpacing: "-0.045em",
        whiteSpace: "pre-line",
        textAlign: "center",
      },
      absoluteLayout(220, 40, "640px", "100px", 20),
    ),
    ...[
      ["Early Bird", "₪290", "#ffffff", ink, ["כניסה לכל היום", "ארוחת בוקר", "חומרים דיגיטליים"]],
      ["VIP", "₪590", ink, "#ffffff", ["מושב שמור", "פגישת Q&A", "ארוחת צהריים", "מתנת כניסה"]],
      ["קבוצה", "₪990", "#ffffff", ink, ["5 כרטיסים", "שולחן ייעודי", "לוגו על המסך"]],
    ].flatMap(([name, price, bg, fg, items], index) => {
      const x = 60 + index * 340;
      const list = items as string[];
      return [
        boxNode(
          `card-${index}`,
          {
            backgroundColor: String(bg),
            borderRadius: "20px",
            border: bg === "#ffffff" ? "1px solid #e5e0d8" : "0",
          },
          absoluteLayout(x, 170, "310px", "450px", 8),
        ),
        boxNode(
          `notch-${index}`,
          {
            backgroundColor: "#f7f3ee",
            borderRadius: "50%",
          },
          absoluteLayout(x + 145, 170, "20px", "20px", 12),
        ),
        textNode(
          `name-${index}`,
          String(name),
          { color: String(fg), fontSize: "18px", fontWeight: "700" },
          absoluteLayout(x + 30, 200, "240px", "28px", 20),
        ),
        textNode(
          `price-${index}`,
          String(price),
          {
            color: String(fg),
            fontSize: "40px",
            fontWeight: "600",
            letterSpacing: "-0.04em",
          },
          absoluteLayout(x + 30, 245, "240px", "50px", 20),
        ),
        ...list.flatMap((item, itemIndex) =>
          textNode(
            `item-${index}-${itemIndex}`,
            `•  ${item}`,
            {
              color: bg === ink ? "rgba(255,255,255,.72)" : "#6a655e",
              fontSize: "14px",
              lineHeight: "1.8",
            },
            absoluteLayout(x + 30, 320 + itemIndex * 32, "240px", "28px", 20),
          ),
        ),
        buttonNode(
          `cta-${index}`,
          "רכישה",
          {
            ...button,
            backgroundColor: bg === ink ? "#ffffff" : ink,
            color: bg === ink ? ink : "#ffffff",
          },
          absoluteLayout(x + 30, 540, "250px", "46px", 20),
        ),
      ];
    }),
  ],
);

/** 8 — מגזין Ledger: אירועים ממוספרים */
const magazineLedger = events(
  "section-events-showcase-magazine-ledger",
  "אירועים — מגזין Ledger",
  "events-showcase-magazine-ledger",
  "#faf8f4",
  "700px",
  IMG.interior,
  [
    textNode(
      "eyebrow",
      "לוח אירועים",
      {
        color: "#9a8b78",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.16em",
      },
      absoluteLayout(45, 40, "260px", "22px", 20),
    ),
    textNode(
      "title",
      "מה מתוכנן\nהרבעון",
      {
        color: "#1c1915",
        fontSize: "56px",
        fontWeight: "500",
        lineHeight: "0.98",
        letterSpacing: "-0.055em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(45, 75, "420px", "130px", 20),
    ),
    imageNode(
      "main",
      IMG.interior,
      { borderRadius: "2px", objectFit: "cover" },
      absoluteLayout(45, 240, "500px", "400px", 5),
      "אירוע עיצוב",
    ),
    textNode(
      "main-label",
      "פתיחת עונה · 12 אוג׳",
      {
        color: "#ffffff",
        fontSize: "16px",
        fontWeight: "700",
        backgroundColor: "rgba(28,25,21,.7)",
        borderRadius: "999px",
        padding: "10px 16px",
      },
      absoluteLayout(70, 580, "260px", "40px", 20),
    ),
    ...[
      ["01", "וובינר חינמי", "כל שלישי · 19:00 · זום"],
      ["02", "סדנת עיצוב", "מקסימום 20 משתתפים"],
      ["03", "ערב נטוורקינג", "משקאות וכיבוד · ת״א"],
      ["04", "כנס חודשי", "הרצאות + פאנל מומחים"],
      ["05", "Retreat VIP", "3 ימים · מקומות מוגבלים"],
    ].flatMap(([num, heading, copy], index) => {
      const y = 75 + index * 105;
      return [
        textNode(
          `num-${index}`,
          num,
          { color: "#c4b8a8", fontSize: "18px", fontWeight: "700" },
          absoluteLayout(600, y, "50px", "28px", 20),
        ),
        textNode(
          `heading-${index}`,
          heading,
          { color: "#1c1915", fontSize: "22px", fontWeight: "700" },
          absoluteLayout(660, y, "360px", "30px", 20),
        ),
        textNode(
          `copy-${index}`,
          copy,
          { color: "#7a7166", fontSize: "14px" },
          absoluteLayout(660, y + 34, "360px", "28px", 20),
        ),
        boxNode(
          `rule-${index}`,
          { backgroundColor: "#e6dfd4" },
          absoluteLayout(600, y + 78, "430px", "1px", 5),
        ),
      ];
    }),
  ],
);

export const EVENTS_SHOWCASE_SECTIONS: VisualLibrarySectionTemplate[] = [
  heroDateBadge,
  upcomingList,
  calendarGrid,
  bentoGrid,
  fullbleedGradient,
  timeline,
  ticketCards,
  magazineLedger,
];
