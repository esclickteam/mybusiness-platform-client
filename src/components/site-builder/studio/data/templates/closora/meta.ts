import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import ClosoraPages, { closoraPages } from "./pages";
import ClosoraPreview from "./preview";
import ClosoraThumbnail from "./thumbnail";
import { closoraEditorCss } from "./editorCss";
import { closoraSchema } from "./schema";
import { closoraDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#EA580C",
  secondary: "#0C0A09",
  accent: "#FB923C",
  background: "#1C1917",
  surface: "#292524",
  text: "#FFF7ED",
  muted: "#FDBA74",
  dark: "#0C0A09",
};

export const closoraSeed = {
  id: "closora",
  key: "closora",
  name: "Closora",
  title: "Closora",
  description: "אתר מלא לסוכנות מכירות: 8 עמודים, תנועה, אפקטים ועיצוב ייחודי.",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  niche: "sales-agency",
  layout: "full",
  image: (closoraDefaultData as Record<string, any>).heroImage,
  heroTitle: (closoraDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (closoraDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "closora-header", title: "Header" },
    { type: "hero", variant: "closora-hero", title: "Hero" },
    { type: "services", variant: "closora-services", title: "Services" },
    { type: "cases", variant: "closora-cases", title: "Cases" },
    { type: "team", variant: "closora-team", title: "Team" },
    { type: "contact", variant: "closora-contact", title: "Contact" },
    { type: "footer", variant: "closora-footer", title: "Footer" },
  ].map((block, index) => ({ id: `closora-${index + 1}-${block.type}`, ...block })),
  pages: closoraPages,
  editor: { pages: closoraPages, css: closoraEditorCss },
  css: closoraEditorCss,
  data: closoraDefaultData,
  defaultData: closoraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const closoraTemplate = {
  id: "closora",
  key: "closora",
  name: "Closora",
  title: "Closora",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  badge: "חדש",
  description: "אתר מלא לסוכנות מכירות עם 8 עמודים, תנועה ואפקטים — עיצוב ייחודי.",
  thumbnail: React.createElement(ClosoraThumbnail),
  preview: React.createElement(ClosoraPreview),
  component: ClosoraPages,
  Component: ClosoraPages,
  seed: closoraSeed,
  pages: closoraPages,
  editorCss: closoraEditorCss,
  schema: closoraSchema,
  defaultData: closoraDefaultData,
  renderer: {
    key: "closora",
    name: "Closora",
    Component: ClosoraPages,
    component: ClosoraPages,
    pages: closoraPages,
    editorMode: "visual-react",
    editorCss: closoraEditorCss,
    schema: closoraSchema,
    defaultData: closoraDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default closoraTemplate;
