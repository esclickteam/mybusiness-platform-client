import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import ContentraPages, { contentraPages } from "./pages";
import ContentraPreview from "./preview";
import ContentraThumbnail from "./thumbnail";
import { contentraEditorCss } from "./editorCss";
import { contentraSchema } from "./schema";
import { contentraDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#7C2D12",
  secondary: "#1C0B03",
  accent: "#EAB308",
  background: "#FFF7ED",
  surface: "#FFFFFF",
  text: "#2B1608",
  muted: "#8A4B25",
  dark: "#1C0B03",
};

export const contentraSeed = {
  id: "contentra",
  key: "contentra",
  name: "Contentra",
  title: "Contentra",
  description: "אתר מלא לסוכנות תוכן: 8 עמודים, תנועה, אפקטים ועיצוב editorial magazine.",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  niche: "content-marketing",
  layout: "full-agency",
  image: (contentraDefaultData as Record<string, any>).heroImage,
  heroTitle: (contentraDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (contentraDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "contentra-header", title: "Header" },
    { type: "hero", variant: "contentra-hero", title: "Hero" },
    { type: "about", variant: "contentra-about", title: "About" },
    { type: "services", variant: "contentra-services", title: "Services" },
    { type: "cases", variant: "contentra-cases", title: "Cases" },
    { type: "team", variant: "contentra-team", title: "Team" },
    { type: "gallery", variant: "contentra-gallery", title: "Gallery" },
    { type: "contact", variant: "contentra-contact", title: "Contact" },
    { type: "footer", variant: "contentra-footer", title: "Footer" },
  ].map((block, index) => ({ id: `contentra-${index + 1}-${block.type}`, ...block })),
  pages: contentraPages,
  editor: { pages: contentraPages, css: contentraEditorCss },
  css: contentraEditorCss,
  data: contentraDefaultData,
  defaultData: contentraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const contentraTemplate = {
  id: "contentra",
  key: "contentra",
  name: "Contentra",
  title: "Contentra",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  badge: "חדש",
  description: "אתר מלא לסוכנות תוכן עם 8 עמודים, תנועה ואפקטים — editorial magazine.",
  thumbnail: React.createElement(ContentraThumbnail),
  preview: React.createElement(ContentraPreview),
  component: ContentraPages,
  Component: ContentraPages,
  seed: contentraSeed,
  pages: contentraPages,
  editorCss: contentraEditorCss,
  schema: contentraSchema,
  defaultData: contentraDefaultData,
  renderer: {
    key: "contentra",
    name: "Contentra",
    Component: ContentraPages,
    component: ContentraPages,
    pages: contentraPages,
    editorMode: "visual-react",
    editorCss: contentraEditorCss,
    schema: contentraSchema,
    defaultData: contentraDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default contentraTemplate;
