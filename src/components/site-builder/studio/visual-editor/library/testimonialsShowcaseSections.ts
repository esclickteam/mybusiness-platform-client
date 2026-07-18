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

function testimonials(
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
    category: "testimonials",
    title,
    description: "סקשן ביקורות ואמון מקצועי בקומפוזיציה Editorial ייחודית",
    keywords: ["ביקורות", "המלצות", "אמון", "testimonials", "reviews", "wix"],
    previewLayout,
    backgroundColor,
    minHeight,
    thumbnail,
    nodes,
  };
}

/** 1 — כרטיסי ציטוט אופקיים */
const quoteCards = testimonials(
  "section-testimonials-showcase-quote-cards",
  "ביקורות — כרטיסי ציטוט",
  "testimonials-showcase-quote-cards",
  "#f6f1ea",
  "680px",
  IMG.portrait,
  [
    textNode(
      "eyebrow",
      "מה הלקוחות אומרים",
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
      "אמון שנבנה\nממילים אמיתיות",
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
      [
        "״השירות היה מדויק, אנושי ומהיר. הרגשנו שיש מישהו שבאמת דואג.״",
        "דנה כהן",
        "מנהלת שיווק · סטארטאפ טק",
        IMG.portrait,
      ],
      [
        "״התוצאה עלתה על הציפיות. הצוות היה זמין, ברור ומקצועי לאורך כל הדרך.״",
        "יוסי מזרחי",
        "בעלים · חנות אונליין",
        IMG.ecommerce,
      ],
      [
        "״סוף סוף מישהו שהבין בדיוק מה אנחנו צריכים — בלי סיבוכים מיותרים.״",
        "מיכל אברהם",
        "מנהלת תפעול · קליניקה",
        IMG.medical,
      ],
    ].flatMap(([quote, name, role, src], index) => {
      const x = 40 + index * 340;
      return [
        boxNode(
          `card-${index}`,
          { backgroundColor: "#ffffff", borderRadius: "18px" },
          absoluteLayout(x, 210, "320px", "420px", 8),
        ),
        textNode(
          `quote-${index}`,
          String(quote),
          {
            color: ink,
            fontSize: "17px",
            fontWeight: "600",
            lineHeight: "1.55",
          },
          absoluteLayout(x + 28, 240, "264px", "160px", 20),
        ),
        imageNode(
          `avatar-${index}`,
          String(src),
          { borderRadius: "50%", objectFit: "cover" },
          absoluteLayout(x + 28, 430, "52px", "52px", 10),
          String(name),
        ),
        textNode(
          `name-${index}`,
          String(name),
          { color: ink, fontSize: "15px", fontWeight: "700" },
          absoluteLayout(x + 92, 438, "200px", "24px", 20),
        ),
        textNode(
          `role-${index}`,
          String(role),
          { ...body, fontSize: "12px" },
          absoluteLayout(x + 92, 464, "200px", "22px", 20),
        ),
        textNode(
          `stars-${index}`,
          "★★★★★",
          { color: "#c9a227", fontSize: "14px", letterSpacing: "0.08em" },
          absoluteLayout(x + 28, 520, "120px", "22px", 20),
        ),
      ];
    }),
  ],
);

