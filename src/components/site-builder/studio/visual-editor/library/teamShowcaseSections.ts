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

function team(
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
    category: "team",
    title,
    description: "סקשן צוות מקצועי בקומפוזיציה Editorial ייחודית",
    keywords: ["צוות", "team", "אנשים", "הנהלה", "wix"],
    previewLayout,
    backgroundColor,
    minHeight,
    thumbnail,
    nodes,
  };
}

/** 1 — טריפטיך פורטרטים */
const portraitTriptych = team(
  "section-team-showcase-portrait-triptych",
  "צוות — טריפטיך פורטרטים",
  "team-showcase-portrait-triptych",
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
          String(src),
          {
            borderRadius: index === 1 ? "180px 180px 8px 8px" : "2px",
            objectFit: "cover",
          },
          absoluteLayout(x, 155, "300px", "330px", 10),
          String(name),
        ),
        textNode(
          `name-${index}`,
          String(name),
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
          String(role),
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

/** 2 — רשת 4 עם ביוגרפיות */
const gridBios = team(
  "section-team-showcase-grid-bios",
  "צוות — רשת עם ביוגרפיות",
  "team-showcase-grid-bios",
  "#f3f1ed",
  "680px",
  IMG.office,
  [
    textNode(
      "title",
      "הצוות שלנו",
      {
        color: ink,
        fontSize: "44px",
        fontWeight: "500",
        letterSpacing: "-0.045em",
      },
      absoluteLayout(45, 40, "500px", "55px", 20),
    ),
    textNode(
      "copy",
      "מומחים מעולמות שונים — עובדים יחד כדי ליצור תוצאות מדהימות.",
      { ...body, fontSize: "16px" },
      absoluteLayout(45, 100, "500px", "40px", 20),
    ),
    ...[
      [IMG.portrait, "נועה ל.", "CEO", "15 שנות ניסיון בבניית מותגים"],
      [IMG.team, "אורי כ.", "Strategy", "מוביל פרויקטים מורכבים"],
      [IMG.workspace, "מאיה ב.", "Design", "UX/UI ומערכות עיצוב"],
      [IMG.tech, "דניאל ש.", "Tech", "Full stack וארכיטקטורה"],
    ].flatMap(([src, name, role, bio], index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = 45 + col * 520;
      const y = 170 + row * 240;
      return [
        boxNode(
          `card-${index}`,
          {
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            border: "1px solid rgba(17,19,24,.08)",
          },
          absoluteLayout(x, y, "490px", "220px", 8),
        ),
        imageNode(
          `image-${index}`,
          String(src),
          { borderRadius: "12px", objectFit: "cover" },
          absoluteLayout(x + 20, y + 20, "120px", "120px", 10),
          String(name),
        ),
        textNode(
          `name-${index}`,
          String(name),
          { color: ink, fontSize: "20px", fontWeight: "700" },
          absoluteLayout(x + 160, y + 25, "300px", "28px", 20),
        ),
        textNode(
          `role-${index}`,
          String(role),
          { color: "#8a7359", fontSize: "14px", fontWeight: "600" },
          absoluteLayout(x + 160, y + 55, "300px", "22px", 20),
        ),
        textNode(
          `bio-${index}`,
          String(bio),
          { ...body, fontSize: "14px" },
          absoluteLayout(x + 160, y + 85, "300px", "50px", 20),
        ),
      ];
    }),
  ],
);

/** 3 — ספוטלייט הנהלה */
const leadershipSpotlight = team(
  "section-team-showcase-leadership-spotlight",
  "צוות — ספוטלייט הנהלה",
  "team-showcase-leadership-spotlight",
  "#111318",
  "660px",
  IMG.portrait,
  [
    imageNode(
      "hero",
      IMG.portrait,
      { borderRadius: "6px", objectFit: "cover" },
      absoluteLayout(40, 40, "480px", "580px", 5),
      "מנכ״לית",
    ),
    boxNode(
      "scrim",
      {
        backgroundImage:
          "linear-gradient(180deg, transparent 50%, rgba(17,19,24,.85) 100%)",
        borderRadius: "6px",
      },
      absoluteLayout(40, 40, "480px", "580px", 6),
    ),
    textNode(
      "hero-label",
      "מנכ״לית ומייסדת",
      {
        color: "rgba(255,255,255,.75)",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.14em",
      },
      absoluteLayout(70, 520, "200px", "22px", 20),
    ),
    textNode(
      "hero-name",
      "נועה לוי",
      {
        color: "#ffffff",
        fontSize: "36px",
        fontWeight: "600",
        letterSpacing: "-0.04em",
      },
      absoluteLayout(70, 550, "350px", "45px", 20),
    ),
    textNode(
      "side-title",
      "הנהלה",
      { color: "#ffffff", fontSize: "28px", fontWeight: "600" },
      absoluteLayout(560, 50, "320px", "40px", 20),
    ),
    textNode(
      "side-copy",
      "צוות מנהלים עם ניסיון מוכח — מובילים את החברה לצמיחה בר-קיימא.",
      { color: "rgba(255,255,255,.65)", fontSize: "15px", lineHeight: "1.55" },
      absoluteLayout(560, 100, "460px", "50px", 20),
    ),
    ...[
      [IMG.team, "אורי כהן", "COO · תפעול וצמיחה"],
      [IMG.finance, "מיכל ד.", "CFO · כספים ואסטרטגיה"],
      [IMG.tech, "דניאל ש.", "CTO · טכנולוגיה ומוצר"],
    ].flatMap(([src, name, role], index) => {
      const y = 180 + index * 155;
      return [
        imageNode(
          `side-image-${index}`,
          String(src),
          { borderRadius: "50%", objectFit: "cover" },
          absoluteLayout(560, y, "80px", "80px", 10),
          String(name),
        ),
        textNode(
          `side-name-${index}`,
          String(name),
          { color: "#ffffff", fontSize: "18px", fontWeight: "700" },
          absoluteLayout(660, y + 10, "360px", "28px", 20),
        ),
        textNode(
          `side-role-${index}`,
          String(role),
          { color: "rgba(255,255,255,.55)", fontSize: "14px" },
          absoluteLayout(660, y + 42, "360px", "22px", 20),
        ),
      ];
    }),
  ],
);

/** 4 — שורת אווטארים עגולים */
const circularAvatars = team(
  "section-team-showcase-circular-avatars",
  "צוות — אווטארים עגולים",
  "team-showcase-circular-avatars",
  "#ffffff",
  "520px",
  IMG.team,
  [
    textNode(
      "eyebrow",
      "12 אנשים · 4 מחלקות",
      {
        color: "#777b82",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.14em",
        textAlign: "center",
      },
      absoluteLayout(380, 40, "340px", "22px", 20),
    ),
    textNode(
      "title",
      "הצוות שעושה את הקסם",
      {
        color: ink,
        fontSize: "42px",
        fontWeight: "500",
        letterSpacing: "-0.04em",
        textAlign: "center",
      },
      absoluteLayout(240, 70, "600px", "55px", 20),
    ),
    ...[
      [IMG.portrait, "נועה"],
      [IMG.team, "אורי"],
      [IMG.workspace, "מאיה"],
      [IMG.tech, "דניאל"],
      [IMG.beauty, "שira"],
      [IMG.fitness, "עמית"],
    ].flatMap(([src, name], index) => {
      const x = 90 + index * 160;
      return [
        imageNode(
          `avatar-${index}`,
          String(src),
          { borderRadius: "50%", objectFit: "cover", border: "4px solid #f3f4f6" },
          absoluteLayout(x, 160, "120px", "120px", 10),
          String(name),
        ),
        textNode(
          `name-${index}`,
          String(name),
          {
            color: ink,
            fontSize: "15px",
            fontWeight: "700",
            textAlign: "center",
          },
          absoluteLayout(x - 10, 295, "140px", "24px", 20),
        ),
      ];
    }),
    textNode(
      "copy",
      "מעצבים, מפתחים, אסטרטגים ויועצים — כולם עובדים יחד בשקיפות מלאה.",
      { ...body, fontSize: "16px", textAlign: "center" },
      absoluteLayout(240, 360, "600px", "50px", 20),
    ),
    buttonNode(
      "cta",
      "הצטרפו אלינו",
      button,
      absoluteLayout(455, 440, "170px", "48px", 20),
    ),
  ],
);

/** 5 — סגנון מגזין */
const magazineStyle = team(
  "section-team-showcase-magazine-style",
  "צוות — סגנון מגזין",
  "team-showcase-magazine-style",
  "#faf8f4",
  "700px",
  IMG.interior,
  [
    textNode(
      "eyebrow",
      "Meet the team",
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
      "אנשים\nשמאמינים בעבודה",
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
      "הסטודיו",
    ),
    textNode(
      "main-label",
      "הסטודיו · תל אביב",
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
      ["01", "נועה לוי", "מייסדת · חזון ואסטרטגיה"],
      ["02", "אורי כהן", "שותף · לקוחות וצמיחה"],
      ["03", "מאיה בר", "עיצוב · UX ומוצר"],
      ["04", "דניאל ש.", "טכנולוגיה · פיתוח"],
      ["05", "שira מ.", "תוכן · שיווק ומדיה"],
    ].flatMap(([num, name, role], index) => {
      const y = 75 + index * 105;
      return [
        textNode(
          `num-${index}`,
          num,
          { color: "#c4b8a8", fontSize: "18px", fontWeight: "700" },
          absoluteLayout(600, y, "50px", "28px", 20),
        ),
        textNode(
          `name-${index}`,
          name,
          { color: "#1c1915", fontSize: "22px", fontWeight: "700" },
          absoluteLayout(660, y, "360px", "30px", 20),
        ),
        textNode(
          `role-${index}`,
          role,
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

/** 6 — Full bleed עם overlay */
const fullbleedOverlay = team(
  "section-team-showcase-fullbleed-overlay",
  "צוות — Full Bleed Overlay",
  "team-showcase-fullbleed-overlay",
  "#171717",
  "580px",
  IMG.team,
  [
    imageNode(
      "bg",
      IMG.team,
      {
        borderRadius: "0px",
        objectFit: "cover",
        filter: "brightness(.55) saturate(.85)",
      },
      absoluteLayout(0, 0, "1080px", "580px", 2),
      "צוות",
    ),
    boxNode(
      "shade",
      {
        backgroundImage:
          "linear-gradient(180deg,rgba(9,12,14,.3) 0%,rgba(9,12,14,.88) 100%)",
      },
      absoluteLayout(0, 0, "1080px", "580px", 5),
    ),
    textNode(
      "eyebrow",
      "21 אנשים · 3 משרדים",
      {
        color: "#f5c86f",
        fontSize: "13px",
        fontWeight: "700",
        letterSpacing: "0.15em",
        textAlign: "center",
      },
      absoluteLayout(380, 180, "340px", "26px", 20),
    ),
    textNode(
      "title",
      "יחד אנחנו\nחזקים יותר",
      {
        color: "#ffffff",
        fontSize: "56px",
        fontWeight: "600",
        lineHeight: "0.98",
        letterSpacing: "-0.055em",
        whiteSpace: "pre-line",
        textAlign: "center",
      },
      absoluteLayout(240, 220, "600px", "130px", 20),
    ),
    textNode(
      "copy",
      "צוות מגוון של מומחים — מאמינים בשותפות, שקיפות ותוצאות.",
      {
        color: "#e2e4e5",
        fontSize: "17px",
        lineHeight: "1.65",
        textAlign: "center",
      },
      absoluteLayout(290, 380, "500px", "50px", 20),
    ),
    buttonNode(
      "cta",
      "הכירו את הצוות",
      {
        ...button,
        color: ink,
        backgroundColor: "#f5c86f",
      },
      absoluteLayout(455, 460, "190px", "48px", 22),
    ),
  ],
);

/** 7 — שורות אופקיות עם ביוגרפיה */
const horizontalRows = team(
  "section-team-showcase-horizontal-rows",
  "צוות — שורות אופקיות",
  "team-showcase-horizontal-rows",
  "#f3f4f6",
  "720px",
  IMG.office,
  [
    textNode(
      "title",
      "הצוות המקצועי",
      {
        color: ink,
        fontSize: "42px",
        fontWeight: "600",
        letterSpacing: "-0.04em",
      },
      absoluteLayout(40, 40, "600px", "55px", 20),
    ),
    ...[
      [IMG.legal, "עו״ד מיכל דavid", "יועצת משפטית", "15 שנות ניסיון בדיני תאגידים"],
      [IMG.medical, "Dr. שira כהן", "יועצת רפואית", "רפואת משפחה ומניעה"],
      [IMG.finance, "רון מזרחי", "CFO", "ניהול כספים ואסטרטגיה עסקית"],
      [IMG.education, "יעל אbram", "HR Director", "גיוס, פיתוח ותרבות ארגונית"],
    ].flatMap(([src, name, role, bio], index) => {
      const y = 110 + index * 145;
      return [
        boxNode(
          `row-${index}`,
          { backgroundColor: "#ffffff", borderRadius: "16px" },
          absoluteLayout(40, y, "1000px", "130px", 8),
        ),
        imageNode(
          `image-${index}`,
          String(src),
          { borderRadius: "12px", objectFit: "cover" },
          absoluteLayout(55, y + 15, "100px", "100px", 10),
          String(name),
        ),
        textNode(
          `name-${index}`,
          String(name),
          { color: ink, fontSize: "20px", fontWeight: "700" },
          absoluteLayout(180, y + 25, "400px", "28px", 20),
        ),
        textNode(
          `role-${index}`,
          String(role),
          { color: "#8a7359", fontSize: "14px", fontWeight: "600" },
          absoluteLayout(180, y + 55, "400px", "22px", 20),
        ),
        textNode(
          `bio-${index}`,
          String(bio),
          { ...body, fontSize: "14px" },
          absoluteLayout(180, y + 82, "500px", "30px", 20),
        ),
        buttonNode(
          `cta-${index}`,
          "פרופיל",
          { ...button, backgroundColor: "#eef0f3", color: ink, padding: "10px 18px" },
          absoluteLayout(860, y + 42, "150px", "42px", 20),
        ),
      ];
    }),
  ],
);

/** 8 — היררכיה / org chart */
const orgChart = team(
  "section-team-showcase-org-chart",
  "צוות — היררכיה",
  "team-showcase-org-chart",
  "#f7f3ee",
  "640px",
  IMG.architecture,
  [
    textNode(
      "title",
      "מבנה הצוות",
      {
        color: ink,
        fontSize: "42px",
        fontWeight: "500",
        letterSpacing: "-0.04em",
        textAlign: "center",
      },
      absoluteLayout(290, 35, "500px", "55px", 20),
    ),
    boxNode(
      "ceo-card",
      { backgroundColor: ink, borderRadius: "16px" },
      absoluteLayout(390, 110, "300px", "100px", 8),
    ),
    imageNode(
      "ceo-image",
      IMG.portrait,
      { borderRadius: "50%", objectFit: "cover" },
      absoluteLayout(410, 125, "70px", "70px", 10),
      "CEO",
    ),
    textNode(
      "ceo-name",
      "נועה לוי",
      { color: "#ffffff", fontSize: "18px", fontWeight: "700" },
      absoluteLayout(500, 130, "170px", "28px", 20),
    ),
    textNode(
      "ceo-role",
      "מנכ״לית",
      { color: "rgba(255,255,255,.65)", fontSize: "13px" },
      absoluteLayout(500, 160, "170px", "22px", 20),
    ),
    boxNode(
      "line-v",
      { backgroundColor: "#d6d0c7" },
      absoluteLayout(538, 210, "2px", "60px", 5),
    ),
    boxNode(
      "line-h",
      { backgroundColor: "#d6d0c7" },
      absoluteLayout(200, 270, "680px", "2px", 5),
    ),
    ...[
      [IMG.team, "אורי כ.", "COO", 120],
      [IMG.finance, "מיכל ד.", "CFO", 390],
      [IMG.tech, "דניאל ש.", "CTO", 660],
      [IMG.education, "יעל א.", "HR", 930],
    ].flatMap(([src, name, role, x], index) => [
      boxNode(
        `line-${index}`,
        { backgroundColor: "#d6d0c7" },
        absoluteLayout(Number(x) + 74, 270, "2px", "50px", 5),
      ),
      boxNode(
        `card-${index}`,
        { backgroundColor: "#ffffff", borderRadius: "14px", border: "1px solid #e5e0d8" },
        absoluteLayout(Number(x), 320, "150px", "130px", 8),
      ),
      imageNode(
        `image-${index}`,
        String(src),
        { borderRadius: "50%", objectFit: "cover" },
        absoluteLayout(Number(x) + 40, 335, "70px", "70px", 10),
        String(name),
      ),
      textNode(
        `name-${index}`,
        String(name),
        { color: ink, fontSize: "14px", fontWeight: "700", textAlign: "center" },
        absoluteLayout(Number(x), 415, "150px", "22px", 20),
      ),
      textNode(
        `role-${index}`,
        String(role),
        { color: "#8a7359", fontSize: "12px", fontWeight: "600", textAlign: "center" },
        absoluteLayout(Number(x), 438, "150px", "18px", 20),
      ),
    ]),
    ...[
      [IMG.workspace, "מאיה", "Design", 255],
      [IMG.beauty, "שira", "Marketing", 525],
      [IMG.fitness, "עמית", "Ops", 795],
    ].flatMap(([src, name, role, x], index) => [
      boxNode(
        `dept-line-${index}`,
        { backgroundColor: "#d6d0c7" },
        absoluteLayout(Number(x) + 50, 450, "2px", "40px", 5),
      ),
      boxNode(
        `dept-card-${index}`,
        { backgroundColor: "#faf9f7", borderRadius: "12px", border: "1px solid #eceef1" },
        absoluteLayout(Number(x), 490, "100px", "100px", 8),
      ),
      imageNode(
        `dept-image-${index}`,
        String(src),
        { borderRadius: "50%", objectFit: "cover" },
        absoluteLayout(Number(x) + 15, 505, "70px", "70px", 10),
        String(name),
      ),
      textNode(
        `dept-name-${index}`,
        String(name),
        { color: ink, fontSize: "12px", fontWeight: "700", textAlign: "center" },
        absoluteLayout(Number(x), 575, "100px", "18px", 20),
      ),
      textNode(
        `dept-role-${index}`,
        String(role),
        { color: "#777b82", fontSize: "11px", textAlign: "center" },
        absoluteLayout(Number(x), 593, "100px", "16px", 20),
      ),
    ]),
  ],
);

export const TEAM_SHOWCASE_SECTIONS: VisualLibrarySectionTemplate[] = [
  portraitTriptych,
  gridBios,
  leadershipSpotlight,
  circularAvatars,
  magazineStyle,
  fullbleedOverlay,
  horizontalRows,
  orgChart,
];
