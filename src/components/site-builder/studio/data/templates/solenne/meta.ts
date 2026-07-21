import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import SolennePages, { solennePages } from "./pages";
import SolennePreview from "./preview";
import SolenneThumbnail from "./thumbnail";
import { solenneEditorCss } from "./editorCss";
import { solenneSchema } from "./schema";
import { solenneDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#8B6F5C",
  secondary: "#C4B0A0",
  accent: "#3D322A",
  background: "#F7F3EE",
  surface: "#EFE8DF",
  text: "#1D1A17",
  muted: "#7A7168",
  dark: "#14110F",
};

const blocks = [
  { type: "header", variant: "sharp-nav", title: "Header" },
  { type: "hero", variant: "full-bleed", title: "Hero" },
  { type: "about", variant: "image-band", title: "Band" },
  { type: "services", variant: "list", title: "Items" },
  { type: "contact", variant: "plain-form", title: "Contact" },
  { type: "footer", variant: "minimal", title: "Footer" },
];

export const solenneSeed = {
  id: "solenne",
  key: "solenne",
  name: "Solenne",
  title: "Solenne",
  description: "תבנית הפקת חתונות ואירועים בעברית: שנהב ודיו, סריף אלגנטי, גלריה מלבנית חדה ופריסה אווירית בלי כרטיסיות.",
  category: "service",
  categoryLabel: "אירועים וחתונות",
  niche: "events",
  layout: "full",
  image: (solenneDefaultData as Record<string, any>).heroImage,
  heroTitle: (solenneDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (solenneDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({ id: `solenne-${index + 1}-${block.type}`, ...block })),
  pages: solennePages,
  editor: { pages: solennePages, css: solenneEditorCss },
  css: solenneEditorCss,
  data: solenneDefaultData,
  defaultData: solenneDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const solenneTemplate = {
  id: "solenne",
  key: "solenne",
  name: "Solenne",
  title: "Solenne",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "service",
  categoryLabel: "אירועים וחתונות",
  badge: "חדש",
  description: "תבנית הפקת חתונות ואירועים בעברית: שנהב ודיו, סריף אלגנטי, גלריה מלבנית חדה ופריסה אווירית בלי כרטיסיות.",
  thumbnail: React.createElement(SolenneThumbnail),
  preview: React.createElement(SolennePreview),
  component: SolennePages,
  Component: SolennePages,
  seed: solenneSeed,
  pages: solennePages,
  editorCss: solenneEditorCss,
  schema: solenneSchema,
  defaultData: solenneDefaultData,
  renderer: {
    key: "solenne",
    name: "Solenne",
    Component: SolennePages,
    component: SolennePages,
    pages: solennePages,
    editorMode: "visual-react",
    editorCss: solenneEditorCss,
    schema: solenneSchema,
    defaultData: solenneDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default solenneTemplate;
