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
const muted = "#5a5f66";
const hairline = "rgba(17,19,24,.12)";
const body = {
  color: muted,
  fontSize: "16px",
  lineHeight: "1.7",
};
const darkButton = {
  color: "#ffffff",
  backgroundColor: ink,
  borderRadius: "999px",
  padding: "10px 20px",
  fontSize: "13px",
  fontWeight: "700",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
};

function aboutPage(
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
    category: "about",
    title,
    description: "עמוד אודות מלא בסגנון Wix – קומפוזיציה ייחודית",
    keywords: ["אודות", "עמוד", "about", "page", "wix"],
    previewLayout,
    backgroundColor,
    minHeight,
    thumbnail,
    nodes,
  };
}

/** 1 — פרופיל עסקי Corporate */
const corporatePage = aboutPage(
  "section-about-page-corporate",
  "אודות – פרופיל עסקי",
  "about-page-corporate",
  "#ffffff",
  "1900px",
  IMG.portrait,
  [
    textNode(
      "eyebrow",
      "ABOUT",
      {
        color: "#8a8f96",
        fontSize: "13px",
        fontWeight: "700",
        letterSpacing: "0.18em",
      },
      absoluteLayout(60, 70, "200px", "24px", 20),
    ),
    textNode(
      "title",
      "אודות",
      {
        color: ink,
        fontSize: "72px",
        fontWeight: "500",
        letterSpacing: "-0.055em",
        lineHeight: "1",
      },
      absoluteLayout(55, 105, "420px", "85px", 20),
    ),
    imageNode(
      "portrait",
      IMG.portrait,
      {
        borderRadius: "2px",
        objectFit: "cover",
        objectPosition: "center top",
      },
      absoluteLayout(60, 230, "420px", "420px", 10),
      "פורטרט מקצועי",
    ),
    textNode(
      "bio-eyebrow",
      "המייסדת",
      {
        color: "#8a8f96",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.14em",
      },
      absoluteLayout(540, 250, "480px", "22px", 20),
    ),
    textNode(
      "bio-name",
      "נועה לוי",
      {
        color: ink,
        fontSize: "36px",
        fontWeight: "600",
        letterSpacing: "-0.04em",
      },
      absoluteLayout(540, 285, "480px", "48px", 20),
    ),
    textNode(
      "bio-role",
      "מנהלת קריאייטיב · אסטרטגית מותג",
      {
        color: "#6b7078",
        fontSize: "16px",
        fontWeight: "600",
      },
      absoluteLayout(540, 340, "480px", "28px", 20),
    ),
    textNode(
      "bio-copy",
      "מובילה סטודיו עצמאי שמתמחה בבניית זהות חזותית ומסרים מדויקים לעסקים צומחים. מאמינה שעיצוב טוב מתחיל בהקשבה — ומסתיים בתוצאה שאפשר למדוד.\n\nעם יותר מעשור של ניסיון, עבדתי עם מותגים מקומיים ובינלאומיים במגוון תעשיות: טכנולוגיה, בריאות, מסחר וחינוך.",
      {
        ...body,
        fontSize: "15px",
        whiteSpace: "pre-line",
      },
      absoluteLayout(540, 390, "500px", "220px", 20),
    ),

    textNode(
      "results-title",
      "תוצאות שמדברות",
      {
        color: ink,
        fontSize: "32px",
        fontWeight: "600",
        letterSpacing: "-0.04em",
      },
      absoluteLayout(60, 720, "500px", "48px", 20),
    ),
    textNode(
      "results-copy",
      "רגעים מרכזיים מהדרך — הישגים שמגדירים את מה שאנחנו עושים היום.",
      { ...body, fontSize: "15px" },
      absoluteLayout(60, 780, "620px", "40px", 20),
    ),
    ...[
      [
        "השקת מותג בינלאומי",
        "2023",
        "ליווי מלא של מותג טכנולוגיה מהשקה ראשונה ועד נוכחות בשווקים חדשים.",
      ],
      [
        "צמיחה של 340% בתנועה",
        "2021",
        "עיצוב מחדש של אתר ומשפך תוכן שהכפיל את הפניות האיכותיות תוך שנה.",
      ],
      [
        "פרס עיצוב לאומי",
        "2019",
        "הכרה בעבודת זהות ויזואלית עבור ארגון חינוכי מוביל.",
      ],
    ].flatMap(([heading, date, copy], index) => {
      const y = 860 + index * 110;
      return [
        textNode(
          `result-title-${index}`,
          heading,
          { color: ink, fontSize: "20px", fontWeight: "700" },
          absoluteLayout(60, y, "420px", "30px", 20),
        ),
        textNode(
          `result-date-${index}`,
          date,
          { color: "#8a8f96", fontSize: "14px", fontWeight: "700" },
          absoluteLayout(520, y, "100px", "28px", 20),
        ),
        textNode(
          `result-copy-${index}`,
          copy,
          { color: muted, fontSize: "14px", lineHeight: "1.55" },
          absoluteLayout(640, y, "400px", "55px", 20),
        ),
        boxNode(
          `result-line-${index}`,
          { backgroundColor: hairline },
          absoluteLayout(60, y + 75, "980px", "1px", 5),
        ),
      ];
    }),

    textNode(
      "recog-title",
      "הכרה והישגים",
      {
        color: ink,
        fontSize: "32px",
        fontWeight: "600",
        letterSpacing: "-0.04em",
      },
      absoluteLayout(60, 1220, "500px", "48px", 20),
    ),
    imageNode(
      "recog-image",
      IMG.office,
      {
        borderRadius: "2px",
        objectFit: "cover",
        objectPosition: "center",
      },
      absoluteLayout(60, 1300, "280px", "380px", 10),
      "הכרה מקצועית",
    ),
    ...[
      [
        "איגוד המעצבים בישראל",
        "חברות פעילה ומרצה אורחת בסדנאות עיצוב מותג.",
      ],
      [
        "Awwwards",
        "מועמדות ל־Site of the Day עבור אתר מוצר טכנולוגי.",
      ],
      [
        "Google Partners",
        "שותפות מוסמכת בתחום חוויית משתמש וביצועים.",
      ],
      [
        "Startup Nation Central",
        "ליווי ויזואלי לסטארטאפים בשלבי צמיחה מוקדמים.",
      ],
    ].flatMap(([org, copy], index) => {
      const y = 1300 + index * 95;
      return [
        textNode(
          `org-name-${index}`,
          org,
          { color: ink, fontSize: "18px", fontWeight: "700" },
          absoluteLayout(400, y, "640px", "28px", 20),
        ),
        textNode(
          `org-copy-${index}`,
          copy,
          { color: muted, fontSize: "14px", lineHeight: "1.5" },
          absoluteLayout(400, y + 32, "640px", "40px", 20),
        ),
        boxNode(
          `org-line-${index}`,
          { backgroundColor: hairline },
          absoluteLayout(400, y + 78, "640px", "1px", 5),
        ),
      ];
    }),
  ],
);

