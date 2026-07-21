import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import GridlinePages, { gridlinePages } from "./pages";
import GridlinePreview from "./preview";
import GridlineThumbnail from "./thumbnail";
import { gridlineEditorCss } from "./editorCss";
import { gridlineSchema } from "./schema";
import { gridlineDefaultData } from "./defaultData";

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

export const gridlineSeed = {
  id: "gridline",
  key: "gridline",
  name: "Gala Nail Salon",
  title: "Gala Nail Salon",
  description:
    "תבנית סלון ציפורניים בסגנון Gala: סליידר הירו, שירותים עם אנימציות, welcome, גלריה, מחירון מלא, יצירת קשר וכפתורי Call/Booking צפים.",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  niche: "nail-salon",
  layout: "full",
  image: gridlineDefaultData.heroSlideOne,
  heroTitle: gridlineDefaultData.welcomeTitle,
  heroSubtitle: gridlineDefaultData.servicesSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "gala-logo-nav", title: "Header" },
    { type: "hero", variant: "gala-slider", title: "Hero Slider" },
    { type: "services", variant: "gala-circles", title: "Services" },
    { type: "about", variant: "gala-welcome", title: "Welcome" },
    { type: "gallery", variant: "gala-grid", title: "Gallery" },
    { type: "pricing", variant: "gala-menu", title: "Price Menu" },
    { type: "contact", variant: "gala-form", title: "Contact" },
    { type: "footer", variant: "gala-footer", title: "Footer" },
  ].map((block, index) => ({ id: `gridline-${index + 1}-${block.type}`, ...block })),
  pages: gridlinePages,
  editor: { pages: gridlinePages, css: gridlineEditorCss },
  css: gridlineEditorCss,
  data: gridlineDefaultData,
  defaultData: gridlineDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const gridlineTemplate = {
  id: "gridline",
  key: "gridline",
  name: "Gala Nail Salon",
  title: "Gala Nail Salon",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  badge: "חדש",
  description:
    "תבנית סלון ציפורניים בהשראת galanailsalon.com — שחור וורוד, סליידר, שירותים עם תנועה, welcome, גלריה, מחירון, contact ו-booking.",
  thumbnail: React.createElement(GridlineThumbnail),
  preview: React.createElement(GridlinePreview),
  component: GridlinePages,
  Component: GridlinePages,
  seed: gridlineSeed,
  pages: gridlinePages,
  editorCss: gridlineEditorCss,
  schema: gridlineSchema,
  defaultData: gridlineDefaultData,
  renderer: {
    key: "gridline",
    name: "Gala Nail Salon",
    Component: GridlinePages,
    component: GridlinePages,
    pages: gridlinePages,
    editorMode: "visual-react",
    editorCss: gridlineEditorCss,
    schema: gridlineSchema,
    defaultData: gridlineDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default gridlineTemplate;
