import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import SaltforgePages, { saltforgePages } from "./pages";
import SaltforgePreview from "./preview";
import SaltforgeThumbnail from "./thumbnail";
import { saltforgeEditorCss } from "./editorCss";
import { saltforgeSchema } from "./schema";
import { saltforgeDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#c45c26", secondary: "#6b6560", accent: "#c45c26",
  background: "#e8e4df", surface: "#f5f2ed", text: "#2a2826", muted: "#6b6560", dark: "#1a1816",
};

export const saltforgeSeed = {
  id: "saltforge", key: "saltforge", name: "Saltforge", title: "Saltforge",
  description: "תבנית בוטיק מלח ומלאכה: הירo gritty עם grain sweep, masonry מוצרים, שלבי craft וטופס wholesale — forge-spark animation.",
  category: "travel", categoryLabel: "תיירות וחוף", niche: "Artisan · חוף", layout: "full",
  image: (saltforgeDefaultData as any).heroImage,
  heroTitle: (saltforgeDefaultData as any).heroTitle,
  heroSubtitle: (saltforgeDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "forge-nav", title: "Forge nav" },
    { type: "hero", variant: "grain-grit", title: "Grain grit hero" },
    { type: "shop", variant: "masonry-grid", title: "Masonry product grid" },
    { type: "craft", variant: "forge-steps", title: "Craft steps" },
    { type: "about", variant: "artisan-story", title: "Artisan story" },
    { type: "contact", variant: "wholesale-form", title: "Wholesale form" },
    { type: "footer", variant: "minimal", title: "Footer" },
  ].map((b, i) => ({ id: `saltforge-${i+1}-${b.type}`, ...b })),
  pages: saltforgePages,
  editor: { pages: saltforgePages, css: saltforgeEditorCss },
  css: saltforgeEditorCss, data: saltforgeDefaultData, defaultData: saltforgeDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const saltforgeTemplate = {
  id: "saltforge", key: "saltforge", name: "Saltforge", title: "Saltforge", author: "Bizuply", priceLabel: "כלול",
  category: "travel", categoryLabel: "תיירות וחוף", badge: "חדש",
  description: "תבנית בוטיק מלח ומלאכה: הירo gritty עם grain sweep, masonry מוצרים, שלבי craft וטופס wholesale — forge-spark animation.",
  thumbnail: React.createElement(SaltforgeThumbnail),
  preview: React.createElement(SaltforgePreview),
  component: SaltforgePages, Component: SaltforgePages,
  seed: saltforgeSeed, pages: saltforgePages, editorCss: saltforgeEditorCss, schema: saltforgeSchema, defaultData: saltforgeDefaultData,
  renderer: {
    key: "saltforge", name: "Saltforge", Component: SaltforgePages, component: SaltforgePages, pages: saltforgePages,
    editorMode: "visual-react", editorCss: saltforgeEditorCss, schema: saltforgeSchema, defaultData: saltforgeDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default saltforgeTemplate;
