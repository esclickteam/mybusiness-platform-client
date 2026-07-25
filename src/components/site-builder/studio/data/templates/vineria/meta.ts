import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import VineriaPages, { vineriaPages } from "./pages";
import VineriaPreview from "./preview";
import VineriaThumbnail from "./thumbnail";
import { vineriaEditorCss } from "./editorCss";
import { vineriaSchema } from "./schema";
import { vineriaDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#9b2335", secondary: "#a8959a", accent: "#9b2335",
  background: "#1a1218", surface: "#241820", text: "#f5ebe0", muted: "#a8959a", dark: "#0c080c",
};

export const vineriaSeed = {
  id: "vineria", key: "vineria", name: "Vineria", title: "Vineria",
  description: "תבנית בר יין: הירו עם שכבות מרתף פרלקס, ציר טעימות אנכי, תגי פקק צפים וטופס הזמנה אלגנטי — תנועת עומק ופקקים מרחפים.",
  category: "food", categoryLabel: "אוכל ומסעדות", niche: "יין · טעימות", layout: "full",
  image: (vineriaDefaultData as any).heroImage,
  heroTitle: (vineriaDefaultData as any).heroTitle,
  heroSubtitle: (vineriaDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "centered-elegant-serif", title: "Centered elegant serif nav" },
    { type: "hero", variant: "parallax-cellar-layers", title: "Parallax cellar depth hero" },
    { type: "tasting", variant: "vertical-notes-timeline", title: "Vertical tasting notes" },
    { type: "process", variant: "cellar-process", title: "Cellar process" },
    { type: "gallery", variant: "cellar-gallery", title: "Cellar gallery" },
    { type: "reviews", variant: "cellar-reviews", title: "Cellar reviews" },
    { type: "stats", variant: "cellar-stats", title: "Cellar stats + hours" },
    { type: "cta", variant: "cellar-home-cta", title: "Home CTA teaser" },
    { type: "winesPage", variant: "full-wine-list", title: "Full wine list page" },
    { type: "tastingPage", variant: "tasting-story", title: "Tasting story page" },
    { type: "about", variant: "letterpress-timeline", title: "Letterpress timeline + chef" },
    { type: "contact", variant: "elegant-reserve-faq", title: "Elegant reserve + FAQ" },
    { type: "footer", variant: "vintage-stamp", title: "Vintage stamp footer" },
  ].map((b, i) => ({ id: `vineria-${i+1}-${b.type}`, ...b })),
  pages: vineriaPages,
  editor: { pages: vineriaPages, css: vineriaEditorCss },
  css: vineriaEditorCss, data: vineriaDefaultData, defaultData: vineriaDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const vineriaTemplate = {
  id: "vineria", key: "vineria", name: "Vineria", title: "Vineria", author: "Bizuply", priceLabel: "כלול",
  category: "food", categoryLabel: "אוכל ומסעדות", badge: "חדש",
  description: "תבנית בר יין: הירו עם שכבות מרתף פרלקס, ציר טעימות אנכי, תגי פקק צפים וטופס הזמנה אלגנטי — תנועת עומק ופקקים מרחפים.",
  thumbnail: React.createElement(VineriaThumbnail),
  preview: React.createElement(VineriaPreview),
  component: VineriaPages, Component: VineriaPages,
  seed: vineriaSeed, pages: vineriaPages, editorCss: vineriaEditorCss, schema: vineriaSchema, defaultData: vineriaDefaultData,
  renderer: {
    key: "vineria", name: "Vineria", Component: VineriaPages, component: VineriaPages, pages: vineriaPages,
    editorMode: "visual-react", editorCss: vineriaEditorCss, schema: vineriaSchema, defaultData: vineriaDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default vineriaTemplate;
