import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import GridlinePages, { gridlinePages } from "./pages";
import GridlinePreview from "./preview";
import GridlineThumbnail from "./thumbnail";
import { gridlineEditorCss } from "./editorCss";
import { gridlineSchema } from "./schema";
import { gridlineDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#111111",
  secondary: "#111111",
  accent: "#111111",
  background: "#f4f4f0",
  surface: "#f4f4f0",
  text: "#111111",
  muted: "#11111199",
  dark: "#111111",
};

export const gridlineSeed = {
  id: "gridline",
  key: "gridline",
  name: "Gridline",
  title: "Gridline",
  description: "תבנית אדריכלות בראוטליסטית: רשת גריד גלויה, פינות ישרות, 6 עמודים וסקשנים עם כניסות תנועה.",
  category: "architecture",
  categoryLabel: "אדריכלות ובנייה",
  niche: "architecture-studio",
  layout: "full",
  image: (gridlineDefaultData as Record<string, any>).heroImage,
  heroTitle: (gridlineDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (gridlineDefaultData as Record<string, any>).heroSubtitle,
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
  ].map((block, index) => ({ id: `gridline-${index + 1}-${block.type}`, ...block })),
  pages: gridlinePages,
  editor: { pages: gridlinePages, css: gridlineEditorCss },
  css: gridlineEditorCss,
  data: gridlineDefaultData,
  defaultData: gridlineDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const gridlineTemplate = {
  id: "gridline",
  key: "gridline",
  name: "Gridline",
  title: "Gridline",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "architecture",
  categoryLabel: "אדריכלות ובנייה",
  badge: "חדש",
  description: "תבנית אדריכלות בראוטליסטית: רשת גריד גלויה, פינות ישרות, 6 עמודים וסקשנים עם כניסות תנועה.",
  thumbnail: React.createElement(GridlineThumbnail),
  preview: React.createElement(GridlinePreview),
  component: GridlinePages,
  Component: GridlinePages,
  seed: gridlineSeed,
  pages: gridlinePages,
  editorCss: gridlineEditorCss,
  schema: gridlineSchema,
  defaultData: gridlineDefaultData,
  renderer: {
    key: "gridline",
    name: "Gridline",
    Component: GridlinePages,
    component: GridlinePages,
    pages: gridlinePages,
    editorMode: "visual-react",
    editorCss: gridlineEditorCss,
    schema: gridlineSchema,
    defaultData: gridlineDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default gridlineTemplate;
