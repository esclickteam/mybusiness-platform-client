import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import PokelinePages, { pokelinePages } from "./pages";
import PokelinePreview from "./preview";
import PokelineThumbnail from "./thumbnail";
import { pokelineEditorCss } from "./editorCss";
import { pokelineSchema } from "./schema";
import { pokelineDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#2dd4bf", secondary: "#7eb8b4", accent: "#2dd4bf",
  background: "#071a1f", surface: "#0d262c", text: "#e8f7f6", muted: "#7eb8b4", dark: "#031014",
};

export const pokelineSeed = {
  id: "pokeline", key: "pokeline", name: "Pokeline", title: "Pokeline",
  description: "תבנית פוקה: קערות במסלול עיגול, מרכיבים צבעוניים וטופס הזמנה קליל — רעננות פסיפית.",
  category: "food", categoryLabel: "אוכל ומסעדות", niche: "פוקה · קערות", layout: "full",
  image: (pokelineDefaultData as any).heroImage,
  heroTitle: (pokelineDefaultData as any).heroTitle,
  heroSubtitle: (pokelineDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "orbit-thin-nav", title: "Orbit thin nav" },
    { type: "hero", variant: "bowl-orbit-hero", title: "Bowl orbit hero" },
    { type: "menu", variant: "orbit-bowl-map", title: "Orbit bowl map" },
    { type: "process", variant: "poke-process", title: "Poke process" },
    { type: "gallery", variant: "poke-gallery", title: "Poke gallery" },
    { type: "reviews", variant: "poke-reviews", title: "Poke reviews" },
    { type: "stats", variant: "bowl-stats", title: "Bowl stats + hours" },
    { type: "cta", variant: "poke-home-cta", title: "Home CTA teaser" },
    { type: "bowlsPage", variant: "full-bowl-menu", title: "Full bowl menu page" },
    { type: "buildPage", variant: "build-story", title: "Build story page" },
    { type: "about", variant: "pacific-timeline", title: "Pacific timeline" },
    { type: "contact", variant: "circle-reserve-faq", title: "Circle reserve + FAQ" },
    { type: "footer", variant: "orbit-ring", title: "Orbit ring footer" },
  ].map((b, i) => ({ id: `pokeline-${i+1}-${b.type}`, ...b })),
  pages: pokelinePages,
  editor: { pages: pokelinePages, css: pokelineEditorCss },
  css: pokelineEditorCss, data: pokelineDefaultData, defaultData: pokelineDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const pokelineTemplate = {
  id: "pokeline", key: "pokeline", name: "Pokeline", title: "Pokeline", author: "Bizuply", priceLabel: "כלול",
  category: "food", categoryLabel: "אוכל ומסעדות", badge: "חדש",
  description: "תבנית פוקה: קערות במסלול עיגול, מרכיבים צבעוניים וטופס הזמנה קליל — רעננות פסיפית.",
  thumbnail: React.createElement(PokelineThumbnail),
  preview: React.createElement(PokelinePreview),
  component: PokelinePages, Component: PokelinePages,
  seed: pokelineSeed, pages: pokelinePages, editorCss: pokelineEditorCss, schema: pokelineSchema, defaultData: pokelineDefaultData,
  renderer: {
    key: "pokeline", name: "Pokeline", Component: PokelinePages, component: PokelinePages, pages: pokelinePages,
    editorMode: "visual-react", editorCss: pokelineEditorCss, schema: pokelineSchema, defaultData: pokelineDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default pokelineTemplate;
