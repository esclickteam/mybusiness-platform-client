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

function commerce(
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
    category: "commerce",
    title,
    description: "סקשן מוצרים וחנות מקצועי בקומפוזיציה Editorial ייחודית",
    keywords: ["מוצרים", "commerce", "חנות", "shop", "wix"],
    previewLayout,
    backgroundColor,
    minHeight,
    thumbnail,
    nodes,
  };
}

/** 1 — רשת מוצרים 2×2 */
const productGrid = commerce(
  "section-commerce-showcase-product-grid",
  "מוצרים — רשת 2×2",
  "commerce-showcase-product-grid",
  "#ffffff",
  "720px",
  IMG.product,
  [
    textNode(
      "eyebrow",
      "הקולקציה החדשה",
      {
        color: "#777b82",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.14em",
      },
      absoluteLayout(45, 40, "260px", "24px", 20),
    ),
    textNode(
      "title",
      "מוצרים נבחרים",
      {
        color: ink,
        fontSize: "46px",
        fontWeight: "500",
        letterSpacing: "-0.05em",
      },
      absoluteLayout(40, 72, "500px", "60px", 20),
    ),
    buttonNode(
      "cta",
      "לכל החנות",
      button,
      absoluteLayout(870, 80, "150px", "44px", 22),
    ),
    ...[
      [IMG.product, "שעון Minimal", "₪890"],
      [IMG.skincare, "סרום Glow", "₪240"],
      [IMG.fashion, "תיק עור", "₪620"],
      [IMG.fitness, "בקבוק ספורט", "₪120"],
    ].flatMap(([src, name, price], index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = 45 + col * 520;
      const y = 170 + row * 265;
      return [
        imageNode(
          `image-${index}`,
          String(src),
          { borderRadius: "4px", objectFit: "cover" },
          absoluteLayout(x, y, "490px", "190px", 10),
          String(name),
        ),
        textNode(
          `name-${index}`,
          String(name),
          { color: ink, fontSize: "18px", fontWeight: "700" },
          absoluteLayout(x, y + 205, "300px", "28px", 20),
        ),
        textNode(
          `price-${index}`,
          String(price),
          { color: "#6a6f76", fontSize: "16px", fontWeight: "600" },
          absoluteLayout(x + 380, y + 205, "110px", "28px", 20),
        ),
        buttonNode(
          `buy-${index}`,
          "הוספה לסל",
          {
            ...button,
            backgroundColor: "#eef0f3",
            color: ink,
            padding: "8px 16px",
            fontSize: "12px",
          },
          absoluteLayout(x, y + 245, "140px", "36px", 20),
        ),
      ];
    }),
  ],
);

