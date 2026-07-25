import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import PodcastixPages, { podcastixPages } from "./pages";
import PodcastixPreview from "./preview";
import PodcastixThumbnail from "./thumbnail";
import { podcastixEditorCss } from "./editorCss";
import { podcastixSchema } from "./schema";
import { podcastixDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#8B5CF6",
  secondary: "#070313",
  accent: "#22D3EE",
  background: "#0F0A1F",
  surface: "#1D1235",
  text: "#F5F3FF",
  muted: "#C4B5FD",
  dark: "#070313",
};

export const podcastixSeed = {
  id: "podcastix",
  key: "podcastix",
  name: "Podcastix",
  title: "Podcastix",
  description: "אתר מלא לסוכנות פודקאסט ואודיו: 8 עמודים, תנועה, אפקטים ועיצוב waveform mic.",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  niche: "podcast-audio-agency",
  layout: "full-agency",
  image: (podcastixDefaultData as Record<string, any>).heroImage,
  heroTitle: (podcastixDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (podcastixDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "podcastix-header", title: "Header" },
    { type: "hero", variant: "podcastix-hero", title: "Hero" },
    { type: "about", variant: "podcastix-about", title: "About" },
    { type: "services", variant: "podcastix-services", title: "Services" },
    { type: "cases", variant: "podcastix-cases", title: "Cases" },
    { type: "team", variant: "podcastix-team", title: "Team" },
    { type: "gallery", variant: "podcastix-gallery", title: "Gallery" },
    { type: "contact", variant: "podcastix-contact", title: "Contact" },
    { type: "footer", variant: "podcastix-footer", title: "Footer" },
  ].map((block, index) => ({ id: `podcastix-${index + 1}-${block.type}`, ...block })),
  pages: podcastixPages,
  editor: { pages: podcastixPages, css: podcastixEditorCss },
  css: podcastixEditorCss,
  data: podcastixDefaultData,
  defaultData: podcastixDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const podcastixTemplate = {
  id: "podcastix",
  key: "podcastix",
  name: "Podcastix",
  title: "Podcastix",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  badge: "חדש",
  description: "אתר מלא לסוכנות פודקאסט ואודיו עם 8 עמודים, תנועה ואפקטים — waveform mic.",
  thumbnail: React.createElement(PodcastixThumbnail),
  preview: React.createElement(PodcastixPreview),
  component: PodcastixPages,
  Component: PodcastixPages,
  seed: podcastixSeed,
  pages: podcastixPages,
  editorCss: podcastixEditorCss,
  schema: podcastixSchema,
  defaultData: podcastixDefaultData,
  renderer: {
    key: "podcastix",
    name: "Podcastix",
    Component: PodcastixPages,
    component: PodcastixPages,
    pages: podcastixPages,
    editorMode: "visual-react",
    editorCss: podcastixEditorCss,
    schema: podcastixSchema,
    defaultData: podcastixDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default podcastixTemplate;
