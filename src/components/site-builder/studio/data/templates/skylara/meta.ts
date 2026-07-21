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
  primary: "#39d0ff", secondary: "#7f97b0", accent: "#39d0ff",
  background: "#06101c", surface: "#0c1a2b", text: "#e8f1ff", muted: "#7f97b0", dark: "#02070e",
};

export const skylaraSeed = {
  id: "skylara", key: "skylara", name: "Skylara", title: "Skylara",
  description: "תבנית מגדלים בחצות וציאן: הירו מגדל אנכי עם סימוני קומות, רשימת דירות מטפסת, שורות שירותים בקווי מתאר ורצועת קו רקיע מלאה.",
  category: "real-estate", categoryLabel: "נדל״ן", niche: "real-estate", layout: "full",
  image: (skylaraDefaultData as any).heroImage,
  heroTitle: (skylaraDefaultData as any).heroTitle,
  heroSubtitle: (skylaraDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "midnight-cyan-accent", title: "Midnight header" },
    { type: "hero", variant: "vertical-tower-floors", title: "Tower hero" },
    { type: "listings", variant: "floor-climb-list", title: "Floor apartments" },
    { type: "about", variant: "outline-amenities", title: "Amenity outlines" },
    { type: "media", variant: "full-bleed-skyline", title: "Skyline band" },
    { type: "contact", variant: "dark-cyan-request", title: "Cyan contact" },
    { type: "footer", variant: "floor-echo", title: "Floor echo footer" },
  ].map((b, i) => ({ id: `skylara-${i + 1}-${b.type}`, ...b })),
  pages: skylaraPages,
  editor: { pages: skylaraPages, css: skylaraEditorCss },
  css: skylaraEditorCss, data: skylaraDefaultData, defaultData: skylaraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const skylaraTemplate = {
  id: "skylara", key: "skylara", name: "Skylara", title: "Skylara", author: "Bizuply", priceLabel: "כלול",
  category: "real-estate", categoryLabel: "נדל״ן", badge: "חדש",
  description: "תבנית היי-רייז עם עמוד מגדל אנכי, קומות מטפסות, שורות שירותים חדות ורצועת קו רקיע.",
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
