import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import UrbanixPages, { urbanixPages } from "./pages";
import UrbanixPreview from "./preview";
import UrbanixThumbnail from "./thumbnail";
import { urbanixEditorCss } from "./editorCss";
import { urbanixSchema } from "./schema";
import { urbanixDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#C8F542", secondary: "#6B7A2A", accent: "#E7FF8A",
  background: "#1A1C1E", surface: "#242628", text: "#F2F2F0", muted: "#9A9D98", dark: "#0E0F10",
};

export const urbanixSeed = {
  id: "urbanix", key: "urbanix", name: "Urbanix", title: "Urbanix",
  description: "תבנית נדל״ן עירוני לדירות ומגדלים: אפור בטון וליים, טיפוגרפיה ענקית, בלי כרטיסים.",
  category: "real-estate", categoryLabel: "נדל״ן", niche: "real-estate", layout: "full",
  image: (urbanixDefaultData as any).heroImage,
  heroTitle: (urbanixDefaultData as any).heroTitle,
  heroSubtitle: (urbanixDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "sharp-nav", title: "Header" },
    { type: "hero", variant: "full-bleed", title: "Hero" },
    { type: "services", variant: "list", title: "Listings" },
    { type: "contact", variant: "plain-form", title: "Contact" },
    { type: "footer", variant: "minimal", title: "Footer" },
  ].map((b, i) => ({ id: `urbanix-${i+1}-${b.type}`, ...b })),
  pages: urbanixPages,
  editor: { pages: urbanixPages, css: urbanixEditorCss },
  css: urbanixEditorCss, data: urbanixDefaultData, defaultData: urbanixDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const urbanixTemplate = {
  id: "urbanix", key: "urbanix", name: "Urbanix", title: "Urbanix", author: "Bizuply", priceLabel: "כלול",
  category: "real-estate", categoryLabel: "נדל״ן", badge: "חדש",
  description: "תבנית נדל״ן עירוני לדירות ומגדלים: אפור בטון וליים, טיפוגרפיה ענקית, בלי כרטיסים.",
  thumbnail: React.createElement(UrbanixThumbnail),
  preview: React.createElement(UrbanixPreview),
  component: UrbanixPages, Component: UrbanixPages,
  seed: urbanixSeed, pages: urbanixPages, editorCss: urbanixEditorCss, schema: urbanixSchema, defaultData: urbanixDefaultData,
  renderer: {
    key: "urbanix", name: "Urbanix", Component: UrbanixPages, component: UrbanixPages, pages: urbanixPages,
    editorMode: "visual-react", editorCss: urbanixEditorCss, schema: urbanixSchema, defaultData: urbanixDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default urbanixTemplate;