/** 2 — על הסטודיו */
const studioPage = aboutPage(
  "section-about-page-studio",
  "אודות – הסטודיו",
  "about-page-studio",
  "#faf9f7",
  "1700px",
  IMG.workspace,
  [
    textNode(
      "eyebrow",
      "ABOUT THE STUDIO",
      {
        color: "#8a847c",
        fontSize: "13px",
        fontWeight: "700",
        letterSpacing: "0.16em",
      },
      absoluteLayout(60, 70, "320px", "24px", 20),
    ),
    textNode(
      "title",
      "על הסטודיו",
      {
        color: "#1b1917",
        fontSize: "64px",
        fontWeight: "600",
        letterSpacing: "-0.055em",
        lineHeight: "1",
      },
      absoluteLayout(55, 110, "600px", "80px", 20),
    ),
    textNode(
      "col-a",
      "אנחנו סטודיו עצמאי שפועל מתל אביב ומשלב אסטרטגיה, עיצוב וטכנולוגיה תחת קורת גג אחת. כל פרויקט נבנה סביב האנשים שמאחורי המותג — לא רק סביב הטרנד של הרגע.",
      { ...body, color: "#5d574f", fontSize: "16px" },
      absoluteLayout(60, 230, "460px", "150px", 20),
    ),
    textNode(
      "col-b",
      "הצוות שלנו מורכב ממעצבים, כותבים ומפתחים שעובדים יחד מהיום הראשון. כך נוצרות חוויות עקביות — מהלוגו ועד האתר, מהמסר ועד המוצר.",
      { ...body, color: "#5d574f", fontSize: "16px" },
      absoluteLayout(580, 230, "460px", "150px", 20),
    ),
    imageNode(
      "hero-image",
      IMG.workspace,
      {
        borderRadius: "2px",
        objectFit: "cover",
        objectPosition: "center",
      },
      absoluteLayout(190, 420, "720px", "340px", 10),
      "חלל הסטודיו",
    ),
    textNode(
      "partners-title",
      "הסמכות ושותפים",
      {
        color: "#1b1917",
        fontSize: "32px",
        fontWeight: "600",
        letterSpacing: "-0.04em",
      },
      absoluteLayout(60, 820, "500px", "48px", 20),
    ),
    textNode(
      "partners-intro",
      "סטנדרטים מקצועיים ושותפויות שמחזקות את היכולת שלנו לספק תוצאות.",
      { ...body, color: "#655f58", fontSize: "15px" },
      absoluteLayout(60, 880, "700px", "40px", 20),
    ),
    ...[
      [
        "ISO 9001",
        "תהליכי איכות מתועדים לכל שלבי הפרויקט — מתכנון ועד מסירה.",
        "שותף מוסמך",
      ],
      [
        "Adobe Partner",
        "גישה לכלים מתקדמים והכשרות שוטפות לצוות העיצוב.",
        "שותף רשמי",
      ],
      [
        "AWS Activate",
        "תשתית ענן יציבה לפרויקטים דיגיטליים בקנה מידה.",
        "שותף טכנולוגי",
      ],
    ].flatMap(([name, desc, label], index) => {
      const x = 60 + index * 340;
      return [
        boxNode(
          `cert-rule-${index}`,
          { backgroundColor: "#1b1917" },
          absoluteLayout(x, 960, "40px", "2px", 5),
        ),
        textNode(
          `cert-name-${index}`,
          name,
          {
            color: "#1b1917",
            fontSize: "22px",
            fontWeight: "700",
            letterSpacing: "-0.02em",
          },
          absoluteLayout(x, 990, "300px", "36px", 20),
        ),
        textNode(
          `cert-desc-${index}`,
          desc,
          { color: "#655f58", fontSize: "14px", lineHeight: "1.55" },
          absoluteLayout(x, 1040, "300px", "90px", 20),
        ),
        textNode(
          `cert-label-${index}`,
          label,
          {
            color: "#8a847c",
            fontSize: "12px",
            fontWeight: "700",
            letterSpacing: "0.1em",
          },
          absoluteLayout(x, 1150, "300px", "24px", 20),
        ),
      ];
    }),
    textNode(
      "closing",
      "מחפשים שותף ארוך־טווח ולא רק ספק? נשמח להכיר.",
      {
        color: "#1b1917",
        fontSize: "20px",
        fontWeight: "600",
        letterSpacing: "-0.02em",
      },
      absoluteLayout(60, 1280, "700px", "40px", 20),
    ),
    buttonNode(
      "cta",
      "דברו איתנו",
      { ...darkButton, backgroundColor: "#1b1917", fontSize: "15px", padding: "14px 28px" },
      absoluteLayout(60, 1350, "170px", "50px", 22),
    ),
  ],
);

