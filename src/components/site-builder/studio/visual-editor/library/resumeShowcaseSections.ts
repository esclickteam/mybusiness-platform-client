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

function resume(
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
    category: "resume",
    title,
    description: "סקשן קורות חיים מקצועי בקומפוזיציה Editorial מודרנית",
    keywords: ["קורות חיים", "resume", "CV", "ניסיון", "wix"],
    previewLayout,
    backgroundColor,
    minHeight,
    thumbnail,
    nodes,
  };
}

/** 1 — פורטרט Editorial + ניסיון */
const editorialPortrait = resume(
  "section-resume-showcase-editorial-portrait",
  "קורות חיים — פורטרט Editorial",
  "resume-showcase-editorial-portrait",
  "#f3eee7",
  "680px",
  IMG.portrait,
  [
    textNode(
      "eyebrow",
      "מעצבת מוצר · 8 שנות ניסיון",
      {
        color: "#79695a",
        fontSize: "13px",
        fontWeight: "700",
        letterSpacing: "0.14em",
      },
      absoluteLayout(55, 55, "380px", "25px", 20),
    ),
    textNode(
      "title",
      "נועה לוי",
      {
        color: "#241f1a",
        fontSize: "64px",
        fontWeight: "600",
        lineHeight: "0.98",
        letterSpacing: "-0.055em",
      },
      absoluteLayout(50, 100, "500px", "80px", 20),
    ),
    textNode(
      "subtitle",
      "מעצבת UX/UI · Tel Aviv",
      { ...body, color: "#5d554d", fontSize: "17px" },
      absoluteLayout(55, 195, "430px", "30px", 20),
    ),
    textNode(
      "copy",
      "מעצבת מוצר עם תשוקה לחוויות דיגיטליות שמרגישות טבעיות. מובילה פרויקטים מקצה לקצה — מאסטרטגיה ועד ממשק מדויק.",
      { ...body, color: "#5d554d", fontSize: "16px" },
      absoluteLayout(55, 240, "430px", "100px", 20),
    ),
    buttonNode(
      "primary",
      "הורדת CV",
      { ...darkButton, backgroundColor: "#493b30" },
      absoluteLayout(55, 370, "160px", "48px", 22),
    ),
    buttonNode(
      "secondary",
      "LinkedIn",
      {
        ...darkButton,
        backgroundColor: "transparent",
        color: "#493b30",
        border: "2px solid #493b30",
      },
      absoluteLayout(230, 370, "140px", "48px", 22),
    ),
    imageNode(
      "portrait",
      IMG.portrait,
      {
        borderRadius: "220px 220px 18px 18px",
        objectFit: "cover",
        objectPosition: "center top",
      },
      absoluteLayout(635, 45, "380px", "590px", 10),
      "תמונת פרופיל",
    ),
    ...[
      ["2022–היום", "Lead Designer", "Wix · מובילה צוות של 4 מעצבים"],
      ["2019–2022", "Senior UX", "Monday.com · מערכות SaaS"],
      ["2017–2019", "Product Designer", "Fiverr · חוויית משתמש"],
    ].flatMap(([period, role, company], index) => {
      const y = 460 + index * 65;
      return [
        textNode(
          `period-${index}`,
          period,
          { color: "#9a8b7b", fontSize: "13px", fontWeight: "700" },
          absoluteLayout(55, y, "120px", "22px", 20),
        ),
        textNode(
          `role-${index}`,
          role,
          { color: ink, fontSize: "16px", fontWeight: "700" },
          absoluteLayout(180, y, "200px", "24px", 20),
        ),
        textNode(
          `company-${index}`,
          company,
          { ...body, fontSize: "14px" },
          absoluteLayout(180, y + 26, "350px", "24px", 20),
        ),
      ];
    }),
  ],
);

