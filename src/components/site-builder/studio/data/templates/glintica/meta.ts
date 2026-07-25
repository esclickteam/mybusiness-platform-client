import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import GlinticaPages, { glinticaPages } from "./pages";
import GlinticaPreview from "./preview";
import GlinticaThumbnail from "./thumbnail";
import { glinticaEditorCss } from "./editorCss";
import { glinticaSchema } from "./schema";
import { glinticaDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#D4A0A7",
  secondary: "#1F1A1C",
  accent: "#E8C4C8",
  background: "#1F1A1C",
  surface: "#2A2326",
  text: "#F8F1F2",
  muted: "#B5A6A9",
  dark: "#120E10",
};

const blocks = [
  { type: "header", variant: "roseNoir-header", title: "header" },
  { type: "hero", variant: "roseNoir-hero", title: "hero" },
  { type: "services", variant: "roseNoir-services", title: "services" },
  { type: "stats", variant: "roseNoir-stats", title: "stats" },
  { type: "showcase", variant: "roseNoir-showcase", title: "showcase" },
  { type: "process", variant: "roseNoir-process", title: "process" },
  { type: "testimonials", variant: "roseNoir-testimonials", title: "testimonials" },
  { type: "faq", variant: "roseNoir-faq", title: "faq" },
  { type: "contact", variant: "roseNoir-contact", title: "contact" },
  { type: "footer", variant: "roseNoir-footer", title: "footer" },
];

export const glinticaSeed = {
  id: "glintica",
  key: "glintica",
  name: "Glintica",
  title: "Glintica",
  description: "דף נחיתה למאפרת: הירו זוהר, שירותי איפור, גלריה, חבילות כלות וטופס הזמנה.",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  niche: "makeup",
  layout: "full",
  image: (glinticaDefaultData as Record<string, any>).heroImage,
  heroTitle: (glinticaDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (glinticaDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({ id: `glintica-${index + 1}-${block.type}`, ...block })),
  pages: glinticaPages,
  editor: { pages: glinticaPages, css: glinticaEditorCss },
  css: glinticaEditorCss,
  data: glinticaDefaultData,
  defaultData: glinticaDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const glinticaTemplate = {
  id: "glintica",
  key: "glintica",
  name: "Glintica",
  title: "Glintica",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  badge: "חדש",
  description: "דף נחיתה למאפרת: הירו זוהר, שירותי איפור, גלריה, חבילות כלות וטופס הזמנה.",
  thumbnail: React.createElement(GlinticaThumbnail),
  preview: React.createElement(GlinticaPreview),
  component: GlinticaPages,
  Component: GlinticaPages,
  seed: glinticaSeed,
  pages: glinticaPages,
  editorCss: glinticaEditorCss,
  schema: glinticaSchema,
  defaultData: glinticaDefaultData,
  renderer: {
    key: "glintica",
    name: "Glintica",
    Component: GlinticaPages,
    component: GlinticaPages,
    pages: glinticaPages,
    editorMode: "visual-react",
    editorCss: glinticaEditorCss,
    schema: glinticaSchema,
    defaultData: glinticaDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default glinticaTemplate;
