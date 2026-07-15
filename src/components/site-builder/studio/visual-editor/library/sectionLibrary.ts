import {
  absoluteLayout,
  boxNode,
  buttonNode,
  iconNode,
  imageNode,
  textNode,
  videoNode,
} from "./libraryFactories";
import { VISUAL_LIBRARY_IMAGES } from "./libraryAssets";
import type { VisualLibrarySectionTemplate } from "./visualLibraryTypes";
import { SECTION_LIBRARY_EXTRA } from "./sectionLibraryExtra";

const titleStyle = {
  color: "#0f172a",
  fontSize: "48px",
  fontWeight: "900",
  lineHeight: "1.08",
};

const copyStyle = {
  color: "#475569",
  fontSize: "18px",
  fontWeight: "500",
  lineHeight: "1.7",
};

const SECTION_LIBRARY_CORE: VisualLibrarySectionTemplate[] = [
  {
    id: "section-hero-business",
    kind: "section",
    tab: "sections",
    category: "hero",
    title: "Hero עסקי",
    description: "כותרת, פסקה, שני כפתורים ותמונה",
    keywords: ["hero", "עסקי", "כותרת", "תמונה"],
    thumbnail: VISUAL_LIBRARY_IMAGES.office,
    minHeight: "560px",
    backgroundColor: "#fff7ed",
    nodes: [
      textNode(
        "badge",
        "פתרונות חכמים לעסק",
        {
          color: "#c2410c",
          backgroundColor: "#fff7ed",
          border: "1px solid #fdba74",
          borderRadius: "999px",
          padding: "8px 14px",
          fontSize: "14px",
          fontWeight: "900",
        },
        absoluteLayout(70, 60, "220px", "40px", 20),
      ),
      textNode(
        "title",
        "הופכים רעיון לעסק שמוביל",
        {
          color: "#0f172a",
          fontSize: "66px",
          fontWeight: "900",
          lineHeight: "1.02",
        },
        absoluteLayout(70, 125, "470px", "180px", 20),
      ),
      textNode(
        "copy",
        "בנו נוכחות דיגיטלית מקצועית, הציגו את השירותים שלכם והפכו מבקרים ללקוחות.",
        copyStyle,
        absoluteLayout(70, 320, "430px", "100px", 20),
      ),
      buttonNode(
        "primary",
        "בואו נתחיל",
        {
          color: "#ffffff",
          backgroundImage:
            "linear-gradient(90deg,#f97316,#7c3aed)",
          borderRadius: "999px",
          padding: "14px 28px",
          fontSize: "17px",
          fontWeight: "900",
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        },
        absoluteLayout(70, 445, "180px", "54px", 22),
      ),
      buttonNode(
        "secondary",
        "צפו בעבודות",
        {
          color: "#0f172a",
          backgroundColor: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "999px",
          padding: "14px 26px",
          fontSize: "17px",
          fontWeight: "900",
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        },
        absoluteLayout(270, 445, "180px", "54px", 22),
      ),
      imageNode(
        "image",
        VISUAL_LIBRARY_IMAGES.office,
        {
          borderRadius: "36px",
          objectFit: "cover",
          boxShadow: "0 30px 90px rgba(15,23,42,.22)",
        },
        absoluteLayout(570, 55, "520px", "450px", 10),
        "תמונת Hero",
      ),
    ],
  },
  {
    id: "section-hero-beauty",
    kind: "section",
    tab: "sections",
    category: "hero",
    title: "Hero ביוטי",
    description: "עיצוב רך עם Gradient ותמונה",
    keywords: ["hero", "ביוטי", "אסתטיקה", "תמונה"],
    thumbnail: VISUAL_LIBRARY_IMAGES.beauty,
    minHeight: "560px",
    backgroundColor: "#fff1f2",
    nodes: [
      boxNode(
        "glow",
        {
          backgroundImage:
            "radial-gradient(circle,#f9a8d4 0%,rgba(249,168,212,0) 70%)",
          borderRadius: "999px",
          filter: "blur(2px)",
        },
        absoluteLayout(680, 60, "360px", "360px", 1),
      ),
      imageNode(
        "image",
        VISUAL_LIBRARY_IMAGES.beauty,
        {
          borderRadius: "180px 180px 32px 32px",
          objectFit: "cover",
          boxShadow: "0 28px 80px rgba(190,24,93,.2)",
        },
        absoluteLayout(650, 65, "380px", "440px", 5),
        "תמונת ביוטי",
      ),
      textNode(
        "eyebrow",
        "BEAUTY STUDIO",
        {
          color: "#be185d",
          fontSize: "14px",
          fontWeight: "900",
          letterSpacing: "4px",
        },
        absoluteLayout(90, 100, "260px", "28px", 20),
      ),
      textNode(
        "title",
        "היופי שלך מתחיל כאן",
        {
          color: "#4a044e",
          fontSize: "70px",
          fontWeight: "900",
          lineHeight: "1.03",
        },
        absoluteLayout(90, 145, "470px", "180px", 20),
      ),
      textNode(
        "copy",
        "טיפולים מקצועיים, יחס אישי ותוצאה שמרגישה בדיוק כמוך.",
        {
          color: "#9d174d",
          fontSize: "20px",
          fontWeight: "600",
          lineHeight: "1.65",
        },
        absoluteLayout(90, 340, "420px", "90px", 20),
      ),
      buttonNode(
        "button",
        "לקביעת תור",
        {
          color: "#ffffff",
          backgroundImage:
            "linear-gradient(90deg,#ec4899,#f97316)",
          borderRadius: "999px",
          padding: "14px 30px",
          fontSize: "17px",
          fontWeight: "900",
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        },
        absoluteLayout(90, 445, "180px", "54px", 22),
      ),
    ],
  },
  {
    id: "section-about-split",
    kind: "section",
    tab: "sections",
    category: "about",
    title: "אודות – טקסט ותמונה",
    description: "מבנה דו־טורי נקי",
    keywords: ["אודות", "טקסט", "תמונה"],
    thumbnail: VISUAL_LIBRARY_IMAGES.team,
    minHeight: "500px",
    backgroundColor: "#ffffff",
    nodes: [
      imageNode(
        "image",
        VISUAL_LIBRARY_IMAGES.team,
        {
          borderRadius: "30px",
          objectFit: "cover",
        },
        absoluteLayout(60, 60, "470px", "380px", 10),
        "תמונת אודות",
      ),
      textNode(
        "eyebrow",
        "מי אנחנו",
        {
          color: "#7c3aed",
          fontSize: "15px",
          fontWeight: "900",
          letterSpacing: "2px",
        },
        absoluteLayout(600, 75, "220px", "30px", 20),
      ),
      textNode(
        "title",
        "אנשים שמאמינים בעבודה טובה",
        titleStyle,
        absoluteLayout(600, 120, "470px", "120px", 20),
      ),
      textNode(
        "copy",
        "אנחנו משלבים ניסיון, חשיבה יצירתית ושירות אישי כדי לבנות פתרונות שעובדים באמת.",
        copyStyle,
        absoluteLayout(600, 260, "450px", "120px", 20),
      ),
      buttonNode(
        "button",
        "קראו עלינו",
        {
          color: "#ffffff",
          backgroundColor: "#0f172a",
          borderRadius: "14px",
          padding: "14px 26px",
          fontSize: "16px",
          fontWeight: "900",
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        },
        absoluteLayout(600, 395, "170px", "52px", 22),
      ),
    ],
  },
  {
    id: "section-services-cards",
    kind: "section",
    tab: "sections",
    category: "services",
    title: "שלושה שירותים",
    description: "כותרת ושלושה כרטיסים",
    keywords: ["שירותים", "כרטיסים", "יתרונות"],
    thumbnail: VISUAL_LIBRARY_IMAGES.office,
    minHeight: "560px",
    backgroundColor: "#f8fafc",
    previewHtml:
      '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px"><div style="height:80px;border-radius:14px;background:white"></div><div style="height:80px;border-radius:14px;background:white"></div><div style="height:80px;border-radius:14px;background:white"></div></div>',
    nodes: [
      textNode(
        "title",
        "השירותים שלנו",
        {
          color: "#0f172a",
          fontSize: "48px",
          fontWeight: "900",
          textAlign: "center",
        },
        absoluteLayout(360, 45, "480px", "70px", 20),
      ),
      textNode(
        "subtitle",
        "פתרונות מדויקים שמקדמים את העסק",
        {
          color: "#64748b",
          fontSize: "18px",
          fontWeight: "600",
          textAlign: "center",
        },
        absoluteLayout(370, 115, "460px", "40px", 20),
      ),
      ...[0, 1, 2].flatMap((index) => [
        boxNode(
          `card-${index}`,
          {
            backgroundColor: "#ffffff",
            border: "1px solid rgba(15,23,42,.08)",
            borderRadius: "26px",
            boxShadow: "0 18px 50px rgba(15,23,42,.09)",
          },
          absoluteLayout(70 + index * 360, 210, "320px", "280px", 5),
          `כרטיס שירות ${index + 1}`,
        ),
        iconNode(
          `icon-${index}`,
          ["sparkles", "star", "check"][index],
          {
            color: "#7c3aed",
            backgroundColor: "#ede9fe",
            borderRadius: "18px",
            fontSize: "26px",
            fontWeight: "900",
          },
          absoluteLayout(100 + index * 360, 245, "58px", "58px", 10),
          "אייקון שירות",
        ),
        textNode(
          `title-${index}`,
          ["אסטרטגיה", "עיצוב", "ליווי"][index],
          {
            color: "#0f172a",
            fontSize: "25px",
            fontWeight: "900",
          },
          absoluteLayout(100 + index * 360, 325, "250px", "45px", 10),
        ),
        textNode(
          `copy-${index}`,
          [
            "תכנון מדויק שמתחיל מהמטרות העסקיות.",
            "עיצוב מקצועי שמרגיש נכון למותג.",
            "ליווי אישי מהרעיון ועד התוצאה.",
          ][index],
          {
            color: "#64748b",
            fontSize: "16px",
            fontWeight: "500",
            lineHeight: "1.65",
          },
          absoluteLayout(100 + index * 360, 380, "250px", "90px", 10),
        ),
      ]),
    ],
  },
  {
    id: "section-gallery-grid",
    kind: "section",
    tab: "sections",
    category: "portfolio",
    title: "גלריית עבודות",
    description: "גריד של שש תמונות",
    keywords: ["גלריה", "תמונות", "תיק עבודות"],
    minHeight: "680px",
    backgroundColor: "#ffffff",
    thumbnail: VISUAL_LIBRARY_IMAGES.abstract,
    nodes: [
      textNode(
        "title",
        "עבודות נבחרות",
        titleStyle,
        absoluteLayout(70, 45, "480px", "70px", 20),
      ),
      ...[
        VISUAL_LIBRARY_IMAGES.office,
        VISUAL_LIBRARY_IMAGES.beauty,
        VISUAL_LIBRARY_IMAGES.food,
        VISUAL_LIBRARY_IMAGES.realestate,
        VISUAL_LIBRARY_IMAGES.tech,
        VISUAL_LIBRARY_IMAGES.travel,
      ].map((src, index) =>
        imageNode(
          `image-${index}`,
          src,
          {
            borderRadius: "22px",
            objectFit: "cover",
          },
          absoluteLayout(
            70 + (index % 3) * 350,
            145 + Math.floor(index / 3) * 245,
            "320px",
            "215px",
            10,
          ),
          `עבודה ${index + 1}`,
        ),
      ),
    ],
  },
  {
    id: "section-testimonials",
    kind: "section",
    tab: "sections",
    category: "testimonials",
    title: "המלצות לקוחות",
    description: "שלוש המלצות עם דירוג",
    keywords: ["המלצות", "לקוחות", "ביקורות"],
    thumbnail: VISUAL_LIBRARY_IMAGES.team,
    minHeight: "540px",
    backgroundColor: "#f5f3ff",
    nodes: [
      textNode(
        "title",
        "מה הלקוחות אומרים",
        {
          ...titleStyle,
          textAlign: "center",
        },
        absoluteLayout(350, 50, "500px", "70px", 20),
      ),
      ...[0, 1, 2].flatMap((index) => [
        boxNode(
          `card-${index}`,
          {
            backgroundColor: "#ffffff",
            borderRadius: "24px",
            border: "1px solid rgba(124,58,237,.12)",
            boxShadow: "0 16px 45px rgba(76,29,149,.09)",
          },
          absoluteLayout(70 + index * 360, 165, "320px", "280px", 5),
          "כרטיס המלצה",
        ),
        textNode(
          `stars-${index}`,
          "★★★★★",
          {
            color: "#f59e0b",
            fontSize: "24px",
            fontWeight: "900",
            letterSpacing: "4px",
          },
          absoluteLayout(100 + index * 360, 200, "220px", "36px", 10),
        ),
        textNode(
          `quote-${index}`,
          [
            "“שירות מקצועי, מדויק ומהיר. התוצאה עלתה על הציפיות.”",
            "“הרגשנו שמבינים אותנו מהרגע הראשון.”",
            "“תהליך נעים, ברור ותוצאה שאנחנו גאים להציג.”",
          ][index],
          {
            color: "#334155",
            fontSize: "18px",
            fontWeight: "700",
            lineHeight: "1.65",
          },
          absoluteLayout(100 + index * 360, 250, "250px", "110px", 10),
        ),
        textNode(
          `name-${index}`,
          ["נועה לוי", "איתי כהן", "מיכל בר"][index],
          {
            color: "#0f172a",
            fontSize: "16px",
            fontWeight: "900",
          },
          absoluteLayout(100 + index * 360, 385, "220px", "30px", 10),
        ),
      ]),
    ],
  },
  {
    id: "section-pricing",
    kind: "section",
    tab: "sections",
    category: "pricing",
    title: "מחירון",
    description: "שלוש חבילות מחיר",
    keywords: ["מחירון", "חבילות", "pricing"],
    minHeight: "650px",
    backgroundColor: "#ffffff",
    nodes: [
      textNode(
        "title",
        "בחרו את החבילה שמתאימה לכם",
        {
          ...titleStyle,
          textAlign: "center",
        },
        absoluteLayout(280, 45, "640px", "80px", 20),
      ),
      ...[0, 1, 2].flatMap((index) => [
        boxNode(
          `card-${index}`,
          {
            backgroundColor: index === 1 ? "#0f172a" : "#ffffff",
            border: index === 1
              ? "0"
              : "1px solid rgba(15,23,42,.10)",
            borderRadius: "28px",
            boxShadow:
              index === 1
                ? "0 26px 80px rgba(15,23,42,.26)"
                : "0 18px 50px rgba(15,23,42,.09)",
          },
          absoluteLayout(70 + index * 360, 165, "320px", "410px", 5),
          "כרטיס מחיר",
        ),
        textNode(
          `name-${index}`,
          ["בסיסית", "מקצועית", "פרימיום"][index],
          {
            color: index === 1 ? "#ffffff" : "#0f172a",
            fontSize: "25px",
            fontWeight: "900",
            textAlign: "center",
          },
          absoluteLayout(115 + index * 360, 205, "230px", "45px", 10),
        ),
        textNode(
          `price-${index}`,
          ["₪99", "₪199", "₪349"][index],
          {
            color: index === 1 ? "#a78bfa" : "#7c3aed",
            fontSize: "48px",
            fontWeight: "900",
            textAlign: "center",
          },
          absoluteLayout(115 + index * 360, 270, "230px", "70px", 10),
        ),
        textNode(
          `list-${index}`,
          "✓ עיצוב מקצועי\n✓ התאמה למובייל\n✓ תמיכה מלאה",
          {
            color: index === 1 ? "#cbd5e1" : "#475569",
            fontSize: "16px",
            fontWeight: "700",
            lineHeight: "2",
            whiteSpace: "pre-line",
          },
          absoluteLayout(115 + index * 360, 355, "230px", "120px", 10),
        ),
        buttonNode(
          `button-${index}`,
          "בחירת חבילה",
          {
            color: index === 1 ? "#0f172a" : "#ffffff",
            backgroundColor: index === 1 ? "#ffffff" : "#7c3aed",
            borderRadius: "999px",
            fontWeight: "900",
            fontSize: "15px",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          },
          absoluteLayout(125 + index * 360, 500, "210px", "52px", 12),
        ),
      ]),
    ],
  },
  {
    id: "section-faq",
    kind: "section",
    tab: "sections",
    category: "faq",
    title: "שאלות נפוצות",
    description: "כותרת וארבע שאלות",
    keywords: ["faq", "שאלות", "תשובות"],
    minHeight: "600px",
    backgroundColor: "#f8fafc",
    nodes: [
      textNode(
        "title",
        "שאלות נפוצות",
        titleStyle,
        absoluteLayout(70, 55, "420px", "70px", 20),
      ),
      textNode(
        "copy",
        "כל מה שחשוב לדעת לפני שמתחילים.",
        copyStyle,
        absoluteLayout(70, 135, "400px", "60px", 20),
      ),
      ...[0, 1, 2, 3].flatMap((index) => [
        boxNode(
          `row-${index}`,
          {
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "18px",
          },
          absoluteLayout(560, 70 + index * 115, "560px", "92px", 5),
          "שאלת FAQ",
        ),
        textNode(
          `question-${index}`,
          [
            "כמה זמן לוקח התהליך?",
            "האם האתר מותאם למובייל?",
            "אפשר לעדכן את התוכן לבד?",
            "איך מקבלים פניות מהאתר?",
          ][index],
          {
            color: "#0f172a",
            fontSize: "18px",
            fontWeight: "900",
          },
          absoluteLayout(595, 98 + index * 115, "430px", "36px", 10),
        ),
        iconNode(
          `plus-${index}`,
          "plus",
          {
            color: "#7c3aed",
            fontSize: "24px",
            fontWeight: "900",
          },
          absoluteLayout(1050, 98 + index * 115, "28px", "28px", 10),
          "פתיחה",
        ),
      ]),
    ],
  },
  {
    id: "section-team",
    kind: "section",
    tab: "sections",
    category: "team",
    title: "צוות",
    description: "שלושה חברי צוות",
    keywords: ["צוות", "אנשים", "team"],
    minHeight: "590px",
    backgroundColor: "#ffffff",
    thumbnail: VISUAL_LIBRARY_IMAGES.team,
    nodes: [
      textNode(
        "title",
        "הכירו את הצוות",
        {
          ...titleStyle,
          textAlign: "center",
        },
        absoluteLayout(370, 45, "460px", "70px", 20),
      ),
      ...[0, 1, 2].flatMap((index) => [
        imageNode(
          `image-${index}`,
          [
            VISUAL_LIBRARY_IMAGES.team,
            VISUAL_LIBRARY_IMAGES.office,
            VISUAL_LIBRARY_IMAGES.abstract,
          ][index],
          {
            borderRadius: "24px",
            objectFit: "cover",
          },
          absoluteLayout(85 + index * 360, 155, "300px", "270px", 10),
          `איש צוות ${index + 1}`,
        ),
        textNode(
          `name-${index}`,
          ["דנה כהן", "יונתן לוי", "נועה ישראלי"][index],
          {
            color: "#0f172a",
            fontSize: "22px",
            fontWeight: "900",
            textAlign: "center",
          },
          absoluteLayout(105 + index * 360, 445, "260px", "38px", 15),
        ),
        textNode(
          `role-${index}`,
          ["מנהלת קריאייטיב", "מנהל פרויקטים", "מעצבת מוצר"][index],
          {
            color: "#64748b",
            fontSize: "15px",
            fontWeight: "700",
            textAlign: "center",
          },
          absoluteLayout(105 + index * 360, 488, "260px", "30px", 15),
        ),
      ]),
    ],
  },
  {
    id: "section-stats",
    kind: "section",
    tab: "sections",
    category: "stats",
    title: "מספרים ונתונים",
    description: "ארבעה נתונים בולטים",
    keywords: ["מספרים", "נתונים", "סטטיסטיקה"],
    minHeight: "340px",
    backgroundColor: "#0f172a",
    nodes: [
      ...[0, 1, 2, 3].flatMap((index) => [
        textNode(
          `number-${index}`,
          ["250+", "98%", "12", "24/7"][index],
          {
            color: "#ffffff",
            fontSize: "48px",
            fontWeight: "900",
            textAlign: "center",
          },
          absoluteLayout(70 + index * 280, 95, "220px", "70px", 20),
        ),
        textNode(
          `label-${index}`,
          ["לקוחות", "שביעות רצון", "שנות ניסיון", "זמינות"][index],
          {
            color: "#94a3b8",
            fontSize: "16px",
            fontWeight: "800",
            textAlign: "center",
          },
          absoluteLayout(70 + index * 280, 180, "220px", "35px", 20),
        ),
      ]),
    ],
  },
  {
    id: "section-video-text",
    kind: "section",
    tab: "sections",
    category: "cta",
    title: "וידאו עם כיתוב",
    description: "וידאו מלא עם שכבות טקסט וכפתור",
    keywords: ["וידאו", "כיתוב", "cta"],
    minHeight: "560px",
    backgroundColor: "#111827",
    nodes: [
      videoNode(
        "video",
        "",
        {
          borderRadius: "0",
          objectFit: "cover",
          backgroundColor: "#111827",
          filter: "brightness(.55)",
        },
        absoluteLayout(0, 0, "100%", "560px", 1),
        "וידאו רקע",
      ),
      textNode(
        "title",
        "הסיפור שלכם ראוי לבמה",
        {
          color: "#ffffff",
          fontSize: "64px",
          fontWeight: "900",
          textAlign: "center",
          textShadow: "0 10px 35px rgba(0,0,0,.4)",
        },
        absoluteLayout(250, 155, "700px", "100px", 20),
      ),
      textNode(
        "copy",
        "הוסיפו סרטון, כיתוב וכפתור שמובילים את המבקר לפעולה.",
        {
          color: "#e2e8f0",
          fontSize: "20px",
          fontWeight: "600",
          textAlign: "center",
        },
        absoluteLayout(330, 285, "540px", "60px", 20),
      ),
      buttonNode(
        "button",
        "צפו עכשיו",
        {
          color: "#0f172a",
          backgroundColor: "#ffffff",
          borderRadius: "999px",
          fontWeight: "900",
          fontSize: "17px",
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        },
        absoluteLayout(510, 380, "180px", "54px", 22),
      ),
    ],
  },
  {
    id: "section-contact",
    kind: "section",
    tab: "sections",
    category: "contact",
    title: "צור קשר",
    description: "פרטי קשר וטופס",
    keywords: ["צור קשר", "טופס", "טלפון", "אימייל"],
    minHeight: "620px",
    backgroundColor: "#f8fafc",
    nodes: [
      textNode(
        "title",
        "בואו נדבר",
        titleStyle,
        absoluteLayout(70, 70, "420px", "80px", 20),
      ),
      textNode(
        "copy",
        "השאירו פרטים ונחזור אליכם בהקדם.",
        copyStyle,
        absoluteLayout(70, 165, "400px", "60px", 20),
      ),
      textNode(
        "phone",
        "☎ 03-0000000",
        {
          color: "#0f172a",
          fontSize: "19px",
          fontWeight: "900",
        },
        absoluteLayout(70, 260, "300px", "40px", 20),
      ),
      textNode(
        "email",
        "✉ hello@example.com",
        {
          color: "#0f172a",
          fontSize: "19px",
          fontWeight: "900",
        },
        absoluteLayout(70, 320, "360px", "40px", 20),
      ),
      boxNode(
        "form-bg",
        {
          backgroundColor: "#ffffff",
          borderRadius: "30px",
          boxShadow: "0 24px 70px rgba(15,23,42,.13)",
        },
        absoluteLayout(580, 60, "500px", "500px", 5),
        "רקע טופס",
      ),
      ...(
        [
          ["name", "שם מלא", "text", 110],
          ["phone-field", "טלפון", "tel", 180],
          ["email-field", "אימייל", "email", 250],
        ] as const
      ).map(([key, placeholder, inputType, y]) => ({
        key,
        type: "form-field" as const,
        label: placeholder,
        tagName: "input",
        content: {
          placeholder,
          inputType,
          name: key,
        },
        style: {
          backgroundColor: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "14px",
          padding: "0 16px",
          fontSize: "16px",
          color: "#0f172a",
        },
        layout: absoluteLayout(625, Number(y), "410px", "54px", 10),
      })),
      {
        key: "message",
        type: "form-field",
        label: "הודעה",
        tagName: "textarea",
        content: {
          placeholder: "הודעה",
          name: "message",
        },
        style: {
          backgroundColor: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "14px",
          padding: "14px 16px",
          fontSize: "16px",
          color: "#0f172a",
          resize: "none",
        },
        layout: absoluteLayout(625, 320, "410px", "110px", 10),
      },
      buttonNode(
        "submit",
        "שליחת פרטים",
        {
          color: "#ffffff",
          backgroundColor: "#7c3aed",
          borderRadius: "14px",
          fontWeight: "900",
          fontSize: "16px",
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        },
        absoluteLayout(625, 455, "410px", "56px", 12),
      ),
    ],
  },
  {
    id: "section-cta-gradient",
    kind: "section",
    tab: "sections",
    category: "cta",
    title: "קריאה לפעולה",
    description: "Gradient, כותרת וכפתור",
    keywords: ["cta", "כפתור", "gradient"],
    minHeight: "360px",
    backgroundColor: "#ffffff",
    previewHtml:
      '<div style="height:120px;border-radius:22px;background:linear-gradient(135deg,#0f172a,#7c3aed);color:white;display:grid;place-items:center;font-size:24px;font-weight:900">מוכנים להתחיל?</div>',
    nodes: [
      boxNode(
        "background",
        {
          backgroundImage:
            "linear-gradient(135deg,#0f172a 0%,#7c3aed 58%,#06b6d4 100%)",
          borderRadius: "36px",
          boxShadow: "0 30px 80px rgba(76,29,149,.24)",
        },
        absoluteLayout(60, 45, "1080px", "270px", 5),
        "רקע CTA",
      ),
      textNode(
        "title",
        "מוכנים להפוך את הרעיון למציאות?",
        {
          color: "#ffffff",
          fontSize: "46px",
          fontWeight: "900",
          textAlign: "center",
        },
        absoluteLayout(250, 100, "700px", "75px", 20),
      ),
      buttonNode(
        "button",
        "דברו איתנו",
        {
          color: "#0f172a",
          backgroundColor: "#ffffff",
          borderRadius: "999px",
          fontWeight: "900",
          fontSize: "17px",
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        },
        absoluteLayout(510, 210, "180px", "54px", 22),
      ),
    ],
  },
  {
    id: "section-footer",
    kind: "section",
    tab: "sections",
    category: "footer",
    title: "Footer מלא",
    description: "לוגו, ניווט ופרטי קשר",
    keywords: ["footer", "תחתית", "ניווט"],
    minHeight: "360px",
    backgroundColor: "#0f172a",
    nodes: [
      textNode(
        "brand",
        "המותג שלי",
        {
          color: "#ffffff",
          fontSize: "30px",
          fontWeight: "900",
        },
        absoluteLayout(70, 65, "260px", "50px", 20),
      ),
      textNode(
        "copy",
        "יוצרים חוויות דיגיטליות שעוזרות לעסקים לצמוח.",
        {
          color: "#94a3b8",
          fontSize: "16px",
          fontWeight: "600",
          lineHeight: "1.65",
        },
        absoluteLayout(70, 135, "330px", "90px", 20),
      ),
      textNode(
        "nav-title",
        "ניווט",
        {
          color: "#ffffff",
          fontSize: "17px",
          fontWeight: "900",
        },
        absoluteLayout(500, 65, "150px", "35px", 20),
      ),
      textNode(
        "nav",
        "ראשי\nאודות\nשירותים\nצור קשר",
        {
          color: "#cbd5e1",
          fontSize: "15px",
          fontWeight: "700",
          lineHeight: "2",
          whiteSpace: "pre-line",
        },
        absoluteLayout(500, 115, "170px", "150px", 20),
      ),
      textNode(
        "contact-title",
        "יצירת קשר",
        {
          color: "#ffffff",
          fontSize: "17px",
          fontWeight: "900",
        },
        absoluteLayout(800, 65, "180px", "35px", 20),
      ),
      textNode(
        "contact",
        "03-0000000\nhello@example.com\nישראל",
        {
          color: "#cbd5e1",
          fontSize: "15px",
          fontWeight: "700",
          lineHeight: "2",
          whiteSpace: "pre-line",
        },
        absoluteLayout(800, 115, "260px", "130px", 20),
      ),
      textNode(
        "copyright",
        "© כל הזכויות שמורות",
        {
          color: "#64748b",
          fontSize: "13px",
          fontWeight: "700",
        },
        absoluteLayout(70, 300, "260px", "30px", 20),
      ),
    ],
  },
];

export const SECTION_LIBRARY: VisualLibrarySectionTemplate[] = [
  ...SECTION_LIBRARY_CORE,
  ...SECTION_LIBRARY_EXTRA,
];

export function getSectionTemplateById(id: string) {
  return SECTION_LIBRARY.find((item) => item.id === id) || null;
}

export function listSectionLibraryIds(): string[] {
  return SECTION_LIBRARY.map((item) => item.id);
}

export function getSectionsByCategory(category: string) {
  if (!category || category === "all") return SECTION_LIBRARY;
  return SECTION_LIBRARY.filter((item) => item.category === category);
}