/** 2 — רשת מיומנויות + ציר זמן */
const skillsTimeline = resume(
  "section-resume-showcase-skills-timeline",
  "קורות חיים — מיומנויות וציר זמן",
  "resume-showcase-skills-timeline",
  "#f3f1ed",
  "660px",
  IMG.workspace,
  [
    textNode(
      "title",
      "אורי כהן",
      {
        color: "#1b1917",
        fontSize: "48px",
        fontWeight: "600",
        letterSpacing: "-0.05em",
      },
      absoluteLayout(45, 45, "500px", "60px", 20),
    ),
    textNode(
      "role",
      "Full Stack Developer",
      { color: "#655f58", fontSize: "18px", fontWeight: "600" },
      absoluteLayout(45, 110, "400px", "28px", 20),
    ),
    textNode(
      "skills-title",
      "מיומנויות",
      { color: "#74695d", fontSize: "13px", fontWeight: "700", letterSpacing: "0.14em" },
      absoluteLayout(45, 165, "200px", "22px", 20),
    ),
    ...[
      ["React", "TypeScript", "Node.js"],
      ["PostgreSQL", "AWS", "Docker"],
      ["GraphQL", "CI/CD", "Agile"],
    ].flatMap((row, rowIndex) =>
      row.flatMap((skill, colIndex) =>
        textNode(
          `skill-${rowIndex}-${colIndex}`,
          skill,
          {
            color: ink,
            fontSize: "13px",
            fontWeight: "600",
            backgroundColor: "#ffffff",
            border: "1px solid rgba(27,25,23,.10)",
            borderRadius: "999px",
            padding: "8px 16px",
          },
          absoluteLayout(45 + colIndex * 130, 200 + rowIndex * 48, "120px", "36px", 20),
        ),
      ),
    ),
    textNode(
      "timeline-title",
      "ניסיון מקצועי",
      { color: "#74695d", fontSize: "13px", fontWeight: "700", letterSpacing: "0.14em" },
      absoluteLayout(540, 45, "200px", "22px", 20),
    ),
    ...[
      ["2021–היום", "Tech Lead", "בניית פלטפורמת SaaS מ-0"],
      ["2018–2021", "Senior Dev", "מערכות e-commerce בקנה מידה"],
      ["2015–2018", "Developer", "אפליקציות מובייל ו-web"],
    ].flatMap(([year, title, copy], index) => {
      const y = 85 + index * 175;
      return [
        boxNode(
          `dot-${index}`,
          { backgroundColor: ink, borderRadius: "50%" },
          absoluteLayout(540, y + 8, "12px", "12px", 10),
        ),
        boxNode(
          `line-${index}`,
          { backgroundColor: "#d6d0c7" },
          absoluteLayout(545, y + 20, "2px", "155px", 5),
        ),
        textNode(
          `year-${index}`,
          year,
          { color: "#8a7359", fontSize: "14px", fontWeight: "700" },
          absoluteLayout(570, y, "120px", "22px", 20),
        ),
        textNode(
          `job-${index}`,
          title,
          { color: ink, fontSize: "20px", fontWeight: "700" },
          absoluteLayout(570, y + 28, "300px", "28px", 20),
        ),
        textNode(
          `copy-${index}`,
          copy,
          { ...body, fontSize: "14px" },
          absoluteLayout(570, y + 60, "450px", "50px", 20),
        ),
        imageNode(
          `image-${index}`,
          [IMG.tech, IMG.office, IMG.education][index],
          { borderRadius: "8px", objectFit: "cover" },
          absoluteLayout(570, y + 120, "200px", "50px", 8),
          title,
        ),
      ];
    }),
  ],
);