/** 2 — ציטוט גדול עם פורטרט */
const heroQuote = testimonials(
  "section-testimonials-showcase-hero-quote",
  "ביקורות — ציטוט Hero",
  "testimonials-showcase-hero-quote",
  "#f3eee7",
  "620px",
  IMG.portrait,
  [
    textNode(
      "eyebrow",
      "המלצה מובילה",
      {
        color: "#79695a",
        fontSize: "13px",
        fontWeight: "700",
        letterSpacing: "0.14em",
      },
      absoluteLayout(55, 55, "240px", "25px", 20),
    ),
    textNode(
      "quote",
      "״הם לא רק סיפקו פתרון — הם עזרו לנו לחשוב מחדש על כל העסק.״",
      {
        color: "#241f1a",
        fontSize: "42px",
        fontWeight: "600",
        lineHeight: "1.15",
        letterSpacing: "-0.04em",
      },
      absoluteLayout(50, 110, "560px", "200px", 20),
    ),
    textNode(
      "stars",
      "★★★★★",
      { color: "#c9a227", fontSize: "20px", letterSpacing: "0.1em" },
      absoluteLayout(55, 330, "160px", "30px", 20),
    ),
    textNode(
      "name",
      "— רונית שפירא, מנכ״לית",
      {
        color: "#493b30",
        fontSize: "16px",
        fontWeight: "700",
      },
      absoluteLayout(55, 375, "320px", "28px", 20),
    ),
    textNode(
      "company",
      "חברת נדל״ן · 120+ עובדים",
      { ...body, color: "#5d554d", fontSize: "14px" },
      absoluteLayout(55, 408, "320px", "24px", 20),
    ),
    imageNode(
      "portrait",
      IMG.portrait,
      {
        borderRadius: "220px 220px 18px 18px",
        objectFit: "cover",
        objectPosition: "center top",
      },
      absoluteLayout(660, 45, "380px", "530px", 10),
      "לקוחה מרוצה",
    ),
    buttonNode(
      "cta",
      "עוד המלצות",
      { ...button, backgroundColor: "#493b30" },
      absoluteLayout(55, 480, "170px", "48px", 22),
    ),
  ],
);

/** 3 — רשת דירוגים עם כוכבים */
const ratingGrid = testimonials(
  "section-testimonials-showcase-rating-grid",
  "ביקורות — רשת דירוגים",
  "testimonials-showcase-rating-grid",
  "#ffffff",
  "640px",
  IMG.finance,
  [
    textNode(
      "title",
      "4.9 מתוך 5\nמאות ביקורות",
      {
        color: ink,
        fontSize: "48px",
        fontWeight: "600",
        lineHeight: "1",
        letterSpacing: "-0.05em",
        whiteSpace: "pre-line",
        textAlign: "center",
      },
      absoluteLayout(280, 35, "540px", "110px", 20),
    ),
    textNode(
      "aggregate",
      "★★★★★",
      { color: "#c9a227", fontSize: "28px", letterSpacing: "0.12em", textAlign: "center" },
      absoluteLayout(420, 155, "260px", "36px", 20),
    ),
    ...[
      ["״מקצוענים ברמה הגבוהה ביותר״", "עמית ל.", "★★★★★", IMG.tech],
      ["״יחס אישי ותוצאות מדהימות״", "שירה ג.", "★★★★★", IMG.beauty],
      ["״ממליצה בחום לכל עסק״", "תמר ר.", "★★★★★", IMG.wellness],
      ["״שירות מהיר ואמין״", "אלי מ.", "★★★★☆", IMG.office],
    ].flatMap(([quote, name, stars, src], index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = 60 + col * 500;
      const y = 210 + row * 195;
      return [
        boxNode(
          `card-${index}`,
          {
            backgroundColor: "#f8f9fa",
            borderRadius: "16px",
            border: "1px solid #eceef1",
          },
          absoluteLayout(x, y, "470px", "170px", 8),
        ),
        imageNode(
          `avatar-${index}`,
          String(src),
          { borderRadius: "12px", objectFit: "cover" },
          absoluteLayout(x + 20, y + 20, "80px", "80px", 10),
          String(name),
        ),
        textNode(
          `quote-${index}`,
          String(quote),
          { color: ink, fontSize: "16px", fontWeight: "600", lineHeight: "1.4" },
          absoluteLayout(x + 120, y + 22, "320px", "50px", 20),
        ),
        textNode(
          `name-${index}`,
          String(name),
          { ...body, fontSize: "13px", fontWeight: "700", color: ink },
          absoluteLayout(x + 120, y + 80, "200px", "22px", 20),
        ),
        textNode(
          `stars-${index}`,
          String(stars),
          { color: "#c9a227", fontSize: "13px" },
          absoluteLayout(x + 120, y + 108, "120px", "20px", 20),
        ),
      ];
    }),
  ],
);

