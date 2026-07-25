import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import EventidePages, { eventidePages } from "./pages";
import EventidePreview from "./preview";
import EventideThumbnail from "./thumbnail";
import { eventideEditorCss } from "./editorCss";
import { eventideSchema } from "./schema";
import { eventideDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#7C3AED",
  secondary: "#07040E",
  accent: "#C4B5FD",
  background: "#0F0A1A",
  surface: "#1A1030",
  text: "#F5F3FF",
  muted: "#C4B5FD",
  dark: "#07040E",
};

export const eventideSeed = {
  id: "eventide",
  key: "eventide",
  name: "Eventide",
  title: "Eventide",
  description: "אתר מלא לסוכנות אירועים: 8 עמודים, תנועה, אפקטים ועיצוב ייחודי.",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  niche: "event-agency",
  layout: "full",
  image: (eventideDefaultData as Record<string, any>).heroImage,
  heroTitle: (eventideDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (eventideDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "eventide-header", title: "Header" },
    { type: "hero", variant: "eventide-hero", title: "Hero" },
    { type: "services", variant: "eventide-services", title: "Services" },
    { type: "cases", variant: "eventide-cases", title: "Cases" },
    { type: "team", variant: "eventide-team", title: "Team" },
    { type: "contact", variant: "eventide-contact", title: "Contact" },
    { type: "footer", variant: "eventide-footer", title: "Footer" },
  ].map((block, index) => ({ id: `eventide-${index + 1}-${block.type}`, ...block })),
  pages: eventidePages,
  editor: { pages: eventidePages, css: eventideEditorCss },
  css: eventideEditorCss,
  data: eventideDefaultData,
  defaultData: eventideDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const eventideTemplate = {
  id: "eventide",
  key: "eventide",
  name: "Eventide",
  title: "Eventide",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  badge: "חדש",
  description: "אתר מלא לסוכנות אירועים עם 8 עמודים, תנועה ואפקטים — עיצוב ייחודי.",
  thumbnail: React.createElement(EventideThumbnail),
  preview: React.createElement(EventidePreview),
  component: EventidePages,
  Component: EventidePages,
  seed: eventideSeed,
  pages: eventidePages,
  editorCss: eventideEditorCss,
  schema: eventideSchema,
  defaultData: eventideDefaultData,
  renderer: {
    key: "eventide",
    name: "Eventide",
    Component: EventidePages,
    component: EventidePages,
    pages: eventidePages,
    editorMode: "visual-react",
    editorCss: eventideEditorCss,
    schema: eventideSchema,
    defaultData: eventideDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default eventideTemplate;
