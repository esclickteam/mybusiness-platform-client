import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import DriftwoodPages, { driftwoodPages } from "./pages";
import DriftwoodPreview from "./preview";
import DriftwoodThumbnail from "./thumbnail";
import { driftwoodEditorCss } from "./editorCss";
import { driftwoodSchema } from "./schema";
import { driftwoodDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#8b5e3c", secondary: "#8b7355", accent: "#8b5e3c",
  background: "#f0e8dc", surface: "#faf5ed", text: "#3c2e22", muted: "#8b7355", dark: "#2a2018",
};

export const driftwoodSeed = {
  id: "driftwood", key: "driftwood", name: "Driftwood", title: "Driftwood",
  description: "תבנית מסעדה על החול: הירו אורgani עם driftwood צף, תפריט scroll, סיפור שף חופף וטופס הזמנה — grain drift animation.",
  category: "travel", categoryLabel: "תיירות וחוף", niche: "מסעדת חוף", layout: "full",
  image: (driftwoodDefaultData as any).heroImage,
  heroTitle: (driftwoodDefaultData as any).heroTitle,
  heroSubtitle: (driftwoodDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "wood-nav", title: "Wood nav" },
    { type: "hero", variant: "organic-drift", title: "Organic wood hero" },
    { type: "menu", variant: "horizontal-menu-scroll", title: "Menu scroll" },
    { type: "chef", variant: "story-overlap", title: "Chef story" },
    { type: "about", variant: "beach-dining", title: "Beach dining" },
    { type: "contact", variant: "reservation-form", title: "Reservation" },
    { type: "footer", variant: "minimal", title: "Footer" },
  ].map((b, i) => ({ id: `driftwood-${i+1}-${b.type}`, ...b })),
  pages: driftwoodPages,
  editor: { pages: driftwoodPages, css: driftwoodEditorCss },
  css: driftwoodEditorCss, data: driftwoodDefaultData, defaultData: driftwoodDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const driftwoodTemplate = {
  id: "driftwood", key: "driftwood", name: "Driftwood", title: "Driftwood", author: "Bizuply", priceLabel: "כלול",
  category: "travel", categoryLabel: "תיירות וחוף", badge: "חדש",
  description: "תבנית מסעדה על החול: הירו אורgani עם driftwood צף, תפריט scroll, סיפור שף חופף וטופס הזמנה — grain drift animation.",
  thumbnail: React.createElement(DriftwoodThumbnail),
  preview: React.createElement(DriftwoodPreview),
  component: DriftwoodPages, Component: DriftwoodPages,
  seed: driftwoodSeed, pages: driftwoodPages, editorCss: driftwoodEditorCss, schema: driftwoodSchema, defaultData: driftwoodDefaultData,
  renderer: {
    key: "driftwood", name: "Driftwood", Component: DriftwoodPages, component: DriftwoodPages, pages: driftwoodPages,
    editorMode: "visual-react", editorCss: driftwoodEditorCss, schema: driftwoodSchema, defaultData: driftwoodDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default driftwoodTemplate;
