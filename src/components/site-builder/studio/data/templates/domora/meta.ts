import type { ComponentType } from "react";

import type {
  ReadyWebsiteBlock,
  ReadyWebsitePalette,
  ReadyWebsiteTemplateSeed,
} from "../../readyWebsiteTypes";

import type { StudioTemplateDefinition } from "../types";

import DomoraThumbnail from "./thumbnail";
import DomoraPreview from "./preview";
import DomoraPages, { domoraPages } from "./pages";
import { domoraEditorCss } from "./editorCss";
import { domoraDefaultData } from "./defaultData";

type TemplateBlockInput = Omit<ReadyWebsiteBlock, "id">;

const palette: ReadyWebsitePalette = {
  primary: "#151D20",
  secondary: "#F5F5F2",
  accent: "#D8C6A1",
  background: "#F5F5F2",
  surface: "#FFFFFF",
  text: "#151D20",
  muted: "#6D7378",
  dark: "#11191C",
};

const blocks: TemplateBlockInput[] = [
  { type: "header", variant: "dark-pill-navigation", title: "Header" },
  { type: "hero", variant: "luxury-architecture-hero", title: "Hero" },
  { type: "about", variant: "essence-cards", title: "Essence" },
  { type: "gallery", variant: "property-cards", title: "Properties" },
  { type: "gallery", variant: "architecture-gallery", title: "Gallery" },
  { type: "services", variant: "articles-grid", title: "Articles" },
  { type: "testimonials", variant: "soft-client-cards", title: "Testimonials" },
  { type: "about", variant: "faq-clean-list", title: "FAQ" },
  { type: "contact", variant: "luxury-contact", title: "Contact" },
  { type: "footer", variant: "minimal-footer", title: "Footer" },
];

export const domoraSeed = {
  id: "domora",
  templateId: "domora",
  name: "Domora",
  title: "Domora",
  category: "Real Estate",
  subcategory: "Luxury Real Estate",
  description:
    "A clean premium real estate template inspired by modern luxury residence layouts, with rounded navigation, strong visuals, properties, articles, testimonials and FAQ.",
  palette,
  blocks: blocks.map((block, index) => ({
    ...block,
    id: `domora-${String(index + 1).padStart(2, "0")}-${block.type}`,
  })),
  pages: domoraPages,
  defaultData: domoraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const domoraTemplate = {
  id: "domora",
  templateId: "domora",

  name: "Domora",
  title: "Domora",
  label: "Domora",

  category: "Real Estate",
  subcategory: "Luxury Real Estate",
  description:
    "Premium real estate template with rounded dark navigation, large architectural hero, properties, articles, testimonials and FAQ.",

  tags: [
    "Real Estate",
    "Luxury",
    "Properties",
    "Architecture",
    "Articles",
    "Testimonials",
    "FAQ",
    "Minimal",
    "Premium",
  ],

  palette,
  seed: domoraSeed,
  defaultData: domoraDefaultData,
  pages: domoraPages,

  Component: DomoraPages as ComponentType<any>,
  Preview: DomoraPreview,
  PreviewComponent: DomoraPreview,
  Thumbnail: DomoraThumbnail,
  ThumbnailComponent: DomoraThumbnail,
  thumbnail: DomoraThumbnail,

  editorCss: domoraEditorCss,
} as unknown as StudioTemplateDefinition;

export default domoraTemplate;