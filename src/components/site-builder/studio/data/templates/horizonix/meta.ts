import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import HorizonixPages, { horizonixPages } from "./pages";
import HorizonixPreview from "./preview";
import HorizonixThumbnail from "./thumbnail";
import { horizonixEditorCss } from "./editorCss";
import { horizonixSchema } from "./schema";
import { horizonixDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#58a6ff", secondary: "#8b949e", accent: "#58a6ff",
  background: "#0d1117", surface: "#161b22", text: "#f0f6fc", muted: "#8b949e", dark: "#010409",
};

export const horizonixSeed = {
  id: "horizonix", key: "horizonix", name: "Horizonix", title: "Horizonix",
  description: "תבנית סיורי צילום: הירo panorama carousel עם 3 פאנלים, גaleria zoom, חבילות טיול וטופס lens — pan-slide animation.",
  category: "travel", categoryLabel: "תיירות וחוף", niche: "צילום · חוף", layout: "full",
  image: (horizonixDefaultData as any).heroImage,
  heroTitle: (horizonixDefaultData as any).heroTitle,
  heroSubtitle: (horizonixDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "photo-nav", title: "Photo nav" },
    { type: "hero", variant: "panorama-slide", title: "Panorama carousel hero" },
    { type: "gallery", variant: "zoom-grid", title: "Gallery zoom grid" },
    { type: "tours", variant: "package-cards", title: "Tour packages" },
    { type: "about", variant: "photographer-story", title: "Photographer story" },
    { type: "contact", variant: "tour-booking", title: "Tour booking" },
    { type: "footer", variant: "minimal", title: "Footer" },
  ].map((b, i) => ({ id: `horizonix-${i+1}-${b.type}`, ...b })),
  pages: horizonixPages,
  editor: { pages: horizonixPages, css: horizonixEditorCss },
  css: horizonixEditorCss, data: horizonixDefaultData, defaultData: horizonixDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const horizonixTemplate = {
  id: "horizonix", key: "horizonix", name: "Horizonix", title: "Horizonix", author: "Bizuply", priceLabel: "כלול",
  category: "travel", categoryLabel: "תיירות וחוף", badge: "חדש",
  description: "תבנית סיורי צילום: הירo panorama carousel עם 3 פאנלים, גaleria zoom, חבילות טיול וטופס lens — pan-slide animation.",
  thumbnail: React.createElement(HorizonixThumbnail),
  preview: React.createElement(HorizonixPreview),
  component: HorizonixPages, Component: HorizonixPages,
  seed: horizonixSeed, pages: horizonixPages, editorCss: horizonixEditorCss, schema: horizonixSchema, defaultData: horizonixDefaultData,
  renderer: {
    key: "horizonix", name: "Horizonix", Component: HorizonixPages, component: HorizonixPages, pages: horizonixPages,
    editorMode: "visual-react", editorCss: horizonixEditorCss, schema: horizonixSchema, defaultData: horizonixDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default horizonixTemplate;
