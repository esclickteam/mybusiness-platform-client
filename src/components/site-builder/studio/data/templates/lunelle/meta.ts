import React from "react";
import type {
  ReadyWebsitePalette,
  ReadyWebsiteTemplateSeed,
} from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import LunellePages, { lunellePages } from "./pages";
import LunellePreview from "./preview";
import LunelleThumbnail from "./thumbnail";
import { lunelleEditorCss } from "./editorCss";
import { lunelleSchema } from "./schema";
import { lunelleDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#8A4F5F",
  secondary: "#E8B8C1",
  accent: "#D6A24A",
  background: "#FFF7F1",
  surface: "#FFFFFF",
  text: "#2A171C",
  muted: "#8D6F76",
  dark: "#2A171C",
};

const blocks = [
  { type: "header", variant: "lunelle-header", title: "header" },
  { type: "hero", variant: "lunelle-hero", title: "hero" },
  { type: "services", variant: "lunelle-services", title: "services" },
  { type: "about", variant: "lunelle-about", title: "about" },
  { type: "gallery", variant: "lunelle-gallery", title: "gallery" },
  { type: "prices", variant: "lunelle-prices", title: "prices" },
  { type: "shop", variant: "lunelle-shop", title: "shop" },
  { type: "booking", variant: "lunelle-booking", title: "booking" },
  { type: "contact", variant: "lunelle-contact", title: "contact" },
  { type: "footer", variant: "lunelle-footer", title: "footer" },
];

export const lunelleSeed = {
  id: "lunelle",
  key: "lunelle",
  name: "Lunelle",
  title: "Lunelle",
  description:
    "תבנית בוטיק לציפורניים: גלריה, מחירון, חנות CRM, יומן תורים וטופס לידים.",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  niche: "nail-salon",
  layout: "full",
  image: (lunelleDefaultData as Record<string, any>).heroImage,
  heroTitle: (lunelleDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (lunelleDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({
    id: `lunelle-${index + 1}-${block.type}`,
    ...block,
  })),
  pages: lunellePages,
  editor: { pages: lunellePages, css: lunelleEditorCss },
  css: lunelleEditorCss,
  data: lunelleDefaultData,
  defaultData: lunelleDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const lunelleTemplate = {
  id: "lunelle",
  key: "lunelle",
  name: "Lunelle",
  title: "Lunelle",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  badge: "חדש",
  description:
    "תבנית בוטיק לציפורניים: גלריה, מחירון, חנות CRM, יומן תורים וטופס לידים.",
  thumbnail: React.createElement(LunelleThumbnail),
  preview: React.createElement(LunellePreview),
  component: LunellePages,
  Component: LunellePages,
  seed: lunelleSeed,
  pages: lunellePages,
  editorCss: lunelleEditorCss,
  schema: lunelleSchema,
  defaultData: lunelleDefaultData,
  renderer: {
    key: "lunelle",
    name: "Lunelle",
    Component: LunellePages,
    component: LunellePages,
    pages: lunellePages,
    editorMode: "visual-react",
    editorCss: lunelleEditorCss,
    schema: lunelleSchema,
    defaultData: lunelleDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default lunelleTemplate;
