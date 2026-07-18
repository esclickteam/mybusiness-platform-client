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

function blog(
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
    category: "blog",
    title,
    description: "סקשן בלוג ותוכן מקצועי בקומפוזיציה Editorial ייחודית",
    keywords: ["בלוג", "blog", "תוכן", "מאמרים", "כתבות", "wix"],
    previewLayout,
    backgroundColor,
    minHeight,
    thumbnail,
    nodes,
  };
}

/** 1 — פוסט מוביל + רשימת צד */
const featuredSidebar = blog(
  "section-blog-showcase-featured-sidebar",
  "בלוג — פוסט מוביל + צד",
  "blog-showcase-featured-sidebar",
  "#faf8f4",
  "700px",
  IMG.workspace,
  [
    textNode(
      "eyebrow",
      "הבלוג שלנו",
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
      "תובנות,\nכלים ורעיונות",
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
      IMG.workspace,
      { borderRadius: "2px", objectFit: "cover" },
      absoluteLayout(45, 240, "500px", "400px", 5),
      "מאמר מוביל",
    ),
    textNode(
      "main-label",
      "מדריך · 8 דק׳ קריאה",
      {
        color: "#ffffff",
        fontSize: "16px",
        fontWeight: "700",
        backgroundColor: "rgba(28,25,21,.7)",
        borderRadius: "999px",
        padding: "10px 16px",
      },
      absoluteLayout(70, 580, "240px", "40px", 20),
    ),
    textNode(
      "main-title",
      "איך לבנות נוכחות דיגיטלית שממירה",
      {
        color: "#ffffff",
        fontSize: "28px",
        fontWeight: "700",
        lineHeight: "1.2",
      },
      absoluteLayout(70, 480, "440px", "80px", 20),
    ),
    ...[
      ["12 אוג׳", "5 טיפים לכותרות שמושכות", "שיווק"],
      ["5 אוג׳", "מיתוג לעסק קטן — מדריך", "מיתוג"],
      ["28 יול׳", "SEO בעברית: מה חשוב לדעת", "SEO"],
      ["20 יול׳", "איך לכתוב תוכן שמדבר", "תוכן"],
      ["14 יול׳", "כלים חינמיים לעיצוב", "כלים"],
    ].flatMap(([date, heading, tag], index) => {
      const y = 75 + index * 105;
      return [
        textNode(
          `date-${index}`,
          date,
          { color: "#c4b8a8", fontSize: "13px", fontWeight: "700" },
          absoluteLayout(600, y, "80px", "22px", 20),
        ),
        textNode(
          `heading-${index}`,
          heading,
          { color: "#1c1915", fontSize: "20px", fontWeight: "700" },
          absoluteLayout(690, y, "330px", "30px", 20),
        ),
        textNode(
          `tag-${index}`,
          tag,
          {
            color: "#7a7166",
            fontSize: "12px",
            fontWeight: "700",
            backgroundColor: "#e6dfd4",
            borderRadius: "999px",
            padding: "4px 10px",
          },
          absoluteLayout(690, y + 36, "80px", "24px", 20),
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

/** 2 — רשת שלוש עמודות */
const cardGrid = blog(
  "section-blog-showcase-card-grid",
  "בלוג — רשת כרטיסים",
  "blog-showcase-card-grid",
  "#f3f1ed",
  "720px",
  IMG.tech,
  [
    textNode(
      "eyebrow",
      "מאמרים אחרונים",
      {
        color: "#74695d",
        fontSize: "13px",
        fontWeight: "700",
        letterSpacing: "0.14em",
        textAlign: "center",
      },
      absoluteLayout(350, 35, "400px", "26px", 20),
    ),
    textNode(
      "title",
      "מה חדש בבלוג",
      {
        color: "#1b1917",
        fontSize: "48px",
        fontWeight: "600",
        letterSpacing: "-0.05em",
        textAlign: "center",
      },
      absoluteLayout(300, 65, "500px", "65px", 20),
    ),
    ...[
      [IMG.tech, "טכנולוגיה", "אוטומציה לעסקים קטנים", "6 דק׳"],
      [IMG.fashion, "מיתוג", "צבעים שמוכרים ב-2026", "4 דק׳"],
      [IMG.finance, "עסקים", "תמחור נכון לשירותים", "8 דק׳"],
    ].flatMap(([src, tag, heading, time], index) => {
      const x = 55 + index * 350;
      return [
        boxNode(
          `card-${index}`,
          {
            backgroundColor: "#ffffff",
            border: "1px solid rgba(27,25,23,.10)",
            borderRadius: "14px",
          },
          absoluteLayout(x, 155, "300px", "520px", 5),
        ),
        imageNode(
          `image-${index}`,
          String(src),
          { borderRadius: "4px", objectFit: "cover" },
          absoluteLayout(x + 15, 170, "270px", "200px", 10),
          String(heading),
        ),
        textNode(
          `tag-${index}`,
          String(tag),
          {
            color: "#9a8b7b",
            fontSize: "12px",
            fontWeight: "700",
          },
          absoluteLayout(x + 20, 390, "120px", "22px", 20),
        ),
        textNode(
          `heading-${index}`,
          String(heading),
          {
            color: "#1b1917",
            fontSize: "22px",
            fontWeight: "700",
            lineHeight: "1.25",
          },
          absoluteLayout(x + 20, 420, "260px", "60px", 20),
        ),
        textNode(
          `time-${index}`,
          String(time),
          { color: "#716a62", fontSize: "12px" },
          absoluteLayout(x + 20, 620, "100px", "22px", 20),
        ),
        buttonNode(
          `cta-${index}`,
          "לקריאה",
          { ...button, backgroundColor: "#eef0f3", color: ink, padding: "10px 18px" },
          absoluteLayout(x + 170, 610, "115px", "40px", 20),
        ),
      ];
    }),
  ],
);

/** 3 — פריסת מגזין: ראשי + משני */
const magazineLayout = blog(
  "section-blog-showcase-magazine-layout",
  "בלוג — פריסת מגזין",
  "blog-showcase-magazine-layout",
  "#ffffff",
  "680px",
  IMG.interior,
  [
    textNode(
      "eyebrow",
      "גיליון · אוגוסט 2026",
      {
        color: "#777b82",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.14em",
      },
      absoluteLayout(40, 40, "280px", "24px", 20),
    ),
    imageNode(
      "hero",
      IMG.interior,
      { borderRadius: "4px", objectFit: "cover" },
      absoluteLayout(40, 80, "620px", "380px", 5),
      "כתבת שער",
    ),
    boxNode(
      "hero-scrim",
      {
        backgroundImage:
          "linear-gradient(180deg, transparent 50%, rgba(17,19,24,.75) 100%)",
        borderRadius: "4px",
      },
      absoluteLayout(40, 80, "620px", "380px", 6),
    ),
    textNode(
      "hero-title",
      "עיצוב פנים שמשנה\nאת חוויית הלקוח",
      {
        color: "#ffffff",
        fontSize: "36px",
        fontWeight: "700",
        lineHeight: "1.1",
        letterSpacing: "-0.04em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(70, 360, "500px", "90px", 20),
    ),
    ...[
      [IMG.skincare, "טיפוח", "טרנדים חדשים בעור"],
      [IMG.food, "קולינריה", "תפריטים שמספרים סיפור"],
      [IMG.fitness, "בריאות", "שגרה שעובדת באמת"],
    ].flatMap(([src, tag, heading], index) => {
      const y = 80 + index * 195;
      return [
        imageNode(
          `side-${index}`,
          String(src),
          { borderRadius: "4px", objectFit: "cover" },
          absoluteLayout(700, y, "340px", "175px", 8),
          String(heading),
        ),
        textNode(
          `tag-${index}`,
          String(tag),
          { color: "#8a7359", fontSize: "12px", fontWeight: "700" },
          absoluteLayout(720, y + 190, "100px", "22px", 20),
        ),
        textNode(
          `heading-${index}`,
          String(heading),
          { color: ink, fontSize: "18px", fontWeight: "700" },
          absoluteLayout(720, y + 215, "300px", "28px", 20),
        ),
      ];
    }),
  ],
);

/** 4 — רשימה מינימלית עם תאריכים */
const minimalList = blog(
  "section-blog-showcase-minimal-list",
  "בלוג — רשימה מינימלית",
  "blog-showcase-minimal-list",
  "#f3f4f6",
  "640px",
  IMG.abstract,
  [
    textNode(
      "title",
      "ארכיון מאמרים",
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
      "כל מה שפרסמנו — מסודר לפי תאריך, מוכן לקריאה.",
      { ...body, fontSize: "16px" },
      absoluteLayout(40, 100, "520px", "40px", 20),
    ),
    ...[
      ["2026.08.12", "מדריך מלא לבניית אתר תדמית"],
      ["2026.08.05", "איך לבחור פלטת צבעים לעסק"],
      ["2026.07.28", "תוכן שיווקי שעובד בעברית"],
      ["2026.07.20", "10 כלים שחוסכים זמן"],
      ["2026.07.14", "מיתוג מחדש — מתי ולמה"],
      ["2026.07.01", "SEO מקומי לעסקים בישראל"],
    ].flatMap(([date, heading], index) => {
      const y = 160 + index * 72;
      return [
        textNode(
          `date-${index}`,
          date,
          { color: "#b8bcc3", fontSize: "14px", fontWeight: "600", fontFamily: "monospace" },
          absoluteLayout(40, y, "120px", "24px", 20),
        ),
        textNode(
          `heading-${index}`,
          heading,
          { color: ink, fontSize: "18px", fontWeight: "600" },
          absoluteLayout(180, y, "600px", "28px", 20),
        ),
        boxNode(
          `rule-${index}`,
          { backgroundColor: "#eceef1" },
          absoluteLayout(40, y + 48, "920px", "1px", 5),
        ),
      ];
    }),
    imageNode(
      "abstract",
      IMG.abstract,
      { borderRadius: "4px", objectFit: "cover", opacity: "0.6" },
      absoluteLayout(780, 40, "280px", "560px", 3),
      "רקע",
    ),
  ],
);

/** 5 — Editorial: מחבר + מאמר */
const authorEditorial = blog(
  "section-blog-showcase-author-editorial",
  "בלוג — Editorial מחבר",
  "blog-showcase-author-editorial",
  "#f3eee7",
  "610px",
  IMG.portrait,
  [
    textNode(
      "eyebrow",
      "מאמר מומלץ · יולי 2026",
      {
        color: "#79695a",
        fontSize: "13px",
        fontWeight: "700",
        letterSpacing: "0.14em",
      },
      absoluteLayout(55, 55, "330px", "25px", 20),
    ),
    textNode(
      "title",
      "למה תוכן טוב\nעדיף על פרסום",
      {
        color: "#241f1a",
        fontSize: "52px",
        fontWeight: "600",
        lineHeight: "0.98",
        letterSpacing: "-0.055em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(50, 105, "500px", "130px", 20),
    ),
    textNode(
      "copy",
      "בעידן של אלגוריתמים, המילים שאתם כותבים הן הנכס הכי יקר שלכם. מאמר שמלמד, מרגש או פותר בעיה — בונה אמון שלא ניתן לקנות.",
      { ...body, color: "#5d554d", fontSize: "16px" },
      absoluteLayout(55, 280, "430px", "120px", 20),
    ),
    buttonNode(
      "primary",
      "קראו את המאמר",
      { ...button, backgroundColor: "#493b30" },
      absoluteLayout(55, 430, "190px", "48px", 22),
    ),
    imageNode(
      "portrait",
      IMG.portrait,
      {
        borderRadius: "220px 220px 18px 18px",
        objectFit: "cover",
        objectPosition: "center top",
      },
      absoluteLayout(635, 45, "380px", "520px", 10),
      "כותבת הבלוג",
    ),
    textNode(
      "author",
      "— נועה, כותבת תוכן",
      {
        color: "#493b30",
        fontSize: "14px",
        fontWeight: "700",
      },
      absoluteLayout(55, 500, "240px", "24px", 20),
    ),
    textNode(
      "read-time",
      "12 דק׳ קריאה",
      { color: "#8a7359", fontSize: "13px" },
      absoluteLayout(55, 530, "140px", "22px", 20),
    ),
  ],
);

/** 6 — Bento כהה */
const darkBento = blog(
  "section-blog-showcase-dark-bento",
  "בלוג — Bento כהה",
  "blog-showcase-dark-bento",
  "#111318",
  "700px",
  IMG.ecommerce,
  [
    textNode(
      "eyebrow",
      "קטגוריות",
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
      "גלו תוכן לפי נושא",
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
      IMG.ecommerce,
      { borderRadius: "14px", objectFit: "cover", opacity: "0.9" },
      absoluteLayout(70, 185, "470px", "280px", 10),
      "מסחר אלקטרוני",
    ),
    textNode(
      "heading-a",
      "מסחר אלקטרוני",
      { color: "#ffffff", fontSize: "28px", fontWeight: "700" },
      absoluteLayout(70, 490, "400px", "40px", 20),
    ),
    textNode(
      "copy-a",
      "12 מאמרים · מדריכים, טיפים ומקרי בוחן",
      { color: "rgba(255,255,255,.65)", fontSize: "14px", lineHeight: "1.5" },
      absoluteLayout(70, 540, "400px", "50px", 20),
    ),
    ...[
      [IMG.medical, 590, 160, 450, 235, "בריאות", "8 מאמרים"],
      [IMG.legal, 590, 420, 450, 240, "משפט", "5 מאמרים"],
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

/** 7 — כרטיסים אופקיים (סגנון גלילה) */
const horizontalCards = blog(
  "section-blog-showcase-horizontal-cards",
  "בלוג — כרטיסים אופקיים",
  "blog-showcase-horizontal-cards",
  "#eef0e9",
  "620px",
  IMG.nature,
  [
    textNode(
      "eyebrow",
      "תוכן מומלץ",
      {
        color: "#66705b",
        fontSize: "13px",
        fontWeight: "700",
        letterSpacing: "0.15em",
      },
      absoluteLayout(45, 40, "240px", "26px", 20),
    ),
    textNode(
      "title",
      "מאמרים ששווה לקרוא",
      {
        color: "#1f261b",
        fontSize: "42px",
        fontWeight: "600",
        letterSpacing: "-0.04em",
      },
      absoluteLayout(45, 75, "500px", "55px", 20),
    ),
    ...[
      [IMG.nature, "טיולים", "5 יעדים שחייבים לבקר"],
      [IMG.travel, "נסיעות", "אריזה חכמה לחופשה"],
      [IMG.hospitality, "אירוח", "איך לבחור מלון נכון"],
      [IMG.construction, "בנייה", "שיפוץ בלי הפתעות"],
    ].flatMap(([src, tag, heading], index) => {
      const x = 45 + index * 260;
      return [
        boxNode(
          `card-${index}`,
          { backgroundColor: "#ffffff", borderRadius: "16px" },
          absoluteLayout(x, 155, "240px", "420px", 8),
        ),
        imageNode(
          `image-${index}`,
          String(src),
          { borderRadius: "12px", objectFit: "cover" },
          absoluteLayout(x + 15, 170, "210px", "180px", 10),
          String(heading),
        ),
        textNode(
          `tag-${index}`,
          String(tag),
          { color: "#66705b", fontSize: "12px", fontWeight: "700" },
          absoluteLayout(x + 20, 370, "100px", "22px", 20),
        ),
        textNode(
          `heading-${index}`,
          String(heading),
          {
            color: "#1f261b",
            fontSize: "18px",
            fontWeight: "700",
            lineHeight: "1.3",
          },
          absoluteLayout(x + 20, 400, "200px", "50px", 20),
        ),
      ];
    }),
  ],
);

/** 8 — תגיות + פוסטים מובילים */
const tagsFeatured = blog(
  "section-blog-showcase-tags-featured",
  "בלוג — תגיות + מובילים",
  "blog-showcase-tags-featured",
  "#f1efeb",
  "660px",
  IMG.product,
  [
    textNode(
      "eyebrow",
      "גלו לפי נושא",
      {
        color: "#726a60",
        fontSize: "13px",
        fontWeight: "700",
        letterSpacing: "0.14em",
      },
      absoluteLayout(55, 45, "220px", "26px", 20),
    ),
    textNode(
      "title",
      "תגיות\nפופולריות",
      {
        color: "#181715",
        fontSize: "48px",
        fontWeight: "600",
        lineHeight: "1",
        letterSpacing: "-0.05em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(50, 80, "300px", "110px", 20),
    ),
    ...["מיתוג", "SEO", "עיצוב", "שיווק", "טכנולוגיה", "תוכן"].flatMap(
      (tag, index) => {
        const col = index % 3;
        const row = Math.floor(index / 3);
        const x = 55 + col * 110;
        const y = 220 + row * 50;
        return textNode(
          `tag-${index}`,
          tag,
          {
            color: index === 2 ? "#ffffff" : "#282622",
            fontSize: "14px",
            fontWeight: "700",
            backgroundColor: index === 2 ? ink : "#faf9f7",
            border: "1px solid rgba(24,23,21,.12)",
            borderRadius: "999px",
            padding: "10px 18px",
          },
          absoluteLayout(x, y, "95px", "38px", 20),
        );
      },
    ),
    ...[
      [IMG.product, "מוצר חדש — איך להשיק נכון", "מיתוג · 5 דק׳"],
      [IMG.realestate, "נדל״ן דיגיטלי: המדריך", "עסקים · 10 דק׳"],
      [IMG.education, "למידה מרחוק שעובדת", "חינוך · 7 דק׳"],
    ].flatMap(([src, heading, meta], index) => {
      const y = 45 + index * 195;
      return [
        boxNode(
          `card-${index}`,
          {
            backgroundColor: index === 1 ? "#1d1c1a" : "#faf9f7",
            border: "1px solid rgba(24,23,21,.12)",
            borderRadius: "14px",
          },
          absoluteLayout(420, y, "620px", "175px", 5),
        ),
        imageNode(
          `image-${index}`,
          String(src),
          { borderRadius: "10px", objectFit: "cover" },
          absoluteLayout(435, y + 15, "145px", "145px", 10),
          String(heading),
        ),
        textNode(
          `heading-${index}`,
          String(heading),
          {
            color: index === 1 ? "#ffffff" : "#181715",
            fontSize: "22px",
            fontWeight: "700",
            lineHeight: "1.25",
          },
          absoluteLayout(600, y + 35, "420px", "60px", 20),
        ),
        textNode(
          `meta-${index}`,
          String(meta),
          {
            color: index === 1 ? "#bbb8b2" : "#777169",
            fontSize: "13px",
          },
          absoluteLayout(600, y + 110, "300px", "22px", 20),
        ),
        buttonNode(
          `cta-${index}`,
          "קראו",
          {
            ...button,
            backgroundColor: index === 1 ? "#ffffff" : ink,
            color: index === 1 ? ink : "#ffffff",
            padding: "10px 20px",
          },
          absoluteLayout(600, y + 130, "100px", "40px", 20),
        ),
      ];
    }),
  ],
);

export const BLOG_SHOWCASE_SECTIONS: VisualLibrarySectionTemplate[] = [
  featuredSidebar,
  cardGrid,
  magazineLayout,
  minimalList,
  authorEditorial,
  darkBento,
  horizontalCards,
  tagsFeatured,
];
