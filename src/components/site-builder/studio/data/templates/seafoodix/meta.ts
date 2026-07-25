import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import SeafoodixPages, { seafoodixPages } from "./pages";
import SeafoodixPreview from "./preview";
import SeafoodixThumbnail from "./thumbnail";
import { seafoodixEditorCss } from "./editorCss";
import { seafoodixSchema } from "./schema";
import { seafoodixDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#38bdf8", secondary: "#7aa8b8", accent: "#38bdf8",
  background: "#04151c", surface: "#0a2430", text: "#e6f4f8", muted: "#7aa8b8", dark: "#020b10",
};

export const seafoodixSeed = {
  id: "seafoodix", key: "seafoodix", name: "Seafoodix", title: "Seafoodix",
  description: "תבנית פירות ים: גלי קצף, צדפות וטופס הזמנה ימי — רעננות חוף כחולה-ירוקה.",
  category: "food", categoryLabel: "אוכל ומסעדות", niche: "פירות ים · דגים", layout: "full",
  image: (seafoodixDefaultData as any).heroImage,
  heroTitle: (seafoodixDefaultData as any).heroTitle,
  heroSubtitle: (seafoodixDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "foam-nav", title: "Foam wave nav" },
    { type: "hero", variant: "foam-wave-hero", title: "Foam wave seafood hero" },
    { type: "menu", variant: "wave-catch-cards", title: "Wave catch cards" },
    { type: "process", variant: "seafood-process", title: "Seafood process" },
    { type: "gallery", variant: "sea-gallery", title: "Sea gallery" },
    { type: "reviews", variant: "sea-reviews", title: "Sea reviews" },
    { type: "stats", variant: "tide-stats", title: "Tide stats + hours" },
    { type: "cta", variant: "sea-home-cta", title: "Home CTA teaser" },
    { type: "catchPage", variant: "full-catch-menu", title: "Full catch menu page" },
    { type: "wavesPage", variant: "waves-story", title: "Waves story page" },
    { type: "about", variant: "harbor-timeline", title: "Harbor timeline" },
    { type: "contact", variant: "harbor-reserve-faq", title: "Harbor reserve + FAQ" },
    { type: "footer", variant: "foam-line", title: "Foam line footer" },
  ].map((b, i) => ({ id: `seafoodix-${i+1}-${b.type}`, ...b })),
  pages: seafoodixPages,
  editor: { pages: seafoodixPages, css: seafoodixEditorCss },
  css: seafoodixEditorCss, data: seafoodixDefaultData, defaultData: seafoodixDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const seafoodixTemplate = {
  id: "seafoodix", key: "seafoodix", name: "Seafoodix", title: "Seafoodix", author: "Bizuply", priceLabel: "כלול",
  category: "food", categoryLabel: "אוכל ומסעדות", badge: "חדש",
  description: "תבנית פירות ים: גלי קצף, צדפות וטופס הזמנה ימי — רעננות חוף כחולה-ירוקה.",
  thumbnail: React.createElement(SeafoodixThumbnail),
  preview: React.createElement(SeafoodixPreview),
  component: SeafoodixPages, Component: SeafoodixPages,
  seed: seafoodixSeed, pages: seafoodixPages, editorCss: seafoodixEditorCss, schema: seafoodixSchema, defaultData: seafoodixDefaultData,
  renderer: {
    key: "seafoodix", name: "Seafoodix", Component: SeafoodixPages, component: SeafoodixPages, pages: seafoodixPages,
    editorMode: "visual-react", editorCss: seafoodixEditorCss, schema: seafoodixSchema, defaultData: seafoodixDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default seafoodixTemplate;
