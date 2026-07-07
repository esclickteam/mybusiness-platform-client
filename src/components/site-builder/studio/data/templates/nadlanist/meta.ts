import type { ComponentType } from "react";

import type {
  ReadyWebsiteBlock,
  ReadyWebsitePalette,
  ReadyWebsiteTemplateSeed,
} from "../../readyWebsiteTypes";

import type { StudioTemplateDefinition } from "../types";

import NadlanistThumbnail from "./thumbnail";
import NadlanistPreview from "./preview";
import NadlanistPages, { nadlanistPages } from "./pages";
import { nadlanistEditorCss } from "./editorCss";
import { nadlanistDefaultData } from "./defaultData";

type TemplateBlockInput = Omit<ReadyWebsiteBlock, "id">;

const palette: ReadyWebsitePalette = {
  primary: "#F6EFE3",
  secondary: "#10100E",
  accent: "#D8B36A",
  background: "#10100E",
  surface: "#191915",
  text: "#F6EFE3",
  muted: "#A9A093",
  dark: "#050504",
};

const blocks: TemplateBlockInput[] = [
  { type: "header", variant: "luxury-real-estate-sticky", title: "Header" },
  { type: "hero", variant: "nadlanist-editorial-hero", title: "Hero" },

  { type: "about", variant: "trusted-network", title: "Trusted Network" },
  { type: "about", variant: "large-editorial-manifesto", title: "Manifesto" },
  { type: "services", variant: "real-estate-services", title: "Services" },
  { type: "gallery", variant: "properties-no-prices", title: "Properties" },
  {
    type: "testimonials",
    variant: "premium-client-reviews",
    title: "Reviews",
  },
  { type: "services", variant: "real-estate-process", title: "Process" },
  { type: "about", variant: "faq-private-pricing", title: "FAQ" },
  { type: "contact", variant: "private-consultation", title: "Contact" },
  { type: "footer", variant: "editorial-footer", title: "Footer" },
];

export const nadlanistSeed = {
  id: "nadlanist",
  templateId: "nadlanist",
  name: "Nadlanist",
  title: "Nadlanist",
  category: "Real Estate",
  subcategory: "Agent",
  description:
    "A premium real estate agent template with cinematic styling, private pricing, property cards, advisory sections and strong contact CTAs.",
  palette,
  blocks: blocks.map((block, index) => ({
    ...block,
    id: `nadlanist-${String(index + 1).padStart(2, "0")}-${block.type}`,
  })),
  pages: nadlanistPages,
  defaultData: nadlanistDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const nadlanistTemplate = {
  id: "nadlanist",
  templateId: "nadlanist",

  name: "Nadlanist",
  title: "Nadlanist",
  label: "Nadlanist",

  category: "Real Estate",
  subcategory: "Agent",
  description:
    "Luxury real estate advisor template with property cards without public prices.",

  tags: [
    "Real Estate",
    "Agent",
    "Broker",
    "Luxury",
    "Properties",
    "No Prices",
    "Portfolio",
    "Dark",
    "Cinematic",
  ],

  palette,
  seed: nadlanistSeed,
  defaultData: nadlanistDefaultData,

  pages: nadlanistPages,

  Component: NadlanistPages as ComponentType<any>,
  Preview: NadlanistPreview,
  PreviewComponent: NadlanistPreview,
  Thumbnail: NadlanistThumbnail,
  ThumbnailComponent: NadlanistThumbnail,
  thumbnail: NadlanistThumbnail,

  editorCss: nadlanistEditorCss,
} as unknown as StudioTemplateDefinition;

export default nadlanistTemplate;