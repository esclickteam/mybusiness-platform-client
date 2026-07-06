import type { ComponentType } from "react";

import type {
  ReadyWebsiteBlock,
  ReadyWebsitePalette,
  ReadyWebsiteTemplateSeed,
} from "../../readyWebsiteTypes";

import type { StudioTemplateDefinition } from "../types";

import IdoThumbnail from "./thumbnail";
import IdoPreview from "./preview";
import IdoPages, { idoPages } from "./pages";
import { idoEditorCss } from "./editorCss";
import { idoSchema } from "./schema";
import { idoDefaultData } from "./defaultData";

type TemplateBlockInput = Omit<ReadyWebsiteBlock, "id">;

const palette: ReadyWebsitePalette = {
  primary: "#07100E",
  secondary: "#17342D",
  accent: "#C9F4DC",
  background: "#ECF3EA",
  surface: "#FFFFFF",
  text: "#07100E",
  muted: "#6F7C75",
  dark: "#030706",
};

const blocks: TemplateBlockInput[] = [
  {
    type: "header",
    variant: "luxury-beauty-dark-rtl",
    title: "Header",
  },
  {
    type: "hero",
    variant: "split-open-image-rtl",
    title: "Hero",
  },
  {
    type: "services",
    variant: "beauty-treatment-cards-rtl",
    title: "Services",
  },
  {
    type: "about",
    variant: "studio-story-rtl",
    title: "About",
  },
  {
    type: "gallery",
    variant: "premium-grid-rtl",
    title: "Gallery",
  },
  {
    type: "contact",
    variant: "booking-consultation-rtl",
    title: "Booking",
  },
  {
    type: "faq",
    variant: "dark-accordion-rtl",
    title: "FAQ",
  },
  {
    type: "footer",
    variant: "minimal-luxury-rtl",
    title: "Footer",
  },
];

const seed = {
  id: "ido",
  name: "IDO",
  title: "IDO",
  description:
    "תבנית פרימיום לקוסמטיקה ותיאום תורים עם Hero דרמטי, תמונה נפתחת לצדדים, טיפולים, גלריה וטופס תור.",
  category: "beauty",
  niche: "beauty",
  layout: "landing",
  image:
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=90",
  heroTitle: "סטודיו יופי שמרגיש יוקרתי מהקליק הראשון.",
  heroSubtitle:
    "תבנית IDO לקוסמטיקה ותיאום תורים עם חוויית פרימיום, גלריה, טיפולים וטופס קביעת תור.",
  palette,
  blocks: blocks.map((block, index) => ({
    ...block,
    id: `ido-${index + 1}`,
  })) as ReadyWebsiteBlock[],
} as unknown as ReadyWebsiteTemplateSeed;

export const idoTemplate = {
  id: "ido",
  name: "IDO",
  title: "IDO",
  description:
    "תבנית יוקרתית לקוסמטיקה, קליניקות ועסקי יופי עם חוויית תיאום תורים.",
  category: "Beauty & Appointments",
  thumbnail: IdoThumbnail as ComponentType,
  preview: IdoPreview as ComponentType,
  Component: IdoPages as ComponentType,
  pages: idoPages,
  editorCss: idoEditorCss,
  schema: idoSchema,
  defaultData: idoDefaultData,
  seed,
} as unknown as StudioTemplateDefinition;

export default idoTemplate;