import type { ComponentType } from "react";

import type {
  ReadyWebsiteBlock,
  ReadyWebsitePalette,
  ReadyWebsiteTemplateSeed,
} from "../../readyWebsiteTypes";

import type { StudioTemplateDefinition } from "../types";

import VirelloThumbnail from "./thumbnail";
import VirelloPreview from "./preview";
import VirelloPages, { virelloPages } from "./pages";
import { adionEditorCss as virelloEditorCss } from "./editorCss";
import { adionSchema as virelloSchema } from "./schema";
import { virelloDefaultData } from "./defaultData";

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

const blocks = [
  {
    type: "header",
    variant: "virello-numbered-rtl",
    title: "Header",
  },
  {
    type: "hero",
    variant: "virello-bold-creative-rtl",
    title: "Hero",
  },
  {
    type: "services",
    variant: "virello-cards-rtl",
    title: "Services",
  },
  {
    type: "about",
    variant: "virello-dark-about-rtl",
    title: "About",
  },
  {
    type: "gallery",
    variant: "virello-projects-rtl",
    title: "Projects",
  },
  {
    type: "testimonials",
    variant: "virello-testimonials-rtl",
    title: "Testimonials",
  },
  {
    type: "faq",
    variant: "virello-faq-rtl",
    title: "FAQ",
  },
  {
    type: "footer",
    variant: "virello-footer-rtl",
    title: "Footer",
  },
] as TemplateBlockInput[];

export const virelloSeed = {
  id: "virello",
  name: "Virello",

  niche: "agency",
  category: "agency",
  layout: "creative-agency",

  heroTitle: "Virello",
  heroSubtitle: "סטודיו דיגיטלי לבניית מותגים, אתרים וחוויות שמוכרות",

  description:
    "תבנית סטודיו דיגיטלית צבעונית ומודרנית בסגנון Virello עם טיפוגרפיה ענקית, תמונות צפות, תנועה עדינה, שירותים, פרויקטים, צוות, תהליך, FAQ ובלוג.",

  image:
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",

  palette,

  blocks: blocks.map((block, index) => ({
    ...block,
    id: `virello-${block.type}-${index + 1}`,
  })),
} as unknown as ReadyWebsiteTemplateSeed;

export const virelloTemplate = {
  id: "virello",
  name: "Virello",
  category: "agency",

  description:
    "תבנית סטודיו דיגיטלית מקורית בסגנון Virello: הירו טיפוגרפי ענק, תמונות צפות, כרטיסי שירות, פרויקטים, צוות, תהליך, FAQ ובלוג.",

  image:
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",

  seed: virelloSeed,
  palette,
  blocks: virelloSeed.blocks,

  thumbnail: VirelloThumbnail,
  Thumbnail: VirelloThumbnail,

  preview: VirelloPreview,
  Preview: VirelloPreview,

  component: VirelloPages,
  Component: VirelloPages,

  pages: virelloPages,

  editorCss: virelloEditorCss,
  schema: virelloSchema,
  defaultData: virelloDefaultData,

  renderer: {
    Component: VirelloPages as ComponentType<any>,
    pages: virelloPages,
  },
} as unknown as StudioTemplateDefinition;

/*
  תאימות לאחור:
  אם קבצים אחרים בפרויקט עדיין מייבאים adionTemplate / adionSeed,
  זה מונע שבירה בבילד.
*/
export const adionSeed = virelloSeed;
export const adionTemplate = virelloTemplate;