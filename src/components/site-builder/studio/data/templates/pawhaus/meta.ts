import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import PawhausPages, { pawhausPages } from "./pages";
import PawhausPreview from "./preview";
import PawhausThumbnail from "./thumbnail";
import { pawhausEditorCss } from "./editorCss";
import { pawhausSchema } from "./schema";
import { pawhausDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  "primary": "#F59E0B",
  "secondary": "#1C1917",
  "accent": "#FBBF24",
  "background": "#FAF7F2",
  "surface": "#FFFFFF",
  "text": "#1C1917",
  "muted": "#78716C",
  "dark": "#0C0A09"
};

export const pawhausSeed = {
  id: "pawhaus",
  key: "pawhaus",
  name: "Pawhaus",
  title: "Pawhaus",
  description: "דף נחיתה מקצועי לתחום טיפול בחיות עם תנועה, אפקטים ועיצוב ייחודי.",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  niche: "pets",
  layout: "full",
  image: (pawhausDefaultData as any).heroImage,
  heroTitle: (pawhausDefaultData as any).heroTitle,
  heroSubtitle: (pawhausDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "pawhaus-header", title: "header" },
    { type: "hero", variant: "pawhaus-hero", title: "hero" },
    { type: "services", variant: "pawhaus-services", title: "services" },
    { type: "showcase", variant: "pawhaus-showcase", title: "showcase" },
    { type: "stats", variant: "pawhaus-stats", title: "stats" },
    { type: "process", variant: "pawhaus-process", title: "process" },
    { type: "testimonials", variant: "pawhaus-testimonials", title: "testimonials" },
    { type: "faq", variant: "pawhaus-faq", title: "faq" },
    { type: "contact", variant: "pawhaus-contact", title: "contact" },
    { type: "footer", variant: "pawhaus-footer", title: "footer" },
  ].map((block, index) => ({ id: `pawhaus-${index + 1}-${block.type}`, ...block })),
  pages: pawhausPages,
  editor: { pages: pawhausPages, css: pawhausEditorCss },
  css: pawhausEditorCss,
  data: pawhausDefaultData,
  defaultData: pawhausDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const pawhausTemplate = {
  id: "pawhaus",
  key: "pawhaus",
  name: "Pawhaus",
  title: "Pawhaus",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  badge: "חדש",
  description: "דף נחיתה מקצועי לתחום טיפול בחיות עם תנועה, אפקטים ועיצוב ייחודי.",
  thumbnail: React.createElement(PawhausThumbnail),
  preview: React.createElement(PawhausPreview),
  component: PawhausPages,
  Component: PawhausPages,
  seed: pawhausSeed,
  pages: pawhausPages,
  editorCss: pawhausEditorCss,
  schema: pawhausSchema,
  defaultData: pawhausDefaultData,
  renderer: {
    key: "pawhaus",
    name: "Pawhaus",
    Component: PawhausPages,
    component: PawhausPages,
    pages: pawhausPages,
    editorMode: "visual-react",
    editorCss: pawhausEditorCss,
    schema: pawhausSchema,
    defaultData: pawhausDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default pawhausTemplate;
