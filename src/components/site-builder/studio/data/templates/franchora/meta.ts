import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import FranchoraPages, { franchoraPages } from "./pages";
import FranchoraPreview from "./preview";
import FranchoraThumbnail from "./thumbnail";
import { franchoraEditorCss } from "./editorCss";
import { franchoraSchema } from "./schema";
import { franchoraDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#92400E",
  secondary: "#1C0F02",
  accent: "#10B981",
  background: "#FFFBEB",
  surface: "#FFFFFF",
  text: "#2B1704",
  muted: "#78350F",
  dark: "#1C0F02",
};

export const franchoraSeed = {
  id: "franchora",
  key: "franchora",
  name: "Franchora",
  title: "Franchora",
  description: "אתר מלא לסוכנות פיתוח זכיינות: 8 עמודים, תנועה, אפקטים ועיצוב system map multi-location.",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  niche: "franchise-development",
  layout: "full-agency",
  image: (franchoraDefaultData as Record<string, any>).heroImage,
  heroTitle: (franchoraDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (franchoraDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "franchora-header", title: "Header" },
    { type: "hero", variant: "franchora-hero", title: "Hero" },
    { type: "about", variant: "franchora-about", title: "About" },
    { type: "services", variant: "franchora-services", title: "Services" },
    { type: "cases", variant: "franchora-cases", title: "Cases" },
    { type: "team", variant: "franchora-team", title: "Team" },
    { type: "gallery", variant: "franchora-gallery", title: "Gallery" },
    { type: "contact", variant: "franchora-contact", title: "Contact" },
    { type: "footer", variant: "franchora-footer", title: "Footer" },
  ].map((block, index) => ({ id: `franchora-${index + 1}-${block.type}`, ...block })),
  pages: franchoraPages,
  editor: { pages: franchoraPages, css: franchoraEditorCss },
  css: franchoraEditorCss,
  data: franchoraDefaultData,
  defaultData: franchoraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const franchoraTemplate = {
  id: "franchora",
  key: "franchora",
  name: "Franchora",
  title: "Franchora",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  badge: "חדש",
  description: "אתר מלא לסוכנות פיתוח זכיינות עם 8 עמודים, תנועה ואפקטים — system map multi-location.",
  thumbnail: React.createElement(FranchoraThumbnail),
  preview: React.createElement(FranchoraPreview),
  component: FranchoraPages,
  Component: FranchoraPages,
  seed: franchoraSeed,
  pages: franchoraPages,
  editorCss: franchoraEditorCss,
  schema: franchoraSchema,
  defaultData: franchoraDefaultData,
  renderer: {
    key: "franchora",
    name: "Franchora",
    Component: FranchoraPages,
    component: FranchoraPages,
    pages: franchoraPages,
    editorMode: "visual-react",
    editorCss: franchoraEditorCss,
    schema: franchoraSchema,
    defaultData: franchoraDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default franchoraTemplate;
