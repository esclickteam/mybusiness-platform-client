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

function cta(
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
    category: "cta",
    title,
    description: "סקשן קריאה לפעולה מקצועי בקומפוזיציה Editorial ייחודית",
    keywords: ["קריאה לפעולה", "cta", "הזמנה", "צור קשר", "wix"],
    previewLayout,
    backgroundColor,
    minHeight,
    thumbnail,
    nodes,
  };
}

/** 1 — באנר רוחבי מלא על רקע כהה */
const fullWidthBanner = cta(
  "section-cta-showcase-full-width-banner",
  "קריאה לפעולה — באנר רוחבי",
  "cta-showcase-full-width-banner",
  "#111318",
  "420px",
  IMG.abstract,
  [
    imageNode(
      "bg",
      IMG.abstract,
      { borderRadius: "0", objectFit: "cover", opacity: "0.2" },
      absoluteLayout(0, 0, "1080px", "420px", 3),
      "רקע",
    ),
    textNode(
      "title",
      "מוכנים להתחיל?",
      {
        color: "#ffffff",
        fontSize: "56px",
        fontWeight: "600",
        letterSpacing: "-0.05em",
        textAlign: "center",
      },
      absoluteLayout(240, 80, "600px", "70px", 20),
    ),
    textNode(
      "copy",
      "שיחה קצרה — ונבין יחד מה הצעד הבא. בלי התחייבות.",
      {
        color: "rgba(255,255,255,.6)",
        fontSize: "18px",
        textAlign: "center",
      },
      absoluteLayout(280, 165, "520px", "30px", 20),
    ),
    buttonNode(
      "primary",
      "קבעו שיחת ייעוץ",
      { ...button, fontSize: "16px", padding: "14px 32px" },
      absoluteLayout(400, 240, "280px", "52px", 20),
    ),
    textNode(
      "fine-print",
      "✓ 30 דקות · ✓ חינם · ✓ בזום או בטלפון",
      {
        color: "rgba(255,255,255,.4)",
        fontSize: "13px",
        textAlign: "center",
      },
      absoluteLayout(360, 320, "360px", "22px", 20),
    ),
  ],
);

