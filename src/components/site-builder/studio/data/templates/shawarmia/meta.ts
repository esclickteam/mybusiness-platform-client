import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import ShawarmiaPages, { shawarmiaPages } from "./pages";
import ShawarmiaPreview from "./preview";
import ShawarmiaThumbnail from "./thumbnail";
import { shawarmiaEditorCss } from "./editorCss";
import { shawarmiaSchema } from "./schema";
import { shawarmiaDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#d97706", secondary: "#b9a08a", accent: "#d97706",
  background: "#14110e", surface: "#1e1914", text: "#f5ebe0", muted: "#b9a08a", dark: "#0a0806",
};

export const shawarmiaSeed = {
  id: "shawarmia", key: "shawarmia", name: "Shawarmia", title: "Shawarmia",
  description: "תבנית שווארמה: שיפוד מסתובב, פיתות חמות וטופס הזמנה מהיר — רחוב מזרחי עם קצב.",
  category: "food", categoryLabel: "אוכל ומסעדות", niche: "שווארמה · גריל", layout: "full",
  image: (shawarmiaDefaultData as any).heroImage,
  heroTitle: (shawarmiaDefaultData as any).heroTitle,
  heroSubtitle: (shawarmiaDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "spit-bar-nav", title: "Spit bar nav" },
    { type: "hero", variant: "rotating-spit-hero", title: "Rotating spit hero" },
    { type: "menu", variant: "spit-vertical-rail", title: "Spit vertical rail" },
    { type: "process", variant: "shawarma-process", title: "Shawarma process" },
    { type: "gallery", variant: "spit-gallery", title: "Spit gallery" },
    { type: "reviews", variant: "shawarma-reviews", title: "Shawarma reviews" },
    { type: "stats", variant: "spit-stats", title: "Spit stats + hours" },
    { type: "cta", variant: "shawarma-home-cta", title: "Home CTA teaser" },
    { type: "platesPage", variant: "full-plate-menu", title: "Full plate menu page" },
    { type: "spitPage", variant: "spit-story", title: "Spit story page" },
    { type: "about", variant: "grill-timeline", title: "Grill timeline" },
    { type: "contact", variant: "counter-reserve-faq", title: "Counter reserve + FAQ" },
    { type: "footer", variant: "pita-edge", title: "Pita edge footer" },
  ].map((b, i) => ({ id: `shawarmia-${i+1}-${b.type}`, ...b })),
  pages: shawarmiaPages,
  editor: { pages: shawarmiaPages, css: shawarmiaEditorCss },
  css: shawarmiaEditorCss, data: shawarmiaDefaultData, defaultData: shawarmiaDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const shawarmiaTemplate = {
  id: "shawarmia", key: "shawarmia", name: "Shawarmia", title: "Shawarmia", author: "Bizuply", priceLabel: "כלול",
  category: "food", categoryLabel: "אוכל ומסעדות", badge: "חדש",
  description: "תבנית שווארמה: שיפוד מסתובב, פיתות חמות וטופס הזמנה מהיר — רחוב מזרחי עם קצב.",
  thumbnail: React.createElement(ShawarmiaThumbnail),
  preview: React.createElement(ShawarmiaPreview),
  component: ShawarmiaPages, Component: ShawarmiaPages,
  seed: shawarmiaSeed, pages: shawarmiaPages, editorCss: shawarmiaEditorCss, schema: shawarmiaSchema, defaultData: shawarmiaDefaultData,
  renderer: {
    key: "shawarmia", name: "Shawarmia", Component: ShawarmiaPages, component: ShawarmiaPages, pages: shawarmiaPages,
    editorMode: "visual-react", editorCss: shawarmiaEditorCss, schema: shawarmiaSchema, defaultData: shawarmiaDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default shawarmiaTemplate;
