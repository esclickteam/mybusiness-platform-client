import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import LandmarkPages, { landmarkPages } from "./pages";
import LandmarkPreview from "./preview";
import LandmarkThumbnail from "./thumbnail";
import { landmarkEditorCss } from "./editorCss";
import { landmarkSchema } from "./schema";
import { landmarkDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#0ea5e9", secondary: "#64748b", accent: "#0ea5e9",
  background: "#f0f4f8", surface: "#ffffff", text: "#1e293b", muted: "#64748b", dark: "#0f172a",
};

export const landmarkSeed = {
  id: "landmark", key: "landmark", name: "Landmark", title: "Landmark",
  description: "תבנית עיר: סילhouette עם נקודות map pin, כרטיסי מדריך אזורים ושורות נכסים עם תגי מיקום.",
  category: "real-estate", categoryLabel: "נדל״ן", niche: "מדריך אזורים · נדל״ן", layout: "full",
  image: (landmarkDefaultData as any).heroImage,
  heroTitle: (landmarkDefaultData as any).heroTitle,
  heroSubtitle: (landmarkDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "map-nav", title: "Nav" },
    { type: "hero", variant: "city-silhouette", title: "Hero" },
    { type: "areas", variant: "area-guides", title: "Areas" },
    { type: "listings", variant: "location-rows", title: "Rows" },
    { type: "about", variant: "local-story", title: "About" },
    { type: "contact", variant: "area-form", title: "Contact" },
    { type: "footer", variant: "minimal", title: "Footer" },
  ].map((b, i) => ({ id: `landmark-${i+1}-${b.type}`, ...b })),
  pages: landmarkPages,
  editor: { pages: landmarkPages, css: landmarkEditorCss },
  css: landmarkEditorCss, data: landmarkDefaultData, defaultData: landmarkDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const landmarkTemplate = {
  id: "landmark", key: "landmark", name: "Landmark", title: "Landmark", author: "Bizuply", priceLabel: "כלול",
  category: "real-estate", categoryLabel: "נדל״ן", badge: "חדש",
  description: "תבנית עיר: סילhouette עם נקודות map pin, כרטיסי מדריך אזורים ושורות נכסים עם תגי מיקום.",
  thumbnail: React.createElement(LandmarkThumbnail),
  preview: React.createElement(LandmarkPreview),
  component: LandmarkPages, Component: LandmarkPages,
  seed: landmarkSeed, pages: landmarkPages, editorCss: landmarkEditorCss, schema: landmarkSchema, defaultData: landmarkDefaultData,
  renderer: {
    key: "landmark", name: "Landmark", Component: LandmarkPages, component: LandmarkPages, pages: landmarkPages,
    editorMode: "visual-react", editorCss: landmarkEditorCss, schema: landmarkSchema, defaultData: landmarkDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default landmarkTemplate;
