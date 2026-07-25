import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import LobbyhausPages, { lobbyhausPages } from "./pages";
import LobbyhausPreview from "./preview";
import LobbyhausThumbnail from "./thumbnail";
import { lobbyhausEditorCss } from "./editorCss";
import { lobbyhausSchema } from "./schema";
import { lobbyhausDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#1E3A8A",
  secondary: "#0B1736",
  accent: "#B45309",
  background: "#F8FAFC",
  surface: "#FFFFFF",
  text: "#111827",
  muted: "#475569",
  dark: "#0B1736",
};

export const lobbyhausSeed = {
  id: "lobbyhaus",
  key: "lobbyhaus",
  name: "Lobbyhaus",
  title: "Lobbyhaus",
  description: "אתר מלא לסוכנות ממשל ולובינג: 8 עמודים, תנועה, אפקטים ועיצוב institutional formal.",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  niche: "public-affairs-lobbying",
  layout: "full-agency",
  image: (lobbyhausDefaultData as Record<string, any>).heroImage,
  heroTitle: (lobbyhausDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (lobbyhausDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "lobbyhaus-header", title: "Header" },
    { type: "hero", variant: "lobbyhaus-hero", title: "Hero" },
    { type: "about", variant: "lobbyhaus-about", title: "About" },
    { type: "services", variant: "lobbyhaus-services", title: "Services" },
    { type: "cases", variant: "lobbyhaus-cases", title: "Cases" },
    { type: "team", variant: "lobbyhaus-team", title: "Team" },
    { type: "gallery", variant: "lobbyhaus-gallery", title: "Gallery" },
    { type: "contact", variant: "lobbyhaus-contact", title: "Contact" },
    { type: "footer", variant: "lobbyhaus-footer", title: "Footer" },
  ].map((block, index) => ({ id: `lobbyhaus-${index + 1}-${block.type}`, ...block })),
  pages: lobbyhausPages,
  editor: { pages: lobbyhausPages, css: lobbyhausEditorCss },
  css: lobbyhausEditorCss,
  data: lobbyhausDefaultData,
  defaultData: lobbyhausDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const lobbyhausTemplate = {
  id: "lobbyhaus",
  key: "lobbyhaus",
  name: "Lobbyhaus",
  title: "Lobbyhaus",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  badge: "חדש",
  description: "אתר מלא לסוכנות ממשל ולובינג עם 8 עמודים, תנועה ואפקטים — institutional formal.",
  thumbnail: React.createElement(LobbyhausThumbnail),
  preview: React.createElement(LobbyhausPreview),
  component: LobbyhausPages,
  Component: LobbyhausPages,
  seed: lobbyhausSeed,
  pages: lobbyhausPages,
  editorCss: lobbyhausEditorCss,
  schema: lobbyhausSchema,
  defaultData: lobbyhausDefaultData,
  renderer: {
    key: "lobbyhaus",
    name: "Lobbyhaus",
    Component: LobbyhausPages,
    component: LobbyhausPages,
    pages: lobbyhausPages,
    editorMode: "visual-react",
    editorCss: lobbyhausEditorCss,
    schema: lobbyhausSchema,
    defaultData: lobbyhausDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default lobbyhausTemplate;
