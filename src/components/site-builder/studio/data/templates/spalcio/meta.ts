import React from "react";

import type {
  ReadyWebsiteBlock,
  ReadyWebsitePalette,
  ReadyWebsiteTemplateSeed,
} from "../../readyWebsiteTypes";

import type { StudioTemplateDefinition } from "../types";

import SpalcioThumbnail from "./thumbnail";
import SpalcioPreview from "./preview";

import spalcioEditorCss from "./spalcioEditorCss";
import { spalcioPages, spalcioSections } from "./spalcioData";

type TemplateBlockInput = Omit<ReadyWebsiteBlock, "id">;

type SpalcioTemplateDefinition = StudioTemplateDefinition & {
  pages: typeof spalcioPages;
  sections: typeof spalcioSections;
  editorCss: string;
};

const palette: ReadyWebsitePalette = {
  primary: "#111827",
  secondary: "#374151",
  accent: "#2563EB",
  background: "#F8FAFC",
  surface: "#FFFFFF",
  text: "#111827",
  muted: "#6B7280",
  dark: "#030712",
};

const blocks: TemplateBlockInput[] = [
  {
    type: "header",
    variant: "minimal",
    title: "כותרת עליונה",
  },
  {
    type: "hero",
    variant: "editorial-minimal",
    title: "אזור פתיחה",
  },
  {
    type: "about",
    variant: "split-story",
    title: "אודות",
  },
  {
    type: "services",
    variant: "cards",
    title: "שירותים",
    items: ["אסטרטגיה עסקית", "ייעוץ מקצועי", "ניהול פרויקטים"],
  },
  {
    type: "projects",
    variant: "case-grid",
    title: "פרויקטים",
  },
  {
    type: "process",
    variant: "timeline",
    title: "תהליך עבודה",
  },
  {
    type: "reviews",
    variant: "cards",
    title: "המלצות",
  },
  {
    type: "contact",
    variant: "map",
    title: "יצירת קשר",
  },
  {
    type: "footer",
    variant: "minimal",
    title: "פוטר",
  },
];

function withBlockIds(
  templateId: string,
  inputBlocks: TemplateBlockInput[]
): ReadyWebsiteBlock[] {
  return inputBlocks.map((block, index) => ({
    ...block,
    id: `${templateId}-${index + 1}`,
  }));
}

const seed: ReadyWebsiteTemplateSeed = {
  id: "spalcio",
  name: "Spalcio",
  category: "business",
  description:
    "תבנית אתר עסקי נקייה, מקצועית ומודרנית לסוכנויות, יועצים, נותני שירותים ועסקים שרוצים נוכחות יוקרתית וברורה.",
  niche: "Business",
  layout: "cleanEditorialGrid",
  image:
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
  palette,
  heroTitle: "אתר עסקי נקי, חד ומקצועי",
  heroSubtitle:
    "תבנית פרימיום לעסקים שרוצים להציג שירותים, פרויקטים, תהליך עבודה ויצירת קשר בצורה ברורה ומרשימה.",
  blocks: withBlockIds("spalcio", blocks),
};

export const spalcioTemplate: SpalcioTemplateDefinition = {
  id: "spalcio",
  name: "Spalcio",
  author: "BizUply",
  priceLabel: "Included",
  category: "business",
  categoryLabel: "עסקים ושירותים",
  badge: "חדש",
  description:
    "תבנית עסקית נקייה עם הירו, שירותים, פרויקטים, תהליך עבודה, המלצות ויצירת קשר.",
  previewImage:
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",

  thumbnail: React.createElement(SpalcioThumbnail),
  preview: React.createElement(SpalcioPreview),

  pages: spalcioPages,
  sections: spalcioSections,
  editorCss: spalcioEditorCss,

  seed,
};