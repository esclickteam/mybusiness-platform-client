import React from "react";

import type {
  ReadyWebsiteBlock,
  ReadyWebsitePalette,
  ReadyWebsiteTemplateSeed,
} from "../../readyWebsiteTypes";

import type { StudioTemplateDefinition } from "../types";

import WantravelPreview from "./preview";
import WantravelThumbnail from "./thumbnail";
import { wantravelEditorCss } from "./editorCss";

type TemplateBlockInput = Omit<ReadyWebsiteBlock, "id">;

const wantravelPreviewImage =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=90";

const palette: ReadyWebsitePalette = {
  primary: "#18392F",
  secondary: "#2D5A49",
  accent: "#B6772F",
  background: "#F7F1E7",
  surface: "#FFF8EF",
  text: "#1F2A24",
  muted: "#6B786F",
  dark: "#10211B",
};

const blocks: TemplateBlockInput[] = [
  { type: "header", variant: "wantravel-header-rtl", title: "Header" },
  { type: "hero", variant: "wantravel-hero-rtl", title: "Hero" },
  { type: "collection", variant: "wantravel-destinations-rtl", title: "Destinations" },
  { type: "packages", variant: "wantravel-packages-rtl", title: "Packages" },
  { type: "process", variant: "wantravel-process-rtl", title: "Process" },
  { type: "testimonials", variant: "wantravel-reviews-rtl", title: "Reviews" },
  { type: "contact", variant: "wantravel-booking-rtl", title: "Booking" },
  { type: "footer", variant: "wantravel-footer-rtl", title: "Footer" },
];

function withBlockIds(
  templateId: string,
  inputBlocks: TemplateBlockInput[],
): ReadyWebsiteBlock[] {
  return inputBlocks.map((block, index) => ({
    ...block,
    id: `${templateId}-${index + 1}`,
  }));
}

export const wantravelTemplateSeed = {
  id: "wantravel",
  key: "wantravel",
  rendererKey: "wantravel",
  renderMode: "registry",
  editorMode: "renderer",

  name: "Wantravel",
  category: "business",
  description:
    "תבנית יוקרתית בעברית לסוכנות נסיעות, חופשות בהתאמה אישית, יעדים, חבילות וטופס לידים.",
  niche: "סוכנות נסיעות",
  layout: "rtlTravelLuxury",
  image: wantravelPreviewImage,
  heroTitle: "חופשה שמרגישה כאילו נתפרה רק בשבילך",
  heroSubtitle:
    "תכנון נסיעות יוקרתי, חכם ומדויק — מטיסות ומלונות ועד מסלולים, חוויות וליווי אישי.",
  palette,
  blocks: withBlockIds("wantravel", blocks),

  css: wantravelEditorCss,
  editorCss: wantravelEditorCss,

  editor: {
    css: wantravelEditorCss,
    pages: [],
  },
} as unknown as ReadyWebsiteTemplateSeed;

export const wantravelTemplate = {
  id: "wantravel",
  name: "Wantravel",
  author: "BizUply",
  category: "business",
  categoryLabel: "עסקים",
  priceLabel: "פרימיום",
  badge: "NEW",
  description:
    "תבנית יוקרתית ומודרנית לסוכנות נסיעות בעברית, עם הירו גדול, יעדים, חבילות, המלצות וטופס יצירת קשר.",
  previewImage: wantravelPreviewImage,

  css: wantravelEditorCss,
  editorCss: wantravelEditorCss,

  thumbnail: React.createElement(WantravelThumbnail),
  preview: React.createElement(WantravelPreview),

  seed: wantravelTemplateSeed,
} as unknown as StudioTemplateDefinition;