/** 3 — מינימלי ממורכז */
const minimalCentered = resume(
  "section-resume-showcase-minimal-centered",
  "קורות חיים — מינימלי ממורכז",
  "resume-showcase-minimal-centered",
  "#ffffff",
  "580px",
  IMG.abstract,
  [
    textNode(
      "name",
      "מאיה בר",
      {
        color: ink,
        fontSize: "56px",
        fontWeight: "500",
        letterSpacing: "-0.05em",
        textAlign: "center",
      },
      absoluteLayout(290, 60, "500px", "70px", 20),
    ),
    textNode(
      "role",
      "Creative Director · Brand Strategist",
      {
        color: "#777b82",
        fontSize: "16px",
        fontWeight: "600",
        textAlign: "center",
      },
      absoluteLayout(290, 140, "500px", "28px", 20),
    ),
    boxNode(
      "divider",
      { backgroundColor: ink },
      absoluteLayout(490, 190, "100px", "2px", 10),
    ),
    textNode(
      "summary",
      "15 שנות ניסיון בבניית מותגים, קמפיינים וחוויות דיגיטליות. עובדת עם סטארטאפים וארגונים גדולים — מאסטרטגיה ועד ביצוע.",
      {
        ...body,
        fontSize: "17px",
        textAlign: "center",
        lineHeight: "1.65",
      },
      absoluteLayout(240, 220, "600px", "90px", 20),
    ),
    ...[
      ["2019–היום", "Creative Director", "Brand Studio TLV"],
      ["2014–2019", "Art Director", "McCann Israel"],
      ["2010–2014", "Designer", "Freelance"],
    ].flatMap(([period, title, org], index) => {
      const y = 340 + index * 70;
      return [
        textNode(
          `period-${index}`,
          period,
          { color: "#b8bcc3", fontSize: "14px", fontWeight: "600", textAlign: "center" },
          absoluteLayout(240, y, "600px", "22px", 20),
        ),
        textNode(
          `title-${index}`,
          `${title} · ${org}`,
          { color: ink, fontSize: "18px", fontWeight: "700", textAlign: "center" },
          absoluteLayout(240, y + 28, "600px", "28px", 20),
        ),
      ];
    }),
    buttonNode(
      "cta",
      "צור קשר",
      darkButton,
      absoluteLayout(455, 560, "170px", "48px", 22),
    ),
  ],
);

/** 4 — שני טורים */
const twoColumn = resume(
  "section-resume-showcase-two-column",
  "קורות חיים — שני טורים",
  "resume-showcase-two-column",
  "#eef0e9",
  "640px",
  IMG.education,
  [
    textNode(
      "name",
      "דניאל שapiro",
      {
        color: "#1f261b",
        fontSize: "52px",
        fontWeight: "600",
        letterSpacing: "-0.05em",
      },
      absoluteLayout(45, 45, "480px", "60px", 20),
    ),
    textNode(
      "role",
      "Data Scientist · ML Engineer",
      { color: "#515a49", fontSize: "17px", fontWeight: "600" },
      absoluteLayout(45, 115, "400px", "28px", 20),
    ),
    textNode(
      "left-title",
      "השכלה",
      { color: "#66705b", fontSize: "13px", fontWeight: "700", letterSpacing: "0.14em" },
      absoluteLayout(45, 175, "200px", "22px", 20),
    ),
    ...[
      ["M.Sc Computer Science", "Technion · 2018"],
      ["B.Sc Mathematics", "HUJI · 2015"],
    ].flatMap(([degree, school], index) => {
      const y = 210 + index * 70;
      return [
        textNode(
          `degree-${index}`,
          degree,
          { color: ink, fontSize: "16px", fontWeight: "700" },
          absoluteLayout(45, y, "420px", "24px", 20),
        ),
        textNode(
          `school-${index}`,
          school,
          { ...body, fontSize: "14px", color: "#515a49" },
          absoluteLayout(45, y + 28, "420px", "22px", 20),
        ),
      ];
    }),
    textNode(
      "left-title-2",
      "שפות",
      { color: "#66705b", fontSize: "13px", fontWeight: "700", letterSpacing: "0.14em" },
      absoluteLayout(45, 380, "200px", "22px", 20),
    ),
    textNode(
      "languages",
      "עברית · אנגלית · Python · R",
      { ...body, fontSize: "15px" },
      absoluteLayout(45, 415, "420px", "28px", 20),
    ),
    textNode(
      "right-title",
      "ניסיון",
      { color: "#66705b", fontSize: "13px", fontWeight: "700", letterSpacing: "0.14em" },
      absoluteLayout(540, 45, "200px", "22px", 20),
    ),
    ...[
      ["2020–היום", "Senior Data Scientist", "Wix · מודלים לחיזוי והמלצות"],
      ["2018–2020", "ML Engineer", "Mobileye · computer vision"],
      ["2016–2018", "Analyst", "Bank Leumi · ניתוח נתונים"],
    ].flatMap(([period, title, copy], index) => {
      const y = 85 + index * 155;
      return [
        textNode(
          `r-period-${index}`,
          period,
          { color: "#8a7359", fontSize: "13px", fontWeight: "700" },
          absoluteLayout(540, y, "120px", "22px", 20),
        ),
        textNode(
          `r-title-${index}`,
          title,
          { color: ink, fontSize: "18px", fontWeight: "700" },
          absoluteLayout(540, y + 26, "480px", "28px", 20),
        ),
        textNode(
          `r-copy-${index}`,
          copy,
          { ...body, fontSize: "14px" },
          absoluteLayout(540, y + 58, "480px", "50px", 20),
        ),
        boxNode(
          `r-rule-${index}`,
          { backgroundColor: "#d6d0c7" },
          absoluteLayout(540, y + 130, "480px", "1px", 5),
        ),
      ];
    }),
    imageNode(
      "image",
      IMG.education,
      { borderRadius: "4px", objectFit: "cover" },
      absoluteLayout(45, 470, "420px", "140px", 8),
      "השכלה",
    ),
  ],
);

