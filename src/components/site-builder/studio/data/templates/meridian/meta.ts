import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import MeridianPages, { meridianPages } from "./pages";
import MeridianPreview from "./preview";
import MeridianThumbnail from "./thumbnail";
import { meridianEditorCss } from "./editorCss";
import { meridianSchema } from "./schema";
import { meridianDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#C4A574",
  secondary: "#8B7355",
  accent: "#E8D9C4",
  background: "#12100E",
  surface: "#1C1915",
  text: "#F3EBE1",
  muted: "#A89A88",
  dark: "#0A0908",
};

const blocks = [
  { type: "header", variant: "sharp-nav", title: "Header" },
  { type: "hero", variant: "full-bleed", title: "Hero" },
  { type: "about", variant: "image-band", title: "Band" },
  { type: "services", variant: "list", title: "Items" },
  { type: "contact", variant: "plain-form", title: "Contact" },
  { type: "footer", variant: "minimal", title: "Footer" },
];

export const meridianSeed = {
  id: "meridian",
  key: "meridian",
  name: "Meridian",
  title: "Meridian",
  description: "תבנית בוטיק מלון בעברית: הירו צילום מלא, פסים אופקיים חדים, טיפוגרפיה סריף, בלי כרטיסיות מעוגלות.",
  category: "business",
  categoryLabel: "אירוח ומלונאות",
  niche: "hospitality",
  layout: "full",
  image: (meridianDefaultData as Record<string, any>).heroImage,
  heroTitle: (meridianDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (meridianDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({ id: `meridian-${index + 1}-${block.type}`, ...block })),
  pages: meridianPages,
  editor: { pages: meridianPages, css: meridianEditorCss },
  css: meridianEditorCss,
  data: meridianDefaultData,
  defaultData: meridianDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const meridianTemplate = {
  id: "meridian",
  key: "meridian",
  name: "Meridian",
  title: "Meridian",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "business",
  categoryLabel: "אירוח ומלונאות",
  badge: "חדש",
  description: "תבנית בוטיק מלון בעברית: הירו צילום מלא, פסים אופקיים חדים, טיפוגרפיה סריף, בלי כרטיסיות מעוגלות.",
  thumbnail: React.createElement(MeridianThumbnail),
  preview: React.createElement(MeridianPreview),
  component: MeridianPages,
  Component: MeridianPages,
  seed: meridianSeed,
  pages: meridianPages,
  editorCss: meridianEditorCss,
  schema: meridianSchema,
  defaultData: meridianDefaultData,
  renderer: {
    key: "meridian",
    name: "Meridian",
    Component: MeridianPages,
    component: MeridianPages,
    pages: meridianPages,
    editorMode: "visual-react",
    editorCss: meridianEditorCss,
    schema: meridianSchema,
    defaultData: meridianDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default meridianTemplate;
