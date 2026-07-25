import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import InsightixPages, { insightixPages } from "./pages";
import InsightixPreview from "./preview";
import InsightixThumbnail from "./thumbnail";
import { insightixEditorCss } from "./editorCss";
import { insightixSchema } from "./schema";
import { insightixDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#0F766E",
  secondary: "#0A1F1D",
  accent: "#F59E0B",
  background: "#F8FAFC",
  surface: "#FFFFFF",
  text: "#0F172A",
  muted: "#475569",
  dark: "#0A1F1D",
};

export const insightixSeed = {
  id: "insightix",
  key: "insightix",
  name: "Insightix",
  title: "Insightix",
  description: "אתר מלא לסוכנות מחקר שוק: 8 עמודים, תנועה, אפקטים ועיצוב charts insight cards.",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  niche: "market-research",
  layout: "full-agency",
  image: (insightixDefaultData as Record<string, any>).heroImage,
  heroTitle: (insightixDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (insightixDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "insightix-header", title: "Header" },
    { type: "hero", variant: "insightix-hero", title: "Hero" },
    { type: "about", variant: "insightix-about", title: "About" },
    { type: "services", variant: "insightix-services", title: "Services" },
    { type: "cases", variant: "insightix-cases", title: "Cases" },
    { type: "team", variant: "insightix-team", title: "Team" },
    { type: "gallery", variant: "insightix-gallery", title: "Gallery" },
    { type: "contact", variant: "insightix-contact", title: "Contact" },
    { type: "footer", variant: "insightix-footer", title: "Footer" },
  ].map((block, index) => ({ id: `insightix-${index + 1}-${block.type}`, ...block })),
  pages: insightixPages,
  editor: { pages: insightixPages, css: insightixEditorCss },
  css: insightixEditorCss,
  data: insightixDefaultData,
  defaultData: insightixDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const insightixTemplate = {
  id: "insightix",
  key: "insightix",
  name: "Insightix",
  title: "Insightix",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  badge: "חדש",
  description: "אתר מלא לסוכנות מחקר שוק עם 8 עמודים, תנועה ואפקטים — charts insight cards.",
  thumbnail: React.createElement(InsightixThumbnail),
  preview: React.createElement(InsightixPreview),
  component: InsightixPages,
  Component: InsightixPages,
  seed: insightixSeed,
  pages: insightixPages,
  editorCss: insightixEditorCss,
  schema: insightixSchema,
  defaultData: insightixDefaultData,
  renderer: {
    key: "insightix",
    name: "Insightix",
    Component: InsightixPages,
    component: InsightixPages,
    pages: insightixPages,
    editorMode: "visual-react",
    editorCss: insightixEditorCss,
    schema: insightixSchema,
    defaultData: insightixDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default insightixTemplate;