/** 3 — חברי צוות 3×3 */
const teamGridPage = aboutPage(
  "section-about-page-team-grid",
  "אודות – חברי צוות",
  "about-page-team-grid",
  "#ffffff",
  "2000px",
  IMG.team,
  [
    textNode(
      "eyebrow",
      "TEAM MEMBERS",
      {
        color: "#8a8f96",
        fontSize: "13px",
        fontWeight: "700",
        letterSpacing: "0.16em",
      },
      absoluteLayout(60, 60, "280px", "24px", 20),
    ),
    textNode(
      "title",
      "הצוות שלנו",
      {
        color: ink,
        fontSize: "58px",
        fontWeight: "600",
        letterSpacing: "-0.05em",
      },
      absoluteLayout(55, 100, "600px", "70px", 20),
    ),
    textNode(
      "intro",
      "תשעה אנשים — מעצבים, אסטרטגים ומפתחים — שעובדים יחד כדי להפוך רעיונות לחוויות מדויקות.",
      { ...body, fontSize: "17px", maxWidth: "640px" },
      absoluteLayout(60, 185, "720px", "55px", 20),
    ),
    ...[
      [IMG.portrait, "center top", "נועה לוי", "מייסדת ומנהלת קריאייטיב"],
      [IMG.team, "center 20%", "אורי כהן", "אסטרטג ומנהל לקוחות"],
      [IMG.office, "left center", "מאיה בר", "מעצבת מוצר בכירה"],
      [IMG.portrait, "center 30%", "דניאל שמש", "מפתח Full Stack"],
      [IMG.team, "right center", "יעל אברהם", "מנהלת תוכן"],
      [IMG.workspace, "center", "רון פרידמן", "מעצב מותג"],
      [IMG.office, "center 40%", "תמר גולן", "מנהלת פרויקטים"],
      [IMG.portrait, "left top", "איתי נחום", "מפתח Frontend"],
      [IMG.team, "center bottom", "שירה כץ", "חוקרת UX"],
    ].flatMap(([src, objectPosition, name, role], index) => {
      const col = index % 3;
      const row = Math.floor(index / 3);
      const x = 60 + col * 340;
      const y = 280 + row * 520;
      return [
        imageNode(
          `member-img-${index}`,
          String(src),
          {
            borderRadius: "2px",
            objectFit: "cover",
            objectPosition: String(objectPosition),
          },
          absoluteLayout(x, y, "300px", "340px", 10),
          String(name),
        ),
        textNode(
          `member-name-${index}`,
          String(name),
          {
            color: ink,
            fontSize: "18px",
            fontWeight: "700",
          },
          absoluteLayout(x, y + 360, "300px", "28px", 20),
        ),
        textNode(
          `member-role-${index}`,
          String(role),
          {
            color: muted,
            fontSize: "14px",
          },
          absoluteLayout(x, y + 390, "300px", "24px", 20),
        ),
        buttonNode(
          `member-li-${index}`,
          "LinkedIn",
          {
            ...darkButton,
            fontSize: "12px",
            padding: "8px 16px",
            borderRadius: "999px",
          },
          absoluteLayout(x, y + 430, "110px", "36px", 22),
        ),
      ];
    }),
  ],
);

/** 4 — משרות פתוחות */
const careersPage = aboutPage(
  "section-about-page-careers",
  "אודות – משרות פתוחות",
  "about-page-careers",
  "#f7f7f5",
  "1650px",
  IMG.office,
  [
    textNode(
      "eyebrow",
      "OPEN POSITIONS",
      {
        color: "#8a8f96",
        fontSize: "13px",
        fontWeight: "700",
        letterSpacing: "0.16em",
      },
      absoluteLayout(60, 70, "280px", "24px", 20),
    ),
    textNode(
      "title",
      "משרות פתוחות",
      {
        color: ink,
        fontSize: "58px",
        fontWeight: "600",
        letterSpacing: "-0.05em",
      },
      absoluteLayout(55, 110, "700px", "70px", 20),
    ),
    textNode(
      "intro",
      "מחפשים אנשים סקרנים, מדויקים ובעלי יוזמה. עבודה היברידית, צוות קטן, והשפעה אמיתית על כל פרויקט.",
      { ...body, fontSize: "16px" },
      absoluteLayout(60, 200, "720px", "55px", 20),
    ),
    ...[
      [
        "מעצבת/מעצב מוצר",
        "עיצוב חוויות דיגיטליות מקצה לקצה — ממחקר משתמשים ועד מערכת עיצוב חיה.",
      ],
      [
        "מפתח/ת Frontend",
        "בניית ממשקים מהירים ונגישים ב־React, עם תשומת לב לפרטים ולביצועים.",
      ],
      [
        "אסטרטג/ית מותג",
        "פיתוח מסרים, מיצוב וסיפור מותג לעסקים בשלבי צמיחה.",
      ],
      [
        "מנהל/ת פרויקטים",
        "ניהול לוחות זמנים, תקשורת מול לקוחות ותיאום בין עיצוב לפיתוח.",
      ],
      [
        "כותב/ת תוכן",
        "כתיבה שיווקית ומוצרית בעברית ובאנגלית — ברורה, חמה ומדויקת.",
      ],
      [
        "מתמחה עיצוב",
        "הזדמנות ללמוד מעבודה אמיתית על פרויקטים חיים, עם ליווי צמוד מהצוות.",
      ],
    ].flatMap(([jobTitle, copy], index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = 60 + col * 520;
      const y = 300 + row * 380;
      return [
        boxNode(
          `job-card-${index}`,
          {
            backgroundColor: "#ffffff",
            border: "1px solid rgba(17,19,24,.08)",
            borderRadius: "4px",
          },
          absoluteLayout(x, y, "480px", "340px", 5),
        ),
        textNode(
          `job-title-${index}`,
          jobTitle,
          {
            color: ink,
            fontSize: "24px",
            fontWeight: "700",
            letterSpacing: "-0.03em",
          },
          absoluteLayout(x + 36, y + 40, "400px", "40px", 20),
        ),
        textNode(
          `job-copy-${index}`,
          copy,
          {
            color: muted,
            fontSize: "15px",
            lineHeight: "1.65",
          },
          absoluteLayout(x + 36, y + 100, "400px", "110px", 20),
        ),
        buttonNode(
          `job-cta-${index}`,
          "הגש מועמדות",
          {
            ...darkButton,
            fontSize: "14px",
            padding: "12px 22px",
          },
          absoluteLayout(x + 36, y + 250, "160px", "46px", 22),
        ),
      ];
    }),
  ],
);

