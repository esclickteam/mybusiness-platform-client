#!/usr/bin/env node
/**
 * Scaffolds 10 wow landing templates (meta/preview/schema + index/registry wiring).
 * pages/defaultData/editorCss/thumbnail are filled by follow-up writers.
 */
import fs from "fs";
import path from "path";

const ROOT = path.resolve("src/components/site-builder/studio/data/templates");

const TEMPLATES = [
  { id: "archora", name: "Archora", niche: "architecture", tagline: "אדריכלות", badge: "Premium",
    palette: { primary: "#D4FF00", secondary: "#111111", accent: "#F0FF66", background: "#111111", surface: "#1A1A1A", text: "#F5F5F0", muted: "#9A9A92", dark: "#0A0A0A" } },
  { id: "dentelle", name: "Dentelle", niche: "dental", tagline: "רפואת שיניים", badge: "חדש",
    palette: { primary: "#2DD4BF", secondary: "#F8FAFC", accent: "#5EEAD4", background: "#F8FAFC", surface: "#FFFFFF", text: "#0F172A", muted: "#64748B", dark: "#0B1220" } },
  { id: "aurayoga", name: "Aurayoga", niche: "yoga", tagline: "יוגה וולנס", badge: "חדש",
    palette: { primary: "#A78BFA", secondary: "#1C1526", accent: "#C4B5FD", background: "#1C1526", surface: "#2A2036", text: "#F5F0FF", muted: "#B7A9C9", dark: "#120E18" } },
  { id: "soundline", name: "Soundline", niche: "music", tagline: "בית ספר למוזיקה", badge: "Premium",
    palette: { primary: "#FF4D6D", secondary: "#0B0B12", accent: "#FF8FA3", background: "#0B0B12", surface: "#151522", text: "#F7F7FB", muted: "#9B9BB0", dark: "#05050A" } },
  { id: "pawhaus", name: "Pawhaus", niche: "pets", tagline: "טיפול בחיות", badge: "חדש",
    palette: { primary: "#F59E0B", secondary: "#1C1917", accent: "#FBBF24", background: "#FAF7F2", surface: "#FFFFFF", text: "#1C1917", muted: "#78716C", dark: "#0C0A09" } },
  { id: "atelierx", name: "Atelier X", niche: "fashion", tagline: "בוטיק אופנה", badge: "Premium",
    palette: { primary: "#111111", secondary: "#FAFAFA", accent: "#E11D48", background: "#FAFAFA", surface: "#FFFFFF", text: "#111111", muted: "#737373", dark: "#0A0A0A" } },
  { id: "brewline", name: "Brewline", niche: "cafe", tagline: "בית קפה", badge: "חדש",
    palette: { primary: "#8B5E3C", secondary: "#1A1410", accent: "#C4A484", background: "#1A1410", surface: "#241C16", text: "#F6EFE6", muted: "#B3A294", dark: "#0E0A08" } },
  { id: "autovolt", name: "Autovolt", niche: "auto-detailing", tagline: "דיטיילינג רכב", badge: "Premium",
    palette: { primary: "#38BDF8", secondary: "#0A0F14", accent: "#7DD3FC", background: "#0A0F14", surface: "#111821", text: "#E8F1F8", muted: "#8AA0B3", dark: "#05080C" } },
  { id: "neuralis", name: "Neuralis", niche: "ai-tech", tagline: "AI וטכנולוגיה", badge: "חדש",
    palette: { primary: "#22D3EE", secondary: "#050816", accent: "#67E8F9", background: "#050816", surface: "#0B1224", text: "#E8F7FF", muted: "#8BA3B8", dark: "#02040A" } },
  { id: "florique", name: "Florique", niche: "florist", tagline: "עיצוב פרחים", badge: "חדש",
    palette: { primary: "#E11D8C", secondary: "#FFF7FB", accent: "#F472B6", background: "#FFF7FB", surface: "#FFFFFF", text: "#3B1028", muted: "#9D6B85", dark: "#1F0A16" } },
];

function pascal(id) {
  return id.split(/[-_\s]/).map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join("");
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (!fs.existsSync(file)) fs.writeFileSync(file, content, "utf8");
}

