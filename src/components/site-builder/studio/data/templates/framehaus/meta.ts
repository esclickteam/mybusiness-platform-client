import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import FramehausPages, { framehausPages } from "./pages";
import FramehausPreview from "./preview";
import FramehausThumbnail from "./thumbnail";
import { framehausEditorCss } from "./editorCss";
import { framehausSchema } from "./schema";
import { framehausDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#ff3b30",
  secondary: "#111111",
  accent: "#ff3b30",
  background: "#fafafa",
  surface: "#fafafa",
  text: "#111111",
  muted: "#11111199",
  dark: "#111111",
};

export const framehausSeed = {
  id: "framehaus",
  key: "framehaus",
  name: "Framehaus",
  title: "Framehaus",
  description: "תבנית סטודיו צילום: פריימים מלבניים א-symmetric, שחור-לבן, 5 עמודים עשירים בסקשנים.",
  category: "portfolio",
  categoryLabel: "פורטפolio וצילום",
  niche: "photography-studio",
  layout: "full",
  image: (framehausDefaultData as Record<string, any>).heroImage,
  heroTitle: (framehausDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (framehausDefaultData as Record<string, any>).heroSubtitle,
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
  ].map((block, index) => ({ id: `framehaus-${index + 1}-${block.type}`, ...block })),
  pages: framehausPages,
  editor: { pages: framehausPages, css: framehausEditorCss },
  css: framehausEditorCss,
  data: framehausDefaultData,
  defaultData: framehausDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const framehausTemplate = {
  id: "framehaus",
  key: "framehaus",
  name: "Framehaus",
  title: "Framehaus",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "portfolio",
  categoryLabel: "פורטפolio וצילום",
  badge: "חדש",
  description: "תבנית סטודיו צילום: פריימים מלבניים א-symmetric, שחור-לבן, 5 עמודים עשירים בסקשנים.",
  thumbnail: React.createElement(FramehausThumbnail),
  preview: React.createElement(FramehausPreview),
  component: FramehausPages,
  Component: FramehausPages,
  seed: framehausSeed,
  pages: framehausPages,
  editorCss: framehausEditorCss,
  schema: framehausSchema,
  defaultData: framehausDefaultData,
  renderer: {
    key: "framehaus",
    name: "Framehaus",
    Component: FramehausPages,
    component: FramehausPages,
    pages: framehausPages,
    editorMode: "visual-react",
    editorCss: framehausEditorCss,
    schema: framehausSchema,
    defaultData: framehausDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default framehausTemplate;
