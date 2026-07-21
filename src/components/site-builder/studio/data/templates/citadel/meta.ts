import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import CitadelPages, { citadelPages } from "./pages";
import CitadelPreview from "./preview";
import CitadelThumbnail from "./thumbnail";
import { citadelEditorCss } from "./editorCss";
import { citadelSchema } from "./schema";
import { citadelDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#39ff14",
  secondary: "#d7ffd9",
  accent: "#39ff14",
  background: "#030a06",
  surface: "#030a06",
  text: "#d7ffd9",
  muted: "#d7ffd999",
  dark: "#d7ffd9",
};

export const citadelSeed = {
  id: "citadel",
  key: "citadel",
  name: "Citadel",
  title: "Citadel",
  description: "תבנית סייבר: אסתטיקת טרמינל, ירוק מatrix, 6 עמודים עם אנימציות סcan וכניסות.",
  category: "technology",
  categoryLabel: "סייבר ואבטחה",
  niche: "cybersecurity",
  layout: "full",
  image: (citadelDefaultData as Record<string, any>).heroImage,
  heroTitle: (citadelDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (citadelDefaultData as Record<string, any>).heroSubtitle,
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
  ].map((block, index) => ({ id: `citadel-${index + 1}-${block.type}`, ...block })),
  pages: citadelPages,
  editor: { pages: citadelPages, css: citadelEditorCss },
  css: citadelEditorCss,
  data: citadelDefaultData,
  defaultData: citadelDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const citadelTemplate = {
  id: "citadel",
  key: "citadel",
  name: "Citadel",
  title: "Citadel",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "technology",
  categoryLabel: "סייבר ואבטחה",
  badge: "Premium",
  description: "תבנית סייבר: אסתטיקת טרמינל, ירוק מatrix, 6 עמודים עם אנימציות סcan וכניסות.",
  thumbnail: React.createElement(CitadelThumbnail),
  preview: React.createElement(CitadelPreview),
  component: CitadelPages,
  Component: CitadelPages,
  seed: citadelSeed,
  pages: citadelPages,
  editorCss: citadelEditorCss,
  schema: citadelSchema,
  defaultData: citadelDefaultData,
  renderer: {
    key: "citadel",
    name: "Citadel",
    Component: CitadelPages,
    component: CitadelPages,
    pages: citadelPages,
    editorMode: "visual-react",
    editorCss: citadelEditorCss,
    schema: citadelSchema,
    defaultData: citadelDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default citadelTemplate;
