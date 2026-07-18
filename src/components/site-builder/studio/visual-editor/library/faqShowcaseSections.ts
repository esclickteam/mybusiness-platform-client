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

function faq(
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
    category: "faq",
    title,
    description: "סקשן שאלות נפוצות מקצועי בקומפוזיציה Editorial ייחודית",
    keywords: ["שאלות נפוצות", "faq", "עזרה", "תשובות", "wix"],
    previewLayout,
    backgroundColor,
    minHeight,
    thumbnail,
    nodes,
  };
}

/** 1 — רשימת אקורדיון */
const accordionList = faq(
  "section-faq-showcase-accordion-list",
  "שאלות נפוצות — אקורדיון",
  "faq-showcase-accordion-list",
  "#ffffff",
  "680px",
  IMG.education,
  [
    textNode(
      "eyebrow",
      "עזרה ותמיכה",
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
      "שאלות\nנפוצות",
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
    textNode(
      "copy",
      "לא מצאתם תשובה? צרו איתנו קשר — נשמח לעזור.",
      { ...body, fontSize: "16px" },
      absoluteLayout(40, 200, "400px", "40px", 20),
    ),
    buttonNode(
      "cta",
      "צור קשר",
      button,
      absoluteLayout(40, 260, "150px", "48px", 20),
    ),
    ...[
      ["כמה זמן לוקח לבנות אתר?", "פרויקט סטנדרטי לוקח 4–6 שבועות. פרויקטים מורכבים — בהתאמה."],
      ["האם יש תמיכה לאחר ההשקה?", "כן. כל החבילות כוללות תמיכה — מדוא״ל ועד ליווי שוטף."],
      ["האם אפשר לשנות תוכן בעצמי?", "בהחלט. האתר נבנה על מערכת ניהול תוכן פשוטה."],
      ["מה כולל המחיר?", "עיצוב, פיתוח, SEO בסיסי והדרכה. ללא עלויות נסתרות."],
      ["האם יש אפשרות לתשלומים?", "כן — תשלום חד־פעמי או תשלומים לפי שלבים."],
    ].flatMap(([question, answer], index) => {
      const y = 40 + index * 120;
      return [
        boxNode(
          `item-${index}`,
          {
            backgroundColor: index === 0 ? "#f8f9fa" : "#ffffff",
            borderRadius: "12px",
            border: "1px solid #eceef1",
          },
          absoluteLayout(500, y, "540px", index === 0 ? "110px" : "95px", 8),
        ),
        textNode(
          `q-${index}`,
          question,
          { color: ink, fontSize: "16px", fontWeight: "700" },
          absoluteLayout(520, y + 18, "500px", "28px", 20),
        ),
        ...(index === 0
          ? [
              textNode(
                `a-${index}`,
                answer,
                { ...body, fontSize: "14px" },
                absoluteLayout(520, y + 52, "500px", "40px", 20),
              ),
            ]
          : [
              textNode(
                `icon-${index}`,
                "+",
                { color: "#b8bcc3", fontSize: "24px", fontWeight: "300" },
                absoluteLayout(990, y + 30, "30px", "30px", 20),
              ),
            ]),
      ];
    }),
  ],
);

/** 2 — שני טורים Q&A */
const twoColumnQA = faq(
  "section-faq-showcase-two-column",
  "שאלות נפוצות — שני טורים",
  "faq-showcase-two-column",
  "#f3f4f6",
  "640px",
  IMG.office,
  [
    textNode(
      "title",
      "שאלות ותשובות",
      {
        color: ink,
        fontSize: "42px",
        fontWeight: "600",
        letterSpacing: "-0.04em",
        textAlign: "center",
      },
      absoluteLayout(290, 35, "500px", "55px", 20),
    ),
    ...[
      ["איך מתחילים?", "שיחת היכרות חינם — מבינים צרכים ומציעים כיוון."],
      ["מה העלות?", "תלוי בהיקף. נותנים הצעת מחיר שקופה לפני התחלה."],
      ["כמה זמן?", "4–8 שבועות לפרויקט ממוצע."],
      ["תמיכה?", "כן — דוא״ל, צ׳אט וליווי לפי חבילה."],
      ["שינויים?", "2 סבבי תיקונים כלולים. נוספים — בתוספת."],
      ["העברת אתר?", "כן — מעבירים תוכן ומבנה מאתר קיים."],
    ].flatMap(([q, a], index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = 40 + col * 520;
      const y = 110 + row * 165;
      return [
        boxNode(
          `card-${index}`,
          { backgroundColor: "#ffffff", borderRadius: "14px" },
          absoluteLayout(x, y, "490px", "145px", 8),
        ),
        textNode(
          `q-${index}`,
          q,
          { color: ink, fontSize: "17px", fontWeight: "700" },
          absoluteLayout(x + 25, y + 22, "440px", "28px", 20),
        ),
        textNode(
          `a-${index}`,
          a,
          { ...body, fontSize: "14px", lineHeight: "1.6" },
          absoluteLayout(x + 25, y + 58, "440px", "65px", 20),
        ),
      ];
    }),
  ],
);

/** 3 — רשת כרטיסים */
const cardGrid = faq(
  "section-faq-showcase-card-grid",
  "שאלות נפוצות — רשת כרטיסים",
  "faq-showcase-card-grid",
  "#f7f3ee",
  "620px",
  IMG.legal,
  [
    textNode(
      "eyebrow",
      "FAQ",
      {
        color: "#8a7359",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.16em",
        textAlign: "center",
      },
      absoluteLayout(440, 35, "200px", "22px", 20),
    ),
    textNode(
      "title",
      "כל מה שרציתם לדעת",
      {
        color: ink,
        fontSize: "40px",
        fontWeight: "500",
        letterSpacing: "-0.04em",
        textAlign: "center",
      },
      absoluteLayout(240, 65, "600px", "55px", 20),
    ),
    ...[
      ["🚚", "משלוחים", "3–5 ימי עסקים · חינם מעל ₪200"],
      ["↩️", "החזרות", "14 יום · ללא שאלות"],
      ["💳", "תשלום", "כרטיס, PayPal, Bit"],
      ["🔒", "אבטחה", "SSL · תשלום מאובטח"],
      ["📞", "תמיכה", "א׳–ה׳ 9:00–18:00"],
      ["🌍", "משלוח", "כל הארץ · COD זמין"],
    ].flatMap(([icon, heading, copy], index) => {
      const col = index % 3;
      const row = Math.floor(index / 3);
      const x = 45 + col * 340;
      const y = 145 + row * 220;
      return [
        boxNode(
          `card-${index}`,
          {
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            border: "1px solid #e5e0d8",
          },
          absoluteLayout(x, y, "310px", "195px", 8),
        ),
        textNode(
          `icon-${index}`,
          icon,
          { fontSize: "28px" },
          absoluteLayout(x + 25, y + 22, "50px", "36px", 20),
        ),
        textNode(
          `heading-${index}`,
          heading,
          { color: ink, fontSize: "18px", fontWeight: "700" },
          absoluteLayout(x + 25, y + 65, "260px", "28px", 20),
        ),
        textNode(
          `copy-${index}`,
          copy,
          { ...body, fontSize: "14px" },
          absoluteLayout(x + 25, y + 100, "260px", "50px", 20),
        ),
      ];
    }),
  ],
);

/** 4 — עמודה אחת עם מפרידים */
const singleColumn = faq(
  "section-faq-showcase-single-column",
  "שאלות נפוצות — עמודה אחת",
  "faq-showcase-single-column",
  "#faf8f4",
  "700px",
  IMG.medical,
  [
    textNode(
      "title",
      "שאלות נפוצות",
      {
        color: "#1c1915",
        fontSize: "44px",
        fontWeight: "500",
        letterSpacing: "-0.045em",
      },
      absoluteLayout(45, 40, "500px", "55px", 20),
    ),
    textNode(
      "copy",
      "תשובות לשאלות שמקבלים הכי הרבה — ברורות וישירות.",
      { color: "#7a7166", fontSize: "16px" },
      absoluteLayout(45, 100, "500px", "30px", 20),
    ),
    ...[
      ["האם צריך הפניה?", "לא — ניתן לקבוע תור ישירות דרך האתר או בטלפון."],
      ["מה שעות הפעילות?", "א׳–ה׳ 8:00–20:00 · ו׳ 8:00–14:00"],
      ["האם יש חניה?", "כן — חניה חינם למטופלים בחניון הבניין."],
      ["איך מבטלים תור?", "עד 24 שעות מראש — ללא עלות. דרך האתר או בטלפון."],
      ["האם מקבלים ביטוח?", "כן — כל קופות החולים וחברות הביטוח המובילות."],
      ["מה לקחת לתור?", "ת.ז., כרטיס קופה/ביטוח, הפניה (אם יש)."],
    ].flatMap(([q, a], index) => {
      const y = 160 + index * 85;
      return [
        textNode(
          `q-${index}`,
          q,
          { color: "#1c1915", fontSize: "17px", fontWeight: "700" },
          absoluteLayout(45, y, "980px", "28px", 20),
        ),
        textNode(
          `a-${index}`,
          a,
          { color: "#7a7166", fontSize: "14px", lineHeight: "1.5" },
          absoluteLayout(45, y + 32, "980px", "28px", 20),
        ),
        boxNode(
          `rule-${index}`,
          { backgroundColor: "#e6dfd4" },
          absoluteLayout(45, y + 72, "990px", "1px", 5),
        ),
      ];
    }),
  ],
);

/** 5 — פיצול עם תמונה */
const splitWithImage = faq(
  "section-faq-showcase-split-image",
  "שאלות נפוצות — פיצול עם תמונה",
  "faq-showcase-split-image",
  "#ffffff",
  "660px",
  IMG.hospitality,
  [
    imageNode(
      "image",
      IMG.hospitality,
      { borderRadius: "0", objectFit: "cover" },
      absoluteLayout(0, 0, "420px", "660px", 5),
      "שירות לקוחות",
    ),
    textNode(
      "eyebrow",
      "עזרה",
      {
        color: "#777b82",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.14em",
      },
      absoluteLayout(470, 55, "200px", "24px", 20),
    ),
    textNode(
      "title",
      "יש לכם\nשאלות?",
      {
        color: ink,
        fontSize: "44px",
        fontWeight: "500",
        lineHeight: "1.05",
        letterSpacing: "-0.045em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(470, 95, "400px", "100px", 20),
    ),
    ...[
      ["הזמנה", "איך מזמינים חדר?"],
      ["ביטול", "מה מדיניות הביטול?"],
      ["צ׳ק-אין", "מאיזה שעה?"],
      ["חניה", "האם יש חניה?"],
    ].flatMap(([category, question], index) => {
      const y = 220 + index * 95;
      return [
        textNode(
          `cat-${index}`,
          category,
          { color: "#8a7359", fontSize: "12px", fontWeight: "700", letterSpacing: "0.1em" },
          absoluteLayout(470, y, "120px", "20px", 20),
        ),
        textNode(
          `q-${index}`,
          question,
          { color: ink, fontSize: "18px", fontWeight: "700" },
          absoluteLayout(470, y + 24, "400px", "28px", 20),
        ),
        textNode(
          `a-${index}`,
          "לחצו לפרטים מלאים →",
          { ...body, fontSize: "13px", color: "#8a7359" },
          absoluteLayout(470, y + 56, "400px", "22px", 20),
        ),
        boxNode(
          `rule-${index}`,
          { backgroundColor: "#eceef1" },
          absoluteLayout(470, y + 82, "520px", "1px", 5),
        ),
      ];
    }),
    buttonNode(
      "cta",
      "כל השאלות",
      button,
      absoluteLayout(470, 580, "170px", "48px", 20),
    ),
  ],
);

/** 6 — רשימה ממוספרת */
const numberedList = faq(
  "section-faq-showcase-numbered-list",
  "שאלות נפוצות — רשימה ממוספרת",
  "faq-showcase-numbered-list",
  "#111318",
  "640px",
  IMG.tech,
  [
    textNode(
      "title",
      "FAQ טכני",
      {
        color: "#ffffff",
        fontSize: "42px",
        fontWeight: "500",
        letterSpacing: "-0.04em",
      },
      absoluteLayout(45, 40, "500px", "55px", 20),
    ),
    textNode(
      "copy",
      "תשובות לשאלות טכניות נפוצות — API, אינטגרציות ותמיכה.",
      { color: "rgba(255,255,255,.55)", fontSize: "15px" },
      absoluteLayout(45, 100, "500px", "40px", 20),
    ),
    ...[
      ["01", "איך מתחברים ל-API?", "OAuth 2.0 · תיעוד מלא ב-docs.example.com"],
      ["02", "מה ה-rate limit?", "1000 בקשות/שעה · Enterprise — ללא הגבלה"],
      ["03", "אילו webhooks נתמכים?", "order.created, payment.completed, user.updated"],
      ["04", "איך מדווחים על באג?", "GitHub Issues · תגובה תוך 24 שעות"],
      ["05", "SLA?", "99.9% uptime · Enterprise — 99.99%"],
    ].flatMap(([num, q, a], index) => {
      const y = 170 + index * 85;
      return [
        textNode(
          `num-${index}`,
          num,
          { color: "#f5c86f", fontSize: "20px", fontWeight: "700" },
          absoluteLayout(45, y, "50px", "28px", 20),
        ),
        textNode(
          `q-${index}`,
          q,
          { color: "#ffffff", fontSize: "17px", fontWeight: "700" },
          absoluteLayout(110, y, "450px", "28px", 20),
        ),
        textNode(
          `a-${index}`,
          a,
          { color: "rgba(255,255,255,.6)", fontSize: "14px" },
          absoluteLayout(110, y + 32, "900px", "28px", 20),
        ),
        boxNode(
          `rule-${index}`,
          { backgroundColor: "rgba(255,255,255,.08)" },
          absoluteLayout(45, y + 72, "990px", "1px", 5),
        ),
      ];
    }),
  ],
);

/** 7 — קטגוריות */
const categorizedSections = faq(
  "section-faq-showcase-categorized",
  "שאלות נפוצות — קטגוריות",
  "faq-showcase-categorized",
  "#eef0e9",
  "680px",
  IMG.finance,
  [
    textNode(
      "title",
      "מרכז העזרה",
      {
        color: "#1f261b",
        fontSize: "42px",
        fontWeight: "600",
        letterSpacing: "-0.04em",
        textAlign: "center",
      },
      absoluteLayout(290, 35, "500px", "55px", 20),
    ),
    ...[
      ["💰", "תשלומים", "אמצעי תשלום, חשבוניות ומיסים"],
      ["📦", "משלוחים", "זמנים, עלויות ומעקב"],
      ["🔄", "החזרות", "מדיניות, תהליך וזמנים"],
      ["👤", "חשבון", "הרשמה, סיסמה ופרופיל"],
    ].flatMap(([icon, heading, copy], index) => {
      const x = 45 + index * 255;
      return [
        boxNode(
          `cat-${index}`,
          { backgroundColor: "#ffffff", borderRadius: "16px" },
          absoluteLayout(x, 110, "230px", "180px", 8),
        ),
        textNode(
          `icon-${index}`,
          icon,
          { fontSize: "32px" },
          absoluteLayout(x + 20, 130, "50px", "40px", 20),
        ),
        textNode(
          `heading-${index}`,
          heading,
          { color: ink, fontSize: "18px", fontWeight: "700" },
          absoluteLayout(x + 20, 175, "190px", "28px", 20),
        ),
        textNode(
          `copy-${index}`,
          copy,
          { ...body, fontSize: "13px", color: "#515a49" },
          absoluteLayout(x + 20, 210, "190px", "50px", 20),
        ),
      ];
    }),
    textNode(
      "section-title",
      "שאלות נפוצות — תשלומים",
      { color: "#66705b", fontSize: "13px", fontWeight: "700", letterSpacing: "0.14em" },
      absoluteLayout(45, 320, "300px", "22px", 20),
    ),
    ...[
      ["אילו כרטיסים?", "Visa, Mastercard, Amex, Isracard"],
      ["תשלומים?", "עד 12 תשלומים ללא ריבית"],
      ["חשבונית?", "נשלחת אוטומטית לדוא״ל"],
    ].flatMap(([q, a], index) => {
      const y = 360 + index * 95;
      return [
        boxNode(
          `item-${index}`,
          { backgroundColor: "#ffffff", borderRadius: "12px" },
          absoluteLayout(45, y, "990px", "80px", 8),
        ),
        textNode(
          `q-${index}`,
          q,
          { color: ink, fontSize: "16px", fontWeight: "700" },
          absoluteLayout(65, y + 18, "400px", "28px", 20),
        ),
        textNode(
          `a-${index}`,
          a,
          { ...body, fontSize: "14px", color: "#515a49" },
          absoluteLayout(500, y + 22, "500px", "28px", 20),
        ),
      ];
    }),
  ],
);

/** 8 — Hero חיפוש + רשימה */
const searchHero = faq(
  "section-faq-showcase-search-hero",
  "שאלות נפוצות — Hero חיפוש",
  "faq-showcase-search-hero",
  "#f1efeb",
  "620px",
  IMG.abstract,
  [
    textNode(
      "title",
      "איך נוכל לעזור?",
      {
        color: "#181715",
        fontSize: "48px",
        fontWeight: "600",
        letterSpacing: "-0.05em",
        textAlign: "center",
      },
      absoluteLayout(240, 50, "600px", "60px", 20),
    ),
    boxNode(
      "search",
      {
        backgroundColor: "#ffffff",
        borderRadius: "999px",
        border: "1px solid rgba(24,23,21,.12)",
      },
      absoluteLayout(290, 130, "500px", "52px", 8),
    ),
    textNode(
      "search-placeholder",
      "🔍  חפשו שאלה...",
      { color: "#9a9590", fontSize: "16px" },
      absoluteLayout(320, 145, "400px", "28px", 20),
    ),
    ...[
      ["התחלת עבודה", "איך מתחילים פרויקט?"],
      ["מחירים", "מה כולל המחיר?"],
      ["לוח זמנים", "כמה זמן לוקח?"],
      ["תמיכה", "איך מקבלים עזרה?"],
    ].flatMap(([tag, question], index) => {
      const x = 120 + index * 220;
      return [
        textNode(
          `tag-${index}`,
          tag,
          {
            color: ink,
            fontSize: "13px",
            fontWeight: "600",
            backgroundColor: "#faf9f7",
            border: "1px solid rgba(24,23,21,.10)",
            borderRadius: "999px",
            padding: "8px 16px",
          },
          absoluteLayout(x, 210, "120px", "36px", 20),
        ),
      ];
    }),
    textNode(
      "popular",
      "שאלות פופולריות",
      { color: "#726a60", fontSize: "13px", fontWeight: "700", letterSpacing: "0.14em" },
      absoluteLayout(45, 280, "200px", "22px", 20),
    ),
    ...[
      ["איך מתחילים?", "שיחת היכרות חינם — מבינים צרכים ומציעים כיוון ברור."],
      ["מה כולל המחיר?", "עיצוב, פיתוח, SEO והדרכה. ללא עלויות נסתרות."],
      ["כמה זמן לוקח?", "4–8 שבועות לפרויקט ממוצע. פרויקטים גדולים — בהתאמה."],
    ].flatMap(([q, a], index) => {
      const y = 320 + index * 90;
      return [
        textNode(
          `q-${index}`,
          q,
          { color: "#181715", fontSize: "17px", fontWeight: "700" },
          absoluteLayout(45, y, "980px", "28px", 20),
        ),
        textNode(
          `a-${index}`,
          a,
          { color: "#625d56", fontSize: "14px", lineHeight: "1.5" },
          absoluteLayout(45, y + 32, "980px", "28px", 20),
        ),
        boxNode(
          `rule-${index}`,
          { backgroundColor: "rgba(24,23,21,.08)" },
          absoluteLayout(45, y + 72, "990px", "1px", 5),
        ),
      ];
    }),
  ],
);

export const FAQ_SHOWCASE_SECTIONS: VisualLibrarySectionTemplate[] = [
  accordionList,
  twoColumnQA,
  cardGrid,
  singleColumn,
  splitWithImage,
  numberedList,
  categorizedSections,
  searchHero,
];
