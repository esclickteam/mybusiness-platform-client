import React from "react";

import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";

import SalonixPages, { salonixPages } from "./pages";
import SalonixPreview from "./preview";
import SalonixThumbnail from "./thumbnail";
import { salonixEditorCss } from "./editorCss";
import { salonixSchema } from "./schema";
import { salonixDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#000000",
  secondary: "#FC427F",
  accent: "#FC427F",
  background: "#FFFFFF",
  surface: "#FFFFFF",
  text: "#000000",
  muted: "#909090",
  dark: "#000000",
};

export const salonixSeed = {
  id: "salonix",
  key: "salonix",
  name: "Salonix",
  title: "Salonix",
  description:
    "תבנית סלון ציפורניים פרימיום: סליידר הירו, כרטיסי שירות עם אנימציות, welcome, גלריה, מחירון, יצירת קשר וכפתורים צפים.",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  niche: "nail-salon",
  layout: "full",
  image: salonixDefaultData.heroImage,
  heroTitle: salonixDefaultData.welcomeTitle,
  heroSubtitle: salonixDefaultData.servicesSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "salonix-nav", title: "Header" },
    { type: "hero", variant: "salonix-slider", title: "Hero Slider" },
    { type: "services", variant: "salonix-circles", title: "Services" },
    { type: "about", variant: "salonix-welcome", title: "Welcome" },
    { type: "gallery", variant: "salonix-grid", title: "Gallery" },
    { type: "pricing", variant: "salonix-menu", title: "Price Menu" },
    { type: "contact", variant: "salonix-form", title: "Contact" },
    { type: "footer", variant: "salonix-footer", title: "Footer" },
  ].map((block, index) => ({ id: `salonix-${index + 1}-${block.type}`, ...block })),
  pages: salonixPages,
  editor: { pages: salonixPages, css: salonixEditorCss },
  css: salonixEditorCss,
  data: salonixDefaultData,
  defaultData: salonixDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const salonixTemplate = {
  id: "salonix",
  key: "salonix",
  name: "Salonix",
  title: "Salonix",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  badge: "חדש",
  description:
    "תבנית סלון ציפורניים עם סליידר, אנימציות hover, welcome, גלריה, מחירון מלא ויצירת קשר — עברית, תוכן מקורי.",
  thumbnail: React.createElement(SalonixThumbnail),
  preview: React.createElement(SalonixPreview),
  component: SalonixPages,
  Component: SalonixPages,
  seed: salonixSeed,
  pages: salonixPages,
  editorCss: salonixEditorCss,
  schema: salonixSchema,
  defaultData: salonixDefaultData,
  renderer: {
    key: "salonix",
    name: "Salonix",
    Component: SalonixPages,
    component: SalonixPages,
    pages: salonixPages,
    editorMode: "visual-react",
    editorCss: salonixEditorCss,
    schema: salonixSchema,
    defaultData: salonixDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default salonixTemplate;
