import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import FormaraPages, { formaraPages } from "./pages";
import FormaraPreview from "./preview";
import FormaraThumbnail from "./thumbnail";
import { formaraEditorCss } from "./editorCss";
import { formaraSchema } from "./schema";
import { formaraDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#8B5E3C",
  secondary: "#1E1C1A",
  accent: "#C4A484",
  background: "#1E1C1A",
  surface: "#2A2623",
  text: "#F3EEE7",
  muted: "#A39A90",
  dark: "#12100E",
};

const blocks = [
  { type: "header", variant: "interiorClay-header", title: "header" },
  { type: "hero", variant: "interiorClay-hero", title: "hero" },
  { type: "services", variant: "interiorClay-services", title: "services" },
  { type: "stats", variant: "interiorClay-stats", title: "stats" },
  { type: "showcase", variant: "interiorClay-showcase", title: "showcase" },
  { type: "process", variant: "interiorClay-process", title: "process" },
  { type: "testimonials", variant: "interiorClay-testimonials", title: "testimonials" },
  { type: "faq", variant: "interiorClay-faq", title: "faq" },
  { type: "contact", variant: "interiorClay-contact", title: "contact" },
  { type: "footer", variant: "interiorClay-footer", title: "footer" },
];

export const formaraSeed = {
  id: "formara",
  key: "formara",
  name: "Formara",
  title: "Formara",
  description: "דף נחיתה לסטודיו עיצוב פנים: הירו אדריכלי, פרויקטים, תהליך עיצוב וטופס ייעוץ.",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  niche: "interior-design",
  layout: "full",
  image: (formaraDefaultData as Record<string, any>).heroImage,
  heroTitle: (formaraDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (formaraDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({ id: `formara-${index + 1}-${block.type}`, ...block })),
  pages: formaraPages,
  editor: { pages: formaraPages, css: formaraEditorCss },
  css: formaraEditorCss,
  data: formaraDefaultData,
  defaultData: formaraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const formaraTemplate = {
  id: "formara",
  key: "formara",
  name: "Formara",
  title: "Formara",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  badge: "Premium",
  description: "דף נחיתה לסטודיו עיצוב פנים: הירו אדריכלי, פרויקטים, תהליך עיצוב וטופס ייעוץ.",
  thumbnail: React.createElement(FormaraThumbnail),
  preview: React.createElement(FormaraPreview),
  component: FormaraPages,
  Component: FormaraPages,
  seed: formaraSeed,
  pages: formaraPages,
  editorCss: formaraEditorCss,
  schema: formaraSchema,
  defaultData: formaraDefaultData,
  renderer: {
    key: "formara",
    name: "Formara",
    Component: FormaraPages,
    component: FormaraPages,
    pages: formaraPages,
    editorMode: "visual-react",
    editorCss: formaraEditorCss,
    schema: formaraSchema,
    defaultData: formaraDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default formaraTemplate;
