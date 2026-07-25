import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import FloriquePages, { floriquePages } from "./pages";
import FloriquePreview from "./preview";
import FloriqueThumbnail from "./thumbnail";
import { floriqueEditorCss } from "./editorCss";
import { floriqueSchema } from "./schema";
import { floriqueDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  "primary": "#E11D8C",
  "secondary": "#FFF7FB",
  "accent": "#F472B6",
  "background": "#FFF7FB",
  "surface": "#FFFFFF",
  "text": "#3B1028",
  "muted": "#9D6B85",
  "dark": "#1F0A16"
};

export const floriqueSeed = {
  id: "florique",
  key: "florique",
  name: "Florique",
  title: "Florique",
  description: "דף נחיתה מקצועי לתחום עיצוב פרחים עם תנועה, אפקטים ועיצוב ייחודי.",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  niche: "florist",
  layout: "full",
  image: (floriqueDefaultData as any).heroImage,
  heroTitle: (floriqueDefaultData as any).heroTitle,
  heroSubtitle: (floriqueDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "florique-header", title: "header" },
    { type: "hero", variant: "florique-hero", title: "hero" },
    { type: "services", variant: "florique-services", title: "services" },
    { type: "showcase", variant: "florique-showcase", title: "showcase" },
    { type: "stats", variant: "florique-stats", title: "stats" },
    { type: "process", variant: "florique-process", title: "process" },
    { type: "testimonials", variant: "florique-testimonials", title: "testimonials" },
    { type: "faq", variant: "florique-faq", title: "faq" },
    { type: "contact", variant: "florique-contact", title: "contact" },
    { type: "footer", variant: "florique-footer", title: "footer" },
  ].map((block, index) => ({ id: `florique-${index + 1}-${block.type}`, ...block })),
  pages: floriquePages,
  editor: { pages: floriquePages, css: floriqueEditorCss },
  css: floriqueEditorCss,
  data: floriqueDefaultData,
  defaultData: floriqueDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const floriqueTemplate = {
  id: "florique",
  key: "florique",
  name: "Florique",
  title: "Florique",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  badge: "חדש",
  description: "דף נחיתה מקצועי לתחום עיצוב פרחים עם תנועה, אפקטים ועיצוב ייחודי.",
  thumbnail: React.createElement(FloriqueThumbnail),
  preview: React.createElement(FloriquePreview),
  component: FloriquePages,
  Component: FloriquePages,
  seed: floriqueSeed,
  pages: floriquePages,
  editorCss: floriqueEditorCss,
  schema: floriqueSchema,
  defaultData: floriqueDefaultData,
  renderer: {
    key: "florique",
    name: "Florique",
    Component: FloriquePages,
    component: FloriquePages,
    pages: floriquePages,
    editorMode: "visual-react",
    editorCss: floriqueEditorCss,
    schema: floriqueSchema,
    defaultData: floriqueDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default floriqueTemplate;
