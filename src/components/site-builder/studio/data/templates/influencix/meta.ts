import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import InfluencixPages, { influencixPages } from "./pages";
import InfluencixPreview from "./preview";
import InfluencixThumbnail from "./thumbnail";
import { influencixEditorCss } from "./editorCss";
import { influencixSchema } from "./schema";
import { influencixDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#FF4D6D",
  secondary: "#090306",
  accent: "#FFD166",
  background: "#14070C",
  surface: "#241018",
  text: "#FFF5F7",
  muted: "#F7B4C2",
  dark: "#090306",
};

export const influencixSeed = {
  id: "influencix",
  key: "influencix",
  name: "Influencix",
  title: "Influencix",
  description: "אתר מלא לסוכנות משפיענים: 8 עמודים, תנועה, אפקטים ועיצוב creator spotlight.",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  niche: "influencer-marketing",
  layout: "full-agency",
  image: (influencixDefaultData as Record<string, any>).heroImage,
  heroTitle: (influencixDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (influencixDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "influencix-header", title: "Header" },
    { type: "hero", variant: "influencix-hero", title: "Hero" },
    { type: "about", variant: "influencix-about", title: "About" },
    { type: "services", variant: "influencix-services", title: "Services" },
    { type: "cases", variant: "influencix-cases", title: "Cases" },
    { type: "team", variant: "influencix-team", title: "Team" },
    { type: "gallery", variant: "influencix-gallery", title: "Gallery" },
    { type: "contact", variant: "influencix-contact", title: "Contact" },
    { type: "footer", variant: "influencix-footer", title: "Footer" },
  ].map((block, index) => ({ id: `influencix-${index + 1}-${block.type}`, ...block })),
  pages: influencixPages,
  editor: { pages: influencixPages, css: influencixEditorCss },
  css: influencixEditorCss,
  data: influencixDefaultData,
  defaultData: influencixDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const influencixTemplate = {
  id: "influencix",
  key: "influencix",
  name: "Influencix",
  title: "Influencix",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  badge: "חדש",
  description: "אתר מלא לסוכנות משפיענים עם 8 עמודים, תנועה ואפקטים — creator spotlight.",
  thumbnail: React.createElement(InfluencixThumbnail),
  preview: React.createElement(InfluencixPreview),
  component: InfluencixPages,
  Component: InfluencixPages,
  seed: influencixSeed,
  pages: influencixPages,
  editorCss: influencixEditorCss,
  schema: influencixSchema,
  defaultData: influencixDefaultData,
  renderer: {
    key: "influencix",
    name: "Influencix",
    Component: InfluencixPages,
    component: InfluencixPages,
    pages: influencixPages,
    editorMode: "visual-react",
    editorCss: influencixEditorCss,
    schema: influencixSchema,
    defaultData: influencixDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default influencixTemplate;
