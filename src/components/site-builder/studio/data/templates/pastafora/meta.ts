import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import PastaforaPages, { pastaforaPages } from "./pages";
import PastaforaPreview from "./preview";
import PastaforaThumbnail from "./thumbnail";
import { pastaforaEditorCss } from "./editorCss";
import { pastaforaSchema } from "./schema";
import { pastaforaDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#b91c1c", secondary: "#8b6b5a", accent: "#b91c1c",
  background: "#faf7f2", surface: "#ffffff", text: "#2c1810", muted: "#8b6b5a", dark: "#1a0e0a",
};

export const pastaforaSeed = {
  id: "pastafora", key: "pastafora", name: "Pastafora", title: "Pastafora",
  description: "תבנית פסטה: מערבולות נודלס, רטבים עשירים וטופס הזמנה איטלקי — טרטוריה חמה.",
  category: "food", categoryLabel: "אוכל ומסעדות", niche: "פסטה · איטלקי", layout: "full",
  image: (pastaforaDefaultData as any).heroImage,
  heroTitle: (pastaforaDefaultData as any).heroTitle,
  heroSubtitle: (pastaforaDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "swirl-nav", title: "Noodle swirl nav" },
    { type: "hero", variant: "noodle-swirl-hero", title: "Noodle swirl pasta hero" },
    { type: "menu", variant: "swirl-pasta-board", title: "Swirl pasta board" },
    { type: "process", variant: "pasta-process", title: "Pasta process" },
    { type: "gallery", variant: "pasta-gallery", title: "Pasta gallery" },
    { type: "reviews", variant: "pasta-reviews", title: "Pasta reviews" },
    { type: "stats", variant: "sauce-stats", title: "Sauce stats + hours" },
    { type: "cta", variant: "pasta-home-cta", title: "Home CTA teaser" },
    { type: "pastasPage", variant: "full-pasta-menu", title: "Full pasta menu page" },
    { type: "saucePage", variant: "sauce-story", title: "Sauce story page" },
    { type: "about", variant: "nonna-timeline", title: "Nonna timeline" },
    { type: "contact", variant: "trattoria-reserve-faq", title: "Trattoria reserve + FAQ" },
    { type: "footer", variant: "swirl-svg", title: "Swirl SVG footer" },
  ].map((b, i) => ({ id: `pastafora-${i+1}-${b.type}`, ...b })),
  pages: pastaforaPages,
  editor: { pages: pastaforaPages, css: pastaforaEditorCss },
  css: pastaforaEditorCss, data: pastaforaDefaultData, defaultData: pastaforaDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const pastaforaTemplate = {
  id: "pastafora", key: "pastafora", name: "Pastafora", title: "Pastafora", author: "Bizuply", priceLabel: "כלול",
  category: "food", categoryLabel: "אוכל ומסעדות", badge: "חדש",
  description: "תבנית פסטה: מערבולות נודלס, רטבים עשירים וטופס הזמנה איטלקי — טרטוריה חמה.",
  thumbnail: React.createElement(PastaforaThumbnail),
  preview: React.createElement(PastaforaPreview),
  component: PastaforaPages, Component: PastaforaPages,
  seed: pastaforaSeed, pages: pastaforaPages, editorCss: pastaforaEditorCss, schema: pastaforaSchema, defaultData: pastaforaDefaultData,
  renderer: {
    key: "pastafora", name: "Pastafora", Component: PastaforaPages, component: PastaforaPages, pages: pastaforaPages,
    editorMode: "visual-react", editorCss: pastaforaEditorCss, schema: pastaforaSchema, defaultData: pastaforaDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default pastaforaTemplate;
