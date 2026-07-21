import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import TidehausPages, { tidehausPages } from "./pages";
import TidehausPreview from "./preview";
import TidehausThumbnail from "./thumbnail";
import { tidehausEditorCss } from "./editorCss";
import { tidehausSchema } from "./schema";
import { tidehausDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#0077b6", secondary: "#4a7185", accent: "#0077b6",
  background: "#eef6fb", surface: "#ffffff", text: "#0c2a3a", muted: "#4a7185", dark: "#061820",
};

export const tidehausSeed = {
  id: "tidehaus", key: "tidehaus", name: "Tidehaus", title: "Tidehaus",
  description: "תבנית חנות גלישה: הירו עם קו גאות נע, מסילת גלשנים אופקית, גרף גובה גלים ובר שעווה — תנועת board-tilt.",
  category: "travel", categoryLabel: "תיירות וחוף", niche: "Surf · גלים", layout: "full",
  image: (tidehausDefaultData as any).heroImage,
  heroTitle: (tidehausDefaultData as any).heroTitle,
  heroSubtitle: (tidehausDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "surf-nav", title: "Surf nav" },
    { type: "hero", variant: "tide-line", title: "Tide line hero" },
    { type: "products", variant: "board-rail", title: "Surfboard rail" },
    { type: "forecast", variant: "wave-chart", title: "Wave forecast" },
    { type: "about", variant: "shop-story", title: "Shop story" },
    { type: "contact", variant: "rental-form", title: "Rental form" },
    { type: "footer", variant: "minimal", title: "Footer" },
  ].map((b, i) => ({ id: `tidehaus-${i+1}-${b.type}`, ...b })),
  pages: tidehausPages,
  editor: { pages: tidehausPages, css: tidehausEditorCss },
  css: tidehausEditorCss, data: tidehausDefaultData, defaultData: tidehausDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const tidehausTemplate = {
  id: "tidehaus", key: "tidehaus", name: "Tidehaus", title: "Tidehaus", author: "Bizuply", priceLabel: "כלול",
  category: "travel", categoryLabel: "תיירות וחוף", badge: "חדש",
  description: "תבנית חנות גלישה: הירו עם קו גאות נע, מסילת גלשנים אופקית, גרף גובה גלים ובר שעווה — תנועת board-tilt.",
  thumbnail: React.createElement(TidehausThumbnail),
  preview: React.createElement(TidehausPreview),
  component: TidehausPages, Component: TidehausPages,
  seed: tidehausSeed, pages: tidehausPages, editorCss: tidehausEditorCss, schema: tidehausSchema, defaultData: tidehausDefaultData,
  renderer: {
    key: "tidehaus", name: "Tidehaus", Component: TidehausPages, component: TidehausPages, pages: tidehausPages,
    editorMode: "visual-react", editorCss: tidehausEditorCss, schema: tidehausSchema, defaultData: tidehausDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default tidehausTemplate;
