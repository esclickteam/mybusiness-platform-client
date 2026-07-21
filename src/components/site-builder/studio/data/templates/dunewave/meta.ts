import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import DunewavePages, { dunewavePages } from "./pages";
import DunewavePreview from "./preview";
import DunewaveThumbnail from "./thumbnail";
import { dunewaveEditorCss } from "./editorCss";
import { dunewaveSchema } from "./schema";
import { dunewaveDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#c9956a", secondary: "#8a7358", accent: "#c9956a",
  background: "#f4ead8", surface: "#fff8ee", text: "#3d2f1f", muted: "#8a7358", dark: "#2a1c10",
};

export const dunewaveSeed = {
  id: "dunewave", key: "dunewave", name: "Dunewave", title: "Dunewave",
  description: "תבנית ריזורט על דיונות: הירו פרallax עם גלי חול SVG, כרטיסי וילות אופקיים, סטטיסטיקות חול ושקיעה — תנועה איטית וקולנועית.",
  category: "travel", categoryLabel: "תיירות וחוף", niche: "Resort · דיונות", layout: "full",
  image: (dunewaveDefaultData as any).heroImage,
  heroTitle: (dunewaveDefaultData as any).heroTitle,
  heroSubtitle: (dunewaveDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "dune-nav", title: "Dune nav" },
    { type: "hero", variant: "parallax-dunes-wave", title: "Parallax dunes hero" },
    { type: "listings", variant: "horizontal-villa-rail", title: "Villa cards rail" },
    { type: "stats", variant: "sand-sunset-stats", title: "Sand stats band" },
    { type: "about", variant: "resort-story", title: "Resort story" },
    { type: "contact", variant: "booking-form", title: "Booking form" },
    { type: "footer", variant: "minimal", title: "Footer" },
  ].map((b, i) => ({ id: `dunewave-${i+1}-${b.type}`, ...b })),
  pages: dunewavePages,
  editor: { pages: dunewavePages, css: dunewaveEditorCss },
  css: dunewaveEditorCss, data: dunewaveDefaultData, defaultData: dunewaveDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const dunewaveTemplate = {
  id: "dunewave", key: "dunewave", name: "Dunewave", title: "Dunewave", author: "Bizuply", priceLabel: "כלול",
  category: "travel", categoryLabel: "תיירות וחוף", badge: "חדש",
  description: "תבנית ריזורט על דיונות: הירו פרallax עם גלי חול SVG, כרטיסי וילות אופקיים, סטטיסטיקות חול ושקיעה — תנועה איטית וקולנועית.",
  thumbnail: React.createElement(DunewaveThumbnail),
  preview: React.createElement(DunewavePreview),
  component: DunewavePages, Component: DunewavePages,
  seed: dunewaveSeed, pages: dunewavePages, editorCss: dunewaveEditorCss, schema: dunewaveSchema, defaultData: dunewaveDefaultData,
  renderer: {
    key: "dunewave", name: "Dunewave", Component: DunewavePages, component: DunewavePages, pages: dunewavePages,
    editorMode: "visual-react", editorCss: dunewaveEditorCss, schema: dunewaveSchema, defaultData: dunewaveDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default dunewaveTemplate;