/** 5 — קורות חיים */
const cvPage = aboutPage(
  "section-about-page-cv",
  "אודות – קורות חיים",
  "about-page-cv",
  "#ffffff",
  "1850px",
  IMG.portrait,
  [
    textNode(
      "eyebrow",
      "CURRICULUM VITAE",
      {
        color: "#8a8f96",
        fontSize: "13px",
        fontWeight: "700",
        letterSpacing: "0.18em",
      },
      absoluteLayout(60, 70, "320px", "24px", 20),
    ),
    textNode(
      "title",
      "קורות חיים",
      {
        color: ink,
        fontSize: "64px",
        fontWeight: "500",
        letterSpacing: "-0.055em",
        lineHeight: "1",
      },
      absoluteLayout(55, 110, "600px", "80px", 20),
    ),
    textNode(
      "subtitle",
      "נועה לוי · מעצבת ומנהלת קריאייטיב",
      {
        color: muted,
        fontSize: "18px",
        fontWeight: "500",
      },
      absoluteLayout(60, 205, "500px", "30px", 20),
    ),
    imageNode(
      "portrait-a",
      IMG.portrait,
      {
        borderRadius: "2px",
        objectFit: "cover",
        objectPosition: "center top",
      },
      absoluteLayout(60, 270, "480px", "520px", 10),
      "פורטרט 1",
    ),
    imageNode(
      "portrait-b",
      IMG.team,
      {
        borderRadius: "2px",
        objectFit: "cover",
        objectPosition: "center 25%",
      },
      absoluteLayout(560, 270, "480px", "520px", 10),
      "פורטרט 2",
    ),

    textNode(
      "exp-title",
      "ניסיון מקצועי",
      {
        color: ink,
        fontSize: "28px",
        fontWeight: "600",
        letterSpacing: "-0.03em",
      },
      absoluteLayout(60, 860, "400px", "40px", 20),
    ),
    ...[
      [
        "מנהלת קריאייטיב",
        "Studio North",
        "2021 – היום",
        "הובלת צוות עיצוב ואסטרטגיה, בניית מערכות מותג וליווי לקוחות מפתח מקצה לקצה.",
      ],
      [
        "Senior Product Designer",
        "Monday.com",
        "2018 – 2021",
        "עיצוב מוצרי SaaS מורכבים, מחקר משתמשים ושיתוף פעולה הדוק עם צוותי מוצר ופיתוח.",
      ],
      [
        "מעצבת UX/UI",
        "Fiverr",
        "2015 – 2018",
        "עיצוב חוויות מסחר ופלטפורמה גלובלית, עם דגש על בהירות, נגישות ומהירות.",
      ],
    ].flatMap(([job, company, dates, copy], index) => {
      const y = 930 + index * 150;
      return [
        textNode(
          `exp-job-${index}`,
          job,
          { color: ink, fontSize: "20px", fontWeight: "700" },
          absoluteLayout(60, y, "380px", "30px", 20),
        ),
        textNode(
          `exp-company-${index}`,
          company,
          { color: "#6b7078", fontSize: "15px", fontWeight: "600" },
          absoluteLayout(460, y, "220px", "28px", 20),
        ),
        textNode(
          `exp-dates-${index}`,
          dates,
          { color: "#8a8f96", fontSize: "14px", fontWeight: "700" },
          absoluteLayout(700, y, "340px", "28px", 20),
        ),
        textNode(
          `exp-copy-${index}`,
          copy,
          { color: muted, fontSize: "14px", lineHeight: "1.55" },
          absoluteLayout(60, y + 40, "980px", "50px", 20),
        ),
        boxNode(
          `exp-line-${index}`,
          { backgroundColor: hairline },
          absoluteLayout(60, y + 110, "980px", "1px", 5),
        ),
      ];
    }),

    textNode(
      "edu-title",
      "השכלה",
      {
        color: ink,
        fontSize: "28px",
        fontWeight: "600",
        letterSpacing: "-0.03em",
      },
      absoluteLayout(60, 1410, "400px", "40px", 20),
    ),
    textNode(
      "edu-degree",
      "B.Des · תקשורת חזותית",
      {
        color: ink,
        fontSize: "20px",
        fontWeight: "700",
      },
      absoluteLayout(60, 1470, "500px", "30px", 20),
    ),
    textNode(
      "edu-school",
      "בצלאל אקדמיה לאמנות ועיצוב · 2011 – 2015",
      {
        color: muted,
        fontSize: "15px",
      },
      absoluteLayout(60, 1510, "600px", "28px", 20),
    ),
    textNode(
      "edu-note",
      "התמחות בעיצוב דיגיטלי, טיפוגרפיה ומערכות זהות. פרויקט גמר: פלטפורמת תוכן לעסקים קטנים.",
      {
        color: muted,
        fontSize: "14px",
        lineHeight: "1.55",
      },
      absoluteLayout(60, 1555, "700px", "55px", 20),
    ),
    boxNode(
      "edu-panel",
      {
        backgroundColor: "#f7f7f5",
        borderRadius: "2px",
      },
      absoluteLayout(780, 1410, "260px", "220px", 5),
    ),
    textNode(
      "edu-panel-label",
      "שפות",
      {
        color: "#8a8f96",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.12em",
      },
      absoluteLayout(810, 1445, "200px", "22px", 20),
    ),
    textNode(
      "edu-panel-body",
      "עברית — שפת אם\nאנגלית — רמה גבוהה\nערבית — בסיסית",
      {
        color: ink,
        fontSize: "15px",
        fontWeight: "600",
        lineHeight: "1.8",
        whiteSpace: "pre-line",
      },
      absoluteLayout(810, 1485, "200px", "110px", 20),
    ),
  ],
);