for (const t of TEMPLATES) {
  const P = pascal(t.id);
  const dir = path.join(ROOT, t.id);
  const p = t.palette;

  write(path.join(dir, "defaultData.ts"), `export const ${t.id}DefaultData = {
  templateId: "${t.id}",
  name: "${t.name}",
  brandName: "${t.name}",
  logoText: "${t.name.slice(0, 1)}",
  heroEyebrow: "${t.tagline}",
  heroTitle: "${t.name}",
  heroSubtitle: "תבנית דף נחיתה מקצועית.",
  heroPrimaryButton: "צרו קשר",
  heroSecondaryButton: "למידע",
  heroImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2200&q=90",
  contactTitle: "צרו קשר",
  contactText: "השאירו פרטים ונחזור אליכם.",
  contactButton: "שליחה",
  phone: "03-000-0000",
  email: "hello@${t.id}.co.il",
  address: "תל אביב",
  ctaTitle: "מוכנים להתחיל?",
  ctaText: "בואו נדבר.",
  ctaButton: "תיאום שיחה",
};
`);

  write(path.join(dir, "editorCss.ts"), `export const ${t.id}EditorCss = \`
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap');
[data-template-id="${t.id}"], [data-template-id="${t.id}-preview"] {
  --p: ${p.primary}; --bg: ${p.background}; --surface: ${p.surface}; --text: ${p.text}; --muted: ${p.muted}; --dark: ${p.dark};
  font-family: "Outfit", sans-serif; color: var(--text); background: var(--bg);
}
\`;
`);

  write(path.join(dir, "schema.ts"), `export const ${t.id}Schema = {
  templateId: "${t.id}",
  name: "${t.name}",
  fields: [
    { key: "brandName", label: "שם המותג", type: "text" },
    { key: "heroTitle", label: "כותרת הירו", type: "textarea" },
    { key: "heroImage", label: "תמונת הירו", type: "image" },
    { key: "phone", label: "טלפון", type: "text" },
    { key: "email", label: "אימייל", type: "text" },
  ],
};
`);

  write(path.join(dir, "preview.tsx"), `import React from "react";
import ${P}Pages from "./pages";
export default function ${P}Preview() {
  return (
    <div dir="rtl" data-template-id="${t.id}-preview" className="min-h-screen w-full" style={{ background: "${p.background}", overflowX: "hidden" }}>
      <${P}Pages initialPage="home" mode="preview" />
    </div>
  );
}
`);

  write(path.join(dir, "thumbnail.tsx"), `import React from "react";
export default function ${P}Thumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden p-5" style={{ background: "${p.background}", color: "${p.text}" }}>
      <div className="text-xs uppercase tracking-[0.2em]" style={{ color: "${p.primary}" }}>${t.tagline}</div>
      <h3 className="mt-6 text-3xl font-bold">${t.name}</h3>
    </div>
  );
}
`);

  write(path.join(dir, "pages.tsx"), `import React, { useMemo } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { ${t.id}DefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { ${t.id}EditorCss } from "./editorCss";

export const ${t.id}Pages = [{ id: "home", label: "בית", slug: "/" }];

export default function ${P}Pages({ initialPage = "home", mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode, page, pageId, initialPageId, activePageId, currentPageId }: any) {
  const mergedData = useMemo(() => ({ ...${t.id}DefaultData, ...(data ?? {}) }), [data]);
  const { currentPage } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages: ["home"], fallbackPage: "home" },
  );
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "${t.id}-preview" : "${t.id}"} className="min-h-screen w-full overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: ${t.id}EditorCss }} />
      <VisualPageStack activePageId={currentPage} pages={[{ id: "home", content: (
        <section data-template-section-type="hero" className="grid min-h-screen place-items-center px-6">
          <div className="text-center">
            <p className="text-sm tracking-[0.3em]" style={{ color: "var(--p)" }}>{mergedData.heroEyebrow}</p>
            <h1 className="mt-4 text-5xl font-bold">{mergedData.heroTitle}</h1>
            <p className="mt-4 text-[var(--muted)]">{mergedData.heroSubtitle}</p>
          </div>
        </section>
      ) }]} />
    </div>
  );
}
`);

  write(path.join(dir, "meta.ts"), `import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import ${P}Pages, { ${t.id}Pages } from "./pages";
import ${P}Preview from "./preview";
import ${P}Thumbnail from "./thumbnail";
import { ${t.id}EditorCss } from "./editorCss";
import { ${t.id}Schema } from "./schema";
import { ${t.id}DefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = ${JSON.stringify(t.palette, null, 2)};

export const ${t.id}Seed = {
  id: "${t.id}",
  key: "${t.id}",
  name: "${t.name}",
  title: "${t.name}",
  description: "דף נחיתה מקצועי לתחום ${t.tagline} עם תנועה, אפקטים ועיצוב ייחודי.",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  niche: "${t.niche}",
  layout: "full",
  image: (${t.id}DefaultData as any).heroImage,
  heroTitle: (${t.id}DefaultData as any).heroTitle,
  heroSubtitle: (${t.id}DefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "${t.id}-header", title: "header" },
    { type: "hero", variant: "${t.id}-hero", title: "hero" },
    { type: "services", variant: "${t.id}-services", title: "services" },
    { type: "showcase", variant: "${t.id}-showcase", title: "showcase" },
    { type: "stats", variant: "${t.id}-stats", title: "stats" },
    { type: "process", variant: "${t.id}-process", title: "process" },
    { type: "testimonials", variant: "${t.id}-testimonials", title: "testimonials" },
    { type: "faq", variant: "${t.id}-faq", title: "faq" },
    { type: "contact", variant: "${t.id}-contact", title: "contact" },
    { type: "footer", variant: "${t.id}-footer", title: "footer" },
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
  priceLabel: "כלול",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  badge: "${t.badge}",
  description: "דף נחיתה מקצועי לתחום ${t.tagline} עם תנועה, אפקטים ועיצוב ייחודי.",
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
`);

  console.log("scaffolded", t.id);
}

