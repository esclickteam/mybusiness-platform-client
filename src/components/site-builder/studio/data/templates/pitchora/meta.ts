import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import PitchoraPages, { pitchoraPages } from "./pages";
import PitchoraPreview from "./preview";
import PitchoraThumbnail from "./thumbnail";
import { pitchoraEditorCss } from "./editorCss";
import { pitchoraSchema } from "./schema";
import { pitchoraDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#FFB703",
  secondary: "#02040A",
  accent: "#FB8500",
  background: "#05070F",
  surface: "#101522",
  text: "#F8FAFC",
  muted: "#B7C2D6",
  dark: "#02040A",
};

export const pitchoraSeed = {
  id: "pitchora",
  key: "pitchora",
  name: "Pitchora",
  title: "Pitchora",
  description: "אתר מלא לסוכנות פיץ' ויחסי משקיעים: 8 עמודים, תנועה, אפקטים ועיצוב dark pitch-deck slides.",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  niche: "startup-pitch-investor-relations",
  layout: "full-agency",
  image: (pitchoraDefaultData as Record<string, any>).heroImage,
  heroTitle: (pitchoraDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (pitchoraDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "pitchora-header", title: "Header" },
    { type: "hero", variant: "pitchora-hero", title: "Hero" },
    { type: "about", variant: "pitchora-about", title: "About" },
    { type: "services", variant: "pitchora-services", title: "Services" },
    { type: "cases", variant: "pitchora-cases", title: "Cases" },
    { type: "team", variant: "pitchora-team", title: "Team" },
    { type: "gallery", variant: "pitchora-gallery", title: "Gallery" },
    { type: "contact", variant: "pitchora-contact", title: "Contact" },
    { type: "footer", variant: "pitchora-footer", title: "Footer" },
  ].map((block, index) => ({ id: `pitchora-${index + 1}-${block.type}`, ...block })),
  pages: pitchoraPages,
  editor: { pages: pitchoraPages, css: pitchoraEditorCss },
  css: pitchoraEditorCss,
  data: pitchoraDefaultData,
  defaultData: pitchoraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const pitchoraTemplate = {
  id: "pitchora",
  key: "pitchora",
  name: "Pitchora",
  title: "Pitchora",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  badge: "חדש",
  description: "אתר מלא לסוכנות פיץ' ויחסי משקיעים עם 8 עמודים, תנועה ואפקטים — dark pitch-deck slides.",
  thumbnail: React.createElement(PitchoraThumbnail),
  preview: React.createElement(PitchoraPreview),
  component: PitchoraPages,
  Component: PitchoraPages,
  seed: pitchoraSeed,
  pages: pitchoraPages,
  editorCss: pitchoraEditorCss,
  schema: pitchoraSchema,
  defaultData: pitchoraDefaultData,
  renderer: {
    key: "pitchora",
    name: "Pitchora",
    Component: PitchoraPages,
    component: PitchoraPages,
    pages: pitchoraPages,
    editorMode: "visual-react",
    editorCss: pitchoraEditorCss,
    schema: pitchoraSchema,
    defaultData: pitchoraDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default pitchoraTemplate;
