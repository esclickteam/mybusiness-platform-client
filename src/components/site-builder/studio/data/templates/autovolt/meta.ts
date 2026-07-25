import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import AutovoltPages, { autovoltPages } from "./pages";
import AutovoltPreview from "./preview";
import AutovoltThumbnail from "./thumbnail";
import { autovoltEditorCss } from "./editorCss";
import { autovoltSchema } from "./schema";
import { autovoltDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  "primary": "#38BDF8",
  "secondary": "#0A0F14",
  "accent": "#7DD3FC",
  "background": "#0A0F14",
  "surface": "#111821",
  "text": "#E8F1F8",
  "muted": "#8AA0B3",
  "dark": "#05080C"
};

export const autovoltSeed = {
  id: "autovolt",
  key: "autovolt",
  name: "Autovolt",
  title: "Autovolt",
  description: "דף נחיתה מקצועי לתחום דיטיילינג רכב עם תנועה, אפקטים ועיצוב ייחודי.",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  niche: "auto-detailing",
  layout: "full",
  image: (autovoltDefaultData as any).heroImage,
  heroTitle: (autovoltDefaultData as any).heroTitle,
  heroSubtitle: (autovoltDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "autovolt-header", title: "header" },
    { type: "hero", variant: "autovolt-hero", title: "hero" },
    { type: "services", variant: "autovolt-services", title: "services" },
    { type: "showcase", variant: "autovolt-showcase", title: "showcase" },
    { type: "stats", variant: "autovolt-stats", title: "stats" },
    { type: "process", variant: "autovolt-process", title: "process" },
    { type: "testimonials", variant: "autovolt-testimonials", title: "testimonials" },
    { type: "faq", variant: "autovolt-faq", title: "faq" },
    { type: "contact", variant: "autovolt-contact", title: "contact" },
    { type: "footer", variant: "autovolt-footer", title: "footer" },
  ].map((block, index) => ({ id: `autovolt-${index + 1}-${block.type}`, ...block })),
  pages: autovoltPages,
  editor: { pages: autovoltPages, css: autovoltEditorCss },
  css: autovoltEditorCss,
  data: autovoltDefaultData,
  defaultData: autovoltDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const autovoltTemplate = {
  id: "autovolt",
  key: "autovolt",
  name: "Autovolt",
  title: "Autovolt",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  badge: "Premium",
  description: "דף נחיתה מקצועי לתחום דיטיילינג רכב עם תנועה, אפקטים ועיצוב ייחודי.",
  thumbnail: React.createElement(AutovoltThumbnail),
  preview: React.createElement(AutovoltPreview),
  component: AutovoltPages,
  Component: AutovoltPages,
  seed: autovoltSeed,
  pages: autovoltPages,
  editorCss: autovoltEditorCss,
  schema: autovoltSchema,
  defaultData: autovoltDefaultData,
  renderer: {
    key: "autovolt",
    name: "Autovolt",
    Component: AutovoltPages,
    component: AutovoltPages,
    pages: autovoltPages,
    editorMode: "visual-react",
    editorCss: autovoltEditorCss,
    schema: autovoltSchema,
    defaultData: autovoltDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default autovoltTemplate;
