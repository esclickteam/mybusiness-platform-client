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

function stats(
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
    category: "stats",
    title,
    description: "סקשן מספרים מקצועי בקומפוזיציה Editorial ייחודית",
    keywords: ["מספרים", "stats", "סטטיסטיקה", "הישגים", "wix"],
    previewLayout,
    backgroundColor,
    minHeight,
    thumbnail,
    nodes,
  };
}

/** 1 — רשת 4 כרטיסי מספרים */
const fourCardGrid = stats(
  "section-stats-showcase-four-card-grid",
  "מספרים — רשת 4 כרטיסים",
  "stats-showcase-four-card-grid",
  "#f1efeb",
  "520px",
  IMG.architecture,
  [
    textNode(
      "eyebrow",
      "קצת עלינו",
      {
        color: "#726a60",
        fontSize: "13px",
        fontWeight: "700",
        letterSpacing: "0.14em",
      },
      absoluteLayout(55, 55, "220px", "26px", 20),
    ),
    textNode(
      "title",
      "המספרים מספרים\nאת הסיפור",
      {
        color: "#181715",
        fontSize: "54px",
        fontWeight: "600",
        lineHeight: "1",
        letterSpacing: "-0.055em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(50, 100, "430px", "125px", 20),
    ),
    ...[
      ["14", "שנות ניסיון", "ידע שהופך החלטות לטובות יותר"],
      ["90", "לקוחות פעילים", "שותפויות שנבנות לטווח ארוך"],
      ["150", "פרויקטים", "כל אחד עם סיפור ותוצאה משלו"],
      ["21", "אנשי צוות", "מומחים שעובדים יחד, בלי אגו"],
    ].flatMap(([number, label, copy], index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = 535 + col * 260;
      const y = 55 + row * 215;
      return [
        boxNode(
          `card-${index}`,
          {
            backgroundColor: index === 3 ? "#1d1c1a" : "#faf9f7",
            border: "1px solid rgba(24,23,21,.12)",
            borderRadius: "4px",
          },
          absoluteLayout(x, y, "240px", "190px", 5),
        ),
        textNode(
          `number-${index}`,
          number,
          {
            color: index === 3 ? "#ffffff" : "#181715",
            fontSize: "50px",
            fontWeight: "500",
            letterSpacing: "-0.06em",
          },
          absoluteLayout(x + 22, y + 18, "195px", "62px", 20),
        ),
        textNode(
          `label-${index}`,
          label,
          {
            color: index === 3 ? "#ffffff" : "#282622",
            fontSize: "15px",
            fontWeight: "700",
          },
          absoluteLayout(x + 22, y + 92, "195px", "28px", 20),
        ),
        textNode(
          `copy-${index}`,
          copy,
          {
            color: index === 3 ? "#bbb8b2" : "#777169",
            fontSize: "12px",
            lineHeight: "1.45",
          },
          absoluteLayout(x + 22, y + 128, "195px", "42px", 20),
        ),
      ];
    }),
  ],
);

/** 2 — שורת מספרים גדולים */
const largeNumbersRow = stats(
  "section-stats-showcase-large-row",
  "מספרים — שורה גדולה",
  "stats-showcase-large-row",
  "#111318",
  "400px",
  IMG.finance,
  [
    textNode(
      "title",
      "במספרים",
      {
        color: "#ffffff",
        fontSize: "36px",
        fontWeight: "500",
        letterSpacing: "-0.04em",
        textAlign: "center",
      },
      absoluteLayout(390, 50, "300px", "45px", 20),
    ),
    ...[
      ["500+", "לקוחות"],
      ["98%", "שביעות רצון"],
      ["₪2M", "חיסכון ללקוחות"],
      ["24/7", "תמיכה"],
    ].flatMap(([num, label], index) => {
      const x = 80 + index * 250;
      return [
        textNode(
          `num-${index}`,
          num,
          {
            color: "#ffffff",
            fontSize: "56px",
            fontWeight: "600",
            letterSpacing: "-0.05em",
            textAlign: "center",
          },
          absoluteLayout(x, 130, "220px", "70px", 20),
        ),
        textNode(
          `label-${index}`,
          label,
          {
            color: "rgba(255,255,255,.55)",
            fontSize: "15px",
            fontWeight: "600",
            textAlign: "center",
          },
          absoluteLayout(x, 210, "220px", "24px", 20),
        ),
        ...(index < 3
          ? [
              boxNode(
                `divider-${index}`,
                { backgroundColor: "rgba(255,255,255,.12)" },
                absoluteLayout(x + 230, 150, "1px", "80px", 5),
              ),
            ]
          : []),
      ];
    }),
  ],
);

/** 3 — פיצול עם תמונה */
const splitWithImage = stats(
  "section-stats-showcase-split-image",
  "מספרים — פיצול עם תמונה",
  "stats-showcase-split-image",
  "#ffffff",
  "580px",
  IMG.construction,
  [
    imageNode(
      "image",
      IMG.construction,
      { borderRadius: "0", objectFit: "cover" },
      absoluteLayout(0, 0, "480px", "580px", 5),
      "פרויקטים",
    ),
    textNode(
      "eyebrow",
      "הישגים",
      {
        color: "#777b82",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.14em",
      },
      absoluteLayout(540, 55, "200px", "24px", 20),
    ),
    textNode(
      "title",
      "מספרים\nשמדברים.",
      {
        color: ink,
        fontSize: "48px",
        fontWeight: "500",
        lineHeight: "1",
        letterSpacing: "-0.05em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(540, 95, "460px", "110px", 20),
    ),
    ...[
      ["120+", "פרויקטים שהושלמו"],
      ["₪80M", "תקציב מצטבר"],
      ["15", "שנות ניסיון"],
      ["0", "פרויקטים שלא נמסרו בזמן"],
    ].flatMap(([num, label], index) => {
      const y = 230 + index * 80;
      return [
        textNode(
          `num-${index}`,
          num,
          {
            color: index === 3 ? "#8a7359" : ink,
            fontSize: "36px",
            fontWeight: "600",
            letterSpacing: "-0.04em",
          },
          absoluteLayout(540, y, "150px", "45px", 20),
        ),
        textNode(
          `label-${index}`,
          label,
          { ...body, fontSize: "15px" },
          absoluteLayout(710, y + 8, "350px", "28px", 20),
        ),
        boxNode(
          `rule-${index}`,
          { backgroundColor: "#eceef1" },
          absoluteLayout(540, y + 65, "520px", "1px", 5),
        ),
      ];
    }),
  ],
);

/** 4 — Hero כהה */
const darkHero = stats(
  "section-stats-showcase-dark-hero",
  "מספרים — Hero כהה",
  "stats-showcase-dark-hero",
  "#171717",
  "520px",
  IMG.tech,
  [
    imageNode(
      "bg",
      IMG.tech,
      {
        borderRadius: "0px",
        objectFit: "cover",
        filter: "brightness(.4) saturate(.8)",
        opacity: "0.6",
      },
      absoluteLayout(0, 0, "1080px", "520px", 2),
      "רקע",
    ),
    boxNode(
      "shade",
      {
        backgroundImage:
          "linear-gradient(180deg,rgba(9,12,14,.5) 0%,rgba(9,12,14,.85) 100%)",
      },
      absoluteLayout(0, 0, "1080px", "520px", 5),
    ),
    textNode(
      "eyebrow",
      "2026 · ביצועים",
      {
        color: "#f5c86f",
        fontSize: "13px",
        fontWeight: "700",
        letterSpacing: "0.15em",
        textAlign: "center",
      },
      absoluteLayout(400, 80, "280px", "26px", 20),
    ),
    textNode(
      "title",
      "הצמיחה שלנו\nבמספרים",
      {
        color: "#ffffff",
        fontSize: "52px",
        fontWeight: "600",
        lineHeight: "0.98",
        letterSpacing: "-0.055em",
        whiteSpace: "pre-line",
        textAlign: "center",
      },
      absoluteLayout(240, 120, "600px", "120px", 20),
    ),
    ...[
      ["3x", "צמיחה"],
      ["40%", "חיסכון"],
      ["99.9%", "Uptime"],
    ].flatMap(([num, label], index) => {
      const x = 280 + index * 240;
      return [
        textNode(
          `num-${index}`,
          num,
          {
            color: "#ffffff",
            fontSize: "48px",
            fontWeight: "600",
            letterSpacing: "-0.05em",
            textAlign: "center",
          },
          absoluteLayout(x, 280, "200px", "60px", 20),
        ),
        textNode(
          `label-${index}`,
          label,
          {
            color: "rgba(255,255,255,.55)",
            fontSize: "15px",
            fontWeight: "600",
            textAlign: "center",
          },
          absoluteLayout(x, 350, "200px", "24px", 20),
        ),
      ];
    }),
  ],
);

/** 5 — Bento אסימטרי */
const bentoStats = stats(
  "section-stats-showcase-bento",
  "מספרים — רשת Bento",
  "stats-showcase-bento",
  "#efe8df",
  "580px",
  IMG.ecommerce,
  [
    textNode(
      "eyebrow",
      "הישגים",
      {
        color: "#8a7359",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.16em",
      },
      absoluteLayout(45, 40, "200px", "22px", 20),
    ),
    textNode(
      "title",
      "מספרים שמוכיחים",
      {
        color: ink,
        fontSize: "40px",
        fontWeight: "500",
        letterSpacing: "-0.04em",
      },
      absoluteLayout(45, 72, "480px", "55px", 20),
    ),
    boxNode(
      "card-main",
      { backgroundColor: ink, borderRadius: "20px" },
      absoluteLayout(45, 150, "400px", "380px", 8),
    ),
    textNode(
      "main-num",
      "250%",
      {
        color: "#ffffff",
        fontSize: "72px",
        fontWeight: "600",
        letterSpacing: "-0.06em",
      },
      absoluteLayout(75, 190, "340px", "85px", 20),
    ),
    textNode(
      "main-label",
      "גידול במכירות",
      { color: "rgba(255,255,255,.65)", fontSize: "18px", fontWeight: "600" },
      absoluteLayout(75, 290, "340px", "28px", 20),
    ),
    textNode(
      "main-copy",
      "ממוצע ללקוחות שעברו לפלטפורמה שלנו ב-2025.",
      { color: "rgba(255,255,255,.5)", fontSize: "14px", lineHeight: "1.5" },
      absoluteLayout(75, 330, "320px", "50px", 20),
    ),
    ...[
      ["12K", "משתמשים", "#ffffff"],
      ["4.9", "דירוג", "#ffffff"],
      ["48h", "זמן תגובה", "#ffffff"],
    ].flatMap(([num, label, bg], index) => {
      const y = 150 + index * 125;
      return [
        boxNode(
          `side-${index}`,
          {
            backgroundColor: String(bg),
            borderRadius: "16px",
            border: "1px solid #e5e0d8",
          },
          absoluteLayout(470, y, "570px", "110px", 8),
        ),
        textNode(
          `num-${index}`,
          num,
          {
            color: ink,
            fontSize: "36px",
            fontWeight: "600",
            letterSpacing: "-0.04em",
          },
          absoluteLayout(500, y + 25, "150px", "45px", 20),
        ),
        textNode(
          `label-${index}`,
          label,
          { ...body, fontSize: "15px", fontWeight: "600" },
          absoluteLayout(670, y + 38, "340px", "28px", 20),
        ),
      ];
    }),
  ],
);

/** 6 — ציר זמן עם מטריקות */
const timelineMetrics = stats(
  "section-stats-showcase-timeline",
  "מספרים — ציר זמן",
  "stats-showcase-timeline",
  "#f7f5f1",
  "620px",
  IMG.nature,
  [
    textNode(
      "title",
      "הצמיחה שלנו",
      {
        color: "#1d1b18",
        fontSize: "42px",
        fontWeight: "600",
        letterSpacing: "-0.04em",
      },
      absoluteLayout(45, 40, "500px", "55px", 20),
    ),
    boxNode(
      "line",
      { backgroundColor: "#d6d0c7" },
      absoluteLayout(45, 130, "990px", "3px", 5),
    ),
    ...[
      ["2018", "5", "לקוחות"],
      ["2020", "40", "לקוחות"],
      ["2022", "120", "לקוחות"],
      ["2024", "350", "לקוחות"],
      ["2026", "500+", "לקוחות"],
    ].flatMap(([year, num, label], index) => {
      const x = 45 + index * 200;
      return [
        boxNode(
          `dot-${index}`,
          { backgroundColor: index === 4 ? ink : "#d6d0c7", borderRadius: "50%" },
          absoluteLayout(x + 70, 122, "18px", "18px", 10),
        ),
        textNode(
          `year-${index}`,
          year,
          { color: "#8a7359", fontSize: "13px", fontWeight: "700" },
          absoluteLayout(x, 155, "160px", "22px", 20),
        ),
        textNode(
          `num-${index}`,
          num,
          {
            color: ink,
            fontSize: "40px",
            fontWeight: "600",
            letterSpacing: "-0.05em",
          },
          absoluteLayout(x, 185, "160px", "50px", 20),
        ),
        textNode(
          `label-${index}`,
          label,
          { color: "#66615a", fontSize: "14px" },
          absoluteLayout(x, 240, "160px", "22px", 20),
        ),
      ];
    }),
    imageNode(
      "image",
      IMG.nature,
      { borderRadius: "4px", objectFit: "cover" },
      absoluteLayout(45, 300, "990px", "280px", 8),
      "הדרך שלנו",
    ),
  ],
);

/** 7 — שורה מינימליסטית */
const minimalCounterRow = stats(
  "section-stats-showcase-minimal-row",
  "מספרים — שורה מינימליסטית",
  "stats-showcase-minimal-row",
  "#ffffff",
  "360px",
  IMG.wellness,
  [
    textNode(
      "eyebrow",
      "תוצאות",
      {
        color: "#777b82",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.16em",
        textAlign: "center",
      },
      absoluteLayout(440, 50, "200px", "22px", 20),
    ),
    ...[
      ["10K+", "טיפולים"],
      ["95%", "חוזרים"],
      ["4.8", "דירוג"],
      ["8", "שנים"],
    ].flatMap(([num, label], index) => {
      const x = 90 + index * 240;
      return [
        textNode(
          `num-${index}`,
          num,
          {
            color: ink,
            fontSize: "48px",
            fontWeight: "500",
            letterSpacing: "-0.05em",
            textAlign: "center",
          },
          absoluteLayout(x, 100, "200px", "60px", 20),
        ),
        textNode(
          `label-${index}`,
          label,
          {
            color: "#777b82",
            fontSize: "14px",
            fontWeight: "600",
            textAlign: "center",
          },
          absoluteLayout(x, 170, "200px", "24px", 20),
        ),
        ...(index < 3
          ? [
              boxNode(
                `rule-${index}`,
                { backgroundColor: "#eceef1" },
                absoluteLayout(x + 210, 120, "1px", "60px", 5),
              ),
            ]
          : []),
      ];
    }),
    boxNode(
      "bottom-rule",
      { backgroundColor: "#eceef1" },
      absoluteLayout(90, 230, "900px", "1px", 5),
    ),
    textNode(
      "copy",
      "מספרים אמיתיים מלקוחות אמיתיים — בלי עיגולים ובלי הפתעות.",
      { ...body, fontSize: "15px", textAlign: "center" },
      absoluteLayout(240, 260, "600px", "40px", 20),
    ),
  ],
);

/** 8 — Editorial grid עם CTA */
const editorialGrid = stats(
  "section-stats-showcase-editorial-grid",
  "מספרים — Editorial Grid",
  "stats-showcase-editorial-grid",
  "#faf8f4",
  "640px",
  IMG.realestate,
  [
    textNode(
      "eyebrow",
      "2026 · ביצועים",
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
      "תוצאות\nשאפשר למדוד",
      {
        color: "#1c1915",
        fontSize: "52px",
        fontWeight: "500",
        lineHeight: "0.98",
        letterSpacing: "-0.055em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(45, 75, "400px", "120px", 20),
    ),
    imageNode(
      "image",
      IMG.realestate,
      { borderRadius: "2px", objectFit: "cover" },
      absoluteLayout(45, 220, "420px", "380px", 5),
      "נדל״ן",
    ),
    ...[
      ["₪120M", "מכירות", "נפח עסקאות ב-2025"],
      ["340", "נכסים", "ברשימה הפעילה"],
      ["18", "ימים", "זמן מכירה ממוצע"],
      ["92%", "הצלחה", "סגירת עסקאות"],
    ].flatMap(([num, label, copy], index) => {
      const y = 75 + index * 120;
      return [
        textNode(
          `num-${index}`,
          num,
          {
            color: "#1c1915",
            fontSize: "32px",
            fontWeight: "600",
            letterSpacing: "-0.04em",
          },
          absoluteLayout(520, y, "180px", "40px", 20),
        ),
        textNode(
          `label-${index}`,
          label,
          { color: "#1c1915", fontSize: "16px", fontWeight: "700" },
          absoluteLayout(710, y + 2, "200px", "24px", 20),
        ),
        textNode(
          `copy-${index}`,
          copy,
          { color: "#7a7166", fontSize: "13px" },
          absoluteLayout(710, y + 30, "320px", "22px", 20),
        ),
        boxNode(
          `rule-${index}`,
          { backgroundColor: "#e6dfd4" },
          absoluteLayout(520, y + 65, "510px", "1px", 5),
        ),
      ];
    }),
    buttonNode(
      "cta",
      "דוח מלא",
      {
        ...button,
        backgroundColor: "#1c1915",
      },
      absoluteLayout(520, 540, "160px", "46px", 20),
    ),
  ],
);

export const STATS_SHOWCASE_SECTIONS: VisualLibrarySectionTemplate[] = [
  fourCardGrid,
  largeNumbersRow,
  splitWithImage,
  darkHero,
  bentoStats,
  timelineMetrics,
  minimalCounterRow,
  editorialGrid,
];
