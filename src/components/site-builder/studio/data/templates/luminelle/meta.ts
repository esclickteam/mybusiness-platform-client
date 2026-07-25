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
  primary: "#D4A5A5",
  secondary: "#3D2C2E",
  accent: "#F5E6E0",
  background: "#FDF8F6",
  surface: "#FFFFFF",
  text: "#3D2C2E",
  muted: "#9B8585",
  dark: "#2A1F21",
};

const blocks = [
  { type: "header", variant: "soft-spa-header", title: "header" },
  { type: "hero", variant: "soft-spa-hero", title: "hero" },
  { type: "treatments", variant: "soft-spa-treatments", title: "treatments" },
  { type: "transform", variant: "soft-spa-transform", title: "transform" },
  { type: "products", variant: "soft-spa-products", title: "products" },
  { type: "team", variant: "soft-spa-team", title: "team" },
  { type: "pricing", variant: "soft-spa-pricing", title: "pricing" },
  { type: "faq", variant: "soft-spa-faq", title: "faq" },
  { type: "booking", variant: "soft-spa-booking", title: "booking" },
  { type: "footer", variant: "soft-spa-footer", title: "footer" },
];

export const luminelleSeed = {
  id: "luminelle",
  key: "luminelle",
  name: "Luminelle",
  title: "Luminelle",
  description: "דף נחיתה לסalon יופי: הירו אלגנטי, טיפולים, לפני/אחרי, מוצרים, צוות מעצבים, FAQ וטופס תור — ורוד-שמפניה רך.",
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
  description: "דף נחיתה לסalon יופי: הירו אלגנטי, טיפולים, לפני/אחרי, מוצרים, צוות מעצבים, FAQ וטופס תור — ורוד-שמפניה רך.",
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