/** 6 — משימה וערכים */
const missionValuesPage = aboutPage(
  "section-about-page-mission-values",
  "אודות – משימה וערכים",
  "about-page-mission-values",
  "#ffffff",
  "2100px",
  IMG.travel,
  [
    textNode(
      "eyebrow",
      "About",
      {
        color: "#8a8680",
        fontSize: "13px",
        fontWeight: "700",
        letterSpacing: "0.16em",
        textAlign: "center",
      },
      absoluteLayout(400, 55, "300px", "24px", 20),
    ),
    textNode(
      "title",
      "אודות",
      {
        color: ink,
        fontSize: "64px",
        fontWeight: "600",
        letterSpacing: "-0.05em",
        textAlign: "center",
      },
      absoluteLayout(300, 90, "500px", "75px", 20),
    ),
    textNode(
      "intro",
      "אנחנו צוות שמתמקד בבהירות, איכות ואמון — ובונה חוויות שמכבדות את העסק ואת האנשים מאחוריו.",
      {
        ...body,
        fontSize: "17px",
        textAlign: "center",
      },
      absoluteLayout(250, 180, "600px", "70px", 20),
    ),
    imageNode(
      "mission-bg",
      IMG.travel,
      {
        borderRadius: "4px",
        objectFit: "cover",
      },
      absoluteLayout(40, 290, "1020px", "420px", 5),
      "רקע המשימה",
    ),
    boxNode(
      "mission-card",
      {
        backgroundColor: "#ffffff",
        borderRadius: "18px",
      },
      absoluteLayout(300, 380, "500px", "250px", 15),
    ),
    textNode(
      "mission-icon",
      "◆",
      {
        color: "#9a9188",
        fontSize: "14px",
        textAlign: "center",
      },
      absoluteLayout(300, 400, "500px", "22px", 20),
    ),
    textNode(
      "mission-eyebrow",
      "Mission",
      {
        color: "#8a8680",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.14em",
        textAlign: "center",
      },
      absoluteLayout(300, 428, "500px", "22px", 20),
    ),
    textNode(
      "mission-title",
      "המשימה שלנו",
      {
        color: ink,
        fontSize: "30px",
        fontWeight: "600",
        letterSpacing: "-0.03em",
        textAlign: "center",
      },
      absoluteLayout(340, 455, "420px", "40px", 20),
    ),
    textNode(
      "mission-copy",
      "ליצור נוכחות דיגיטלית מדויקת, חמה ומקצועית — שעוזרת לעסקים לגדול בלי לאבד את הזהות שלהם.",
      {
        color: muted,
        fontSize: "14px",
        lineHeight: "1.6",
        textAlign: "center",
      },
      absoluteLayout(360, 505, "380px", "60px", 20),
    ),
    buttonNode(
      "mission-cta",
      "בואו נתחיל",
      { ...darkButton, backgroundColor: "#2a2d33" },
      absoluteLayout(455, 575, "190px", "42px", 22),
    ),
    textNode(
      "values-eyebrow",
      "Values",
      {
        color: "#8a8680",
        fontSize: "13px",
        fontWeight: "700",
        letterSpacing: "0.14em",
        textAlign: "center",
      },
      absoluteLayout(400, 780, "300px", "24px", 20),
    ),
    textNode(
      "values-title",
      "הערכים שלנו",
      {
        color: ink,
        fontSize: "42px",
        fontWeight: "600",
        letterSpacing: "-0.04em",
        textAlign: "center",
      },
      absoluteLayout(300, 815, "500px", "55px", 20),
    ),
    ...[
      ["01", "בהירות", "אנחנו מפשטים מורכבות ומדברים בשפה שאפשר לפעול לפיה."],
      ["02", "איכות", "כל פרט נבדק — מהטקסט ועד החוויה הסופית."],
      ["03", "שותפות", "עובדים יחד בשקיפות, כחלק מהצוות שלכם."],
      ["04", "עקביות", "שומרים על שפה ויזואלית ומסר אחיד לאורך הדרך."],
    ].flatMap(([number, heading, copy], index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = 70 + col * 500;
      const y = 900 + row * 200;
      return [
        boxNode(
          `value-card-${index}`,
          {
            backgroundColor: "#f3f2ef",
            borderRadius: "12px",
          },
          absoluteLayout(x, y, "460px", "175px", 5),
        ),
        textNode(
          `value-num-${index}`,
          number,
          {
            color: "#9a9188",
            fontSize: "14px",
            fontWeight: "700",
            letterSpacing: "0.08em",
          },
          absoluteLayout(x + 28, y + 28, "60px", "24px", 20),
        ),
        textNode(
          `value-heading-${index}`,
          heading,
          {
            color: ink,
            fontSize: "22px",
            fontWeight: "700",
          },
          absoluteLayout(x + 28, y + 60, "400px", "32px", 20),
        ),
        textNode(
          `value-copy-${index}`,
          copy,
          {
            color: muted,
            fontSize: "15px",
            lineHeight: "1.55",
          },
          absoluteLayout(x + 28, y + 100, "400px", "50px", 20),
        ),
      ];
    }),
    imageNode(
      "bottom-landscape",
      IMG.architecture,
      {
        borderRadius: "0px",
        objectFit: "cover",
      },
      absoluteLayout(0, 1340, "1100px", "420px", 5),
      "נוף אדריכלי",
    ),
  ],
);

