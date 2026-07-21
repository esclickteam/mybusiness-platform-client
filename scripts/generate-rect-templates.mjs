#!/usr/bin/env node
/**
 * Generates boilerplate files for the 10 rectangular multi-page templates.
 * Run: node scripts/generate-rect-templates.mjs
 */
import fs from "fs";
import path from "path";

const ROOT = path.resolve("src/components/site-builder/studio/data/templates");

const TEMPLATES = [
  {
    id: "gridline",
    name: "Gridline",
    category: "architecture",
    categoryLabel: "אדריכלות ובנייה",
    niche: "architecture-studio",
    description:
      "תבנית אדריכלות בראוטליסטית: רשת גריד גלויה, פינות ישרות, 6 עמודים וסקשנים עם כניסות תנועה.",
    badge: "חדש",
    accent: "#111111",
    bg: "#f4f4f0",
    text: "#111111",
    tagline: "Architecture Studio",
    heroLine: "מרחבים שמדברים בקו ישר.",
  },
  {
    id: "monolith",
    name: "Monolith",
    category: "business",
    categoryLabel: "עסקים וייעוץ",
    niche: "corporate-consulting",
    description:
      "תבנית קorporativ מונולитית: עמודים אנכיים, זהב על נייבי, 6 עמודים מורכבים ללא כרטיסיות מעוגלות.",
    badge: "Premium",
    accent: "#c8a96a",
    bg: "#eef0f4",
    text: "#0c1a33",
    tagline: "Corporate Advisory",
    heroLine: "ייעוץ ארגוני ברמת פרימיום.",
  },
  {
    id: "vertex",
    name: "Vertex",
    category: "technology",
    categoryLabel: "טכנולוגיה",
    niche: "tech-consulting",
    description:
      "תבנית טכנולוגיה גיאומטרית: קווים אלכסוניים, ניאון ירוק, 6 עמודים עם אנימציות כניסה חדות.",
    badge: "חדש",
    accent: "#00ff88",
    bg: "#050505",
    text: "#f5f5f5",
    tagline: "Tech Consulting",
    heroLine: "מערכות שמזנקות קדימה.",
  },
  {
    id: "framehaus",
    name: "Framehaus",
    category: "portfolio",
    categoryLabel: "פורטפolio וצילום",
    niche: "photography-studio",
    description:
      "תבנית סטודיו צילום: פריימים מלבניים א-symmetric, שחור-לבן, 5 עמודים עשירים בסקשנים.",
    badge: "חדש",
    accent: "#ff3b30",
    bg: "#fafafa",
    text: "#111111",
    tagline: "Photography Studio",
    heroLine: "פריים אחרי פריים.",
  },
  {
    id: "steelworks",
    name: "Steelworks",
    category: "industry",
    categoryLabel: "תעשייה וייצור",
    niche: "industrial-manufacturing",
    description:
      "תבנית תעשייתית: פסים אופקיים, כתום-פלדה, 6 עמודים עם מקטעי תנועה וכניסות.",
    badge: "Premium",
    accent: "#ff6b2c",
    bg: "#1a1a1a",
    text: "#f0f0f0",
    tagline: "Industrial Manufacturing",
    heroLine: "חוזק שאפשר למדוד.",
  },
  {
    id: "prism",
    name: "Prism",
    category: "creative",
    categoryLabel: "קריאייטיב ועיצוב",
    niche: "design-agency",
    description:
      "תבנית סוכנות עיצוב בauhaus: בלוקי צבע מלבניים, 6 עמודים, טיפוגרפיה נועזת ותנועה.",
    badge: "חדש",
    accent: "#0057ff",
    bg: "#fffef8",
    text: "#0a0a0a",
    tagline: "Design Agency",
    heroLine: "צורה. צבע. מסר.",
  },
  {
    id: "horizon",
    name: "Horizon",
    category: "realestate",
    categoryLabel: "נדל״ן",
    niche: "real-estate",
    description:
      "תבנית נדל״ן פנורמית: פאנלים אופקיים רחבים, חול-פחם, 6 עמודים מורכבים.",
    badge: "Premium",
    accent: "#b8956b",
    bg: "#f7f3ed",
    text: "#1c1c1c",
    tagline: "Real Estate",
    heroLine: "נוף שמשנה החלטות.",
  },
  {
    id: "ledger",
    name: "Ledger",
    category: "finance",
    categoryLabel: "פיננסים וחשבונאות",
    niche: "accounting-finance",
    description:
      "תבנית פיננסית: גריד טבלאי, ירוק-קרם, 5 עמודים עם סקשנים מובנים וברורים.",
    badge: "חדש",
    accent: "#0d5c45",
    bg: "#f6f3ea",
    text: "#102018",
    tagline: "Finance & Accounting",
    heroLine: "מספרים עם הקשר עסקי.",
  },
  {
    id: "kinetic",
    name: "Kinetic",
    category: "fitness",
    categoryLabel: "כושר וספורט",
    niche: "fitness-gym",
    description:
      "תבנית כושר קinetic: פסים אדומים-שחורים, תנועה אגרסיבית, 5 עמודים עם סקשנים רבים.",
    badge: "חדש",
    accent: "#ff2d2d",
    bg: "#0b0b0b",
    text: "#ffffff",
    tagline: "Fitness Studio",
    heroLine: "תנועה שמייצרת תוצאות.",
  },
  {
    id: "citadel",
    name: "Citadel",
    category: "technology",
    categoryLabel: "סייבר ואבטחה",
    niche: "cybersecurity",
    description:
      "תבנית סייבר: אסתטיקת טרמינל, ירוק מatrix, 6 עמודים עם אנימציות סcan וכניסות.",
    badge: "Premium",
    accent: "#39ff14",
    bg: "#030a06",
    text: "#d7ffd9",
    tagline: "Cybersecurity",
    heroLine: "הגנה שמתחילה בקו הקוד.",
  },
];

