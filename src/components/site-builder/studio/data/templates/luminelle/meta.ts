import React from "react";

import type {
  ReadyWebsitePalette,
  ReadyWebsiteTemplateSeed,
} from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";

import LuminellePages, { luminellePages } from "./pages";
import LuminellePreview from "./preview";
import LuminelleThumbnail from "./thumbnail";
import { luminelleEditorCss } from "./editorCss";
import { luminelleSchema } from "./schema";
import { luminelleDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#7A8B76",
  secondary: "#2A2430",
  accent: "#A8B5A3",
  background: "#E8E4DF",
  surface: "#F4F1EC",
  text: "#2A2430",
  muted: "#7A736C",
  dark: "#1A161C",
};

const blocks = [
  { type: "header", variant: "editorial-beauty-header", title: "header" },
  { type: "hero", variant: "editorial-beauty-hero", title: "hero" },
  { type: "treatments", variant: "editorial-beauty-treatments", title: "treatments" },
  { type: "transformation", variant: "editorial-beauty-transformation", title: "transformation" },
  { type: "products", variant: "editorial-beauty-products", title: "products" },
  { type: "team", variant: "editorial-beauty-team", title: "team" },
  { type: "pricing", variant: "editorial-beauty-pricing", title: "pricing" },
  { type: "faq", variant: "editorial-beauty-faq", title: "faq" },
  { type: "booking", variant: "editorial-beauty-booking", title: "booking" },
  { type: "footer", variant: "editorial-beauty-footer-cta", title: "footer" },
];

export const luminelleSeed = {
  id: "luminelle",
  key: "luminelle",
  name: "Luminelle",
  title: "Luminelle",
  description: "דף נחיתה אלגנטי לסלון יופי בוטיק: טיפולים, לפני/אחרי, מוצרי פרימיום, צוות, חבילות, FAQ וטופס תור בשפה editorial נקייה.",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  niche: "beauty",
  layout: "full",
  image: (luminelleDefaultData as Record<string, any>).heroImage,
  heroTitle: (luminelleDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (luminelleDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({
    id: `luminelle-${index + 1}-${block.type}`,
    ...block,
  })),
  pages: luminellePages,
  editor: { pages: luminellePages, css: luminelleEditorCss },
  css: luminelleEditorCss,
  data: luminelleDefaultData,
  defaultData: luminelleDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const luminelleTemplate = {
  id: "luminelle",
  key: "luminelle",
  name: "Luminelle",
  title: "Luminelle",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  badge: "חדש",
  description: "דף נחיתה אלגנטי לסלון יופי בוטיק: טיפולים, לפני/אחרי, מוצרי פרימיום, צוות, חבילות, FAQ וטופס תור בשפה editorial נקייה.",
  thumbnail: React.createElement(LuminelleThumbnail),
  preview: React.createElement(LuminellePreview),
  component: LuminellePages,
  Component: LuminellePages,
  seed: luminelleSeed,
  pages: luminellePages,
  editorCss: luminelleEditorCss,
  schema: luminelleSchema,
  defaultData: luminelleDefaultData,
  renderer: {
    key: "luminelle",
    name: "Luminelle",
    Component: LuminellePages,
    component: LuminellePages,
    pages: luminellePages,
    editorMode: "visual-react",
    editorCss: luminelleEditorCss,
    schema: luminelleSchema,
    defaultData: luminelleDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default luminelleTemplate;
