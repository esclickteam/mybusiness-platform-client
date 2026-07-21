import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import PrismPages, { prismPages } from "./pages";
import PrismPreview from "./preview";
import PrismThumbnail from "./thumbnail";
import { prismEditorCss } from "./editorCss";
import { prismSchema } from "./schema";
import { prismDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#0057ff",
  secondary: "#0a0a0a",
  accent: "#0057ff",
  background: "#fffef8",
  surface: "#fffef8",
  text: "#0a0a0a",
  muted: "#0a0a0a99",
  dark: "#0a0a0a",
};

export const prismSeed = {
  id: "prism",
  key: "prism",
  name: "Prism",
  title: "Prism",
  description: "תבנית סוכנות עיצוב בauhaus: בלוקי צבע מלבניים, 6 עמודים, טיפוגרפיה נועזת ותנועה.",
  category: "creative",
  categoryLabel: "קריאייטיב ועיצוב",
  niche: "design-agency",
  layout: "full",
  image: (prismDefaultData as Record<string, any>).heroImage,
  heroTitle: (prismDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (prismDefaultData as Record<string, any>).heroSubtitle,
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
  ].map((block, index) => ({ id: `prism-${index + 1}-${block.type}`, ...block })),
  pages: prismPages,
  editor: { pages: prismPages, css: prismEditorCss },
  css: prismEditorCss,
  data: prismDefaultData,
  defaultData: prismDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const prismTemplate = {
  id: "prism",
  key: "prism",
  name: "Prism",
  title: "Prism",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "creative",
  categoryLabel: "קריאייטיב ועיצוב",
  badge: "חדש",
  description: "תבנית סוכנות עיצוב בauhaus: בלוקי צבע מלבניים, 6 עמודים, טיפוגרפיה נועזת ותנועה.",
  thumbnail: React.createElement(PrismThumbnail),
  preview: React.createElement(PrismPreview),
  component: PrismPages,
  Component: PrismPages,
  seed: prismSeed,
  pages: prismPages,
  editorCss: prismEditorCss,
  schema: prismSchema,
  defaultData: prismDefaultData,
  renderer: {
    key: "prism",
    name: "Prism",
    Component: PrismPages,
    component: PrismPages,
    pages: prismPages,
    editorMode: "visual-react",
    editorCss: prismEditorCss,
    schema: prismSchema,
    defaultData: prismDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default prismTemplate;
