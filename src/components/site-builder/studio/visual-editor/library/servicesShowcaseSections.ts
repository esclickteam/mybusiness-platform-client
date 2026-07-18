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

function services(
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
    category: "services",
    title,
    description: "סקשן שירותים מקצועי בקומפוזיציה Editorial ייחודית",
    keywords: ["שירותים", "services", "הצעות", "מה אנחנו עושים", "wix"],
    previewLayout,
    backgroundColor,
    minHeight,
    thumbnail,
    nodes,
  };
}

/** 1 — שלושה כרטיסי תמונה אנכיים */
const imageTriptych = services(
  "section-services-showcase-image-triptych",
  "שירותים — טריפטיך תמונות",
  "services-showcase-image-triptych",
  "#f6f1ea",
  "720px",
  IMG.skincare,
  [
    textNode(
      "eyebrow",
      "מה אנחנו מציעים",
      {
        color: "#8a7359",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.16em",
      },
      absoluteLayout(40, 36, "280px", "24px", 20),
    ),
    textNode(
      "title",
      "שירותים שמרגישים\nבדיוק כמוכם",
      {
        color: ink,
        fontSize: "46px",
        fontWeight: "500",
        lineHeight: "1.02",
        letterSpacing: "-0.05em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(40, 68, "520px", "110px", 20),
    ),
    ...[
      [IMG.skincare, 40, 210, 320, 420, "טיפולי פנים", "פרוטוקול אישי לפי סוג העור"],
      [IMG.beauty, 380, 210, 320, 420, "עיצוב גבות", "עיצוב מדויק ומסגרת טבעית"],
      [IMG.wellness, 720, 210, 320, 420, "טיפוח גוף", "מגע, ריטואל ותחושת רוגע"],
    ].flatMap(([src, x, y, w, h, heading, copy], index) => [
      imageNode(
        `image-${index}`,
        String(src),
        { borderRadius: "4px", objectFit: "cover" },
        absoluteLayout(Number(x), Number(y), `${Number(w)}px`, `${Number(h)}px`, 8),
        String(heading),
      ),
      textNode(
        `heading-${index}`,
        String(heading),
        { color: "#ffffff", fontSize: "22px", fontWeight: "700" },
        absoluteLayout(Number(x) + 22, Number(y) + Number(h) - 88, "260px", "32px", 20),
      ),
      textNode(
        `copy-${index}`,
        String(copy),
        { color: "rgba(255,255,255,.85)", fontSize: "13px", lineHeight: "1.4" },
        absoluteLayout(Number(x) + 22, Number(y) + Number(h) - 52, "260px", "36px", 20),
      ),
    ]),
  ],
);

/** 2 — רשימה ממוספרת עם תמונה גדולה */
const numberedSplit = services(
  "section-services-showcase-numbered-split",
  "שירותים — פיצול ממוספר",
  "services-showcase-numbered-split",
  "#ffffff",
  "680px",
  IMG.workspace,
  [
    imageNode(
      "image",
      IMG.workspace,
      { borderRadius: "0", objectFit: "cover" },
      absoluteLayout(0, 0, "480px", "680px", 5),
      "העבודה שלנו",
    ),
    textNode(
      "eyebrow",
      "תהליך ברור",
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
      "ארבעה שלבים.\nתוצאה אחת.",
      {
        color: ink,
        fontSize: "48px",
        fontWeight: "500",
        lineHeight: "1",
        letterSpacing: "-0.05em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(560, 95, "460px", "110px", 20),
    ),
    ...[
      ["01", "אבחון", "מבינים את המטרה, הקהל והמגבלות"],
      ["02", "תכנון", "בונים כיוון עיצובי ותוכנית עבודה"],
      ["03", "ביצוע", "מיישמים בדיוק, עם עדכונים בדרך"],
      ["04", "ליווי", "משאירים אתכם עם כלים להמשך"],
    ].flatMap(([num, heading, copy], index) => {
      const y = 240 + index * 95;
      return [
        textNode(
          `num-${index}`,
          num,
          { color: "#b8bcc3", fontSize: "28px", fontWeight: "600", letterSpacing: "-0.04em" },
          absoluteLayout(560, y, "70px", "36px", 20),
        ),
        textNode(
          `heading-${index}`,
          heading,
          { color: ink, fontSize: "20px", fontWeight: "700" },
          absoluteLayout(650, y, "340px", "30px", 20),
        ),
        textNode(
          `copy-${index}`,
          copy,
          { ...body, fontSize: "13px" },
          absoluteLayout(650, y + 32, "360px", "36px", 20),
        ),
        boxNode(
          `rule-${index}`,
          { backgroundColor: "#eceef1" },
          absoluteLayout(560, y + 78, "450px", "1px", 5),
        ),
      ];
    }),
  ],
);

/** 3 — רשת בנטו א־סימטרית */
const bentoGrid = services(
  "section-services-showcase-bento-grid",
  "שירותים — רשת Bento",
  "services-showcase-bento-grid",
  "#111318",
  "700px",
  IMG.tech,
  [
    textNode(
      "eyebrow",
      "היכולות שלנו",
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
      "שירותים במבט אחד",
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
      IMG.tech,
      { borderRadius: "14px", objectFit: "cover", opacity: "0.9" },
      absoluteLayout(70, 185, "470px", "280px", 10),
      "פיתוח דיגיטלי",
    ),
    textNode(
      "heading-a",
      "פיתוח דיגיטלי",
      { color: "#ffffff", fontSize: "28px", fontWeight: "700" },
      absoluteLayout(70, 490, "400px", "40px", 20),
    ),
    textNode(
      "copy-a",
      "אתרים, מערכות וממשקים שעובדים מהר ונראים מדויק.",
      { color: "rgba(255,255,255,.65)", fontSize: "14px", lineHeight: "1.5" },
      absoluteLayout(70, 540, "400px", "50px", 20),
    ),
    ...[
      [IMG.finance, 590, 160, 450, 235, "ייעוץ עסקי", "החלטות ברורות על בסיס נתונים"],
      [IMG.fashion, 590, 420, 450, 240, "מיתוג", "שפה ויזואלית שזוכרים"],
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

/** 4 — כרטיסים אופקיים עם אייקון מספר */
const horizontalRows = services(
  "section-services-showcase-horizontal-rows",
  "שירותים — שורות אופקיות",
  "services-showcase-horizontal-rows",
  "#f3f4f6",
  "720px",
  IMG.office,
  [
    textNode(
      "title",
      "שירותים לעסק שלך",
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
      "כל שורה היא הצעה מלאה — ברורה, מדידה ומוכנה להתחלה.",
      { ...body, fontSize: "16px" },
      absoluteLayout(40, 100, "520px", "40px", 20),
    ),
    ...[
      [IMG.office, "אסטרטגיה", "מיפוי שוק, מיצוב ותוכנית צמיחה"],
      [IMG.ecommerce, "חנויות אונליין", "חוויית קנייה שמוכרת בלי לחץ"],
      [IMG.legal, "ליווי משפטי עסקי", "חוזים, הגנות והסכמים ברורים"],
      [IMG.education, "הדרכות צוות", "סדנאות פרקטיות שמשאירות כלים"],
    ].flatMap(([src, heading, copy], index) => {
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
        buttonNode(
          `cta-${index}`,
          "לפרטים",
          { ...button, backgroundColor: "#eef0f3", color: ink, padding: "10px 18px" },
          absoluteLayout(860, y + 38, "150px", "42px", 20),
        ),
      ];
    }),
  ],
);

/** 5 — ספוטלייט: שירות אחד גדול + שלושה קטנים */
const spotlight = services(
  "section-services-showcase-spotlight",
  "שירותים — ספוטלייט",
  "services-showcase-spotlight",
  "#efe8df",
  "700px",
  IMG.hospitality,
  [
    imageNode(
      "hero",
      IMG.hospitality,
      { borderRadius: "6px", objectFit: "cover" },
      absoluteLayout(40, 40, "620px", "620px", 5),
      "חוויית אירוח",
    ),
    boxNode(
      "hero-scrim",
      {
        backgroundImage:
          "linear-gradient(180deg, transparent 40%, rgba(17,19,24,.78) 100%)",
        borderRadius: "6px",
      },
      absoluteLayout(40, 40, "620px", "620px", 6),
    ),
    textNode(
      "hero-label",
      "שירות מוביל",
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
      "עיצוב חוויית\nאירוח מלאה",
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
      "side-title",
      "עוד שירותים",
      {
        color: ink,
        fontSize: "28px",
        fontWeight: "600",
        letterSpacing: "-0.035em",
      },
      absoluteLayout(700, 50, "320px", "40px", 20),
    ),
    ...[
      [IMG.food, "תפריטים וקונספט"],
      [IMG.event, "הפקת אירועים"],
      [IMG.interior, "עיצוב חלל"],
    ].flatMap(([src, heading], index) => {
      const y = 120 + index * 175;
      return [
        imageNode(
          `side-image-${index}`,
          String(src),
          { borderRadius: "4px", objectFit: "cover" },
          absoluteLayout(700, y, "340px", "155px", 8),
          String(heading),
        ),
        textNode(
          `side-heading-${index}`,
          String(heading),
          {
            color: "#ffffff",
            fontSize: "18px",
            fontWeight: "700",
            backgroundColor: "rgba(17,19,24,.55)",
            borderRadius: "999px",
            padding: "8px 14px",
          },
          absoluteLayout(720, y + 105, "220px", "34px", 20),
        ),
      ];
    }),
  ],
);

/** 6 — עמודות מינימליסטיות עם קו */
const minimalColumns = services(
  "section-services-showcase-minimal-columns",
  "שירותים — עמודות מינימליסטיות",
  "services-showcase-minimal-columns",
  "#ffffff",
  "620px",
  IMG.architecture,
  [
    textNode(
      "eyebrow",
      "התמחויות",
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
      "שלושה כיוונים.\nבלי רעש.",
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
      "דברו איתנו",
      button,
      absoluteLayout(40, 230, "170px", "48px", 20),
    ),
    ...[
      ["עיצוב", "מותג, ממשק וחוויה שמרגישים אחד"],
      ["תוכן", "מילים שמובילות לפעולה בלי מאמץ"],
      ["טכנולוגיה", "בנייה יציבה שמוכנה לגדול"],
    ].flatMap(([heading, copy], index) => {
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
        imageNode(
          `image-${index}`,
          [IMG.architecture, IMG.fashion, IMG.tech][index],
          { borderRadius: "2px", objectFit: "cover" },
          absoluteLayout(x, 320, "180px", "230px", 8),
          heading,
        ),
      ];
    }),
  ],
);

/** 7 — חבילות שירות עם מחיר */
const servicePackages = services(
  "section-services-showcase-packages",
  "שירותים — חבילות",
  "services-showcase-packages",
  "#f7f3ee",
  "680px",
  IMG.product,
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
      ["התחלה", "₪1,890", "#ffffff", ink, ["מיתוג בסיסי", "עמוד נחיתה", "ליווי שבועי"]],
      ["צמיחה", "₪3,490", ink, "#ffffff", ["מיתוג מלא", "אתר תדמית", "תוכן חודשי", "דוחות"]],
      ["פרימיום", "₪5,990", "#ffffff", ink, ["אסטרטגיה", "אתר + חנות", "קמפיינים", "צוות ייעודי"]],
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

/** 8 — מגזין: שירות ראשי + רשימת צד */
const magazineLedger = services(
  "section-services-showcase-magazine-ledger",
  "שירותים — מגזין Ledger",
  "services-showcase-magazine-ledger",
  "#faf8f4",
  "700px",
  IMG.interior,
  [
    textNode(
      "eyebrow",
      "קטלוג שירותים",
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
      "מה אפשר\nלבנות יחד",
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
      "עיצוב פנים",
    ),
    textNode(
      "main-label",
      "עיצוב פנים · פרויקט דגל",
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
      ["01", "מיתוג עסקי", "לוגו, פלטה ושפה ויזואלית"],
      ["02", "אתרי תדמית", "נוכחות דיגיטלית שממירה"],
      ["03", "צילום מוצר", "תמונות שמוכרות מהמבט הראשון"],
      ["04", "ניהול תוכן", "לוח שנה, טקסטים וקצב פרסום"],
      ["05", "ייעוץ חוויה", "שיפור מסע הלקוח מקצה לקצה"],
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

export const SERVICES_SHOWCASE_SECTIONS: VisualLibrarySectionTemplate[] = [
  imageTriptych,
  numberedSplit,
  bentoGrid,
  horizontalRows,
  spotlight,
  minimalColumns,
  servicePackages,
  magazineLedger,
];