function pascal(id) {
  return id.charAt(0).toUpperCase() + id.slice(1);
}

function write(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

for (const t of TEMPLATES) {
  const dir = path.join(ROOT, t.id);
  const P = pascal(t.id);
  const pages = t.id === "ledger" || t.id === "kinetic" || t.id === "framehaus"
    ? ["home", "about", "services", "work", "contact"]
    : ["home", "about", "services", "work", "insights", "contact"];

  const pagesExport = pages
    .map((id) => {
      const labels = {
        home: "בית",
        about: "אודות",
        services: "שירותים",
        work: t.id === "framehaus" ? "גלריה" : t.id === "horizon" ? "נכסים" : "פרויקטים",
        insights: "תובנות",
        contact: "צור קשר",
      };
      const slugs = {
        home: "/",
        about: "/about",
        services: "/services",
        work: t.id === "horizon" ? "/properties" : "/work",
        insights: "/insights",
        contact: "/contact",
      };
      return `  { id: "${id}", label: "${labels[id]}", slug: "${slugs[id]}" }`;
    })
    .join(",\n");

  write(
    path.join(dir, "defaultData.ts"),
    `export const ${t.id}DefaultData = {
  templateId: "${t.id}",
  name: "${t.name}",
  brandName: "${t.name}",
  logoText: "${t.name.slice(0, 2).toUpperCase()}",
  tagline: "${t.tagline}",
  navHome: "בית",
  navAbout: "אודות",
  navServices: "שירותים",
  navWork: "${t.id === "framehaus" ? "גלריה" : t.id === "horizon" ? "נכסים" : "פרויקטים"}",
  ${pages.includes("insights") ? 'navInsights: "תובנות",' : ""}
  navContact: "צור קשר",
  heroEyebrow: "${t.tagline}",
  heroTitle: "${t.heroLine}",
  heroSubtitle: "תבנית רב-עמודית עם סקשנים מורכבים, פינות ישרות, תנועה וכניסות — מוכנה לעריכה מלאה בעורך.",
  heroPrimaryButton: "לשיחת ייעוץ",
  heroSecondaryButton: "לפרויקטים",
  heroImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1800&q=85",
  statOne: "120+",
  statOneLabel: "פרויקטים",
  statTwo: "18",
  statTwoLabel: "שנות ניסיון",
  statThree: "96%",
  statThreeLabel: "שביעות רצון",
  statFour: "24/7",
  statFourLabel: "זמינות",
  aboutEyebrow: "אודות",
  aboutTitle: "גישה מקצועית. ביצוע מדויק. תוצאה מדידה.",
  aboutText: "אנחנו בונים חוויות דיגיטליות ועסקיות עם מבנה ברור, שפה חדה ותהליך שקוף — מהאסטרטגיה ועד המסירה.",
  aboutImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85",
  servicesEyebrow: "שירותים",
  servicesTitle: "מעטפת שירותים שמכסה את כל הצרכים.",
  serviceOneTitle: "אסטרטגיה",
  serviceOneText: "מיפוי מטרות, קהלים ומסלולי צמיחה עם KPI ברורים.",
  serviceTwoTitle: "יישום",
  serviceTwoText: "ביצוע מדויק עם לוחות זמנים, שלבים ומדידה שוטפת.",
  serviceThreeTitle: "ליווי",
  serviceThreeText: "ניהול שוטף, אופטימיזציה ושיפור מתמיד של הביצועים.",
  serviceFourTitle: "מדידה",
  serviceFourText: "דוחות, תובנות והמלצות שמבוססות על נתונים אמיתיים.",
  workEyebrow: "${t.id === "framehaus" ? "גלריה" : t.id === "horizon" ? "נכסים" : "פרויקטים"}",
  workTitle: "עבודות שנבחרו בקפידה.",
  workOneTitle: "פרויקט Alpha",
  workOneText: "ליווי מלא מתכנון ועד מסירה עם תוצאה מדידה.",
  workTwoTitle: "פרויקט Beta",
  workTwoText: "מערכת רב-ערוצית עם חוויית משתמש חדה.",
  workThreeTitle: "פרויקט Gamma",
  workThreeText: "פתרון מותאם עם דגש על ביצועים וסקייל.",
  ${pages.includes("insights") ? 'insightsEyebrow: "תובנות",' : ""}
  ${pages.includes("insights") ? 'insightsTitle: "ידע, ניתוח ופרסpectives",' : ""}
  ${pages.includes("insights") ? 'insightOneTitle: "מגמות 2026",' : ""}
  ${pages.includes("insights") ? 'insightOneText: "מה משתנה בשוק ואיך להתכונן מראש.",' : ""}
  ${pages.includes("insights") ? 'insightTwoTitle: "מסגרת עבודה",' : ""}
  ${pages.includes("insights") ? 'insightTwoText: "תהליך בן 4 שלבים שמייצר תוצאות עקביות.",' : ""}
  processEyebrow: "תהליך",
  processTitle: "4 שלבים. תוצאה אחת ברורה.",
  processOneTitle: "אבחון",
  processOneText: "הבנת מצב, מטרות ואילוצים.",
  processTwoTitle: "תכנון",
  processTwoText: "בניית מפת דרכים ו-KPI.",
  processThreeTitle: "ביצוע",
  processThreeText: "יישום מדורג עם בקרה.",
  processFourTitle: "אופטימיזציה",
  processFourText: "שיפור מתמיד על בסיס נתונים.",
  contactEyebrow: "צור קשר",
  contactTitle: "בואו נבנה את השלב הבא.",
  contactText: "השאירו פרטים ונחזור עם תשובה מקצועית ומהירה.",
  contactButton: "שליחת פנייה",
  phone: "03-000-0000",
  email: "hello@${t.id}.co.il",
  address: "תל אביב, ישראל",
  footerText: "תבנית ${t.name} — אתר רב-עמודי מקצועי עם עיצוב מלבני ותנועה.",
  ctaTitle: "מוכנים להתחיל?",
  ctaText: "קבעו שיחת ייעוץ ונבנה יחד את הצעד הבא.",
  ctaButton: "לתיאום שיחה",
};
`,
  );

  write(
    path.join(dir, "editorCss.ts"),
    `import { rectEditorCssBase } from "../shared/rectEditorCssBase";

export const ${t.id}EditorCss = \`
\${rectEditorCssBase}

[data-template-id="${t.id}"] .${t.id}-hero-grid {
  background-image: linear-gradient(${t.accent}22 1px, transparent 1px), linear-gradient(90deg, ${t.accent}22 1px, transparent 1px);
  background-size: 56px 56px;
}

[data-template-id="${t.id}"] .${t.id}-accent-bar {
  background: ${t.accent};
}

[data-template-id="${t.id}"] .${t.id}-marquee-item {
  border-color: ${t.accent}44;
}
\`;
`,
  );

  write(
    path.join(dir, "schema.ts"),
    `export const ${t.id}Schema = {
  templateId: "${t.id}",
  name: "${t.name}",
  fields: [
    { key: "brandName", label: "שם המותג", type: "text" },
    { key: "heroTitle", label: "כותרת הירו", type: "textarea" },
    { key: "heroSubtitle", label: "תת-כותרת", type: "textarea" },
    { key: "heroImage", label: "תמונת הירו", type: "image" },
    { key: "aboutTitle", label: "כותרת אודות", type: "textarea" },
    { key: "aboutText", label: "טקסט אודות", type: "textarea" },
    { key: "servicesTitle", label: "כותרת שירותים", type: "textarea" },
    { key: "contactTitle", label: "כותרת יצירת קשר", type: "textarea" },
    { key: "phone", label: "טלפון", type: "text" },
    { key: "email", label: "אימייל", type: "text" },
  ],
};
`,
  );

  write(
    path.join(dir, "preview.tsx"),
    `import React from "react";
import ${P}Pages from "./pages";

export default function ${P}Preview() {
  return (
    <div dir="rtl" data-template-id="${t.id}-preview" className="min-h-screen w-full" style={{ background: "${t.bg}", overflowX: "hidden" }}>
      <${P}Pages initialPage="home" mode="preview" />
    </div>
  );
}
`,
  );

  write(
    path.join(dir, "thumbnail.tsx"),
    `import React from "react";

export default function ${P}Thumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden p-5" style={{ background: "${t.bg}", color: "${t.text}" }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center text-xs font-black" style={{ background: "${t.accent}", color: "${t.bg}" }}>
            ${t.name.slice(0, 2).toUpperCase()}
          </div>
          <span className="text-sm font-bold">${t.name}</span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "${t.accent}" }}>
          ${t.tagline}
        </span>
      </div>
      <div className="mt-10">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em]" style={{ color: "${t.accent}" }}>
          ${t.tagline}
        </p>
        <h3 className="max-w-[220px] text-2xl font-black leading-tight">${t.heroLine}</h3>
        <div className="mt-6 grid grid-cols-3 gap-0 border" style={{ borderColor: "${t.accent}33" }}>
          {[["120+", "פרויקטים"], ["18", "שנים"], ["96%", "שביעות"]].map(([n, l]) => (
            <div key={l} className="border px-2 py-3" style={{ borderColor: "${t.accent}33" }}>
              <div className="text-sm font-black">{n}</div>
              <div className="text-[9px] opacity-60">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
`,
  );

  write(
    path.join(dir, "meta.ts"),
    `import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import ${P}Pages, { ${t.id}Pages } from "./pages";
import ${P}Preview from "./preview";
import ${P}Thumbnail from "./thumbnail";
import { ${t.id}EditorCss } from "./editorCss";
import { ${t.id}Schema } from "./schema";
import { ${t.id}DefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "${t.accent}",
  secondary: "${t.text}",
  accent: "${t.accent}",
  background: "${t.bg}",
  surface: "${t.bg}",
  text: "${t.text}",
  muted: "${t.text}99",
  dark: "${t.text}",
};

export const ${t.id}Seed = {
  id: "${t.id}",
  key: "${t.id}",
  name: "${t.name}",
  title: "${t.name}",
  description: "${t.description}",
  category: "${t.category}",
  categoryLabel: "${t.categoryLabel}",
  niche: "${t.niche}",
  layout: "full",
  image: (${t.id}DefaultData as Record<string, any>).heroImage,
  heroTitle: (${t.id}DefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (${t.id}DefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "rect-nav", title: "Header" },
    { type: "hero", variant: "rect-split", title: "Hero" },
    { type: "stats", variant: "rect-grid", title: "Stats" },
    { type: "services", variant: "rect-columns", title: "Services" },
    { type: "work", variant: "rect-gallery", title: "Work" },
    { type: "process", variant: "rect-steps", title: "Process" },
    { type: "contact", variant: "rect-form", title: "Contact" },
    { type: "footer", variant: "rect-footer", title: "Footer" },
  ].map((block, index) => ({ id: \`${t.id}-\${index + 1}-\${block.type}\`, ...block })),
  pages: ${t.id}Pages,
  editor: { pages: ${t.id}Pages, css: ${t.id}EditorCss },
  css: ${t.id}EditorCss,
  data: ${t.id}DefaultData,
  defaultData: ${t.id}DefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const ${t.id}Template = {
  id: "${t.id}",
  key: "${t.id}",
  name: "${t.name}",
  title: "${t.name}",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "${t.category}",
  categoryLabel: "${t.categoryLabel}",
  badge: "${t.badge}",
  description: "${t.description}",
  thumbnail: React.createElement(${P}Thumbnail),
  preview: React.createElement(${P}Preview),
  component: ${P}Pages,
  Component: ${P}Pages,
  seed: ${t.id}Seed,
  pages: ${t.id}Pages,
  editorCss: ${t.id}EditorCss,
  schema: ${t.id}Schema,
  defaultData: ${t.id}DefaultData,
  renderer: {
    key: "${t.id}",
    name: "${t.name}",
    Component: ${P}Pages,
    component: ${P}Pages,
    pages: ${t.id}Pages,
    editorMode: "visual-react",
    editorCss: ${t.id}EditorCss,
    schema: ${t.id}Schema,
    defaultData: ${t.id}DefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default ${t.id}Template;
`,
  );

  // pages.tsx will be written separately with unique layouts
  console.log(`Generated boilerplate for ${t.id}`);
}

console.log("Done. pages.tsx files need to be created.");
