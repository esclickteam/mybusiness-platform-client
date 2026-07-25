import React from "react";

import type {
  ReadyWebsitePalette,
  ReadyWebsiteTemplateSeed,
} from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";

import HandcraftPages, { handcraftPages } from "./pages";
import HandcraftPreview from "./preview";
import HandcraftThumbnail from "./thumbnail";
import { handcraftEditorCss } from "./editorCss";
import { handcraftSchema } from "./schema";
import { handcraftDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#F97316",
  secondary: "#1C1917",
  accent: "#FB923C",
  background: "#FAFAF9",
  surface: "#FFFFFF",
  text: "#1C1917",
  muted: "#78716C",
  dark: "#0C0A09",
};

const blocks = [
  { type: "header", variant: "industrial-bold-header", title: "header" },
  { type: "hero", variant: "industrial-bold-hero", title: "hero" },
  { type: "services", variant: "industrial-bold-services", title: "services" },
  { type: "before_after", variant: "industrial-bold-before-after", title: "before-after" },
  { type: "why_us", variant: "industrial-bold-why-us", title: "why-us" },
  { type: "pricing", variant: "industrial-bold-pricing", title: "pricing" },
  { type: "areas", variant: "industrial-bold-areas", title: "areas" },
  { type: "reviews", variant: "industrial-bold-reviews", title: "reviews" },
  { type: "emergency", variant: "industrial-bold-emergency", title: "emergency" },
  { type: "footer", variant: "industrial-bold-footer", title: "footer" },
];

export const handcraftSeed = {
  id: "handcraft",
  key: "handcraft",
  name: "Handcraft",
  title: "Handcraft",
  description: "דף נחיתה לשירותי בית: הירו עם טלפון בולט, שירותים, לפני/אחרי, מחירון, אזורי שירות, ביקורות וקריאה דחופה — כתום-א industrial.",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  niche: "homeservices",
  layout: "full",
  image: (handcraftDefaultData as Record<string, any>).heroImage,
  heroTitle: (handcraftDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (handcraftDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({
    id: `handcraft-${index + 1}-${block.type}`,
    ...block,
  })),
  pages: handcraftPages,
  editor: { pages: handcraftPages, css: handcraftEditorCss },
  css: handcraftEditorCss,
  data: handcraftDefaultData,
  defaultData: handcraftDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const handcraftTemplate = {
  id: "handcraft",
  key: "handcraft",
  name: "Handcraft",
  title: "Handcraft",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  badge: "חדש",
  description: "דף נחיתה לשירותי בית: הירו עם טלפון בולט, שירותים, לפני/אחרי, מחירון, אזורי שירות, ביקורות וקריאה דחופה — כתום-א industrial.",
  thumbnail: React.createElement(HandcraftThumbnail),
  preview: React.createElement(HandcraftPreview),
  component: HandcraftPages,
  Component: HandcraftPages,
  seed: handcraftSeed,
  pages: handcraftPages,
  editorCss: handcraftEditorCss,
  schema: handcraftSchema,
  defaultData: handcraftDefaultData,
  renderer: {
    key: "handcraft",
    name: "Handcraft",
    Component: HandcraftPages,
    component: HandcraftPages,
    pages: handcraftPages,
    editorMode: "visual-react",
    editorCss: handcraftEditorCss,
    schema: handcraftSchema,
    defaultData: handcraftDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default handcraftTemplate;