/** 2 — ספוטלייט: מוצר דגל + שלושה קטנים */
const spotlightHero = commerce(
  "section-commerce-showcase-spotlight-hero",
  "מוצרים — ספוטלייט",
  "commerce-showcase-spotlight-hero",
  "#efe8df",
  "700px",
  IMG.ecommerce,
  [
    imageNode(
      "hero",
      IMG.ecommerce,
      { borderRadius: "6px", objectFit: "cover" },
      absoluteLayout(40, 40, "620px", "620px", 5),
      "מוצר הדגל",
    ),
    boxNode(
      "hero-scrim",
      {
        backgroundImage:
          "linear-gradient(180deg, transparent 35%, rgba(17,19,24,.78) 100%)",
        borderRadius: "6px",
      },
      absoluteLayout(40, 40, "620px", "620px", 6),
    ),
    textNode(
      "hero-label",
      "Best Seller",
      {
        color: "rgba(255,255,255,.75)",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.14em",
      },
      absoluteLayout(70, 520, "200px", "22px", 20),
    ),
    textNode(
      "hero-title",
      "ערכת Premium\nלכל יום",
      {
        color: "#ffffff",
        fontSize: "40px",
        fontWeight: "600",
        lineHeight: "1.05",
        letterSpacing: "-0.045em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(70, 550, "420px", "90px", 20),
    ),
    textNode(
      "hero-price",
      "₪1,290",
      {
        color: "#ffffff",
        fontSize: "24px",
        fontWeight: "700",
      },
      absoluteLayout(480, 590, "120px", "32px", 20),
    ),
    textNode(
      "side-title",
      "עוד מוצרים",
      {
        color: ink,
        fontSize: "28px",
        fontWeight: "600",
        letterSpacing: "-0.035em",
      },
      absoluteLayout(700, 50, "320px", "40px", 20),
    ),
    ...[
      [IMG.product, "שעון קלאסי", "₪890"],
      [IMG.skincare, "קרם לילה", "₪180"],
      [IMG.fashion, "צעיף מעוצב", "₪320"],
    ].flatMap(([src, name, price], index) => {
      const y = 120 + index * 175;
      return [
        imageNode(
          `side-image-${index}`,
          String(src),
          { borderRadius: "4px", objectFit: "cover" },
          absoluteLayout(700, y, "340px", "155px", 8),
          String(name),
        ),
        textNode(
          `side-name-${index}`,
          String(name),
          {
            color: "#ffffff",
            fontSize: "16px",
            fontWeight: "700",
            backgroundColor: "rgba(17,19,24,.55)",
            borderRadius: "999px",
            padding: "8px 14px",
          },
          absoluteLayout(720, y + 105, "180px", "34px", 20),
        ),
        textNode(
          `side-price-${index}`,
          String(price),
          {
            color: ink,
            fontSize: "14px",
            fontWeight: "700",
            backgroundColor: "#ffffff",
            borderRadius: "999px",
            padding: "6px 12px",
          },
          absoluteLayout(920, y + 12, "90px", "30px", 20),
        ),
      ];
    }),
  ],
);

/** 3 — Bento א־סימטרי */
const bentoShop = commerce(
  "section-commerce-showcase-bento-grid",
  "מוצרים — רשת Bento",
  "commerce-showcase-bento-grid",
  "#111318",
  "700px",
  IMG.fashion,
  [
    textNode(
      "eyebrow",
      "החנות שלנו",
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
      "קנו במבט אחד",
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
      IMG.fashion,
      { borderRadius: "14px", objectFit: "cover", opacity: "0.9" },
      absoluteLayout(70, 185, "470px", "280px", 10),
      "אופנה",
    ),
    textNode(
      "heading-a",
      "קולקציית אביב",
      { color: "#ffffff", fontSize: "28px", fontWeight: "700" },
      absoluteLayout(70, 490, "400px", "40px", 20),
    ),
    textNode(
      "copy-a",
      "פריטים חדשים במלאי — משלוח מהיר עד הבית.",
      { color: "rgba(255,255,255,.65)", fontSize: "14px", lineHeight: "1.5" },
      absoluteLayout(70, 540, "400px", "50px", 20),
    ),
    textNode(
      "price-a",
      "החל מ-₪199",
      { color: "#f5c86f", fontSize: "18px", fontWeight: "700" },
      absoluteLayout(70, 600, "200px", "28px", 20),
    ),
    ...[
      [IMG.product, 590, 160, 450, 235, "גאדג׳טים", "₪89–₪890"],
      [IMG.skincare, 590, 420, 450, 240, "טיפוח", "₪45–₪320"],
    ].flatMap(([src, x, y, w, h, heading, price], index) => [
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
        `price-${index}`,
        String(price),
        { color: "rgba(255,255,255,.6)", fontSize: "13px" },
        absoluteLayout(Number(x) + 24, Number(y) + Number(h) - 44, "380px", "28px", 20),
      ),
    ]),
  ],
);

/** 4 — שורות אופקיות עם מחיר */
const horizontalRows = commerce(
  "section-commerce-showcase-horizontal-rows",
  "מוצרים — שורות אופקיות",
  "commerce-showcase-horizontal-rows",
  "#f3f4f6",
  "720px",
  IMG.ecommerce,
  [
    textNode(
      "title",
      "המוצרים שלנו",
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
      "כל שורה — מוצר מלא עם תמונה, תיאור ומחיר.",
      { ...body, fontSize: "16px" },
      absoluteLayout(40, 100, "520px", "40px", 20),
    ),
    ...[
      [IMG.product, "שעון Minimal", "עיצוב נקי לכל יום", "₪890"],
      [IMG.interior, "נר ביתי", "ריח עדין ואווירה חמימה", "₪95"],
      [IMG.fitness, "מזרן Yoga", "נוחות ויציבות לתרגול", "₪340"],
      [IMG.food, "קפסולות קפה", "טעם עשיר · 20 יחידות", "₪68"],
    ].flatMap(([src, heading, copy, price], index) => {
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
          `num-${index}`,
          `0${index + 1}`,
          { color: "#c5c9d0", fontSize: "32px", fontWeight: "600" },
          absoluteLayout(220, y + 35, "70px", "40px", 20),
        ),
        textNode(
          `heading-${index}`,
          String(heading),
          { color: ink, fontSize: "22px", fontWeight: "700" },
          absoluteLayout(300, y + 28, "400px", "32px", 20),
        ),
        textNode(
          `copy-${index}`,
          String(copy),
          { ...body, fontSize: "14px" },
          absoluteLayout(300, y + 62, "420px", "30px", 20),
        ),
        textNode(
          `price-${index}`,
          String(price),
          { color: ink, fontSize: "20px", fontWeight: "700" },
          absoluteLayout(760, y + 38, "90px", "32px", 20),
        ),
        buttonNode(
          `cta-${index}`,
          "קנייה",
          { ...button, padding: "10px 18px" },
          absoluteLayout(860, y + 38, "150px", "42px", 20),
        ),
      ];
    }),
  ],
);

