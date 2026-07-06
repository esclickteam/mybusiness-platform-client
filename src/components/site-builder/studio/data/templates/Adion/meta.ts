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
import { adionSchema } from "./schema";
import { adionDefaultData } from "./defaultData";

type TemplateBlockInput = Omit<ReadyWebsiteBlock, "id">;

const palette: ReadyWebsitePalette = {
  primary: "#301b12",
  secondary: "#7a5b4a",
  accent: "#ff9fbc",
  background: "#fff8f0",
  surface: "#ffffff",
  text: "#301b12",
  muted: "#8f7567",
  dark: "#1f120c",
};

const blocks: TemplateBlockInput[] = [
  {
    type: "header",
    variant: "adion-numbered-rtl",
    title: "Header",
  },
  {
    type: "hero",
    variant: "adion-bold-creative-rtl",
    title: "Hero",
  },
  {
    type: "services",
    variant: "adion-cards-rtl",
    title: "Services",
  },
  {
    type: "about",
    variant: "adion-dark-about-rtl",
    title: "About",
  },
  {
    type: "gallery",
    variant: "adion-projects-rtl",
    title: "Projects",
  },
  {
    type: "testimonials",
    variant: "adion-testimonials-rtl",
    title: "Testimonials",
  },
  {
    type: "faq",
    variant: "adion-faq-rtl",
    title: "FAQ",
  },
  {
    type: "footer",
    variant: "adion-footer-rtl",
    title: "Footer",
  },
];

export const adionSeed: ReadyWebsiteTemplateSeed = {
  id: "adion",
  name: "Adion",

  niche: "agency",
  category: "agency",
  layout: "creative-agency" as ReadyWebsiteTemplateSeed["layout"],

  heroTitle: "adion",
  heroSubtitle: "בונים, מנהלים ומגדילים מותגים דיגיטליים שנראים אחרת.",

  description:
    "תבנית סטודיו דיגיטלית צבעונית ומודרנית עם טיפוגרפיה גדולה, שירותים, פרויקטים, צוות, מחירון, תהליך, FAQ ובלוג.",

  image:
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",

  palette,

  blocks: blocks.map((block, index) => ({
    ...block,
    id: `adion-${block.type}-${index + 1}`,
  })),
};

export const adionTemplate = {
  id: "adion",
  name: "Adion",
  category: "agency",

  description:
    "תבנית סטודיו דיגיטלית מקורית בסגנון Adion: הירו טיפוגרפי ענק, כרטיסי שירות, פרויקטים, צוות, מחירים ובלוג.",

  image:
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",

  seed: adionSeed,
  palette,
  blocks: adionSeed.blocks,

  thumbnail: AdionThumbnail,
  Thumbnail: AdionThumbnail,

  preview: AdionPreview,
  Preview: AdionPreview,

  component: AdionPages,
  Component: AdionPages,

  pages: adionPages,

  editorCss: adionEditorCss,
  schema: adionSchema,
  defaultData: adionDefaultData,

  renderer: {
    Component: AdionPages as ComponentType<any>,
    pages: adionPages,
  },
} as unknown as StudioTemplateDefinition;