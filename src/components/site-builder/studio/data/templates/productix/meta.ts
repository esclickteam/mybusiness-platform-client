import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import ProductixPages, { productixPages } from "./pages";
import ProductixPreview from "./preview";
import ProductixThumbnail from "./thumbnail";
import { productixEditorCss } from "./editorCss";
import { productixSchema } from "./schema";
import { productixDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#2563EB",
  secondary: "#0B1120",
  accent: "#F97316",
  background: "#F8FAFC",
  surface: "#FFFFFF",
  text: "#0F172A",
  muted: "#475569",
  dark: "#0B1120",
};

export const productixSeed = {
  id: "productix",
  key: "productix",
  name: "Productix",
  title: "Productix",
  description: "אתר מלא לסוכנות שיווק מוצר: 8 עמודים, תנועה, אפקטים ועיצוב roadmap product ui.",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  niche: "product-marketing",
  layout: "full-agency",
  image: (productixDefaultData as Record<string, any>).heroImage,
  heroTitle: (productixDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (productixDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "productix-header", title: "Header" },
    { type: "hero", variant: "productix-hero", title: "Hero" },
    { type: "about", variant: "productix-about", title: "About" },
    { type: "services", variant: "productix-services", title: "Services" },
    { type: "cases", variant: "productix-cases", title: "Cases" },
    { type: "team", variant: "productix-team", title: "Team" },
    { type: "gallery", variant: "productix-gallery", title: "Gallery" },
    { type: "contact", variant: "productix-contact", title: "Contact" },
    { type: "footer", variant: "productix-footer", title: "Footer" },
  ].map((block, index) => ({ id: `productix-${index + 1}-${block.type}`, ...block })),
  pages: productixPages,
  editor: { pages: productixPages, css: productixEditorCss },
  css: productixEditorCss,
  data: productixDefaultData,
  defaultData: productixDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const productixTemplate = {
  id: "productix",
  key: "productix",
  name: "Productix",
  title: "Productix",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  badge: "חדש",
  description: "אתר מלא לסוכנות שיווק מוצר עם 8 עמודים, תנועה ואפקטים — roadmap product ui.",
  thumbnail: React.createElement(ProductixThumbnail),
  preview: React.createElement(ProductixPreview),
  component: ProductixPages,
  Component: ProductixPages,
  seed: productixSeed,
  pages: productixPages,
  editorCss: productixEditorCss,
  schema: productixSchema,
  defaultData: productixDefaultData,
  renderer: {
    key: "productix",
    name: "Productix",
    Component: ProductixPages,
    component: ProductixPages,
    pages: productixPages,
    editorMode: "visual-react",
    editorCss: productixEditorCss,
    schema: productixSchema,
    defaultData: productixDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default productixTemplate;