/** 5 — Masonry כהה */
const darkMasonry = commerce(
  "section-commerce-showcase-dark-masonry",
  "מוצרים — Masonry כהה",
  "commerce-showcase-dark-masonry",
  "#121416",
  "700px",
  IMG.tech,
  [
    textNode(
      "eyebrow",
      "SHOP · NEW ARRIVALS",
      {
        color: "#a6abb1",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.14em",
      },
      absoluteLayout(45, 38, "340px", "24px", 20),
    ),
    textNode(
      "title",
      "חנות נבחרת",
      {
        color: "#ffffff",
        fontSize: "52px",
        fontWeight: "600",
        letterSpacing: "-0.055em",
      },
      absoluteLayout(40, 72, "500px", "68px", 20),
    ),
    buttonNode(
      "primary",
      "לכל המוצרים",
      {
        ...button,
        color: "#111318",
        backgroundColor: "#ffffff",
      },
      absoluteLayout(865, 80, "185px", "44px", 22),
    ),
    ...[
      [IMG.tech, 45, 175, 410, 210, "אוזניות Pro", "₪890"],
      [IMG.abstract, 475, 175, 245, 330, "פוסטר Art", "₪120"],
      [IMG.fashion, 740, 175, 315, 210, "חולצת Linen", "₪240"],
      [IMG.product, 45, 405, 410, 225, "שעון Smart", "₪1,290"],
      [IMG.skincare, 740, 405, 315, 225, "ערכת טיפוח", "₪420"],
    ].flatMap(([src, x, y, width, height, label, price], index) => [
      imageNode(
        `image-${index}`,
        String(src),
        {
          borderRadius: "3px",
          objectFit: "cover",
          opacity: "0.92",
        },
        absoluteLayout(
          Number(x),
          Number(y),
          `${Number(width)}px`,
          `${Number(height)}px`,
          10,
        ),
        String(label),
      ),
      textNode(
        `label-${index}`,
        String(label),
        {
          color: "#ffffff",
          backgroundColor: "rgba(10,12,14,.72)",
          borderRadius: "999px",
          padding: "6px 11px",
          fontSize: "10px",
          fontWeight: "600",
        },
        absoluteLayout(
          Number(x) + 14,
          Number(y) + Number(height) - 38,
          "130px",
          "26px",
          20,
        ),
      ),
      textNode(
        `price-${index}`,
        String(price),
        {
          color: "#17120a",
          backgroundColor: "rgba(245,200,111,.9)",
          borderRadius: "999px",
          padding: "5px 10px",
          fontSize: "10px",
          fontWeight: "700",
        },
        absoluteLayout(
          Number(x) + Number(width) - 90,
          Number(y) + 14,
          "75px",
          "24px",
          20,
        ),
      ),
    ]),
  ],
);