/** 7 — סיפור ויזואלי */
const visualMoodPage = aboutPage(
  "section-about-page-visual-mood",
  "אודות – סיפור ויזואלי",
  "about-page-visual-mood",
  "#f5f4f1",
  "1680px",
  IMG.hospitality,
  [
    imageNode(
      "mood-0",
      IMG.hospitality,
      { borderRadius: "2px", objectFit: "cover" },
      absoluteLayout(30, 30, "510px", "520px", 5),
      "אירוח",
    ),
    imageNode(
      "mood-1",
      IMG.interior,
      { borderRadius: "2px", objectFit: "cover" },
      absoluteLayout(560, 30, "510px", "250px", 5),
      "פנים",
    ),
    imageNode(
      "mood-2",
      IMG.food,
      { borderRadius: "2px", objectFit: "cover" },
      absoluteLayout(560, 300, "250px", "250px", 5),
      "אוכל",
    ),
    imageNode(
      "mood-3",
      IMG.nature,
      { borderRadius: "2px", objectFit: "cover" },
      absoluteLayout(830, 300, "240px", "250px", 5),
      "טבע",
    ),
    textNode(
      "story-title",
      "הסיפור שלנו",
      {
        color: ink,
        fontSize: "48px",
        fontWeight: "600",
        letterSpacing: "-0.045em",
        textAlign: "center",
      },
      absoluteLayout(250, 640, "600px", "60px", 20),
    ),
    textNode(
      "story-copy",
      "המקום נולד מתוך אהבה לפרטים הקטנים — האור הנכון, השולחן המוכן, התחושה שמקבלים כשנכנסים. אנחנו מספרים את הסיפור דרך תמונות, חומרים ורגעים אמיתיים, לא דרך סיסמאות. כל בחירה כאן נועדה ליצור אווירה שקטה, מזמינה ומדויקת.",
      {
        ...body,
        fontSize: "17px",
        textAlign: "center",
      },
      absoluteLayout(200, 720, "700px", "140px", 20),
    ),
    imageNode(
      "mood-wide",
      IMG.workspace,
      {
        borderRadius: "2px",
        objectFit: "cover",
      },
      absoluteLayout(30, 920, "1040px", "420px", 5),
      "אווירה",
    ),
    textNode(
      "mood-caption",
      "רגעים מהיום־יום — פשוטים, אמיתיים ומדויקים.",
      {
        color: "#7a756e",
        fontSize: "14px",
        textAlign: "center",
      },
      absoluteLayout(300, 1370, "500px", "30px", 20),
    ),
  ],
);

/** 8 — פרופיל מקצועי */
const profilePage = aboutPage(
  "section-about-page-profile",
  "אודות – פרופיל מקצועי",
  "about-page-profile",
  "#ffffff",
  "1900px",
  IMG.portrait,
  [
    textNode(
      "eyebrow",
      "Professional Profile",
      {
        color: "#8a8680",
        fontSize: "13px",
        fontWeight: "700",
        letterSpacing: "0.14em",
      },
      absoluteLayout(60, 55, "400px", "24px", 20),
    ),
    textNode(
      "title",
      "פרופיל מקצועי",
      {
        color: ink,
        fontSize: "58px",
        fontWeight: "600",
        letterSpacing: "-0.05em",
      },
      absoluteLayout(55, 95, "700px", "70px", 20),
    ),
    textNode(
      "subtitle",
      "רקע וגישה",
      {
        color: muted,
        fontSize: "18px",
        fontWeight: "500",
      },
      absoluteLayout(60, 175, "300px", "30px", 20),
    ),
    imageNode(
      "hero-photo",
      IMG.office,
      {
        borderRadius: "2px",
        objectFit: "cover",
        objectPosition: "center top",
      },
      absoluteLayout(40, 240, "1020px", "420px", 5),
      "תמונת פרופיל מקצועית",
    ),
    textNode(
      "bio-left",
      "עם יותר מעשור של ניסיון באסטרטגיה, עיצוב ותקשורת, אני מלווה עסקים בבניית נוכחות ברורה ואמינה. העבודה מתחילה בהקשבה — להבין מי אתם, למי אתם פונים, ומה באמת חשוב להעביר.",
      {
        ...body,
        fontSize: "16px",
      },
      absoluteLayout(60, 710, "470px", "160px", 20),
    ),
    textNode(
      "bio-right",
      "הגישה שלי משלבת חשיבה שיווקית עם דיוק ויזואלי: מסר אחד חזק, מבנה נקי, ותמונות שעובדות בשביל המותג. המטרה היא תוצאה שנראית מקצועית ומרגישה אנושית.",
      {
        ...body,
        fontSize: "16px",
      },
      absoluteLayout(570, 710, "470px", "160px", 20),
    ),
    boxNode(
      "skills-rule",
      { backgroundColor: "#e5e2dc" },
      absoluteLayout(60, 910, "980px", "1px", 5),
    ),
    textNode(
      "skills-title",
      "תחומי התמחות",
      {
        color: ink,
        fontSize: "32px",
        fontWeight: "600",
        letterSpacing: "-0.03em",
      },
      absoluteLayout(60, 950, "400px", "45px", 20),
    ),
    ...[
      ["מיתוג ואסטרטגיה", "הגדרת מסר, קול וזהות ויזואלית לעסק."],
      ["עיצוב חוויית משתמש", "מבנים ברורים שמקלים על פעולה והבנה."],
      ["תוכן שיווקי", "טקסטים מדויקים שמדברים בשפה של הלקוח."],
      ["צילום מקצועי", "דימויים שמעבירים אווירה ואמינות."],
      ["ניהול פרויקטים", "תהליך מסודר מהרעיון ועד ההשקה."],
      ["ייעוץ דיגיטלי", "הכוונה פרקטית לצמיחה ארוכת טווח."],
    ].flatMap(([heading, copy], index) => {
      const col = index % 3;
      const row = Math.floor(index / 3);
      const x = 60 + col * 340;
      const y = 1030 + row * 160;
      return [
        textNode(
          `skill-num-${index}`,
          String(index + 1).padStart(2, "0"),
          {
            color: "#a39c94",
            fontSize: "13px",
            fontWeight: "700",
          },
          absoluteLayout(x, y, "60px", "22px", 20),
        ),
        textNode(
          `skill-heading-${index}`,
          heading,
          {
            color: ink,
            fontSize: "18px",
            fontWeight: "700",
          },
          absoluteLayout(x, y + 28, "300px", "28px", 20),
        ),
        textNode(
          `skill-copy-${index}`,
          copy,
          {
            color: muted,
            fontSize: "14px",
            lineHeight: "1.5",
          },
          absoluteLayout(x, y + 65, "300px", "55px", 20),
        ),
      ];
    }),
    buttonNode(
      "profile-cta",
      "לשיחת היכרות",
      { ...darkButton },
      absoluteLayout(60, 1420, "200px", "48px", 22),
    ),
    imageNode(
      "profile-detail",
      IMG.workspace,
      {
        borderRadius: "2px",
        objectFit: "cover",
      },
      absoluteLayout(320, 1400, "720px", "280px", 5),
      "סביבת עבודה",
    ),
  ],
);

