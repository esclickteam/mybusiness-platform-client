import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import CinderPages, { cinderPages } from "./pages";
import CinderPreview from "./preview";
import CinderThumbnail from "./thumbnail";
import { cinderEditorCss } from "./editorCss";
import { cinderSchema } from "./schema";
import { cinderDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#E08A3C",
  secondary: "#8B4513",
  accent: "#F0C090",
  background: "#1A120E",
  surface: "#241914",
  text: "#F6EFE6",
  muted: "#B7A597",
  dark: "#0F0A08",
};

const blocks = [
  { type: "header", variant: "sharp-nav", title: "Header" },
  { type: "hero", variant: "full-bleed", title: "Hero" },
  { type: "about", variant: "image-band", title: "Band" },
  { type: "services", variant: "list", title: "Items" },
  { type: "contact", variant: "plain-form", title: "Contact" },
  { type: "footer", variant: "minimal", title: "Footer" },
];

export const cinderSeed = {
  id: "cinder",
  key: "cinder",
  name: "Cinder",
  title: "Cinder",
  description: "תבנית בית קלייה וקפה בעברית: טיפוגרפיה ענקית, רצועות צילום חדות, תפריט כרשימה טיפוגרפית — בלי כרטיסים.",
  category: "food",
  categoryLabel: "קפה ואוכל",
  niche: "cafe",
  layout: "full",
  image: (cinderDefaultData as Record<string, any>).heroImage,
  heroTitle: (cinderDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (cinderDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({ id: `cinder-${index + 1}-${block.type}`, ...block })),
  pages: cinderPages,
  editor: { pages: cinderPages, css: cinderEditorCss },
  css: cinderEditorCss,
  data: cinderDefaultData,
  defaultData: cinderDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const cinderTemplate = {
  id: "cinder",
  key: "cinder",
  name: "Cinder",
  title: "Cinder",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "food",
  categoryLabel: "קפה ואוכל",
  badge: "חדש",
  description: "תבנית בית קלייה וקפה בעברית: טיפוגרפיה ענקית, רצועות צילום חדות, תפריט כרשימה טיפוגרפית — בלי כרטיסים.",
  thumbnail: React.createElement(CinderThumbnail),
  preview: React.createElement(CinderPreview),
  component: CinderPages,
  Component: CinderPages,
  seed: cinderSeed,
  pages: cinderPages,
  editorCss: cinderEditorCss,
  schema: cinderSchema,
  defaultData: cinderDefaultData,
  renderer: {
    key: "cinder",
    name: "Cinder",
    Component: CinderPages,
    component: CinderPages,
    pages: cinderPages,
    editorMode: "visual-react",
    editorCss: cinderEditorCss,
    schema: cinderSchema,
    defaultData: cinderDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default cinderTemplate;
