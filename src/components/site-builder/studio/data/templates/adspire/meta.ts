import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import AdspirePages, { adspirePages } from "./pages";
import AdspirePreview from "./preview";
import AdspireThumbnail from "./thumbnail";
import { adspireEditorCss } from "./editorCss";
import { adspireSchema } from "./schema";
import { adspireDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#7C3AED",
  secondary: "#050208",
  accent: "#A78BFA",
  background: "#0B0614",
  surface: "#160B24",
  text: "#F5F3FF",
  muted: "#C4B5FD",
  dark: "#050208",
};

export const adspireSeed = {
  id: "adspire",
  key: "adspire",
  name: "Adspire",
  title: "Adspire",
  description: "אתר מלא לסוכנות פרסום: 8 עמודים כולל אודות, שירותים, פרויקטים, צוות, תובנות, תהליך וצור קשר.",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  niche: "advertising-agency",
  layout: "full",
  image: (adspireDefaultData as Record<string, any>).heroImage,
  heroTitle: (adspireDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (adspireDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "adspire-header", title: "Header" },
    { type: "hero", variant: "adspire-hero", title: "Hero" },
    { type: "services", variant: "adspire-services", title: "Services" },
    { type: "cases", variant: "adspire-cases", title: "Cases" },
    { type: "team", variant: "adspire-team", title: "Team" },
    { type: "contact", variant: "adspire-contact", title: "Contact" },
    { type: "footer", variant: "adspire-footer", title: "Footer" },
  ].map((block, index) => ({ id: `adspire-${index + 1}-${block.type}`, ...block })),
  pages: adspirePages,
  editor: { pages: adspirePages, css: adspireEditorCss },
  css: adspireEditorCss,
  data: adspireDefaultData,
  defaultData: adspireDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const adspireTemplate = {
  id: "adspire",
  key: "adspire",
  name: "Adspire",
  title: "Adspire",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  badge: "חדש",
  description: "אתר מלא לסוכנות פרסום עם 8 עמודים, ניווט פנימי ותוכן מוכן לעריכה.",
  thumbnail: React.createElement(AdspireThumbnail),
  preview: React.createElement(AdspirePreview),
  component: AdspirePages,
  Component: AdspirePages,
  seed: adspireSeed,
  pages: adspirePages,
  editorCss: adspireEditorCss,
  schema: adspireSchema,
  defaultData: adspireDefaultData,
  renderer: {
    key: "adspire",
    name: "Adspire",
    Component: AdspirePages,
    component: AdspirePages,
    pages: adspirePages,
    editorMode: "visual-react",
    editorCss: adspireEditorCss,
    schema: adspireSchema,
    defaultData: adspireDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default adspireTemplate;
