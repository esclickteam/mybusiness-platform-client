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

function features(
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
    category: "features",
    title,
    description: "סקשן יתרונות מקצועי בקומפוזיציה Editorial ייחודית",
    keywords: ["יתרונות", "features", "למה אנחנו", "ערך", "wix"],
    previewLayout,
    backgroundColor,
    minHeight,
    thumbnail,
    nodes,
  };
}

/** 1 — ארבעה עמודי תווך עם אייקון מספר */
const pillarGrid = features(
  "section-features-showcase-pillar-grid",
  "יתרונות — ארבעה עמודי תווך",
  "features-showcase-pillar-grid",
  "#f8f6f2",
  "640px",
  IMG.tech,
  [
    textNode(
      "eyebrow",
      "למה לבחור בנו",
      {
        color: "#8a7359",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.16em",
      },
      absoluteLayout(40, 40, "260px", "24px", 20),
    ),
    textNode(
      "title",
      "יתרונות שמרגישים\nמהיום הראשון",
      {
        color: ink,
        fontSize: "46px",
        fontWeight: "500",
        lineHeight: "1.02",
        letterSpacing: "-0.05em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(40, 72, "520px", "110px", 20),
    ),
    ...[
      ["01", "מהירות", "תוצאות בזמן קצר, בלי לפגוע באיכות"],
      ["02", "דיוק", "כל פרט נבדק — מהרעיון ועד ההשקה"],
      ["03", "שקיפות", "עדכונים ברורים ולוחות זמנים אמיתיים"],
      ["04", "ליווי", "צוות זמין גם אחרי שהפרויקט עלה לאוויר"],
    ].flatMap(([num, heading, copy], index) => {
      const x = 40 + index * 255;
      return [
        boxNode(
          `card-${index}`,
          { backgroundColor: "#ffffff", borderRadius: "18px" },
          absoluteLayout(x, 220, "230px", "360px", 8),
        ),
        textNode(
          `num-${index}`,
          num,
          {
            color: "#d4c9b8",
            fontSize: "48px",
            fontWeight: "600",
            letterSpacing: "-0.04em",
          },
          absoluteLayout(x + 24, 250, "100px", "60px", 20),
        ),
        textNode(
          `heading-${index}`,
          heading,
          { color: ink, fontSize: "24px", fontWeight: "700" },
          absoluteLayout(x + 24, 330, "180px", "36px", 20),
        ),
        textNode(
          `copy-${index}`,
          copy,
          { ...body, fontSize: "14px", lineHeight: "1.6" },
          absoluteLayout(x + 24, 380, "180px", "80px", 20),
        ),
        boxNode(
          `accent-${index}`,
          { backgroundColor: ink },
          absoluteLayout(x + 24, 520, "40px", "3px", 10),
        ),
      ];
    }),
  ],
);

/** 2 — פיצול תמונה עם רשימת סימון */
const splitChecklist = features(
  "section-features-showcase-split-checklist",
  "יתרונות — פיצול עם רשימה",
  "features-showcase-split-checklist",
  "#ffffff",
  "680px",
  IMG.workspace,
  [
    imageNode(
      "image",
      IMG.workspace,
      { borderRadius: "0", objectFit: "cover" },
      absoluteLayout(0, 0, "500px", "680px", 5),
      "סביבת עבודה",
    ),
    boxNode(
      "scrim",
      {
        backgroundImage:
          "linear-gradient(90deg, transparent 30%, rgba(255,255,255,.95) 100%)",
      },
      absoluteLayout(0, 0, "500px", "680px", 6),
    ),
    textNode(
      "eyebrow",
      "הערך שלנו",
      {
        color: "#777b82",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.14em",
      },
      absoluteLayout(560, 55, "220px", "24px", 20),
    ),
    textNode(
      "title",
      "שישה יתרונות\nשמשנים את התמונה",
      {
        color: ink,
        fontSize: "44px",
        fontWeight: "500",
        lineHeight: "1.05",
        letterSpacing: "-0.045em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(560, 95, "460px", "110px", 20),
    ),
    ...[
      "חיסכון של עד 40% בזמן הפעלה",
      "ממשק שמותאם לקהל הישראלי",
      "אינטגרציה עם כלים שכבר בשימוש",
      "תמיכה בעברית מלאה, 24/7",
      "עדכונים אוטומטיים ללא עלות נוספת",
      "אבטחת מידע ברמה גבוהה",
    ].flatMap((item, index) => {
      const y = 240 + index * 58;
      return [
        textNode(
          `check-${index}`,
          "✓",
          {
            color: "#2d8a5e",
            fontSize: "18px",
            fontWeight: "700",
          },
          absoluteLayout(560, y, "30px", "28px", 20),
        ),
        textNode(
          `item-${index}`,
          item,
          { color: ink, fontSize: "16px", fontWeight: "500", lineHeight: "1.4" },
          absoluteLayout(600, y, "420px", "28px", 20),
        ),
      ];
    }),
    buttonNode(
      "cta",
      "גלו עוד",
      button,
      absoluteLayout(560, 600, "160px", "48px", 20),
    ),
  ],
);

/** 3 — השוואה: לפני ואחרי */
const comparisonSplit = features(
  "section-features-showcase-comparison-split",
  "יתרונות — השוואה לפני/אחרי",
  "features-showcase-comparison-split",
  "#111318",
  "620px",
  IMG.finance,
  [
    textNode(
      "title",
      "ההבדל שמרגישים מיד",
      {
        color: "#ffffff",
        fontSize: "42px",
        fontWeight: "500",
        letterSpacing: "-0.04em",
        textAlign: "center",
      },
      absoluteLayout(240, 40, "600px", "55px", 20),
    ),
    textNode(
      "copy",
      "אותו עסק — שני מצבים. רק אחד מהם מניע צמיחה.",
      {
        color: "rgba(255,255,255,.55)",
        fontSize: "15px",
        textAlign: "center",
      },
      absoluteLayout(280, 100, "520px", "30px", 20),
    ),
    boxNode(
      "before-card",
      { backgroundColor: "#1c1f26", borderRadius: "16px" },
      absoluteLayout(60, 170, "460px", "400px", 8),
    ),
    textNode(
      "before-label",
      "לפני",
      {
        color: "rgba(255,255,255,.45)",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.14em",
      },
      absoluteLayout(90, 200, "100px", "22px", 20),
    ),
    ...[
      "אתר שלא ממיר מבקרים",
      "תהליכים ידניים ואיטיים",
      "לקוחות שמתקשים למצוא מידע",
      "עלויות שיווק גבוהות ללא תוצאה",
    ].flatMap((item, index) =>
      textNode(
        `before-${index}`,
        `✕  ${item}`,
        { color: "rgba(255,255,255,.5)", fontSize: "15px", lineHeight: "1.8" },
        absoluteLayout(90, 240 + index * 38, "400px", "28px", 20),
      ),
    ),
    boxNode(
      "after-card",
      { backgroundColor: "#ffffff", borderRadius: "16px" },
      absoluteLayout(560, 170, "460px", "400px", 8),
    ),
    textNode(
      "after-label",
      "אחרי",
      {
        color: "#2d8a5e",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.14em",
      },
      absoluteLayout(590, 200, "100px", "22px", 20),
    ),
    ...[
      "חוויה שמובילה לפעולה",
      "אוטומציה שחוסכת שעות בשבוע",
      "מידע ברור בכל נקודת מגע",
      "צמיחה מדידה וצפויה",
    ].flatMap((item, index) =>
      textNode(
        `after-${index}`,
        `✓  ${item}`,
        { color: ink, fontSize: "15px", fontWeight: "500", lineHeight: "1.8" },
        absoluteLayout(590, 240 + index * 38, "400px", "28px", 20),
      ),
    ),
    imageNode(
      "arrow",
      IMG.abstract,
      { borderRadius: "999px", objectFit: "cover", opacity: "0.15" },
      absoluteLayout(470, 320, "140px", "140px", 10),
      "מעבר",
    ),
    textNode(
      "arrow-label",
      "→",
      { color: "#ffffff", fontSize: "36px", fontWeight: "300", textAlign: "center" },
      absoluteLayout(505, 365, "70px", "50px", 20),
    ),
  ],
);

/** 4 — מספרים גדולים עם תוויות */
const statsCounters = features(
  "section-features-showcase-stats-counters",
  "יתרונות — מספרים מרשימים",
  "features-showcase-stats-counters",
  "#eef2f7",
  "560px",
  IMG.ecommerce,
  [
    textNode(
      "eyebrow",
      "במספרים",
      {
        color: "#6b7280",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.16em",
        textAlign: "center",
      },
      absoluteLayout(440, 40, "200px", "22px", 20),
    ),
    textNode(
      "title",
      "יתרונות שמדברים בעד עצמם",
      {
        color: ink,
        fontSize: "40px",
        fontWeight: "600",
        letterSpacing: "-0.04em",
        textAlign: "center",
      },
      absoluteLayout(240, 72, "600px", "55px", 20),
    ),
    ...[
      ["98%", "שביעות רצון לקוחות", "מדד שנתי ממוצע"],
      ["3×", "צמיחה במכירות", "תוך ששה חודשים"],
      ["24/7", "זמינות תמיכה", "צוות מקומי בעברית"],
      ["-35%", "חיסכון בעלויות", "השוואה לפתרונות ישנים"],
    ].flatMap(([num, heading, copy], index) => {
      const x = 60 + index * 255;
      return [
        boxNode(
          `stat-${index}`,
          { backgroundColor: "#ffffff", borderRadius: "20px" },
          absoluteLayout(x, 170, "230px", "340px", 8),
        ),
        textNode(
          `num-${index}`,
          num,
          {
            color: ink,
            fontSize: "56px",
            fontWeight: "600",
            letterSpacing: "-0.05em",
            textAlign: "center",
          },
          absoluteLayout(x + 15, 210, "200px", "70px", 20),
        ),
        textNode(
          `heading-${index}`,
          heading,
          {
            color: ink,
            fontSize: "18px",
            fontWeight: "700",
            textAlign: "center",
          },
          absoluteLayout(x + 15, 300, "200px", "30px", 20),
        ),
        textNode(
          `copy-${index}`,
          copy,
          { ...body, fontSize: "13px", textAlign: "center" },
          absoluteLayout(x + 15, 340, "200px", "40px", 20),
        ),
      ];
    }),
  ],
);

/** 5 — ציר זמן אופקי של יתרונות */
const horizontalTimeline = features(
  "section-features-showcase-horizontal-timeline",
  "יתרונות — ציר זמן אופקי",
  "features-showcase-horizontal-timeline",
  "#faf8f4",
  "580px",
  IMG.construction,
  [
    textNode(
      "title",
      "מסע היתרונות שלכם",
      {
        color: "#1c1915",
        fontSize: "42px",
        fontWeight: "500",
        letterSpacing: "-0.04em",
      },
      absoluteLayout(40, 40, "500px", "55px", 20),
    ),
    textNode(
      "copy",
      "כל שלב מוסיף ערך — מההתחלה ועד התוצאה.",
      { color: "#7a7166", fontSize: "16px" },
      absoluteLayout(40, 100, "480px", "30px", 20),
    ),
    boxNode(
      "line",
      { backgroundColor: "#e6dfd4" },
      absoluteLayout(40, 280, "1000px", "2px", 5),
    ),
    ...[
      ["שבוע 1", "הקמה", "הגדרה מהירה וממשק מוכן"],
      ["שבוע 2", "התאמה", "עיצוב ותוכן לפי המותג"],
      ["שבוע 3", "השקה", "עלייה לאוויר עם ליווי"],
      ["שבוע 4+", "צמיחה", "אופטימיזציה ותוצאות"],
    ].flatMap(([time, heading, copy], index) => {
      const x = 60 + index * 250;
      return [
        boxNode(
          `dot-${index}`,
          { backgroundColor: ink, borderRadius: "999px" },
          absoluteLayout(x + 80, 268, "16px", "16px", 10),
        ),
        textNode(
          `time-${index}`,
          time,
          { color: "#9a8b78", fontSize: "12px", fontWeight: "700" },
          absoluteLayout(x, 220, "180px", "22px", 20),
        ),
        textNode(
          `heading-${index}`,
          heading,
          { color: "#1c1915", fontSize: "22px", fontWeight: "700" },
          absoluteLayout(x, 310, "200px", "32px", 20),
        ),
        textNode(
          `copy-${index}`,
          copy,
          { color: "#7a7166", fontSize: "14px", lineHeight: "1.5" },
          absoluteLayout(x, 350, "210px", "50px", 20),
        ),
      ];
    }),
  ],
);

/** 6 — כרטיסים מדורגים (staggered) */
const staggeredCards = features(
  "section-features-showcase-staggered-cards",
  "יתרונות — כרטיסים מדורגים",
  "features-showcase-staggered-cards",
  "#ffffff",
  "720px",
  IMG.wellness,
  [
    textNode(
      "eyebrow",
      "יתרונות מרכזיים",
      {
        color: "#8b9098",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.18em",
      },
      absoluteLayout(40, 45, "240px", "22px", 20),
    ),
    textNode(
      "title",
      "כל יתרון\nבמקום שלו",
      {
        color: ink,
        fontSize: "52px",
        fontWeight: "500",
        lineHeight: "1",
        letterSpacing: "-0.055em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(40, 80, "380px", "120px", 20),
    ),
    ...[
      [IMG.wellness, 40, "גמישות", "התאמה לקצב ולצרכים שלכם"],
      [IMG.skincare, 180, "איכות", "סטנדרט גבוה בכל שלב"],
      [IMG.fitness, 340, "אנרגיה", "צוות שמכניס מומנטום לפרויקט"],
      [IMG.nature, 480, "קיימות", "פתרונות שחוסכים משאבים"],
    ].flatMap(([src, y, heading, copy], index) => {
      const cardY = Number(y);
      const offsetX = index % 2 === 0 ? 480 : 560;
      return [
        boxNode(
          `card-${index}`,
          { backgroundColor: "#f3f4f6", borderRadius: "16px" },
          absoluteLayout(offsetX, cardY, "480px", "120px", 8),
        ),
        imageNode(
          `image-${index}`,
          String(src),
          { borderRadius: "10px", objectFit: "cover" },
          absoluteLayout(offsetX + 16, cardY + 16, "88px", "88px", 10),
          String(heading),
        ),
        textNode(
          `heading-${index}`,
          String(heading),
          { color: ink, fontSize: "22px", fontWeight: "700" },
          absoluteLayout(offsetX + 120, cardY + 28, "300px", "32px", 20),
        ),
        textNode(
          `copy-${index}`,
          String(copy),
          { ...body, fontSize: "14px" },
          absoluteLayout(offsetX + 120, cardY + 62, "320px", "30px", 20),
        ),
      ];
    }),
  ],
);

/** 7 — רשימת יתרונות עם ציטוט מודגש */
const quoteAccent = features(
  "section-features-showcase-quote-accent",
  "יתרונות — רשימה עם ציטוט",
  "features-showcase-quote-accent",
  "#efe8df",
  "660px",
  IMG.team,
  [
    imageNode(
      "portrait",
      IMG.team,
      { borderRadius: "999px", objectFit: "cover" },
      absoluteLayout(40, 40, "120px", "120px", 10),
      "צוות",
    ),
    textNode(
      "quote",
      "״היתרונות האלה לא רק על הנייר —\nאנחנו חווים אותם כל יום.״",
      {
        color: ink,
        fontSize: "28px",
        fontWeight: "500",
        lineHeight: "1.3",
        letterSpacing: "-0.03em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(180, 50, "520px", "100px", 20),
    ),
    textNode(
      "author",
      "— מנהלת תפעול, לקוחה מרוצה",
      { color: "#8a7359", fontSize: "14px", fontWeight: "600" },
      absoluteLayout(180, 160, "400px", "24px", 20),
    ),
    boxNode(
      "divider",
      { backgroundColor: "#d4c9b8" },
      absoluteLayout(40, 210, "1000px", "1px", 5),
    ),
    ...[
      ["חיסכון בזמן", "תהליכים אוטומטיים שמשחררים את הצוות"],
      ["שקט נפשי", "ליווי מקצועי בכל שלב"],
      ["תוצאות מדידות", "דוחות ברורים שמראים את ההשפעה"],
      ["גמישות מלאה", "התאמה לשינויים בלי כאב ראש"],
    ].flatMap(([heading, copy], index) => {
      const x = 40 + index * 255;
      return [
        textNode(
          `heading-${index}`,
          heading,
          { color: ink, fontSize: "20px", fontWeight: "700" },
          absoluteLayout(x, 250, "220px", "30px", 20),
        ),
        textNode(
          `copy-${index}`,
          copy,
          { ...body, fontSize: "14px", lineHeight: "1.6" },
          absoluteLayout(x, 290, "220px", "60px", 20),
        ),
        boxNode(
          `rule-${index}`,
          { backgroundColor: ink },
          absoluteLayout(x, 380, "30px", "2px", 10),
        ),
      ];
    }),
    buttonNode(
      "cta",
      "קראו עוד סיפורי הצלחה",
      { ...button, backgroundColor: "#8a7359" },
      absoluteLayout(40, 560, "260px", "48px", 20),
    ),
  ],
);

/** 8 — רשת Bento ליתרונות */
const bentoFeatures = features(
  "section-features-showcase-bento-features",
  "יתרונות — רשת Bento",
  "features-showcase-bento-features",
  "#0f1419",
  "700px",
  IMG.medical,
  [
    textNode(
      "eyebrow",
      "יתרונות מרכזיים",
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
      "הכל במקום אחד",
      {
        color: "#ffffff",
        fontSize: "44px",
        fontWeight: "500",
        letterSpacing: "-0.045em",
      },
      absoluteLayout(45, 72, "520px", "60px", 20),
    ),
    boxNode(
      "hero-card",
      { backgroundColor: "#1a2028", borderRadius: "18px" },
      absoluteLayout(45, 160, "520px", "500px", 8),
    ),
    imageNode(
      "hero-image",
      IMG.medical,
      { borderRadius: "14px", objectFit: "cover", opacity: "0.88" },
      absoluteLayout(70, 185, "470px", "260px", 10),
      "אמינות",
    ),
    textNode(
      "hero-heading",
      "אמינות ללא פשרות",
      { color: "#ffffff", fontSize: "28px", fontWeight: "700" },
      absoluteLayout(70, 470, "400px", "40px", 20),
    ),
    textNode(
      "hero-copy",
      "תקנים גבוהים, אבטחה מלאה ושקיפות בכל תהליך.",
      { color: "rgba(255,255,255,.65)", fontSize: "14px", lineHeight: "1.5" },
      absoluteLayout(70, 520, "400px", "50px", 20),
    ),
    ...[
      [IMG.education, 590, 160, 450, 235, "ידע", "הדרכות וכלים לצוות"],
      [IMG.legal, 590, 420, 450, 240, "הגנה", "מסגרת משפטית ברורה"],
    ].flatMap(([src, x, y, w, h, heading, copy], index) => [
      boxNode(
        `card-${index}`,
        { backgroundColor: "#1a2028", borderRadius: "18px" },
        absoluteLayout(Number(x), Number(y), `${Number(w)}px`, `${Number(h)}px`, 8),
      ),
      imageNode(
        `image-${index}`,
        String(src),
        { borderRadius: "12px", objectFit: "cover", opacity: "0.85" },
        absoluteLayout(Number(x) + 20, Number(y) + 18, `${Number(w) - 40}px`, "100px", 10),
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

export const FEATURES_SHOWCASE_SECTIONS: VisualLibrarySectionTemplate[] = [
  pillarGrid,
  splitChecklist,
  comparisonSplit,
  statsCounters,
  horizontalTimeline,
  staggeredCards,
  quoteAccent,
  bentoFeatures,
];
