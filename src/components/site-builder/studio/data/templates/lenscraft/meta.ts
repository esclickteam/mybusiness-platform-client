import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import LenscraftPages, { lenscraftPages } from "./pages";
import LenscraftPreview from "./preview";
import LenscraftThumbnail from "./thumbnail";
import { lenscraftEditorCss } from "./editorCss";
import { lenscraftSchema } from "./schema";
import { lenscraftDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#E11D48",
  secondary: "#0F0F10",
  accent: "#FB7185",
  background: "#0F0F10",
  surface: "#18181B",
  text: "#FAFAFA",
  muted: "#A1A1AA",
  dark: "#09090B",
};

const blocks = [
  { type: "header", variant: "photoMono-header", title: "header" },
  { type: "hero", variant: "photoMono-hero", title: "hero" },
  { type: "services", variant: "photoMono-services", title: "services" },
  { type: "stats", variant: "photoMono-stats", title: "stats" },
  { type: "showcase", variant: "photoMono-showcase", title: "showcase" },
  { type: "process", variant: "photoMono-process", title: "process" },
  { type: "testimonials", variant: "photoMono-testimonials", title: "testimonials" },
  { type: "faq", variant: "photoMono-faq", title: "faq" },
  { type: "contact", variant: "photoMono-contact", title: "contact" },
  { type: "footer", variant: "photoMono-footer", title: "footer" },
];

export const lenscraftSeed = {
  id: "lenscraft",
  key: "lenscraft",
  name: "Lenscraft",
  title: "Lenscraft",
  description: "דף נחיתה לסטודיו צילום: הירו ויזואלי, גלריות, חבילות צילום וטופס הזמנה.",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  niche: "photography",
  layout: "full",
  image: (lenscraftDefaultData as Record<string, any>).heroImage,
  heroTitle: (lenscraftDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (lenscraftDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({ id: `lenscraft-${index + 1}-${block.type}`, ...block })),
  pages: lenscraftPages,
  editor: { pages: lenscraftPages, css: lenscraftEditorCss },
  css: lenscraftEditorCss,
  data: lenscraftDefaultData,
  defaultData: lenscraftDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const lenscraftTemplate = {
  id: "lenscraft",
  key: "lenscraft",
  name: "Lenscraft",
  title: "Lenscraft",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  badge: "Premium",
  description: "דף נחיתה לסטודיו צילום: הירו ויזואלי, גלריות, חבילות צילום וטופס הזמנה.",
  thumbnail: React.createElement(LenscraftThumbnail),
  preview: React.createElement(LenscraftPreview),
  component: LenscraftPages,
  Component: LenscraftPages,
  seed: lenscraftSeed,
  pages: lenscraftPages,
  editorCss: lenscraftEditorCss,
  schema: lenscraftSchema,
  defaultData: lenscraftDefaultData,
  renderer: {
    key: "lenscraft",
    name: "Lenscraft",
    Component: LenscraftPages,
    component: LenscraftPages,
    pages: lenscraftPages,
    editorMode: "visual-react",
    editorCss: lenscraftEditorCss,
    schema: lenscraftSchema,
    defaultData: lenscraftDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default lenscraftTemplate;
