import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import BrandforgePages, { brandforgePages } from "./pages";
import BrandforgePreview from "./preview";
import BrandforgeThumbnail from "./thumbnail";
import { brandforgeEditorCss } from "./editorCss";
import { brandforgeSchema } from "./schema";
import { brandforgeDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#111827",
  secondary: "#0A0A0A",
  accent: "#F59E0B",
  background: "#FFFBEB",
  surface: "#FFFFFF",
  text: "#111827",
  muted: "#78716C",
  dark: "#0A0A0A",
};

export const brandforgeSeed = {
  id: "brandforge",
  key: "brandforge",
  name: "Brandforge",
  title: "Brandforge",
  description: "אתר מלא לסוכנות מיתוג: 8 עמודים, תנועה, אפקטים ועיצוב ייחודי.",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  niche: "branding-agency",
  layout: "full",
  image: (brandforgeDefaultData as Record<string, any>).heroImage,
  heroTitle: (brandforgeDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (brandforgeDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "brandforge-header", title: "Header" },
    { type: "hero", variant: "brandforge-hero", title: "Hero" },
    { type: "services", variant: "brandforge-services", title: "Services" },
    { type: "cases", variant: "brandforge-cases", title: "Cases" },
    { type: "team", variant: "brandforge-team", title: "Team" },
    { type: "contact", variant: "brandforge-contact", title: "Contact" },
    { type: "footer", variant: "brandforge-footer", title: "Footer" },
  ].map((block, index) => ({ id: `brandforge-${index + 1}-${block.type}`, ...block })),
  pages: brandforgePages,
  editor: { pages: brandforgePages, css: brandforgeEditorCss },
  css: brandforgeEditorCss,
  data: brandforgeDefaultData,
  defaultData: brandforgeDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const brandforgeTemplate = {
  id: "brandforge",
  key: "brandforge",
  name: "Brandforge",
  title: "Brandforge",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  badge: "חדש",
  description: "אתר מלא לסוכנות מיתוג עם 8 עמודים, תנועה ואפקטים — עיצוב ייחודי.",
  thumbnail: React.createElement(BrandforgeThumbnail),
  preview: React.createElement(BrandforgePreview),
  component: BrandforgePages,
  Component: BrandforgePages,
  seed: brandforgeSeed,
  pages: brandforgePages,
  editorCss: brandforgeEditorCss,
  schema: brandforgeSchema,
  defaultData: brandforgeDefaultData,
  renderer: {
    key: "brandforge",
    name: "Brandforge",
    Component: BrandforgePages,
    component: BrandforgePages,
    pages: brandforgePages,
    editorMode: "visual-react",
    editorCss: brandforgeEditorCss,
    schema: brandforgeSchema,
    defaultData: brandforgeDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default brandforgeTemplate;