/** 5 — קולאז' יצירתי */
const creativeCollage = resume(
  "section-resume-showcase-creative-collage",
  "קורות חיים — קולאז' יצירתי",
  "resume-showcase-creative-collage",
  "#171717",
  "620px",
  IMG.fashion,
  [
    imageNode(
      "main",
      IMG.fashion,
      { borderRadius: "2px", objectFit: "cover" },
      absoluteLayout(45, 45, "400px", "530px", 5),
      "פורטfolio",
    ),
    imageNode(
      "detail",
      IMG.abstract,
      {
        border: "10px solid #171717",
        borderRadius: "2px",
        objectFit: "cover",
      },
      absoluteLayout(320, 380, "180px", "160px", 10),
      "פרט עיצוב",
    ),
    textNode(
      "name",
      "יעל אברהם",
      {
        color: "#ffffff",
        fontSize: "48px",
        fontWeight: "600",
        letterSpacing: "-0.05em",
      },
      absoluteLayout(520, 60, "500px", "60px", 20),
    ),
    textNode(
      "role",
      "Fashion Photographer · Visual Artist",
      { color: "rgba(255,255,255,.65)", fontSize: "16px", fontWeight: "600" },
      absoluteLayout(520, 130, "400px", "28px", 20),
    ),
    textNode(
      "copy",
      "צילום אופנה, עריכה ויזואלית ופרויקטים אישיים. עבדתי עם Vogue IL, Terminal X ומותגים עצמאיים.",
      { color: "rgba(255,255,255,.75)", fontSize: "15px", lineHeight: "1.6" },
      absoluteLayout(520, 190, "480px", "80px", 20),
    ),
    ...[
      ["120+", "פרויקטים"],
      ["8", "שנות ניסיון"],
      ["15", "לקוחות קבועים"],
    ].flatMap(([num, label], index) => {
      const x = 520 + index * 160;
      return [
        textNode(
          `stat-${index}`,
          num,
          {
            color: "#f5c86f",
            fontSize: "36px",
            fontWeight: "600",
            letterSpacing: "-0.04em",
          },
          absoluteLayout(x, 310, "140px", "45px", 20),
        ),
        textNode(
          `stat-label-${index}`,
          label,
          { color: "rgba(255,255,255,.55)", fontSize: "13px" },
          absoluteLayout(x, 360, "140px", "22px", 20),
        ),
      ];
    }),
    buttonNode(
      "cta",
      "Portfolio",
      {
        ...darkButton,
        backgroundColor: "#f5c86f",
        color: ink,
      },
      absoluteLayout(520, 430, "170px", "48px", 22),
    ),
  ],
);

