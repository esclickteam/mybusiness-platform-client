import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import SeoraPages, { seoraPages } from "./pages";
import SeoraPreview from "./preview";
import SeoraThumbnail from "./thumbnail";
import { seoraEditorCss } from "./editorCss";
import { seoraSchema } from "./schema";
import { seoraDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#2DD4BF",
  secondary: "#03100E",
  accent: "#A3E635",
  background: "#071513",
  surface: "#0F2421",
  text: "#ECFDF5",
  muted: "#99F6E4",
  dark: "#03100E",
};

export const seoraSeed = {
  id: "seora",
  key: "seora",
  name: "Seora",
  title: "Seora",
  description: "אתר מלא לסוכנות SEO: 8 עמודים, תנועה, אפקטים ועיצוב data dashboard serp.",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  niche: "seo-agency",
  layout: "full-agency",
  image: (seoraDefaultData as Record<string, any>).heroImage,
  heroTitle: (seoraDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (seoraDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "seora-header", title: "Header" },
    { type: "hero", variant: "seora-hero", title: "Hero" },
    { type: "about", variant: "seora-about", title: "About" },
    { type: "services", variant: "seora-services", title: "Services" },
    { type: "cases", variant: "seora-cases", title: "Cases" },
    { type: "team", variant: "seora-team", title: "Team" },
    { type: "gallery", variant: "seora-gallery", title: "Gallery" },
    { type: "contact", variant: "seora-contact", title: "Contact" },
    { type: "footer", variant: "seora-footer", title: "Footer" },
  ].map((block, index) => ({ id: `seora-${index + 1}-${block.type}`, ...block })),
  pages: seoraPages,
  editor: { pages: seoraPages, css: seoraEditorCss },
  css: seoraEditorCss,
  data: seoraDefaultData,
  defaultData: seoraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const seoraTemplate = {
  id: "seora",
  key: "seora",
  name: "Seora",
  title: "Seora",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  badge: "חדש",
  description: "אתר מלא לסוכנות SEO עם 8 עמודים, תנועה ואפקטים — data dashboard serp.",
  thumbnail: React.createElement(SeoraThumbnail),
  preview: React.createElement(SeoraPreview),
  component: SeoraPages,
  Component: SeoraPages,
  seed: seoraSeed,
  pages: seoraPages,
  editorCss: seoraEditorCss,
  schema: seoraSchema,
  defaultData: seoraDefaultData,
  renderer: {
    key: "seora",
    name: "Seora",
    Component: SeoraPages,
    component: SeoraPages,
    pages: seoraPages,
    editorMode: "visual-react",
    editorCss: seoraEditorCss,
    schema: seoraSchema,
    defaultData: seoraDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default seoraTemplate;
