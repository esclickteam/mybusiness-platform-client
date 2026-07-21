import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import HorizonPages, { horizonPages } from "./pages";
import HorizonPreview from "./preview";
import HorizonThumbnail from "./thumbnail";
import { horizonEditorCss } from "./editorCss";
import { horizonSchema } from "./schema";
import { horizonDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#b8956b",
  secondary: "#1c1c1c",
  accent: "#b8956b",
  background: "#f7f3ed",
  surface: "#f7f3ed",
  text: "#1c1c1c",
  muted: "#1c1c1c99",
  dark: "#1c1c1c",
};

export const horizonSeed = {
  id: "horizon",
  key: "horizon",
  name: "Horizon",
  title: "Horizon",
  description: "תבנית נדל״ן פנורמית: פאנלים אופקיים רחבים, חול-פחם, 6 עמודים מורכבים.",
  category: "realestate",
  categoryLabel: "נדל״ן",
  niche: "real-estate",
  layout: "full",
  image: (horizonDefaultData as Record<string, any>).heroImage,
  heroTitle: (horizonDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (horizonDefaultData as Record<string, any>).heroSubtitle,
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
  ].map((block, index) => ({ id: `horizon-${index + 1}-${block.type}`, ...block })),
  pages: horizonPages,
  editor: { pages: horizonPages, css: horizonEditorCss },
  css: horizonEditorCss,
  data: horizonDefaultData,
  defaultData: horizonDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const horizonTemplate = {
  id: "horizon",
  key: "horizon",
  name: "Horizon",
  title: "Horizon",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "realestate",
  categoryLabel: "נדל״ן",
  badge: "Premium",
  description: "תבנית נדל״ן פנורמית: פאנלים אופקיים רחבים, חול-פחם, 6 עמודים מורכבים.",
  thumbnail: React.createElement(HorizonThumbnail),
  preview: React.createElement(HorizonPreview),
  component: HorizonPages,
  Component: HorizonPages,
  seed: horizonSeed,
  pages: horizonPages,
  editorCss: horizonEditorCss,
  schema: horizonSchema,
  defaultData: horizonDefaultData,
  renderer: {
    key: "horizon",
    name: "Horizon",
    Component: HorizonPages,
    component: HorizonPages,
    pages: horizonPages,
    editorMode: "visual-react",
    editorCss: horizonEditorCss,
    schema: horizonSchema,
    defaultData: horizonDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default horizonTemplate;