/** 6 — ציר זמן אנכי */
const verticalTimeline = resume(
  "section-resume-showcase-vertical-timeline",
  "קורות חיים — ציר זמן אנכי",
  "resume-showcase-vertical-timeline",
  "#f7f5f1",
  "700px",
  IMG.construction,
  [
    textNode(
      "eyebrow",
      "קורות חיים",
      {
        color: "#8a7359",
        fontSize: "13px",
        fontWeight: "700",
        letterSpacing: "0.14em",
      },
      absoluteLayout(45, 40, "200px", "22px", 20),
    ),
    textNode(
      "name",
      "רון מזרחי",
      {
        color: "#1d1b18",
        fontSize: "48px",
        fontWeight: "600",
        letterSpacing: "-0.05em",
      },
      absoluteLayout(45, 70, "500px", "60px", 20),
    ),
    textNode(
      "role",
      "Project Manager · Construction",
      { color: "#66615a", fontSize: "17px", fontWeight: "600" },
      absoluteLayout(45, 140, "400px", "28px", 20),
    ),
    boxNode(
      "timeline-line",
      { backgroundColor: "#d6d0c7" },
      absoluteLayout(55, 200, "3px", "460px", 5),
    ),
    ...[
      ["2020–היום", "PM Senior", "ניהול פרויקטים מגורים · ₪80M+ תקציב"],
      ["2016–2020", "Project Manager", "פרויקטים מסחריים ומשרדים"],
      ["2012–2016", "Site Engineer", "פיקוח ובקרת איכות"],
      ["2008–2012", "B.Sc Civil Eng", "Technion"],
    ].flatMap(([year, title, copy], index) => {
      const y = 200 + index * 110;
      return [
        boxNode(
          `dot-${index}`,
          { backgroundColor: index === 0 ? ink : "#d6d0c7", borderRadius: "50%" },
          absoluteLayout(48, y + 4, "16px", "16px", 10),
        ),
        textNode(
          `year-${index}`,
          year,
          { color: "#8a7359", fontSize: "14px", fontWeight: "700" },
          absoluteLayout(85, y, "120px", "22px", 20),
        ),
        textNode(
          `title-${index}`,
          title,
          { color: ink, fontSize: "20px", fontWeight: "700" },
          absoluteLayout(85, y + 28, "400px", "28px", 20),
        ),
        textNode(
          `copy-${index}`,
          copy,
          { color: "#66615a", fontSize: "14px", lineHeight: "1.45" },
          absoluteLayout(85, y + 60, "450px", "40px", 20),
        ),
      ];
    }),
    imageNode(
      "image",
      IMG.construction,
      { borderRadius: "4px", objectFit: "cover" },
      absoluteLayout(620, 45, "420px", "610px", 8),
      "פרויקטים",
    ),
  ],
);

/** 7 — כרטיסי סקשנים */
const cardSections = resume(
  "section-resume-showcase-card-sections",
  "קורות חיים — כרטיסי סקשנים",
  "resume-showcase-card-sections",
  "#ece9e4",
  "640px",
  IMG.medical,
  [
    textNode(
      "name",
      "Dr. שira כהן",
      {
        color: "#1c1a18",
        fontSize: "44px",
        fontWeight: "600",
        letterSpacing: "-0.05em",
        textAlign: "center",
      },
      absoluteLayout(290, 35, "500px", "55px", 20),
    ),
    textNode(
      "role",
      "רופאת משפחה · MD, MPH",
      { color: "#746d65", fontSize: "16px", textAlign: "center" },
      absoluteLayout(290, 95, "500px", "26px", 20),
    ),
    ...[
      ["השכלה", "MD · Sackler · 2015\nMPH · Tel Aviv Uni · 2018", IMG.medical],
      ["ניסיון", "2020–היום · מרפאה פרטית\n2018–2020 · בית חולים איכילוב", IMG.education],
      ["התמחויות", "רפואת משפחה · מניעה\nייעוץ תזונה ואורח חיים", IMG.wellness],
      ["פרסים", "מצטיינת מחקר · 2019\nמלגת Fulbright · 2017", IMG.nature],
    ].flatMap(([heading, copy, src], index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = 45 + col * 520;
      const y = 150 + row * 230;
      return [
        boxNode(
          `card-${index}`,
          {
            backgroundColor: "#ffffff",
            border: "1px solid rgba(28,26,24,.08)",
            borderRadius: "16px",
          },
          absoluteLayout(x, y, "490px", "210px", 5),
        ),
        imageNode(
          `image-${index}`,
          String(src),
          { borderRadius: "10px", objectFit: "cover" },
          absoluteLayout(x + 20, y + 20, "100px", "100px", 8),
          String(heading),
        ),
        textNode(
          `heading-${index}`,
          String(heading),
          { color: ink, fontSize: "18px", fontWeight: "700" },
          absoluteLayout(x + 140, y + 25, "320px", "28px", 20),
        ),
        textNode(
          `copy-${index}`,
          String(copy),
          {
            color: "#716a62",
            fontSize: "14px",
            lineHeight: "1.55",
            whiteSpace: "pre-line",
          },
          absoluteLayout(x + 140, y + 58, "320px", "130px", 20),
        ),
      ];
    }),
  ],
);

