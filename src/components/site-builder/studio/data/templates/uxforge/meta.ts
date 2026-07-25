import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import UxforgePages, { uxforgePages } from "./pages";
import UxforgePreview from "./preview";
import UxforgeThumbnail from "./thumbnail";
import { uxforgeEditorCss } from "./editorCss";
import { uxforgeSchema } from "./schema";
import { uxforgeDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#111827",
  secondary: "#030712",
  accent: "#06B6D4",
  background: "#F3F4F6",
  surface: "#FFFFFF",
  text: "#111827",
  muted: "#4B5563",
  dark: "#030712",
};

export const uxforgeSeed = {
  id: "uxforge",
  key: "uxforge",
  name: "UXForge",
  title: "UXForge",
  description: "אתר מלא לסוכנות UX/UI: 8 עמודים, תנועה, אפקטים ועיצוב wireframe craft.",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  niche: "ux-ui-design-agency",
  layout: "full-agency",
  image: (uxforgeDefaultData as Record<string, any>).heroImage,
  heroTitle: (uxforgeDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (uxforgeDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "uxforge-header", title: "Header" },
    { type: "hero", variant: "uxforge-hero", title: "Hero" },
    { type: "about", variant: "uxforge-about", title: "About" },
    { type: "services", variant: "uxforge-services", title: "Services" },
    { type: "cases", variant: "uxforge-cases", title: "Cases" },
    { type: "team", variant: "uxforge-team", title: "Team" },
    { type: "gallery", variant: "uxforge-gallery", title: "Gallery" },
    { type: "contact", variant: "uxforge-contact", title: "Contact" },
    { type: "footer", variant: "uxforge-footer", title: "Footer" },
  ].map((block, index) => ({ id: `uxforge-${index + 1}-${block.type}`, ...block })),
  pages: uxforgePages,
  editor: { pages: uxforgePages, css: uxforgeEditorCss },
  css: uxforgeEditorCss,
  data: uxforgeDefaultData,
  defaultData: uxforgeDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const uxforgeTemplate = {
  id: "uxforge",
  key: "uxforge",
  name: "UXForge",
  title: "UXForge",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  badge: "חדש",
  description: "אתר מלא לסוכנות UX/UI עם 8 עמודים, תנועה ואפקטים — wireframe craft.",
  thumbnail: React.createElement(UxforgeThumbnail),
  preview: React.createElement(UxforgePreview),
  component: UxforgePages,
  Component: UxforgePages,
  seed: uxforgeSeed,
  pages: uxforgePages,
  editorCss: uxforgeEditorCss,
  schema: uxforgeSchema,
  defaultData: uxforgeDefaultData,
  renderer: {
    key: "uxforge",
    name: "UXForge",
    Component: UxforgePages,
    component: UxforgePages,
    pages: uxforgePages,
    editorMode: "visual-react",
    editorCss: uxforgeEditorCss,
    schema: uxforgeSchema,
    defaultData: uxforgeDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default uxforgeTemplate;
