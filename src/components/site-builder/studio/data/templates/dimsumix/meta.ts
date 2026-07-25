import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import DimsumixPages, { dimsumixPages } from "./pages";
import DimsumixPreview from "./preview";
import DimsumixThumbnail from "./thumbnail";
import { dimsumixEditorCss } from "./editorCss";
import { dimsumixSchema } from "./schema";
import { dimsumixDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#86efac", secondary: "#8aa89a", accent: "#86efac",
  background: "#0f1412", surface: "#18201c", text: "#f0f5f2", muted: "#8aa89a", dark: "#080b09",
};

export const dimsumixSeed = {
  id: "dimsumix", key: "dimsumix", name: "Dimsumix", title: "Dimsumix",
  description: "תבנית דימ סאם: סלי במבוק מאודים, ענני קיטור וטופס הזמנה עגול — סעודת בוקר אסייתית.",
  category: "food", categoryLabel: "אוכל ומסעדות", niche: "דימ סאם · כיסונים", layout: "full",
  image: (dimsumixDefaultData as any).heroImage,
  heroTitle: (dimsumixDefaultData as any).heroTitle,
  heroSubtitle: (dimsumixDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "bamboo-nav", title: "Bamboo steam nav" },
    { type: "hero", variant: "basket-steam-hero", title: "Basket steam hero" },
    { type: "menu", variant: "steam-basket-stack", title: "Steam basket stack" },
    { type: "process", variant: "dimsum-process", title: "Dim sum process" },
    { type: "gallery", variant: "steam-gallery", title: "Steam gallery" },
    { type: "reviews", variant: "dimsum-reviews", title: "Dim sum reviews" },
    { type: "stats", variant: "steam-stats", title: "Steam stats + hours" },
    { type: "cta", variant: "dimsum-home-cta", title: "Home CTA teaser" },
    { type: "basketsPage", variant: "full-basket-menu", title: "Full basket menu page" },
    { type: "steamPage", variant: "steam-story", title: "Steam story page" },
    { type: "about", variant: "wok-timeline", title: "Wok timeline" },
    { type: "contact", variant: "round-reserve-faq", title: "Round reserve + FAQ" },
    { type: "footer", variant: "bamboo-wave", title: "Bamboo wave footer" },
  ].map((b, i) => ({ id: `dimsumix-${i+1}-${b.type}`, ...b })),
  pages: dimsumixPages,
  editor: { pages: dimsumixPages, css: dimsumixEditorCss },
  css: dimsumixEditorCss, data: dimsumixDefaultData, defaultData: dimsumixDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const dimsumixTemplate = {
  id: "dimsumix", key: "dimsumix", name: "Dimsumix", title: "Dimsumix", author: "Bizuply", priceLabel: "כלול",
  category: "food", categoryLabel: "אוכל ומסעדות", badge: "חדש",
  description: "תבנית דימ סאם: סלי במבוק מאודים, ענני קיטור וטופס הזמנה עגול — סעודת בוקר אסייתית.",
  thumbnail: React.createElement(DimsumixThumbnail),
  preview: React.createElement(DimsumixPreview),
  component: DimsumixPages, Component: DimsumixPages,
  seed: dimsumixSeed, pages: dimsumixPages, editorCss: dimsumixEditorCss, schema: dimsumixSchema, defaultData: dimsumixDefaultData,
  renderer: {
    key: "dimsumix", name: "Dimsumix", Component: DimsumixPages, component: DimsumixPages, pages: dimsumixPages,
    editorMode: "visual-react", editorCss: dimsumixEditorCss, schema: dimsumixSchema, defaultData: dimsumixDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default dimsumixTemplate;
