#!/usr/bin/env node
/**
 * Generates 5 unique landing page templates (category: landing / דפי נחיתה)
 * Each with 10 distinct sections, different niche, design, colors, content.
 * Run: node scripts/generate-landing-templates.mjs
 */
import fs from "fs";
import path from "path";

const ROOT = path.resolve("src/components/site-builder/studio/data/templates");

const TEMPLATES = [
  {
    id: "verdant",
    name: "Verdant",
    logo: "V",
    niche: "realestate",
    category: "landing",
    categoryLabel: "דפי נחיתה",
    badge: "חדש",
    description:
      "דף נחיתה יוקרתי לנדל״ן: הירו קולנועי, נכסים נבחרים, סוכנים, סיורים וירטואליים ועיצוב קרם-זהב עריכתי.",
    palette: {
      primary: "#B8956B",
      secondary: "#1C1C1C",
      accent: "#D4AF7A",
      background: "#F7F3ED",
      surface: "#FFFFFF",
      text: "#1C1C1C",
      muted: "#6B6560",
      dark: "#0F0E0C",
    },
    bg: "#F7F3ED",
    accent: "#B8956B",
    text: "#1C1C1C",
    fontClass: "font-serif",
    tagline: "נדל״ן יוקרה",
    heroLine: "הבית שמחכה לכם כבר כאן.",
    heroImage:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=85",
    blocks: [
      "header", "hero", "properties", "stats", "agents", "virtual-tour",
      "testimonials", "process", "contact", "footer",
    ],
    copy: {
      brandName: "Verdant",
      heroEyebrow: "נדל״ן יוקרה · תל אביב והמרכז",
      heroTitle: "הבית שמחכה לכם\nכבר כאן.",
      heroSubtitle:
        "Verdant מלווה אתכם בבחירת הנכס המושלם — מפנטהאוזים עם נוף לים ועד וילות פרטיות עם גינה. ליווי אישי, שקיפות מלאה.",
      heroPrimaryButton: "לנכסים נבחרים",
      heroSecondaryButton: "תיאום סיור",
      statOne: "₪2.4B", statOneLabel: "נכסים שנמכרו",
      statTwo: "340+", statTwoLabel: "לקוחות מרוצים",
      statThree: "15", statThreeLabel: "שנות ניסיון",
      sectionTwoTitle: "נכסים שנבחרו בקפידה",
      sectionThreeTitle: "מספרים שמדברים בעד עצמם",
      sectionFourTitle: "הצוות שלכם לכל שלב",
      sectionFiveTitle: "סיור וירטואלי 360°",
      sectionSixTitle: "לקוחות מספרים",
      sectionSevenTitle: "הדרך לנכס החלומות",
      sectionEightTitle: "בואו נמצא את הבית הבא",
      ctaTitle: "מוכנים לגלות את הנכס הבא?",
      ctaButton: "תיאום פגישה",
      phone: "03-777-8899",
      email: "hello@verdant.co.il",
      address: "רוטשילד 45, תל אביב",
    },
    style: "luxury-editorial",
  },
  {
    id: "savory",
    name: "Savory",
    logo: "S",
    niche: "restaurant",
    category: "landing",
    categoryLabel: "דפי נחיתה",
    badge: "Premium",
    description:
      "דף נחיתה למסעדת שף: הירו עם טופס הזמנה, תפריט, סיפור השף, גaleria, ביקורות ואירועים — עיצוב חם טרקוטה.",
    palette: {
      primary: "#C45C26",
      secondary: "#2D1810",
      accent: "#E8A849",
      background: "#FAF6F0",
      surface: "#FFF9F2",
      text: "#2D1810",
      muted: "#8B7355",
      dark: "#1A0F0A",
    },
    bg: "#FAF6F0",
    accent: "#C45C26",
    text: "#2D1810",
    fontClass: "font-sans",
    tagline: "מסעדת שף",
    heroLine: "טעם שמספר סיפור.",
    heroImage:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=2000&q=85",
    blocks: [
      "header", "hero", "menu", "chef", "gallery", "reviews",
      "events", "hours", "reservation", "footer",
    ],
    copy: {
      brandName: "Savory",
      heroEyebrow: "מסעדת שף · מטבח ים-תיכוני",
      heroTitle: "טעם שמספר\nסיפור.",
      heroSubtitle:
        "Savory מגישה חוויה קולינרית שלמה — מרכיבים מקומיים, תפריט עונתי ואווירה שמזמינה להישאר. הזמינו שולחן עוד הערב.",
      heroPrimaryButton: "הזמנת שולחן",
      heroSecondaryButton: "לתפריט",
      statOne: "4.9", statOneLabel: "דירוג Google",
      statTwo: "12", statTwoLabel: "שנות פעילות",
      statThree: "800+", statThreeLabel: "מנות בשבוע",
      sectionTwoTitle: "מהמטבח שלנו",
      sectionThreeTitle: "השף מאחורי הטעם",
      sectionFourTitle: "החוויה במקום",
      sectionFiveTitle: "מה אומרים עלינו",
      sectionSixTitle: "אירועים ואירוח פרטי",
      sectionSevenTitle: "שעות פתיחה ומיקום",
      sectionEightTitle: "שמרו מקום לערב מיוחד",
      ctaTitle: "הערב מתחיל כאן.",
      ctaButton: "הזמנה אונליין",
      phone: "03-555-1234",
      email: "reserve@savory.co.il",
      address: "נחלת בנימין 8, תל אביב",
    },
    style: "warm-rustic",
  },
  {
    id: "luminelle",
    name: "Luminelle",
    logo: "L",
    niche: "beauty",
    category: "landing",
    categoryLabel: "דפי נחיתה",
    badge: "חדש",
    description:
      "דף נחיתה לסalon יופי: הירו אלגנטי, טיפולים, לפני/אחרי, מוצרים, צוות מעצבים, FAQ וטופס תור — ורוד-שמפניה רך.",
    palette: {
      primary: "#D4A5A5",
      secondary: "#3D2C2E",
      accent: "#F5E6E0",
      background: "#FDF8F6",
      surface: "#FFFFFF",
      text: "#3D2C2E",
      muted: "#9B8585",
      dark: "#2A1F21",
    },
    bg: "#FDF8F6",
    accent: "#D4A5A5",
    text: "#3D2C2E",
    fontClass: "font-sans",
    tagline: "יופי וטיפוח",
    heroLine: "היופי שמתחיל מבפנים.",
    heroImage:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=2000&q=85",
    blocks: [
      "header", "hero", "treatments", "transform", "products", "team",
      "pricing", "faq", "booking", "footer",
    ],
    copy: {
      brandName: "Luminelle",
      heroEyebrow: "סalon יופי · טיפוח מתקדם",
      heroTitle: "היופי שמתחיל\nמבפנים.",
      heroSubtitle:
        "Luminelle מציעה חוויית טיפוח יוקרתית — עיצוב שיער, טיפולי פנים, מניקור ומוצרים פרימיום. כל פרט מותאם אליכם.",
      heroPrimaryButton: "קביעת תור",
      heroSecondaryButton: "לטיפולים",
      statOne: "8K+", statOneLabel: "לקוחות קבועות",
      statTwo: "25", statTwoLabel: "טיפולים",
      statThree: "5★", statThreeLabel: "דירוג ממוצע",
      sectionTwoTitle: "הטיפולים שלנו",
      sectionThreeTitle: "השינוי שאתם מחפשות",
      sectionFourTitle: "מוצרים נבחרים",
      sectionFiveTitle: "הצוות שלנו",
      sectionSixTitle: "חבילות ומחירים",
      sectionSevenTitle: "שאלות נפוצות",
      sectionEightTitle: "קבעו תור עוד היום",
      ctaTitle: "זמן לפנק את עצמכן.",
      ctaButton: "לקביעת תור",
      phone: "03-444-5566",
      email: "hello@luminelle.co.il",
      address: "דיזנגoff 120, תל אביב",
    },
    style: "soft-spa",
  },
  {
    id: "vitalcare",
    name: "Vitalcare",
    logo: "VC",
    niche: "health",
    category: "landing",
    categoryLabel: "דפי נחיתה",
    badge: "Premium",
    description:
      "דף נחיתה למרפאה: הירו עם תור, התמחויות, צוות רופאים, ביטוחים, ביקורות מטופלים, FAQ רפואי וטופס — כחול-לבן קlinי.",
    palette: {
      primary: "#0EA5E9",
      secondary: "#0C4A6E",
      accent: "#38BDF8",
      background: "#F0F9FF",
      surface: "#FFFFFF",
      text: "#0C4A6E",
      muted: "#64748B",
      dark: "#082F49",
    },
    bg: "#F0F9FF",
    accent: "#0EA5E9",
    text: "#0C4A6E",
    fontClass: "font-sans",
    tagline: "רפואה ובריאות",
    heroLine: "בריאות שמבוססת על אמון.",
    heroImage:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=2000&q=85",
    blocks: [
      "header", "hero", "specialties", "stats", "doctors", "insurance",
      "testimonials", "faq", "appointment", "footer",
    ],
    copy: {
      brandName: "Vitalcare",
      heroEyebrow: "מרפאה רב-תחומית · תל אביב",
      heroTitle: "בריאות שמבוססת\nעל אמון.",
      heroSubtitle:
        "Vitalcare מספקת טיפול רפואי מקיף עם צוות מומחים, ציוד מתקדם וגישה אישית. קבעו תור בקלות — אנחנו כאן בשבילכם.",
      heroPrimaryButton: "קביעת תור",
      heroSecondaryButton: "להתמחויות",
      statOne: "50K+", statOneLabel: "מטופלים",
      statTwo: "22", statTwoLabel: "רופאים",
      statThree: "98%", statThreeLabel: "שביעות רצון",
      sectionTwoTitle: "התמחויות רפואיות",
      sectionThreeTitle: "נתונים שמעידים על איכות",
      sectionFourTitle: "צוות הרופאים שלנו",
      sectionFiveTitle: "קופות חולים וביטוחים",
      sectionSixTitle: "מטופלים מספרים",
      sectionSevenTitle: "שאלות נפוצות",
      sectionEightTitle: "קבעו תור עוד היום",
      ctaTitle: "הבריאות שלכם בראש סדר העדיפויות.",
      ctaButton: "לקביעת תור",
      phone: "03-999-8877",
      email: "info@vitalcare.co.il",
      address: "אבן גבירול 30, תל אביב",
    },
    style: "clinical-clean",
  },
  {
    id: "handcraft",
    name: "Handcraft",
    logo: "H",
    niche: "homeservices",
    category: "landing",
    categoryLabel: "דפי נחיתה",
    badge: "חדש",
    description:
      "דף נחיתה לשירותי בית: הירו עם טלפון בולט, שירותים, לפני/אחרי, מחירון, אזורי שירות, ביקורות וקריאה דחופה — כתום-א industrial.",
    palette: {
      primary: "#F97316",
      secondary: "#1C1917",
      accent: "#FB923C",
      background: "#FAFAF9",
      surface: "#FFFFFF",
      text: "#1C1917",
      muted: "#78716C",
      dark: "#0C0A09",
    },
    bg: "#FAFAF9",
    accent: "#F97316",
    text: "#1C1917",
    fontClass: "font-sans",
    tagline: "שירותים לבית",
    heroLine: "עובדים קשה. אתם נחים.",
    heroImage:
      "https://images.unsplash.com/photo-1504149922370-179725a09289?auto=format&fit=crop&w=2000&q=85",
    blocks: [
      "header", "hero", "services", "before-after", "why-us", "pricing",
      "areas", "reviews", "emergency", "footer",
    ],
    copy: {
      brandName: "Handcraft",
      heroEyebrow: "שירותי בית · אינסטלציה · חשמל · שיפוצים",
      heroTitle: "עובדים קשה.\nאתם נחים.",
      heroSubtitle:
        "Handcraft מספקת שירותי בית מקצועיים — אינסטלators מורשים, חשמלאים מוסמכים וצוות שיפוצים מנוסה. זמינות 24/7 לקריאות דחופות.",
      heroPrimaryButton: "קריאת שירות",
      heroSecondaryButton: "לשירותים",
      statOne: "15K+", statOneLabel: "קריאות שטופלו",
      statTwo: "45", statTwoLabel: "טכנאים",
      statThree: "24/7", statThreeLabel: "זמינות",
      sectionTwoTitle: "מה אנחנו עושים",
      sectionThreeTitle: "לפני ואחרי — עבודות אמיתיות",
      sectionFourTitle: "למה לבחור בנו",
      sectionFiveTitle: "מחירון שקוף",
      sectionSixTitle: "אזורי שירות",
      sectionSevenTitle: "לקוחות ממליצים",
      sectionEightTitle: "קריאה דחופה? אנחנו כאן.",
      ctaTitle: "בעיה בבית? נפתור אותה היום.",
      ctaButton: "התקשרו עכשיו",
      phone: "1-800-HANDCRAFT",
      email: "service@handcraft.co.il",
      address: "כל הארץ · מרכז וגוש דן",
    },
    style: "industrial-bold",
  },
];

