import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import VesperaPages, { vesperaPages } from "./pages";
import VesperaPreview from "./preview";
import VesperaThumbnail from "./thumbnail";
import { vesperaEditorCss } from "./editorCss";
import { vesperaSchema } from "./schema";
import { vesperaDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#D4A0A8",
  secondary: "#7A3E4A",
  accent: "#F0D8DC",
  background: "#1A0F14",
  surface: "#24151C",
  text: "#F4EBE4",
  muted: "#B39AA0",
  dark: "#0E080B",
};

const blocks = [
  { type: "header", variant: "sharp-nav", title: "Header" },
  { type: "hero", variant: "full-bleed", title: "Hero" },
  { type: "about", variant: "image-band", title: "Band" },
  { type: "services", variant: "list", title: "Items" },
  { type: "contact", variant: "plain-form", title: "Contact" },
  { type: "footer", variant: "minimal", title: "Footer" },
];

export const vesperaSeed = {
  id: "vespera",
  key: "vespera",
  name: "Vespera",
  title: "Vespera",
  description: "תבנית אולם תרבות והופעות בעברית: קומפוזיציה פוסטרית, יין עמוק ועצם, פריסה אסימטרית חדה בלי כרטיסיות.",
  category: "portfolio",
  categoryLabel: "תרבות ואמנות",
  niche: "arts",
  layout: "full",
  image: (vesperaDefaultData as Record<string, any>).heroImage,
  heroTitle: (vesperaDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (vesperaDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({ id: `vespera-${index + 1}-${block.type}`, ...block })),
  pages: vesperaPages,
  editor: { pages: vesperaPages, css: vesperaEditorCss },
  css: vesperaEditorCss,
  data: vesperaDefaultData,
  defaultData: vesperaDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const vesperaTemplate = {
  id: "vespera",
  key: "vespera",
  name: "Vespera",
  title: "Vespera",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "portfolio",
  categoryLabel: "תרבות ואמנות",
  badge: "חדש",
  description: "תבנית אולם תרבות והופעות בעברית: קומפוזיציה פוסטרית, יין עמוק ועצם, פריסה אסימטרית חדה בלי כרטיסיות.",
  thumbnail: React.createElement(VesperaThumbnail),
  preview: React.createElement(VesperaPreview),
  component: VesperaPages,
  Component: VesperaPages,
  seed: vesperaSeed,
  pages: vesperaPages,
  editorCss: vesperaEditorCss,
  schema: vesperaSchema,
  defaultData: vesperaDefaultData,
  renderer: {
    key: "vespera",
    name: "Vespera",
    Component: VesperaPages,
    component: VesperaPages,
    pages: vesperaPages,
    editorMode: "visual-react",
    editorCss: vesperaEditorCss,
    schema: vesperaSchema,
    defaultData: vesperaDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default vesperaTemplate;
