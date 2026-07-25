import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import MarkoraPages, { markoraPages } from "./pages";
import MarkoraPreview from "./preview";
import MarkoraThumbnail from "./thumbnail";
import { markoraEditorCss } from "./editorCss";
import { markoraSchema } from "./schema";
import { markoraDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#FF2D55",
  secondary: "#0A0A0B",
  accent: "#FF6B8A",
  background: "#0A0A0B",
  surface: "#141416",
  text: "#F7F7F8",
  muted: "#9B9BA3",
  dark: "#050505",
};

const blocks = [
  { type: "header", variant: "boldMagenta-header", title: "header" },
  { type: "hero", variant: "boldMagenta-hero", title: "hero" },
  { type: "services", variant: "boldMagenta-services", title: "services" },
  { type: "stats", variant: "boldMagenta-stats", title: "stats" },
  { type: "showcase", variant: "boldMagenta-showcase", title: "showcase" },
  { type: "process", variant: "boldMagenta-process", title: "process" },
  { type: "testimonials", variant: "boldMagenta-testimonials", title: "testimonials" },
  { type: "faq", variant: "boldMagenta-faq", title: "faq" },
  { type: "contact", variant: "boldMagenta-contact", title: "contact" },
  { type: "footer", variant: "boldMagenta-footer", title: "footer" },
];

export const markoraSeed = {
  id: "markora",
  key: "markora",
  name: "Markora",
  title: "Markora",
  description: "דף נחיתה לסוכנות שיווק: הירו נועז, שירותי מדיה, קמפיינים, תוצאות וטופס בריף.",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  niche: "marketing",
  layout: "full",
  image: (markoraDefaultData as Record<string, any>).heroImage,
  heroTitle: (markoraDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (markoraDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({ id: `markora-${index + 1}-${block.type}`, ...block })),
  pages: markoraPages,
  editor: { pages: markoraPages, css: markoraEditorCss },
  css: markoraEditorCss,
  data: markoraDefaultData,
  defaultData: markoraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const markoraTemplate = {
  id: "markora",
  key: "markora",
  name: "Markora",
  title: "Markora",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  badge: "Premium",
  description: "דף נחיתה לסוכנות שיווק: הירו נועז, שירותי מדיה, קמפיינים, תוצאות וטופס בריף.",
  thumbnail: React.createElement(MarkoraThumbnail),
  preview: React.createElement(MarkoraPreview),
  component: MarkoraPages,
  Component: MarkoraPages,
  seed: markoraSeed,
  pages: markoraPages,
  editorCss: markoraEditorCss,
  schema: markoraSchema,
  defaultData: markoraDefaultData,
  renderer: {
    key: "markora",
    name: "Markora",
    Component: MarkoraPages,
    component: MarkoraPages,
    pages: markoraPages,
    editorMode: "visual-react",
    editorCss: markoraEditorCss,
    schema: markoraSchema,
    defaultData: markoraDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default markoraTemplate;
