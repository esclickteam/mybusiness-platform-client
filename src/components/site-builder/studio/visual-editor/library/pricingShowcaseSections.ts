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

function pricing(
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
    category: "pricing",
    title,
    description: "סקשן תמחור מקצועי בקומפוזיציה Editorial ייחודית",
    keywords: ["תמחור", "pricing", "מחירים", "חבילות", "wix"],
    previewLayout,
    backgroundColor,
    minHeight,
    thumbnail,
    nodes,
  };
}

/** 1 — שלוש חבילות קלאסיות */
const threeTiers = pricing(
  "section-pricing-showcase-three-tiers",
  "תמחור — שלוש חבילות",
  "pricing-showcase-three-tiers",
  "#f7f3ee",
  "680px",
  IMG.finance,
  [
    textNode(
      "title",
      "בחרו את החבילה\nשמתאימה לקצב שלכם",
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
      ["בסיס", "₪290", "#ffffff", ink, ["עמוד נחיתה", "עיצוב מותאם", "תמיכה בדוא״ל"]],
      ["עסקי", "₪590", ink, "#ffffff", ["אתר מלא", "SEO בסיסי", "טפסים חכמים", "ליווי חודשי"]],
      ["פרימיום", "₪990", "#ffffff", ink, ["אסטרטגיה", "אתר + חנות", "קמפיינים", "צוות ייעודי"]],
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
        textNode(
          `period-${index}`,
          "לחודש",
          {
            color: bg === ink ? "rgba(255,255,255,.55)" : "#9a9590",
            fontSize: "13px",
          },
          absoluteLayout(x + 30, 300, "240px", "22px", 20),
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
            absoluteLayout(x + 30, 340 + itemIndex * 32, "240px", "28px", 20),
          ),
        ),
        buttonNode(
          `cta-${index}`,
          "בחירה",
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

/** 2 — טבלת השוואה */
const comparisonTable = pricing(
  "section-pricing-showcase-comparison-table",
  "תמחור — טבלת השוואה",
  "pricing-showcase-comparison-table",
  "#ffffff",
  "640px",
  IMG.office,
  [
    textNode(
      "eyebrow",
      "השוואת חבילות",
      {
        color: "#777b82",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.14em",
      },
      absoluteLayout(40, 40, "220px", "24px", 20),
    ),
    textNode(
      "title",
      "מה כלול בכל חבילה",
      {
        color: ink,
        fontSize: "44px",
        fontWeight: "500",
        letterSpacing: "-0.045em",
      },
      absoluteLayout(40, 72, "520px", "55px", 20),
    ),
    boxNode(
      "table",
      { backgroundColor: "#f8f9fa", borderRadius: "16px" },
      absoluteLayout(40, 150, "1000px", "450px", 5),
    ),
    ...["תכונה", "בסיס", "עסקי", "פרימיום"].flatMap((heading, index) =>
      textNode(
        `col-${index}`,
        heading,
        {
          color: index === 0 ? "#777b82" : ink,
          fontSize: index === 0 ? "13px" : "16px",
          fontWeight: "700",
        },
        absoluteLayout(60 + index * 240, 175, "220px", "28px", 20),
      ),
    ),
    ...[
      ["עמודים", "5", "15", "ללא הגבלה"],
      ["תמיכה", "דוא״ל", "צ׳אט", "טלפון 24/7"],
      ["SEO", "—", "✓", "✓"],
      ["חנות", "—", "—", "✓"],
      ["ליווי", "—", "חודשי", "שבועי"],
    ].flatMap(([feature, basic, business, premium], rowIndex) => {
      const y = 230 + rowIndex * 65;
      return [
        boxNode(
          `rule-${rowIndex}`,
          { backgroundColor: "#eceef1" },
          absoluteLayout(60, y + 55, "960px", "1px", 5),
        ),
        textNode(
          `feature-${rowIndex}`,
          feature,
          { color: ink, fontSize: "15px", fontWeight: "600" },
          absoluteLayout(60, y, "220px", "28px", 20),
        ),
        textNode(
          `basic-${rowIndex}`,
          basic,
          { ...body, fontSize: "15px" },
          absoluteLayout(300, y, "220px", "28px", 20),
        ),
        textNode(
          `business-${rowIndex}`,
          business,
          { ...body, fontSize: "15px" },
          absoluteLayout(540, y, "220px", "28px", 20),
        ),
        textNode(
          `premium-${rowIndex}`,
          premium,
          { ...body, fontSize: "15px", fontWeight: business === "✓" ? "700" : "400" },
          absoluteLayout(780, y, "220px", "28px", 20),
        ),
      ];
    }),
  ],
);

/** 3 — ספוטלייט: חבילה מובילה + צד */
const spotlightPlan = pricing(
  "section-pricing-showcase-spotlight-plan",
  "תמחור — ספוטלייט",
  "pricing-showcase-spotlight-plan",
  "#111318",
  "680px",
  IMG.tech,
  [
    imageNode(
      "hero",
      IMG.tech,
      { borderRadius: "6px", objectFit: "cover", opacity: "0.35" },
      absoluteLayout(40, 40, "520px", "600px", 5),
      "חבילה מובילה",
    ),
    boxNode(
      "hero-card",
      { backgroundColor: "#1c1f26", borderRadius: "20px" },
      absoluteLayout(70, 80, "460px", "520px", 8),
    ),
    textNode(
      "badge",
      "הכי פופולרי",
      {
        color: "#111318",
        fontSize: "12px",
        fontWeight: "700",
        backgroundColor: "#f5c86f",
        borderRadius: "999px",
        padding: "8px 14px",
      },
      absoluteLayout(100, 110, "120px", "32px", 20),
    ),
    textNode(
      "hero-name",
      "עסקי",
      { color: "#ffffff", fontSize: "28px", fontWeight: "700" },
      absoluteLayout(100, 160, "300px", "40px", 20),
    ),
    textNode(
      "hero-price",
      "₪590",
      {
        color: "#ffffff",
        fontSize: "56px",
        fontWeight: "600",
        letterSpacing: "-0.05em",
      },
      absoluteLayout(100, 210, "300px", "70px", 20),
    ),
    textNode(
      "hero-period",
      "לחודש · ללא התחייבות",
      { color: "rgba(255,255,255,.55)", fontSize: "14px" },
      absoluteLayout(100, 285, "340px", "24px", 20),
    ),
    ...[
      "אתר מלא עד 15 עמודים",
      "SEO בסיסי ואופטימיזציה",
      "טפסים חכמים ואינטגרציות",
      "ליווי חודשי ודוחות",
    ].flatMap((item, index) =>
      textNode(
        `hero-item-${index}`,
        `✓  ${item}`,
        { color: "rgba(255,255,255,.75)", fontSize: "14px", lineHeight: "1.8" },
        absoluteLayout(100, 330 + index * 32, "380px", "28px", 20),
      ),
    ),
    buttonNode(
      "hero-cta",
      "התחילו עכשיו",
      { ...button, backgroundColor: "#f5c86f", color: ink },
      absoluteLayout(100, 500, "220px", "48px", 20),
    ),
    textNode(
      "side-title",
      "חבילות נוספות",
      { color: "#ffffff", fontSize: "24px", fontWeight: "600" },
      absoluteLayout(620, 60, "380px", "36px", 20),
    ),
    ...[
      ["בסיס", "₪290", "למתחילים"],
      ["פרימיום", "₪990", "לצמיחה מהירה"],
    ].flatMap(([name, price, tagline], index) => {
      const y = 130 + index * 240;
      return [
        boxNode(
          `side-card-${index}`,
          { backgroundColor: "#1c1f26", borderRadius: "16px" },
          absoluteLayout(620, y, "400px", "210px", 8),
        ),
        textNode(
          `side-name-${index}`,
          name,
          { color: "#ffffff", fontSize: "20px", fontWeight: "700" },
          absoluteLayout(650, y + 25, "200px", "28px", 20),
        ),
        textNode(
          `side-price-${index}`,
          price,
          {
            color: "#ffffff",
            fontSize: "36px",
            fontWeight: "600",
            letterSpacing: "-0.04em",
          },
          absoluteLayout(650, y + 60, "200px", "45px", 20),
        ),
        textNode(
          `side-tag-${index}`,
          tagline,
          { color: "rgba(255,255,255,.55)", fontSize: "13px" },
          absoluteLayout(650, y + 115, "300px", "22px", 20),
        ),
        buttonNode(
          `side-cta-${index}`,
          "פרטים",
          {
            ...button,
            backgroundColor: "rgba(255,255,255,.12)",
            color: "#ffffff",
            padding: "10px 20px",
          },
          absoluteLayout(650, y + 155, "140px", "40px", 20),
        ),
      ];
    }),
  ],
);

/** 4 — שורות אופקיות עם תמונה */
const horizontalRows = pricing(
  "section-pricing-showcase-horizontal-rows",
  "תמחור — שורות אופקיות",
  "pricing-showcase-horizontal-rows",
  "#f3f4f6",
  "720px",
  IMG.ecommerce,
  [
    textNode(
      "title",
      "תמחור שקוף וברור",
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
      "כל חבילה כוללת את מה שצריך — בלי הפתעות ובלי אותיות קטנות.",
      { ...body, fontSize: "16px" },
      absoluteLayout(40, 100, "520px", "40px", 20),
    ),
    ...[
      [IMG.ecommerce, "חנות אונליין", "₪790", "חנות מלאה, תשלומים ומשלוחים"],
      [IMG.education, "קורסים דיגיטליים", "₪490", "פלטפורמת למידה ותוכן מוגן"],
      [IMG.hospitality, "הזמנות ואירוח", "₪690", "מערכת הזמנות וניהול לוחות"],
      [IMG.legal, "שירותים מקצועיים", "₪590", "תדמית, טפסים וליווי משפטי"],
    ].flatMap(([src, heading, price, copy], index) => {
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
          `heading-${index}`,
          String(heading),
          { color: ink, fontSize: "22px", fontWeight: "700" },
          absoluteLayout(220, y + 28, "400px", "32px", 20),
        ),
        textNode(
          `copy-${index}`,
          String(copy),
          { ...body, fontSize: "14px" },
          absoluteLayout(220, y + 62, "420px", "30px", 20),
        ),
        textNode(
          `price-${index}`,
          String(price),
          {
            color: ink,
            fontSize: "28px",
            fontWeight: "700",
            letterSpacing: "-0.03em",
          },
          absoluteLayout(780, y + 35, "150px", "40px", 20),
        ),
        buttonNode(
          `cta-${index}`,
          "בחירה",
          { ...button, padding: "10px 18px" },
          absoluteLayout(860, y + 38, "150px", "42px", 20),
        ),
      ];
    }),
  ],
);

/** 5 — Bento: תמחור אסימטרי */
const bentoPricing = pricing(
  "section-pricing-showcase-bento",
  "תמחור — רשת Bento",
  "pricing-showcase-bento",
  "#efe8df",
  "680px",
  IMG.product,
  [
    textNode(
      "eyebrow",
      "תמחור גמיש",
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
      "מחירים שמתאימים\nלכל שלב",
      {
        color: ink,
        fontSize: "44px",
        fontWeight: "500",
        lineHeight: "1.05",
        letterSpacing: "-0.045em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(45, 72, "480px", "100px", 20),
    ),
    boxNode(
      "card-main",
      { backgroundColor: ink, borderRadius: "20px" },
      absoluteLayout(45, 200, "520px", "440px", 8),
    ),
    imageNode(
      "main-image",
      IMG.product,
      { borderRadius: "14px", objectFit: "cover", opacity: "0.85" },
      absoluteLayout(70, 225, "470px", "200px", 10),
      "חבילה מלאה",
    ),
    textNode(
      "main-name",
      "All-in-One",
      { color: "#ffffff", fontSize: "26px", fontWeight: "700" },
      absoluteLayout(70, 450, "300px", "36px", 20),
    ),
    textNode(
      "main-price",
      "₪1,290",
      {
        color: "#ffffff",
        fontSize: "48px",
        fontWeight: "600",
        letterSpacing: "-0.05em",
      },
      absoluteLayout(70, 490, "250px", "60px", 20),
    ),
    textNode(
      "main-copy",
      "הכול במקום אחד — אתר, חנות, שיווק וליווי.",
      { color: "rgba(255,255,255,.65)", fontSize: "14px" },
      absoluteLayout(70, 560, "400px", "40px", 20),
    ),
    ...[
      ["Starter", "₪190", "למתחילים"],
      ["Growth", "₪490", "לצמיחה"],
      ["Scale", "₪890", "להרחבה"],
    ].flatMap(([name, price, tag], index) => {
      const y = 200 + index * 145;
      return [
        boxNode(
          `side-${index}`,
          { backgroundColor: "#ffffff", borderRadius: "16px" },
          absoluteLayout(590, y, "450px", "130px", 8),
        ),
        textNode(
          `side-name-${index}`,
          name,
          { color: ink, fontSize: "18px", fontWeight: "700" },
          absoluteLayout(620, y + 22, "180px", "28px", 20),
        ),
        textNode(
          `side-price-${index}`,
          price,
          {
            color: ink,
            fontSize: "32px",
            fontWeight: "600",
            letterSpacing: "-0.04em",
          },
          absoluteLayout(620, y + 55, "180px", "40px", 20),
        ),
        textNode(
          `side-tag-${index}`,
          tag,
          { ...body, fontSize: "13px" },
          absoluteLayout(820, y + 30, "180px", "22px", 20),
        ),
        buttonNode(
          `side-cta-${index}`,
          "→",
          {
            ...button,
            backgroundColor: "#eef0f3",
            color: ink,
            padding: "10px 16px",
            borderRadius: "50%",
          },
          absoluteLayout(960, y + 42, "46px", "46px", 20),
        ),
      ];
    }),
  ],
);

/** 6 — פיצול: תמונה + רשימת מחירים */
const splitPricing = pricing(
  "section-pricing-showcase-split",
  "תמחור — פיצול עם תמונה",
  "pricing-showcase-split",
  "#ffffff",
  "660px",
  IMG.workspace,
  [
    imageNode(
      "image",
      IMG.workspace,
      { borderRadius: "0", objectFit: "cover" },
      absoluteLayout(0, 0, "480px", "660px", 5),
      "השקעה שמחזירה",
    ),
    textNode(
      "eyebrow",
      "תמחור פשוט",
      {
        color: "#777b82",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.14em",
      },
      absoluteLayout(540, 55, "220px", "24px", 20),
    ),
    textNode(
      "title",
      "שקיפות\nמלאה.",
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
      ["ייעוץ ראשוני", "חינם", "30 דקות ללא התחייבות"],
      ["פרויקט חד־פעמי", "₪2,900", "מיתוג + עמוד נחיתה"],
      ["ליווי חודשי", "₪1,490", "תוכן, עדכונים ותמיכה"],
      ["Enterprise", "בהתאמה", "פתרון מותאם לארגון"],
    ].flatMap(([name, price, copy], index) => {
      const y = 230 + index * 95;
      return [
        textNode(
          `name-${index}`,
          name,
          { color: ink, fontSize: "20px", fontWeight: "700" },
          absoluteLayout(540, y, "280px", "30px", 20),
        ),
        textNode(
          `price-${index}`,
          price,
          {
            color: "#8a7359",
            fontSize: "24px",
            fontWeight: "700",
            letterSpacing: "-0.03em",
          },
          absoluteLayout(850, y, "150px", "30px", 20),
        ),
        textNode(
          `copy-${index}`,
          copy,
          { ...body, fontSize: "13px" },
          absoluteLayout(540, y + 32, "460px", "36px", 20),
        ),
        boxNode(
          `rule-${index}`,
          { backgroundColor: "#eceef1" },
          absoluteLayout(540, y + 78, "450px", "1px", 5),
        ),
      ];
    }),
    buttonNode(
      "cta",
      "קבעו שיחה",
      button,
      absoluteLayout(540, 580, "180px", "48px", 20),
    ),
  ],
);

/** 7 — מתג חודשי/שנתי */
const toggleBilling = pricing(
  "section-pricing-showcase-toggle-billing",
  "תמחור — חודשי / שנתי",
  "pricing-showcase-toggle-billing",
  "#faf8f4",
  "640px",
  IMG.finance,
  [
    textNode(
      "title",
      "תמחור גמיש לפי הצורך",
      {
        color: ink,
        fontSize: "42px",
        fontWeight: "500",
        letterSpacing: "-0.04em",
        textAlign: "center",
      },
      absoluteLayout(240, 40, "600px", "55px", 20),
    ),
    boxNode(
      "toggle-bg",
      { backgroundColor: "#eceef1", borderRadius: "999px" },
      absoluteLayout(400, 115, "280px", "44px", 8),
    ),
    textNode(
      "toggle-monthly",
      "חודשי",
      {
        color: "#ffffff",
        fontSize: "14px",
        fontWeight: "700",
        backgroundColor: ink,
        borderRadius: "999px",
        padding: "10px 28px",
      },
      absoluteLayout(405, 118, "130px", "38px", 20),
    ),
    textNode(
      "toggle-yearly",
      "שנתי · חיסכון 20%",
      { color: "#777b82", fontSize: "14px", fontWeight: "600", padding: "10px 20px" },
      absoluteLayout(545, 120, "130px", "38px", 20),
    ),
    ...[
      ["Essential", "₪290", "₪2,784", ["5 עמודים", "תמיכה בדוא״ל", "SSL"]],
      ["Professional", "₪590", "₪5,664", ["15 עמודים", "SEO", "טפסים", "צ׳אט"]],
      ["Enterprise", "₪990", "₪9,504", ["ללא הגבלה", "API", "SLA", "מנהל חשבון"]],
    ].flatMap(([name, monthly, yearly, items], index) => {
      const x = 60 + index * 340;
      const list = items as string[];
      return [
        boxNode(
          `card-${index}`,
          {
            backgroundColor: index === 1 ? ink : "#ffffff",
            borderRadius: "18px",
            border: index === 1 ? "0" : "1px solid #e6dfd4",
          },
          absoluteLayout(x, 190, "310px", "410px", 8),
        ),
        textNode(
          `name-${index}`,
          name,
          {
            color: index === 1 ? "#ffffff" : ink,
            fontSize: "18px",
            fontWeight: "700",
          },
          absoluteLayout(x + 30, 220, "240px", "28px", 20),
        ),
        textNode(
          `price-${index}`,
          monthly,
          {
            color: index === 1 ? "#ffffff" : ink,
            fontSize: "40px",
            fontWeight: "600",
            letterSpacing: "-0.04em",
          },
          absoluteLayout(x + 30, 260, "240px", "50px", 20),
        ),
        textNode(
          `yearly-${index}`,
          `${yearly} לשנה`,
          {
            color: index === 1 ? "rgba(255,255,255,.5)" : "#9a9590",
            fontSize: "13px",
          },
          absoluteLayout(x + 30, 315, "240px", "22px", 20),
        ),
        ...list.flatMap((item, itemIndex) =>
          textNode(
            `item-${index}-${itemIndex}`,
            `•  ${item}`,
            {
              color: index === 1 ? "rgba(255,255,255,.72)" : "#6a655e",
              fontSize: "14px",
              lineHeight: "1.8",
            },
            absoluteLayout(x + 30, 355 + itemIndex * 30, "240px", "28px", 20),
          ),
        ),
        buttonNode(
          `cta-${index}`,
          "התחילו",
          {
            ...button,
            backgroundColor: index === 1 ? "#ffffff" : ink,
            color: index === 1 ? ink : "#ffffff",
          },
          absoluteLayout(x + 30, 530, "250px", "46px", 20),
        ),
      ];
    }),
  ],
);

/** 8 — מגזין: Ledger עם מחירים */
const magazineLedger = pricing(
  "section-pricing-showcase-magazine-ledger",
  "תמחור — מגזין Ledger",
  "pricing-showcase-magazine-ledger",
  "#f1efeb",
  "700px",
  IMG.architecture,
  [
    textNode(
      "eyebrow",
      "מחירון 2026",
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
      "כל מה שצריך\nבמחיר אחד",
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
      IMG.architecture,
      { borderRadius: "2px", objectFit: "cover" },
      absoluteLayout(45, 240, "500px", "400px", 5),
      "פרויקט דגל",
    ),
    textNode(
      "main-label",
      "פרויקט מלא · ₪4,900",
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
      ["01", "מיתוג", "₪1,200", "לוגו, פלטה ושפה ויזואלית"],
      ["02", "אתר תדמית", "₪2,400", "עד 10 עמודים, רספונסיבי"],
      ["03", "חנות אונליין", "₪3,600", "מוצרים, תשלומים ומשלוחים"],
      ["04", "קמפיין דיגיטלי", "₪1,800", "מודעות, תוכן ודוחות"],
      ["05", "ליווי שנתי", "₪990/חודש", "תחזוקה, עדכונים ותמיכה"],
    ].flatMap(([num, heading, price, copy], index) => {
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
          absoluteLayout(660, y, "280px", "30px", 20),
        ),
        textNode(
          `price-${index}`,
          price,
          {
            color: "#8a7359",
            fontSize: "16px",
            fontWeight: "700",
          },
          absoluteLayout(950, y + 2, "120px", "28px", 20),
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
          absoluteLayout(600, y + 78, "470px", "1px", 5),
        ),
      ];
    }),
  ],
);

export const PRICING_SHOWCASE_SECTIONS: VisualLibrarySectionTemplate[] = [
  threeTiers,
  comparisonTable,
  spotlightPlan,
  horizontalRows,
  bentoPricing,
  splitPricing,
  toggleBilling,
  magazineLedger,
];
