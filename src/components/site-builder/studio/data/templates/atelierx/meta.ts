import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import AtelierxPages, { atelierxPages } from "./pages";
import AtelierxPreview from "./preview";
import AtelierxThumbnail from "./thumbnail";
import { atelierxEditorCss } from "./editorCss";
import { atelierxSchema } from "./schema";
import { atelierxDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  "primary": "#111111",
  "secondary": "#FAFAFA",
  "accent": "#E11D48",
  "background": "#FAFAFA",
  "surface": "#FFFFFF",
  "text": "#111111",
  "muted": "#737373",
  "dark": "#0A0A0A"
};

export const atelierxSeed = {
  id: "atelierx",
  key: "atelierx",
  name: "Atelier X",
  title: "Atelier X",
  description: "דף נחיתה מקצועי לתחום בוטיק אופנה עם תנועה, אפקטים ועיצוב ייחודי.",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  niche: "fashion",
  layout: "full",
  image: (atelierxDefaultData as any).heroImage,
  heroTitle: (atelierxDefaultData as any).heroTitle,
  heroSubtitle: (atelierxDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "atelierx-header", title: "header" },
    { type: "hero", variant: "atelierx-hero", title: "hero" },
    { type: "services", variant: "atelierx-services", title: "services" },
    { type: "showcase", variant: "atelierx-showcase", title: "showcase" },
    { type: "stats", variant: "atelierx-stats", title: "stats" },
    { type: "process", variant: "atelierx-process", title: "process" },
    { type: "testimonials", variant: "atelierx-testimonials", title: "testimonials" },
    { type: "faq", variant: "atelierx-faq", title: "faq" },
    { type: "contact", variant: "atelierx-contact", title: "contact" },
    { type: "footer", variant: "atelierx-footer", title: "footer" },
  ].map((block, index) => ({ id: `atelierx-${index + 1}-${block.type}`, ...block })),
  pages: atelierxPages,
  editor: { pages: atelierxPages, css: atelierxEditorCss },
  css: atelierxEditorCss,
  data: atelierxDefaultData,
  defaultData: atelierxDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const atelierxTemplate = {
  id: "atelierx",
  key: "atelierx",
  name: "Atelier X",
  title: "Atelier X",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  badge: "Premium",
  description: "דף נחיתה מקצועי לתחום בוטיק אופנה עם תנועה, אפקטים ועיצוב ייחודי.",
  thumbnail: React.createElement(AtelierxThumbnail),
  preview: React.createElement(AtelierxPreview),
  component: AtelierxPages,
  Component: AtelierxPages,
  seed: atelierxSeed,
  pages: atelierxPages,
  editorCss: atelierxEditorCss,
  schema: atelierxSchema,
  defaultData: atelierxDefaultData,
  renderer: {
    key: "atelierx",
    name: "Atelier X",
    Component: AtelierxPages,
    component: AtelierxPages,
    pages: atelierxPages,
    editorMode: "visual-react",
    editorCss: atelierxEditorCss,
    schema: atelierxSchema,
    defaultData: atelierxDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default atelierxTemplate;
