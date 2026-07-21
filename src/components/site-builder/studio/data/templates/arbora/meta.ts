import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import ArboraPages, { arboraPages } from "./pages";
import ArboraPreview from "./preview";
import ArboraThumbnail from "./thumbnail";
import { arboraEditorCss } from "./editorCss";
import { arboraSchema } from "./schema";
import { arboraDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#4F6B45",
  secondary: "#8FA87E",
  accent: "#2F3D28",
  background: "#EEF2EA",
  surface: "#E2E8DB",
  text: "#1C2618",
  muted: "#6B7564",
  dark: "#12180F",
};

const blocks = [
  { type: "header", variant: "sharp-nav", title: "Header" },
  { type: "hero", variant: "full-bleed", title: "Hero" },
  { type: "about", variant: "image-band", title: "Band" },
  { type: "services", variant: "list", title: "Items" },
  { type: "contact", variant: "plain-form", title: "Contact" },
  { type: "footer", variant: "minimal", title: "Footer" },
];

export const arboraSeed = {
  id: "arbora",
  key: "arbora",
  name: "Arbora",
  title: "Arbora",
  description: "תבנית אדריכלות נוף וגינון בעברית: צילום בוטני מלא, קווים ישרים, זית ואבן — פריסה עריכתית בלי כרטיסים.",
  category: "service",
  categoryLabel: "נוף וגינון",
  niche: "landscape",
  layout: "full",
  image: (arboraDefaultData as Record<string, any>).heroImage,
  heroTitle: (arboraDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (arboraDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({ id: `arbora-${index + 1}-${block.type}`, ...block })),
  pages: arboraPages,
  editor: { pages: arboraPages, css: arboraEditorCss },
  css: arboraEditorCss,
  data: arboraDefaultData,
  defaultData: arboraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const arboraTemplate = {
  id: "arbora",
  key: "arbora",
  name: "Arbora",
  title: "Arbora",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "service",
  categoryLabel: "נוף וגינון",
  badge: "חדש",
  description: "תבנית אדריכלות נוף וגינון בעברית: צילום בוטני מלא, קווים ישרים, זית ואבן — פריסה עריכתית בלי כרטיסים.",
  thumbnail: React.createElement(ArboraThumbnail),
  preview: React.createElement(ArboraPreview),
  component: ArboraPages,
  Component: ArboraPages,
  seed: arboraSeed,
  pages: arboraPages,
  editorCss: arboraEditorCss,
  schema: arboraSchema,
  defaultData: arboraDefaultData,
  renderer: {
    key: "arbora",
    name: "Arbora",
    Component: ArboraPages,
    component: ArboraPages,
    pages: arboraPages,
    editorMode: "visual-react",
    editorCss: arboraEditorCss,
    schema: arboraSchema,
    defaultData: arboraDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default arboraTemplate;
