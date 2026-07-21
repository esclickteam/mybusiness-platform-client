import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import KineticPages, { kineticPages } from "./pages";
import KineticPreview from "./preview";
import KineticThumbnail from "./thumbnail";
import { kineticEditorCss } from "./editorCss";
import { kineticSchema } from "./schema";
import { kineticDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#ff2d2d",
  secondary: "#ffffff",
  accent: "#ff2d2d",
  background: "#0b0b0b",
  surface: "#0b0b0b",
  text: "#ffffff",
  muted: "#ffffff99",
  dark: "#ffffff",
};

export const kineticSeed = {
  id: "kinetic",
  key: "kinetic",
  name: "Kinetic",
  title: "Kinetic",
  description: "תבנית כושר קinetic: פסים אדומים-שחורים, תנועה אגרסיבית, 5 עמודים עם סקשנים רבים.",
  category: "fitness",
  categoryLabel: "כושר וספורט",
  niche: "fitness-gym",
  layout: "full",
  image: (kineticDefaultData as Record<string, any>).heroImage,
  heroTitle: (kineticDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (kineticDefaultData as Record<string, any>).heroSubtitle,
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
  ].map((block, index) => ({ id: `kinetic-${index + 1}-${block.type}`, ...block })),
  pages: kineticPages,
  editor: { pages: kineticPages, css: kineticEditorCss },
  css: kineticEditorCss,
  data: kineticDefaultData,
  defaultData: kineticDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const kineticTemplate = {
  id: "kinetic",
  key: "kinetic",
  name: "Kinetic",
  title: "Kinetic",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "fitness",
  categoryLabel: "כושר וספורט",
  badge: "חדש",
  description: "תבנית כושר קinetic: פסים אדומים-שחורים, תנועה אגרסיבית, 5 עמודים עם סקשנים רבים.",
  thumbnail: React.createElement(KineticThumbnail),
  preview: React.createElement(KineticPreview),
  component: KineticPages,
  Component: KineticPages,
  seed: kineticSeed,
  pages: kineticPages,
  editorCss: kineticEditorCss,
  schema: kineticSchema,
  defaultData: kineticDefaultData,
  renderer: {
    key: "kinetic",
    name: "Kinetic",
    Component: KineticPages,
    component: KineticPages,
    pages: kineticPages,
    editorMode: "visual-react",
    editorCss: kineticEditorCss,
    schema: kineticSchema,
    defaultData: kineticDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default kineticTemplate;
