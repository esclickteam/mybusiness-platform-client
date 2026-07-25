import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import MezzalinePages, { mezzalinePages } from "./pages";
import MezzalinePreview from "./preview";
import MezzalineThumbnail from "./thumbnail";
import { mezzalineEditorCss } from "./editorCss";
import { mezzalineSchema } from "./schema";
import { mezzalineDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#5c7a4a", secondary: "#7a7260", accent: "#5c7a4a",
  background: "#f7f1e6", surface: "#fffdf8", text: "#2c2a22", muted: "#7a7260", dark: "#1c1a14",
};

export const mezzalineSeed = {
  id: "mezzaline", key: "mezzaline", name: "Mezzaline", title: "Mezzaline",
  description: "תבנית מזטה ים-תיכונית: הירו מוזאיקה של ארבעה צילומים עם זיתים צפים, מסילת מנות משותפות, פס ציטוט קלף וטופס שולחן גן — תנועה בוטנית רכה.",
  category: "food", categoryLabel: "אוכל ומסעדות", niche: "מזטה · ים-תיכוני", layout: "full",
  image: (mezzalineDefaultData as any).heroImage,
  heroTitle: (mezzalineDefaultData as any).heroTitle,
  heroSubtitle: (mezzalineDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "olive-branch-nav", title: "Olive branch underline nav" },
    { type: "hero", variant: "four-tile-olive-orbs", title: "4-tile mosaic olive orbs hero" },
    { type: "platter", variant: "horizontal-platter-scroll", title: "Horizontal platter scroll" },
    { type: "process", variant: "mezze-process", title: "Mezze process" },
    { type: "gallery", variant: "mezze-gallery", title: "Mezze gallery" },
    { type: "reviews", variant: "mezze-reviews", title: "Mezze reviews" },
    { type: "stats", variant: "mezze-stats", title: "Mezze stats + hours" },
    { type: "cta", variant: "mezze-home-cta", title: "Home CTA teaser" },
    { type: "mezzePage", variant: "full-mezze-menu", title: "Full mezze menu page" },
    { type: "tablePage", variant: "shared-table-story", title: "Shared table story page" },
    { type: "about", variant: "botanical-timeline", title: "Botanical timeline + chef" },
    { type: "contact", variant: "garden-reserve-faq", title: "Garden reserve + FAQ" },
    { type: "footer", variant: "mezze-shared", title: "Mezze footer" },
  ].map((b, i) => ({ id: `mezzaline-${i+1}-${b.type}`, ...b })),
  pages: mezzalinePages,
  editor: { pages: mezzalinePages, css: mezzalineEditorCss },
  css: mezzalineEditorCss, data: mezzalineDefaultData, defaultData: mezzalineDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const mezzalineTemplate = {
  id: "mezzaline", key: "mezzaline", name: "Mezzaline", title: "Mezzaline", author: "Bizuply", priceLabel: "כלול",
  category: "food", categoryLabel: "אוכל ומסעדות", badge: "חדש",
  description: "תבנית מזטה ים-תיכונית: הירו מוזאיקה של ארבעה צילומים עם זיתים צפים, מסילת מנות משותפות, פס ציטוט קלף וטופס שולחן גן — תנועה בוטנית רכה.",
  thumbnail: React.createElement(MezzalineThumbnail),
  preview: React.createElement(MezzalinePreview),
  component: MezzalinePages, Component: MezzalinePages,
  seed: mezzalineSeed, pages: mezzalinePages, editorCss: mezzalineEditorCss, schema: mezzalineSchema, defaultData: mezzalineDefaultData,
  renderer: {
    key: "mezzaline", name: "Mezzaline", Component: MezzalinePages, component: MezzalinePages, pages: mezzalinePages,
    editorMode: "visual-react", editorCss: mezzalineEditorCss, schema: mezzalineSchema, defaultData: mezzalineDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default mezzalineTemplate;
