import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import MonolithPages, { monolithPages } from "./pages";
import MonolithPreview from "./preview";
import MonolithThumbnail from "./thumbnail";
import { monolithEditorCss } from "./editorCss";
import { monolithSchema } from "./schema";
import { monolithDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#c8a96a",
  secondary: "#0c1a33",
  accent: "#c8a96a",
  background: "#eef0f4",
  surface: "#eef0f4",
  text: "#0c1a33",
  muted: "#0c1a3399",
  dark: "#0c1a33",
};

export const monolithSeed = {
  id: "monolith",
  key: "monolith",
  name: "Monolith",
  title: "Monolith",
  description: "תבנית קorporativ מונולитית: עמודים אנכיים, זהב על נייבי, 6 עמודים מורכבים ללא כרטיסיות מעוגלות.",
  category: "business",
  categoryLabel: "עסקים וייעוץ",
  niche: "corporate-consulting",
  layout: "full",
  image: (monolithDefaultData as Record<string, any>).heroImage,
  heroTitle: (monolithDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (monolithDefaultData as Record<string, any>).heroSubtitle,
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
  ].map((block, index) => ({ id: `monolith-${index + 1}-${block.type}`, ...block })),
  pages: monolithPages,
  editor: { pages: monolithPages, css: monolithEditorCss },
  css: monolithEditorCss,
  data: monolithDefaultData,
  defaultData: monolithDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const monolithTemplate = {
  id: "monolith",
  key: "monolith",
  name: "Monolith",
  title: "Monolith",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "business",
  categoryLabel: "עסקים וייעוץ",
  badge: "Premium",
  description: "תבנית קorporativ מונולитית: עמודים אנכיים, זהב על נייבי, 6 עמודים מורכבים ללא כרטיסיות מעוגלות.",
  thumbnail: React.createElement(MonolithThumbnail),
  preview: React.createElement(MonolithPreview),
  component: MonolithPages,
  Component: MonolithPages,
  seed: monolithSeed,
  pages: monolithPages,
  editorCss: monolithEditorCss,
  schema: monolithSchema,
  defaultData: monolithDefaultData,
  renderer: {
    key: "monolith",
    name: "Monolith",
    Component: MonolithPages,
    component: MonolithPages,
    pages: monolithPages,
    editorMode: "visual-react",
    editorCss: monolithEditorCss,
    schema: monolithSchema,
    defaultData: monolithDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default monolithTemplate;
