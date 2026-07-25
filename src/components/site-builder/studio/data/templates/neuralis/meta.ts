import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import NeuralisPages, { neuralisPages } from "./pages";
import NeuralisPreview from "./preview";
import NeuralisThumbnail from "./thumbnail";
import { neuralisEditorCss } from "./editorCss";
import { neuralisSchema } from "./schema";
import { neuralisDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  "primary": "#22D3EE",
  "secondary": "#050816",
  "accent": "#67E8F9",
  "background": "#050816",
  "surface": "#0B1224",
  "text": "#E8F7FF",
  "muted": "#8BA3B8",
  "dark": "#02040A"
};

export const neuralisSeed = {
  id: "neuralis",
  key: "neuralis",
  name: "Neuralis",
  title: "Neuralis",
  description: "דף נחיתה מקצועי לתחום AI וטכנולוגיה עם תנועה, אפקטים ועיצוב ייחודי.",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  niche: "ai-tech",
  layout: "full",
  image: (neuralisDefaultData as any).heroImage,
  heroTitle: (neuralisDefaultData as any).heroTitle,
  heroSubtitle: (neuralisDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "neuralis-header", title: "header" },
    { type: "hero", variant: "neuralis-hero", title: "hero" },
    { type: "services", variant: "neuralis-services", title: "services" },
    { type: "showcase", variant: "neuralis-showcase", title: "showcase" },
    { type: "stats", variant: "neuralis-stats", title: "stats" },
    { type: "process", variant: "neuralis-process", title: "process" },
    { type: "testimonials", variant: "neuralis-testimonials", title: "testimonials" },
    { type: "faq", variant: "neuralis-faq", title: "faq" },
    { type: "contact", variant: "neuralis-contact", title: "contact" },
    { type: "footer", variant: "neuralis-footer", title: "footer" },
  ].map((block, index) => ({ id: `neuralis-${index + 1}-${block.type}`, ...block })),
  pages: neuralisPages,
  editor: { pages: neuralisPages, css: neuralisEditorCss },
  css: neuralisEditorCss,
  data: neuralisDefaultData,
  defaultData: neuralisDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const neuralisTemplate = {
  id: "neuralis",
  key: "neuralis",
  name: "Neuralis",
  title: "Neuralis",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  badge: "חדש",
  description: "דף נחיתה מקצועי לתחום AI וטכנולוגיה עם תנועה, אפקטים ועיצוב ייחודי.",
  thumbnail: React.createElement(NeuralisThumbnail),
  preview: React.createElement(NeuralisPreview),
  component: NeuralisPages,
  Component: NeuralisPages,
  seed: neuralisSeed,
  pages: neuralisPages,
  editorCss: neuralisEditorCss,
  schema: neuralisSchema,
  defaultData: neuralisDefaultData,
  renderer: {
    key: "neuralis",
    name: "Neuralis",
    Component: NeuralisPages,
    component: NeuralisPages,
    pages: neuralisPages,
    editorMode: "visual-react",
    editorCss: neuralisEditorCss,
    schema: neuralisSchema,
    defaultData: neuralisDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default neuralisTemplate;