/** 9 — על המקום */
const venuePage = aboutPage(
  "section-about-page-venue",
  "אודות – המקום",
  "about-page-venue",
  "#fafafa",
  "1850px",
  IMG.hospitality,
  [
    imageNode(
      "venue-hero",
      IMG.hospitality,
      {
        borderRadius: "0px",
        objectFit: "cover",
      },
      absoluteLayout(0, 0, "1100px", "620px", 5),
      "המקום",
    ),
    boxNode(
      "venue-card",
      {
        backgroundColor: "#ffffff",
        borderRadius: "16px",
      },
      absoluteLayout(275, 200, "550px", "240px", 15),
    ),
    textNode(
      "venue-eyebrow",
      "About the Venue",
      {
        color: "#8a8680",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.14em",
        textAlign: "center",
      },
      absoluteLayout(275, 230, "550px", "22px", 20),
    ),
    textNode(
      "venue-title",
      "על המקום",
      {
        color: ink,
        fontSize: "36px",
        fontWeight: "600",
        letterSpacing: "-0.04em",
        textAlign: "center",
      },
      absoluteLayout(325, 265, "450px", "45px", 20),
    ),
    textNode(
      "venue-copy",
      "מרחב מעוצב בקפידה, עם אור טבעי, חומרים חמים ואווירה שמזמינה להישאר. כאן נפגשים אנשים, רעיונות ורגעים.",
      {
        color: muted,
        fontSize: "15px",
        lineHeight: "1.65",
        textAlign: "center",
      },
      absoluteLayout(345, 325, "410px", "80px", 20),
    ),
    textNode(
      "facilities-title",
      "מתקנים ושירותים",
      {
        color: ink,
        fontSize: "36px",
        fontWeight: "600",
        letterSpacing: "-0.035em",
      },
      absoluteLayout(60, 700, "500px", "50px", 20),
    ),
    textNode(
      "facilities-intro",
      "כל פינה תוכננה כדי לתמוך בחוויה נוחה, מדויקת ומזמינה.",
      {
        ...body,
        fontSize: "15px",
      },
      absoluteLayout(60, 760, "600px", "40px", 20),
    ),
    ...[
      [
        IMG.interior,
        "אולם ראשי",
        "חלל מרווח לאירועים, מפגשים ואירוח — עם תאורה מתכווננת ואקוסטיקה נוחה.",
      ],
      [
        IMG.food,
        "מטבח פתוח",
        "אזור הכנה והגשה מאובזר, המתאים לקייטרינג ולחוויות קולינריות אינטימיות.",
      ],
      [
        IMG.nature,
        "גינה חיצונית",
        "מרפסת ירוקה לקבלת פנים, הפסקות ורגעים שקטים תחת כיפת השמיים.",
      ],
      [
        IMG.workspace,
        "חדר ישיבות",
        "חדר עבודה מאובזר למצגות, ראיונות ופגישות צוות קטנות.",
      ],
    ].flatMap(([src, name, desc], index) => {
      const y = 840 + index * 170;
      return [
        boxNode(
          `facility-rule-${index}`,
          { backgroundColor: "#e4e1db" },
          absoluteLayout(60, y + 140, "980px", "1px", 3),
        ),
        textNode(
          `facility-name-${index}`,
          String(name),
          {
            color: ink,
            fontSize: "20px",
            fontWeight: "700",
          },
          absoluteLayout(60, y + 20, "220px", "35px", 20),
        ),
        textNode(
          `facility-desc-${index}`,
          String(desc),
          {
            color: muted,
            fontSize: "15px",
            lineHeight: "1.55",
          },
          absoluteLayout(300, y + 18, "560px", "90px", 20),
        ),
        imageNode(
          `facility-thumb-${index}`,
          String(src),
          {
            borderRadius: "4px",
            objectFit: "cover",
          },
          absoluteLayout(920, y + 10, "120px", "120px", 10),
          String(name),
        ),
      ];
    }),
  ],
);

