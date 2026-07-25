import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import NumerisPages, { numerisPages } from "./pages";
import NumerisPreview from "./preview";
import NumerisThumbnail from "./thumbnail";
import { numerisEditorCss } from "./editorCss";
import { numerisSchema } from "./schema";
import { numerisDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#0F6E56",
  secondary: "#F3F6F4",
  accent: "#1D9B75",
  background: "#F3F6F4",
  surface: "#FFFFFF",
  text: "#143028",
  muted: "#5E7268",
  dark: "#0B241C",
};

const blocks = [
  { type: "header", variant: "ledgerGreen-header", title: "header" },
  { type: "hero", variant: "ledgerGreen-hero", title: "hero" },
  { type: "services", variant: "ledgerGreen-services", title: "services" },
  { type: "stats", variant: "ledgerGreen-stats", title: "stats" },
  { type: "showcase", variant: "ledgerGreen-showcase", title: "showcase" },
  { type: "process", variant: "ledgerGreen-process", title: "process" },
  { type: "testimonials", variant: "ledgerGreen-testimonials", title: "testimonials" },
  { type: "faq", variant: "ledgerGreen-faq", title: "faq" },
  { type: "contact", variant: "ledgerGreen-contact", title: "contact" },
  { type: "footer", variant: "ledgerGreen-footer", title: "footer" },
];

export const numerisSeed = {
  id: "numeris",
  key: "numeris",
  name: "Numeris",
  title: "Numeris",
  description: "דף נחיתה להנהלת חשבונות: הירו נקי, שירותי כספים, שקיפות, חבילות וטופס הצטרפות.",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  niche: "accounting",
  layout: "full",
  image: (numerisDefaultData as Record<string, any>).heroImage,
  heroTitle: (numerisDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (numerisDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({ id: `numeris-${index + 1}-${block.type}`, ...block })),
  pages: numerisPages,
  editor: { pages: numerisPages, css: numerisEditorCss },
  css: numerisEditorCss,
  data: numerisDefaultData,
  defaultData: numerisDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const numerisTemplate = {
  id: "numeris",
  key: "numeris",
  name: "Numeris",
  title: "Numeris",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  badge: "חדש",
  description: "דף נחיתה להנהלת חשבונות: הירו נקי, שירותי כספים, שקיפות, חבילות וטופס הצטרפות.",
  thumbnail: React.createElement(NumerisThumbnail),
  preview: React.createElement(NumerisPreview),
  component: NumerisPages,
  Component: NumerisPages,
  seed: numerisSeed,
  pages: numerisPages,
  editorCss: numerisEditorCss,
  schema: numerisSchema,
  defaultData: numerisDefaultData,
  renderer: {
    key: "numeris",
    name: "Numeris",
    Component: NumerisPages,
    component: NumerisPages,
    pages: numerisPages,
    editorMode: "visual-react",
    editorCss: numerisEditorCss,
    schema: numerisSchema,
    defaultData: numerisDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default numerisTemplate;
