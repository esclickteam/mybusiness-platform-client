import React from "react";

import type {
  ReadyWebsitePalette,
  ReadyWebsiteTemplateSeed,
} from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";

import VerdantPages, { verdantPages } from "./pages";
import VerdantPreview from "./preview";
import VerdantThumbnail from "./thumbnail";
import { verdantEditorCss } from "./editorCss";
import { verdantSchema } from "./schema";
import { verdantDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#B8956B",
  secondary: "#1C1C1C",
  accent: "#D4AF7A",
  background: "#F7F3ED",
  surface: "#FFFFFF",
  text: "#1C1C1C",
  muted: "#6B6560",
  dark: "#0F0E0C",
};

const blocks = [
  { type: "header", variant: "luxury-editorial-header", title: "header" },
  { type: "hero", variant: "luxury-editorial-hero", title: "hero" },
  { type: "properties", variant: "luxury-editorial-properties", title: "properties" },
  { type: "stats", variant: "luxury-editorial-stats", title: "stats" },
  { type: "agents", variant: "luxury-editorial-agents", title: "agents" },
  { type: "virtual_tour", variant: "luxury-editorial-virtual-tour", title: "virtual-tour" },
  { type: "testimonials", variant: "luxury-editorial-testimonials", title: "testimonials" },
  { type: "process", variant: "luxury-editorial-process", title: "process" },
  { type: "contact", variant: "luxury-editorial-contact", title: "contact" },
  { type: "footer", variant: "luxury-editorial-footer", title: "footer" },
];

export const verdantSeed = {
  id: "verdant",
  key: "verdant",
  name: "Verdant",
  title: "Verdant",
  description: "דף נחיתה יוקרתי לנדל״ן: הירו קולנועי, נכסים נבחרים, סוכנים, סיורים וירטואליים ועיצוב קרם-זהב עריכתי.",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  niche: "realestate",
  layout: "full",
  image: (verdantDefaultData as Record<string, any>).heroImage,
  heroTitle: (verdantDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (verdantDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({
    id: `verdant-${index + 1}-${block.type}`,
    ...block,
  })),
  pages: verdantPages,
  editor: { pages: verdantPages, css: verdantEditorCss },
  css: verdantEditorCss,
  data: verdantDefaultData,
  defaultData: verdantDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const verdantTemplate = {
  id: "verdant",
  key: "verdant",
  name: "Verdant",
  title: "Verdant",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  badge: "חדש",
  description: "דף נחיתה יוקרתי לנדל״ן: הירו קולנועי, נכסים נבחרים, סוכנים, סיורים וירטואליים ועיצוב קרם-זהב עריכתי.",
  thumbnail: React.createElement(VerdantThumbnail),
  preview: React.createElement(VerdantPreview),
  component: VerdantPages,
  Component: VerdantPages,
  seed: verdantSeed,
  pages: verdantPages,
  editorCss: verdantEditorCss,
  schema: verdantSchema,
  defaultData: verdantDefaultData,
  renderer: {
    key: "verdant",
    name: "Verdant",
    Component: VerdantPages,
    component: VerdantPages,
    pages: verdantPages,
    editorMode: "visual-react",
    editorCss: verdantEditorCss,
    schema: verdantSchema,
    defaultData: verdantDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default verdantTemplate;
