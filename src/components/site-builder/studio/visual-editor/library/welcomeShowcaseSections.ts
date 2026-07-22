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

const ink = "#0b1020";
const button = {
  color: "#ffffff",
  backgroundColor: ink,
  borderRadius: "999px",
  padding: "13px 25px",
  fontSize: "16px",
  fontWeight: "700",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
};

function welcome(
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
    category: "hero",
    title,
    description: "פתיח ייחודי בהשראת קומפוזיציות Editorial מודרניות",
    keywords: ["ברוכים הבאים", "hero", "פתיח", "editorial", "wix"],
    previewLayout,
    backgroundColor,
    minHeight,
    thumbnail,
    nodes,
  };
}

const orbit = welcome(
  "section-welcome-showcase-orbit",
  "ברוכים הבאים — קולאז׳ מרחף",
  "welcome-orbit-collage",
  "#ffffff",
  "650px",
  IMG.tech,
  [
    textNode(
      "eyebrow",
      "נעים להכיר",
      { color: "#5b6475", fontSize: "14px", fontWeight: "700", textAlign: "center" },
      absoluteLayout(420, 38, "260px", "26px", 20),
    ),
    textNode(
      "title",
      "הופכים רעיון\nלמשהו שאי אפשר לפספס",
      {
        color: ink,
        fontSize: "66px",
        fontWeight: "700",
        lineHeight: "0.98",
        letterSpacing: "-0.055em",
        textAlign: "center",
        whiteSpace: "pre-line",
      },
      absoluteLayout(190, 80, "720px", "150px", 20),
    ),
    textNode(
      "copy",
      "מסר חד, חוויה חזקה ועיצוב שמושך את האנשים הנכונים.",
      { color: "#4b5563", fontSize: "17px", lineHeight: "1.55", textAlign: "center" },
      absoluteLayout(300, 250, "500px", "55px", 20),
    ),
    buttonNode("primary", "בואו נדבר", button, absoluteLayout(450, 320, "200px", "48px", 22)),
    imageNode(
      "image1",
      IMG.abstract,
      { borderRadius: "34px", objectFit: "cover" },
      { ...absoluteLayout(35, 350, "190px", "200px", 10), rotate: -13 },
    ),
    imageNode(
      "image2",
      IMG.product,
      { borderRadius: "34px", objectFit: "cover" },
      { ...absoluteLayout(245, 410, "175px", "190px", 10), rotate: 9 },
    ),
    imageNode(
      "image3",
      IMG.tech,
      { borderRadius: "34px", objectFit: "cover" },
      absoluteLayout(455, 390, "190px", "220px", 10),
    ),
    imageNode(
      "image4",
      IMG.workspace,
      { borderRadius: "34px", objectFit: "cover" },
      { ...absoluteLayout(680, 410, "175px", "190px", 10), rotate: -8 },
    ),
    imageNode(
      "image5",
      IMG.portrait,
      { borderRadius: "34px", objectFit: "cover" },
      { ...absoluteLayout(875, 345, "190px", "205px", 10), rotate: 12 },
    ),
  ],
);

