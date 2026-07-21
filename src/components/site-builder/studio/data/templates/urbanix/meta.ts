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
  primary: "#c8f542", secondary: "#9a9d98", accent: "#c8f542",
  background: "#141516", surface: "#1e2022", text: "#f2f2f0", muted: "#9a9d98", dark: "#0a0b0c",
};

export const urbanixSeed = {
  id: "urbanix", key: "urbanix", name: "Urbanix", title: "Urbanix",
  description: "תבנית אורבנית קיצונית: טיפוגרפיה ענקית, פס שכונות רץ, בטון וליים זוהר.",
  category: "real-estate", categoryLabel: "נדל״ן", niche: "real-estate", layout: "full",
  image: (urbanixDefaultData as any).heroImage,
  heroTitle: (urbanixDefaultData as any).heroTitle,
  heroSubtitle: (urbanixDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "sharp-nav", title: "Header" },
    { type: "hero", variant: "marqueeUrban", title: "Hero" },
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
  description: "תבנית אורבנית קיצונית: טיפוגרפיה ענקית, פס שכונות רץ, בטון וליים זוהר.",
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
