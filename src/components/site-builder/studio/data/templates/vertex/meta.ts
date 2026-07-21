import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import VertexPages, { vertexPages } from "./pages";
import VertexPreview from "./preview";
import VertexThumbnail from "./thumbnail";
import { vertexEditorCss } from "./editorCss";
import { vertexSchema } from "./schema";
import { vertexDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#00ff88",
  secondary: "#f5f5f5",
  accent: "#00ff88",
  background: "#050505",
  surface: "#050505",
  text: "#f5f5f5",
  muted: "#f5f5f599",
  dark: "#f5f5f5",
};

export const vertexSeed = {
  id: "vertex",
  key: "vertex",
  name: "Vertex",
  title: "Vertex",
  description: "תבנית טכנולוגיה גיאומטרית: קווים אלכסוניים, ניאון ירוק, 6 עמודים עם אנימציות כניסה חדות.",
  category: "technology",
  categoryLabel: "טכנולוגיה",
  niche: "tech-consulting",
  layout: "full",
  image: (vertexDefaultData as Record<string, any>).heroImage,
  heroTitle: (vertexDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (vertexDefaultData as Record<string, any>).heroSubtitle,
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
  ].map((block, index) => ({ id: `vertex-${index + 1}-${block.type}`, ...block })),
  pages: vertexPages,
  editor: { pages: vertexPages, css: vertexEditorCss },
  css: vertexEditorCss,
  data: vertexDefaultData,
  defaultData: vertexDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const vertexTemplate = {
  id: "vertex",
  key: "vertex",
  name: "Vertex",
  title: "Vertex",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "technology",
  categoryLabel: "טכנולוגיה",
  badge: "חדש",
  description: "תבנית טכנולוגיה גיאומטרית: קווים אלכסוניים, ניאון ירוק, 6 עמודים עם אנימציות כניסה חדות.",
  thumbnail: React.createElement(VertexThumbnail),
  preview: React.createElement(VertexPreview),
  component: VertexPages,
  Component: VertexPages,
  seed: vertexSeed,
  pages: vertexPages,
  editorCss: vertexEditorCss,
  schema: vertexSchema,
  defaultData: vertexDefaultData,
  renderer: {
    key: "vertex",
    name: "Vertex",
    Component: VertexPages,
    component: VertexPages,
    pages: vertexPages,
    editorMode: "visual-react",
    editorCss: vertexEditorCss,
    schema: vertexSchema,
    defaultData: vertexDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default vertexTemplate;
