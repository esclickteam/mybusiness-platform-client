#!/usr/bin/env node
/**
 * Scaffolds full multi-page agency websites for portfolio category.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const templatesDir = path.join(root, "src/components/site-builder/studio/data/templates");

const agencies = [
  {
    key: "growthly",
    name: "Growthly",
    niche: "marketing-agency",
    nicheHe: "סוכנות שיווק",
    tagline: "צמיחה מדידה לעסקים",
    primary: "#0F766E",
    accent: "#14B8A6",
    bg: "#F0FDFA",
    surface: "#FFFFFF",
    text: "#134E4A",
    muted: "#5F7A76",
    dark: "#042F2E",
    font: "Heebo",
    display: "Manrope",
    heroTitle: "שיווק שמזיז מחט, לא רק יוצר רעש.",
    heroSubtitle: "סוכנות Growthly בונה מנועי צמיחה: אסטרטגיה, תוכן, מדיה ממומנת ואוטומציות שמביאות לידים איכותיים.",
    heroImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=2000&q=88",
    aboutImage: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1400&q=88",
    services: [
      ["אסטרטגיית צמיחה", "מיפוי משפך, ICP ו-KPI ברורים לכל ערוץ."],
      ["תוכן ובренд", "מסרים חדים, נכסים שיווקיים וסיפור מותג עקבי."],
      ["מדיה ממומנת", "קמפיינים בגוגל, מטא ולינקדאין עם אופטימיזציה שבועית."],
      ["אוטומציה ו-CRM", "חיבור לידים, ניוטורים ודוחות בזמן אמת."],
    ],
    cases: [
      ["סקייל B2B", "הגדלת לידים איכותיים ב-180% תוך רבעון."],
      ["השקה דיגיטלית", "קמפיין השקה עם ROI מדיד משבוע ראשון."],
      ["מותג DTC", "שיפור המרה באתר ובמשפך האימייל."],
    ],
    team: [
      ["נועה כהן", "Head of Growth"],
      ["איתי לוי", "Performance Lead"],
      ["מאיה ברק", "Content Director"],
    ],
    email: "hello@growthly.co.il",
    phone: "03-555-1200",
  },
  {
    key: "insureva",
    name: "Insureva",
    niche: "insurance-agency",
    nicheHe: "סוכנות ביטוח",
    tagline: "ביטוח שמרגיש שקט",
    primary: "#1D4ED8",
    accent: "#3B82F6",
    bg: "#F8FAFC",
    surface: "#FFFFFF",
    text: "#0F172A",
    muted: "#64748B",
    dark: "#020617",
    font: "Heebo",
    display: "IBM Plex Sans Hebrew",
    heroTitle: "סוכנות ביטוח שמגנה על מה שבאמת חשוב.",
    heroSubtitle: "Insureva מלווה משפחות ועסקים בביטוח חיים, בריאות, רכוש ועסקי — עם שקיפות מלאה וליווי אישי.",
    heroImage: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=2000&q=88",
    aboutImage: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1400&q=88",
    services: [
      ["ביטוח עסקי", "כיסוי לרכוש, אחריות מקצועית והמשכיות עסקית."],
      ["ביטוח משפחתי", "חיים, בריאות וסיעוד עם התאמה אישית."],
      ["רכב ודירה", "השוואת פוליסות וחיסכון בלי לוותר על כיסוי."],
      ["ניהול תביעות", "ליווי צמוד מרגע האירוע ועד הסגירה."],
    ],
    cases: [
      ["מפעל תעשייה", "בניית מעטפת ביטוח מלאה עם חיסכון שנתי."],
      ["משפחה צעירה", "תכנון כיסויים לפי שלבי חיים."],
      ["קליניקה רפואית", "אחריות מקצועית וכיסוי ציוד מתקדם."],
    ],
    team: [
      ["דניאל שפירא", "סוכן בכיר"],
      ["רוני אדרי", "יועצת משפחות"],
      ["יואב מזרחי", "מומחה עסקי"],
    ],
    email: "care@insureva.co.il",
    phone: "03-555-2200",
  },
  {
    key: "closora",
    name: "Closora",
    niche: "sales-agency",
    nicheHe: "סוכנות מכירות",
    tagline: "מכירות שסוגרות",
    primary: "#C2410C",
    accent: "#F97316",
    bg: "#FFF7ED",
    surface: "#FFFFFF",
    text: "#431407",
    muted: "#9A3412",
    dark: "#1C1917",
    font: "Heebo",
    display: "Oswald",
    heroTitle: "צוותי מכירות שמביאים עסקאות, לא מצגות.",
    heroSubtitle: "Closora בונה מערכי מכירה: סקריפטים, CRM, הדרכות וסגירה — מהשיחה הראשונה ועד חוזה חתום.",
    heroImage: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=2000&q=88",
    aboutImage: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1400&q=88",
    services: [
      ["בניית מערך מכירות", "גיוס, הדרכה ומבנה תגמול לצוות מנצח."],
      ["סקריפטים ומשא ומתן", "שיחות שמובילות לסגירה בלי לחץ מיותר."],
      ["אופטימיזציית CRM", "פייפליין נקי, SLA ברורים ומדידה יומית."],
      ["Outsourced SDR", "צוות חיצוני שמייצר פגישות איכותיות."],
    ],
    cases: [
      ["סטארטאפ SaaS", "הכפלת שיעור הסגירה תוך 90 יום."],
      ["חברת שירותים", "בניית פייפליין יציב לרבעון."],
      ["מותג B2C", "שיפור Upsell ו-Retention."],
    ],
    team: [
      ["גל עדן", "Sales Director"],
      ["שירה כץ", "Enablement Lead"],
      ["עומר דהן", "Closing Coach"],
    ],
    email: "deal@closora.co.il",
    phone: "03-555-3300",
  },
  {
    key: "adspire",
    name: "Adspire",
    niche: "advertising-agency",
    nicheHe: "סוכנות פרסום",
    tagline: "פרסום שאי אפשר לפספס",
    primary: "#7C3AED",
    accent: "#A78BFA",
    bg: "#0B0614",
    surface: "#160B24",
    text: "#F5F3FF",
    muted: "#C4B5FD",
    dark: "#050208",
    font: "Heebo",
    display: "Space Grotesk",
    darkTheme: true,
    heroTitle: "קריאייטיב חד וקמפיינים שתופסים תשומת לב.",
    heroSubtitle: "Adspire היא סוכנות פרסום לקמפיינים, אאוט-אוף-הום, דיגיטל וסרטונים — עם רעיון גדול וביצוע מדויק.",
    heroImage: "https://images.unsplash.com/photo-1542744173-05336fcc7ad4?auto=format&fit=crop&w=2000&q=88",
    aboutImage: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1400&q=88",
    services: [
      ["קריאייטיב וקונספט", "רעיונות גדולים שמתורגמים לשפה ויזואלית."],
      ["קמפיינים מולטי-צ׳אנל", "טלוויזיה, דיגיטל, OOH ורשתות."],
      ["הפקת וידאו", "סרטונים, רילס ונכסי מותג בקצב גבוה."],
      ["מדיה ותכנון", "תקציב חכם, מיקומים מדויקים ומדידה."],
    ],
    cases: [
      ["השקת מוצר", "קמפיין ארצי עם חשיפה ויראלית."],
      ["מותג אופנה", "סדרת סרטונים שהעלתה מעורבות פי 4."],
      ["אירוע שנתי", "קריאייטיב OOH + דיגיטל משולב."],
    ],
    team: [
      ["תמר אביב", "Creative Director"],
      ["ליאור חן", "Strategy Lead"],
      ["נטע רוזן", "Art Director"],
    ],
    email: "hello@adspire.co.il",
    phone: "03-555-4400",
  },
  {
    key: "talentix",
    name: "Talentix",
    niche: "recruitment-agency",
    nicheHe: "סוכנות גיוס",
    tagline: "האנשים הנכונים לעסק",
    primary: "#0E7490",
    accent: "#06B6D4",
    bg: "#ECFEFF",
    surface: "#FFFFFF",
    text: "#164E63",
    muted: "#0E7490",
    dark: "#083344",
    font: "Heebo",
    display: "Sora",
    heroTitle: "גיוס מדויק לתפקידים שמזיזים את העסק קדימה.",
    heroSubtitle: "Talentix מחברת חברות לטאלנטים: הייטק, מכירות, תפעול וניהול — עם תהליך שקוף ומהיר.",
    heroImage: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=2000&q=88",
    aboutImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=88",
    services: [
      ["גיוס הייטק", "מפתחים, פרודקט ודאטה עם סינון מקצועי."],
      ["גיוס מכירות", "SDR, Account Executives ומנהלי צוותים."],
      ["Executive Search", "איתור מנהלים בכירים בדיסקרטיות מלאה."],
      ["Employer Branding", "מיתוג מעסיק שימשוך מועמדים חזקים."],
    ],
    cases: [
      ["חברת סייבר", "איוש 12 תפקידים ב-60 יום."],
      ["סטארטאפ Series A", "בניית צוות ליבה מלא."],
      ["רשת קמעונאית", "גיוס מנהלי סניפים ארצי."],
    ],
    team: [
      ["הילה נחום", "Managing Partner"],
      ["רון אלון", "Tech Recruiter"],
      ["מיכל פרץ", "Talent Partner"],
    ],
    email: "talent@talentix.co.il",
    phone: "03-555-5500",
  },
  {
    key: "narrativa",
    name: "Narrativa",
    niche: "pr-agency",
    nicheHe: "סוכנות יחסי ציבור",
    tagline: "סיפור שמגיע לתקשורת",
    primary: "#BE123C",
    accent: "#FB7185",
    bg: "#FFF1F2",
    surface: "#FFFFFF",
    text: "#4C0519",
    muted: "#9F1239",
    dark: "#1F0A12",
    font: "Heebo",
    display: "Playfair Display",
    heroTitle: "יחסי ציבור שבונים מוניטין, לא רק כותרות.",
    heroSubtitle: "Narrativa מנהלת תקשורת, משברים ונוכחות מותגית — לעסקים, יזמים ומנהיגים שרוצים להישמע נכון.",
    heroImage: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=2000&q=88",
    aboutImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1400&q=88",
    services: [
      ["יחסי עיתונות", "חשיפה בעיתונות, פודקאסטים ומדיה דיגיטלית."],
      ["ניהול משברים", "פרוטוקולים, מסרים ותגובה מהירה."],
      ["דוברות מנכ״ל", "מיצוב אישי ונרטיב מנהיגותי."],
      ["אירועי השקה", "תכנון מדיה לאירועים והשקות מוצר."],
    ],
    cases: [
      ["השקת אפליקציה", "סבב מדיה ארצי בשבוע ההשקה."],
      ["ניהול משבר", "ייצוב מוניטין תוך 48 שעות."],
      ["מותג צרכני", "סדרת ראיונות ופודקאסטים מובילים."],
    ],
    team: [
      ["יעל סגל", "PR Director"],
      ["אסף גרין", "Media Relations"],
      ["דנה אור", "Crisis Lead"],
    ],
    email: "press@narrativa.co.il",
    phone: "03-555-6600",
  },
];

function pascal(key) {
  return key.charAt(0).toUpperCase() + key.slice(1);
}

function write(filePath, contents) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, contents);
}

function defaultData(a) {
  return `export const ${a.key}DefaultData = {
  templateId: "${a.key}",
  name: "${a.name}",
  brandName: "${a.name}",
  logoText: "${a.name.slice(0, 2).toUpperCase()}",
  tagline: "${a.tagline}",
  nicheLabel: "${a.nicheHe}",
  navHome: "בית",
  navAbout: "אודות",
  navServices: "שירותים",
  navCases: "פרויקטים",
  navTeam: "צוות",
  navInsights: "תובנות",
  navProcess: "תהליך",
  navContact: "צור קשר",
  heroEyebrow: "${a.nicheHe}",
  heroTitle: ${JSON.stringify(a.heroTitle)},
  heroSubtitle: ${JSON.stringify(a.heroSubtitle)},
  heroPrimaryButton: "שיחת היכרות",
  heroSecondaryButton: "לתיק עבודות",
  heroImage: "${a.heroImage}",
  aboutImage: "${a.aboutImage}",
  aboutEyebrow: "מי אנחנו",
  aboutTitle: ${JSON.stringify(`${a.name} — ${a.nicheHe} עם תהליך ברור ותוצאות מדידות.`)},
  aboutText: ${JSON.stringify(`אנחנו צוות ${a.nicheHe} שעובד צמוד ללקוחות: אבחון, תכנון, ביצוע ומדידה — בלי רעש מיותר ובלי הבטחות ריקות.`)},
  servicesEyebrow: "שירותים",
  servicesTitle: "מעטפת שירותים מלאה לסוכנות.",
  serviceOneTitle: ${JSON.stringify(a.services[0][0])},
  serviceOneText: ${JSON.stringify(a.services[0][1])},
  serviceTwoTitle: ${JSON.stringify(a.services[1][0])},
  serviceTwoText: ${JSON.stringify(a.services[1][1])},
  serviceThreeTitle: ${JSON.stringify(a.services[2][0])},
  serviceThreeText: ${JSON.stringify(a.services[2][1])},
  serviceFourTitle: ${JSON.stringify(a.services[3][0])},
  serviceFourText: ${JSON.stringify(a.services[3][1])},
  casesEyebrow: "פרויקטים",
  casesTitle: "עבודות שנבחרו מהשטח.",
  caseOneTitle: ${JSON.stringify(a.cases[0][0])},
  caseOneText: ${JSON.stringify(a.cases[0][1])},
  caseTwoTitle: ${JSON.stringify(a.cases[1][0])},
  caseTwoText: ${JSON.stringify(a.cases[1][1])},
  caseThreeTitle: ${JSON.stringify(a.cases[2][0])},
  caseThreeText: ${JSON.stringify(a.cases[2][1])},
  teamEyebrow: "הצוות",
  teamTitle: "האנשים מאחורי התוצאות.",
  teamOneName: ${JSON.stringify(a.team[0][0])},
  teamOneRole: ${JSON.stringify(a.team[0][1])},
  teamTwoName: ${JSON.stringify(a.team[1][0])},
  teamTwoRole: ${JSON.stringify(a.team[1][1])},
  teamThreeName: ${JSON.stringify(a.team[2][0])},
  teamThreeRole: ${JSON.stringify(a.team[2][1])},
  insightsEyebrow: "תובנות",
  insightsTitle: "מאמרים ונקודות מבט מהשטח.",
  insightOneTitle: "איך בונים תוכנית רבעונית שעובדת",
  insightOneText: "מסגרת פשוטה לתעדוף מהלכים לפי השפעה ומאמץ.",
  insightTwoTitle: "מה למדנו מקמפיינים כושלים",
  insightTwoText: "טעויות נפוצות וסימנים מוקדמים שכדאי לתפוס בזמן.",
  insightThreeTitle: "מדדי הצלחה שסוכנות חייבת לעקוב אחריהם",
  insightThreeText: "KPI ברורים ללקוח, לצוות ולהנהלה.",
  processEyebrow: "תהליך",
  processTitle: "איך אנחנו עובדים יחד.",
  processOneTitle: "אבחון",
  processOneText: "הבנת מצב קיים, יעדים ואילוצים.",
  processTwoTitle: "תכנון",
  processTwoText: "בניית מפת דרכים, תקציב ולוחות זמנים.",
  processThreeTitle: "ביצוע",
  processThreeText: "יישום מדורג עם שקיפות מלאה.",
  processFourTitle: "מדידה ושיפור",
  processFourText: "דוחות, תובנות ואופטימיזציה מתמשכת.",
  contactEyebrow: "צור קשר",
  contactTitle: "מוכנים לדבר על הצעד הבא?",
  contactText: "השאירו פרטים ונחזור עם הצעת מסלול ברורה.",
  contactButton: "שליחת פנייה",
  phone: "${a.phone}",
  email: "${a.email}",
  address: "תל אביב, ישראל",
  footerText: "אתר מלא לסוכנות — עמודים, תתי-עמודים ותוכן מוכן לעריכה.",
  ctaTitle: "בואו נבנה את השלב הבא יחד.",
  ctaText: "שיחת היכרות קצרה מספיקה כדי להבין אם יש התאמה.",
  ctaButton: "קבעו שיחה",
  statOne: "120+",
  statOneLabel: "לקוחות מלווים",
  statTwo: "8",
  statTwoLabel: "שנות פעילות",
  statThree: "94%",
  statThreeLabel: "שימור לקוחות",
  statFour: "48ש׳",
  statFourLabel: "זמן מענה ממוצע",
};
`;
}

function editorCss(a) {
  const fonts = a.display === "Playfair Display"
    ? `family=Playfair+Display:wght@600;700;800&family=Heebo:wght@400;500;600;700;800`
    : a.display === "Oswald"
      ? `family=Oswald:wght@500;600;700&family=Heebo:wght@400;500;600;700;800`
      : a.display === "Space Grotesk"
        ? `family=Space+Grotesk:wght@500;600;700&family=Heebo:wght@400;500;600;700;800`
        : a.display === "IBM Plex Sans Hebrew"
          ? `family=IBM+Plex+Sans+Hebrew:wght@400;500;600;700&family=Heebo:wght@400;500;600;700;800`
          : a.display === "Sora"
            ? `family=Sora:wght@500;600;700;800&family=Heebo:wght@400;500;600;700;800`
            : `family=Manrope:wght@500;600;700;800&family=Heebo:wght@400;500;600;700;800`;

  return `export const ${a.key}EditorCss = \`
@import url('https://fonts.googleapis.com/css2?${fonts}&display=swap');
[data-template-id="${a.key}"], [data-template-id="${a.key}-preview"] {
  --p: ${a.primary};
  --accent: ${a.accent};
  --bg: ${a.bg};
  --surface: ${a.surface};
  --text: ${a.text};
  --muted: ${a.muted};
  --dark: ${a.dark};
  font-family: "${a.font}", sans-serif;
  color: var(--text);
  background: var(--bg);
  text-align: right;
}
[data-template-id="${a.key}"] .text-center,
[data-template-id="${a.key}-preview"] .text-center {
  text-align: center;
}
[data-template-id="${a.key}"] .ag-display,
[data-template-id="${a.key}-preview"] .ag-display {
  font-family: "${a.display}", "${a.font}", sans-serif;
}
[data-template-id="${a.key}"] .ag-card,
[data-template-id="${a.key}-preview"] .ag-card {
  transition: transform 320ms ease, border-color 320ms ease, box-shadow 320ms ease;
}
[data-template-id="${a.key}"] .ag-card:hover,
[data-template-id="${a.key}-preview"] .ag-card:hover {
  transform: translateY(-4px);
  border-color: var(--p);
  box-shadow: 0 18px 40px rgba(0,0,0,0.08);
}
\`;
`;
}

function pagesTsx(a) {
  const P = pascal(a.key);
  const softBorder = a.darkTheme ? "border-white/15" : "border-black/10";
  const headerBg = a.darkTheme ? "bg-[var(--dark)]/90 text-white" : "bg-[var(--surface)]/92 text-[var(--text)]";
  const sectionAlt = a.darkTheme ? "bg-[var(--surface)]" : "bg-[var(--surface)]";

  return `import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { ${a.key}DefaultData } from "./defaultData";
import { ${a.key}EditorCss } from "./editorCss";

export const ${a.key}Pages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "cases", label: "פרויקטים", slug: "/cases" },
  { id: "team", label: "צוות", slug: "/team" },
  { id: "insights", label: "תובנות", slug: "/insights" },
  { id: "process", label: "תהליך", slug: "/process" },
  { id: "contact", label: "צור קשר", slug: "/contact" },
];

const allowedPages = ${a.key}Pages.map((p) => p.id);

type Props = {
  initialPage?: string;
  initialPageId?: string;
  page?: string;
  pageId?: string;
  activePageId?: string;
  currentPageId?: string;
  mode?: "preview" | "edit" | "published";
  data?: Record<string, any>;
  onPageChange?: (pageId: string) => void;
  isPublic?: boolean;
  viewMode?: string;
  runtimeMode?: string;
};

function getValue(data: Record<string, any>, key: string) {
  return data?.[key] ?? (${a.key}DefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, currentPage, goTo }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const nav = [
    ["home", getValue(data, "navHome")],
    ["about", getValue(data, "navAbout")],
    ["services", getValue(data, "navServices")],
    ["cases", getValue(data, "navCases")],
    ["team", getValue(data, "navTeam")],
    ["insights", getValue(data, "navInsights")],
    ["process", getValue(data, "navProcess")],
    ["contact", getValue(data, "navContact")],
  ];

  return (
    <header data-visual-flow-lock="true" data-template-section-type="header" className={\`sticky top-0 z-50 border-b ${softBorder} ${headerBg} backdrop-blur-xl\`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={() => goTo("home")} className="text-right">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center bg-[var(--p)] text-sm font-black text-white">{getValue(data, "logoText")}</span>
            <div>
              <p className="ag-display text-xl font-extrabold leading-none">{getValue(data, "brandName")}</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--muted)]">{getValue(data, "tagline")}</p>
            </div>
          </div>
        </button>
        <nav className="hidden items-center gap-5 lg:flex">
          {nav.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => goTo(id)}
              className={\`text-xs font-bold uppercase tracking-[0.14em] transition \${currentPage === id ? "text-[var(--p)]" : "opacity-70 hover:opacity-100"}\`}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => goTo("contact")} className="hidden bg-[var(--p)] px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-white md:inline-flex">
            {getValue(data, "heroPrimaryButton")}
          </button>
          <button type="button" className="grid h-11 w-11 place-items-center border ${softBorder} lg:hidden" onClick={() => setOpen((v) => !v)}>
            {open ? "×" : "☰"}
          </button>
        </div>
      </div>
      {open ? (
        <div className="border-t ${softBorder} px-5 py-4 lg:hidden">
          <div className="grid gap-2">
            {nav.map(([id, label]) => (
              <button key={id} type="button" onClick={() => { goTo(id); setOpen(false); }} className="py-2 text-right text-sm font-bold">
                {label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}

function Hero({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <section data-template-section-type="hero" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div className="text-right">
          <p className="inline-flex border border-[var(--p)]/30 bg-[var(--p)]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "heroEyebrow")}</p>
          <h1 className="ag-display mt-6 text-4xl font-extrabold leading-tight md:text-6xl">{getValue(data, "heroTitle")}</h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-[var(--muted)] md:text-lg">{getValue(data, "heroSubtitle")}</p>
          <div className="mt-8 flex flex-wrap justify-start gap-3">
            <button type="button" onClick={() => goTo("contact")} className="bg-[var(--p)] px-7 py-4 text-sm font-black text-white">{getValue(data, "heroPrimaryButton")}</button>
            <button type="button" onClick={() => goTo("cases")} className="border border-[var(--p)] px-7 py-4 text-sm font-black text-[var(--p)]">{getValue(data, "heroSecondaryButton")}</button>
          </div>
        </div>
        <div className={\`overflow-hidden border ${softBorder}\`}>
          <img src={getValue(data, "heroImage")} alt="" className="aspect-[4/3] h-full w-full object-cover" />
        </div>
      </div>
    </section>
  );
}

function Stats({ data }: { data: Record<string, any> }) {
  const stats = [
    [getValue(data, "statOne"), getValue(data, "statOneLabel")],
    [getValue(data, "statTwo"), getValue(data, "statTwoLabel")],
    [getValue(data, "statThree"), getValue(data, "statThreeLabel")],
    [getValue(data, "statFour"), getValue(data, "statFourLabel")],
  ];
  return (
    <section className={\`border-y ${softBorder} ${sectionAlt} px-5 py-12 lg:px-8\`}>
      <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([value, label]) => (
          <div key={label} className={\`ag-card border ${softBorder} bg-[var(--bg)] p-6 text-center\`}>
            <p className="ag-display text-4xl font-extrabold text-[var(--p)]">{value}</p>
            <p className="mt-2 text-sm font-semibold text-[var(--muted)]">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function About({ data }: { data: Record<string, any> }) {
  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
        <img src={getValue(data, "aboutImage")} alt="" className={\`aspect-[4/3] w-full object-cover border ${softBorder}\`} />
        <div className="text-right">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "aboutEyebrow")}</p>
          <h2 className="ag-display mt-4 text-3xl font-extrabold leading-tight md:text-5xl">{getValue(data, "aboutTitle")}</h2>
          <p className="mt-6 text-base leading-8 text-[var(--muted)]">{getValue(data, "aboutText")}</p>
        </div>
      </div>
    </section>
  );
}

function Services({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  const items = [
    [getValue(data, "serviceOneTitle"), getValue(data, "serviceOneText")],
    [getValue(data, "serviceTwoTitle"), getValue(data, "serviceTwoText")],
    [getValue(data, "serviceThreeTitle"), getValue(data, "serviceThreeText")],
    [getValue(data, "serviceFourTitle"), getValue(data, "serviceFourText")],
  ];
  return (
    <section className={\`${sectionAlt} px-5 py-20 lg:px-8 lg:py-28\`}>
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "servicesEyebrow")}</p>
          <h2 className="ag-display mt-4 text-3xl font-extrabold md:text-5xl">{getValue(data, "servicesTitle")}</h2>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {items.map(([title, text], i) => (
            <article key={title} className={\`ag-card border ${softBorder} bg-[var(--bg)] p-7 text-right\`}>
              <p className="text-sm font-black text-[var(--p)]">0{i + 1}</p>
              <h3 className="mt-3 text-2xl font-bold">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{text}</p>
              <button type="button" onClick={() => goTo("contact")} className="mt-6 text-sm font-black text-[var(--p)]">לפרטים ←</button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Cases({ data }: { data: Record<string, any> }) {
  const items = [
    [getValue(data, "caseOneTitle"), getValue(data, "caseOneText")],
    [getValue(data, "caseTwoTitle"), getValue(data, "caseTwoText")],
    [getValue(data, "caseThreeTitle"), getValue(data, "caseThreeText")],
  ];
  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "casesEyebrow")}</p>
          <h2 className="ag-display mt-4 text-3xl font-extrabold md:text-5xl">{getValue(data, "casesTitle")}</h2>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {items.map(([title, text], i) => (
            <article key={title} className={\`ag-card min-h-[240px] border ${softBorder} ${sectionAlt} p-7 text-right\`}>
              <p className="ag-display text-5xl font-extrabold text-[var(--p)]/30">0{i + 1}</p>
              <h3 className="mt-4 text-2xl font-bold">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Team({ data }: { data: Record<string, any> }) {
  const items = [
    [getValue(data, "teamOneName"), getValue(data, "teamOneRole")],
    [getValue(data, "teamTwoName"), getValue(data, "teamTwoRole")],
    [getValue(data, "teamThreeName"), getValue(data, "teamThreeRole")],
  ];
  return (
    <section className={\`${sectionAlt} px-5 py-20 lg:px-8 lg:py-28\`}>
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "teamEyebrow")}</p>
          <h2 className="ag-display mt-4 text-3xl font-extrabold md:text-5xl">{getValue(data, "teamTitle")}</h2>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {items.map(([name, role]) => (
            <article key={name} className={\`ag-card border ${softBorder} bg-[var(--bg)] p-8 text-center\`}>
              <div className="mx-auto grid h-20 w-20 place-items-center bg-[var(--p)] text-2xl font-black text-white">{String(name).slice(0, 1)}</div>
              <h3 className="mt-5 text-xl font-bold">{name}</h3>
              <p className="mt-2 text-sm font-semibold text-[var(--muted)]">{role}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Insights({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  const items = [
    [getValue(data, "insightOneTitle"), getValue(data, "insightOneText")],
    [getValue(data, "insightTwoTitle"), getValue(data, "insightTwoText")],
    [getValue(data, "insightThreeTitle"), getValue(data, "insightThreeText")],
  ];
  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "insightsEyebrow")}</p>
          <h2 className="ag-display mt-4 text-3xl font-extrabold md:text-5xl">{getValue(data, "insightsTitle")}</h2>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {items.map(([title, text]) => (
            <article key={title} className={\`ag-card border ${softBorder} ${sectionAlt} p-7 text-right\`}>
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{text}</p>
              <button type="button" onClick={() => goTo("contact")} className="mt-5 text-sm font-black text-[var(--p)]">קראו עוד ←</button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process({ data }: { data: Record<string, any> }) {
  const steps = [
    [getValue(data, "processOneTitle"), getValue(data, "processOneText")],
    [getValue(data, "processTwoTitle"), getValue(data, "processTwoText")],
    [getValue(data, "processThreeTitle"), getValue(data, "processThreeText")],
    [getValue(data, "processFourTitle"), getValue(data, "processFourText")],
  ];
  return (
    <section className={\`${sectionAlt} px-5 py-20 lg:px-8 lg:py-28\`}>
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "processEyebrow")}</p>
          <h2 className="ag-display mt-4 text-3xl font-extrabold md:text-5xl">{getValue(data, "processTitle")}</h2>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(([title, text], i) => (
            <article key={title} className={\`ag-card border ${softBorder} bg-[var(--bg)] p-6 text-right\`}>
              <p className="text-sm font-black text-[var(--p)]">שלב 0{i + 1}</p>
              <h3 className="mt-3 text-xl font-bold">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact({ data }: { data: Record<string, any> }) {
  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className={\`mx-auto grid max-w-7xl gap-8 border ${softBorder} ${sectionAlt} p-6 md:p-10 lg:grid-cols-2\`}>
        <div className="text-right">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "contactEyebrow")}</p>
          <h2 className="ag-display mt-4 text-3xl font-extrabold md:text-5xl">{getValue(data, "contactTitle")}</h2>
          <p className="mt-5 text-base leading-8 text-[var(--muted)]">{getValue(data, "contactText")}</p>
          <div className="mt-8 space-y-2 text-sm font-bold">
            <p>{getValue(data, "phone")}</p>
            <p>{getValue(data, "email")}</p>
            <p>{getValue(data, "address")}</p>
          </div>
        </div>
        <form className="grid gap-3">
          <input className={\`border ${softBorder} bg-[var(--bg)] px-4 py-4 text-right outline-none\`} placeholder="שם מלא" />
          <input className={\`border ${softBorder} bg-[var(--bg)] px-4 py-4 text-right outline-none\`} placeholder="טלפון" />
          <input className={\`border ${softBorder} bg-[var(--bg)] px-4 py-4 text-right outline-none\`} placeholder="חברה / תחום" />
          <textarea className={\`min-h-32 border ${softBorder} bg-[var(--bg)] px-4 py-4 text-right outline-none\`} placeholder="במה נוכל לעזור?" />
          <button type="button" className="bg-[var(--p)] px-6 py-4 text-sm font-black text-white">{getValue(data, "contactButton")}</button>
        </form>
      </div>
    </section>
  );
}

function Footer({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  const links = ${a.key}Pages.filter((p) => p.id !== "home");
  return (
    <footer className="bg-[var(--dark)] px-5 py-16 text-white lg:px-8">
      <div className="mx-auto max-w-7xl text-center">
        <p className="ag-display text-4xl font-extrabold md:text-6xl">{getValue(data, "brandName")}</p>
        <h2 className="mx-auto mt-4 max-w-3xl text-2xl font-bold md:text-4xl">{getValue(data, "ctaTitle")}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-white/70">{getValue(data, "ctaText")}</p>
        <button type="button" onClick={() => goTo("contact")} className="mt-8 bg-[var(--p)] px-8 py-4 text-sm font-black text-white">
          {getValue(data, "ctaButton")}
        </button>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {links.map((p) => (
            <button key={p.id} type="button" onClick={() => goTo(p.id)} className="border border-white/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white/80">
              {p.label}
            </button>
          ))}
        </div>
        <p className="mt-10 text-xs text-white/50">© {new Date().getFullYear()} {getValue(data, "brandName")} · {getValue(data, "footerText")}</p>
      </div>
    </footer>
  );
}

function PageHero({ data, title }: { data: Record<string, any>; title: string }) {
  return (
    <section className={\`border-b ${softBorder} px-5 py-14 lg:px-8 lg:py-20\`}>
      <div className="mx-auto max-w-7xl text-right">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "brandName")} · {getValue(data, "nicheLabel")}</p>
        <h1 className="ag-display mt-4 text-4xl font-extrabold md:text-6xl">{title}</h1>
      </div>
    </section>
  );
}

function HomePage({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <>
      <Hero data={data} goTo={goTo} />
      <Stats data={data} />
      <About data={data} />
      <Services data={data} goTo={goTo} />
      <Cases data={data} />
      <Team data={data} />
      <Insights data={data} goTo={goTo} />
      <Process data={data} />
      <Contact data={data} />
      <Footer data={data} goTo={goTo} />
    </>
  );
}

function InnerPage({ data, type, goTo }: { data: Record<string, any>; type: string; goTo: (id: string) => void }) {
  const titles: Record<string, string> = {
    about: getValue(data, "navAbout"),
    services: getValue(data, "navServices"),
    cases: getValue(data, "navCases"),
    team: getValue(data, "navTeam"),
    insights: getValue(data, "navInsights"),
    process: getValue(data, "navProcess"),
    contact: getValue(data, "navContact"),
  };

  const map: Record<string, React.ReactNode> = {
    about: (<><About data={data} /><Stats data={data} /><Team data={data} /></>),
    services: (<><Services data={data} goTo={goTo} /><Process data={data} /></>),
    cases: (<><Cases data={data} /><Stats data={data} /></>),
    team: (<><Team data={data} /><About data={data} /></>),
    insights: (<><Insights data={data} goTo={goTo} /><Cases data={data} /></>),
    process: (<><Process data={data} /><Services data={data} goTo={goTo} /></>),
    contact: (<><Contact data={data} /></>),
  };

  return (
    <>
      <PageHero data={data} title={titles[type] || getValue(data, "brandName")} />
      {map[type] ?? null}
      <Footer data={data} goTo={goTo} />
    </>
  );
}

export default function ${P}Pages({
  initialPage = "home",
  initialPageId,
  page,
  pageId,
  activePageId,
  currentPageId,
  mode = "preview",
  data,
  onPageChange,
  isPublic,
  viewMode,
  runtimeMode,
}: Props) {
  const mergedData = useMemo(() => ({ ...${a.key}DefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );

  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "${a.key}-preview" : "${a.key}"} className="min-h-screen w-full overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: ${a.key}EditorCss }} />
      <Header data={mergedData} currentPage={currentPage} goTo={goTo} />
      <VisualPageStack
        activePageId={currentPage}
        pages={[
          { id: "home", content: <HomePage data={mergedData} goTo={goTo} /> },
          ...${a.key}Pages.filter((p) => p.id !== "home").map((p) => ({
            id: p.id,
            content: <InnerPage data={mergedData} type={p.id} goTo={goTo} />,
          })),
        ]}
      />
    </div>
  );
}
`;
}

function metaTs(a) {
  const P = pascal(a.key);
  return `import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import ${P}Pages, { ${a.key}Pages } from "./pages";
import ${P}Preview from "./preview";
import ${P}Thumbnail from "./thumbnail";
import { ${a.key}EditorCss } from "./editorCss";
import { ${a.key}Schema } from "./schema";
import { ${a.key}DefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "${a.primary}",
  secondary: "${a.dark}",
  accent: "${a.accent}",
  background: "${a.bg}",
  surface: "${a.surface}",
  text: "${a.text}",
  muted: "${a.muted}",
  dark: "${a.dark}",
};

export const ${a.key}Seed = {
  id: "${a.key}",
  key: "${a.key}",
  name: "${a.name}",
  title: "${a.name}",
  description: "אתר מלא ל${a.nicheHe}: 8 עמודים כולל אודות, שירותים, פרויקטים, צוות, תובנות, תהליך וצור קשר.",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  niche: "${a.niche}",
  layout: "full",
  image: (${a.key}DefaultData as Record<string, any>).heroImage,
  heroTitle: (${a.key}DefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (${a.key}DefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "${a.key}-header", title: "Header" },
    { type: "hero", variant: "${a.key}-hero", title: "Hero" },
    { type: "services", variant: "${a.key}-services", title: "Services" },
    { type: "cases", variant: "${a.key}-cases", title: "Cases" },
    { type: "team", variant: "${a.key}-team", title: "Team" },
    { type: "contact", variant: "${a.key}-contact", title: "Contact" },
    { type: "footer", variant: "${a.key}-footer", title: "Footer" },
  ].map((block, index) => ({ id: \`${a.key}-\${index + 1}-\${block.type}\`, ...block })),
  pages: ${a.key}Pages,
  editor: { pages: ${a.key}Pages, css: ${a.key}EditorCss },
  css: ${a.key}EditorCss,
  data: ${a.key}DefaultData,
  defaultData: ${a.key}DefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const ${a.key}Template = {
  id: "${a.key}",
  key: "${a.key}",
  name: "${a.name}",
  title: "${a.name}",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  badge: "חדש",
  description: "אתר מלא ל${a.nicheHe} עם 8 עמודים, ניווט פנימי ותוכן מוכן לעריכה.",
  thumbnail: React.createElement(${P}Thumbnail),
  preview: React.createElement(${P}Preview),
  component: ${P}Pages,
  Component: ${P}Pages,
  seed: ${a.key}Seed,
  pages: ${a.key}Pages,
  editorCss: ${a.key}EditorCss,
  schema: ${a.key}Schema,
  defaultData: ${a.key}DefaultData,
  renderer: {
    key: "${a.key}",
    name: "${a.name}",
    Component: ${P}Pages,
    component: ${P}Pages,
    pages: ${a.key}Pages,
    editorMode: "visual-react",
    editorCss: ${a.key}EditorCss,
    schema: ${a.key}Schema,
    defaultData: ${a.key}DefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default ${a.key}Template;
`;
}

function schemaTs(a) {
  return `export const ${a.key}Schema = {
  templateId: "${a.key}",
  name: "${a.name}",
  fields: [
    { key: "brandName", label: "שם המותג", type: "text" },
    { key: "heroTitle", label: "כותרת הירו", type: "textarea" },
    { key: "heroSubtitle", label: "תת-כותרת", type: "textarea" },
    { key: "heroImage", label: "תמונת הירו", type: "image" },
    { key: "aboutTitle", label: "כותרת אודות", type: "textarea" },
    { key: "servicesTitle", label: "כותרת שירותים", type: "textarea" },
    { key: "contactTitle", label: "כותרת יצירת קשר", type: "textarea" },
    { key: "phone", label: "טלפון", type: "text" },
    { key: "email", label: "אימייל", type: "text" },
  ],
};
`;
}

function previewTsx(a) {
  const P = pascal(a.key);
  return `import React from "react";
import ${P}Pages from "./pages";

export default function ${P}Preview() {
  return (
    <div dir="rtl" data-template-id="${a.key}-preview" className="min-h-screen w-full overflow-x-hidden">
      <${P}Pages initialPage="home" mode="preview" />
    </div>
  );
}
`;
}

function thumbnailTsx(a) {
  const P = pascal(a.key);
  return `import React from "react";

export default function ${P}Thumbnail() {
  return (
    <div className="flex h-full w-full flex-col justify-between p-5 text-right" style={{ background: "${a.bg}", color: "${a.text}", fontFamily: "Heebo, sans-serif" }}>
      <div>
        <div className="inline-flex px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white" style={{ background: "${a.primary}" }}>${a.nicheHe}</div>
        <h3 className="mt-4 text-3xl font-black leading-none">${a.name}</h3>
        <p className="mt-2 text-xs font-semibold opacity-70">${a.tagline}</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {["אודות", "שירותים", "צוות"].map((label) => (
          <div key={label} className="border px-2 py-3 text-center text-[10px] font-bold" style={{ borderColor: "${a.primary}55", background: "${a.surface}" }}>{label}</div>
        ))}
      </div>
    </div>
  );
}
`;
}

for (const a of agencies) {
  const dir = path.join(templatesDir, a.key);
  write(path.join(dir, "defaultData.ts"), defaultData(a));
  write(path.join(dir, "editorCss.ts"), editorCss(a));
  write(path.join(dir, "pages.tsx"), pagesTsx(a));
  write(path.join(dir, "meta.ts"), metaTs(a));
  write(path.join(dir, "schema.ts"), schemaTs(a));
  write(path.join(dir, "preview.tsx"), previewTsx(a));
  write(path.join(dir, "thumbnail.tsx"), thumbnailTsx(a));
  console.log("created", a.key);
}

console.log("done", agencies.length);