// Wire index.ts
const indexPath = path.join(ROOT, "index.ts");
let index = fs.readFileSync(indexPath, "utf8");
const imports = TEMPLATES.map((t) => `import { ${t.id}Template } from "./${t.id}/meta";`).join("\n");
const entries = TEMPLATES.map((t) => `  ${t.id}Template,`).join("\n");
if (!index.includes("archoraTemplate")) {
  index = index.replace(
    'import { vowlineTemplate } from "./vowline/meta";',
    'import { vowlineTemplate } from "./vowline/meta";\n' + imports,
  );
  index = index.replace(
    "  vowlineTemplate,\n",
    "  vowlineTemplate,\n" + entries + "\n",
  );
  fs.writeFileSync(indexPath, index, "utf8");
  console.log("index.ts updated");
}

// Wire registry
const regPath = path.join(ROOT, "templateRendererRegistry.ts");
let reg = fs.readFileSync(regPath, "utf8");
if (!reg.includes('from "./archora/pages"')) {
  const importBlock = TEMPLATES.map((t) => {
    const P = pascal(t.id);
    return `
import ${P}Pages, { ${t.id}Pages } from "./${t.id}/pages";
import { ${t.id}EditorCss } from "./${t.id}/editorCss";
import { ${t.id}Schema } from "./${t.id}/schema";
import { ${t.id}DefaultData } from "./${t.id}/defaultData";
`;
  }).join("");
  reg = reg.replace(
    'import { vowlineDefaultData } from "./vowline/defaultData";',
    'import { vowlineDefaultData } from "./vowline/defaultData";' + importBlock,
  );

  const entryBlock = TEMPLATES.map((t) => {
    const P = pascal(t.id);
    return `  ${t.id}: createRenderer({
    key: "${t.id}",
    name: "${t.name}",
    Component: ${P}Pages,
    pages: ${t.id}Pages,
    editorMode: "visual-react",
    schema: ${t.id}Schema as unknown as StudioTemplateRenderer["schema"],
    defaultData: ${t.id}DefaultData as unknown as Record<string, any>,
    editorCss: ${t.id}EditorCss,
  }),
`;
  }).join("\n");

  reg = reg.replace(
    `  vowline: createRenderer({
    key: "vowline",
    name: "Vowline",
    Component: VowlinePages,
    pages: vowlinePages,
    editorMode: "visual-react",
    schema: vowlineSchema as unknown as StudioTemplateRenderer["schema"],
    defaultData: vowlineDefaultData as unknown as Record<string, any>,
    editorCss: vowlineEditorCss,
  }),`,
    `  vowline: createRenderer({
    key: "vowline",
    name: "Vowline",
    Component: VowlinePages,
    pages: vowlinePages,
    editorMode: "visual-react",
    schema: vowlineSchema as unknown as StudioTemplateRenderer["schema"],
    defaultData: vowlineDefaultData as unknown as Record<string, any>,
    editorCss: vowlineEditorCss,
  }),
${entryBlock}`,
  );
  fs.writeFileSync(regPath, reg, "utf8");
  console.log("registry updated");
}

console.log("Done scaffolding", TEMPLATES.length, "templates");
