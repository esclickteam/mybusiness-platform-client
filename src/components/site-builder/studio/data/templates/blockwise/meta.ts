import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import BlockwisePages, { blockwisePages } from "./pages";
import BlockwisePreview from "./preview";
import BlockwiseThumbnail from "./thumbnail";
import { blockwiseEditorCss } from "./editorCss";
import { blockwiseSchema } from "./schema";
import { blockwiseDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#e63946", secondary: "#666666", accent: "#e63946",
  background: "#e8e4df", surface: "#f5f2ee", text: "#1a1a1a", muted: "#666666", dark: "#0d0d0d",
};

export const blockwiseSeed = {
  id: "blockwise", key: "blockwise", name: "Blockwise", title: "Blockwise",
  description: "תבנית בrutalist: בלוקים מוערמים עם stagger climb, אינדקס נכסים ממוספר ופס קשר טיפוגרפי נועז.",
  category: "real-estate", categoryLabel: "נדל״ן", niche: "נדל״ן בrutalist · עיר", layout: "full",
  image: (blockwiseDefaultData as any).heroImage,
  heroTitle: (blockwiseDefaultData as any).heroTitle,
  heroSubtitle: (blockwiseDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "block-nav", title: "Nav" },
    { type: "hero", variant: "stack-climb", title: "Hero" },
    { type: "index", variant: "numbered-rows", title: "Index" },
    { type: "contact-band", variant: "bold-type", title: "Band" },
    { type: "gallery", variant: "parallax-showcase", title: "Gallery" },
    { type: "team", variant: "agent-grid", title: "Agents" },
    { type: "testimonials", variant: "premium-carousel", title: "Testimonials" },
    { type: "stats", variant: "trust-badges", title: "Stats" },
    { type: "about", variant: "brutalist-story", title: "About" },
    { type: "faq", variant: "accordion-premium", title: "FAQ" },
    { type: "contact", variant: "direct-form", title: "Contact" },
    { type: "footer", variant: "minimal", title: "Footer" },
  ].map((b, i) => ({ id: `blockwise-${i+1}-${b.type}`, ...b })),
  pages: blockwisePages,
  editor: { pages: blockwisePages, css: blockwiseEditorCss },
  css: blockwiseEditorCss, data: blockwiseDefaultData, defaultData: blockwiseDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const blockwiseTemplate = {
  id: "blockwise", key: "blockwise", name: "Blockwise", title: "Blockwise", author: "Bizuply", priceLabel: "כלול",
  category: "real-estate", categoryLabel: "נדל״ן", badge: "חדש",
  description: "תבנית בrutalist: בלוקים מוערמים עם stagger climb, אינדקס נכסים ממוספר ופס קשר טיפוגרפי נועז.",
  thumbnail: React.createElement(BlockwiseThumbnail),
  preview: React.createElement(BlockwisePreview),
  component: BlockwisePages, Component: BlockwisePages,
  seed: blockwiseSeed, pages: blockwisePages, editorCss: blockwiseEditorCss, schema: blockwiseSchema, defaultData: blockwiseDefaultData,
  renderer: {
    key: "blockwise", name: "Blockwise", Component: BlockwisePages, component: BlockwisePages, pages: blockwisePages,
    editorMode: "visual-react", editorCss: blockwiseEditorCss, schema: blockwiseSchema, defaultData: blockwiseDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default blockwiseTemplate;
