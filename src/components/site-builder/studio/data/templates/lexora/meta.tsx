import React from "react";

import type {
  ReadyWebsiteBlock,
  ReadyWebsitePalette,
  ReadyWebsiteTemplateSeed,
} from "../../readyWebsiteTypes";

import type { StudioTemplateDefinition } from "../types";

import LexoraPreview from "./preview";
import LexoraThumbnail from "./thumbnail";
import { lexoraEditorCss } from "./editorCss";

type TemplateBlockInput = Omit<ReadyWebsiteBlock, "id">;

const lexoraPreviewImage =
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=90";

const palette: ReadyWebsitePalette = {
  primary: "#18231F",
  secondary: "#304038",
  accent: "#A77D48",
  background: "#EDE7DC",
  surface: "#FBF7EE",
  text: "#18231F",
  muted: "#59645E",
  dark: "#101815",
};

const blocks = [
  { type: "header", variant: "lexora-header-rtl", title: "Header" },
  { type: "hero", variant: "lexora-hero-rtl", title: "Hero" },
  { type: "services", variant: "lexora-services-rtl", title: "Services" },
  { type: "collection", variant: "lexora-cases-rtl", title: "Cases" },
  { type: "services", variant: "lexora-process-rtl", title: "Process" },
  { type: "contact", variant: "lexora-consultation-rtl", title: "Consultation" },
  { type: "footer", variant: "lexora-footer-rtl", title: "Footer" },
] as unknown as TemplateBlockInput[];

function withBlockIds(
  templateId: string,
  inputBlocks: TemplateBlockInput[],
): ReadyWebsiteBlock[] {
  return inputBlocks.map((block, index) => ({
    ...block,
    id: `${templateId}-${index + 1}`,
  }));
}

export const lexoraTemplateSeed = {
  id: "lexora",
  key: "lexora",
  rendererKey: "lexora",
  renderMode: "registry",
  editorMode: "renderer",

  name: "Lexora",
  category: "business",
  description:
    "תבנית יוקרתית בעברית למשרד עורכי דין, שירותים משפטיים, תיקים, תהליך עבודה וטופס ייעוץ.",
  niche: "משרד עורכי דין",
  layout: "rtlLawFirmLuxury",
  image: lexoraPreviewImage,
  heroTitle: "סטנדרט גבוה יותר לליווי משפטי",
  heroSubtitle:
    "משרד עורכי דין מודרני המשלב חשיבה עסקית, דיוק משפטי וליווי אישי.",
  palette,
  blocks: withBlockIds("lexora", blocks),

  css: lexoraEditorCss,
  editorCss: lexoraEditorCss,

  editor: {
    css: lexoraEditorCss,
    pages: [],
  },
} as unknown as ReadyWebsiteTemplateSeed;

export const lexoraTemplate = {
  id: "lexora",
  name: "Lexora",
  author: "BizUply",
  category: "business",
  categoryLabel: "עסקים",
  priceLabel: "פרימיום",
  badge: "NEW",
  description:
    "תבנית יוקרתית ומודרנית בעברית למשרד עורכי דין, עם פתיח גדול, שירותים, תיקים, תהליך וטופס ייעוץ.",
  previewImage: lexoraPreviewImage,

  css: lexoraEditorCss,
  editorCss: lexoraEditorCss,

  thumbnail: React.createElement(LexoraThumbnail),
  preview: React.createElement(LexoraPreview),

  seed: lexoraTemplateSeed,
} as unknown as StudioTemplateDefinition;