import React from "react";

import type {
  ReadyWebsitePalette,
  ReadyWebsiteTemplateSeed,
} from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";

import AureliaPages, { aureliaPages } from "./pages";
import AureliaPreview from "./preview";
import AureliaThumbnail from "./thumbnail";
import { aureliaEditorCss } from "./editorCss";
import { aureliaSchema } from "./schema";
import { aureliaDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#C9A24B",
  secondary: "#7A3B1D",
  accent: "#E7CE8F",
  background: "#14100D",
  surface: "#1A1510",
  text: "#F5EEE1",
  muted: "#A2957C",
  dark: "#0F0C09",
};

const blocks = [
  { type: "header", variant: "dark-luxe", title: "Header" },
  { type: "hero", variant: "restaurant-editorial", title: "Hero" },
  { type: "about", variant: "story-split", title: "Story" },
  { type: "menu", variant: "fine-dining-list", title: "Menu" },
  { type: "process", variant: "experience-cards", title: "Experience" },
  { type: "gallery", variant: "editorial-grid", title: "Gallery" },
  { type: "reviews", variant: "guest-reviews", title: "Reviews" },
  { type: "contact", variant: "reservation-form", title: "Reservation" },
  { type: "footer", variant: "luxe-cta", title: "Footer" },
];

export const aureliaSeed = {
  id: "aurelia",
  key: "aurelia",
  name: "Aurelia",
  title: "Aurelia",
  description:
    "תבנית מסעדת שף פרימיום עם הירו כהה ואלגנטי, סיפור המסעדה, תפריט עונתי, חוויית סועד, גלריה, ביקורות והזמנת שולחן.",
  category: "food",
  categoryLabel: "אוכל ומסעדות",
  niche: "restaurant",
  layout: "full",
  image: (aureliaDefaultData as Record<string, any>).heroImage,
  heroTitle: (aureliaDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (aureliaDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({
    id: `aurelia-${index + 1}-${block.type}`,
    ...block,
  })),
  pages: aureliaPages,
  editor: {
    pages: aureliaPages,
    css: aureliaEditorCss,
  },
  css: aureliaEditorCss,
  data: aureliaDefaultData,
  defaultData: aureliaDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const aureliaTemplate = {
  id: "aurelia",
  key: "aurelia",
  name: "Aurelia",
  title: "Aurelia",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "food",
  categoryLabel: "אוכל ומסעדות",
  badge: "חדש",
  description:
    "תבנית מסעדת שף פרימיום בסגנון fine dining: הירו קולנועי כהה, תפריט עונתי, חוויית סועד, גלריה, ביקורות והזמנת שולחן.",
  thumbnail: React.createElement(AureliaThumbnail),
  preview: React.createElement(AureliaPreview),
  component: AureliaPages,
  Component: AureliaPages,
  seed: aureliaSeed,
  pages: aureliaPages,
  editorCss: aureliaEditorCss,
  schema: aureliaSchema,
  defaultData: aureliaDefaultData,
  renderer: {
    key: "aurelia",
    name: "Aurelia",
    Component: AureliaPages,
    component: AureliaPages,
    pages: aureliaPages,
    editorMode: "visual-react",
    editorCss: aureliaEditorCss,
    schema: aureliaSchema,
    defaultData: aureliaDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default aureliaTemplate;