/** 10 — נרטיב מלא */
const narrativePage = aboutPage(
  "section-about-page-narrative",
  "אודות – נרטיב מלא",
  "about-page-narrative",
  "#ffffff",
  "2050px",
  IMG.nature,
  [
    imageNode(
      "narrative-hero",
      IMG.nature,
      {
        borderRadius: "0px",
        objectFit: "cover",
        objectPosition: "center 40%",
      },
      absoluteLayout(0, 0, "1100px", "480px", 5),
      "אורח חיים",
    ),
    textNode(
      "story-eyebrow",
      "Our Story",
      {
        color: "#8a8680",
        fontSize: "13px",
        fontWeight: "700",
        letterSpacing: "0.14em",
      },
      absoluteLayout(60, 530, "220px", "24px", 20),
    ),
    textNode(
      "story-title",
      "הסיפור שלנו",
      {
        color: ink,
        fontSize: "48px",
        fontWeight: "700",
        letterSpacing: "-0.045em",
      },
      absoluteLayout(55, 565, "500px", "60px", 20),
    ),
    textNode(
      "story-copy",
      "התחלנו מרצון פשוט: לבנות מקום שמרגיש אמיתי. לא תבנית גנרית, אלא סיפור עם קצב, חום ובהירות. לאורך השנים צמחנו יחד עם הלקוחות שלנו — מפרויקט לפרויקט, מרעיון לתוצאה — תוך שמירה על אותה הקשבה ואותה תשומת לב לפרטים.",
      {
        ...body,
        fontSize: "17px",
      },
      absoluteLayout(60, 640, "980px", "110px", 20),
    ),
    boxNode(
      "vision-rule",
      { backgroundColor: "#e8e5df" },
      absoluteLayout(60, 780, "980px", "1px", 5),
    ),
    textNode(
      "vision-eyebrow",
      "Our Vision",
      {
        color: "#8a8680",
        fontSize: "13px",
        fontWeight: "700",
        letterSpacing: "0.14em",
      },
      absoluteLayout(60, 820, "220px", "24px", 20),
    ),
    textNode(
      "vision-title",
      "החזון שלנו",
      {
        color: ink,
        fontSize: "40px",
        fontWeight: "600",
        letterSpacing: "-0.04em",
      },
      absoluteLayout(55, 855, "400px", "50px", 20),
    ),
    imageNode(
      "vision-image",
      IMG.interior,
      {
        borderRadius: "4px",
        objectFit: "cover",
      },
      absoluteLayout(60, 940, "280px", "280px", 8),
      "חזון",
    ),
    textNode(
      "vision-copy",
      "אנחנו מאמינים שמותג טוב לא צועק — הוא מרגיש נכון. החזון שלנו הוא לעזור לעסקים לבנות נוכחות שקטה וחזקה: עיצוב מדויק, מסר ברור וחוויה שמכבדת את הלקוח. כשהכול מיושר, הצמיחה מגיעה באופן טבעי.",
      {
        ...body,
        fontSize: "17px",
      },
      absoluteLayout(390, 960, "650px", "160px", 20),
    ),
    textNode(
      "vision-note",
      "ממשיכים לבנות לאט, נכון, ולטווח ארוך.",
      {
        color: "#6f6a63",
        fontSize: "15px",
        fontWeight: "600",
      },
      absoluteLayout(390, 1140, "500px", "30px", 20),
    ),
    boxNode(
      "team-rule",
      { backgroundColor: "#e8e5df" },
      absoluteLayout(60, 1280, "980px", "1px", 5),
    ),
    textNode(
      "team-eyebrow",
      "Meet the Team",
      {
        color: "#8a8680",
        fontSize: "13px",
        fontWeight: "700",
        letterSpacing: "0.14em",
        textAlign: "center",
      },
      absoluteLayout(350, 1320, "400px", "24px", 20),
    ),
    textNode(
      "team-title",
      "הכירו את הצוות",
      {
        color: ink,
        fontSize: "40px",
        fontWeight: "600",
        letterSpacing: "-0.04em",
        textAlign: "center",
      },
      absoluteLayout(300, 1355, "500px", "50px", 20),
    ),
    ...[
      [IMG.portrait, "נועה לוי", "מייסדת"],
      [IMG.team, "אורי כהן", "אסטרטגיה"],
      [IMG.workspace, "מאיה בר", "עיצוב"],
    ].flatMap(([src, name, role], index) => {
      const x = 80 + index * 340;
      return [
        imageNode(
          `team-img-${index}`,
          String(src),
          {
            borderRadius: "2px",
            objectFit: "cover",
            objectPosition: "center top",
          },
          absoluteLayout(x, 1450, "300px", "340px", 8),
          String(name),
        ),
        textNode(
          `team-name-${index}`,
          String(name),
          {
            color: ink,
            fontSize: "18px",
            fontWeight: "700",
            textAlign: "center",
          },
          absoluteLayout(x, 1810, "300px", "28px", 20),
        ),
        textNode(
          `team-role-${index}`,
          String(role),
          {
            color: muted,
            fontSize: "14px",
            textAlign: "center",
          },
          absoluteLayout(x, 1842, "300px", "24px", 20),
        ),
      ];
    }),
  ],
);

export const ABOUT_PAGE_SHOWCASE_SECTIONS_PART_A: VisualLibrarySectionTemplate[] = [
  corporatePage,
  studioPage,
  teamGridPage,
  careersPage,
  cvPage,
];

export const ABOUT_PAGE_SHOWCASE_SECTIONS_PART_B: VisualLibrarySectionTemplate[] = [
  missionValuesPage,
  visualMoodPage,
  profilePage,
  venuePage,
  narrativePage,
];

export const ABOUT_PAGE_SHOWCASE_SECTIONS: VisualLibrarySectionTemplate[] = [
  ...ABOUT_PAGE_SHOWCASE_SECTIONS_PART_A,
  ...ABOUT_PAGE_SHOWCASE_SECTIONS_PART_B,
];