/** 6 — שלוש עמודות מינימליסטיות */
const minimalColumns = commerce(
  "section-commerce-showcase-minimal-columns",
  "מוצרים — עמודות מינימליסטיות",
  "commerce-showcase-minimal-columns",
  "#ffffff",
  "620px",
  IMG.skincare,
  [
    textNode(
      "eyebrow",
      "Best Sellers",
      {
        color: "#8b9098",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.18em",
      },
      absoluteLayout(40, 45, "200px", "22px", 20),
    ),
    textNode(
      "title",
      "שלושה מוצרים.\nבלי רעש.",
      {
        color: ink,
        fontSize: "52px",
        fontWeight: "500",
        lineHeight: "1",
        letterSpacing: "-0.055em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(40, 80, "480px", "120px", 20),
    ),
    buttonNode(
      "cta",
      "לחנות המלאה",
      button,
      absoluteLayout(40, 230, "170px", "48px", 20),
    ),
    ...[
      ["סרום", "טיפוח יומיומי שעובד", "₪180", IMG.skincare],
      ["תיק", "עור איכותי לכל עונה", "₪620", IMG.fashion],
      ["שעון", "דיוק ועיצוב נקי", "₪890", IMG.product],
    ].flatMap(([heading, copy, price, src], index) => {
      const x = 420 + index * 210;
      return [
        boxNode(
          `rule-${index}`,
          { backgroundColor: ink },
          absoluteLayout(x, 80, "40px", "3px", 10),
        ),
        textNode(
          `heading-${index}`,
          heading,
          { color: ink, fontSize: "26px", fontWeight: "700" },
          absoluteLayout(x, 110, "180px", "40px", 20),
        ),
        textNode(
          `copy-${index}`,
          copy,
          { ...body, fontSize: "15px", lineHeight: "1.6" },
          absoluteLayout(x, 170, "180px", "100px", 20),
        ),
        textNode(
          `price-${index}`,
          price,
          { color: ink, fontSize: "22px", fontWeight: "700" },
          absoluteLayout(x, 280, "180px", "32px", 20),
        ),
        imageNode(
          `image-${index}`,
          src,
          { borderRadius: "2px", objectFit: "cover" },
          absoluteLayout(x, 320, "180px", "230px", 8),
          heading,
        ),
      ];
    }),
  ],
);

/** 7 — מגזין: מוצר דגל + רשימת צד */
const magazineLedger = commerce(
  "section-commerce-showcase-magazine-ledger",
  "מוצרים — מגזין Ledger",
  "commerce-showcase-magazine-ledger",
  "#faf8f4",
  "700px",
  IMG.interior,
  [
    textNode(
      "eyebrow",
      "קטלוג · חנות",
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
      "מה חדש\nבחנות",
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
      "מוצר הדגל",
    ),
    textNode(
      "main-label",
      "נר ביתי · Limited · ₪95",
      {
        color: "#ffffff",
        fontSize: "16px",
        fontWeight: "700",
        backgroundColor: "rgba(28,25,21,.7)",
        borderRadius: "999px",
        padding: "10px 16px",
      },
      absoluteLayout(70, 580, "280px", "40px", 20),
    ),
    ...[
      ["01", "שעון Minimal", "₪890 · משלוח חינם"],
      ["02", "סרום Glow", "₪240 · במלאי"],
      ["03", "תיק עור", "₪620 · 3 צבעים"],
      ["04", "מזרן Yoga", "₪340 · חדש"],
      ["05", "קפסולות קפה", "₪68 · 20 יחידות"],
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

/** 8 — חבילות / קטגוריות */
const categoryPackages = commerce(
  "section-commerce-showcase-category-packages",
  "מוצרים — חבילות קטגוריה",
  "commerce-showcase-category-packages",
  "#f7f3ee",
  "680px",
  IMG.wellness,
  [
    textNode(
      "title",
      "בחרו קטגוריה\nשמתאימה לכם",
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
      ["טיפוח", "₪45+", "#ffffff", ink, IMG.skincare, ["סרums", "קרמים", "מסכות"]],
      ["אופנה", "₪120+", ink, "#ffffff", IMG.fashion, ["בגדים", "אביזרים", "נעליים"]],
      ["בית", "₪68+", "#ffffff", ink, IMG.interior, ["נרות", "כריות", "עיצוב"]],
    ].flatMap(([name, price, bg, fg, src, items], index) => {
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
        imageNode(
          `image-${index}`,
          String(src),
          { borderRadius: "12px", objectFit: "cover" },
          absoluteLayout(x + 20, 195, "270px", "120px", 10),
          String(name),
        ),
        textNode(
          `name-${index}`,
          String(name),
          { color: String(fg), fontSize: "18px", fontWeight: "700" },
          absoluteLayout(x + 30, 335, "240px", "28px", 20),
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
          absoluteLayout(x + 30, 375, "240px", "50px", 20),
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
            absoluteLayout(x + 30, 440 + itemIndex * 32, "240px", "28px", 20),
          ),
        ),
        buttonNode(
          `cta-${index}`,
          "לקטגוריה",
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

export const COMMERCE_SHOWCASE_SECTIONS: VisualLibrarySectionTemplate[] = [
  productGrid,
  spotlightHero,
  bentoShop,
  horizontalRows,
  darkMasonry,
  minimalColumns,
  magazineLedger,
  categoryPackages,
];
