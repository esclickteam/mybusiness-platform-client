import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import DessertlabPages, { dessertlabPages } from "./pages";
import DessertlabPreview from "./preview";
import DessertlabThumbnail from "./thumbnail";
import { dessertlabEditorCss } from "./editorCss";
import { dessertlabSchema } from "./schema";
import { dessertlabDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#e879f9", secondary: "#b89bb8", accent: "#e879f9",
  background: "#1a1220", surface: "#241832", text: "#f8eef8", muted: "#b89bb8", dark: "#0e0a14",
};

export const dessertlabSeed = {
  id: "dessertlab", key: "dessertlab", name: "Dessertlab", title: "Dessertlab",
  description: "תבנית פטיסרי: גבישי סוכר, קינוחים גיאומטריים וטופס הזמנה אלגנטי — מעבדת מתיקות.",
  category: "food", categoryLabel: "אוכל ומסעדות", niche: "קינוחים · פטיסרי", layout: "full",
  image: (dessertlabDefaultData as any).heroImage,
  heroTitle: (dessertlabDefaultData as any).heroTitle,
  heroSubtitle: (dessertlabDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "crystal-nav", title: "Sugar crystal nav" },
    { type: "hero", variant: "sugar-crystal-hero", title: "Sugar crystal dessert hero" },
    { type: "menu", variant: "crystal-facet-sweets", title: "Crystal facet sweets" },
    { type: "process", variant: "patisserie-process", title: "Patisserie process" },
    { type: "gallery", variant: "sweet-gallery", title: "Sweet gallery" },
    { type: "reviews", variant: "sweet-reviews", title: "Sweet reviews" },
    { type: "stats", variant: "sugar-stats", title: "Sugar stats + hours" },
    { type: "cta", variant: "dessert-home-cta", title: "Home CTA teaser" },
    { type: "sweetsPage", variant: "full-sweet-menu", title: "Full sweet menu page" },
    { type: "atelierPage", variant: "atelier-story", title: "Atelier story page" },
    { type: "about", variant: "sugar-timeline", title: "Sugar timeline" },
    { type: "contact", variant: "atelier-reserve-faq", title: "Atelier reserve + FAQ" },
    { type: "footer", variant: "crystal-stamp", title: "Crystal stamp footer" },
  ].map((b, i) => ({ id: `dessertlab-${i+1}-${b.type}`, ...b })),
  pages: dessertlabPages,
  editor: { pages: dessertlabPages, css: dessertlabEditorCss },
  css: dessertlabEditorCss, data: dessertlabDefaultData, defaultData: dessertlabDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const dessertlabTemplate = {
  id: "dessertlab", key: "dessertlab", name: "Dessertlab", title: "Dessertlab", author: "Bizuply", priceLabel: "כלול",
  category: "food", categoryLabel: "אוכל ומסעדות", badge: "חדש",
  description: "תבנית פטיסרי: גבישי סוכר, קינוחים גיאומטריים וטופס הזמנה אלגנטי — מעבדת מתיקות.",
  thumbnail: React.createElement(DessertlabThumbnail),
  preview: React.createElement(DessertlabPreview),
  component: DessertlabPages, Component: DessertlabPages,
  seed: dessertlabSeed, pages: dessertlabPages, editorCss: dessertlabEditorCss, schema: dessertlabSchema, defaultData: dessertlabDefaultData,
  renderer: {
    key: "dessertlab", name: "Dessertlab", Component: DessertlabPages, component: DessertlabPages, pages: dessertlabPages,
    editorMode: "visual-react", editorCss: dessertlabEditorCss, schema: dessertlabSchema, defaultData: dessertlabDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default dessertlabTemplate;