/** 4 — קיר ציטוטים מדורג */
const quoteWall = testimonials(
  "section-testimonials-showcase-quote-wall",
  "ביקורות — קיר ציטוטים",
  "testimonials-showcase-quote-wall",
  "#111318",
  "720px",
  IMG.team,
  [
    textNode(
      "eyebrow",
      "קולות מהשטח",
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
      "מאות לקוחות.\nאותה תוצאה.",
      {
        color: "#ffffff",
        fontSize: "44px",
        fontWeight: "500",
        lineHeight: "1.05",
        letterSpacing: "-0.045em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(45, 72, "480px", "100px", 20),
    ),
    ...[
      ["״פשוט עובד.״", "גיל", 45, 210, 280, 140],
      ["״הכי טוב שעבדנו איתו.״", "נועה", 350, 180, 300, 160],
      ["״ממליץ לכל מי ששואל.״", "אור", 680, 210, 280, 130],
      ["״שירות ברמה בינלאומית.״", "מיה", 45, 380, 320, 150],
      ["״תוצאות תוך שבועיים.״", "דוד", 390, 370, 280, 140],
      ["״יחס מעולה.״", "ליאת", 700, 370, 260, 120],
    ].flatMap(([quote, name, x, y, w, h], index) => [
      boxNode(
        `bubble-${index}`,
        { backgroundColor: "#1c1f26", borderRadius: "14px" },
        absoluteLayout(Number(x), Number(y), `${Number(w)}px`, `${Number(h)}px`, 8),
      ),
      textNode(
        `quote-${index}`,
        String(quote),
        {
          color: "#ffffff",
          fontSize: index % 3 === 1 ? "22px" : "18px",
          fontWeight: "600",
          lineHeight: "1.4",
        },
        absoluteLayout(Number(x) + 22, Number(y) + 22, `${Number(w) - 44}px`, `${Number(h) - 60}px`, 20),
      ),
      textNode(
        `name-${index}`,
        `— ${name}`,
        { color: "rgba(255,255,255,.5)", fontSize: "13px", fontWeight: "700" },
        absoluteLayout(Number(x) + 22, Number(y) + Number(h) - 38, "160px", "22px", 20),
      ),
    ]),
    imageNode(
      "team",
      IMG.team,
      { borderRadius: "14px", objectFit: "cover", opacity: "0.85" },
      absoluteLayout(45, 560, "920px", "130px", 5),
      "הצוות שלנו",
    ),
  ],
);

/** 5 — וידאו-סגנון: תמונה + ציטוט מונחה */
const videoStyle = testimonials(
  "section-testimonials-showcase-video-style",
  "ביקורות — סגנון וידאו",
  "testimonials-showcase-video-style",
  "#171717",
  "620px",
  IMG.hospitality,
  [
    imageNode(
      "hero",
      IMG.hospitality,
      {
        borderRadius: "6px",
        objectFit: "cover",
        filter: "brightness(.75)",
      },
      absoluteLayout(40, 40, "620px", "540px", 5),
      "סרטון המלצה",
    ),
    boxNode(
      "scrim",
      {
        backgroundImage:
          "linear-gradient(180deg, transparent 30%, rgba(17,19,24,.85) 100%)",
        borderRadius: "6px",
      },
      absoluteLayout(40, 40, "620px", "540px", 6),
    ),
    boxNode(
      "play",
      {
        backgroundColor: "rgba(255,255,255,.92)",
        borderRadius: "50%",
      },
      absoluteLayout(310, 240, "80px", "80px", 15),
    ),
    textNode(
      "play-icon",
      "▶",
      { color: ink, fontSize: "28px", textAlign: "center" },
      absoluteLayout(335, 262, "30px", "36px", 20),
    ),
    textNode(
      "quote",
      "״ראיתי תוצאות כבר מהשבוע הראשון — לא האמנתי שזה יקרה כל כך מהר.״",
      {
        color: "#ffffff",
        fontSize: "26px",
        fontWeight: "600",
        lineHeight: "1.45",
      },
      absoluteLayout(70, 420, "560px", "90px", 20),
    ),
    textNode(
      "name",
      "איתן ברק · מנהל מלון בוטיק",
      { color: "rgba(255,255,255,.75)", fontSize: "14px", fontWeight: "700" },
      absoluteLayout(70, 530, "400px", "24px", 20),
    ),
    ...[
      [IMG.food, "״מטבח ברמה אחרת״", "שף רון"],
      [IMG.event, "״אירוע מושלם״", "הילה כ."],
      [IMG.travel, "״חוויה בלתי נשכחת״", "עומר ד."],
    ].flatMap(([src, quote, name], index) => {
      const y = 40 + index * 175;
      return [
        imageNode(
          `side-${index}`,
          String(src),
          { borderRadius: "4px", objectFit: "cover" },
          absoluteLayout(700, y, "340px", "155px", 8),
          String(name),
        ),
        textNode(
          `side-quote-${index}`,
          String(quote),
          {
            color: "#ffffff",
            fontSize: "16px",
            fontWeight: "700",
            backgroundColor: "rgba(17,19,24,.6)",
            borderRadius: "999px",
            padding: "8px 14px",
          },
          absoluteLayout(720, y + 100, "260px", "34px", 20),
        ),
        textNode(
          `side-name-${index}`,
          String(name),
          { color: "#aaaaaa", fontSize: "12px" },
          absoluteLayout(720, y + 138, "200px", "18px", 20),
        ),
      ];
    }),
  ],
);

/** 6 — פיצול כהה: רשימת המלצות */
const darkSplit = testimonials(
  "section-testimonials-showcase-dark-split",
  "ביקורות — פיצול כהה",
  "testimonials-showcase-dark-split",
  "#1a1a1a",
  "680px",
  IMG.legal,
  [
    textNode(
      "eyebrow",
      "אמון מוכח",
      {
        color: "#c9a227",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.16em",
      },
      absoluteLayout(560, 55, "220px", "24px", 20),
    ),
    textNode(
      "title",
      "לקוחות שחוזרים\nשוב ושוב",
      {
        color: "#ffffff",
        fontSize: "48px",
        fontWeight: "500",
        lineHeight: "1",
        letterSpacing: "-0.05em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(560, 95, "460px", "110px", 20),
    ),
    imageNode(
      "image",
      IMG.legal,
      { borderRadius: "0", objectFit: "cover", opacity: "0.9" },
      absoluteLayout(0, 0, "480px", "680px", 5),
      "לקוחות מרוצים",
    ),
    boxNode(
      "shade",
      {
        backgroundImage:
          "linear-gradient(90deg, transparent 60%, rgba(26,26,26,.95) 85%)",
      },
      absoluteLayout(0, 0, "480px", "680px", 6),
    ),
    ...[
      ["01", "״דיוק משפטי ויחס אישי — בדיוק מה שחיפשנו.״", "עו״ד מירי ל."],
      ["02", "״ליווינו עשרות עסקאות — תמיד בראש סדר העדיפויות.״", "רועי ש."],
      ["03", "״שקיפות מלאה ותוצאות שמדברות בעד עצמן.״", "הדר מ."],
      ["04", "״ממליצה לכל בעל עסק שרוצה שקט נפשי.״", "גלית פ."],
    ].flatMap(([num, quote, name], index) => {
      const y = 240 + index * 95;
      return [
        textNode(
          `num-${index}`,
          num,
          { color: "#c9a227", fontSize: "28px", fontWeight: "600" },
          absoluteLayout(560, y, "70px", "36px", 20),
        ),
        textNode(
          `quote-${index}`,
          quote,
          { color: "rgba(255,255,255,.85)", fontSize: "15px", lineHeight: "1.45" },
          absoluteLayout(650, y, "380px", "50px", 20),
        ),
        textNode(
          `name-${index}`,
          name,
          { color: "rgba(255,255,255,.45)", fontSize: "13px", fontWeight: "700" },
          absoluteLayout(650, y + 55, "280px", "22px", 20),
        ),
        boxNode(
          `rule-${index}`,
          { backgroundColor: "rgba(255,255,255,.1)" },
          absoluteLayout(560, y + 78, "450px", "1px", 5),
        ),
      ];
    }),
  ],
);

/** 7 — ספוטלייט: המלצה אחת גדולה */
const spotlight = testimonials(
  "section-testimonials-showcase-spotlight",
  "ביקורות — ספוטלייט",
  "testimonials-showcase-spotlight",
  "#efe8df",
  "640px",
  IMG.realestate,
  [
    boxNode(
      "card",
      { backgroundColor: "#ffffff", borderRadius: "24px" },
      absoluteLayout(40, 40, "1020px", "560px", 5),
    ),
    textNode(
      "eyebrow",
      "המלצה מובילה · 2025",
      {
        color: "#8a7359",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.14em",
        textAlign: "center",
      },
      absoluteLayout(300, 80, "500px", "24px", 20),
    ),
    textNode(
      "quote",
      "״אחרי שנים של חיפושים — סוף סוף מצאנו שותף שמבין עסק, אנשים ותוצאות.״",
      {
        color: ink,
        fontSize: "36px",
        fontWeight: "600",
        lineHeight: "1.3",
        letterSpacing: "-0.035em",
        textAlign: "center",
      },
      absoluteLayout(120, 130, "860px", "140px", 20),
    ),
    textNode(
      "stars",
      "★★★★★",
      {
        color: "#c9a227",
        fontSize: "22px",
        letterSpacing: "0.1em",
        textAlign: "center",
      },
      absoluteLayout(420, 290, "260px", "30px", 20),
    ),
    imageNode(
      "avatar",
      IMG.realestate,
      { borderRadius: "50%", objectFit: "cover" },
      absoluteLayout(500, 340, "100px", "100px", 10),
      "לקוח מרוצה",
    ),
    textNode(
      "name",
      "משה ויצמן · מנכ״ל",
      {
        color: ink,
        fontSize: "18px",
        fontWeight: "700",
        textAlign: "center",
      },
      absoluteLayout(380, 460, "340px", "28px", 20),
    ),
    textNode(
      "company",
      "קבוצת נדל״ן · 15 שנות שותפות",
      { ...body, textAlign: "center", fontSize: "14px" },
      absoluteLayout(350, 492, "400px", "24px", 20),
    ),
    buttonNode(
      "cta",
      "קראו עוד ביקורות",
      button,
      absoluteLayout(440, 540, "220px", "48px", 20),
    ),
  ],
);

/** 8 — מגזין Ledger: רשימה ממוספרת */
const magazineLedger = testimonials(
  "section-testimonials-showcase-magazine-ledger",
  "ביקורות — מגזין Ledger",
  "testimonials-showcase-magazine-ledger",
  "#faf8f4",
  "700px",
  IMG.education,
  [
    textNode(
      "eyebrow",
      "קולות לקוחות",
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
      "מה אומרים\nעלינו",
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
      IMG.education,
      { borderRadius: "2px", objectFit: "cover" },
      absoluteLayout(45, 240, "500px", "400px", 5),
      "לקוחות מרוצים",
    ),
    textNode(
      "main-label",
      "★★★★★ · 4.9 ממוצע",
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
    ...[
      ["01", "״הדרכה מעולה ותוצאות מיידיות״", "מורה · בתי ספר"],
      ["02", "״הילדים אוהבים — ההורים ממליצים״", "הורה · תל אביב"],
      ["03", "״תוכנית מותאמת לכל כיתה״", "מנהלת · רמת גן"],
      ["04", "״יחס חם ומקצועי לאורך כל השנה״", "ועד הורים"],
      ["05", "״שיפור משמעותי בציונים ובמוטיבציה״", "יועצת חינוכית"],
    ].flatMap(([num, quote, name], index) => {
      const y = 75 + index * 105;
      return [
        textNode(
          `num-${index}`,
          num,
          { color: "#c4b8a8", fontSize: "18px", fontWeight: "700" },
          absoluteLayout(600, y, "50px", "28px", 20),
        ),
        textNode(
          `quote-${index}`,
          quote,
          { color: "#1c1915", fontSize: "20px", fontWeight: "700" },
          absoluteLayout(660, y, "360px", "30px", 20),
        ),
        textNode(
          `name-${index}`,
          name,
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

export const TESTIMONIALS_SHOWCASE_SECTIONS: VisualLibrarySectionTemplate[] = [
  quoteCards,
  heroQuote,
  ratingGrid,
  quoteWall,
  videoStyle,
  darkSplit,
  spotlight,
  magazineLedger,
];
