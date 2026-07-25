import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import PartnerlyPages, { partnerlyPages } from "./pages";
import PartnerlyPreview from "./preview";
import PartnerlyThumbnail from "./thumbnail";
import { partnerlyEditorCss } from "./editorCss";
import { partnerlySchema } from "./schema";
import { partnerlyDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#16A34A",
  secondary: "#052814",
  accent: "#38BDF8",
  background: "#F0FDF4",
  surface: "#FFFFFF",
  text: "#052E16",
  muted: "#166534",
  dark: "#052814",
};

export const partnerlySeed = {
  id: "partnerly",
  key: "partnerly",
  name: "Partnerly",
  title: "Partnerly",
  description: "אתר מלא לסוכנות שותפויות ואפיליאציה: 8 עמודים, תנועה, אפקטים ועיצוב network nodes.",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  niche: "partnerships-affiliate",
  layout: "full-agency",
  image: (partnerlyDefaultData as Record<string, any>).heroImage,
  heroTitle: (partnerlyDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (partnerlyDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "partnerly-header", title: "Header" },
    { type: "hero", variant: "partnerly-hero", title: "Hero" },
    { type: "about", variant: "partnerly-about", title: "About" },
    { type: "services", variant: "partnerly-services", title: "Services" },
    { type: "cases", variant: "partnerly-cases", title: "Cases" },
    { type: "team", variant: "partnerly-team", title: "Team" },
    { type: "gallery", variant: "partnerly-gallery", title: "Gallery" },
    { type: "contact", variant: "partnerly-contact", title: "Contact" },
    { type: "footer", variant: "partnerly-footer", title: "Footer" },
  ].map((block, index) => ({ id: `partnerly-${index + 1}-${block.type}`, ...block })),
  pages: partnerlyPages,
  editor: { pages: partnerlyPages, css: partnerlyEditorCss },
  css: partnerlyEditorCss,
  data: partnerlyDefaultData,
  defaultData: partnerlyDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const partnerlyTemplate = {
  id: "partnerly",
  key: "partnerly",
  name: "Partnerly",
  title: "Partnerly",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  badge: "חדש",
  description: "אתר מלא לסוכנות שותפויות ואפיליאציה עם 8 עמודים, תנועה ואפקטים — network nodes.",
  thumbnail: React.createElement(PartnerlyThumbnail),
  preview: React.createElement(PartnerlyPreview),
  component: PartnerlyPages,
  Component: PartnerlyPages,
  seed: partnerlySeed,
  pages: partnerlyPages,
  editorCss: partnerlyEditorCss,
  schema: partnerlySchema,
  defaultData: partnerlyDefaultData,
  renderer: {
    key: "partnerly",
    name: "Partnerly",
    Component: PartnerlyPages,
    component: PartnerlyPages,
    pages: partnerlyPages,
    editorMode: "visual-react",
    editorCss: partnerlyEditorCss,
    schema: partnerlySchema,
    defaultData: partnerlyDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default partnerlyTemplate;
