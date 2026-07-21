import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import MiragePages, { miragePages } from "./pages";
import MiragePreview from "./preview";
import MirageThumbnail from "./thumbnail";
import { mirageEditorCss } from "./editorCss";
import { mirageSchema } from "./schema";
import { mirageDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#d4a574", secondary: "#9a8268", accent: "#d4a574",
  background: "#f7f0e4", surface: "#fff9f0", text: "#4a3828", muted: "#9a8268", dark: "#2a1e12",
};

export const mirageSeed = {
  id: "mirage", key: "mirage", name: "Mirage", title: "Mirage",
  description: "תבנית ריזורט מדבר-ים: הירו עם heat shimmer, כרטיסי oasis, פסי טמפרטורה וטופס mirage — אפקט wobble ייחודי.",
  category: "travel", categoryLabel: "תיירות וחוף", niche: "מדבר · ים", layout: "full",
  image: (mirageDefaultData as any).heroImage,
  heroTitle: (mirageDefaultData as any).heroTitle,
  heroSubtitle: (mirageDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "desert-nav", title: "Desert nav" },
    { type: "hero", variant: "heat-shimmer", title: "Heat shimmer hero" },
    { type: "suites", variant: "oasis-temp-bands", title: "Oasis temperature cards" },
    { type: "wellness", variant: "mirage-band", title: "Wellness band" },
    { type: "about", variant: "resort-story", title: "Resort story" },
    { type: "contact", variant: "booking-form", title: "Booking form" },
    { type: "footer", variant: "minimal", title: "Footer" },
  ].map((b, i) => ({ id: `mirage-${i+1}-${b.type}`, ...b })),
  pages: miragePages,
  editor: { pages: miragePages, css: mirageEditorCss },
  css: mirageEditorCss, data: mirageDefaultData, defaultData: mirageDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const mirageTemplate = {
  id: "mirage", key: "mirage", name: "Mirage", title: "Mirage", author: "Bizuply", priceLabel: "כלול",
  category: "travel", categoryLabel: "תיירות וחוף", badge: "חדש",
  description: "תבנית ריזורט מדבר-ים: הירו עם heat shimmer, כרטיסי oasis, פסי טמפרטורה וטופס mirage — אפקט wobble ייחודי.",
  thumbnail: React.createElement(MirageThumbnail),
  preview: React.createElement(MiragePreview),
  component: MiragePages, Component: MiragePages,
  seed: mirageSeed, pages: miragePages, editorCss: mirageEditorCss, schema: mirageSchema, defaultData: mirageDefaultData,
  renderer: {
    key: "mirage", name: "Mirage", Component: MiragePages, component: MiragePages, pages: miragePages,
    editorMode: "visual-react", editorCss: mirageEditorCss, schema: mirageSchema, defaultData: mirageDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default mirageTemplate;