const floatingCard = welcome(
  "section-welcome-showcase-floating-card",
  "ברוכים הבאים — תמונה וכרטיס",
  "welcome-fullbleed-floating-card",
  "#285d94",
  "610px",
  IMG.product,
  [
    imageNode(
      "image",
      IMG.product,
      { objectFit: "cover", objectPosition: "center" },
      absoluteLayout(0, 0, "1100px", "610px", 2),
    ),
    boxNode(
      "card",
      { backgroundColor: "#f7f5f1", borderRadius: "0px", boxShadow: "0 24px 70px rgba(11,16,32,.18)" },
      absoluteLayout(70, 80, "400px", "440px", 10),
    ),
    textNode(
      "title",
      "קולקציה חדשה.\nגישה חדשה.",
      {
        color: ink,
        fontSize: "48px",
        fontWeight: "700",
        lineHeight: "1.02",
        letterSpacing: "-0.045em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(110, 125, "320px", "120px", 20),
    ),
    textNode(
      "copy",
      "מקום לספר בקצרה מה מיוחד בעסק שלכם ולתת סיבה ברורה להמשיך.",
      { color: "#374151", fontSize: "16px", lineHeight: "1.55" },
      absoluteLayout(110, 285, "300px", "90px", 20),
    ),
    buttonNode("primary", "לצפייה", button, absoluteLayout(110, 420, "150px", "48px", 22)),
  ],
);

const editorial = welcome(
  "section-welcome-showcase-editorial",
  "ברוכים הבאים — Editorial ענק",
  "welcome-editorial-asymmetric",
  "#ffffff",
  "590px",
  IMG.architecture,
  [
    textNode(
      "title",
      "העבודה\nהבאה שלכם\nמתחילה כאן",
      {
        color: "#050505",
        fontSize: "84px",
        fontWeight: "500",
        lineHeight: "0.92",
        letterSpacing: "-0.065em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(30, 45, "500px", "300px", 20),
    ),
    textNode(
      "copy",
      "פתיח א־סימטרי שמחבר טיפוגרפיה גדולה עם תמונה אחת בלתי נשכחת.",
      { color: "#27272a", fontSize: "16px", lineHeight: "1.5" },
      absoluteLayout(35, 420, "300px", "80px", 20),
    ),
    buttonNode("primary", "לכל העבודות", button, absoluteLayout(365, 430, "160px", "48px", 22)),
    imageNode(
      "image",
      IMG.architecture,
      { objectFit: "cover", borderRadius: "0px" },
      absoluteLayout(560, 30, "510px", "520px", 10),
    ),
  ],
);

const overlap = welcome(
  "section-welcome-showcase-overlap",
  "ברוכים הבאים — פסיפס חופף",
  "welcome-mosaic-overlap",
  "#ffffff",
  "620px",
  IMG.ecommerce,
  [
    imageNode("image1", IMG.ecommerce, { objectFit: "cover" }, absoluteLayout(25, 25, "515px", "570px", 5)),
    imageNode("image2", IMG.product, { objectFit: "cover" }, absoluteLayout(560, 25, "515px", "570px", 5)),
    boxNode(
      "card",
      { backgroundColor: "#ffffff", borderRadius: "10px", boxShadow: "0 24px 80px rgba(15,23,42,.16)" },
      absoluteLayout(60, 85, "440px", "360px", 10),
    ),
    textNode(
      "title",
      "מוצרים עם נוכחות",
      { color: "#09090b", fontSize: "52px", fontWeight: "600", lineHeight: "1", letterSpacing: "-0.05em" },
      absoluteLayout(105, 125, "350px", "115px", 20),
    ),
    textNode(
      "copy",
      "קומפוזיציית תמונות נועזת עם מסר נקי וכרטיס שמרגיש כמו שכבת מגזין.",
      { color: "#3f3f46", fontSize: "16px", lineHeight: "1.55" },
      absoluteLayout(105, 270, "330px", "80px", 20),
    ),
    buttonNode("primary", "לקטלוג", button, absoluteLayout(105, 370, "140px", "48px", 22)),
  ],
);

const galleryStatement = welcome(
  "section-welcome-showcase-gallery-statement",
  "ברוכים הבאים — גלריה והצהרה",
  "welcome-gallery-statement",
  "#ffffff",
  "650px",
  IMG.skincare,
  [
    imageNode("image1", IMG.skincare, { objectFit: "cover" }, absoluteLayout(20, 20, "520px", "280px", 10)),
    imageNode("image2", IMG.wellness, { objectFit: "cover" }, absoluteLayout(560, 20, "520px", "280px", 10)),
    textNode(
      "title",
      "להרגיש טוב.\nלהיראות נפלא.",
      {
        color: "#050505",
        fontSize: "78px",
        fontWeight: "500",
        lineHeight: "0.95",
        letterSpacing: "-0.06em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(20, 345, "720px", "190px", 20),
    ),
    textNode(
      "copy",
      "חוויה טבעית ומדויקת שמתחילה בפרטים הקטנים.",
      { color: "#27272a", fontSize: "17px", lineHeight: "1.55" },
      absoluteLayout(790, 370, "260px", "65px", 20),
    ),
    buttonNode("primary", "לגלות עוד", button, absoluteLayout(790, 470, "150px", "48px", 22)),
  ],
);

const minimal = welcome(
  "section-welcome-showcase-minimal",
  "ברוכים הבאים — הצהרה מינימלית",
  "welcome-minimal-statement",
  "#f4f1ea",
  "520px",
  IMG.architecture,
  [
    textNode(
      "eyebrow",
      "סטודיו עצמאי · תל אביב",
      { color: "#6b6257", fontSize: "13px", fontWeight: "700", letterSpacing: "0.12em" },
      absoluteLayout(55, 50, "300px", "25px", 20),
    ),
    textNode(
      "title",
      "פחות רעש.\nיותר השפעה.",
      {
        color: "#211f1b",
        fontSize: "92px",
        fontWeight: "500",
        lineHeight: "0.9",
        letterSpacing: "-0.07em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(50, 115, "760px", "200px", 20),
    ),
    boxNode("line", { backgroundColor: "#211f1b" }, absoluteLayout(55, 350, "990px", "1px", 5)),
    textNode(
      "copy",
      "אנחנו יוצרים מותגים ואתרים שנשארים בראש גם אחרי שסוגרים את המסך.",
      { color: "#514b43", fontSize: "17px", lineHeight: "1.55" },
      absoluteLayout(55, 390, "470px", "65px", 20),
    ),
    buttonNode("primary", "מתחילים פרויקט", button, absoluteLayout(860, 390, "180px", "48px", 22)),
  ],
);

const cinematic = welcome(
  "section-welcome-showcase-cinematic",
  "ברוכים הבאים — קולנועי כהה",
  "welcome-cinematic-dark",
  "#09090b",
  "620px",
  IMG.hospitality,
  [
    imageNode(
      "image",
      IMG.hospitality,
      { objectFit: "cover", opacity: "0.62" },
      absoluteLayout(0, 0, "1100px", "620px", 2),
    ),
    boxNode(
      "shade",
      { backgroundImage: "linear-gradient(90deg,rgba(9,9,11,.94),rgba(9,9,11,.18))" },
      absoluteLayout(0, 0, "1100px", "620px", 5),
    ),
    textNode(
      "eyebrow",
      "חוויה שנשארת",
      { color: "#f5d38b", fontSize: "14px", fontWeight: "700", letterSpacing: "0.16em" },
      absoluteLayout(65, 110, "300px", "28px", 20),
    ),
    textNode(
      "title",
      "לילה אחד.\nסיפור שלם.",
      {
        color: "#ffffff",
        fontSize: "72px",
        fontWeight: "600",
        lineHeight: "0.96",
        letterSpacing: "-0.055em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(60, 160, "520px", "170px", 20),
    ),
    textNode(
      "copy",
      "פתיח דרמטי למותגים שרוצים להרגיש גדולים, בטוחים ובלתי נשכחים.",
      { color: "#e4e4e7", fontSize: "17px", lineHeight: "1.55" },
      absoluteLayout(65, 370, "420px", "70px", 20),
    ),
    buttonNode(
      "primary",
      "הזמנת מקום",
      { ...button, color: ink, backgroundColor: "#f5d38b" },
      absoluteLayout(65, 480, "170px", "48px", 22),
    ),
  ],
);

const archPortrait = welcome(
  "section-welcome-showcase-arch",
  "ברוכים הבאים — פורטרט קמור",
  "welcome-arch-portrait",
  "#f8e7df",
  "600px",
  IMG.portrait,
  [
    textNode(
      "eyebrow",
      "BEAUTY · WELLNESS",
      { color: "#9f3f58", fontSize: "13px", fontWeight: "700", letterSpacing: "0.18em" },
      absoluteLayout(65, 85, "280px", "25px", 20),
    ),
    textNode(
      "title",
      "היופי שלך\nמתחיל מבפנים",
      {
        color: "#4b1827",
        fontSize: "70px",
        fontWeight: "600",
        lineHeight: "0.98",
        letterSpacing: "-0.055em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(60, 135, "500px", "170px", 20),
    ),
    textNode(
      "copy",
      "טיפול אישי, קצב רגוע ותוצאה שמרגישה בדיוק כמוך.",
      { color: "#7f4052", fontSize: "18px", lineHeight: "1.6" },
      absoluteLayout(65, 345, "420px", "70px", 20),
    ),
    buttonNode(
      "primary",
      "לקביעת תור",
      { ...button, backgroundColor: "#a73f60" },
      absoluteLayout(65, 455, "170px", "48px", 22),
    ),
    imageNode(
      "image",
      IMG.portrait,
      { borderRadius: "260px 260px 24px 24px", objectFit: "cover", boxShadow: "0 30px 70px rgba(89,28,50,.18)" },
      absoluteLayout(625, 45, "390px", "510px", 10),
    ),
    textNode(
      "stat",
      "12+ שנות ניסיון",
      { color: "#4b1827", fontSize: "15px", fontWeight: "700", textAlign: "center" },
      absoluteLayout(435, 500, "160px", "28px", 20),
    ),
  ],
);

export const WELCOME_SHOWCASE_SECTIONS: VisualLibrarySectionTemplate[] = [
  orbit,
  floatingCard,
  editorial,
  overlap,
  galleryStatement,
  minimal,
  cinematic,
  archPortrait,
];
