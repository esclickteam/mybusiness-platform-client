import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import TapasoraPages, { tapasoraPages } from "./pages";
import TapasoraPreview from "./preview";
import TapasoraThumbnail from "./thumbnail";
import { tapasoraEditorCss } from "./editorCss";
import { tapasoraSchema } from "./schema";
import { tapasoraDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#ff2d95", secondary: "#b89bc4", accent: "#ff2d95",
  background: "#12081a", surface: "#1e1028", text: "#f8eef8", muted: "#b89bc4", dark: "#080410",
};

export const tapasoraSeed = {
  id: "tapasora", key: "tapasora", name: "Tapasora", title: "Tapasora",
  description: "תבנית בר טאפס לילי: הירו עם צלחות קטנות עולות במפל, רשת בנטו, מארקי שוק לילה, בקבוקי יין עם אנימציית מזיגה וטופס כחשבון בר — ניאון וריצוד.",
  category: "food", categoryLabel: "אוכל ומסעדות", niche: "טאפס · בר לילה", layout: "full",
  image: (tapasoraDefaultData as any).heroImage,
  heroTitle: (tapasoraDefaultData as any).heroTitle,
  heroSubtitle: (tapasoraDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "neon-glow-logo", title: "Neon glow logo nav" },
    { type: "hero", variant: "cascade-small-plates", title: "Cascade rising plates hero" },
    { type: "menu", variant: "bento-grid-tapas", title: "Bento grid menu" },
    { type: "marquee", variant: "night-market-marquee", title: "Night market marquee" },
    { type: "wine", variant: "wine-pour-bottles", title: "Wine pour bottles" },
    { type: "about", variant: "chalkboard-story", title: "Chalkboard about" },
    { type: "contact", variant: "bar-tab-form", title: "Bar-tab contact" },
    { type: "footer", variant: "neon-flicker", title: "Neon flicker footer" },
  ].map((b, i) => ({ id: `tapasora-${i+1}-${b.type}`, ...b })),
  pages: tapasoraPages,
  editor: { pages: tapasoraPages, css: tapasoraEditorCss },
  css: tapasoraEditorCss, data: tapasoraDefaultData, defaultData: tapasoraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const tapasoraTemplate = {
  id: "tapasora", key: "tapasora", name: "Tapasora", title: "Tapasora", author: "Bizuply", priceLabel: "כלול",
  category: "food", categoryLabel: "אוכל ומסעדות", badge: "חדש",
  description: "תבנית בר טאפס לילי: הירו עם צלחות קטנות עולות במפל, רשת בנטו, מארקי שוק לילה, בקבוקי יין עם אנימציית מזיגה וטופס כחשבון בר — ניאון וריצוד.",
  thumbnail: React.createElement(TapasoraThumbnail),
  preview: React.createElement(TapasoraPreview),
  component: TapasoraPages, Component: TapasoraPages,
  seed: tapasoraSeed, pages: tapasoraPages, editorCss: tapasoraEditorCss, schema: tapasoraSchema, defaultData: tapasoraDefaultData,
  renderer: {
    key: "tapasora", name: "Tapasora", Component: TapasoraPages, component: TapasoraPages, pages: tapasoraPages,
    editorMode: "visual-react", editorCss: tapasoraEditorCss, schema: tapasoraSchema, defaultData: tapasoraDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default tapasoraTemplate;
