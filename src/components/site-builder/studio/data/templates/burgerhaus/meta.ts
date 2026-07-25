import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import BurgerhausPages, { burgerhausPages } from "./pages";
import BurgerhausPreview from "./preview";
import BurgerhausThumbnail from "./thumbnail";
import { burgerhausEditorCss } from "./editorCss";
import { burgerhausSchema } from "./schema";
import { burgerhausDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#f59e0b", secondary: "#a3a3a3", accent: "#f59e0b",
  background: "#111111", surface: "#1a1a1a", text: "#f5f5f5", muted: "#a3a3a3", dark: "#050505",
};

export const burgerhausSeed = {
  id: "burgerhaus", key: "burgerhaus", name: "Burgerhaus", title: "Burgerhaus",
  description: "תבנית בורגר: שכבות סמאש, לחמנייה זהובה וטופס הזמנה כבד — גריל אמריקאי ישיר.",
  category: "food", categoryLabel: "אוכל ומסעדות", niche: "המבורגר · סמאש", layout: "full",
  image: (burgerhausDefaultData as any).heroImage,
  heroTitle: (burgerhausDefaultData as any).heroTitle,
  heroSubtitle: (burgerhausDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "smash-badge-nav", title: "Smash badge nav" },
    { type: "hero", variant: "smash-stack-hero", title: "Smash stack hero" },
    { type: "menu", variant: "burger-smash-pile", title: "Burger smash pile" },
    { type: "process", variant: "smash-process", title: "Smash process" },
    { type: "gallery", variant: "burger-gallery", title: "Burger gallery" },
    { type: "reviews", variant: "burger-reviews", title: "Burger reviews" },
    { type: "stats", variant: "grill-stats", title: "Grill stats + hours" },
    { type: "cta", variant: "burger-home-cta", title: "Home CTA teaser" },
    { type: "burgersPage", variant: "full-burger-menu", title: "Full burger menu page" },
    { type: "smashPage", variant: "smash-story", title: "Smash story page" },
    { type: "about", variant: "patty-timeline", title: "Patty timeline" },
    { type: "contact", variant: "ticket-smash-faq", title: "Ticket smash FAQ" },
    { type: "footer", variant: "bun-tear", title: "Bun tear footer" },
  ].map((b, i) => ({ id: `burgerhaus-${i+1}-${b.type}`, ...b })),
  pages: burgerhausPages,
  editor: { pages: burgerhausPages, css: burgerhausEditorCss },
  css: burgerhausEditorCss, data: burgerhausDefaultData, defaultData: burgerhausDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const burgerhausTemplate = {
  id: "burgerhaus", key: "burgerhaus", name: "Burgerhaus", title: "Burgerhaus", author: "Bizuply", priceLabel: "כלול",
  category: "food", categoryLabel: "אוכל ומסעדות", badge: "חדש",
  description: "תבנית בורגר: שכבות סמאש, לחמנייה זהובה וטופס הזמנה כבד — גריל אמריקאי ישיר.",
  thumbnail: React.createElement(BurgerhausThumbnail),
  preview: React.createElement(BurgerhausPreview),
  component: BurgerhausPages, Component: BurgerhausPages,
  seed: burgerhausSeed, pages: burgerhausPages, editorCss: burgerhausEditorCss, schema: burgerhausSchema, defaultData: burgerhausDefaultData,
  renderer: {
    key: "burgerhaus", name: "Burgerhaus", Component: BurgerhausPages, component: BurgerhausPages, pages: burgerhausPages,
    editorMode: "visual-react", editorCss: burgerhausEditorCss, schema: burgerhausSchema, defaultData: burgerhausDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default burgerhausTemplate;
