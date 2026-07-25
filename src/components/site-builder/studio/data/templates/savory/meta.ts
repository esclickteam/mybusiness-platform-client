import React from "react";

import type {
  ReadyWebsitePalette,
  ReadyWebsiteTemplateSeed,
} from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";

import SavoryPages, { savoryPages } from "./pages";
import SavoryPreview from "./preview";
import SavoryThumbnail from "./thumbnail";
import { savoryEditorCss } from "./editorCss";
import { savorySchema } from "./schema";
import { savoryDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#E8A317",
  secondary: "#12100E",
  accent: "#F0C75E",
  background: "#12100E",
  surface: "#1C1916",
  text: "#F5F0E8",
  muted: "#A39E94",
  dark: "#0A0908",
};

const blocks = [
  { type: "header", variant: "dark-saffron-header", title: "header" },
  { type: "hero", variant: "dark-saffron-hero", title: "hero" },
  { type: "menu", variant: "dark-saffron-menu", title: "menu" },
  { type: "chef", variant: "dark-saffron-chef", title: "chef" },
  { type: "gallery", variant: "dark-saffron-gallery", title: "gallery" },
  { type: "reviews", variant: "dark-saffron-reviews", title: "reviews" },
  { type: "events", variant: "dark-saffron-events", title: "events" },
  { type: "hours", variant: "dark-saffron-hours", title: "hours" },
  { type: "reservation", variant: "dark-saffron-reservation", title: "reservation" },
  { type: "footer", variant: "dark-saffron-footer-cta", title: "footer" },
];

export const savorySeed = {
  id: "savory",
  key: "savory",
  name: "Savory",
  title: "Savory",
  description: "דף נחיתה למסעדת שף יוקרתית: הירו צילומי, תפריט טיפוגרפי, סיפור השף, גלריה, ביקורות, אירועים והזמנות — עיצוב שחור-ענבר.",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  niche: "restaurant",
  layout: "full",
  image: (savoryDefaultData as Record<string, any>).heroImage,
  heroTitle: (savoryDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (savoryDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({
    id: `savory-${index + 1}-${block.type}`,
    ...block,
  })),
  pages: savoryPages,
  editor: { pages: savoryPages, css: savoryEditorCss },
  css: savoryEditorCss,
  data: savoryDefaultData,
  defaultData: savoryDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const savoryTemplate = {
  id: "savory",
  key: "savory",
  name: "Savory",
  title: "Savory",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  badge: "Premium",
  description: "דף נחיתה למסעדת שף יוקרתית: הירו צילומי, תפריט טיפוגרפי, סיפור השף, גלריה, ביקורות, אירועים והזמנות — עיצוב שחור-ענבר.",
  thumbnail: React.createElement(SavoryThumbnail),
  preview: React.createElement(SavoryPreview),
  component: SavoryPages,
  Component: SavoryPages,
  seed: savorySeed,
  pages: savoryPages,
  editorCss: savoryEditorCss,
  schema: savorySchema,
  defaultData: savoryDefaultData,
  renderer: {
    key: "savory",
    name: "Savory",
    Component: SavoryPages,
    component: SavoryPages,
    pages: savoryPages,
    editorMode: "visual-react",
    editorCss: savoryEditorCss,
    schema: savorySchema,
    defaultData: savoryDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default savoryTemplate;
