import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import GrowthlyPages, { growthlyPages } from "./pages";
import GrowthlyPreview from "./preview";
import GrowthlyThumbnail from "./thumbnail";
import { growthlyEditorCss } from "./editorCss";
import { growthlySchema } from "./schema";
import { growthlyDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#0F766E",
  secondary: "#042F2E",
  accent: "#14B8A6",
  background: "#F0FDFA",
  surface: "#FFFFFF",
  text: "#134E4A",
  muted: "#5F7A76",
  dark: "#042F2E",
};

export const growthlySeed = {
  id: "growthly",
  key: "growthly",
  name: "Growthly",
  title: "Growthly",
  description: "אתר מלא לסוכנות שיווק: 8 עמודים כולל אודות, שירותים, פרויקטים, צוות, תובנות, תהליך וצור קשר.",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  niche: "marketing-agency",
  layout: "full",
  image: (growthlyDefaultData as Record<string, any>).heroImage,
  heroTitle: (growthlyDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (growthlyDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "growthly-header", title: "Header" },
    { type: "hero", variant: "growthly-hero", title: "Hero" },
    { type: "services", variant: "growthly-services", title: "Services" },
    { type: "cases", variant: "growthly-cases", title: "Cases" },
    { type: "team", variant: "growthly-team", title: "Team" },
    { type: "contact", variant: "growthly-contact", title: "Contact" },
    { type: "footer", variant: "growthly-footer", title: "Footer" },
  ].map((block, index) => ({ id: `growthly-${index + 1}-${block.type}`, ...block })),
  pages: growthlyPages,
  editor: { pages: growthlyPages, css: growthlyEditorCss },
  css: growthlyEditorCss,
  data: growthlyDefaultData,
  defaultData: growthlyDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const growthlyTemplate = {
  id: "growthly",
  key: "growthly",
  name: "Growthly",
  title: "Growthly",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  badge: "חדש",
  description: "אתר מלא לסוכנות שיווק עם 8 עמודים, ניווט פנימי ותוכן מוכן לעריכה.",
  thumbnail: React.createElement(GrowthlyThumbnail),
  preview: React.createElement(GrowthlyPreview),
  component: GrowthlyPages,
  Component: GrowthlyPages,
  seed: growthlySeed,
  pages: growthlyPages,
  editorCss: growthlyEditorCss,
  schema: growthlySchema,
  defaultData: growthlyDefaultData,
  renderer: {
    key: "growthly",
    name: "Growthly",
    Component: GrowthlyPages,
    component: GrowthlyPages,
    pages: growthlyPages,
    editorMode: "visual-react",
    editorCss: growthlyEditorCss,
    schema: growthlySchema,
    defaultData: growthlyDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default growthlyTemplate;
