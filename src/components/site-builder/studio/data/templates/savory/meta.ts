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
  primary: "#C45C26",
  secondary: "#2D1810",
  accent: "#E8A849",
  background: "#FAF6F0",
  surface: "#FFF9F2",
  text: "#2D1810",
  muted: "#8B7355",
  dark: "#1A0F0A",
};

const blocks = [
  { type: "header", variant: "warm-rustic-header", title: "header" },
  { type: "hero", variant: "warm-rustic-hero", title: "hero" },
  { type: "menu", variant: "warm-rustic-menu", title: "menu" },
  { type: "chef", variant: "warm-rustic-chef", title: "chef" },
  { type: "gallery", variant: "warm-rustic-gallery", title: "gallery" },
  { type: "reviews", variant: "warm-rustic-reviews", title: "reviews" },
  { type: "events", variant: "warm-rustic-events", title: "events" },
  { type: "hours", variant: "warm-rustic-hours", title: "hours" },
  { type: "reservation", variant: "warm-rustic-reservation", title: "reservation" },
  { type: "footer", variant: "warm-rustic-footer", title: "footer" },
];

export const savorySeed = {
  id: "savory",
  key: "savory",
  name: "Savory",
  title: "Savory",
  description: "דף נחיתה למסעדת שף: הירו עם טופס הזמנה, תפריט, סיפור השף, גaleria, ביקורות ואירועים — עיצוב חם טרקוטה.",
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
  description: "דף נחיתה למסעדת שף: הירו עם טופס הזמנה, תפריט, סיפור השף, גaleria, ביקורות ואירועים — עיצוב חם טרקוטה.",
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
