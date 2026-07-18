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
  color: "#62666d",
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

function portfolio(
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
    category: "portfolio",
    title,
    description: "פורטפוליו מקצועי בקומפוזיציית גלריה Editorial",
    keywords: ["פורטפוליו", "פרויקטים", "עבודות", "גלריה", "wix"],
    previewLayout,
    backgroundColor,
    minHeight,
    thumbnail,
    nodes,
  };
}

const editorialCatalog = portfolio(
  "section-portfolio-showcase-editorial-catalog",
  "פורטפוליו — קטלוג Editorial",
  "portfolio-showcase-editorial-catalog",
  "#ffffff",
  "760px",
  IMG.fashion,
  [
    textNode(
      "eyebrow",
      "גלריה · עבודות נבחרות",
      {
        color: "#777b82",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.14em",
      },
      absoluteLayout(45, 35, "280px", "24px", 20),
    ),
    textNode(
      "title",
      "העבודה שלנו\nבתמונות",
      {
        color: ink,
        fontSize: "48px",
        fontWeight: "500",
        lineHeight: "1",
        letterSpacing: "-0.055em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(40, 72, "320px", "110px", 20),
    ),
    ...[
      [IMG.fashion, 40, 220, 235, 210, "Identity 01"],
      [IMG.abstract, 320, 105, 245, 210, "Digital 02"],
      [IMG.product, 315, 370, 180, 145, "Object 03"],
      [IMG.portrait, 70, 500, 210, 205, "Portrait 04"],
      [IMG.skincare, 560, 45, 225, 300, "Campaign 05"],
      [IMG.event, 800, 300, 250, 315, "Editorial 06"],
    ].flatMap(([src, x, y, width, height, label], index) => [
      imageNode(
        `image-${index}`,
        String(src),
        { borderRadius: "0px", objectFit: "cover" },
        absoluteLayout(
          Number(x),
          Number(y),
          `${Number(width)}px`,
          `${Number(height)}px`,
          10,
        ),
        String(label),
      ),
      textNode(
        `label-${index}`,
        String(label),
        {
          color: "#373a3f",
          fontSize: "11px",
          fontWeight: "600",
        },
        absoluteLayout(
          Number(x),
          Number(y) + Number(height) + 8,
          `${Number(width)}px`,
          "20px",
          20,
        ),
      ),
    ]),
  ],
);

const transformationGrid = portfolio(
  "section-portfolio-showcase-transformation-grid",
  "פורטפוליו — טרנספורמציות",
  "portfolio-showcase-transformation-grid",
  "#f4f3ef",
  "720px",
  IMG.architecture,
  [
    textNode(
      "eyebrow",
      "לפני ואחרי · תהליך ותוצאה",
      {
        color: "#73746d",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.13em",
        textAlign: "center",
      },
      absoluteLayout(350, 30, "400px", "24px", 20),
    ),
    textNode(
      "title",
      "לראות את השינוי",
      {
        color: "#191b18",
        fontSize: "44px",
        fontWeight: "600",
        letterSpacing: "-0.05em",
        textAlign: "center",
      },
      absoluteLayout(250, 62, "600px", "60px", 20),
    ),
    ...[
      [IMG.nature, "פארק צפון", "תכנון נוף · 2025"],
      [IMG.realestate, "מגדלי העיר", "אדריכלות · 2024"],
      [IMG.architecture, "בית התרבות", "מיתוג חלל · 2025"],
      [IMG.interior, "מלון הגן", "עיצוב פנים · 2024"],
    ].flatMap(([src, title, category], index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = 45 + col * 520;
      const y = 150 + row * 265;
      return [
        imageNode(
          `image-${index}`,
          src,
          { borderRadius: "2px", objectFit: "cover" },
          absoluteLayout(x, y, "490px", "190px", 10),
          title,
        ),
        textNode(
          `title-${index}`,
          title,
          { color: "#1c1e1b", fontSize: "16px", fontWeight: "700" },
          absoluteLayout(x, y + 202, "290px", "26px", 20),
        ),
        textNode(
          `category-${index}`,
          category,
          {
            color: "#797a74",
            fontSize: "11px",
            textAlign: "left",
          },
          absoluteLayout(x + 290, y + 204, "200px", "22px", 20),
        ),
      ];
    }),
  ],
);

const magazineHighlights = portfolio(
  "section-portfolio-showcase-magazine-highlights",
  "פורטפוליו — מגזין פרויקטים",
  "portfolio-showcase-magazine-highlights",
  "#ffffff",
  "680px",
  IMG.abstract,
  [
    textNode(
      "eyebrow",
      "העבודות שלנו",
      {
        color: "#7b6d5e",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.14em",
      },
      absoluteLayout(45, 42, "230px", "24px", 20),
    ),
    textNode(
      "title",
      "פרויקטים שנשארים\nבראש",
      {
        color: "#171513",
        fontSize: "52px",
        fontWeight: "600",
        lineHeight: "1",
        letterSpacing: "-0.055em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(40, 78, "450px", "115px", 20),
    ),
    textNode(
      "copy",
      "בחירה של עבודות שמחברות בין רעיון חד, שפה חזותית ותוצאה עסקית.",
      { ...body, color: "#716960", fontSize: "15px" },
      absoluteLayout(640, 95, "375px", "65px", 20),
    ),
    buttonNode(
      "primary",
      "לכל הפרויקטים",
      button,
      absoluteLayout(870, 172, "150px", "44px", 22),
    ),
    imageNode(
      "hero-image",
      IMG.abstract,
      { borderRadius: "2px", objectFit: "cover" },
      absoluteLayout(45, 245, "470px", "350px", 10),
      "פרויקט מוביל",
    ),
    textNode(
      "hero-title",
      "Signal / זהות בתנועה",
      {
        color: "#171513",
        fontSize: "18px",
        fontWeight: "700",
      },
      absoluteLayout(45, 610, "470px", "28px", 20),
    ),
    ...[
      [IMG.fashion, "Mira", "קמפיין אופנה"],
      [IMG.product, "Mono", "עיצוב מוצר"],
      [IMG.hospitality, "North", "חוויית אירוח"],
      [IMG.tech, "Pulse", "מותג טכנולוגי"],
    ].flatMap(([src, title, category], index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = 555 + col * 255;
      const y = 245 + row * 195;
      return [
        imageNode(
          `image-${index}`,
          src,
          { borderRadius: "2px", objectFit: "cover" },
          absoluteLayout(x, y, "225px", "130px", 10),
          title,
        ),
        textNode(
          `title-${index}`,
          `${title} · ${category}`,
          { color: "#37332f", fontSize: "12px", fontWeight: "600" },
          absoluteLayout(x, y + 140, "225px", "22px", 20),
        ),
      ];
    }),
  ],
);

const beforeAfter = portfolio(
  "section-portfolio-showcase-before-after",
  "פורטפוליו — לפני ואחרי",
  "portfolio-showcase-before-after",
  "#f7f2ed",
  "590px",
  IMG.skincare,
  [
    textNode(
      "eyebrow",
      "Case Study · Beauty",
      {
        color: "#9b6f62",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.14em",
        textAlign: "center",
      },
      absoluteLayout(360, 35, "380px", "24px", 20),
    ),
    textNode(
      "title",
      "לפני ואחרי",
      {
        color: "#2b1d1a",
        fontSize: "45px",
        fontWeight: "600",
        letterSpacing: "-0.05em",
        textAlign: "center",
      },
      absoluteLayout(300, 68, "500px", "60px", 20),
    ),
    textNode(
      "copy",
      "אותו מותג. נוכחות חדשה לגמרי.",
      {
        color: "#80665e",
        fontSize: "15px",
        textAlign: "center",
      },
      absoluteLayout(300, 130, "500px", "30px", 20),
    ),
    imageNode(
      "before",
      IMG.portrait,
      {
        borderRadius: "22px 0 0 22px",
        objectFit: "cover",
        filter: "saturate(.55) brightness(.92)",
      },
      absoluteLayout(75, 195, "475px", "315px", 10),
      "לפני",
    ),
    imageNode(
      "after",
      IMG.skincare,
      {
        borderRadius: "0 22px 22px 0",
        objectFit: "cover",
      },
      absoluteLayout(550, 195, "475px", "315px", 10),
      "אחרי",
    ),
    textNode(
      "before-label",
      "לפני",
      {
        color: "#ffffff",
        backgroundColor: "rgba(25,18,16,.72)",
        borderRadius: "999px",
        padding: "8px 16px",
        fontSize: "12px",
        fontWeight: "700",
        textAlign: "center",
      },
      absoluteLayout(95, 215, "75px", "34px", 20),
    ),
    textNode(
      "after-label",
      "אחרי",
      {
        color: "#2b1d1a",
        backgroundColor: "#ffffff",
        borderRadius: "999px",
        padding: "8px 16px",
        fontSize: "12px",
        fontWeight: "700",
        textAlign: "center",
      },
      absoluteLayout(930, 215, "75px", "34px", 20),
    ),
  ],
);

const caseStudyFeature = portfolio(
  "section-portfolio-showcase-case-study-feature",
  "פורטפוליו — Case Study",
  "portfolio-showcase-case-study-feature",
  "#f5f3ef",
  "650px",
  IMG.architecture,
  [
    textNode(
      "title",
      "CASE STUDIES",
      {
        color: "#111111",
        fontSize: "72px",
        fontWeight: "500",
        letterSpacing: "-0.065em",
        textAlign: "left",
      },
      absoluteLayout(45, 25, "760px", "90px", 20),
    ),
    textNode(
      "index",
      "01 / 04",
      {
        color: "#6f706d",
        fontSize: "12px",
        textAlign: "left",
      },
      absoluteLayout(920, 65, "130px", "22px", 20),
    ),
    boxNode(
      "rule",
      { backgroundColor: "#bdbdb8" },
      absoluteLayout(45, 125, "1010px", "1px", 5),
    ),
    imageNode(
      "image",
      IMG.architecture,
      { borderRadius: "0px", objectFit: "cover" },
      absoluteLayout(45, 165, "590px", "410px", 10),
      "פרויקט Arc House",
    ),
    textNode(
      "eyebrow",
      "מיתוג · אדריכלות · דיגיטל",
      {
        color: "#737570",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.1em",
      },
      absoluteLayout(690, 180, "330px", "25px", 20),
    ),
    textNode(
      "project-title",
      "Arc House",
      {
        color: "#151614",
        fontSize: "46px",
        fontWeight: "600",
        letterSpacing: "-0.05em",
      },
      absoluteLayout(685, 220, "350px", "60px", 20),
    ),
    textNode(
      "copy",
      "איך הפכנו מתחם מגורים חדש למותג שמרגיש שקט, מדויק ובטוח — מהאסטרטגיה ועד חוויית המכירה.",
      { ...body, color: "#62645f", fontSize: "15px" },
      absoluteLayout(690, 305, "330px", "105px", 20),
    ),
    textNode(
      "stat",
      "+38%",
      {
        color: "#151614",
        fontSize: "36px",
        fontWeight: "600",
      },
      absoluteLayout(690, 440, "130px", "50px", 20),
    ),
    textNode(
      "stat-label",
      "עלייה בפניות איכותיות",
      { color: "#74766f", fontSize: "12px" },
      absoluteLayout(690, 490, "180px", "24px", 20),
    ),
    buttonNode(
      "primary",
      "לצפייה בפרויקט",
      button,
      absoluteLayout(865, 530, "170px", "44px", 22),
    ),
  ],
);

const closerLook = portfolio(
  "section-portfolio-showcase-closer-look",
  "פורטפוליו — מבט מקרוב",
  "portfolio-showcase-closer-look",
  "#eef0ea",
  "520px",
  IMG.product,
  [
    textNode(
      "eyebrow",
      "אובייקטים · חומרים · פרטים",
      {
        color: "#72786c",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.13em",
      },
      absoluteLayout(45, 35, "310px", "24px", 20),
    ),
    textNode(
      "title",
      "מבט מקרוב",
      {
        color: "#171a15",
        fontSize: "45px",
        fontWeight: "600",
        letterSpacing: "-0.05em",
      },
      absoluteLayout(40, 68, "420px", "58px", 20),
    ),
    textNode(
      "copy",
      "פרטים קטנים שמחזיקים רעיון גדול.",
      { color: "#666c61", fontSize: "14px" },
      absoluteLayout(750, 85, "300px", "30px", 20),
    ),
    ...[
      [IMG.portrait, "תהליך", 45, 160, 235, 290],
      [IMG.skincare, "אריזה", 300, 160, 235, 210],
      [IMG.product, "חומר", 555, 160, 235, 290],
      [IMG.tech, "מערכת", 810, 160, 245, 210],
    ].flatMap(([src, label, x, y, width, height], index) => [
      imageNode(
        `image-${index}`,
        String(src),
        { borderRadius: "3px", objectFit: "cover" },
        absoluteLayout(
          Number(x),
          Number(y),
          `${Number(width)}px`,
          `${Number(height)}px`,
          10,
        ),
        String(label),
      ),
      textNode(
        `label-${index}`,
        String(label),
        {
          color: "#3c4039",
          fontSize: "12px",
          fontWeight: "600",
        },
        absoluteLayout(
          Number(x),
          Number(y) + Number(height) + 9,
          `${Number(width)}px`,
          "22px",
          20,
        ),
      ),
    ]),
  ],
);

const threeProjects = portfolio(
  "section-portfolio-showcase-three-projects",
  "פורטפוליו — שלושה פרויקטים",
  "portfolio-showcase-three-projects",
  "#f6f3ee",
  "580px",
  IMG.interior,
  [
    textNode(
      "eyebrow",
      "בחירה מהתיק",
      {
        color: "#7c7165",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.14em",
        textAlign: "center",
      },
      absoluteLayout(380, 30, "340px", "24px", 20),
    ),
    textNode(
      "title",
      "שלושה סיפורים. שלוש תוצאות.",
      {
        color: "#1b1815",
        fontSize: "42px",
        fontWeight: "600",
        letterSpacing: "-0.045em",
        textAlign: "center",
      },
      absoluteLayout(200, 62, "700px", "56px", 20),
    ),
    ...[
      [IMG.interior, "Atelier 17", "עיצוב פנים"],
      [IMG.hospitality, "Casa Norte", "אירוח ומיתוג"],
      [IMG.fashion, "Studio M", "אופנה וקמפיין"],
    ].flatMap(([src, title, category], index) => {
      const x = 45 + index * 350;
      return [
        imageNode(
          `image-${index}`,
          src,
          {
            borderRadius: index === 1 ? "180px 180px 4px 4px" : "4px",
            objectFit: "cover",
          },
          absoluteLayout(x, 155, "310px", "315px", 10),
          title,
        ),
        textNode(
          `title-${index}`,
          title,
          {
            color: "#1b1815",
            fontSize: "18px",
            fontWeight: "700",
            textAlign: "center",
          },
          absoluteLayout(x, 490, "310px", "28px", 20),
        ),
        textNode(
          `category-${index}`,
          category,
          {
            color: "#80776d",
            fontSize: "12px",
            textAlign: "center",
          },
          absoluteLayout(x, 523, "310px", "22px", 20),
        ),
      ];
    }),
  ],
);

const darkMasonry = portfolio(
  "section-portfolio-showcase-dark-masonry",
  "פורטפוליו — Masonry כהה",
  "portfolio-showcase-dark-masonry",
  "#121416",
  "700px",
  IMG.tech,
  [
    textNode(
      "eyebrow",
      "SELECTED WORK · 2024—2026",
      {
        color: "#a6abb1",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.14em",
      },
      absoluteLayout(45, 38, "340px", "24px", 20),
    ),
    textNode(
      "title",
      "עבודות נבחרות",
      {
        color: "#ffffff",
        fontSize: "52px",
        fontWeight: "600",
        letterSpacing: "-0.055em",
      },
      absoluteLayout(40, 72, "500px", "68px", 20),
    ),
    buttonNode(
      "primary",
      "לכל תיק העבודות",
      {
        ...button,
        color: "#111318",
        backgroundColor: "#ffffff",
      },
      absoluteLayout(865, 80, "185px", "44px", 22),
    ),
    ...[
      [IMG.tech, 45, 175, 410, 210, "Nova Systems"],
      [IMG.abstract, 475, 175, 245, 330, "Fluid Identity"],
      [IMG.fashion, 740, 175, 315, 210, "Edition No. 4"],
      [IMG.architecture, 45, 405, 410, 225, "Common Ground"],
      [IMG.product, 740, 405, 315, 225, "Object Study"],
    ].flatMap(([src, x, y, width, height, label], index) => [
      imageNode(
        `image-${index}`,
        String(src),
        {
          borderRadius: "3px",
          objectFit: "cover",
          opacity: "0.92",
        },
        absoluteLayout(
          Number(x),
          Number(y),
          `${Number(width)}px`,
          `${Number(height)}px`,
          10,
        ),
        String(label),
      ),
      textNode(
        `label-${index}`,
        String(label),
        {
          color: "#ffffff",
          backgroundColor: "rgba(10,12,14,.72)",
          borderRadius: "999px",
          padding: "6px 11px",
          fontSize: "10px",
          fontWeight: "600",
        },
        absoluteLayout(
          Number(x) + 14,
          Number(y) + Number(height) - 38,
          "130px",
          "26px",
          20,
        ),
      ),
    ]),
  ],
);

export const PORTFOLIO_SHOWCASE_SECTIONS: VisualLibrarySectionTemplate[] = [
  editorialCatalog,
  transformationGrid,
  magazineHighlights,
  beforeAfter,
  caseStudyFeature,
  closerLook,
  threeProjects,
  darkMasonry,
];