/** 2 — פיצול תמונה + CTA */
const splitImageCta = cta(
  "section-cta-showcase-split-image",
  "קריאה לפעולה — פיצול תמונה",
  "cta-showcase-split-image",
  "#ffffff",
  "600px",
  IMG.realestate,
  [
    imageNode(
      "image",
      IMG.realestate,
      { borderRadius: "0", objectFit: "cover" },
      absoluteLayout(0, 0, "520px", "600px", 5),
      "נכס",
    ),
    boxNode(
      "scrim",
      {
        backgroundImage:
          "linear-gradient(90deg, transparent 20%, rgba(255,255,255,.98) 100%)",
      },
      absoluteLayout(0, 0, "520px", "600px", 6),
    ),
    textNode(
      "eyebrow",
      "הצעד הבא",
      {
        color: "#777b82",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.14em",
      },
      absoluteLayout(580, 120, "200px", "22px", 20),
    ),
    textNode(
      "title",
      "בואו נבנה\nמשהו גדול",
      {
        color: ink,
        fontSize: "52px",
        fontWeight: "500",
        lineHeight: "1.02",
        letterSpacing: "-0.05em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(580, 160, "440px", "120px", 20),
    ),
    textNode(
      "copy",
      "כל פרויקט מתחיל בשיחה. ספרו לנו על החזון — ונחזור אליכם תוך 24 שעות.",
      { ...body, fontSize: "16px", lineHeight: "1.6" },
      absoluteLayout(580, 300, "420px", "55px", 20),
    ),
    buttonNode(
      "primary",
      "דברו איתנו",
      button,
      absoluteLayout(580, 390, "190px", "50px", 20),
    ),
    buttonNode(
      "secondary",
      "ראו פרויקטים",
      {
        ...button,
        backgroundColor: "transparent",
        color: ink,
        border: "2px solid #e5e7eb",
      },
      absoluteLayout(790, 390, "190px", "50px", 20),
    ),
  ],
);

/** 3 — כרטיס צף על gradient */
const floatingCard = cta(
  "section-cta-showcase-floating-card",
  "קריאה לפעולה — כרטיס צף",
  "cta-showcase-floating-card",
  "#e8edf5",
  "520px",
  IMG.travel,
  [
    imageNode(
      "bg",
      IMG.travel,
      { borderRadius: "0", objectFit: "cover", opacity: "0.35" },
      absoluteLayout(0, 0, "1080px", "520px", 3),
      "רקע",
    ),
    boxNode(
      "card",
      {
        backgroundColor: "#ffffff",
        borderRadius: "24px",
        boxShadow: "0 24px 64px rgba(17,19,24,.12)",
      },
      absoluteLayout(240, 80, "600px", "360px", 8),
    ),
    textNode(
      "title",
      "הגיע הזמן לצמוח",
      {
        color: ink,
        fontSize: "40px",
        fontWeight: "600",
        letterSpacing: "-0.04em",
        textAlign: "center",
      },
      absoluteLayout(280, 130, "520px", "55px", 20),
    ),
    textNode(
      "copy",
      "הצטרפו ל-800+ עסקים שכבר עשו את הצעד. התחילו היום — בחינם.",
      { ...body, fontSize: "16px", textAlign: "center" },
      absoluteLayout(300, 200, "480px", "45px", 20),
    ),
    buttonNode(
      "primary",
      "התחילו עכשיו",
      { ...button, fontSize: "16px", padding: "14px 36px" },
      absoluteLayout(420, 290, "240px", "52px", 20),
    ),
    textNode(
      "trust",
      "ללא כרטיס אשראי · ביטול בכל עת",
      { color: "#9ca3af", fontSize: "13px", textAlign: "center" },
      absoluteLayout(360, 370, "360px", "22px", 20),
    ),
  ],
);

/** 4 — שני כפתורים: ראשי + משני */
const dualCta = cta(
  "section-cta-showcase-dual-buttons",
  "קריאה לפעולה — כפתור כפול",
  "cta-showcase-dual-buttons",
  "#f6f1ea",
  "480px",
  IMG.office,
  [
    textNode(
      "eyebrow",
      "קריאה לפעולה",
      {
        color: "#8a7359",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.16em",
        textAlign: "center",
      },
      absoluteLayout(420, 50, "240px", "22px", 20),
    ),
    textNode(
      "title",
      "מה מתאים לכם?",
      {
        color: ink,
        fontSize: "48px",
        fontWeight: "500",
        letterSpacing: "-0.045em",
        textAlign: "center",
      },
      absoluteLayout(240, 85, "600px", "60px", 20),
    ),
    textNode(
      "copy",
      "בחרו את הדרך הנוחה לכם — אנחנו כאן בכל מקרה.",
      { ...body, fontSize: "16px", textAlign: "center" },
      absoluteLayout(300, 160, "480px", "30px", 20),
    ),
    boxNode(
      "card-primary",
      { backgroundColor: ink, borderRadius: "20px" },
      absoluteLayout(120, 230, "400px", "200px", 8),
    ),
    textNode(
      "primary-label",
      "מוכנים להתחיל?",
      { color: "rgba(255,255,255,.6)", fontSize: "13px", fontWeight: "700" },
      absoluteLayout(150, 260, "340px", "22px", 20),
    ),
    textNode(
      "primary-title",
      "קבעו פגישה",
      { color: "#ffffff", fontSize: "28px", fontWeight: "700" },
      absoluteLayout(150, 290, "340px", "40px", 20),
    ),
    textNode(
      "primary-copy",
      "שיחת ייעוץ חינמית של 30 דקות",
      { color: "rgba(255,255,255,.55)", fontSize: "14px" },
      absoluteLayout(150, 340, "340px", "24px", 20),
    ),
    buttonNode(
      "primary-cta",
      "קבעו עכשיו ←",
      { ...button, backgroundColor: "#ffffff", color: ink },
      absoluteLayout(150, 380, "200px", "44px", 20),
    ),
    boxNode(
      "card-secondary",
      { backgroundColor: "#ffffff", borderRadius: "20px", border: "1px solid #e5e0d8" },
      absoluteLayout(560, 230, "400px", "200px", 8),
    ),
    textNode(
      "secondary-label",
      "רוצים ללמוד קודם?",
      { color: "#8a7359", fontSize: "13px", fontWeight: "700" },
      absoluteLayout(590, 260, "340px", "22px", 20),
    ),
    textNode(
      "secondary-title",
      "הורידו מדריך",
      { color: ink, fontSize: "28px", fontWeight: "700" },
      absoluteLayout(590, 290, "340px", "40px", 20),
    ),
    textNode(
      "secondary-copy",
      "PDF חינמי עם 10 טיפים מעשיים",
      { ...body, fontSize: "14px" },
      absoluteLayout(590, 340, "340px", "24px", 20),
    ),
    buttonNode(
      "secondary-cta",
      "הורידו ←",
      { ...button, backgroundColor: "#eef0f3", color: ink },
      absoluteLayout(590, 380, "180px", "44px", 20),
    ),
  ],
);

/** 5 — מינימלי: שורה + כפתור */
const minimalLine = cta(
  "section-cta-showcase-minimal-line",
  "קריאה לפעולה — מינימלי",
  "cta-showcase-minimal-line",
  "#ffffff",
  "360px",
  IMG.architecture,
  [
    boxNode(
      "rule-top",
      { backgroundColor: "#eceef1" },
      absoluteLayout(40, 80, "1000px", "1px", 5),
    ),
    textNode(
      "title",
      "יש לכם שאלה? נשמח לעזור.",
      {
        color: ink,
        fontSize: "36px",
        fontWeight: "500",
        letterSpacing: "-0.04em",
      },
      absoluteLayout(40, 120, "600px", "50px", 20),
    ),
    buttonNode(
      "cta",
      "צרו קשר",
      button,
      absoluteLayout(40, 210, "160px", "48px", 20),
    ),
    textNode(
      "contact",
      "hello@example.com  ·  03-1234567",
      { color: "#9ca3af", fontSize: "14px" },
      absoluteLayout(40, 280, "400px", "24px", 20),
    ),
    boxNode(
      "rule-bottom",
      { backgroundColor: "#eceef1" },
      absoluteLayout(40, 320, "1000px", "1px", 5),
    ),
  ],
);

/** 6 — התקשרו עכשיו */
const phoneContact = cta(
  "section-cta-showcase-phone-contact",
  "קריאה לפעולה — התקשרו עכשיו",
  "cta-showcase-phone-contact",
  "#0f2e1a",
  "440px",
  IMG.medical,
  [
    textNode(
      "eyebrow",
      "זמינים עכשיו",
      {
        color: "#6ee7a0",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.16em",
        textAlign: "center",
      },
      absoluteLayout(420, 45, "240px", "22px", 20),
    ),
    textNode(
      "title",
      "דברו עם מומחה",
      {
        color: "#ffffff",
        fontSize: "44px",
        fontWeight: "600",
        letterSpacing: "-0.04em",
        textAlign: "center",
      },
      absoluteLayout(280, 80, "520px", "55px", 20),
    ),
    textNode(
      "phone",
      "03-123-4567",
      {
        color: "#6ee7a0",
        fontSize: "48px",
        fontWeight: "700",
        letterSpacing: "-0.02em",
        textAlign: "center",
      },
      absoluteLayout(280, 160, "520px", "60px", 20),
    ),
    textNode(
      "hours",
      "ראשון–חמישי · 09:00–18:00",
      {
        color: "rgba(255,255,255,.5)",
        fontSize: "15px",
        textAlign: "center",
      },
      absoluteLayout(380, 235, "320px", "24px", 20),
    ),
    buttonNode(
      "cta",
      "📞  חייגו עכשיו",
      { ...button, backgroundColor: "#6ee7a0", color: "#0f2e1a", fontSize: "16px" },
      absoluteLayout(390, 290, "300px", "52px", 20),
    ),
    textNode(
      "alt",
      "או שלחו וואטסאפ · 050-1234567",
      {
        color: "rgba(255,255,255,.4)",
        fontSize: "13px",
        textAlign: "center",
      },
      absoluteLayout(360, 370, "360px", "22px", 20),
    ),
  ],
);

/** 7 — טופס inline מהיר */
const inlineForm = cta(
  "section-cta-showcase-inline-form",
  "קריאה לפעולה — טופס מהיר",
  "cta-showcase-inline-form",
  "#faf8f4",
  "500px",
  IMG.construction,
  [
    imageNode(
      "side",
      IMG.construction,
      { borderRadius: "8px", objectFit: "cover" },
      absoluteLayout(40, 40, "380px", "420px", 5),
      "פרויקט",
    ),
    textNode(
      "eyebrow",
      "השאירו פרטים",
      {
        color: "#9a8b78",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.16em",
      },
      absoluteLayout(460, 60, "240px", "22px", 20),
    ),
    textNode(
      "title",
      "נחזור אליכם\nתוך שעה",
      {
        color: "#1c1915",
        fontSize: "42px",
        fontWeight: "500",
        lineHeight: "1.05",
        letterSpacing: "-0.045em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(460, 95, "440px", "100px", 20),
    ),
    ...[
      ["שם מלא", 200],
      ["טלפון", 270],
      ["מייל", 340],
    ].flatMap(([placeholder, y], index) => [
      boxNode(
        `field-${index}`,
        {
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          border: "1px solid #e6dfd4",
        },
        absoluteLayout(460, Number(y), "520px", "50px", 8),
      ),
      textNode(
        `placeholder-${index}`,
        String(placeholder),
        { color: "#b0a89c", fontSize: "14px" },
        absoluteLayout(480, Number(y) + 13, "480px", "24px", 20),
      ),
    ]),
    buttonNode(
      "cta",
      "שלחו — נחזור מהר",
      { ...button, backgroundColor: "#1c1915" },
      absoluteLayout(460, 410, "520px", "52px", 20),
    ),
  ],
);

/** 8 — gradient bold עם כותרת גדולה */
const gradientBold = cta(
  "section-cta-showcase-gradient-bold",
  "קריאה לפעולה — Gradient Bold",
  "cta-showcase-gradient-bold",
  "#1a0533",
  "560px",
  IMG.fitness,
  [
    boxNode(
      "gradient",
      {
        backgroundImage:
          "linear-gradient(135deg, #1a0533 0%, #4a1572 50%, #7c2d9e 100%)",
      },
      absoluteLayout(0, 0, "1080px", "560px", 3),
    ),
    imageNode(
      "accent",
      IMG.fitness,
      { borderRadius: "999px", objectFit: "cover", opacity: "0.2" },
      absoluteLayout(780, 80, "260px", "260px", 4),
      "אנרגיה",
    ),
    textNode(
      "eyebrow",
      "הזדמנות",
      {
        color: "rgba(255,255,255,.55)",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.18em",
      },
      absoluteLayout(60, 80, "200px", "22px", 20),
    ),
    textNode(
      "title",
      "הפכו את הרעיון\nלמציאות — היום",
      {
        color: "#ffffff",
        fontSize: "64px",
        fontWeight: "600",
        lineHeight: "0.98",
        letterSpacing: "-0.055em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(60, 120, "620px", "140px", 20),
    ),
    textNode(
      "copy",
      "אל תדחו. כל יום שעובר הוא הזדמנות שמתפספסת.",
      {
        color: "rgba(255,255,255,.6)",
        fontSize: "18px",
        lineHeight: "1.5",
      },
      absoluteLayout(60, 290, "500px", "30px", 20),
    ),
    buttonNode(
      "primary",
      "בואו נתחיל ←",
      {
        ...button,
        backgroundColor: "#ffffff",
        color: "#4a1572",
        fontSize: "16px",
        padding: "14px 32px",
      },
      absoluteLayout(60, 360, "220px", "52px", 20),
    ),
    buttonNode(
      "secondary",
      "למדו עוד",
      {
        ...button,
        backgroundColor: "transparent",
        color: "#ffffff",
        border: "2px solid rgba(255,255,255,.3)",
      },
      absoluteLayout(300, 360, "160px", "52px", 20),
    ),
    textNode(
      "stat",
      "⭐ 4.9  ·  800+ לקוחות  ·  98% המלצה",
      {
        color: "rgba(255,255,255,.45)",
        fontSize: "14px",
      },
      absoluteLayout(60, 450, "500px", "24px", 20),
    ),
  ],
);

export const CTA_SHOWCASE_SECTIONS: VisualLibrarySectionTemplate[] = [
  fullWidthBanner,
  splitImageCta,
  floatingCard,
  dualCta,
  minimalLine,
  phoneContact,
  inlineForm,
  gradientBold,
];
