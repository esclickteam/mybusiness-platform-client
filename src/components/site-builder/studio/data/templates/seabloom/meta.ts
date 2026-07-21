import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import SeabloomPages, { seabloomPages } from "./pages";
import SeabloomPreview from "./preview";
import SeabloomThumbnail from "./thumbnail";
import { seabloomEditorCss } from "./editorCss";
import { seabloomSchema } from "./schema";
import { seabloomDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#2d8a6e", secondary: "#5a8a72", accent: "#2d8a6e",
  background: "#f5faf5", surface: "#ffffff", text: "#1a3d2e", muted: "#5a8a72", dark: "#0f2419",
};

export const seabloomSeed = {
  id: "seabloom", key: "seabloom", name: "Seabloom", title: "Seabloom",
  description: "תבנית סpa טרופי: הירו עם עלי כותרת נופלים, קרוסלת טיפולים, גן סיפור וטופס הזמנה — petal-fall animation.",
  category: "travel", categoryLabel: "תיירות וחוף", niche: "Spa · טרופי", layout: "full",
  image: (seabloomDefaultData as any).heroImage,
  heroTitle: (seabloomDefaultData as any).heroTitle,
  heroSubtitle: (seabloomDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "spa-nav", title: "Spa nav" },
    { type: "hero", variant: "petal-fall", title: "Petal fall hero" },
    { type: "treatments", variant: "carousel-cards", title: "Treatment carousel" },
    { type: "garden", variant: "tropical-garden", title: "Garden band" },
    { type: "about", variant: "spa-story", title: "Spa story" },
    { type: "contact", variant: "treatment-booking", title: "Treatment booking" },
    { type: "footer", variant: "minimal", title: "Footer" },
  ].map((b, i) => ({ id: `seabloom-${i+1}-${b.type}`, ...b })),
  pages: seabloomPages,
  editor: { pages: seabloomPages, css: seabloomEditorCss },
  css: seabloomEditorCss, data: seabloomDefaultData, defaultData: seabloomDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const seabloomTemplate = {
  id: "seabloom", key: "seabloom", name: "Seabloom", title: "Seabloom", author: "Bizuply", priceLabel: "כלול",
  category: "travel", categoryLabel: "תיירות וחוף", badge: "חדש",
  description: "תבנית סpa טרופי: הירו עם עלי כותרת נופלים, קרוסלת טיפולים, גן סיפור וטופס הזמנה — petal-fall animation.",
  thumbnail: React.createElement(SeabloomThumbnail),
  preview: React.createElement(SeabloomPreview),
  component: SeabloomPages, Component: SeabloomPages,
  seed: seabloomSeed, pages: seabloomPages, editorCss: seabloomEditorCss, schema: seabloomSchema, defaultData: seabloomDefaultData,
  renderer: {
    key: "seabloom", name: "Seabloom", Component: SeabloomPages, component: SeabloomPages, pages: seabloomPages,
    editorMode: "visual-react", editorCss: seabloomEditorCss, schema: seabloomSchema, defaultData: seabloomDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default seabloomTemplate;
