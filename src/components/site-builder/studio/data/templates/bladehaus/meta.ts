import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import BladehausPages, { bladehausPages } from "./pages";
import BladehausPreview from "./preview";
import BladehausThumbnail from "./thumbnail";
import { bladehausEditorCss } from "./editorCss";
import { bladehausSchema } from "./schema";
import { bladehausDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#E8E8E8",
  secondary: "#111111",
  accent: "#C0A060",
  background: "#111111",
  surface: "#1A1A1A",
  text: "#F2F2F2",
  muted: "#8A8A8A",
  dark: "#000000",
};

const blocks = [
  { type: "header", variant: "barberChrome-header", title: "header" },
  { type: "hero", variant: "barberChrome-hero", title: "hero" },
  { type: "services", variant: "barberChrome-services", title: "services" },
  { type: "stats", variant: "barberChrome-stats", title: "stats" },
  { type: "showcase", variant: "barberChrome-showcase", title: "showcase" },
  { type: "process", variant: "barberChrome-process", title: "process" },
  { type: "testimonials", variant: "barberChrome-testimonials", title: "testimonials" },
  { type: "faq", variant: "barberChrome-faq", title: "faq" },
  { type: "contact", variant: "barberChrome-contact", title: "contact" },
  { type: "footer", variant: "barberChrome-footer", title: "footer" },
];

export const bladehausSeed = {
  id: "bladehaus",
  key: "bladehaus",
  name: "Bladehaus",
  title: "Bladehaus",
  description: "דף נחיתה למספרה: הירו חד, מחירון שירותים, צוות ספרים, שעות וטופס תור.",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  niche: "barber",
  layout: "full",
  image: (bladehausDefaultData as Record<string, any>).heroImage,
  heroTitle: (bladehausDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (bladehausDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({ id: `bladehaus-${index + 1}-${block.type}`, ...block })),
  pages: bladehausPages,
  editor: { pages: bladehausPages, css: bladehausEditorCss },
  css: bladehausEditorCss,
  data: bladehausDefaultData,
  defaultData: bladehausDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const bladehausTemplate = {
  id: "bladehaus",
  key: "bladehaus",
  name: "Bladehaus",
  title: "Bladehaus",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  badge: "Premium",
  description: "דף נחיתה למספרה: הירו חד, מחירון שירותים, צוות ספרים, שעות וטופס תור.",
  thumbnail: React.createElement(BladehausThumbnail),
  preview: React.createElement(BladehausPreview),
  component: BladehausPages,
  Component: BladehausPages,
  seed: bladehausSeed,
  pages: bladehausPages,
  editorCss: bladehausEditorCss,
  schema: bladehausSchema,
  defaultData: bladehausDefaultData,
  renderer: {
    key: "bladehaus",
    name: "Bladehaus",
    Component: BladehausPages,
    component: BladehausPages,
    pages: bladehausPages,
    editorMode: "visual-react",
    editorCss: bladehausEditorCss,
    schema: bladehausSchema,
    defaultData: bladehausDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default bladehausTemplate;
