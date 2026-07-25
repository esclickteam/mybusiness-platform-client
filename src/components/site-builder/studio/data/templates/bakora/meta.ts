import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import BakoraPages, { bakoraPages } from "./pages";
import BakoraPreview from "./preview";
import BakoraThumbnail from "./thumbnail";
import { bakoraEditorCss } from "./editorCss";
import { bakoraSchema } from "./schema";
import { bakoraDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#c4784a", secondary: "#8a6f5c", accent: "#c4784a",
  background: "#faf6f0", surface: "#fffaf3", text: "#2a1f18", muted: "#8a6f5c", dark: "#1c140f",
};

export const bakoraSeed = {
  id: "bakora", key: "bakora", name: "Bakora", title: "Bakora",
  description: "תבנית מאפייה: שכבות בצק כמו למינציה, מדפי מאפים אופקיים, אדים עדינים וטופס הזמנה בסגנון תג מחיר — חמימות של תנור בבוקר.",
  category: "food", categoryLabel: "אוכל ומסעדות", niche: "מאפייה · מאפים", layout: "full",
  image: (bakoraDefaultData as any).heroImage,
  heroTitle: (bakoraDefaultData as any).heroTitle,
  heroSubtitle: (bakoraDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "flour-dust-nav", title: "Flour dust sticky nav" },
    { type: "hero", variant: "laminate-pastry-layers", title: "Laminate pastry layers hero" },
    { type: "menu", variant: "layered-shelf-pastries", title: "Layered shelf pastries" },
    { type: "process", variant: "lam-process", title: "Laminate process" },
    { type: "gallery", variant: "bakery-gallery", title: "Bakery gallery" },
    { type: "reviews", variant: "bakery-reviews", title: "Bakery reviews" },
    { type: "hours", variant: "oven-stats-hours", title: "Oven stats + hours" },
    { type: "cta", variant: "bakery-home-cta", title: "Home CTA teaser" },
    { type: "pastriesPage", variant: "full-pastry-menu", title: "Full pastry menu page" },
    { type: "ovenPage", variant: "oven-story", title: "Oven story page" },
    { type: "about", variant: "baker-timeline", title: "Baker timeline + portrait" },
    { type: "contact", variant: "ticket-reserve-faq", title: "Ticket reserve + FAQ" },
    { type: "footer", variant: "crust-crumb", title: "Crust crumb footer" },
  ].map((b, i) => ({ id: `bakora-${i+1}-${b.type}`, ...b })),
  pages: bakoraPages,
  editor: { pages: bakoraPages, css: bakoraEditorCss },
  css: bakoraEditorCss, data: bakoraDefaultData, defaultData: bakoraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const bakoraTemplate = {
  id: "bakora", key: "bakora", name: "Bakora", title: "Bakora", author: "Bizuply", priceLabel: "כלול",
  category: "food", categoryLabel: "אוכל ומסעדות", badge: "חדש",
  description: "תבנית מאפייה: שכבות בצק כמו למינציה, מדפי מאפים אופקיים, אדים עדינים וטופס הזמנה בסגנון תג מחיר — חמימות של תנור בבוקר.",
  thumbnail: React.createElement(BakoraThumbnail),
  preview: React.createElement(BakoraPreview),
  component: BakoraPages, Component: BakoraPages,
  seed: bakoraSeed, pages: bakoraPages, editorCss: bakoraEditorCss, schema: bakoraSchema, defaultData: bakoraDefaultData,
  renderer: {
    key: "bakora", name: "Bakora", Component: BakoraPages, component: BakoraPages, pages: bakoraPages,
    editorMode: "visual-react", editorCss: bakoraEditorCss, schema: bakoraSchema, defaultData: bakoraDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default bakoraTemplate;