/** 8 — Full bleed hero */
const fullbleedHero = resume(
  "section-resume-showcase-fullbleed-hero",
  "קורות חיים — Full Bleed Hero",
  "resume-showcase-fullbleed-hero",
  "#171717",
  "580px",
  IMG.fitness,
  [
    imageNode(
      "bg",
      IMG.fitness,
      {
        borderRadius: "0px",
        objectFit: "cover",
        filter: "brightness(.65) saturate(.9)",
      },
      absoluteLayout(0, 0, "1080px", "580px", 2),
      "רקע",
    ),
    boxNode(
      "shade",
      {
        backgroundImage:
          "linear-gradient(90deg,rgba(9,12,14,.92) 0%,rgba(9,12,14,.55) 50%,rgba(9,12,14,.08) 85%)",
      },
      absoluteLayout(0, 0, "1080px", "580px", 5),
    ),
    textNode(
      "eyebrow",
      "Personal Trainer · NASM Certified",
      {
        color: "#f5c86f",
        fontSize: "13px",
        fontWeight: "700",
        letterSpacing: "0.15em",
      },
      absoluteLayout(65, 80, "400px", "26px", 20),
    ),
    textNode(
      "name",
      "עמית לevi",
      {
        color: "#ffffff",
        fontSize: "64px",
        fontWeight: "600",
        lineHeight: "0.98",
        letterSpacing: "-0.055em",
      },
      absoluteLayout(60, 120, "500px", "80px", 20),
    ),
    textNode(
      "copy",
      "8 שנות ניסיון באימון אישי, קבוצתי ותזונה ספורטיבית. עזרתי ל-200+ לקוחות להגיע ליעדים שלהם.",
      { color: "#e2e4e5", fontSize: "17px", lineHeight: "1.65" },
      absoluteLayout(65, 230, "450px", "90px", 20),
    ),
    ...[
      ["200+", "לקוחות"],
      ["8", "שנות ניסיון"],
      ["NASM", "הסמכה"],
    ].flatMap(([num, label], index) => {
      const x = 65 + index * 130;
      return [
        textNode(
          `stat-${index}`,
          num,
          {
            color: "#ffffff",
            fontSize: "32px",
            fontWeight: "600",
            letterSpacing: "-0.04em",
          },
          absoluteLayout(x, 350, "110px", "40px", 20),
        ),
        textNode(
          `stat-label-${index}`,
          label,
          { color: "rgba(255,255,255,.55)", fontSize: "13px" },
          absoluteLayout(x, 395, "110px", "22px", 20),
        ),
      ];
    }),
    buttonNode(
      "cta",
      "הורדת CV",
      {
        ...darkButton,
        color: ink,
        backgroundColor: "#f5c86f",
      },
      absoluteLayout(65, 460, "170px", "48px", 22),
    ),
  ],
);

export const RESUME_SHOWCASE_SECTIONS: VisualLibrarySectionTemplate[] = [
  editorialPortrait,
  skillsTimeline,
  minimalCentered,
  twoColumn,
  creativeCollage,
  verticalTimeline,
  cardSections,
  fullbleedHero,
];
