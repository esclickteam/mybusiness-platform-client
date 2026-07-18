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
  color: "#4d535d",
  fontSize: "16px",
  lineHeight: "1.7",
};
const darkButton = {
  color: "#ffffff",
  backgroundColor: ink,
  borderRadius: "999px",
  padding: "12px 24px",
  fontSize: "15px",
  fontWeight: "700",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
};

function about(
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
    description: "סקשן אודות מקצועי בקומפוזיציה Editorial מודרנית",
    keywords: ["אודות", "מי אנחנו", "הסיפור שלנו", "about", "wix"],
    previewLayout,
    backgroundColor,
    minHeight,
    thumbnail,
    nodes,
  };
}

const editorialPortrait = about(
  "section-about-showcase-editorial-portrait",
  "אודות — פורטרט Editorial",
  "about-editorial-portrait",
  "#f3eee7",
  "610px",
  IMG.portrait,
  [
    textNode(
      "eyebrow",
      "הסיפור שלנו · מאז 2014",
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
      "אנשים לפני הכול.\nתוצאות שמדברות.",
      {
        color: "#241f1a",
        fontSize: "64px",
        fontWeight: "600",
        lineHeight: "0.98",
        letterSpacing: "-0.055em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(50, 105, "500px", "150px", 20),
    ),
    textNode(
      "copy",
      "אנחנו סטודיו עצמאי שמחבר בין חשיבה אסטרטגית, עיצוב מדויק ויחסים ארוכי טווח. כל פרויקט מתחיל בהקשבה ומסתיים במשהו שאפשר להיות גאים בו.",
      { ...body, color: "#5d554d", fontSize: "17px" },
      absoluteLayout(55, 300, "430px", "135px", 20),
    ),
    buttonNode(
      "primary",
      "להכיר אותנו",
      { ...darkButton, backgroundColor: "#493b30" },
      absoluteLayout(55, 475, "170px", "48px", 22),
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
      "פורטרט מייסדת",
    ),
    textNode(
      "signature",
      "— נועה, מייסדת",
      {
        color: "#493b30",
        fontSize: "14px",
        fontWeight: "700",
        textAlign: "center",
      },
      absoluteLayout(740, 570, "180px", "24px", 20),
    ),
  ],
);

const minimalBrief = about(
  "section-about-showcase-minimal-brief",
  "אודות — הצהרה מינימלית",
  "about-minimal-brief",
  "#ffffff",
  "390px",
  IMG.architecture,
  [
    boxNode(
      "top-line",
      { backgroundColor: "#d7d9dc" },
      absoluteLayout(45, 42, "1010px", "1px", 5),
    ),
    textNode(
      "label",
      "אודותינו",
      {
        color: "#7b8088",
        fontSize: "13px",
        fontWeight: "700",
        letterSpacing: "0.14em",
      },
      absoluteLayout(50, 78, "190px", "26px", 20),
    ),
    textNode(
      "title",
      "אנחנו הופכים מורכבות\nלרעיון אחד ברור.",
      {
        color: "#101216",
        fontSize: "54px",
        fontWeight: "500",
        lineHeight: "1.03",
        letterSpacing: "-0.055em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(50, 125, "500px", "125px", 20),
    ),
    textNode(
      "copy",
      "הצוות שלנו עובד עם עסקים שאפתניים כדי לבנות מותגים, מוצרים וחוויות שאנשים מבינים מיד וזוכרים לאורך זמן.",
      { ...body, fontSize: "17px" },
      absoluteLayout(650, 125, "380px", "110px", 20),
    ),
    buttonNode(
      "primary",
      "הסיפור המלא",
      darkButton,
      absoluteLayout(870, 275, "160px", "46px", 22),
    ),
    boxNode(
      "bottom-line",
      { backgroundColor: "#d7d9dc" },
      absoluteLayout(45, 345, "1010px", "1px", 5),
    ),
  ],
);

const storyCollage = about(
  "section-about-showcase-story-collage",
  "אודות — הסיפור שלנו",
  "about-story-collage",
  "#eef0e9",
  "620px",
  IMG.interior,
  [
    imageNode(
      "image-main",
      IMG.interior,
      { borderRadius: "2px", objectFit: "cover" },
      absoluteLayout(45, 45, "470px", "500px", 5),
      "הסטודיו שלנו",
    ),
    imageNode(
      "image-detail",
      IMG.workspace,
      {
        border: "10px solid #eef0e9",
        borderRadius: "2px",
        objectFit: "cover",
      },
      absoluteLayout(390, 360, "230px", "205px", 10),
      "פרט מהעבודה",
    ),
    textNode(
      "eyebrow",
      "איך הכול התחיל",
      {
        color: "#66705b",
        fontSize: "13px",
        fontWeight: "700",
        letterSpacing: "0.15em",
      },
      absoluteLayout(665, 75, "300px", "26px", 20),
    ),
    textNode(
      "title",
      "רעיון קטן שגדל\nבדרך הנכונה",
      {
        color: "#1f261b",
        fontSize: "57px",
        fontWeight: "600",
        lineHeight: "1",
        letterSpacing: "-0.055em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(660, 120, "390px", "130px", 20),
    ),
    textNode(
      "copy",
      "התחלנו משולחן אחד, מחברת והרבה סקרנות. היום אנחנו צוות רב־תחומי שעוזר לעסקים לגדול בלי לאבד את מה שהופך אותם למיוחדים.",
      { ...body, color: "#515a49" },
      absoluteLayout(665, 290, "355px", "125px", 20),
    ),
    textNode(
      "quote",
      "״עיצוב טוב לא רק נראה נכון — הוא מרגיש בלתי נמנע.״",
      {
        color: "#293223",
        fontSize: "20px",
        fontWeight: "600",
        lineHeight: "1.5",
      },
      absoluteLayout(665, 455, "355px", "75px", 20),
    ),
  ],
);

const milestones = about(
  "section-about-showcase-milestones",
  "אודות — אבני דרך",
  "about-key-milestones",
  "#f7f5f1",
  "590px",
  IMG.nature,
  [
    imageNode(
      "image",
      IMG.nature,
      { borderRadius: "0px", objectFit: "cover" },
      absoluteLayout(35, 35, "430px", "520px", 5),
      "הדרך שלנו",
    ),
    textNode(
      "eyebrow",
      "המסע שלנו",
      {
        color: "#8a7359",
        fontSize: "13px",
        fontWeight: "700",
        letterSpacing: "0.14em",
      },
      absoluteLayout(535, 45, "230px", "25px", 20),
    ),
    textNode(
      "title",
      "אבני דרך מרכזיות",
      {
        color: "#1d1b18",
        fontSize: "42px",
        fontWeight: "600",
        letterSpacing: "-0.04em",
      },
      absoluteLayout(530, 80, "500px", "60px", 20),
    ),
    ...[
      ["2014", "התחלה צנועה", "הסטודיו נולד מתוך רצון לעשות דברים אחרת."],
      ["2018", "צוות אחד", "צירפנו מומחים מעולמות העיצוב, התוכן והטכנולוגיה."],
      ["2022", "מבט החוצה", "התחלנו לעבוד עם לקוחות ושווקים ברחבי העולם."],
      ["היום", "עדיין סקרנים", "ממשיכים ללמוד, לחדד ולבנות עבודה שיש לה משמעות."],
    ].flatMap(([year, heading, copy], index) => {
      const y = 165 + index * 92;
      return [
        boxNode(
          `line-${index}`,
          { backgroundColor: "#d6d0c7" },
          absoluteLayout(530, y + 72, "520px", "1px", 5),
        ),
        textNode(
          `year-${index}`,
          year,
          { color: "#8a7359", fontSize: "14px", fontWeight: "700" },
          absoluteLayout(535, y, "85px", "28px", 20),
        ),
        textNode(
          `heading-${index}`,
          heading,
          { color: "#1d1b18", fontSize: "18px", fontWeight: "700" },
          absoluteLayout(635, y, "165px", "30px", 20),
        ),
        textNode(
          `copy-${index}`,
          copy,
          { color: "#66615a", fontSize: "13px", lineHeight: "1.45" },
          absoluteLayout(805, y, "240px", "48px", 20),
        ),
      ];
    }),
  ],
);

const teamTriptych = about(
  "section-about-showcase-team-triptych",
  "אודות — האנשים שלנו",
  "about-team-triptych",
  "#ece9e4",
  "610px",
  IMG.team,
  [
    textNode(
      "eyebrow",
      "האנשים שמאחורי העבודה",
      {
        color: "#756d64",
        fontSize: "13px",
        fontWeight: "700",
        letterSpacing: "0.14em",
        textAlign: "center",
      },
      absoluteLayout(350, 35, "400px", "26px", 20),
    ),
    textNode(
      "title",
      "נעים להכיר",
      {
        color: "#1c1a18",
        fontSize: "48px",
        fontWeight: "600",
        letterSpacing: "-0.05em",
        textAlign: "center",
      },
      absoluteLayout(300, 65, "500px", "65px", 20),
    ),
    ...[
      [IMG.portrait, "נועה לוי", "מייסדת ומנהלת קריאייטיב"],
      [IMG.team, "אורי כהן", "אסטרטג ומנהל לקוחות"],
      [IMG.workspace, "מאיה בר", "מעצבת מוצר בכירה"],
    ].flatMap(([src, name, role], index) => {
      const x = 55 + index * 350;
      return [
        imageNode(
          `image-${index}`,
          src,
          {
            borderRadius: index === 1 ? "180px 180px 8px 8px" : "2px",
            objectFit: "cover",
          },
          absoluteLayout(x, 155, "300px", "330px", 10),
          name,
        ),
        textNode(
          `name-${index}`,
          name,
          {
            color: "#1c1a18",
            fontSize: "18px",
            fontWeight: "700",
            textAlign: "center",
          },
          absoluteLayout(x, 505, "300px", "28px", 20),
        ),
        textNode(
          `role-${index}`,
          role,
          {
            color: "#746d65",
            fontSize: "13px",
            textAlign: "center",
          },
          absoluteLayout(x, 538, "300px", "26px", 20),
        ),
      ];
    }),
  ],
);

const missionOrbit = about(
  "section-about-showcase-mission-orbit",
  "אודות — המשימה שלנו",
  "about-mission-orbit",
  "#ffffff",
  "560px",
  IMG.medical,
  [
    textNode(
      "eyebrow",
      "למה אנחנו כאן",
      {
        color: "#5965a8",
        fontSize: "13px",
        fontWeight: "700",
        letterSpacing: "0.14em",
        textAlign: "center",
      },
      absoluteLayout(380, 55, "340px", "26px", 20),
    ),
    textNode(
      "title",
      "המשימה שלנו",
      {
        color: "#111631",
        fontSize: "54px",
        fontWeight: "600",
        letterSpacing: "-0.055em",
        textAlign: "center",
      },
      absoluteLayout(250, 90, "600px", "70px", 20),
    ),
    textNode(
      "copy",
      "להפוך ידע, יצירתיות וטכנולוגיה לפתרונות שמשפרים את היום־יום של אנשים.",
      {
        color: "#5b6075",
        fontSize: "16px",
        lineHeight: "1.6",
        textAlign: "center",
      },
      absoluteLayout(310, 175, "480px", "60px", 20),
    ),
    buttonNode(
      "primary",
      "הגישה שלנו",
      { ...darkButton, backgroundColor: "#26306f" },
      absoluteLayout(465, 245, "170px", "46px", 25),
    ),
    boxNode(
      "orbit",
      {
        border: "1px solid #dfe3f4",
        borderRadius: "50%",
      },
      absoluteLayout(170, 285, "760px", "210px", 2),
    ),
    ...[
      [IMG.medical, 155, 335, -12],
      [IMG.education, 330, 385, 8],
      [IMG.tech, 520, 365, -5],
      [IMG.workspace, 705, 385, 9],
      [IMG.skincare, 870, 330, 13],
    ].map(([src, x, y, rotate], index) =>
      imageNode(
        `image-${index}`,
        String(src),
        {
          borderRadius: "14px",
          objectFit: "cover",
          boxShadow: "0 14px 35px rgba(25,35,80,.15)",
        },
        {
          ...absoluteLayout(Number(x), Number(y), "120px", "125px", 10),
          rotate: Number(rotate),
        },
        "השפעה",
      ),
    ),
  ],
);

const fieldStory = about(
  "section-about-showcase-field-story",
  "אודות — הסיפור מהשטח",
  "about-fullbleed-field-story",
  "#171717",
  "610px",
  IMG.construction,
  [
    imageNode(
      "image",
      IMG.construction,
      {
        borderRadius: "0px",
        objectFit: "cover",
        filter: "brightness(.72) saturate(.88)",
      },
      absoluteLayout(0, 0, "1100px", "610px", 2),
      "הצוות בשטח",
    ),
    boxNode(
      "shade",
      {
        backgroundImage:
          "linear-gradient(90deg,rgba(9,12,14,.94) 0%,rgba(9,12,14,.64) 45%,rgba(9,12,14,.08) 78%)",
      },
      absoluteLayout(0, 0, "1100px", "610px", 5),
    ),
    textNode(
      "eyebrow",
      "מאז 1998 · בונים אמון",
      {
        color: "#f5c86f",
        fontSize: "13px",
        fontWeight: "700",
        letterSpacing: "0.15em",
      },
      absoluteLayout(65, 90, "330px", "26px", 20),
    ),
    textNode(
      "title",
      "מקצוענות שרואים\nבכל פרט.",
      {
        color: "#ffffff",
        fontSize: "64px",
        fontWeight: "600",
        lineHeight: "0.98",
        letterSpacing: "-0.055em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(60, 140, "500px", "145px", 20),
    ),
    textNode(
      "copy",
      "אנחנו מאמינים שעבודה מצוינת מתחילה באחריות. לכן אנחנו מלווים כל פרויקט מקרוב, עומדים במילה שלנו ולא מתפשרים על איכות.",
      {
        color: "#e2e4e5",
        fontSize: "17px",
        lineHeight: "1.65",
      },
      absoluteLayout(65, 330, "430px", "120px", 20),
    ),
    buttonNode(
      "primary",
      "הכירו את החברה",
      {
        ...darkButton,
        color: "#17120a",
        backgroundColor: "#f5c86f",
      },
      absoluteLayout(65, 485, "190px", "48px", 22),
    ),
  ],
);

const numbersGrid = about(
  "section-about-showcase-numbers-grid",
  "אודות — במספרים",
  "about-numbers-editorial-grid",
  "#f1efeb",
  "520px",
  IMG.architecture,
  [
    textNode(
      "eyebrow",
      "קצת עלינו",
      {
        color: "#726a60",
        fontSize: "13px",
        fontWeight: "700",
        letterSpacing: "0.14em",
      },
      absoluteLayout(55, 55, "220px", "26px", 20),
    ),
    textNode(
      "title",
      "המספרים מספרים\nאת הסיפור",
      {
        color: "#181715",
        fontSize: "54px",
        fontWeight: "600",
        lineHeight: "1",
        letterSpacing: "-0.055em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(50, 100, "430px", "125px", 20),
    ),
    textNode(
      "copy",
      "שנים של עבודה עקבית, מערכות יחסים ארוכות ותוצאות שאפשר למדוד.",
      { ...body, color: "#625d56" },
      absoluteLayout(55, 265, "370px", "80px", 20),
    ),
    buttonNode(
      "primary",
      "עוד עלינו",
      darkButton,
      absoluteLayout(55, 385, "150px", "46px", 22),
    ),
    ...[
      ["14", "שנות ניסיון", "ידע שהופך החלטות לטובות יותר"],
      ["90", "לקוחות פעילים", "שותפויות שנבנות לטווח ארוך"],
      ["150", "פרויקטים", "כל אחד עם סיפור ותוצאה משלו"],
      ["21", "אנשי צוות", "מומחים שעובדים יחד, בלי אגו"],
    ].flatMap(([number, label, copy], index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = 535 + col * 260;
      const y = 55 + row * 215;
      return [
        boxNode(
          `card-${index}`,
          {
            backgroundColor: index === 3 ? "#1d1c1a" : "#faf9f7",
            border: "1px solid rgba(24,23,21,.12)",
          },
          absoluteLayout(x, y, "240px", "190px", 5),
        ),
        textNode(
          `number-${index}`,
          number,
          {
            color: index === 3 ? "#ffffff" : "#181715",
            fontSize: "50px",
            fontWeight: "500",
            letterSpacing: "-0.06em",
          },
          absoluteLayout(x + 22, y + 18, "195px", "62px", 20),
        ),
        textNode(
          `label-${index}`,
          label,
          {
            color: index === 3 ? "#ffffff" : "#282622",
            fontSize: "15px",
            fontWeight: "700",
          },
          absoluteLayout(x + 22, y + 92, "195px", "28px", 20),
        ),
        textNode(
          `copy-${index}`,
          copy,
          {
            color: index === 3 ? "#bbb8b2" : "#777169",
            fontSize: "12px",
            lineHeight: "1.45",
          },
          absoluteLayout(x + 22, y + 128, "195px", "42px", 20),
        ),
      ];
    }),
  ],
);

export const ABOUT_SHOWCASE_SECTIONS: VisualLibrarySectionTemplate[] = [
  editorialPortrait,
  minimalBrief,
  storyCollage,
  milestones,
  teamTriptych,
  missionOrbit,
  fieldStory,
  numbersGrid,
];
