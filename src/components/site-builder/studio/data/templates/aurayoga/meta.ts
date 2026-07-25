import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import AurayogaPages, { aurayogaPages } from "./pages";
import AurayogaPreview from "./preview";
import AurayogaThumbnail from "./thumbnail";
import { aurayogaEditorCss } from "./editorCss";
import { aurayogaSchema } from "./schema";
import { aurayogaDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  "primary": "#A78BFA",
  "secondary": "#1C1526",
  "accent": "#C4B5FD",
  "background": "#1C1526",
  "surface": "#2A2036",
  "text": "#F5F0FF",
  "muted": "#B7A9C9",
  "dark": "#120E18"
};

export const aurayogaSeed = {
  id: "aurayoga",
  key: "aurayoga",
  name: "Aurayoga",
  title: "Aurayoga",
  description: "דף נחיתה מקצועי לתחום יוגה וולנס עם תנועה, אפקטים ועיצוב ייחודי.",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  niche: "yoga",
  layout: "full",
  image: (aurayogaDefaultData as any).heroImage,
  heroTitle: (aurayogaDefaultData as any).heroTitle,
  heroSubtitle: (aurayogaDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "aurayoga-header", title: "header" },
    { type: "hero", variant: "aurayoga-hero", title: "hero" },
    { type: "services", variant: "aurayoga-services", title: "services" },
    { type: "showcase", variant: "aurayoga-showcase", title: "showcase" },
    { type: "stats", variant: "aurayoga-stats", title: "stats" },
    { type: "process", variant: "aurayoga-process", title: "process" },
    { type: "testimonials", variant: "aurayoga-testimonials", title: "testimonials" },
    { type: "faq", variant: "aurayoga-faq", title: "faq" },
    { type: "contact", variant: "aurayoga-contact", title: "contact" },
    { type: "footer", variant: "aurayoga-footer", title: "footer" },
  ].map((block, index) => ({ id: `aurayoga-${index + 1}-${block.type}`, ...block })),
  pages: aurayogaPages,
  editor: { pages: aurayogaPages, css: aurayogaEditorCss },
  css: aurayogaEditorCss,
  data: aurayogaDefaultData,
  defaultData: aurayogaDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const aurayogaTemplate = {
  id: "aurayoga",
  key: "aurayoga",
  name: "Aurayoga",
  title: "Aurayoga",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  badge: "חדש",
  description: "דף נחיתה מקצועי לתחום יוגה וולנס עם תנועה, אפקטים ועיצוב ייחודי.",
  thumbnail: React.createElement(AurayogaThumbnail),
  preview: React.createElement(AurayogaPreview),
  component: AurayogaPages,
  Component: AurayogaPages,
  seed: aurayogaSeed,
  pages: aurayogaPages,
  editorCss: aurayogaEditorCss,
  schema: aurayogaSchema,
  defaultData: aurayogaDefaultData,
  renderer: {
    key: "aurayoga",
    name: "Aurayoga",
    Component: AurayogaPages,
    component: AurayogaPages,
    pages: aurayogaPages,
    editorMode: "visual-react",
    editorCss: aurayogaEditorCss,
    schema: aurayogaSchema,
    defaultData: aurayogaDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default aurayogaTemplate;
