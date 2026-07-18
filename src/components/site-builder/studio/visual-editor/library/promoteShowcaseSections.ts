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

function promote(
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
    category: "promote",
    title,
    description: "סקשן קידום ומעורבות מקצועי בקומפוזיציה Editorial ייחודית",
    keywords: ["קידום", "promote", "ניוזלטר", "מעורבות", "wix"],
    previewLayout,
    backgroundColor,
    minHeight,
    thumbnail,
    nodes,
  };
}

/** 1 — ניוזלטר: פיצול עם טופס */
const newsletterSplit = promote(
  "section-promote-showcase-newsletter-split",
  "קידום — ניוזלטר פיצול",
  "promote-showcase-newsletter-split",
  "#f3f0ea",
  "560px",
  IMG.education,
  [
    imageNode(
      "image",
      IMG.education,
      { borderRadius: "8px", objectFit: "cover" },
      absoluteLayout(40, 40, "480px", "480px", 5),
      "תוכן שווה",
    ),
    boxNode(
      "scrim",
      {
        backgroundImage:
          "linear-gradient(180deg, transparent 50%, rgba(17,19,24,.7) 100%)",
        borderRadius: "8px",
      },
      absoluteLayout(40, 40, "480px", "480px", 6),
    ),
    textNode(
      "image-label",
      "תובנות שבועיות",
      {
        color: "#ffffff",
        fontSize: "16px",
        fontWeight: "700",
      },
      absoluteLayout(70, 450, "240px", "28px", 20),
    ),
    textNode(
      "eyebrow",
      "ניוזלטר",
      {
        color: "#8a7359",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.16em",
      },
      absoluteLayout(560, 60, "200px", "22px", 20),
    ),
    textNode(
      "title",
      "הצטרפו ל-5,000+\nקוראים חכמים",
      {
        color: ink,
        fontSize: "42px",
        fontWeight: "500",
        lineHeight: "1.05",
        letterSpacing: "-0.045em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(560, 95, "460px", "100px", 20),
    ),
    textNode(
      "copy",
      "טיפים, מדריכים ועדכונים בלעדיים — ישר לתיבת המייל. בלי דואר זבל.",
      { ...body, fontSize: "15px", lineHeight: "1.6" },
      absoluteLayout(560, 210, "440px", "50px", 20),
    ),
    boxNode(
      "input",
      {
        backgroundColor: "#ffffff",
        borderRadius: "999px",
        border: "1px solid #e0dcd4",
      },
      absoluteLayout(560, 290, "320px", "50px", 8),
    ),
    textNode(
      "input-placeholder",
      "your@email.com",
      { color: "#b0aaa0", fontSize: "14px" },
      absoluteLayout(580, 303, "280px", "24px", 20),
    ),
    buttonNode(
      "cta",
      "הרשמה חינם",
      button,
      absoluteLayout(560, 360, "180px", "50px", 20),
    ),
    textNode(
      "fine-print",
      "אפשר לבטל בכל רגע · לא נשתף את המייל שלכם",
      { color: "#9a9288", fontSize: "12px" },
      absoluteLayout(560, 430, "400px", "22px", 20),
    ),
  ],
);

/** 2 — הוכחה חברתית: ביקורות + לוגואים */
const socialProofBanner = promote(
  "section-promote-showcase-social-proof-banner",
  "קידום — הוכחה חברתית",
  "promote-showcase-social-proof-banner",
  "#111318",
  "520px",
  IMG.team,
  [
    textNode(
      "eyebrow",
      "מה אומרים עלינו",
      {
        color: "rgba(255,255,255,.5)",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.16em",
        textAlign: "center",
      },
      absoluteLayout(420, 40, "240px", "22px", 20),
    ),
    textNode(
      "title",
      "4.9 מתוך 5 · 320+ ביקורות",
      {
        color: "#ffffff",
        fontSize: "38px",
        fontWeight: "600",
        letterSpacing: "-0.04em",
        textAlign: "center",
      },
      absoluteLayout(240, 75, "600px", "50px", 20),
    ),
    textNode(
      "stars",
      "★ ★ ★ ★ ★",
      { color: "#f5c542", fontSize: "22px", textAlign: "center" },
      absoluteLayout(440, 130, "200px", "30px", 20),
    ),
    ...[
      ["״שירות מעולה, תוצאות מהירות.״", "— דנה, מנהלת שיווק"],
      ["״הצוות מקצועי וזמין.״", "— יוסי, בעל עסק"],
      ["״המלצה חמה לכל מי שרוצה לצמוח.״", "— מיכל, יזמית"],
    ].flatMap(([quote, author], index) => {
      const x = 60 + index * 340;
      return [
        boxNode(
          `card-${index}`,
          { backgroundColor: "#1c1f26", borderRadius: "16px" },
          absoluteLayout(x, 190, "310px", "180px", 8),
        ),
        textNode(
          `quote-${index}`,
          quote,
          {
            color: "rgba(255,255,255,.85)",
            fontSize: "16px",
            lineHeight: "1.5",
          },
          absoluteLayout(x + 24, 220, "260px", "60px", 20),
        ),
        textNode(
          `author-${index}`,
          author,
          { color: "rgba(255,255,255,.45)", fontSize: "13px" },
          absoluteLayout(x + 24, 310, "260px", "24px", 20),
        ),
      ];
    }),
    textNode(
      "trust",
      "נבחרו על ידי · Google · Wix · Monday · Fiverr · Shopify",
      {
        color: "rgba(255,255,255,.35)",
        fontSize: "13px",
        textAlign: "center",
      },
      absoluteLayout(200, 420, "680px", "24px", 20),
    ),
    buttonNode(
      "cta",
      "קראו עוד ביקורות",
      { ...button, backgroundColor: "#ffffff", color: ink },
      absoluteLayout(430, 460, "220px", "48px", 20),
    ),
  ],
);

/** 3 — Lead magnet: מדריך חינמי להורדה */
const leadMagnet = promote(
  "section-promote-showcase-lead-magnet",
  "קידום — מגנט לידים",
  "promote-showcase-lead-magnet",
  "#ffffff",
  "620px",
  IMG.product,
  [
    boxNode(
      "book",
      { backgroundColor: "#f7f3ee", borderRadius: "12px" },
      absoluteLayout(40, 80, "340px", "460px", 8),
    ),
    imageNode(
      "cover",
      IMG.product,
      { borderRadius: "8px", objectFit: "cover" },
      absoluteLayout(70, 110, "280px", "360px", 10),
      "מדריך חינמי",
    ),
    textNode(
      "badge",
      "PDF חינם",
      {
        color: "#ffffff",
        fontSize: "13px",
        fontWeight: "700",
        backgroundColor: ink,
        borderRadius: "999px",
        padding: "8px 16px",
      },
      absoluteLayout(140, 400, "140px", "34px", 20),
    ),
    textNode(
      "eyebrow",
      "הורדה חינמית",
      {
        color: "#8a7359",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.16em",
      },
      absoluteLayout(440, 80, "240px", "22px", 20),
    ),
    textNode(
      "title",
      "10 צעדים לצמיחה\nדיגיטלית ב-2026",
      {
        color: ink,
        fontSize: "44px",
        fontWeight: "500",
        lineHeight: "1.05",
        letterSpacing: "-0.045em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(440, 115, "520px", "110px", 20),
    ),
    textNode(
      "copy",
      "מדריך מעשי עם תבניות, דוגמאות וצ'ק-ליסט — מוכן להורדה מיידית.",
      { ...body, fontSize: "16px", lineHeight: "1.6" },
      absoluteLayout(440, 240, "480px", "50px", 20),
    ),
    ...[
      "✓  48 עמודים של תוכן פרקטי",
      "✓  5 תבניות מוכנות לשימוש",
      "✓  צ'ק-ליסט שבועי ליישום",
    ].flatMap((item, index) =>
      textNode(
        `bullet-${index}`,
        item,
        { color: ink, fontSize: "15px", lineHeight: "1.8" },
        absoluteLayout(440, 310 + index * 32, "400px", "28px", 20),
      ),
    ),
    boxNode(
      "input",
      { backgroundColor: "#f3f4f6", borderRadius: "12px" },
      absoluteLayout(440, 420, "300px", "50px", 8),
    ),
    textNode(
      "input-placeholder",
      "המייל שלכם",
      { color: "#9ca3af", fontSize: "14px" },
      absoluteLayout(460, 433, "260px", "24px", 20),
    ),
    buttonNode(
      "cta",
      "הורידו עכשיו",
      button,
      absoluteLayout(760, 420, "180px", "50px", 20),
    ),
  ],
);

/** 4 — מבצע מוגבל בזמן */
const countdownPromo = promote(
  "section-promote-showcase-countdown-promo",
  "קידום — מבצע מוגבל",
  "promote-showcase-countdown-promo",
  "#1a0f2e",
  "480px",
  IMG.fashion,
  [
    imageNode(
      "bg",
      IMG.fashion,
      { borderRadius: "0", objectFit: "cover", opacity: "0.25" },
      absoluteLayout(0, 0, "1080px", "480px", 3),
      "רקע",
    ),
    boxNode(
      "overlay",
      {
        backgroundImage:
          "linear-gradient(135deg, rgba(26,15,46,.92) 0%, rgba(17,19,24,.85) 100%)",
      },
      absoluteLayout(0, 0, "1080px", "480px", 4),
    ),
    textNode(
      "eyebrow",
      "מבצע בלעדי",
      {
        color: "#e8a0bf",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.18em",
        textAlign: "center",
      },
      absoluteLayout(420, 45, "240px", "22px", 20),
    ),
    textNode(
      "title",
      "30% הנחה · רק השבוע",
      {
        color: "#ffffff",
        fontSize: "52px",
        fontWeight: "600",
        letterSpacing: "-0.05em",
        textAlign: "center",
      },
      absoluteLayout(240, 80, "600px", "65px", 20),
    ),
    textNode(
      "copy",
      "הזדמנות חד-פעמית לחבילת ההשקה המלאה — כולל ליווי VIP.",
      {
        color: "rgba(255,255,255,.65)",
        fontSize: "16px",
        textAlign: "center",
      },
      absoluteLayout(280, 155, "520px", "40px", 20),
    ),
    ...[
      ["03", "ימים"],
      ["14", "שעות"],
      ["27", "דקות"],
    ].flatMap(([num, label], index) => {
      const x = 330 + index * 150;
      return [
        boxNode(
          `timer-${index}`,
          {
            backgroundColor: "rgba(255,255,255,.08)",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,.12)",
          },
          absoluteLayout(x, 220, "120px", "100px", 8),
        ),
        textNode(
          `num-${index}`,
          num,
          {
            color: "#ffffff",
            fontSize: "40px",
            fontWeight: "700",
            textAlign: "center",
            letterSpacing: "-0.04em",
          },
          absoluteLayout(x + 10, 235, "100px", "50px", 20),
        ),
        textNode(
          `label-${index}`,
          label,
          {
            color: "rgba(255,255,255,.5)",
            fontSize: "13px",
            textAlign: "center",
          },
          absoluteLayout(x + 10, 285, "100px", "22px", 20),
        ),
      ];
    }),
    buttonNode(
      "cta",
      "תפסו את המבצע",
      { ...button, backgroundColor: "#e8a0bf", color: "#1a0f2e", fontSize: "16px" },
      absoluteLayout(420, 360, "240px", "52px", 20),
    ),
  ],
);

/** 5 — תוכנית הפניות */
const referralProgram = promote(
  "section-promote-showcase-referral-program",
  "קידום — תוכנית הפניות",
  "promote-showcase-referral-program",
  "#eef6f0",
  "580px",
  IMG.portrait,
  [
    textNode(
      "title",
      "הפנו חבר —\nקבלו ₪200",
      {
        color: ink,
        fontSize: "48px",
        fontWeight: "500",
        lineHeight: "1.05",
        letterSpacing: "-0.05em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(40, 50, "460px", "110px", 20),
    ),
    textNode(
      "copy",
      "שתפו את הקישור האישי שלכם. כשחבר נרשם — שניכם מרוויחים.",
      { ...body, fontSize: "16px", lineHeight: "1.6" },
      absoluteLayout(40, 180, "440px", "50px", 20),
    ),
    ...[
      ["1", "שתפו", "שלחו את הקישור לחברים"],
      ["2", "הם נרשמים", "חברים חדשים מקבלים 10% הנחה"],
      ["3", "אתם מרוויחים", "₪200 זיכוי לכל הפניה מוצלחת"],
    ].flatMap(([num, heading, copy], index) => {
      const y = 270 + index * 90;
      return [
        boxNode(
          `step-${index}`,
          { backgroundColor: "#ffffff", borderRadius: "14px" },
          absoluteLayout(40, y, "480px", "75px", 8),
        ),
        textNode(
          `num-${index}`,
          num,
          {
            color: "#2d8a5e",
            fontSize: "28px",
            fontWeight: "700",
          },
          absoluteLayout(60, y + 20, "40px", "36px", 20),
        ),
        textNode(
          `heading-${index}`,
          heading,
          { color: ink, fontSize: "20px", fontWeight: "700" },
          absoluteLayout(110, y + 14, "200px", "28px", 20),
        ),
        textNode(
          `copy-${index}`,
          copy,
          { ...body, fontSize: "13px" },
          absoluteLayout(110, y + 42, "380px", "24px", 20),
        ),
      ];
    }),
    imageNode(
      "portrait",
      IMG.portrait,
      { borderRadius: "20px", objectFit: "cover" },
      absoluteLayout(580, 50, "440px", "480px", 8),
      "שיתוף",
    ),
    buttonNode(
      "cta",
      "קבלו קישור אישי",
      { ...button, backgroundColor: "#2d8a5e" },
      absoluteLayout(40, 560, "220px", "48px", 20),
    ),
  ],
);

/** 6 — הצטרפות לקהילה */
const communityJoin = promote(
  "section-promote-showcase-community-join",
  "קידום — הצטרפות לקהילה",
  "promote-showcase-community-join",
  "#faf8f4",
  "600px",
  IMG.event,
  [
    imageNode(
      "hero",
      IMG.event,
      { borderRadius: "6px", objectFit: "cover" },
      absoluteLayout(40, 40, "500px", "520px", 5),
      "קהילה",
    ),
    boxNode(
      "scrim",
      {
        backgroundImage:
          "linear-gradient(0deg, rgba(17,19,24,.75) 0%, transparent 60%)",
        borderRadius: "6px",
      },
      absoluteLayout(40, 40, "500px", "520px", 6),
    ),
    textNode(
      "hero-label",
      "12,000+ חברים",
      {
        color: "rgba(255,255,255,.8)",
        fontSize: "14px",
        fontWeight: "700",
      },
      absoluteLayout(70, 480, "200px", "24px", 20),
    ),
    textNode(
      "hero-title",
      "הקהילה שלנו",
      {
        color: "#ffffff",
        fontSize: "32px",
        fontWeight: "700",
      },
      absoluteLayout(70, 510, "300px", "40px", 20),
    ),
    textNode(
      "eyebrow",
      "מעורבות",
      {
        color: "#9a8b78",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.16em",
      },
      absoluteLayout(580, 60, "200px", "22px", 20),
    ),
    textNode(
      "title",
      "מקום לשאול,\nלשתף ולגדול",
      {
        color: "#1c1915",
        fontSize: "42px",
        fontWeight: "500",
        lineHeight: "1.05",
        letterSpacing: "-0.045em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(580, 95, "440px", "100px", 20),
    ),
    textNode(
      "copy",
      "קבוצה פרטית עם מומחים, סדנאות חיות ותמיכה מעשית — בחינם.",
      { color: "#7a7166", fontSize: "15px", lineHeight: "1.6" },
      absoluteLayout(580, 210, "420px", "50px", 20),
    ),
    ...[
      ["💬", "דיונים יומיים"],
      ["🎯", "אתגרים שבועיים"],
      ["📚", "ספריית משאבים"],
      ["🤝", "נטוורקינג אמיתי"],
    ].flatMap(([icon, label], index) => {
      const y = 290 + index * 55;
      return [
        textNode(
          `icon-${index}`,
          icon,
          { fontSize: "22px" },
          absoluteLayout(580, y, "40px", "30px", 20),
        ),
        textNode(
          `label-${index}`,
          label,
          { color: "#1c1915", fontSize: "17px", fontWeight: "600" },
          absoluteLayout(630, y + 2, "300px", "28px", 20),
        ),
      ];
    }),
    buttonNode(
      "cta",
      "הצטרפו לקהילה",
      { ...button, backgroundColor: "#1c1915" },
      absoluteLayout(580, 520, "220px", "48px", 20),
    ),
  ],
);

/** 7 — הרשמה לאירוע / וובינר */
const eventRegistration = promote(
  "section-promote-showcase-event-registration",
  "קידום — הרשמה לאירוע",
  "promote-showcase-event-registration",
  "#ffffff",
  "640px",
  IMG.hospitality,
  [
    boxNode(
      "date-block",
      { backgroundColor: ink, borderRadius: "16px" },
      absoluteLayout(40, 60, "140px", "160px", 10),
    ),
    textNode(
      "month",
      "יולי",
      {
        color: "rgba(255,255,255,.6)",
        fontSize: "14px",
        fontWeight: "700",
        textAlign: "center",
      },
      absoluteLayout(55, 80, "110px", "22px", 20),
    ),
    textNode(
      "day",
      "24",
      {
        color: "#ffffff",
        fontSize: "56px",
        fontWeight: "600",
        textAlign: "center",
        letterSpacing: "-0.04em",
      },
      absoluteLayout(55, 105, "110px", "65px", 20),
    ),
    textNode(
      "year",
      "2026",
      {
        color: "rgba(255,255,255,.5)",
        fontSize: "14px",
        textAlign: "center",
      },
      absoluteLayout(55, 175, "110px", "22px", 20),
    ),
    textNode(
      "eyebrow",
      "וובינר חינמי",
      {
        color: "#777b82",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.14em",
      },
      absoluteLayout(210, 60, "200px", "22px", 20),
    ),
    textNode(
      "title",
      "איך בונים נוכחות\nדיגיטלית שממירה",
      {
        color: ink,
        fontSize: "44px",
        fontWeight: "500",
        lineHeight: "1.05",
        letterSpacing: "-0.045em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(210, 95, "520px", "110px", 20),
    ),
    textNode(
      "meta",
      "🕐 19:00 · ⏱ 60 דקות · 💻 זום · 🎙 בעברית",
      { color: "#6b7280", fontSize: "14px" },
      absoluteLayout(210, 220, "500px", "24px", 20),
    ),
    textNode(
      "copy",
      "שעה אחת של תובנות מעשיות — עם שאלות ותשובות חיות. מקומות מוגבלים.",
      { ...body, fontSize: "15px", lineHeight: "1.6" },
      absoluteLayout(210, 260, "480px", "45px", 20),
    ),
    ...[
      ["🎤", "מנחה: שירה כהן, מומחית שיווק"],
      ["📋", "מצגת + צ'ק-ליסט להורדה"],
      ["🎁", "הגרלה על ייעוץ אישי"],
    ].flatMap(([icon, label], index) => {
      const y = 330 + index * 40;
      return [
        textNode(
          `icon-${index}`,
          icon,
          { fontSize: "18px" },
          absoluteLayout(210, y, "30px", "24px", 20),
        ),
        textNode(
          `label-${index}`,
          label,
          { color: ink, fontSize: "15px" },
          absoluteLayout(250, y, "400px", "24px", 20),
        ),
      ];
    }),
    imageNode(
      "speaker",
      IMG.hospitality,
      { borderRadius: "12px", objectFit: "cover" },
      absoluteLayout(760, 60, "280px", "380px", 8),
      "מרצה",
    ),
    buttonNode(
      "cta",
      "שריינו מקום",
      button,
      absoluteLayout(210, 480, "200px", "50px", 20),
    ),
    textNode(
      "spots",
      "נותרו 23 מקומות",
      { color: "#dc2626", fontSize: "13px", fontWeight: "600" },
      absoluteLayout(430, 495, "180px", "22px", 20),
    ),
  ],
);

/** 8 — מועדון נאמנות / אפליקציה */
const loyaltyClub = promote(
  "section-promote-showcase-loyalty-club",
  "קידום — מועדון נאמנות",
  "promote-showcase-loyalty-club",
  "#f0f4ff",
  "560px",
  IMG.ecommerce,
  [
    textNode(
      "eyebrow",
      "מועדון VIP",
      {
        color: "#4f6bf5",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.16em",
        textAlign: "center",
      },
      absoluteLayout(420, 35, "240px", "22px", 20),
    ),
    textNode(
      "title",
      "הצטרפו למועדון\nוקבלו הטבות בלעדיות",
      {
        color: ink,
        fontSize: "42px",
        fontWeight: "500",
        lineHeight: "1.05",
        letterSpacing: "-0.045em",
        whiteSpace: "pre-line",
        textAlign: "center",
      },
      absoluteLayout(220, 65, "640px", "100px", 20),
    ),
    ...[
      ["🎁", "10% הנחה קבועה", "על כל רכישה"],
      ["⭐", "נקודות על כל שקל", "מימוש לפרסים"],
      ["🚀", "גישה מוקדמת", "למוצרים ומבצעים"],
      ["💎", "יום הולדת מיוחד", "מתנה אישית"],
    ].flatMap(([icon, heading, copy], index) => {
      const x = 60 + index * 255;
      return [
        boxNode(
          `card-${index}`,
          { backgroundColor: "#ffffff", borderRadius: "18px" },
          absoluteLayout(x, 200, "230px", "260px", 8),
        ),
        textNode(
          `icon-${index}`,
          icon,
          { fontSize: "32px", textAlign: "center" },
          absoluteLayout(x + 15, 230, "200px", "40px", 20),
        ),
        textNode(
          `heading-${index}`,
          heading,
          {
            color: ink,
            fontSize: "17px",
            fontWeight: "700",
            textAlign: "center",
          },
          absoluteLayout(x + 15, 290, "200px", "30px", 20),
        ),
        textNode(
          `copy-${index}`,
          copy,
          { ...body, fontSize: "13px", textAlign: "center" },
          absoluteLayout(x + 15, 325, "200px", "24px", 20),
        ),
      ];
    }),
    buttonNode(
      "cta",
      "הצטרפות חינם למועדון",
      { ...button, backgroundColor: "#4f6bf5" },
      absoluteLayout(380, 490, "320px", "50px", 20),
    ),
  ],
);

export const PROMOTE_SHOWCASE_SECTIONS: VisualLibrarySectionTemplate[] = [
  newsletterSplit,
  socialProofBanner,
  leadMagnet,
  countdownPromo,
  referralProgram,
  communityJoin,
  eventRegistration,
  loyaltyClub,
];
