import type { ComponentType } from "react";

import type {
  ReadyWebsiteBlock,
  ReadyWebsitePalette,
  ReadyWebsiteTemplateSeed,
} from "../../readyWebsiteTypes";

import type { StudioTemplateDefinition } from "../types";

import AdionThumbnail from "./thumbnail";
import AdionPreview from "./preview";
import AdionPages, { adionPages } from "./pages";
import { adionEditorCss } from "./editorCss";

type TemplateBlockInput = Omit<ReadyWebsiteBlock, "id">;

const palette: ReadyWebsitePalette = {
  primary: "#F6EFE3",
  secondary: "#10100E",
  accent: "#F7C873",
  background: "#10100E",
  surface: "#191915",
  text: "#F6EFE3",
  muted: "#A9A093",
  dark: "#050504",
};

const blocks: TemplateBlockInput[] = [
  { type: "header", variant: "cinematic-sticky-dark", title: "Header" },
  { type: "hero", variant: "framion-inspired-visual-hero", title: "Hero" },

  // ReadyBlockType לא תומך ב-"logos", לכן זה חייב להיות type קיים.
  { type: "about", variant: "partner-grid-dark", title: "Partners" },

  { type: "about", variant: "large-editorial-manifesto", title: "Manifesto" },
  { type: "services", variant: "image-cards-cinematic", title: "Services" },
  { type: "gallery", variant: "case-study-grid", title: "Case Studies" },
  {
    type: "testimonials",
    variant: "premium-review-cards",
    title: "Reviews",
  },
  { type: "pricing", variant: "two-plan-cinematic", title: "Pricing" },
  { type: "faq", variant: "accordion-dark", title: "FAQ" },
  { type: "contact", variant: "large-cta-contact", title: "Contact" },
  { type: "footer", variant: "editorial-footer", title: "Footer" },
];

export const adionSeed = {
  id: "adion",
  templateId: "adion",
  name: "Adion",
  title: "Adion",
  category: "Portfolio",
  subcategory: "Photography & Video",
  description:
    "A cinematic photography and video-production template inspired by premium Webflow portfolio layouts.",
  palette,
  blocks: blocks.map((block, index) => ({
    ...block,
    id: `adion-${String(index + 1).padStart(2, "0")}-${block.type}`,
  })),
  pages: adionPages,
} as unknown as ReadyWebsiteTemplateSeed;

export const adionTemplate = {
  id: "adion",
  templateId: "adion",

  name: "Adion",
  title: "Adion",
  label: "Adion",

  category: "Portfolio",
  subcategory: "Photography & Video",
  description:
    "Cinematic photography and video studio template with bold typography, dark editorial layout, image cards, marquee motion and premium CTA sections.",

  tags: [
    "Photography",
    "Video",
    "Portfolio",
    "Agency",
    "Studio",
    "Creative",
    "Dark",
    "Cinematic",
  ],

  palette,
  seed: adionSeed,
  defaultData: adionSeed,

  pages: adionPages,

  Component: AdionPages as ComponentType<any>,
  Preview: AdionPreview,
  PreviewComponent: AdionPreview,
  Thumbnail: AdionThumbnail,
  ThumbnailComponent: AdionThumbnail,
  thumbnail: AdionThumbnail,

  editorCss: adionEditorCss,
} as unknown as StudioTemplateDefinition;

export default adionTemplate;