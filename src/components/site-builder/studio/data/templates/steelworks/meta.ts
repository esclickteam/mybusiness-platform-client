import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import SteelworksPages, { steelworksPages } from "./pages";
import SteelworksPreview from "./preview";
import SteelworksThumbnail from "./thumbnail";
import { steelworksEditorCss } from "./editorCss";
import { steelworksSchema } from "./schema";
import { steelworksDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#ff6b2c",
  secondary: "#f0f0f0",
  accent: "#ff6b2c",
  background: "#1a1a1a",
  surface: "#1a1a1a",
  text: "#f0f0f0",
  muted: "#f0f0f099",
  dark: "#f0f0f0",
};

export const steelworksSeed = {
  id: "steelworks",
  key: "steelworks",
  name: "Steelworks",
  title: "Steelworks",
  description: "תבנית תעשייתית: פסים אופקיים, כתום-פלדה, 6 עמודים עם מקטעי תנועה וכניסות.",
  category: "industry",
  categoryLabel: "תעשייה וייצור",
  niche: "industrial-manufacturing",
  layout: "full",
  image: (steelworksDefaultData as Record<string, any>).heroImage,
  heroTitle: (steelworksDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (steelworksDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "rect-nav", title: "Header" },
    { type: "hero", variant: "rect-split", title: "Hero" },
    { type: "stats", variant: "rect-grid", title: "Stats" },
    { type: "services", variant: "rect-columns", title: "Services" },
    { type: "work", variant: "rect-gallery", title: "Work" },
    { type: "process", variant: "rect-steps", title: "Process" },
    { type: "contact", variant: "rect-form", title: "Contact" },
    { type: "footer", variant: "rect-footer", title: "Footer" },
  ].map((block, index) => ({ id: `steelworks-${index + 1}-${block.type}`, ...block })),
  pages: steelworksPages,
  editor: { pages: steelworksPages, css: steelworksEditorCss },
  css: steelworksEditorCss,
  data: steelworksDefaultData,
  defaultData: steelworksDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const steelworksTemplate = {
  id: "steelworks",
  key: "steelworks",
  name: "Steelworks",
  title: "Steelworks",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "industry",
  categoryLabel: "תעשייה וייצור",
  badge: "Premium",
  description: "תבנית תעשייתית: פסים אופקיים, כתום-פלדה, 6 עמודים עם מקטעי תנועה וכניסות.",
  thumbnail: React.createElement(SteelworksThumbnail),
  preview: React.createElement(SteelworksPreview),
  component: SteelworksPages,
  Component: SteelworksPages,
  seed: steelworksSeed,
  pages: steelworksPages,
  editorCss: steelworksEditorCss,
  schema: steelworksSchema,
  defaultData: steelworksDefaultData,
  renderer: {
    key: "steelworks",
    name: "Steelworks",
    Component: SteelworksPages,
    component: SteelworksPages,
    pages: steelworksPages,
    editorMode: "visual-react",
    editorCss: steelworksEditorCss,
    schema: steelworksSchema,
    defaultData: steelworksDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default steelworksTemplate;