function pascal(id) {
  return id.charAt(0).toUpperCase() + id.slice(1);
}

function write(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

function generateDefaultData(t) {
  const c = t.copy;
  return `export const ${t.id}DefaultData = {
  templateId: "${t.id}",
  name: "${t.name}",
  brandName: "${c.brandName}",
  logoText: "${t.logo}",

  navHome: "בית",
  navServices: "שירותים",
  navAbout: "אודות",
  navContact: "יצירת קשר",

  heroEyebrow: "${c.heroEyebrow}",
  heroTitle: "${c.heroTitle.replace(/\n/g, "\\n")}",
  heroSubtitle: "${c.heroSubtitle}",
  heroPrimaryButton: "${c.heroPrimaryButton}",
  heroSecondaryButton: "${c.heroSecondaryButton}",
  heroImage: "${t.heroImage}",

  heroStatOne: "${c.statOne}",
  heroStatOneLabel: "${c.statOneLabel}",
  heroStatTwo: "${c.statTwo}",
  heroStatTwoLabel: "${c.statTwoLabel}",
  heroStatThree: "${c.statThree}",
  heroStatThreeLabel: "${c.statThreeLabel}",

  sectionTwoTitle: "${c.sectionTwoTitle}",
  sectionThreeTitle: "${c.sectionThreeTitle}",
  sectionFourTitle: "${c.sectionFourTitle}",
  sectionFiveTitle: "${c.sectionFiveTitle}",
  sectionSixTitle: "${c.sectionSixTitle}",
  sectionSevenTitle: "${c.sectionSevenTitle}",
  sectionEightTitle: "${c.sectionEightTitle}",

  itemOneTitle: "פריט ראשון",
  itemOneText: "תיאור מפורט של השירות, הנכס או הטיפול — מותאם לתחום.",
  itemTwoTitle: "פריט שני",
  itemTwoText: "תיאור נוסף עם פרטים רלוונטיים לקהל היעד.",
  itemThreeTitle: "פריט שלישי",
  itemThreeText: "הדגשה של יתרון ייחודי או הצעה מיוחדת.",

  reviewOneText: "שירות מעולה, מקצועי ואמין. ממליצים בחום לכל מי שמחפש איכות.",
  reviewOneName: "דנה כהן",
  reviewOneRole: "לקוחה מרוצה",
  reviewTwoText: "הצוות היה אדיב, מדויק ובזמן. חוויה מצוינת מההתחלה ועד הסוף.",
  reviewTwoName: "יוסי לevi",
  reviewTwoRole: "לקוח קבוע",
  reviewThreeText: "מעל ומעבר לציפיות. בהחלט נחזור שוב ונמליץ לחברים.",
  reviewThreeName: "מיכal אברהם",
  reviewThreeRole: "לקוחה",

  faqOneQuestion: "איך מתחילים?",
  faqOneAnswer: "פשוט צרו קשר דרך הטופס או בטלפון — נחזור אליכם תוך שעות.",
  faqTwoQuestion: "מה שעות הפעילות?",
  faqTwoAnswer: "ראשון–חמישי 08:00–20:00, שישי 08:00–14:00. קריאות דחופות 24/7.",
  faqThreeQuestion: "האם יש אחריות?",
  faqThreeAnswer: "כן, כל השירותים שלנו מגיעים עם אחריות מלאה ושקיפות.",

  contactTitle: "${c.sectionEightTitle}",
  contactText: "השאירו פרטים ונחזור אליכם בהקדם עם מענה מקצועי ומותאם.",
  contactButton: "שליחה",
  phone: "${c.phone}",
  email: "${c.email}",
  address: "${c.address}",

  ctaTitle: "${c.ctaTitle}",
  ctaText: "אל תחכו — הצטרפו לאלפי לקוחות מרוצים שכבר בחרו בנו.",
  ctaButton: "${c.ctaButton}",
};
`;
}

function generateMeta(t) {
  const P = pascal(t.id);
  const blocksArr = t.blocks
    .map((type, i) => `  { type: "${type.replace(/-/g, "_")}", variant: "${t.style}-${type}", title: "${type}" }`)
    .join(",\n");

  return `import React from "react";

import type {
  ReadyWebsitePalette,
  ReadyWebsiteTemplateSeed,
} from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";

import ${P}Pages, { ${t.id}Pages } from "./pages";
import ${P}Preview from "./preview";
import ${P}Thumbnail from "./thumbnail";
import { ${t.id}EditorCss } from "./editorCss";
import { ${t.id}Schema } from "./schema";
import { ${t.id}DefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "${t.palette.primary}",
  secondary: "${t.palette.secondary}",
  accent: "${t.palette.accent}",
  background: "${t.palette.background}",
  surface: "${t.palette.surface}",
  text: "${t.palette.text}",
  muted: "${t.palette.muted}",
  dark: "${t.palette.dark}",
};

const blocks = [
${blocksArr},
];

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
  blocks: blocks.map((block, index) => ({
    id: \`${t.id}-\${index + 1}-\${block.type}\`,
    ...block,
  })),
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
  priceLabel: "כלול",
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
`;
}

function generateSchema(t) {
  return `export const ${t.id}Schema = {
  templateId: "${t.id}",
  name: "${t.name}",
  fields: [
    { key: "brandName", label: "שם המותג", type: "text" },
    { key: "heroTitle", label: "כותרת הירו", type: "textarea" },
    { key: "heroSubtitle", label: "טקסט הירו", type: "textarea" },
    { key: "heroImage", label: "תמונת הירו", type: "image" },
    { key: "heroPrimaryButton", label: "כפתור ראשי", type: "text" },
    { key: "sectionTwoTitle", label: "כותרת סקשן 2", type: "text" },
    { key: "sectionThreeTitle", label: "כותרת סקשן 3", type: "text" },
    { key: "contactTitle", label: "כותרת יצירת קשר", type: "textarea" },
    { key: "phone", label: "טלפון", type: "text" },
    { key: "email", label: "אימייל", type: "text" },
    { key: "ctaTitle", label: "כותרת CTA", type: "textarea" },
    { key: "ctaButton", label: "כפתור CTA", type: "text" },
  ],
};
`;
}

function generateEditorCss(t) {
  return `export const ${t.id}EditorCss = "";
`;
}

function generatePreview(t) {
  const P = pascal(t.id);
  return `import React from "react";
import ${P}Pages from "./pages";

export default function ${P}Preview() {
  return (
    <div
      dir="rtl"
      data-template-id="${t.id}-preview"
      className="min-h-screen w-full"
      style={{ background: "${t.bg}", overflowX: "hidden" }}
    >
      <${P}Pages initialPage="home" mode="preview" />
    </div>
  );
}
`;
}

function generateThumbnail(t) {
  const P = pascal(t.id);
  return `import React from "react";

export default function ${P}Thumbnail() {
  return (
    <div
      dir="rtl"
      className="relative h-full min-h-[260px] w-full overflow-hidden rounded-3xl p-5"
      style={{ background: "${t.bg}", color: "${t.text}" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="grid h-9 w-9 place-items-center rounded-xl text-sm font-bold text-white"
            style={{ background: "${t.accent}" }}
          >
            ${t.logo}
          </div>
          <span className="text-sm font-bold">${t.name}</span>
        </div>
        <span
          className="rounded-full px-3 py-1 text-[10px] font-semibold"
          style={{ background: "${t.accent}22", color: "${t.accent}" }}
        >
          ${t.tagline}
        </span>
      </div>
      <div className="mt-8 text-center">
        <p
          className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em]"
          style={{ color: "${t.accent}" }}
        >
          ${t.tagline}
        </p>
        <h3 className="mx-auto max-w-[220px] text-xl font-bold leading-tight">
          ${t.heroLine}
        </h3>
      </div>
    </div>
  );
}
`;
}

function generatePages(t) {
  const P = pascal(t.id);
  const styleConfig = getStyleConfig(t);

  return `import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { ${t.id}DefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";

export const ${t.id}Pages = [{ id: "home", label: "בית", slug: "/" }];

type ${P}PagesProps = {
  initialPage?: string;
  mode?: "preview" | "edit" | "published";
  data?: Record<string, any>;
  onPageChange?: (pageId: string) => void;
  isPublic?: boolean;
  viewMode?: string;
  runtimeMode?: string;
  page?: string;
  pageId?: string;
  initialPageId?: string;
  activePageId?: string;
  currentPageId?: string;
};

function getValue(data: Record<string, any>, key: string) {
  return data?.[key] ?? (${t.id}DefaultData as Record<string, any>)[key] ?? "";
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

${styleConfig.helpers}

function Header({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <header
      data-visual-flow-lock="true"
      data-template-section-type="header"
      className={cx("sticky top-0 z-50", ${styleConfig.headerClass})}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <div className="flex items-center gap-3">
          <span className={${styleConfig.logoClass}}>{getValue(data, "logoText")}</span>
          <span className={${styleConfig.brandClass}}>{getValue(data, "brandName")}</span>
        </div>
        <button type="button" onClick={openModal} className={${styleConfig.headerBtnClass}}>
          {getValue(data, "heroPrimaryButton")}
        </button>
      </div>
    </header>
  );
}

function Hero({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  const stats = [
    [getValue(data, "heroStatOne"), getValue(data, "heroStatOneLabel")],
    [getValue(data, "heroStatTwo"), getValue(data, "heroStatTwoLabel")],
    [getValue(data, "heroStatThree"), getValue(data, "heroStatThreeLabel")],
  ];
  return (
    <section data-template-section-type="hero" className={${styleConfig.heroSectionClass}}>
      ${styleConfig.heroContent}
      <div className="mt-8 grid grid-cols-3 gap-4">
        {stats.map(([num, label]) => (
          <div key={label} className={${styleConfig.statCardClass}}>
            <div className={${styleConfig.statNumClass}}>{num}</div>
            <div className={${styleConfig.statLabelClass}}>{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionTwo({ data }: { data: Record<string, any> }) {
  const items = [
    [getValue(data, "itemOneTitle"), getValue(data, "itemOneText")],
    [getValue(data, "itemTwoTitle"), getValue(data, "itemTwoText")],
    [getValue(data, "itemThreeTitle"), getValue(data, "itemThreeText")],
  ];
  return (
    <section data-template-section-type="section-2" className={${styleConfig.sectionClass}}>
      <h2 className={${styleConfig.sectionTitleClass}}>{getValue(data, "sectionTwoTitle")}</h2>
      ${styleConfig.sectionTwoLayout}
    </section>
  );
}

function SectionThree({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="section-3" className={${styleConfig.sectionAltClass}}>
      <h2 className={${styleConfig.sectionTitleClass}}>{getValue(data, "sectionThreeTitle")}</h2>
      ${styleConfig.sectionThreeLayout}
    </section>
  );
}

function SectionFour({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="section-4" className={${styleConfig.sectionClass}}>
      <h2 className={${styleConfig.sectionTitleClass}}>{getValue(data, "sectionFourTitle")}</h2>
      ${styleConfig.sectionFourLayout}
    </section>
  );
}

function SectionFive({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="section-5" className={${styleConfig.sectionAltClass}}>
      <h2 className={${styleConfig.sectionTitleClass}}>{getValue(data, "sectionFiveTitle")}</h2>
      ${styleConfig.sectionFiveLayout}
    </section>
  );
}

function SectionSix({ data }: { data: Record<string, any> }) {
  const reviews = [
    [getValue(data, "reviewOneText"), getValue(data, "reviewOneName"), getValue(data, "reviewOneRole")],
    [getValue(data, "reviewTwoText"), getValue(data, "reviewTwoName"), getValue(data, "reviewTwoRole")],
    [getValue(data, "reviewThreeText"), getValue(data, "reviewThreeName"), getValue(data, "reviewThreeRole")],
  ];
  return (
    <section data-template-section-type="section-6" className={${styleConfig.sectionClass}}>
      <h2 className={${styleConfig.sectionTitleClass}}>{getValue(data, "sectionSixTitle")}</h2>
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {reviews.map(([text, name, role], i) => (
          <article key={i} className={${styleConfig.reviewCardClass}}>
            <p className="text-base leading-8">"{text}"</p>
            <div className="mt-5 border-t pt-4">
              <p className="font-bold">{name}</p>
              <p className="text-sm opacity-60">{role}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function SectionSeven({ data }: { data: Record<string, any> }) {
  const [open, setOpen] = useState(0);
  const faqs = [
    [getValue(data, "faqOneQuestion"), getValue(data, "faqOneAnswer")],
    [getValue(data, "faqTwoQuestion"), getValue(data, "faqTwoAnswer")],
    [getValue(data, "faqThreeQuestion"), getValue(data, "faqThreeAnswer")],
  ];
  return (
    <section data-template-section-type="section-7" className={${styleConfig.sectionAltClass}}>
      <h2 className={${styleConfig.sectionTitleClass}}>{getValue(data, "sectionSevenTitle")}</h2>
      <div className="mx-auto mt-10 max-w-3xl space-y-3">
        {faqs.map(([q, a], i) => (
          <div key={q} className={${styleConfig.faqItemClass}}>
            <button type="button" onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between gap-4 p-5 text-right">
              <span className="font-bold">{q}</span>
              <span className={${styleConfig.faqToggleClass}}>{open === i ? "−" : "+"}</span>
            </button>
            {open === i ? <p className="px-5 pb-5 text-sm leading-7 opacity-70">{a}</p> : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionEight({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section data-template-section-type="section-8" className={${styleConfig.sectionClass}}>
      <div className={${styleConfig.contactWrapClass}}>
        <div>
          <h2 className={${styleConfig.sectionTitleClass}}>{getValue(data, "contactTitle")}</h2>
          <p className="mt-4 opacity-70">{getValue(data, "contactText")}</p>
          <div className="mt-6 space-y-2 text-sm">
            <p><strong>טלפון:</strong> {getValue(data, "phone")}</p>
            <p><strong>אימייל:</strong> {getValue(data, "email")}</p>
            <p><strong>כתובת:</strong> {getValue(data, "address")}</p>
          </div>
        </div>
        <form className={${styleConfig.formClass}}>
          <input className={${styleConfig.inputClass}} placeholder="שם מלא" />
          <input className={${styleConfig.inputClass}} placeholder="טלפון" />
          <input className={${styleConfig.inputClass}} placeholder="אימייל" />
          <button type="button" onClick={openModal} className={${styleConfig.primaryBtnClass}}>
            {getValue(data, "contactButton")}
          </button>
        </form>
      </div>
    </section>
  );
}

function Footer({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <footer data-template-section-type="footer" className={${styleConfig.footerClass}}>
      <div className={${styleConfig.footerInnerClass}}>
        <h2 className="text-3xl font-bold md:text-4xl">{getValue(data, "ctaTitle")}</h2>
        <p className="mt-4 opacity-80">{getValue(data, "ctaText")}</p>
        <button type="button" onClick={openModal} className={cx("mt-8", ${styleConfig.primaryBtnClass})}>
          {getValue(data, "ctaButton")}
        </button>
      </div>
      <div className="mx-auto mt-8 max-w-7xl border-t pt-6 text-center text-sm opacity-50">
        © {new Date().getFullYear()} {getValue(data, "brandName")} · ${t.name}
      </div>
    </footer>
  );
}

function ContactModal({ data, open, onClose }: { data: Record<string, any>; open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/60 px-4 backdrop-blur-sm">
      <div className={${styleConfig.modalClass}}>
        <button type="button" onClick={onClose} className="absolute left-4 top-4 text-2xl">×</button>
        <h3 className="text-2xl font-bold">{getValue(data, "contactTitle")}</h3>
        <form className="mt-6 grid gap-3">
          <input className={${styleConfig.inputClass}} placeholder="שם מלא" />
          <input className={${styleConfig.inputClass}} placeholder="טלפון" />
          <button type="button" className={${styleConfig.primaryBtnClass}}>{getValue(data, "contactButton")}</button>
        </form>
      </div>
    </div>
  );
}

function HomePage({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <>
      <Hero data={data} openModal={openModal} />
      <SectionTwo data={data} />
      <SectionThree data={data} />
      <SectionFour data={data} />
      <SectionFive data={data} />
      <SectionSix data={data} />
      <SectionSeven data={data} />
      <SectionEight data={data} openModal={openModal} />
      <Footer data={data} openModal={openModal} />
    </>
  );
}

export default function ${P}Pages({ initialPage = "home", mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode, page, pageId, initialPageId, activePageId, currentPageId }: ${P}PagesProps) {
  const mergedData = useMemo(() => ({ ...${t.id}DefaultData, ...(data ?? {}) }), [data]);
  const { currentPage } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages: ["home"], fallbackPage: "home" },
  );
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div
      dir="rtl"
      data-template-id={mode === "preview" ? "${t.id}-preview" : "${t.id}"}
      className={cx("min-h-screen w-full overflow-x-hidden", ${styleConfig.rootClass})}
    >
      <Header data={mergedData} openModal={() => setModalOpen(true)} />
      <VisualPageStack
        activePageId={currentPage}
        pages={[{ id: "home", content: <HomePage data={mergedData} openModal={() => setModalOpen(true)} /> }]}
      />
      <ContactModal data={mergedData} open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
`;
}

function getStyleConfig(t) {
  const configs = {
    verdant: {
      rootClass: '"bg-[#F7F3ED] font-serif text-[#1C1C1C]"',
      headerClass: '"border-b border-[#B8956B]/20 bg-[#F7F3ED]/95 backdrop-blur-md"',
      logoClass: '"grid h-10 w-10 place-items-center rounded-none border-2 border-[#B8956B] text-lg font-bold text-[#B8956B]"',
      brandClass: '"text-xl font-bold tracking-wide"',
      headerBtnClass: '"hidden rounded-none border-2 border-[#B8956B] bg-[#B8956B] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1C1C1C] sm:inline-flex"',
      heroSectionClass: '"relative px-5 py-20 lg:px-8 lg:py-32"',
      heroContent: `<div className="mx-auto grid max-w-7xl items-end gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#B8956B]">{getValue(data, "heroEyebrow")}</p>
          <h1 className="whitespace-pre-line text-5xl font-bold leading-[1.05] md:text-7xl">{getValue(data, "heroTitle")}</h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-[#6B6560]">{getValue(data, "heroSubtitle")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={openModal} className="border-2 border-[#B8956B] bg-[#B8956B] px-8 py-3.5 text-sm font-semibold text-white">{getValue(data, "heroPrimaryButton")}</button>
            <button type="button" className="border-2 border-[#1C1C1C] px-8 py-3.5 text-sm font-semibold">{getValue(data, "heroSecondaryButton")}</button>
          </div>
        </div>
        <div className="overflow-hidden">
          <img src={getValue(data, "heroImage")} alt="" className="h-[480px] w-full object-cover" />
        </div>
      </div>`,
      statCardClass: '"border border-[#B8956B]/30 bg-white p-5 text-center"',
      statNumClass: '"text-3xl font-bold text-[#B8956B]"',
      statLabelClass: '"mt-1 text-xs text-[#6B6560]"',
      sectionClass: '"px-5 py-20 lg:px-8 lg:py-28"',
      sectionAltClass: '"bg-white px-5 py-20 lg:px-8 lg:py-28"',
      sectionTitleClass: '"text-center text-4xl font-bold md:text-5xl"',
      sectionTwoLayout: `<div className="mx-auto mt-12 grid max-w-7xl gap-6 md:grid-cols-3">
        {items.map(([title, text]) => (
          <article key={title} className="group overflow-hidden border border-[#B8956B]/20 bg-white transition hover:shadow-xl">
            <div className="h-48 bg-gradient-to-br from-[#B8956B]/20 to-[#F7F3ED]" />
            <div className="p-6">
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-[#6B6560]">{text}</p>
              <p className="mt-4 text-sm font-bold text-[#B8956B]">₪4,200,000 · 5 חד׳ · 180 מ״ר</p>
            </div>
          </article>
        ))}
      </div>`,
      sectionThreeLayout: `<div className="mx-auto mt-12 grid max-w-5xl grid-cols-3 gap-8 text-center">
        {[["₪2.4B","נכסים שנמכרו"],["340+","לקוחות"],["15","שנות ניסיון"]].map(([n,l]) => (
          <div key={l}><div className="text-5xl font-bold text-[#B8956B]">{n}</div><div className="mt-2 text-sm text-[#6B6560]">{l}</div></div>
        ))}
      </div>`,
      sectionFourLayout: `<div className="mx-auto mt-12 grid max-w-5xl gap-8 md:grid-cols-3">
        {["שרה מ.", "דוד ר.", "מaya ל."].map((name, i) => (
          <div key={name} className="text-center">
            <div className="mx-auto h-32 w-32 rounded-full bg-gradient-to-br from-[#B8956B] to-[#D4AF7A]" />
            <h3 className="mt-4 text-lg font-bold">{name}</h3>
            <p className="text-sm text-[#6B6560]">סוכן/ת נדל״ן בכיר/ה</p>
          </div>
        ))}
      </div>`,
      sectionFiveLayout: `<div className="mx-auto mt-12 max-w-4xl overflow-hidden border border-[#B8956B]/30">
        <div className="grid lg:grid-cols-2">
          <div className="flex flex-col justify-center bg-[#1C1C1C] p-10 text-white">
            <p className="text-xs uppercase tracking-[0.2em] text-[#B8956B]">360° Virtual Tour</p>
            <h3 className="mt-4 text-2xl font-bold">סיירו בנכס מהבית</h3>
            <p className="mt-3 text-sm text-white/70">חוויה אינטראקטיבית מלאה — כל חדר, כל זווית.</p>
            <button type="button" className="mt-6 w-fit border border-[#B8956B] px-6 py-3 text-sm font-semibold text-[#B8956B]">התחל סיור</button>
          </div>
          <div className="h-64 bg-gradient-to-br from-[#B8956B]/40 to-[#F7F3ED] lg:h-auto" />
        </div>
      </div>`,
      reviewCardClass: '"border border-[#B8956B]/20 bg-[#F7F3ED] p-8"',
      faqItemClass: '"border border-[#B8956B]/20 bg-white"',
      faqToggleClass: '"grid h-8 w-8 place-items-center border border-[#B8956B] text-[#B8956B]"',
      contactWrapClass: '"mx-auto grid max-w-7xl gap-10 lg:grid-cols-2"',
      formClass: '"grid gap-4 rounded-none border border-[#B8956B]/20 bg-white p-8"',
      inputClass: '"rounded-none border border-[#B8956B]/30 px-5 py-4 text-right outline-none focus:border-[#B8956B]"',
      primaryBtnClass: '"w-full border-2 border-[#B8956B] bg-[#B8956B] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#1C1C1C]"',
      footerClass: '"px-5 pb-10 lg:px-8"',
      footerInnerClass: '"mx-auto max-w-7xl border-2 border-[#B8956B] bg-[#1C1C1C] p-10 text-center text-white lg:p-16"',
      modalClass: '"relative w-full max-w-md border-2 border-[#B8956B] bg-white p-8"',
      helpers: "",
    },
    savory: {
      rootClass: '"bg-[#FAF6F0] font-sans text-[#2D1810]"',
      headerClass: '"border-b border-[#C45C26]/15 bg-[#FAF6F0]/95 backdrop-blur-md"',
      logoClass: '"grid h-10 w-10 place-items-center rounded-full bg-[#C45C26] text-lg font-bold text-white"',
      brandClass: '"font-serif text-2xl font-bold italic"',
      headerBtnClass: '"hidden rounded-full bg-[#C45C26] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2D1810] sm:inline-flex"',
      heroSectionClass: '"px-5 py-16 lg:px-8 lg:py-24"',
      heroContent: `<div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl">
          <img src={getValue(data, "heroImage")} alt="" className="h-[420px] w-full object-cover" />
        </div>
        <div className="rounded-3xl bg-[#2D1810] p-10 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E8A849]">{getValue(data, "heroEyebrow")}</p>
          <h1 className="mt-4 whitespace-pre-line font-serif text-5xl font-bold leading-tight md:text-6xl">{getValue(data, "heroTitle")}</h1>
          <p className="mt-5 text-white/70">{getValue(data, "heroSubtitle")}</p>
          <div className="mt-8 grid gap-3">
            <input className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-white placeholder:text-white/50" placeholder="תאריך" />
            <input className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-white placeholder:text-white/50" placeholder="מספר אורחים" />
            <button type="button" onClick={openModal} className="rounded-xl bg-[#C45C26] py-3.5 font-semibold">{getValue(data, "heroPrimaryButton")}</button>
          </div>
        </div>
      </div>`,
      statCardClass: '"rounded-2xl bg-[#2D1810]/5 p-5 text-center"',
      statNumClass: '"text-3xl font-bold text-[#C45C26]"',
      statLabelClass: '"mt-1 text-xs text-[#8B7355]"',
      sectionClass: '"px-5 py-20 lg:px-8 lg:py-28"',
      sectionAltClass: '"bg-[#2D1810] px-5 py-20 text-white lg:px-8 lg:py-28"',
      sectionTitleClass: '"text-center font-serif text-4xl font-bold md:text-5xl"',
      sectionTwoLayout: `<div className="mx-auto mt-12 grid max-w-4xl gap-0 divide-y divide-[#C45C26]/20 border border-[#C45C26]/20">
        {items.map(([title, text], i) => (
          <article key={title} className="flex items-center justify-between gap-6 p-6">
            <div><h3 className="text-xl font-bold">{title}</h3><p className="mt-1 text-sm text-[#8B7355]">{text}</p></div>
            <span className="font-serif text-2xl font-bold text-[#C45C26]">₪{[89,124,68][i]}</span>
          </article>
        ))}
      </div>`,
      sectionThreeLayout: `<div className="mx-auto mt-12 grid max-w-7xl items-center gap-10 lg:grid-cols-2">
        <div className="h-80 rounded-3xl bg-gradient-to-br from-[#C45C26]/30 to-[#E8A849]/20" />
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#E8A849]">השף</p>
          <h3 className="mt-4 font-serif text-3xl font-bold">אChef יonathan לevy</h3>
          <p className="mt-4 leading-8 text-white/70">15 שנות ניסיון במסעדות מichelin ברחבי אירופה. מביא לישראל את הטעמים האותנטיים של הים התיכון.</p>
        </div>
      </div>`,
      sectionFourLayout: `<div className="mx-auto mt-12 grid max-w-7xl grid-cols-2 gap-3 md:grid-cols-4">
        {[1,2,3,4].map((n) => (
          <div key={n} className={cx("rounded-2xl bg-gradient-to-br from-[#C45C26]/20 to-[#E8A849]/10", n === 1 ? "col-span-2 row-span-2 h-64" : "h-32")} />
        ))}
      </div>`,
      sectionFiveLayout: `<div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-[#C45C26]/20 bg-[#FAF6F0] p-10 text-center text-[#2D1810]">
        <div className="text-[#E8A849]">★★★★★</div>
        <p className="mt-4 font-serif text-xl italic">"חוויה קולינרית שלא שוכחים"</p>
        <p className="mt-4 text-sm text-[#8B7355]">אירועים פרטיים · עד 40 אורחים · תפריט מותאם</p>
        <button type="button" className="mt-6 rounded-full bg-[#C45C26] px-8 py-3 font-semibold text-white">פרטים נוספים</button>
      </div>`,
      reviewCardClass: '"rounded-3xl bg-[#FAF6F0] p-8 text-[#2D1810]"',
      faqItemClass: '"rounded-2xl bg-[#FAF6F0]/10"',
      faqToggleClass: '"grid h-8 w-8 place-items-center rounded-full bg-[#C45C26] text-white"',
      contactWrapClass: '"mx-auto grid max-w-7xl gap-10 lg:grid-cols-2"',
      formClass: '"grid gap-4 rounded-3xl bg-[#FAF6F0] p-8 text-[#2D1810]"',
      inputClass: '"rounded-xl border border-[#C45C26]/20 px-5 py-4 text-right outline-none focus:border-[#C45C26]"',
      primaryBtnClass: '"w-full rounded-xl bg-[#C45C26] px-7 py-4 text-sm font-semibold text-white"',
      footerClass: '"px-5 pb-10 lg:px-8"',
      footerInnerClass: '"mx-auto max-w-7xl rounded-3xl bg-[#C45C26] p-10 text-center text-white lg:p-16"',
      modalClass: '"relative w-full max-w-md rounded-3xl bg-white p-8 text-[#2D1810]"',
      helpers: "",
    },
    luminelle: {
      rootClass: '"bg-[#FDF8F6] font-sans text-[#3D2C2E]"',
      headerClass: '"bg-[#FDF8F6]/80 backdrop-blur-xl"',
      logoClass: '"grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#D4A5A5] to-[#F5E6E0] text-sm font-bold text-[#3D2C2E]"',
      brandClass: '"text-xl font-light tracking-[0.15em] uppercase"',
      headerBtnClass: '"hidden rounded-full bg-gradient-to-r from-[#D4A5A5] to-[#c49090] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#D4A5A5]/30 sm:inline-flex"',
      heroSectionClass: '"relative px-5 py-24 text-center lg:px-8 lg:py-36"',
      heroContent: `<div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#F5E6E0]/60 to-transparent" />
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#D4A5A5]">{getValue(data, "heroEyebrow")}</p>
        <h1 className="mx-auto max-w-3xl whitespace-pre-line text-5xl font-light leading-[1.1] md:text-7xl">{getValue(data, "heroTitle")}</h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-[#9B8585]">{getValue(data, "heroSubtitle")}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={openModal} className="rounded-full bg-gradient-to-r from-[#D4A5A5] to-[#c49090] px-8 py-3.5 text-sm font-semibold text-white shadow-lg">{getValue(data, "heroPrimaryButton")}</button>
          <button type="button" className="rounded-full border border-[#D4A5A5]/40 px-8 py-3.5 text-sm font-semibold">{getValue(data, "heroSecondaryButton")}</button>
        </div>
        <div className="mx-auto mt-14 max-w-2xl overflow-hidden rounded-[40px] shadow-2xl shadow-[#D4A5A5]/20">
          <img src={getValue(data, "heroImage")} alt="" className="h-72 w-full object-cover md:h-96" />
        </div>`,
      statCardClass: '"rounded-[28px] bg-white p-5 text-center shadow-sm"',
      statNumClass: '"text-3xl font-light text-[#D4A5A5]"',
      statLabelClass: '"mt-1 text-xs text-[#9B8585]"',
      sectionClass: '"px-5 py-20 lg:px-8 lg:py-28"',
      sectionAltClass: '"bg-gradient-to-b from-[#F5E6E0]/40 to-transparent px-5 py-20 lg:px-8 lg:py-28"',
      sectionTitleClass: '"text-center text-4xl font-light md:text-5xl"',
      sectionTwoLayout: `<div className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-3">
        {items.map(([title, text]) => (
          <article key={title} className="rounded-[32px] bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-4 h-1 w-12 rounded-full bg-gradient-to-r from-[#D4A5A5] to-[#F5E6E0]" />
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-7 text-[#9B8585]">{text}</p>
            <p className="mt-4 text-sm font-semibold text-[#D4A5A5]">מ-₪180</p>
          </article>
        ))}
      </div>`,
      sectionThreeLayout: `<div className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-2">
        <div className="rounded-[32px] bg-[#9B8585]/20 p-2"><div className="flex h-64 items-center justify-center rounded-[28px] bg-[#e8ddd8] text-sm text-[#9B8585]">לפני</div></div>
        <div className="rounded-[32px] bg-[#D4A5A5]/20 p-2"><div className="flex h-64 items-center justify-center rounded-[28px] bg-gradient-to-br from-[#F5E6E0] to-[#D4A5A5]/30 text-sm font-semibold text-[#3D2C2E]">אחרי ✨</div></div>
      </div>`,
      sectionFourLayout: `<div className="mx-auto mt-12 flex max-w-4xl flex-wrap justify-center gap-6">
        {["Kerastase","Olaplex","Moroccanoil","Davines"].map((brand) => (
          <div key={brand} className="rounded-[24px] border border-[#D4A5A5]/20 bg-white px-8 py-6 text-center shadow-sm">
            <p className="font-semibold">{brand}</p><p className="mt-1 text-xs text-[#9B8585]">מוצר פרימיום</p>
          </div>
        ))}
      </div>`,
      sectionFiveLayout: `<div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-3">
        {["נועה","שירה","מaya"].map((name) => (
          <div key={name} className="text-center">
            <div className="mx-auto h-28 w-28 overflow-hidden rounded-full bg-gradient-to-br from-[#D4A5A5] to-[#F5E6E0]" />
            <h3 className="mt-4 font-semibold">{name}</h3>
            <p className="text-sm text-[#9B8585]">מעצב/ת ראשי/ת</p>
          </div>
        ))}
      </div>`,
      reviewCardClass: '"rounded-[28px] bg-white p-8 shadow-sm"',
      faqItemClass: '"overflow-hidden rounded-[24px] bg-white shadow-sm"',
      faqToggleClass: '"grid h-8 w-8 place-items-center rounded-full bg-[#D4A5A5]/20 text-[#D4A5A5]"',
      contactWrapClass: '"mx-auto grid max-w-5xl gap-10 lg:grid-cols-2"',
      formClass: '"grid gap-4 rounded-[32px] bg-white p-8 shadow-lg"',
      inputClass: '"rounded-2xl border border-[#D4A5A5]/20 px-5 py-4 text-right outline-none focus:border-[#D4A5A5]"',
      primaryBtnClass: '"w-full rounded-full bg-gradient-to-r from-[#D4A5A5] to-[#c49090] px-7 py-4 text-sm font-semibold text-white"',
      footerClass: '"px-5 pb-10 lg:px-8"',
      footerInnerClass: '"mx-auto max-w-5xl rounded-[40px] bg-gradient-to-r from-[#D4A5A5] to-[#c49090] p-10 text-center text-white lg:p-16"',
      modalClass: '"relative w-full max-w-md rounded-[32px] bg-white p-8 shadow-2xl"',
      helpers: "",
    },
    vitalcare: {
      rootClass: '"bg-[#F0F9FF] font-sans text-[#0C4A6E]"',
      headerClass: '"border-b-2 border-[#0EA5E9]/20 bg-white shadow-sm"',
      logoClass: '"grid h-10 w-10 place-items-center rounded-lg bg-[#0EA5E9] text-xs font-bold text-white"',
      brandClass: '"text-xl font-bold text-[#0C4A6E]"',
      headerBtnClass: '"hidden rounded-lg bg-[#0EA5E9] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0C4A6E] sm:inline-flex"',
      heroSectionClass: '"bg-white px-5 py-16 lg:px-8 lg:py-24"',
      heroContent: `<div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-lg bg-[#0EA5E9]/10 px-3 py-1.5 text-xs font-semibold text-[#0EA5E9]">✓ מרפאה מוסמכת</span>
          <h1 className="mt-5 whitespace-pre-line text-4xl font-bold leading-tight md:text-6xl">{getValue(data, "heroTitle")}</h1>
          <p className="mt-5 text-lg leading-8 text-[#64748B]">{getValue(data, "heroSubtitle")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={openModal} className="rounded-lg bg-[#0EA5E9] px-8 py-3.5 text-sm font-semibold text-white">{getValue(data, "heroPrimaryButton")}</button>
            <button type="button" className="rounded-lg border-2 border-[#0EA5E9] px-8 py-3.5 text-sm font-semibold text-[#0EA5E9]">{getValue(data, "heroSecondaryButton")}</button>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl shadow-xl">
          <img src={getValue(data, "heroImage")} alt="" className="h-[400px] w-full object-cover" />
        </div>
      </div>`,
      statCardClass: '"rounded-xl border border-[#0EA5E9]/15 bg-white p-5 text-center shadow-sm"',
      statNumClass: '"text-3xl font-bold text-[#0EA5E9]"',
      statLabelClass: '"mt-1 text-xs text-[#64748B]"',
      sectionClass: '"px-5 py-20 lg:px-8 lg:py-28"',
      sectionAltClass: '"bg-white px-5 py-20 lg:px-8 lg:py-28"',
      sectionTitleClass: '"text-center text-3xl font-bold md:text-4xl"',
      sectionTwoLayout: `<div className="mx-auto mt-12 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {["רפואת משפחה","אורthopedיה","עור ואסתטיקה","ילדים"].map((spec) => (
          <div key={spec} className="flex items-center gap-4 rounded-xl border border-[#0EA5E9]/15 bg-white p-5 shadow-sm">
            <span className="grid h-12 w-12 place-items-center rounded-lg bg-[#0EA5E9]/10 text-xl">⚕</span>
            <span className="font-semibold">{spec}</span>
          </div>
        ))}
      </div>`,
      sectionThreeLayout: `<div className="mx-auto mt-12 grid max-w-5xl grid-cols-3 gap-6">
        {[["50K+","מטופלים"],["22","רופאים"],["98%","שביעות רצון"]].map(([n,l]) => (
          <div key={l} className="rounded-2xl bg-[#0EA5E9] p-8 text-center text-white">
            <div className="text-4xl font-bold">{n}</div><div className="mt-2 text-sm text-white/80">{l}</div>
          </div>
        ))}
      </div>`,
      sectionFourLayout: `<div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
        {["ד״ר אבי כהן","ד״ר מירי לevy","ד״ר רון שapira"].map((name) => (
          <div key={name} className="rounded-xl border border-[#0EA5E9]/15 bg-[#F0F9FF] p-6 text-center">
            <div className="mx-auto h-24 w-24 rounded-full bg-[#0EA5E9]/20" />
            <h3 className="mt-4 font-bold">{name}</h3>
            <p className="text-sm text-[#64748B]">מומחה/ית רפואית</p>
          </div>
        ))}
      </div>`,
      sectionFiveLayout: `<div className="mx-auto mt-12 flex max-w-4xl flex-wrap justify-center gap-8 opacity-70">
        {["כללית","מaccabi","מאוחדת","לאומית","פרטי"].map((ins) => (
          <span key={ins} className="rounded-lg border border-[#0EA5E9]/20 bg-white px-6 py-3 text-sm font-semibold">{ins}</span>
        ))}
      </div>`,
      reviewCardClass: '"rounded-xl border border-[#0EA5E9]/15 bg-white p-8 shadow-sm"',
      faqItemClass: '"overflow-hidden rounded-xl border border-[#0EA5E9]/15 bg-white"',
      faqToggleClass: '"grid h-8 w-8 place-items-center rounded-lg bg-[#0EA5E9] text-white"',
      contactWrapClass: '"mx-auto grid max-w-7xl gap-10 rounded-2xl bg-white p-8 shadow-lg lg:grid-cols-2 lg:p-12"',
      formClass: '"grid gap-4"',
      inputClass: '"rounded-lg border border-[#0EA5E9]/20 px-5 py-4 text-right outline-none focus:border-[#0EA5E9]"',
      primaryBtnClass: '"w-full rounded-lg bg-[#0EA5E9] px-7 py-4 text-sm font-semibold text-white"',
      footerClass: '"px-5 pb-10 lg:px-8"',
      footerInnerClass: '"mx-auto max-w-7xl rounded-2xl bg-[#0C4A6E] p-10 text-center text-white lg:p-16"',
      modalClass: '"relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl"',
      helpers: "",
    },
    handcraft: {
      rootClass: '"bg-[#FAFAF9] font-sans text-[#1C1917]"',
      headerClass: '"border-b-4 border-[#F97316] bg-[#1C1917] text-white"',
      logoClass: '"grid h-10 w-10 place-items-center bg-[#F97316] text-lg font-black text-white"',
      brandClass: '"text-xl font-black uppercase tracking-tight"',
      headerBtnClass: '"hidden bg-[#F97316] px-5 py-2.5 text-sm font-black uppercase text-white sm:inline-flex"',
      heroSectionClass: '"relative overflow-hidden px-5 py-16 lg:px-8 lg:py-24"',
      heroContent: `<div className="absolute inset-0 -z-10 bg-[#1C1917]" />
        <div className="absolute right-0 top-0 -z-10 h-full w-1/2 skew-x-[-8deg] bg-[#F97316]/10" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
          <div className="text-white">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-[#F97316]">{getValue(data, "heroEyebrow")}</p>
            <h1 className="whitespace-pre-line text-5xl font-black leading-[0.95] md:text-7xl">{getValue(data, "heroTitle")}</h1>
            <p className="mt-5 max-w-lg text-white/70">{getValue(data, "heroSubtitle")}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button type="button" onClick={openModal} className="bg-[#F97316] px-8 py-4 text-sm font-black uppercase">{getValue(data, "heroPrimaryButton")}</button>
              <a href={"tel:" + getValue(data, "phone")} className="text-2xl font-black text-[#F97316]">{getValue(data, "phone")}</a>
            </div>
          </div>
          <div className="overflow-hidden border-4 border-[#F97316]">
            <img src={getValue(data, "heroImage")} alt="" className="h-[380px] w-full object-cover grayscale hover:grayscale-0 transition duration-500" />
          </div>
        </div>`,
      statCardClass: '"border-2 border-[#F97316] bg-white p-5 text-center"',
      statNumClass: '"text-3xl font-black text-[#F97316]"',
      statLabelClass: '"mt-1 text-xs font-bold uppercase text-[#78716C]"',
      sectionClass: '"px-5 py-20 lg:px-8 lg:py-28"',
      sectionAltClass: '"bg-[#1C1917] px-5 py-20 text-white lg:px-8 lg:py-28"',
      sectionTitleClass: '"text-center text-4xl font-black uppercase md:text-5xl"',
      sectionTwoLayout: `<div className="mx-auto mt-12 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {["אינסטלציה","חשמל","שיפוצים","מיזוג"].map((svc) => (
          <div key={svc} className="group border-2 border-[#1C1917] p-6 transition hover:border-[#F97316] hover:bg-[#F97316] hover:text-white">
            <span className="text-3xl">🔧</span>
            <h3 className="mt-4 text-lg font-black uppercase">{svc}</h3>
          </div>
        ))}
      </div>`,
      sectionThreeLayout: `<div className="mx-auto mt-12 grid max-w-5xl gap-4 lg:grid-cols-2">
        <div className="border-2 border-red-500/50 p-4"><div className="flex h-48 items-center justify-center bg-red-500/10 text-sm font-black uppercase text-red-500">לפני — דליפה</div></div>
        <div className="border-2 border-[#F97316] p-4"><div className="flex h-48 items-center justify-center bg-[#F97316]/10 text-sm font-black uppercase text-[#F97316]">אחרי — תוקן ✓</div></div>
      </div>`,
      sectionFourLayout: `<div className="mx-auto mt-12 max-w-3xl space-y-4">
        {["טכנאים מוסמכים ומבוטחים","מחיר קבוע לפני תחילת עבודה","אחריות מלאה על כל עבודה","זמינות 24/7 לקריאות דחופות"].map((item) => (
          <div key={item} className="flex items-center gap-4 border-l-4 border-[#F97316] bg-white/5 py-3 pl-4">
            <span className="text-[#F97316]">✓</span><span className="font-bold">{item}</span>
          </div>
        ))}
      </div>`,
      sectionFiveLayout: `<div className="mx-auto mt-12 grid max-w-5xl gap-4 md:grid-cols-3">
        {[["קריאה","₪199","ביקור + אבchon"],["תיקון","₪350","עד שעתיים"],["פרויקט","הצעת מחיר","שיפוץ מלא"]].map(([name, price, desc]) => (
          <div key={name} className="border-2 border-[#F97316]/30 bg-[#FAFAF9] p-6 text-[#1C1917]">
            <h3 className="text-lg font-black uppercase">{name}</h3>
            <div className="mt-3 text-3xl font-black text-[#F97316]">{price}</div>
            <p className="mt-2 text-sm text-[#78716C]">{desc}</p>
          </div>
        ))}
      </div>`,
      reviewCardClass: '"border-2 border-[#F97316]/30 bg-[#FAFAF9] p-8 text-[#1C1917]"',
      faqItemClass: '"border-2 border-white/10 bg-white/5"',
      faqToggleClass: '"grid h-8 w-8 place-items-center bg-[#F97316] font-black text-white"',
      contactWrapClass: '"mx-auto grid max-w-7xl gap-10 lg:grid-cols-2"',
      formClass: '"grid gap-4 border-2 border-[#F97316] bg-white p-8 text-[#1C1917]"',
      inputClass: '"border-2 border-[#1C1917]/20 px-5 py-4 text-right outline-none focus:border-[#F97316]"',
      primaryBtnClass: '"w-full bg-[#F97316] px-7 py-4 text-sm font-black uppercase text-white"',
      footerClass: '"px-5 pb-10 lg:px-8"',
      footerInnerClass: '"mx-auto max-w-7xl border-4 border-[#F97316] bg-[#1C1917] p-10 text-center text-white lg:p-16"',
      modalClass: '"relative w-full max-w-md border-4 border-[#F97316] bg-white p-8"',
      helpers: "",
    },
  };

  return configs[t.id];
}

// Generate all templates
for (const t of TEMPLATES) {
  const dir = path.join(ROOT, t.id);
  write(path.join(dir, "defaultData.ts"), generateDefaultData(t));
  write(path.join(dir, "meta.ts"), generateMeta(t));
  write(path.join(dir, "schema.ts"), generateSchema(t));
  write(path.join(dir, "editorCss.ts"), generateEditorCss(t));
  write(path.join(dir, "preview.tsx"), generatePreview(t));
  write(path.join(dir, "thumbnail.tsx"), generateThumbnail(t));
  write(path.join(dir, "pages.tsx"), generatePages(t));
  console.log(`✓ Generated ${t.id}`);
}

// Update index.ts imports
const indexPath = path.join(ROOT, "index.ts");
let indexContent = fs.readFileSync(indexPath, "utf8");

const newImports = TEMPLATES.map(
  (t) => `import { ${t.id}Template } from "./${t.id}/meta";`,
).join("\n");

const newEntries = TEMPLATES.map((t) => `  ${t.id}Template,`).join("\n");

for (const t of TEMPLATES) {
  const importLine = `import { ${t.id}Template } from "./${t.id}/meta";`;
  if (!indexContent.includes(importLine)) {
    indexContent = indexContent.replace(
      'import { fluxoraTemplate } from "./fluxora/meta";',
      `import { fluxoraTemplate } from "./fluxora/meta";\n${newImports}`,
    );
  }
}

if (!indexContent.includes("verdantTemplate")) {
  indexContent = indexContent.replace(
    "  fluxoraTemplate,\n  loteraTemplate,",
    `  fluxoraTemplate,\n${newEntries}\n  loteraTemplate,`,
  );
}

fs.writeFileSync(indexPath, indexContent, "utf8");
console.log("✓ Updated index.ts");
console.log("Done! 5 landing page templates generated.");
