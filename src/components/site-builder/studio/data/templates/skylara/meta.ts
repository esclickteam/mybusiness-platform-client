import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import SkylaraPages, { skylaraPages } from "./pages";
import SkylaraPreview from "./preview";
import SkylaraThumbnail from "./thumbnail";
import { skylaraEditorCss } from "./editorCss";
import { skylaraSchema } from "./schema";
import { skylaraDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#39D0FF", secondary: "#1A6F8C", accent: "#9AE8FF",
  background: "#071525", surface: "#0D2136", text: "#E8F1FF", muted: "#7F97B0", dark: "#030A12",
};

export const skylaraSeed = {
  id: "skylara", key: "skylara", name: "Skylara", title: "Skylara",
  description: "תבנית נדל״ן למגדלים וקו רקיע: כחול לילה וציאן, פיצול חד, רשימות דירות במגדלים.",
  category: "real-estate", categoryLabel: "נדל״ן", niche: "real-estate", layout: "full",
  image: (skylaraDefaultData as any).heroImage,
  heroTitle: (skylaraDefaultData as any).heroTitle,
  heroSubtitle: (skylaraDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "sharp-nav", title: "Header" },
    { type: "hero", variant: "full-bleed", title: "Hero" },
    { type: "services", variant: "list", title: "Listings" },
    { type: "contact", variant: "plain-form", title: "Contact" },
    { type: "footer", variant: "minimal", title: "Footer" },
  ].map((b, i) => ({ id: `skylara-${i+1}-${b.type}`, ...b })),
  pages: skylaraPages,
  editor: { pages: skylaraPages, css: skylaraEditorCss },
  css: skylaraEditorCss, data: skylaraDefaultData, defaultData: skylaraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const skylaraTemplate = {
  id: "skylara", key: "skylara", name: "Skylara", title: "Skylara", author: "Bizuply", priceLabel: "כלול",
  category: "real-estate", categoryLabel: "נדל״ן", badge: "חדש",
  description: "תבנית נדל״ן למגדלים וקו רקיע: כחול לילה וציאן, פיצול חד, רשימות דירות במגדלים.",
  thumbnail: React.createElement(SkylaraThumbnail),
  preview: React.createElement(SkylaraPreview),
  component: SkylaraPages, Component: SkylaraPages,
  seed: skylaraSeed, pages: skylaraPages, editorCss: skylaraEditorCss, schema: skylaraSchema, defaultData: skylaraDefaultData,
  renderer: {
    key: "skylara", name: "Skylara", Component: SkylaraPages, component: SkylaraPages, pages: skylaraPages,
    editorMode: "visual-react", editorCss: skylaraEditorCss, schema: skylaraSchema, defaultData: skylaraDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default skylaraTemplate;
